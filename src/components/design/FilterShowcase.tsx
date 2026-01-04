import { ChevronDown, Circle, SlidersHorizontal, Tag } from 'lucide-react';

const FilterWrapper = ({ title, children }: { title: string, children: React.ReactNode }) => (
    <div className="flex flex-col gap-3 p-6 border border-zinc-200 dark:border-zinc-800 rounded-xl bg-white dark:bg-zinc-950/50">
        <h3 className="text-xs font-semibold text-muted-foreground uppercase tracking-wider">{title}</h3>
        <div className="flex items-center gap-3 flex-wrap">
            {children}
        </div>
    </div>
);

export const FilterShowcase = () => {
    return (
        <div className="space-y-8 max-w-4xl mx-auto pb-20">
            <h2 className="text-2xl font-bold tracking-tight">Filter Design Variations</h2>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">

                {/* 1. Standard Dashed (Current) */}
                <FilterWrapper title="1. Standard Dashed (Current)">
                    <button className="flex items-center gap-2 px-3 py-1.5 text-xs font-medium border border-dashed border-zinc-300 dark:border-zinc-700 rounded-md text-zinc-600 dark:text-zinc-400 hover:bg-zinc-50 dark:hover:bg-zinc-900 transition-colors">
                        <span className="opacity-70">Priority:</span>
                        <span className="text-foreground">All</span>
                        <ChevronDown size={12} className="opacity-50" />
                    </button>
                    <button className="flex items-center gap-2 px-3 py-1.5 text-xs font-medium border border-dashed border-zinc-300 dark:border-zinc-700 rounded-md text-zinc-600 dark:text-zinc-400 hover:bg-zinc-50 dark:hover:bg-zinc-900 transition-colors">
                        <span className="opacity-70">Category:</span>
                        <span className="text-foreground">Feature</span>
                        <ChevronDown size={12} className="opacity-50" />
                    </button>
                </FilterWrapper>

                {/* 2. Solid Pill */}
                <FilterWrapper title="2. Solid Pill">
                    <button className="flex items-center gap-2 px-3 py-1.5 text-xs font-medium bg-zinc-100 dark:bg-zinc-800 rounded-full text-zinc-700 dark:text-zinc-300 hover:bg-zinc-200 dark:hover:bg-zinc-700 transition-colors">
                        <span>Priority: All</span>
                        <ChevronDown size={12} className="opacity-50" />
                    </button>
                    <button className="flex items-center gap-2 px-3 py-1.5 text-xs font-medium bg-zinc-100 dark:bg-zinc-800 rounded-full text-zinc-700 dark:text-zinc-300 hover:bg-zinc-200 dark:hover:bg-zinc-700 transition-colors">
                        <span>Category: Bug</span>
                        <ChevronDown size={12} className="opacity-50" />
                    </button>
                </FilterWrapper>

                {/* 3. Outline Pill */}
                <FilterWrapper title="3. Outline Pill">
                    <button className="flex items-center gap-2 px-3 py-1.5 text-xs font-medium border border-zinc-200 dark:border-zinc-800 rounded-full text-zinc-600 dark:text-zinc-400 hover:border-zinc-300 dark:hover:border-zinc-700 hover:bg-zinc-50 dark:hover:bg-zinc-900 transition-all">
                        <span>Priority</span>
                        <span className="w-[1px] h-3 bg-zinc-200 dark:bg-zinc-800" />
                        <span className="text-foreground">High</span>
                        <ChevronDown size={12} className="opacity-50" />
                    </button>
                     <button className="flex items-center gap-2 px-3 py-1.5 text-xs font-medium border border-zinc-200 dark:border-zinc-800 rounded-full text-zinc-600 dark:text-zinc-400 hover:border-zinc-300 dark:hover:border-zinc-700 hover:bg-zinc-50 dark:hover:bg-zinc-900 transition-all">
                        <span>Status</span>
                        <span className="w-[1px] h-3 bg-zinc-200 dark:bg-zinc-800" />
                        <span className="text-foreground">Open</span>
                        <ChevronDown size={12} className="opacity-50" />
                    </button>
                </FilterWrapper>

                {/* 4. Tag Style */}
                <FilterWrapper title="4. Tag Style">
                    <button className="flex items-center gap-2 px-2 py-1 text-xs font-medium border border-transparent hover:bg-zinc-100 dark:hover:bg-zinc-800 rounded-md transition-colors">
                        <div className="w-2 h-2 rounded-full bg-red-500" />
                        <span className="text-zinc-600 dark:text-zinc-400">High Priority</span>
                    </button>
                    <button className="flex items-center gap-2 px-2 py-1 text-xs font-medium border border-transparent hover:bg-zinc-100 dark:hover:bg-zinc-800 rounded-md transition-colors">
                        <div className="w-2 h-2 rounded-full bg-blue-500" />
                        <span className="text-zinc-600 dark:text-zinc-400">Features</span>
                    </button>
                </FilterWrapper>

                {/* 5. Ghost Minimal */}
                <FilterWrapper title="5. Ghost Minimal">
                    <button className="flex items-center gap-1.5 px-2 py-1 text-xs font-medium text-muted-foreground hover:text-foreground hover:bg-zinc-100 dark:hover:bg-zinc-800 rounded-md transition-colors">
                        <SlidersHorizontal size={12} />
                        <span>Priority: All</span>
                    </button>
                    <button className="flex items-center gap-1.5 px-2 py-1 text-xs font-medium text-muted-foreground hover:text-foreground hover:bg-zinc-100 dark:hover:bg-zinc-800 rounded-md transition-colors">
                        <Tag size={12} />
                        <span>Category: Feature</span>
                    </button>
                </FilterWrapper>

                {/* 6. Floating / Elevated */}
                <FilterWrapper title="6. Floating / Elevated">
                    <button className="flex items-center gap-2 px-3 py-1.5 text-xs font-medium bg-white dark:bg-zinc-900 border border-zinc-100 dark:border-zinc-800 shadow-sm rounded-lg hover:shadow transition-shadow">
                        <span className="text-muted-foreground">Priority</span>
                        <span className="bg-zinc-100 dark:bg-zinc-800 px-1.5 py-0.5 rounded text-[10px] font-bold text-foreground">ALL</span>
                        <ChevronDown size={10} className="text-muted-foreground" />
                    </button>
                     <button className="flex items-center gap-2 px-3 py-1.5 text-xs font-medium bg-white dark:bg-zinc-900 border border-zinc-100 dark:border-zinc-800 shadow-sm rounded-lg hover:shadow transition-shadow">
                        <span className="text-muted-foreground">Category</span>
                        <span className="bg-blue-50 dark:bg-blue-900/20 text-blue-600 dark:text-blue-400 px-1.5 py-0.5 rounded text-[10px] font-bold">FEAT</span>
                        <ChevronDown size={10} className="text-muted-foreground" />
                    </button>
                </FilterWrapper>

                {/* 7. Split Button (Mini Toolbar) */}
                <FilterWrapper title="7. Split Button">
                    <div className="flex items-center border border-zinc-200 dark:border-zinc-800 rounded-md overflow-hidden h-7">
                        <div className="px-2.5 py-1 text-[10px] font-semibold bg-zinc-50 dark:bg-zinc-900 text-muted-foreground border-r border-zinc-200 dark:border-zinc-800">
                            PRIORITY
                        </div>
                        <button className="px-2.5 py-1 text-xs font-medium hover:bg-zinc-50 dark:hover:bg-zinc-900 transition-colors flex items-center gap-1">
                            High <ChevronDown size={10} />
                        </button>
                    </div>
                </FilterWrapper>

                {/* 8. Icon + Value */}
                <FilterWrapper title="8. Icon + Value">
                     <button className="flex items-center gap-2 px-3 py-1.5 text-xs font-medium border border-zinc-200 dark:border-zinc-800 rounded-md text-zinc-600 dark:text-zinc-400 hover:border-zinc-300 dark:hover:border-zinc-700 transition-colors">
                        <Circle size={10} className="text-red-500 fill-current" />
                        <span>High Priority</span>
                        <ChevronDown size={10} className="opacity-50 ml-1" />
                    </button>
                </FilterWrapper>

                {/* 9. Underlined */}
                <FilterWrapper title="9. Underlined">
                    <div className="flex items-center gap-4">
                        <button className="group flex items-center gap-1 text-xs font-medium text-foreground relative py-1">
                            <span className="text-muted-foreground group-hover:text-foreground transition-colors">Priority:</span>
                            <span>All</span>
                            <span className="absolute bottom-0 left-0 w-full h-[1px] bg-zinc-200 dark:bg-zinc-800 group-hover:bg-foreground transition-colors" />
                        </button>
                        <button className="group flex items-center gap-1 text-xs font-medium text-foreground relative py-1">
                            <span className="text-muted-foreground group-hover:text-foreground transition-colors">Category:</span>
                            <span>Feature</span>
                            <span className="absolute bottom-0 left-0 w-full h-[1px] bg-zinc-200 dark:bg-zinc-800 group-hover:bg-foreground transition-colors" />
                        </button>
                    </div>
                </FilterWrapper>

                {/* 10. Status Indicator (Dot) */}
                <FilterWrapper title="10. Status Dot">
                    <button className="pl-1.5 pr-3 py-1.5 text-xs font-medium border border-zinc-200 dark:border-zinc-800 rounded-full flex items-center gap-2 hover:bg-zinc-50 dark:hover:bg-zinc-900 transition-colors">
                        <span className="relative flex h-2.5 w-2.5">
                          <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-orange-400 opacity-75"></span>
                          <span className="relative inline-flex rounded-full h-2.5 w-2.5 bg-orange-500"></span>
                        </span>
                        <span>Priority: Critical</span>
                    </button>
                </FilterWrapper>

            </div>
        </div>
    );
};
