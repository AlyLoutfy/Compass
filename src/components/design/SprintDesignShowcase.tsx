import { Badge } from '@/components/ui/Badge';
import { Button } from '@/components/ui/Button';
import { ChevronRight, Calendar, ChevronDown, Rocket, Clock, Layers } from 'lucide-react';

const mockStats = {
    total: 12,
    completed: 5,
    points: 34
};


// 1. Minimal & Clean
const MinimalSprint = () => (
    <div className="border border-zinc-200 dark:border-zinc-800 rounded-lg p-6 bg-white dark:bg-zinc-950 flex items-center justify-between hover:border-zinc-300 transition-colors group">
        <div className="flex items-center gap-4">
            <div className="w-12 h-12 rounded-full bg-zinc-100 dark:bg-zinc-900 flex items-center justify-center text-zinc-500 font-bold group-hover:bg-zinc-200 dark:group-hover:bg-zinc-800 transition-colors">
                34
            </div>
            <div>
                <h3 className="font-semibold text-lg text-zinc-900 dark:text-zinc-100">Core Improvements</h3>
                <div className="flex items-center gap-3 text-sm text-zinc-500 mt-1">
                    <span className="flex items-center gap-1"><Calendar size={12} /> Oct 12 - Oct 26</span>
                    <span className="w-1 h-1 bg-zinc-300 rounded-full" />
                    <span>{mockStats.completed}/{mockStats.total} issues</span>
                </div>
            </div>
        </div>
        <div className="flex items-center gap-4">
            <div className="flex items-center gap-2">
                <div className="h-2 w-24 bg-zinc-100 dark:bg-zinc-800 rounded-full overflow-hidden">
                    <div className="h-full bg-zinc-900 dark:bg-zinc-100 rounded-full" style={{ width: '45%' }} />
                </div>
                <span className="text-sm font-medium">45%</span>
            </div>
            <Button variant="ghost" size="icon"><ChevronRight className="text-zinc-400" /></Button>
        </div>
    </div>
);

// 2. Modern Card with Gradient
const ModernCardSprint = () => (
    <div className="rounded-2xl border border-zinc-200 dark:border-zinc-800 bg-white dark:bg-zinc-900 shadow-sm p-5 relative overflow-hidden group">
        <div className="absolute top-0 left-0 w-1 h-full bg-gradient-to-b from-blue-500 to-indigo-600" />
        <div className="flex items-center justify-between z-10 relative">
            <div className="flex items-center gap-4">
                 <div className="flex flex-col">
                    <span className="text-xs font-bold text-blue-600 dark:text-blue-400 uppercase tracking-wider mb-1">Current Sprint</span>
                    <h3 className="text-xl font-bold text-zinc-900 dark:text-white">Core Improvements</h3>
                    <div className="flex gap-2 mt-2">
                        <Badge variant="secondary" className="bg-blue-50 text-blue-700 dark:bg-blue-900/30 dark:text-blue-300 border-0">Active</Badge>
                        <Badge variant="outline" className="text-zinc-500">2 weeks left</Badge>
                    </div>
                 </div>
            </div>
            <div className="text-right">
                <div className="text-2xl font-bold tabular-nums text-zinc-900 dark:text-white">12</div>
                <div className="text-xs text-zinc-500 uppercase font-bold tracking-wide">Issues</div>
            </div>
        </div>
        <div className="mt-6 pt-4 border-t border-zinc-100 dark:border-zinc-800 flex justify-between items-center text-sm text-zinc-500">
             <div className="flex -space-x-2">
                {[1,2,3].map(i => (
                    <div key={i} className="w-6 h-6 rounded-full border-2 border-white dark:border-zinc-900 bg-zinc-200" />
                ))}
             </div>
             <Button size="sm" variant="ghost" className="text-blue-600 dark:text-blue-400 hover:text-blue-700 p-0 hover:bg-transparent">View Board →</Button>
        </div>
    </div>
);

