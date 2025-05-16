import React, { useEffect, useRef } from "react";
import { XCircle } from "lucide-react";
import { cn } from "@/lib/utils";

interface PopupProps {
  isOpen: boolean;
  onClose: () => void;
  children: React.ReactNode;
  className?: string;
  showCloseButton?: boolean;
  closeOnOverlayClick?: boolean;
  closeOnEscapeKey?: boolean;
  width?: string | number;
  height?: string | number;
  overlayClassName?: string;
}

const CustomPopUp = ({
  isOpen,
  onClose,
  children,
  className,
  showCloseButton = true,
  closeOnOverlayClick = true,
  closeOnEscapeKey = true,
  width,
  height,
  overlayClassName,
}: PopupProps) => {
  const popupRef = useRef<HTMLDivElement>(null);

  // Handle ESC key press to close the popup
  useEffect(() => {
    const handleEscKey = (event: KeyboardEvent) => {
      if (event.key === "Escape" && isOpen && closeOnEscapeKey) {
        onClose();
      }
    };

    // Add event listener for ESC key
    document.addEventListener("keydown", handleEscKey);

    // Lock body scroll when popup is open
    if (isOpen) {
      document.body.style.overflow = "hidden";
    }

    // Cleanup
    return () => {
      document.removeEventListener("keydown", handleEscKey);
      document.body.style.overflow = "";
    };
  }, [isOpen, onClose, closeOnEscapeKey]);

  // Trap focus inside the popup for accessibility
  useEffect(() => {
    if (!isOpen) return;

    const popupElement = popupRef.current;
    if (!popupElement) return;

    // Get all focusable elements within the popup
    const focusableElements = popupElement.querySelectorAll(
      'button, [href], input, select, textarea, [tabindex]:not([tabindex="-1"])'
    );

    if (focusableElements.length === 0) return;

    const firstElement = focusableElements[0] as HTMLElement;
    const lastElement = focusableElements[
      focusableElements.length - 1
    ] as HTMLElement;

    // Focus the first element when the popup opens
    firstElement.focus();

    const handleTabKey = (e: KeyboardEvent) => {
      if (e.key !== "Tab") return;

      // If shift+tab on the first element, move to the last element
      if (e.shiftKey && document.activeElement === firstElement) {
        e.preventDefault();
        lastElement.focus();
      }
      // If tab on the last element, move to the first element
      else if (!e.shiftKey && document.activeElement === lastElement) {
        e.preventDefault();
        firstElement.focus();
      }
    };

    document.addEventListener("keydown", handleTabKey);
    return () => {
      document.removeEventListener("keydown", handleTabKey);
    };
  }, [isOpen]);

  if (!isOpen) return null;

  // Prepare style object for width and height
  const popupStyle: React.CSSProperties = {};
  
  if (width) {
    popupStyle.width = typeof width === 'number' ? `${width}px` : width;
    popupStyle.maxWidth = '100%';
  }
  
  if (height) {
    popupStyle.height = typeof height === 'number' ? `${height}px` : height;
    popupStyle.maxHeight = '100%';
  }

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center">
      {/* Overlay */}
      <div 
        className={cn(
          "absolute inset-0 bg-black/60 backdrop-blur-sm transition-opacity animate-fade-in",
          overlayClassName
        )}
        onClick={closeOnOverlayClick ? onClose : undefined}
      />
      
      {/* Popup container */}
      <div
        ref={popupRef}
        className={cn(
          "relative z-10 w-full max-w-md p-6 rounded-lg shadow-lg bg-white animate-scale-in overflow-auto",
          className
        )}
        style={popupStyle}
        role="dialog"
        aria-modal="true"
      >
        {showCloseButton && (
          <button
            onClick={onClose}
            className="absolute top-4 right-4 text-gray-500 hover:text-gray-700 transition-colors"
            aria-label="Close popup"
          >
            <XCircle className="w-6 h-6" />
          </button>
        )}
        {children}
      </div>
    </div>
  );
};

export default CustomPopUp;
