const createError = require('http-errors')
const Joi = require('joi')
const { db } = require('../database')

function checkSchema(schema, req, res, next) {
  const { error } = schema.validate(req.body)

  if (error !== undefined) {
    return res.status(400).send(createError(error.details[0].message))
  } else {
    return next()
  }
}

function create(req, res, next) {
  const schema = Joi.object({
    text: Joi.string().required(),
  })
  return checkSchema(schema, req, res, next)
}

module.exports = {
  create,
}
