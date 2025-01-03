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
const Project = require('../models/Project'); // Import the Project model
const cloudinary = require('../utils/cloudinary'); // Import Cloudinary configuration

// Set up multer for file upload
const upload = multer({ storage: multer.memoryStorage() }); // Use memoryStorage for Cloudinary upload

// POST route to add project with image upload
const addProject = async (req, res) => {
  try {
    console.log('Received body:', req.body); // Logs the non-file data (title, description)
    console.log('Received file:', req.file); // Logs the uploaded file (image)

    const { title, description } = req.body;
    const imageFile = req.file; // Image uploaded via multer

    if (!title || !description || !imageFile) {
      return res.status(400).json({ message: 'Missing required parameters' });
    }

    // Upload the image directly to Cloudinary
    const uploadedImage = await cloudinary.uploader.upload(imageFile.buffer, {
      resource_type: 'auto', // Automatically detect file type (e.g., image, PDF, etc.)
    });

    // Create a new project
    const project = new Project({
      title,
      description,
      image: uploadedImage.secure_url, // Store the Cloudinary URL
    });

    await project.save();
    return res.status(201).json(project);
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

// PUT route to update project
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

    // If there's a new image, upload it to Cloudinary
    if (imageFile) {
      const uploadedImage = await cloudinary.uploader.upload(imageFile.buffer, {
        resource_type: 'auto', // Automatically detect file type (e.g., image, PDF, etc.)
      });
      project.image = uploadedImage.secure_url;
    }

    await project.save();
    res.status(200).json(project);
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: 'Error updating project.' });
  }
};

// DELETE route to remove project
const deleteProject = async (req, res) => {
  try {
    const project = await Project.findById(req.params.id);
    if (!project) {
      return res.status(404).json({ error: 'Project not found.' });
    }

    // Delete the image from Cloudinary
    if (project.image) {
      const uploadedImageUrl = project.image;
      const publicId = uploadedImageUrl.split('/').slice(-2).join('/').split('.')[0];
      await cloudinary.uploader.destroy(publicId);
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
