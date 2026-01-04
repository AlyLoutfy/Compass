import { 
    Plus, Search, ChevronDown
} from 'lucide-react';
import { cn } from '@/lib/utils';
import { Button } from '@/components/ui/Button';

// --- Shared Components ---

const Separator = ({ className }: { className?: string }) => (
    <div className={cn("h-6 w-[1px] bg-zinc-200 dark:bg-zinc-800 mx-2 shrink-0 hidden sm:block", className)} />
);

const Title = () => (
    <div className="px-3 shrink-0 font-bold text-lg tracking-tight">Ideas</div>
);

const ToolbarWrapper = ({ children, className }: { children: React.ReactNode, className?: string }) => (
    <div className={cn(
        "w-full flex items-center p-1.5 border border-zinc-200 dark:border-zinc-800 rounded-xl bg-white dark:bg-zinc-950 gap-2 shadow-sm overflow-x-auto no-scrollbar",
        className
    )}>
        {children}
    </div>
);

const TotalCount = () => (
    <div className="hidden lg:flex items-center text-xs text-muted-foreground font-medium shrink-0 mr-2">
        <span className="text-foreground font-bold mr-1">30</span> Ideas
    </div>
);

const NewIdeaButton = () => (
    <Button size="sm" className="h-8 text-xs shrink-0 rounded-lg"><Plus size={14} className="mr-1.5" /> New Idea</Button>
);

// --- Layout Template ---
// Title | Divider | Search | Spacer | Total | Filters | Divider | Button

const DesignSection = ({ title, description, children }: { title: string, description: string, children: React.ReactNode }) => (
    <div className="space-y-3">
        <div className="flex items-baseline justify-between border-b border-dashed border-zinc-200 dark:border-zinc-800 pb-2">
            <h3 className="text-sm font-semibold text-zinc-900 dark:text-zinc-100">{title}</h3>
            <span className="text-xs text-zinc-500 font-medium">{description}</span>
        </div>
        <div className="p-6 bg-zinc-50/50 dark:bg-zinc-900/50 rounded-xl border border-dashed border-zinc-200/50 dark:border-zinc-800/50">
            {children}
        </div>
    </div>
);

