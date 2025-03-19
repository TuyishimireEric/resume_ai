import { useMutation, useQueryClient } from "@tanstack/react-query";
import axios from "axios";

interface UpdateRoleResponse {
  success: boolean;
  message: string;
}

export function useUpdateRole() {
  const queryClient = useQueryClient();

  return useMutation<UpdateRoleResponse, Error, { userId: string, newRole: string }>({
    mutationFn: async ({ userId, newRole }) => {
      const response = await axios.patch("/api/users", {
        userId,
        newRole,
      });
      return response.data;
    },

    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["users"] });
    },

    onError: (error: Error) => {
      console.error("Error updating user role:", error.message);
    },
  });
}
