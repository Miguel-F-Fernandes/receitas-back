const express = require('express')

const HealthController = require('../controllers/health.controller')

module.exports = express
  .Router()
  .get('/uptime', HealthController.uptime)
  .get('/version', HealthController.version)
  .get('/ping', HealthController.ping)
