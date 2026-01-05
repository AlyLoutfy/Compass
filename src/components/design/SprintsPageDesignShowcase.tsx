import { Badge } from '@/components/ui/Badge';
import { Button } from '@/components/ui/Button';
import { Plus, ChevronRight, ChevronDown, ArrowRight } from 'lucide-react';
import { cn } from '@/lib/utils';

// --- MOCK DATA ---
const tickets = [
    { id: 'T-101', title: 'Fix login page timeout', priority: 'high' },
    { id: 'T-102', title: 'Update user dashboard', priority: 'medium' },
    { id: 'T-103', title: 'Refactor api routes', priority: 'low' },
    { id: 'T-104', title: 'Add dark mode toggle', priority: 'medium' },
    { id: 'T-105', title: 'Optimize image loading', priority: 'low' },
];

const MockTicket = ({ id, title, priority, compact = false }: any) => (
    <div className={cn(
        "bg-white dark:bg-zinc-800 border border-zinc-200 dark:border-zinc-700 rounded-md shadow-sm p-3 flex items-center justify-between gap-2 group cursor-grab active:cursor-grabbing hover:border-zinc-300 dark:hover:border-zinc-600 transition-colors",
        compact ? "p-2 text-xs" : ""
    )}>
        <div className="flex items-center gap-3 min-w-0">
            <span className={cn("font-mono text-zinc-500 shrink-0", compact ? "text-[10px]" : "text-xs")}>{id}</span>
            <span className={cn("font-medium truncate text-zinc-800 dark:text-zinc-200", compact ? "text-xs" : "text-sm")}>{title}</span>
        </div>
        {!compact && (
            <div className={cn(
                "w-2 h-2 rounded-full shrink-0",
                priority === 'high' ? 'bg-red-500' : priority === 'medium' ? 'bg-orange-500' : 'bg-blue-500'
            )} />
        )}
    </div>
);

// --- LAYOUT 1: CLASSIC LEFT-RIGHT ---
// Left: Fixed Backlog, Right: Scrollable Sprints
const ClassicLayout = () => (
    <div className="flex h-[400px] border border-zinc-200 dark:border-zinc-800 rounded-xl overflow-hidden text-sm">
        {/* Left: Backlog */}
        <div className="w-1/3 border-r border-zinc-200 dark:border-zinc-800 bg-zinc-50/50 dark:bg-zinc-900/50 flex flex-col">
            <div className="p-3 border-b flex justify-between items-center bg-white dark:bg-zinc-900">
                <span className="font-bold">Backlog</span>
                <Badge variant="secondary" className="text-xs">12</Badge>
            </div>
            <div className="p-2 space-y-2 overflow-y-auto flex-1">
                 {tickets.map(t => <MockTicket key={t.id} {...t} />)}
                 {tickets.map(t => <MockTicket key={`b-${t.id}`} {...t} id={`T-2${t.id.split('-')[1]}`} />)}
            </div>
        </div>
        {/* Right: Sprints */}
        <div className="flex-1 bg-white dark:bg-zinc-950 flex flex-col p-4 overflow-y-auto space-y-6">
            <div className="border border-blue-200 dark:border-blue-900 bg-blue-50/30 dark:bg-blue-900/10 rounded-xl p-4">
                <div className="flex justify-between items-center mb-4">
                    <div>
                         <h3 className="font-bold text-lg text-blue-900 dark:text-blue-100">Sprint 34 (Active)</h3>
                         <span className="text-xs text-blue-500">Ends in 4 days</span>
                    </div>
                    <Button size="sm" className="bg-blue-600">Complete</Button>
                </div>
                <div className="space-y-2">
                    {tickets.slice(0, 3).map(t => <MockTicket key={`s1-${t.id}`} {...t} />)}
                    <div className="border-2 border-dashed border-blue-200 dark:border-blue-800 rounded-md p-4 text-center text-blue-400 text-xs">
                        Drop tickets here
                    </div>
                </div>
            </div>

            <div className="border border-zinc-200 dark:border-zinc-800 rounded-xl p-4 opacity-75">
                <div className="flex justify-between items-center mb-4">
                    <h3 className="font-bold text-zinc-700 dark:text-zinc-300">Sprint 35 (Planned)</h3>
                    <Button variant="ghost" size="sm">Start</Button>
                </div>
                <div className="space-y-2">
                    {tickets.slice(3, 5).map(t => <MockTicket key={`s2-${t.id}`} {...t} />)}
                </div>
            </div>
        </div>
    </div>
);

