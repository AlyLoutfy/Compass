
import React from 'react';
import { cn } from '@/lib/utils';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/Avatar';
import { Badge } from '@/components/ui/Badge';
import { Button } from '@/components/ui/Button';
import { Clock, CheckCircle2, Flame, Trophy, Activity, MessageSquare, Layout } from 'lucide-react';

// Mock Data
const MOCK_USER = {
    id: 'u1',
    name: 'Jane Doe',
    avatar: 'https://i.pravatar.cc/150?u=jane',
    role: 'frontend',
    status: 'online',
    isBlocked: false
};

const MOCK_TICKET = {
    id: 'TKT-402',
    title: 'Fix Authentication Flow',
    estimate: 4,
    timeSpent: 1.5,
    status: 'in-progress'
};

const VariantContainer = ({ title, children, className }: { title: string, children: React.ReactNode, className?: string }) => (
    <div className="space-y-2">
        <h3 className="text-sm font-bold text-muted-foreground uppercase tracking-wider">{title}</h3>
        <div className={cn("w-full", className)}>
            {children}
        </div>
    </div>
);

// 1. MINIMALIST
const MinimalistCard = () => (
    <div className="flex items-center justify-between p-4 bg-card border border-border/50 rounded-lg shadow-sm hover:border-sidebar-primary/50 transition-colors">
        <div className="flex items-center gap-4">
            <Avatar className="h-9 w-9">
                <AvatarImage src={MOCK_USER.avatar} />
                <AvatarFallback>JD</AvatarFallback>
            </Avatar>
            <div>
                <h4 className="font-medium text-foreground leading-none">{MOCK_USER.name}</h4>
                <p className="text-xs text-muted-foreground mt-1">Frontend • Online</p>
            </div>
        </div>
        <div className="flex items-center gap-4">
            <span className="text-sm font-medium text-foreground">{MOCK_TICKET.title}</span>
            <Badge variant="outline" className="font-mono text-xs text-muted-foreground">01:30:00</Badge>
        </div>
    </div>
);

// 2. GAMIFIED
const GamifiedCard = () => (
    <div className="flex items-center justify-between p-1 bg-zinc-900 rounded-xl border-2 border-indigo-500/30 overflow-hidden relative group">
        <div className="absolute top-0 left-0 w-1 h-full bg-gradient-to-b from-indigo-500 to-purple-500" />
        <div className="flex items-center gap-4 p-3 pl-5 w-full bg-zinc-900/90 backdrop-blur-sm z-10">
            <div className="relative">
                <Avatar className="h-12 w-12 border-2 border-indigo-500">
                    <AvatarImage src={MOCK_USER.avatar} />
                    <AvatarFallback>JD</AvatarFallback>
                </Avatar>
                <div className="absolute -bottom-1 -right-1 bg-yellow-500 text-black text-[10px] font-bold px-1.5 rounded-full border border-zinc-900">
                    Lvl 5
                </div>
            </div>
            <div className="space-y-1">
                <div className="flex items-center gap-2">
                    <h4 className="font-bold text-indigo-100">{MOCK_USER.name}</h4>
                    <span className="flex items-center gap-0.5 text-[10px] text-orange-400 font-bold bg-orange-400/10 px-1.5 py-0.5 rounded-full">
                        <Flame size={10} className="fill-orange-400" /> 7 Day Streak
                    </span>
                </div>
                <div className="w-32 h-1.5 bg-zinc-800 rounded-full overflow-hidden">
                    <div className="h-full bg-gradient-to-r from-indigo-500 to-purple-500 w-[70%]" />
                </div>
                <p className="text-[10px] text-zinc-500">850 / 1200 XP</p>
            </div>
            <div className="ml-auto flex flex-col items-end gap-1">
                <span className="text-indigo-200 font-bold text-sm tracking-tight">{MOCK_TICKET.title}</span>
                <Badge className="bg-gradient-to-r from-indigo-500 to-purple-500 border-0 text-white font-bold">
                    <Trophy size={10} className="mr-1" /> Quest Active
                </Badge>
            </div>
        </div>
    </div>
);

// 3. CYBERPUNK / NEON
const CyberpunkCard = () => (
    <div className="bg-black border border-green-500/50 p-4 rounded-sm shadow-[0_0_15px_rgba(34,197,94,0.15)] flex items-center justify-between relative overflow-hidden font-mono">
        <div className="absolute inset-0 bg-[linear-gradient(90deg,transparent_0%,rgba(34,197,94,0.05)_50%,transparent_100%)] w-full h-full animate-in slide-in-from-left duration-1000" />
        <div className="flex items-center gap-4 z-10">
             <div className="relative">
                <Avatar className="h-10 w-10 border border-green-500 rounded-none">
                    <AvatarImage src={MOCK_USER.avatar} />
                    <AvatarFallback className="bg-green-900 text-green-400 rounded-none">JD</AvatarFallback>
                </Avatar>
                <div className="absolute -top-1 -left-1 w-2 h-2 border-t border-l border-green-500" />
                <div className="absolute -bottom-1 -right-1 w-2 h-2 border-b border-r border-green-500" />
            </div>
            <div>
                <h4 className="text-green-500 font-bold tracking-widest uppercase text-sm">Jane_Doe.exe</h4>
                <div className="text-[10px] text-green-700 font-bold uppercase mt-1 flex items-center gap-1">
                    <span className="w-1.5 h-1.5 bg-green-500 rounded-full animate-pulse" />
                    System Online
                </div>
            </div>
        </div>
        <div className="flex items-center gap-6 z-10">
            <div className="flex flex-col items-end">
                 <span className="text-[10px] text-green-800 uppercase">Current_Objective</span>
                 <span className="text-green-400 text-sm drop-shadow-[0_0_5px_rgba(34,197,94,0.5)]">{MOCK_TICKET.title}</span>
            </div>
            <div className="border border-green-500/30 bg-green-950/30 px-3 py-1 text-xl font-bold text-green-500 tabular-nums tracking-widest">
                01:30
            </div>
        </div>
    </div>
);

