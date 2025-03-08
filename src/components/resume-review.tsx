"use client";

import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import {
  CheckCircle,
  AlertCircle,
  Lightbulb,
  FileText,
  User,
  Mail,
  BarChart3,
  Award,
} from "lucide-react";
import { Badge } from "@/components/ui/badge";
import { Progress } from "@/components/ui/progress";
import { type ReviewResponse } from "@/types/resume";

export const formatToHtml = (text: string) => {
  // Replace headings (###) with <h2> tags
  text = text.replace(
    /### (.*?)(?=\n|$)/g,
    "<h2 class='text-lg font-semibold dark:text-white text-gray-900 mt-3 mb-2'>$1</h2>"
  );

  // Replace bold text (**) with <strong> tags
  text = text.replace(
    /\*\*(.*?)\*\*/g,
    "<strong class='dark:text-indigo-400 text-indigo-600'>$1</strong>"
  );

  return text;
};

interface ResumeReviewProps {
  reviewData: ReviewResponse | null;
}

export function ResumeReview({ reviewData }: ResumeReviewProps) {
  if (!reviewData) {
    return (
      <Card className="border dark:border-0 bg-white dark:bg-gradient-to-br dark:from-slate-800 dark:to-slate-900 shadow-lg dark:shadow-2xl dark:border-white/5 h-full">
        <CardHeader>
          <CardTitle className="text-gray-900 dark:text-white">
            Resume Analysis
          </CardTitle>
          <CardDescription className="text-gray-500 dark:text-slate-400">
            Upload your resume to get AI-powered feedback and suggestions
          </CardDescription>
        </CardHeader>
        <CardContent className="flex flex-col items-center justify-center h-[400px] text-center">
          <div className="w-16 h-16 rounded-full bg-indigo-100 dark:bg-indigo-500/20 flex items-center justify-center mb-4">
            <FileText className="h-8 w-8 text-indigo-600 dark:text-indigo-400" />
          </div>
          <p className="text-gray-500 dark:text-slate-400">
            Your analysis results will appear here after uploading
          </p>
        </CardContent>
      </Card>
    );
  }

  const { name, email, overallScore, strengths, weaknesses, suggestions } =
    reviewData;

  const getScoreColor = (score: number) => {
    if (score >= 8) return "bg-green-500";
    if (score >= 6) return "bg-amber-500";
    return "bg-red-500";
  };

  const getScoreBadgeVariant = (score: number) => {
    if (score >= 8) return "default";
    if (score >= 6) return "outline";
    return "secondary";
  };

  return (
    <Card className="border dark:border-0 bg-white dark:bg-gradient-to-br dark:from-slate-800 dark:to-slate-900 shadow-lg dark:shadow-2xl dark:border-white/5 h-full">
      <CardHeader>
        <CardTitle className="flex justify-between items-center text-gray-900 dark:text-white">
          Resume Analysis
          <Badge
            variant={getScoreBadgeVariant(overallScore)}
            className={`${
              overallScore >= 8
                ? "bg-gradient-to-r from-green-500 to-emerald-600"
                : overallScore >= 6
                ? "bg-gradient-to-r from-amber-500 to-orange-600"
                : "bg-gradient-to-r from-red-500 to-rose-600"
            }`}
          >
            Score: {overallScore * 10}/100
          </Badge>
        </CardTitle>
        <CardDescription className="text-gray-500 dark:text-slate-400">
          AI-powered analysis of your resume
        </CardDescription>
      </CardHeader>
      <CardContent>
        {/* Applicant Info Card */}
        <div className="mb-6 p-4 bg-gray-50 dark:bg-slate-800/60 backdrop-blur-sm rounded-lg border border-gray-100 dark:border-white/5">
          <div className="flex flex-col sm:flex-row gap-4 sm:items-center">
            <div className="w-12 h-12 rounded-full bg-indigo-100 dark:bg-indigo-500/20 flex items-center justify-center">
              <User className="h-6 w-6 text-indigo-600 dark:text-indigo-400" />
            </div>
            <div className="flex-1">
              <div className="flex flex-col sm:flex-row sm:justify-between sm:items-center gap-2">
                <div>
                  <h3 className="text-lg font-semibold text-gray-900 dark:text-white">
                    {name || "No name provided"}
                  </h3>
                  <div className="flex items-center text-gray-500 dark:text-slate-400">
                    <Mail className="h-4 w-4 mr-1" />
                    <span>{email || "No email provided"}</span>
                  </div>
                </div>
                <div className="flex items-center">
                  <div className="h-8 w-8 rounded-full flex items-center justify-center bg-indigo-100 dark:bg-indigo-500/20 mr-2">
                    <Award className="h-4 w-4 text-indigo-600 dark:text-indigo-400" />
                  </div>
                  <div>
                    <span className="text-xs text-gray-500 dark:text-slate-400">
                      Overall Rating
                    </span>
                    <div className="flex items-center">
                      <div
                        className={`h-2 w-2 rounded-full ${getScoreColor(
                          overallScore
                        )} mr-1.5`}
                      ></div>
                      <span className="font-medium text-gray-900 dark:text-white">
                        {overallScore >= 8
                          ? "Excellent"
                          : overallScore >= 6
                          ? "Good"
                          : "Needs Improvement"}
                      </span>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>

        <Tabs defaultValue="overview" className="mt-2">
          <TabsList className="grid grid-cols-4 mb-4 bg-gray-100 dark:bg-slate-800 p-1 rounded-lg">
            <TabsTrigger
              value="overview"
              className="text-gray-500 dark:text-slate-400 data-[state=active]:bg-indigo-100 dark:data-[state=active]:bg-indigo-500/10 data-[state=active]:text-indigo-600 dark:data-[state=active]:text-indigo-400"
            >
              Overview
            </TabsTrigger>
            <TabsTrigger
              value="strengths"
              className="text-gray-500 dark:text-slate-400 data-[state=active]:bg-indigo-100 dark:data-[state=active]:bg-indigo-500/10 data-[state=active]:text-indigo-600 dark:data-[state=active]:text-indigo-400"
            >
              Strengths
            </TabsTrigger>
            <TabsTrigger
              value="weaknesses"
              className="text-gray-500 dark:text-slate-400 data-[state=active]:bg-indigo-100 dark:data-[state=active]:bg-indigo-500/10 data-[state=active]:text-indigo-600 dark:data-[state=active]:text-indigo-400"
            >
              Weaknesses
            </TabsTrigger>
            <TabsTrigger
              value="suggestions"
              className="text-gray-500 dark:text-slate-400 data-[state=active]:bg-indigo-100 dark:data-[state=active]:bg-indigo-500/10 data-[state=active]:text-indigo-600 dark:data-[state=active]:text-indigo-400"
            >
              Suggestions
            </TabsTrigger>
          </TabsList>

          <TabsContent value="overview" className="space-y-6">
            <div>
              <div className="flex justify-between mb-2">
                <span className="text-sm font-medium text-gray-900 dark:text-white">
                  Overall Score
                </span>
                <span className="text-sm text-gray-900 dark:text-white">
                  {overallScore * 10}%
                </span>
              </div>
              <Progress
                value={overallScore * 10}
                className={`${
                  overallScore >= 8
                    ? "bg-gradient-to-r from-green-500 to-emerald-600"
                    : overallScore >= 6
                    ? "bg-gradient-to-r from-amber-500 to-orange-600"
                    : "bg-gradient-to-r from-red-500 to-rose-600 h-2 bg-gray-200 dark:bg-slate-700"
                }`}
              />
            </div>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              <div className="bg-gray-50 dark:bg-slate-800/40 backdrop-blur-sm rounded-lg border border-gray-100 dark:border-white/5 p-4">
                <div className="flex items-center gap-2 mb-2">
                  <CheckCircle className="h-5 w-5 text-green-500" />
                  <h3 className="font-medium text-gray-900 dark:text-white">
                    Strengths
                  </h3>
                </div>
                <p className="text-sm text-gray-500 dark:text-slate-400">
                  {strengths.length} key strengths identified
                </p>
              </div>

              <div className="bg-gray-50 dark:bg-slate-800/40 backdrop-blur-sm rounded-lg border border-gray-100 dark:border-white/5 p-4">
                <div className="flex items-center gap-2 mb-2">
                  <AlertCircle className="h-5 w-5 text-red-500" />
                  <h3 className="font-medium text-gray-900 dark:text-white">
                    Weaknesses
                  </h3>
                </div>
                <p className="text-sm text-gray-500 dark:text-slate-400">
                  {weaknesses.length} areas for improvement
                </p>
              </div>

              <div className="bg-gray-50 dark:bg-slate-800/40 backdrop-blur-sm rounded-lg border border-gray-100 dark:border-white/5 p-4">
                <div className="flex items-center gap-2 mb-2">
                  <Lightbulb className="h-5 w-5 text-amber-500" />
                  <h3 className="font-medium text-gray-900 dark:text-white">
                    Suggestions
                  </h3>
                </div>
                <p className="text-sm text-gray-500 dark:text-slate-400">
                  {suggestions.length} actionable recommendations
                </p>
              </div>
            </div>

            <div className="mt-4 bg-gray-50 dark:bg-slate-800/40 backdrop-blur-sm rounded-lg border border-gray-100 dark:border-white/5 p-4">
              <h4 className="text-md font-medium mb-3 text-gray-900 dark:text-white flex items-center">
                <BarChart3 className="h-5 w-5 mr-2 text-indigo-600 dark:text-indigo-400" />
                Executive Summary
              </h4>
              <div
                className="text-gray-700 dark:text-slate-300 space-y-2"
                dangerouslySetInnerHTML={{
                  __html: formatToHtml(suggestions.slice(0, 2).join("\n\n")),
                }}
              />
            </div>
          </TabsContent>

          <TabsContent value="strengths">
            <div className="bg-gray-50 dark:bg-slate-800/40 backdrop-blur-sm rounded-lg border border-gray-100 dark:border-white/5 p-4">
              <ul className="space-y-3">
                {strengths.map((strength, index) => (
                  <li
                    key={index}
                    className="flex gap-3 pb-3 border-b border-gray-200 dark:border-slate-700/50 last:border-0"
                  >
                    <CheckCircle className="h-5 w-5 text-green-500 flex-shrink-0 mt-0.5" />
                    <div
                      className="text-gray-700 dark:text-slate-300"
                      dangerouslySetInnerHTML={{
                        __html: formatToHtml(strength),
                      }}
                    />
                  </li>
                ))}
                {strengths.length === 0 && (
                  <li className="text-gray-500 dark:text-slate-400 text-center py-6">
                    No strengths identified
                  </li>
                )}
              </ul>
            </div>
          </TabsContent>

          <TabsContent value="weaknesses">
            <div className="bg-gray-50 dark:bg-slate-800/40 backdrop-blur-sm rounded-lg border border-gray-100 dark:border-white/5 p-4">
              <ul className="space-y-3">
                {weaknesses.map((weakness, index) => (
                  <li
                    key={index}
                    className="flex gap-3 pb-3 border-b border-gray-200 dark:border-slate-700/50 last:border-0"
                  >
                    <AlertCircle className="h-5 w-5 text-red-500 flex-shrink-0 mt-0.5" />
                    <div
                      className="text-gray-700 dark:text-slate-300"
                      dangerouslySetInnerHTML={{
                        __html: formatToHtml(weakness),
                      }}
                    />
                  </li>
                ))}
                {weaknesses.length === 0 && (
                  <li className="text-gray-500 dark:text-slate-400 text-center py-6">
                    No weaknesses identified
                  </li>
                )}
              </ul>
            </div>
          </TabsContent>

          <TabsContent value="suggestions">
            <div className="bg-gray-50 dark:bg-slate-800/40 backdrop-blur-sm rounded-lg border border-gray-100 dark:border-white/5 p-4">
              <ul className="space-y-3">
                {suggestions.map((suggestion, index) => (
                  <li
                    key={index}
                    className="flex gap-3 pb-3 border-b border-gray-200 dark:border-slate-700/50 last:border-0"
                  >
                    <Lightbulb className="h-5 w-5 text-amber-500 flex-shrink-0 mt-0.5" />
                    <div
                      className="text-gray-700 dark:text-slate-300"
                      dangerouslySetInnerHTML={{
                        __html: formatToHtml(suggestion),
                      }}
                    />
                  </li>
                ))}
                {suggestions.length === 0 && (
                  <li className="text-gray-500 dark:text-slate-400 text-center py-6">
                    No suggestions provided
                  </li>
                )}
              </ul>
            </div>
          </TabsContent>
        </Tabs>
      </CardContent>
    </Card>
  );
}
