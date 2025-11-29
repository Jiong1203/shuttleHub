import { PrismaClient, Role } from '@prisma/client'
import bcrypt from 'bcrypt'

const prisma = new PrismaClient()

async function main() {
  const adminPassword = await bcrypt.hash('admin123', 10)
  const organizerPassword = await bcrypt.hash('organizer123', 10)
  const memberPassword = await bcrypt.hash('member123', 10)

  const admin = await prisma.user.upsert({
    where: { email: 'admin@shuttlehub.com' },
    update: {},
    create: {
      email: 'admin@shuttlehub.com',
      name: 'Admin User',
      password: adminPassword,
      role: Role.ADMIN,
    },
  })

  const organizer = await prisma.user.upsert({
    where: { email: 'organizer@test.com' },
    update: {},
    create: {
      email: 'organizer@test.com',
      name: 'Organizer User',
      password: organizerPassword,
      role: Role.ORGANIZER,
    },
  })

  const member = await prisma.user.upsert({
    where: { email: 'member@test.com' },
    update: {},
    create: {
      email: 'member@test.com',
      name: 'Member User',
      password: memberPassword,
      role: Role.MEMBER,
    },
  })

  console.log({ admin, organizer, member })
}

main()
  .catch((e) => {
    console.error(e)
    process.exit(1)
  })
  .finally(async () => {
    await prisma.$disconnect()
  })
