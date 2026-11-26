// routes/chatRoutes.js
const express = require('express');
const { handleChat } = require('../controllers/chatController');
const protect = require('../middleware/auth'); // Import our security middleware

const router = express.Router();

// Define the chat endpoint, protected by JWT authentication
router.post('/', protect, handleChat);

module.exports = router;