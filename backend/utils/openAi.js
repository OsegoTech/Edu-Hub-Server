import OpenAI from "openai";
import dotenv from "dotenv";

dotenv.config();
const key = process.env.OPEN_AI_API_KEY;

const openai = new OpenAI({
  apiKey: key, // defaults to process.env["OPENAI_API_KEY"]
});

export const openChat = async (content) => {
  const chatCompletion = await openai.chat.completions.create({
    messages: [{ role: "user", content }],
    model: "gpt-3.5-turbo",
  });

  console.log(chatCompletion.choices[0].message.content);
    return chatCompletion.choices[0].message.content;
};
