// utils/classifier.js

/**
 * Classifies a user query as 'simple' or 'complex'.
 * Simple queries (greetings) bypass the heavy multi-LLM pipeline.
 */
const classifyQuery = (message) => {
    const greetings = ['hi', 'hello', 'hey', 'greetings', 'good morning', 'good evening', 'who are you', 'how are you'];
    const msgLower = message.toLowerCase().trim();
    
    // Check if the message starts with a greeting and is relatively short
    const isGreeting = greetings.some(greeting => msgLower.startsWith(greeting));
    
    if (isGreeting && msgLower.length < 30) {
        return 'simple';
    }
    return 'complex';
};

module.exports = { classifyQuery };