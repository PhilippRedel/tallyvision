const cookieParser = require('cookie-parser');
const createError = require('http-errors');
const express = require('express');
const logger = require('morgan');
const path = require('path');
const sqlite3 = require('sqlite3');

// database
const db = new sqlite3.Database(dbFilename(), (err) => {
  if (err) {
    console.log('[DB] Error creating database:', err);
  } else {
    dbCreateTables();
  }
});

// routers
const router = require('./routes/api');

// server
const app = express();
const server = require('http').createServer(app);

// socket.io 
const io = require('socket.io')(server, {
  cors: {
    origin: 'http://localhost:3000',
    methods: ['GET', 'POST'],
  }
});
const ioAwards = io.of('/awards');
const ioClient = io.of('/client');
const ioHost = io.of('/host');

app.use('/', router);
app.use(cookieParser());
app.use(express.json());
app.use(express.static(path.join(__dirname, 'public')));
app.use(express.urlencoded({ extended: false }));
app.use(logger('dev'));

// catch 404 and forward to error handler
app.use((req, res, next) => {
  next(createError(404));
});

// error handler
app.use((err, req, res, next) => {
  res.locals.status = err.status || 500;

  res.send({
    status: res.locals.status,
    message: err.message,
  }).status(res.locals.status);
});

// app data
const appCategories = require('./data/categories');
const appContestants = require('./data/contestants/2022');
const appVersion = process.env.npm_package_version;

// app variables
var appBallot = appBallotDefault();
var appClients = [];
var appHostPin = appHostPinGenerate();

ioClient.use((socket, next) => {
  var auth = socket.handshake.auth;

  if (auth.name) {
    socket.name = auth.name.toLowerCase();
    
    next();
  } else {
    next(new Error('name not found'));
  }
});

ioAwards.on('connection', (socket) => {
  ioAwards.emit('appConnected', {
    categories: appCategories,
    db: dbFilename(),
    version: appVersion,
  }, () => {
    console.log('[IO] Awards connected:', socket.id);
  });
});

ioClient.on('connection', (socket) => {
  ioClientConnect(socket);

  socket.on('clientBallotSubmit', (scores) => {
    dbInsertVote(socket, scores);

    console.log('[IO] Client submitted ballot:', [socket.name, scores]);
  });

  socket.on('clientGNBB', () => {
    dbInsertGNBP(socket);

    console.log('[IO] Client clicked GNBB:', socket.name);
  });

  socket.on('disconnect', (reason) => {
    appClientFind(socket).then((client) => {
      client.connected = socket.connected;

      console.log('[IO] Client disconnected:', [socket.name, reason]);
    }).then(() => {
      ioHostClients();
    });
  });
});

ioHost.use((socket, next) => {
  var auth = socket.handshake.auth;

  if (auth.pin === appHostPin) {  
    console.log('AUTH');

    next();
  } else {
    next(new Error('incorrect host pin'));
  }
});

ioHost.on('connection', (socket) => {
  ioHostConnect(socket);

  socket.on('hostAwardsCalculate', () => {
    ioAwardsCategory();
    ioAwardsGNBP();
    ioAwardsTotal();
  });

  socket.on('hostBallotClose', () => {
    if (appBallot.open) {
      appBallot = appBallotDefault();

      appClients.map((client) => { 
        client.voted = false;
      });

      ioClientBallot();
      ioHostBallot();
      ioHostClients();

      console.log('[IO] Host closed ballot');
    } else {
      console.log('[IO] Error ballot not open');
    }
  });

  socket.on('hostBallotOpen', (key) => {
    appContestantFind(key).then((contestant) => {
      appBallot.contestant = contestant;
      appBallot.open = true;

      console.log('[IO] Host opened ballot:', appBallot.contestant);
    }, () => {
      console.log('[IO] Error contestant not found');
    }).then(async () => {
      for (var client of appClients) {        
        await dbQueryClient(client, appBallot.contestant).then((rows) => {
          client.voted = rows.length > 0;
        });
      }

      ioClientBallot();
      ioHostBallot();
      ioHostClients();
    });
  });
});

// initialize app
function __initialize() {
  console.log('[TV] Version:', appVersion);
  console.log('[TV] Host access pin:', appHostPin);
}

// set default ballot values
function appBallotDefault() {
  return {
    contestant: {},
    open: false,
  };
}

// find registered client
function appClientFind(socket) {
  var found = appClients.find((client) => {
    return client.name === socket.name;
  });

  return new Promise((resolve, reject) => {
    if (found) {
      resolve(found);
    } else {
      reject();
    }
  });
}

// find contestant
function appContestantFind(key) {
  var found = appContestants.find((contestant) => {
    return contestant.key === key;
  });

  return new Promise((resolve, reject) => {
    if (found) {
      resolve(found);
    } else {
      reject();
    }
  });
}

