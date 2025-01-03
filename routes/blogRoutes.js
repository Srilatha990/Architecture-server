


// const express = require('express');
// const multer = require('multer');
// const blogController = require('../controllers/blogController');

// const storage = multer.diskStorage({
//   destination: (req, file, cb) => {
//     cb(null, './uploads');
//   },
//   filename: (req, file, cb) => {
//     cb(null, Date.now() + '-' + file.originalname);
//   },
// });
// const upload = multer({ storage: storage });

// const router = express.Router();

// router.post('/blogs', upload.single('image'), blogController.addBlog);
// router.get('/blogs', blogController.getAllBlogs);
// router.get('/blogs/category/:category', blogController.getBlogsByCategory); // Fetch blogs by category
// router.get('/blogs/:id', blogController.getBlogById);
// router.put('/blogs/:id', upload.single('image'), blogController.updateBlog);
// router.delete('/blogs/:id', blogController.deleteBlog);
// router.get('/categories', blogController.getAllCategories); // Route for fetching all categories

// module.exports = router;







const express = require('express');
const multer = require('multer');
const blogController = require('../controllers/blogController');
const cloudinary = require('../utils/cloudinary'); // Assuming cloudinary configuration is set up

// Multer configuration - Store files in memory instead of disk
const storage = multer.memoryStorage(); // Store files in memory
const upload = multer({ storage: storage });

const router = express.Router();

// POST: Add a new blog (with image upload)
router.post('/blogs', upload.single('image'), blogController.addBlog);

// GET: Fetch all blogs
router.get('/blogs', blogController.getAllBlogs);

// GET: Fetch blogs by category
router.get('/blogs/category/:category', blogController.getBlogsByCategory);

// GET: Fetch a single blog by ID
router.get('/blogs/:id', blogController.getBlogById);

// PUT: Update an existing blog (with image upload)
router.put('/blogs/:id', upload.single('image'), blogController.updateBlog);

// DELETE: Remove a blog by ID
router.delete('/blogs/:id', blogController.deleteBlog);

// GET: Fetch all unique categories
router.get('/categories', blogController.getAllCategories);

module.exports = router;
