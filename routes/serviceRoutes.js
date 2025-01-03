// routes/serviceRoutes.js
const express = require('express');
const multer = require('multer');
const serviceController = require('../controllers/serviceController');

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

router.post('/services/insert', upload.single('image'), serviceController.addService);
router.get('/services', serviceController.getAllServices);
router.get('/services/:id', serviceController.getServiceById);
router.put('/services/:id', upload.single('image'), serviceController.updateService);
router.delete('/services/:id', serviceController.deleteService);

module.exports = router;
