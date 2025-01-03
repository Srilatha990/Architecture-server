// controllers/projectController.js
const Project = require('../models/Project');
const cloudinary = require('../utils/cloudinary'); // Import Cloudinary configuration

// POST route to add a project with image upload
const addProject = async (req, res) => {
  const { title, description } = req.body;
  const imageFile = req.file;

  if (!imageFile) {
    return res.status(400).json({ error: 'Image is required.' });
  }

  try {
    // Upload the image to Cloudinary
    const uploadedImage = await cloudinary.uploader.upload(imageFile.path);

    // Create a new project
    const newProject = new Project({
      title,
      description,
      image: uploadedImage.secure_url, // Store the Cloudinary URL
    });

    await newProject.save();
    res.status(201).json(newProject);
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: 'Error adding project.' });
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
  const imageFile = req.file;

  try {
    const project = await Project.findById(req.params.id);
    if (!project) {
      return res.status(404).json({ error: 'Project not found.' });
    }

    // Update the project
    project.title = title || project.title;
    project.description = description || project.description;

    if (imageFile) {
      // Upload new image to Cloudinary if provided
      const uploadedImage = await cloudinary.uploader.upload(imageFile.path);
      project.image = uploadedImage.secure_url;
    }

    await project.save();
    res.status(200).json(project);
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

    // Optionally, delete the image from Cloudinary
    if (project.image) {
      const publicId = project.image.split('/').pop().split('.')[0];
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
