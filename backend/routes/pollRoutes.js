const express = require('express');
const router = express.Router();
const { getPolls, submitResponse } = require('../controllers/pollController');
const { protect } = require('../middleware/auth');

router.use(protect);

router.route('/')
  .get(getPolls)
  .post(submitResponse);

module.exports = router;
