const auth = require('./auth.middleware')
const common = require('./common.middleware')
const ingredients = require('./my-ingredients.middleware')
const feedback = require('./feedback.middleware')

module.exports = {
  auth,
  common,
  ingredients,
  feedback,
}
