// Load environment variables from .env file
require('dotenv').config();

const express = require('express');
const cors = require('cors');

// ---------------------------------------------------------
// ✅ UNCOMMENTED: Database connection and Auth Routes are active
const connectDB = require('./config/db');
const authRoutes = require('./routes/authRoutes');

const chatRoutes = require('./routes/chatRoutes');
// ---------------------------------------------------------

// Fail fast with a clear message if required config is missing
const required = ['MONGO_URI', 'JWT_SECRET', 'GROQ_API_KEY'];
const missing = required.filter((k) => !process.env[k]);
if (missing.length) {
    console.error(`❌ Missing required env vars: ${missing.join(', ')}`);
    console.error('   Copy backend/.env.example to backend/.env and fill them in.');
    process.exit(1);
}

// Initialize Express application
const app = express();

// --- Middleware ---
// Parse incoming JSON requests
app.use(express.json());
// Enable Cross-Origin Resource Sharing (allows frontend to talk to backend)
// CLIENT_ORIGIN (comma-separated) restricts CORS; unset = allow all (dev)
const origins = process.env.CLIENT_ORIGIN
    ? process.env.CLIENT_ORIGIN.split(',').map((o) => o.trim())
    : true;
app.use(cors({ origin: origins }));

// --- Health Check Route ---
// Good practice to ensure the server is responding before hitting complex logic
app.get('/api/health', (req, res) => {
    res.status(200).json({ 
        status: 'success', 
        message: 'HiveMind AI Server is fully operational! 🚀' 
    });
});

// --- API Routes ---
// ✅ UNCOMMENTED: Authentication routes are now live
app.use('/api/auth', authRoutes);

app.use('/api/chat', chatRoutes);

// --- Serve the built website (frontend/dist) when it exists ---
// Lets you run only the backend and open http://localhost:5000
const path = require('path');
const fs = require('fs');
const distDir = path.join(__dirname, '..', 'frontend', 'dist');
if (fs.existsSync(path.join(distDir, 'index.html'))) {
    app.use(express.static(distDir));
    // Single-page-app fallback so deep links like /dashboard work on refresh
    app.use((req, res, next) => {
        if (req.method !== 'GET' || req.path.startsWith('/api')) return next();
        res.sendFile(path.join(distDir, 'index.html'));
    });
    console.log('🌐 Serving built website from frontend/dist');
}

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