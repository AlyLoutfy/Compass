import React, { useState, useRef, useEffect } from 'react';
import { createPortal } from 'react-dom';
import { AnimatePresence, motion } from 'framer-motion';
import { Filter, X } from 'lucide-react';
import { Button } from './Button';
import { cn } from '@/lib/utils';

interface FilterPopoverProps {
    title?: string;
    children: React.ReactNode;
    activeCount?: number;
    onReset?: () => void;
}

export const FilterPopover: React.FC<FilterPopoverProps> = ({ title = "Filters", children, activeCount, onReset }) => {
    const [isOpen, setIsOpen] = useState(false);
    const containerRef = useRef<HTMLDivElement>(null);
    const [coords, setCoords] = useState<{ top: number; left: number }>({ top: 0, left: 0 });

    const updatePosition = () => {
        if (containerRef.current) {
            const rect = containerRef.current.getBoundingClientRect();
            const popoverWidth = 260; // Known width from className
            const windowWidth = window.innerWidth;
            
            let left = rect.left;
            
            // If popover would overflow right edge, align it to the right of the trigger
            if (left + popoverWidth > windowWidth - 20) { // 20px buffer
                left = rect.right - popoverWidth;
            }

            setCoords({
                top: rect.bottom + 8,
                left: left
            });
        }
    };

    useEffect(() => {
        if (isOpen) {
            updatePosition();
            window.addEventListener('resize', updatePosition);
            window.addEventListener('scroll', updatePosition, true);
        }
        return () => {
            window.removeEventListener('resize', updatePosition);
            window.removeEventListener('scroll', updatePosition, true);
        };
    }, [isOpen]);

    // Close on click outside
    useEffect(() => {
        const handleClickOutside = (event: MouseEvent) => {
            if (containerRef.current && containerRef.current.contains(event.target as Node)) {
                return;
            }

            const popoverContent = document.getElementById('filter-popover-content');
            if (popoverContent && popoverContent.contains(event.target as Node)) {
                return;
            }

            // Handle nested portals (like Select dropdowns)
            const target = event.target as HTMLElement;
            if (target.closest('.bg-popover') || target.closest('[role="dialog"]')) {
                return;
            }

            setIsOpen(false);
        };

        if (isOpen) {
            document.addEventListener("mousedown", handleClickOutside);
        }
        return () => document.removeEventListener("mousedown", handleClickOutside);
    }, [isOpen]);

    return (
        <div className="relative flex items-center gap-1" ref={containerRef}>
            <Button 
                variant={isOpen || (activeCount && activeCount > 0) ? "secondary" : "outline"} 
                size="sm" 
                onClick={() => setIsOpen(!isOpen)}
                className={cn(
                    "gap-2 border-dashed h-9 px-3", 
                    (activeCount && activeCount > 0) && "bg-primary/10 text-primary border-primary/20 hover:bg-primary/20"
                )}
            >
                <Filter size={14} />
                <span>Filter</span>
                {activeCount !== undefined && activeCount > 0 && (
                    <span className="ml-1 h-5 w-5 flex items-center justify-center rounded-full bg-primary text-primary-foreground text-[10px] font-bold">
                        {activeCount}
                    </span>
                )}
            </Button>
            <AnimatePresence>
                {activeCount !== undefined && activeCount > 0 && onReset && (
                    <motion.button
                        initial={{ opacity: 0, scale: 0.9, width: 0 }}
                        animate={{ opacity: 1, scale: 1, width: "auto" }}
                        exit={{ opacity: 0, scale: 0.9, width: 0 }}
                        transition={{ type: "spring", bounce: 0, duration: 0.3 }}
                        onClick={(e) => {
                            e.stopPropagation();
                            onReset();
                        }}
                        className="h-7 pl-2 pr-1.5 ml-1 flex items-center gap-1.5 text-xs font-medium text-muted-foreground hover:text-foreground hover:bg-zinc-100 dark:hover:bg-zinc-800 rounded-full border border-dashed border-transparent hover:border-zinc-300 dark:hover:border-zinc-700 transition-colors overflow-hidden whitespace-nowrap"
                        title="Clear filters"
                    >
                        <span>Clear</span>
                        <X size={12} />
                    </motion.button>
                )}
            </AnimatePresence>

            {isOpen && createPortal(
                <AnimatePresence>
                    <motion.div
                         id="filter-popover-content"
                         initial={{ opacity: 0, scale: 0.95, y: -10 }}
                         animate={{ opacity: 1, scale: 1, y: 0 }}
                         exit={{ opacity: 0, scale: 0.95, y: -10 }}
                         transition={{ duration: 0.15 }}
                         style={{
                             position: 'fixed',
                             top: coords.top,
                             left: coords.left,
                             zIndex: 50
                         }}
                         className="w-[260px] bg-white dark:bg-zinc-950 border border-zinc-200 dark:border-zinc-800 rounded-xl shadow-xl p-4 flex flex-col gap-4"
                    >
                        <div className="flex items-center justify-between">
                            <h4 className="font-medium text-sm text-foreground">{title}</h4>
                            {activeCount !== undefined && activeCount > 0 && onReset && (
                                <button 
                                    onClick={() => {
                                        onReset();
                                        // Optional: Keep open or close? Usually keep open to see effect.
                                    }} 
                                    className="text-xs text-muted-foreground hover:text-primary transition-colors flex items-center gap-1"
                                >
                                    <X size={12} />
                                    Reset all
                                </button>
                            )}
                        </div>
                        
                        <div className="flex flex-col gap-3">
                            {children}
                        </div>
                    </motion.div>
                </AnimatePresence>,
                document.body
            )}
        </div>
    );
};
