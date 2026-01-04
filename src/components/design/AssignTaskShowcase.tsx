

import { cn } from '@/lib/utils';
import { Button } from '@/components/ui/Button';
import { Search, Bug, CheckCircle2, Bookmark, Code2, Hash, ChevronRight, CircleDot } from 'lucide-react';
import { Badge } from '@/components/ui/Badge';

// --- MOCK DATA ---
const MOCK_TASKS = [
    { number: 1, title: 'Fix Navigation Bug on Mobile', description: 'Menu does not close when clicking outside.', category: 'Bug' },
    { number: 2, title: 'Implement Dark Mode', description: 'Add theme toggle and color tokens.', category: 'Feature' },
    { number: 3, title: 'Update Dependencies', description: 'Upgrade React to v19 and fix breaking changes.', category: 'Chore' },
    { number: 4, title: 'Design New Landing Page', description: 'Create hi-fi mockups for the marketing site.', category: 'Design' },
    { number: 5, title: 'Optimize Database Queries', description: 'Reduce load time for the dashboard analytics.', category: 'Performance' },
];

const CategoryIcon = ({ category, className }: { category: string, className?: string }) => {
    switch (category) {
        case 'Bug': return <Bug size={14} className={className} />;
        case 'Feature': return <CheckCircle2 size={14} className={className} />;
        case 'Chore': return <Code2 size={14} className={className} />;
        case 'Design': return <Bookmark size={14} className={className} />;
        default: return <Hash size={14} className={className} />;
    }
};

interface MockTicketRowProps {
    task: typeof MOCK_TASKS[0];
    variant: string;
}

// --- VARIANT COMPONENTS ---

// 1. Minimal List
const VariantMinimal = ({ task }: MockTicketRowProps) => (
    <div className="flex items-center justify-between p-3 border-b last:border-0 hover:bg-zinc-50 dark:hover:bg-zinc-800/50 transition-colors group">
        <div className="flex flex-col gap-1">
            <div className="flex items-center gap-2">
                <span className="text-xs font-mono text-muted-foreground mr-1">#{task.number}</span>
                <span className="text-sm font-medium leading-none">{task.title}</span>
                <span className="text-[10px] uppercase font-bold text-zinc-400 bg-zinc-100 dark:bg-zinc-800 px-1.5 py-0.5 rounded">{task.category}</span>
            </div>
            <p className="text-xs text-muted-foreground line-clamp-1 ml-6">{task.description}</p>
        </div>
        <Button size="sm" variant="ghost" className="h-7 text-xs opacity-0 group-hover:opacity-100 transition-opacity">Assign</Button>
    </div>
);

// 2. Card Based (Separated)
const VariantCard = ({ task }: MockTicketRowProps) => (
    <div className="flex flex-col p-4 mb-3 border rounded-lg bg-white dark:bg-zinc-900 shadow-sm hover:shadow-md transition-all hover:border-primary/50 group cursor-pointer">
        <div className="flex justify-between items-start mb-2">
            <div className="flex items-center gap-2">
                 <div className={cn(
                     "w-6 h-6 rounded-full flex items-center justify-center text-[10px] font-bold",
                     task.category === 'Bug' ? "bg-red-100 text-red-600" : 
                     task.category === 'Feature' ? "bg-blue-100 text-blue-600" : "bg-zinc-100 text-zinc-600"
                 )}>
                     {task.number}
                 </div>
                 <h4 className="font-bold text-sm">{task.title}</h4>
            </div>
            <Badge variant="outline" className="text-[10px]">{task.category}</Badge>
        </div>
        <p className="text-xs text-muted-foreground pl-8 mb-3">{task.description}</p>
        <div className="pl-8 flex justify-end">
             <Button size="sm" className="h-7 text-xs w-full bg-zinc-900 text-white hover:bg-zinc-700 dark:bg-zinc-100 dark:text-zinc-900">Assign to Me</Button>
        </div>
    </div>
);

