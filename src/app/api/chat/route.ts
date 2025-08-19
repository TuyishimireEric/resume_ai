import { GoogleGenerativeAI } from "@google/generative-ai";
import { RESUME_APP_CONTEXT } from "@/lib/context";

const genAI = new GoogleGenerativeAI(process.env.GEMINI_API_KEY!);

export async function POST(request: Request) {
  try {
    const { message } = await request.json();

    const model = genAI.getGenerativeModel({
      model: "gemini-1.5-flash",
      generationConfig: {
        temperature: 0.1, // Very low for consistent, factual responses
        maxOutputTokens: 800,
      },
    });

    const prompt = `
You are a helpful AI assistant for Resume AI platform created by Eric Tuyishimire. You provide support and information ONLY about Resume AI features and functionality.

CRITICAL RULES:
1. Only answer questions using the Resume AI platform information provided below
2. Never provide general resume advice - only explain how Resume AI works
3. If asked about anything outside Resume AI platform, respond: "I can only help with Resume AI platform questions. For general resume advice, please use our analysis tool."
4. Always emphasize that Resume AI is completely free and created by Eric Tuyishimire from Rwanda
5. Explain the 50% matching threshold rule and HR ranking system when relevant
6. For direct contact, always mention Eric's email: tuyishimireericc@gmail.com
7. Highlight that the platform is still in development but fully functional

RESUME AI PLATFORM INFORMATION:
${RESUME_APP_CONTEXT}

USER QUESTION: ${message}

RESPONSE (only about Resume AI platform, mention Eric's email for direct contact when appropriate):`;

    const result = await model.generateContent(prompt);
    let response = await result.response.text();

    // Make email clickable in the response
    response = response.replace(
      /tuyishimireericc@gmail\\.com/g,
      '<a href="mailto:tuyishimireericc@gmail.com" class="text-blue-600 hover:text-blue-800 underline">tuyishimireericc@gmail.com</a>'
    );

    return Response.json({ response });
  } catch (error) {
    console.error("Gemini API error:", error);
    return Response.json(
      {
        response:
          'I apologize for the technical difficulty. Resume AI is a free platform created by Eric Tuyishimire from Rwanda that analyzes resumes against job descriptions with a 50% matching threshold. For direct support, contact <a href="mailto:tuyishimireericc@gmail.com" class="text-blue-600 hover:text-blue-800 underline">tuyishimireericc@gmail.com</a>',
      },
      { status: 500 }
    );
  }
}
