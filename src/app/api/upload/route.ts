export const dynamic = "force-dynamic"; 

import { NextRequest, NextResponse } from "next/server";
import { writeFile, mkdir } from "fs/promises";
import { join } from "path";
import { v4 as uuidv4 } from "uuid";
import { existsSync } from "fs";

// Ensure uploads directory exists
const ensureUploadsDir = async () => {
  const uploadsDir = join(process.cwd(), "uploads");
  if (!existsSync(uploadsDir)) {
    try {
      await mkdir(uploadsDir, { recursive: true });
    } catch (error) {
      console.error("Error creating uploads directory:", error);
      throw new Error("Failed to create uploads directory");
    }
  }
  return uploadsDir;
};

export async function POST(request: NextRequest) {
  try {
    const uploadsDir = await ensureUploadsDir();
    
    const formData = await request.formData();
    const resumeFile = formData.get("resume") as File;
    
    if (!resumeFile) {
      return NextResponse.json(
        { error: "No resume file provided" },
        { status: 400 }
      );
    }

    // Validate file type
    if (!resumeFile.name.endsWith(".pdf")) {
      return NextResponse.json(
        { error: "Only PDF files are accepted" },
        { status: 400 }
      );
    }

    // Generate a unique ID for the file
    const fileId = uuidv4();
    const fileName = `${fileId}.pdf`;
    const filePath = join(uploadsDir, fileName);

    try {
      // Convert file to Uint8Array and save it
      const fileBuffer = await resumeFile.arrayBuffer();
      await writeFile(filePath, new Uint8Array(fileBuffer)); // ✅ Correct type
      
      // Verify file was written successfully
      if (!existsSync(filePath)) {
        throw new Error("File was not saved properly");
      }
    } catch (error) {
      console.error("Error saving file:", error);
      return NextResponse.json(
        { error: "Failed to save file" },
        { status: 500 }
      );
    }

    return NextResponse.json({
      success: true,
      fileId,
      filename: resumeFile.name,
    });
  } catch (error) {
    console.error("Error uploading file:", error);
    return NextResponse.json(
      { error: error instanceof Error ? error.message : "Failed to upload file" },
      { status: 500 }
    );
  }
}
