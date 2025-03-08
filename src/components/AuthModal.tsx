"use client";

import React, { useEffect, useState } from "react";
import { X, Mail, Lock, User, Eye, EyeOff, AlertCircle } from "lucide-react";
import { useAuth } from "@/app/hooks/user/useRegister";

// Modal component that can be used for both signup and signin
interface AuthModalProps {
  isOpen: boolean;
  onClose: () => void;
  type?: "signin" | "signup";
}

// Define interfaces for form data and errors
interface FormData {
  name: string;
  email: string;
  password: string;
}

interface FormErrors {
  name?: string;
  email?: string;
  password?: string;
  [key: string]: string | undefined;
}

export function AuthModal({
  isOpen,
  onClose,
  type = "signin",
}: AuthModalProps) {
  const [isPasswordVisible, setIsPasswordVisible] = useState(false);
  const [formData, setFormData] = useState<FormData>({
    name: "",
    email: "",
    password: "",
  });
  const [errors, setErrors] = useState<FormErrors>({});
  const [currentType, setCurrentType] = useState(type);
  const [animationClass, setAnimationClass] = useState(""); // State for animation class

  // Use our custom authentication hook
  const { submitAuth, handleGoogleSignIn, isLoading, isSuccess } = useAuth();

  // Function to handle form type toggle with animations
  const toggleFormType = (newType: "signin" | "signup") => {
    if (newType === currentType) return;
    
    // Set exit animation for current form
    setAnimationClass("animate__animated animate__fadeOutRight animate__faster");
    
    // After exit animation completes, change form type and set entrance animation
    setTimeout(() => {
      setCurrentType(newType);
      setAnimationClass("animate__animated animate__fadeInLeft animate__faster");
      
      // Reset form data and errors when switching forms
      setFormData({
        name: "",
        email: "",
        password: "",
      });
      setErrors({});
    }, 300); // Matches the duration of the "faster" animate.css timing
  };

  const togglePasswordVisibility = () => {
    setIsPasswordVisible(!isPasswordVisible);
  };

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
    // Clear the error for this field when user starts typing
    if (errors[name]) {
      setErrors((prev) => ({ ...prev, [name]: undefined }));
    }
  };

  useEffect(() => {
    if (isSuccess) {
      onClose();
    }
  }, [isSuccess, onClose]);

  // Set initial animation class when modal opens
  useEffect(() => {
    if (isOpen) {
      setAnimationClass("animate__animated animate__fadeInLeft animate__faster");
    }
  }, [isOpen]);

  const validateForm = () => {
    const newErrors: FormErrors = {};

    if (currentType === "signup" && !formData.name.trim()) {
      newErrors.name = "Name is required";
    }

    if (!formData.email.trim()) {
      newErrors.email = "Email is required";
    } else if (!/\S+@\S+\.\S+/.test(formData.email)) {
      newErrors.email = "Email is invalid";
    }

    if (!formData.password) {
      newErrors.password = "Password is required";
    } else if (formData.password.length < 8) {
      newErrors.password = "Password must be at least 8 characters";
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();

    if (validateForm()) {
      try {
        await submitAuth(currentType, formData);
        // Only close if successful (the hook handles error states)
        // onClose();
      } catch (error) {
        console.error("Authentication error:", error);
      }
    }
  };

  // Animation for modal entrance
  const modalAnimationClass = isOpen ? "animate__animated animate__zoomIn animate__faster" : "";

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center">
      {/* Backdrop with fade animation */}
      <div
        className="absolute inset-0 bg-black/40 backdrop-blur-sm animate__animated animate__fadeIn animate__faster"
        onClick={onClose}
      ></div>

      {/* Modal */}
      <div className={`relative bg-white dark:bg-slate-900 rounded-xl shadow-xl max-w-lg w-full p-8 overflow-hidden ${modalAnimationClass}`}>
        {/* Background gradients */}
        <div className="absolute -top-24 -right-24 w-64 h-64 bg-indigo-600/10 dark:bg-indigo-600/20 rounded-full blur-3xl"></div>
        <div className="absolute -bottom-24 -left-24 w-64 h-64 bg-violet-600/10 dark:bg-violet-600/20 rounded-full blur-3xl"></div>

        {/* Close button */}
        <button
          onClick={onClose}
          className="absolute top-4 right-4 text-slate-400 hover:text-slate-600 dark:hover:text-slate-200 transition-colors"
        >
          <X className="w-5 h-5" />
        </button>

        {/* Modal content with animation */}
        <div className={`relative ${animationClass}`}>
          <h2 className="text-2xl font-bold text-slate-800 dark:text-white mb-1 mt-2">
            {currentType === "signin" ? "Welcome back" : "Create your account"}
          </h2>
          <p className="text-slate-500 dark:text-slate-400 mb-6">
            {currentType === "signin"
              ? "Enter your credentials to access your account"
              : "Fill in the information to get started"}
          </p>

          <form onSubmit={handleSubmit} className="space-y-4">
            {currentType === "signup" && (
              <div className="animate__animated animate__fadeIn">
                <label
                  htmlFor="name"
                  className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-1"
                >
                  Name
                </label>
                <div className="relative">
                  <div className="absolute inset-y-0 left-0 flex items-center pl-3 pointer-events-none">
                    <User className="h-5 w-5 text-slate-400" />
                  </div>
                  <input
                    type="text"
                    id="name"
                    name="name"
                    value={formData.name}
                    onChange={handleChange}
                    className={`pl-10 w-full px-4 py-2.5 bg-slate-50 dark:bg-slate-800/50 border ${
                      errors.name
                        ? "border-red-400 dark:border-red-500"
                        : "border-slate-200 dark:border-slate-700"
                    } rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-500/50 dark:text-white`}
                    placeholder="Your name"
                  />
                </div>
                {errors.name && (
                  <p className="mt-1 text-sm text-red-500 flex items-center animate__animated animate__shakeX">
                    <AlertCircle className="h-3.5 w-3.5 mr-1" />
                    {errors.name}
                  </p>
                )}
              </div>
            )}

            <div>
              <label
                htmlFor="email"
                className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-1"
              >
                Email
              </label>
              <div className="relative">
                <div className="absolute inset-y-0 left-0 flex items-center pl-3 pointer-events-none">
                  <Mail className="h-5 w-5 text-slate-400" />
                </div>
                <input
                  type="email"
                  id="email"
                  name="email"
                  value={formData.email}
                  onChange={handleChange}
                  className={`pl-10 w-full px-4 py-2.5 bg-slate-50 dark:bg-slate-800/50 border ${
                    errors.email
                      ? "border-red-400 dark:border-red-500"
                      : "border-slate-200 dark:border-slate-700"
                  } rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-500/50 dark:text-white`}
                  placeholder="Your email address"
                />
              </div>
              {errors.email && (
                <p className="mt-1 text-sm text-red-500 flex items-center animate__animated animate__shakeX">
                  <AlertCircle className="h-3.5 w-3.5 mr-1" />
                  {errors.email}
                </p>
              )}
            </div>

            <div>
              <label
                htmlFor="password"
                className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-1"
              >
                Password
              </label>
              <div className="relative">
                <div className="absolute inset-y-0 left-0 flex items-center pl-3 pointer-events-none">
                  <Lock className="h-5 w-5 text-slate-400" />
                </div>
                <input
                  type={isPasswordVisible ? "text" : "password"}
                  id="password"
                  name="password"
                  value={formData.password}
                  onChange={handleChange}
                  className={`pl-10 pr-10 w-full px-4 py-2.5 bg-slate-50 dark:bg-slate-800/50 border ${
                    errors.password
                      ? "border-red-400 dark:border-red-500"
                      : "border-slate-200 dark:border-slate-700"
                  } rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-500/50 dark:text-white`}
                  placeholder={
                    currentType === "signin" ? "Your password" : "Create a password"
                  }
                />
                <div className="absolute inset-y-0 right-0 flex items-center pr-3">
                  <button
                    type="button"
                    onClick={togglePasswordVisibility}
                    className="text-slate-400 hover:text-slate-600 dark:hover:text-slate-200"
                  >
                    {isPasswordVisible ? (
                      <EyeOff className="h-5 w-5" />
                    ) : (
                      <Eye className="h-5 w-5" />
                    )}
                  </button>
                </div>
              </div>
              {errors.password && (
                <p className="mt-1 text-sm text-red-500 flex items-center animate__animated animate__shakeX">
                  <AlertCircle className="h-3.5 w-3.5 mr-1" />
                  {errors.password}
                </p>
              )}
            </div>

            {currentType === "signin" && (
              <div className="flex justify-end">
                <button
                  type="button"
                  className="text-sm text-indigo-600 dark:text-indigo-400 hover:text-indigo-700 dark:hover:text-indigo-300"
                >
                  Forgot password?
                </button>
              </div>
            )}

            <button
              type="submit"
              disabled={isLoading}
              className="w-full py-3 rounded-lg bg-gradient-to-r from-indigo-500 to-violet-600 text-white font-medium text-sm shadow-lg shadow-indigo-500/25 hover:shadow-indigo-500/40 transition-all duration-300 flex items-center justify-center disabled:opacity-70"
            >
              {isLoading ? (
                <span className="flex items-center">
                  <svg
                    className="animate-spin -ml-1 mr-2 h-4 w-4 text-white"
                    xmlns="http://www.w3.org/2000/svg"
                    fill="none"
                    viewBox="0 0 24 24"
                  >
                    <circle
                      className="opacity-25"
                      cx="12"
                      cy="12"
                      r="10"
                      stroke="currentColor"
                      strokeWidth="4"
                    ></circle>
                    <path
                      className="opacity-75"
                      fill="currentColor"
                      d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
                    ></path>
                  </svg>
                  Processing...
                </span>
              ) : currentType === "signin" ? (
                "Sign In"
              ) : (
                "Create Account"
              )}
            </button>
          </form>

          {/* <div className="my-6 flex items-center">
            <div className="flex-grow h-px bg-slate-200 dark:bg-slate-700"></div>
            <span className="px-4 text-sm text-slate-400">
              or continue with
            </span>
            <div className="flex-grow h-px bg-slate-200 dark:bg-slate-700"></div>
          </div> */}

          {/* <button
            onClick={handleGoogleSignIn}
            disabled={isLoading}
            className="w-full py-2.5 px-4 rounded-lg border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-800 flex items-center justify-center gap-2 hover:bg-slate-50 dark:hover:bg-slate-700/70 transition-colors duration-200 disabled:opacity-70"
          >
            <svg
              width="18"
              height="18"
              viewBox="0 0 18 18"
              fill="none"
              xmlns="http://www.w3.org/2000/svg"
            >
              <path
                d="M17.64 9.20455C17.64 8.56637 17.5827 7.95273 17.4764 7.36364H9V10.845H13.8436C13.635 11.97 13.0009 12.9232 12.0477 13.5614V15.8195H14.9564C16.6582 14.2527 17.64 11.9455 17.64 9.20455Z"
                fill="#4285F4"
              />
              <path
                d="M9 18C11.43 18 13.4673 17.1941 14.9564 15.8195L12.0477 13.5614C11.2418 14.1014 10.2109 14.4205 9 14.4205C6.65591 14.4205 4.67182 12.8373 3.96409 10.71H0.957275V13.0418C2.43818 15.9832 5.48182 18 9 18Z"
                fill="#34A853"
              />
              <path
                d="M3.96409 10.71C3.78409 10.17 3.68182 9.59318 3.68182 9C3.68182 8.40682 3.78409 7.83 3.96409 7.29V4.95818H0.957273C0.347727 6.17318 0 7.54773 0 9C0 10.4523 0.347727 11.8268 0.957273 13.0418L3.96409 10.71Z"
                fill="#FBBC05"
              />
              <path
                d="M9 3.57955C10.3214 3.57955 11.5077 4.03364 12.4405 4.92545L15.0218 2.34409C13.4632 0.891818 11.4259 0 9 0C5.48182 0 2.43818 2.01682 0.957275 4.95818L3.96409 7.29C4.67182 5.16273 6.65591 3.57955 9 3.57955Z"
                fill="#EA4335"
              />
            </svg>
            <span className="text-slate-800 dark:text-white font-medium text-sm">
              Continue with Google
            </span>
          </button> */}

          <div className="mt-6 text-center text-sm text-slate-500 dark:text-slate-400">
            {currentType === "signin" ? (
              <>
                Don't have an account?{" "}
                <button
                  onClick={() => toggleFormType("signup")}
                  className="text-indigo-600 dark:text-indigo-400 font-medium hover:text-indigo-700 dark:hover:text-indigo-300"
                >
                  Sign up
                </button>
              </>
            ) : (
              <>
                Already have an account?{" "}
                <button
                  onClick={() => toggleFormType("signin")}
                  className="text-indigo-600 dark:text-indigo-400 font-medium hover:text-indigo-700 dark:hover:text-indigo-300"
                >
                  Sign in
                </button>
              </>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}