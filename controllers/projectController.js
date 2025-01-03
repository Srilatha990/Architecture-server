// // controllers/projectController.js
// const Project = require('../models/Project');
// const cloudinary = require('../utils/cloudinary'); // Import Cloudinary configuration

// // POST route to add a project with image upload
// const addProject = async (req, res) => {
//   const { title, description } = req.body;
//   const imageFile = req.file;

//   if (!imageFile) {
//     return res.status(400).json({ error: 'Image is required.' });
//   }

//   try {
//     // Upload the image to Cloudinary
//     const uploadedImage = await cloudinary.uploader.upload(imageFile.path);

//     // Create a new project
//     const newProject = new Project({
//       title,
//       description,
//       image: uploadedImage.secure_url, // Store the Cloudinary URL
//     });

//     await newProject.save();
//     res.status(201).json(newProject);
//   } catch (error) {
//     console.error(error);
//     res.status(500).json({ error: 'Error adding project.' });
//   }
// };

// // GET route to fetch all projects
// const getAllProjects = async (req, res) => {
//   try {
//     const projects = await Project.find();
//     res.status(200).json(projects);
//   } catch (error) {
//     console.error(error);
//     res.status(500).json({ error: 'Error fetching projects.' });
//   }
// };

// // GET route to fetch a single project by ID
// const getProjectById = async (req, res) => {
//   try {
//     const project = await Project.findById(req.params.id);
//     if (!project) {
//       return res.status(404).json({ error: 'Project not found.' });
//     }
//     res.status(200).json(project);
//   } catch (error) {
//     console.error(error);
//     res.status(500).json({ error: 'Error fetching project.' });
//   }
// };

// // PUT route to update a project
// const updateProject = async (req, res) => {
//   const { title, description } = req.body;
//   const imageFile = req.file;

//   try {
//     const project = await Project.findById(req.params.id);
//     if (!project) {
//       return res.status(404).json({ error: 'Project not found.' });
//     }

//     // Update the project
//     project.title = title || project.title;
//     project.description = description || project.description;

//     if (imageFile) {
//       // Upload new image to Cloudinary if provided
//       const uploadedImage = await cloudinary.uploader.upload(imageFile.path);
//       project.image = uploadedImage.secure_url;
//     }

//     await project.save();
//     res.status(200).json(project);
//   } catch (error) {
//     console.error(error);
//     res.status(500).json({ error: 'Error updating project.' });
//   }
// };

// // DELETE route to remove a project
// const deleteProject = async (req, res) => {
//   try {
//     const project = await Project.findById(req.params.id);
//     if (!project) {
//       return res.status(404).json({ error: 'Project not found.' });
//     }

//     // Optionally, delete the image from Cloudinary
//     if (project.image) {
//       const publicId = project.image.split('/').pop().split('.')[0];
//       await cloudinary.uploader.destroy(publicId);
//     }

//     // Delete the project from the database
//     await Project.deleteOne({ _id: req.params.id });

//     res.status(200).json({ message: 'Project deleted successfully.' });
//   } catch (error) {
//     console.error('Error deleting project:', error);
//     res.status(500).json({ error: 'Error deleting project.' });
//   }
// };


// module.exports = {
//   addProject,
//   getAllProjects,
//   getProjectById,
//   updateProject,
//   deleteProject,
// };




const multer = require('multer'); // Import multer
const Project = require('../models/Project');
const cloudinary = require('../utils/cloudinary'); // Import Cloudinary configuration

// Set up multer for file upload (using memory storage for Cloudinary)
const upload = multer({ storage: multer.memoryStorage() }); // Use memoryStorage for Cloudinary upload

