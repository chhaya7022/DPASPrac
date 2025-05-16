
import React from 'react';
import { cn } from "@/lib/utils";

interface ButtonProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  children: React.ReactNode;
  variant?: 'primary' | 'outline';
  size?: 'sm' | 'md' | 'lg';
}

const Button: React.FC<ButtonProps> = ({ 
  children, 
  variant = 'primary',
  size = 'md',
  className,
  ...props 
}) => {
  return (
    <button
      className={cn(
        "font-medium focus:outline-none transition-all rounded",
        variant === 'primary' && "bg-blue-500 text-white hover:bg-blue-600",
        variant === 'outline' && "bg-transparent border border-blue-500 text-blue-500 hover:bg-blue-50",
        size === 'sm' && "px-3 py-1.5 text-sm",
        size === 'md' && "px-4 py-2",
        size === 'lg' && "px-6 py-2.5",
        className
      )}
      {...props}
    >
      {children}
    </button>
  );
};

export default Button;
