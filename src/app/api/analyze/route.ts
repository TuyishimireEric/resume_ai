import { NextRequest, NextResponse } from "next/server";
import { analyzeResume } from "@/lib/openai";
import { AnalyzeRequest } from "@/types/resume";

export async function POST(request: NextRequest) {
  try {
    const body: AnalyzeRequest = await request.json();
    const { resumeText, jobDescription } = body;

    if (!resumeText) { 
      return NextResponse.json(
        { error: "File ID is required" },
        { status: 400 }
      );
    }

    try {
     
      const analysis = await analyzeResume(resumeText, jobDescription);
      
      return NextResponse.json(analysis);
    } catch (error) {
      console.error("Error reading or processing file:", error);
      return NextResponse.json(
        { error: error instanceof Error ? error.message : "File could not be processed" },
        { status: 500 }
      );
    }
  } catch (error) {
    console.error("Error analyzing resume:", error);
    return NextResponse.json(
      { error: error instanceof Error ? error.message : "Failed to analyze resume" },
      { status: 500 }
    );
  }
}