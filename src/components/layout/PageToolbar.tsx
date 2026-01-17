import React from 'react';
import { Search, Plus } from 'lucide-react';
import { Button } from '@/components/ui/Button';
import { LayoutGroup } from 'framer-motion';

interface PageToolbarProps {
    title: string;
    searchQuery?: string;
    onSearchChange?: (value: string) => void;
    searchPlaceholder?: string;
    count?: number;
    countLabel?: string;
    filters?: React.ReactNode;
    actions?: React.ReactNode;
    hideTitleDivider?: boolean;
}

export const PageToolbar = ({
    title,
    searchQuery = "",
    onSearchChange,
    searchPlaceholder = "Search...",
    count,
    countLabel = "items",
    filters,
    actions,
    hideTitleDivider = false
}: PageToolbarProps) => {
    return (
        <div className="flex items-center p-1.5 border border-zinc-200 dark:border-zinc-800 rounded-xl bg-white dark:bg-zinc-950 gap-2 shadow-sm mb-6 overflow-x-auto no-scrollbar">
            {/* Title */}
            <div className="px-3 shrink-0">
                <h1 className="text-lg font-bold tracking-tight whitespace-nowrap">{title}</h1>
            </div>
            
            {/* Divider */}
            {!hideTitleDivider && (
                <div className="h-4 w-[1px] bg-zinc-200 dark:bg-zinc-700 mx-1 shrink-0" />
            )}

            {/* Search */}
            {onSearchChange && (
                <div className="flex items-center gap-2 px-2 w-full sm:w-[240px] lg:w-[320px] shrink-0 transition-all">
                    <Search className="w-4 h-4 text-muted-foreground shrink-0" />
                    <input
                        className="flex-1 bg-transparent border-none outline-none text-sm placeholder:text-muted-foreground/70 h-9 min-w-0"
                        placeholder={searchPlaceholder}
                        value={searchQuery}
                        onChange={(e) => onSearchChange(e.target.value)}
                    />
                    {searchQuery && (
                        <Button 
                            variant="ghost" 
                            size="sm" 
                            className="h-6 w-6 p-0 hover:bg-zinc-200 dark:hover:bg-zinc-800 rounded-full" 
                            onClick={() => onSearchChange('')}
                        >
                            <Plus className="rotate-45" size={14} />
                        </Button>
                    )}
                </div>
            )}

            <div className="flex-1 min-w-4" />

            {/* Total Count */}
            {count !== undefined && (
                <div className="hidden xl:flex items-center text-xs text-muted-foreground font-medium shrink-0 mr-2 whitespace-nowrap">
                    <span className="text-foreground font-bold mr-1">{count}</span> {countLabel}
                </div>
            )}

            {/* Filters */}
            {filters && (
                <div className="flex items-center gap-1.5 shrink-0">
                    <LayoutGroup>
                        {filters}
                    </LayoutGroup>
                </div>
            )}

            {/* Actions Divider & Buttons */}
            {actions && (
                <>
                    <div className="h-4 w-[1px] bg-zinc-200 dark:bg-zinc-700 mx-1 shrink-0 hidden sm:block" />
                    <div className="flex items-center gap-2 shrink-0">
                        {actions}
                    </div>
                </>
            )}
        </div>
    );
};
