const { PrismaClient } = require('@prisma/client');
const prisma = new PrismaClient();

exports.submitReview = async (req, res, next) => {
  try {
    const { revieweeId, courseCode, scores, comments } = req.body;

    const review = await prisma.peerReview.create({
      data: {
        reviewerId: req.user.id,
        revieweeId,
        courseCode,
        scores,
        comments
      }
    });

    res.status(201).json({ success: true, review });
  } catch (err) {
    next(err);
  }
};

exports.getReviewsForFaculty = async (req, res, next) => {
  try {
    const reviews = await prisma.peerReview.findMany({
      where: { revieweeId: req.user.id },
      include: {
        reviewer: { select: { name: true, department: true } }
      },
      orderBy: { createdAt: 'desc' }
    });

    res.status(200).json({ success: true, reviews });
  } catch (err) {
    next(err);
  }
};

exports.getFacultyMembers = async (req, res, next) => {
  try {
    const faculty = await prisma.user.findMany({
      where: { 
        role: { in: ['faculty', 'staff'] }, 
        id: { not: req.user.id } 
      },
      select: { id: true, name: true, department: true }
    });
    res.status(200).json({ success: true, faculty });
  } catch (err) {
    next(err);
  }
};