export const HeaderDesignsShowcase = () => {
    return (
        <div className="space-y-12 max-w-5xl mx-auto pb-20">
            
            {/* 1. Standard (Default) */}
            <DesignSection title="1. Standard (Current Inset)" description="Inset search background, dashed border filters.">
                <ToolbarWrapper>
                    <Title />
                    <Separator className="mx-1" />
                    
                    {/* Search */}
                    <div className="flex items-center gap-2 px-3 w-full sm:w-[280px] lg:w-[320px] shrink-0 bg-zinc-100/50 dark:bg-zinc-900/50 border border-zinc-200 dark:border-zinc-800 rounded-lg h-9 transition-colors focus-within:bg-zinc-100 dark:focus-within:bg-zinc-900">
                        <Search className="w-4 h-4 text-muted-foreground shrink-0" />
                        <input className="flex-1 bg-transparent border-none outline-none text-sm placeholder:text-muted-foreground/70 h-full w-full" placeholder="Search ideas..." />
                        <kbd className="hidden sm:inline-flex h-5 select-none items-center gap-1 rounded border border-zinc-200 dark:border-zinc-800 bg-white dark:bg-zinc-950 px-1.5 font-mono text-[10px] font-medium text-muted-foreground shadow-sm"><span className="text-xs">⌘</span>K</kbd>
                    </div>

                    <div className="flex-1" />
                    <TotalCount />

                    {/* Filters */}
                    <div className="flex items-center gap-1.5">
                        <button className="h-8 flex items-center justify-between text-xs font-medium border border-dashed border-zinc-300 dark:border-zinc-700 rounded-md px-2.5 w-[130px] shadow-sm hover:bg-zinc-50 dark:hover:bg-zinc-900 text-foreground">
                            <span>Priority: All</span> <ChevronDown size={12} className="opacity-50" />
                        </button>
                        <button className="h-8 flex items-center justify-between text-xs font-medium border border-dashed border-zinc-300 dark:border-zinc-700 rounded-md px-2.5 w-[140px] shadow-sm hover:bg-zinc-50 dark:hover:bg-zinc-900 text-foreground">
                            <span>Category: All</span> <ChevronDown size={12} className="opacity-50" />
                        </button>
                    </div>

                    <Separator className="mx-2" />
                    <NewIdeaButton />
                </ToolbarWrapper>
            </DesignSection>


            {/* 2. Ghost / Minimalist */}
            <DesignSection title="2. Ghost Minimal" description="Transparent backgrounds, hover effects mainly. Very clean.">
                <ToolbarWrapper>
                    <Title />
                    <Separator className="mx-1 opacity-50" />
                    
                    {/* Search */}
                    <div className="flex items-center gap-2 px-2 w-[280px] h-9 hover:bg-zinc-100 dark:hover:bg-zinc-900 rounded-md transition-colors group">
                        <Search className="w-4 h-4 text-muted-foreground group-focus-within:text-foreground transition-colors" />
                        <input className="flex-1 bg-transparent border-none outline-none text-sm placeholder:text-muted-foreground/70 h-full" placeholder="Search ideas..." />
                    </div>

                    <div className="flex-1" />
                    <TotalCount />

                    {/* Filters */}
                    <div className="flex items-center gap-1">
                         <button className="h-8 flex items-center gap-2 text-xs font-medium text-muted-foreground hover:text-foreground hover:bg-zinc-100 dark:hover:bg-zinc-900 px-3 rounded-md transition-colors">
                            Priority <ChevronDown size={12} />
                        </button>
                        <button className="h-8 flex items-center gap-2 text-xs font-medium text-muted-foreground hover:text-foreground hover:bg-zinc-100 dark:hover:bg-zinc-900 px-3 rounded-md transition-colors">
                            Category <ChevronDown size={12} />
                        </button>
                    </div>

                    <Separator className="mx-2" />
                    <NewIdeaButton />
                </ToolbarWrapper>
            </DesignSection>


            {/* 3. Solid Pills */}
            <DesignSection title="3. Solid Pills" description="Rounded-full shapes and solid backgrounds for clear separation.">
                <ToolbarWrapper className="rounded-full px-2 py-1.5">
                    <div className="px-4 font-bold text-lg">Ideas</div>
                    <div className="h-6 w-[1px] bg-zinc-200 dark:bg-zinc-800 mx-1" />
                    
                    {/* Search */}
                    <div className="flex items-center gap-2 px-4 w-[280px] bg-zinc-100 dark:bg-zinc-900 rounded-full h-9 border border-transparent focus-within:border-zinc-300 dark:focus-within:border-zinc-700 focus-within:bg-white dark:focus-within:bg-black transition-all">
                        <Search className="w-4 h-4 text-zinc-500" />
                        <input className="flex-1 bg-transparent border-none outline-none text-sm h-full" placeholder="Search..." />
                    </div>

                    <div className="flex-1" />
                    
                    {/* Filters */}
                    <div className="flex items-center gap-2 mr-2">
                        <button className="h-8 flex items-center px-4 bg-zinc-100 dark:bg-zinc-900 hover:bg-zinc-200 dark:hover:bg-zinc-800 rounded-full text-xs font-medium transition-colors">
                            Priority
                        </button>
                         <button className="h-8 flex items-center px-4 bg-zinc-100 dark:bg-zinc-900 hover:bg-zinc-200 dark:hover:bg-zinc-800 rounded-full text-xs font-medium transition-colors">
                            Category
                        </button>
                    </div>

                    <Button size="sm" className="h-9 px-5 rounded-full text-xs">New Idea</Button>
                </ToolbarWrapper>
            </DesignSection>


            {/* 4. Tech / Monospace */}
            <DesignSection title="4. Tech Mono" description="Sharp corners and monospace fonts for a developer-centric feel.">
                <div className="w-full flex items-center p-1 border border-zinc-800 dark:border-zinc-700 bg-zinc-950 text-white gap-2 shadow-sm font-mono rounded-none">
                    <div className="px-3 font-bold text-lg tracking-tight">IDEAS_BOARD</div>
                    <div className="h-6 w-[1px] bg-zinc-800" />
                    
                    {/* Search */}
                    <div className="flex items-center gap-2 px-3 w-[260px] bg-black border border-zinc-800 h-9">
                        <span className="text-zinc-500">&gt;</span>
                        <input className="flex-1 bg-transparent border-none outline-none text-sm text-zinc-300 h-full font-mono placeholder:text-zinc-700" placeholder="grep search..." />
                    </div>

                    <div className="flex-1" />
                    <div className="text-xs text-zinc-500 mr-4">COUNT:30</div>

                    {/* Filters */}
                    <div className="flex items-center gap-[-1px]">
                        <button className="h-9 flex items-center justify-between text-xs border border-zinc-800 bg-zinc-900 px-4 hover:bg-zinc-800 transition-colors uppercase">
                            PRIORITY
                        </button>
                        <button className="h-9 flex items-center justify-between text-xs border border-zinc-800 bg-zinc-900 px-4 hover:bg-zinc-800 transition-colors uppercase ml-[-1px]">
                            CATEGORY
                        </button>
                    </div>

                    <Button size="sm" className="h-9 rounded-none border border-zinc-700 bg-zinc-100 text-black hover:bg-zinc-300 text-xs font-bold px-6">ADD_NEW</Button>
                </div>
            </DesignSection>


            {/* 5. Underlined / Tab Style */}
            <DesignSection title="5. Underlined" description="Filters look like tabs, search is a simple line.">
                <ToolbarWrapper className="border-b border-t-0 border-x-0 border-zinc-200 dark:border-zinc-800 rounded-none shadow-none bg-transparent px-0">
                    <Title />
                    <div className="h-6 w-[1px] bg-zinc-200 dark:bg-zinc-800 mx-4" />
                    
                    {/* Search */}
                    <div className="flex items-center gap-2 w-[240px] border-b border-zinc-300 dark:border-zinc-700 h-8 focus-within:border-primary transition-colors">
                        <Search className="w-4 h-4 text-muted-foreground" />
                        <input className="flex-1 bg-transparent border-none outline-none text-sm h-full" placeholder="Type to search..." />
                    </div>

                    <div className="flex-1" />

                    {/* Filters */}
                    <div className="flex items-center gap-6 mr-6">
                        <button className="h-10 text-sm font-medium text-foreground border-b-2 border-primary">All Priorities</button>
                        <button className="h-10 text-sm font-medium text-muted-foreground hover:text-foreground border-b-2 border-transparent transition-colors">Categories</button>
                    </div>

                    <NewIdeaButton />
                </ToolbarWrapper>
            </DesignSection>


            {/* 6. Soft Pastel */}
            <DesignSection title="6. Soft Pastel" description="Approachable and friendly with soft colored backgrounds.">
                <ToolbarWrapper>
                    <Title />
                    <Separator className="mx-1" />
                    
                    {/* Search */}
                    <div className="flex items-center gap-2 px-3 w-[260px] bg-blue-50/50 dark:bg-blue-900/10 text-blue-900 dark:text-blue-100 rounded-lg h-9 hover:bg-blue-50 dark:hover:bg-blue-900/20 transition-colors">
                        <Search className="w-4 h-4 opacity-50" />
                        <input className="flex-1 bg-transparent border-none outline-none text-sm placeholder:text-blue-400 dark:placeholder:text-blue-700 h-full" placeholder="Search..." />
                    </div>

                    <div className="flex-1" />

                    {/* Filters */}
                    <div className="flex items-center gap-2">
                        <button className="h-8 flex items-center gap-2 px-3 bg-indigo-50 dark:bg-indigo-900/20 text-indigo-700 dark:text-indigo-300 text-xs font-semibold rounded-lg hover:bg-indigo-100 transition-colors">
                            Priority <ChevronDown size={12} />
                        </button>
                        <button className="h-8 flex items-center gap-2 px-3 bg-purple-50 dark:bg-purple-900/20 text-purple-700 dark:text-purple-300 text-xs font-semibold rounded-lg hover:bg-purple-100 transition-colors">
                            Category <ChevronDown size={12} />
                        </button>
                    </div>

                    <Separator className="mx-2" />
                    <NewIdeaButton />
                </ToolbarWrapper>
            </DesignSection>


             {/* 7. Outlined/Structured */}
             <DesignSection title="7. Outlined Structured" description="Heavy borders for everything, distinct definition.">
                <ToolbarWrapper>
                    <Title />
                    <Separator className="mx-1" />
                    
                    {/* Search */}
                    <div className="flex items-center gap-2 px-3 w-[280px] bg-white dark:bg-zinc-950 border-2 border-zinc-200 dark:border-zinc-800 rounded-lg h-9 focus-within:border-zinc-400 dark:focus-within:border-zinc-600 transition-colors">
                        <Search className="w-4 h-4 text-zinc-400" />
                        <input className="flex-1 bg-transparent border-none outline-none text-sm font-medium h-full" placeholder="Search ideas..." />
                    </div>

                    <div className="flex-1" />

                    {/* Filters */}
                    <div className="flex items-center gap-2">
                        <button className="h-9 flex items-center justify-between px-3 w-[120px] bg-white dark:bg-zinc-950 border-2 border-zinc-200 dark:border-zinc-800 rounded-lg text-xs font-bold hover:border-zinc-400 transition-colors">
                            Priority <ChevronDown size={12} />
                        </button>
                        <button className="h-9 flex items-center justify-between px-3 w-[120px] bg-white dark:bg-zinc-950 border-2 border-zinc-200 dark:border-zinc-800 rounded-lg text-xs font-bold hover:border-zinc-400 transition-colors">
                            Category <ChevronDown size={12} />
                        </button>
                    </div>

                    <Separator className="mx-2" />
                    <NewIdeaButton />
                </ToolbarWrapper>
            </DesignSection>


            {/* 8. Floating / Elevated */}
            <DesignSection title="8. Floating Elements" description="Individual elements have shadows, toolbar container is subtle.">
                <div className="w-full flex items-center px-2 py-2 gap-3 bg-zinc-50/50 dark:bg-zinc-900/20 rounded-xl">
                    <Title />
                    
                     {/* Search */}
                     <div className="flex items-center gap-2 px-3 w-[280px] bg-white dark:bg-zinc-900 rounded-lg h-10 shadow-sm border border-zinc-100 dark:border-zinc-800 hover:shadow-md transition-shadow">
                        <Search className="w-4 h-4 text-muted-foreground" />
                        <input className="flex-1 bg-transparent border-none outline-none text-sm h-full" placeholder="Search..." />
                    </div>

                    <div className="flex-1" />

                    {/* Filters */}
                    <div className="flex items-center gap-2 bg-white dark:bg-zinc-900 p-1 rounded-lg border border-zinc-100 dark:border-zinc-800 shadow-sm">
                        <button className="h-8 px-3 hover:bg-zinc-100 dark:hover:bg-zinc-800 rounded-md text-xs font-medium transition-colors">
                            Priority
                        </button>
                        <div className="h-4 w-[1px] bg-zinc-200 dark:bg-zinc-700" />
                        <button className="h-8 px-3 hover:bg-zinc-100 dark:hover:bg-zinc-800 rounded-md text-xs font-medium transition-colors">
                            Category
                        </button>
                    </div>

                    <div className="h-6 w-[1px] bg-zinc-200 dark:bg-zinc-800 mx-1" />
                    <Button size="sm" className="h-10 text-xs shadow-md">New Idea</Button>
                </div>
            </DesignSection>


            {/* 9. Glassmorphism */}
            <DesignSection title="9. Glassmorphism" description="Frosted glass effect (backdrop-blur) for modern aesthetics.">
                <div className="w-full flex items-center p-1.5 rounded-xl bg-white/40 dark:bg-black/40 backdrop-blur-md border border-white/20 shadow-lg ring-1 ring-black/5 gap-2">
                    <Title />
                    <div className="h-6 w-[1px] bg-black/10 mx-1" />

                    {/* Search */}
                     <div className="flex items-center gap-2 px-3 w-[260px] bg-white/50 dark:bg-white/10 rounded-lg h-9 border border-white/20">
                        <Search className="w-4 h-4 text-muted-foreground" />
                        <input className="flex-1 bg-transparent border-none outline-none text-sm h-full" placeholder="Search..." />
                    </div>

                    <div className="flex-1" />

                    {/* Filters */}
                    <div className="flex items-center gap-2">
                        <button className="h-9 px-4 bg-white/50 dark:bg-white/5 hover:bg-white/80 dark:hover:bg-white/10 border border-white/20 rounded-lg text-xs font-medium backdrop-blur-sm transition-all">
                            Priority
                        </button>
                        <button className="h-9 px-4 bg-white/50 dark:bg-white/5 hover:bg-white/80 dark:hover:bg-white/10 border border-white/20 rounded-lg text-xs font-medium backdrop-blur-sm transition-all">
                            Category
                        </button>
                    </div>

                    <Separator className="mx-2 bg-black/10" />
                    <Button size="sm" className="h-9 text-xs bg-black/80 text-white hover:bg-black">New Idea</Button>
                </div>
            </DesignSection>


            {/* 10. Tag / Badge Style */}
            <DesignSection title="10. Tag Badge Style" description="Filters look like removable tags/badges.">
                <ToolbarWrapper>
                    <Title />
                    <Separator className="mx-1" />
                    
                    {/* Search */}
                    <div className="flex items-center gap-2 px-2 border-b-2 border-zinc-100 dark:border-zinc-800 w-[240px] focus-within:border-zinc-400 h-9 transition-colors">
                        <Search className="w-4 h-4 text-zinc-400" />
                        <input className="flex-1 bg-transparent border-none outline-none text-sm h-full" placeholder="Search..." />
                    </div>

                    <div className="flex-1" />

                    {/* Filters */}
                    <div className="flex items-center gap-2">
                        <div className="flex items-center gap-1.5 px-3 py-1 bg-orange-100 dark:bg-orange-900/30 text-orange-800 dark:text-orange-200 rounded-full text-xs font-bold border border-orange-200 dark:border-orange-900/50 cursor-pointer">
                            <span>Priority</span>
                            <ChevronDown size={10} />
                        </div>
                        <div className="flex items-center gap-1.5 px-3 py-1 bg-teal-100 dark:bg-teal-900/30 text-teal-800 dark:text-teal-200 rounded-full text-xs font-bold border border-teal-200 dark:border-teal-900/50 cursor-pointer">
                            <span>Category</span>
                            <ChevronDown size={10} />
                        </div>
                    </div>

                    <Separator className="mx-2" />
                    <NewIdeaButton />
                </ToolbarWrapper>
            </DesignSection>

        </div>
    );
};

export default HeaderDesignsShowcase;
