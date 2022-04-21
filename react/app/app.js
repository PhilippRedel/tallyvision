const cookieParser = require('cookie-parser');
const createError = require('http-errors');
const express = require('express');
const logger = require('morgan');
const path = require('path');

// routers
const router = require('./routes/api');

// server
const app = express();
const server = require('http').createServer(app);

// socket.io 
const io = require('socket.io')(server, {
  cors: {
    origin: 'http://localhost:3000',
    methods: ['GET', 'POST']
  }
});
const ioClient = io.of('/client');
const ioHost = io.of('/host');

// database
const sqlite3 = require('sqlite3');
const db = new sqlite3.Database('./db/' + new Date().toISOString().substring(0, 10) + '.db');

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

  res.send(
    {
      status: res.locals.status,
      message: err.message,
    }
  ).status(res.locals.status);
});

// app data
const appCategories = require('./data/categories');
const appContestants = require('./data/contestants/2022');

// app variables
var appBallot = {
  open: false,
  contestant: {},
};
var appClients = [];
var appHostPin = hostPin();



ioClient.use((socket, next) => {
  var auth = socket.handshake.auth;

  if (auth.name) {
    socket.name = auth.name.toLowerCase();
  } else {
    return next(new Error('missing name'));
  }

  next();
});

ioClient.on('connection', (socket) => {
  clientRegister(socket);
  hostClientsTable();

  socket.on('clientPushGNBB', () => {
    console.log('[IO] Client pressed GNBB:', socket.id);
  });

  socket.on('clientSubmitBallot', (scores) => {
    console.log('[IO] Client submitted ballot:', [socket.id, scores]);
    dbInsertVote(socket, scores);
  });

  socket.on('disconnect', (reason) => {
    clientIndex(socket, (i) => {
      if (i > -1) {
        appClients[i].connected = socket.connected;
      }

      console.log('[IO] Client disconnected:', [socket.name, reason]);
    });
  });
});

ioHost.on('connection', (socket) => {
  hostClientsTable();
});

// initialize app
function __initialize() {
  dbCreateTables();
  console.log('[TV] Host access pin:', appHostPin);
}

// get index for registered client
function clientIndex(socket, callback) {
  var index = appClients.findIndex((client) => {
    return client.name === socket.name;
  });

  callback(index, socket);
}

// update client list and emit client connection events
function clientRegister(socket) {
  clientIndex(socket, (i) => {
    if (i > -1) {
      appClients[i].connected = socket.connected;
    } else {
      appClients.push({
        connected: socket.connected,
        name: socket.name,
        voted: false,
      });
      
      appClients.sort((a, b) => {
        return (a.name > b.name) ? 1 : -1;
      });
    }

    console.log('[IO] Client connected:', socket.name);
    socket.emit('appRegistered', appClients[i]);
  });
}

