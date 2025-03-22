const express = require('express');
const { searchPolicy, getPolicySummary } = require('../controllers/policyController');

const router = express.Router();

router.get('/search', searchPolicy);

router.get('/aggregate', getPolicySummary);

module.exports = router;
