const axios = require('axios');
const { classifyQuery } = require('../utils/classifier');

// Groq retired the Llama 3.1 8B / 3.3 70B models on 16 Aug 2026.
// Override these in .env if Groq changes its lineup again.
const FAST_MODEL = process.env.LLM_FAST_MODEL || 'openai/gpt-oss-20b';
const STRONG_MODEL = process.env.LLM_STRONG_MODEL || 'openai/gpt-oss-120b';

// JSON extractor
const extractJSON = (text) => {
    const match = text.match(/\{[\s\S]*\}/);
    return match ? match[0] : null;
};

// Detect coding query
const isCodeQuery = (text) => {
    return /array|code|function|program|algorithm|input|output|leetcode|problem/i.test(text);
};

// Wait helper + how long Groq asks us to wait after a rate limit (429)
const sleep = (ms) => new Promise((r) => setTimeout(r, ms));
const retryDelayMs = (error) => {
    const header = Number(error.response?.headers?.['retry-after']);
    if (header > 0) return Math.min(header * 1000, 30000);
    const m = (error.response?.data?.error?.message || '').match(/try again in ([\d.]+)s/i);
    return m ? Math.min(Math.ceil(parseFloat(m[1]) * 1000) + 500, 30000) : 5000;
};

// Groq call. On a rate limit (429) it waits and retries, and if the strong
// model stays limited it falls back to the fast model instead of failing.
const callGroq = async (modelName, systemPrompt, userMessage, { allowFallback = true } = {}) => {
    const MAX_RETRIES = 2;
    for (let attempt = 0; ; attempt++) {
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
                    // Groq counts this whole amount against the per-minute token
                    // limit on every call, so keep it modest. gpt-oss models
                    // "think" first, so reasoning is kept short.
                    max_completion_tokens: 1200,
                    reasoning_effort: 'low'
                },
                {
                    headers: {
                        Authorization: `Bearer ${process.env.GROQ_API_KEY}`,
                        'Content-Type': 'application/json'
                    }
                }
            );

            const content = response.data.choices[0]?.message?.content;
            if (!content || !content.trim()) {
                throw new Error('The model returned an empty answer.');
            }
            return content;
        } catch (error) {
            const status = error.response?.status;
            const detail = error.response?.data?.error?.message || error.message;

            if (status === 429 && attempt < MAX_RETRIES) {
                const wait = retryDelayMs(error);
                console.warn(`⏳ Rate limited (${modelName}); retrying in ${Math.round(wait / 1000)}s...`);
                await sleep(wait);
                continue;
            }
            if (status === 429 && allowFallback && modelName !== FAST_MODEL) {
                console.warn(`↪ ${modelName} still limited; falling back to ${FAST_MODEL}`);
                return callGroq(FAST_MODEL, systemPrompt, userMessage, { allowFallback: false });
            }

            console.error(`❌ Groq Error (${modelName}):`, status || '', detail);
            const err = new Error(
                status === 401
                    ? 'Groq rejected the API key. Check GROQ_API_KEY in backend/.env.'
                    : status === 429
                        ? 'Groq free-tier rate limit reached. Wait a minute and try again.'
                        : `LLM request failed (${modelName}): ${detail}`
            );
            err.status = status === 429 ? 429 : 502;
            throw err;
        }
    }
};

const processQuery = async (userMessage) => {
    const queryType = classifyQuery(userMessage);
    const codeQuery = isCodeQuery(userMessage);

    // ================= SIMPLE =================
    if (queryType === 'simple') {
        const simple = await callGroq(
            FAST_MODEL,
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
        callGroq(FAST_MODEL, logicPrompt, userMessage),
        callGroq(FAST_MODEL, creativePrompt, userMessage)
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

    let critique = "";
    try {
        critique = await callGroq(
            FAST_MODEL,
            criticPrompt,
            `Query: ${userMessage}

Logic:
${logicResponse}

Creative:
${creativeResponse}`
        );
    } catch {
        critique = "(critic unavailable)";
    }

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
        STRONG_MODEL,
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
        STRONG_MODEL,
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