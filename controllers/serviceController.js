// // controllers/serviceController.js
// const Service = require('../models/Service');
// const cloudinary = require('../utils/cloudinary'); // Import Cloudinary configuration

// // POST route to add service with image upload
// const addService = async (req, res) => {
//   const { title, description } = req.body;
//   const imageFile = req.file;

//   if (!imageFile) {
//     return res.status(400).json({ error: 'Image is required.' });
//   }

//   try {
//     // Upload the image to Cloudinary
//     const uploadedImage = await cloudinary.uploader.upload(imageFile.path);

//     // Create a new service
//     const newService = new Service({
//       title,
//       description,
//       image: uploadedImage.secure_url, // Store the Cloudinary URL
//     });

//     await newService.save();
//     res.status(201).json(newService);
//   } catch (error) {
//     console.error(error);
//     res.status(500).json({ error: 'Error adding service.' });
//   }
// };

// // GET route to fetch all services
// const getAllServices = async (req, res) => {
//   try {
//     const services = await Service.find();
//     res.status(200).json(services);
//   } catch (error) {
//     console.error(error);
//     res.status(500).json({ error: 'Error fetching services.' });
//   }
// };

// // GET route to fetch a single service by ID
// const getServiceById = async (req, res) => {
//   try {
//     const service = await Service.findById(req.params.id);
//     if (!service) {
//       return res.status(404).json({ error: 'Service not found.' });
//     }
//     res.status(200).json(service);
//   } catch (error) {
//     console.error(error);
//     res.status(500).json({ error: 'Error fetching service.' });
//   }
// };

// // PUT route to update service
// const updateService = async (req, res) => {
//   const { title, description } = req.body;
//   const imageFile = req.file;

//   try {
//     const service = await Service.findById(req.params.id);
//     if (!service) {
//       return res.status(404).json({ error: 'Service not found.' });
//     }

//     // Update the service
//     service.title = title || service.title;
//     service.description = description || service.description;

//     if (imageFile) {
//       // Upload new image to Cloudinary if provided
//       const uploadedImage = await cloudinary.uploader.upload(imageFile.path);
//       service.image = uploadedImage.secure_url;
//     }

//     await service.save();
//     res.status(200).json(service);
//   } catch (error) {
//     console.error(error);
//     res.status(500).json({ error: 'Error updating service.' });
//   }
// };

// // DELETE route to remove service
// const deleteService = async (req, res) => {
//   try {
//     const service = await Service.findById(req.params.id);
//     if (!service) {
//       return res.status(404).json({ error: 'Service not found.' });
//     }

//     // Delete the image from Cloudinary
//     if (service.image) {
//       const uploadedImageUrl = service.image;
//       const publicId = uploadedImageUrl.split('/').slice(-2).join('/').split('.')[0];
//       await cloudinary.uploader.destroy(publicId);
//     }

//     // Delete the service from the database
//     await Service.deleteOne({ _id: req.params.id });

//     res.status(200).json({ message: 'Service deleted successfully.' });
//   } catch (error) {
//     console.error('Error deleting service:', error);
//     res.status(500).json({ error: 'Error deleting service.' });
//   }
// };



// module.exports = {
//   addService,
//   getAllServices,
//   getServiceById,
//   updateService,
//   deleteService,
// };


const multer = require('multer'); // Import multer
const Service = require('../models/Service');
const cloudinary = require('../utils/cloudinary'); // Import Cloudinary configuration

// Set up multer for file upload
const upload = multer({ storage: multer.memoryStorage() }); // Use memoryStorage for Cloudinary upload

// Function to handle adding a service with Cloudinary image upload
const addService = async (req, res) => {
  try {
    console.log('Received body:', req.body); // Logs the non-file data (title, description)
    console.log('Received file:', req.file); // Logs the uploaded file (image)

    const { title, description } = req.body;
    const imageFile = req.file; // Image uploaded via multer

    if (!title || !description || !imageFile) {
      console.error('Missing required parameters');
      return res.status(400).json({ message: 'Missing required parameters' });
    }

    // Upload image to Cloudinary
    console.log('Uploading image to Cloudinary...');
    const uploadedImage = await cloudinary.uploader.upload(imageFile.buffer, {
      resource_type: 'auto', // Automatically detect file type
    });
    console.log('Cloudinary upload successful:', uploadedImage);

    // Save the service with the Cloudinary URL
    const service = new Service({
      title,
      description,
      image: uploadedImage.secure_url, // Save Cloudinary URL
    });

    await service.save();
    console.log('Service saved successfully:', service);
    return res.status(201).json(service); // Return the service object with the image URL

  } catch (error) {
    console.error('Error in adding service:', error); // Logs the error if the service creation fails
    return res.status(500).json({ message: 'Server error' });
  }
};

// Function to get all services
const getAllServices = async (req, res) => {
  try {
    console.log('Fetching all services...');
    const services = await Service.find();
    console.log('Fetched services:', services);
    res.status(200).json(services);
  } catch (error) {
    console.error('Error fetching services:', error);
    res.status(500).json({ error: 'Error fetching services.' });
  }
};

// Function to fetch a single service by ID
const getServiceById = async (req, res) => {
  try {
    console.log('Fetching service by ID:', req.params.id);
    const service = await Service.findById(req.params.id);
    if (!service) {
      console.error('Service not found:', req.params.id);
      return res.status(404).json({ error: 'Service not found.' });
    }
    console.log('Fetched service:', service);
    res.status(200).json(service);
  } catch (error) {
    console.error('Error fetching service:', error);
    res.status(500).json({ error: 'Error fetching service.' });
  }
};

// Function to update an existing service (including image)
const updateService = async (req, res) => {
  const { title, description } = req.body;
  const imageFile = req.file; // This will be populated by multer

  try {
    console.log('Fetching service for update by ID:', req.params.id);
    const service = await Service.findById(req.params.id);
    if (!service) {
      console.error('Service not found:', req.params.id);
      return res.status(404).json({ error: 'Service not found.' });
    }

    // Update the service fields
    service.title = title || service.title;
    service.description = description || service.description;

    // If there's a new image, upload it to Cloudinary
    if (imageFile) {
      console.log('Uploading new image to Cloudinary...');
      const uploadedImage = await cloudinary.uploader.upload(imageFile.buffer, {
        resource_type: 'auto', // Automatically detect file type
      });
      console.log('Cloudinary upload successful:', uploadedImage);
      service.image = uploadedImage.secure_url;
    }

    await service.save();
    console.log('Service updated successfully:', service);
    res.status(200).json(service);
  } catch (error) {
    console.error('Error updating service:', error);
    res.status(500).json({ error: 'Error updating service.' });
  }
};

// Function to delete a service and its image from Cloudinary
const deleteService = async (req, res) => {
  try {
    console.log('Fetching service to delete by ID:', req.params.id);
    const service = await Service.findById(req.params.id);
    if (!service) {
      console.error('Service not found:', req.params.id);
      return res.status(404).json({ error: 'Service not found.' });
    }

    // Delete the image from Cloudinary (if any)
    if (service.image) {
      const uploadedImageUrl = service.image;
      const publicId = uploadedImageUrl.split('/').slice(-2).join('/').split('.')[0]; // Extract public ID
      console.log('Deleting image from Cloudinary with public ID:', publicId);
      await cloudinary.uploader.destroy(publicId); // Delete the image from Cloudinary
      console.log('Cloudinary image deleted successfully');
    }

    // Delete the service from the database
    await Service.deleteOne({ _id: req.params.id });
    console.log('Service deleted successfully:', req.params.id);

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
