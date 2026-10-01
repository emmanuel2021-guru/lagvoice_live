const { PrismaClient } = require('@prisma/client');
const prisma = new PrismaClient();

exports.getCharters = async (req, res, next) => {
  try {
    const charters = await prisma.serviceCharter.findMany({
      include: {
        updatedBy: { select: { name: true, email: true } }
      },
      orderBy: { department: 'asc' }
    });
    res.status(200).json({ success: true, data: charters });
  } catch (err) {
    next(err);
  }
};

exports.upsertCharter = async (req, res, next) => {
  try {
    const updatedById = req.user.id;
    const { department, commitments, slaHours } = req.body;

    if (!department || !commitments || !Array.isArray(commitments)) {
      return res.status(400).json({ success: false, message: 'Department and an array of commitments are required' });
    }

    const charter = await prisma.serviceCharter.upsert({
      where: { department },
      update: {
        commitments,
        slaHours: Number(slaHours) || 48,
        updatedById
      },
      create: {
        department,
        commitments,
        slaHours: Number(slaHours) || 48,
        updatedById
      }
    });

    res.status(200).json({ success: true, data: charter });
  } catch (err) {
    next(err);
  }
};
