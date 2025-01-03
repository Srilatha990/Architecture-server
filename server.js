// const express = require('express');
// const mongoose = require('mongoose');
// const dotenv = require('dotenv');
// const cors = require('cors');  // Import the cors package
// const serviceRoutes = require('./routes/serviceRoutes');
// const projectRoutes = require('./routes/projectRoutes');
// const blogRoutes = require('./routes/blogRoutes'); 
// const faqRoutes = require('./routes/faqRoutes');  // Import FAQ routes
// const userRoutes = require('./routes/userRoutes');
// const path = require('path');

// // Load environment variables
// dotenv.config();

// const app = express();

// // Middleware
// app.use(express.json());  // For parsing JSON request bodies

// // Enable CORS for all origins (or specify a particular origin)
// app.use(cors({ 
//   origin: ['http://localhost:3000', 'https://your-production-domain.com'] 
// }));
//  // Allow all origins (for development)
// // app.use(cors({ origin: 'http://localhost:3000' })); // Allow only frontend origin
// // app.use(cors({ origin: 'http://localhost:3000' }));
// // Connect to MongoDB
// mongoose.connect(process.env.MONGO_URI, { useNewUrlParser: true, useUnifiedTopology: true })
//   .then(() => console.log('Connected to MongoDB'))
//   .catch(err => console.error('MongoDB connection error:', err));

// // API Routes
// app.use('/api', serviceRoutes);
// app.use('/api', projectRoutes);
// app.use('/api', blogRoutes); // Use blog routes
// app.use('/api', faqRoutes);  // Use FAQ routes
// app.use('/api', userRoutes);



// // Serve static files (uploads)
// app.use('/uploads', express.static(path.join(__dirname, 'uploads')));

// // Start the server
// const PORT = process.env.PORT || 5000;
// app.listen(PORT, () => {
//   console.log(`Server is running on port ${PORT}`);
// });



const express = require('express');
const mongoose = require('mongoose');
const dotenv = require('dotenv');
const cors = require('cors');  // Import the cors package
const serviceRoutes = require('./routes/serviceRoutes');
const projectRoutes = require('./routes/projectRoutes');
const blogRoutes = require('./routes/blogRoutes'); 
const faqRoutes = require('./routes/faqRoutes');  // Import FAQ routes
const userRoutes = require('./routes/userRoutes');
const path = require('path');

// Load environment variables
dotenv.config();

const app = express();

// Middleware
app.use(express.json());  // For parsing JSON request bodies

// Enable CORS for all origins (or specify a particular origin)
app.use(cors({ 
  origin: ['http://localhost:3000', 'https://architecture-dashboard.vercel.app'] 
}));
// Allow all origins (for development)
// app.use(cors({ origin: 'http://localhost:3000' })); // Allow only frontend origin
// app.use(cors({ origin: 'http://localhost:3000' }));

// Connect to MongoDB (updated connection logic)
mongoose.connect(process.env.MONGO_URI)
  .then(() => console.log('Connected to MongoDB'))
  .catch(err => console.error('MongoDB connection error:', err));

// API Routes
app.use('/api', serviceRoutes);
app.use('/api', projectRoutes);
app.use('/api', blogRoutes); // Use blog routes
app.use('/api', faqRoutes);  // Use FAQ routes
app.use('/api', userRoutes);

// Serve static files (uploads)
app.use('/uploads', express.static(path.join(__dirname, 'uploads')));

// Start the server
const PORT = process.env.PORT || 5000;
app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`);
});
