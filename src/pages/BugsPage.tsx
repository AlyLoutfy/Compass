import { useState } from 'react';
import { cn } from '@/lib/utils';
import { DragDropContext, Droppable, Draggable, DropResult } from '@hello-pangea/dnd';
import { motion, AnimatePresence } from 'framer-motion';

import { useData } from '@/context/DataContext';
import { Bug, BugSeverity } from '@/types';
import { Button } from '@/components/ui/Button';
import { Badge } from '@/components/ui/Badge';
import { BugViewModal } from '@/components/bugs/BugViewModal';
import { BugModal } from '@/components/bugs/BugModal';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/Select';
import { 
    Bug as BugIcon, 
    Plus, 
    Pencil, 
    ArrowRight, 
    GripVertical,
    Paintbrush,
    
    XCircle,
    AlertCircle,
    AlertTriangle,
    MinusCircle,

    Trash2,
    ChevronLeft,
    ChevronRight,
    ChevronUp,
    ChevronDown,
} from 'lucide-react';
import { EmptyState } from '@/components/ui/EmptyState';
import { ConfirmDialog } from '@/components/ui/ConfirmDialog';
import { PageToolbar } from '@/components/layout/PageToolbar';
import { Tooltip } from '@/components/ui/Tooltip';
import { FilterPopover } from '@/components/ui/FilterPopover';

// Utility for Severity Colors
const getSeverityColor = (severity: BugSeverity) => {
    switch (severity) {
        case 'blocker': return 'text-red-600 bg-red-100 dark:bg-red-900/30';
        case 'critical': return 'text-orange-600 bg-orange-100 dark:bg-orange-900/30';
        case 'major': return 'text-yellow-600 bg-yellow-100 dark:bg-yellow-900/30';
        case 'minor': return 'text-blue-600 bg-blue-100 dark:bg-blue-900/30';
        case 'cosmetic': return 'text-purple-600 bg-purple-100 dark:bg-purple-900/30';
        default: return 'text-zinc-600 bg-zinc-100';
    }
};

const getSeverityIcon = (severity: BugSeverity) => {
    switch (severity) {
        case 'blocker': return <XCircle size={14} />;
        case 'critical': return <AlertCircle size={14} />;
        case 'major': return <AlertTriangle size={14} />;
        case 'minor': return <MinusCircle size={14} />;
        case 'cosmetic': return <Paintbrush size={14} />;
    }
};

