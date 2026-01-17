import React, { useState } from 'react';
import { AnimatePresence, motion } from 'framer-motion';
import { DragDropContext, Droppable, Draggable, DropResult } from '@hello-pangea/dnd';
import { useData } from '@/context/DataContext';
import { Requirement, Priority, TicketType } from '@/types';
import { Button } from '@/components/ui/Button';

import { Badge } from '@/components/ui/Badge';
import { Modal } from '@/components/ui/Modal';
import { MultiSelectDropdown } from '@/components/ui/MultiSelectDropdown';
import { Input } from '@/components/ui/Input';
import { Textarea } from '@/components/ui/Textarea';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/Select';
import { Plus, Pencil, ChevronLeft, ChevronRight, ArrowRight, ClipboardList, ChevronDown, MessageSquare, Send, ChevronUp, GripVertical } from 'lucide-react';
import { EmptyState } from '@/components/ui/EmptyState';
import { ConfirmDialog } from '@/components/ui/ConfirmDialog';
import { Tooltip } from '@/components/ui/Tooltip';
import { PageToolbar } from '@/components/layout/PageToolbar';
import { FilterPopover } from '@/components/ui/FilterPopover';

export const RequirementsPage = () => {
  const { data, actions } = useData();
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingRequirement, setEditingRequirement] = useState<Requirement | null>(null);
  const [editingRequirementTab, setEditingRequirementTab] = useState<'details' | 'comments'>('details');
  const [confirmConfig, setConfirmConfig] = useState<{
    isOpen: boolean;
    type: 'delete' | 'approve' | null;
    id: string | null;
    title: string;
    description: string;
  }>({
    isOpen: false,
    type: null,
    id: null,
    title: '',
    description: ''
  });
    // State for filters
  const [searchQuery, setSearchQuery] = useState('');
  const [priorityFilter, setPriorityFilter] = useState<string>('all');
  const [categoryFilter, setCategoryFilter] = useState<string>('all');
  const [assigneeFilter, setAssigneeFilter] = useState<string>('all');
  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = 100;
  const [expandedReqs, setExpandedReqs] = useState<Set<string>>(new Set());
  const [isDragging, setIsDragging] = useState(false);

  const toggleExpand = (id: string, e: React.MouseEvent) => {
    e.stopPropagation();
    const newSet = new Set(expandedReqs);
    if (newSet.has(id)) {
        newSet.delete(id);
    } else {
        newSet.add(id);
    }
    setExpandedReqs(newSet);
  };

  const pendingReqs = data.requirements
    .filter(r => r.status === 'pending')
    .sort((a, b) => (a.order || 0) - (b.order || 0));

  const [sortConfig, setSortConfig] = useState<{ key: string; direction: 'asc' | 'desc' } | null>(null);

  const handleSort = (key: string) => {
      setSortConfig(current => {
          if (current?.key === key) {
              if (current.direction === 'asc') return { key, direction: 'desc' };
              return null;
          }
          return { key, direction: 'asc' };
      });
  };

  // Applied filters
  const filteredReqs = pendingReqs.filter(req => {
    // Search
    if (searchQuery) {
        const query = searchQuery.toLowerCase();
        const matchesTitle = req.title.toLowerCase().includes(query);
        const matchesDesc = req.description?.toLowerCase().includes(query);
        if (!matchesTitle && !matchesDesc) return false;
    }

    if (priorityFilter !== 'all' && req.priority !== priorityFilter) return false;
    if (categoryFilter !== 'all' && req.category !== categoryFilter) return false;
    if (assigneeFilter !== 'all') {
        if (assigneeFilter === 'unassigned') {
            if (req.affectedOrganizations && req.affectedOrganizations.length > 0) return false;
        } else {
             const assigned = req.affectedOrganizations || [];
             if (!assigned.includes(assigneeFilter) && !assigned.includes('all')) return false;
        }
    }
    return true;
  }).sort((a, b) => {
      if (!sortConfig) return 0;
      const { key, direction } = sortConfig;

      let valA: any = a[key as keyof Requirement];
      let valB: any = b[key as keyof Requirement];

      if (key === 'organizations') {
           valA = a.affectedOrganizations?.length || 0;
           valB = b.affectedOrganizations?.length || 0;
      } else if (key === 'comments') {
           valA = a.comments?.length || 0;
           valB = b.comments?.length || 0;
      }

      // Handle undefined/null (push to bottom usually, or standard comparison)
      if (!valA && valA !== 0) valA = '';
      if (!valB && valB !== 0) valB = '';

      if (valA < valB) return direction === 'asc' ? -1 : 1;
      if (valA > valB) return direction === 'asc' ? 1 : -1;
      return 0;
  });



  const openConfirm = (type: 'delete' | 'approve', id: string) => {
    if (type === 'delete') {
      setConfirmConfig({
        isOpen: true,
        type: 'delete',
        id,
        title: 'Delete Requirement',
        description: 'Are you sure you want to delete this requirement? This action cannot be undone.'
      });
    } else {
      setConfirmConfig({
        isOpen: true,
        type: 'approve',
        id,
        title: 'Approve Requirement',
        description: 'This will create a new ticket in the backlog based on this requirement.'
      });
    }
  };

  const handleConfirm = () => {
    if (confirmConfig.type === 'delete' && confirmConfig.id) {
        actions.deleteRequirement(confirmConfig.id);
    } else if (confirmConfig.type === 'approve' && confirmConfig.id) {
        actions.promoteRequirementToTicket(confirmConfig.id);
    }
  };

    const onDragEnd = (result: DropResult) => {
        setIsDragging(false);
        if (!result.destination) return;

        const sourceReq = filteredReqs[(currentPage - 1) * itemsPerPage + result.source.index];
        const destinationReq = filteredReqs[(currentPage - 1) * itemsPerPage + result.destination.index];
        
        if (!sourceReq || !destinationReq) return;

        const globalSourceIndex = data.requirements.findIndex(r => r.id === sourceReq.id);
        const globalDestinationIndex = data.requirements.findIndex(r => r.id === destinationReq.id);
        
        if (globalSourceIndex !== -1 && globalDestinationIndex !== -1) {
            actions.reorderRequirements(globalSourceIndex, globalDestinationIndex);
        }
    };

  return (
    <div className="flex flex-col">
      <div className="pt-4 md:pt-8 pb-4">
        <PageToolbar
            title="Client Requirements"
            searchQuery={searchQuery}
            onSearchChange={setSearchQuery}
            searchPlaceholder="Search requirements..."
            count={filteredReqs.length}
            countLabel="Requirements"
            filters={
              <FilterPopover 
                title="Filter Requirements" 
                activeCount={
                    (priorityFilter !== 'all' ? 1 : 0) + 
                    (categoryFilter !== 'all' ? 1 : 0) + 
                    (assigneeFilter !== 'all' ? 1 : 0)
                }
                onReset={() => {
                    setPriorityFilter('all');
                    setCategoryFilter('all');
                    setAssigneeFilter('all');
                }}
              >
                 <div className="space-y-4">
                     <div className="space-y-1.5">
                        <Select value={assigneeFilter} onValueChange={setAssigneeFilter}>
                            <SelectTrigger className="h-9 w-full">
                                <SelectValue>
                                    {assigneeFilter === 'all' ? "All Organizations" : null}
                                </SelectValue>
                            </SelectTrigger>
                            <SelectContent className="max-h-[200px]">
                                <SelectItem value="all">All Organizations</SelectItem>
                                <SelectItem value="unassigned">Unassigned</SelectItem>
                                {data.organizations.map(org => (
                                    <SelectItem key={org.id} value={org.id}>{org.name}</SelectItem>
                                ))}
                            </SelectContent>
                        </Select>
                     </div>

                     <div className="space-y-1.5">
                        <Select value={priorityFilter} onValueChange={setPriorityFilter}>
                            <SelectTrigger className="h-9 w-full">
                                <SelectValue>
                                    {priorityFilter === 'all' ? "All Priorities" : null}
                                </SelectValue>
                            </SelectTrigger>
                            <SelectContent>
                                <SelectItem value="all">All Priorities</SelectItem>
                                <SelectItem value="critical">Critical</SelectItem>
                                <SelectItem value="high">High</SelectItem>
                                <SelectItem value="medium">Medium</SelectItem>
                                <SelectItem value="low">Low</SelectItem>
                            </SelectContent>
                        </Select>
                     </div>

                     <div className="space-y-1.5">
                        <Select value={categoryFilter} onValueChange={setCategoryFilter}>
                            <SelectTrigger className="h-9 w-full">
                                <SelectValue>
                                    {categoryFilter === 'all' ? "All Categories" : null}
                                </SelectValue>
                            </SelectTrigger>
                            <SelectContent>
                                <SelectItem value="all">All Categories</SelectItem>
                                <SelectItem value="feature">Feature</SelectItem>
                                <SelectItem value="improvement">Improvement</SelectItem>
                                <SelectItem value="bug">Bug</SelectItem>
                            </SelectContent>
                        </Select>
                     </div>
                 </div>
              </FilterPopover>
            }
            actions={
                <Button onClick={() => setIsModalOpen(true)} size="sm" className="rounded-lg h-8 text-xs shrink-0">
                    <Plus className="mr-2 h-3.5 w-3.5" /> New Requirement
                </Button>
            }
        />
      </div>

      <div className="flex flex-col space-y-3">

        {filteredReqs.length === 0 ? (
          <EmptyState 
            icon={ClipboardList}
            title="No pending requirements" 
            description="Log a new client request to get started."
            action={
              <Button variant="link" onClick={() => setIsModalOpen(true)} className="text-primary">Add Requirement</Button>
            }
          />
        ) : (
                    <div className="space-y-4">
                        <div className="border border-zinc-200 dark:border-zinc-800 bg-white dark:bg-zinc-950 rounded-lg overflow-hidden text-[13px]">
                            <div className="overflow-x-auto">
                            <div className="min-w-[1000px] flex border-b border-zinc-200 dark:border-zinc-800 bg-zinc-50 dark:bg-zinc-900/50">
                                {['id', 'title', 'category', 'priority', 'organizations', 'reportedBy', 'comments'].map((key) => {
                                    const label = key === 'id' ? 'ID' : 
                                                  key === 'organizations' ? 'Organizations' : 
                                                  key === 'reportedBy' ? 'Reported By' : 
                                                  key.charAt(0).toUpperCase() + key.slice(1);
                                    
                                    if (key === 'comments') {
                                         return <div key={key} className="w-28 shrink-0 border-r border-zinc-200 dark:border-zinc-800 p-2 font-medium text-zinc-500 text-center">Comments</div>;
                                    }

                                    const widthClass = key === 'id' ? 'w-16' : 
                                                       key === 'category' ? 'w-24' : 
                                                       key === 'priority' ? 'w-24' : 
                                                       key === 'organizations' ? 'w-32' : 
                                                       key === 'reportedBy' ? 'w-32' : 'flex-1 min-w-[300px]';

                                    return (
                                        <div 
                                            key={key}
                                            className={`${widthClass} shrink-0 border-r border-zinc-200 dark:border-zinc-800 p-2 font-medium pl-3 text-zinc-500 cursor-pointer hover:bg-zinc-100 dark:hover:bg-zinc-800 transition-colors flex items-center ${key === 'id' ? 'justify-center' : 'justify-between'} group select-none relative`}
                                            onClick={() => handleSort(key)}
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
                                <div className="w-24 shrink-0 p-2 font-medium pl-3 text-zinc-500 text-center">Actions</div>
                            </div>

                        {/* Body */}
                        <DragDropContext onDragStart={() => setIsDragging(true)} onDragEnd={onDragEnd}>
                            <Droppable droppableId="requirements-list">
                                {(provided) => (
                                    <div 
                                        ref={provided.innerRef} 
                                        {...provided.droppableProps}
                                    >
                                        {filteredReqs.slice((currentPage - 1) * itemsPerPage, currentPage * itemsPerPage).map((req, i) => {
                                            const assignedOrgs = req.affectedOrganizations?.includes('all') 
                                                ? []
                                                : data.organizations.filter(o => req.affectedOrganizations?.includes(o.id));
                                            
                                            const orgsDisplay = req.affectedOrganizations?.includes('all') 
                                                ? 'All Organizations' 
                                                : assignedOrgs.length > 0 
                                                    ? (assignedOrgs.length === 1 ? assignedOrgs[0]?.name : `${assignedOrgs.length} Orgs`) 
                                                    : '-';
                                            const orgsTooltip = req.affectedOrganizations?.includes('all')
                                                ? 'All Organizations'
                                                : assignedOrgs.map(o => o?.name).join(', ');
                                            const isExpanded = expandedReqs.has(req.id);

                                            return (
                                                <Draggable key={req.id} draggableId={req.id} index={i}>
                                                    {(provided, snapshot) => (
                                                        <div 
                                                            ref={provided.innerRef}
                                                            {...provided.draggableProps}
                                                            style={{ ...provided.draggableProps.style }}
                                                            className={`min-w-[1000px] border-b border-zinc-100 dark:border-zinc-800 last:border-0 ${snapshot.isDragging ? "bg-white dark:bg-zinc-900 shadow-xl ring-1 ring-zinc-200 dark:ring-zinc-800 opacity-90 z-20" : ""}`}
                                                        >
                                                            <div className="group flex hover:bg-zinc-50 dark:hover:bg-zinc-800/30 transition-colors">
                                                                <div className="w-16 shrink-0 border-r border-zinc-100 dark:border-zinc-800 p-2 text-center text-zinc-400 font-mono text-xs flex items-center justify-between px-3">
                                                                    <div 
                                                                        {...provided.dragHandleProps}
                                                                        className="cursor-grab active:cursor-grabbing hover:text-zinc-600 transition-colors mr-2"
                                                                    >
                                                                        <GripVertical size={14} />
                                                                    </div>
                                                                    <span>{(currentPage - 1) * itemsPerPage + i + 1}</span>
                                                                    {req.description && (
                                                                        <button 
                                                                            onClick={(e) => toggleExpand(req.id, e)}
                                                                            className="p-0.5 hover:bg-zinc-200 dark:hover:bg-zinc-700 rounded-sm transition-colors text-zinc-400 hover:text-zinc-600 dark:text-zinc-500 dark:hover:text-zinc-300 ml-1"
                                                                        >
                                                                            <ChevronDown size={12} className={`transition-transform duration-200 ${isExpanded ? 'rotate-180' : ''}`} />
                                                                        </button>
                                                                    )}
                                                                </div>
                                                                <div className="flex-1 min-w-[300px] border-r border-zinc-100 dark:border-zinc-800 p-2 pl-3 font-medium text-zinc-700 dark:text-zinc-200 truncate cursor-pointer hover:underline" onClick={() => { setEditingRequirement(req); setEditingRequirementTab('details'); setIsModalOpen(true); }}>
                                                                    <Tooltip content={req.title} className="max-w-[400px] whitespace-normal">
                                                                        {req.title}
                                                                    </Tooltip>
                                                                </div>
                                                                <div className="w-24 shrink-0 border-r border-zinc-100 dark:border-zinc-800 p-2 pl-3 capitalize text-zinc-500">
                                                                    <div className="flex items-center h-full" onClick={(e) => e.stopPropagation()}>
                                                                        <Select value={req.category} onValueChange={(val) => actions.updateRequirement(req.id, { category: val as any })}>
                                                                            <SelectTrigger className="h-full w-full border-none shadow-none bg-transparent p-0 capitalize text-zinc-500 hover:text-zinc-700 dark:hover:text-zinc-300 focus:ring-0 [&>svg:last-child]:hidden justify-start">
                                                                                {req.category}
                                                                            </SelectTrigger>
                                                                            <SelectContent>
                                                                                <SelectItem value="feature">Feature</SelectItem>
                                                                                <SelectItem value="improvement">Improvement</SelectItem>
                                                                                <SelectItem value="bug">Bug</SelectItem>
                                                                            </SelectContent>
                                                                        </Select>
                                                                    </div>
                                                                </div>
                                                                <div className="w-24 shrink-0 border-r border-zinc-100 dark:border-zinc-800 p-2 pl-3">
                                                                    <div className="flex items-center h-full" onClick={(e) => e.stopPropagation()}>
                                                                        <Select value={req.priority} onValueChange={(val) => actions.updateRequirement(req.id, { priority: val as any })}>
                                                                            <SelectTrigger className="h-auto w-fit p-0 border-none shadow-none bg-transparent focus:ring-0 [&>svg:last-child]:hidden rounded-sm">
                                                                                <Badge variant={req.priority === 'critical' ? 'destructive' : req.priority === 'high' ? 'destructive' : req.priority === 'medium' ? 'secondary' : 'outline'} className={`rounded-sm px-1.5 py-0.5 text-[10px] font-bold uppercase transition-colors pointer-events-none ${req.priority === 'critical' ? 'bg-red-600 text-white hover:bg-red-700 dark:bg-red-700 dark:hover:bg-red-600 border-red-500' : ''}`}>
                                                                                    {req.priority}
                                                                                </Badge>
                                                                            </SelectTrigger>
                                                                            <SelectContent>
                                                                                <SelectItem value="critical">Critical</SelectItem>
                                                                                <SelectItem value="high">High</SelectItem>
                                                                                <SelectItem value="medium">Medium</SelectItem>
                                                                                <SelectItem value="low">Low</SelectItem>
                                                                            </SelectContent>
                                                                        </Select>
                                                                    </div>
                                                                </div>
                                                                <div className="w-32 shrink-0 border-r border-zinc-100 dark:border-zinc-800 p-1 pl-1 flex items-center justify-center" onClick={(e) => e.stopPropagation()}>
                                                                    <MultiSelectDropdown
                                                                        options={[
                                                                            { id: 'all', name: 'All Organizations' },
                                                                            ...data.organizations.map(o => ({ id: o.id, name: o.name }))
                                                                        ]}
                                                                        selectedIds={req.affectedOrganizations || []}
                                                                        onChange={(ids) => actions.updateRequirement(req.id, { affectedOrganizations: ids })}
                                                                        placeholder="Select Orgs"
                                                                        triggerVariant="ghost"
                                                                        triggerClassName="h-8 w-fit min-w-[20px] px-1 justify-center font-normal hover:bg-zinc-100 dark:hover:bg-zinc-800/50 border-none shadow-none"
                                                                        className="w-full flex justify-center"
                                                                        showArrow={false}
                                                                        renderValue={(selected) => {
                                                                            if (!selected || selected.length === 0) {
                                                                                return <span className="text-zinc-300 dark:text-zinc-700 text-[10px] italic">--</span>;
                                                                            }
                                                                            if (selected.includes('all')) return <span className="text-xs text-zinc-600 dark:text-zinc-400">All Orgs</span>;
                                                                            
                                                                            const count = selected.length;
                                                                            const firstOrgId = selected[0];
                                                                            const firstOrg = data.organizations.find(o => o.id === firstOrgId);

                                                                            if (count > 1) {
                                                                                 const names = selected.map(id => data.organizations.find(o => o.id === id)?.name).filter(Boolean);
                                                                                 return (
                                                                                     <Tooltip 
                                                                                         content={
                                                                                             <div className="flex flex-col gap-1 min-w-[120px]">
                                                                                                 <span className="font-semibold text-xs border-b border-zinc-700/50 pb-1 mb-0.5 text-zinc-300">Selected Orgs ({count})</span>
                                                                                                 {names.map((name, i) => (
                                                                                                     <span key={i} className="text-zinc-400 text-xs flex items-center gap-1.5">
                                                                                                         <span className="w-1 h-1 rounded-full bg-primary/50 shrink-0" />
                                                                                                         {name}
                                                                                                     </span>
                                                                                                 ))}
                                                                                             </div>
                                                                                         }
                                                                                         className="bg-zinc-900 border-zinc-800 p-2"
                                                                                     >
                                                                                        <span className="text-xs text-zinc-600 dark:text-zinc-400 truncate max-w-[100px] cursor-help">{count} Orgs</span>
                                                                                     </Tooltip>
                                                                                 );
                                                                            }

                                                                            const text = count === 1 ? firstOrg?.name : `${count} Orgs`;
                                                                            return <span className="text-xs text-zinc-600 dark:text-zinc-400 truncate max-w-[100px]">{text}</span>;
                                                                        }}
                                                                    />
                                                                </div>
                                                                <div className="w-32 shrink-0 border-r border-zinc-100 dark:border-zinc-800 p-2 pl-3 text-zinc-600 dark:text-zinc-400 truncate">
                                                                    <div className="flex items-center h-full w-full" onClick={(e) => e.stopPropagation()}>
                                                                        <Select 
                                                                            value={req.reportedBy && data.users.find(u => u.id === req.reportedBy || u.name === req.reportedBy) ? (data.users.find(u => u.id === req.reportedBy || u.name === req.reportedBy)?.id ?? 'unassigned') : 'unassigned'} 
                                                                            onValueChange={(val) => actions.updateRequirement(req.id, { reportedBy: val === 'unassigned' ? undefined : val })}
                                                                        >
                                                                            <SelectTrigger className="h-full w-full p-0 border-none shadow-none bg-transparent hover:bg-zinc-50 dark:hover:bg-zinc-800/10 focus:ring-0 flex items-center overflow-hidden [&>svg:last-child]:hidden">
                                                                                {(() => {
                                                                                    const reporter = data.users.find(u => u.id === req.reportedBy || u.name === req.reportedBy);
                                                                                    if (reporter) {
                                                                                        return (
                                                                                            <div className="flex items-center gap-2 pointer-events-none">
                                                                                                <div className="w-5 h-5 rounded-full bg-primary/10 text-primary flex items-center justify-center text-[10px] font-bold shrink-0">
                                                                                                    {reporter.name.charAt(0)}
                                                                                                </div>
                                                                                                <span className="text-sm truncate">{reporter.name}</span>
                                                                                            </div>
                                                                                        );
                                                                                    }
                                                                                    return <span className="text-zinc-400 italic pointer-events-none text-sm">{req.reportedBy || '-'}</span>;
                                                                                })()}
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
                                                                </div>
                                                                <div className="w-28 shrink-0 border-r border-zinc-100 dark:border-zinc-800 p-2 text-center">
                                                                    {req.comments && req.comments.length > 0 ? (
                                                                        <button 
                                                                            onClick={(e) => { e.stopPropagation(); setEditingRequirement(req); setEditingRequirementTab('comments'); setIsModalOpen(true); }}
                                                                            className="inline-flex items-center gap-1 text-zinc-400 hover:text-primary hover:bg-primary/5 px-2 py-1 rounded-md transition-colors"
                                                                        >
                                                                            <MessageSquare size={12} /> {req.comments.length}
                                                                        </button>
                                                                    ) : (
                                                                        <button 
                                                                            onClick={(e) => { e.stopPropagation(); setEditingRequirement(req); setEditingRequirementTab('comments'); setIsModalOpen(true); }}
                                                                            className="text-zinc-300 hover:text-zinc-500 transition-colors"
                                                                        >
                                                                            -
                                                                        </button>
                                                                    )}
                                                                </div>
                                                                <div className="w-24 shrink-0 p-1.5 flex justify-center gap-1 opacity-0 group-hover:opacity-100 transition-opacity">
                                                                    <Tooltip content="Edit Requirement" side="top">
                                                                        <Button variant="ghost" size="sm" className="h-6 w-6 p-0 text-muted-foreground hover:text-foreground" onClick={() => { setEditingRequirement(req); setEditingRequirementTab('details'); setIsModalOpen(true); }}>
                                                                            <Pencil size={12} />
                                                                        </Button>
                                                                    </Tooltip>
                                                                    <Tooltip content="Promote to Ticket" side="top">
                                                                        <Button variant="ghost" size="sm" className="h-6 w-6 p-0 text-muted-foreground hover:text-green-600" onClick={() => openConfirm('approve', req.id)}>
                                                                            <ArrowRight size={12} />
                                                                        </Button>
                                                                    </Tooltip>
                                                                    <Tooltip content="Delete Requirement" side="top">
                                                                        <Button variant="ghost" size="sm" className="h-6 w-6 p-0 text-muted-foreground hover:text-red-600" onClick={() => openConfirm('delete', req.id)}>
                                                                            <Plus className="rotate-45" size={12} />
                                                                        </Button>
                                                                    </Tooltip>
                                                                </div>
                                                            </div>
                                                            
                                                            <AnimatePresence>
                                                                {isExpanded && req.description && (
                                                                    <motion.div
                                                                        initial={{ height: 0, opacity: 0 }}
                                                                        animate={{ height: 'auto', opacity: 1 }}
                                                                        exit={{ height: 0, opacity: 0 }}
                                                                        transition={{ duration: 0.2 }}
                                                                        className="overflow-hidden bg-zinc-50/50 dark:bg-zinc-900/30 border-t border-zinc-100 dark:border-zinc-800"
                                                                    >
                                                                        <div className="p-3 pl-20 text-sm text-zinc-600 dark:text-zinc-400">
                                                                            <div className="font-semibold text-xs uppercase text-zinc-400 mb-1 flex items-center gap-1">
                                                                                <ClipboardList size={12} /> Description
                                                                            </div>
                                                                            {req.description}
                                                                        </div>
                                                                    </motion.div>
                                                                )}
                                                            </AnimatePresence>
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

                        {filteredReqs.length > itemsPerPage && (
                            <div className="flex items-center justify-between pt-2">
                                <div className="text-xs text-muted-foreground">
                                    Showing {(currentPage - 1) * itemsPerPage + 1} to {Math.min(currentPage * itemsPerPage, filteredReqs.length)} of {filteredReqs.length}
                                </div>
                                <div className="flex gap-1">
                                    <Button 
                                        variant="outline" 
                                        size="sm" 
                                        disabled={currentPage === 1}
                                        onClick={() => setCurrentPage(p => Math.max(1, p - 1))}
                                        className="h-8 w-8 p-0"
                                    >
                                        <ChevronLeft size={14} />
                                    </Button>
                                    <Button 
                                        variant="outline" 
                                        size="sm" 
                                        disabled={currentPage * itemsPerPage >= filteredReqs.length}
                                        onClick={() => setCurrentPage(p => p + 1)}
                                        className="h-8 w-8 p-0"
                                    >
                                        <ChevronRight size={14} />
                                    </Button>
                                </div>
                            </div>
                        )}
      </div>
        )}
      </div>

      <RequirementModal 
        isOpen={isModalOpen} 
        onClose={() => {
            setIsModalOpen(false);
            setEditingRequirement(null);
        }} 
        initialData={editingRequirement}
        initialTab={editingRequirementTab}
      />
      
      <ConfirmDialog 
        isOpen={confirmConfig.isOpen}
        onClose={() => setConfirmConfig({ ...confirmConfig, isOpen: false })}
        onConfirm={handleConfirm}
        title={confirmConfig.title}
        description={confirmConfig.description}
        variant={confirmConfig.type === 'delete' ? 'danger' : 'success'}
        confirmText={confirmConfig.type === 'delete' ? 'Delete' : 'Promote'}
      />
    </div>
  );
};

const RequirementModal = ({ isOpen, onClose, initialData, initialTab = 'details' }: { isOpen: boolean; onClose: () => void; initialData: Requirement | null; initialTab?: 'details' | 'comments' }) => {
  const { data, actions } = useData();
  const [activeTab, setActiveTab] = useState<'details' | 'comments'>('details');
  const [isSending, setIsSending] = useState(false);
  const commentsEndRef = React.useRef<HTMLDivElement>(null);

  // Get live requirement data to ensure comments update instantly
  const currentRequirement = initialData ? data.requirements.find(r => r.id === initialData.id) || initialData : null;

  const [formData, setFormData] = useState({
    title: '',
    description: '',
    // clientName removed from form
    category: 'feature' as TicketType,
    priority: 'medium' as Priority,
    reportedBy: '',
    affectedOrganizations: [] as string[]
  });

  React.useEffect(() => {
    if (isOpen) {
        setActiveTab(initialTab);
        if (initialData) {
            setFormData({
                title: initialData.title,
                description: initialData.description,
                category: initialData.category,
                priority: initialData.priority,
                reportedBy: initialData.reportedBy || '',
                affectedOrganizations: initialData.affectedOrganizations || []
            });
        } else {
            setFormData({
                title: '',
                description: '',
                category: 'feature',
                priority: 'medium',
                reportedBy: '',
                affectedOrganizations: []
            });
        }
    }
  }, [isOpen, initialData, initialTab]);

  // Scroll to bottom of comments when tab changes or new comments are added
  React.useEffect(() => {
    if (activeTab === 'comments' && commentsEndRef.current) {
        commentsEndRef.current.scrollIntoView({ behavior: 'smooth' });
    }
  }, [activeTab, currentRequirement?.comments]);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (initialData) {
        actions.updateRequirement(initialData.id, {
            ...formData,
        });
    } else {
        actions.addRequirement({
            ...formData,
            clientName: 'Unknown' // Default since input removed
        });
    }
    onClose();
  };

  return (
    <Modal isOpen={isOpen} onClose={onClose} title={
      <div className="flex items-center gap-3">
        <div className="p-2 bg-purple-100 dark:bg-purple-900/30 rounded-full text-purple-600 dark:text-purple-500">
           {initialData ? <Pencil size={20} /> : <ClipboardList size={20} />}
        </div>
        {initialData ? 'Edit Client Requirement' : 'New Client Requirement'}
      </div>
    }>
      {initialData && (
          <div className="flex gap-4 border-b border-zinc-100 dark:border-zinc-800 mb-4">
              <button 
                onClick={() => setActiveTab('details')}
                className={`pb-2 text-sm font-medium border-b-2 transition-colors ${activeTab === 'details' ? 'border-primary text-primary' : 'border-transparent text-zinc-500 hover:text-zinc-700'}`}
              >
                  Details
              </button>
              <button 
                onClick={() => setActiveTab('comments')}
                className={`pb-2 text-sm font-medium border-b-2 transition-colors flex items-center gap-2 ${activeTab === 'comments' ? 'border-primary text-primary' : 'border-transparent text-zinc-500 hover:text-zinc-700'}`}
              >
                  Comments
                  <span className="bg-zinc-100 dark:bg-zinc-800 text-zinc-600 dark:text-zinc-400 text-[10px] px-1.5 py-0.5 rounded-full">
                      {currentRequirement?.comments?.length || 0}
                  </span>
              </button>
          </div>
      )}

      {activeTab === 'details' ? (
        <form onSubmit={handleSubmit} className="space-y-4">
            <div className="space-y-1.5">
            <label className="text-xs font-bold uppercase text-primary mb-1 block">Title</label>
            <Input 
                required 
                placeholder="e.g. Export Reports to PDF"
                value={formData.title}
                onChange={e => setFormData({ ...formData, title: e.target.value })}
            />
            </div>

            <div className="grid grid-cols-2 gap-4">
            <div className="space-y-1.5 p-1">
                <label className="text-xs font-bold uppercase text-primary mb-1 block">Category</label>
                <Select 
                    value={formData.category} 
                    onValueChange={val => setFormData({...formData, category: val as TicketType})}
                >
                    <SelectTrigger className="capitalize">
                        <SelectValue placeholder="Type" />
                    </SelectTrigger>
                    <SelectContent>
                        <SelectItem value="feature">Feature</SelectItem>
                        <SelectItem value="improvement">Improvement</SelectItem>
                        <SelectItem value="bug">Bug</SelectItem>
                    </SelectContent>
                </Select>
            </div>
            
            <div className="space-y-1.5 p-1">
                <label className="text-xs font-bold uppercase text-primary mb-1 block">Priority</label>
                <Select 
                    value={formData.priority} 
                    onValueChange={val => setFormData({...formData, priority: val as Priority})}
                >
                    <SelectTrigger>
                        <SelectValue placeholder="Priority" />
                    </SelectTrigger>
                    <SelectContent>
                        <SelectItem value="critical">Critical</SelectItem>
                        <SelectItem value="high">High</SelectItem>
                        <SelectItem value="medium">Medium</SelectItem>
                        <SelectItem value="low">Low</SelectItem>
                    </SelectContent>
                </Select>
            </div>
            </div>


            

            <div className="space-y-1.5">
            <label className="text-xs font-bold uppercase text-primary mb-1 block">Reported By</label>
            <Select 
                value={formData.reportedBy} 
                onValueChange={val => setFormData({...formData, reportedBy: val})}
            >
                <SelectTrigger>
                    <SelectValue placeholder="Select User" />
                </SelectTrigger>
                <SelectContent>
                    {data.users.map(user => (
                        <SelectItem key={user.id} value={user.name}>{user.name}</SelectItem>
                    ))}
                </SelectContent>
            </Select>
            </div>
            <div className="space-y-1.5">
                <label className="text-xs font-bold uppercase text-primary mb-1 block">Assignees</label>
                <MultiSelectDropdown 
                    options={[{id: 'all', name: 'All Organizations'}, ...data.organizations]}
                    selectedIds={formData.affectedOrganizations}
                    onChange={(ids) => {
                        if (ids.includes('all')) {
                            if (formData.affectedOrganizations.includes('all')) {
                                setFormData({...formData, affectedOrganizations: []});
                            } else {
                                const allRealIds = data.organizations.map(d => d.id);
                                setFormData({...formData, affectedOrganizations: ['all', ...allRealIds]});
                            }
                        } else {
                            setFormData({...formData, affectedOrganizations: ids});
                        }
                    }}
                />
            </div>

            <div className="space-y-1.5">
            <label className="text-xs font-bold uppercase text-primary mb-1 block">Description</label>
            <Textarea 
                placeholder="Detailed requirements from the client..." 
                className="min-h-[120px]"
                value={formData.description}
                onChange={e => setFormData({ ...formData, description: e.target.value })}
            />
            </div>

            <div className="pt-4 flex justify-end gap-2">
            <Button type="button" variant="ghost" onClick={onClose}>Cancel</Button>
            <Button type="submit">{initialData ? 'Save Changes' : 'Create Requirement'}</Button>
            </div>
        </form>
      ) : (
          /* COMMENTS TAB */
          <div className="h-[400px] flex flex-col">
            <div className="flex-1 overflow-y-auto space-y-6 mb-4 pr-1">
               {(!currentRequirement?.comments || currentRequirement.comments.length === 0) && (
                   <div className="h-full flex flex-col items-center justify-center text-zinc-400">
                       <MessageSquare size={32} className="mb-2 opacity-20" />
                       <p className="text-sm italic">No comments yet.</p>
                       <p className="text-xs text-zinc-500">Start the discussion below.</p>
                   </div>
               )}
               
               {currentRequirement?.comments?.map((comment) => (
                   <div key={comment.id} className="flex gap-3 animate-in slide-in-from-bottom-2 fade-in duration-300">
                       <div className="w-8 h-8 rounded-full bg-zinc-100 dark:bg-zinc-800 flex items-center justify-center text-xs font-bold text-zinc-500 shrink-0">
                           {comment.author.charAt(0).toUpperCase()}
                       </div>
                       <div className="space-y-1">
                           <div className="flex items-center gap-2">
                               <span className="text-sm font-bold text-zinc-900 dark:text-zinc-100">{comment.author}</span>
                               <span className="text-xs text-zinc-400">{new Date(comment.createdAt).toLocaleDateString()} at {new Date(comment.createdAt).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit', hour12: true })}</span>
                           </div>
                           <p className="text-sm text-zinc-600 dark:text-zinc-300 leading-relaxed bg-zinc-50 dark:bg-zinc-900 p-2 rounded-md rounded-tl-none">
                               {comment.text}
                           </p>
                       </div>
                   </div>
               ))}
               <div ref={commentsEndRef} />
           </div>

           <div className="flex gap-2 items-end pt-2 border-t border-zinc-100 dark:border-zinc-800">
                <div className="w-8 h-8 rounded-full bg-primary/10 flex items-center justify-center text-xs font-bold text-primary shrink-0 mb-1">
                   U
               </div>
               <div className="flex-1 relative">
                   <Textarea 
                       placeholder="Add a comment... (Press Enter to send)" 
                        className="min-h-[32px] pr-10 resize-none py-1.5 text-sm transition-all duration-200"
                       onKeyDown={(e) => {
                           if (e.key === 'Enter' && !e.shiftKey) {
                               e.preventDefault();
                               const text = e.currentTarget.value;
                               if (!text.trim()) return;
                               
                               setIsSending(true);
                               const newComment = {
                                   id: crypto.randomUUID(),
                                   text: text,
                                   author: 'User', // In a real app, from auth context
                                   createdAt: Date.now()
                               };
                               
                               const updatedComments = [...(currentRequirement?.comments || []), newComment];
                               actions.updateRequirement(currentRequirement!.id, { comments: updatedComments });
                               e.currentTarget.value = '';
                               
                               setTimeout(() => setIsSending(false), 500);
                           }
                       }}
                   />
                   <div className={`absolute right-3 bottom-2 text-muted-foreground transition-all duration-300 ${isSending ? 'text-primary scale-110' : ''}`}>
                       <Send size={14} className={isSending ? 'animate-ping' : ''} />
                   </div>
               </div>
           </div>
       </div>
      )}
    </Modal>
  );
};
