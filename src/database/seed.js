const { PrismaClient } = require('@prisma/client')
const prisma = new PrismaClient()
const fs = require('fs')
const path = require('path')

async function main() {
  const seed = fs.readFileSync(path.join(__dirname, 'seed.sql'), 'utf8')
  const queries = seed.split(';\n')
  for (let i = 0; i < queries.length; i++) {
    // console.log(i,queries[i].replace(/\n/g,''))
    await prisma.$executeRawUnsafe(queries[i].replace(/\n/g, ''))
  }
}

main()
  .catch((e) => {
    console.error(e)
    process.exit(1)
  })
  .finally(async () => {
    await prisma.$disconnect()
  })
