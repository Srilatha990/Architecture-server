


// routes/serviceRoutes.js
const express = require('express');
const multer = require('multer');
const serviceController = require('../controllers/serviceController');

// Multer configuration
const storage = multer.memoryStorage();  // Store files in memory instead of disk
const upload = multer({ storage: storage });

const router = express.Router();

router.post('/services', upload.single('image'), serviceController.addService);
router.get('/services', serviceController.getAllServices);
router.get('/services/:id', serviceController.getServiceById);
router.put('/services/:id', upload.single('image'), serviceController.updateService);
router.delete('/services/:id', serviceController.deleteService);

module.exports = router;
