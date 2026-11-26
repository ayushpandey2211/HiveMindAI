// middleware/auth.js
const jwt = require('jsonwebtoken');

const protect = (req, res, next) => {
    // 1. Get the token from the request headers
    let token = req.header('Authorization');

    // 2. Check if no token exists or if it doesn't start with 'Bearer '
    if (!token || !token.startsWith('Bearer ')) {
        return res.status(401).json({ message: 'Not authorized, no token provided' });
    }

    try {
        // 3. Extract the actual token string (remove "Bearer ")
        token = token.split(' ')[1];

        // 4. Verify the token using our secret key
        const decoded = jwt.verify(token, process.env.JWT_SECRET);

        // 5. Attach the decoded user payload (which contains the user ID) to the request object
        req.user = decoded; 
        
        // 6. Move on to the next middleware or controller (in this case, chatController)
        next();
    } catch (error) {
        res.status(401).json({ message: 'Not authorized, invalid token' });
    }
};

module.exports = protect;