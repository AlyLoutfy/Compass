
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/Avatar';
import { Button } from '@/components/ui/Button';
import { Card } from '@/components/ui/Card';
import { Badge } from '@/components/ui/Badge';
import { 
    Play, 
    MoreHorizontal, 
    CircleDot, GripVertical, Plus
} from 'lucide-react';
import { cn } from '@/lib/utils';

// --- MOCK DATA ---
const MOCK_USER = {
    name: "Alex Chen",
    role: "Frontend Lead",
    avatar: "https://i.pravatar.cc/150?u=alex",
    status: "online",
    stats: { completed: 12, velocity: "High" }
};

const MOCK_TASKS = {
    active: { id: "t1", title: "Integrate Payment Gateway", category: "feature", priority: "high", started: "2h ago" },
    queued: [
        { id: "t2", title: "Fix Mobile Menu Animation", category: "bug", priority: "medium" },
        { id: "t3", title: "Update Documentation", category: "chore", priority: "low" },
        { id: "t4", title: "Review PR #420", category: "review", priority: "medium" }
    ],
    completed: [
        { id: "c1", title: "Setup Project Repo" },
        { id: "c2", title: "Configure CI/CD Pipeline" }
    ]
};

// --- SHARED HELPERS ---
const StatusDot = ({ status }: { status: string }) => (
    <div className={cn("h-2.5 w-2.5 rounded-full border border-background", 
        status === 'online' ? "bg-emerald-500" : "bg-zinc-400")} 
    />
);

// --- VARIANTS ---

// 1. Classic Enhanced (Current + Polish)
const VariantClassic = () => (
    <Card className="p-4 w-[320px] bg-card border-border shadow-sm flex flex-col gap-4">
        <div className="flex items-center gap-3">
            <div className="relative">
                <Avatar className="h-10 w-10 border-2 border-transparent ring-2 ring-primary/10">
                    <AvatarImage src={MOCK_USER.avatar} />
                    <AvatarFallback>AC</AvatarFallback>
                </Avatar>
                <div className="absolute bottom-0 right-0"><StatusDot status={MOCK_USER.status} /></div>
            </div>
            <div>
                <h3 className="font-bold text-sm">{MOCK_USER.name}</h3>
                <p className="text-xs text-muted-foreground">{MOCK_USER.role}</p>
            </div>
        </div>

        <div className="space-y-3">
            <div>
                <p className="text-[10px] font-bold text-muted-foreground uppercase tracking-wider mb-2">Current Focus</p>
                <div className="bg-primary/5 border border-primary/20 rounded-md p-3 relative group">
                    <div className="flex items-start gap-2">
                        <div className="mt-1 h-2 w-2 rounded-full bg-primary animate-pulse" />
                        <div className="flex-1">
                            <p className="text-sm font-medium leading-tight text-foreground">{MOCK_TASKS.active.title}</p>
                            <div className="flex items-center gap-2 mt-2">
                                <Badge variant="secondary" className="text-[10px] h-5">In Progress</Badge>
                                <span className="text-[10px] text-muted-foreground">{MOCK_TASKS.active.started}</span>
                            </div>
                        </div>
                    </div>
                </div>
            </div>

            <div>
                <p className="text-[10px] font-bold text-muted-foreground uppercase tracking-wider mb-1">Up Next</p>
                <div className="space-y-1">
                    {MOCK_TASKS.queued.slice(0, 2).map(t => (
                        <div key={t.id} className="flex items-center gap-2 p-2 rounded hover:bg-zinc-100 dark:hover:bg-zinc-800/50 text-xs text-muted-foreground hover:text-foreground transition-colors border-l-2 border-transparent hover:border-zinc-300 dark:hover:border-zinc-700 pl-2">
                            <CircleDot size={12} />
                            <span className="truncate">{t.title}</span>
                        </div>
                    ))}
                </div>
                <Button variant="ghost" size="sm" className="w-full h-7 text-[10px] mt-2 text-muted-foreground">+ Add Task</Button>
            </div>
        </div>
    </Card>
);

