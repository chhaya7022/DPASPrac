
import React from 'react';
import { ArrowLeft } from 'lucide-react';
import { cn } from "@/lib/utils";

interface BannerProps {
  title: string;
  showBackButton?: boolean;
  onBackClick?: () => void;
  className?: string;
}

const Banner: React.FC<BannerProps> = ({ 
  title, 
  showBackButton = true, 
  onBackClick, 
  className 
}) => {
  return (
    <div className={cn("flex items-center gap-3 my-2", className)}>
      {showBackButton && (
        <a 
          href="#" 
          className="bg-white border border-gray-300 rounded-full p-1.5 hover:bg-gray-100 transition-all"
          onClick={(e) => {
            e.preventDefault();
            if (onBackClick) onBackClick();
            else window.history.back();
          }}
        >
          <ArrowLeft className="h-4 w-4" />
        </a>
      )}
      <div className="relative flex flex-grow justify-center items-center">
        <div className="absolute inset-0 flex items-center">
          <div className="w-full border-t border-blue-300" />
        </div>
        <div className="relative z-10 bg-blue-500 text-white px-16 py-1">
          <h2 className="text-base font-medium">{title}</h2>
        </div>
      </div>
    </div>
  );
};

export default Banner;