// 4. DATA / ANALYTICS
const AnalyticsCard = () => (
    <div className="bg-card border rounded-lg p-2.5 flex items-center justify-between gap-4">
        <div className="flex items-center gap-3 w-1/4">
             <Avatar className="h-9 w-9">
                <AvatarImage src={MOCK_USER.avatar} />
            </Avatar>
            <div className="min-w-0">
                <h4 className="font-semibold text-sm truncate">{MOCK_USER.name}</h4>
                <div className="flex items-center gap-1 mt-0.5">
                    <Activity size={10} className="text-green-500" />
                    <span className="text-[10px] text-muted-foreground">Velocity: 94%</span>
                </div>
            </div>
        </div>
        
        {/* Sparkline Mockup */}
        <div className="flex-1 flex flex-col justify-center gap-1">
             <div className="flex justify-between text-[10px] text-muted-foreground uppercase font-medium">
                <span>Performance</span>
                <span>Active</span>
             </div>
             <div className="h-8 flex items-end gap-0.5">
                 {[40, 60, 35, 80, 50, 90, 70, 40, 60, 85].map((h, i) => (
                     <div key={i} style={{ height: `${h}%` }} className="flex-1 bg-primary/20 rounded-sm hover:bg-primary/50 transition-colors" />
                 ))}
             </div>
        </div>

        <div className="w-1/3 border-l pl-4">
             <p className="text-[10px] text-muted-foreground uppercase font-bold text-right mb-1">Breakdown</p>
             <div className="flex h-2 w-full rounded-full overflow-hidden">
                 <div className="bg-blue-500 w-[70%]" title="Coding" />
                 <div className="bg-yellow-500 w-[15%]" title="Meetings" />
                 <div className="bg-red-500 w-[15%]" title="Bugs" />
             </div>
             <div className="flex justify-end gap-2 mt-1">
                 <span className="text-[9px] text-muted-foreground flex items-center gap-1"><div className="w-1.5 h-1.5 rounded-full bg-blue-500" /> Code</span>
                 <span className="text-[9px] text-muted-foreground flex items-center gap-1"><div className="w-1.5 h-1.5 rounded-full bg-yellow-500" /> Meet</span>
             </div>
        </div>
    </div>
);

// 5. FOCUS MODE
const FocusModeCard = () => (
    <div className="bg-zinc-950 text-white p-5 rounded-2xl flex items-center justify-between shadow-2xl border border-zinc-800">
        <div className="flex items-center gap-4 opacity-70 hover:opacity-100 transition-opacity">
            <Avatar className="h-10 w-10 ring-2 ring-zinc-800">
                <AvatarImage src={MOCK_USER.avatar} />
            </Avatar>
            <div>
                <h4 className="font-light text-zinc-400">{MOCK_USER.name}</h4>
                <p className="text-xs font-bold text-zinc-600 uppercase tracking-widest">Focusing</p>
            </div>
        </div>
        
        <div className="text-center">
            <div className="text-4xl font-black tracking-tighter tabular-nums font-mono text-white">01:30:45</div>
            <p className="text-sm text-zinc-500 font-medium mt-1">{MOCK_TICKET.title}</p>
        </div>

        <div className="opacity-0 hover:opacity-100 transition-opacity">
            <Button variant="secondary" size="icon" className="rounded-full bg-zinc-800 text-white hover:bg-zinc-700">
                 <Layout size={18} />
            </Button>
        </div>
    </div>
);

// 6. SOCIAL / HUMAN
const SocialCard = () => (
    <div className="bg-white dark:bg-zinc-900 p-4 rounded-[20px] shadow-sm border border-zinc-200 dark:border-zinc-800 flex items-center gap-5">
        <div className="relative">
             <Avatar className="h-14 w-14 border-4 border-white dark:border-zinc-900 shadow-md">
                <AvatarImage src={MOCK_USER.avatar} />
            </Avatar>
            <div className="absolute bottom-0 right-0 bg-emerald-500 border-2 border-white dark:border-zinc-900 w-4 h-4 rounded-full" />
        </div>
        
        <div className="flex-1 space-y-2">
            <div className="flex justify-between items-start">
                <div>
                    <h4 className="font-bold text-lg">{MOCK_USER.name}</h4>
                    <span className="text-xs bg-zinc-100 dark:bg-zinc-800 px-2 py-0.5 rounded-full text-zinc-600 dark:text-zinc-400 font-medium">
                        Writing Code 👨‍💻
                    </span>
                </div>
                <div className="flex -space-x-2">
                     {[1,2,3].map(i => (
                         <div key={i} className="w-6 h-6 rounded-full bg-zinc-200 border-2 border-white dark:border-zinc-900 flex items-center justify-center text-[8px] font-bold text-zinc-500">
                             Col
                         </div>
                     ))}
                </div>
            </div>
            <div className="flex items-center gap-3 pt-1">
                 <div className="flex items-center gap-1 text-xs font-medium text-pink-500 bg-pink-50 dark:bg-pink-900/10 px-2 py-1 rounded-md">
                     <span className="text-sm">❤️</span> 24 Kudos
                 </div>
                 <div className="flex items-center gap-1 text-xs font-medium text-blue-500 bg-blue-50 dark:bg-blue-900/10 px-2 py-1 rounded-md">
                     <MessageSquare size={12} /> Status
                 </div>
            </div>
        </div>
    </div>
);

// 7. GLASSMORPHISM
const GlassCard = () => (
    <div className="relative overflow-hidden rounded-xl p-0.5 bg-gradient-to-br from-white/20 to-white/5 shadow-xl">
        <div className="bg-black/40 backdrop-blur-xl p-4 rounded-[10px] h-full flex items-center justify-between border border-white/10 relative z-10">
             <div className="flex items-center gap-4">
                <Avatar className="h-10 w-10 ring-2 ring-white/20">
                    <AvatarImage src={MOCK_USER.avatar} />
                </Avatar>
                <div>
                     <h4 className="text-white font-medium drop-shadow-sm">{MOCK_USER.name}</h4>
                     <p className="text-white/60 text-xs">Developing</p>
                </div>
             </div>
             <div className="text-right">
                  <div className="text-2xl font-light text-white tabular-nums tracking-wide">01:30</div>
                  <Badge variant="secondary" className="bg-white/10 text-white/90 hover:bg-white/20 border-0 backdrop-blur-sm">
                        Fix Auth Flow
                  </Badge>
             </div>
        </div>
        {/* Colorful blobs */}
        <div className="absolute top-0 right-0 w-32 h-32 bg-blue-500/30 rounded-full blur-[40px] -z-10" />
        <div className="absolute bottom-0 left-0 w-32 h-32 bg-purple-500/30 rounded-full blur-[40px] -z-10" />
    </div>
);

