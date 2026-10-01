const { PrismaClient } = require('@prisma/client');
const prisma = new PrismaClient();

// Get staff list for dropdown
const getStaffList = async (req, res) => {
  try {
    const staff = await prisma.user.findMany({
      where: {
        role: { in: ['faculty', 'staff'] }
      },
      select: {
        id: true,
        name: true,
        department: true,
        faculty: true
      }
    });
    res.json({ success: true, data: staff });
  } catch (error) {
    console.error('getStaffList error:', error);
    res.status(500).json({ success: false, message: 'Server error' });
  }
};

// Submit a new supervisory assessment
const submitAssessment = async (req, res) => {
  try {
    const { staffId, context, scores, remarks } = req.body;
    const supervisorId = req.user.id;

    if (!staffId || !scores) {
      return res.status(400).json({ success: false, message: 'Missing required fields' });
    }

    const assessment = await prisma.supervisoryAssessment.create({
      data: {
        supervisorId,
        staffId: parseInt(staffId),
        context,
        scores,
        remarks
      }
    });

    res.status(201).json({ success: true, data: assessment });
  } catch (error) {
    console.error('submitAssessment error:', error);
    res.status(500).json({ success: false, message: 'Server error' });
  }
};

// Get assessments submitted by the current supervisor
const getMyAssessments = async (req, res) => {
  try {
    const supervisorId = req.user.id;

    const assessments = await prisma.supervisoryAssessment.findMany({
      where: { supervisorId },
      include: {
        staff: { select: { name: true, department: true } }
      },
      orderBy: { createdAt: 'desc' }
    });

    res.json({ success: true, data: assessments });
  } catch (error) {
    console.error('getMyAssessments error:', error);
    res.status(500).json({ success: false, message: 'Server error' });
  }
};

module.exports = {
  getStaffList,
  submitAssessment,
  getMyAssessments
};