// --- LAYOUT 2: KANBAN COLUMNS ---
// Horizontal scroll columns: Backlog, Active Sprint, Next Sprint...
const KanbanLayout = () => (
    <div className="flex h-[400px] border border-zinc-200 dark:border-zinc-800 rounded-xl overflow-hidden bg-zinc-100 dark:bg-zinc-900 text-sm overflow-x-auto p-4 gap-4">
        {/* Column 1: Backlog */}
        <div className="w-80 shrink-0 flex flex-col bg-zinc-50 dark:bg-zinc-950 rounded-lg border border-zinc-200 dark:border-zinc-800">
            <div className="p-3 font-bold border-b sticky top-0 bg-inherit rounded-t-lg z-10 flex justify-between">
                Backlog <span className="text-zinc-400">24</span>
            </div>
            <div className="p-2 space-y-2 overflow-y-auto flex-1">
                {tickets.map(t => <MockTicket key={t.id} {...t} />)}
                {tickets.map(t => <MockTicket key={`k-${t.id}`} {...t} id={`T-K${t.id.split('-')[1]}`} />)}
            </div>
        </div>

        {/* Column 2: Active Sprint */}
        <div className="w-80 shrink-0 flex flex-col bg-white dark:bg-zinc-950 rounded-lg border-t-4 border-t-blue-500 border-x border-b border-zinc-200 dark:border-zinc-800 shadow-md">
            <div className="p-3 font-bold border-b sticky top-0 bg-inherit z-10 flex justify-between">
                Sprint 34 <Badge className="bg-blue-500">Active</Badge>
            </div>
            <div className="p-2 space-y-2 overflow-y-auto flex-1">
                {tickets.slice(0,4).map(t => <MockTicket key={`ka-${t.id}`} {...t} />)}
            </div>
            <div className="p-2 border-t bg-zinc-50 dark:bg-zinc-900 rounded-b-lg">
                <Button variant="ghost" size="sm" className="w-full text-zinc-500">+ Add Task</Button>
            </div>
        </div>

        {/* Column 3: Next Sprint */}
        <div className="w-80 shrink-0 flex flex-col bg-zinc-50 dark:bg-zinc-950 rounded-lg border border-zinc-200 dark:border-zinc-800 opacity-80">
            <div className="p-3 font-bold border-b sticky top-0 bg-inherit rounded-t-lg z-10 flex justify-between">
                Sprint 35 <span className="text-zinc-400 font-normal">Planned</span>
            </div>
            <div className="p-2 space-y-2 overflow-y-auto flex-1">
                 {tickets.slice(2,5).map(t => <MockTicket key={`kp-${t.id}`} {...t} />)}
            </div>
        </div>
    </div>
);

