const express = require('express');
const { PrismaClient } = require('@prisma/client');
const { protect } = require('../middleware/auth');

const router = express.Router();
const prisma = new PrismaClient();

/**
 * HR Role & Department Isolation Middleware
 * Guarantees that:
 * 1. User is authenticated and possesses the 'hr' role.
 * 2. User has an assigned department.
 * 3. Any query/body parameter attempting cross-department access is rejected with HTTP 403.
 */
const verifyHR = (req, res, next) => {
  if (!req.user) {
    return res.status(401).json({
      success: false,
      message: 'Unauthorized: Authentication required'
    });
  }

  if (req.user.role !== 'hr') {
    return res.status(403).json({
      success: false,
      message: `Forbidden: HR role required. Current role: '${req.user.role}'`
    });
  }

  if (!req.user.department || !req.user.department.trim()) {
    return res.status(403).json({
      success: false,
      message: 'Forbidden: HR officer is not assigned to any department'
    });
  }

  // Cross-department tamper protection:
  // If request supplies a 'department' query or body parameter, it MUST match the authenticated user's department
  const attemptedDept = req.query.department || req.body?.department;
  if (attemptedDept && attemptedDept.trim().toLowerCase() !== req.user.department.trim().toLowerCase()) {
    return res.status(403).json({
      success: false,
      message: `Forbidden: Cross-department data access attempt. You are restricted to '${req.user.department}'. Access to '${attemptedDept}' is denied.`
    });
  }

  next();
};

// Guard all HR routes with JWT protect and HR role verification
router.use(protect);
router.use(verifyHR);

/**
 * Helper: Extract numerical average from JSON scores object
 * e.g., { teaching: 4, research: 5, conduct: 4 } -> 4.33
 */
const calculateScoreAverage = (scores) => {
  if (!scores) return 0;
  if (typeof scores === 'number') return scores;
  if (typeof scores === 'object') {
    const values = Object.values(scores).filter(v => typeof v === 'number' && !isNaN(v));
    if (values.length === 0) return 0;
    const sum = values.reduce((acc, curr) => acc + curr, 0);
    return Number((sum / values.length).toFixed(2));
  }
  return 0;
};

/**
 * Helper: Build department-scoped ticket WHERE clause
 * Multi-tenant isolation: Matches tickets where category or submittedBy matches the HR department
 */
const getDepartmentTicketWhere = (department, extraFilters = {}) => {
  return {
    ...extraFilters,
    OR: [
      { category: { equals: department, mode: 'insensitive' } },
      { submittedBy: { department: { equals: department, mode: 'insensitive' } } }
    ]
  };
};

/**
 * @route   GET /api/hr/overview
 * @desc    Summary stats for the HR user's department
 *          - total staff count
 *          - pending peer reviews
 *          - supervisory ratings average
 *          - unresolved departmental tickets
 * @access  Private (HR only)
 */
