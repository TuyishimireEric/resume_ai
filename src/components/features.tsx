"use client";

import React, { useState } from "react";
import {
  FileCheck,
  Sparkles,
  BarChart4,
  Lightbulb,
  Briefcase,
  ArrowRight,
  Check,
  Star,
} from "lucide-react";

export default function Features() {
  const [hoveredIndex, setHoveredIndex] = useState(null);

  const features = [
    {
      icon: <FileCheck />,
      title: "Resume Analysis",
      description:
        "Upload your resume and get detailed feedback on its structure, content, and formatting.",
      color: "from-indigo-500 to-blue-600",
      benefits: [
        "ATS Compatibility Check",
        "Format Verification",
        "Section Analysis",
      ],
    },
    {
      icon: <Sparkles />,
      title: "AI-Powered Feedback",
      description:
        "Receive intelligent suggestions on grammar, clarity, and missing sections from advanced AI.",
      color: "from-violet-500 to-purple-600",
      benefits: [
        "Grammar & Phrasing",
        "Keyword Optimization",
        "Content Enhancement",
      ],
    },
    {
      icon: <BarChart4 />,
      title: "Resume Scoring",
      description:
        "Get your resume scored based on ATS-friendliness, readability, and industry standards.",
      color: "from-blue-500 to-cyan-600",
      benefits: [
        "Industry Benchmarking",
        "Readability Metrics",
        "Impact Score",
      ],
    },
    {
      icon: <Lightbulb />,
      title: "Improvement Suggestions",
      description:
        "Receive actionable recommendations to enhance your resume's impact and effectiveness.",
      color: "from-amber-500 to-orange-600",
      benefits: [
        "Experience Highlighting",
        "Achievement Wording",
        "Skills Positioning",
      ],
    },
    {
      icon: <Briefcase />,
      title: "Job Description Matching",
      description:
        "Compare your resume with job descriptions to optimize for specific opportunities.",
      color: "from-emerald-500 to-teal-600",
      benefits: [
        "Keyword Analysis",
        "Skills Gap Detection",
        "Match Percentage",
      ],
    },
  ];

  return (
    <section className="py-32 bg-gradient-to-b from-slate-50 to-white dark:from-slate-900 dark:to-slate-800 relative overflow-hidden">
      {/* Background accent elements */}
      <div className="absolute -top-24 -right-24 w-96 h-96 bg-indigo-500/5 rounded-full blur-3xl"></div>
      <div className="absolute -bottom-32 -left-32 w-96 h-96 bg-violet-500/5 rounded-full blur-3xl"></div>

      <div className="max-w-6xl mx-auto px-4 relative">
        {/* Header with custom underline */}
        <div className="text-center mb-20">
          <h2 className="text-4xl sm:text-5xl font-bold mb-6 text-slate-900 dark:text-white relative inline-block">
            Professional Resume Solutions
            <div className="absolute -bottom-3 left-0 right-0 h-1 bg-gradient-to-r from-indigo-500 via-purple-500 to-pink-500"></div>
          </h2>
          <p className="mt-6 text-lg text-slate-600 dark:text-slate-300 max-w-2xl mx-auto">
            Sophisticated tools designed by industry experts to maximize your
            potential and showcase your professional value
          </p>
        </div>

        {/* Feature cards in interactive grid */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8 mb-20">
          {features.map((feature, index) => (
            <div
              key={index}
              className="group relative"
              // onMouseEnter={() => setHoveredIndex(index)}
              onMouseLeave={() => setHoveredIndex(null)}
            >
              <div
                className={`
                  absolute inset-0 rounded-2xl bg-gradient-to-br ${feature.color} opacity-0 
                  group-hover:opacity-100 transition-opacity duration-500 blur-lg
                `}
              ></div>

              <div
                className={`
                relative rounded-2xl overflow-hidden transition-all duration-300
                ${
                  hoveredIndex === index
                    ? "transform translate-y-[-8px] shadow-2xl"
                    : "shadow-lg"
                }
                bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700
              `}
              >
                {/* Accent top border */}
                <div
                  className={`absolute top-0 left-0 right-0 h-1 bg-gradient-to-r ${feature.color}`}
                ></div>

                <div className="p-8">
                  {/* Icon with gradient background */}
                  <div
                    className={`
                    w-14 h-14 rounded-xl bg-gradient-to-br ${feature.color}
                    flex items-center justify-center text-white mb-6
                    transition-transform duration-300 group-hover:scale-110
                  `}
                  >
                    <div className="w-7 h-7">{feature.icon}</div>
                  </div>

                  <h3 className="text-xl font-semibold text-slate-900 dark:text-white mb-3 tracking-tight">
                    {feature.title}
                  </h3>

                  <p className="text-slate-600 dark:text-slate-300 mb-6 leading-relaxed">
                    {feature.description}
                  </p>

                  {/* Feature benefits */}
                  <div className="space-y-2 mb-6">
                    {feature.benefits.map((benefit, i) => (
                      <div key={i} className="flex items-center text-sm">
                        <Check
                          className={`w-4 h-4 mr-2 text-gradient-${
                            feature.color.split(" ")[1]
                          }`}
                        />
                        <span className="text-slate-700 dark:text-slate-300">
                          {benefit}
                        </span>
                      </div>
                    ))}
                  </div>

                  {/* Interactive button */}
                  <div
                    className={`
                    mt-4 inline-flex items-center text-sm font-medium
                    bg-clip-text text-transparent bg-gradient-to-r ${feature.color}
                    transition-all duration-300 border-b border-transparent
                    hover:border-current
                  `}
                  >
                    Explore Feature
                    <ArrowRight className="ml-1 w-4 h-4" />
                  </div>
                </div>
              </div>
            </div>
          ))}
        </div>

        {/* Premium CTA section */}
        <div className="relative mt-24 rounded-2xl overflow-hidden bg-gradient-to-br from-slate-900 to-slate-800 p-1">
          <div className="absolute inset-0 bg-grid-white/5 bg-[size:20px_20px]"></div>
          <div className="relative rounded-xl bg-slate-900 p-8 sm:p-10 overflow-hidden">
            <div className="absolute right-0 top-0 -mt-20 -mr-20 w-80 h-80 bg-gradient-to-br from-violet-600/30 to-indigo-600/30 rounded-full blur-2xl"></div>

            <div className="relative">
              <div className="sm:flex items-center justify-between">
                <div>
                  <h3 className="text-2xl font-bold text-white mb-2">
                    Ready to stand out?
                  </h3>
                  <p className="text-slate-300 max-w-md">
                    Join thousands of professionals who've enhanced their job
                    search with our premium tools.
                  </p>
                </div>

                <div className="mt-6 sm:mt-0">
                  <button
                    className="
                    relative overflow-hidden rounded-lg px-8 py-3 
                    bg-gradient-to-r from-indigo-500 to-violet-600 
                    text-white font-medium shadow-lg
                    hover:shadow-indigo-500/25 hover:from-indigo-600 hover:to-violet-700
                    transition-all duration-300
                    "
                  >
                    <span className="relative z-10">Get Started Now</span>
                    <span className="absolute inset-0 bg-gradient-to-r from-indigo-600 to-violet-700 opacity-0 hover:opacity-100 transition-opacity duration-300"></span>
                  </button>

                  <div className="flex items-center mt-4 text-sm text-slate-400">
                    <Check className="w-4 h-4 mr-1 text-emerald-400" />
                    <span>30-day free trial • No credit card required</span>
                  </div>
                </div>
              </div>

              {/* Testimonial */}
              <div className="mt-8 pt-6 border-t border-slate-700/50">
                <div className="flex items-center">
                  <div className="w-10 h-10 rounded-full bg-gradient-to-br from-indigo-400 to-purple-400 flex items-center justify-center text-white font-medium">
                    JD
                  </div>
                  <div className="ml-4">
                    <p className="text-slate-300 italic">
                      "This platform helped me land interviews at three Fortune
                      500 companies within two weeks."
                    </p>
                    <p className="text-sm text-slate-400 mt-1">
                      John Doe • Marketing Director
                    </p>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Stats section */}
        <div className="mt-20 grid grid-cols-2 md:grid-cols-4 gap-8">
          {[
            { number: "98%", label: "Success Rate" },
            { number: "24hr", label: "Feedback Time" },
            { number: "150+", label: "Industries Covered" },
            { number: "50k+", label: "Resumes Improved" },
          ].map((stat, i) => (
            <div key={i} className="text-center">
              <p className="text-3xl font-bold bg-clip-text text-transparent bg-gradient-to-r from-indigo-500 to-violet-600">
                {stat.number}
              </p>
              <p className="text-sm text-slate-500 dark:text-slate-400 uppercase tracking-wider font-medium mt-1">
                {stat.label}
              </p>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
