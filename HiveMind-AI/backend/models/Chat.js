// models/Chat.js
const mongoose = require('mongoose');

// Schema for individual messages within a chat
const MessageSchema = new mongoose.Schema({
    role: { 
        type: String, 
        enum: ['user', 'ai'], // Only allow these two roles
        required: true 
    },
    content: { 
        type: mongoose.Schema.Types.Mixed, // Allows storing text for users, and JSON objects for the AI
        required: true 
    }, 
    timestamp: { 
        type: Date, 
        default: Date.now 
    }
});

// Main Chat Schema linking to a specific user
const ChatSchema = new mongoose.Schema({
    userId: { 
        type: mongoose.Schema.Types.ObjectId, 
        ref: 'User', // Creates a relationship with the User model
        required: true 
    },
    messages: [MessageSchema] // Array of message sub-documents
}, { 
    timestamps: true 
});

module.exports = mongoose.model('Chat', ChatSchema);