const createError = require('http-errors')
const Joi = require('joi')
const db = require('../database')

async function update(req, res, next) {
  const schema = Joi.object({
    add: Joi.array().items(Joi.number().integer()),
    remove: Joi.array().items(Joi.number().integer()),
  }).or('remove', 'add')

  // validate schema
  const { error } = schema.validate(req.body)
  if (error !== undefined) {
    return res.status(400).send(createError(error.details[0].message))
  }

  req.body.add = req.body.add ?? []
  req.body.remove = req.body.remove ?? []
  if (req.body.add.length + req.body.remove.length === 0) {
    return res.status(400).send(createError(`At least one ingredient id must be provided`))
  }

  // make sure ingredients received exist
  let ingredients
  try {
    ingredients = await db.ingredients.findMany({
      select: {
        id: true,
      },
      where: {
        id: {
          in: [].concat(req.body.add, req.body.remove),
        },
      },
    })
  } catch (err) {
    return res.status(500).send(createError(err.message))
  }
  ingredients = ingredients.map((ingredient) => ingredient.id)

  // get ingredients that don't exist
  const missingIngredientsAdd = req.body.add.filter((id) => !ingredients.includes(id))
  const missingIngredientsRemove = req.body.remove.filter((id) => !ingredients.includes(id))
  if (missingIngredientsAdd.length + missingIngredientsRemove.length > 0) {
    const plural =
      missingIngredientsAdd.length + missingIngredientsRemove.length > 1
        ? `ids don't`
        : `id doesn't`
    return res
      .status(400)
      .send(
        createError(
          `The following Ingredient ${plural} exist: ${[]
            .concat(missingIngredientsAdd, missingIngredientsRemove)
            .join(', ')}`
        )
      )
  }

  return next()
}

module.exports = {
  update,
}