// 2. The "Timeline" (Vertical flow)
const VariantTimeline = () => (
    <Card className="p-0 w-[320px] overflow-hidden bg-zinc-50/50 dark:bg-zinc-900/50 border-border">
        <div className="p-4 bg-white dark:bg-zinc-900 border-b flex justify-between items-center">
            <div className="flex items-center gap-2">
                <Avatar className="h-8 w-8"><AvatarImage src={MOCK_USER.avatar} /></Avatar>
                <div className="font-semibold text-sm">{MOCK_USER.name}</div>
            </div>
            <Badge variant="outline" className="text-[10px] font-mono">ON TRACK</Badge>
        </div>
        
        <div className="p-4 relative">
             {/* Timeline Line */}
             <div className="absolute left-[27px] top-4 bottom-4 w-0.5 bg-zinc-200 dark:bg-zinc-800" />

             <div className="space-y-6 relative z-10">
                {/* Active */}
                <div className="flex gap-4">
                    <div className="mt-1 h-6 w-6 rounded-full bg-primary/20 text-primary flex items-center justify-center border-2 border-background ring-2 ring-primary/20">
                        <Play size={10} fill="currentColor" />
                    </div>
                    <div>
                        <p className="text-xs font-bold text-primary mb-1 uppercase tracking-wide">Now</p>
                        <div className="bg-white dark:bg-zinc-900 p-2.5 rounded-lg border shadow-sm w-[230px]">
                            <span className="text-sm font-medium">{MOCK_TASKS.active.title}</span>
                        </div>
                    </div>
                </div>

                {/* Next */}
                {MOCK_TASKS.queued.map((t) => (
                    <div key={t.id} className="flex gap-4 opacity-70">
                         <div className="mt-1 h-2 w-2 rounded-full bg-zinc-300 dark:bg-zinc-700 ml-2 border border-background ring-4 ring-background" />
                         <div className="w-[230px]">
                            <p className="text-sm text-zinc-600 dark:text-zinc-400">{t.title}</p>
                         </div>
                    </div>
                ))}
             </div>
        </div>
    </Card>
);

// 3. The "Focus Deck" (Stacked Cards)
const VariantFocusDeck = () => (
    <Card className="p-4 w-[320px] bg-gradient-to-br from-zinc-50 to-zinc-100 dark:from-zinc-900 dark:to-zinc-950 border-border">
        <div className="flex justify-between items-start mb-6">
            <div className="flex gap-3">
                <Avatar className="h-10 w-10"><AvatarImage src={MOCK_USER.avatar} /></Avatar>
                <div>
                     <h3 className="font-bold">{MOCK_USER.name}</h3>
                     <div className="flex items-center gap-1.5 text-xs text-muted-foreground">
                        <span className="h-1.5 w-1.5 rounded-full bg-green-500" />
                        Working
                     </div>
                </div>
            </div>
            <Button size="icon" variant="ghost" className="h-6 w-6"><MoreHorizontal size={14} /></Button>
        </div>

        <div className="relative min-h-[140px]">
            {/* Background Stack Cards */}
            <div className="absolute top-2 left-2 right-2 bg-white dark:bg-zinc-800 h-24 rounded-xl border border-border shadow-sm opacity-60 scale-95 origin-bottom z-0" />
            <div className="absolute top-1 left-1 right-1 bg-white dark:bg-zinc-800 h-24 rounded-xl border border-border shadow-sm opacity-80 scale-[0.98] origin-bottom z-10" />
            
            {/* Main Active Card */}
            <div className="relative z-20 bg-white dark:bg-zinc-800 p-4 rounded-xl border border-border shadow-lg">
                <div className="flex justify-between items-start mb-2">
                    <Badge variant="default" className="bg-amber-500 hover:bg-amber-600 border-none text-white text-[10px]">IN PROGRESS</Badge>
                    <span className="text-[10px] text-muted-foreground font-mono">01:42:05</span>
                </div>
                <h4 className="font-bold text-sm leading-tight mb-2">{MOCK_TASKS.active.title}</h4>
                <div className="flex items-center gap-2 mt-3 pt-3 border-t border-dashed border-border/50">
                    <span className="text-xs text-muted-foreground flex items-center gap-1">
                        Up next: <span className="text-foreground font-medium truncate max-w-[120px]">{MOCK_TASKS.queued[0].title}</span>
                    </span>
                    <Badge variant="secondary" className="ml-auto text-[10px] h-5 rounded-full px-1.5">+{MOCK_TASKS.queued.length - 1}</Badge>
                </div>
            </div>
        </div>
    </Card>
);

