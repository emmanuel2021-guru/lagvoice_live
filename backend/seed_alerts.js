const { PrismaClient } = require('@prisma/client');
const prisma = new PrismaClient();

async function main() {
  const user = await prisma.user.findFirst({ where: { role: 'student' } });
  if (!user) {
    console.log("No student found");
    return;
  }

  const newTickets = [];
  for (let i = 0; i < 6; i++) {
    newTickets.push({
      trackingId: `TEST-URGENT-${i}`,
      title: `Critical AC failure in Hall ${i}`,
      description: 'The AC is broken and students are extremely uncomfortable.',
      category: 'infrastructure',
      subcategory: 'ac_cooling',
      urgency: 'high',
      status: 'pending',
      pipelineStep: 'submitted',
      submittedById: user.id
    });
  }
  
  await prisma.ticket.createMany({
    data: newTickets
  });
  
  console.log("Seeded 6 urgent infrastructure complaints to trigger early warning");
}

main().catch(console.error).finally(() => prisma.$disconnect());
