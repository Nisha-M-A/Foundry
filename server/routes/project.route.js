const express = require('express');
const router = express.Router();
const { generateBlueprint, getProjects, deleteProject, duplicateProject } = require('../controllers/project.controller');
const { protect } = require('../middleware/auth.middleware');

// GET /api/project
// Protected endpoint to fetch all projects for the user
router.get('/', protect, getProjects);

// POST /api/project/generate
// Protected endpoint to generate a new blueprint
router.post('/generate', protect, generateBlueprint);

// DELETE /api/project/:id
// Protected endpoint to delete a project
router.delete('/:id', protect, deleteProject);

// POST /api/project/:id/duplicate
// Protected endpoint to duplicate a project
router.post('/:id/duplicate', protect, duplicateProject);

module.exports = router;