// 8. TIMELINE VIEW
const TimelineCard = () => (
    <div className="bg-card border p-3 rounded-lg flex flex-col gap-3">
        <div className="flex justify-between items-center">
             <div className="flex items-center gap-3">
                <Avatar className="h-8 w-8">
                    <AvatarImage src={MOCK_USER.avatar} />
                </Avatar>
                <div className="text-sm font-semibold">{MOCK_USER.name}</div>
             </div>
             <div className="font-mono text-sm font-bold text-primary">01:30:00</div>
        </div>
        
        {/* Timeline Visualization */}
        <div className="relative h-8 bg-muted/50 rounded-md w-full flex items-center px-1 overflow-hidden">
             {/* Time Markers */}
             <div className="absolute left-[10%] w-[1px] h-full bg-border" />
             <div className="absolute left-[30%] w-[1px] h-full bg-border" />
             <div className="absolute left-[50%] w-[1px] h-full bg-border" />
             <div className="absolute left-[70%] w-[1px] h-full bg-border" />
             
             {/* Current Work Block */}
             <div className="h-4 bg-primary/20 border border-primary/50 rounded-sm absolute left-[20%] w-[35%] flex items-center justify-center">
                 <span className="text-[9px] font-bold text-primary truncate px-1">Fix Auth Flow</span>
             </div>
             
             {/* Past Blocks */}
             <div className="h-4 bg-muted-foreground/20 rounded-sm absolute left-[5%] w-[10%]" />
        </div>
        <div className="flex justify-between text-[10px] text-muted-foreground font-mono">
            <span>09:00</span>
            <span>Current Time</span>
            <span>17:00</span>
        </div>
    </div>
);

// 9. DENSE / COMPACT
const DenseCard = () => (
    <div className="bg-card border rounded flex divide-x divide-border h-14">
        <div className="w-14 shrink-0 flex items-center justify-center p-2">
             <Avatar className="h-8 w-8 rounded-md">
                <AvatarImage src={MOCK_USER.avatar} />
            </Avatar>
        </div>
        <div className="p-2 flex flex-col justify-center min-w-[120px]">
             <h4 className="text-xs font-bold leading-none">{MOCK_USER.name}</h4>
             <span className="text-[10px] text-muted-foreground mt-1">Frontend Dev</span>
        </div>
        <div className="p-2 flex-1 flex flex-col justify-center bg-muted/10">
             <div className="flex justify-between items-center mb-1">
                 <span className="text-[10px] font-bold uppercase text-muted-foreground">Active Task</span>
                 <span className="text-[10px] font-mono">#402</span>
             </div>
             <p className="text-xs font-medium truncate">{MOCK_TICKET.title}</p>
        </div>
        <div className="p-2 flex flex-col justify-center items-end min-w-[80px]">
             <span className="text-xs font-bold font-mono">01:30</span>
             <span className="text-[10px] text-green-600 font-bold">+15% Vel.</span>
        </div>
        <div className="w-10 shrink-0 flex items-center justify-center bg-muted/30 hover:bg-primary hover:text-primary-foreground cursor-pointer transition-colors">
            <CheckCircle2 size={16} />
        </div>
    </div>
);

// 10. CARD / KANBAN
const KanbanCard = () => (
    <div className="bg-[#fef9c3] dark:bg-yellow-900/20 border-l-4 border-yellow-400 p-4 shadow-sm rounded-r-md relative rotate-0 hover:rotate-1 transition-transform origin-top-left">
        <div className="flex justify-between items-start mb-2">
            <div className="flex gap-1">
                 <span className="bg-yellow-200 dark:bg-yellow-800 text-yellow-800 dark:text-yellow-100 px-1.5 py-0.5 rounded text-[10px] uppercase font-bold tracking-wide">High Priority</span>
                 <span className="bg-white/50 dark:bg-black/20 px-1.5 py-0.5 rounded text-[10px] font-bold text-muted-foreground">Backend</span>
            </div>
            <Avatar className="h-6 w-6">
                <AvatarImage src={MOCK_USER.avatar} />
            </Avatar>
        </div>
        <h4 className="font-serif font-medium text-lg leading-tight mb-4 text-foreground/90">
             {MOCK_TICKET.title}
        </h4>
        <div className="flex items-center justify-between border-t border-yellow-500/20 pt-2 mt-2">
             <div className="flex items-center gap-1 text-xs font-mono text-muted-foreground">
                 <Clock size={12} /> 1h 30m
             </div>
             <div className="text-xs font-bold text-muted-foreground">#{MOCK_TICKET.id}</div>
        </div>
    </div>
);

// --- ROUND 2: TIMELINE ITERATIONS ---

