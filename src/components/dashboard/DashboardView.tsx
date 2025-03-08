import React from "react";
import {
  LineChart,
  ArrowUpRight,
  ArrowDownRight,
  Users,
  Briefcase,
  FileCheck,
  Clock,
  Shield,
  Zap,
  Eye,
  Star,
} from "lucide-react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "../ui/button";

export function DashboardView() {
  const stats = [
    {
      title: "Total Applicants",
      value: "1,428",
      change: "+12.5%",
      isPositive: true,
      icon: <Users className="h-5 w-5" />,
    },
    {
      title: "Open Positions",
      value: "24",
      change: "+3",
      isPositive: true,
      icon: <Briefcase className="h-5 w-5" />,
    },
    {
      title: "Conversion Rate",
      value: "18.3%",
      change: "-2.1%",
      isPositive: false,
      icon: <LineChart className="h-5 w-5" />,
    },
    {
      title: "Time to Hire",
      value: "18 days",
      change: "-3 days",
      isPositive: true,
      icon: <Eye className="h-5 w-5" />,
    },
  ];

  return (
    <div className="space-y-8">
      <div className="flex justify-between items-center">
        <div>
          <h2 className="text-2xl font-bold text-slate-800 dark:text-white">Welcome Back, Admin</h2>
          <p className="text-slate-600 dark:text-slate-300">Here's what's happening today.</p>
        </div>
        <Button className="bg-gradient-to-r from-indigo-500 to-violet-600 hover:from-indigo-600 hover:to-violet-700 text-white border-0 shadow-lg shadow-indigo-500/25 hover:shadow-indigo-500/40">
          <Zap className="mr-2 h-4 w-4" /> Generate Report
        </Button>
      </div>

      {/* Stats grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        {stats.map((stat, i) => (
          <Card
            key={i}
            className="border border-slate-200 dark:border-0 shadow-md dark:shadow-2xl bg-white dark:bg-gradient-to-br dark:from-slate-800 dark:to-slate-900 overflow-hidden backdrop-blur-sm"
          >
            <div className="absolute inset-0 bg-gradient-to-br from-indigo-600/0 to-violet-600/0 dark:from-indigo-600/5 dark:to-violet-600/5"></div>
            <CardContent className="p-6 relative">
              <div className="flex justify-between items-start">
                <div>
                  <p className="text-sm font-medium text-slate-500 dark:text-slate-400">
                    {stat.title}
                  </p>
                  <h3 className="text-2xl font-bold text-slate-900 dark:text-white mt-1">
                    {stat.value}
                  </h3>
                </div>
                <div className="p-2 rounded-lg bg-slate-100 dark:bg-white/5 text-indigo-600 dark:text-white">{stat.icon}</div>
              </div>
              <div className="mt-4 flex items-center">
                {stat.isPositive ? (
                  <ArrowUpRight className="h-4 w-4 text-emerald-500 dark:text-emerald-400 mr-1" />
                ) : (
                  <ArrowDownRight className="h-4 w-4 text-rose-500 dark:text-rose-400 mr-1" />
                )}
                <span
                  className={`text-xs font-medium ${
                    stat.isPositive ? "text-emerald-500 dark:text-emerald-400" : "text-rose-500 dark:text-rose-400"
                  }`}
                >
                  {stat.change}
                </span>
                <span className="text-xs text-slate-500 dark:text-slate-400 ml-1">
                  vs last month
                </span>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>

      {/* Activity chart section */}
      <Card className="border border-slate-200 dark:border-0 shadow-md dark:shadow-2xl bg-white dark:bg-gradient-to-br dark:from-slate-800 dark:to-slate-900 overflow-hidden backdrop-blur-sm">
        <div className="absolute inset-0 bg-gradient-to-br from-indigo-600/0 to-violet-600/0 dark:from-indigo-600/5 dark:to-violet-600/5"></div>
        <CardContent className="p-6 relative">
          <div className="flex justify-between items-start mb-6">
            <div>
              <h3 className="text-lg font-semibold text-slate-900 dark:text-white">
                Application Activity
              </h3>
              <p className="text-sm text-slate-500 dark:text-slate-400">
                Weekly applications and interview conversion
              </p>
            </div>
            <div className="flex gap-2">
              <Button
                variant="outline"
                size="sm"
                className="text-slate-700 border-slate-200 hover:bg-slate-50 hover:text-slate-900 dark:text-slate-300 dark:border-slate-700 dark:hover:bg-slate-700/40 dark:hover:text-white"
              >
                Weekly
              </Button>
              <Button
                variant="outline"
                size="sm"
                className="text-slate-700 border-slate-200 hover:bg-slate-50 hover:text-slate-900 dark:text-slate-300 dark:border-slate-700 dark:hover:bg-slate-700/40 dark:hover:text-white"
              >
                Monthly
              </Button>
            </div>
          </div>
          <div className="h-64 flex items-center justify-center">
            <p className="text-slate-500 dark:text-slate-400 text-sm">Activity chart placeholder</p>
          </div>
        </CardContent>
      </Card>

      {/* Features list */}
      <div className="p-4 bg-slate-50 dark:bg-white/5 backdrop-blur-sm rounded-lg border border-slate-200 dark:border-white/10">
        <h4 className="text-slate-900 dark:text-white font-medium mb-3 flex items-center">
          <Star className="h-4 w-4 mr-2 text-indigo-500 dark:text-indigo-400" /> Admin Dashboard
          Features
        </h4>
        <ul className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-3">
          {[
            "Real-time Applicant Tracking",
            "Automated Resume Screening",
            "Interview Scheduling",
            "Candidate Communications",
            "Analytics & Reporting",
            "Custom Job Templates",
          ].map((feature, index) => (
            <li key={index} className="flex items-start">
              <ArrowUpRight className="h-4 w-4 mr-2 text-indigo-500 dark:text-indigo-400 shrink-0 mt-0.5" />
              <span className="text-sm text-slate-600 dark:text-slate-300">{feature}</span>
            </li>
          ))}
        </ul>
      </div>
    </div>
  );
}