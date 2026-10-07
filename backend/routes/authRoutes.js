const express = require('express');
const { register, login, getMe, updateProfile, getAllUsers, syncHR } = require('../controllers/authController');
const { protect, authorize } = require('../middleware/auth');

const router = express.Router();

router.post('/register', register);
router.post('/login', login);
router.get('/me', protect, getMe);
router.put('/me', protect, updateProfile);
router.get('/users', protect, authorize('admin', 'hr'), getAllUsers);
router.post('/sync-hr', protect, authorize('admin', 'hr'), syncHR);

module.exports = router;