// T1. GANTT ROW (Visual Blocks)
const TimelineGanttCard = () => (
    <div className="bg-card border rounded-xl p-4 flex flex-col gap-4 shadow-sm">
        <div className="flex justify-between items-center">
            <div className="flex items-center gap-3">
                <div className="relative">
                    <Avatar className="h-10 w-10 border-2 border-background shadow-sm">
                        <AvatarImage src={MOCK_USER.avatar} />
                    </Avatar>
                    <span className="absolute bottom-0 right-0 w-3 h-3 bg-green-500 border-2 border-background rounded-full" />
                </div>
                <div>
                    <h4 className="font-bold text-sm">{MOCK_USER.name}</h4>
                    <div className="flex items-center gap-2 text-xs text-muted-foreground">
                        <span className="font-medium text-green-600 bg-green-500/10 px-1.5 rounded">Online</span>
                        <span>•</span>
                        <span>Frontend</span>
                    </div>
                </div>
            </div>
            <div className="flex items-center gap-4">
                 <div className="text-right">
                     <p className="text-[10px] uppercase font-bold text-muted-foreground">Active Task</p>
                     <p className="text-sm font-medium">{MOCK_TICKET.title}</p>
                 </div>
                 <div className="bg-primary/10 text-primary px-3 py-1 rounded-md font-mono text-lg font-bold">
                     01:30
                 </div>
            </div>
        </div>

        {/* Gantt Bar */}
        <div className="space-y-1.5">
            <div className="flex justify-between text-[10px] font-bold text-muted-foreground uppercase tracking-wider">
                <span>9:00 AM</span>
                <span>Now</span>
                <span>5:00 PM</span>
            </div>
            <div className="h-8 bg-muted/30 rounded-md w-full flex overflow-hidden relative">
                {/* Done Blocks */}
                <div className="h-full bg-green-500/20 border-r border-green-500/30 flex items-center justify-center w-[15%]" title="Task A">
                    <CheckCircle2 size={12} className="text-green-600 opacity-50" />
                </div>
                <div className="h-full bg-green-500/20 border-r border-green-500/30 w-[20%]" />
                
                {/* Active Block */}
                <div className="h-full bg-blue-500/20 border-l-2 border-blue-500 w-[25%] relative group">
                    <div className="absolute inset-0 bg-blue-500/5 animate-pulse" />
                    <span className="absolute top-1 left-2 text-[10px] font-bold text-blue-600 truncate max-w-[90%]">Fix Auth</span>
                </div>

                {/* Queue Blocks (Implied) */}
                <div className="h-full border-r border-dashed border-border w-[15%]" />
                <div className="h-full border-r border-dashed border-border w-[10%]" />
            </div>
             <div className="flex justify-between items-center pt-1">
                <div className="flex gap-4 text-xs font-medium">
                    <span className="flex items-center gap-1.5 text-black/60 dark:text-white/60"><CheckCircle2 size={14} className="text-green-500" /> 2 Done</span>
                    <span className="flex items-center gap-1.5 text-black/60 dark:text-white/60"><Layout size={14} className="text-muted-foreground" /> 5 in Queue</span>
                </div>
            </div>
        </div>
    </div>
);

// T2. PROGRESS TRACK (Nodes)
const TimelineTrackCard = () => (
    <div className="bg-zinc-50 dark:bg-zinc-900 border border-zinc-200 dark:border-zinc-800 rounded-lg p-5 flex items-center gap-6">
        <div className="flex items-center gap-3 min-w-[180px]">
            <Avatar className="h-12 w-12">
                <AvatarImage src={MOCK_USER.avatar} />
            </Avatar>
            <div>
                <h4 className="font-bold text-base">{MOCK_USER.name}</h4>
                <div className="flex items-center gap-2 mt-0.5">
                    <span className="w-2 h-2 bg-green-500 rounded-full" />
                    <span className="text-xs text-muted-foreground font-medium">Online</span>
                </div>
            </div>
        </div>

        <div className="flex-1 flex flex-col gap-3">
             <div className="flex justify-between items-end">
                  <div>
                      <h5 className="text-xs font-bold text-blue-600 dark:text-blue-400 uppercase mb-0.5">Current Focus</h5>
                      <span className="text-lg font-bold leading-none">{MOCK_TICKET.title}</span>
                  </div>
                  <div className="text- right">
                      <span className="font-mono text-sm text-zinc-400 mr-2">Time Left:</span>
                      <span className="font-mono text-xl font-bold text-zinc-700 dark:text-zinc-200">2h 30m</span>
                  </div>
             </div>
             
             {/* Node Track */}
             <div className="relative flex items-center justify-between">
                 <div className="absolute left-0 top-1/2 w-full h-0.5 bg-zinc-200 dark:bg-zinc-800 -z-10" />
                 
                 {/* Past Nodes */}
                 {[1, 2].map(i => (
                     <div key={i} className="w-6 h-6 rounded-full bg-green-100 dark:bg-green-900 border-2 border-green-500 flex items-center justify-center z-10">
                         <CheckCircle2 size={12} className="text-green-600 dark:text-green-400" />
                     </div>
                 ))}

                 {/* Active Node (Large) */}
                 <div className="w-10 h-10 rounded-full bg-blue-500 border-4 border-white dark:border-zinc-950 shadow-lg flex items-center justify-center z-10 relative">
                      <Activity size={18} className="text-white animate-pulse" />
                      <div className="absolute -bottom-6 w-max text-[10px] font-bold text-blue-500">In Progress</div>
                 </div>

                 {/* Future Nodes */}
                 {[1, 2, 3, 4].map(i => (
                     <div key={i} className="w-3 h-3 rounded-full bg-zinc-200 dark:bg-zinc-800 border-2 border-zinc-300 dark:border-zinc-700 z-10" />
                 ))}
             </div>
        </div>

        <div className="flex flex-col gap-2 min-w-[80px] border-l pl-6 border-zinc-100 dark:border-zinc-800">
             <div className="text-center">
                 <div className="text-lg font-bold text-zinc-700 dark:text-zinc-300">2</div>
                 <div className="text-[10px] uppercase text-zinc-400 font-bold">Done</div>
             </div>
             <div className="text-center">
                 <div className="text-lg font-bold text-zinc-700 dark:text-zinc-300">5</div>
                 <div className="text-[10px] uppercase text-zinc-400 font-bold">Queue</div>
             </div>
        </div>
    </div>
);

