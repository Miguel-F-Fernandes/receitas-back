const createError = require('http-errors')
const Joi = require('joi')

function parseQueryParams(req, res, next) {
  const schema = Joi.object({
    offset: Joi.number().integer(),
    limit: Joi.number().integer().default(25),
    fields: Joi.string().pattern(/^[a-zA-Z0-9-'",{}:[\]]*$/),
  }).unknown(true)

  // validate schema
  const { error, value: query } = schema.validate(req.query)
  if (error !== undefined) {
    return res.status(400).send(createError(error.details[0].message))
  }

  // convert query parameters
  if ('fields' in query) {
    try {
      query.fields = JSON.parse(query.fields)
    } catch (err) {
      // in case of malformed `fields` parameter, just ignore it
      delete query.fields
    }
  }

  // update req.query with parse query parameters
  req.query = query
  return next()
}

module.exports = {
  parseQueryParams,
}
