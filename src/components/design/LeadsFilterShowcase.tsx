import React, { useState } from 'react';
import { cn } from '@/lib/utils';
import { ChevronDown, Check, Users, UserCheck, UserMinus } from 'lucide-react';

const ShowcaseWrapper = ({ title, description, children }: { title: string, description: string, children: React.ReactNode }) => (
    <div className="flex flex-col gap-4 p-8 border border-zinc-200 dark:border-zinc-800 rounded-2xl bg-white dark:bg-zinc-950/50 shadow-sm">
        <div className="space-y-1">
            <h3 className="text-sm font-bold text-foreground">{title}</h3>
            <p className="text-xs text-muted-foreground">{description}</p>
        </div>
        <div className="flex items-center gap-4 py-4 min-h-[60px]">
            {children}
        </div>
    </div>
);

export const LeadsFilterShowcase = () => {
    const [activeTab, setActiveTab] = useState('all');
    
    const options = [
        { id: 'all', label: 'All Users', icon: Users },
        { id: 'active', label: 'Active in Leads Rotation', icon: UserCheck },
        { id: 'inactive', label: 'Not Active', icon: UserMinus },
    ];

    return (
        <div className="space-y-12 max-w-5xl mx-auto pb-20">
            <div className="space-y-4">
                <h2 className="text-3xl font-bold tracking-tight">Leads Rotation Filter Designs</h2>
                <p className="text-muted-foreground max-w-2xl">
                    Proposed UI patterns for filtering users by their status in the Leads Rotation. 
                    The goal is to provide a clear, accessible, and aesthetically pleasing way to switch between these states.
                </p>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                
                {/* 1. Segmented Control (Pill Style) */}
                <ShowcaseWrapper 
                    title="1. Segmented Toggle (Apple Style)" 
                    description="Clean, cohesive unit. High affordance for current selection."
                >
                    <div className="bg-zinc-100 dark:bg-zinc-800 p-1 rounded-full flex gap-1">
                        {options.map((opt) => (
                            <button
                                key={opt.id}
                                onClick={() => setActiveTab(opt.id)}
                                className={cn(
                                    "px-4 py-1.5 rounded-full text-xs font-semibold transition-all duration-200",
                                    activeTab === opt.id 
                                        ? "bg-white dark:bg-zinc-700 text-zinc-900 dark:text-zinc-100 shadow-sm" 
                                        : "text-zinc-500 hover:text-zinc-700 dark:hover:text-zinc-300"
                                )}
                            >
                                {opt.label}
                            </button>
                        ))}
                    </div>
                </ShowcaseWrapper>

                {/* 2. Ghost Pills with Icons */}
                <ShowcaseWrapper 
                    title="2. Ghost Pills (Icon-Focused)" 
                    description="Minimalist approach using icons for quick visual scanning."
                >
                    <div className="flex gap-2">
                        {options.map((opt) => (
                            <button
                                key={opt.id}
                                onClick={() => setActiveTab(opt.id)}
                                className={cn(
                                    "flex items-center gap-2 px-3 py-1.5 rounded-lg text-xs font-medium border transition-all duration-200",
                                    activeTab === opt.id 
                                        ? "bg-zinc-900 dark:bg-zinc-100 text-white dark:text-zinc-900 border-zinc-900 dark:border-zinc-100" 
                                        : "bg-transparent text-zinc-500 border-zinc-200 dark:border-zinc-800 hover:border-zinc-400 dark:hover:border-zinc-600"
                                )}
                            >
                                <opt.icon size={14} />
                                {opt.label}
                            </button>
                        ))}
                    </div>
                </ShowcaseWrapper>

                {/* 3. Dropdown Menu (Space Saving) */}
                <ShowcaseWrapper 
                    title="3. Inline Select (Clean)" 
                    description="Best for space efficiency. Uses the existing Select design system."
                >
                    <div className="flex items-center gap-3">
                        <span className="text-[10px] font-bold uppercase tracking-widest text-muted-foreground">Status:</span>
                        <div className="relative group">
                            <button className="flex items-center justify-between w-[200px] h-9 px-3 text-xs font-semibold bg-white dark:bg-zinc-900 border border-zinc-200 dark:border-zinc-800 rounded-lg hover:border-zinc-300 dark:hover:border-zinc-700 transition-all shadow-sm">
                                <span className="flex items-center gap-2">
                                    {options.find(o => o.id === activeTab)?.label}
                                </span>
                                <ChevronDown size={14} className="text-muted-foreground" />
                            </button>
                            {/* Mock Dropdown Shadow */}
                            <div className="absolute top-full left-0 mt-1 w-full p-1 bg-white dark:bg-zinc-900 border border-zinc-200 dark:border-zinc-800 rounded-lg shadow-xl opacity-0 scale-95 pointer-events-none group-hover:opacity-100 group-hover:scale-100 transition-all z-50">
                                {options.map(opt => (
                                    <div key={opt.id} className="flex items-center justify-between px-3 py-2 text-xs rounded-md hover:bg-zinc-50 dark:hover:bg-zinc-800 cursor-pointer">
                                        <span className="font-medium">{opt.label}</span>
                                        {activeTab === opt.id && <Check size={12} className="text-primary" />}
                                    </div>
                                ))}
                            </div>
                        </div>
                    </div>
                </ShowcaseWrapper>

                {/* 4. Tab Strip (Dash Style) */}
                <ShowcaseWrapper 
                    title="4. Underlined Tabs (Minimalist)" 
                    description="Subtle and integrated. Good for large page headers."
                >
                    <div className="flex gap-8 border-b border-zinc-100 dark:border-zinc-800 w-full">
                        {options.map((opt) => (
                            <button
                                key={opt.id}
                                onClick={() => setActiveTab(opt.id)}
                                className={cn(
                                    "pb-3 text-xs font-bold uppercase tracking-widest transition-all relative",
                                    activeTab === opt.id 
                                        ? "text-zinc-900 dark:text-zinc-100" 
                                        : "text-zinc-400 hover:text-zinc-600 dark:hover:text-zinc-300"
                                )}
                            >
                                {opt.label}
                                {activeTab === opt.id && (
                                    <div className="absolute bottom-0 left-0 w-full h-[2px] bg-indigo-500 animate-in fade-in slide-in-from-left-2" />
                                )}
                            </button>
                        ))}
                    </div>
                </ShowcaseWrapper>

                {/* 5. Modern Glass Cards */}
                <ShowcaseWrapper 
                    title="5. Status Badges (Visual Indicators)" 
                    description="Uses status dots and secondary backgrounds for a rich feel."
                >
                    <div className="bg-zinc-50 dark:bg-zinc-900/40 p-1.5 rounded-xl flex gap-1.5 border border-zinc-200/50 dark:border-zinc-800/50">
                        {options.map((opt) => (
                            <button
                                key={opt.id}
                                onClick={() => setActiveTab(opt.id)}
                                className={cn(
                                    "flex items-center gap-2 px-3 py-2 rounded-lg text-xs font-bold transition-all duration-300",
                                    activeTab === opt.id 
                                        ? "bg-white dark:bg-zinc-800 text-zinc-900 dark:text-zinc-100 shadow-[0_2px_10px_-4px_rgba(0,0,0,0.1)] ring-1 ring-black/5 dark:ring-white/5" 
                                        : "text-zinc-500 hover:text-zinc-700 dark:hover:text-zinc-300 hover:bg-white/50 dark:hover:bg-zinc-800/50"
                                )}
                            >
                                <div className={cn(
                                    "w-1.5 h-1.5 rounded-full shadow-sm",
                                    opt.id === 'all' && "bg-blue-400",
                                    opt.id === 'active' && "bg-emerald-500 shadow-emerald-500/50 animate-pulse",
                                    opt.id === 'inactive' && "bg-zinc-300 dark:bg-zinc-600"
                                )} />
                                {opt.label}
                            </button>
                        ))}
                    </div>
                </ShowcaseWrapper>

                {/* 6. Linear Style Indicator */}
                <ShowcaseWrapper 
                    title="6. Vertical Group (Compact Navigation)" 
                    description="Vertical orientation if the filter is placed in a sidebar."
                >
                    <div className="flex flex-col gap-0.5 w-[220px]">
                        {options.map((opt) => (
                            <button
                                key={opt.id}
                                onClick={() => setActiveTab(opt.id)}
                                className={cn(
                                    "flex items-center justify-between px-3 py-2 rounded-md text-xs font-medium transition-colors group",
                                    activeTab === opt.id 
                                        ? "bg-indigo-50 dark:bg-indigo-900/20 text-indigo-600 dark:text-indigo-400" 
                                        : "text-muted-foreground hover:bg-zinc-100 dark:hover:bg-zinc-800 hover:text-foreground"
                                )}
                            >
                                <span className="flex items-center gap-2">
                                    <opt.icon size={14} className={cn(activeTab === opt.id ? "text-indigo-500" : "text-muted-foreground group-hover:text-zinc-500")} />
                                    {opt.label}
                                </span>
                                {activeTab === opt.id && <div className="w-1 h-3 rounded-full bg-indigo-500" />}
                            </button>
                        ))}
                    </div>
                </ShowcaseWrapper>
                
                {/* 7. Icon-Only Toggle (Compact) */}
                <ShowcaseWrapper 
                    title="7. Icon-Only Toggle (Ultra Compact)" 
                    description="Extremely space-efficient, relies on tooltips (implied) for context."
                >
                     <div className="bg-white dark:bg-zinc-800 border border-zinc-200 dark:border-zinc-700 rounded-lg p-1 flex gap-1 shadow-sm">
                        {options.map((opt) => (
                            <button
                                key={opt.id}
                                onClick={() => setActiveTab(opt.id)}
                                className={cn(
                                    "p-2 rounded-md transition-all duration-200",
                                    activeTab === opt.id 
                                        ? "bg-zinc-100 dark:bg-zinc-700 text-foreground" 
                                        : "text-muted-foreground hover:text-foreground hover:bg-zinc-50 dark:hover:bg-zinc-700/50"
                                )}
                                title={opt.label}
                            >
                                <opt.icon size={16} />
                            </button>
                        ))}
                    </div>
                </ShowcaseWrapper>

                {/* 8. Minimal Text Link */}
                <ShowcaseWrapper 
                    title="8. Text Links (Subtle)" 
                    description="Very lightweight, blends into page background."
                >
                    <div className="flex items-center gap-4 text-xs font-medium bg-zinc-50 dark:bg-zinc-900/50 px-4 py-2 rounded-full border border-zinc-100 dark:border-zinc-800/50">
                        {options.map((opt) => (
                            <button
                                key={opt.id}
                                onClick={() => setActiveTab(opt.id)}
                                className={cn(
                                    "transition-colors hover:text-foreground",
                                    activeTab === opt.id 
                                        ? "text-foreground font-bold underline decoration-2 decoration-indigo-500 underline-offset-4" 
                                        : "text-muted-foreground"
                                )}
                            >
                                {opt.label.split(' ')[0]} {/* Shortened label */}
                            </button>
                        ))}
                    </div>
                </ShowcaseWrapper>
                
                {/* 9. Floating Action Button Style (FAB) */}
                <ShowcaseWrapper 
                    title="9. Split FAB (Playful)" 
                    description="A primary action button that expands to show options."
                >
                    <div className="flex items-center gap-2">
                         <button className="flex items-center gap-2 px-4 py-2 bg-indigo-600 hover:bg-indigo-700 text-white rounded-full shadow-lg shadow-indigo-500/30 transition-all active:scale-95">
                            <span className="text-xs font-bold uppercase tracking-wide">
                                {activeTab === 'all' ? 'Filtering: All' : activeTab === 'active' ? 'Active Only' : 'Inactive Only'}
                            </span>
                            <div className="w-[1px] h-3 bg-white/30" />
                            <ChevronDown size={14} />
                        </button>
                    </div>
                </ShowcaseWrapper>

                {/* 10. Dot Indicators (Data Dense) */}
                <ShowcaseWrapper 
                    title="10. Dot Indicators (Data Dense)" 
                    description="Good for table headers or dense toolbars."
                >
                    <div className="flex items-center bg-white dark:bg-zinc-900 border border-zinc-200 dark:border-zinc-700 rounded-md overflow-hidden divide-x divide-zinc-200 dark:divide-zinc-700 shadow-sm h-8">
                         {options.map((opt) => (
                            <button
                                key={opt.id}
                                onClick={() => setActiveTab(opt.id)}
                                className={cn(
                                    "px-3 h-full flex items-center gap-2 text-[10px] font-bold uppercase transition-colors hover:bg-zinc-50 dark:hover:bg-zinc-800",
                                    activeTab === opt.id ? "bg-zinc-50 dark:bg-zinc-800 text-foreground" : "text-muted-foreground"
                                )}
                            >
                                <div className={cn(
                                    "w-2 h-2 rounded-full",
                                    opt.id === 'all' && "bg-gray-400",
                                    opt.id === 'active' && "bg-emerald-500",
                                    opt.id === 'inactive' && "bg-rose-500"
                                )} />
                                {activeTab === opt.id && <span>{opt.label.split(' ')[0]}</span>}
                            </button>
                        ))}
                    </div>
                </ShowcaseWrapper>

                {/* 11. Neumorphic (Soft) */}
                <ShowcaseWrapper 
                    title="11. Neumorphic (Soft Press)" 
                    description="Tactile feeing, pressed state for active selection."
                >
                    <div className="flex gap-3 bg-[#f0f2f5] dark:bg-zinc-900 p-4 rounded-xl items-center justify-center">
                         {options.map((opt) => (
                            <button
                                key={opt.id}
                                onClick={() => setActiveTab(opt.id)}
                                className={cn(
                                    "w-10 h-10 rounded-lg flex items-center justify-center transition-all duration-300",
                                    activeTab === opt.id 
                                        ? "shadow-[inset_4px_4px_8px_rgba(0,0,0,0.1),inset_-4px_-4px_8px_rgba(255,255,255,0.8)] dark:shadow-[inset_2px_2px_4px_rgba(0,0,0,0.5)] text-indigo-600 dark:text-indigo-400" 
                                        : "shadow-[4px_4px_8px_rgba(0,0,0,0.05),-4px_-4px_8px_rgba(255,255,255,0.8)] dark:shadow-none bg-white dark:bg-zinc-800 text-zinc-400 hover:text-zinc-600"
                                )}
                            >
                                <opt.icon size={18} />
                            </button>
                        ))}
                    </div>
                </ShowcaseWrapper>
                
                {/* 12. Slider Switch (iOS Toggle) */}
                <ShowcaseWrapper 
                    title="12. Slider Switch (Binary Focus)" 
                    description="Best if 'All' is default and you mostly toggle one state."
                >
                    <div className="flex items-center gap-3 bg-zinc-100 dark:bg-zinc-800 rounded-full p-1 pl-4 h-9 w-fit">
                        <span className="text-xs font-semibold text-muted-foreground">Show Active Only</span>
                        <button 
                            onClick={() => setActiveTab(activeTab === 'active' ? 'all' : 'active')}
                            className={cn(
                                "w-12 h-7 rounded-full transition-colors relative",
                                activeTab === 'active' ? "bg-emerald-500" : "bg-zinc-300 dark:bg-zinc-600"
                            )}
                        >
                            <div className={cn(
                                "absolute top-1 w-5 h-5 bg-white rounded-full shadow-sm transition-transform duration-200",
                                activeTab === 'active' ? "left-6" : "left-1"
                            )} />
                        </button>
                    </div>
                </ShowcaseWrapper>
            </div>
            
            <div className="mt-12 p-8 rounded-2xl bg-gradient-to-br from-indigo-500/5 via-purple-500/5 to-pink-500/5 border border-indigo-100 dark:border-indigo-900/30 flex items-center justify-between">
                <div className="space-y-1">
                    <h3 className="font-bold text-indigo-900 dark:text-indigo-300">Design Note</h3>
                    <p className="text-sm text-indigo-700/70 dark:text-indigo-400/70">
                        Design #1 & #5 provide the best visibility for current selection while Design #3 is best for maintaining a clean, empty UI when no filter is applied.
                    </p>
                </div>
                <div className="flex items-center -space-x-3">
                    {[1, 2, 3, 4].map(i => (
                        <div key={i} className="w-10 h-10 rounded-full border-2 border-white dark:border-zinc-900 bg-zinc-200 dark:bg-zinc-800" />
                    ))}
                </div>
            </div>
        </div>
    );
};
