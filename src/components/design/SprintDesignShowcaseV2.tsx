import { Badge } from '@/components/ui/Badge';
import { Button } from '@/components/ui/Button';
import { Calendar, CheckCircle2, Trophy, PieChart, Clock, ArrowRight } from 'lucide-react';
import { cn } from '@/lib/utils';

// Common Stats
const stats = {
    done: 8,
    total: 12,
    percentage: 67,
    startDate: "Oct 12",
    endDate: "Oct 26"
};

// 11. The "Command Bar" (Linear & Compact)
const CommandBarSprint = () => (
    <div className="group border border-zinc-200 dark:border-zinc-800 bg-white dark:bg-zinc-900 p-2 pl-4 rounded-full shadow-sm flex items-center justify-between gap-4 hover:shadow-md transition-all">
        <div className="flex items-center gap-4">
            <div className="flex flex-col">
                <span className="font-bold text-sm">Sprint 35: Growth</span>
                <div className="flex items-center gap-2 text-xs text-zinc-500">
                    <span className="font-mono">{stats.done}/{stats.total} done</span>
                    <span className="w-1 h-1 bg-zinc-300 rounded-full" />
                    <button className="hover:text-zinc-900 dark:hover:text-zinc-300 hover:underline flex items-center gap-1">
                        {stats.startDate} - {stats.endDate}
                    </button>
                </div>
            </div>
        </div>
        
        <div className="flex items-center gap-2 pr-1">
             <div className="w-24 h-2 bg-zinc-100 dark:bg-zinc-800 rounded-full overflow-hidden hidden sm:block">
                <div className="h-full bg-zinc-900 dark:bg-zinc-100" style={{ width: `${stats.percentage}%` }} />
             </div>
             <Button size="sm" className="rounded-full h-8 px-4 text-xs">
                Complete Sprint
             </Button>
        </div>
    </div>
);

// 12. The "Dashboard Widget" (Boxy)
const DashboardSprint = () => (
    <div className="bg-zinc-50 dark:bg-zinc-900/50 border border-zinc-200 dark:border-zinc-800 rounded-xl p-5 space-y-4">
        <div className="flex items-start justify-between">
            <div>
                <Badge variant="outline" className="bg-white dark:bg-zinc-900 mb-2">Active Sprint</Badge>
                <h3 className="text-xl font-bold">Sprint 35</h3>
            </div>
            <Button variant="outline" size="sm" className="bg-white dark:bg-zinc-900">
                <Calendar className="mr-2 h-3.5 w-3.5 text-zinc-500" />
                {stats.startDate} - {stats.endDate}
            </Button>
        </div>
        
        <div className="grid grid-cols-2 gap-4">
            <div className="bg-white dark:bg-zinc-900 p-3 rounded-lg border border-zinc-100 dark:border-zinc-800/50">
                <div className="text-2xl font-bold">{stats.done}</div>
                <div className="text-xs text-zinc-500 uppercase font-bold">Completed</div>
            </div>
             <div className="bg-white dark:bg-zinc-900 p-3 rounded-lg border border-zinc-100 dark:border-zinc-800/50">
                <div className="text-2xl font-bold text-zinc-400">{stats.total - stats.done}</div>
                <div className="text-xs text-zinc-500 uppercase font-bold">Remaining</div>
            </div>
        </div>

        <Button className="w-full" size="sm">
            <CheckCircle2 className="mr-2 h-4 w-4" /> Complete Sprint 35
        </Button>
    </div>
);

// 13. The "Split Header" (Corporate)
const SplitHeaderSprint = () => (
    <div className="border border-zinc-300 dark:border-zinc-700 bg-white dark:bg-zinc-950 rounded-lg overflow-hidden flex flex-col sm:flex-row">
        <div className="p-6 flex-1 border-b sm:border-b-0 sm:border-r border-zinc-200 dark:border-zinc-800">
            <h3 className="font-bold text-lg mb-4">Sprint 35</h3>
            <div className="space-y-3">
                 <div className="flex justify-between text-sm">
                    <span className="text-zinc-500">Progress</span>
                    <span className="font-bold">{stats.percentage}%</span>
                 </div>
                 <div className="h-2 w-full bg-zinc-100 dark:bg-zinc-800 rounded-full overflow-hidden">
                    <div className="h-full bg-blue-600" style={{ width: `${stats.percentage}%` }} />
                 </div>
                 <div className="text-xs text-zinc-400 mt-1">
                    {stats.done} of {stats.total} tickets completed
                 </div>
            </div>
        </div>
        <div className="p-6 bg-zinc-50 dark:bg-zinc-900/50 flex flex-col justify-center gap-3 w-full sm:w-64 shrink-0">
             <div className="flex items-center justify-between text-sm">
                <span className="text-zinc-500">Duration</span>
                <button className="font-medium hover:underline text-blue-600 dark:text-blue-400 decoration-dotted underline-offset-4">
                    Oct 12 - 26
                </button>
             </div>
             <Button className="w-full mt-2">Complete Sprint</Button>
        </div>
    </div>
);

