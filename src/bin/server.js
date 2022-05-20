#!/usr/bin/env node
/* eslint no-console: 0 */

/**
 * Module dependencies.
 */

require('dotenv').config()

const debug = require('debug')('express-backend:server')
const cluster = require('cluster')
const cpus = require('os').cpus

const AppClass = require('../app')
const App = new AppClass()

if (cluster.isMaster) {
  /* eslint-disable-next-line no-unused-vars */
  for (const _ of cpus()) {
    cluster.fork()
    // when not in production environment, run only 1 worker
    if (process.env.NODE_ENV !== 'production') {
      break
    }
  }

  cluster.on('exit', (worker, code, signal) => {
    console.log(
      'Worker ' + worker.process.pid + ' died with code: ' + code + ', and signal: ' + signal
    )
    console.log('Starting a new worker')
    cluster.fork()
  })
} else {
  /**
   * Get port from environment and store in Express.
   */

  const port = normalizePort(process.env.PORT || '3000')

  /**
   * Create HTTP server.
   */

  const server = App.getServer()

  /**
   * Listen on provided port, on all network interfaces.
   */
  server.listen(port)

  /**
   * Event listener for HTTP server "error" event.
   */
  server.on('error', (error) => {
    if (error.syscall !== 'listen') {
      throw error
    }

    const bind = typeof port === 'string' ? 'Pipe ' + port : 'Port ' + port

    // handle specific listen errors with friendly messages
    switch (error.code) {
      case 'EACCES':
        console.error(bind + ' requires elevated privileges')
        process.exit(1)
        break
      case 'EADDRINUSE':
        console.error(bind + ' is already in use')
        process.exit(1)
        break
      default:
        throw error
    }
  })

  /**
   * Event listener for HTTP server "listening" event.
   */
  server.on('listening', () => {
    const addr = server.address()
    const bind = typeof addr === 'string' ? 'pipe ' + addr : 'port ' + addr.port
    debug('Running in process ' + process.pid + ' listening on port' + bind)
  })
}

/**
 * Normalize a port into a number, string, or false.
 */

function normalizePort(val) {
  const port = parseInt(val, 10)

  if (isNaN(port)) {
    // named pipe
    return val
  }

  if (port >= 0) {
    // port number
    return port
  }

  return false
}
