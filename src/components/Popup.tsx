import React from 'react';
import { Button } from "@/components/ui/button";

interface PopupProps {
  isOpen: boolean;
  message: string;
  onClose: () => void;
}

const Popup: React.FC<PopupProps> = ({ isOpen, message, onClose }) => {
  if (!isOpen) return null;
  const handleClose = () => {
    window.location.reload(); 
  };
  return (
    <div className="fixed inset-0 flex items-center justify-center z-50">
      <div className="fixed inset-0 bg-black/20" onClick={onClose}></div>
      <div className="relative bg-white border border-gray-300 rounded-md shadow-lg w-full max-w-md mx-5">
        <div className="p-6">
          <p className="text-gray-800 text-lg">{message}</p>
        </div>
        <div className="flex justify-end p-4">
          {/* <Button 
            className="bg-indigo-600 hover:bg-indigo-700 text-white"
            onClick={onClose}
          > */}
            <Button 
            className="bg-blue-600 hover:bg-blue-700 text-white h-9"
            onClick={() => {
              onClose();        
              handleClose(); 
            }} >
            OK
          </Button>
        </div>
      </div>
    </div>
  );
};

export default Popup;