// T3. DAY SCRUBBER (Video Editor Style)
const TimelineScrubberCard = () => (
    <div className="bg-[#1e1e20] text-zinc-200 rounded-xl overflow-hidden shadow-xl border border-white/5">
        <div className="flex items-center justify-between p-4 bg-[#27272a] border-b border-white/5">
            <div className="flex items-center gap-3">
                 <Avatar className="h-8 w-8 ring-1 ring-white/10">
                    <AvatarImage src={MOCK_USER.avatar} />
                </Avatar>
                <span className="font-medium text-sm">{MOCK_USER.name}</span>
                <Badge variant="outline" className="ml-2 bg-green-500/20 text-green-400 border-0 h-5 text-[10px]">ONLINE</Badge>
            </div>
            <div className="flex gap-6 text-xs text-zinc-400">
                <span>Passed: <strong className="text-white">2</strong></span>
                <span>Remaining: <strong className="text-white">5</strong></span>
            </div>
        </div>
        
        <div className="p-4 relative min-h-[100px] flex flex-col justify-center bg-[#1e1e20]">
             {/* Playhead */}
             <div className="absolute top-0 bottom-0 left-[40%] w-[1px] bg-red-500 z-20 flex flex-col items-center">
                 <div className="w-0 h-0 border-l-[6px] border-l-transparent border-r-[6px] border-r-transparent border-t-[8px] border-t-red-500" />
                 <div className="mt-auto mb-1 bg-red-500 text-white text-[9px] px-1 rounded font-mono">13:45</div>
             </div>

             {/* Tracks */}
             <div className="space-y-1 relative z-10">
                 {/* Task Track */}
                 <div className="h-10 bg-[#27272a] rounded overflow-hidden flex relative w-full">
                     {/* Clip 1 */}
                     <div className="absolute left-[5%] width-[15%] bg-zinc-700 h-full rounded-sm border-l-2 border-zinc-600 opacity-50 flex items-center px-2 text-[10px] truncate">
                        Setup
                     </div>
                     {/* Clip 2 */}
                     <div className="absolute left-[22%] width-[15%] bg-zinc-700 h-full rounded-sm border-l-2 border-zinc-600 opacity-50 flex items-center px-2 text-[10px] truncate">
                        DB Schema
                     </div>
                     {/* Active Clip */}
                     <div className="absolute left-[40%] w-[30%] bg-blue-600/20 border border-blue-500/50 h-full rounded-sm flex items-center px-3 gap-2">
                         <span className="text-blue-400 font-bold text-xs truncate">{MOCK_TICKET.title}</span>
                         <span className="ml-auto font-mono text-xs text-blue-200">1h 15m left</span>
                     </div>
                 </div>
                 
                 {/* Time Ruler */}
                 <div className="flex justify-between px-1 text-[9px] font-mono text-zinc-600 select-none">
                     <span>09:00</span>
                     <span>10:00</span>
                     <span>11:00</span>
                     <span>12:00</span>
                     <span>13:00</span>
                     <span>14:00</span>
                     <span>15:00</span>
                     <span>16:00</span>
                 </div>
             </div>
        </div>
    </div>
);

// T4. SPLIT STATS (Linear Bottom)
const TimelineSplitCard = () => (
    <div className="bg-card border shadow-sm rounded-lg overflow-hidden flex flex-col">
        <div className="flex-1 flex divide-x divide-border">
            {/* Left: Active Task (Wide) */}
            <div className="flex-1 p-5 flex flex-col justify-center gap-1">
                <div className="flex items-center gap-3 mb-2">
                    <Avatar className="h-8 w-8">
                        <AvatarImage src={MOCK_USER.avatar} />
                    </Avatar>
                    <div>
                         <h4 className="font-bold text-sm leading-none">{MOCK_USER.name}</h4>
                         <p className="text-[10px] text-muted-foreground mt-0.5">Online</p>
                    </div>
                </div>
                <h3 className="text-xl font-bold truncate">{MOCK_TICKET.title}</h3>
                <div className="flex items-center gap-2 text-sm text-primary font-mono font-medium">
                    <Clock size={14} />
                    <span>01:30:12</span>
                    <span className="text-muted-foreground">/ 4h est</span>
                </div>
            </div>

            {/* Right: Stats (Narrow) */}
            <div className="w-[140px] bg-muted/30 p-4 flex flex-col justify-center gap-3">
                <div className="flex justify-between items-center">
                    <span className="text-xs font-medium text-muted-foreground">Done</span>
                    <span className="bg-green-100 dark:bg-green-900 text-green-700 dark:text-green-300 text-xs font-bold px-1.5 py-0.5 rounded">3</span>
                </div>
                <div className="flex justify-between items-center">
                    <span className="text-xs font-medium text-muted-foreground">Queue</span>
                    <span className="bg-zinc-200 dark:bg-zinc-800 text-zinc-700 dark:text-zinc-300 text-xs font-bold px-1.5 py-0.5 rounded">5</span>
                </div>
            </div>
        </div>

        {/* Bottom Timeline Bar */}
        <div className="h-6 bg-muted/50 border-t flex relative">
            <div className="absolute top-0 bottom-0 left-0 w-[40%] bg-gradient-to-r from-green-500 to-emerald-500 opacity-30" />
            <div className="absolute top-0 bottom-0 left-[40%] w-[25%] bg-blue-500 opacity-90 flex items-center justify-center">
                 <div className="w-1 h-1 bg-white rounded-full animate-ping" />
            </div>
            {/* Markers */}
            {[0, 25, 50, 75, 100].map(p => (
                 <div key={p} className="absolute top-0 bottom-0 border-r border-background/50 h-full" style={{ left: `${p}%` }} />
            ))}
        </div>
    </div>
);

// T5. INTEGRATED STATUS (Border Timeline)
const TimelineIntegratedCard = () => (
    <div className="bg-card rounded-lg shadow-md hover:shadow-lg transition-shadow overflow-hidden group">
        <div className="p-5 flex items-center justify-between">
             <div className="flex items-center gap-4">
                <div className="relative">
                     <Avatar className="h-12 w-12 border-2 border-white dark:border-zinc-800 shadow-sm">
                        <AvatarImage src={MOCK_USER.avatar} />
                    </Avatar>
                    <div className="absolute -bottom-1 -right-1 flex gap-0.5">
                         <span className="bg-background text-[10px] font-bold border border-border px-1 rounded-sm shadow-sm flex items-center">
                            3 <CheckCircle2 size={8} className="ml-0.5" />
                         </span>
                    </div>
                </div>
                <div className="space-y-1">
                    <h4 className="font-bold">{MOCK_USER.name}</h4>
                    <div className="flex items-center gap-2">
                         <div className="text-xs bg-blue-100 dark:bg-blue-900/30 text-blue-700 dark:text-blue-300 px-2 py-0.5 rounded-full font-medium flex items-center gap-1.5">
                             <div className="w-1.5 h-1.5 bg-blue-500 rounded-full animate-pulse" />
                             Fixing Auth Flow
                         </div>
                    </div>
                </div>
             </div>

             <div className="flex flex-col items-end gap-1">
                 <div className="text-2xl font-mono font-bold tracking-tighter">1h 15m</div>
                 <div className="text-xs text-muted-foreground font-medium">Time Left • 5 in Queue</div>
             </div>
        </div>
        
        {/* The Timeline is the bottom border essentially */}
        <div className="h-2 w-full bg-zinc-100 dark:bg-zinc-800 flex">
             <div className="h-full bg-green-500 w-[30%]" title="Done" />
             <div className="h-full bg-blue-500 w-[40%] relative" title="Active">
                 <div className="absolute right-0 top-0 bottom-0 w-[2px] bg-white dark:bg-black opacity-50" />
             </div>
             <div className="h-full bg-transparent w-[30%]" title="Remaining" />
        </div>
    </div>
);

