const createError = require('http-errors')
const db = require('../database')

class RecipesController {
  /**
   * Get all recipes
   */
  static async getAll(req, res) {
    console.log(JSON.stringify(req.query.fields))
    // TODO use `req.query.fields` to filter fields returned

    const recipes = await db.recipes.findMany({
      skip: req.query.offset,
      take: req.query.limit,
      include: {
        ingredients: {
          select: {
            ingredient: true,
            amount: true,
          },
        },
      },
    })

    return res.status(200).send(recipes)
  }
}

module.exports = RecipesController
