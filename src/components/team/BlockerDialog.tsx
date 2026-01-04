import React, { useState, useEffect } from 'react';
import { Button } from '../ui/Button';
import { Textarea } from '../ui/Textarea';
import { AlertCircle, X } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';

interface BlockerDialogProps {
    isOpen: boolean;
    onClose: () => void;
    onConfirm: (reason: string) => void;
}

export const BlockerDialog: React.FC<BlockerDialogProps> = ({ isOpen, onClose, onConfirm }) => {
    const [reason, setReason] = useState('');

    useEffect(() => {
        const handleKeyDown = (e: KeyboardEvent) => {
            if (e.key === 'Escape' && isOpen) {
                onClose();
            }
        };
        window.addEventListener('keydown', handleKeyDown);
        return () => window.removeEventListener('keydown', handleKeyDown);
    }, [isOpen, onClose]);

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        onConfirm(reason);
        setReason('');
        // onClose is called by parent usually, or we call it here if parent expects it. 
        // Logic checks out: onConfirm does logic, then component unmounts/hides via parent state.
        // But usually we might want to ensure closing. The parent sets isOpen false.
        // Assuming onConfirm might trigger parent close. 
        // Wait, DeveloperRow usage: onConfirm calls actions.toggle..., then setIsBlockerDialogOpen(false).
        // So we don't need to call onClose() here if parent does it. 
        // But for safety/standard pattern, usually form submit just calls confirm.
        // The original code called onClose() too. I'll keep it consistent with original if needed, 
        // but typically onConfirm implies "done". 
        // Let's call onClose() just in case the parent relies on it, 
        // although DeveloperRow explicitly closes it. It's harmless.
        // Actually, looking at DeveloperRow:
        // onConfirm={(reason) => { actions...; setIsBlockerDialogOpen(false); }}
        // So calling onClose() is redundant but fine.
    };

    return (
        <AnimatePresence>
            {isOpen && (
                <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
                    {/* Backdrop */}
                    <motion.div
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        exit={{ opacity: 0 }}
                        transition={{ duration: 0.2 }}
                        className="absolute inset-0 bg-black/50 backdrop-blur-sm"
                        onClick={onClose}
                    />
                    
                    {/* Content */}
                    <motion.div
                        initial={{ scale: 0.95, opacity: 0, y: 10 }}
                        animate={{ scale: 1, opacity: 1, y: 0 }}
                        exit={{ scale: 0.95, opacity: 0, y: 10 }}
                        transition={{ duration: 0.2, type: "spring", bounce: 0.3 }}
                        className="bg-background border rounded-xl shadow-lg w-full max-w-md p-6 relative z-10"
                        onClick={(e) => e.stopPropagation()}
                    >
                        <div className="flex items-center justify-between mb-4">
                            <div className="flex items-center gap-2 text-red-500 font-bold text-lg">
                                <AlertCircle />
                                <h3>Flag Blocker</h3>
                            </div>
                            <button onClick={onClose} className="text-muted-foreground hover:text-foreground transition-colors p-1 rounded-md hover:bg-muted">
                                <X size={20} />
                            </button>
                        </div>

                        <form onSubmit={handleSubmit} className="space-y-4">
                            <div className="flex flex-col gap-3">
                                <label className="text-sm font-medium">Why are you blocked?</label>
                                <Textarea 
                                    value={reason}
                                    onChange={(e) => setReason(e.target.value)}
                                    placeholder="e.g., Waiting for API deployment, Design assets missing..."
                                    className="min-h-[100px] resize-none"
                                    required
                                    autoFocus
                                />
                            </div>

                            <div className="flex justify-end gap-2">
                                <Button type="button" variant="ghost" onClick={onClose}>Cancel</Button>
                                <Button type="submit" variant="destructive">Flag Blocker</Button>
                            </div>
                        </form>
                    </motion.div>
                </div>
            )}
        </AnimatePresence>
    );
};
