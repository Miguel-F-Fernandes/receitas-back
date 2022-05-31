const express = require('express')

const middlewares = require('../middlewares')
const MyIngredientsController = require('../controllers/my-ingredients.controller')

module.exports = express
  .Router()
  .get('/', [middlewares.common.parseQueryParams], MyIngredientsController.getAll)
  .patch('/', [middlewares.ingredients.update], MyIngredientsController.update)
  .get('/fields', MyIngredientsController.getFields)
