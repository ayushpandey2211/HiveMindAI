// controllers/chatController.js
const Chat = require('../models/Chat');
const { processQuery } = require('../services/llmService');

// @desc    Process a chat message and return consensus AI response
// @route   POST /api/chat
const handleChat = async (req, res) => {
    try {
        const { message } = req.body;
        const userId = req.user.id; // Comes from our JWT auth middleware

        if (!message) {
            return res.status(400).json({ message: 'Message content is required' });
        }

        // 1. Process the message through our Multi-LLM pipeline
        const aiResponse = await processQuery(message);

        // 2. Find the user's chat history, or create a new one if it doesn't exist
        let chat = await Chat.findOne({ userId });
        if (!chat) {
            chat = new Chat({ userId, messages: [] });
        }

        // 3. Append both the user's message and the AI's JSON response
        chat.messages.push({ role: 'user', content: message });
        chat.messages.push({ role: 'ai', content: aiResponse });

        // 4. Save to MongoDB
        await chat.save();

        // 5. Send the structured response back to the client
        res.status(200).json(aiResponse);

    } catch (error) {
        console.error("❌ Chat Controller Error:", error);
        res.status(error.status || 500).json({ 
            message: 'An error occurred while processing your request.',
            error: error.message 
        });
    }
};

module.exports = { handleChat };