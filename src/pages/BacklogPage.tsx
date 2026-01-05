import React, { useState, useMemo, useEffect } from 'react';
import { createPortal } from 'react-dom';
import { useData } from '@/context/DataContext';
import { Ticket, Sprint } from '@/types';
import { DragDropContext, Droppable, Draggable, DropResult } from '@hello-pangea/dnd';
import { Button } from '@/components/ui/Button';
import { Card } from '@/components/ui/Card';
import { Badge } from '@/components/ui/Badge';
import { Plus, ChevronRight, ChevronDown, ChevronUp, Trash2, User, History, CheckCircle2, Layers } from 'lucide-react';
import { format, addWeeks } from 'date-fns';
import { cn } from '@/lib/utils';
import { HeroDatePicker } from '@/components/ui/HeroDatePicker';
import { motion, useAnimation, useMotionValue, AnimatePresence, useDragControls } from 'framer-motion';
import { TicketDetailsDialog } from '@/components/team/TicketDetailsDialog';
import { PageToolbar } from '@/components/layout/PageToolbar';
import { ConfirmDialog } from '@/components/ui/ConfirmDialog';

export const BacklogPage = () => {
  const { data, actions } = useData();
  const [expandedSprints, setExpandedSprints] = useState<Set<string>>(new Set());
  const [selectedTicket, setSelectedTicket] = useState<Ticket | null>(null);
  const [isTicketModalOpen, setIsTicketModalOpen] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');
  const [windowHeight, setWindowHeight] = useState(typeof window !== 'undefined' ? window.innerHeight : 800);
  const [showHistory, setShowHistory] = useState(false);
  
  // Confirmation State
  const [confirmConfig, setConfirmConfig] = useState<{
      isOpen: boolean;
      sprintId: string | null;
  }>({ isOpen: false, sprintId: null });

  const controls = useAnimation();
  const dragControls = useDragControls();
  const y = useMotionValue(0);
  const isDragging = React.useRef(false);
  const [isBacklogExpanded, setIsBacklogExpanded] = useState(false);
  
  // Sprint Filters (sprintId -> userId | null)
  const [sprintFilters, setSprintFilters] = useState<Record<string, string | null>>({});

  const handleSprintFilter = (sprintId: string, userId: string | null) => {
    setSprintFilters(prev => ({
        ...prev,
        [sprintId]: prev[sprintId] === userId ? null : userId
    }));
  };

  const handleTicketClick = (ticket: Ticket) => {
    setSelectedTicket(ticket);
    setIsTicketModalOpen(true);
  };

  const handleQuickAddTicket = (sprintId: string, title: string) => {
    actions.addTicket({
        title,
        status: 'in_sprint',
        priority: 'medium',
        sprintId: sprintId,
        assignee: undefined,
        description: ''
    });
  };

  useEffect(() => {
    const handleResize = () => setWindowHeight(window.innerHeight);
    window.addEventListener('resize', handleResize);
    return () => window.removeEventListener('resize', handleResize);
  }, []);

  // Initial Position: Higher y offset means less visible height (10% less than 45%)
  useEffect(() => {
      // Push down by approx 55% of screen height to start
      controls.set({ y: windowHeight * 0.55 });
      setIsBacklogExpanded(true); 
  }, [controls, windowHeight]);

  const backlogTickets = useMemo(() => 
    data.tickets.filter(t => !t.sprintId && t.status !== 'shipped' && t.status !== 'done').sort((a, b) => a.order - b.order)
    .filter(t => t.title.toLowerCase().includes(searchQuery.toLowerCase()) || t.id.toLowerCase().includes(searchQuery.toLowerCase())),
  [data.tickets, searchQuery]);

  const sprints = useMemo(() => 
    [...data.sprints].sort((a, b) => a.createdAt - b.createdAt),
  [data.sprints]);

  const activeSprint = sprints.find(s => s.status === 'active');
  const plannedSprints = sprints.filter(s => s.status === 'planned');
  const completedSprints = useMemo(() => 
    sprints.filter(s => s.status === 'completed').sort((a, b) => b.endDate - a.endDate),
  [sprints]);

  // Helper to maintain expanded state (auto-expand active and first planned)
  useEffect(() => {
    const newExpanded = new Set(expandedSprints);
    if (activeSprint) newExpanded.add(activeSprint.id);
    if (plannedSprints.length > 0) newExpanded.add(plannedSprints[0].id);
    setExpandedSprints(newExpanded);
  }, [activeSprint?.id, plannedSprints.length]); 

  const toggleExpand = (id: string) => {
    const newSet = new Set(expandedSprints);
    if (newSet.has(id)) newSet.delete(id);
    else newSet.add(id);
    setExpandedSprints(newSet);
  };

  const onDragEnd = (result: DropResult) => {
    const { source, destination, draggableId } = result;

    if (!destination) return;
    if (source.droppableId === destination.droppableId && source.index === destination.index) return;

    // Handle Reordering within the same list
    if (source.droppableId === destination.droppableId) {
        const listId = source.droppableId;
        const currentTickets = listId === 'backlog' 
            ? backlogTickets 
            : data.tickets.filter(t => t.sprintId === listId).sort((a, b) => a.order - b.order);

        const newTickets = Array.from(currentTickets);
        const [movedTicket] = newTickets.splice(source.index, 1);
        newTickets.splice(destination.index, 0, movedTicket);

        // Update order for all affected tickets
        newTickets.forEach((ticket, index) => {
            if (ticket.order !== index) {
                actions.updateTicket(ticket.id, { order: index });
            }
        });
        return;
    }

    // Handle Moving between lists
    const ticketId = draggableId;
    const destId = destination.droppableId; // 'backlog' or sprintId

    if (destId === 'backlog') {
        actions.updateTicket(ticketId, { sprintId: undefined, status: 'backlog', order: destination.index }); 
    } else {
        actions.updateTicket(ticketId, { sprintId: destId, order: destination.index });
    }
  };

  const handleCreateSprint = () => {
    const nextSprintNum = sprints.length + 1;
    actions.addSprint({
        name: `Sprint ${nextSprintNum}`,
        status: 'planned',
        startDate: Date.now(),
        endDate: addWeeks(Date.now(), 1).getTime() // Default 1 week
    });
  };

  const handleStartSprint = (sprint: Sprint) => {
    if (activeSprint) {
        alert("Please complete the current active sprint first.");
        return;
    }
    const startDate = Date.now();
    const endDate = addWeeks(startDate, 1).getTime(); 
    actions.startSprint(sprint.id, startDate, endDate);
  };

  const handleCompleteSprint = (sprint: Sprint) => {
      const sprintTickets = data.tickets.filter(t => t.sprintId === sprint.id);
      const incomplete = sprintTickets.filter(t => t.status !== 'done' && t.status !== 'shipped');
      
      if (incomplete.length > 0) {
          if (confirm(`There are ${incomplete.length} incomplete tickets. Move them to backlog?`)) {
              incomplete.forEach(t => actions.updateTicket(t.id, { sprintId: undefined, status: 'backlog' }));
              actions.completeSprint(sprint.id);
          }
      } else {
          actions.completeSprint(sprint.id);
      }
  };

  const handleDeleteSprintClick = (sprintId: string) => {
      setConfirmConfig({ isOpen: true, sprintId });
  };

  const confirmDeleteSprint = () => {
      if (confirmConfig.sprintId) {
          actions.deleteSprint(confirmConfig.sprintId);
          setConfirmConfig({ isOpen: false, sprintId: null });
      }
  };

  // Bottom Sheet Logic
  const HEADER_HEIGHT = 50;
  // Use the visible viewport height for positioning (windowHeight - 64px app header)
  const visibleHeight = windowHeight - 64;
  // Container includes extra space from negative margins
  const containerHeight = visibleHeight + 32;
  // Collapsed State: Position so header is visible at bottom of VISIBLE area
  const collapsedY = visibleHeight - HEADER_HEIGHT;

  const handleSheetDragStart = () => {
      isDragging.current = true;
  };

  const handleSheetDragEnd = () => {
      setTimeout(() => {
          isDragging.current = false;
      }, 100);

      const currentY = y.get();
      // Update icon state based on threshold
      if (currentY > windowHeight * 0.8) { // Near bottom
          setIsBacklogExpanded(false);
      } else {
          setIsBacklogExpanded(true);
      }
  };

  const toggleSheet = () => {
      if (isDragging.current) return;

      const currentY = y.get();
      
      // Smart Toggle Logic
      // If currently collapsed (or near bottom) -> Go to HALF height
      if (currentY > windowHeight * 0.6) {
          controls.start({ y: windowHeight * 0.55 });
          setIsBacklogExpanded(true);
      } else {
          // If already open (half or full) -> Collapse to bottom
          controls.start({ y: collapsedY });
          setIsBacklogExpanded(false);
      }
  };

    // Custom scrollbar styles
    const scrollbarStyles = `
        .custom-scrollbar::-webkit-scrollbar {
            width: 6px;
            height: 6px;
        }
        .custom-scrollbar::-webkit-scrollbar-track {
            background: transparent;
        }
        .custom-scrollbar::-webkit-scrollbar-thumb {
            background: rgba(156, 163, 175, 0.3);
            border-radius: 3px;
        }
        .custom-scrollbar::-webkit-scrollbar-thumb:hover {
            background: rgba(156, 163, 175, 0.5);
        }
    `;

  return (
    <div className="flex flex-col min-h-[calc(100vh-4rem+1rem)] md:min-h-[calc(100vh-4rem+2rem)] relative bg-background -mx-4 md:-mx-8 -mb-4 md:-mb-8 overflow-hidden">
        <style>{scrollbarStyles}</style>
        <div className="pt-4 md:pt-8 pb-4 px-4 md:px-8">
             <PageToolbar
                title="Sprints"
                searchQuery={searchQuery}
                onSearchChange={setSearchQuery}
                searchPlaceholder="Search tickets..."
                count={sprints.length}
                countLabel="Sprints"
                actions={
                  <div className="flex items-center gap-3">
                     {/* History Toggle - matching Organizations "Show Inactive" style */}
                     <Button 
                        variant={showHistory ? "primary" : "outline"} 
                        size="sm" 
                        className={cn(
                            "h-8 text-xs gap-2 border-dashed",
                            showHistory && "bg-primary/10 text-primary border-primary/20 hover:bg-primary/20"
                        )}
                        onClick={() => setShowHistory(!showHistory)}
                     >
                        <History size={14} />
                        {showHistory ? "Showing Completed" : "Show Completed"}
                     </Button>
                     <Button size="sm" className="rounded-lg h-8 text-xs shrink-0" onClick={handleCreateSprint}>
                         <Plus className="mr-2 h-3.5 w-3.5" /> Create Sprint
                     </Button>
                  </div>
                }
            />
        </div>

        <DragDropContext onDragEnd={onDragEnd}>
            {/* Main Scrollable Area - Sprints */}
            <div className="flex-1 overflow-y-auto pb-64 scroll-smooth will-change-transform">
                <div className="space-y-6 w-full px-4 md:px-8">
                    {/* Empty State */}
                    {!activeSprint && plannedSprints.length === 0 && (
                        <div className="flex flex-col items-center justify-center py-24 text-center">
                            <div className="w-20 h-20 rounded-2xl bg-muted/50 flex items-center justify-center mb-6">
                                <Layers size={36} className="text-muted-foreground/50" />
                            </div>
                            <h3 className="text-xl font-semibold mb-2">No Sprints Yet</h3>
                            <p className="text-muted-foreground text-sm max-w-md mb-6">
                                Create your first sprint to start organizing your work into focused cycles. 
                                Drag tickets from the backlog below into sprints to plan your iterations.
                            </p>
                            <Button onClick={handleCreateSprint} className="rounded-lg">
                                <Plus className="mr-2 h-4 w-4" /> Create Your First Sprint
                            </Button>
                        </div>
                    )}

                    {/* Active Sprint Section */}
                    {activeSprint && (
                        <div className="space-y-3">
                            <h2 className="text-xs font-bold uppercase tracking-wider text-muted-foreground ml-1">Current Cycle</h2>
                            <SprintContainer 
                                sprint={activeSprint} 
                                tickets={data.tickets.filter(t => t.sprintId === activeSprint.id).sort((a, b) => a.order - b.order)}
                                isExpanded={expandedSprints.has(activeSprint.id)}
                                onToggle={() => toggleExpand(activeSprint.id)}
                                onComplete={() => handleCompleteSprint(activeSprint)}
                                onUpdateDates={(start, end) => actions.updateSprint(activeSprint.id, { startDate: start, endDate: end })}
                                onTicketClick={handleTicketClick}
                                users={data.users}
                                activeFilter={sprintFilters[activeSprint.id]}
                                onFilter={(userId) => handleSprintFilter(activeSprint.id, userId)}
                                onQuickAdd={(title) => handleQuickAddTicket(activeSprint.id, title)}
                            />
                        </div>
                    )}

                    {/* Planned Sprints */}
                    {plannedSprints.length > 0 && (
                        <div className="space-y-3">
                            <h2 className="text-xs font-bold uppercase tracking-wider text-muted-foreground ml-1">Up Next</h2>
                            <div className="space-y-4">
                                {plannedSprints.map(sprint => (
                                    <SprintContainer 
                                        key={sprint.id}
                                        sprint={sprint}
                                        tickets={data.tickets.filter(t => t.sprintId === sprint.id).sort((a, b) => a.order - b.order)}
                                        isExpanded={expandedSprints.has(sprint.id)}
                                        onToggle={() => toggleExpand(sprint.id)}
                                        onStart={() => handleStartSprint(sprint)}
                                        onDelete={() => handleDeleteSprintClick(sprint.id)}
                                        onUpdateDates={(start, end) => actions.updateSprint(sprint.id, { startDate: start, endDate: end })}
                                        onTicketClick={handleTicketClick}
                                        users={data.users}
                                        activeFilter={sprintFilters[sprint.id]}
                                        onFilter={(userId) => handleSprintFilter(sprint.id, userId)}
                                        onQuickAdd={(title) => handleQuickAddTicket(sprint.id, title)}
                                    />
                                ))}
                            </div>
                        </div>
                    )}

                    {/* Completed Sprints (History) - Inline */}
                    <AnimatePresence>
                        {showHistory && completedSprints.length > 0 && (
                            <motion.div 
                                initial={{ opacity: 0, height: 0 }}
                                animate={{ opacity: 1, height: 'auto' }}
                                exit={{ opacity: 0, height: 0 }}
                                transition={{ duration: 0.3 }}
                                className="space-y-3 overflow-hidden"
                            >
                                <h2 className="text-xs font-bold uppercase tracking-wider text-muted-foreground/60 ml-1 flex items-center gap-2">
                                    <History size={12} />
                                    Completed Sprints
                                </h2>
                                <div className="space-y-3 opacity-60">
                                    {completedSprints.map(sprint => (
                                        <SprintContainer 
                                            key={sprint.id}
                                            sprint={sprint}
                                            tickets={data.tickets.filter(t => t.sprintId === sprint.id).sort((a, b) => a.order - b.order)}
                                            isExpanded={expandedSprints.has(sprint.id)}
                                            onToggle={() => toggleExpand(sprint.id)}
                                            onTicketClick={handleTicketClick}
                                            isCompleted
                                            users={data.users}
                                            activeFilter={sprintFilters[sprint.id]}
                                            onFilter={(userId) => handleSprintFilter(sprint.id, userId)}
                                        />
                                    ))}
                                </div>
                            </motion.div>
                        )}
                    </AnimatePresence>
                </div>
            </div>

            {/* Draggable Bottom Sheet Backlog */}
            <motion.div 
                animate={controls}
                style={{ y, height: containerHeight }} 
                drag="y"
                dragControls={dragControls}
                dragListener={false}
                dragConstraints={{ top: 0, bottom: collapsedY }} 
                dragElastic={0.05}
                dragMomentum={false} 
                onDragStart={handleSheetDragStart}
                onDragEnd={handleSheetDragEnd}
                className="absolute -bottom-4 md:-bottom-8 left-4 right-4 md:left-8 md:right-8 bg-background border-t border-x border-border shadow-[0_-10px_40px_rgba(0,0,0,0.1)] z-20 rounded-t-2xl overflow-hidden flex flex-col will-change-transform"
            >
                {/* Header / Drag Handle */}
                <div 
                    className="h-[50px] bg-muted/40 border-b border-border/50 flex items-center justify-between px-6 cursor-grab active:cursor-grabbing hover:bg-muted/60 transition-colors shrink-0 touch-none select-none"
                    onClick={toggleSheet}
                    onPointerDown={(e) => dragControls.start(e)}
                    title="Click to toggle, drag to resize"
                >
                    <div className="flex items-center gap-3">
                        <div className="text-muted-foreground transition-transform duration-200">
                             {isBacklogExpanded ? <ChevronDown size={18} /> : <ChevronUp size={18} />}
                        </div>
                        <h3 className="font-bold text-sm">Backlog</h3>
                        <Badge variant="secondary" className="rounded-full px-2 py-0 text-[10px] h-5">{backlogTickets.length}</Badge>
                    </div>
                    
                    {/* Visual Drag Indicator */}
                    <div className="absolute left-1/2 top-3 -translate-x-1/2 p-2">
                         <div className="w-8 h-1 bg-zinc-300 dark:bg-zinc-700 rounded-full" />
                    </div>
                    
                    <div className="text-xs text-muted-foreground font-medium hidden sm:block opacity-70">
                        {isBacklogExpanded ? 'Click to close' : 'Click to expand'}
                    </div>
                </div>

                {/* Backlog Content - Table View */}
                <div className="flex-1 bg-background flex flex-col min-h-0">
                    {/* Table Header */}
                    <div className="flex items-center gap-4 px-6 py-2 border-b border-border/50 text-[10px] font-bold uppercase text-muted-foreground bg-muted/20">
                        <div className="w-16">ID</div>
                        <div className="flex-1">Title</div>
                        <div className="w-24">Priority</div>
                        <div className="w-28">Assignee</div>
                    </div>

                    <Droppable droppableId="backlog">
                        {(provided) => (
                            <div 
                                ref={provided.innerRef} 
                                {...provided.droppableProps}
                                className="flex-1 overflow-y-auto overflow-x-hidden pb-0 custom-scrollbar"
                                style={{ pointerEvents: 'auto' }}  
                            >
                                <div className="divide-y divide-border/50">
                                    {backlogTickets.map((ticket, index) => (
                                        <Draggable key={ticket.id} draggableId={ticket.id} index={index}>
                                            {(provided, snapshot) => {
                                                const child = (
                                                    <div
                                                        ref={provided.innerRef}
                                                        {...provided.draggableProps}
                                                        {...provided.dragHandleProps}
                                                        className={cn(
                                                            "group bg-background hover:bg-muted/30 transition-colors",
                                                            snapshot.isDragging && "shadow-lg ring-1 ring-primary/20 rounded-lg"
                                                        )}
                                                        style={provided.draggableProps.style}
                                                    >
                                                        <TicketTableRow 
                                                            ticket={ticket} 
                                                            onClick={() => handleTicketClick(ticket)}
                                                            users={data.users}
                                                            onAssign={(ticketId, userId) => actions.updateTicket(ticketId, { assignee: userId })}
                                                        />
                                                    </div>
                                                );
                                                
                                                // Use portal when dragging to avoid transform offset issues
                                                if (snapshot.isDragging) {
                                                    return createPortal(child, document.body);
                                                }
                                                return child;
                                            }}
                                        </Draggable>
                                    ))}
                                    {provided.placeholder}
                                    {backlogTickets.length === 0 && (
                                        <div className="text-center text-muted-foreground py-12 text-sm">
                                            <p>No tickets in backlog</p>
                                        </div>
                                    )}
                                </div>
                            </div>
                        )}
                    </Droppable>
                </div>
            </motion.div>
        </DragDropContext>

        <TicketDetailsDialog
            ticket={selectedTicket}
            isOpen={isTicketModalOpen}
            onClose={() => setIsTicketModalOpen(false)}
            onSave={(updates: Partial<Ticket>) => {
                if (selectedTicket) {
                    actions.updateTicket(selectedTicket.id, updates);
                    setIsTicketModalOpen(false);
                }
            }}
        />

        <ConfirmDialog
            isOpen={confirmConfig.isOpen}
            onClose={() => setConfirmConfig({ ...confirmConfig, isOpen: false })}
            onConfirm={confirmDeleteSprint}
            title="Delete Sprint"
            description="Are you sure you want to delete this sprint? This action cannot be undone."
            variant="danger"
            confirmText="Delete Sprint"
        />

    </div>
  );
};

