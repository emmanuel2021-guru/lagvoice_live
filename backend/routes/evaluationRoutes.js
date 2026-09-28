const express = require('express');
const router = express.Router();
const { submitEvaluation, getMyEvaluations, getAggregatedEvaluations } = require('../controllers/evaluationController');
const { protect, authorize } = require('../middleware/auth');

router.use(protect);

router.route('/')
  .post(submitEvaluation)
  .get(getMyEvaluations);

router.get('/aggregated', authorize('admin', 'faculty'), getAggregatedEvaluations);

module.exports = router;
