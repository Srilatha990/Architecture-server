


const mongoose = require('mongoose');

const blogSchema = new mongoose.Schema({
  title: { type: String, required: true },
  description: { type: String, required: true },
  image: { type: String, required: true },
  category: { type: String, required: true },
  author: { type: String, required: true }, // Added author field
}, { timestamps: true });

module.exports = mongoose.model('Blog', blogSchema);
