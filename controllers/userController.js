
// const User = require('../models/User');
// const bcrypt = require('bcryptjs');
// const jwt = require('jsonwebtoken');
// const { sendEmail } = require('../utils/emailservice');
// const cloudinary = require('../utils/cloudinary');
// const JWT_SECRET = process.env.JWT_SECRET;

// // Register
// const registerUser = async (req, res) => {
//     const { FirstName, LastName, email, phoneNumber, password, confirmpassword } = req.body;
//     const imageFile = req.file;

//     if (password !== confirmpassword) {
//         return res.status(400).json({ message: 'Passwords do not match' });
//     }

//     try {
//         const existingUser = await User.findOne({ email });
//         if (existingUser) {
//             return res.status(400).json({ message: 'User already exists' });
//         }

//         const hashedPassword = await bcrypt.hash(password, 10);
//         const otp = Math.floor(100000 + Math.random() * 900000).toString();

//         let profileImageUrl = null;
//         if (imageFile) {
//             // Upload the image to Cloudinary
//             const uploadedImage = await cloudinary.uploader.upload(imageFile.path, {
//                 folder: './uploads', // Save in the 'uploads' folder in Cloudinary
//             });
//             profileImageUrl = uploadedImage.secure_url;
//         }

//         const newUser = new User({
//             FirstName,
//             LastName,
//             email,
//             phoneNumber,
//             password: hashedPassword,
//             confirmpassword: hashedPassword,
//             otp,
//             profileImage: profileImageUrl,
//         });

//         await newUser.save();

//         const emailContent = `Hi ${FirstName} ${LastName},\n\nThank you for registering! Please use this OTP to verify your email:\n\n${otp}`;
//         await sendEmail(email, 'Verify Your Email', emailContent);

//         res.status(201).json({ message: 'User registered successfully. Verify OTP sent to your email.' });
//     } catch (error) {
//         res.status(500).json({ message: 'User registration failed', error: error.message });
//     }
// };

// // Verify OTP
// const verifyOtp = async (req, res) => {
//     const { otp } = req.body;

//     try {
//         const user = await User.findOne({ otp });

//         if (!user || user.otp !== otp) {
//             return res.status(400).json({ message: 'Invalid OTP!' });
//         }

//         user.isVerified = true;
//         user.otp = null;
//         await user.save();

//         res.status(200).json({ message: 'Account verified successfully!' });
//     } catch (error) {
//         res.status(500).json({ message: 'OTP verification failed', error });
//     }
// };

// // Login
// const loginUser = async (req, res) => {
//     const { email, password } = req.body;

//     try {
//         const user = await User.findOne({ email });
//         if (!user) {
//             return res.status(404).json({ message: 'User not found' });
//         }

//         const isMatch = await bcrypt.compare(password, user.password);
//         if (!isMatch) {
//             return res.status(400).json({ message: 'Invalid credentials' });
//         }

//         const token = jwt.sign({ id: user._id }, JWT_SECRET, { expiresIn: '1d' });
//         res.status(200).json({ token, user });
//     } catch (error) {
//         res.status(500).json({ message: 'Failed to login', error });
//     }
// };

// // Update User Details
// const updateUserDetails = async (req, res) => {
//     const userId = req.user.id; // Assuming user is authenticated and their ID is available in the JWT token
//     const { FirstName, LastName, phoneNumber } = req.body;
//     const imageFile = req.file;
//     let profileImageUrl = null;

//     try {
//         const user = await User.findById(userId);
//         if (!user) {
//             return res.status(404).json({ message: 'User not found' });
//         }

//         // Update the user details
//         user.FirstName = FirstName || user.FirstName;
//         user.LastName = LastName || user.LastName;
//         user.phoneNumber = phoneNumber || user.phoneNumber;

//         // Upload new image to Cloudinary if a new image is provided
//         if (imageFile) {
//             const uploadedImage = await cloudinary.uploader.upload(imageFile.path, {
//                 folder: './uploads', // Save in the 'uploads' folder in Cloudinary
//             });
//             profileImageUrl = uploadedImage.secure_url;
//             user.profileImage = profileImageUrl;
//         }

//         await user.save();
//         res.status(200).json({ message: 'User details updated successfully', user });
//     } catch (error) {
//         res.status(500).json({ message: 'Failed to update user details', error });
//     }
// };

// // Logout
// const logoutUser = (req, res) => {
//     res.status(200).json({ message: 'Logout successful' });
// };

// // Get all users (Admin)
// const getAllUsers = async (req, res) => {
//     try {
//         const users = await User.find();
//         res.status(200).json(users);
//     } catch (error) {
//         res.status(500).json({ message: 'Failed to fetch users', error });
//     }
// };

// module.exports = {
//     registerUser,
//     verifyOtp,
//     loginUser,
//     updateUserDetails,
//     logoutUser,
//     getAllUsers
// };