// T6. RADIAL TIMELINE (Minimal)
const TimelineRadialCard = () => (
    <div className="bg-card border rounded-2xl p-4 flex items-center gap-6">
         {/* Radial Progress */}
         <div className="relative h-16 w-16 shrink-0 flex items-center justify-center">
             <svg className="h-full w-full rotate-[-90deg]" viewBox="0 0 36 36">
                 {/* Background Circle */}
                 <path className="text-muted/30" d="M18 2.0845 a 15.9155 15.9155 0 0 1 0 31.831 a 15.9155 15.9155 0 0 1 0 -31.831" fill="none" stroke="currentColor" strokeWidth="3" />
                 {/* Progress Arc (75%) */}
                 <path className="text-blue-500" strokeDasharray="60, 100" d="M18 2.0845 a 15.9155 15.9155 0 0 1 0 31.831 a 15.9155 15.9155 0 0 1 0 -31.831" fill="none" stroke="currentColor" strokeWidth="3" strokeLinecap="round" />
             </svg>
             <div className="absolute inset-0 flex items-center justify-center flex-col">
                 <span className="text-[10px] font-bold text-muted-foreground">LEFT</span>
                 <span className="text-xs font-bold font-mono">2h</span>
             </div>
         </div>

         <div className="flex-1 min-w-0">
             <div className="flex justify-between items-start mb-1">
                 <h4 className="font-bold truncate pr-4">{MOCK_TICKET.title}</h4>
                 <div className="flex gap-2 shrink-0">
                     <Badge variant="secondary" className="text-[10px] h-5">3 Done</Badge>
                     <Badge variant="outline" className="text-[10px] h-5">5 Left</Badge>
                 </div>
             </div>
             <div className="flex items-center gap-2 mt-1">
                <Avatar className="h-5 w-5">
                    <AvatarImage src={MOCK_USER.avatar} />
                </Avatar>
                <span className="text-xs text-muted-foreground">{MOCK_USER.name} <span className="text-green-500">• Online</span></span>
             </div>
         </div>
    </div>
);

// --- ROUND 3: GANTT ITERATIONS ---

// G1. CLEAN & MUTED (Refined Original)
const GanttCleanCard = () => (
    <div className="bg-card border rounded-xl p-4 flex flex-col gap-3 shadow-sm hover:border-border/80 transition-colors">
        <div className="flex justify-between items-center">
            <div className="flex items-center gap-3">
                <div className="relative">
                    <Avatar className="h-9 w-9 border border-background shadow-sm">
                        <AvatarImage src={MOCK_USER.avatar} />
                    </Avatar>
                    <span className="absolute -bottom-0.5 -right-0.5 w-2.5 h-2.5 bg-green-500 border-2 border-background rounded-full" />
                </div>
                <div>
                    <h4 className="font-bold text-sm leading-none">{MOCK_USER.name}</h4>
                    <span className="text-[10px] text-muted-foreground font-medium mt-1 block">Online</span>
                </div>
            </div>
            <div className="flex items-center gap-6">
                 <div className="text-right">
                     <div className="flex items-center justify-end gap-2 mb-0.5">
                        <span className="w-1.5 h-1.5 rounded-full bg-blue-500 animate-pulse" />
                        <p className="text-xs font-bold text-foreground">{MOCK_TICKET.title}</p>
                     </div>
                     <p className="text-[10px] text-muted-foreground font-mono">1h 15m remaining</p>
                 </div>
            </div>
        </div>

        {/* Gantt Bar */}
        <div className="space-y-2">
            <div className="h-6 bg-zinc-100 dark:bg-zinc-800/50 rounded-sm w-full flex overflow-hidden">
                {/* Done Block 1 */}
                <div className="h-full bg-emerald-500/10 border-r border-emerald-500/20 w-[18%] flex items-center justify-center group relative cursor-help">
                    <CheckCircle2 size={10} className="text-emerald-600/70" />
                    <span className="opacity-0 group-hover:opacity-100 absolute -top-6 bg-black text-white text-[9px] px-1.5 py-0.5 rounded transition-opacity whitespace-nowrap">Task A</span>
                </div>
                {/* Done Block 2 */}
                <div className="h-full bg-emerald-500/10 border-r border-emerald-500/20 w-[12%] group relative cursor-help" />
                
                {/* Active Block */}
                <div className="h-full bg-blue-50 dark:bg-blue-900/10 border-l-[3px] border-blue-500 w-[35%] relative flex items-center px-2">
                    <span className="text-[9px] font-bold text-blue-600 dark:text-blue-400 truncate">Current Task</span>
                </div>

                {/* Future Space */}
                <div className="h-full w-[35%] flex">
                    <div className="h-full w-[20%] border-r border-dashed border-border" />
                    <div className="h-full w-[30%] border-r border-dashed border-border" />
                </div>
            </div>
            
            <div className="flex justify-between items-center px-0.5">
                 <div className="flex gap-4 text-[10px] font-medium text-muted-foreground uppercase tracking-wider">
                     <span>09:00</span>
                     <span>Current Time</span>
                     <span>18:00</span>
                 </div>
                 <div className="flex gap-3 text-[10px] font-medium">
                    <span className="text-emerald-600 dark:text-emerald-400">2 Done</span>
                    <span className="text-muted-foreground">4 Queued</span>
                 </div>
            </div>
        </div>
    </div>
);