// 14. The "Floating Action" (Modern SaaS)
const FloatingActionSprint = () => (
    <div className="relative pl-6 border-l-2 border-indigo-500 py-2">
        <div className="flex flex-col gap-1">
             <h3 className="text-2xl font-bold flex items-center gap-3">
                Sprint 35
                <span className="text-base font-normal text-zinc-400">/ Growth</span>
             </h3>
             <div className="flex items-center gap-6 mt-2 text-sm text-zinc-600 dark:text-zinc-400">
                <button className="flex items-center gap-2 hover:text-indigo-500 transition-colors group">
                    <Calendar size={16} />
                    <span className="group-hover:underline">{stats.startDate} — {stats.endDate}</span>
                </button>
                <div className="flex items-center gap-2">
                    <PieChart size={16} />
                    <span>{stats.done}/{stats.total} Done</span>
                </div>
             </div>
        </div>
        <div className="absolute right-0 top-1/2 -translate-y-1/2">
            <Button className="rounded-full shadow-lg shadow-indigo-500/20 px-6">
                Complete
                <ArrowRight className="ml-2 h-4 w-4" />
            </Button>
        </div>
    </div>
);

// 15. The "Property List" (Notion Style)
const NotionSprint = () => (
    <div className="group space-y-4">
        <div className="flex items-start justify-between">
            <div className="flex items-center gap-3">
                <div className="p-2 rounded bg-zinc-100 dark:bg-zinc-800 text-xl">🎯</div>
                <h3 className="text-xl font-bold underline decoration-zinc-200 dark:decoration-zinc-700 underline-offset-4">Sprint 35</h3>
            </div>
            <div className="opacity-0 group-hover:opacity-100 transition-opacity">
                <Button variant="ghost" size="sm" className="text-zinc-500">Complete Sprint</Button>
            </div>
        </div>
        
        <div className="space-y-1 pl-12 font-mono text-sm">
             <div className="grid grid-cols-[100px_1fr] items-center h-8">
                <span className="text-zinc-500 flex items-center gap-2"><Clock size={12}/> Dates</span>
                <div className="hover:bg-zinc-100 dark:hover:bg-zinc-800 px-2 py-1 rounded cursor-pointer w-fit -ml-2 transition-colors">
                    {stats.startDate} → {stats.endDate}
                </div>
             </div>
             <div className="grid grid-cols-[100px_1fr] items-center h-8">
                <span className="text-zinc-500 flex items-center gap-2"><PieChart size={12}/> Progress</span>
                <div className="flex items-center gap-3 px-2 -ml-2">
                    <div className="w-32 h-1.5 bg-zinc-200 dark:bg-zinc-800 rounded-full overflow-hidden">
                        <div className="h-full bg-zinc-800 dark:bg-zinc-200" style={{ width: `${stats.percentage}%` }} />
                    </div>
                    <span>{stats.percentage}%</span>
                </div>
             </div>
             <div className="grid grid-cols-[100px_1fr] items-center h-8">
                <span className="text-zinc-500 flex items-center gap-2"><CheckCircle2 size={12}/> Status</span>
                <Badge variant="secondary" className="w-fit -ml-2">Active</Badge>
             </div>
        </div>
    </div>
);

// 16. The "Gamified XP Bar"
const GamifiedSprint = () => (
    <div className="bg-indigo-950 text-white rounded-xl p-6 relative overflow-hidden">
        <div className="absolute top-0 right-0 p-32 bg-indigo-500/20 blur-3xl rounded-full" />
        
        <div className="relative z-10 flex items-end justify-between mb-4">
            <div>
                 <div className="text-indigo-300 text-xs font-bold uppercase tracking-widest mb-1">Current Level</div>
                 <h3 className="text-3xl font-black italic">SPRINT 35</h3>
            </div>
            <div className="text-right">
                <div className="text-2xl font-bold">{stats.done}<span className="text-indigo-400">/{stats.total}</span></div>
                <div className="text-xs text-indigo-300 font-bold uppercase">Quests Completed</div>
            </div>
        </div>

        <div className="relative z-10 h-6 bg-black/30 rounded-full border border-indigo-500/30 p-1 mb-6">
            <div className="h-full bg-gradient-to-r from-indigo-500 to-purple-500 rounded-full relative" style={{ width: `${stats.percentage}%` }}>
                <div className="absolute right-0 top-1/2 -translate-y-1/2 w-8 h-8 bg-white rounded-full border-4 border-indigo-600 shadow-lg flex items-center justify-center text-indigo-700 font-bold text-[10px]">
                    {stats.percentage}%
                </div>
            </div>
        </div>

        <div className="relative z-10 flex items-center justify-between">
            <button className="flex items-center gap-2 text-indigo-200 hover:text-white bg-indigo-900/50 px-3 py-1.5 rounded-lg border border-indigo-500/20 text-xs font-mono">
                <Calendar size={12} />
                <span>{stats.startDate} - {stats.endDate}</span>
            </button>
            
            <Button className="bg-yellow-400 hover:bg-yellow-500 text-black font-bold uppercase tracking-wide border-b-4 border-yellow-600 active:border-b-0 active:translate-y-1 shadow-xl">
                <Trophy size={16} className="mr-2" />
                Claim Rewards
            </Button>
        </div>
    </div>
);

