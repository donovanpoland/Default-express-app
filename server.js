/** 
 * server.js only starts the HTTP server. Keeping listen() here lets the Express app
 * be imported elsewhere, such as tests or deployment adapters, without opening a port.
**/ 
import 'dotenv/config';
import { testConnection } from './src/database/pool.js';

import app from './app.js';

// set node evn from .env or set to production
export const NODE_ENV = process.env.NODE_ENV || 'production';
// use the port stored in .env converted to a number or default to this port
const PORT = Number(process.env.PORT) || 3000;
// Default dev is private to your computer.
// Set HOST=0.0.0.0 only when you intentionally want phone/LAN testing.
// if the node environment is dev
// use .env HOST or default to this IP 
// else undefined
const HOST = NODE_ENV === 'development' ? process.env.HOST || '127.0.0.1': undefined;

// set locals



const startServer = async () => {
  try {
    await testConnection();
    // if there is a HOST 
    // listen on PORT and HOST and call onListen function 
    // else only list on PORT and call onListen function
    const server = HOST
      ? app.listen(PORT, HOST, onListen)
      : app.listen(PORT, onListen);
    server.on('error', onServerError);
  } catch (error) {
    console.error('Startup failed:', error.message);
    process.exit(1);
  }
}

const onListen = () => {
  // if there is a HOST
  // location is http string with port
  // else location is only port number
  const location = HOST ? `http://${HOST}:${PORT}` : `port ${PORT}`;
  //log environment and display hosting location
  console.log(`${NODE_ENV} server listening on ${location}`);
}

// Check port and host errors
const onServerError = (error) => {
  if (error.code === 'EADDRINUSE') {
    console.error(`Port ${PORT} is already in use.`);
  } else if (error.code === 'EACCES') {
    console.error(`Permission denied for port ${PORT}. Use a port above 1024.`);
  } else if (error.code === 'EADDRNOTAVAIL') {
    console.error(`Host ${HOST} is not available on this machine.`);
  } else {
    console.error('Server failed:', error);
  }
  process.exit(1);
}

// call server start function
await startServer();

