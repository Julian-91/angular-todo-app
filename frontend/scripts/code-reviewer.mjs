import OpenAI from "openai";

const openai = new OpenAI({ apiKey: process.env.OPENAI_API_KEY });

const pullRequestCode = process.argv[2];

const reviewResponse = await openai.chat.completions.create({
    model: "gpt-4o-mini",
    messages: [
        { role: "system", content: "You are a code reviewer. You will be given a code snippet and you will need to review it and provide feedback on it." },
        { role: "user", content: `Provide your review in a clear, concise, and actionable manner. The code is in the following file:\n\n${pullRequestCode}` }
    ],
    max_tokens: 1000,
});

console.log(reviewResponse.choices[0].message.content);
