// controllers/serviceController.js
const Service = require('../models/Service');
const cloudinary = require('../utils/cloudinary'); // Import Cloudinary configuration

// POST route to add service with image upload
const addService = async (req, res) => {
  const { title, description } = req.body;
  const imageFile = req.file;

  if (!imageFile) {
    return res.status(400).json({ error: 'Image is required.' });
  }

  try {
    // Upload the image to Cloudinary
    const uploadedImage = await cloudinary.uploader.upload(imageFile.path);

    // Create a new service
    const newService = new Service({
      title,
      description,
      image: uploadedImage.secure_url, // Store the Cloudinary URL
    });

    await newService.save();
    res.status(201).json(newService);
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: 'Error adding service.' });
  }
};

// GET route to fetch all services
const getAllServices = async (req, res) => {
  try {
    const services = await Service.find();
    res.status(200).json(services);
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: 'Error fetching services.' });
  }
};

// GET route to fetch a single service by ID
const getServiceById = async (req, res) => {
  try {
    const service = await Service.findById(req.params.id);
    if (!service) {
      return res.status(404).json({ error: 'Service not found.' });
    }
    res.status(200).json(service);
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: 'Error fetching service.' });
  }
};

// PUT route to update service
const updateService = async (req, res) => {
  const { title, description } = req.body;
  const imageFile = req.file;

  try {
    const service = await Service.findById(req.params.id);
    if (!service) {
      return res.status(404).json({ error: 'Service not found.' });
    }

    // Update the service
    service.title = title || service.title;
    service.description = description || service.description;

    if (imageFile) {
      // Upload new image to Cloudinary if provided
      const uploadedImage = await cloudinary.uploader.upload(imageFile.path);
      service.image = uploadedImage.secure_url;
    }

    await service.save();
    res.status(200).json(service);
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: 'Error updating service.' });
  }
};

// DELETE route to remove service
const deleteService = async (req, res) => {
  try {
    const service = await Service.findById(req.params.id);
    if (!service) {
      return res.status(404).json({ error: 'Service not found.' });
    }

    // Delete the image from Cloudinary
    if (service.image) {
      const uploadedImageUrl = service.image;
      const publicId = uploadedImageUrl.split('/').slice(-2).join('/').split('.')[0];
      await cloudinary.uploader.destroy(publicId);
    }

    // Delete the service from the database
    await Service.deleteOne({ _id: req.params.id });

    res.status(200).json({ message: 'Service deleted successfully.' });
  } catch (error) {
    console.error('Error deleting service:', error);
    res.status(500).json({ error: 'Error deleting service.' });
  }
};



module.exports = {
  addService,
  getAllServices,
  getServiceById,
  updateService,
  deleteService,
};



