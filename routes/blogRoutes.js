


const express = require('express');
const multer = require('multer');
const blogController = require('../controllers/blogController');

const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    cb(null, './uploads');
  },
  filename: (req, file, cb) => {
    cb(null, Date.now() + '-' + file.originalname);
  },
});
const upload = multer({ storage: storage });

const router = express.Router();

router.post('/blogs', upload.single('image'), blogController.addBlog);
router.get('/blogs', blogController.getAllBlogs);
router.get('/blogs/category/:category', blogController.getBlogsByCategory); // Fetch blogs by category
router.get('/blogs/:id', blogController.getBlogById);
router.put('/blogs/:id', upload.single('image'), blogController.updateBlog);
router.delete('/blogs/:id', blogController.deleteBlog);
router.get('/categories', blogController.getAllCategories); // Route for fetching all categories

module.exports = router;







