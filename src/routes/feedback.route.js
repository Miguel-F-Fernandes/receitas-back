const express = require('express')

const middlewares = require('../middlewares')
const FeedbackController = require('../controllers/feedback.controller')

module.exports = express
  .Router()
  .post('/', [middlewares.feedback.create], FeedbackController.create)