router.get('/overview', async (req, res) => {
  try {
    const hrDept = req.user.department;

    // 1. Total staff count (non-student users belonging to this department)
    const totalStaffCount = await prisma.user.count({
      where: {
        department: { equals: hrDept, mode: 'insensitive' },
        role: { not: 'student' }
      }
    });

    const staffByRole = await prisma.user.groupBy({
      by: ['role'],
      where: {
        department: { equals: hrDept, mode: 'insensitive' },
        role: { not: 'student' }
      },
      _count: { id: true }
    });

    // 2. Department staff member IDs
    const deptStaff = await prisma.user.findMany({
      where: {
        department: { equals: hrDept, mode: 'insensitive' },
        role: { not: 'student' }
      },
      select: { id: true, role: true }
    });
    const deptStaffIds = deptStaff.map(s => s.id);
    const academicStaffIds = deptStaff
      .filter(s => ['faculty', 'staff', 'hod'].includes(s.role))
      .map(s => s.id);

    // 3. Pending peer reviews
    // Staff members who have not yet received any peer review
    const completedPeerReviews = await prisma.peerReview.findMany({
      where: {
        revieweeId: { in: deptStaffIds }
      },
      select: { revieweeId: true }
    });
    const reviewedStaffIds = new Set(completedPeerReviews.map(r => r.revieweeId));
    
    // Academic staff without completed peer review are considered pending
    const pendingPeerReviewsCount = academicStaffIds.filter(id => !reviewedStaffIds.has(id)).length;

    // 4. Supervisory ratings average
    const supervisoryAssessments = await prisma.supervisoryAssessment.findMany({
      where: {
        staffId: { in: deptStaffIds }
      },
      select: { scores: true }
    });

    let supervisoryRatingsAverage = 0;
    if (supervisoryAssessments.length > 0) {
      const assessmentAverages = supervisoryAssessments
        .map(a => calculateScoreAverage(a.scores))
        .filter(avg => avg > 0);

      if (assessmentAverages.length > 0) {
        const sum = assessmentAverages.reduce((acc, curr) => acc + curr, 0);
        supervisoryRatingsAverage = Number((sum / assessmentAverages.length).toFixed(2));
      }
    }

    // 5. Unresolved departmental tickets
    const unresolvedTicketsCount = await prisma.ticket.count({
      where: getDepartmentTicketWhere(hrDept, {
        status: { in: ['pending', 'under_review', 'in_progress'] }
      })
    });

    const totalTicketsCount = await prisma.ticket.count({
      where: getDepartmentTicketWhere(hrDept)
    });

    const resolvedTicketsCount = await prisma.ticket.count({
      where: getDepartmentTicketWhere(hrDept, { status: 'resolved' })
    });

    // 6. Student evaluation average for department courses
    const studentEvaluations = await prisma.evaluation.aggregate({
      where: {
        department: { equals: hrDept, mode: 'insensitive' }
      },
      _avg: { overallRating: true },
      _count: { id: true }
    });

    res.status(200).json({
      success: true,
      department: hrDept,
      data: {
        totalStaffCount,
        pendingPeerReviews: pendingPeerReviewsCount,
        supervisoryRatingsAverage,
        unresolvedTickets: unresolvedTicketsCount,
        metrics: {
          totalTickets: totalTicketsCount,
          resolvedTickets: resolvedTicketsCount,
          resolutionRate: totalTicketsCount > 0 
            ? Number(((resolvedTicketsCount / totalTicketsCount) * 100).toFixed(1)) 
            : 0,
          totalSupervisoryAssessments: supervisoryAssessments.length,
          totalPeerReviewsCompleted: completedPeerReviews.length,
          studentEvaluationScore: studentEvaluations._avg.overallRating 
            ? Number(studentEvaluations._avg.overallRating.toFixed(2)) 
            : 0,
          studentEvaluationResponses: studentEvaluations._count.id,
          staffRoleDistribution: staffByRole.map(r => ({ role: r.role, count: r._count.id }))
        }
      }
    });
  } catch (error) {
    console.error('Error fetching HR overview:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to retrieve departmental HR overview',
      error: error.message
    });
  }
});

/**
 * @route   GET /api/hr/staff
 * @desc    List of staff members belonging to the HR user's department
 *          with roles, email, staff ID, and status
 * @access  Private (HR only)
 */
