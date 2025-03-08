export interface ReviewResponse {
  name: string;
  email: string;
  overallScore: number;
  strengths: string[];
  weaknesses: string[];
  suggestions: string[];
}

export interface UploadResponse {
  fileId: string;
  filename: string;
  success: boolean;
}

export interface AnalyzeRequest {
  resumeText: string;
  jobDescription?: string;
}