// 17. The "Terminal" (Minimalist Code)
const TerminalSprint = () => (
    <div className="font-mono bg-black text-green-400 p-4 rounded-md border border-green-900 border-l-4 border-l-green-500 shadow-sm relative overflow-hidden">
         <div className="flex justify-between items-start mb-4">
            <div className="space-y-1">
                <div className="flex items-center gap-2">
                    <span className="text-green-600">$</span>
                    <span className="text-white font-bold">./sprint-35.sh</span>
                    <span className="animate-pulse bg-green-500 w-2 h-4" />
                </div>
                <div className="text-xs text-green-600 pl-4">
                    Process ID: 8923 • Priority: NICE -20
                </div>
            </div>
            <Button variant="outline" size="sm" className="bg-transparent border-green-700 text-green-500 hover:bg-green-900 hover:text-green-300 h-7 text-xs">
                Execute Completion
            </Button>
         </div>

         <div className="bg-green-900/10 p-2 rounded mb-2 border border-green-900/30 text-xs grid grid-cols-2 gap-y-2">
            <span className="text-green-600">START_DATE:</span> <span className="text-green-200 cursor-text hover:bg-green-900/30 px-1">"{stats.startDate}"</span>
            <span className="text-green-600">END_DATE:</span> <span className="text-green-200 cursor-text hover:bg-green-900/30 px-1">"{stats.endDate}"</span>
            <span className="text-green-600">TICKETS:</span> <span className="text-green-200">[{stats.done}/{stats.total}]</span>
         </div>
    </div>
);

// 18. The "Big Number" (Focus)
const BigNumberSprint = () => (
    <div className="flex items-center gap-8 p-6 bg-white dark:bg-zinc-950 border-y sm:border border-zinc-200 dark:border-zinc-800 sm:rounded-2xl">
        <div className="relative">
             <svg className="w-24 h-24 -rotate-90">
                <circle cx="48" cy="48" r="40" stroke="currentColor" strokeWidth="8" fill="transparent" className="text-zinc-100 dark:text-zinc-800" />
                <circle cx="48" cy="48" r="40" stroke="currentColor" strokeWidth="8" fill="transparent" strokeDasharray={251.2} strokeDashoffset={251.2 * (1 - stats.percentage / 100)} className="text-black dark:text-white transition-all duration-1000" />
             </svg>
             <div className="absolute inset-0 flex items-center justify-center flex-col">
                <span className="text-xl font-bold">{stats.done}</span>
                <span className="text-[10px] uppercase text-zinc-400">of {stats.total}</span>
             </div>
        </div>
        
        <div className="flex-1 space-y-4">
            <div>
                <h3 className="text-2xl font-bold mb-1">Sprint 35</h3>
                <div className="flex items-center gap-3">
                    <button className="text-sm text-zinc-500 hover:text-black dark:hover:text-white border-b border-dashed border-zinc-300 hover:border-zinc-500 transition-colors">
                        {stats.startDate} - {stats.endDate}
                    </button>
                    <Badge variant="outline" className="text-[10px] h-5">2 weeks</Badge>
                </div>
            </div>
            
            <div className="flex gap-3">
                <Button className="flex-1 max-w-[140px]" size="sm">Complete</Button>
                <Button variant="ghost" size="sm">Settings</Button>
            </div>
        </div>
    </div>
);

