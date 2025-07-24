const { PrismaClient } = require('../src/generated/prisma')
const bcrypt = require('bcrypt')

// Log the process to help debug
console.log('Starting seed script...')
console.log('Database URL:', process.env.DATABASE_URL ? 'URL exists (not showing for security)' : 'URL not found')

const prisma = new PrismaClient({
  datasources: {
    db: {
      url: process.env.DATABASE_URL
    },
  },
})

async function main() {
  // Check if admin already exists
  const adminExists = await prisma.admin.findUnique({
    where: {
      email: 'admin@example.com',
    },
  })

  if (!adminExists) {
    // Create admin with hashed password
    const hashedPassword = await bcrypt.hash('admin123', 10)
    
    const admin = await prisma.admin.create({
      data: {
        email: 'admin@example.com',
        password: hashedPassword,
        firstName: 'Admin',
        lastName: 'User',
      },
    })
    
    console.log(`Created admin: ${admin.email}`)
  } else {
    console.log('Admin already exists')
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