// --- LAYOUT 3: STACKED DRAWERS (Accordion) ---
const DrawerLayout = () => (
    <div className="h-[400px] border border-zinc-200 dark:border-zinc-800 rounded-xl overflow-hidden bg-white dark:bg-zinc-950 flex flex-col">
        {/* Active Sprint (Expanded) */}
        <div className="flex-1 flex flex-col">
            <div className="p-4 bg-zinc-50 dark:bg-zinc-900 border-b flex justify-between items-center cursor-pointer hover:bg-zinc-100 dark:hover:bg-zinc-800 transition-colors">
                <div className="flex items-center gap-2">
                    <ChevronDown size={18} />
                    <span className="font-bold text-lg">Sprint 34</span>
                    <Badge>Active</Badge>
                </div>
                <div className="flex items-center gap-4 text-zinc-500 text-sm">
                    <span>Oct 12 - 26</span>
                    <div className="w-32 h-2 bg-zinc-200 rounded-full overflow-hidden"><div className="w-1/2 h-full bg-black dark:bg-white"/></div>
                </div>
            </div>
            <div className="p-4 bg-zinc-50/30 dark:bg-zinc-900/10 overflow-y-auto flex-1 grid grid-cols-2 gap-4 content-start">
                 {tickets.map(t => <MockTicket key={`d-${t.id}`} {...t} />)}
            </div>
        </div>

        {/* Backlog (Collapsed-ish / Bottom Panel) */}
        <div className="h-48 border-t-2 border-zinc-200 dark:border-zinc-800 flex flex-col">
            <div className="p-3 bg-zinc-100 dark:bg-zinc-900 flex justify-between items-center cursor-pointer hover:bg-zinc-200 dark:hover:bg-zinc-800">
                 <div className="flex items-center gap-2">
                    <ChevronRight size={18} />
                    <span className="font-bold">Backlog (24 items)</span>
                </div>
                <Button size="sm" variant="ghost"><Plus size={16}/></Button>
            </div>
            <div className="p-2 bg-zinc-50 dark:bg-zinc-950 overflow-y-auto flex-1">
                 <div className="space-y-1">
                    {tickets.map(t => <MockTicket key={`db-${t.id}`} {...t} compact />)}
                 </div>
            </div>
        </div>
    </div>
);

// --- LAYOUT 4: INBOX / 3-PANE ---
const InboxLayout = () => (
    <div className="flex h-[400px] border border-zinc-200 dark:border-zinc-800 rounded-xl overflow-hidden text-sm">
        {/* Pane 1: Sprint List */}
        <div className="w-48 border-r bg-zinc-50 dark:bg-zinc-900 overflow-y-auto">
            <div className="p-3 font-bold text-xs uppercase text-zinc-500">Sprints</div>
            <div className="space-y-0.5 px-2">
                <div className="p-2 rounded bg-white dark:bg-zinc-800 shadow-sm font-medium border border-zinc-200 dark:border-zinc-700">Sprint 34 <div className="text-[10px] text-green-500">Active</div></div>
                <div className="p-2 rounded hover:bg-zinc-200 dark:hover:bg-zinc-800 text-zinc-600 dark:text-zinc-400">Sprint 35</div>
                <div className="p-2 rounded hover:bg-zinc-200 dark:hover:bg-zinc-800 text-zinc-600 dark:text-zinc-400">Sprint 36</div>
            </div>
            <div className="p-3 font-bold text-xs uppercase text-zinc-500 mt-4">Lists</div>
            <div className="px-2">
                <div className="p-2 rounded hover:bg-zinc-200 dark:hover:bg-zinc-800 text-zinc-600 dark:text-zinc-400">Backlog</div>
            </div>
        </div>
        
        {/* Pane 2: Ticket List */}
        <div className="w-72 border-r bg-white dark:bg-zinc-950 overflow-y-auto flex flex-col">
            <div className="p-3 border-b font-bold flex justify-between items-center sticky top-0 bg-inherit z-10">
                Sprint 34
                <div className="text-xs font-normal text-zinc-400">12 items</div>
            </div>
            <div className="divide-y dark:divide-zinc-800">
                {tickets.map((t, i) => (
                    <div key={i} className={cn("p-3 hover:bg-zinc-50 dark:hover:bg-zinc-900 cursor-pointer", i===1 ? "bg-blue-50 dark:bg-blue-900/20 border-l-2 border-blue-500" : "")}>
                        <div className="font-medium">{t.title}</div>
                        <div className="flex justify-between mt-1 text-xs text-zinc-500">
                            <span>{t.id}</span>
                            <span className={cn(t.priority==='high'?'text-red-500':'text-zinc-400')}>{t.priority}</span>
                        </div>
                    </div>
                ))}
            </div>
        </div>

        {/* Pane 3: Details (Placeholder) */}
        <div className="flex-1 bg-zinc-50/50 dark:bg-zinc-900/50 p-6 flex items-center justify-center text-zinc-400">
            Select a ticket to view details
        </div>
    </div>
);

