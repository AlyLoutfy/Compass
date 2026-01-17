import React, { useState, useRef, useEffect } from 'react';
import { createPortal } from 'react-dom';
import { Check, ChevronsUpDown, Search } from 'lucide-react';
import { cn } from '@/lib/utils';
import { Button } from '@/components/ui/Button';
import { Input } from '@/components/ui/Input';

interface Option {
    id: string;
    name: string;
}

interface MultiSelectDropdownProps {
    options: Option[];
    selectedIds: string[];
    onChange: (selectedIds: string[]) => void;
    placeholder?: string;
    className?: string;
    triggerClassName?: string;
    triggerVariant?: "primary" | "destructive" | "outline" | "secondary" | "ghost" | "link";
    renderValue?: (selectedIds: string[]) => React.ReactNode;
    showArrow?: boolean;
}

export const MultiSelectDropdown: React.FC<MultiSelectDropdownProps> = ({ 
    options, 
    selectedIds, 
    onChange, 
    placeholder = "Select items...", 
    className,
    triggerClassName,
    triggerVariant = "primary",
    renderValue,
    showArrow = true
}) => {
    const [isOpen, setIsOpen] = useState(false);
    const [searchTerm, setSearchTerm] = useState('');
    const dropdownRef = useRef<HTMLDivElement>(null);
    const [coords, setCoords] = useState({ top: 0, left: 0, width: 0 });
    const portalRef = useRef<HTMLDivElement>(null);

    // Calculate position
    const updatePosition = () => {
        if (dropdownRef.current) {
            const rect = dropdownRef.current.getBoundingClientRect();
            setCoords({
                top: rect.bottom + 4,
                left: rect.left,
                width: rect.width
            });
        }
    };

    // Filter options based on search term
    const filteredOptions = options.filter(option => 
        option.name.toLowerCase().includes(searchTerm.toLowerCase())
    );

    // Update position on scroll/resize
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
            const target = event.target as Node;
            const clickedDropdown = dropdownRef.current && dropdownRef.current.contains(target);
            const clickedPortal = portalRef.current && portalRef.current.contains(target);
            
            if (!clickedDropdown && !clickedPortal) {
                setIsOpen(false);
            }
        };

        document.addEventListener('mousedown', handleClickOutside);
        return () => {
            document.removeEventListener('mousedown', handleClickOutside);
        };
    }, []);

    const toggleSelection = (id: string) => {
        const newSelectedIds = selectedIds.includes(id)
            ? selectedIds.filter(item => item !== id)
            : [...selectedIds, id];
        
        onChange(newSelectedIds);
    };

    return (
        <div className={cn("relative", className)} ref={dropdownRef}>
            <Button
                type="button"
                variant={triggerVariant}
                role="combobox"
                aria-expanded={isOpen}
                className={cn(
                    "flex h-12 w-full items-center justify-between rounded-2xl border border-input bg-background pl-3 pr-2 text-sm ring-offset-background placeholder:text-muted-foreground focus:outline-none focus:ring-2 focus:ring-ring focus:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50 transition-all hover:bg-accent hover:text-accent-foreground font-normal text-left shadow-none",
                    triggerClassName
                )}
                onClick={() => {
                    setIsOpen(!isOpen);
                    if (!isOpen) setTimeout(updatePosition, 0);
                }}
            >
                <div className="flex-1 truncate">
                    {renderValue ? renderValue(selectedIds) : (
                        selectedIds.length === 0
                            ? placeholder
                            : selectedIds.includes('all') 
                                ? "All Organizations Selected" 
                                : `${selectedIds.length} selected`
                    )}
                </div>
                {showArrow && <ChevronsUpDown className="ml-2 h-4 w-4 shrink-0 opacity-50" />}
            </Button>
            
            {isOpen && createPortal(
                <div 
                    ref={portalRef}
                    style={{ 
                        position: 'fixed', 
                        top: coords.top, 
                        left: coords.left, 
                        minWidth: Math.max(coords.width, 200), // Ensure minimum width
                        zIndex: 9999
                    }}
                    className="rounded-md border bg-popover text-popover-foreground shadow-md outline-none animate-in fade-in-0 zoom-in-95"
                >
                    <div className="p-2 border-b border-border/50">
                        <div className="relative">
                            <Search className="absolute left-2 top-2.5 h-4 w-4 text-muted-foreground" />
                            <Input
                                placeholder="Search..."
                                value={searchTerm}
                                onChange={(e) => setSearchTerm(e.target.value)}
                                className="h-9 pl-8 border-transparent bg-transparent ring-0 focus-visible:ring-0 focus-visible:ring-offset-0 placeholder:text-muted-foreground/70"
                                autoFocus
                            />
                        </div>
                    </div>
                    <div className="max-h-[200px] overflow-y-auto p-1 space-y-1">
                        {filteredOptions.length === 0 ? (
                            <p className="p-2 text-sm text-muted-foreground text-center">No results found.</p>
                        ) : (
                            filteredOptions.map((option) => (
                                <div
                                    key={option.id}
                                    className={cn(
                                        "relative flex cursor-default select-none items-center rounded-sm px-2 py-1.5 text-sm outline-none transition-colors hover:bg-accent hover:text-accent-foreground cursor-pointer group",
                                        selectedIds.includes(option.id) && "bg-accent/50"
                                    )}
                                    onClick={() => toggleSelection(option.id)}
                                >
                                    <div className={cn(
                                        "mr-2 flex h-4 w-4 items-center justify-center rounded-sm border border-primary/50 group-hover:border-primary transition-colors",
                                        selectedIds.includes(option.id) ? "bg-primary border-primary text-primary-foreground" : "opacity-50 [&_svg]:invisible"
                                    )}>
                                        <Check className={cn("h-3 w-3", selectedIds.includes(option.id) ? "visible" : "invisible")} />
                                    </div>
                                    <span className={cn("flex-1 truncate", option.id === 'all' && "font-bold text-primary")}>
                                        {option.name}
                                    </span>
                                </div>
                            ))
                        )}
                    </div>
                </div>,
                document.body
            )}
        </div>
    );
};
