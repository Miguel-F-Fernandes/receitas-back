const createError = require('http-errors')
const Joi = require('joi')
const db = require('../database')

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

function register(req, res, next) {
  const schema = Joi.object({
    name: Joi.string().required(),
    email: Joi.string().email().required(),
    password: Joi.string().required(),
  })
  return checkSchema(schema, req, res, next)
}

async function checkEmailNotRegistered(req, res, next) {
  // get user from id on route params
  let user
  try {
    user = await db.users.findUnique({
      where: {
        email: req.body.email,
      },
    })
  } catch (err) {
    return res.status(500).send(createError(err.message))
  }

  if (user) {
    return res.status(400).send(createError('Email already registered'))
  }

  next()
}

module.exports = {
  login,
  register,
  checkEmailNotRegistered,
}
