import React from 'react';
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import HandoverForm from './HandoverForm';

interface HandoverModalProps {
  open: boolean;
  onClose: () => void;
  BatchHandoverId:number;
}

const HandoverModal: React.FC<HandoverModalProps> = ({ open, onClose ,BatchHandoverId}) => {
  return (
    <Dialog open={open} onOpenChange={onClose}>
      <DialogContent className="sm:max-w-2xl md:max-w-3xl lg:max-w-4xl w-[90vw] rounded-sm">
        <fieldset className="border border-gray-300 p-4 rounded-sm">
          <legend className="text-base text-lg font-medium text-gray-700 px-1">Handover Details</legend>
          <DialogHeader>
            <DialogTitle className="sr-only">Handover Details</DialogTitle> {/* Accessible but hidden */}
          </DialogHeader>
          <HandoverForm BatchHandoverId={BatchHandoverId} />
        </fieldset>
      </DialogContent>
    </Dialog>
  );
};

export default HandoverModal;