// 3. Status Focused (Colorful)
const StatusSprint = () => (
    <div className="border border-green-200 dark:border-green-900 bg-green-50/50 dark:bg-green-900/10 rounded-xl p-6 flex items-center justify-between">
        <div className="flex items-center gap-5">
            <div className="bg-green-100 dark:bg-green-900/30 p-3 rounded-lg text-green-700 dark:text-green-400">
                <Rocket size={24} />
            </div>
            <div>
                <h3 className="text-green-950 dark:text-green-100 font-bold text-lg">Sprint 34</h3>
                <p className="text-green-800/60 dark:text-green-300/60 text-sm">Target: Performance Optimization</p>
            </div>
        </div>
        <div className="flex items-center gap-6">
            <div className="text-center px-4 border-r border-green-200 dark:border-green-800">
                <div className="text-xl font-bold text-green-700 dark:text-green-400">5</div>
                <div className="text-[10px] uppercase font-bold text-green-600/50">Done</div>
            </div>
            <div className="text-center px-4 border-r border-green-200 dark:border-green-800">
                <div className="text-xl font-bold text-green-700 dark:text-green-400">34</div>
                <div className="text-[10px] uppercase font-bold text-green-600/50">Points</div>
            </div>
            <div className="text-center px-4">
                <div className="text-xl font-bold text-green-700 dark:text-green-400">14</div>
                <div className="text-[10px] uppercase font-bold text-green-600/50">Days Left</div>
            </div>
        </div>
    </div>
);

// 4. Dark & Techy (Neon)
const TechSprint = () => (
    <div className="bg-zinc-950 border border-zinc-800 rounded-md p-0 overflow-hidden shadow-lg relative group">
        <div className="absolute top-0 left-0 w-full h-[1px] bg-gradient-to-r from-transparent via-cyan-500 to-transparent opacity-50" />
        <div className="p-4 flex items-center justify-between bg-zinc-900/50 backdrop-blur-sm">
             <div className="flex items-center gap-3">
                <div className="h-2 w-2 rounded-full bg-cyan-500 shadow-[0_0_10px_#06b6d4]" />
                <h3 className="font-mono text-zinc-100 tracking-tight">SPRINT_34_CORE</h3>
             </div>
             <span className="font-mono text-xs text-cyan-500">RUNNING</span>
        </div>
        <div className="p-4 grid grid-cols-3 gap-4 border-t border-zinc-900 text-zinc-400">
            <div>
                <span className="text-[10px] block text-zinc-600 font-mono mb-1">START</span>
                <span className="text-xs font-mono">12 OCT</span>
            </div>
            <div>
                <span className="text-[10px] block text-zinc-600 font-mono mb-1">END</span>
                <span className="text-xs font-mono">26 OCT</span>
            </div>
            <div className="text-right">
                <span className="text-[10px] block text-zinc-600 font-mono mb-1">PROGRESS</span>
                <span className="text-xs font-mono text-zinc-100">45%</span>
            </div>
        </div>
    </div>
);

// 5. Glassmorphism
const GlassSprint = () => (
    <div className="bg-white/80 dark:bg-black/60 backdrop-blur-xl border border-white/20 dark:border-white/10 rounded-2xl p-6 shadow-xl relative overflow-hidden">
        <div className="absolute -right-10 -top-10 w-40 h-40 bg-purple-500/10 rounded-full blur-3xl" />
        <div className="relative z-10 flex items-center justify-between">
            <div>
                <Badge className="bg-purple-100 text-purple-700 hover:bg-purple-100 dark:bg-purple-900/40 dark:text-purple-300 border-none mb-2">Current</Badge>
                <h3 className="text-2xl font-bold tracking-tight text-zinc-800 dark:text-white">Sprint 34</h3>
                <p className="text-zinc-500 mt-1 flex items-center gap-2 text-sm"><Clock size={14} /> Ends in 3 days</p>
            </div>
            <div className="w-16 h-16 rounded-2xl bg-gradient-to-br from-purple-500 to-pink-500 flex items-center justify-center text-white font-bold text-xl shadow-lg">
                45%
            </div>
        </div>
    </div>
);

