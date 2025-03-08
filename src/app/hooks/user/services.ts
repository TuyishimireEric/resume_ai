import { UserI } from "@/types/user";
import axios from "axios";

export const registerUser = async (formData: UserI) => {
    const response = await axios.post("/api/auth/register", formData);
    return response.data.data;
  };
  