// 4. The "Kanban List" (Clean, structured)
const VariantKanbanList = () => (
    <Card className="w-[320px] overflow-hidden border-border bg-card">
        <div className="p-3 bg-zinc-100 dark:bg-zinc-900 border-b flex items-center gap-2">
            <Avatar className="h-6 w-6"><AvatarImage src={MOCK_USER.avatar} /></Avatar>
            <span className="font-semibold text-xs">{MOCK_USER.name}</span>
            <span className="ml-auto text-[10px] text-muted-foreground font-mono">FE-TEAM</span>
        </div>
        <div className="p-2 space-y-2">
            <div className="bg-white dark:bg-zinc-950 border border-l-4 border-l-amber-500 rounded p-2 shadow-sm">
                <p className="text-xs font-medium">{MOCK_TASKS.active.title}</p>
                <div className="flex justify-between items-center mt-2">
                    <span className="text-[10px] bg-amber-100 dark:bg-amber-900/30 text-amber-600 px-1.5 rounded">Active</span>
                </div>
            </div>
            {MOCK_TASKS.queued.map(t => (
                 <div key={t.id} className="bg-zinc-50 dark:bg-zinc-900 border border-l-4 border-l-zinc-300 dark:border-l-zinc-700 rounded p-2 opacity-80 hover:opacity-100 transition-opacity">
                    <p className="text-xs text-muted-foreground">{t.title}</p>
                 </div>
            ))}
            <div className="border-2 border-dashed border-zinc-200 dark:border-zinc-800 rounded p-1.5 flex justify-center text-muted-foreground hover:text-foreground hover:border-zinc-300 transition-colors cursor-pointer">
                <Plus size={14} />
            </div>
        </div>
    </Card>
);

// 5. The "Minimal Row" (Horizontal emphasis)
const VariantMinimalRow = () => (
    <Card className="w-[320px] px-4 py-3 border-border shadow-sm hover:shadow-md transition-shadow">
        <div className="flex justify-between items-center mb-3">
             <div className="flex items-center gap-2">
                <div className="h-8 w-8 rounded-lg bg-zinc-100 dark:bg-zinc-800 overflow-hidden">
                    <img src={MOCK_USER.avatar} alt="" className="h-full w-full object-cover" />
                </div>
                <div>
                    <div className="font-bold text-sm leading-none">{MOCK_USER.name}</div>
                    <div className="text-[10px] text-muted-foreground mt-0.5">3 tasks pending</div>
                </div>
             </div>
             <Button size="icon" variant="ghost" className="h-6 w-6 rounded-full"><Plus size={14} /></Button>
        </div>
        
        <div className="space-y-1">
            <div className="flex items-center gap-3 p-2 bg-zinc-900 dark:bg-zinc-50 text-white dark:text-black rounded-md">
                 <div className="h-1.5 w-1.5 rounded-full bg-green-500 animate-pulse box-content border-2 border-transparent" />
                 <span className="text-xs font-medium truncate">{MOCK_TASKS.active.title}</span>
            </div>
            <div className="pl-9 pr-2 py-1 flex flex-col gap-1.5">
                {MOCK_TASKS.queued.map(t => (
                    <div key={t.id} className="flex items-center gap-2 text-xs text-muted-foreground group cursor-grab">
                        <GripVertical size={10} className="opacity-0 group-hover:opacity-100" />
                        <span className="truncate">{t.title}</span>
                    </div>
                ))}
            </div>
        </div>
    </Card>
);