// --- LAYOUT 5: GANTT / TIMELINE HYBRID ---
const GanttLayout = () => (
    <div className="flex flex-col h-[400px] border border-zinc-200 dark:border-zinc-800 rounded-xl overflow-hidden bg-white dark:bg-zinc-950">
        {/* Timeline Header */}
        <div className="h-24 bg-zinc-100 dark:bg-zinc-900 border-b overflow-x-auto whitespace-nowrap p-4 flex items-center gap-1 relative">
             <div className="absolute left-0 top-0 bottom-0 w-24 bg-gradient-to-r from-zinc-100 dark:from-zinc-900 to-transparent z-10 pointer-events-none"/>
             
             <div className="inline-flex h-12 items-center bg-blue-500 text-white rounded px-4 mr-2 shadow-lg">
                <div className="text-sm font-bold">Sprint 34</div>
             </div>
             <div className="inline-flex h-12 items-center bg-zinc-200 dark:bg-zinc-800 text-zinc-500 rounded px-4 mr-2 border border-zinc-300 dark:border-zinc-700">
                <div className="text-sm">Sprint 35</div>
             </div>
             <div className="inline-flex h-12 items-center bg-zinc-200 dark:bg-zinc-800 text-zinc-500 rounded px-4 mr-2 border border-zinc-300 dark:border-zinc-700 opacity-50">
                <div className="text-sm">Sprint 36</div>
             </div>
        </div>

        {/* Main Content: Split Backlog/Scheduled */}
        <div className="flex-1 flex overflow-hidden">
            <div className="w-1/2 p-4 overflow-y-auto border-r border-zinc-100 dark:border-zinc-800">
                <h4 className="font-bold text-xs uppercase text-zinc-500 mb-3">Unscheduled (Backlog)</h4>
                <div className="space-y-2">
                     {tickets.map(t => <MockTicket key={`gl-${t.id}`} {...t} />)}
                </div>
            </div>
            <div className="w-1/2 p-4 bg-zinc-50/50 dark:bg-zinc-900/50 overflow-y-auto">
                 <h4 className="font-bold text-xs uppercase text-blue-500 mb-3">Scheduled in Sprint 34</h4>
                 <div className="space-y-2">
                     {tickets.map(t => <MockTicket key={`gr-${t.id}`} {...t} />)}
                </div>
            </div>
        </div>
    </div>
);

// --- LAYOUT 6: MASONRY BOARD (Pinterest style) ---
// Backlog on side, Sprints as cards in a grid 
const MasonryLayout = () => (
    <div className="flex h-[400px] border border-zinc-200 dark:border-zinc-800 rounded-xl overflow-hidden bg-zinc-100 dark:bg-zinc-950">
        <div className="w-64 border-r bg-white dark:bg-zinc-900 flex flex-col shrink-0">
             <div className="p-4 border-b font-bold">Backlog</div>
             <div className="flex-1 overflow-y-auto p-2 space-y-2">
                {tickets.map(t => <MockTicket key={`ml-${t.id}`} {...t} compact />)}
                {tickets.map(t => <MockTicket key={`ml2-${t.id}`} {...t} compact />)}
             </div>
        </div>
        <div className="flex-1 p-4 overflow-y-auto">
            <div className="columns-2 gap-4 space-y-4">
                {/* Sprint Card 1 */}
                <div className="break-inside-avoid bg-white dark:bg-zinc-900 rounded-xl p-4 shadow-sm border border-zinc-200 dark:border-zinc-800">
                    <div className="flex justify-between items-center mb-3">
                        <h3 className="font-bold">Sprint 34</h3>
                        <Badge className="bg-green-500">Active</Badge>
                    </div>
                    <div className="space-y-2">
                        {tickets.slice(0,3).map(t => <MockTicket key={`mc1-${t.id}`} {...t} compact />)}
                    </div>
                </div>
                
                 {/* Sprint Card 2 */}
                 <div className="break-inside-avoid bg-white dark:bg-zinc-900 rounded-xl p-4 shadow-sm border border-zinc-200 dark:border-zinc-800 opacity-75">
                    <div className="flex justify-between items-center mb-3">
                        <h3 className="font-bold">Sprint 35</h3>
                        <Badge variant="outline">Planned</Badge>
                    </div>
                    <div className="space-y-2">
                        {tickets.slice(2,4).map(t => <MockTicket key={`mc2-${t.id}`} {...t} compact />)}
                    </div>
                </div>

                 {/* Sprint Card 3 */}
                 <div className="break-inside-avoid bg-white dark:bg-zinc-900 rounded-xl p-4 shadow-sm border border-zinc-200 dark:border-zinc-800 opacity-50">
                    <div className="flex justify-between items-center mb-3">
                        <h3 className="font-bold">Sprint 36</h3>
                        <Badge variant="outline">Draft</Badge>
                    </div>
                    <div className="h-20 border-2 border-dashed border-zinc-200 dark:border-zinc-800 rounded flex items-center justify-center text-xs text-zinc-400">
                        Empty
                    </div>
                </div>
            </div>
        </div>
    </div>
);

