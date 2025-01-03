


// routes/projectRoutes.js
const express = require('express');
const multer = require('multer');
const projectController = require('../controllers/projectController');

// Multer configuration for handling image upload
const storage = multer.memoryStorage();  // Store files in memory instead of disk
const upload = multer({ storage: storage });

const router = express.Router();

// Routes for handling projects with multer and Cloudinary image upload
router.post('/projects', upload.single('image'), projectController.addProject);
router.get('/projects', projectController.getAllProjects);
router.get('/projects/:id', projectController.getProjectById);
router.put('/projects/:id', upload.single('image'), projectController.updateProject);
router.delete('/projects/:id', projectController.deleteProject);

module.exports = router;