// 6. The "Terminal" (Developer focused)
const VariantTerminal = () => (
    <Card className="w-[320px] bg-[#1e1e1e] border-zinc-800 font-mono text-zinc-300 shadow-xl rounded-none border-t-2 border-t-green-500">
        <div className="px-3 py-2 bg-[#252526] flex items-center justify-between text-[10px]">
             <span>user: {MOCK_USER.name.toLowerCase().replace(' ', '_')}</span>
             <div className="flex gap-1.5">
                <div className="h-2 w-2 rounded-full bg-yellow-500" />
                <div className="h-2 w-2 rounded-full bg-green-500" />
             </div>
        </div>
        <div className="p-3 text-xs space-y-3">
            <div>
                <div className="text-zinc-500 mb-1">$ current_task --status=active</div>
                <div className="text-green-400 font-bold">{'>'} {MOCK_TASKS.active.title}</div>
            </div>
            <div>
                 <div className="text-zinc-500 mb-1">$ queue --list</div>
                 <div className="pl-2 space-y-1 opacity-80">
                    {MOCK_TASKS.queued.map((t, i) => (
                        <div key={t.id} className="flex gap-2">
                            <span>[{i+1}]</span>
                            <span className="text-zinc-400">{t.title}</span>
                        </div>
                    ))}
                 </div>
            </div>
        </div>
    </Card>
);

// 7. The "Gamified" (Badges & Progress)
const VariantGamified = () => (
    <Card className="w-[320px] p-1 overflow-hidden bg-gradient-to-r from-indigo-500 to-purple-600 border-none text-white">
        <div className="bg-white dark:bg-zinc-950 h-full w-full rounded-lg p-3">
             <div className="flex items-center gap-3 mb-4">
                <div className="relative">
                    <div className="p-[2px] rounded-full bg-gradient-to-r from-indigo-500 to-purple-600">
                        <Avatar className="h-9 w-9 border-2 border-white dark:border-zinc-950"><AvatarImage src={MOCK_USER.avatar} /></Avatar>
                    </div>
                    <div className="absolute -bottom-1 -right-1 bg-yellow-400 text-yellow-900 text-[8px] font-bold px-1 rounded shadow-sm">LVL 5</div>
                </div>
                <div>
                    <h3 className="font-bold text-sm text-foreground">{MOCK_USER.name}</h3>
                    <div className="w-20 h-1.5 bg-zinc-100 dark:bg-zinc-800 rounded-full mt-1 overflow-hidden">
                        <div className="h-full bg-indigo-500 w-[70%]" />
                    </div>
                </div>
             </div>

             <div className="space-y-2">
                <div className="relative pl-4 pb-2">
                     <div className="absolute left-0 top-1.5 bottom-0 w-0.5 bg-indigo-100 dark:bg-indigo-900/30" />
                     <div className="absolute left-[-2px] top-1.5 h-1.5 w-1.5 rounded-full bg-indigo-500 ring-4 ring-white dark:ring-zinc-950" />
                     
                     <div className="mb-3">
                        <span className="text-[10px] font-bold text-indigo-500 uppercase">Current Quest</span>
                        <p className="font-bold text-sm text-foreground mt-0.5">{MOCK_TASKS.active.title}</p>
                     </div>

                     <div className="space-y-2 opacity-60">
                         {MOCK_TASKS.queued.map(t => (
                             <div key={t.id} className="flex items-center gap-2 relative">
                                  <div className="absolute left-[-22px] top-1.5 h-1.5 w-1.5 rounded-full bg-zinc-300 dark:bg-zinc-700 ring-4 ring-white dark:ring-zinc-950" />
                                  <p className="text-xs text-foreground">{t.title}</p>
                             </div>
                         ))}
                     </div>
                </div>
             </div>
        </div>
    </Card>
);