router.get('/staff', async (req, res) => {
  try {
    const hrDept = req.user.department;
    const { role, search, status } = req.query;

    const whereClause = {
      department: { equals: hrDept, mode: 'insensitive' },
      role: { not: 'student' }
    };

    if (role && role !== 'all') {
      whereClause.role = role;
    }

    if (search && search.trim()) {
      const q = search.trim();
      whereClause.OR = [
        { name: { contains: q, mode: 'insensitive' } },
        { email: { contains: q, mode: 'insensitive' } },
        { staffId: { contains: q, mode: 'insensitive' } }
      ];
    }

    const staffMembers = await prisma.user.findMany({
      where: whereClause,
      select: {
        id: true,
        name: true,
        email: true,
        role: true,
        staffId: true,
        department: true,
        faculty: true,
        createdAt: true,
        updatedAt: true
      },
      orderBy: { name: 'asc' }
    });

    const staffIds = staffMembers.map(s => s.id);

    // Fetch peer reviews received counts
    const peerReviews = await prisma.peerReview.findMany({
      where: { revieweeId: { in: staffIds } },
      select: { revieweeId: true, scores: true }
    });

    // Fetch supervisory assessments
    const supervisoryAssessments = await prisma.supervisoryAssessment.findMany({
      where: { staffId: { in: staffIds } },
      select: { staffId: true, scores: true }
    });

    // Aggregate staff records with status and performance summary
    const formattedStaff = staffMembers.map(member => {
      const memberPeerReviews = peerReviews.filter(pr => pr.revieweeId === member.id);
      const memberSupervisory = supervisoryAssessments.filter(sa => sa.staffId === member.id);

      const peerAvg = memberPeerReviews.length > 0
        ? calculateScoreAverage(memberPeerReviews.map(r => calculateScoreAverage(r.scores)))
        : null;

      const supervisoryAvg = memberSupervisory.length > 0
        ? calculateScoreAverage(memberSupervisory.map(s => calculateScoreAverage(s.scores)))
        : null;

      return {
        id: member.id,
        name: member.name,
        email: member.email,
        role: member.role,
        staffId: member.staffId || `UNILAG/STF/${member.id.toString().padStart(3, '0')}`,
        department: member.department,
        faculty: member.faculty,
        status: 'active', // Standard staff active lifecycle state
        appraisalSummary: {
          peerReviewsCount: memberPeerReviews.length,
          peerReviewAvgScore: peerAvg,
          supervisoryAssessmentsCount: memberSupervisory.length,
          supervisoryAvgScore: supervisoryAvg,
          appraisalStatus: (memberPeerReviews.length > 0 && memberSupervisory.length > 0)
            ? 'complete'
            : (memberPeerReviews.length > 0 || memberSupervisory.length > 0)
            ? 'partial'
            : 'pending'
        },
        joinedAt: member.createdAt
      };
    });

    // Optional status filter
    const filteredStaff = (status && status !== 'all')
      ? formattedStaff.filter(s => s.status.toLowerCase() === status.toLowerCase() || s.appraisalSummary.appraisalStatus === status)
      : formattedStaff;

    res.status(200).json({
      success: true,
      department: hrDept,
      count: filteredStaff.length,
      staff: filteredStaff
    });
  } catch (error) {
    console.error('Error fetching HR staff:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to retrieve departmental staff records',
      error: error.message
    });
  }
});

/**
 * @route   GET /api/hr/appraisals
 * @desc    Aggregated supervisory and peer review completion data for department personnel
 * @access  Private (HR only)
 */
