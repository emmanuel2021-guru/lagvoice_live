const express = require('express');
const router = express.Router();
const { getPolls, submitResponse, createPoll } = require('../controllers/pollController');
const { protect } = require('../middleware/auth');

router.use(protect);

router.post('/create', createPoll);

router.route('/')
  .get(getPolls)
  .post(submitResponse);

module.exports = router;
