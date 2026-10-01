const express = require('express');
const router = express.Router();
const messageController = require('../controllers/messageController');
const { protect } = require('../middleware/auth');

router.use(protect);

router.get('/', messageController.getMessages);
router.get('/users', messageController.getStaffUsers);
router.post('/', messageController.sendMessage);
router.put('/:id/read', messageController.markAsRead);

module.exports = router;
