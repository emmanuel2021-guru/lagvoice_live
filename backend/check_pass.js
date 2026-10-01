const { PrismaClient } = require('@prisma/client');
const bcrypt = require('bcrypt');
const prisma = new PrismaClient();

async function check() {
  const u = await prisma.user.findUnique({where: {email: 'staff2@unilag.edu.ng'}});
  if (!u) {
    console.log('User not found!');
    return;
  }
  console.log('Role:', u.role);
  console.log('Hash:', u.password);
  const m = await bcrypt.compare('password123', u.password);
  console.log('Password matches password123?', m);
}

check().then(() => prisma.$disconnect());
