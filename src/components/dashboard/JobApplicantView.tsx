import React from "react";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Eye, Bell, Zap, AlertCircle } from "lucide-react";
import { ApplicationI } from "@/types/applications";
import { Job } from "@/types";

interface JobApplicantsViewProps {
  job: Job | null;
  applications: ApplicationI[];
  onBack: () => void;
  isLoading?: boolean;
  error?: string | null;
}

export function JobApplicantsView({
  applications,
  job,
  onBack,
  isLoading = false,
  error = null,
}: JobApplicantsViewProps) {
  const jobTitle = job?.title || "Job";
  const filtered = job
    ? applications.filter((app) => app.job_id === job.id)
    : [];

  const applicants = filtered
    .sort((a, b) =>
      parseFloat(a.match_score) > parseFloat(b.match_score) ? -1 : 1
    )
    .slice(0, Number(job?.required_staff) || 20);

  if (isLoading) {
    return (
      <div className="flex flex-col items-center justify-center h-96">
        <div className="w-12 h-12 border-4 border-t-indigo-500 border-r-transparent border-b-transparent border-l-transparent rounded-full animate-spin mb-4"></div>
        <p className="text-slate-500 dark:text-slate-400">
          Loading applicants...
        </p>
      </div>
    );
  }

  // Error message component
  if (error) {
    return (
      <div className="flex flex-col items-center justify-center h-96 text-center">
        <div className="rounded-full bg-red-100 dark:bg-red-900/20 p-3 text-red-500 dark:text-red-400 mb-4">
          <AlertCircle className="h-8 w-8" />
        </div>
        <h3 className="text-xl font-medium text-slate-900 dark:text-white mb-2">
          Error Loading Data
        </h3>
        <p className="text-slate-600 dark:text-slate-400 max-w-md mb-6">
          {error}
        </p>
        <Button
          onClick={onBack}
          className="bg-slate-200 hover:bg-slate-300 text-slate-800 dark:bg-slate-700 dark:hover:bg-slate-600 dark:text-white"
        >
          Go Back
        </Button>
      </div>
    );
  }

  // No job found error
  if (!job) {
    return (
      <div className="flex flex-col items-center justify-center h-96 text-center">
        <div className="rounded-full bg-yellow-100 dark:bg-yellow-900/20 p-3 text-yellow-500 dark:text-yellow-400 mb-4">
          <AlertCircle className="h-8 w-8" />
        </div>
        <h3 className="text-xl font-medium text-slate-900 dark:text-white mb-2">
          Job Not Found
        </h3>
        <p className="text-slate-600 dark:text-slate-400 max-w-md mb-6">
          The job you're looking for doesn't exist or has been removed.
        </p>
        <Button
          onClick={onBack}
          className="bg-slate-200 hover:bg-slate-300 text-slate-800 dark:bg-slate-700 dark:hover:bg-slate-600 dark:text-white"
        >
          Back to Jobs
        </Button>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <div>
        <Button
          variant="ghost"
          onClick={onBack}
          className="mb-4 text-slate-600 hover:text-slate-900 hover:bg-slate-100 dark:text-slate-300 dark:hover:text-white dark:hover:bg-white/5"
        >
          ← Back to Jobs
        </Button>
        <div className="flex justify-between items-center">
          <div>
            <h2 className="text-2xl font-bold text-slate-900 dark:text-white">
              {jobTitle}
            </h2>
            <p className="text-slate-600 dark:text-slate-300">
              {applicants.length} applicants found
            </p>
          </div>
          <div className="flex gap-2">
            <Button className="bg-gradient-to-r from-indigo-500 to-violet-600 hover:from-indigo-600 hover:to-violet-700 text-white border-0 shadow-lg shadow-indigo-500/25 hover:shadow-indigo-500/40">
              <Zap className="mr-2 h-4 w-4" /> Export List
            </Button>
          </div>
        </div>
      </div>

      {applicants.length === 0 ? (
        <Card className="border border-slate-200 dark:border-0 bg-white dark:bg-gradient-to-br dark:from-slate-800 dark:to-slate-900 shadow-lg dark:shadow-2xl overflow-hidden">
          <CardContent className="p-12 flex flex-col items-center justify-center text-center">
            <div className="w-16 h-16 rounded-full bg-slate-100 dark:bg-slate-700 flex items-center justify-center mb-4">
              <Eye className="h-8 w-8 text-slate-400 dark:text-slate-500" />
            </div>
            <h3 className="text-xl font-medium text-slate-900 dark:text-white mb-2">
              No Applicants Yet
            </h3>
            <p className="text-slate-600 dark:text-slate-400 max-w-md mb-6">
              There are no applicants for this job position yet. Check back
              later or adjust your job requirements.
            </p>
            <Button className="bg-indigo-500 hover:bg-indigo-600 text-white">
              Share Job Posting
            </Button>
          </CardContent>
        </Card>
      ) : (
        <Card className="border border-slate-200 dark:border-0 shadow-lg dark:shadow-2xl bg-white dark:bg-gradient-to-br dark:from-slate-800 dark:to-slate-900 overflow-hidden backdrop-blur-sm">
          <div className="absolute inset-0 bg-white/50 dark:bg-transparent dark:bg-gradient-to-br dark:from-indigo-600/5 dark:to-violet-600/5"></div>
          <CardContent className="p-0 relative">
            <div className="overflow-x-auto">
              <table className="w-full">
                <thead>
                  <tr className="border-b border-slate-200 dark:border-white/10">
                    <th className="text-left text-xs font-medium text-slate-500 dark:text-slate-400 uppercase tracking-wider px-6 py-4">
                      Applicant
                    </th>
                    <th className="text-left text-xs font-medium text-slate-500 dark:text-slate-400 uppercase tracking-wider px-6 py-4">
                      Match Score
                    </th>
                    <th className="text-left text-xs font-medium text-slate-500 dark:text-slate-400 uppercase tracking-wider px-6 py-4">
                      Status
                    </th>
                    <th className="text-left text-xs font-medium text-slate-500 dark:text-slate-400 uppercase tracking-wider px-6 py-4">
                      Applied
                    </th>
                    <th className="text-left text-xs font-medium text-slate-500 dark:text-slate-400 uppercase tracking-wider px-6 py-4">
                      Actions
                    </th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-200 dark:divide-white/10">
                  {applicants.map((applicant) => (
                    <tr
                      key={applicant.id}
                      className="hover:bg-slate-50 dark:hover:bg-white/5 transition-colors"
                    >
                      <td className="px-6 py-4 whitespace-nowrap">
                        <div className="flex items-center">
                          <div className="flex-shrink-0 h-10 w-10 rounded-full bg-gradient-to-r from-indigo-500 to-violet-600 flex items-center justify-center text-white font-semibold">
                            {applicant.user_name?.charAt(0) || "U"}
                          </div>
                          <div className="ml-4">
                            <div className="font-medium text-slate-900 dark:text-white">
                              {applicant.user_name}
                            </div>
                            <div className="text-sm text-slate-500 dark:text-slate-400">
                              {applicant.user_email}
                            </div>
                          </div>
                        </div>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        <div className="text-sm font-medium text-emerald-600 dark:text-emerald-400">
                          {applicant.match_score}
                        </div>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        <span className="px-2 py-1 text-xs font-medium rounded-full bg-indigo-100 text-indigo-700 dark:bg-indigo-500/20 dark:text-indigo-300">
                          {applicant.status}
                        </span>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-slate-500 dark:text-slate-400">
                        {applicant.created_at}
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm">
                        <div className="flex space-x-2">
                          <Button
                            size="sm"
                            className="bg-white hover:bg-slate-50 text-indigo-600 border border-indigo-200 hover:border-indigo-300 dark:bg-indigo-500/20 dark:hover:bg-indigo-500/30 dark:text-indigo-300 dark:border-indigo-500/30"
                          >
                            <Eye className="h-4 w-4 mr-1" /> Resume
                          </Button>
                        </div>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </CardContent>
        </Card>
      )}
    </div>
  );
}