// generate host pin
function appHostPinGenerate() {
  return Math.floor(1000 + Math.random() * 9000);
}

// set score table data from two arrays
function appScoreTable(arr1, arr2, key1, key2) {
  for (var obj1 of arr1) {
    var found = arr2.find((obj2) => {
      return obj2[key2] === obj1[key1];
    });

    if (found) {
      obj1 = Object.assign(obj1, found);
    }
  }

  return arr1;
}

// create database tables
function dbCreateTables() {
  var columns, gnbp, votes;

  // gnbp table
  gnbp  = `CREATE TABLE IF NOT EXISTS gnbp (`;
  gnbp += `uid INTEGER PRIMARY KEY AUTOINCREMENT,`;
  gnbp += `client_name TEXT NOT NULL,`;
  gnbp += `contestant_key TEXT NOT NULL);`;

  db.run(gnbp, (err) => {
    if (err) {
      console.log('[DB] Error creating table:', err);
    } else {
      console.log('[DB] Table created: gnbp');
    }
  });

  // votes table
  columns = appCategories.map((category) => {
    return `cat_${category.key} INTEGER NOT NULL`;
  }).join(`,`);

  votes  = `CREATE TABLE IF NOT EXISTS votes (`;
  votes += `uid INTEGER PRIMARY KEY AUTOINCREMENT,`;
  votes += `client_name TEXT NOT NULL,`;
  votes += `contestant_key TEXT NOT NULL,`;
  votes += `${columns},`
  votes += `total INTEGER NOT NULL);`;

  db.run(votes, (err) => {
    if (err) {
      console.log('[DB] Error creating table:', err);
    } else {
      console.log('[DB] Table created: votes');
    }
  });
}

// set database filename
function dbFilename() {
  return `${new Date().toISOString().substring(0, 10)}.db`;
}

// insert Graham Norton bitch point record for client and contestant
function dbInsertGNBP(socket) {
  var query = `INSERT INTO gnbp (client_name,contestant_key) VALUES (?,?)`;
  var values = [socket.name, appBallot.contestant.key];

  dbPromiseRun(query, values).then(() => {
    socket.emit('appGNBP', values);

    console.log('[DB] Client GNBP tallied:', values);
  });
}

// insert vote record for client and contestant
function dbInsertVote(socket, scores) {
  var cat_columns, cat_placeholders, query, total = 0, values;

  // todo: add check to see if client already submitted ballot

  cat_columns = appCategories.map((category) => {
    return `cat_${category.key}`;
  }).join(`,`);

  cat_placeholders = appCategories.map(() => {
    return `?`;
  }).join(`,`);

  query  = `INSERT INTO votes (`;
  query += `client_name,`;
  query += `contestant_key,`;
  query += `${cat_columns},`;
  query += `total) VALUES (?,?,${cat_placeholders},?);`;

  values = [socket.name, appBallot.contestant.key];
  values = values.concat(Object.values(scores));

  for (var cat_key in scores) {
    total += scores[cat_key];
  }

  values.push(total);

  dbPromiseRun(query, values).then(() => {
    appClientFind(socket).then((client) => {
      client.voted = true;
    });

    dbQueryClient(socket, appBallot.contestant).then((rows) => {
      if (rows.length > 0) {
        socket.emit('appBallotScore', rows[0]);
      }
    });

    console.log('[DB] Client ballot tallied:', values);
  }).then(() => {
    ioClientScores(socket);
  }).then(() => {
    ioHostClients();
    ioHostScores();
  });
}

// promise wrapper for database "all" queries
function dbPromiseAll(query, params) {
  return new Promise((resolve, reject) => {
    db.all(query, params, (error, rows) => {
      if (error) {
        reject(error);

        console.log('[DB] Error performing all query:', error);
      } else {
        resolve(rows);
      }
    });
  });
}

// promise wrapper for database "run" queries
function dbPromiseRun(query, params) {
  return new Promise((resolve, reject) => {
    db.run(query, params, (error) => {
      if (error) {
        reject(error);
        
        console.log('[DB] Error performing run query:', error);
      } else {
        resolve();
      }
    });
  });
}

// get category score data for all contestants 
function dbQueryCategory(category) {
  var query;
  
  query  = `SELECT contestant_key,`;
  query += `COUNT(client_name) votes,`;
  query += `SUM(cat_${category.key}) score FROM votes GROUP BY contestant_key ORDER BY score DESC;`;

  return dbPromiseAll(query);
}

// get score data for client
function dbQueryClient(socket, contestant = undefined) {
  var params, query;
  
  query = `SELECT * FROM votes WHERE client_name=?`;

  if (contestant) {
    params = [socket.name, contestant.key];
    query += ` AND contestant_key=?`;
  } else {
    params = socket.name;
  }

  return dbPromiseAll(query, params);
}

