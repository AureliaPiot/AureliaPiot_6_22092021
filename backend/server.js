const http = require('http');
// const https = require('https');
//importation du package http de node 

const app = require('./app');
// importation de notre app

// const fs= require('fs');
// importation fs (file system)
// const path = require('path');
// require('dotenv').config();
// appel de DOTENV pour lier les alias dans .env
console.log("env :  "+process.env.NODE_ENV);

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
const server = http.createServer(app);
// permet de creer un server local, requete rediriger vers l'app
// const server = https.createServer({
//   key:fs.readFileSync(path.join(__dirname,'sslcert','key.pem')),
//   cert:fs.readFileSync(path.join(__dirname,'sslcert','key.pem'))}, app);



server.on('error', errorHandler);
server.on('listening', () => {
  const address = server.address();
  const bind = typeof address === 'string' ? 'pipe ' + address : 'port ' + port;
  console.log('Listening on ' + bind);
  

});

server.listen(port,);
// le server ecoutera sur le port = $ port



// ______________le server
