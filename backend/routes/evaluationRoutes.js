const express = require('express');
const router = express.Router();
const { submitEvaluation, getMyEvaluations, getAggregatedEvaluations, getStaffEvaluations, getQuestions, updateQuestions } = require('../controllers/evaluationController');
const { protect, authorize } = require('../middleware/auth');

router.use(protect);

router.route('/')
  .post(submitEvaluation)
  .get(getMyEvaluations);

router.route('/questions')
  .get(getQuestions)
  .put(authorize('admin'), updateQuestions);

router.get('/aggregated', authorize('admin', 'faculty'), getAggregatedEvaluations);
router.get('/staff', authorize('staff', 'faculty'), getStaffEvaluations);

module.exports = router;
