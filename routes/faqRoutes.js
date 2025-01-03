// routes/faqRoutes.js
const express = require('express');
const faqController = require('../controllers/faqController');

const router = express.Router();

// Define routes for FAQs
router.post('/faqs', faqController.addFaq);  // Add FAQ
router.get('/faqs', faqController.getAllFaqs);  // Get all FAQs
router.get('/faqs/:id', faqController.getFaqById);  // Get FAQ by ID
router.put('/faqs/:id', faqController.updateFaq);  // Update FAQ
router.delete('/faqs/:id', faqController.deleteFaq);  // Delete FAQ

module.exports = router;
