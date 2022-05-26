const auth = require('./auth.middleware')
const common = require('./common.middleware')

module.exports = {
  auth,
  common,
}