// create database tables
function dbCreateTables() {
  var columns, gnbp, votes;

  // gnbb table
  gnbp  = `CREATE TABLE IF NOT EXISTS gnbb (`;
  gnbp += `uid INTEGER PRIMARY KEY AUTOINCREMENT,`;
  gnbp += `client_name TEXT NOT NULL,`;
  gnbp += `contestant_code TEXT NOT NULL);`;

  db.run(gnbp, (err) => {
    if (err) {
      console.log('[DB] Error when creating table:', err);
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
  votes += `contestant_code TEXT NOT NULL,`;
  votes += `${columns},`
  votes += `total INTEGER NOT NULL);`;

  db.run(votes, (err) => {
    if (err) {
      console.log('[DB] Error when creating table:', err);
    } else {
      console.log('[DB] Table created: votes');
    }
  });
}

// insert Graham Norton bitch point record for voter and contestant
function dbInsertGNBP(socket) {
  var query = `INSERT INTO gnbp (client_name,contestant_code) VALUES (?,?)`;
  var values = [socket.name, appBallot.code];

  db.run(query, values, (err) => {
    if (err) {
      console.log('[DB] Error inserting record:', err);
    } else {
      console.log('[DB] Counted GNBP');
    }
  });
}

// add vote record for client and current contestant
function dbInsertVote(socket, scores) {
  var cat_columns, cat_placeholders, query, total;
  var values = [socket.name, appBallot.contestant.code].concat(scores);

  cat_columns = appCategories.map((category) => {
    return `cat_${category.key}`;
  }).join(`,`);

  cat_placeholders = appCategories.map(() => {
    return `?`;
  }).join(`,`);

  query  = `INSERT INTO votes (`;
  query += `client_name,`;
  query += `contestant_code,`;
  query += `${cat_columns},`;
  query += `score) VALUES (?,?,${cat_placeholders},?);`;

  total = scores.reduce((a, b) => {
    return a + b;
  }, 0);

  values.push(total);

  db.run(query, values, (err) => {
    if (err) {
      console.log('[DB] Error inserting record:', err);
    } else {
      clientIndex(socket, (i) => {
        if (i > -1) {
          appClients[i].voted = true;
        }
      });

      console.log('[DB] Counted ballot');
      socket.emit('appCountBallot', values);
    }
  });
}

// get category score for all contestants 
function dbQueryCategory(category, callback) {
  var query;
  
  query  = `SELECT contestant_code,`;
  query += `COUNT(client_name) votes,`;
  query += `SUM(cat_${category.key}) score FROM votes GROUP BY contestant_code ORDER BY score DESC;`;

  db.all(sql, (err, rows) => {
    if (err) {
      console.log('[DB] Error performing query:', err);
    } else {
      callback(rows, category);
    }
  });
}

// get ballot data for client
function dbQueryClient(socket, contestant = {}, callback) {
  var params, query;
  
  query = `SELECT * FROM votes WHERE client_name=?`;

  if (contestant.code) {
    params = [socket.name, contestant.code];
    query += ` AND contestant_code=?`;
  } else {
    params = socket.name;
  }

  db.all(query, params, (err, rows) => {
    if (err) {
      console.log('[DB] Error performing query:', err);
    } else {
      callback(rows, socket, contestant);
    }
  });
}

// get Graham Norton bitch points for all contestants
function dbQueryGNBP(callback) {
  var query;
  
  query  = `SELECT contestant_code,`;
  query += `COUNT(client_name) score FROM gnbp GROUP BY contestant_code ORDER BY score DESC;`;

  db.all(query, (err, rows) => {
    if (err) {
      console.log('[DB] Error performing query:', err);
    } else {
      callback(rows);
    }
  });
}

// get total score for all contestants
function dbQueryTotal(callback) {
  var query;
  
  query  = `SELECT contestant_code,`;
  query += `COUNT(client_name) votes,`;
  query += `SUM(total) total FROM votes GROUP BY contestant_code ORDER BY total DESC;`;

  db.all(query, (err, rows) => {
    if (err) {
      console.log('[DB] Error performing query:', err);
    } else {
      callback(rows);
    }
  });
}

// ...
function hostClientsTable() {
  if (appClients.length > 0) {
    ioHost.emit('appClientsTable', appClients);
  }
}

// generate host pin code
function hostPin() {
  return Math.floor(1000 + Math.random() * 9000);
}





/*

// client events
client.use(function(socket, next) {
  var auth = socket.handshake.auth;

  if (!auth.name) {
    return next(new Error('missing name'));
  }

  socket.name = auth.name.toLowerCase();

  next();
});

client.on('connection', function(socket) {
  clientConnect(socket);
  // dbVoterAll(socket, clientScorecard);

  if (!isEmpty(appBallot)) {
    // dbVoterSingle(socket, appBallot.code, clientBallotOpen);
  }

  hostVoters();

  socket.on('clientBallotSubmit', function(scores) {
    // dbVoteInsert(socket, scores);
  });

  socket.on('clientGNBB', function() {
    // dbGNBPInsert(socket);
  });
  
  socket.on('disconnect', function() {
    clientDisconnect(socket);
    hostVoters();
  });
});

// host events
ioHost.on('connection', function(socket) {
  if (!isEmpty(appBallot)) {
    host.emit('appBallotOpen', appBallot);
  } else {
    host.emit('appBallotClose');
  }

  // dbContestantTotal(hostScoreboard);
  hostVoters();
  pcaCategories();
  pcaGNBP();
  pcaTotal();

  socket.on('hostBallotClose', function() {
    hostBallotClose();
  });

  socket.on('hostBallotOpen', function(i) {
    hostBallotOpen(i);
  });
});

// initialize app instance.
function __init() {
  console.log('Host access code: ' + appHost + '\n');

  // dbTableCreate();
}

// check if defined object is empty
function isEmpty(a) {
  return Object.keys(a).length === 0;
}

// get voter index from socket name
function appVoterGet(socket, callback) {
  callback(appVoters.findIndex(function(a) {
    return a.name === socket.name;
  }));
}

// emit ballot events to defined socket
function clientBallotOpen(socket, vote) {
  socket.emit('appBallotOpen', appBallot);

  if (vote) {
    socket.emit('appVoted', vote.score);
  }
}

// update list of voters, emit client connected events to defined socket
function clientConnect(socket) {
  appVoterGet(socket, function(i) {
    if (i !== -1) {
      appVoters[i].connected = true;
    } else {
      appVoters.push({
        connected: true,
        name: socket.name,
        voted: false,
      });
  
      appVoters.sort(function(a, b) {
        return (a.name > b.name) ? 1 : -1;
      });
    }
  });

  socket.emit('clientConnect', socket.name);
}

// update list of voters for defined socket
function clientDisconnect(socket) {
  appVoterGet(socket, function(i) {
    if (i !== -1) {
      appVoters[i].connected = false;
    }
  });
}

// emit scorecard events to defined socket
function clientScorecard(socket, votes) {
  if (votes) {
    socket.emit('clientScorecard', votes);
  }
}

// get total score for all contestants
function dbContestantTotal(callback) {
  var sql = `SELECT contestant,COUNT(voter) votes,SUM(score) score FROM votes GROUP BY contestant ORDER BY score DESC;`;

  db.all(sql, function(err, rows) {
    if (!err) {
      callback(rows);
    }
  });
}

// get defined category score for all contestants 
function dbContestantCategory(category, callback) {
  var sql = `SELECT contestant,COUNT(voter) votes,SUM(category_` + category + `) score FROM votes GROUP BY contestant ORDER BY score DESC;`;

  db.all(sql, function(err, rows) {
    if (!err) {
      callback(rows);
    }
  });
}

// get GNBP for all contestants
function dbContestantGNBP(callback) {
  var sql = `SELECT contestant,COUNT(voter) score FROM gnbp GROUP BY contestant ORDER BY score DESC;`;

  db.all(sql, function(err, rows) {
    if (!err) {
      callback(rows);
    }
  });
}

// create database tables
function dbTableCreate() {
  var columns, gnbp, votes;

  gnbp  = `CREATE TABLE IF NOT EXISTS gnbp (`;
  gnbp += `id INTEGER PRIMARY KEY AUTOINCREMENT,`;
  gnbp += `voter TEXT NOT NULL,`;
  gnbp += `contestant TEXT NOT NULL);`;

  db.run(gnbp, function(err) {});

  columns = appCategories.map(function(category) {
    return `category_` + category.title + ` INTEGER NOT NULL`;
  }).join(`,`);

  votes  = `CREATE TABLE IF NOT EXISTS votes (`;
  votes += `id INTEGER PRIMARY KEY AUTOINCREMENT,`;
  votes += `voter TEXT NOT NULL,`;
  votes += `contestant TEXT NOT NULL,` + columns + `,`;
  votes += `score INTEGER NOT NULL);`;

  db.run(votes, function(err) {});
}

// add GNBP for defined socket and current contestant
function dbGNBPInsert(socket) {
  var sql  = `INSERT INTO gnbp (voter,contestant) VALUES (?,?)`;
  var values = [socket.name, appBallot.code];

  db.run(sql, values, function(err) {});
}

// add vote for defined socket and current contestant
function dbVoteInsert(socket, scores) {
  var columns, placeholders, sql, total;
  var values = [socket.name, appBallot.code].concat(scores);

  columns = appCategories.map(function(category) {
    return `category_` + category.title;
  }).join(`,`);

  placeholders = appCategories.map(function() {
    return `?`;
  }).join(`,`);

  sql  = `INSERT INTO votes (`;
  sql += `voter,`;
  sql += `contestant,` + columns + `,score) VALUES (?,?,` + placeholders + `,?);`;

  total = scores.reduce(function(a, b) {
    return a + b;
  }, 0);

  values.push(total);

  db.run(sql, values, function(err) {
    if (!err) {
      appVoterGet(socket, function(i) {
        if (i !== -1) {
          appVoters[i].voted = true;
        }
      });

      socket.emit('appVoted', total);

      // dbContestantTotal(hostScoreboard);
      // dbVoterAll(socket, clientScorecard);
      hostVoters();
    }
  });
}

// get all votes for defined socket
function dbVoterAll(socket, callback) {
  var sql = `SELECT id,voter,contestant,score FROM votes WHERE voter=?;`;

  db.all(sql, [socket.name], function(err, rows) {
    if (!err) {
      callback(socket, rows);
    }
  });
}

// get vote for defined socket and contestant
function dbVoterSingle(socket, contestant, callback) {
  var sql = `SELECT id,voter,contestant,score FROM votes WHERE voter=? AND contestant=?;`;

  db.get(sql, [socket.name, contestant], function(err, row) {
    if (!err) {
      callback(socket, row);
    }
  });
}

// emit ballot close events to all clients and host
function hostBallotClose() {
  appBallot = {};

  for (let [i, voter] of appVoters.entries()) {
    appVoters[i].voted = false;

    hostVoters();
  }

  client.emit('appBallotClose');
  host.emit('appBallotClose');
}

// emit ballot open events to all clients and host
function hostBallotOpen(i) {
  appBallot = appContestants[i];

  for (let [i, voter] of appVoters.entries()) {
    /* dbVoterSingle(voter, appBallot.code, function(voter, vote) {
      if (vote) {
        appVoters[i].voted = true;
      }

      hostVoters();
    }); */ /*
  }

  for (let [id, socket] of client.sockets) {
    // dbVoterSingle(socket, appBallot.code, clientBallotOpen);
  }

  host.emit('appBallotOpen', appBallot);
}

// generate host access code
function hostID() {
  return Math.random().toString(36).substr(2, 4);
}

// emit scorecard events to host
function hostScoreboard(scores) {
  host.emit('hostScoreboard', scores);
}

// emit voters events to host
function hostVoters() {
  if (!isEmpty(appVoters)) {
    host.emit('hostVoters', appVoters);
  }
}

// get defined category score for all contestants and emit events
function pcaCategories() {
  for (let [i, category] of appCategories.entries()) {
    dbContestantCategory(category.title, function(scores) {
      for (let [i, score] of scores.entries()) {
        scores[i].contestant = appContestants.find(function(a) {
          return a.code === score.contestant;
        });
      }
      
      host.emit('pcaCategory', category.title, scores.slice(0, 3));
    });
  }
}

// get GNBP for all contestants and emit events
function pcaGNBP() {
  dbContestantGNBP(function(scores) {
    for (let [i, score] of scores.entries()) {
      scores[i].contestant = appContestants.find(function(a) {
        return a.code === score.contestant;
      });
    }
    
    host.emit('pcaGNBP', scores.slice(0, 3));
  });
}

// get total score for all contestants and emit events
function pcaTotal() {
  dbContestantTotal(function(scores) {
    for (let [i, score] of scores.entries()) {
      scores[i].contestant = appContestants.find(function(a) {
        return a.code === score.contestant;
      });
    }
    
    host.emit('pcaTotal', scores);
  });
}

*/

__initialize();

module.exports = {
  app: app,
  server: server,
};
