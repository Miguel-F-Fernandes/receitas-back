const createError = require('http-errors')
const Joi = require('joi')

function checkSchema(schema, req, res, next) {
  const { error } = schema.validate(req.body)

  if (error !== undefined) {
    return res.status(400).send(createError(error.details[0].message))
  } else {
    return next()
  }
}

function login(req, res, next) {
  const schema = Joi.object({
    email: Joi.string().email().required(),
    password: Joi.string().required(),
  })
  return checkSchema(schema, req, res, next)
}

module.exports = {
  login,
}
