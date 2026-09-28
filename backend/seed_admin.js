const { PrismaClient } = require('@prisma/client');
const bcrypt = require('bcrypt');
const prisma = new PrismaClient();

async function main() {
  const adminEmail = 'admin@unilag.edu.ng';
  const adminPassword = 'Password123!';
  const hashedPassword = await bcrypt.hash(adminPassword, 10);

  const existingAdmin = await prisma.user.findUnique({
    where: { email: adminEmail }
  });

  if (!existingAdmin) {
    await prisma.user.create({
      data: {
        name: 'System Administrator',
        email: adminEmail,
        password: hashedPassword,
        role: 'admin',
        staffId: 'UNILAG/ADM/001',
        department: 'Quality Assurance Unit',
        faculty: 'Administration'
      }
    });
    console.log(`Admin user created: ${adminEmail} / ${adminPassword}`);
  } else {
    // Force reset the password just in case
    await prisma.user.update({
      where: { email: adminEmail },
      data: { password: hashedPassword, role: 'admin' }
    });
    console.log(`Admin user updated/reset: ${adminEmail} / ${adminPassword}`);
  }
}

main()
  .catch(e => {
    console.error(e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
