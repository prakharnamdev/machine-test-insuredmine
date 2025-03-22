const express = require('express');
const { scheduleMessage } = require('../controllers/scheduleController');

const router = express.Router();

router.post('/schedule', scheduleMessage);

module.exports = router;
