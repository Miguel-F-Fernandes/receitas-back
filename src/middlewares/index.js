const auth = require('./auth.middleware')
const recipes = require('./recipes.middleware')

module.exports = {
  auth,
  recipes,
}