// get Graham Norton bitch points for all contestants
function dbQueryGNBP() {
  var query;
  
  query  = `SELECT contestant_key,`;
  query += `COUNT(client_name) score FROM gnbp GROUP BY contestant_key ORDER BY score DESC;`;

  return dbPromiseAll(query);
}

// get total score data for all contestants
function dbQueryTotal() {
  var cat_columns, query;

  cat_columns = appCategories.map((category) => {
    return `SUM(cat_${category.key}) cat_${category.key}`;
  }).join(`,`);
  
  query  = `SELECT contestant_key,`;
  query += `COUNT(client_name) votes,`;
  query += `${cat_columns},`;
  query += `SUM(total) total FROM votes GROUP BY contestant_key ORDER BY total DESC;`;

  return dbPromiseAll(query);
}

// send calculated category awards to host
async function ioAwardsCategory() {
  var scores = {};

  for (var category of appCategories) {
    await dbQueryCategory(category).then((rows) => {
      scores[category.key] = appScoreTable(rows.slice(0, 3), appContestants, 'contestant_key', 'key');
    });
  }

  ioAwards.emit('appAwardsCategory', scores);
}

// send calculated GNBP awards to host
function ioAwardsGNBP() {
  dbQueryGNBP().then((rows) => {
    ioAwards.emit('appAwardsGNBP', appScoreTable(rows.slice(0, 3), appContestants, 'contestant_key', 'key'));
  });
}

// send calculated total awards to host
async function ioAwardsTotal() {
  dbQueryTotal().then((rows) => {
    ioAwards.emit('appAwardsTotal', appScoreTable(rows, appContestants, 'contestant_key', 'key'));
  });
}

// send ballot data to client(s)
function ioClientBallot(socket = undefined) {
  if (socket) {
    socket.emit('appBallot', appBallot);

    dbQueryClient(socket, appBallot.contestant).then((rows) => {
      if (rows.length > 0) {
        socket.emit('appBallotScore', rows[0]);
      } else {
        socket.emit('appBallotScore', {});
      }
    });
  } else {
    ioClient.emit('appBallot', appBallot);

    for (var [id, socket] of ioClient.sockets) {        
      dbQueryClient(socket, appBallot.contestant).then((rows) => {
        if (rows.length > 0) {
          socket.emit('appBallotScore', rows[0]);
        } else {
          socket.emit('appBallotScore', {});
        }
      });
    }
  }
}

// update list of clients and emit connection events
function ioClientConnect(socket) {
  appClientFind(socket).then((client) => {
    client.connected = socket.connected;
    client.voted = false;

    return client;
  }, () => {
    var client = {
      connected: socket.connected,
      name: socket.name,
      voted: false,
    };

    appClients.push(client);
    appClients.sort((a, b) => {
      return (a.name > b.name) ? 1 : -1;
    });

    return client;
  }).then(async (client) => {
    if (appBallot.open) {
      await dbQueryClient(socket, appBallot.contestant).then((rows) => {
        client.voted = rows.length > 0;
      });
    }

    socket.emit('appConnected', {
      categories: appCategories,
      name: client.name,
    });
    
    console.log('[IO] Client connected:', client);
  }).then(() => {
    ioClientBallot(socket);
    ioClientScores(socket);
  }).then(() => {
    ioHostClients();
  });
}

// send contestant scores to client
function ioClientScores(socket) {
  var contestants = JSON.parse(JSON.stringify(appContestants));

  dbQueryClient(socket).then((rows) => {
    return appScoreTable(contestants, rows, 'key', 'contestant_key');
  }).then((scores) => {
    socket.emit('appScores', scores);
  });
}

// send ballot data to host
function ioHostBallot() {
  ioHost.emit('appBallot', appBallot);
}

// send list of clients to host
function ioHostClients() {
  ioHost.emit('appClients', appClients);
}

// send host app data and emit connection events
function ioHostConnect(socket) {
  ioHost.emit('appConnected', {
    categories: appCategories,
    db: dbFilename(),
    version: appVersion,
  }, () => {
    console.log('[IO] Host connected:', socket.id);
  });

  ioHostBallot();
  ioHostClients();
  ioHostScores();
}

// send contestant scores to host
function ioHostScores() {
  var contestants = JSON.parse(JSON.stringify(appContestants));

  dbQueryTotal().then((rows) => {
    return appScoreTable(contestants, rows, 'key', 'contestant_key');
  }).then((scores) => {
    ioHost.emit('appScores', scores);
  });
}

__initialize();

module.exports = {
  app: app,
  server: server,
};
