import { useMutation, useQueryClient } from "@tanstack/react-query";
import axios from "axios";
import { z } from "zod";

// Define the schema for job creation to ensure type safety
export const createJobSchema = z.object({
  title: z.string().min(1, "Title is required"),
  description: z.string().optional(),
  required_staff: z.string(),
  requirements: z.string().optional(),
  location: z.string().min(1, "Location is required"),
  open_date: z.string().optional(),
  close_date: z.string().optional(),
});

export type CreateJobInput = z.infer<typeof createJobSchema>;

export function useCreateJobMutation() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async (jobData: CreateJobInput) => {
      const validatedData = createJobSchema.parse(jobData);
      console.log("validatedData:", validatedData);
      const response = await axios.post("/api/jobs", validatedData);
      return response.data;
    },

    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["jobs"] });
    },
  });
}
