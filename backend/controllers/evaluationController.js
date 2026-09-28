const { PrismaClient } = require('@prisma/client');
const prisma = new PrismaClient();

exports.submitEvaluation = async (req, res, next) => {
  try {
    const userId = req.user.id;
    const { 
      courseCode, 
      courseName, 
      lecturer, 
      department, 
      level, 
      likert, 
      overallRating, 
      likes, 
      suggestions 
    } = req.body;

    // Check if already evaluated
    const existing = await prisma.evaluation.findUnique({
      where: {
        courseCode_evaluatedById: {
          courseCode,
          evaluatedById: userId
        }
      }
    });

    if (existing) {
      return res.status(400).json({ success: false, message: 'You have already evaluated this course.' });
    }

    const evaluation = await prisma.evaluation.create({
      data: {
        courseCode,
        courseName,
        lecturer,
        department,
        level,
        likert,
        overallRating,
        likes,
        suggestions,
        evaluatedById: userId
      }
    });

    res.status(201).json({ success: true, data: evaluation });
  } catch (err) {
    next(err);
  }
};

exports.getMyEvaluations = async (req, res, next) => {
  try {
    const userId = req.user.id;
    const evaluations = await prisma.evaluation.findMany({
      where: { evaluatedById: userId },
      select: { courseCode: true }
    });

    const evaluatedCodes = evaluations.map(e => e.courseCode);
    res.status(200).json({ success: true, data: evaluatedCodes });
  } catch (err) {
    next(err);
  }
};

exports.getAggregatedEvaluations = async (req, res, next) => {
  try {
    const aggregations = await prisma.evaluation.groupBy({
      by: ['courseCode', 'courseName'],
      _avg: { overallRating: true },
      _count: { courseCode: true }
    });

    const data = aggregations.map(agg => ({
      code: agg.courseCode,
      title: agg.courseName || 'Unknown Course',
      score: agg._avg.overallRating ? Number(agg._avg.overallRating.toFixed(2)) : 0,
      responses: agg._count.courseCode
    }));

    res.status(200).json({ success: true, data });
  } catch (err) {
    next(err);
  }
};
