const express = require('express')

const middlewares = require('../middlewares')
const IngredientsController = require('../controllers/ingredients.controller')

module.exports = express
  .Router()
  .get('/', [middlewares.common.parseQueryParams], IngredientsController.getAll)
