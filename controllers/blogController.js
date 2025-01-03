
const Blog = require('../models/Blog');
const cloudinary = require('../utils/cloudinary'); // Import Cloudinary configuration

// POST: Add a new blog
const addBlog = async (req, res) => {
  const { title, description, category, author } = req.body;
  const imageFile = req.file;

  if (!imageFile) {
    return res.status(400).json({ error: 'Image is required.' });
  }

  try {
    const uploadedImage = await cloudinary.uploader.upload(imageFile.path);

    const newBlog = new Blog({
      title,
      description,
      category,
      author,
      image: uploadedImage.secure_url, // Store Cloudinary URL
    });

    await newBlog.save();
    res.status(201).json(newBlog);
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: 'Error adding blog.' });
  }
};

// GET: Fetch all blogs
const getAllBlogs = async (req, res) => {
  try {
    const blogs = await Blog.find();
    res.status(200).json(blogs);
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: 'Error fetching blogs.' });
  }
};

// GET: Fetch blogs by category
const getBlogsByCategory = async (req, res) => {
  try {
    const { category } = req.params;
    const blogs = await Blog.find({ category });
    res.status(200).json(blogs);
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: 'Error fetching blogs by category.' });
  }
};

// GET: Fetch a single blog by ID
const getBlogById = async (req, res) => {
  try {
    const blog = await Blog.findById(req.params.id);
    if (!blog) {
      return res.status(404).json({ error: 'Blog not found.' });
    }
    res.status(200).json(blog);
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: 'Error fetching blog.' });
  }
};

// PUT: Update a blog
const updateBlog = async (req, res) => {
  const { title, description, category, author } = req.body;
  const imageFile = req.file;

  try {
    const blog = await Blog.findById(req.params.id);
    if (!blog) {
      return res.status(404).json({ error: 'Blog not found.' });
    }

    blog.title = title || blog.title;
    blog.description = description || blog.description;
    blog.category = category || blog.category;
    blog.author = author || blog.author;

    if (imageFile) {
      const uploadedImage = await cloudinary.uploader.upload(imageFile.path);
      blog.image = uploadedImage.secure_url;
    }

    await blog.save();
    res.status(200).json(blog);
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: 'Error updating blog.' });
  }
};

// DELETE: Remove a blog
const deleteBlog = async (req, res) => {
  try {
    const blog = await Blog.findById(req.params.id);
    if (!blog) {
      return res.status(404).json({ error: 'Blog not found.' });
    }

    // Delete the image from Cloudinary
    if (blog.image) {
      const uploadedImageUrl = blog.image;
      const publicId = uploadedImageUrl.split('/').slice(-2).join('/').split('.')[0];
      await cloudinary.uploader.destroy(publicId);
    }

    // Delete the blog from the database
    await Blog.deleteOne({ _id: req.params.id });

    res.status(200).json({ message: 'Blog deleted successfully.' });
  } catch (error) {
    console.error('Error deleting blog:', error);
    res.status(500).json({ error: 'Error deleting blog.' });
  }
};


// GET: Fetch all unique categories
const getAllCategories = async (req, res) => {
  try {
    const categories = await Blog.distinct('category');
    res.status(200).json(categories);
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: 'Error fetching categories.' });
  }
};

module.exports = {
  addBlog,
  getAllBlogs,
  getBlogsByCategory,
  getBlogById,
  updateBlog,
  deleteBlog,
  getAllCategories, // Export the new method
};