interface SprintContainerProps {
    sprint: Sprint;
    tickets: Ticket[];
    isExpanded: boolean;
    onToggle: () => void;
    onStart?: () => void;
    onComplete?: () => void;
    onDelete?: () => void;
    onUpdateDates?: (start: number, end: number) => void;
    onTicketClick?: (ticket: Ticket) => void;
    isCompleted?: boolean;
    users?: { id: string; name: string; avatar?: string }[];
    activeFilter?: string | null;
    onFilter?: (userId: string | null) => void;
    onQuickAdd?: (title: string) => void;
}

const SprintContainer = ({ 
    sprint, 
    tickets, 
    isExpanded, 
    onToggle, 
    onStart, 
    onComplete,
    onDelete,
    onUpdateDates,
    onTicketClick,
    isCompleted = false,
    users = [],
    activeFilter,
    onFilter,
    onQuickAdd
}: SprintContainerProps) => {
    const [quickAddTitle, setQuickAddTitle] = useState("");
    const inputRef = React.useRef<HTMLInputElement>(null);

    const filteredTickets = useMemo(() => {
        if (!activeFilter) return tickets;
        return tickets.filter(t => t.assignee === activeFilter);
    }, [tickets, activeFilter]);

    const assignees = useMemo(() => {
        const ids = new Set(tickets.map(t => t.assignee).filter(Boolean) as string[]);
        return Array.from(ids).map(id => users.find(u => u.id === id || u.name === id)).filter(Boolean) as { id: string; name: string; avatar?: string }[];
    }, [tickets, users]);

    const handleQuickAddSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        if (!quickAddTitle.trim()) return;
        onQuickAdd?.(quickAddTitle);
        setQuickAddTitle("");
    };

    return (
        <div className={cn(
            "rounded-lg border shadow-sm overflow-hidden bg-card transition-all group", 
            sprint.status === 'active' ? 'ring-1 ring-primary/20 shadow-md' : 'opacity-95',
            isCompleted && 'border-dashed border-muted-foreground/20 bg-muted/30'
        )}>
            <div 
                className={cn(
                    "px-3 py-2 flex items-center justify-between cursor-pointer transition-colors border-b border-transparent",
                    sprint.status === 'active' 
                        ? "bg-zinc-50 dark:bg-zinc-900/50" 
                        : "bg-transparent hover:bg-zinc-50 dark:hover:bg-zinc-900/20",
                    isExpanded && "border-border/50"
                )}
                onClick={onToggle}
            >
                <div className="flex items-center gap-3">
                    <button className={cn("p-0.5 rounded transition-colors text-muted-foreground/70 group-hover:text-muted-foreground")}>
                        {isExpanded ? <ChevronDown size={14} /> : <ChevronRight size={14} />}
                    </button>
                    <div className="flex items-center gap-3">
                         <h3 className="font-semibold text-sm">{sprint.name}</h3>
                         {sprint.status === 'active' && <Badge className="bg-green-600/90 hover:bg-green-600 text-white border-none px-1.5 py-0 h-4 text-[10px] font-semibold">Active</Badge>}
                         {sprint.status === 'planned' && <Badge variant="outline" className="text-[10px] py-0 h-4 px-1.5 font-normal text-muted-foreground">Planned</Badge>}
                         
                        <div className="w-px h-3 bg-border mx-1" />
                        
                        <div className="flex items-center gap-4" onClick={(e) => e.stopPropagation()}>
                             <span className="text-xs text-muted-foreground flex items-center gap-1.5">
                                {tickets.length} issues
                             </span>

                             {/* Assignee Facepile */}
                             {assignees.length > 0 && (
                                <div className="flex -space-x-1.5 items-center">
                                    {assignees.slice(0, 5).map(user => (
                                        <div 
                                            key={user.id}
                                            onClick={(e) => {
                                                e.stopPropagation();
                                                onFilter?.(activeFilter === user.id ? null : user.id);
                                            }}
                                            className={cn(
                                                "w-5 h-5 rounded-full ring-2 ring-background flex items-center justify-center text-[9px] font-bold cursor-pointer transition-transform hover:scale-110 hover:z-10",
                                                activeFilter === user.id ? "ring-primary" : "opacity-80 hover:opacity-100",
                                                "bg-gradient-to-br from-indigo-500 to-purple-500 text-white"
                                            )}
                                            title={user.name}
                                        >
                                            {user.name.charAt(0).toUpperCase()}
                                        </div>
                                    ))}
                                    {assignees.length > 5 && (
                                        <div className="w-5 h-5 rounded-full ring-2 ring-background bg-muted flex items-center justify-center text-[8px] font-medium text-muted-foreground">
                                            +{assignees.length - 5}
                                        </div>
                                    )}
                                </div>
                             )}
                             
                             {/* Date Display */}
                             <div className="pl-2 border-l border-border/50 ml-2">
                                 {onUpdateDates ? (
                                    <HeroDatePicker
                                        className="h-7 text-xs px-2.5 py-1 font-normal border-transparent bg-transparent hover:bg-muted/50 rounded-md text-muted-foreground"
                                        hideClear
                                        date={{
                                            from: new Date(sprint.startDate),
                                            to: new Date(sprint.endDate)
                                        }}
                                        setDate={(range) => {
                                            if (range?.from && range?.to) {
                                                onUpdateDates(range.from.getTime(), range.to.getTime());
                                            }
                                        }}
                                    />
                                 ) : (
                                    <span className={cn("text-[10px] flex items-center gap-1 opacity-75", sprint.status === 'active' ? "text-zinc-400" : "text-muted-foreground")}>
                                        {format(sprint.startDate, 'MMM d')} - {format(sprint.endDate, 'MMM d')}
                                    </span>
                                 )}
                             </div>
                        </div>
                    </div>
                </div>
                <div className="flex items-center gap-2">
                    {activeFilter && (
                        <Button 
                            size="sm" 
                            variant="ghost" 
                            onClick={(e) => { e.stopPropagation(); onFilter?.(null); }} 
                            className="h-6 text-[10px] px-2 text-primary hover:text-primary hover:bg-primary/5"
                        >
                            Clear Filter
                        </Button>
                    )}
                    {sprint.status === 'planned' && onStart && (
                        <Button size="sm" onClick={(e) => { e.stopPropagation(); onStart(); }} className="h-6 text-xs px-2.5">
                            Start Sprint
                        </Button>
                    )}
                     {sprint.status === 'active' && onComplete && (
                        <Button 
                            size="sm" 
                            variant="secondary" 
                            onClick={(e) => { e.stopPropagation(); onComplete(); }} 
                            className="h-6 text-xs px-2.5 bg-zinc-100 hover:bg-zinc-200 dark:bg-zinc-800 dark:hover:bg-zinc-700 text-foreground border border-zinc-200 dark:border-zinc-700"
                        >
                            Complete
                        </Button>
                    )}
                     {sprint.status === 'planned' && onDelete && (
                        <Button size="icon" variant="ghost" onClick={(e) => { e.stopPropagation(); onDelete(); }} className="h-6 w-6 text-muted-foreground hover:text-destructive hover:bg-destructive/10">
                            <Trash2 size={13} /> 
                        </Button>
                    )}
                </div>
            </div>
            
            <AnimatePresence>
                {isExpanded && (
                    <motion.div 
                        initial={{ height: 0, opacity: 0 }}
                        animate={{ height: "auto", opacity: 1 }}
                        exit={{ height: 0, opacity: 0 }}
                        transition={{ duration: 0.2 }}
                        className="bg-transparent"
                    >
                        <Droppable droppableId={sprint.id}>
                            {(provided) => (
                                <div 
                                    ref={provided.innerRef} 
                                    {...provided.droppableProps}
                                    className="p-3 space-y-2 min-h-[60px]"
                                >
                                    {filteredTickets.map((ticket, index) => (
                                        <Draggable key={ticket.id} draggableId={ticket.id} index={index}>
                                            {(provided, snapshot) => {
                                                const child = (
                                                    <div
                                                        ref={provided.innerRef}
                                                        {...provided.draggableProps}
                                                        {...provided.dragHandleProps}
                                                        className={snapshot.isDragging ? "shadow-lg rounded-lg" : ""}
                                                        style={provided.draggableProps.style}
                                                    >
                                                        <TicketItem ticket={ticket} onClick={() => onTicketClick?.(ticket)} />
                                                    </div>
                                                );
                                                
                                                if (snapshot.isDragging) {
                                                    return createPortal(child, document.body);
                                                }
                                                return child;
                                            }}
                                        </Draggable>
                                    ))}
                                    {provided.placeholder}
                                    {filteredTickets.length === 0 && (
                                        <div className="text-xs text-center text-muted-foreground py-6 border-2 border-dashed border-muted-foreground/10 m-1 rounded-lg flex flex-col items-center justify-center gap-1.5 opacity-60">
                                            {activeFilter ? (
                                                <>
                                                    <div className="w-8 h-8 rounded-full bg-muted/50 flex items-center justify-center">
                                                        <User size={14} />
                                                    </div>
                                                    No tickets assigned to this user
                                                </>
                                            ) : (
                                                <>
                                                    <div className="w-6 h-6 rounded-full bg-muted/50 flex items-center justify-center">
                                                        <Plus size={12} />
                                                    </div>
                                                    Drag tickets here
                                                </>
                                            )}
                                        </div>
                                    )}
                                    
                                    {/* Quick Add */}
                                    {onQuickAdd && !activeFilter && (
                                        <form onSubmit={handleQuickAddSubmit} className="mt-2 px-1">
                                            <div className="relative group">
                                                 <div className="absolute left-3 top-2.5 text-muted-foreground/50">
                                                    <Plus size={14} />
                                                 </div>
                                                 <input 
                                                    ref={inputRef}
                                                    value={quickAddTitle}
                                                    onChange={(e) => setQuickAddTitle(e.target.value)}
                                                    placeholder="Quick add ticket..."
                                                    className="w-full bg-transparent border-none text-sm py-2 pl-9 focus:ring-0 placeholder:text-muted-foreground/40 group-hover:bg-muted/30 rounded-lg transition-colors"
                                                 />
                                            </div>
                                        </form>
                                    )}
                                </div>
                            )}
                        </Droppable>
                    </motion.div>
                )}
            </AnimatePresence>
        </div>
    );
};


