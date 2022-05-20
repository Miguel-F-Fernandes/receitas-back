const express = require('express')
const guard = require('express-jwt-permissions')()

const HealthController = require('../controllers/health.controller')

module.exports = express
  .Router()
  .get('/uptime', HealthController.uptime)
  .get('/version', HealthController.version)
  .get('/ping', HealthController.ping)