export const BugsPage = () => {
    const { data, actions } = useData();
    const [isModalOpen, setIsModalOpen] = useState(false);
    const [editingBug, setEditingBug] = useState<Bug | null>(null);
    const [viewingBug, setViewingBug] = useState<Bug | null>(null);
    const [isViewModalOpen, setIsViewModalOpen] = useState(false);
    const [isDragging, setIsDragging] = useState(false);

    
    const [confirmConfig, setConfirmConfig] = useState<{
        isOpen: boolean;
        type: 'delete' | 'promote' | null;
        id: string | null;
    }>({ isOpen: false, type: null, id: null });

    // Filters
    const [searchQuery, setSearchQuery] = useState('');
    const [statusFilter, setStatusFilter] = useState<'active' | 'closed' | 'all'>('all');
    const [severityFilter, setSeverityFilter] = useState<string>('all');
    const [platformFilter, setPlatformFilter] = useState<string>('all');
    const [assigneeFilter, setAssigneeFilter] = useState<string>('all');

    const [currentPage, setCurrentPage] = useState(1);
    const itemsPerPage = 20;

    const [sortConfig, setSortConfig] = useState<{ key: keyof Bug; direction: 'asc' | 'desc' } | null>(null);

    const handleSort = (key: keyof Bug) => {
        setSortConfig(current => {
            if (current?.key === key) {
                if (current.direction === 'asc') return { key, direction: 'desc' };
                return null;
            }
            return { key, direction: 'asc' };
        });
    };



    // Filter Logic
    const filteredBugs = data.bugs.filter(bug => {
        // Search
        if (searchQuery) {
            const q = searchQuery.toLowerCase();
            if (!bug.title.toLowerCase().includes(q) && !bug.description.toLowerCase().includes(q)) return false;
        }

        // Status Filter
        if (statusFilter === 'active') {
            if (['resolved'].includes(bug.status)) return false;
        } else if (statusFilter === 'closed') {
            if (!['resolved'].includes(bug.status)) return false;
        }

        // Other Filters
        if (severityFilter !== 'all' && bug.severity !== severityFilter) return false;
        if (platformFilter !== 'all' && bug.platform !== platformFilter) return false;
        if (assigneeFilter !== 'all') {
            if (assigneeFilter === 'unassigned') {
                if (bug.assignee) return false;
            } else {
                if (bug.assignee !== assigneeFilter) return false;
            }
        }

        return true;
    }).sort((a, b) => {
        if (sortConfig) {
            const { key, direction } = sortConfig;
            
            // Handle undefined values
            if (!a[key] && !b[key]) return 0;
            if (!a[key]) return 1;
            if (!b[key]) return -1;
    
            const valA = a[key]!;
            const valB = b[key]!;
    
            if (valA < valB) return direction === 'asc' ? -1 : 1;
            if (valA > valB) return direction === 'asc' ? 1 : -1;
            return 0;
        }
        return (a.order ?? 0) - (b.order ?? 0);
    });



    const handleConfirm = () => {
        if (confirmConfig.type === 'delete' && confirmConfig.id) {
            actions.deleteBug(confirmConfig.id);
        } else if (confirmConfig.type === 'promote' && confirmConfig.id) {
            actions.promoteBugToTicket(confirmConfig.id);
        }
        setConfirmConfig({ isOpen: false, type: null, id: null });
    };

    const onDragEnd = (result: DropResult) => {
        setIsDragging(false);
        if (!result.destination) return;

        const sourceBug = filteredBugs[(currentPage - 1) * itemsPerPage + result.source.index];
        const destinationBug = filteredBugs[(currentPage - 1) * itemsPerPage + result.destination.index];
        
        if (!sourceBug || !destinationBug) return;

        const globalSourceIndex = data.bugs.findIndex(b => b.id === sourceBug.id);
        const globalDestinationIndex = data.bugs.findIndex(b => b.id === destinationBug.id);
        
        if (globalSourceIndex !== -1 && globalDestinationIndex !== -1) {
            actions.reorderBugs(globalSourceIndex, globalDestinationIndex);
        }
    };

    return (
        <div className="flex flex-col h-full">
            <div className="pt-4 md:pt-8 pb-4">
                <PageToolbar 
                    title="Bug Tracker"
                    searchQuery={searchQuery}
                    onSearchChange={setSearchQuery}
                    searchPlaceholder="Search bugs..."
                    count={filteredBugs.length}
                    countLabel="Bugs"
                    actions={
                        <Button onClick={() => { setEditingBug(null); setIsModalOpen(true); }} size="sm" className="rounded-lg h-8 text-xs shrink-0">
                            <Plus className="mr-2 h-3.5 w-3.5" /> Report Bug
                        </Button>
                    }
                    filters={
                        <div className="flex items-center gap-2">
                             {/* Filters render code... unchanged */}
                            <div className="flex bg-zinc-100 dark:bg-zinc-800 rounded-lg p-0.5 h-8 relative">
                                {(['active', 'closed', 'all'] as const).map((status) => (
                                    <button
                                        key={status}
                                        onClick={() => setStatusFilter(status)}
                                        className={cn(
                                            "relative px-3 text-xs font-medium rounded-md transition-colors z-10 h-full capitalize",
                                            statusFilter === status ? "text-foreground" : "text-zinc-500 hover:text-zinc-700"
                                        )}
                                    >
                                        {statusFilter === status && (
                                            <motion.div
                                                layoutId="status-filter-pill"
                                                className="absolute inset-0 bg-white dark:bg-zinc-700 shadow-sm rounded-md ring-1 ring-black/5 dark:ring-white/10"
                                                transition={{ type: "spring", bounce: 0.2, duration: 0.6 }}
                                            />
                                        )}
                                        <span className="relative z-10">{status}</span>
                                    </button>
                                ))}
                            </div>
                            
                            <FilterPopover 
                                title="Filter Bugs"
                                activeCount={(severityFilter !== 'all' ? 1 : 0) + (platformFilter !== 'all' ? 1 : 0) + (assigneeFilter !== 'all' ? 1 : 0)} 
                                onReset={() => { setSeverityFilter('all'); setPlatformFilter('all'); setAssigneeFilter('all'); }}
                            >
                                <div className="space-y-4">
                                     <div className="space-y-1.5">
                                        <Select value={severityFilter} onValueChange={setSeverityFilter}>
                                            <SelectTrigger className="h-9 w-full">
                                                <SelectValue>
                                                    {severityFilter === 'all' ? "All Severities" : null}
                                                </SelectValue>
                                            </SelectTrigger>
                                            <SelectContent>
                                                <SelectItem value="all">All Severities</SelectItem>
                                                <SelectItem value="blocker">Blocker</SelectItem>
                                                <SelectItem value="critical">Critical</SelectItem>
                                                <SelectItem value="major">Major</SelectItem>
                                                <SelectItem value="minor">Minor</SelectItem>
                                                <SelectItem value="cosmetic">Cosmetic</SelectItem>
                                            </SelectContent>
                                        </Select>
                                     </div>
                                     <div className="space-y-1.5">
                                        <Select value={platformFilter} onValueChange={setPlatformFilter}>
                                            <SelectTrigger className="h-9 w-full">
                                                <SelectValue>
                                                    {platformFilter === 'all' ? "All Platforms" : null}
                                                </SelectValue>
                                            </SelectTrigger>
                                            <SelectContent>
                                                <SelectItem value="all">All Platforms</SelectItem>
                                                <SelectItem value="desktop">Desktop</SelectItem>
                                                <SelectItem value="mobile">Mobile</SelectItem>
                                            </SelectContent>
                                        </Select>
                                     </div>
                                     <div className="space-y-1.5">
                                        <Select value={assigneeFilter} onValueChange={setAssigneeFilter}>
                                            <SelectTrigger className="h-9 w-full">
                                                <SelectValue>
                                                    {assigneeFilter === 'all' ? "All Assignees" : null}
                                                </SelectValue>
                                            </SelectTrigger>
                                            <SelectContent className="max-h-[200px]">
                                                <SelectItem value="all">All Assignees</SelectItem>
                                                {data.users.map(u => (
                                                    <SelectItem key={u.id} value={u.id}>{u.name}</SelectItem>
                                                ))}
                                            </SelectContent>
                                        </Select>
                                     </div>
                                </div>
                            </FilterPopover>
                        </div>
                    }
                />
            </div>

            <div className="flex-1 overflow-hidden flex flex-col">
                {filteredBugs.length === 0 ? (
                    <EmptyState 
                        icon={BugIcon}
                        title="No bugs found"
                        description={statusFilter === 'active' ? "Great job! No active bugs." : "No bugs match your filters."}
                        action={<Button onClick={() => setIsModalOpen(true)}>Report Bug</Button>}
                    />
                ) : (
                    <>
                    <div className="flex-1 overflow-y-auto min-h-0 border rounded-lg bg-white dark:bg-zinc-950 border-zinc-200 dark:border-zinc-800 text-[13px]">
                        <div className="min-w-[1000px]">
                            {/* Header */}
                            {/* Header */}
                            <div className="flex font-medium text-zinc-500 border-b bg-zinc-50/50 dark:bg-zinc-900/50 sticky top-0 z-10 w-full px-1">
                                {['id', 'severity', 'title', 'layer', 'assignee', 'status'].map((key) => {
                                    const label = key === 'id' ? 'ID' : 
                                                  key === 'title' ? 'Bug Details' :
                                                  key === 'assignee' ? 'Assigned To' :
                                                  key === 'layer' ? 'Stack' :
                                                  key.charAt(0).toUpperCase() + key.slice(1);
                                    
                                    const widthClass = key === 'id' ? 'w-20' : 
                                                       key === 'severity' ? 'w-28' : 
                                                       key === 'title' ? 'flex-1 min-w-[300px]' : 
                                                       key === 'layer' ? 'w-20' : 
                                                       key === 'assignee' ? 'w-32' : 'w-28';

                                     return (
                                        <div 
                                            key={key}
                                            className={`${widthClass} p-2 border-r flex items-center ${key === 'title' ? 'pl-3' : 'justify-center'} cursor-pointer hover:bg-zinc-100 dark:hover:bg-zinc-800 transition-colors select-none`}
                                            onClick={() => handleSort(key as keyof Bug)}
                                        >
                                            <div className="flex items-center gap-1">
                                                <motion.span layout>{label}</motion.span>
                                                <AnimatePresence mode="wait">
                                                    {sortConfig?.key === key && (
                                                        <motion.div
                                                            key={sortConfig.direction}
                                                            initial={{ opacity: 0, scale: 0.5, rotate: -180, marginLeft: 0 }}
                                                            animate={{ opacity: 1, scale: 1, rotate: 0, marginLeft: 2 }}
                                                            exit={{ opacity: 0, scale: 0.5, rotate: 180, marginLeft: 0 }}
                                                            transition={{ duration: 0.2 }}
                                                            layout
                                                        >
                                                            {sortConfig.direction === 'asc' ? <ChevronUp size={12} /> : <ChevronDown size={12} />}
                                                        </motion.div>
                                                    )}
                                                </AnimatePresence>
                                            </div>
                                        </div>
                                     );
                                })}
                                <div className="w-20 p-2 flex items-center justify-center">Actions</div>
                            </div>

                            {/* Body */}
                            <DragDropContext onDragStart={() => setIsDragging(true)} onDragEnd={onDragEnd}>
                                <Droppable droppableId="bugs-list">
                                    {(provided) => (
                                        <div 
                                            ref={provided.innerRef} 
                                            {...provided.droppableProps}
                                        >
                                            {filteredBugs.slice((currentPage - 1) * itemsPerPage, currentPage * itemsPerPage).map((bug, idx) => {
                                                const assignee = data.users.find(u => u.id === bug.assignee);
                                                return (
                                                    <Draggable key={bug.id} draggableId={bug.id} index={idx}>
                                                        {(provided, snapshot) => (
                                                            <div 
                                                                ref={provided.innerRef}
                                                                {...provided.draggableProps}
                                                                style={{ ...provided.draggableProps.style }}
                                                                className={cn(
                                                                    "flex group border-b last:border-0 hover:bg-zinc-50 dark:hover:bg-zinc-900/40 transition-colors w-full px-1",
                                                                    snapshot.isDragging && "bg-white dark:bg-zinc-900 shadow-xl ring-1 ring-zinc-200 dark:ring-zinc-800 opacity-90 z-20"
                                                                )}
                                                            >

                                                                <div className="w-20 border-r flex items-center px-4 gap-4">
                                                                    <div 
                                                                        className={cn(
                                                                            "w-4 h-4 flex items-center justify-center transition-colors text-zinc-400 group-hover:text-zinc-600 cursor-grab active:cursor-grabbing"
                                                                        )}
                                                                        {...provided.dragHandleProps}
                                                                        title="Drag to reorder"
                                                                    >
                                                                        <GripVertical size={16} />
                                                                    </div>
                                                                    <div className="w-4 text-center text-xs text-zinc-400 font-mono">
                                                                         <span>{filteredBugs.length - idx}</span> 
                                                                    </div>
                                                                </div>
                                                                <div className="w-28 p-2 flex justify-center items-center border-r" onClick={(e) => e.stopPropagation()}>
                                                                    <Select
                                                                        value={bug.severity}
                                                                        onValueChange={(val) => actions.updateBug(bug.id, { severity: val as any })}
                                                                        className="flex justify-center"
                                                                    >
                                                                        <SelectTrigger className="h-auto w-fit p-0 border-none shadow-none bg-transparent hover:bg-zinc-100 dark:hover:bg-zinc-800 focus:ring-0 flex justify-center [&>svg:last-child]:hidden rounded-full">
                                                                            <div className={`flex items-center gap-1.5 px-2 py-1 rounded-full text-[9px] font-bold uppercase border pointer-events-none ${getSeverityColor(bug.severity).replace('text-', 'border-').replace('bg-', '')} ${getSeverityColor(bug.severity)}`}>
                                                                                {getSeverityIcon(bug.severity)}
                                                                                {bug.severity}
                                                                            </div>
                                                                        </SelectTrigger>
                                                                        <SelectContent>
                                                                            <SelectItem value="blocker" className={bug.severity === 'blocker' ? "bg-rose-500/20 dark:bg-rose-900/40" : ""}>
                                                                                <div className="flex items-center gap-2 text-rose-600 dark:text-rose-400 font-medium">
                                                                                    <XCircle size={14} /> Blocker
                                                                                </div>
                                                                            </SelectItem>
                                                                            <SelectItem value="critical" className={bug.severity === 'critical' ? "bg-orange-500/20 dark:bg-orange-900/40" : ""}>
                                                                                <div className="flex items-center gap-2 text-orange-600 dark:text-orange-400 font-medium">
                                                                                    <AlertCircle size={14} /> Critical
                                                                                </div>
                                                                            </SelectItem>
                                                                            <SelectItem value="major" className={bug.severity === 'major' ? "bg-amber-500/20 dark:bg-amber-900/40" : ""}>
                                                                                <div className="flex items-center gap-2 text-amber-600 dark:text-amber-400 font-medium">
                                                                                    <AlertTriangle size={14} /> Major
                                                                                </div>
                                                                            </SelectItem>
                                                                            <SelectItem value="minor" className={bug.severity === 'minor' ? "bg-blue-500/20 dark:bg-blue-900/40" : ""}>
                                                                                <div className="flex items-center gap-2 text-blue-600 dark:text-blue-400 font-medium">
                                                                                    <MinusCircle size={14} /> Minor
                                                                                </div>
                                                                            </SelectItem>
                                                                            <SelectItem value="cosmetic" className={bug.severity === 'cosmetic' ? "bg-purple-500/20 dark:bg-purple-900/40" : ""}>
                                                                                <div className="flex items-center gap-2 text-purple-600 dark:text-purple-400 font-medium">
                                                                                    <Paintbrush size={14} /> Cosmetic
                                                                                </div>
                                                                            </SelectItem>
                                                                        </SelectContent>
                                                                    </Select>
                                                                </div>
                                                                <div 
                                                                    className="flex-1 p-2 pl-3 min-w-[300px] border-r cursor-pointer flex flex-col justify-center gap-1 hover:bg-zinc-50 dark:hover:bg-zinc-900/10 transition-colors"
// ... (rest of the row content)
                                                    onClick={() => { setViewingBug(bug); setIsViewModalOpen(true); }}
                                                >
                                                    <div className="font-medium text-zinc-700 dark:text-zinc-200 truncate pr-4">
                                                        {bug.title}
                                                    </div>
                                                </div>
                                                <div className="w-20 p-2 border-r flex items-center justify-center" onClick={(e) => e.stopPropagation()}>
                                                    <Select 
                                                        value={bug.layer || 'none'} 
                                                        onValueChange={(val) => actions.updateBug(bug.id, { layer: val === 'none' ? undefined : val as any })}
                                                        className="flex justify-center"
                                                    >
                                                        <SelectTrigger className="h-auto w-fit p-0 border-none shadow-none bg-transparent hover:bg-zinc-100 dark:hover:bg-zinc-800 focus:ring-0 flex justify-center [&>svg:last-child]:hidden rounded-full">
                                                            {bug.layer ? (
                                                                <Badge variant="outline" className="capitalize text-[10px] text-zinc-500 border-zinc-200 dark:border-zinc-800 bg-white dark:bg-zinc-950/50 shadow-sm font-normal px-2 h-5 pointer-events-none">
                                                                    {bug.layer}
                                                                </Badge>
                                                            ) : (
                                                                <span className="text-zinc-300 dark:text-zinc-700 text-[10px] italic">--</span>
                                                            )}
                                                        </SelectTrigger>
                                                        <SelectContent>
                                                            <SelectItem value="none" className="text-zinc-400 italic">None</SelectItem>
                                                            <SelectItem value="frontend">Frontend</SelectItem>
                                                            <SelectItem value="backend">Backend</SelectItem>
                                                            <SelectItem value="design">Design</SelectItem>
                                                            <SelectItem value="fullstack">Fullstack</SelectItem>
                                                            <SelectItem value="database">Database</SelectItem>
                                                            <SelectItem value="devops">Devops</SelectItem>
                                                        </SelectContent>
                                                    </Select>
                                                </div>
                                                <div className="w-32 p-2 border-r flex items-center justify-center px-4" onClick={(e) => e.stopPropagation()}>
                                                    <Select
                                                        value={bug.assignee || 'unassigned'}
                                                        onValueChange={(val) => actions.updateBug(bug.id, { assignee: val === 'unassigned' ? undefined : val })}
                                                    >
                                                        <SelectTrigger className="h-full w-full p-0 border-none shadow-none bg-transparent hover:bg-zinc-100 dark:hover:bg-zinc-800 focus:ring-0 flex items-center justify-center overflow-hidden [&>svg:last-child]:hidden">
                                                            {assignee ? (
                                                                <div className="flex items-center gap-2 pointer-events-none">
                                                                    <div className="w-6 h-6 rounded-full bg-primary/10 text-primary flex items-center justify-center text-[10px] font-bold shrink-0">
                                                                        {assignee.name.charAt(0)}
                                                                    </div>
                                                                    <span className="text-xs truncate">{assignee.name}</span>
                                                                </div>
                                                            ) : (
                                                                <span className="text-xs text-zinc-400 italic pointer-events-none">Unassigned</span>
                                                            )}
                                                        </SelectTrigger>
                                                        <SelectContent>
                                                            <SelectItem value="unassigned" className="text-zinc-400 italic">Unassigned</SelectItem>
                                                            {data.users.map(u => (
                                                                <SelectItem key={u.id} value={u.id}>
                                                                    <div className="flex items-center gap-2">
                                                                        <div className="w-5 h-5 rounded-full bg-primary/10 text-primary flex items-center justify-center text-[10px] font-bold border border-primary/20">
                                                                            {u.name.charAt(0)}
                                                                        </div>
                                                                        {u.name}
                                                                    </div>
                                                                </SelectItem>
                                                            ))}
                                                        </SelectContent>
                                                    </Select>
                                                </div>
                                                <div className="w-28 p-2 border-r flex items-center justify-center" onClick={(e) => e.stopPropagation()}>
                                                    <Select
                                                        value={bug.status}
                                                        onValueChange={(val) => actions.updateBug(bug.id, { status: val as any })}
                                                        className="flex justify-center"
                                                    >
                                                        <SelectTrigger className="h-auto w-fit p-0 border-none shadow-none bg-transparent hover:bg-zinc-100 dark:hover:bg-zinc-800 focus:ring-0 flex justify-center [&>svg:last-child]:hidden rounded-md">
                                                            <span className={`inline-flex items-center px-2 py-1 rounded-md text-[9px] font-bold uppercase whitespace-nowrap border pointer-events-none
                                                                ${bug.status === 'todo' ? 'bg-zinc-100 text-zinc-600 border-zinc-200' : ''}
                                                                ${bug.status === 'in_progress' ? 'bg-blue-50 text-blue-600 border-blue-200' : ''}
                                                                ${bug.status === 'in_review' ? 'bg-purple-50 text-purple-600 border-purple-200' : ''}
                                                                ${bug.status === 'ready_for_qa' ? 'bg-yellow-50 text-yellow-600 border-yellow-200' : ''}
                                                                ${bug.status === 'resolved' ? 'bg-green-50 text-green-600 border-green-200' : ''}
                                                                ${bug.status === 'blocked' ? 'bg-red-50 text-red-600 border-red-200' : ''}
                                                            `}>
                                                                {bug.status.replace('_', ' ')}
                                                            </span>
                                                        </SelectTrigger>
                                                        <SelectContent>
                                                            <SelectItem value="todo">
                                                                <div className="flex items-center gap-2">
                                                                    <div className="w-2 h-2 rounded-full bg-zinc-400" /> Todo
                                                                </div>
                                                            </SelectItem>
                                                            <SelectItem value="in_progress">
                                                                <div className="flex items-center gap-2">
                                                                    <div className="w-2 h-2 rounded-full bg-blue-500" /> In Progress
                                                                </div>
                                                            </SelectItem>
                                                            <SelectItem value="in_review">
                                                                <div className="flex items-center gap-2">
                                                                    <div className="w-2 h-2 rounded-full bg-purple-500" /> In Review
                                                                </div>
                                                            </SelectItem>
                                                            <SelectItem value="ready_for_qa">
                                                                <div className="flex items-center gap-2">
                                                                    <div className="w-2 h-2 rounded-full bg-yellow-500" /> Ready for QA
                                                                </div>
                                                            </SelectItem>
                                                            <SelectItem value="resolved">
                                                                <div className="flex items-center gap-2">
                                                                    <div className="w-2 h-2 rounded-full bg-green-500" /> Resolved
                                                                </div>
                                                            </SelectItem>
                                                            <SelectItem value="blocked">
                                                                <div className="flex items-center gap-2">
                                                                    <div className="w-2 h-2 rounded-full bg-red-500" /> Blocked
                                                                </div>
                                                            </SelectItem>
                                                        </SelectContent>
                                                    </Select>
                                                </div>
                                                <div className="w-20 p-2 flex justify-center items-center gap-0.5 opacity-10 md:opacity-0 group-hover:opacity-100 transition-opacity">
                                                    <Tooltip content="Edit Bug">
                                                        <Button variant="ghost" size="sm" className="h-6 w-6 p-0" onClick={() => { setEditingBug(bug); setIsModalOpen(true); }}>
                                                            <Pencil size={12} />
                                                        </Button>
                                                    </Tooltip>
                                                    <Tooltip content="Promote to Ticket">
                                                        <Button variant="ghost" size="sm" className="h-6 w-6 p-0 text-green-600 hover:text-green-700" onClick={() => setConfirmConfig({ isOpen: true, type: 'promote', id: bug.id })}>
                                                            <ArrowRight size={12} />
                                                        </Button>
                                                    </Tooltip>
                                                    <Tooltip content="Delete Bug">
                                                        <Button variant="ghost" size="sm" className="h-6 w-6 p-0 text-destructive hover:text-destructive" onClick={() => setConfirmConfig({ isOpen: true, type: 'delete', id: bug.id })}>
                                                            <Trash2 size={12} />
                                                        </Button>
                                                    </Tooltip>
                                                </div>
                                            </div>
                                            )}
                                        </Draggable>
                                    );
                                })}
                                {provided.placeholder}
                            </div>
                        )}
                    </Droppable>
                </DragDropContext>
                    </div>
                </div>
                    {filteredBugs.length > itemsPerPage && (
                        <div className="flex items-center justify-between pt-2 px-2">
                             <div className="text-xs text-muted-foreground">
                                Showing {(currentPage - 1) * itemsPerPage + 1} to {Math.min(currentPage * itemsPerPage, filteredBugs.length)} of {filteredBugs.length}
                            </div>
                            <div className="flex gap-1">
                                <Button variant="outline" size="sm" disabled={currentPage === 1} onClick={() => setCurrentPage(p => Math.max(1, p - 1))} className="h-8 w-8 p-0">
                                    <ChevronLeft size={14} />
                                </Button>
                                <Button variant="outline" size="sm" disabled={currentPage * itemsPerPage >= filteredBugs.length} onClick={() => setCurrentPage(p => p + 1)} className="h-8 w-8 p-0">
                                    <ChevronRight size={14} />
                                </Button>
                            </div>
                        </div>
                    )}
                    </>
                )}
        </div>

            <BugModal 
                isOpen={isModalOpen} 
                onClose={() => setIsModalOpen(false)} 
                initialData={editingBug} 

            />

            <BugViewModal 
                isOpen={isViewModalOpen}
                onClose={() => setIsViewModalOpen(false)}
                bug={viewingBug}
                onEdit={(bug) => {
                    setIsViewModalOpen(false);
                    setEditingBug(bug);
                    setIsModalOpen(true);
                }}
            />
            
            <ConfirmDialog 
                isOpen={confirmConfig.isOpen}
                onClose={() => setConfirmConfig({ isOpen: false, type: null, id: null })}
                onConfirm={handleConfirm}
                title={confirmConfig.type === 'delete' ? "Delete Bug?" : "Promote to Ticket?"}
                description={confirmConfig.type === 'delete' ? "This cannot be undone." : "This will create a backlog ticket and mark this bug as In Progress."}
                variant={confirmConfig.type === 'delete' ? 'danger' : 'success'}
            />
        </div>
    );
};