// 8. The "Split" (Separate zones)
const VariantSplit = () => (
    <Card className="w-[320px] flex flex-col border-border overflow-hidden">
        <div className="p-3 bg-zinc-50 dark:bg-zinc-900/30 flex items-center justify-between border-b">
             <div className="flex items-center gap-2">
                 <Avatar className="h-6 w-6"><AvatarImage src={MOCK_USER.avatar} /></Avatar>
                 <span className="font-semibold text-sm">{MOCK_USER.name}</span>
             </div>
             <div className="text-[10px] text-muted-foreground">3h 40m logged</div>
        </div>
        <div className="flex h-[150px]">
            {/* Active Zone */}
            <div className="w-[60%] p-3 border-r bg-white dark:bg-black relative">
                <span className="text-[10px] font-bold text-muted-foreground uppercase mb-2 block">Doing</span>
                <p className="text-sm font-medium leading-normal">{MOCK_TASKS.active.title}</p>
                <div className="absolute bottom-3 left-3">
                    <Badge variant="outline" className="text-[10px] border-primary/20 text-primary bg-primary/5">Active</Badge>
                </div>
            </div>
            {/* Queue Zone */}
            <div className="w-[40%] bg-zinc-50/50 dark:bg-zinc-900/50 p-2 overflow-y-auto">
                <span className="text-[10px] font-bold text-muted-foreground uppercase mb-2 block pl-1">Queue</span>
                <div className="space-y-1.5">
                    {MOCK_TASKS.queued.map(t => (
                        <div key={t.id} className="bg-white dark:bg-zinc-800 p-1.5 rounded shadow-sm text-[10px] text-foreground border border-zinc-100 dark:border-zinc-700">
                            {t.title}
                        </div>
                    ))}
                    <div className="border border-dashed border-zinc-300 rounded p-1 text-center text-[10px] text-muted-foreground hover:bg-zinc-100 cursor-pointer">+</div>
                </div>
            </div>
        </div>
    </Card>
);

// 9. The "Bubble" (Rounded/Soft)
const VariantBubble = () => (
    <div className="w-[320px] bg-transparent flex flex-col gap-3">
        <div className="flex items-center gap-3 px-2">
            <Avatar className="h-12 w-12 rounded-2xl shadow-sm border-2 border-white dark:border-zinc-800">
                <AvatarImage src={MOCK_USER.avatar} />
            </Avatar>
            <div>
                <h3 className="font-bold text-lg">{MOCK_USER.name}</h3>
                <div className="flex gap-2">
                    <span className="text-[10px] bg-white dark:bg-zinc-800 px-2 py-0.5 rounded-full shadow-sm border text-muted-foreground">Frontend</span>
                    <span className="text-[10px] bg-green-100 text-green-700 px-2 py-0.5 rounded-full shadow-sm border border-green-200">Online</span>
                </div>
            </div>
        </div>
        
        <div className="bg-white dark:bg-zinc-900 rounded-3xl p-5 shadow-sm border border-zinc-100 dark:border-zinc-800 relative overflow-hidden">
             <div className="absolute top-0 left-0 w-full h-1 bg-gradient-to-r from-blue-400 to-indigo-400" />
             <p className="text-xs text-muted-foreground mb-1 font-medium">Currently working on</p>
             <p className="text-base font-bold text-slate-800 dark:text-slate-100 mb-4">{MOCK_TASKS.active.title}</p>
             
             <div className="space-y-2 mt-4 pt-4 border-t border-dashed">
                 {MOCK_TASKS.queued.map((t, i) => (
                     <div key={t.id} className="flex items-center gap-3">
                          <span className="h-6 w-6 rounded-full bg-zinc-100 dark:bg-zinc-800 flex items-center justify-center text-[10px] font-bold text-muted-foreground">{i+1}</span>
                          <span className="text-sm text-muted-foreground">{t.title}</span>
                     </div>
                 ))}
             </div>
        </div>
    </div>
);

// 10. The "Notion-esque" (Clean text)
const VariantNotion = () => (
    <Card className="w-[320px] p-4 bg-white dark:bg-[#191919] border-zinc-200 dark:border-zinc-800 shadow-sm hover:shadow-md transition-shadow">
        <div className="flex items-start gap-3 mb-4">
             <div className="h-6 w-6 rounded bg-orange-100 text-orange-600 flex items-center justify-center text-xs">🚀</div>
             <span className="font-medium text-sm border-b border-transparent hover:border-zinc-300 dark:hover:border-zinc-600 cursor-pointer">{MOCK_USER.name}</span>
        </div>

        <div className="space-y-4 text-sm">
             <div className="flex gap-2 items-start group">
                 <div className="mt-1 p-0.5 rounded hover:bg-zinc-100 dark:hover:bg-zinc-800 cursor-pointer text-zinc-400">
                     <GripVertical size={12} />
                 </div>
                 <div className="flex-1">
                     <div className="flex items-center gap-2 mb-1">
                        <span className="bg-blue-100 dark:bg-blue-900/30 text-blue-700 dark:text-blue-300 px-1.5 py-0.5 rounded-[3px] text-[10px] font-medium">In Progress</span>
                     </div>
                     <p className="text-foreground leading-relaxed decoration-zinc-300 underline underline-offset-4 decoration-2 decoration-blue-200 dark:decoration-blue-900">{MOCK_TASKS.active.title}</p>
                 </div>
             </div>

             <div className="pl-6 space-y-2">
                 {MOCK_TASKS.queued.map(t => (
                      <div key={t.id} className="flex items-center gap-2 text-zinc-500 group">
                           <div className="h-1.5 w-1.5 rounded-full bg-zinc-300" />
                           <span className="truncate group-hover:text-zinc-800 dark:group-hover:text-zinc-200 transition-colors">{t.title}</span>
                      </div>
                 ))}
                 <div className="text-zinc-400 text-xs italic hover:bg-zinc-50 dark:hover:bg-zinc-900 p-1 rounded cursor-pointer">+ New</div>
             </div>
        </div>
    </Card>
);

