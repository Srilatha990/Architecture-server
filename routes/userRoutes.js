// const express = require('express');
// const multer = require('multer');
// const userController = require('../controllers/userController');
// const isAuth = require('../middlewares/auth');
// // Assuming you have a middleware for authentication

// // Setup multer for handling image upload
// const storage = multer.diskStorage({
//   destination: (req, file, cb) => {
//     cb(null, './uploads'); // Store files temporarily in 'uploads' directory
//   },
//   filename: (req, file, cb) => {
//     cb(null, Date.now() + '-' + file.originalname); // Generate unique filenames
//   },
// });
// const upload = multer({ storage });

// const router = express.Router();

// // User Registration
// router.post('/register', upload.single('profileImage'), userController.registerUser);

// // OTP Verification
// router.post('/verify-otp', userController.verifyOtp);

// // User Login
// router.post('/login', userController.loginUser);

// // Update User Details (Requires Authentication)
// router.put('/update', isAuth, upload.single('profileImage'), userController.updateUserDetails);
// router.post('/logout', isAuth, userController.logoutUser);


// // Get all users (Admin)
// router.get('/all-users', userController.getAllUsers);

// module.exports = router;



const express = require('express');
const multer = require('multer');
const userController = require('../controllers/userController');
const isAuth = require('../middlewares/auth');

const storage = multer.diskStorage({
    destination: (req, file, cb) => {
        cb(null, './uploads');
    },
    filename: (req, file, cb) => {
        cb(null, Date.now() + '-' + file.originalname);
    },
});
const upload = multer({ storage });

const router = express.Router();

// User Registration
router.post('/register', upload.single('profileImage'), userController.registerUser);

// OTP Verification
router.post('/verify-otp', userController.verifyOtp);

// User Login
router.post('/login', userController.loginUser);

// Update User Details (Authenticated)
router.put('/update', isAuth, upload.single('profileImage'), userController.updateUserDetails);

// Get Specific User Details (Authenticated)
router.get('/account', isAuth, userController.getUserDetails);

// Logout User
router.post('/logout', isAuth, userController.logoutUser);

// Get All Users (Admin)
router.get('/all-users', userController.getAllUsers);

module.exports = router;
