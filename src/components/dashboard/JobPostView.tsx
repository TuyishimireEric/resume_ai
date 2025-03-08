import React, { useState } from "react";
import { Zap } from "lucide-react";
import { Button } from "@/components/ui/button";
import { useJobs } from "@/app/hooks/jobs/useJobs";
import { AddJob } from "./AddJob";
import { JobCard } from "./JobCard";
import { Job } from "@/types";
import { JobApplicantsView } from "./JobApplicantView";
import { useApplications } from "@/app/hooks/jobs/useApplications";

export function JobPostsView() {
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [selectedJob, setSelectedJob] = useState<Job | null>(null);
  const { data: jobs = [], isLoading, error } = useJobs();

  const { data: applications } = useApplications();

  if (isLoading)
    return <div className="text-center py-8">Loading job listings...</div>;
  if (error)
    return (
      <div className="text-center py-8 text-red-500">
        Error loading jobs. Please try again.
      </div>
    );

  return (
    <>
      {selectedJob !== null ? (
        <JobApplicantsView
          job={selectedJob}
          applications={applications}
          onBack={() => setSelectedJob(null)}
        />
      ) : (
        <div className="space-y-6">
          <div className="flex justify-between items-center">
            <div>
              <h2 className="text-2xl font-bold text-gray-800 dark:text-white">
                Active Job Postings
              </h2>
              <p className="text-gray-600 dark:text-slate-300">
                Manage your current open positions
              </p>
            </div>
            <Button
              onClick={() => setIsModalOpen(true)}
              className="bg-gradient-to-r from-indigo-500 to-violet-600 hover:from-indigo-600 hover:to-violet-700 text-white border-0 shadow-lg shadow-indigo-500/25 hover:shadow-indigo-500/40"
            >
              <Zap className="mr-2 h-4 w-4" /> Create New Job
            </Button>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 max-w-7xl mx-auto">
            {jobs.map((job: Job) => (
              <JobCard
                key={job.id}
                job={job}
                onJobClick={(job: Job) => setSelectedJob(job)}
                isAdmin={true}
              />
            ))}
          </div>

          <AddJob isModalOpen={isModalOpen} setIsModalOpen={setIsModalOpen} />
        </div>
      )}
    </>
  );
}
