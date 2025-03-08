import { ApplicationI } from "@/types/applications";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import axios from "axios";

export function useCreateApplication() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async (application: ApplicationI) => {
      const response = await axios.post("/api/applications", application);
      return response.data;
    },

    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["applications"] });
    },
  });
}
