const express = require('express')

const middlewares = require('../middlewares')
const RecipesController = require('../controllers/recipes.controller')

module.exports = express
  .Router()
  .get('/', [middlewares.recipes.parseQueryParams], RecipesController.getAll)
