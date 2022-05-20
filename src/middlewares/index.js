const auth = require('./auth.middleware')
const user = require('./user.middleware')

module.exports = {
  auth,
  user,
}
