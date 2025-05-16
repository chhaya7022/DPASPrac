import React, { ReactNode, useEffect } from 'react';
import { X } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { cn } from '@/lib/utils';
import { ScrollArea } from '@/components/ui/scroll-area';

interface PopupProps {
  isOpen: boolean;
  onClose: () => void;
  title?: string;
  children: ReactNode;
  size?: 'sm' | 'md' | 'lg' | 'xl' | 'full';
  className?: string;
  showFooter?: boolean;
}

const ComPopup = ({
  isOpen,
  onClose,
  title,
  children,
  size = 'md',
  className,
  showFooter = true,
}: PopupProps) => {
  // Close on escape key press
  useEffect(() => {
    const handleEscapeKey = (event: KeyboardEvent) => {
      if (event.key === 'Escape' && isOpen) {
        onClose();
      }
    };

    document.addEventListener('keydown', handleEscapeKey);

    // Lock body scroll when popup is open
    if (isOpen) {
      document.body.style.overflow = 'hidden';
    }

    return () => {
      document.removeEventListener('keydown', handleEscapeKey);
      document.body.style.overflow = 'auto';
    };
  }, [isOpen, onClose]);

  if (!isOpen) return null;

  // Size map for the popup
  const sizeClasses = {
    sm: 'max-w-md',
    md: 'max-w-2xl',
    lg: 'max-w-4xl',
    xl: 'max-w-6xl',
    full: 'w-full h-full max-w-none rounded-none'
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 p-0" style={{margin:'auto'}}>
      <div
        className={cn(
          "relative bg-white shadow-lg w-full overflow-hidden flex flex-col rounded-sm",
          sizeClasses[size],
          className
        )}
      >
        {title && (
          <div className="flex items-center justify-between border-b p-4 text-black bg-gray-100">
            {/* <h2 className="text-lg font-semibold">{title}</h2> */}
            {/* <Button
              variant="ghost"
              size="icon"
              onClick={onClose}
              className="h-8 w-8 rounded-full hover:bg-gray-200" 
            >
              <X className="h-4 w-4" />
            </Button> */}
          </div>
        )}

        {!title && (
          <Button
            variant="ghost"
            size="icon"
            onClick={onClose}
            className="absolute right-2 top-2 h-8 w-8 rounded-full z-10"
          >
            <X className="h-4 w-4" />
          </Button>
        )}

        <ScrollArea className="flex-1 overflow-y-auto">
          <div className="p-4">{children}</div>
        </ScrollArea>

        {showFooter && (
          <div className="border-t p-4 flex justify-end bg-white ">
            <Button
              variant="default"
              onClick={onClose}
              className="h-8 bg-orange-500 hover:bg-orange-600"
            >
              Close
            </Button>
          </div>
        )}
      </div>
    </div>
  );
};

export default ComPopup;
