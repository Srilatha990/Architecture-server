
// const Blog = require('../models/Blog');
// const cloudinary = require('../utils/cloudinary'); // Import Cloudinary configuration

// // POST: Add a new blog
// const addBlog = async (req, res) => {
//   const { title, description, category, author } = req.body;
//   const imageFile = req.file;

//   if (!imageFile) {
//     return res.status(400).json({ error: 'Image is required.' });
//   }

//   try {
//     const uploadedImage = await cloudinary.uploader.upload(imageFile.path);

//     const newBlog = new Blog({
//       title,
//       description,
//       category,
//       author,
//       image: uploadedImage.secure_url, // Store Cloudinary URL
//     });

//     await newBlog.save();
//     res.status(201).json(newBlog);
//   } catch (error) {
//     console.error(error);
//     res.status(500).json({ error: 'Error adding blog.' });
//   }
// };

// // GET: Fetch all blogs
// const getAllBlogs = async (req, res) => {
//   try {
//     const blogs = await Blog.find();
//     res.status(200).json(blogs);
//   } catch (error) {
//     console.error(error);
//     res.status(500).json({ error: 'Error fetching blogs.' });
//   }
// };

// // GET: Fetch blogs by category
// const getBlogsByCategory = async (req, res) => {
//   try {
//     const { category } = req.params;
//     const blogs = await Blog.find({ category });
//     res.status(200).json(blogs);
//   } catch (error) {
//     console.error(error);
//     res.status(500).json({ error: 'Error fetching blogs by category.' });
//   }
// };

// // GET: Fetch a single blog by ID
// const getBlogById = async (req, res) => {
//   try {
//     const blog = await Blog.findById(req.params.id);
//     if (!blog) {
//       return res.status(404).json({ error: 'Blog not found.' });
//     }
//     res.status(200).json(blog);
//   } catch (error) {
//     console.error(error);
//     res.status(500).json({ error: 'Error fetching blog.' });
//   }
// };

// // PUT: Update a blog
// const updateBlog = async (req, res) => {
//   const { title, description, category, author } = req.body;
//   const imageFile = req.file;

//   try {
//     const blog = await Blog.findById(req.params.id);
//     if (!blog) {
//       return res.status(404).json({ error: 'Blog not found.' });
//     }

//     blog.title = title || blog.title;
//     blog.description = description || blog.description;
//     blog.category = category || blog.category;
//     blog.author = author || blog.author;

//     if (imageFile) {
//       const uploadedImage = await cloudinary.uploader.upload(imageFile.path);
//       blog.image = uploadedImage.secure_url;
//     }

//     await blog.save();
//     res.status(200).json(blog);
//   } catch (error) {
//     console.error(error);
//     res.status(500).json({ error: 'Error updating blog.' });
//   }
// };

// // DELETE: Remove a blog
// const deleteBlog = async (req, res) => {
//   try {
//     const blog = await Blog.findById(req.params.id);
//     if (!blog) {
//       return res.status(404).json({ error: 'Blog not found.' });
//     }

//     // Delete the image from Cloudinary
//     if (blog.image) {
//       const uploadedImageUrl = blog.image;
//       const publicId = uploadedImageUrl.split('/').slice(-2).join('/').split('.')[0];
//       await cloudinary.uploader.destroy(publicId);
//     }

//     // Delete the blog from the database
//     await Blog.deleteOne({ _id: req.params.id });

//     res.status(200).json({ message: 'Blog deleted successfully.' });
//   } catch (error) {
//     console.error('Error deleting blog:', error);
//     res.status(500).json({ error: 'Error deleting blog.' });
//   }
// };


// // GET: Fetch all unique categories
// const getAllCategories = async (req, res) => {
//   try {
//     const categories = await Blog.distinct('category');
//     res.status(200).json(categories);
//   } catch (error) {
//     console.error(error);
//     res.status(500).json({ error: 'Error fetching categories.' });
//   }
// };

// module.exports = {
//   addBlog,
//   getAllBlogs,
//   getBlogsByCategory,
//   getBlogById,
//   updateBlog,
//   deleteBlog,
//   getAllCategories, // Export the new method
// };









const Blog = require('../models/Blog');
const cloudinary = require('../utils/cloudinary'); // Import Cloudinary configuration
const multer = require('multer'); // Import multer

// Use memory storage for Cloudinary image upload
const upload = multer({ storage: multer.memoryStorage() });

// POST: Add a new blog
const addBlog = async (req, res) => {
  const { title, description, category, author } = req.body;
  const imageFile = req.file;

  if (!imageFile) {
    return res.status(400).json({ error: 'Image is required.' });
  }

  try {
    // Upload image to Cloudinary using upload_stream for buffer
    cloudinary.uploader.upload_stream(
      {
        resource_type: 'auto', // Automatically detect file type (e.g., image, PDF, etc.)
      },
      async (error, uploadedImage) => {
        if (error) {
          console.error('Cloudinary upload failed:', error);
          return res.status(500).json({ error: 'Cloudinary upload failed', message: error.message });
        }

        // Create a new blog and save to database
        const newBlog = new Blog({
          title,
          description,
          category,
          author,
          image: uploadedImage.secure_url, // Store Cloudinary URL
        });

        await newBlog.save();
        res.status(201).json(newBlog);
      }
    ).end(imageFile.buffer); // Pass the buffer to Cloudinary's upload_stream

  } catch (error) {
    console.error('Error adding blog:', error);
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
      cloudinary.uploader.upload_stream(
        {
          resource_type: 'auto', // Automatically detect file type (e.g., image, PDF, etc.)
        },
        async (error, uploadedImage) => {
          if (error) {
            console.error('Cloudinary upload failed:', error);
            return res.status(500).json({ error: 'Cloudinary upload failed', message: error.message });
          }

          blog.image = uploadedImage.secure_url;
          await blog.save();
          res.status(200).json(blog);
        }
      ).end(imageFile.buffer); // Pass the buffer to Cloudinary's upload_stream
    } else {
      await blog.save(); // Save without updating the image if no file is uploaded
      res.status(200).json(blog);
    }
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

    // Delete the image from Cloudinary if it exists
    if (blog.image) {
      const uploadedImageUrl = blog.image;
      const publicId = uploadedImageUrl.split('/').slice(-2).join('/').split('.')[0]; // Extract publicId
      await cloudinary.uploader.destroy(publicId); // Delete the image from Cloudinary
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