// 6. Data Dense / Table Row
const DataSprint = () => (
    <div className="border border-zinc-200 dark:border-zinc-800 bg-white dark:bg-zinc-900 rounded flex items-center p-3 gap-4 text-sm group hover:border-zinc-300 dark:hover:border-zinc-700 transition-colors">
        <Button variant="ghost" size="icon" className="h-6 w-6"><ChevronDown size={14} /></Button>
        <div className="font-semibold w-64 truncate">Sprint 34: Core Improvements</div>
        
        <div className="flex-1 flex items-center gap-8 text-xs text-zinc-500">
            <div className="flex flex-col gap-0.5">
                <span className="uppercase text-[10px] font-bold">Start</span>
                <span className="text-zinc-800 dark:text-zinc-300">Oct 12</span>
            </div>
            <div className="flex flex-col gap-0.5">
                <span className="uppercase text-[10px] font-bold">End</span>
                <span className="text-zinc-800 dark:text-zinc-300">Oct 26</span>
            </div>
            <div className="flex flex-col gap-0.5 w-32">
                <span className="uppercase text-[10px] font-bold flex justify-between"><span>Progress</span> <span>45%</span></span>
                <div className="h-1.5 w-full bg-zinc-100 dark:bg-zinc-800 rounded-full overflow-hidden">
                    <div className="h-full bg-blue-600 rounded-full" style={{ width: '45%' }} />
                </div>
            </div>
        </div>
        
        <div className="flex -space-x-1.5 shrink-0">
             {[1,2,3].map(i => <div key={i} className="w-6 h-6 rounded-full bg-zinc-200 border-2 border-white dark:border-zinc-900 text-[10px] flex items-center justify-center font-bold">U</div>)}
        </div>
        <Button variant="outline" size="sm" className="h-7 text-xs">Complete</Button>
    </div>
);

// 7. Timeline / Process
const TimelineSprint = () => (
    <div className="border-l-4 border-indigo-500 pl-6 py-4 relative">
        <div className="absolute -left-[11px] top-6 w-5 h-5 bg-white dark:bg-black border-4 border-indigo-500 rounded-full" />
        <div className="flex items-center justify-between mb-2">
            <h3 className="font-bold text-lg">Sprint 34</h3>
            <span className="text-xs font-bold text-indigo-500 uppercase tracking-wide">In Progress</span>
        </div>
        <p className="text-muted-foreground text-sm mb-4">Focus on backend scalability and user onboarding flow.</p>
        <div className="flex items-center gap-2">
            <div className="flex-1 h-2 bg-zinc-100 dark:bg-zinc-800 rounded-full overflow-hidden flex">
                <div className="h-full bg-indigo-500" style={{ width: '45%' }} />
                <div className="h-full bg-indigo-200 dark:bg-indigo-900" style={{ width: '20%' }} /> {/* Planned */}
            </div>
            <span className="text-xs font-bold w-8 text-right">65%</span>
        </div>
    </div>
);

// 8. Soft Rounded (Playful)
const SoftSprint = () => (
    <div className="bg-[#F4F4F5] dark:bg-[#18181B] rounded-[2rem] p-6 hover:bg-[#E4E4E7] dark:hover:bg-[#27272A] transition-colors cursor-pointer group">
        <div className="flex items-center justify-between">
             <div className="flex items-center gap-4">
                <div className="w-14 h-14 bg-white dark:bg-black rounded-full flex items-center justify-center shadow-sm text-2xl group-hover:scale-110 transition-transform">
                    🎯
                </div>
                <div>
                    <h3 className="font-bold text-lg dark:text-zinc-100">Sprint 34</h3>
                    <div className="text-sm text-zinc-500 font-medium">12 Issues • 34 Points</div>
                </div>
             </div>
             <div className="flex flex-col items-end">
                <Badge className="bg-white dark:bg-black text-black dark:text-white hover:bg-white border-0 shadow-sm px-3 py-1">Active</Badge>
             </div>
        </div>
    </div>
);

