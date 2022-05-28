const createError = require('http-errors')
const { db } = require('../database')
const utils = require('../utils')

class RecipesController {
  /**
   * Get all recipes
   */
  static async getAll(req, res) {
    const defaultFields = {
      select: {
        id: true,
        name: true,
        steps: true,
        image: true,
        decoration: true,
        alcohol_content: true,
        hardness: true,
        sweetness: true,
        calories: true,
        serve_in: true,
        description: true,
        ingredients: {
          select: {
            amount: true,
            ingredient: {
              select: {
                id: true,
                name: true,
                price: true,
                difficulty: true,
              },
            },
          },
        },
      },
    }

    // use `req.query.fields` to filter fields returned
    const filteredFields = utils.buildSelectFields(defaultFields, req.query.fields)

    const recipes = await db.recipes.findMany({
      skip: req.query.offset,
      take: req.query.limit,
      ...(filteredFields ?? defaultFields),
      where: {
        ...utils.buildWhereFields('recipes', defaultFields, req.query),
      },
    })

    return res.status(200).send(recipes)
  }
}

module.exports = RecipesController