export const StandupCardShowcase = () => {
    return (
        <div className="w-full max-w-7xl mx-auto p-8 space-y-12">
            <div>
                <h1 className="text-3xl font-bold mb-4">User Card Design Explorations</h1>
                <p className="text-muted-foreground max-w-2xl">
                    Exploring layouts to handle "One Active Task + Multiple Queued Tasks" effectively. 
                    The goal is to avoid the "odd" stacking look and create a clear hierarchy.
                </p>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-8">
                
                <div className="space-y-4">
                    <h3 className="text-sm font-bold text-muted-foreground uppercase">1. Classic Enhanced</h3>
                    <VariantClassic />
                    <p className="text-xs text-muted-foreground">Polished version of current. Clear sections.</p>
                </div>

                <div className="space-y-4">
                    <h3 className="text-sm font-bold text-muted-foreground uppercase">2. Timeline</h3>
                    <VariantTimeline />
                    <p className="text-xs text-muted-foreground">Vertical connection implies sequence.</p>
                </div>

                <div className="space-y-4">
                    <h3 className="text-sm font-bold text-muted-foreground uppercase">3. Focus Deck</h3>
                    <VariantFocusDeck />
                    <p className="text-xs text-muted-foreground">Queued items hidden in a "deck" stack.</p>
                </div>

                <div className="space-y-4">
                    <h3 className="text-sm font-bold text-muted-foreground uppercase">4. Kanban List</h3>
                    <VariantKanbanList />
                    <p className="text-xs text-muted-foreground">Strict list format, standard but clear.</p>
                </div>

                <div className="space-y-4">
                    <h3 className="text-sm font-bold text-muted-foreground uppercase">5. Minimal Row</h3>
                    <VariantMinimalRow />
                    <p className="text-xs text-muted-foreground">Horizontal focus. Good for compact density.</p>
                </div>

                <div className="space-y-4">
                    <h3 className="text-sm font-bold text-muted-foreground uppercase">6. Terminal</h3>
                    <VariantTerminal />
                    <p className="text-xs text-muted-foreground">For the hackers. CLI aesthetic.</p>
                </div>

                <div className="space-y-4">
                    <h3 className="text-sm font-bold text-muted-foreground uppercase">7. Gamified</h3>
                    <VariantGamified />
                    <p className="text-xs text-muted-foreground">Quest log style. High visual engagement.</p>
                </div>

                <div className="space-y-4">
                    <h3 className="text-sm font-bold text-muted-foreground uppercase">8. Split View</h3>
                    <VariantSplit />
                    <p className="text-xs text-muted-foreground">Dedicated zones for Active vs Queue.</p>
                </div>

                <div className="space-y-4">
                    <h3 className="text-sm font-bold text-muted-foreground uppercase">9. Bubble</h3>
                    <VariantBubble />
                    <p className="text-xs text-muted-foreground">Soft UI, separated header from card.</p>
                </div>

                <div className="space-y-4">
                    <h3 className="text-sm font-bold text-muted-foreground uppercase">10. Notion-esque</h3>
                    <VariantNotion />
                    <p className="text-xs text-muted-foreground">Document style. Very clean text focus.</p>
                </div>

            </div>
        </div>
    );
};
