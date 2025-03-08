import React from "react";
import { FileText, CheckCircle, Award, ArrowRight, Clock, Shield, Star } from "lucide-react";

export default function HeroSection() {
  return (
    <section className="relative overflow-hidden pt-20 pb-24 bg-gradient-to-b from-slate-50 via-slate-100 to-slate-200 dark:from-slate-900 dark:via-slate-800 dark:to-slate-900">
      {/* Abstract background elements */}
      <div className="absolute top-0 left-1/2 -translate-x-1/2 w-full max-w-7xl">
        <div className="absolute -top-24 right-0 w-80 h-80 bg-indigo-600/10 dark:bg-indigo-600/20 rounded-full blur-3xl"></div>
        <div className="absolute top-40 -left-20 w-64 h-64 bg-violet-600/10 dark:bg-violet-600/20 rounded-full blur-3xl"></div>
        <div className="absolute bottom-0 right-1/4 w-96 h-96 bg-blue-600/5 dark:bg-blue-600/10 rounded-full blur-3xl"></div>
      </div>
      
      {/* Subtle grid overlay */}
      <div className="absolute inset-0 bg-grid-slate-800/[0.05] dark:bg-grid-white/[0.05] bg-[size:20px_20px]"></div>
      
      <div className="container mx-auto px-4 relative z-10 mt-14">
        <div className="text-center mb-12">
          <h1 className="text-4xl sm:text-5xl md:text-6xl font-bold mb-6 text-slate-800 dark:text-white tracking-tight">
            <span className="inline-block">
              Elevate Your <span className="text-transparent bg-clip-text bg-gradient-to-r from-indigo-500 via-violet-500 to-purple-500 dark:from-indigo-400 dark:via-violet-400 dark:to-purple-400">Career Potential</span>
            </span>
          </h1>
          
          <p className="text-xl md:text-2xl text-slate-600 dark:text-slate-300 max-w-3xl mx-auto leading-relaxed">
            Our advanced AI analyzes and enhances your resume to help you secure more interviews and advance your professional journey.
          </p>
        </div>
        
        {/* Main CTA buttons */}
        <div className="flex flex-col sm:flex-row justify-center gap-4 mb-16">
          <button className="px-8 py-4 rounded-lg bg-gradient-to-r from-indigo-500 to-violet-600 text-white font-medium text-lg shadow-lg shadow-indigo-500/25 hover:shadow-indigo-500/40 transition-all duration-300 hover:scale-105">
            Analyze My Resume
          </button>
          <button className="px-8 py-4 rounded-lg bg-slate-200 backdrop-blur-sm text-slate-700 border border-slate-300 dark:bg-white/10 dark:text-white dark:border-white/20 font-medium text-lg hover:bg-slate-300 dark:hover:bg-white/15 transition-all duration-300">
            View Sample Analysis
          </button>
        </div>
        
        {/* Process steps with enhanced visual styling */}
        <div className="relative">
          {/* Connecting line */}
          <div className="hidden md:block absolute top-1/2 left-1/2 -translate-y-1/2 -translate-x-1/2 h-px w-2/3 bg-gradient-to-r from-indigo-500/0 via-indigo-500/30 to-indigo-500/0 dark:from-indigo-500/0 dark:via-indigo-500/50 dark:to-indigo-500/0"></div>
          
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8 md:gap-6 mb-16">
            {[
              { 
                icon: <FileText className="h-6 w-6" />, 
                title: "Upload Your Resume", 
                description: "PDF, DOCX, or plain text formats supported",
                highlight: "30-Second Process"
              },
              { 
                icon: <CheckCircle className="h-6 w-6" />, 
                title: "Receive AI Analysis", 
                description: "Get comprehensive feedback and scoring",
                highlight: "Industry-Specific"
              },
              { 
                icon: <Award className="h-6 w-6" />, 
                title: "Implement Improvements", 
                description: "Apply suggestions to strengthen your resume",
                highlight: "98% Success Rate"
              }
            ].map((step, index) => (
              <div key={index} className="group relative">
                <div className="absolute inset-0 bg-gradient-to-br from-indigo-600/10 to-violet-600/10 dark:from-indigo-600/20 dark:to-violet-600/20 rounded-xl blur opacity-0 group-hover:opacity-100 transition-opacity duration-500"></div>
                
                <div className="relative flex flex-col items-center p-6 rounded-xl backdrop-blur-sm bg-white/80 border border-slate-200 dark:bg-white/5 dark:border-white/10 transition-transform duration-300 group-hover:translate-y-[-4px]">
                  <div className="w-16 h-16 flex items-center justify-center rounded-full bg-gradient-to-br from-indigo-500 to-violet-600 text-white mb-4">
                    {step.icon}
                  </div>
                  
                  <h3 className="text-xl font-semibold text-slate-800 dark:text-white mb-2">{step.title}</h3>
                  <p className="text-slate-600 dark:text-slate-300 text-center mb-4">{step.description}</p>
                  
                  <div className="flex items-center text-xs font-medium text-indigo-600 bg-indigo-100 dark:text-indigo-300 dark:bg-indigo-900/40 py-1 px-3 rounded-full">
                    {step.highlight}
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
        
        {/* Social proof and stats */}
        <div className="bg-gradient-to-r from-white/80 via-white/90 to-white/80 dark:from-slate-800/50 dark:via-slate-800/80 dark:to-slate-800/50 backdrop-blur-sm rounded-2xl border border-slate-200 dark:border-white/10 p-8 max-w-4xl mx-auto shadow-sm">
          <div className="flex flex-col md:flex-row justify-between items-center gap-8">
            <div className="flex flex-col items-center md:items-start">
              <p className="text-slate-600 dark:text-slate-300 mb-2 text-center md:text-left">Trusted by professionals from</p>
              <div className="flex gap-4 items-center">
                {["Google", "Amazon", "Microsoft", "Apple"].map((company, i) => (
                  <div key={i} className="text-slate-800 dark:text-white font-semibold bg-slate-100 dark:bg-white/5 px-3 py-1 rounded">
                    {company}
                  </div>
                ))}
              </div>
            </div>
            
            <div className="flex gap-6">
              {[
                { number: "50k+", label: "Resumes Improved" },
                { number: "92%", label: "Interview Rate" }
              ].map((stat, i) => (
                <div key={i} className="text-center">
                  <p className="text-2xl font-bold text-transparent bg-clip-text bg-gradient-to-r from-indigo-500 to-violet-500 dark:from-indigo-400 dark:to-violet-400">
                    {stat.number}
                  </p>
                  <p className="text-xs text-slate-500 dark:text-slate-400">{stat.label}</p>
                </div>
              ))}
            </div>
          </div>
        </div>
        
        {/* Scroll indicator */}
        <div className="flex justify-center mt-12">
          <button className="group flex flex-col items-center text-slate-500 hover:text-slate-800 dark:text-slate-400 dark:hover:text-white transition-colors">
            <span className="text-sm mb-2">Explore Features</span>
            <div className="w-8 h-8 rounded-full border border-slate-300 dark:border-slate-700 flex items-center justify-center group-hover:border-indigo-500 transition-colors">
              <ArrowRight className="w-4 h-4 group-hover:text-indigo-500 dark:group-hover:text-indigo-400 transition-colors" />
            </div>
          </button>
        </div>
      </div>
    </section>
  );
}