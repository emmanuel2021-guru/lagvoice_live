const { PrismaClient } = require('@prisma/client');
const prisma = new PrismaClient();

exports.submitAudit = async (req, res, next) => {
  try {
    const auditorId = req.user.id;
    const { department, checklistData, score, notes } = req.body;

    if (!department || !checklistData) {
      return res.status(400).json({ success: false, message: 'Department and checklistData are required' });
    }

    const audit = await prisma.qaChecklist.create({
      data: {
        department,
        auditorId,
        checklistData,
        score: Number(score) || 0,
        notes
      }
    });

    res.status(201).json({ success: true, data: audit });
  } catch (err) {
    next(err);
  }
};

exports.getAudits = async (req, res, next) => {
  try {
    const audits = await prisma.qaChecklist.findMany({
      include: {
        auditor: {
          select: { name: true, email: true }
        }
      },
      orderBy: { createdAt: 'desc' }
    });

    res.status(200).json({ success: true, data: audits });
  } catch (err) {
    next(err);
  }
};

exports.submitSelfAssessment = async (req, res, next) => {
  try {
    const submittedById = req.user.id;
    const { department, accreditationBody, programName, responses, readinessScore } = req.body;

    if (!department || !accreditationBody || !programName || !responses) {
      return res.status(400).json({ success: false, message: 'All fields are required' });
    }

    const assessment = await prisma.selfAssessment.create({
      data: {
        department,
        submittedById,
        accreditationBody,
        programName,
        responses,
        readinessScore: Number(readinessScore) || 0
      }
    });

    res.status(201).json({ success: true, data: assessment });
  } catch (err) {
    next(err);
  }
};

exports.getMySelfAssessments = async (req, res, next) => {
  try {
    const submittedById = req.user.id;
    const assessments = await prisma.selfAssessment.findMany({
      where: { submittedById },
      orderBy: { createdAt: 'desc' }
    });

    res.status(200).json({ success: true, data: assessments });
  } catch (err) {
    next(err);
  }
};

exports.getAllSelfAssessments = async (req, res, next) => {
  try {
    const assessments = await prisma.selfAssessment.findMany({
      include: {
        submittedBy: {
          select: { name: true, email: true }
        }
      },
      orderBy: { createdAt: 'desc' }
    });

    res.status(200).json({ success: true, data: assessments });
  } catch (err) {
    next(err);
  }
};

const fs = require('fs');
const path = require('path');
const benchmarksFilePath = path.join(__dirname, '../data/accreditationBenchmarks.json');

exports.getBenchmarks = (req, res, next) => {
  try {
    const body = req.query.body; // e.g. 'NUC'
    if (fs.existsSync(benchmarksFilePath)) {
      const data = JSON.parse(fs.readFileSync(benchmarksFilePath, 'utf8'));
      if (body) {
        return res.status(200).json({ success: true, data: data[body] || [] });
      }
      return res.status(200).json({ success: true, data });
    } else {
      res.status(200).json({ success: true, data: [] });
    }
  } catch (err) {
    next(err);
  }
};
