const createError = require('http-errors')
const { db } = require('../database')
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
        ...utils.buildWhereFields('ingredients', defaultFields, req.query),
        people: {
          some: {
            person: {
              id: req.res.locals.user.person.id,
            },
          },
        },
      },
    })

    return res.status(200).send(ingredients)
  }

  /**
   * Update ingredients a user has
   */
  static async update(req, res) {
    // add ingredients
    await db.people__ingredients.createMany({
      data: req.body.add.map((id) => {
        return {
          ingredient_id: id,
          person_id: req.res.locals.user.person.id,
        }
      }),
      skipDuplicates: true,
    })

    // remove ingredients
    await db.people__ingredients.deleteMany({
      where: {
        person_id: req.res.locals.user.person.id,
        ingredient_id: {
          in: req.body.remove,
        },
      },
    })

    return res.status(204).send()
  }
}

module.exports = IngredientsController
