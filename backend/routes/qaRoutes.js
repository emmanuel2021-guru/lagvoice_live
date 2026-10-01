const express = require('express');
const router = express.Router();
const qaController = require('../controllers/qaController');
const { protect } = require('../middleware/auth');

router.use(protect); // Ensure user is authenticated

// In a real app, you might restrict to just 'admin' or 'qa-auditor'
router.post('/audits', qaController.submitAudit);
router.get('/audits', qaController.getAudits);

router.post('/self-assessments', qaController.submitSelfAssessment);
router.get('/self-assessments/me', qaController.getMySelfAssessments);
router.get('/self-assessments', qaController.getAllSelfAssessments);
router.get('/benchmarks', qaController.getBenchmarks);

module.exports = router;
