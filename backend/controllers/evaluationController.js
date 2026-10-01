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
    // 1. By Course
    const courseAgg = await prisma.evaluation.groupBy({
      by: ['courseCode', 'courseName'],
      _avg: { overallRating: true },
      _count: { courseCode: true }
    });
    const byCourse = courseAgg.map(agg => ({
      code: agg.courseCode,
      title: agg.courseName || 'Unknown Course',
      score: agg._avg.overallRating ? Number(agg._avg.overallRating.toFixed(2)) : 0,
      responses: agg._count.courseCode
    }));

    // 2. By Lecturer
    const lecturerAgg = await prisma.evaluation.groupBy({
      by: ['lecturer'],
      _avg: { overallRating: true },
      _count: { lecturer: true }
    });
    const byLecturer = lecturerAgg.map(agg => ({
      name: agg.lecturer || 'Unknown Lecturer',
      score: agg._avg.overallRating ? Number(agg._avg.overallRating.toFixed(2)) : 0,
      responses: agg._count.lecturer
    }));

    // 3. By Department
    const deptAgg = await prisma.evaluation.groupBy({
      by: ['department'],
      _avg: { overallRating: true },
      _count: { department: true }
    });
    const byDepartment = deptAgg.map(agg => ({
      name: agg.department || 'Unknown Department',
      score: agg._avg.overallRating ? Number(agg._avg.overallRating.toFixed(2)) : 0,
      responses: agg._count.department
    }));

    // For backwards compatibility, 'data' returns byCourse, but we also return the others.
    res.status(200).json({ 
      success: true, 
      data: byCourse, 
      byCourse, 
      byLecturer, 
      byDepartment 
    });
  } catch (err) {
    next(err);
  }
};

exports.getStaffEvaluations = async (req, res, next) => {
  try {
    const staffName = req.user.name;
    const evaluations = await prisma.evaluation.findMany({
      where: { lecturer: staffName },
      orderBy: { createdAt: 'desc' }
    });

    const summary = {
      total: evaluations.length,
      average: evaluations.length > 0 
        ? (evaluations.reduce((sum, e) => sum + e.overallRating, 0) / evaluations.length).toFixed(1) 
        : 0,
    };

    res.status(200).json({ success: true, summary, data: evaluations });
  } catch (err) {
    next(err);
  }
};

const fs = require('fs');
const path = require('path');
const questionsFilePath = path.join(__dirname, '../data/evaluationQuestions.json');

const DEFAULT_QUESTIONS = [
  { id: 'q1', text: 'Punctuality and attendance to lectures' },
  { id: 'q2', text: 'Clarity of explanation and communication' },
  { id: 'q3', text: 'Relevance of course materials provided' },
  { id: 'q4', text: 'Engagement and interactive teaching' },
  { id: 'q5', text: 'Fairness and helpfulness in grading' }
];

exports.getQuestions = (req, res, next) => {
  try {
    if (fs.existsSync(questionsFilePath)) {
      const data = fs.readFileSync(questionsFilePath, 'utf8');
      res.status(200).json({ success: true, data: JSON.parse(data) });
    } else {
      res.status(200).json({ success: true, data: DEFAULT_QUESTIONS });
    }
  } catch (err) {
    next(err);
  }
};

exports.updateQuestions = (req, res, next) => {
  try {
    const { questions } = req.body;
    fs.writeFileSync(questionsFilePath, JSON.stringify(questions, null, 2), 'utf8');
    res.status(200).json({ success: true, data: questions });
  } catch (err) {
    next(err);
  }
};
