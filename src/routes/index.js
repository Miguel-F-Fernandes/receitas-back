const { expressjwt: jwt } = require('express-jwt')
require('dotenv').config()
const guard = require('express-jwt-permissions')()
const isRevokedCallback = require('../services/jwt').isRevokedCallback

const middlewares = require('../middlewares')

const AuthRoute = require('./auth.route')
const HealthRoute = require('./health.route')

module.exports = [
  {
    path: '/health',
    middleware: [],
    handler: HealthRoute,
  },
  {
    path: '/auth',
    middleware: [
      jwt({
        secret: process.env.SECRET,
        algorithms: ['HS256'],
        isRevoked: isRevokedCallback,
      }).unless({
        path: [
          { url: '/auth/login', methods: ['POST'] },
          { url: '/auth/register', methods: ['POST'] },
        ],
      }),
    ],
    handler: AuthRoute,
  },
]
