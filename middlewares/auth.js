



// const jwt = require("jsonwebtoken");
// const User = require('../models/User');
// const JWT_SECRET = process.env.JWT_SECRET;

// const isAuth = async (req, res, next) => {
//     // Get token from Authorization header
//     const token = req.headers.authorization && req.headers.authorization.split(' ')[1];

//     if (!token) {
//         return res.status(408).json({
//             success: false,
//             message: "Session expired. Please login."
//         });
//     }

//     try {
//         // Decode the token
//         const decoded = jwt.verify(token, JWT_SECRET);

//         // Fetch the user based on the decoded token
//         const user = await User.findById(decoded.id);

//         if (!user) {
//             return res.status(404).json({
//                 success: false,
//                 message: "User not found."
//             });
//         }

//         // Attach user to the request object
//         req.user = user;

//         // Proceed to the next middleware
//         next();
//     } catch (error) {
//         console.error("Authentication error:", error);
//         return res.status(401).json({
//             success: false,
//             message: "Invalid or expired token."
//         });
//     }
// };

// module.exports = isAuth;




const jwt = require("jsonwebtoken");
const User = require('../models/User');
const JWT_SECRET = process.env.JWT_SECRET;

const isAuth = async (req, res, next) => {
    // Get token from Authorization header
    const token = req.headers.authorization && req.headers.authorization.split(' ')[1];

    if (!token) {
        return res.status(408).json({
            success: false,
            message: "Session expired. Please login."
        });
    }

    try {
        // Decode the token
        const decoded = jwt.verify(token, JWT_SECRET);

        // Log decoded information for debugging
        console.log("Decoded Token:", decoded);  // Should show { id: user._id }

        // Fetch the user based on the decoded token
        const user = await User.findById(decoded.id);

        if (!user) {
            return res.status(404).json({
                success: false,
                message: "User not found."
            });
        }

        // Attach user to the request object
        req.user = user;

        // Proceed to the next middleware
        next();
    } catch (error) {
        console.error("Authentication error:", error);
        return res.status(401).json({
            success: false,
            message: "Invalid or expired token."
        });
    }
};

module.exports = isAuth;
