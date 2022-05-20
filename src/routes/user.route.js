const express = require('express')
const guard = require('express-jwt-permissions')()

const middlewares = require('../middlewares')
const UserController = require('../controllers/user.controller')

module.exports = express
  .Router()
  .post('/', [middlewares.user.create], UserController.create)
  .put('/:id', [middlewares.user.checkUserExists, middlewares.user.update], UserController.update)
  .delete('/:id', [middlewares.user.checkUserExists], UserController.remove)
