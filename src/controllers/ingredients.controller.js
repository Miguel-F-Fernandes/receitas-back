const createError = require('http-errors')
const db = require('../database')
const utils = require('../utils')

class IngredientsController {
  /**
   * Get all ingredients user has
   */
  static async getAll(req, res) {
    const defaultFields = {
      select: {
        id: true,
        name: true,
        price: true,
        difficulty: true,
        _count: {
          select: {
            recipes: true,
          },
        },
        recipes: {
          select: {
            recipe: {
              select: {
                id: true,
                name: true,
              },
            },
          },
        },
      },
    }

    // use `req.query.fields` to filter fields returned
    const filteredFields = utils.buildSelectFields(defaultFields, req.query.fields)

    const ingredients = await db.ingredients.findMany({
      skip: req.query.offset,
      take: req.query.limit,
      ...(filteredFields ?? defaultFields),
      where: {
        people: {
          some: {
            person: {
              user: {
                email: req.res.locals.user.email,
              },
            },
          },
        },
      },
    })

    return res.status(200).send(ingredients)
  }
}

module.exports = IngredientsController
