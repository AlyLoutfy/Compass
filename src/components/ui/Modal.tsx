import React, { useEffect, useState } from 'react';
import { createPortal } from 'react-dom';
import { X } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import { cn } from '@/lib/utils';

interface ModalProps {
  isOpen: boolean;
  onClose: () => void;
  title?: React.ReactNode;
  children: React.ReactNode;
  className?: string;
  noPadding?: boolean;
  hideCloseButton?: boolean;
}


export const Modal: React.FC<ModalProps> = ({ isOpen, onClose, title, children, className, noPadding, hideCloseButton }) => {
  const [isMobile, setIsMobile] = useState(false);

  useEffect(() => {
    const checkMobile = () => setIsMobile(window.innerWidth < 768);
    checkMobile();
    window.addEventListener('resize', checkMobile);
    return () => window.removeEventListener('resize', checkMobile);
  }, []);

  // Lock body scroll
  useEffect(() => {
    if (isOpen) {
      document.body.style.overflow = 'hidden';
    } else {
      document.body.style.overflow = 'unset';
    }
    return () => { document.body.style.overflow = 'unset'; };
  }, [isOpen]);

  useEffect(() => {
    if (!isOpen) return;
    
    const handleEsc = (e: KeyboardEvent) => {
      if (e.key === 'Escape') onClose();
    };
    window.addEventListener('keydown', handleEsc);
    return () => window.removeEventListener('keydown', handleEsc);
  }, [isOpen, onClose]);

  return createPortal(
    <AnimatePresence>
      {isOpen && (
        <>
          {/* Backdrop */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={onClose}
            className="fixed inset-0 bg-black/40 backdrop-blur-sm z-50 transition-opacity"
          />
          
          {/* Content */}
          <div className="fixed inset-0 z-50 flex items-center justify-center pointer-events-none">
            <motion.div
              initial={isMobile ? { y: '100%' } : { opacity: 0, scale: 0.95, y: 10 }}
              animate={isMobile ? { y: 0 } : { opacity: 1, scale: 1, y: 0 }}
              exit={isMobile ? { y: '100%' } : { opacity: 0, scale: 0.95, y: 10 }}
              transition={{ type: "spring", damping: 25, stiffness: 300 }}
              className={cn(
                "bg-popover border border-border/40 shadow-2xl pointer-events-auto flex flex-col relative overflow-hidden",
                isMobile 
                  ? "absolute bottom-0 left-0 right-0 rounded-t-[2.5rem] max-h-[90vh]" 
                  : "rounded-[2.5rem] w-full max-w-lg max-h-[85vh]",
                className
              )}
            >
              {/* Header */}
              {title ? (
                <div className="flex items-center justify-between px-8 py-6 shrink-0">
                  <h2 className="text-2xl font-bold tracking-tight text-foreground">{title}</h2>
                  {!hideCloseButton && (
                    <button 
                        onClick={onClose}
                        className="p-2 -mr-2 rounded-full hover:bg-muted transition-colors text-muted-foreground hover:text-foreground"
                    >
                        <X size={20} />
                    </button>
                  )}
                </div>
              ) : (
                !hideCloseButton && (
                    <button 
                    onClick={onClose}
                    className="absolute right-4 top-4 p-2 rounded-full hover:bg-white/10 dark:hover:bg-black/20 text-muted-foreground hover:text-foreground z-50 transition-colors"
                    >
                    <X size={20} />
                    </button>
                )
              )}

              {/* Body */}
              <div className={cn(
                "flex-1 overflow-y-auto",
                (noPadding || !title) ? "p-0" : "px-8 py-6"
              )}>
                {children}
              </div>
            </motion.div>
          </div>
        </>
      )}
    </AnimatePresence>,
    document.body
  );
};
