"use client";

import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";
import { Briefcase } from "lucide-react";

interface JobDescriptionInputProps {
  value: string;
  onChange: (value: string) => void;
}

export function JobDescriptionInput({ value, onChange }: JobDescriptionInputProps) {
  return (
    <div>
      <div className="flex items-center gap-2 mb-2">
        <Briefcase className="h-4 w-4 text-indigo-400" />
        <Label htmlFor="job-description" className="text-white font-medium">Job Description (Optional)</Label>
      </div>
      <Textarea
        id="job-description"
        placeholder="Paste the job description here to get tailored feedback..."
        value={value}
        onChange={(e) => onChange(e.target.value)}
        className="min-h-[120px] resize-y bg-slate-800/50 border border-slate-700 text-slate-300 rounded-lg p-3 focus:ring-1 focus:ring-indigo-500 focus:ring-opacity-50 placeholder:text-slate-500"
      />
      <p className="text-xs text-slate-400 mt-1">
        Adding a job description helps tailor the analysis to specific job requirements
      </p>
    </div>
  );
}