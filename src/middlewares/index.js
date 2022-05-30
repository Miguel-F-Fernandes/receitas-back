const auth = require('./auth.middleware')
const common = require('./common.middleware')
const ingredients = require('./my-ingredients.middleware')

module.exports = {
  auth,
  common,
  ingredients,
}
