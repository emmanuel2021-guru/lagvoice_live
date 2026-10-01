const { PrismaClient } = require('@prisma/client');
const prisma = new PrismaClient();
async function main() {
  console.log('Evaluations:', await prisma.evaluation.findMany());
  console.log('Peer Reviews:', await prisma.peerReview.findMany());
  console.log('Users:', await prisma.user.findMany({ select: { id: true, name: true, role: true } }));
}
main().finally(() => prisma.$disconnect());
