const express = require('express');
const { register, login, getMe, updateProfile, getAllUsers } = require('../controllers/authController');
const { protect, authorize } = require('../middleware/auth');

const router = express.Router();

router.post('/register', register);
router.post('/login', login);
router.get('/me', protect, getMe);
router.put('/me', protect, updateProfile);
router.get('/users', protect, authorize('admin'), getAllUsers);

module.exports = router;