// --- LAYOUT 7: DRAGGABLE ISLANDS (Spatial) ---
const IslandsLayout = () => (
    <div className="h-[400px] border border-zinc-200 dark:border-zinc-800 rounded-xl overflow-hidden bg-[radial-gradient(#e5e7eb_1px,transparent_1px)] dark:bg-[radial-gradient(#3f3f46_1px,transparent_1px)] [background-size:16px_16px] relative p-8">
        {/* Backlog Island */}
        <div className="absolute left-8 top-8 bottom-8 w-64 bg-white dark:bg-zinc-900 shadow-xl rounded-2xl border border-zinc-200 dark:border-zinc-800 flex flex-col">
            <div className="p-4 border-b font-bold bg-zinc-50 dark:bg-zinc-950 rounded-t-2xl">Depot (Backlog)</div>
            <div className="p-3 overflow-y-auto flex-1 space-y-2">
                 {tickets.map(t => <MockTicket key={`i1-${t.id}`} {...t} compact />)}
            </div>
        </div>

        {/* Sprint Island */}
        <div className="absolute right-8 top-8 w-80 h-96 bg-white dark:bg-zinc-900 shadow-2xl rounded-2xl border-4 border-indigo-500 overflow-hidden flex flex-col">
             <div className="p-4 bg-indigo-500 text-white font-bold flex justify-between">
                <span>Current Sprint</span>
                <span className="text-indigo-200 text-xs">34</span>
            </div>
            <div className="p-3 overflow-y-auto flex-1 space-y-2 bg-indigo-50/20">
                 {tickets.map(t => <MockTicket key={`i2-${t.id}`} {...t} />)}
            </div>
        </div>

        {/* Arrow decoration */}
        <div className="absolute left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2 text-zinc-300 dark:text-zinc-600">
            <ArrowRight size={48} />
        </div>
    </div>
);

// --- LAYOUT 8: TABLE MATRIX ---
const MatrixLayout = () => (
    <div className="h-[400px] border border-zinc-200 dark:border-zinc-800 rounded-xl overflow-hidden bg-white dark:bg-zinc-950">
        <div className="grid grid-cols-[200px_1fr] h-full">
            {/* Sidebar Sprints */}
            <div className="border-r border-zinc-200 dark:border-zinc-800 bg-zinc-50 dark:bg-zinc-900 p-2 space-y-1">
                 <button className="w-full text-left px-3 py-2 rounded bg-white dark:bg-zinc-800 shadow-sm font-bold border border-zinc-200 dark:border-zinc-700 text-sm">Sprint 34 <span className="float-right text-xs bg-green-100 text-green-700 px-1 rounded">Active</span></button>
                 <button className="w-full text-left px-3 py-2 rounded hover:bg-zinc-200 dark:hover:bg-zinc-800 text-sm text-zinc-600 dark:text-zinc-400">Sprint 35</button>
                 <button className="w-full text-left px-3 py-2 rounded hover:bg-zinc-200 dark:hover:bg-zinc-800 text-sm text-zinc-600 dark:text-zinc-400">Backlog</button>
            </div>
            
            {/* Content Table */}
            <div className="flex flex-col">
                <div className="border-b px-4 py-2 flex gap-4 text-xs font-bold uppercase text-zinc-400">
                    <div className="w-16">ID</div>
                    <div className="flex-1">Title</div>
                    <div className="w-24">Priority</div>
                    <div className="w-24">Assignee</div>
                </div>
                <div className="overflow-y-auto flex-1">
                    {tickets.map((t, i) => (
                        <div key={i} className="px-4 py-3 border-b flex items-center gap-4 text-sm hover:bg-zinc-50 dark:hover:bg-zinc-900">
                             <div className="w-16 font-mono text-zinc-500">{t.id}</div>
                             <div className="flex-1 font-medium">{t.title}</div>
                             <div className="w-24"><Badge variant="outline">{t.priority}</Badge></div>
                             <div className="w-24 flex -space-x-2">
                                <div className="w-6 h-6 rounded-full bg-blue-500 border-2 border-white"/>
                             </div>
                        </div>
                    ))}
                     {tickets.map((t, i) => (
                        <div key={`m-${i}`} className="px-4 py-3 border-b flex items-center gap-4 text-sm hover:bg-zinc-50 dark:hover:bg-zinc-900">
                             <div className="w-16 font-mono text-zinc-500">{t.id}</div>
                             <div className="flex-1 font-medium">{t.title}</div>
                             <div className="w-24"><Badge variant="outline">{t.priority}</Badge></div>
                             <div className="w-24 flex -space-x-2">
                                <div className="w-6 h-6 rounded-full bg-green-500 border-2 border-white"/>
                             </div>
                        </div>
                    ))}
                </div>
            </div>
        </div>
    </div>
);

