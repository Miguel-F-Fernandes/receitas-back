const { Prisma, PrismaClient } = require('@prisma/client')

const prisma = new PrismaClient()
// TODO make sure to call prisma.$disconnect() at end of endpoint calls

function getColumn(tableName, columnName) {
  const table = Prisma.dmmf.datamodel.models.find((model) => model.name === tableName)
  const column = table?.fields.find((field) => field.name === columnName)
  return column
}

function castToColumnType(tableName, columnName, originalValue) {
  const column = getColumn(tableName, columnName)
  let value
  try {
    switch (column?.type) {
      case 'Int':
        value = parseInt(originalValue)
        return isNaN(value) ? undefined : value
      case 'DateTime':
        value = new Date(originalValue)
        return isNaN(value.valueOf()) ? undefined : value
      case 'String':
        return originalValue
      case 'Float':
        value = parseFloat(originalValue)
        return isNaN(value) ? undefined : value
      case 'Json':
        return JSON.parse(originalValue)
      default:
        throw new Error(`Unforeseen type during casting of value (${column?.type})`)
    }
  } catch (error) {
    console.error({ tableName, columnName, originalValue, type: column?.type, error })
    return undefined
  }
}

module.exports = {
  db: prisma,
  getColumn,
  castToColumnType,
}