// 3. Compact Technical/Linear
const VariantLinear = ({ task }: MockTicketRowProps) => (
    <div className="flex items-center gap-3 p-2 hover:bg-[#1e1e20] rounded group cursor-pointer border border-transparent hover:border-zinc-800 transition-all">
        <div className="flex items-center gap-2 min-w-[60px]">
            <CategoryIcon category={task.category} className="text-zinc-500" />
            <span className="font-mono text-xs text-zinc-500">T-{task.number}</span>
        </div>
        <div className="flex-1 min-w-0">
             <div className="flex items-center gap-2">
                <span className="text-sm text-zinc-200 truncate">{task.title}</span>
                <span className="text-xs text-zinc-600 truncate hidden sm:inline">- {task.description}</span>
             </div>
        </div>
        <Button size="sm" variant="outline" className="h-6 text-[10px] bg-[#27272a] border-zinc-700 text-zinc-400 hover:text-zinc-200 hover:border-zinc-600 opacity-0 group-hover:opacity-100">Assign</Button>
    </div>
);

// 4. Large Comfortable
const VariantComfy = ({ task }: MockTicketRowProps) => (
    <div className="flex items-start gap-4 p-5 border-b last:border-0 hover:bg-slate-50 dark:hover:bg-slate-900/20 transition-colors">
        <div className="h-10 w-10 bg-slate-100 dark:bg-slate-800 rounded-xl flex items-center justify-center text-lg font-black text-slate-300">
            {task.number}
        </div>
        <div className="flex-1 space-y-1">
            <h4 className="text-base font-semibold text-slate-900 dark:text-slate-100">{task.title}</h4>
            <p className="text-sm text-slate-500 line-clamp-2">{task.description}</p>
            <div className="flex items-center gap-2 mt-2">
                <span className="text-[10px] font-bold uppercase tracking-wider text-slate-400">{task.category}</span>
                <div className="h-px w-4 bg-slate-200" />
                <button className="text-xs text-primary font-bold hover:underline">Assign Ticket</button>
            </div>
        </div>
    </div>
);

// 5. Grid/Boxy (Jira Board Style)
const VariantGridBox = ({ task }: MockTicketRowProps) => (
    <div className="p-3 bg-white dark:bg-zinc-800 border-l-4 border-l-indigo-500 border-y border-r border-zinc-200 dark:border-zinc-700 shadow-sm rounded-r hover:translate-x-1 transition-transform cursor-pointer group">
        <div className="flex justify-between items-center mb-1">
             <span className="text-[10px] font-bold text-indigo-500 uppercase tracking-widest">{task.category} • #{task.number}</span>
        </div>
        <h4 className="text-sm font-bold text-zinc-800 dark:text-white mb-2">{task.title}</h4>
        <div className="flex justify-between items-center">
             <span className="text-[10px] text-zinc-400 truncate max-w-[150px]">{task.description}</span>
             <ChevronRight size={14} className="text-zinc-300 group-hover:text-indigo-500" />
        </div>
    </div>
);

// 6. Terminal / Hacker
const VariantTerminal = ({ task }: MockTicketRowProps) => (
    <div className="font-mono text-xs p-2 border-b border-green-900/30 hover:bg-green-900/10 text-green-600 dark:text-green-400 flex items-start gap-3 group cursor-pointer">
        <span className="opacity-50 select-none">{'>'}</span>
        <div className="flex-1">
            <div className="flex gap-2">
                <span className="font-bold underline decoration-green-800">[{task.number.toString().padStart(3, '0')}]</span>
                <span className="uppercase text-green-500">{task.category}</span>
            </div>
            <p className="text-green-300/80 mb-1">{task.title}</p>
            <p className="opacity-50 italic text-[10px]">// {task.description}</p>
        </div>
        <span className="hidden group-hover:inline opacity-100 bg-green-900/50 px-2 py-1 text-[10px] animate-pulse">ASSIGN_USER()</span>
    </div>
);

// 7. Notion / Clean
const VariantNotion = ({ task }: MockTicketRowProps) => (
    <div className="flex items-center gap-2 py-1 px-2 hover:bg-zinc-100 dark:hover:bg-zinc-800 rounded group cursor-pointer">
        <div className="flex items-center justify-center p-1">
            <CategoryIcon category={task.category} className="text-zinc-400" />
        </div>
        <div className="flex-1 border-b border-zinc-100 dark:border-zinc-800 py-2 group-hover:border-transparent flex items-center justify-between">
             <div className="flex items-center gap-3">
                 <span className="text-sm text-zinc-700 dark:text-zinc-300">{task.title}</span>
                 <span className="text-xs text-zinc-400 font-light hidden sm:inline">{task.description}</span>
             </div>
             <div className="flex items-center gap-2">
                 <span className="text-[10px] text-zinc-300 bg-zinc-50 border px-1 rounded">#{task.number}</span>
                 <Button size="sm" variant="ghost" className="h-6 w-6 p-0 opacity-0 group-hover:opacity-100 hover:bg-zinc-200 rounded text-zinc-500">+</Button>
             </div>
        </div>
    </div>
);