const TicketItem = ({ ticket, compact, onClick }: { ticket: Ticket, compact?: boolean, onClick?: () => void }) => {
    return (
        <Card 
            className={cn(
                "py-2 px-3 hover:shadow-sm transition-all cursor-grab active:cursor-grabbing border-l-[3px] group bg-card hover:border-primary/30", 
                ticket.priority === 'critical' ? 'border-l-red-500' : 
                ticket.priority === 'high' ? 'border-l-orange-500' : 
                'border-l-transparent',
                onClick ? "cursor-pointer" : "",
                compact ? "h-full flex flex-col justify-between" : ""
            )}
            onClick={onClick}
        >
            <div className={cn("flex gap-3", compact ? "flex-col items-start" : "items-center justify-between")}>
                <div className="min-w-0 w-full">
                    <div className="flex items-center gap-2 mb-0.5">
                        <span className="text-[9px] font-mono text-muted-foreground/80 group-hover:text-primary transition-colors bg-muted/50 px-1.5 py-px rounded">
                            {ticket.category ? ticket.category.charAt(0).toUpperCase() : 'T'}-{ticket.categoryNumber || ticket.id.substring(0, 4)}
                        </span>
                        {!compact && ticket.assignee && (
                            <span className="w-4 h-4 rounded-full bg-primary/10 text-primary text-[9px] flex items-center justify-center font-bold ring-1 ring-primary/20">
                                {ticket.assignee.charAt(0).toUpperCase()}
                            </span>
                        )}
                        {compact && (
                             <Badge variant="outline" className="text-[9px] h-4 px-1 ml-auto capitalize">{ticket.priority}</Badge>
                        )}
                    </div>
                    <div className={cn("font-medium leading-tight text-foreground/90", compact ? "text-sm line-clamp-2" : "text-[13px] truncate")}>{ticket.title}</div>
                </div>
                {!compact && (
                     <Badge variant="outline" className="text-[10px] h-5 px-1.5 shrink-0 font-normal text-muted-foreground capitalize">{ticket.priority}</Badge>
                )}
                {compact && ticket.assignee && (
                    <div className="mt-2 pt-2 border-t w-full flex justify-end">
                        <span className="w-4 h-4 rounded-full bg-primary/10 text-primary text-[9px] flex items-center justify-center font-bold ring-1 ring-primary/20">
                            {ticket.assignee.charAt(0).toUpperCase()}
                        </span>
                    </div>
                )}
            </div>
        </Card>
    );
};

