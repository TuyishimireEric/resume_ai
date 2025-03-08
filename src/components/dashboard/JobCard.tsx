import React from "react";
import { Card } from "@/components/ui/card";
import {
  MapPin,
  Users,
  Eye,
  Calendar,
  UserPlus,
  Clock,
  Badge,
  CheckCircle,
  PlusCircle,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Job } from "@/types";

interface JobCardProps {
  job: Job;
  onJobClick: (job: Job) => void;
  isAdmin?: boolean;
}

export const JobCard = ({ job, onJobClick, isAdmin }: JobCardProps) => {
  return (
    <Card
      key={job.id}
      className="group relative border-0 rounded-xl shadow-lg hover:shadow-xl dark:bg-gray-900/90 overflow-hidden transition-all duration-300 hover:translate-y-[-2px]"
    >
      {/* Decorative accent bar at top */}
      <div className="absolute top-0 left-0 right-0 h-1 bg-gradient-to-r from-blue-500 to-indigo-600"></div>

      <div className="p-6">
        {/* Header section with title and location */}
        <div className="mb-4 flex items-center justify-between">
          <h3 className="font-bold text-xl text-gray-900 dark:text-white mb-2 group-hover:text-blue-600 dark:group-hover:text-blue-400 transition-colors duration-200">
            {job.title}
          </h3>
          <div className="flex items-center text-gray-600 dark:text-gray-300 text-xs bg-gray-100 dark:bg-gray-800 px-2.5 py-1 rounded-full w-fit">
            <MapPin className="h-3.5 w-3.5 mr-1.5" />
            <span>{job.location}</span>
          </div>
        </div>

        {/* Job stats: Applicants, required staff, and deadline in one row */}
        <div className="flex flex-wrap items-center gap-3 mb-5">
          <div className="flex items-center px-3 py-1.5 bg-blue-50 dark:bg-blue-900/40 rounded-lg border border-blue-100 dark:border-blue-800">
            <div className="mr-2 bg-blue-100 dark:bg-blue-800/50 rounded-full p-1">
              <Users className="h-3.5 w-3.5 text-blue-600 dark:text-blue-400" />
            </div>
            <span className="text-xs font-medium text-blue-700 dark:text-blue-300">
              {job.applicants || 0} Applicants
            </span>
          </div>

          {job.required_staff && (
            <div className="flex items-center px-3 py-1.5 bg-indigo-50 dark:bg-indigo-900/20 rounded-lg border border-indigo-100 dark:border-indigo-800/40">
              <div className="mr-2 bg-indigo-100 dark:bg-indigo-800/50 rounded-full p-1">
                <UserPlus className="h-3.5 w-3.5 text-indigo-600 dark:text-indigo-400" />
              </div>
              <span className="text-xs font-medium text-indigo-700 dark:text-indigo-300">
                {job.required_staff}{" "}
                {parseInt(job.required_staff) === 1
                  ? "open position"
                  : "open positions"}
              </span>
            </div>
          )}

          {job.close_date && (
            <div className="flex items-center px-3 py-1.5 bg-amber-50 dark:bg-amber-900/20 rounded-lg border border-amber-100 dark:border-amber-800/40">
              <div className="mr-2 bg-amber-100 dark:bg-amber-800/50 rounded-full p-1">
                <Clock className="h-3.5 w-3.5 text-amber-600 dark:text-amber-400" />
              </div>
              <span className="text-xs font-medium text-amber-700 dark:text-amber-300">
                Closes: {new Date(job.close_date).toLocaleDateString()}
              </span>
            </div>
          )}
        </div>

        {/* Requirements section */}
        {job.requirements && (
          <div className="mb-5">
            <h4 className="text-sm font-semibold text-gray-800 dark:text-gray-200 mb-3 flex items-center">
              <Badge className="h-4 w-4 mr-1.5 text-blue-500" />
              Key Requirements
            </h4>
            <div className="bg-gray-50 dark:bg-gray-800/50 rounded-lg p-4 border border-gray-100 dark:border-gray-800">
              <ul className="space-y-2">
                {job.requirements
                  .filter((req) => req.trim() !== "")
                  .slice(0, 3)
                  .map((requirement, index) => (
                    <li
                      key={index}
                      className="text-sm text-gray-700 dark:text-gray-300 flex items-start"
                    >
                      <div className="bg-blue-100 dark:bg-blue-900/30 rounded-full p-0.5 mr-2.5 mt-0.5 flex-shrink-0">
                        <CheckCircle className="h-3.5 w-3.5 text-blue-600 dark:text-blue-400" />
                      </div>
                      <span>{requirement}</span>
                    </li>
                  ))}
              </ul>
              {job.requirements.filter((req) => req.trim() !== "").length >
                3 && (
                <div className="text-xs text-blue-600 dark:text-blue-400 mt-3 font-medium flex items-center cursor-pointer hover:underline">
                  <PlusCircle className="h-3.5 w-3.5 mr-1" />
                  {job.requirements.filter((req) => req.trim() !== "").length -
                    3}{" "}
                  more requirements
                </div>
              )}
            </div>
          </div>
        )}

        {/* Posted date - moved above action buttons */}
        <div className="flex items-center text-xs text-gray-500 dark:text-gray-400 mb-4">
          <Calendar className="h-3.5 w-3.5 mr-1.5" />
          <span>Posted: {job.posted}</span>
        </div>

        {/* Action buttons */}
        <div className="grid grid-cols-1 gap-3">
          <Button
            onClick={() => onJobClick(job)}
            className="bg-blue-300 hover:bg-blue-400 dark:bg-gray-800 dark:hover:bg-gray-700/80 text-gray-800 dark:text-white border border-gray-200 dark:border-gray-700 font-medium rounded-lg"
            variant="outline"
          >
            <Eye className="h-4 w-4 mr-2" />{" "}
            {isAdmin ? "View Applied" : "Apply Now!"}
          </Button>
        </div>
      </div>
    </Card>
  );
};
