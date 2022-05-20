const express = require('express')

const guard = require('express-jwt-permissions')()

const middlewares = require('../middlewares')
const AuthController = require('../controllers/auth.controller')

module.exports = express
  .Router()
  .post('/login', [middlewares.auth.login], AuthController.login)
  .post('/register', [middlewares.auth.register], AuthController.register)
  .post('/logout', [], AuthController.logout)
