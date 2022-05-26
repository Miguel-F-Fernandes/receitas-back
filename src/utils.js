function buildSelectFields(defaultFields, fields) {
  if (!fields?.length) return undefined

  const filteredFields = {
    select: {},
  }

  for (let i = 0; i < fields?.length; i++) {
    if (typeof fields[i] === 'string' && fields[i] in defaultFields.select) {
      // if a field was received, add its default value
      filteredFields.select[fields[i]] = defaultFields.select[fields[i]]
    } else if (
      typeof fields[i] === 'object' &&
      fields[i] &&
      Object.keys(fields[i]).length === 1 &&
      typeof defaultFields.select[Object.keys(fields[i])[0]] === 'object'
    ) {
      // if an object was received, filter its internal fields
      filteredFields.select[Object.keys(fields[i])[0]] = buildSelectFields(
        defaultFields.select[Object.keys(fields[i])[0]],
        fields[i][Object.keys(fields[i])[0]]
      )
    }
  }

  // no valid fields received
  if (!Object.keys(filteredFields.select).length) return undefined

  return filteredFields
}

module.exports = {
  buildSelectFields,
}
