import { useQuery } from "@tanstack/react-query";
import axios from "axios";

export const useApplications = () => {
  return useQuery({
    queryKey: ["applications"],
    queryFn: async () => {
      const response = await axios.get("/api/applications");
      return response.data;
    },
  });
};