// 19. The "Calendar Strip"
const CalendarStripSprint = () => (
    <div className="bg-white dark:bg-zinc-900 border border-zinc-200 dark:border-zinc-800 rounded-xl overflow-hidden">
        <div className="p-4 flex items-center justify-between border-b border-zinc-100 dark:border-zinc-800">
            <div className="flex items-center gap-3">
                <div className="w-10 h-10 bg-blue-50 dark:bg-blue-900/20 text-blue-600 dark:text-blue-400 rounded-lg flex flex-col items-center justify-center border border-blue-100 dark:border-blue-900/50">
                    <span className="text-[10px] uppercase font-bold">OCT</span>
                    <span className="text-sm font-bold leading-none">26</span>
                </div>
                <div>
                     <h3 className="font-bold text-sm">Sprint 35 Ending</h3>
                     <p className="text-xs text-zinc-500">{stats.total - stats.done} items remaining</p>
                </div>
            </div>
            <Button size="sm" variant="outline" className="h-8">
                Edit Dates
            </Button>
        </div>
        <div className="p-4 bg-zinc-50/50 dark:bg-zinc-900/50 flex items-center justify-between">
            <div className="flex gap-1">
                 {[1,2,3,4,5,6].map(i => (
                    <div key={i} className={cn("w-6 h-8 rounded-sm", i <= 4 ? "bg-green-500" : "bg-zinc-200 dark:bg-zinc-700")} />
                 ))}
                 <div className="w-6 h-8 bg-zinc-100 dark:bg-zinc-800 rounded-sm flex items-center justify-center text-xs text-zinc-400">
                    +6
                 </div>
            </div>
            <Button size="sm">
                Complete Sprint
            </Button>
        </div>
    </div>
);

// 20. The "Island" (Floating Pill)
const IslandSprint = () => (
    <div className="flex justify-center py-4">
        <div className="bg-black/80 dark:bg-white/90 backdrop-blur-md text-white dark:text-black py-2 pl-6 pr-2 rounded-full shadow-2xl flex items-center gap-6 max-w-2xl w-full mx-auto">
            <span className="font-bold whitespace-nowrap">Sprint 35</span>
            
            <div className="h-4 w-[1px] bg-white/20 dark:bg-black/20" />
            
            <button className="text-sm text-zinc-300 dark:text-zinc-600 hover:text-white dark:hover:text-black transition-colors whitespace-nowrap">
                {stats.startDate} — {stats.endDate}
            </button>
            
            <div className="flex-1 flex items-center gap-3 ml-2">
                <div className="flex-1 h-1.5 bg-white/10 dark:bg-black/10 rounded-full overflow-hidden">
                    <div className="h-full bg-white dark:bg-black" style={{ width: `${stats.percentage}%` }} />
                </div>
                <span className="text-xs font-mono tabular-nums opacity-50">{stats.done}/{stats.total}</span>
            </div>

            <Button size="sm" className="rounded-full bg-white text-black hover:bg-zinc-200 dark:bg-black dark:text-white dark:hover:bg-zinc-800 h-8 px-4 font-bold border-0">
                Complete
            </Button>
        </div>
    </div>
);

export const SprintDesignShowcaseV2 = () => {
    return (
        <div className="space-y-12 pb-20">
            <div className="space-y-2">
                <h2 className="text-2xl font-bold">Sprint Configs (Functional)</h2>
                <p className="text-muted-foreground">
                    10 variations with Complete button, Counters, and Date inputs.
                </p>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-10">
                {/* 11 */}
                <div className="space-y-3">
                    <span className="text-sm font-medium text-muted-foreground">11. Command Bar</span>
                    <CommandBarSprint />
                </div>
                
                {/* 12 */}
                <div className="space-y-3">
                    <span className="text-sm font-medium text-muted-foreground">12. Dashboard Widget</span>
                    <DashboardSprint />
                </div>

                {/* 13 */}
                <div className="space-y-3">
                    <span className="text-sm font-medium text-muted-foreground">13. Split Header</span>
                    <SplitHeaderSprint />
                </div>

                {/* 14 */}
                <div className="space-y-3">
                    <span className="text-sm font-medium text-muted-foreground">14. Floating Action</span>
                    <FloatingActionSprint />
                </div>

                {/* 15 */}
                <div className="space-y-3">
                    <span className="text-sm font-medium text-muted-foreground">15. Notion Property List</span>
                    <div className="p-6 border rounded-xl bg-white dark:bg-zinc-950">
                        <NotionSprint />
                    </div>
                </div>

                {/* 16 */}
                <div className="space-y-3">
                    <span className="text-sm font-medium text-muted-foreground">16. Gamified XP</span>
                    <GamifiedSprint />
                </div>

                {/* 17 */}
                <div className="space-y-3">
                    <span className="text-sm font-medium text-muted-foreground">17. Terminal</span>
                    <TerminalSprint />
                </div>

                {/* 18 */}
                <div className="space-y-3">
                    <span className="text-sm font-medium text-muted-foreground">18. Big Number Focus</span>
                    <BigNumberSprint />
                </div>

                {/* 19 */}
                <div className="space-y-3">
                    <span className="text-sm font-medium text-muted-foreground">19. Calendar Strip</span>
                    <CalendarStripSprint />
                </div>

                {/* 20 */}
                <div className="space-y-3">
                    <span className="text-sm font-medium text-muted-foreground">20. The Island</span>
                    <div className="p-4 bg-zinc-100 dark:bg-zinc-900 rounded-xl">
                        <IslandSprint />
                    </div>
                </div>
            </div>
        </div>
    );
};
