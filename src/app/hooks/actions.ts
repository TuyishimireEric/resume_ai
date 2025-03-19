"use server";

import { uploadToCloudinary } from "@/lib/uploadFiles";
import { uploadToGoogleDrive } from "@/lib/uploadToGoogleDrive";

interface UploadResponse {
  success: boolean;
  file?: { secure_url: string };
  error?: string;
}

export async function uploadFile(formData: FormData): Promise<UploadResponse> {
  const file = formData.get("file") as File;

  if (!file || file.size === 0) {
    return { success: false, error: "No file uploaded" };
  }

  try {
    // const result = await uploadToCloudinary(file);
    const result = await uploadToGoogleDrive(file);

    console.log("Upload result:", result);

    if (!result || typeof result !== "object" || !("secure_url" in result)) {
      return { success: false, error: "Invalid response from Cloudinary" };
    }

    return {
      success: true,
      file: { secure_url: (result as { secure_url: string }).secure_url },
    };
  } catch (error) {
    console.error("Upload error:", error);
    return { success: false, error: "Upload failed" };
  }
}
