const express = require('express');
const router = express.Router();
const { generateBlueprint } = require('../controllers/project.controller');
const { protect } = require('../middleware/auth.middleware');

// POST /api/project/generate
// Protected endpoint to generate a new blueprint
router.post('/generate', protect, generateBlueprint);

module.exports = router;
