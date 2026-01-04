import React from 'react';

import { Modal } from './Modal';
import { Button } from './Button';
import { AlertTriangle, CheckCircle } from 'lucide-react';

interface ConfirmDialogProps {
  isOpen: boolean;
  onClose: () => void;
  onConfirm: () => void;
  title: string;
  description: string;
  confirmText?: string;
  cancelText?: string;
  variant?: 'danger' | 'warning' | 'info' | 'success';
}

export const ConfirmDialog: React.FC<ConfirmDialogProps> = ({
  isOpen,
  onClose,
  onConfirm,
  title,
  description,
  confirmText = 'Confirm',
  cancelText = 'Cancel',
  variant = 'danger'
}) => {
  return (
    <Modal isOpen={isOpen} onClose={onClose} title={null} className="max-w-sm">
       <div className="flex flex-col items-center text-center p-4">
          <div className={`p-4 rounded-full mb-4 ${
            variant === 'danger' ? 'bg-red-100 text-red-600 dark:bg-red-900/30 dark:text-red-500' : 
            variant === 'success' ? 'bg-emerald-100 text-emerald-600 dark:bg-emerald-900/30 dark:text-emerald-500' :
            'bg-amber-100 text-amber-600 dark:bg-amber-900/30 dark:text-amber-500'
          }`}>
              {variant === 'success' ? <CheckCircle size={32} /> : <AlertTriangle size={32} />}
          </div>
          <h3 className="text-xl font-bold mb-3 px-2">{title}</h3>
          <p className="text-muted-foreground mb-8 text-sm leading-relaxed px-2">{description}</p>
          
          <div className="flex gap-3 w-full mt-2">
              <Button variant="ghost" className="flex-1 rounded-full h-11" onClick={onClose}>
                  {cancelText}
              </Button>
              <Button 
                className={`flex-1 rounded-full h-11 shadow-lg ${
                  variant === 'danger' ? 'bg-red-600 hover:bg-red-700 text-white shadow-red-500/20' : 
                  variant === 'success' ? 'bg-emerald-600 hover:bg-emerald-700 text-white shadow-emerald-500/20' : 
                  'shadow-primary/20'
                }`}
                onClick={() => {
                    onConfirm();
                    onClose();
                }}
              >
                  {confirmText}
              </Button>
          </div>
       </div>
    </Modal>
  );
};
