const { PrismaClient } = require('@prisma/client');
const bcrypt = require('bcrypt');

const prisma = new PrismaClient();

async function main() {
  const passwordHash = await bcrypt.hash('password123', 10);

  const hod = await prisma.user.upsert({
    where: { email: 'hod@unilag.edu.ng' },
    update: {
      password: passwordHash,
      role: 'hod'
    },
    create: {
      email: 'hod@unilag.edu.ng',
      password: passwordHash,
      name: 'Prof. Dean',
      role: 'hod',
      department: 'Computer Science'
    },
  });
  console.log('Created HOD/Dean user:', hod.email);
}

main()
  .catch((e) => {
    console.error(e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