router.get('/appraisals', async (req, res) => {
  try {
    const hrDept = req.user.department;

    // 1. All staff members in this department
    const departmentStaff = await prisma.user.findMany({
      where: {
        department: { equals: hrDept, mode: 'insensitive' },
        role: { not: 'student' }
      },
      select: {
        id: true,
        name: true,
        email: true,
        role: true,
        staffId: true,
        department: true
      },
      orderBy: { name: 'asc' }
    });

    const staffIds = departmentStaff.map(s => s.id);

    // 2. Supervisory assessments for department personnel
    const supervisoryAssessments = await prisma.supervisoryAssessment.findMany({
      where: {
        staffId: { in: staffIds }
      },
      include: {
        supervisor: { select: { id: true, name: true, role: true } },
        staff: { select: { id: true, name: true } }
      },
      orderBy: { createdAt: 'desc' }
    });

    // 3. Peer reviews received by department personnel
    const peerReviews = await prisma.peerReview.findMany({
      where: {
        revieweeId: { in: staffIds }
      },
      include: {
        reviewer: { select: { id: true, name: true, role: true, department: true } },
        reviewee: { select: { id: true, name: true } }
      },
      orderBy: { createdAt: 'desc' }
    });

    // 4. Map per-staff appraisal status
    const staffAppraisalRoster = departmentStaff.map(staff => {
      const staffSupervisory = supervisoryAssessments.filter(sa => sa.staffId === staff.id);
      const staffPeerReviews = peerReviews.filter(pr => pr.revieweeId === staff.id);

      const latestSupervisory = staffSupervisory[0] || null;
      const latestPeerReview = staffPeerReviews[0] || null;

      const supervisoryAvg = staffSupervisory.length > 0
        ? calculateScoreAverage(staffSupervisory.map(s => calculateScoreAverage(s.scores)))
        : null;

      const peerReviewAvg = staffPeerReviews.length > 0
        ? calculateScoreAverage(staffPeerReviews.map(p => calculateScoreAverage(p.scores)))
        : null;

      return {
        staffId: staff.id,
        name: staff.name,
        email: staff.email,
        role: staff.role,
        code: staff.staffId || `UNILAG/STF/${staff.id.toString().padStart(3, '0')}`,
        supervisory: {
          status: staffSupervisory.length > 0 ? 'completed' : 'pending',
          completedAssessments: staffSupervisory.length,
          averageScore: supervisoryAvg,
          latestAssessment: latestSupervisory ? {
            id: latestSupervisory.id,
            supervisorName: latestSupervisory.supervisor.name,
            context: latestSupervisory.context,
            scores: latestSupervisory.scores,
            remarks: latestSupervisory.remarks,
            date: latestSupervisory.createdAt
          } : null
        },
        peerReview: {
          status: staffPeerReviews.length > 0 ? 'completed' : 'pending',
          completedReviews: staffPeerReviews.length,
          averageScore: peerReviewAvg,
          latestReview: latestPeerReview ? {
            id: latestPeerReview.id,
            reviewerName: latestPeerReview.reviewer.name,
            courseCode: latestPeerReview.courseCode,
            scores: latestPeerReview.scores,
            comments: latestPeerReview.comments,
            date: latestPeerReview.createdAt
          } : null
        },
        overallAppraisalStatus: (staffSupervisory.length > 0 && staffPeerReviews.length > 0)
          ? 'complete'
          : (staffSupervisory.length > 0 || staffPeerReviews.length > 0)
          ? 'in_progress'
          : 'pending'
      };
    });

    // 5. Aggregate KPI calculations
    const totalStaff = departmentStaff.length;
    const completedSupervisoryCount = staffAppraisalRoster.filter(s => s.supervisory.status === 'completed').length;
    const completedPeerReviewCount = staffAppraisalRoster.filter(s => s.peerReview.status === 'completed').length;
    const fullyCompletedCount = staffAppraisalRoster.filter(s => s.overallAppraisalStatus === 'complete').length;

    const allSupervisoryScores = staffAppraisalRoster
      .map(s => s.supervisory.averageScore)
      .filter(s => s !== null && s > 0);
    const overallSupervisoryAvg = allSupervisoryScores.length > 0
      ? Number((allSupervisoryScores.reduce((a, b) => a + b, 0) / allSupervisoryScores.length).toFixed(2))
      : 0;

    const allPeerScores = staffAppraisalRoster
      .map(s => s.peerReview.averageScore)
      .filter(s => s !== null && s > 0);
    const overallPeerAvg = allPeerScores.length > 0
      ? Number((allPeerScores.reduce((a, b) => a + b, 0) / allPeerScores.length).toFixed(2))
      : 0;

    res.status(200).json({
      success: true,
      department: hrDept,
      summary: {
        totalStaff,
        fullyCompleted: fullyCompletedCount,
        completionRate: totalStaff > 0 ? Number(((fullyCompletedCount / totalStaff) * 100).toFixed(1)) : 0,
        supervisory: {
          completed: completedSupervisoryCount,
          pending: totalStaff - completedSupervisoryCount,
          completionRate: totalStaff > 0 ? Number(((completedSupervisoryCount / totalStaff) * 100).toFixed(1)) : 0,
          averageScore: overallSupervisoryAvg
        },
        peerReview: {
          completed: completedPeerReviewCount,
          pending: totalStaff - completedPeerReviewCount,
          completionRate: totalStaff > 0 ? Number(((completedPeerReviewCount / totalStaff) * 100).toFixed(1)) : 0,
          averageScore: overallPeerAvg
        }
      },
      roster: staffAppraisalRoster,
      recentSupervisoryAssessments: supervisoryAssessments.slice(0, 5),
      recentPeerReviews: peerReviews.slice(0, 5)
    });
  } catch (error) {
    console.error('Error fetching HR appraisals:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to retrieve departmental appraisal data',
      error: error.message
    });
  }
});

/**
 * @route   GET /api/hr/grievances
 * @desc    Departmental tickets filtered by category/staff involvement
 * @access  Private (HR only)
 */
