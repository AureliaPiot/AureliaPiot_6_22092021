const http = require('https');
//importation du package http de node 
var fs = require('fs');


const app = require('./app');
// importation de notre app

// _____________________
const normalizePort = val => {
    const port = parseInt(val, 10);
  
    if (isNaN(port)) {
      return val;
    }
    if (port >= 0) {
      return port;
    }
    return false;
  };


const port = normalizePort(process.env.PORT || '3000');


app.set('port', port);
// le "port" de l'application sera la valeur de $port(au dessus)
// _____________________


const errorHandler = error => {
  if (error.syscall !== 'listen') {
    throw error;
  }
  const address = server.address();
  const bind = typeof address === 'string' ? 'pipe ' + address : 'port: ' + port;
  switch (error.code) {
    case 'EACCES':
      console.error(bind + ' requires elevated privileges.');
      process.exit(1);
      break;
    case 'EADDRINUSE':
      console.error(bind + ' is already in use.');
      process.exit(1);
      break;
    default:
      throw error;
  }
};

// ______________le server
// var privateKey  = fs.readFileSync('sslcert/server.key', 'utf8');
// var certificate = fs.readFileSync('sslcert/server.cert', 'utf8');
// var credentials = {key: privateKey, cert: certificate};

// const server = https.createServer(credentials, app);
// permet de creer un server local, requete rediriger vers l'app
const server = http.createServer(app);


server.on('error', errorHandler);
server.on('listening', () => {
  const address = server.address();
  const bind = typeof address === 'string' ? 'pipe ' + address : 'port ' + port;
  console.log('Listening on ' + bind);
});

server.listen(port);
// le server ecoutera sur le port = $ port



// ______________le server
