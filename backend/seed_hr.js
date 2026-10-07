const { PrismaClient } = require('@prisma/client');
const bcrypt = require('bcrypt');

const prisma = new PrismaClient();

async function seedHR() {
  console.log('--- Seeding Departmental HR Persona ---');

  const defaultPassword = await bcrypt.hash('Password123!', 10);

  // 1. Create or update Computer Science HR user
  const hrUser = await prisma.user.upsert({
    where: { email: 'hr.cs@unilag.edu.ng' },
    update: {
      role: 'hr',
      department: 'Computer Science',
      faculty: 'Faculty of Science'
    },
    create: {
      name: 'Dr. Babatunde Alabi',
      email: 'hr.cs@unilag.edu.ng',
      password: defaultPassword,
      role: 'hr',
      staffId: 'UNILAG/HR/CSC/001',
      department: 'Computer Science',
      faculty: 'Faculty of Science'
    }
  });

  console.log('✅ Upserted HR User:', hrUser.email, `(Dept: ${hrUser.department}, Role: ${hrUser.role})`);

  // 2. Ensure Electrical Engineering HR user exists for cross-department isolation testing
  const hrEeUser = await prisma.user.upsert({
    where: { email: 'hr.ee@unilag.edu.ng' },
    update: {
      role: 'hr',
      department: 'Electrical Engineering',
      faculty: 'Faculty of Engineering'
    },
    create: {
      name: 'Engr. Folake Adeleke',
      email: 'hr.ee@unilag.edu.ng',
      password: defaultPassword,
      role: 'hr',
      staffId: 'UNILAG/HR/EEE/001',
      department: 'Electrical Engineering',
      faculty: 'Faculty of Engineering'
    }
  });

  console.log('✅ Upserted Electrical Engineering HR User:', hrEeUser.email, `(Dept: ${hrEeUser.department})`);

  // 3. Ensure Computer Science staff member exists
  const csStaff = await prisma.user.upsert({
    where: { email: 'dr.adebayo@unilag.edu.ng' },
    update: {
      department: 'Computer Science',
      faculty: 'Faculty of Science',
      role: 'staff'
    },
    create: {
      name: 'Dr. Adebayo Ogunlesi',
      email: 'dr.adebayo@unilag.edu.ng',
      password: defaultPassword,
      role: 'staff',
      staffId: 'UNILAG/STF/CSC/101',
      department: 'Computer Science',
      faculty: 'Faculty of Science'
    }
  });

  // 4. Ensure Electrical Engineering staff member exists
  const eeStaff = await prisma.user.upsert({
    where: { email: 'engr.balogun@unilag.edu.ng' },
    update: {
      department: 'Electrical Engineering',
      faculty: 'Faculty of Engineering',
      role: 'staff'
    },
    create: {
      name: 'Engr. Segun Balogun',
      email: 'engr.balogun@unilag.edu.ng',
      password: defaultPassword,
      role: 'staff',
      staffId: 'UNILAG/STF/EEE/201',
      department: 'Electrical Engineering',
      faculty: 'Faculty of Engineering'
    }
  });

  console.log('✅ Verified departmental staff members (CSC & EEE)');

  // 5. Ensure Computer Science ticket exists
  const csTicket = await prisma.ticket.upsert({
    where: { trackingId: 'UNILAG-CSC-001' },
    update: {},
    create: {
      trackingId: 'UNILAG-CSC-001',
      title: 'Lab 3 Air Conditioning Malfunction',
      description: 'The central cooling unit in CSC Lab 3 is leaking water onto server racks.',
      category: 'Computer Science',
      subcategory: 'Facilities',
      urgency: 'high',
      status: 'under_review',
      pipelineStep: 'submitted',
      location: 'Faculty of Science, CSC Lab 3',
      isAnonymous: false,
      submittedById: csStaff.id
    }
  });

  // 6. Ensure Electrical Engineering ticket exists
  const eeTicket = await prisma.ticket.upsert({
    where: { trackingId: 'UNILAG-EEE-001' },
    update: {},
    create: {
      trackingId: 'UNILAG-EEE-001',
      title: 'High Voltage Circuit Board Replacement Request',
      description: 'Power surge damaged three 3-phase experimental breadboards in EEE Lab 1.',
      category: 'Electrical Engineering',
      subcategory: 'Equipment',
      urgency: 'urgent',
      status: 'pending',
      pipelineStep: 'submitted',
      location: 'Faculty of Engineering, EEE Lab 1',
      isAnonymous: false,
      submittedById: eeStaff.id
    }
  });

  console.log('✅ Verified departmental tickets:', csTicket.trackingId, '&', eeTicket.trackingId);
  console.log('--- Departmental HR Seed Completed Successfully ---');
}

seedHR()
  .catch((e) => {
    console.error('Seed Error:', e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