interface TicketTableRowProps {
    ticket: Ticket;
    onClick?: () => void;
    users?: { id: string; name: string; avatar?: string }[];
    onAssign?: (ticketId: string, userId: string | undefined) => void;
}

const TicketTableRow = ({ ticket, onClick, users = [], onAssign }: TicketTableRowProps) => {
    const [showAssignMenu, setShowAssignMenu] = useState(false);
    const assignee = users.find(u => u.id === ticket.assignee || u.name === ticket.assignee);

    return (
        <div 
            className="flex items-center gap-4 px-6 py-2.5 cursor-pointer hover:bg-muted/50 transition-colors border-b border-border/40 last:border-0"
            onClick={onClick}
        >
            <div className="w-16 shrink-0 font-mono text-xs text-muted-foreground/70 group-hover:text-primary/80 transition-colors">
                {ticket.category ? ticket.category.charAt(0).toUpperCase() : 'T'}-{ticket.categoryNumber || ticket.id.substring(0, 4)}
            </div>
            
            <div className="flex-1 min-w-0">
                <div className="font-medium text-sm truncate text-foreground/90">{ticket.title}</div>
            </div>

            <div className="w-24 shrink-0">
                <Badge variant="outline" className={cn(
                    "text-[10px] px-1.5 py-0 capitalize border-transparent bg-muted/50",
                    ticket.priority === 'critical' ? 'text-red-600 bg-red-50 dark:bg-red-900/20' :
                    ticket.priority === 'high' ? 'text-orange-600 bg-orange-50 dark:bg-orange-900/20' :
                    'text-muted-foreground'
                )}>
                    {ticket.priority}
                </Badge>
            </div>
            
            {/* Assignee with Dropdown */}
            <div className="w-28 shrink-0 flex justify-start relative">
                <div 
                    className={cn(
                        "flex items-center gap-1.5 px-2 py-1 rounded-md transition-colors cursor-pointer",
                        assignee ? "hover:bg-muted" : "hover:bg-muted/50 border border-dashed border-muted-foreground/30"
                    )}
                    onClick={(e) => {
                        e.stopPropagation();
                        if (onAssign) setShowAssignMenu(!showAssignMenu);
                    }}
                    title={assignee ? `Assigned to ${assignee.name}` : "Click to assign"}
                >
                    {assignee ? (
                        <>
                            <div className="w-5 h-5 rounded-full bg-primary/10 text-primary text-[10px] flex items-center justify-center font-bold ring-1 ring-primary/20">
                                {assignee.name.charAt(0).toUpperCase()}
                            </div>
                            <span className="text-xs text-muted-foreground truncate max-w-[60px]">{assignee.name.split(' ')[0]}</span>
                        </>
                    ) : (
                        <>
                            <User size={12} className="text-muted-foreground/50" />
                            <span className="text-[10px] text-muted-foreground/50">Assign</span>
                        </>
                    )}
                </div>

                {/* Dropdown Menu */}
                <AnimatePresence>
                    {showAssignMenu && onAssign && (
                        <>
                            <div className="fixed inset-0 z-40" onClick={(e) => { e.stopPropagation(); setShowAssignMenu(false); }} />
                            <motion.div
                                initial={{ opacity: 0, y: -5 }}
                                animate={{ opacity: 1, y: 0 }}
                                exit={{ opacity: 0, y: -5 }}
                                className="absolute right-0 top-full mt-1 z-50 bg-popover border border-border rounded-lg shadow-xl py-1 min-w-[140px]"
                            >
                                {/* Unassign Option */}
                                {assignee && (
                                    <button
                                        className="w-full px-3 py-1.5 text-left text-xs text-red-500 hover:bg-red-50 dark:hover:bg-red-900/20 flex items-center gap-2"
                                        onClick={(e) => {
                                            e.stopPropagation();
                                            onAssign(ticket.id, undefined);
                                            setShowAssignMenu(false);
                                        }}
                                    >
                                        <User size={12} /> Unassign
                                    </button>
                                )}
                                {assignee && users.length > 0 && <div className="border-t border-border/50 my-1" />}
                                
                                {/* User List */}
                                {users.map(user => (
                                    <button
                                        key={user.id}
                                        className={cn(
                                            "w-full px-3 py-1.5 text-left text-xs hover:bg-muted flex items-center gap-2",
                                            (user.id === ticket.assignee || user.name === ticket.assignee) && "bg-primary/10"
                                        )}
                                        onClick={(e) => {
                                            e.stopPropagation();
                                            onAssign(ticket.id, user.id);
                                            setShowAssignMenu(false);
                                        }}
                                    >
                                        <div className="w-5 h-5 rounded-full bg-primary/10 text-primary text-[10px] flex items-center justify-center font-bold">
                                            {user.name.charAt(0).toUpperCase()}
                                        </div>
                                        <span className="truncate">{user.name}</span>
                                        {(user.id === ticket.assignee || user.name === ticket.assignee) && (
                                            <CheckCircle2 size={12} className="ml-auto text-primary" />
                                        )}
                                    </button>
                                ))}
                                {users.length === 0 && (
                                    <div className="px-3 py-2 text-xs text-muted-foreground">No users available</div>
                                )}
                            </motion.div>
                        </>
                    )}
                </AnimatePresence>
            </div>
        </div>
    );
};
