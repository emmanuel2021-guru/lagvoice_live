const { PrismaClient } = require('@prisma/client');
const prisma = new PrismaClient();

async function main() {
  await prisma.poll.createMany({
    data: [
      {
        title: 'Campus Security Survey',
        description: 'Rate your sense of safety on campus. Your responses help us improve security measures across all areas of the university.',
        status: 'active',
        deadline: new Date(new Date().getTime() + 10 * 24 * 60 * 60 * 1000), // 10 days from now
        target: 'All Students',
        options: ['Very Safe', 'Safe', 'Neutral', 'Unsafe', 'Very Unsafe']
      },
      {
        title: 'Proposed Fee Structure Change',
        description: 'The administration is considering adjusting fees for next semester. Share your sentiment on the proposed changes.',
        status: 'active',
        deadline: new Date(new Date().getTime() + 5 * 24 * 60 * 60 * 1000),
        target: 'All Students',
        options: ['Strongly Support', 'Support', 'Neutral', 'Oppose', 'Strongly Oppose']
      },
      {
        title: 'Library Hours Extension',
        description: 'Should the university library extend operating hours during exam periods? Cast your vote below.',
        status: 'closed',
        deadline: new Date(new Date().getTime() - 10 * 24 * 60 * 60 * 1000),
        target: 'All Students',
        options: ['Yes, extend to 10pm', 'Yes, extend to 11pm', 'Current hours are fine', 'No opinion']
      }
    ]
  });
  console.log("Seeded polls");
}

main().catch(console.error).finally(() => prisma.$disconnect());