const User = require('../models/User');
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const { sendEmail } = require('../utils/emailservice');
const cloudinary = require('../utils/cloudinary');
const JWT_SECRET = process.env.JWT_SECRET;

// Register
const registerUser = async (req, res) => {
    const { FirstName, LastName, email, phoneNumber, password, confirmpassword } = req.body;
    const imageFile = req.file;

    if (password !== confirmpassword) {
        return res.status(400).json({ message: 'Passwords do not match' });
    }

    try {
        const existingUser = await User.findOne({ email });
        if (existingUser) {
            return res.status(400).json({ message: 'User already exists' });
        }

        const hashedPassword = await bcrypt.hash(password, 10);
        const otp = Math.floor(100000 + Math.random() * 900000).toString();

        let profileImageUrl = null;
        if (imageFile) {
            const uploadedImage = await cloudinary.uploader.upload(imageFile.path, {
                folder: './uploads',
            });
            profileImageUrl = uploadedImage.secure_url;
        }

        const newUser = new User({
            FirstName,
            LastName,
            email,
            phoneNumber,
            password: hashedPassword,
            confirmpassword: hashedPassword,
            otp,
            profileImage: profileImageUrl,
        });

        await newUser.save();

        const emailContent = `Hi ${FirstName} ${LastName},\n\nThank you for registering! Please use this OTP to verify your email:\n\n${otp}`;
        await sendEmail(email, 'Verify Your Email', emailContent);

        res.status(201).json({ message: 'User registered successfully. Verify OTP sent to your email.' });
    } catch (error) {
        res.status(500).json({ message: 'User registration failed', error: error.message });
    }
};

// Verify OTP
const verifyOtp = async (req, res) => {
    const { otp } = req.body;

    try {
        const user = await User.findOne({ otp });

        if (!user || user.otp !== otp) {
            return res.status(400).json({ message: 'Invalid OTP!' });
        }

        user.isVerified = true;
        user.otp = null;
        await user.save();

        res.status(200).json({ message: 'Account verified successfully!' });
    } catch (error) {
        res.status(500).json({ message: 'OTP verification failed', error });
    }
};

// Login
const loginUser = async (req, res) => {
    const { email, password } = req.body;

    try {
        const user = await User.findOne({ email });
        if (!user) {
            return res.status(404).json({ message: 'User not found' });
        }

        const isMatch = await bcrypt.compare(password, user.password);
        if (!isMatch) {
            return res.status(400).json({ message: 'Invalid credentials' });
        }

        const token = jwt.sign({ id: user._id }, JWT_SECRET, { expiresIn: '1d' });
        res.status(200).json({ token, user });
    } catch (error) {
        res.status(500).json({ message: 'Failed to login', error });
    }
};

// Fetch User Details (Account Page)
const getUserDetails = async (req, res) => {
    const userId = req.user.id; // Assuming authenticated user's ID is fetched from JWT

    try {
        const user = await User.findById(userId).select('-password -otp'); // Exclude sensitive fields
        if (!user) {
            return res.status(404).json({ message: 'User not found' });
        }

        res.status(200).json(user);
    } catch (error) {
        res.status(500).json({ message: 'Failed to fetch user details', error });
    }
};

// Update User Details
const updateUserDetails = async (req, res) => {
    const userId = req.user.id; // Assuming user ID is fetched from the authenticated JWT
    const { FirstName, LastName, phoneNumber, email } = req.body; // Include email in the request body
    const imageFile = req.file;
    let profileImageUrl = null;

    try {
        const user = await User.findById(userId);
        if (!user) {
            return res.status(404).json({ message: 'User not found' });
        }

        // Check if the new email is already in use
        if (email && email !== user.email) {
            const existingUser = await User.findOne({ email });
            if (existingUser) {
                return res.status(400).json({ message: 'Email is already in use' });
            }
            user.email = email; // Update the email
        }

        // Update the user details
        user.FirstName = FirstName || user.FirstName;
        user.LastName = LastName || user.LastName;
        user.phoneNumber = phoneNumber || user.phoneNumber;

        // Upload new image to Cloudinary if a new image is provided
        if (imageFile) {
            const uploadedImage = await cloudinary.uploader.upload(imageFile.path, {
                folder: './uploads',
            });
            profileImageUrl = uploadedImage.secure_url;
            user.profileImage = profileImageUrl;
        }

        await user.save();
        res.status(200).json({ message: 'User details updated successfully', user });
    } catch (error) {
        res.status(500).json({ message: 'Failed to update user details', error });
    }
};

// Logout
const logoutUser = (req, res) => {
    res.status(200).json({ message: 'Logout successful' });
};

// Get All Users (Admin)
const getAllUsers = async (req, res) => {
    try {
        const users = await User.find();
        res.status(200).json(users);
    } catch (error) {
        res.status(500).json({ message: 'Failed to fetch users', error });
    }
};

module.exports = {
    registerUser,
    verifyOtp,
    loginUser,
    getUserDetails,
    updateUserDetails,
    logoutUser,
    getAllUsers,
};
