const createError = require('http-errors')
const express = require('express')
const logger = require('morgan')
const cors = require('cors')
const helmet = require('helmet')
const http = require('http')
const cls = require('cls-hooked')

require('dotenv').config()

const Routes = require('./routes/index')

class App {
  constructor() {
    this._app = express()
    this.getApp = function () {
      return this._app
    }
    this.configureExpress()
    this.configureSession()
    this.configureRoutes()
  }

  getServer() {
    return http.createServer(this._app)
  }

  configureExpress() {
    /**
     * General express configurations
     */
    this._app.use(logger('dev'))
    this._app.use(express.json())
    this._app.use(express.urlencoded({ extended: false }))
    this._app.use((req, res, next) => {
      res.header('Access-Control-Allow-Origin', '*')
      res.header('Access-Control-Allow-Headers', 'X-Requested-With, Content-Type, Authorization')
      res.header('Access-Control-Allow-Methods', 'GET,PUT,PATCH,POST,DELETE,OPTIONS')
      next()
    })
    this._app.use(cors())
    this._app.use(helmet())
  }

  configureSession() {
    // create unique name
    const name = new Date().getTime() // TODO improve uniqueness
    let response = null

    /**
     * Create a new session for each connection
     */
    this._app.use((req, res, next) => {
      // create namespace/session
      const session = cls.createNamespace(name)
      session.run(() => {
        // store access to response for error handling
        response = res
        next()
      })
    })

    /**
     * Listen for any unhandled promise rejection
     */
    process.on('unhandledRejection', (error) => {
      // get response object
      const res = response
      return res.status(500).send(createError(error.message))
    })
  }

  configureRoutes() {
    /**
     * Routes' setup
     */
    for (const route of Routes) {
      this._app.use(route.path, route.middleware, route.handler)
    }

    /**
     * Error handling
     */

    // catch UnauthorizedError and forward to error handler
    this._app.use(function (err, req, res, next) {
      if (err.name === 'UnauthorizedError') {
        switch (err.code) {
          case 'permission_denied':
            return res
              .status(403)
              .send(createError(`User doesn't have permission to perform this action`))
          case 'invalid_token':
            return res.status(401).send(createError('Invalid token'))
          case 'revoked_token':
            return res.status(401).send(createError('Expired token'))
          case 'credentials_required':
            return res.status(401).send(createError('Missing token'))
        }
      }
      console.log(err)
      next()
    })

    // catch 404 and forward to error handler
    this._app.use(function (req, res) {
      return res.status(404).send(createError('Invalid url'))
    })

    // error handler
    this._app.use(function (err, req, res) {
      // set locals, only providing error in development
      res.locals.message = err.message
      res.locals.error = req.app.get('env') === 'development' ? err : {}

      // return an error
      res.status(err.status || 500)
      res.send('error')
    })
  }
}

module.exports = App
