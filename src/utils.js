const { getColumn, castToColumnType } = require('./database')

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

function buildWhereFields(table, validFields, query) {
  const operations = [
    'contains',
    'not_contains',
    'gt',
    'lt',
    'gt_or_eq',
    'lt_or_eq',
    'blank',
    'eq',
    'not_eq',
    'in',
    'not_in',
  ]
  const validKeys = Object.keys(validFields.select).filter((key) => key.indexOf('_') !== 0)

  const caseInsensitive = (value) =>
    typeof value === 'string' ? { mode: 'insensitive' } : undefined

  let value
  const whereQuery = {}
  for (let i = 0; i < validKeys.length; i++) {
    if (!(validKeys[i] in query)) continue

    if (typeof query[validKeys[i]] === 'string') {
      // direct comparison
      value = castToColumnType(table, validKeys[i], query[validKeys[i]])
      whereQuery[validKeys[i]] = {
        equals: value,
        ...caseInsensitive(value),
      }
    } else if (
      Object.keys(query[validKeys[i]]).length === 1 &&
      operations.includes(Object.keys(query[validKeys[i]])[0])
    ) {
      // operation different than `eq`
      switch (Object.keys(query[validKeys[i]])[0]) {
        case 'contains':
          value = castToColumnType(table, validKeys[i], query[validKeys[i]].contains)
          whereQuery[validKeys[i]] = {
            contains: value,
            ...caseInsensitive(value),
          }
          break
        case 'not_contains':
          value = castToColumnType(table, validKeys[i], query[validKeys[i]].not_contains)
          whereQuery['NOT'] = {
            [validKeys[i]]: {
              contains: value,
              ...caseInsensitive(value),
            },
          }
          break
        case 'gt':
          value = castToColumnType(table, validKeys[i], query[validKeys[i]].gt)
          whereQuery[validKeys[i]] = {
            gt: value,
            ...caseInsensitive(value),
          }
          break
        case 'lt':
          value = castToColumnType(table, validKeys[i], query[validKeys[i]].lt)
          whereQuery[validKeys[i]] = {
            lt: value,
            ...caseInsensitive(value),
          }
          break
        case 'gt_or_eq':
          value = castToColumnType(table, validKeys[i], query[validKeys[i]].gt_or_eq)
          whereQuery[validKeys[i]] = {
            gte: value,
            ...caseInsensitive(value),
          }
          break
        case 'lt_or_eq':
          value = castToColumnType(table, validKeys[i], query[validKeys[i]].lt_or_eq)
          whereQuery[validKeys[i]] = {
            lte: value,
            ...caseInsensitive(value),
          }
          break
        case 'blank':
          if (query[validKeys[i]].blank === 'true') {
            whereQuery[validKeys[i]] = null
          } else if (query[validKeys[i]].blank === 'false') {
            whereQuery[validKeys[i]] = {
              not: null,
            }
          }
          break
        case 'eq':
          value = castToColumnType(table, validKeys[i], query[validKeys[i]].eq)
          whereQuery[validKeys[i]] = {
            equals: value,
            ...caseInsensitive(value),
          }
          break
        case 'not_eq':
          value = castToColumnType(table, validKeys[i], query[validKeys[i]].not_eq)
          whereQuery[validKeys[i]] = {
            not: value,
            ...caseInsensitive(value),
          }
          break
        case 'in':
          value = query[validKeys[i]].in
            .split(',')
            .map((value) => castToColumnType(table, validKeys[i], value))
          whereQuery[validKeys[i]] = {
            in: value,
            ...(value.length ? caseInsensitive(value[0]) : {}),
          }
          break
        case 'not_in':
          value = query[validKeys[i]].not_in
            .split(',')
            .map((value) => castToColumnType(table, validKeys[i], value))
          whereQuery[validKeys[i]] = {
            notIn: value,
            ...(value.length ? caseInsensitive(value[0]) : {}),
          }
          break
      }
    } else if (typeof validFields.select[validKeys[i]] === 'object') {
      // nested query
      const column = getColumn(table, validKeys[i])
      if (column?.kind === 'object' && column?.isList) {
        whereQuery[validKeys[i]] = {
          some: buildWhereFields(
            column?.type,
            validFields.select[validKeys[i]],
            query[validKeys[i]]
          ),
        }
      } else {
        whereQuery[validKeys[i]] = buildWhereFields(
          column?.type,
          validFields.select[validKeys[i]],
          query[validKeys[i]]
        )
      }
    }
  }

  if (!Object.keys(whereQuery).length) return undefined

  return whereQuery
}

module.exports = {
  buildSelectFields,
  buildWhereFields,
}
