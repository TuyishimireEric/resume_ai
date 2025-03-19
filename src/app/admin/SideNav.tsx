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
import "animate.css";
import { useTheme } from "next-themes";
import { signOut, useSession } from "next-auth/react";
import Link from "next/link";

export const SideNav = () => {
  const [currentView, setCurrentView] = useState("dashboard");

  const [darkMode, setDarkMode] = useState(true);
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
      access: "admin",
      url: "/dashboard",
    },
    {
      name: "Job Posts",
      view: "jobPosts",
      icon: <Briefcase className="h-5 w-5" />,
      access: "recruiter",
      url: "/jobs",
    },
    // { name: "Users", view: "users", icon: <Users className="h-5 w-5" /> },
  ];
  return (
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
          {navigationItems
            .filter((item) => item.access == session?.user?.role)
            .map((item) => (
              <Link href={item.url} key={item.view}>
                <button
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
              </Link>
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
  );
};
