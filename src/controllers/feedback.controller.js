const createError = require('http-errors')
const { db } = require('../database')
const utils = require('../utils')

class IngredientsController {
  /**
   * Receive feedback
   */
  static async create(req, res) {
    const ingredients = await db.feedback.create({
      data: {
        text: req.body.text,
      },
    })

    return res.status(204).send()
  }
}

module.exports = IngredientsController
