import React, { useState, useEffect } from 'react';
import { AnimatePresence, motion } from 'framer-motion';
import { useData } from '@/context/DataContext';
import { Idea, Priority, TicketType, SourceType } from '@/types';
import { Button } from '@/components/ui/Button';

import { Badge } from '@/components/ui/Badge';
import { Modal } from '@/components/ui/Modal';
import { Input } from '@/components/ui/Input';
import { Textarea } from '@/components/ui/Textarea';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/Select';
import { Plus, ArrowRight, ChevronLeft, ChevronRight, Pencil, MessageSquare, Lightbulb, Send, ChevronDown, ClipboardList, ArrowUpDown, ArrowUp, ArrowDown } from 'lucide-react';
import { PageToolbar } from '@/components/layout/PageToolbar';
import { FilterPopover } from '@/components/ui/FilterPopover';
import { EmptyState } from '@/components/ui/EmptyState';
import { ConfirmDialog } from '@/components/ui/ConfirmDialog';
import { MultiSelectDropdown } from '@/components/ui/MultiSelectDropdown';
import { Tooltip } from '@/components/ui/Tooltip';


export const IdeasBoard = () => {
  const { data, actions } = useData();
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingIdea, setEditingIdea] = useState<Idea | null>(null);
  const [editingIdeaTab, setEditingIdeaTab] = useState<'details' | 'comments'>('details');
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
  const [priorityFilter, setPriorityFilter] = useState<string>('all');
  const [categoryFilter, setCategoryFilter] = useState<string>('all');
  const [searchQuery, setSearchQuery] = useState('');
  
  // State for sorting describe
  const [sortConfig, setSortConfig] = useState<{ key: string; direction: 'asc' | 'desc' } | null>(null);

  const [expandedIdeas, setExpandedIdeas] = useState<Set<string>>(new Set());

  const toggleExpand = (id: string, e: React.MouseEvent) => {
    e.stopPropagation();
    const newExpanded = new Set(expandedIdeas);
    if (newExpanded.has(id)) {
        newExpanded.delete(id);
    } else {
        newExpanded.add(id);
    }
    setExpandedIdeas(newExpanded);
  };
  
  const handleSort = (key: string) => {
    let direction: 'asc' | 'desc' = 'asc';
    if (sortConfig && sortConfig.key === key && sortConfig.direction === 'asc') {
        direction = 'desc';
    }
    setSortConfig({ key, direction });
  };

  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = 100;

  // Pending ideas sorted by order
  // We sort by order to ensure visual consistency with Drag and Drop
  const pendingIdeas = data.ideas
    .filter(i => i.status === 'pending')
    .sort((a, b) => (a.order || 0) - (b.order || 0));

  // Applied filters and sorting
  const filteredIdeas = pendingIdeas.filter(idea => {
    if (priorityFilter !== 'all' && idea.priority !== priorityFilter) return false;
    if (categoryFilter !== 'all' && idea.category !== categoryFilter) return false;
    if (searchQuery) {
        const query = searchQuery.toLowerCase();
        return (
            idea.title.toLowerCase().includes(query) ||
            idea.description.toLowerCase().includes(query) ||
            (idea.reportedBy && idea.reportedBy.toLowerCase().includes(query))
        );
    }
    return true;
  }).sort((a, b) => {
    if (!sortConfig) return 0;
    
    const { key, direction } = sortConfig;
    
    let aValue: any = a[key as keyof Idea];
    let bValue: any = b[key as keyof Idea];
    
    // Handle special cases
    if (key === 'organizations') {
        aValue = a.affectedOrganizations?.length || 0;
        bValue = b.affectedOrganizations?.length || 0;
    }
    
    if (aValue < bValue) return direction === 'asc' ? -1 : 1;
    if (aValue > bValue) return direction === 'asc' ? 1 : -1;
    return 0;
  });



  const openConfirm = (type: 'delete' | 'approve', id: string) => {
    if (type === 'delete') {
      setConfirmConfig({
        isOpen: true,
        type: 'delete',
        id,
        title: 'Delete Idea',
        description: 'Are you sure you want to delete this idea? This action cannot be undone.'
      });
    } else {
      setConfirmConfig({
        isOpen: true,
        type: 'approve',
        id,
        title: 'Approve Idea',
        description: 'This will convert the idea into a ticket in the backlog.'
      });
    }
  };

  const handleConfirm = () => {
    if (confirmConfig.type === 'delete' && confirmConfig.id) {
        actions.deleteIdea(confirmConfig.id);
    } else if (confirmConfig.type === 'approve' && confirmConfig.id) {
        actions.promoteIdeaToTicket(confirmConfig.id);
    }
  };

  const SortIcon = ({ column }: { column: string }) => {
      if (sortConfig?.key !== column) return <ArrowUpDown size={12} className="opacity-30" />;
      return sortConfig.direction === 'asc' ? <ArrowUp size={12} className="text-primary" /> : <ArrowDown size={12} className="text-primary" />;
  };

  // Keyboard shortcut for search
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if ((e.metaKey || e.ctrlKey) && e.key === 'k') {
        e.preventDefault();
        const input = document.getElementById('ideas-search-input');
        if (input) {
            input.focus();
        }
      }
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, []);

  return (
    <div className="flex flex-col">
      <div className="pt-4 md:pt-8 pb-4">
        {/* Toolbar Header (Design 3: Dense) */}
        <PageToolbar
            title="Ideas"
            searchQuery={searchQuery}
            onSearchChange={setSearchQuery}
            searchPlaceholder="Search ideas..."
            count={filteredIdeas.length}
            countLabel="Ideas"
            filters={
                  <FilterPopover
                    title="Filter Ideas"
                    activeCount={
                        (priorityFilter !== 'all' ? 1 : 0) + 
                        (categoryFilter !== 'all' ? 1 : 0)
                    }
                    onReset={() => {
                        setPriorityFilter('all');
                        setCategoryFilter('all');
                    }}
                  >
                     <div className="space-y-4">
                         <div className="space-y-1.5">
                             <label className="text-xs font-semibold text-muted-foreground uppercase">Priority</label>
                             <Select value={priorityFilter} onValueChange={setPriorityFilter}>
                                <SelectTrigger className="h-9 w-full">
                                  <span className="truncate capitalize">{priorityFilter === 'all' ? 'All Priorities' : priorityFilter}</span>
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
                             <label className="text-xs font-semibold text-muted-foreground uppercase">Category</label>
                             <Select value={categoryFilter} onValueChange={setCategoryFilter}>
                                <SelectTrigger className="h-9 w-full">
                                  <span className="truncate capitalize">{categoryFilter === 'all' ? 'All Categories' : categoryFilter}</span>
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
             <Button size="sm" className="rounded-lg h-8 text-xs shrink-0" onClick={() => setIsModalOpen(true)}>
                <Plus className="mr-2 h-3.5 w-3.5" /> New Idea
             </Button>
            }
        />
      </div>

      <div className="flex flex-col space-y-3">
        {filteredIdeas.length === 0 ? (
          <EmptyState 
            icon={Lightbulb}
            title="No ideas found"
            description={searchQuery ? "Try adjusting your search or filters." : "Start by adding a new requirement or feature request."}
            action={
              <Button variant="link" onClick={() => setIsModalOpen(true)}>Add Idea</Button>
            }
          />
        ) : (

                    <div className="space-y-4">
                        <div className="border border-zinc-200 dark:border-zinc-800 bg-white dark:bg-zinc-950 rounded-lg overflow-hidden text-[13px]">
                            <div className="overflow-x-auto">
                            <div className="min-w-[1000px] flex border-b border-zinc-200 dark:border-zinc-800 bg-zinc-50 dark:bg-zinc-900/50">
                                {/* Sortable Headers */}
                                <div    
                                    className="w-16 shrink-0 border-r border-zinc-200 dark:border-zinc-800 p-2 text-center text-zinc-500 font-medium cursor-pointer hover:bg-zinc-100 dark:hover:bg-zinc-800 transition-colors flex items-center justify-center gap-1 group select-none"
                                    onClick={() => handleSort('id')}
                                >
                                    ID
                                </div>
                                <div 
                                    className="flex-1 min-w-[300px] border-r border-zinc-200 dark:border-zinc-800 p-2 font-medium pl-3 text-zinc-500 cursor-pointer hover:bg-zinc-100 dark:hover:bg-zinc-800 transition-colors flex items-center justify-between group select-none"
                                    onClick={() => handleSort('title')}
                                >
                                    Title <SortIcon column="title" />
                                </div>
                                <div 
                                    className="w-24 shrink-0 border-r border-zinc-200 dark:border-zinc-800 p-2 font-medium pl-3 text-zinc-500 cursor-pointer hover:bg-zinc-100 dark:hover:bg-zinc-800 transition-colors flex items-center justify-between group select-none"
                                    onClick={() => handleSort('category')}
                                >
                                    Category <SortIcon column="category" />
                                </div>
                                <div 
                                    className="w-24 shrink-0 border-r border-zinc-200 dark:border-zinc-800 p-2 font-medium pl-3 text-zinc-500 cursor-pointer hover:bg-zinc-100 dark:hover:bg-zinc-800 transition-colors flex items-center justify-between group select-none"
                                    onClick={() => handleSort('priority')}
                                >
                                    Priority <SortIcon column="priority" />
                                </div>
                                <div 
                                    className="w-32 shrink-0 border-r border-zinc-200 dark:border-zinc-800 p-2 font-medium pl-3 text-zinc-500 cursor-pointer hover:bg-zinc-100 dark:hover:bg-zinc-800 transition-colors flex items-center justify-between group select-none"
                                    onClick={() => handleSort('organizations')}
                                >
                                    Organizations <SortIcon column="organizations" />
                                </div>
                                <div 
                                    className="w-32 shrink-0 border-r border-zinc-200 dark:border-zinc-800 p-2 font-medium pl-3 text-zinc-500 cursor-pointer hover:bg-zinc-100 dark:hover:bg-zinc-800 transition-colors flex items-center justify-between group select-none"
                                    onClick={() => handleSort('reportedBy')}
                                >
                                    Reported By <SortIcon column="reportedBy" />
                                </div>
                                <div className="w-28 shrink-0 border-r border-zinc-200 dark:border-zinc-800 p-2 font-medium text-zinc-500 text-center">Comments</div>
                                <div className="w-24 shrink-0 p-2 font-medium pl-3 text-zinc-500 text-center">Actions</div>
                            </div>
                            {filteredIdeas.slice((currentPage - 1) * itemsPerPage, currentPage * itemsPerPage).map((idea, i) => {
                                const assignedOrgs = idea.affectedOrganizations ? idea.affectedOrganizations.map(id => data.organizations.find(d => d.id === id)).filter(Boolean) : [];
                                const orgsDisplay = idea.affectedOrganizations?.includes('all') 
                                    ? 'All Team' 
                                    : assignedOrgs.length > 0 
                                        ? (assignedOrgs.length === 1 ? assignedOrgs[0]?.name : `${assignedOrgs.length} Orgs`) 
                                        : '-';
                                const orgsTooltip = idea.affectedOrganizations?.includes('all')
                                    ? 'All Organizations'
                                    : assignedOrgs.map(o => o?.name).join(', ');

                                const isExpanded = expandedIdeas.has(idea.id);

                                return (
                                <div key={idea.id} className="min-w-[1000px] border-b border-zinc-100 dark:border-zinc-800 last:border-0">
                                    <div className="group flex items-center hover:bg-zinc-50 dark:hover:bg-zinc-800/30 transition-colors">
                                    <div className="w-16 shrink-0 border-r border-zinc-100 dark:border-zinc-800 p-2 text-center text-zinc-400 font-mono text-xs flex items-center justify-between px-3">
                                        <span>{(currentPage - 1) * itemsPerPage + i + 1}</span>
                                        {idea.description && (
                                            <button 
                                                onClick={(e) => toggleExpand(idea.id, e)}
                                                className="p-0.5 hover:bg-zinc-200 dark:hover:bg-zinc-700 rounded-sm transition-colors text-zinc-400 hover:text-zinc-600 dark:text-zinc-500 dark:hover:text-zinc-300"
                                            >
                                                <ChevronDown size={12} className={`transition-transform duration-200 ${isExpanded ? 'rotate-180' : ''}`} />
                                            </button>
                                        )}
                                    </div>
                                    <div className="flex-1 min-w-[300px] border-r border-zinc-100 dark:border-zinc-800 p-2 pl-3 font-medium text-zinc-700 dark:text-zinc-200 truncate cursor-pointer hover:underline" onClick={() => { setEditingIdea(idea); setEditingIdeaTab('details'); setIsModalOpen(true); }}>
                                        <Tooltip content={idea.title} className="max-w-[400px] whitespace-normal">
                                            {idea.title}
                                        </Tooltip>
                                    </div>
                                    <div className="w-24 shrink-0 border-r border-zinc-100 dark:border-zinc-800 p-2 pl-3 capitalize text-zinc-500">
                                        {idea.category}
                                    </div>
                                    <div className="w-24 shrink-0 border-r border-zinc-100 dark:border-zinc-800 p-2 pl-3">
                                        <Badge variant={idea.priority === 'critical' ? 'destructive' : idea.priority === 'high' ? 'destructive' : idea.priority === 'medium' ? 'secondary' : 'outline'} className={`rounded-sm px-1.5 py-0.5 text-[10px] font-bold uppercase transition-colors ${idea.priority === 'critical' ? 'bg-red-600 text-white hover:bg-red-700 dark:bg-red-700 dark:hover:bg-red-600 border-red-500' : ''}`}>
                                            {idea.priority}
                                        </Badge>
                                    </div>
                                    <div className="w-32 shrink-0 border-r border-zinc-100 dark:border-zinc-800 p-2 pl-3 text-zinc-600 dark:text-zinc-400 truncate" title={orgsTooltip}>
                                        {orgsDisplay}
                                    </div>
                                    <div className="w-32 shrink-0 border-r border-zinc-100 dark:border-zinc-800 p-2 pl-3 text-zinc-600 dark:text-zinc-400 truncate">
                                        {idea.reportedBy || '-'}
                                    </div>
                                    <div className="w-28 shrink-0 border-r border-zinc-100 dark:border-zinc-800 p-2 text-center">
                                         {idea.comments && idea.comments.length > 0 ? (
                                            <button 
                                                onClick={(e) => { e.stopPropagation(); setEditingIdea(idea); setEditingIdeaTab('comments'); setIsModalOpen(true); }}
                                                className="inline-flex items-center gap-1 text-zinc-400 hover:text-primary hover:bg-primary/5 px-2 py-1 rounded-md transition-colors"
                                            >
                                                <MessageSquare size={12} /> {idea.comments.length}
                                            </button>
                                         ) : (
                                             <button 
                                                onClick={(e) => { e.stopPropagation(); setEditingIdea(idea); setEditingIdeaTab('comments'); setIsModalOpen(true); }}
                                                className="text-zinc-300 hover:text-zinc-500 transition-colors"
                                            >
                                                -
                                            </button>
                                         )}
                                    </div>
                                    <div className="w-24 shrink-0 p-1.5 flex justify-center gap-1 opacity-0 group-hover:opacity-100 transition-opacity">
                                        <Tooltip content="Edit Idea" side="top">
                                            <Button variant="ghost" size="sm" className="h-6 w-6 p-0 text-muted-foreground hover:text-foreground" onClick={() => { setEditingIdea(idea); setEditingIdeaTab('details'); setIsModalOpen(true); }}>
                                                <Pencil size={12} />
                                            </Button>
                                        </Tooltip>
                                        <Tooltip content="Promote to Ticket" side="top">
                                            <Button variant="ghost" size="sm" className="h-6 w-6 p-0 text-muted-foreground hover:text-green-600" onClick={() => openConfirm('approve', idea.id)}>
                                                <ArrowRight size={12} />
                                            </Button>
                                        </Tooltip>
                                        <Tooltip content="Delete Idea" side="top">
                                            <Button variant="ghost" size="sm" className="h-6 w-6 p-0 text-muted-foreground hover:text-red-600" onClick={() => openConfirm('delete', idea.id)}>
                                                <Plus className="rotate-45" size={12} />
                                            </Button>
                                        </Tooltip>
                                    </div>
                                </div>
                                    <AnimatePresence>
                                        {isExpanded && idea.description && (
                                            <motion.div
                                                initial={{ height: 0, opacity: 0 }}
                                                animate={{ height: 'auto', opacity: 1 }}
                                                exit={{ height: 0, opacity: 0 }}
                                                transition={{ duration: 0.2 }}
                                                className="overflow-hidden bg-zinc-50/50 dark:bg-zinc-900/30 border-t border-zinc-100 dark:border-zinc-800"
                                            >
                                                <div className="p-3 pl-16 text-sm text-zinc-600 dark:text-zinc-400">
                                                    <div className="font-semibold text-xs uppercase text-zinc-400 mb-1 flex items-center gap-1">
                                                        <ClipboardList size={12} /> Description
                                                    </div>
                                                    {idea.description}
                                                </div>
                                            </motion.div>
                                        )}
                                    </AnimatePresence>
                                </div>
                                );
                            })}
                        </div>
                        </div>

                    {filteredIdeas.length > itemsPerPage && (
                        <div className="flex items-center justify-between pt-2">
                             <div className="text-xs text-muted-foreground">
                                Showing {(currentPage - 1) * itemsPerPage + 1} to {Math.min(currentPage * itemsPerPage, filteredIdeas.length)} of {filteredIdeas.length}
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
                                    disabled={currentPage * itemsPerPage >= filteredIdeas.length}
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

      <IdeaModal 
        isOpen={isModalOpen} 
        onClose={() => {
            setIsModalOpen(false);
            setEditingIdea(null);
        }} 
        initialData={editingIdea}
        initialTab={editingIdeaTab}
      />
      
      <ConfirmDialog 
        isOpen={confirmConfig.isOpen}
        onClose={() => setConfirmConfig({ ...confirmConfig, isOpen: false })}
        onConfirm={handleConfirm}
        title={confirmConfig.title}
        description={confirmConfig.description}
        variant={confirmConfig.type === 'delete' ? 'danger' : 'success'}
        confirmText={confirmConfig.type === 'delete' ? 'Delete' : 'Approve'}
      />
    </div>
  );
};

const IdeaModal = ({ isOpen, onClose, initialData, initialTab = 'details' }: { isOpen: boolean; onClose: () => void; initialData: Idea | null; initialTab?: 'details' | 'comments' }) => {
  const { data, actions } = useData();
  const [activeTab, setActiveTab] = useState<'details' | 'comments'>('details');
  const [isSending, setIsSending] = useState(false);
  const commentsEndRef = React.useRef<HTMLDivElement>(null);

  // Get live idea data to ensure comments update instantly
  const currentIdea = initialData ? data.ideas.find(i => i.id === initialData.id) || initialData : null;

  const [formData, setFormData] = useState({
    title: '',
    description: '',
    businessValue: '',
    sourceType: 'internal' as SourceType,
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
                businessValue: initialData.businessValue || '',
                sourceType: initialData.sourceType,
                category: initialData.category,
                priority: initialData.priority,
                reportedBy: initialData.reportedBy || '',
                affectedOrganizations: initialData.affectedOrganizations || []
            });
        } else {
            setFormData({
                title: '',
                description: '',
                businessValue: '',
                sourceType: 'internal',
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
  }, [activeTab, currentIdea?.comments]);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (initialData) {
        actions.updateIdea(initialData.id, formData);
    } else {
        actions.addIdea(formData);
    }
    onClose();
  };

  return (
    <Modal isOpen={isOpen} onClose={onClose} title={
      <div className="flex items-center gap-3">
         <div className="p-2 bg-yellow-100 dark:bg-yellow-900/30 rounded-full text-yellow-600 dark:text-yellow-500">
           {initialData ? <Pencil size={20} /> : <Lightbulb size={20} />}
        </div>
        {initialData ? 'Edit Idea' : 'New Idea'}
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
                      {currentIdea?.comments?.length || 0}
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
                placeholder="e.g. Add Google Login"
                value={formData.title}
                onChange={e => setFormData({ ...formData, title: e.target.value })}
            />
            </div>
            
            <div className="grid grid-cols-2 gap-4">
            <div className="space-y-1.5">
                <label className="text-xs font-bold uppercase text-primary mb-1 block">Type</label>
                <Select 
                    value={formData.category} 
                    onValueChange={val => setFormData({...formData, category: val as TicketType})}
                >
                    <SelectTrigger className="capitalize">
                        <SelectValue placeholder="Select Type" />
                    </SelectTrigger>
                    <SelectContent>
                        <SelectItem value="feature">Feature</SelectItem>
                        <SelectItem value="improvement">Improvement</SelectItem>
                        <SelectItem value="bug">Bug</SelectItem>
                    </SelectContent>
                </Select>
            </div>
            <div className="space-y-1.5">
                <label className="text-xs font-bold uppercase text-primary mb-1 block">Priority</label>
                <Select 
                    value={formData.priority} 
                    onValueChange={val => setFormData({...formData, priority: val as Priority})}
                >
                    <SelectTrigger>
                        <SelectValue placeholder="Select Priority" />
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

            <div className="grid grid-cols-2 gap-4">
                <div className="space-y-1.5">
                <label className="text-xs font-bold uppercase text-primary mb-1 block">Source</label>
                <Select 
                    value={formData.sourceType} 
                    onValueChange={val => setFormData({...formData, sourceType: val as SourceType})}
                >
                    <SelectTrigger className="capitalize">
                        <SelectValue placeholder="Select Source" />
                    </SelectTrigger>
                    <SelectContent>
                        <SelectItem value="internal">Internal Team</SelectItem>
                        <SelectItem value="client">Client Request</SelectItem>
                    </SelectContent>
                </Select>
            </div>
                <div className="space-y-1.5">
                <label className="text-xs font-bold uppercase text-primary mb-1 block">Business Value</label>
                <Input 
                    placeholder="High, roughly $5k/mo..."
                    value={formData.businessValue}
                    onChange={e => setFormData({...formData, businessValue: e.target.value})}
                />
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
                    <label className="text-xs font-bold uppercase text-primary mb-1 block">Affected Organizations</label>
                    <MultiSelectDropdown 
                        options={[{id: 'all', name: 'All Organizations'}, ...data.organizations]}
                        selectedIds={formData.affectedOrganizations}
                        onChange={(ids) => {
                            if (ids.includes('all')) {
                                if (formData.affectedOrganizations.includes('all')) {
                                    setFormData({...formData, affectedOrganizations: []});
                                } else {
                                    setFormData({...formData, affectedOrganizations: ['all']});
                                }
                            } else {
                                setFormData({...formData, affectedOrganizations: ids.filter(id => id !== 'all')});
                            }
                        }}
                        placeholder="Select organizations..."
                    />
                </div>

            <div className="space-y-1.5">
            <label className="text-xs font-bold uppercase text-primary mb-1 block">Description</label>
            <Textarea 
                placeholder="Describe the problem and solution..." 
                className="min-h-[120px]"
                value={formData.description}
                onChange={e => setFormData({ ...formData, description: e.target.value })}
            />
            </div>

            <div className="pt-4 flex justify-end gap-2">
            <Button type="button" variant="ghost" onClick={onClose}>Cancel</Button>
            <Button type="submit">{initialData ? 'Save Changes' : 'Create Idea'}</Button>
            </div>
        </form>
      ) : (
          /* COMMENTS TAB */
           <div className="h-[400px] flex flex-col">
             <div className="flex-1 overflow-y-auto space-y-6 mb-4 pr-1">
                {(!currentIdea?.comments || currentIdea.comments.length === 0) && (
                    <div className="h-full flex flex-col items-center justify-center text-zinc-400">
                        <MessageSquare size={32} className="mb-2 opacity-20" />
                        <p className="text-sm italic">No comments yet.</p>
                        <p className="text-xs text-zinc-500">Start the discussion below.</p>
                    </div>
                )}
                
                {currentIdea?.comments?.map((comment) => (
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
                                
                                const updatedComments = [...(currentIdea?.comments || []), newComment];
                                actions.updateIdea(currentIdea!.id, { comments: updatedComments });
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
