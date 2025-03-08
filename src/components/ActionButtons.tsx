// components/UI/ActionButtons.tsx
"use client";

import React from "react";
import { ArrowLeft, BarChart2 } from "lucide-react";

interface ActionButtonsProps {
  darkMode: boolean;
  onBack?: () => void;
  onNext: () => void;
  nextLabel: string;
  nextIcon?: React.ReactNode;
  disabled?: boolean;
  loading?: boolean;
}

const ActionButtons: React.FC<ActionButtonsProps> = ({
  darkMode,
  onBack,
  onNext,
  nextLabel,
  nextIcon,
  disabled = false,
  loading = false,
}) => {
  return (
    <div className="pt-4 flex flex-col-reverse sm:flex-row sm:gap-4">
      {onBack && (
        <button
          onClick={onBack}
          className={`
            w-full sm:w-auto mt-3 sm:mt-0 flex items-center justify-center py-3 px-4 rounded-lg text-base font-medium 
            ${
              darkMode
                ? "bg-gray-700 text-gray-300 hover:bg-gray-600"
                : "bg-gray-100 text-gray-700 hover:bg-gray-200"
            }
            transition-all duration-200
          `}
        >
          <ArrowLeft size={16} className="mr-2" />
          Back
        </button>
      )}
      <button
        onClick={onNext}
        disabled={disabled || loading}
        className={`
          w-full ${onBack ? "sm:flex-1" : ""} flex items-center justify-center py-3.5 px-4 rounded-lg text-base font-medium shadow-sm 
          ${
            disabled || loading
              ? darkMode
                ? "bg-gray-700 text-gray-400 cursor-not-allowed"
                : "bg-gray-200 text-gray-500 cursor-not-allowed"
              : darkMode
              ? "bg-indigo-600 text-white hover:bg-indigo-700"
              : "bg-indigo-600 text-white hover:bg-indigo-700"
          }
          transition-all duration-200
        `}
      >
        {loading ? (
          <>
            <svg
              className="animate-spin -ml-1 mr-3 h-5 w-5 text-white"
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
            Analyzing Resume...
          </>
        ) : (
          <>
            {nextIcon || <BarChart2 className="w-5 h-5 mr-2" />}
            {nextLabel}
          </>
        )}
      </button>
    </div>
  );
};

export default ActionButtons;