// G2. BLOCKY & VIBRANT (Distinct Segments)
const GanttBlockyCard = () => (
    <div className="bg-white dark:bg-zinc-900 border border-zinc-200 dark:border-zinc-800 rounded-lg p-3">
        <div className="flex items-center gap-3 mb-3">
            <Avatar className="h-8 w-8 rounded-md">
                <AvatarImage src={MOCK_USER.avatar} />
            </Avatar>
            <div className="flex-1 min-w-0">
                <div className="flex items-center justify-between">
                    <h4 className="font-bold text-sm truncate">{MOCK_USER.name}</h4>
                    <span className="font-mono text-xs font-bold bg-zinc-100 dark:bg-zinc-800 px-1.5 py-0.5 rounded text-zinc-600 dark:text-zinc-400">01:30</span>
                </div>
            </div>
        </div>

        <div className="bg-zinc-100 dark:bg-zinc-950 p-1.5 rounded-md space-y-2">
             <div className="flex gap-1 h-8 w-full">
                 {/* Past */}
                 <div className="flex-1 bg-zinc-300 dark:bg-zinc-800 rounded-sm flex items-center justify-center text-zinc-500">
                     <CheckCircle2 size={12} />
                 </div>
                 <div className="flex-[0.5] bg-zinc-300 dark:bg-zinc-800 rounded-sm" />
                 
                 {/* Current */}
                 <div className="flex-[2] bg-indigo-500 rounded-sm flex items-center justify-between px-2 text-white relative overflow-hidden">
                     <div className="absolute inset-0 bg-[linear-gradient(45deg,transparent_25%,rgba(255,255,255,0.1)_50%,transparent_75%)] bg-[length:10px_10px]" />
                     <span className="text-[10px] font-bold z-10 truncate max-w-[80%]">{MOCK_TICKET.title}</span>
                     <Activity size={10} className="z-10 animate-pulse" />
                 </div>

                 {/* Future */}
                 <div className="flex-1 bg-zinc-200 dark:bg-zinc-900/50 border border-zinc-300 dark:border-zinc-800 rounded-sm border-dashed" />
                 <div className="flex-1 bg-zinc-200 dark:bg-zinc-900/50 border border-zinc-300 dark:border-zinc-800 rounded-sm border-dashed" />
             </div>
        </div>

        <div className="flex justify-between items-center mt-2 px-1">
             <Badge variant="secondary" className="text-[9px] h-4 px-1 text-muted-foreground rounded-sm">2 Completed</Badge>
             <Badge variant="outline" className="text-[9px] h-4 px-1 text-zinc-400 border-zinc-200 dark:border-zinc-800 rounded-sm">5 Pending</Badge>
        </div>
    </div>
);

// G3. SLIM & MINIMAL (Compact)
const GanttSlimCard = () => (
    <div className="bg-card border rounded-md p-3 flex items-center gap-4">
        <Avatar className="h-8 w-8">
            <AvatarImage src={MOCK_USER.avatar} />
        </Avatar>
        
        <div className="flex-1 space-y-1.5">
            <div className="flex justify-between items-center">
                 <h4 className="font-bold text-xs">{MOCK_USER.name}</h4>
                 <div className="flex items-center gap-1.5">
                      <span className="w-1.5 h-1.5 bg-green-500 rounded-full" />
                      <span className="text-[10px] font-medium text-foreground">{MOCK_TICKET.title}</span>
                      <span className="text-[10px] text-muted-foreground font-mono ml-1">(-1h 30m)</span>
                 </div>
            </div>
            
            {/* Slim Track */}
            <div className="h-2 w-full bg-muted rounded-full flex overflow-hidden">
                <div className="w-[15%] bg-zinc-400 dark:bg-zinc-600" />
                <div className="w-[10%] bg-zinc-400 dark:bg-zinc-600 border-l border-background" />
                <div className="w-[30%] bg-primary relative">
                    <div className="absolute right-0 top-0 bottom-0 w-0.5 bg-white opacity-50" />
                </div>
                <div className="flex-1" />
            </div>
        </div>

        <div className="text-[10px] font-bold text-muted-foreground flex flex-col items-center leading-tight">
            <span>2 Done</span>
            <span>4 Left</span>
        </div>
    </div>
);

// G4. DETAILED TIMELINE (Ruler High-Tech)
const GanttDetailedCard = () => (
    <div className="bg-zinc-950 text-zinc-300 border border-zinc-800 rounded-lg overflow-hidden font-mono">
        <div className="flex items-center justify-between p-3 border-b border-zinc-900 bg-zinc-900/50">
             <div className="flex items-center gap-2">
                 <div className="w-2 h-2 bg-green-500 rounded-sm" />
                 <span className="text-zinc-100 font-bold text-xs tracking-wide uppercase">{MOCK_USER.name}</span>
             </div>
             <div className="text-[10px] text-zinc-500">
                 EST COMPLETE: <span className="text-zinc-300">17:30</span>
             </div>
        </div>
        
        <div className="p-3 relative">
            {/* Grid Lines */}
            <div className="absolute inset-0 flex justify-between px-3 pointer-events-none opacity-10">
                <div className="w-px h-full bg-zinc-500" />
                <div className="w-px h-full bg-zinc-500" />
                <div className="w-px h-full bg-zinc-500" />
                <div className="w-px h-full bg-zinc-500" />
            </div>

            <div className="flex items-center gap-2 mb-2">
                 <span className="text-blue-400 font-bold text-xs">ACTIVE:</span>
                 <span className="text-white text-xs truncate">{MOCK_TICKET.title}</span>
            </div>

            {/* The Bar */}
            <div className="h-5 w-full bg-zinc-900 border border-zinc-800 relative mb-1">
                {/* Past */}
                <div className="absolute left-0 h-full w-[25%] bg-zinc-800 border-r border-black flex items-center justify-center">
                    <span className="text-[8px] opacity-50">DONE</span>
                </div>
                {/* Active */}
                <div className="absolute left-[25%] h-full w-[40%] bg-blue-900/30 border border-blue-500/50 flex items-center justify-between px-1">
                    <div className="w-full h-[1px] bg-blue-500/50 absolute top-1/2 left-0" />
                    <span className="text-[8px] text-blue-400 bg-zinc-950 relative z-10 px-0.5">NOW</span>
                    <span className="text-[8px] text-blue-400 bg-zinc-950 relative z-10 px-0.5">1h 15m</span>
                </div>
            </div>

            <div className="flex justify-between text-[9px] text-zinc-600">
                 <span>09:00</span>
                 <span>ACTIVE (40%)</span>
                 <span>18:00</span>
            </div>
        </div>
    </div>
);

