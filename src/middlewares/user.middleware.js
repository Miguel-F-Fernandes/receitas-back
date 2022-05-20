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

function create(req, res, next) {
  const schema = Joi.object({
    name: Joi.string().required(),
    email: Joi.string().email().required(),
    password: Joi.string().required(),
    type: Joi.string().valid('regular', 'owner'),
  })
  return checkSchema(schema, req, res, next)
}

function update(req, res, next) {
  // get user from decoded token
  const user = req.res.locals.user

  let schema
  // if the user is editing themself
  if (user.id === parseInt(req.params.id, 10)) {
    // let them edit name and/or password
    schema = Joi.object({
      name: Joi.string(),
      password: Joi.string(),
    }).min(1)
  } else {
    // otherwise, only allow editing their type
    schema = Joi.object({
      // TODO check if editing the name of another user is allowed
      // name: Joi.string(),
      type: Joi.string().valid('regular', 'owner', 'admin'),
    }).min(1)
  }

  return checkSchema(schema, req, res, next)
}

async function checkUserExists(req, res, next) {
  // get user from id on route params
  let user
  try {
    // TODO get User with id req.params.id
  } catch (err) {
    return res.status(500).send(createError(err.message))
  }

  // user whose id was received doesn't exist
  if (!user) {
    return res.status(404).send(createError('User not found'))
  }

  next()
}

function getAll(req, res, next) {
  // checks parameters received
  const schema = Joi.object({
    skip: Joi.number(),
    take: Joi.number(),
  })

  const { error } = schema.validate(req.query)

  if (error !== undefined) {
    return res.status(400).send(createError(error.details[0].message))
  } else {
    return next()
  }
}

module.exports = {
  create,
  update,
  checkUserExists,
  getAll,
}
