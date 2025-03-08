"use client";

import React, { useState } from "react";
import { Sun, Moon, LogOut, User } from "lucide-react";
import { useTheme } from "next-themes";
import { AuthModal } from "./AuthModal";
import { signOut, useSession } from "next-auth/react";
import Link from "next/link";

export default function TopNav() {
  const { theme, setTheme } = useTheme();
  const [isSigninOpen, setIsSigninOpen] = useState(false);
  const [isSignupOpen, setIsSignupOpen] = useState(false);
  const { data: session } = useSession();

  const toggleTheme = () => {
    setTheme(theme === "dark" ? "light" : "dark");
  };

  const isLoggedIn = session?.user;
  const userName = session?.user?.name;
  const avatarUrl = session?.user?.image;

  return (
    <>
      <nav className="sticky top-0 z-50 backdrop-blur-lg bg-white/80 dark:bg-slate-900/80 border-b border-slate-200 dark:border-white/10 py-4">
        <div className="container mx-auto px-4">
          <div className="flex justify-between items-center">
            {/* Site Name / Logo */}
            <div>
              <Link
                href={"/"}
                className="text-xl font-bold text-transparent bg-clip-text bg-gradient-to-r from-indigo-400 via-violet-400 to-purple-400"
              >
                ResumeAI
              </Link>
            </div>

            {/* Right Side Elements */}
            <div className="flex items-center space-x-6">
              {/* Theme Toggle */}
              <button
                onClick={toggleTheme}
                className="p-2 rounded-full bg-slate-100 dark:bg-white/5 hover:bg-slate-200 dark:hover:bg-white/10 transition-colors"
                aria-label={
                  theme === "dark"
                    ? "Switch to light mode"
                    : "Switch to dark mode"
                }
              >
                {theme === "dark" ? (
                  <Sun className="h-5 w-5 text-yellow-300" />
                ) : (
                  <Moon className="h-5 w-5 text-slate-700" />
                )}
              </button>

              {isLoggedIn ? (
                <>
                {session?.user?.role === "admin" && (
                  <Link
                    href={"/admin"}
                    className="px-8 py-1 rounded-lg bg-gradient-to-r from-indigo-500 to-violet-600 text-white font-medium text-sm shadow-lg shadow-indigo-500/25 hover:shadow-indigo-500/40 transition-all duration-300 hover:scale-105"
                  >
                    Admin
                  </Link>
                )}
                  {/* User Info */}
                  <div className="flex items-center space-x-3">
                    <div className="text-right hidden sm:block">
                      <p className="text-sm font-medium text-slate-800 dark:text-white">
                        {userName}
                      </p>
                    </div>
                    {/* Avatar */}
                    <div className="relative">
                      {avatarUrl ? (
                        <img
                          src={avatarUrl}
                          alt={`${userName}'s avatar`}
                          className="w-10 h-10 rounded-full border-2 border-indigo-500"
                        />
                      ) : (
                        <div className="w-10 h-10 rounded-full bg-gradient-to-br from-indigo-500 to-violet-600 flex items-center justify-center">
                          <User className="h-5 w-5 text-white" />
                        </div>
                      )}
                      <div className="absolute bottom-0 right-0 w-3 h-3 bg-green-500 rounded-full border-2 border-white dark:border-slate-900"></div>
                    </div>

                    {/* Logout Button */}
                    <button
                      onClick={() => signOut()}
                      className="flex items-center space-x-1 text-sm text-slate-600 dark:text-slate-300 hover:text-slate-900 dark:hover:text-white transition-colors"
                    >
                      <LogOut className="h-4 w-4" />
                      <span className="hidden sm:inline">Logout</span>
                    </button>
                  </div>
                </>
              ) : (
                <div className="flex items-center space-x-3">
                  <button
                    onClick={() => setIsSigninOpen(true)}
                    className="px-4 py-2 rounded-lg bg-slate-100 dark:bg-white/10 text-slate-800 dark:text-white border border-slate-200 dark:border-white/20 font-medium text-sm hover:bg-slate-200 dark:hover:bg-white/15 transition-all duration-300"
                  >
                    Sign In
                  </button>

                  <button
                    onClick={() => setIsSignupOpen(true)}
                    className="px-4 py-2 rounded-lg bg-gradient-to-r from-indigo-500 to-violet-600 text-white font-medium text-sm shadow-md shadow-indigo-500/25 hover:shadow-indigo-500/40 transition-all duration-300"
                  >
                    Sign Up
                  </button>
                </div>
              )}
            </div>
          </div>
        </div>
      </nav>
      {/* Modals */}
      <AuthModal
        isOpen={isSigninOpen}
        onClose={() => setIsSigninOpen(false)}
        type="signin"
      />

      <AuthModal
        isOpen={isSignupOpen}
        onClose={() => setIsSignupOpen(false)}
        type="signup"
      />
    </>
  );
}