// POST route to add a project with image upload
const addProject = async (req, res) => {
  try {
    console.log('Received body:', req.body); // Logs the non-file data (title, description)
    console.log('Received file:', req.file); // Logs the uploaded file (image)

    const { title, description } = req.body;
    const imageFile = req.file; // Image uploaded via multer

    if (!title || !description || !imageFile) {
      return res.status(400).json({ message: 'Missing required parameters' });
    }

    // Debug: Check if file exists and log the buffer size
    console.log(`Image Buffer Size: ${imageFile.buffer.length} bytes`);

    // Upload image to Cloudinary using upload_stream for buffer
    cloudinary.uploader.upload_stream(
      {
        resource_type: 'auto', // Automatically detect file type (e.g., image, video, etc.)
      },
      async (error, uploadedImage) => {
        if (error) {
          console.error('Cloudinary upload failed:', error);
          return res.status(500).json({ message: 'Cloudinary upload failed', error: error.message });
        }

        console.log('Cloudinary upload successful:', uploadedImage);

        // Create a new project
        const newProject = new Project({
          title,
          description,
          image: uploadedImage.secure_url, // Store the Cloudinary URL
        });

        await newProject.save();
        return res.status(201).json(newProject); // Return the project with image URL
      }
    ).end(imageFile.buffer); // Pass the buffer to Cloudinary's upload_stream
  } catch (error) {
    console.error('Error in adding project:', error); // Logs the error if the project creation fails
    return res.status(500).json({ message: 'Server error' });
  }
};

// GET route to fetch all projects
const getAllProjects = async (req, res) => {
  try {
    const projects = await Project.find();
    res.status(200).json(projects);
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: 'Error fetching projects.' });
  }
};

// GET route to fetch a single project by ID
const getProjectById = async (req, res) => {
  try {
    const project = await Project.findById(req.params.id);
    if (!project) {
      return res.status(404).json({ error: 'Project not found.' });
    }
    res.status(200).json(project);
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: 'Error fetching project.' });
  }
};

// PUT route to update a project
const updateProject = async (req, res) => {
  const { title, description } = req.body;
  const imageFile = req.file; // This will be populated by multer

  try {
    const project = await Project.findById(req.params.id);
    if (!project) {
      return res.status(404).json({ error: 'Project not found.' });
    }

    // Update the project fields
    project.title = title || project.title;
    project.description = description || project.description;

    // If there's a new image, upload it to Cloudinary using upload_stream
    if (imageFile) {
      cloudinary.uploader.upload_stream(
        {
          resource_type: 'auto', // Automatically detect file type
        },
        async (error, uploadedImage) => {
          if (error) {
            console.error('Cloudinary upload failed:', error);
            return res.status(500).json({ message: 'Cloudinary upload failed', error: error.message });
          }

          project.image = uploadedImage.secure_url; // Update the image field with Cloudinary URL
          await project.save();
          res.status(200).json(project);
        }
      ).end(imageFile.buffer); // Pass the buffer to Cloudinary's upload_stream
    } else {
      // Save without updating the image if no file is uploaded
      await project.save();
      res.status(200).json(project);
    }
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: 'Error updating project.' });
  }
};

// DELETE route to remove a project
const deleteProject = async (req, res) => {
  try {
    const project = await Project.findById(req.params.id);
    if (!project) {
      return res.status(404).json({ error: 'Project not found.' });
    }

    // Delete the image from Cloudinary if it exists
    if (project.image) {
      const uploadedImageUrl = project.image;
      const publicId = uploadedImageUrl.split('/').slice(-2).join('/').split('.')[0]; // Extract publicId from URL
      await cloudinary.uploader.destroy(publicId); // Delete image from Cloudinary
    }

    // Delete the project from the database
    await Project.deleteOne({ _id: req.params.id });

    res.status(200).json({ message: 'Project deleted successfully.' });
  } catch (error) {
    console.error('Error deleting project:', error);
    res.status(500).json({ error: 'Error deleting project.' });
  }
};

module.exports = {
  addProject,
  getAllProjects,
  getProjectById,
  updateProject,
  deleteProject,
};
