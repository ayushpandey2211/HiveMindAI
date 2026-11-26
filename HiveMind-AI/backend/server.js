// Load environment variables from .env file
require('dotenv').config();

const express = require('express');
const cors = require('cors');

// ---------------------------------------------------------
// ✅ UNCOMMENTED: Database connection and Auth Routes are active
const connectDB = require('./config/db');
const authRoutes = require('./routes/authRoutes');

// TODO: We will uncomment this in Step 5 when we build the chat!
const chatRoutes = require('./routes/chatRoutes');
// ---------------------------------------------------------

// Initialize Express application
const app = express();

// --- Middleware ---
// Parse incoming JSON requests
app.use(express.json());
// Enable Cross-Origin Resource Sharing (allows frontend to talk to backend)
app.use(cors());

// --- Health Check Route ---
// Good practice to ensure the server is responding before hitting complex logic
app.get('/api/health', (req, res) => {
    res.status(200).json({ 
        status: 'success', 
        message: 'Multi-LLM Consensus AI Server is fully operational! 🚀' 
    });
});

// --- API Routes ---
// ✅ UNCOMMENTED: Authentication routes are now live
app.use('/api/auth', authRoutes);

// TODO: We will uncomment this in Step 5
 app.use('/api/chat', chatRoutes);

// --- Global Error Handling Middleware ---
// Catches any unhandled errors in the pipeline and returns a clean JSON response
app.use((err, req, res, next) => {
    console.error('Unhandled Error:', err.stack);
    res.status(500).json({ 
        message: 'An unexpected server error occurred.', 
        error: process.env.NODE_ENV === 'development' ? err.message : {} 
    });
});

// --- Server Initialization ---
const PORT = process.env.PORT || 5000;

const startServer = async () => {
    try {
        // ✅ UNCOMMENTED: Start the database connection
        await connectDB(); 
        
        app.listen(PORT, () => {
            console.log(`🚀 Server is running in ${process.env.NODE_ENV || 'development'} mode on port ${PORT}`);
        });
    } catch (error) {
        console.error('❌ Failed to start the server:', error);
        process.exit(1); // Exit process with failure
    }
};

startServer();