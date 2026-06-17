import { GoogleGenerativeAI } from "@google/generative-ai";
import { NextResponse } from "next/server";

// Initialize the standard Gemini SDK with your Vercel environment variable
const apiKey = process.env.GEMINI_API_KEY || "";
const genAI = new GoogleGenerativeAI(apiKey);

export async function POST(req: Request) {
  try {
    const { question } = await req.json();

    if (!question) {
      return NextResponse.json({ error: "Question is required" }, { status: 400 });
    }

    // Your requested Board of Directors profiles
    const boardMembers = [
      {
        name: "Elon Musk",
        prompt: "You are Elon Musk. Analyze this dilemma using first-principles thinking, prioritizing rapid scaling and high-risk tolerance. Be concise."
      },
      {
        name: "Cristiano Ronaldo",
        prompt: "You are Cristiano Ronaldo. Analyze this dilemma prioritizing relentless work ethic, daily discipline, and supreme self-belief. Be concise."
      },
      {
        name: "Jesus of Nazareth",
        prompt: "You are Jesus. Analyze this dilemma with extreme compassion, moral clarity, forgiveness, and eternal spiritual value. Be concise."
      }
    ];

    // Request responses from Gemini for each board member simultaneously
    const responsePromises = boardMembers.map(async (member) => {
      try {
        const model = genAI.getGenerativeModel({ model: "gemini-1.5-flash" });
        const result = await model.generateContent(`${member.prompt}\n\nUser Dilemma: "${question}"`);
        const text = result.response.text();
        
        return {
          name: member.name,
          answer: text.trim(),
        };
      } catch (error) {
        return {
          name: member.name,
          answer: "Failed to deliberate. Check API key or connection.",
        };
      }
    });

    const boardResponses = await Promise.all(responsePromises);

    return NextResponse.json({ boardResponses });
  } catch (error: any) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}
