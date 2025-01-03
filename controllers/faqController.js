// controllers/faqController.js
const Faq = require('../models/Faq');

// POST route to add a new FAQ
const addFaq = async (req, res) => {
  const { question, answer } = req.body;

  if (!question || !answer) {
    return res.status(400).json({ error: 'Both question and answer are required.' });
  }

  try {
    const newFaq = new Faq({ question, answer });
    await newFaq.save();
    res.status(201).json(newFaq);
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: 'Error adding FAQ.' });
  }
};

// GET route to fetch all FAQs
const getAllFaqs = async (req, res) => {
  try {
    const faqs = await Faq.find();
    res.status(200).json(faqs);
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: 'Error fetching FAQs.' });
  }
};

// GET route to fetch a single FAQ by ID
const getFaqById = async (req, res) => {
  try {
    const faq = await Faq.findById(req.params.id);
    if (!faq) {
      return res.status(404).json({ error: 'FAQ not found.' });
    }
    res.status(200).json(faq);
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: 'Error fetching FAQ.' });
  }
};

// PUT route to update FAQ
const updateFaq = async (req, res) => {
  const { question, answer } = req.body;

  try {
    const faq = await Faq.findById(req.params.id);
    if (!faq) {
      return res.status(404).json({ error: 'FAQ not found.' });
    }

    faq.question = question || faq.question;
    faq.answer = answer || faq.answer;

    await faq.save();
    res.status(200).json(faq);
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: 'Error updating FAQ.' });
  }
};

// DELETE route to remove FAQ
// const deleteFaq = async (req, res) => {
//   try {
//     const faq = await Faq.findById(req.params.id);
//     if (!faq) {
//       return res.status(404).json({ error: 'FAQ not found.' });
//     }

//     await faq.remove();
//     res.status(200).json({ message: 'FAQ deleted successfully.' });
//   } catch (error) {
//     console.error(error);
//     res.status(500).json({ error: 'Error deleting FAQ.' });
//   }
// };

const deleteFaq = async (req, res) => { 
  try {
    const faq = await Faq.findById(req.params.id);
    if (!faq) {
      return res.status(404).json({ error: 'FAQ not found.' });
    }

    // Delete the FAQ from the database using deleteOne
    await Faq.deleteOne({ _id: req.params.id });

    res.status(200).json({ message: 'FAQ deleted successfully.' });
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: 'Error deleting FAQ.' });
  }
};


module.exports = {
  addFaq,
  getAllFaqs,
  getFaqById,
  updateFaq,
  deleteFaq,
};