// --- LAYOUT 9: MINIMALIST LISTS (Text Only) ---
const MinimalListLayout = () => (
    <div className="flex h-[400px] border border-zinc-200 dark:border-zinc-800 rounded-xl overflow-hidden bg-white dark:bg-zinc-950 p-8 gap-12 font-mono text-sm">
        <div className="flex-1 flex flex-col gap-4">
            <div className="uppercase font-bold tracking-widest text-zinc-400 border-b pb-2">Backlog_Queue</div>
            <ul className="space-y-3">
                 {tickets.map(t => (
                    <li key={`min-${t.id}`} className="flex items-baseline gap-3 group cursor-pointer">
                        <span className="text-zinc-500 group-hover:text-black dark:group-hover:text-white transition-colors">[{t.id}]</span>
                        <span className="text-zinc-700 dark:text-zinc-300 group-hover:underline break-all">{t.title}</span>
                    </li>
                 ))}
            </ul>
        </div>
        <div className="w-px bg-zinc-100 dark:bg-zinc-800" />
        <div className="flex-1 flex flex-col gap-4">
            <div className="uppercase font-bold tracking-widest text-blue-500 border-b pb-2 border-blue-500">Active_Sprint_34</div>
            <ul className="space-y-3">
                 {tickets.map(t => (
                    <li key={`min2-${t.id}`} className="flex items-baseline gap-3 group cursor-pointer opacity-100">
                        <span className="text-blue-400">[{t.id}]</span>
                        <span className="text-zinc-900 dark:text-white font-bold">{t.title}</span>
                    </li>
                 ))}
            </ul>
            <div className="mt-auto border-t pt-4 text-xs text-zinc-400">
                {'>'} 12 items pending completion...<span className="animate-pulse">_</span>
            </div>
        </div>
    </div>
);

