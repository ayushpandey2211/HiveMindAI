const axios = require('axios');
const { classifyQuery } = require('../utils/classifier');

// JSON extractor
const extractJSON = (text) => {
    const match = text.match(/\{[\s\S]*\}/);
    return match ? match[0] : null;
};

// Detect coding query
const isCodeQuery = (text) => {
    return /array|code|function|program|algorithm|input|output|leetcode|problem/i.test(text);
};

// Groq call
const callGroq = async (modelName, systemPrompt, userMessage) => {
    try {
        const response = await axios.post(
            'https://api.groq.com/openai/v1/chat/completions',
            {
                model: modelName,
                messages: [
                    { role: "system", content: systemPrompt },
                    { role: "user", content: userMessage }
                ],
                temperature: 0.4,
                max_tokens: 800
            },
            {
                headers: {
                    Authorization: `Bearer ${process.env.GROQ_API_KEY}`,
                    'Content-Type': 'application/json'
                }
            }
        );

        return response.data.choices[0].message.content;
    } catch (error) {
        console.error(`❌ Groq Error (${modelName}):`, error.message);
        return "";
    }
};

const processQuery = async (userMessage) => {
    const queryType = classifyQuery(userMessage);
    const codeQuery = isCodeQuery(userMessage);

    // ================= SIMPLE =================
    if (queryType === 'simple') {
        const simple = await callGroq(
            "llama-3.1-8b-instant",
            `You are a friendly assistant. Reply naturally and briefly.`,
            userMessage
        );

        return {
            final_answer: simple,
            confidence: 100,
            reasoning: "Simple conversational query"
        };
    }

    // ================= COMPLEX =================

    // 🧠 LOGIC AGENT
    const logicPrompt = `
You are a highly logical AI.

If this is a coding problem:
- Identify the correct algorithm
- Explain approach step-by-step
- Focus on correctness and efficiency

If not:
- Give structured reasoning

Do NOT generate full code here.
`;

    // 🎨 CREATIVE AGENT
    const creativePrompt = `
You are a creative AI.

- Add intuition and examples
- Explain in easier way
- Provide alternative thinking

Do NOT repeat logic answer.
`;

    const [logicResponse, creativeResponse] = await Promise.all([
        callGroq("llama-3.1-8b-instant", logicPrompt, userMessage),
        callGroq("llama-3.3-70b-versatile", creativePrompt, userMessage)
    ]);

    // 🔍 CRITIC
    const criticPrompt = `
You are a strict critic.

Evaluate both answers:

- Accuracy
- Missing parts
- Weak logic

Return clear issues and improvements.
`;

    const critique = await callGroq(
        "llama-3.1-8b-instant",
        criticPrompt,
        `Query: ${userMessage}

Logic:
${logicResponse}

Creative:
${creativeResponse}`
    );

    // 🔥 DEBATE (NOW CODE-AWARE)
    const debatePrompt = `
You are an advanced AI problem solver.

If this is a coding problem:
- Convert best solution into working code
- Ensure correctness and efficiency

Otherwise:
- refine explanation

Use:
Logic + Creative + Critique

Return best improved solution.
`;

    const debatedAnswer = await callGroq(
        "llama-3.3-70b-versatile",
        debatePrompt,
        `Query: ${userMessage}

Logic:
${logicResponse}

Creative:
${creativeResponse}

Critique:
${critique}`
    );

    // 🧑‍⚖️ FINAL JUDGE (CRITICAL FIX)
    const judgePrompt = `
You are a final AI judge.

User Query:
${userMessage}

Answer:
${debatedAnswer}

IMPORTANT:

1. Detect user intent:
- If coding problem → RETURN CODE
- Else → return explanation

2. IF CODING:
- Provide clean working code
- Include function
- Use C++ by default (unless specified)

3. OUTPUT RULES:
- Return ONLY JSON
- No markdown
- No extra text

FORMAT:
{
  "final_answer": "code OR explanation",
  "confidence": number (0-100),
  "reasoning": "why this is correct"
}
`;

    const finalOutput = await callGroq(
        "llama-3.3-70b-versatile",
        judgePrompt,
        debatedAnswer
    );

    try {
        const extracted = extractJSON(finalOutput);
        if (!extracted) throw new Error();

        return JSON.parse(extracted);
    } catch {
        return {
            final_answer: debatedAnswer,
            confidence: 80,
            reasoning: "Fallback after debate"
        };
    }
};

module.exports = { processQuery };