const express = require('express');
const router = express.Router();
const { getStaffList, submitAssessment, getMyAssessments } = require('../controllers/supervisoryController');
const { protect } = require('../middleware/auth');

// All routes require authentication
router.use(protect);

router.get('/staff', getStaffList);
router.post('/', submitAssessment);
router.get('/my-assessments', getMyAssessments);

module.exports = router;
