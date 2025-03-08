import { Job, Applicant } from "../types";

export const storage = {
  getJobs: (): Job[] => {
    return JSON.parse(localStorage.getItem("jobs") || "[]");
  },
  saveJobs: (jobs: Job[]) => {
    localStorage.setItem("jobs", JSON.stringify(jobs));
  },
  getApplicants: (): Applicant[] => {
    return JSON.parse(localStorage.getItem("applicants") || "[]");
  },
  saveApplicants: (applicants: Applicant[]) => {
    localStorage.setItem("applicants", JSON.stringify(applicants));
  },
};