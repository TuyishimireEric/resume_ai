import { formatDateToRelative } from "@/lib/functions";
import { useQuery } from "@tanstack/react-query";
import axios from "axios";

export const useJobs = () => {
  return useQuery({
    queryKey: ["jobs"],
    queryFn: async () => {
      const response = await axios.get("/api/jobs");
      return response.data.map((job: any) => ({
        ...job,
        requirements: job.requirements ? JSON.parse(job.requirements) : [],
        applicants: job.applicants || 0,
        posted: job.open_date
          ? formatDateToRelative(job.open_date)
          : "Recently",
      }));
    },
  });
};
