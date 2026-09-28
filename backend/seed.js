const { PrismaClient } = require('@prisma/client');
const bcrypt = require('bcrypt');
const prisma = new PrismaClient();

async function main() {
  console.log('🌱 Starting database seed...');

  const defaultPassword = await bcrypt.hash('Password123!', 10);

  // 1. Create Users
  console.log('👤 Creating users...');
  
  const admin = await prisma.user.upsert({
    where: { email: 'admin@unilag.edu.ng' },
    update: {},
    create: {
      name: 'System Administrator',
      email: 'admin@unilag.edu.ng',
      password: defaultPassword,
      role: 'admin',
      staffId: 'UNILAG/ADM/001',
      department: 'Quality Assurance Unit',
    }
  });

  const staff = await prisma.user.upsert({
    where: { email: 'staff@unilag.edu.ng' },
    update: {},
    create: {
      name: 'Dr. Adebayo',
      email: 'staff@unilag.edu.ng',
      password: defaultPassword,
      role: 'staff',
      staffId: 'UNILAG/STF/102',
      department: 'Computer Science',
      faculty: 'Science'
    }
  });

  const student = await prisma.user.upsert({
    where: { email: 'student@student.unilag.edu.ng' },
    update: {},
    create: {
      name: 'Chidinma Okafor',
      email: 'student@student.unilag.edu.ng',
      password: defaultPassword,
      role: 'student',
      studentId: '2021/12345',
      department: 'Computer Science',
      faculty: 'Science'
    }
  });

  const nonStaff = await prisma.user.upsert({
    where: { email: 'nonstaff@unilag.edu.ng' },
    update: {},
    create: {
      name: 'Mr. John Doe',
      email: 'nonstaff@unilag.edu.ng',
      password: defaultPassword,
      role: 'non-staff',
      staffId: 'UNILAG/NS/055',
      department: 'Security Unit'
    }
  });

  // 2. Create Tickets
  console.log('🎫 Creating tickets...');
  await prisma.ticket.createMany({
    skipDuplicates: true,
    data: [
      {
        trackingId: 'UNILAG-12345',
        title: 'Broken AC in Lecture Hall B',
        description: 'The air conditioning unit has been leaking water for 3 days.',
        category: 'Infrastructure',
        subcategory: 'Air Conditioning',
        location: 'Lecture Hall B',
        status: 'under_review',
        userId: student.id,
      },
      {
        trackingId: 'UNILAG-67890',
        title: 'Missing grades for CSC301',
        description: 'My portal is not showing my first semester grades.',
        category: 'Academics',
        subcategory: 'Results',
        location: 'Senate Building',
        status: 'resolved',
        userId: student.id,
      }
    ]
  });

  // 3. Create Evaluations
  console.log('📊 Creating evaluations...');
  await prisma.evaluation.upsert({
    where: {
      courseCode_evaluatedById: {
        courseCode: 'CSC 101',
        evaluatedById: student.id
      }
    },
    update: {},
    create: {
      courseCode: 'CSC 101',
      courseName: 'Introduction to Computer Science',
      lecturer: 'Dr. Adebayo',
      department: 'Computer Science',
      level: '100',
      overallRating: 4.5,
      likes: 'Great explanations.',
      suggestions: 'More practical classes.',
      evaluatedById: student.id
    }
  });

  await prisma.evaluation.upsert({
    where: {
      courseCode_evaluatedById: {
        courseCode: 'MTH 101',
        evaluatedById: student.id
      }
    },
    update: {},
    create: {
      courseCode: 'MTH 101',
      courseName: 'Elementary Mathematics I',
      lecturer: 'Prof. Okonkwo',
      department: 'Mathematics',
      level: '100',
      overallRating: 3.2,
      likes: 'Good materials.',
      suggestions: 'Lecturer talks too fast.',
      evaluatedById: student.id
    }
  });

  console.log('✅ Seed completed successfully!');
  console.log('-------------------------------------------');
  console.log('Test Accounts (Password for all: Password123!)');
  console.log(`Admin:     ${admin.email}`);
  console.log(`Staff:     ${staff.email}`);
  console.log(`Student:   ${student.email}`);
  console.log(`Non-Staff: ${nonStaff.email}`);
  console.log('-------------------------------------------');
}

main()
  .catch((e) => {
    console.error('❌ Seed failed:');
    console.error(e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