// 8. Visual / Highlight (Left Border)
const VariantHighlight = ({ task }: MockTicketRowProps) => (
    <div className="relative pl-4 pr-3 py-3 border-b hover:bg-zinc-50 dark:hover:bg-zinc-900 group">
        <div className={cn(
            "absolute left-0 top-0 bottom-0 w-1 bg-zinc-200 group-hover:bg-primary transition-colors",
            task.category === 'Bug' && "group-hover:bg-red-500",
            task.category === 'Feature' && "group-hover:bg-blue-500"
        )} />
        <div className="flex justify-between items-start">
             <div>
                 <div className="flex items-center gap-2 mb-1">
                     <span className="text-xs font-bold text-zinc-900 dark:text-zinc-100">Task #{task.number}</span>
                     <span className="text-zinc-300 text-[10px]">|</span>
                     <span className="text-[10px] uppercase text-zinc-500">{task.category}</span>
                 </div>
                 <h4 className="text-sm font-medium">{task.title}</h4>
                 <p className="text-xs text-muted-foreground mt-0.5">{task.description}</p>
             </div>
             <Button variant="outline" size="sm" className="h-7 text-xs rounded-full opacity-0 group-hover:opacity-100 hover:bg-zinc-900 hover:text-white dark:hover:bg-white dark:hover:text-zinc-900 transition-all">
                 Assign
             </Button>
        </div>
    </div>
);

// 9. Floating / Bubble (Chat style)
const VariantBubble = ({ task }: MockTicketRowProps) => (
    <div className="p-3 mb-2 bg-zinc-100 dark:bg-zinc-800/50 rounded-2xl rounded-tl-none hover:bg-white hover:shadow-lg dark:hover:bg-zinc-800 transition-all cursor-pointer border border-transparent hover:border-zinc-200">
        <div className="flex items-center gap-2 mb-1">
            <span className="text-[10px] font-bold text-blue-500">#{task.number}</span>
            <span className="text-xs font-semibold">{task.title}</span>
        </div>
        <p className="text-xs text-zinc-500 dark:text-zinc-400 mb-2">{task.description}</p>
        <div className="flex justify-between items-center bg-zinc-50 dark:bg-black/20 rounded-full py-1 px-3">
             <span className="text-[10px] text-zinc-400 uppercase">{task.category}</span>
             <span className="text-[10px] font-bold text-zinc-600 hover:text-blue-500">Click to Assign →</span>
        </div>
    </div>
);

// 10. Blueprint / Draft
const VariantBlueprint = ({ task }: MockTicketRowProps) => (
    <div className="border border-dashed border-blue-300 bg-blue-50/30 dark:bg-blue-900/10 p-3 mb-2 rounded-sm group hover:border-solid hover:border-blue-500 transition-all">
        <div className="flex items-start gap-3">
             <div className="mt-1">
                 <CircleDot size={12} className="text-blue-500" />
             </div>
             <div className="flex-1 font-mono text-xs text-blue-900 dark:text-blue-100">
                 <div className="flex justify-between">
                    <span className="font-bold">TK-{task.number}</span>
                    <span className="text-blue-400">{task.category}</span>
                 </div>
                 <div className="my-1 font-semibold">{task.title}</div>
                 <div className="opacity-70">{task.description}</div>
             </div>
        </div>
        <div className="mt-2 h-0 group-hover:h-8 overflow-hidden transition-all duration-300">
            <Button size="sm" className="w-full h-7 bg-blue-600 hover:bg-blue-700 text-white font-mono text-xs rounded-none">CONFIRM ASSIGNMENT</Button>
        </div>
    </div>
);


