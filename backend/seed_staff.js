const { PrismaClient } = require('@prisma/client');
const bcrypt = require('bcrypt');

const prisma = new PrismaClient();

async function main() {
  const passwordHash = await bcrypt.hash('password123', 10);

  // Create Staff User
  const staff = await prisma.user.upsert({
    where: { email: 'staff@unilag.edu.ng' },
    update: {},
    create: {
      email: 'staff@unilag.edu.ng',
      password: passwordHash,
      name: 'Jane Staff',
      role: 'staff',
      department: 'Admissions'
    },
  });
  console.log('Created staff user:', staff.email);

  // Create Non-Staff User
  const nonStaff = await prisma.user.upsert({
    where: { email: 'nonstaff@unilag.edu.ng' },
    update: {},
    create: {
      email: 'nonstaff@unilag.edu.ng',
      password: passwordHash,
      name: 'John NonStaff',
      role: 'non-staff',
      department: 'Maintenance'
    },
  });
  console.log('Created non-staff user:', nonStaff.email);
}

main()
  .catch((e) => {
    console.error(e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
