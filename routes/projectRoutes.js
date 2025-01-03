// routes/projectRoutes.js
const express = require('express');
const multer = require('multer');
const projectController = require('../controllers/projectController');

// Setup multer for handling image upload
const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    cb(null, './uploads'); // You can choose a different directory for your uploaded files
  },
  filename: (req, file, cb) => {
    cb(null, Date.now() + '-' + file.originalname);
  },
});
const upload = multer({ storage: storage });

const router = express.Router();

router.post('/projects', upload.single('image'), projectController.addProject);
router.get('/projects', projectController.getAllProjects);
router.get('/projects/:id', projectController.getProjectById);
router.put('/projects/:id', upload.single('image'), projectController.updateProject);
router.delete('/projects/:id', projectController.deleteProject);

module.exports = router;
