const { PrismaClient } = require('@prisma/client')

const prisma = new PrismaClient()

// TODO make sure to call prisma.$disconnect() at end of endpoint calls

module.exports = prisma
