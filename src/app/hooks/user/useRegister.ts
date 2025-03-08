"use client";

import { useState } from "react";
import { useMutation } from "@tanstack/react-query";
import { signIn } from "next-auth/react";
import axios from "axios";
import showToast from "@/lib/showToast";
import { UserI } from "@/types/user";

// Define types for the form data and registration data
interface AuthFormData {
  name: string;
  email: string;
  password: string;
}

// Function to register a user
const registerUser = async (userData: UserI) => {
  const response = await axios.post("/api/auth/register", userData);
  return response.data;
};

export const useAuth = () => {
  const [isLoading, setIsLoading] = useState(false);
  const [success, setSuccess] = useState(false);

  // Registration mutation
  const registerMutation = useMutation({
    mutationFn: (userData: AuthFormData) =>
      registerUser({
        name: userData.name,
        email: userData.email,
        password: userData.password,
      }),
    onSuccess: async (data, variables) => {
      showToast("Registration successful", "success");

      // Auto-login after successful registration
      try {
        const result = await signIn("credentials", {
          redirect: false,
          email: variables.email,
          password: variables.password,
        });

        if (result?.error) {
          showToast("Login failed after registration", "error");
          return;
        }

        if (result?.ok) {
          setSuccess(true);
          showToast("You are now logged in", "success");
        }
      } catch (error) {
        console.error("Auto-login error:", error);
        showToast("Auto-login failed", "error");
      }
    },
    onError: (error: unknown) => {
      if (axios.isAxiosError(error) && error.response) {
        const errorMessage =
          error.response.data.message || "Registration failed";
        showToast(errorMessage, "error");
      } else {
        showToast("An unexpected error occurred", "error");
      }
    },
  });

  // Handle sign in
  const handleSignIn = async (userData: AuthFormData) => {
    setIsLoading(true);

    try {
      const result = await signIn("credentials", {
        redirect: false,
        email: userData.email,
        password: userData.password,
      });

      if (result?.error) {
        showToast(result.error, "error");
        setIsLoading(false);
        return;
      }

      if (result?.ok) {
        setSuccess(true);
        showToast("Successfully logged in", "success");
      }
    } catch (error) {
      console.error("Sign in error:", error);
      showToast("Failed to sign in", "error");
    } finally {
      setIsLoading(false);
    }
  };

  // Handle Google sign in
  const handleGoogleSignIn = async () => {
    setIsLoading(true);

    try {
      await signIn("google", { callbackUrl: "/" });
      setSuccess(true);
    } catch (error) {
      console.error("Google sign in error:", error);
      showToast("Failed to sign in with Google", "error");
      setIsLoading(false);
    }
  };

  // Submit handler for the form
  const submitAuth = async (
    type: "signin" | "signup",
    formData: AuthFormData
  ) => {
    setSuccess(false);
    if (type === "signup") {
      registerMutation.mutate(formData);
    } else {
      await handleSignIn(formData);
    }
  };

  return {
    submitAuth,
    handleGoogleSignIn,
    isLoading: isLoading || registerMutation.isPending,
    isSuccess: registerMutation.isSuccess || success,
  };
};
