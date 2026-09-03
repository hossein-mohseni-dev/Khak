import bcrypt from 'bcryptjs'
import { PrismaClient } from '@prisma/client'

const prisma = new PrismaClient()

async function main() {
  await prisma.user.upsert({
    where: { email: 'demo@khak.app' },
    update: {},
    create: {
      name: 'Demo Farmer',
      email: 'demo@khak.app',
      passwordHash: bcrypt.hashSync('Demo123!', 10),
      city: 'Tehran',
      farm: 'Greenhouse #2',
      phone: '+98 900 000 0000',
    },
  })
}

main()
  .then(async () => {
    await prisma.$disconnect()
  })
  .catch(async (err) => {
    console.error(err)
    await prisma.$disconnect()
    process.exit(1)
  })