// G5. SOFT & ROUNDED (Friendly Gantt)
const GanttSoftCard = () => (
    <div className="bg-card border-2 border-transparent hover:border-violet-100 dark:hover:border-violet-900/50 transition-colors rounded-2xl p-4 shadow-[0_2px_8px_rgba(0,0,0,0.04)]">
        <div className="flex items-start justify-between mb-4">
             <div className="flex items-center gap-3">
                 <Avatar className="h-10 w-10">
                    <AvatarImage src={MOCK_USER.avatar} />
                </Avatar>
                <div>
                     <h4 className="font-bold text-sm">{MOCK_USER.name}</h4>
                     <p className="text-xs text-muted-foreground flex items-center gap-1">
                         <span className="w-1.5 h-1.5 bg-green-400 rounded-full" /> Online
                     </p>
                </div>
             </div>
             <div className="text-right">
                  <span className="bg-violet-50 dark:bg-violet-900/20 text-violet-600 dark:text-violet-300 px-2 py-0.5 rounded-full text-[10px] font-bold uppercase tracking-wide">In Progress</span>
                  <div className="font-mono text-sm font-bold mt-0.5">01:30</div>
             </div>
        </div>

        <div className="bg-zinc-50 dark:bg-zinc-900/50 rounded-xl p-3">
             <div className="flex justify-between items-center mb-2">
                 <span className="text-xs font-semibold truncate max-w-[200px]">{MOCK_TICKET.title}</span>
                 <span className="text-[10px] text-muted-foreground">3 / 8 Tasks</span>
             </div>
             
             {/* Pill Track */}
             <div className="flex gap-1 h-3 w-full">
                 <div className="w-[10%] bg-violet-200 dark:bg-violet-900 rounded-l-full" />
                 <div className="w-[15%] bg-violet-200 dark:bg-violet-900" />
                 <div className="w-[5%] bg-violet-200 dark:bg-violet-900" />
                 
                 {/* Current */}
                 <div className="w-[30%] bg-violet-500 rounded-full relative shadow-sm hover:w-[40%] transition-all duration-300" />

                 <div className="flex-1 bg-zinc-200 dark:bg-zinc-800 rounded-r-full" />
             </div>
        </div>
    </div>
);


export const DeveloperCardVariants = () => {
    return (
        <div className="grid grid-cols-1 gap-8 max-w-4xl mx-auto pb-20">
            <div className="text-center py-6">
                 <h2 className="text-2xl font-bold">Developer Card Concepts</h2>
                 <p className="text-muted-foreground">Original 10 concepts below.</p>
            </div>

            {/* ROUND 3: GANTT ITERATIONS */}
            <div className="bg-white dark:bg-zinc-900/30 p-6 rounded-2xl border-2 border-blue-500/20 shadow-sm space-y-6">
                 <div className="flex items-center gap-2 mb-4">
                     <Layout className="text-blue-500" />
                     <h2 className="text-xl font-bold">Round 3: Gantt Row Iterations</h2>
                 </div>
                 
                 <VariantContainer title="G1. Clean & Muted (Refined Original)">
                    <GanttCleanCard />
                 </VariantContainer>

                 <VariantContainer title="G2. Blocky & Vibrant (Segments)">
                    <GanttBlockyCard />
                 </VariantContainer>

                 <VariantContainer title="G3. Slim & Minimal (Compact)">
                    <GanttSlimCard />
                 </VariantContainer>

                 <VariantContainer title="G4. Detailed Timeline (High-Tech)">
                    <GanttDetailedCard />
                 </VariantContainer>

                 <VariantContainer title="G5. Soft & Rounded (Friendly)">
                    <GanttSoftCard />
                 </VariantContainer>
            </div>

            {/* NEW TIMELINE ITERATIONS */}
            <div className="bg-zinc-50 dark:bg-zinc-900/50 p-6 rounded-2xl border-2 border-dashed border-zinc-200 dark:border-zinc-800 space-y-6">
                 <div className="flex items-center gap-2 mb-4">
                     <Clock className="text-blue-500" />
                     <h2 className="text-xl font-bold">Round 2: Timeline Iterations</h2>
                 </div>

                 <VariantContainer title="T1. Gantt Row (Visual Blocks)">
                    <TimelineGanttCard />
                 </VariantContainer>
{/* ... remaining items ... */}

                 <VariantContainer title="T2. Progress Track (Nodes)">
                    <TimelineTrackCard />
                 </VariantContainer>

                 <VariantContainer title="T3. Day Scrubber (Video Editor)">
                    <TimelineScrubberCard />
                 </VariantContainer>

                 <VariantContainer title="T4. Split Stats (Linear Bottom)">
                    <TimelineSplitCard />
                 </VariantContainer>

                 <VariantContainer title="T5. Integrated Status (Border Timeline)">
                    <TimelineIntegratedCard />
                 </VariantContainer>

                 <VariantContainer title="T6. Radial Timeline (Minimal)">
                    <TimelineRadialCard />
                 </VariantContainer>
            </div>


            <div className="text-center py-6 border-t mt-8">
                 <h3 className="text-lg font-bold text-muted-foreground">Original Round 1 Concepts</h3>
            </div>

            <VariantContainer title="1. Minimalist (Clean & Flat)">
                <MinimalistCard />
            </VariantContainer>

            <VariantContainer title="2. Gamified (XP & Streaks)">
                <GamifiedCard />
            </VariantContainer>

            <VariantContainer title="3. Cyberpunk / Neon (High Contrast)">
                <CyberpunkCard />
            </VariantContainer>

            <VariantContainer title="4. Data Driven (Analytics)">
                <AnalyticsCard />
            </VariantContainer>

            <VariantContainer title="5. Focus Mode (Timer Dominant)">
                <FocusModeCard />
            </VariantContainer>

            <VariantContainer title="6. Social / Human (Connective)">
                <SocialCard />
            </VariantContainer>

            <VariantContainer title="7. Glassmorphism (Modern UI)">
                <GlassCard />
            </VariantContainer>

            <VariantContainer title="8. Timeline (Chronological)">
                <TimelineCard />
            </VariantContainer>

            <VariantContainer title="9. Dense (Power User)">
                <DenseCard />
            </VariantContainer>

            <VariantContainer title="10. Physical Card (Kanban Style)">
                <KanbanCard />
            </VariantContainer>
        </div>
    );
};