const VARIANTS = [
    { id: '1', name: 'Minimal List', component: VariantMinimal, description: "Clean list with hover actions." },
    { id: '2', name: 'Card Based', component: VariantCard, description: "Distinct cards with detailed breakdown." },
    { id: '3', name: 'Linear Dark', component: VariantLinear, description: "High density dark mode aesthetic." },
    { id: '4', name: 'Comfy & Large', component: VariantComfy, description: "Generous whitespace and avatars." },
    { id: '5', name: 'Kanban Item', component: VariantGridBox, description: "Board-like items with color codes." },
    { id: '6', name: 'Terminal', component: VariantTerminal, description: "Developer focused monospace look." },
    { id: '7', name: 'Notion Minimal', component: VariantNotion, description: "Flat, icon-driven, very light." },
    { id: '8', name: 'Left Accent', component: VariantHighlight, description: "Color coded accent borders." },
    { id: '9', name: 'Bubble Chat', component: VariantBubble, description: "Conversation style, rounded corners." },
    { id: '10', name: 'Blueprint', component: VariantBlueprint, description: "Technical drawing aesthetic." },
];

export const AssignTaskShowcase = () => {
    return (
        <div className="space-y-12 pb-24">
             <div className="space-y-2">
                <h2 className="text-2xl font-bold">Assign Task Modal Designs</h2>
                <p className="text-muted-foreground">
                    10 variations for the ticket assignment list. Each design focuses on different information hierarchies (ID, Title, Category).
                </p>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
                {VARIANTS.map((variant) => {
                    const Component = variant.component;
                    return (
                        <div key={variant.id} className="flex flex-col border rounded-xl overflow-hidden shadow-sm bg-zinc-50/50 dark:bg-zinc-950/50">
                            <div className="p-4 border-b bg-white dark:bg-zinc-900 flex justify-between items-center">
                                <div>
                                    <h3 className="font-bold text-sm">{variant.name}</h3>
                                    <p className="text-xs text-muted-foreground">{variant.description}</p>
                                </div>
                                <div className="text-xs font-mono text-zinc-300">{variant.id}</div>
                            </div>
                            
                            {/* Modal Mockup Container */}
                            <div className={cn(
                                "p-6 flex-1 flex flex-col items-center justify-center min-h-[400px]",
                                variant.name === 'Linear Dark' ? "bg-zinc-950" : "bg-zinc-100 dark:bg-zinc-950"
                            )}>
                                {/* The Modal Mock */}
                                <div className={cn(
                                    "w-full max-w-sm rounded-lg shadow-2xl overflow-hidden flex flex-col",
                                    variant.name === 'Linear Dark' ? "bg-[#141416] border border-zinc-800 text-zinc-300" : 
                                    variant.name === 'Terminal' ? "bg-black border border-green-900 text-green-500 font-mono" :
                                    "bg-white dark:bg-zinc-900 border border-zinc-200 dark:border-zinc-800"
                                )}>
                                    {/* Modal Header */}
                                    <div className={cn(
                                        "p-4 border-b flex justify-between items-center",
                                        variant.name === 'Linear Dark' ? "border-zinc-800" : 
                                        variant.name === 'Terminal' ? "border-green-900 bg-green-900/10" :
                                        "border-zinc-100 dark:border-zinc-800"
                                    )}>
                                        <h4 className="font-semibold text-sm">Assign Task</h4>
                                        <Search size={14} className="opacity-50" />
                                    </div>

                                    {/* Modal Body / List */}
                                    <div className={cn(
                                        "flex-1 overflow-y-auto max-h-[300px] p-2",
                                        variant.name === 'Blueprint' && "bg-blue-50/20"
                                    )}>
                                        <div className={variant.name === 'Grid' ? "space-y-3" : "space-y-1"}>
                                            {MOCK_TASKS.map((task, idx) => (
                                                <Component key={idx} task={task} variant={variant.name} />
                                            ))}
                                        </div>
                                    </div>

                                    {/* Modal Footer (Optional Mock) */}
                                    <div className={cn(
                                        "p-3 border-t text-xs text-center opacity-50",
                                        variant.name === 'Linear Dark' ? "border-zinc-800" : 
                                        variant.name === 'Terminal' ? "border-green-900 text-green-800" :
                                        "border-zinc-100 dark:border-zinc-800"
                                    )}>
                                        {MOCK_TASKS.length} tasks available
                                    </div>
                                </div>
                            </div>
                        </div>
                    );
                })}
            </div>
        </div>
    );
};
