import React from 'react';
import { Button } from './Button';
import { X, AlertTriangle, CheckCircle } from 'lucide-react';

interface AlertModalProps {
  isOpen: boolean;
  onClose: () => void;
  title: string;
  message: string;
  type?: 'alert' | 'success';
}

const AlertModal: React.FC<AlertModalProps> = ({ isOpen, onClose, title, message, type = 'alert' }) => {
  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/80 backdrop-blur-sm">
      <div className="relative w-full max-w-md rounded-lg bg-background shadow-2xl p-6">
        <div className="flex flex-col items-center text-center">
            <div className={`rounded-full p-3 mb-4 ${type === 'success' ? 'bg-green-500/10' : 'bg-amber-500/10'}`}>
                {type === 'success' ? <CheckCircle className="h-8 w-8 text-green-500" /> : <AlertTriangle className="h-8 w-8 text-amber-500" />}
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