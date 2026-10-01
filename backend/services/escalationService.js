const cron = require('node-cron');
const { PrismaClient } = require('@prisma/client');
const prisma = new PrismaClient();

/**
 * Escalation Service
 * Runs every 30 minutes to check for SLA-breached tickets
 * and automatically escalates them to critical priority.
 */
function startEscalationJob() {
  // Run every 30 minutes
  cron.schedule('*/30 * * * *', async () => {
    console.log('[Escalation] Running SLA breach check...');

    try {
      // Find all tickets that have breached their SLA deadline
      // and have not already been resolved/closed or marked critical
      const breachedTickets = await prisma.ticket.findMany({
        where: {
          slaDeadline: { lt: new Date() },
          status: { notIn: ['resolved', 'closed'] },
          urgency: { not: 'critical' }
        }
      });

      if (breachedTickets.length === 0) {
        console.log('[Escalation] No breached tickets found.');
        return;
      }

      console.log(`[Escalation] Found ${breachedTickets.length} breached ticket(s). Escalating...`);

      // Find the first admin user to attribute the system comment to
      let systemUser = await prisma.user.findFirst({
        where: { role: 'admin' }
      });

      for (const ticket of breachedTickets) {
        // Escalate to critical priority
        await prisma.ticket.update({
          where: { id: ticket.id },
          data: { urgency: 'critical' }
        });

        // Add a system comment for the audit trail
        if (systemUser) {
          await prisma.comment.create({
            data: {
              message: 'SYSTEM AUTOMATED ESCALATION: This ticket has breached its Service Charter SLA and has been automatically escalated to Critical priority.',
              isAdmin: true,
              ticketId: ticket.id,
              authorId: systemUser.id
            }
          });
        }

        // Add a timeline entry
        await prisma.ticketTimeline.create({
          data: {
            step: 'escalated',
            ticketId: ticket.id,
            actorId: systemUser?.id || null
          }
        });

        console.log(`[Escalation] Ticket #${ticket.trackingId} escalated to critical.`);
      }

      console.log(`[Escalation] Done. ${breachedTickets.length} ticket(s) escalated.`);
    } catch (err) {
      console.error('[Escalation] Error during escalation check:', err);
    }
  });

  console.log('[Escalation] Cron job started — checking every 30 minutes.');
}

module.exports = { startEscalationJob };
