// components/Layout/ProgressSteps.tsx
"use client";

import React from "react";
import { Check } from "lucide-react";

interface ProgressStepsProps {
  activeStep: number;
  setActiveStep: (step: number) => void;
  darkMode: boolean;
}

const ProgressSteps: React.FC<ProgressStepsProps> = ({ 
  activeStep, 
  setActiveStep, 
  darkMode 
}) => {
  const steps = [
    { number: 1, title: "Job Details" },
    { number: 2, title: "Upload Resume" },
    { number: 3, title: "Analysis" },
  ];

  return (
    <div className="mb-8 flex items-center justify-center">
      {steps.map((step, index) => (
        <React.Fragment key={step.number}>
          <div 
            className={`flex flex-col items-center relative ${index === steps.length - 1 ? "" : "w-24 sm:w-32 md:w-40"}`}
            onClick={() => step.number < activeStep && setActiveStep(step.number)}
          >
            <div
              className={`
                w-8 h-8 rounded-full flex items-center justify-center 
                ${
                  step.number === activeStep
                    ? darkMode
                      ? "bg-indigo-600 text-white"
                      : "bg-indigo-600 text-white"
                    : step.number < activeStep
                    ? darkMode
                      ? "bg-indigo-400 text-white"
                      : "bg-indigo-400 text-white"
                    : darkMode
                    ? "bg-gray-700 text-gray-400"
                    : "bg-gray-200 text-gray-500"
                }
                transition-all duration-200 cursor-pointer z-10
              `}
            >
              {step.number < activeStep ? (
                <Check size={16} />
              ) : (
                <span className="text-sm font-medium">{step.number}</span>
              )}
            </div>
            <span 
              className={`
                mt-2 text-xs font-medium
                ${
                  step.number === activeStep
                    ? darkMode
                      ? "text-indigo-400"
                      : "text-indigo-600"
                    : darkMode
                    ? "text-gray-400"
                    : "text-gray-500"
                }
              `}
            >
              {step.title}
            </span>
            {index < steps.length - 1 && (
              <div 
                className={`
                  absolute top-4 w-full h-0.5 -right-12 sm:-right-16 md:-right-20
                  ${
                    step.number < activeStep
                      ? darkMode
                        ? "bg-indigo-400"
                        : "bg-indigo-400"
                      : darkMode
                      ? "bg-gray-700"
                      : "bg-gray-200"
                  }
                `}
              />
            )}
          </div>
        </React.Fragment>
      ))}
    </div>
  );
};

export default ProgressSteps;