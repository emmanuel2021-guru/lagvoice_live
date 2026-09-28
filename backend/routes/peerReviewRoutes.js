const express = require('express');
const { 
  submitReview, 
  getReviewsForFaculty, 
  getFacultyMembers 
} = require('../controllers/peerReviewController');
const { protect, authorize } = require('../middleware/auth');

const router = express.Router();

router.use(protect);
router.use(authorize('faculty', 'admin'));

router.post('/', submitReview);
router.get('/', getReviewsForFaculty);
router.get('/faculty-list', getFacultyMembers);

module.exports = router;
