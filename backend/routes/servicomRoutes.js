const express = require('express');
const router = express.Router();
const servicomController = require('../controllers/servicomController');
const { protect } = require('../middleware/auth');

router.use(protect);

router.get('/charters', servicomController.getCharters);
router.post('/charters', servicomController.upsertCharter);

module.exports = router;
