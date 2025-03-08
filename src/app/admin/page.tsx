"use client";

import { useState, useEffect } from "react";
import {
  Users,
  Briefcase,
  Home,
  Menu,
  X,
  Sun,
  Moon,
  User,
  LogOut,
} from "lucide-react";
import { cn } from "@/lib/utils";
import { DashboardView } from "@/components/dashboard/DashboardView";
import { JobPostsView } from "@/components/dashboard/JobPostView";
import "animate.css";
import { useTheme } from "next-themes";
import { signOut, useSession } from "next-auth/react";
import Link from "next/link";

const Page: React.FC = () => {
  const [currentView, setCurrentView] = useState("dashboard");

  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [darkMode, setDarkMode] = useState(true);

  // Initialize theme based on user preference or system preference
  useEffect(() => {
    // Check if user has a saved preference
    const savedTheme = localStorage.getItem("hr-admin-theme");
    if (savedTheme) {
      setDarkMode(savedTheme === "dark");
    } else {
      // Check system preference
      const prefersDark = window.matchMedia(
        "(prefers-color-scheme: dark)"
      ).matches;
      setDarkMode(prefersDark);
    }
  }, []);

  const { theme, setTheme } = useTheme();
  const { data: session } = useSession();

  const toggleTheme = () => {
    setTheme(theme === "dark" ? "light" : "dark");
  };

  const userName = session?.user?.name;
  const avatarUrl = session?.user?.image;

  console.log("User session:", session);

  const navigationItems = [
    {
      name: "Dashboard",
      view: "dashboard",
      icon: <Home className="h-5 w-5" />,
    },
    {
      name: "Job Posts",
      view: "jobPosts",
      icon: <Briefcase className="h-5 w-5" />,
    },
    // { name: "Users", view: "users", icon: <Users className="h-5 w-5" /> },
  ];

  return (
    <div
      className={cn(
        "flex h-screen overflow-hidden transition-colors duration-300",
        "dark:bg-gradient-to-b dark:from-slate-900 dark:to-slate-800",
        "bg-gradient-to-b from-blue-50 to-white"
      )}
    >
      {/* Subtle grid overlay */}
      <div className="absolute inset-0 bg-grid-black/[0.03] dark:bg-grid-white/[0.05] bg-[size:20px_20px]"></div>

      {/* Abstract background elements */}
      <div className="absolute inset-0 pointer-events-none">
        <div className="absolute -top-64 right-1/4 w-96 h-96 dark:bg-indigo-600/20 bg-indigo-400/10 rounded-full blur-3xl"></div>
        <div className="absolute bottom-0 left-1/4 w-80 h-80 dark:bg-violet-600/20 bg-violet-400/10 rounded-full blur-3xl"></div>
      </div>

      {/* Sidebar - Desktop */}
      <aside
        className={cn(
          "hidden md:flex w-64 flex-col relative z-10 transition-all duration-300 animate__animated animate__fadeInLeft",
          "dark:bg-gradient-to-br dark:from-slate-800 dark:to-slate-900 dark:border-white/10",
          "bg-gradient-to-br from-white to-blue-50 border-r border-slate-200"
        )}
      >
        <div
          className={cn(
            "p-6 border-b transition-colors duration-300",
            "dark:border-white/10",
            "border-slate-200"
          )}
        >
          <h1 className="text-xl font-bold dark:text-white text-slate-800">
            <span className="text-transparent bg-clip-text bg-gradient-to-r from-indigo-500 via-violet-500 to-purple-500 animate__animated animate__pulse animate__infinite animate__slower">
              HR Admin
            </span>
          </h1>
        </div>
        <nav className="flex-1 p-4">
          <ul className="space-y-1">
            {navigationItems.map((item) => (
              <li key={item.view}>
                <button
                  onClick={() => setCurrentView(item.view)}
                  className={cn(
                    "w-full flex items-center gap-3 px-4 py-3 text-sm font-medium rounded-md transition-all",
                    currentView === item.view
                      ? "dark:bg-gradient-to-r dark:from-indigo-500/20 dark:to-violet-500/20 dark:text-indigo-300 dark:border dark:border-indigo-500/30 bg-gradient-to-r from-indigo-100 to-violet-100 text-indigo-700 border border-indigo-200"
                      : "dark:text-slate-300 dark:hover:bg-white/5 dark:hover:text-white text-slate-600 hover:bg-slate-100 hover:text-slate-900"
                  )}
                >
                  {item.icon}
                  {item.name}
                </button>
              </li>
            ))}
          </ul>
        </nav>
        <div
          className={cn(
            "p-4 border-t transition-colors duration-300",
            "dark:border-white/10",
            "border-slate-200"
          )}
        >
          <div className="flex flex-col space-y-4">
            {/* User Profile */}
            <div className="flex items-center space-x-3 p-3 rounded-lg dark:bg-slate-800/50 bg-slate-100/80 backdrop-blur-sm">
              {/* Avatar */}
              <div className="relative">
                {avatarUrl ? (
                  <img
                    src={avatarUrl}
                    alt={`${userName}'s avatar`}
                    className="w-10 h-10 rounded-full border-2 border-indigo-500 shadow-md"
                  />
                ) : (
                  <div className="w-10 h-10 rounded-full bg-gradient-to-br from-indigo-500 to-violet-600 flex items-center justify-center shadow-md">
                    <User className="h-5 w-5 text-white" />
                  </div>
                )}
                <div className="absolute -bottom-1 -right-1 w-4 h-4 bg-green-500 rounded-full border-2 border-white dark:border-slate-800"></div>
              </div>

              {/* User Info */}
              <div className="flex-1 overflow-hidden">
                <p className="text-sm font-semibold dark:text-white text-slate-800 truncate">
                  {userName || "Admin User"}
                </p>
                <p className="text-xs dark:text-slate-400 text-slate-500 truncate">
                  {session?.user?.email || "admin@company.com"}
                </p>
              </div>
            </div>

            {/* Logout Button */}
            <button
              onClick={() => signOut()}
              className={cn(
                "flex items-center justify-center space-x-2 px-4 py-2.5 rounded-md text-sm font-medium transition-all",
                "dark:bg-slate-800/50 dark:text-slate-200 dark:hover:bg-slate-700/70 dark:border dark:border-slate-700",
                "bg-slate-100 text-slate-700 hover:bg-slate-200 border border-slate-200"
              )}
            >
              <LogOut className="h-4 w-4" />
              <span>Sign Out</span>
            </button>

            {/* Theme Toggle */}
            <button
              onClick={toggleTheme}
              className={cn(
                "flex items-center justify-center gap-2 px-4 py-2.5 rounded-md text-sm font-medium transition-all",
                "dark:bg-slate-800/50 dark:text-slate-200 dark:hover:bg-slate-700/70 dark:border dark:border-slate-700",
                "bg-slate-100 text-slate-700 hover:bg-slate-200 border border-slate-200"
              )}
            >
              {darkMode ? (
                <Sun className="h-4 w-4" />
              ) : (
                <Moon className="h-4 w-4" />
              )}
              {darkMode ? "Light Mode" : "Dark Mode"}
            </button>
          </div>
        </div>
      </aside>

      {/* Mobile Menu Button */}
      <div
        className={cn(
          "md:hidden fixed top-0 left-0 right-0 z-20 p-4 flex items-center justify-between transition-colors duration-300",
          "dark:bg-gradient-to-r dark:from-slate-800 dark:to-slate-900 dark:border-b dark:border-white/10",
          "bg-gradient-to-r from-white to-blue-50 border-b border-slate-200"
        )}
      >
        <Link
          href={"/"}
          className="text-xl font-bold text-transparent bg-clip-text bg-gradient-to-r from-indigo-500 via-violet-500 to-purple-500 animate__animated animate__pulse animate__infinite animate__slower"
        >
          HR Admin
        </Link>
        <div className="flex items-center gap-2">
          <button
            onClick={toggleTheme}
            className={cn(
              "p-2 rounded-md transition-colors",
              "dark:text-white dark:hover:bg-white/10",
              "text-slate-800 hover:bg-slate-200"
            )}
          >
            {darkMode ? (
              <Sun className="h-5 w-5" />
            ) : (
              <Moon className="h-5 w-5" />
            )}
          </button>
          <button
            onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
            className={cn(
              "p-2 rounded-md transition-colors",
              "dark:text-white dark:hover:bg-white/10",
              "text-slate-800 hover:bg-slate-200"
            )}
          >
            {mobileMenuOpen ? (
              <X className="h-6 w-6" />
            ) : (
              <Menu className="h-6 w-6" />
            )}
          </button>
        </div>
      </div>

      {/* Mobile Menu */}
      {mobileMenuOpen && (
        <div className="md:hidden fixed inset-0 z-40 dark:bg-slate-900/80 bg-slate-500/30 backdrop-blur-sm animate__animated animate__fadeIn animate__faster">
          <div
            className={cn(
              "fixed top-16 left-0 bottom-0 w-64 border-r transition-colors duration-300 animate__animated animate__slideInLeft animate__faster",
              "dark:bg-gradient-to-br dark:from-slate-800 dark:to-slate-900 dark:border-white/10",
              "bg-gradient-to-br from-white to-blue-50 border-slate-200"
            )}
          >
            <nav className="p-4">
              <ul className="space-y-1">
                {navigationItems.map((item) => (
                  <li key={item.view}>
                    <button
                      onClick={() => {
                        setCurrentView(item.view);
                        setMobileMenuOpen(false);
                      }}
                      className={cn(
                        "w-full flex items-center gap-3 px-4 py-3 text-sm font-medium rounded-md transition-all",
                        currentView === item.view
                          ? "dark:bg-gradient-to-r dark:from-indigo-500/20 dark:to-violet-500/20 dark:text-indigo-300 dark:border dark:border-indigo-500/30 bg-gradient-to-r from-indigo-100 to-violet-100 text-indigo-700 border border-indigo-200"
                          : "dark:text-slate-300 dark:hover:bg-white/5 dark:hover:text-white text-slate-600 hover:bg-slate-100 hover:text-slate-900"
                      )}
                    >
                      {item.icon}
                      {item.name}
                    </button>
                  </li>
                ))}
              </ul>
            </nav>
            <div className="absolute bottom-0 left-0 right-0 p-4 border-t dark:border-white/10 border-slate-200">
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
            </div>
          </div>
        </div>
      )}

      {/* Main Content */}
      <main
        className={cn(
          "flex-1 overflow-auto p-6 md:p-8 pt-20 md:pt-8 relative z-10 transition-colors duration-300",
          "animate__animated animate__fadeIn"
        )}
      >
        {currentView === "dashboard" && <DashboardView />}
        {currentView === "jobPosts" && <JobPostsView />}
      </main>
    </div>
  );
};

export default Page;
