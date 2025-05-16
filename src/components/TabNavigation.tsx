import React from "react";
import { cn } from "@/lib/utils";

interface TabNavigationProps {
  activeTab: string;
  setActiveTab: (tab: string) => void;
}

const TabNavigation: React.FC<TabNavigationProps> = ({ activeTab, setActiveTab }) => {
  return (
    <div className="flex border-b w-full">
      <button
        className={cn(
          "px-6 py-3 text-sm font-medium",
          activeTab === "available" 
            ? "text-blue-600 border-b-2 border-blue-600 bg-white" 
            : "text-gray-600 hover:text-blue-600"
        )}
        onClick={() => setActiveTab("available")}
      >
        Available For HandOver
      </button>
      <button
        className={cn(
          "px-6 py-3 text-sm font-medium",
          activeTab === "selected" 
            ? "text-blue-600 border-b-2 border-blue-600 bg-white" 
            : "text-gray-600 hover:text-blue-600"
        )}
        onClick={() => setActiveTab("selected")}
      >
        Selected For HandOver
      </button>
      <button
        className={cn(
          "px-6 py-3 text-sm font-medium",
          activeTab === "done" 
            ? "text-blue-600 border-b-2 border-blue-600 bg-white" 
            : "text-gray-600 hover:text-blue-600"
        )}
        onClick={() => setActiveTab("done")}
      >
        HandOver Done
      </button>
    </div>
  );
};

export default TabNavigation;