// --- LAYOUT 10: BOTTOM SHEET (Mobile Inspired) ---
const BottomSheetLayout = () => (
    <div className="relative h-[400px] border border-zinc-200 dark:border-zinc-800 rounded-xl overflow-hidden bg-zinc-200 dark:bg-zinc-900">
        {/* Main View: Sprints */}
        <div className="absolute inset-0 p-6 overflow-y-auto pb-24">
            <h3 className="text-2xl font-bold mb-6">Sprints</h3>
            <div className="space-y-4">
                <div className="bg-white dark:bg-black rounded-2xl p-6 shadow-sm">
                    <h4 className="font-bold text-lg mb-2">Sprint 34</h4>
                     <div className="space-y-2">
                        {tickets.slice(0,3).map(t => <MockTicket key={`bs-${t.id}`} {...t} />)}
                    </div>
                </div>
                <div className="bg-white/50 dark:bg-black/50 rounded-2xl p-6 shadow-none">
                    <h4 className="font-bold text-lg mb-2 text-zinc-500">Sprint 35</h4>
                    <div className="h-12 border-2 border-dashed rounded-xl flex items-center justify-center text-zinc-400">No items</div>
                </div>
            </div>
        </div>

        {/* Bottom Sheet: Backlog */}
        <div className="absolute bottom-0 left-0 right-0 h-16 bg-white dark:bg-zinc-800 rounded-t-3xl shadow-[0_-10px_40px_rgba(0,0,0,0.1)] flex flex-col transition-all hover:h-[300px] cursor-pointer group z-10">
            <div className="flex justify-center pt-2 pb-2">
                <div className="w-12 h-1.5 bg-zinc-300 dark:bg-zinc-600 rounded-full group-hover:bg-zinc-400" />
            </div>
            <div className="px-6 pb-4 flex justify-between items-center border-b border-zinc-100 dark:border-zinc-700">
                <h3 className="font-bold">Backlog</h3>
                <Badge variant="secondary">24</Badge>
            </div>
             <div className="flex-1 overflow-y-auto p-4 space-y-2 bg-zinc-50 dark:bg-zinc-900/50">
                {tickets.map(t => <MockTicket key={`bsl-${t.id}`} {...t} />)}
                {tickets.map(t => <MockTicket key={`bsl2-${t.id}`} {...t} />)}
             </div>
        </div>
    </div>
);

export const SprintsPageDesignShowcase = () => {
    return (
        <div className="space-y-12 pb-20">
            <div className="space-y-2">
                <h2 className="text-2xl font-bold">Full Page layouts</h2>
                <p className="text-muted-foreground">
                    10 structural concepts for the Sprints & Backlog page.
                </p>
            </div>
            
            <div className="grid grid-cols-1 xl:grid-cols-2 gap-12">
                <div className="space-y-3">
                    <h3 className="font-bold">1. Classic Split (Fixed Left)</h3>
                    <p className="text-sm text-zinc-500">Standard for many tools. Fixed backlog on left, scrollable sprints on right.</p>
                    <ClassicLayout />
                </div>

                <div className="space-y-3">
                    <h3 className="font-bold">2. Kanban Columns</h3>
                    <p className="text-sm text-zinc-500">Horizontal scrolling columns for backlog and future sprints.</p>
                    <KanbanLayout />
                </div>

                <div className="space-y-3">
                    <h3 className="font-bold">3. Stacked Drawers (Vertical)</h3>
                    <p className="text-sm text-zinc-500">Focus on one sprint at a time, detailed backlog below.</p>
                    <DrawerLayout />
                </div>

                <div className="space-y-3">
                    <h3 className="font-bold">4. Inbox / 3-Pane</h3>
                    <p className="text-sm text-zinc-500">Fast navigation between sprint lists, ticket lists, and details.</p>
                    <InboxLayout />
                </div>

                <div className="space-y-3">
                    <h3 className="font-bold">5. Gantt / Timeline</h3>
                    <p className="text-sm text-zinc-500">Visual timeline header for context.</p>
                    <GanttLayout />
                </div>

                <div className="space-y-3">
                    <h3 className="font-bold">6. Masonry Board</h3>
                    <p className="text-sm text-zinc-500">Backlog sidebar, sprints as variable height cards.</p>
                    <MasonryLayout />
                </div>

                <div className="space-y-3">
                    <h3 className="font-bold">7. Spatial Islands</h3>
                    <p className="text-sm text-zinc-500">Visual metaphor of moving items between islands.</p>
                    <IslandsLayout />
                </div>

                <div className="space-y-3">
                    <h3 className="font-bold">8. Matrix Table</h3>
                    <p className="text-sm text-zinc-500">Dense data view with sidebar navigation.</p>
                    <MatrixLayout />
                </div>
                
                 <div className="space-y-3">
                    <h3 className="font-bold">9. Minimalist Text</h3>
                    <p className="text-sm text-zinc-500">For keyboard-heavy power users.</p>
                    <MinimalListLayout />
                </div>

                 <div className="space-y-3">
                    <h3 className="font-bold">10. Bottom Sheet (Mobile First)</h3>
                    <p className="text-sm text-zinc-500">Sprints focus, pull up backlog to assign.</p>
                    <BottomSheetLayout />
                </div>
            </div>
        </div>
    );
};
