"use client";

import React, { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import {
  Sun,
  Moon,
  Upload,
  FileText,
  Check,
  X,
  AlertTriangle,
  ChevronDown,
  Trash2,
  BarChart2,
  Info,
} from "lucide-react";

interface AnalysisResult {
  name: string;
  email: string;
  overallScore: number;
  strengths: string[];
  weaknesses: string[];
  suggestions: string[];
}

const ResumeAnalyzer: React.FC = () => {
  const [darkMode, setDarkMode] = useState<boolean>(false);
  const [jobTitle, setJobTitle] = useState<string>("");
  const [jobDescription, setJobDescription] = useState<string>("");
  const [fileName, setFileName] = useState<string>("");
  const [isDragging, setIsDragging] = useState<boolean>(false);
  const [loading, setLoading] = useState<boolean>(false);
  const [result, setResult] = useState<AnalysisResult | null>(null);
  const [charCount, setCharCount] = useState<number>(0);
  const maxChars = 100;
  const [showInfo, setShowInfo] = useState<boolean>(false);

  // Set up system preference for dark mode
  useEffect(() => {
    if (typeof window !== "undefined") {
      const isDarkMode =
        window.matchMedia &&
        window.matchMedia("(prefers-color-scheme: dark)").matches;
      setDarkMode(isDarkMode);

      // Listen for changes in system preference
      const darkModeMediaQuery = window.matchMedia(
        "(prefers-color-scheme: dark)"
      );
      const handleChange = (e: MediaQueryListEvent) => setDarkMode(e.matches);
      darkModeMediaQuery.addEventListener("change", handleChange);

      return () =>
        darkModeMediaQuery.removeEventListener("change", handleChange);
    }
  }, []);

  const handleJobDescriptionChange = (
    e: React.ChangeEvent<HTMLTextAreaElement>
  ) => {
    const text = e.target.value;
    if (text.length <= maxChars) {
      setJobDescription(text);
      setCharCount(text.length);
    }
  };

  const handleDragOver = (e: React.DragEvent) => {
    e.preventDefault();
    setIsDragging(true);
  };

  const handleDragLeave = () => {
    setIsDragging(false);
  };

  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault();
    setIsDragging(false);

    if (e.dataTransfer.files && e.dataTransfer.files.length > 0) {
      const file = e.dataTransfer.files[0];
      if (file.type === "application/pdf") {
        setFileName(file.name);
      } else {
        showNotification("Please upload a PDF file.");
        setFileName("");
      }
    }
  };

  const handleFileChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    const files = event.target.files;
    if (files && files.length > 0) {
      const file = files[0];
      if (file.type === "application/pdf") {
        setFileName(file.name);
      } else {
        showNotification("Please upload a PDF file.");
        setFileName("");
      }
    }
  };

  const clearFile = () => {
    setFileName("");
  };

  const showNotification = (message: string) => {
    // In a real implementation, this would show a toast notification
    alert(message);
  };

  const handleAnalyze = async () => {
    if (!fileName) {
      showNotification("Please upload a CV first.");
      return;
    }

    if (!jobTitle.trim()) {
      showNotification("Please enter a job title.");
      return;
    }

    setLoading(true);

    // Simulate API call with a timeout
    setTimeout(() => {
      // Mock response
      const mockResult: AnalysisResult = {
        name: "TUYISHIMIRE ERIC",
        email: "tuyishimireericc@gmail.com",
        overallScore: 7,
        strengths: [
          "Strong technical skills in frontend development and experience with relevant technologies",
          "Demonstrated ability to work in agile development environments",
          "Excellent problem-solving skills and attention to detail",
        ],
        weaknesses: [
          "Lacks the required 5 years of experience for the frontend developer position",
          "Limited experience with specific enterprise frameworks mentioned in job description",
        ],
        suggestions: [
          "Highlight additional relevant projects or contributions that could bolster experience claims",
          "Consider gaining more hands-on experience or certifications to meet the experience requirement",
          "Emphasize transferable skills from previous roles that align with job requirements",
        ],
      };

      setResult(mockResult);
      setLoading(false);
    }, 2000);
  };

  const getScoreColor = (score: number) => {
    if (score >= 8) return darkMode ? "text-emerald-400" : "text-emerald-600";
    if (score >= 5) return darkMode ? "text-amber-400" : "text-amber-600";
    return darkMode ? "text-rose-400" : "text-rose-600";
  };

  const getScoreGradient = (score: number) => {
    if (score >= 8)
      return darkMode
        ? "from-emerald-500 to-emerald-700"
        : "from-emerald-400 to-emerald-600";
    if (score >= 5)
      return darkMode
        ? "from-amber-500 to-amber-700"
        : "from-amber-400 to-amber-600";
    return darkMode ? "from-rose-500 to-rose-700" : "from-rose-400 to-rose-600";
  };

  return (
    <div
      className={`min-h-screen transition-colors duration-300 ${
        darkMode ? "bg-gray-900 text-gray-100" : "bg-gray-50 text-gray-900"
      }`}
    >
      <header
        className={`${
          darkMode ? "bg-gray-800 border-gray-700" : "bg-white border-gray-200"
        } border-b sticky top-0 z-10 shadow-sm`}
      >
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between h-16">
            <div className="flex items-center">
              <FileText
                className={`h-6 w-6 ${
                  darkMode ? "text-indigo-400" : "text-indigo-600"
                }`}
              />
              <h1 className="ml-2 text-xl font-bold tracking-tight">
                ResuMatch Pro
              </h1>
            </div>
            <div className="flex items-center">
              <button
                onClick={() => setDarkMode(!darkMode)}
                className={`p-2 rounded-full ${
                  darkMode
                    ? "bg-gray-700 text-yellow-300 hover:bg-gray-600"
                    : "bg-gray-100 text-gray-700 hover:bg-gray-200"
                } transition-colors duration-200 focus:outline-none focus:ring-2 focus:ring-offset-2 ${
                  darkMode ? "focus:ring-indigo-400" : "focus:ring-indigo-500"
                }`}
                aria-label="Toggle dark mode"
              >
                {darkMode ? <Sun size={18} /> : <Moon size={18} />}
              </button>
            </div>
          </div>
        </div>
      </header>

      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <motion.div
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.4, ease: "easeOut" }}
          className={`${
            darkMode ? "bg-gray-900" : "bg-white"
          } rounded-xl overflow-hidden border ${
            darkMode ? "border-gray-800" : "border-gray-200"
          } shadow-xl`}
        >
          <div className="p-7 md:p-8">
            <div className="space-y-6">
              {/* Job Title Input */}
              <div>
                <label
                  htmlFor="job-title"
                  className={`block text-sm font-medium mb-2 ${
                    darkMode ? "text-gray-200" : "text-gray-700"
                  }`}
                >
                  Job Title <span className="text-rose-500">*</span>
                </label>
                <div className="relative">
                  <input
                    id="job-title"
                    type="text"
                    value={jobTitle}
                    onChange={(e) => setJobTitle(e.target.value)}
                    className={`block w-full rounded-lg border ${
                      darkMode ? "border-gray-700" : "border-gray-300"
                    } py-3 px-4 ${
                      darkMode
                        ? "bg-gray-800 text-white placeholder-gray-400"
                        : "bg-white text-gray-900 placeholder-gray-400"
                    } focus:ring-2 ${
                      darkMode
                        ? "focus:ring-indigo-500 focus:border-indigo-500"
                        : "focus:ring-indigo-600 focus:border-indigo-600"
                    } shadow-sm transition-all duration-200 text-sm`}
                    placeholder="e.g. Senior Frontend Developer"
                  />
                </div>
              </div>

              {/* Job Description Textarea */}
              <div>
                <div className="flex justify-between items-center mb-2">
                  <label
                    htmlFor="job-description"
                    className={`text-sm font-medium ${
                      darkMode ? "text-gray-200" : "text-gray-700"
                    }`}
                  >
                    Key Requirements
                  </label>
                  <span
                    className={`text-xs font-medium ${
                      charCount >= maxChars
                        ? "text-rose-500"
                        : darkMode
                        ? "text-gray-400"
                        : "text-gray-500"
                    }`}
                  >
                    {charCount}/{maxChars}
                  </span>
                </div>
                <div className="relative">
                  <textarea
                    id="job-description"
                    value={jobDescription}
                    onChange={handleJobDescriptionChange}
                    className={`block w-full rounded-lg border ${
                      darkMode ? "border-gray-700" : "border-gray-300"
                    } py-3 px-4 ${
                      darkMode
                        ? "bg-gray-800 text-white placeholder-gray-400"
                        : "bg-white text-gray-900 placeholder-gray-400"
                    } focus:ring-2 ${
                      darkMode
                        ? "focus:ring-indigo-500 focus:border-indigo-500"
                        : "focus:ring-indigo-600 focus:border-indigo-600"
                    } shadow-sm transition-all duration-200 resize-none text-sm`}
                    placeholder="Enter key job requirements or skills needed..."
                    rows={4}
                  ></textarea>
                </div>
                <p
                  className={`mt-2 text-xs ${
                    darkMode ? "text-gray-400" : "text-gray-500"
                  }`}
                >
                  Add specific requirements to improve matching accuracy
                </p>
              </div>

              {/* CV Upload */}
              <div className="pt-2">
                <div className="flex justify-between items-center mb-2">
                  <label
                    className={`text-sm font-medium ${
                      darkMode ? "text-gray-200" : "text-gray-700"
                    }`}
                  >
                    Upload Resume <span className="text-rose-500">*</span>
                  </label>
                  <button
                    type="button"
                    onClick={() => setShowInfo(!showInfo)}
                    className={`inline-flex items-center text-xs font-medium ${
                      darkMode
                        ? "text-indigo-400 hover:text-indigo-300"
                        : "text-indigo-600 hover:text-indigo-700"
                    } transition-colors`}
                  >
                    <span>Supported formats</span>
                    <ChevronDown
                      size={14}
                      className={`ml-1 transform transition-transform duration-200 ${
                        showInfo ? "rotate-180" : ""
                      }`}
                    />
                  </button>
                </div>

                <AnimatePresence>
                  {showInfo && (
                    <motion.div
                      initial={{ opacity: 0, height: 0 }}
                      animate={{ opacity: 1, height: "auto" }}
                      exit={{ opacity: 0, height: 0 }}
                      transition={{ duration: 0.2 }}
                      className={`mb-3 p-3 text-sm rounded-lg ${
                        darkMode
                          ? "bg-indigo-900/20 text-indigo-200 border border-indigo-800/50"
                          : "bg-indigo-50 text-indigo-700 border border-indigo-100"
                      }`}
                    >
                      <div className="flex items-start">
                        <Info size={16} className="mt-0.5 mr-2 flex-shrink-0" />
                        <span>
                          Currently only PDF files are supported. Make sure your
                          resume is in PDF format.
                        </span>
                      </div>
                    </motion.div>
                  )}
                </AnimatePresence>

                <label
                  htmlFor="cv-upload"
                  onDragOver={handleDragOver}
                  onDragLeave={handleDragLeave}
                  onDrop={handleDrop}
                  className={`
            relative flex flex-col items-center justify-center w-full p-6 border-2 border-dashed rounded-lg cursor-pointer
            ${
              isDragging
                ? darkMode
                  ? "border-indigo-400 bg-indigo-900/20"
                  : "border-indigo-500 bg-indigo-50"
                : darkMode
                ? "border-gray-700 hover:border-indigo-400 bg-gray-800/40 hover:bg-indigo-900/10"
                : "border-gray-300 hover:border-indigo-400 bg-gray-50 hover:bg-indigo-50/50"
            }
            transition-all duration-200
          `}
                >
                  <div className="flex flex-col items-center justify-center py-6">
                    <div
                      className={`mb-3 p-3 rounded-full ${
                        darkMode ? "bg-indigo-900/30" : "bg-indigo-100/70"
                      }`}
                    >
                      <Upload
                        className={`w-6 h-6 ${
                          darkMode ? "text-indigo-300" : "text-indigo-600"
                        }`}
                      />
                    </div>

                    <p
                      className={`mb-2 text-sm font-medium ${
                        darkMode ? "text-gray-300" : "text-gray-700"
                      }`}
                    >
                      <span
                        className={`font-semibold ${
                          darkMode ? "text-indigo-400" : "text-indigo-600"
                        }`}
                      >
                        Click to upload
                      </span>{" "}
                      or drag and drop
                    </p>
                    <p
                      className={`text-xs ${
                        darkMode ? "text-gray-400" : "text-gray-500"
                      }`}
                    >
                      PDF only (max. 5MB)
                    </p>
                  </div>
                  <input
                    id="cv-upload"
                    type="file"
                    accept="application/pdf"
                    className="hidden"
                    onChange={handleFileChange}
                  />
                </label>

                <AnimatePresence>
                  {fileName && (
                    <motion.div
                      initial={{ opacity: 0, y: -5 }}
                      animate={{ opacity: 1, y: 0 }}
                      exit={{ opacity: 0, y: -5 }}
                      transition={{ duration: 0.2 }}
                      className={`mt-3 p-3 rounded-lg flex items-center justify-between ${
                        darkMode
                          ? "bg-gray-800 border border-gray-700"
                          : "bg-gray-50 border border-gray-200"
                      }`}
                    >
                      <div className="flex items-center">
                        <div
                          className={`p-2 rounded-md ${
                            darkMode ? "bg-indigo-900/30" : "bg-indigo-100"
                          }`}
                        >
                          <FileText
                            size={14}
                            className={
                              darkMode ? "text-indigo-300" : "text-indigo-600"
                            }
                          />
                        </div>
                        <span
                          className={`ml-3 text-sm font-medium truncate max-w-[200px] ${
                            darkMode ? "text-gray-200" : "text-gray-700"
                          }`}
                        >
                          {fileName}
                        </span>
                      </div>
                      <button
                        onClick={clearFile}
                        className={`p-1.5 rounded-full ${
                          darkMode
                            ? "text-gray-400 hover:text-white hover:bg-gray-700"
                            : "text-gray-500 hover:text-gray-700 hover:bg-gray-200"
                        } transition-colors`}
                        aria-label="Remove file"
                      >
                        <Trash2 size={16} />
                      </button>
                    </motion.div>
                  )}
                </AnimatePresence>
              </div>

              {/* Analyze Button */}
              <div className="mt-8">
                <motion.button
                  onClick={handleAnalyze}
                  disabled={loading || !fileName}
                  whileHover={{ scale: 1.01 }}
                  whileTap={{ scale: 0.98 }}
                  className={`
            w-full flex items-center justify-center py-3.5 px-4 rounded-lg text-base font-medium shadow-md
            ${
              loading || !fileName
                ? darkMode
                  ? "bg-gray-800 text-gray-500 cursor-not-allowed border border-gray-700"
                  : "bg-gray-100 text-gray-400 cursor-not-allowed border border-gray-200"
                : darkMode
                ? "bg-indigo-600 text-white hover:bg-indigo-500 active:bg-indigo-700"
                : "bg-indigo-600 text-white hover:bg-indigo-500 active:bg-indigo-700"
            }
            transition-all duration-200 focus:outline-none focus:ring-2 focus:ring-offset-2 ${
              darkMode
                ? "focus:ring-indigo-400 focus:ring-offset-gray-900"
                : "focus:ring-indigo-500 focus:ring-offset-white"
            }
          `}
                >
                  {loading ? (
                    <>
                      <svg
                        className="animate-spin -ml-1 mr-3 h-5 w-5 text-white"
                        xmlns="http://www.w3.org/2000/svg"
                        fill="none"
                        viewBox="0 0 24 24"
                      >
                        <circle
                          className="opacity-25"
                          cx="12"
                          cy="12"
                          r="10"
                          stroke="currentColor"
                          strokeWidth="4"
                        ></circle>
                        <path
                          className="opacity-75"
                          fill="currentColor"
                          d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
                        ></path>
                      </svg>
                      Analyzing Resume...
                    </>
                  ) : (
                    <>
                      <BarChart2 className="w-5 h-5 mr-2" />
                      Analyze Resume Match
                    </>
                  )}
                </motion.button>
              </div>
            </div>
          </div>
        </motion.div>

        {/* Analysis Result */}
        <AnimatePresence>
          {result && (
            <motion.div
              key="result"
              initial={{ opacity: 0, y: 40 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: 40 }}
              transition={{ type: "spring", stiffness: 100, damping: 15 }}
              className={`mt-12 rounded-xl overflow-hidden ${
                darkMode
                  ? "bg-gray-800 shadow-xl shadow-gray-900/30"
                  : "bg-white shadow-lg shadow-gray-200/60"
              }`}
            >
              <div
                className={`bg-gradient-to-r ${getScoreGradient(
                  result.overallScore
                )} px-8 py-6`}
              >
                <div className="flex flex-col md:flex-row md:justify-between md:items-center">
                  <div>
                    <h2 className="text-xl font-bold text-white">
                      Match Analysis Results
                    </h2>
                    <p className="text-white/80 text-sm mt-1">
                      Resume analyzed against specified job requirements
                    </p>
                  </div>
                  <motion.div
                    initial={{ scale: 0.9, opacity: 0 }}
                    animate={{ scale: 1, opacity: 1 }}
                    transition={{ delay: 0.3 }}
                    className="mt-4 md:mt-0 flex items-center"
                  >
                    <div className="relative h-24 w-24">
                      {/* Background circle */}
                      <svg viewBox="0 0 100 100" className="absolute inset-0">
                        <circle
                          cx="50"
                          cy="50"
                          r="40"
                          fill="none"
                          stroke="rgba(255,255,255,0.2)"
                          strokeWidth="10"
                        />
                        {/* Foreground circle - score indicator */}
                        <circle
                          cx="50"
                          cy="50"
                          r="40"
                          fill="none"
                          stroke="white"
                          strokeWidth="10"
                          strokeDasharray={`${result.overallScore * 25.1}, 251`}
                          strokeDashoffset="0"
                          transform="rotate(-90 50 50)"
                        />
                      </svg>
                      {/* Score text */}
                      <div className="absolute inset-0 flex items-center justify-center">
                        <div className="text-center">
                          <span className="text-3xl font-bold text-white">
                            {result.overallScore}
                          </span>
                          <span className="text-white/80 text-sm">/10</span>
                        </div>
                      </div>
                    </div>
                    <div className="ml-4">
                      <div className="text-sm text-white/80">Match Score</div>
                      <div className="text-lg font-semibold text-white">
                        {result.overallScore >= 8
                          ? "Excellent"
                          : result.overallScore >= 5
                          ? "Good"
                          : "Needs Improvement"}
                      </div>
                    </div>
                  </motion.div>
                </div>
              </div>

              <div className="p-6 md:p-8">
                <div
                  className={`mb-8 p-4 rounded-lg ${
                    darkMode ? "bg-gray-700" : "bg-gray-50"
                  }`}
                >
                  <div className="flex flex-col sm:flex-row justify-between">
                    <div className="mb-4 sm:mb-0">
                      <p
                        className={`text-sm ${
                          darkMode ? "text-gray-400" : "text-gray-500"
                        }`}
                      >
                        Candidate
                      </p>
                      <h3
                        className={`text-lg font-bold ${
                          darkMode ? "text-white" : "text-gray-900"
                        }`}
                      >
                        {result.name}
                      </h3>
                      <p
                        className={`text-sm ${
                          darkMode ? "text-gray-300" : "text-gray-700"
                        }`}
                      >
                        {result.email}
                      </p>
                    </div>
                    <div>
                      <p
                        className={`text-sm ${
                          darkMode ? "text-gray-400" : "text-gray-500"
                        }`}
                      >
                        Position
                      </p>
                      <h3
                        className={`text-lg font-bold ${
                          darkMode ? "text-white" : "text-gray-900"
                        }`}
                      >
                        {jobTitle}
                      </h3>
                    </div>
                  </div>
                </div>

                <div className="grid gap-6 md:grid-cols-3">
                  <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: 0.1 }}
                    className={`rounded-lg ${
                      darkMode
                        ? "bg-gray-700 border-l-4 border-emerald-500"
                        : "bg-white border-l-4 border-emerald-500 shadow"
                    }`}
                  >
                    <div className="p-5">
                      <div className="flex items-center mb-4">
                        <div
                          className={`p-2 rounded-full ${
                            darkMode
                              ? "bg-emerald-900/50 text-emerald-400"
                              : "bg-emerald-100 text-emerald-600"
                          }`}
                        >
                          <Check size={18} />
                        </div>
                        <h3
                          className={`ml-3 font-semibold ${
                            darkMode ? "text-emerald-400" : "text-emerald-600"
                          }`}
                        >
                          Strengths
                        </h3>
                      </div>
                      <ul className="space-y-3">
                        {result.strengths.map((strength, index) => (
                          <li
                            key={index}
                            className={`text-sm flex items-start ${
                              darkMode ? "text-gray-300" : "text-gray-700"
                            }`}
                          >
                            <div className="min-w-4 mt-1 mr-2">
                              <div
                                className={`h-1.5 w-1.5 rounded-full ${
                                  darkMode ? "bg-emerald-400" : "bg-emerald-500"
                                }`}
                              ></div>
                            </div>
                            {strength}
                          </li>
                        ))}
                      </ul>
                    </div>
                  </motion.div>

                  <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: 0.2 }}
                    className={`rounded-lg ${
                      darkMode
                        ? "bg-gray-700 border-l-4 border-rose-500"
                        : "bg-white border-l-4 border-rose-500 shadow"
                    }`}
                  >
                    <div className="p-5">
                      <div className="flex items-center mb-4">
                        <div
                          className={`p-2 rounded-full ${
                            darkMode
                              ? "bg-rose-900/50 text-rose-400"
                              : "bg-rose-100 text-rose-600"
                          }`}
                        >
                          <X size={18} />
                        </div>
                        <h3
                          className={`ml-3 font-semibold ${
                            darkMode ? "text-rose-400" : "text-rose-600"
                          }`}
                        >
                          Gaps
                        </h3>
                      </div>
                      <ul className="space-y-3">
                        {result.weaknesses.map((weakness, index) => (
                          <li
                            key={index}
                            className={`text-sm flex items-start ${
                              darkMode ? "text-gray-300" : "text-gray-700"
                            }`}
                          >
                            <div className="min-w-4 mt-1 mr-2">
                              <div
                                className={`h-1.5 w-1.5 rounded-full ${
                                  darkMode ? "bg-rose-400" : "bg-rose-500"
                                }`}
                              ></div>
                            </div>
                            {weakness}
                          </li>
                        ))}
                      </ul>
                    </div>
                  </motion.div>

                  <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: 0.3 }}
                    className={`rounded-lg ${
                      darkMode
                        ? "bg-gray-700 border-l-4 border-blue-500"
                        : "bg-white border-l-4 border-blue-500 shadow"
                    }`}
                  >
                    <div className="p-5">
                      <div className="flex items-center mb-4">
                        <div
                          className={`p-2 rounded-full ${
                            darkMode
                              ? "bg-blue-900/50 text-blue-400"
                              : "bg-blue-100 text-blue-600"
                          }`}
                        >
                          <AlertTriangle size={18} />
                        </div>
                        <h3
                          className={`ml-3 font-semibold ${
                            darkMode ? "text-blue-400" : "text-blue-600"
                          }`}
                        >
                          Recommendations
                        </h3>
                      </div>
                      <ul className="space-y-3">
                        {result.suggestions.map((suggestion, index) => (
                          <li
                            key={index}
                            className={`text-sm flex items-start ${
                              darkMode ? "text-gray-300" : "text-gray-700"
                            }`}
                          >
                            <div className="min-w-4 mt-1 mr-2">
                              <div
                                className={`h-1.5 w-1.5 rounded-full ${
                                  darkMode ? "bg-blue-400" : "bg-blue-500"
                                }`}
                              ></div>
                            </div>
                            {suggestion}
                          </li>
                        ))}
                      </ul>
                    </div>
                  </motion.div>
                </div>

                <div className="flex justify-center mt-10">
                  <motion.button
                    whileHover={{ scale: 1.03 }}
                    whileTap={{ scale: 0.97 }}
                    onClick={() => setResult(null)}
                    className={`
                      px-5 py-2.5 rounded-md flex items-center font-medium
                      ${
                        darkMode
                          ? "bg-gray-700 text-gray-300 hover:bg-gray-600"
                          : "bg-gray-100 text-gray-700 hover:bg-gray-200"
                      }
                      transition-all duration-200
                    `}
                  >
                    <svg
                      xmlns="http://www.w3.org/2000/svg"
                      className="h-4 w-4 mr-2"
                      fill="none"
                      viewBox="0 0 24 24"
                      stroke="currentColor"
                    >
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        strokeWidth={2}
                        d="M10 19l-7-7m0 0l7-7m-7 7h18"
                      />
                    </svg>
                    Try Another Resume
                  </motion.button>
                </div>
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </main>

      <footer
        className={`mt-12 py-6 border-t ${
          darkMode
            ? "bg-gray-800 border-gray-700 text-gray-400"
            : "bg-gray-50 border-gray-200 text-gray-600"
        }`}
      >
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <p className="text-center text-sm">
            ResuMatch Pro - AI-Powered Resume Analysis & Job Matching
          </p>
        </div>
      </footer>
    </div>
  );
};

export default ResumeAnalyzer;
