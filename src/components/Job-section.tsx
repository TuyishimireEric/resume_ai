"use client";

import React from "react";
import {
  FileText,
  CheckCircle,
  MapPin,
  Calendar,
  Clock,
  Badge,
  Users,
  Briefcase,
  Search,
  Filter,
  ArrowRight,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { useJobs } from "@/app/hooks/jobs/useJobs";
import { Job } from "@/types";
import { JobCard } from "./dashboard/JobCard";
import Link from "next/link";
import { useRouter } from "next/navigation";

export default function JobsSection() {
  const { data: jobs = [], isLoading, error } = useJobs();
  const router = useRouter();

  const onJobClick = (job: Job) => {
    router.push(`/resume?job_id=${job.id}`);
  };

  if (isLoading)
    return <div className="text-center py-8">Loading job listings...</div>;
  if (error)
    return (
      <div className="text-center py-8 text-red-500">
        Error loading jobs. Please try again.
      </div>
    );

  return (
    <section className="relative overflow-hidden py-24 bg-gradient-to-b from-slate-100 to-white dark:from-slate-800 dark:to-slate-900">
      {/* Abstract background elements */}
      <div className="absolute top-0 left-1/2 -translate-x-1/2 w-full max-w-7xl">
        <div className="absolute -top-24 right-1/4 w-80 h-80 bg-blue-600/10 dark:bg-blue-600/20 rounded-full blur-3xl"></div>
        <div className="absolute top-60 -left-20 w-64 h-64 bg-violet-600/10 dark:bg-violet-600/20 rounded-full blur-3xl"></div>
      </div>

      {/* Subtle grid overlay */}
      <div className="absolute inset-0 bg-grid-slate-800/[0.05] dark:bg-grid-white/[0.05] bg-[size:20px_20px]"></div>

      <div className="container mx-auto px-4 relative z-10">
        <div className="text-center mb-16">
          <div className="inline-flex items-center px-4 py-2 rounded-full bg-indigo-100 dark:bg-indigo-900/40 text-indigo-700 dark:text-indigo-300 text-sm font-medium mb-6">
            <Briefcase className="h-4 w-4 mr-2" />
            Career Opportunities
          </div>

          <h2 className="text-3xl sm:text-4xl md:text-5xl font-bold mb-6 text-slate-800 dark:text-white tracking-tight">
            <span className="inline-block">
              Find Your{" "}
              <span className="text-transparent bg-clip-text bg-gradient-to-r from-indigo-500 via-violet-500 to-purple-500 dark:from-indigo-400 dark:via-violet-400 dark:to-purple-400">
                Perfect Role
              </span>
            </span>
          </h2>

          <p className="text-lg md:text-xl text-slate-600 dark:text-slate-300 max-w-3xl mx-auto leading-relaxed">
            Browse our curated selection of opportunities and find positions
            that match your skills, experience, and career aspirations.
          </p>
        </div>

        {/* Search and Filter */}
        <div className="max-w-4xl mx-auto mb-12">
          <div className="flex flex-col md:flex-row gap-4 p-4 bg-white dark:bg-slate-800/90 rounded-xl shadow-sm border border-slate-200 dark:border-slate-700">
            <div className="relative flex-grow">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-5 w-5 text-slate-400" />
              <Input
                type="text"
                placeholder="Search for jobs..."
                className="pl-10 bg-slate-50 dark:bg-slate-700/50 border-slate-200 dark:border-slate-600"
              />
            </div>
            <Button className="flex items-center bg-slate-100 dark:bg-slate-700 hover:bg-slate-200 dark:hover:bg-slate-600 text-slate-700 dark:text-slate-200">
              <Filter className="h-4 w-4 mr-2" />
              Filters
            </Button>
            <Button className="bg-gradient-to-r from-indigo-500 to-violet-600 text-white">
              Search
            </Button>
          </div>
        </div>

        {/* Featured Jobs Header */}
        <div className="flex justify-between items-center mb-8">
          <h3 className="text-2xl font-bold text-slate-800 dark:text-white">
            Featured Opportunities
          </h3>
          <a
            href="/all-jobs"
            className="flex items-center text-indigo-600 dark:text-indigo-400 font-medium hover:text-indigo-700 dark:hover:text-indigo-300 transition-colors"
          >
            View All
            <ArrowRight className="ml-2 h-4 w-4" />
          </a>
        </div>

        {/* Job Cards */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 max-w-7xl mx-auto mb-12">
          {jobs?.map((job: Job) => (
            <JobCard
              key={job.id}
              job={job}
              onJobClick={(job: Job) => onJobClick(job)}
            />
          ))}
        </div>

        {/* Stats banner */}
        <div className="bg-gradient-to-r from-white/80 via-white/90 to-white/80 dark:from-slate-800/50 dark:via-slate-800/80 dark:to-slate-800/50 backdrop-blur-sm rounded-2xl border border-slate-200 dark:border-slate-700 p-8 max-w-4xl mx-auto shadow-sm mb-12">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8 text-center">
            {[
              {
                number: "500+",
                label: "Open Positions",
                icon: <Briefcase className="h-6 w-6" />,
              },
              {
                number: "150+",
                label: "Partner Companies",
                icon: <Badge className="h-6 w-6" />,
              },
              {
                number: "92%",
                label: "Placement Rate",
                icon: <CheckCircle className="h-6 w-6" />,
              },
            ].map((stat, i) => (
              <div key={i} className="flex flex-col items-center">
                <div className="w-12 h-12 rounded-full bg-indigo-100 dark:bg-indigo-900/40 flex items-center justify-center mb-3 text-indigo-600 dark:text-indigo-400">
                  {stat.icon}
                </div>
                <p className="text-2xl font-bold text-transparent bg-clip-text bg-gradient-to-r from-indigo-500 to-violet-500 dark:from-indigo-400 dark:to-violet-400">
                  {stat.number}
                </p>
                <p className="text-sm text-slate-600 dark:text-slate-400">
                  {stat.label}
                </p>
              </div>
            ))}
          </div>
        </div>

        {/* CTA */}
        <div className="text-center">
          <Link
            href={"/resume"}
            className="px-8 py-4 rounded-lg bg-gradient-to-r from-indigo-500 to-violet-600 text-white font-medium text-lg shadow-lg shadow-indigo-500/25 hover:shadow-indigo-500/40 transition-all duration-300 hover:scale-105"
          >
            Upload Your Resume
          </Link>
          <p className="mt-4 text-slate-600 dark:text-slate-400 text-sm">
            Let our AI match you with the perfect opportunities
          </p>
        </div>
      </div>
    </section>
  );
}
