// export interface Job {
//   id: string;
//   title: string;
//   description: string;
//   publishedDate: string;
//   deadline: string;
//   requiredSkills: string[];
//   requiredExperience: number;
//   neededApplicants: number;
//   status: "published" | "expired";
// }

export interface Job {
  id: string;
  title: string;
  location: string;
  applicants?: number;
  posted?: string;
  description?: string;
  requirements?: string[];
  required_staff?: string;
  open_date?: string;
  close_date?: string;
}

export interface Applicant {
  id: string;
  name: string;
  email: string;
  phone: string;
  education: string;
  experience: string[];
  skills: string[];
  cvFile: string; // Base64 encoded file
  score: number;
  jobId: string;
  submissionDate: string;
}