// 9. Retro / Brutalist
const RetroSprint = () => (
    <div className="border-2 border-black dark:border-white bg-[#FFDE00] p-4 shadow-[4px_4px_0_0_#000] dark:shadow-[4px_4px_0_0_#fff] flex items-center justify-between">
        <div className="flex flex-col">
            <span className="font-mono text-xs font-bold uppercase mb-1 text-black">Current Cycle</span>
            <h3 className="font-black text-2xl uppercase text-black">Sprint 34</h3>
        </div>
        <div className="flex items-center gap-4">
             <div className="bg-black text-white dark:bg-white dark:text-black font-mono font-bold px-3 py-1 text-sm">
                45% DONE
             </div>
             <Button className="rounded-none border-2 border-black bg-white text-black hover:bg-zinc-100 dark:border-black dark:text-black h-10 font-bold uppercase shadow-none">
                Details
             </Button>
        </div>
    </div>
);

// 10. Apple / MacOS
const MacSprint = () => (
    <div className="bg-white/50 dark:bg-zinc-800/50 backdrop-blur-md border border-zinc-200/50 dark:border-white/10 rounded-lg p-4 flex items-center gap-4">
        <div className="w-10 h-10 rounded bg-gradient-to-b from-blue-500 to-blue-600 flex items-center justify-center text-white shadow-lg shadow-blue-500/30">
            <Layers size={20} />
        </div>
        <div className="flex-1">
            <div className="flex items-center justify-between mb-1">
                <h3 className="font-semibold text-sm">Sprint 34</h3>
                <span className="text-xs text-zinc-500">Oct 26</span>
            </div>
            <div className="w-full bg-zinc-200/50 dark:bg-zinc-700/50 h-1.5 rounded-full overflow-hidden">
                <div className="bg-blue-500 h-full rounded-full" style={{ width: '45%' }} />
            </div>
        </div>
        <Button variant="ghost" size="icon" className="h-8 w-8 rounded-full"><ChevronRight size={16} className="text-zinc-400" /></Button>
    </div>
);


export const SprintDesignShowcase = () => {
    return (
        <div className="space-y-12 pb-20">
            <div className="space-y-2">
                <h2 className="text-2xl font-bold">Sprint Header Designs</h2>
                <p className="text-muted-foreground">
                    10 variations for the sprint container/header.
                </p>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                {/* 1 */}
                <div className="space-y-3">
                    <span className="text-sm font-medium text-muted-foreground">1. Minimal & Clean</span>
                    <MinimalSprint />
                </div>
                
                {/* 2 */}
                <div className="space-y-3">
                    <span className="text-sm font-medium text-muted-foreground">2. Modern Card (Gradient)</span>
                    <ModernCardSprint />
                </div>

                {/* 3 */}
                <div className="space-y-3">
                    <span className="text-sm font-medium text-muted-foreground">3. Status Focused</span>
                    <StatusSprint />
                </div>

                {/* 4 */}
                <div className="space-y-3">
                    <span className="text-sm font-medium text-muted-foreground">4. Dark & Techy</span>
                    <TechSprint />
                </div>

                {/* 5 */}
                <div className="space-y-3">
                    <span className="text-sm font-medium text-muted-foreground">5. Glassmorphism</span>
                    <div className="p-8 bg-gradient-to-br from-indigo-500 via-purple-500 to-pink-500 rounded-xl">
                        <GlassSprint />
                    </div>
                </div>

                {/* 6 */}
                <div className="space-y-3">
                    <span className="text-sm font-medium text-muted-foreground">6. Data Dense Table Row</span>
                    <DataSprint />
                </div>

                {/* 7 */}
                <div className="space-y-3">
                    <span className="text-sm font-medium text-muted-foreground">7. Timeline Process</span>
                    <TimelineSprint />
                </div>

                {/* 8 */}
                <div className="space-y-3">
                    <span className="text-sm font-medium text-muted-foreground">8. Soft Rounded</span>
                    <SoftSprint />
                </div>

                {/* 9 */}
                <div className="space-y-3">
                    <span className="text-sm font-medium text-muted-foreground">9. Retro / Brutalist</span>
                    <RetroSprint />
                </div>

                {/* 10 */}
                <div className="space-y-3">
                    <span className="text-sm font-medium text-muted-foreground">10. MacOS Style</span>
                    <MacSprint />
                </div>
            </div>
        </div>
    );
};
