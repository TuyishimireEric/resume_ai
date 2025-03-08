// components/UI/InfoPanel.tsx
"use client";

import React from "react";
import { Info } from "lucide-react";

interface InfoPanelProps {
  showInfo: boolean;
  darkMode: boolean;
  children: React.ReactNode;
}

const InfoPanel: React.FC<InfoPanelProps> = ({ showInfo, darkMode, children }) => {
  if (!showInfo) return null;

  return (
    <div
      className={`mb-3 p-3 text-sm rounded-md ${
        darkMode
          ? "bg-indigo-900/20 text-indigo-300 border border-indigo-800"
          : "bg-indigo-50 text-indigo-700 border border-indigo-100"
      }`}
    >
      <div className="flex items-start">
        <Info size={16} className="mr-2 mt-0.5 flex-shrink-0" />
        <div>{children}</div>
      </div>
    </div>
  );
};

export default InfoPanel;