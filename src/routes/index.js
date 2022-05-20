const { expressjwt: jwt } = require('express-jwt')
require('dotenv').config()
const guard = require('express-jwt-permissions')()
const isRevokedCallback = require('../services/jwt').isRevokedCallback

const middlewares = require('../middlewares')

const RootRoute = require('./root.route')
const UserRoute = require('./user.route')
const HealthRoute = require('./health.route')

module.exports = [
  {
    path: '/users',
    middleware: [
      jwt({
        secret: process.env.SECRET,
        algorithms: ['HS256'],
        isRevoked: isRevokedCallback,
      }).unless({
        path: [{ url: '/users', methods: ['POST'] }],
      }),
    ],
    handler: UserRoute,
  },
  {
    path: '/health',
    middleware: [],
    handler: HealthRoute,
  },
  {
    path: '/',
    middleware: [
      jwt({
        secret: process.env.SECRET,
        algorithms: ['HS256'],
        isRevoked: isRevokedCallback,
      }).unless({
        path: [{ url: '/login', methods: ['POST'] }],
      }),
    ],
    handler: RootRoute,
  },
]
