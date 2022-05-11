const { createServer } = require('http');
const { Database } = require('sqlite3');
const { Server } = require('socket.io');
const cookieParser = require('cookie-parser');
const express = require('express');
const logger = require('morgan');
const path = require('path');

const app = express();
const httpServer = createServer(app);

app.use(cookieParser());
app.use(express.json());
app.use(express.static(path.join(__dirname, 'public')));
app.use(express.urlencoded({ extended: false }));
app.use(logger('dev'));

const apiRouter = require('./routes/api');
const publicRouter = require('./routes/public');

app.use('/', publicRouter);
app.use('/api', apiRouter);

const io = new Server(httpServer, {
  cors: {
    origin: '*',
  },
  pingInterval: 2500,
});
const awardsIO = io.of('/awards');
const clientIO = io.of('/client');
const hostIO = io.of('/host');

const db = new Database(dbSetFilename(), (err) => {
  if (err) {
    console.log('[DB] Error creating database:', err);
  } else {
    dbCreateTables();
  }
});

// data
const data = {
  categories: require('./data/categories'),
  contestants: require('./data/contestants/2022'),
  version: process.env.npm_package_version,
};

// variables
var ballot = appSetBallot();
var clients = [];
var hostPin = appSetHostPin();

awardsIO.on('connection', (socket) => {
  awardsIO.emit('appConnected', {
    categories: data.categories,
  }, () => {
    console.log('[IO] Awards connected:', socket.id);
  });
});

clientIO.use((socket, next) => {
  var auth = socket.handshake.auth;

  if (auth.name) {
    socket.name = auth.name.toLowerCase();
    
    next();
  } else {
    next(new Error('name not found'));
  }
});

clientIO.on('connection', (socket) => {
  clientConnection(socket);

  socket.on('clientBallotSubmit', (scores) => {
    dbInsertVote(socket, scores);

    console.log('[IO] Client submitted ballot:', [socket.name, scores]);
  });

  socket.on('clientGNBB', () => {
    dbInsertGNBP(socket);

    console.log('[IO] Client clicked GNBB:', socket.name);
  });

  socket.on('disconnect', (reason) => {
    appGetObject(clients, 'name', socket).then((client) => {
      client.connected = socket.connected;

      console.log('[IO] Client disconnected:', [socket.name, reason]);
    }).then(() => {
      hostClients();
    });
  });
});

hostIO.use((socket, next) => {
  var auth = socket.handshake.auth;

  if (auth.pin === hostPin) {  
    next();
  } else {
    next(new Error('pin incorrect'));
  }
});

hostIO.on('connection', (socket) => {
  hostConnection(socket);

  socket.on('hostAwardsCalculate', () => {
    awardsCategory();
    awardsGNBP();
    awardsTotal();
  });

  socket.on('hostBallotClose', () => {
    if (ballot.open) {
      ballot = appSetBallot();

      clients.map((client) => { 
        client.voted = false;
      });

      clientBallot();
      hostBallot();
      hostClients();

      console.log('[IO] Host closed ballot');
    } else {
      console.log('[IO] Error ballot not open');
    }
  });

  socket.on('hostBallotOpen', (contestant) => {
    appGetObject(data.contestants, 'key', contestant).then((contestant) => {
      ballot.contestant = contestant;
      ballot.open = true;

      console.log('[IO] Host opened ballot:', ballot.contestant);
    }, () => {
      console.log('[IO] Error contestant not found');
    }).then(async () => {
      for (var client of clients) {        
        await dbQueryClient(client, ballot.contestant).then((rows) => {
          client.voted = rows.length > 0;
        });
      }

      clientBallot();
      hostBallot();
      hostClients();
    });
  });
});

/**
 * initialize app
 */
function __initialize() {
  console.log('[TV] Version:', data.version);
  console.log('[TV] Host access pin:', hostPin);
}

/**
 * get object with key from array
 */
 function appGetObject(arr, key, obj1) {
  var found = arr.find((obj2) => {
    return obj2[key] === obj1[key];
  });

  return new Promise((resolve, reject) => {
    if (found) {
      resolve(found);
    } else {
      reject();
    }
  });
}

