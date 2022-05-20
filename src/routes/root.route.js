const express = require('express')

const guard = require('express-jwt-permissions')()

const middlewares = require('../middlewares')
const UserController = require('../controllers/user.controller')

module.exports = express
  .Router()
  .post('/login', [middlewares.auth.login], UserController.login)
  .post('/logout', [], UserController.logout)
