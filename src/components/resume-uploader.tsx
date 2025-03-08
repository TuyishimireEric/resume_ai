"use client";

import { useEffect, useState } from "react";
import { useToast } from "@/hooks/use-toast";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Progress } from "@/components/ui/progress";
import {
  Upload,
  FileText,
  Loader2,
  ArrowRight,
  CheckCircle,
  Award,
  Zap,
  Shield,
  Star,
  Send,
} from "lucide-react";
import { ResumeReview } from "@/components/resume-review";
import { ResumeUploadForm } from "@/components/resume-upload-form";
import { JobDescriptionInput } from "@/components/job-description-input";
import { type ReviewResponse } from "@/types/resume";
import { useSearchParams } from "next/navigation";
import { useJobs } from "@/app/hooks/jobs/useJobs";
import { Job } from "@/types";
import { useCreateApplication } from "@/app/hooks/jobs/useCreateApplication";

export function ResumeUploader() {
  const { toast } = useToast();
  const searchParams = useSearchParams();
  const jobIdParam = searchParams.get("job_id");

  const [file, setFile] = useState<File | null>(null);
  const [jobDescription, setJobDescription] = useState<string>("");
  const [isUploading, setIsUploading] = useState(false);
  const [uploadProgress, setUploadProgress] = useState(0);
  const [isAnalyzing, setIsAnalyzing] = useState(false);
  const [reviewData, setReviewData] = useState<ReviewResponse | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [currentStep, setCurrentStep] = useState(1);
  const [pdfText, setPdfText] = useState<string>("");
  const [isJobMode, setIsJobMode] = useState<boolean>(false);
  const [job, setJob] = useState<Job | null>(null);

  const { data: jobs = [], isLoading: isJobLoading } = useJobs();
  const createApplicationMutation = useCreateApplication();

  useEffect(() => {
    if (jobIdParam) {
      const jobExist = jobs.find((job: Job) => job.id === jobIdParam);
      setJob(jobExist || null);
    }
  }, [jobIdParam, jobs]);

  // Set job description and extract requirements from fetched job data
  useEffect(() => {
    if (job) {
      setIsJobMode(true);
      // Extract requirements from job description
      // This is a simple extraction logic - you might want to improve this
      // based on your actual job description format
      const descriptionText = job.description || "";
    }
  }, [job, isJobLoading, jobIdParam, toast]);

  const handleFileChange = (selectedFile: File | null) => {
    setFile(selectedFile);
    setReviewData(null);
    setError(null);
  };

  useEffect(() => {
    if (file) {
      extractTextFromPDF(file);
    }
  }, [file]);

  const handleJobDescriptionChange = (text: string) => {
    if (!isJobMode) {
      setJobDescription(text);
    }
  };

  const simulateProgress = () => {
    setUploadProgress(0);
    const interval = setInterval(() => {
      setUploadProgress((prev) => {
        if (prev >= 95) {
          clearInterval(interval);
          return prev;
        }
        return prev + 5;
      });
    }, 100);
    return interval;
  };

  // Load PDF.js scripts dynamically
  useEffect(() => {
    const loadPdfJs = async () => {
      if (!window["pdfjs-dist/build/pdf"]) {
        // Create and append the script tag for PDF.js
        const script = document.createElement("script");
        script.src =
          "https://cdnjs.cloudflare.com/ajax/libs/pdf.js/3.4.120/pdf.min.js";
        script.async = true;
        script.onload = () => {
          console.log("PDF.js library loaded successfully");
        };
        document.body.appendChild(script);
      }
    };

    loadPdfJs();
  }, []);

  const extractTextFromPDF = async (file: File) => {
    setPdfText("");

    try {
      // Wait for PDF.js to be loaded if it's not already
      let attempts = 0;
      const maxAttempts = 10;

      while (!window["pdfjs-dist/build/pdf"] && attempts < maxAttempts) {
        await new Promise((resolve) => setTimeout(resolve, 500));
        attempts++;
      }

      // Get a reference to the PDF.js library
      const pdfjsLib = window["pdfjs-dist/build/pdf"];

      if (!pdfjsLib) {
        throw new Error("PDF.js library not loaded after multiple attempts");
      }

      // Set the worker source
      pdfjsLib.GlobalWorkerOptions.workerSrc =
        "https://cdnjs.cloudflare.com/ajax/libs/pdf.js/3.4.120/pdf.worker.min.js";

      // Read file as array buffer
      const fileReader = new FileReader();

      const arrayBuffer = await new Promise<ArrayBuffer>((resolve, reject) => {
        fileReader.onload = () => resolve(fileReader.result as ArrayBuffer);
        fileReader.onerror = reject;
        fileReader.readAsArrayBuffer(file);
      });

      // Load the PDF document
      const loadingTask = pdfjsLib.getDocument({ data: arrayBuffer });
      const pdfDocument = await loadingTask.promise;

      // Extract text from each page with enhanced formatting
      let fullText = "";
      const structure = [];
      const numPages = pdfDocument.numPages;

      for (let i = 1; i <= numPages; i++) {
        const page = await pdfDocument.getPage(i);

        // Get text content with positioning information
        const textContent = await page.getTextContent();
        const viewport = page.getViewport({ scale: 1.0 });

        // Group text by approximate Y position (lines)
        const textByLines: Record<string, any[]> = {};

        textContent.items.forEach((item: any) => {
          // Round to nearest 10 to group text in the same approximate line
          const yPos = Math.round(viewport.height - item.transform[5]);
          const key = Math.floor(yPos / 10) * 10;

          if (!textByLines[key]) {
            textByLines[key] = [];
          }

          textByLines[key].push({
            text: item.str,
            x: item.transform[4],
            y: yPos,
            fontSize: item.height,
            fontFamily: item.fontName || "unknown",
          });
        });

        // Sort lines by Y position (top to bottom)
        const sortedYPositions = Object.keys(textByLines)
          .map(Number)
          .sort((a, b) => a - b);

        // Process each line
        let pageText = "";
        const pageStructure: any[] = [];

        sortedYPositions.forEach((yPos) => {
          // Sort items in line by X position (left to right)
          const line = textByLines[yPos].sort((a, b) => a.x - b.x);

          // Calculate if this might be a heading based on font size
          const avgFontSize =
            line.reduce((sum, item) => sum + item.fontSize, 0) / line.length;
          const isLargerText = avgFontSize > 12; // Arbitrary threshold

          // Join text in the line
          const lineText = line
            .map((item) => item.text)
            .join(" ")
            .trim();

          if (lineText) {
            // Add to structured data
            pageStructure.push({
              text: lineText,
              y: yPos,
              fontSize: avgFontSize,
              isLargerText,
            });

            // Format for plain text
            if (isLargerText) {
              pageText += `\n${lineText.toUpperCase()}\n`;
            } else {
              pageText += `${lineText}\n`;
            }
          }
        });

        // Add formatted text to full text
        fullText += `Page ${i}:\n${pageText}\n\n`;
      }

      setPdfText(fullText || "No text content found in this PDF.");
    } catch (error: unknown) {
      console.error("Error extracting text from PDF:", error);
      // Handle the error properly with type checking
      const errorMessage =
        error instanceof Error ? error.message : "Unknown error";
      setPdfText(
        `Error extracting text from PDF: ${errorMessage}. Please try another file.`
      );
    }
  };

  const handleApplyForJob = async () => {
    if (!file || !job || !reviewData) {
      toast({
        title: "Cannot apply",
        description: "Missing resume or job information",
        variant: "destructive",
      });
      return;
    }

    console.log("Applying for job:", job, reviewData);

    try {
      await createApplicationMutation.mutateAsync({
        user_name: reviewData.name,
        user_email: reviewData.email,
        job_id: job.id,
        status: "pending",
        match_score: (reviewData.overallScore * 10).toString(),
        resume_url: "",
      });

      toast({
        title: "Success",
        description: "Application submitted successfully",
        variant: "default",
      });
    } catch (error) {
      toast({
        title: "Error",
        description: "Failed to submit application. Please try again.",
        variant: "destructive",
      });
      console.error("Error creating job:", error);
    }
  };

  const handleSubmit = async () => {
    if (!file) {
      toast({
        title: "No file selected",
        description: "Please select a PDF resume to upload",
        variant: "destructive",
      });
      return;
    }

    // Reset any previous errors
    setError(null);

    try {
      setIsUploading(true);
      setCurrentStep(2);
      const progressInterval = simulateProgress();

      if (pdfText.trim() === "") {
        throw new Error("No text content found in this PDF.");
      }

      clearInterval(progressInterval);
      setUploadProgress(100);

      setIsUploading(false);
      setIsAnalyzing(true);
      setCurrentStep(3);

      const analysisResponse = await fetch("/api/analyze", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          resumeText: pdfText,
          jobDescription: job
            ? `job title: ${job.title} ${job.requirements} `
            : jobDescription,
        }),
      });

      if (!analysisResponse.ok) {
        const errorData = await analysisResponse.json();
        throw new Error(errorData.error || "Failed to analyze resume");
      }

      const reviewData = await analysisResponse.json();

      if (!reviewData || typeof reviewData !== "object") {
        throw new Error("Invalid response from analysis");
      }

      setReviewData(reviewData);

      toast({
        title: "Analysis complete",
        description: "Your resume has been analyzed successfully",
      });
    } catch (error) {
      console.error("Error processing resume:", error);
      const errorMessage =
        error instanceof Error ? error.message : "Failed to process resume";
      setError(errorMessage);
      toast({
        title: "Error",
        description: errorMessage,
        variant: "destructive",
      });
    } finally {
      setIsUploading(false);
      setIsAnalyzing(false);
      setUploadProgress(0);
    }
  };

  const steps = [
    {
      icon: <FileText className="h-5 w-5" />,
      title: "Upload Resume",
      description: "PDF, DOCX, or plain text formats",
    },
    {
      icon: <CheckCircle className="h-5 w-5" />,
      title: "AI Processing",
      description: "Automated document analysis",
    },
    {
      icon: <Award className="h-5 w-5" />,
      title: "Review Results",
      description: "Get tailored improvement suggestions",
    },
  ];

  // Determine if user can apply based on score
  const canApply = isJobMode && reviewData && reviewData?.overallScore >= 5;

  const formatDescription = (description: string) => {
    const lines = description.split("\n");
    const listItems: string[] = [];
    const formattedContent: JSX.Element[] = [];

    lines.forEach((line, index) => {
      const trimmedLine = line.trim();

      if (trimmedLine.startsWith("-") || trimmedLine.startsWith("•")) {
        listItems.push(trimmedLine);
      } else {
        if (listItems.length > 0) {
          formattedContent.push(
            <ul
              key={`list-${index}`}
              className="list-disc pl-5 text-gray-600 dark:text-slate-300"
            >
              {listItems.map((item, i) => (
                <li key={i}>{item.substring(1).trim()}</li>
              ))}
            </ul>
          );
          listItems.length = 0;
        }

        formattedContent.push(
          trimmedLine ? (
            <p
              key={index}
              className="mt-2 text-left text-gray-600 dark:text-slate-300"
            >
              {trimmedLine}
            </p>
          ) : (
            <br key={index} />
          )
        );
      }
    });

    if (listItems.length > 0) {
      formattedContent.push(
        <ul
          key="list-final"
          className="list-disc pl-5 text-gray-600 dark:text-slate-300"
        >
          {listItems.map((item, i) => (
            <li key={i}>{item.substring(1).trim()}</li>
          ))}
        </ul>
      );
    }

    return formattedContent;
  };

  return (
    <section className="relative overflow-hidden py-16 bg-gradient-to-b from-slate-50 to-white dark:from-slate-900 dark:to-slate-950">
      {/* Abstract background elements */}
      <div className="absolute inset-0">
        <div className="absolute -top-64 right-1/4 w-96 h-96 bg-blue-100/50 dark:bg-indigo-900/30 rounded-full blur-3xl"></div>
        <div className="absolute bottom-0 left-1/4 w-80 h-80 bg-indigo-100/50 dark:bg-violet-900/30 rounded-full blur-3xl"></div>
      </div>

      {/* Subtle grid overlay */}
      <div className="absolute inset-0 bg-grid-black/[0.03] dark:bg-grid-white/[0.05] bg-[size:20px_20px]"></div>

      <div className="container mx-auto px-4 relative z-10">
        <div className="text-left mb-12 mx-auto">
          {isJobMode && job ? (
            <>
              <h2 className="text-3xl font-bold text-gray-800 dark:text-white">
                Apply for{" "}
                <span className="text-blue-600 dark:text-blue-400">
                  {job.title}
                </span>
              </h2>
              <p className="mt-2 text-gray-600 dark:text-slate-300">
                {job.location} | Closes: {job.close_date}
              </p>
              <div className="text-base">
                {job.description && formatDescription(job.description)}
              </div>
            </>
          ) : (
            <>
              <div className="text-center mb-6">
                <h2 className="text-2xl font-bold text-gray-800">
                  Transform Your{" "}
                  <span className="text-blue-600">Professional Profile</span>
                </h2>
                <p className="mt-2 text-gray-600">
                  Upload your resume for AI-powered analysis that identifies
                  strengths and improvement opportunities to help you stand out
                  to employers.
                </p>
              </div>
              <div className="flex justify-center">
                <button className="bg-blue-600 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded">
                  Upload Resume
                </button>
              </div>
            </>
          )}
        </div>

        {/* Progress steps */}
        <div className="max-w-4xl mx-auto mb-10">
          <div className="relative flex justify-between">
            {/* Progress line */}
            <div className="absolute top-1/2 left-0 right-0 h-1 bg-slate-200 dark:bg-slate-700 -translate-y-1/2">
              <div
                className="h-full bg-gradient-to-r from-blue-500 to-indigo-600 dark:from-indigo-500 dark:to-violet-600 transition-all duration-500"
                style={{
                  width: `${((currentStep - 1) / (steps.length - 1)) * 100}%`,
                }}
              ></div>
            </div>

            {steps.map((step, index) => (
              <div
                key={index}
                className={`relative flex flex-col items-center ${
                  index + 1 <= currentStep
                    ? "text-slate-800 dark:text-white"
                    : "text-slate-400 dark:text-slate-500"
                }`}
              >
                <div
                  className={`w-10 h-10 rounded-full flex items-center justify-center z-10 transition-all duration-300 ${
                    index + 1 < currentStep
                      ? "bg-gradient-to-r from-blue-500 to-indigo-600 dark:from-indigo-500 dark:to-violet-600"
                      : index + 1 === currentStep
                      ? "bg-gradient-to-r from-blue-500 to-indigo-600 dark:from-indigo-500 dark:to-violet-600 ring-4 ring-blue-500/20 dark:ring-indigo-500/20"
                      : "bg-slate-200 dark:bg-slate-700"
                  }`}
                >
                  {step.icon}
                </div>
                <p className="mt-2 font-medium text-sm">{step.title}</p>
                <p className="text-xs mt-1 text-slate-500 dark:text-slate-400 hidden md:block">
                  {step.description}
                </p>
              </div>
            ))}
          </div>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-5 gap-8 max-w-6xl mx-auto">
          <div className="lg:col-span-2">
            <Card className="border border-slate-200 dark:border-slate-800 shadow-lg dark:shadow-2xl bg-white dark:bg-slate-900 overflow-hidden backdrop-blur-sm">
              <div className="absolute inset-0 bg-gradient-to-br from-blue-50/50 to-indigo-50/50 dark:from-indigo-900/5 dark:to-violet-900/5"></div>
              <CardContent className="relative p-6">
                <div className="mb-6">
                  <h3 className="text-xl font-semibold text-slate-800 dark:text-white mb-2">
                    Upload Your Resume
                  </h3>
                  <p className="text-slate-600 dark:text-slate-300 text-sm">
                    Select your file to get started with your career
                    transformation
                  </p>
                </div>

                <ResumeUploadForm file={file} onFileChange={handleFileChange} />

                {!isJobMode && (
                  <div className="mt-6">
                    <JobDescriptionInput
                      value={jobDescription}
                      onChange={handleJobDescriptionChange}
                    />
                  </div>
                )}

                {(isUploading || uploadProgress > 0) && (
                  <div className="mt-6">
                    <Progress
                      value={uploadProgress}
                      className="h-2 bg-slate-100 dark:bg-slate-700"
                    />
                    <p className="text-sm text-slate-600 dark:text-slate-300 mt-2 flex items-center">
                      <Loader2 className="h-3 w-3 mr-2 animate-spin" />
                      Uploading: {Math.round(uploadProgress)}%
                    </p>
                  </div>
                )}

                {error && (
                  <div className="mt-6 p-3 bg-red-50 dark:bg-red-900/20 border border-red-200 dark:border-red-800/30 rounded-md">
                    <p className="text-sm text-red-600 dark:text-red-400">
                      {error}
                    </p>
                  </div>
                )}

                <div className="mt-6">
                  <Button
                    onClick={handleSubmit}
                    disabled={!file || isUploading || isAnalyzing}
                    className="w-full bg-gradient-to-r from-blue-500 to-indigo-600 hover:from-blue-600 hover:to-indigo-700 dark:from-indigo-500 dark:to-violet-600 dark:hover:from-indigo-600 dark:hover:to-violet-700 text-white border-0 shadow-lg shadow-blue-500/25 dark:shadow-indigo-500/25 hover:shadow-blue-500/40 dark:hover:shadow-indigo-500/40"
                  >
                    {isUploading ? (
                      <>
                        <Upload className="mr-2 h-4 w-4" /> Uploading...
                      </>
                    ) : isAnalyzing ? (
                      <>
                        <Loader2 className="mr-2 h-4 w-4 animate-spin" />{" "}
                        Analyzing...
                      </>
                    ) : (
                      <>
                        <Zap className="mr-2 h-4 w-4" /> Analyze My Resume
                      </>
                    )}
                  </Button>
                </div>

                {isJobMode && reviewData && canApply && (
                  <div className="mt-4">
                    <Button
                      onClick={handleApplyForJob}
                      disabled={createApplicationMutation.isPending}
                      className="w-full bg-green-500 hover:bg-green-600 dark:bg-green-600 dark:hover:bg-green-700 text-white border-0 shadow-lg shadow-green-500/25 hover:shadow-green-500/40 dark:shadow-green-500/20 dark:hover:shadow-green-500/30"
                    >
                      {createApplicationMutation.isPending ? (
                        <>
                          <Loader2 className="mr-2 h-4 w-4 animate-spin" />{" "}
                          Submitting...
                        </>
                      ) : (
                        <>
                          <Send className="mr-2 h-4 w-4" /> Apply Now
                        </>
                      )}
                    </Button>
                  </div>
                )}

                <div className="mt-4 flex items-center justify-center text-slate-500 dark:text-slate-400 text-xs">
                  <Shield className="h-3 w-3 mr-1" />
                  Your data is secure and encrypted
                </div>
              </CardContent>
            </Card>

            {/* Features list */}
            <div className="mt-6 p-4 bg-slate-50 dark:bg-slate-800/50 backdrop-blur-sm rounded-lg border border-slate-100 dark:border-slate-700/50">
              <h4 className="text-slate-800 dark:text-white font-medium mb-3 flex items-center">
                <Star className="h-4 w-4 mr-2 text-blue-500 dark:text-indigo-400" />{" "}
                Premium Analysis Features
              </h4>
              <ul className="space-y-2">
                {[
                  "ATS Compatibility Check",
                  "Industry-Specific Keyword Analysis",
                  "Skills Gap Identification",
                  "Formatting & Structure Review",
                  "Impact Statement Enhancement",
                ].map((feature, index) => (
                  <li key={index} className="flex items-start">
                    <ArrowRight className="h-4 w-4 mr-2 text-blue-500 dark:text-indigo-400 shrink-0 mt-0.5" />
                    <span className="text-sm text-slate-600 dark:text-slate-300">
                      {feature}
                    </span>
                  </li>
                ))}
              </ul>
            </div>
          </div>

          <div className="lg:col-span-3">
            <ResumeReview reviewData={reviewData} />

            {!reviewData && !isAnalyzing && (
              <div className="h-full flex items-center justify-center p-8 rounded-lg bg-white dark:bg-slate-900 border border-slate-100 dark:border-slate-800 shadow-lg dark:shadow-2xl">
                <div className="text-center max-w-md">
                  <div className="w-16 h-16 mx-auto mb-4 rounded-full bg-blue-100 dark:bg-indigo-900/30 flex items-center justify-center">
                    <FileText className="h-8 w-8 text-blue-600 dark:text-indigo-400" />
                  </div>
                  <h3 className="text-xl font-semibold text-slate-800 dark:text-white mb-3">
                    Ready to Analyze Your Resume
                  </h3>
                  <p className="text-slate-600 dark:text-slate-300 mb-6">
                    Upload your resume and get a comprehensive analysis with
                    personalized improvement suggestions to increase your
                    interview chances.
                  </p>
                  <div className="flex flex-wrap justify-center gap-3">
                    {[
                      "92% Success Rate",
                      "ATS-Optimized",
                      "Industry-Specific",
                    ].map((badge, i) => (
                      <span
                        key={i}
                        className="px-3 py-1 bg-blue-50 border border-blue-100 dark:bg-indigo-900/20 dark:border-indigo-700/30 rounded-full text-xs text-blue-600 dark:text-indigo-300"
                      >
                        {badge}
                      </span>
                    ))}
                  </div>
                </div>
              </div>
            )}

            {isAnalyzing && !reviewData && (
              <div className="h-full flex items-center justify-center p-8 rounded-lg bg-white dark:bg-slate-900 border border-slate-100 dark:border-slate-800 shadow-lg dark:shadow-2xl">
                <div className="text-center">
                  <div className="w-16 h-16 mx-auto mb-4 rounded-full bg-blue-100 dark:bg-indigo-900/30 flex items-center justify-center">
                    <Loader2 className="h-8 w-8 text-blue-600 dark:text-indigo-400 animate-spin" />
                  </div>
                  <h3 className="text-xl font-semibold text-slate-800 dark:text-white mb-3">
                    Analyzing Your Resume
                  </h3>
                  <p className="text-slate-600 dark:text-slate-300">
                    Our AI is thoroughly reviewing your resume to provide
                    personalized feedback and recommendations.
                  </p>
                </div>
              </div>
            )}
          </div>
        </div>

        {/* Testimonials/social proof */}
        <div className="mt-16 max-w-4xl mx-auto">
          <div className="bg-white dark:bg-slate-900 bg-opacity-80 dark:bg-opacity-80 backdrop-blur-sm rounded-xl border border-slate-100 dark:border-slate-800 p-6 shadow-sm">
            <div className="flex flex-col md:flex-row justify-between items-center gap-6">
              <div className="flex flex-col items-center md:items-start">
                <p className="text-slate-600 dark:text-slate-300 mb-2 text-center md:text-left">
                  Trusted by professionals from
                </p>
                <div className="flex flex-wrap gap-3 items-center justify-center md:justify-start">
                  {["Google", "Amazon", "Microsoft", "Apple"].map(
                    (company, i) => (
                      <div
                        key={i}
                        className="text-slate-800 dark:text-white font-medium bg-slate-100 dark:bg-slate-800 px-3 py-1 rounded"
                      >
                        {company}
                      </div>
                    )
                  )}
                </div>
              </div>

              <div className="flex gap-6">
                {[
                  { number: "50k+", label: "Resumes Improved" },
                  { number: "92%", label: "Interview Rate" },
                ].map((stat, i) => (
                  <div key={i} className="text-center">
                    <p className="text-2xl font-bold text-transparent bg-clip-text bg-gradient-to-r from-blue-500 to-indigo-500 dark:from-indigo-400 dark:to-violet-400">
                      {stat.number}
                    </p>
                    <p className="text-xs text-slate-500 dark:text-slate-400">
                      {stat.label}
                    </p>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
