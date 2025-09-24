import React from 'react';
import { Button } from './Button';
import { AlertTriangle } from 'lucide-react';

interface AlertModalProps {
  isOpen: boolean;
  onClose: () => void;
  title: string;
  message: string;
}

const AlertModal: React.FC<AlertModalProps> = ({ isOpen, onClose, title, message }) => {
  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/80 backdrop-blur-sm">
      <div className="relative w-full max-w-md rounded-lg bg-background shadow-2xl p-6">
        <div className="flex flex-col items-center text-center">
            <div className="rounded-full bg-amber-500/10 p-3 mb-4">
                <AlertTriangle className="h-8 w-8 text-amber-500" />
            </div>
            <h2 className="text-xl font-semibold mb-2">{title}</h2>
            <p className="text-sm text-secondary-foreground mb-6">{message}</p>
            <Button onClick={onClose} className="w-full">
                OK, Got it
            </Button>
        </div>
      </div>
    </div>
  );
};

export default AlertModal;