/**
 * get formatted score data
 */
 function appGetScores(arr1, arr2, key1, key2) {
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

/**
 * set default ballot data
 */
function appSetBallot() {
  return { contestant: {}, open: false };
}

/**
 * set host access pin
 */
 function appSetHostPin() {
  return Math.floor(Math.random() * 9000 + 1000);
}

/**
 * get client data from socket
 */
function clientFind(socket) {
  var found = clients.find((client) => {
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

/**
 * get contestant data from key
 */
function contestantFind(key) {
  var found = data.contestants.find((contestant) => {
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

/**
 * create database tables
 */
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
  columns = data.categories.map((category) => {
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

/**
 * insert Graham Norton bitch point record
 */
function dbInsertGNBP(socket) {
  var query = `INSERT INTO gnbp (client_name,contestant_key) VALUES (?,?)`;
  var values = [socket.name, ballot.contestant.key];

  dbWrapperRun(query, values).then(() => {
    socket.emit('appGNBP', values);

    console.log('[DB] Client GNBP tallied:', values);
  });
}

/**
 * insert vote record
 */
function dbInsertVote(socket, scores) {
  var cat_columns, cat_placeholders, query, total = 0, values;

  // todo: add check to see if client already submitted ballot

  cat_columns = data.categories.map((category) => {
    return `cat_${category.key}`;
  }).join(`,`);

  cat_placeholders = data.categories.map(() => {
    return `?`;
  }).join(`,`);

  query  = `INSERT INTO votes (`;
  query += `client_name,`;
  query += `contestant_key,`;
  query += `${cat_columns},`;
  query += `total) VALUES (?,?,${cat_placeholders},?);`;

  values = [socket.name, ballot.contestant.key];
  values = values.concat(Object.values(scores));

  for (var cat_key in scores) {
    total += scores[cat_key];
  }

  values.push(total);

  dbWrapperRun(query, values).then(() => {
    appGetObject(clients, 'name', socket).then((client) => {
      client.voted = true;
    });

    dbQueryClient(socket, ballot.contestant).then((rows) => {
      if (rows.length > 0) {
        socket.emit('appBallotScore', rows[0]);
      }
    });

    console.log('[DB] Client ballot tallied:', values);
  }).then(() => {
    clientScores(socket);
  }).then(() => {
    hostClients();
    hostScores();
  });
}

/**
 * query category score for all contestants
 */
function dbQueryCategory(category) {
  var query;
  
  query  = `SELECT contestant_key,`;
  query += `COUNT(client_name) votes,`;
  query += `SUM(cat_${category.key}) score FROM votes GROUP BY contestant_key ORDER BY score DESC;`;

  return dbWrapperAll(query);
}

/**
 * query score(s) for client
 */
function dbQueryClient(socket, contestant = undefined) {
  var params, query;
  
  query = `SELECT * FROM votes WHERE client_name=?`;

  if (contestant) {
    params = [socket.name, contestant.key];
    query += ` AND contestant_key=?`;
  } else {
    params = socket.name;
  }

  return dbWrapperAll(query, params);
}

/**
 * query Graham Norton bitch score for all contestants
 */
function dbQueryGNBP() {
  var query;
  
  query  = `SELECT contestant_key,`;
  query += `COUNT(client_name) score FROM gnbp GROUP BY contestant_key ORDER BY score DESC;`;

  return dbWrapperAll(query);
}

/**
 * query total score for all contestants
 */
function dbQueryTotal() {
  var cat_columns, query;

  cat_columns = data.categories.map((category) => {
    return `SUM(cat_${category.key}) cat_${category.key}`;
  }).join(`,`);
  
  query  = `SELECT contestant_key,`;
  query += `COUNT(client_name) votes,`;
  query += `${cat_columns},`;
  query += `SUM(total) total FROM votes GROUP BY contestant_key ORDER BY total DESC;`;

  return dbWrapperAll(query);
}

/**
 * set filename for database
 */
 function dbSetFilename() {
  return `${new Date().toISOString().substring(0, 10)}.db`;
}

/**
 * promise wrapper for database <all> queries
 */
function dbWrapperAll(query, params) {
  return new Promise((resolve, reject) => {
    db.all(query, params, (err, rows) => {
      if (err) {
        reject(err);

        console.log('[DB] Error performing all query:', err);
      } else {
        resolve(rows);
      }
    });
  });
}

/**
 * promise wrapper for database <all> queries
 */
function dbWrapperRun(query, params) {
  return new Promise((resolve, reject) => {
    db.run(query, params, (err) => {
      if (err) {
        reject(err);
        
        console.log('[DB] Error performing run query:', err);
      } else {
        resolve();
      }
    });
  });
}

/**
 * emit top category scores to awards sockets
 */
async function awardsCategory() {
  var scores = {};

  for (var category of data.categories) {
    await dbQueryCategory(category).then((rows) => {
      scores[category.key] = appGetScores(rows.slice(0, 3), data.contestants, 'contestant_key', 'key');
    });
  }

  awardsIO.emit('appScoresCategory', scores);
}

/**
 * emit top GNBP scores to awards sockets
 */
function awardsGNBP() {
  dbQueryGNBP().then((rows) => {
    awardsIO.emit('appScoresGNBP', appGetScores(rows.slice(0, 3), data.contestants, 'contestant_key', 'key'));
  });
}

/**
 * emit total scores for all contestants to awards sockets
 */
function awardsTotal() {
  dbQueryTotal().then((rows) => {
    awardsIO.emit('appScoresTotal', appGetScores(rows, data.contestants, 'contestant_key', 'key'));
  });
}

/**
 * emit ballot to client(s)
 */
function clientBallot(socket = undefined) {
  if (socket) {
    socket.emit('appBallot', ballot);

    dbQueryClient(socket, ballot.contestant).then((rows) => {
      if (rows.length > 0) {
        socket.emit('appBallotScore', rows[0]);
      } else {
        socket.emit('appBallotScore', {});
      }
    });
  } else {
    clientIO.emit('appBallot', ballot);

    for (var [id, socket] of clientIO.sockets) {        
      dbQueryClient(socket, ballot.contestant).then((rows) => {
        if (rows.length > 0) {
          socket.emit('appBallotScore', rows[0]);
        } else {
          socket.emit('appBallotScore', {});
        }
      });
    }
  }
}

/**
 * register client and emit connection events
 */
function clientConnection(socket) {
  appGetObject(clients, 'name', socket).then((client) => {
    client.connected = socket.connected;
    client.voted = false;

    return client;
  }, () => {
    var client = {
      connected: socket.connected,
      name: socket.name,
      voted: false,
    };

    clients.push(client);
    clients.sort((a, b) => {
      return (a.name > b.name) ? 1 : -1;
    });

    return client;
  }).then(async (client) => {
    if (ballot.open) {
      await dbQueryClient(socket, ballot.contestant).then((rows) => {
        client.voted = rows.length > 0;
      });
    }

    socket.emit('appConnected', {
      categories: data.categories,
      name: client.name,
    });
    
    console.log('[IO] Client connected:', client);
  }).then(() => {
    clientBallot(socket);
    clientScores(socket);
  }).then(() => {
    hostClients();
  });
}

/**
 * emit contestant scores to client
 */
function clientScores(socket) {
  var contestants = JSON.parse(JSON.stringify(data.contestants));

  dbQueryClient(socket).then((rows) => {
    return appGetScores(contestants, rows, 'key', 'contestant_key');
  }).then((scores) => {
    socket.emit('appScores', scores);
  });
}

/**
 * emit ballot to host
 */
function hostBallot() {
  hostIO.emit('appBallot', ballot);
}

/**
 * emit clients to host
 */
function hostClients() {
  hostIO.emit('appClients', clients);
}

/**
 * emit app details to host and emit connection events
 */
function hostConnection(socket) {
  hostIO.emit('appConnected', {
    categories: data.categories,
    db: dbSetFilename(),
    version: data.version,
  }, () => {
    console.log('[IO] Host connected:', socket.id);
  });

  hostBallot();
  hostClients();
  hostScores();
}

/**
 * emit contestant scores to host
 */
function hostScores() {
  var contestants = JSON.parse(JSON.stringify(data.contestants));

  dbQueryTotal().then((rows) => {
    return appGetScores(contestants, rows, 'key', 'contestant_key');
  }).then((scores) => {
    hostIO.emit('appScores', scores);
  });
}

__initialize();

module.exports = { app: app, server: httpServer };
