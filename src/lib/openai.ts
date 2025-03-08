import OpenAI from "openai";

import { ReviewResponse } from "@/types/resume";
import { ChatCompletionMessageParam } from "openai/resources/index.mjs";

if (!process.env.OPENAI_API_KEY) {
  throw new Error("OPENAI_API_KEY is not defined in environment variables");
}

const openai = new OpenAI({
  apiKey: process.env.OPENAI_API_KEY,
});

export async function analyzeResume(
  resumeText: string,
  jobDescription?: string
): Promise<ReviewResponse> {
  try {
    // Validate input
    if (!resumeText || resumeText.trim() === "") {
      throw new Error("No resume text provided for analysis");
    }

    const messages: ChatCompletionMessageParam[] = [
      {
        role: "system", // This is a valid literal value
        content:
          "You are an expert resume reviewer. Carefully analyze the candidate's resume and job description. Provide a summarized feedback focusing on education and experience. Avoid making assumptions about the candidate's qualifications.\n\n" +
          "Provide the response in **this exact format**:\n" +
          "\"name: 'name here', email:'email goes here', score: 8/10, strength: 'strength here', weakness: 'weakness here', suggestions: 'suggestions here'\"",
      },
      {
        role: "user", // This is a valid literal value
        content: `Resume:\n${resumeText}`,
      },
      ...(jobDescription
        ? [
            {
              role: "user" as const,
              content: `Job Description:\n${jobDescription}`,
            },
          ]
        : []),
    ];

    const response = await openai.chat.completions.create({
      model: "gpt-4o-mini",
      messages,
      max_tokens: 300,
      temperature: 0.8,
    });

    const result = response.choices[0]?.message.content?.trim() || "";
    console.log("====================================");

    console.log("OpenAI response:", result);

    return formatResponse(result);
  } catch (error) {
    console.error("Error analyzing resume with OpenAI:", error);
    throw new Error(
      error instanceof Error ? error.message : "Failed to analyze resume"
    );
  }
}

function formatResponse(response: string) {
  const nameMatch = response.match(/name:\s*'([^']+)'/);
  const emailMatch = response.match(/email:\s*'([^']+)'/);
  const scoreMatch = response.match(/score:\s*(\d+)\/10/);
  const strengthMatch = response.match(/strength:\s*'([^']+)'/);
  const weaknessMatch = response.match(/weakness:\s*'([^']+)'/);
  const suggestionMatch = response.match(/suggestions:\s*'([^']+)'/);

  return {
    name: nameMatch ? nameMatch[1] : "",
    email: emailMatch ? emailMatch[1] : "",
    overallScore: scoreMatch ? parseInt(scoreMatch[1], 10) : 0,
    strengths: strengthMatch ? [strengthMatch[1]] : [],
    weaknesses: weaknessMatch ? [weaknessMatch[1]] : [],
    suggestions: suggestionMatch ? [suggestionMatch[1]] : [],
  };
}
