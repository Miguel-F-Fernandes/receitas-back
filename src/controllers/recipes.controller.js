const createError = require('http-errors')
const db = require('../database')

class RecipesController {
  /**
   * Get all recipes
   */
  static async getAll(req, res) {
    const recipes = await db.recipes.findMany({
      include: {
        ingredients: true,
      },
    })

    return res.status(200).send(recipes)
  }
}

module.exports = RecipesController
