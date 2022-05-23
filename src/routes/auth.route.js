const express = require('express')

const middlewares = require('../middlewares')
const AuthController = require('../controllers/auth.controller')

module.exports = express
  .Router()
  .post('/login', [middlewares.auth.login], AuthController.login)
  .post(
    '/register',
    [middlewares.auth.register, middlewares.auth.checkEmailNotRegistered],
    AuthController.register
  )
  .post('/logout', AuthController.logout)