router.get('/grievances', async (req, res) => {
  try {
    const hrDept = req.user.department;
    const { status, category, urgency, staffInvolvement, search } = req.query;

    const baseWhere = getDepartmentTicketWhere(hrDept);
    const filters = [];

    // Filter by ticket status
    if (status && status !== 'all') {
      filters.push({ status });
    }

    // Filter by subcategory or specific category
    if (category && category !== 'all') {
      filters.push({
        OR: [
          { subcategory: { contains: category, mode: 'insensitive' } },
          { category: { contains: category, mode: 'insensitive' } }
        ]
      });
    }

    // Filter by urgency
    if (urgency && urgency !== 'all') {
      filters.push({ urgency });
    }

    // Filter by staff involvement
    if (staffInvolvement === 'staff_only') {
      filters.push({
        submittedBy: {
          role: { in: ['staff', 'faculty', 'hod', 'dean', 'non-staff'] }
        }
      });
    } else if (staffInvolvement === 'student_only') {
      filters.push({
        submittedBy: {
          role: 'student'
        }
      });
    }

    // Text search filter
    if (search && search.trim()) {
      const q = search.trim();
      filters.push({
        OR: [
          { title: { contains: q, mode: 'insensitive' } },
          { trackingId: { contains: q, mode: 'insensitive' } },
          { description: { contains: q, mode: 'insensitive' } }
        ]
      });
    }

    const finalWhere = filters.length > 0
      ? { AND: [baseWhere, ...filters] }
      : baseWhere;

    const tickets = await prisma.ticket.findMany({
      where: finalWhere,
      include: {
        submittedBy: {
          select: {
            id: true,
            name: true,
            email: true,
            role: true,
            staffId: true,
            studentId: true,
            department: true
          }
        },
        comments: {
          select: {
            id: true,
            message: true,
            isAdmin: true,
            createdAt: true,
            author: { select: { id: true, name: true, role: true } }
          },
          orderBy: { createdAt: 'asc' }
        },
        timeline: {
          include: { actor: { select: { id: true, name: true, role: true } } },
          orderBy: { createdAt: 'asc' }
        }
      },
      orderBy: { createdAt: 'desc' }
    });

    // Sanitize anonymous submissions for confidentiality
    const sanitizedTickets = tickets.map(ticket => {
      let submittedByInfo = null;
      if (ticket.submittedBy) {
        if (ticket.isAnonymous) {
          submittedByInfo = {
            isAnonymous: true,
            role: ticket.submittedBy.role,
            department: ticket.submittedBy.department
          };
        } else {
          submittedByInfo = ticket.submittedBy;
        }
      }

      return {
        id: ticket.id,
        trackingId: ticket.trackingId,
        title: ticket.title,
        description: ticket.description,
        category: ticket.category,
        subcategory: ticket.subcategory,
        urgency: ticket.urgency,
        status: ticket.status,
        pipelineStep: ticket.pipelineStep,
        location: ticket.location,
        isAnonymous: ticket.isAnonymous,
        slaDeadline: ticket.slaDeadline,
        images: ticket.images ? JSON.parse(ticket.images) : [],
        submittedBy: submittedByInfo,
        commentsCount: ticket.comments.length,
        comments: ticket.comments,
        timeline: ticket.timeline,
        createdAt: ticket.createdAt,
        updatedAt: ticket.updatedAt
      };
    });

    // Breakdown metrics for the HR officer
    const statusCounts = {
      pending: sanitizedTickets.filter(t => t.status === 'pending').length,
      under_review: sanitizedTickets.filter(t => t.status === 'under_review').length,
      in_progress: sanitizedTickets.filter(t => t.status === 'in_progress').length,
      resolved: sanitizedTickets.filter(t => t.status === 'resolved').length
    };

    res.status(200).json({
      success: true,
      department: hrDept,
      count: sanitizedTickets.length,
      summary: {
        total: sanitizedTickets.length,
        unresolved: statusCounts.pending + statusCounts.under_review + statusCounts.in_progress,
        resolved: statusCounts.resolved,
        breakdown: statusCounts,
        staffInitiatedCount: sanitizedTickets.filter(t => t.submittedBy?.role && t.submittedBy.role !== 'student').length,
        studentInitiatedCount: sanitizedTickets.filter(t => t.submittedBy?.role === 'student').length
      },
      tickets: sanitizedTickets
    });
  } catch (error) {
    console.error('Error fetching HR grievances:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to retrieve departmental grievance tickets',
      error: error.message
    });
  }
});

module.exports = router;
