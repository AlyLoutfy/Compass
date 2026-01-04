import React, { useMemo, useState } from 'react';
import { AnimatePresence, motion } from 'framer-motion';
import { ClipboardList, ChevronDown, X } from 'lucide-react';
import { useData } from '@/context/DataContext';
import { Ticket, TicketStatus } from '@/types';
import { Card, CardContent } from '@/components/ui/Card';
import { Badge } from '@/components/ui/Badge';
import { Button } from '@/components/ui/Button';
import { Select, SelectContent, SelectItem, SelectTrigger } from '@/components/ui/Select';
import { AlertCircle, CheckCircle2, Circle, Loader2, Package, PauseCircle, Rocket, Plus, LayoutGrid, List, Pencil } from 'lucide-react';
import { TicketDetailsDialog } from '@/components/team/TicketDetailsDialog';
import { DragDropContext, Droppable, Draggable, DropResult } from '@hello-pangea/dnd';
import { PageToolbar } from '@/components/layout/PageToolbar';

const COLUMN_CONFIG: { id: TicketStatus; label: string; icon: any; color: string }[] = [
  { id: 'backlog', label: 'Backlog', icon: Package, color: 'text-slate-500' },
  { id: 'in_sprint', label: 'Sprint', icon: Circle, color: 'text-blue-500' },
  { id: 'in_progress', label: 'In Progress', icon: Loader2, color: 'text-amber-500' },
  { id: 'ready_for_qa', label: 'Ready for QA', icon: AlertCircle, color: 'text-purple-500' },
  { id: 'done', label: 'Done', icon: CheckCircle2, color: 'text-emerald-500' },
  { id: 'blocked', label: 'Blocked', icon: PauseCircle, color: 'text-red-500' },
  { id: 'shipped', label: 'Shipped', icon: Rocket, color: 'text-indigo-600' }
];

export const TicketsBoard = () => {
  const { data, actions } = useData();
  const [filterPriority, setFilterPriority] = useState<string>('all');
  const [filterUser, setFilterUser] = useState<string>('all');
  const [searchQuery, setSearchQuery] = useState('');
  const [viewMode, setViewMode] = useState<'board' | 'list'>('board');
  const [editingTicket, setEditingTicket] = useState<Ticket | null>(null);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [expandedTickets, setExpandedTickets] = useState<Set<string>>(new Set());

  const toggleExpand = (id: string, e: React.MouseEvent) => {
    e.stopPropagation();
    const newSet = new Set(expandedTickets);
    if (newSet.has(id)) {
        newSet.delete(id);
    } else {
        newSet.add(id);
    }
    setExpandedTickets(newSet);
  };

  const openNewTicketModal = () => {
    setEditingTicket(null);
    setIsModalOpen(true);
  };

  const openEditTicketModal = (ticket: Ticket) => {
    setEditingTicket(ticket);
    setIsModalOpen(true);
  };

  const filteredTickets = useMemo(() => {
    return data.tickets.filter(t => {
      if (searchQuery) {
          const query = searchQuery.toLowerCase();
          const matchesTitle = t.title.toLowerCase().includes(query);
          const matchesDesc = t.description?.toLowerCase().includes(query);
          if (!matchesTitle && !matchesDesc) return false;
      }
      if (filterPriority !== 'all' && t.priority !== filterPriority) return false;
      if (filterUser !== 'all' && t.assignee !== filterUser) return false;
      return true;
    });
  }, [data.tickets, filterPriority, filterUser, searchQuery]);

  const columns = useMemo(() => {
    const cols: Record<string, Ticket[]> = {
      backlog: [],
      in_sprint: [],
      in_progress: [],
      blocked: [],
      ready_for_qa: [],
      done: [],
      shipped: []
    };
    filteredTickets.forEach(t => {
      // Handle potential legacy statuses or mismatches if any
      const status = t.status || 'backlog';
      if (cols[status]) cols[status].push(t);
    });
    return cols;
  }, [filteredTickets]);

  const onDragEnd = (result: DropResult) => {
      const { destination, source, draggableId } = result;

      if (!destination) return;
      if (destination.droppableId === source.droppableId && destination.index === source.index) return;

      const newStatus = destination.droppableId as TicketStatus;
      actions.moveTicket(draggableId, newStatus);
  };

  const handleSaveTicket = (ticketData: Partial<Ticket>) => {
      if (editingTicket) {
        // Update existing
        actions.updateTicket(editingTicket.id, ticketData);
      } else {
        // Create new
        const newTicket: any = {
            title: ticketData.title || 'Untitled',
            description: ticketData.description || '',
            priority: ticketData.priority || 'medium',
            status: ticketData.status || 'backlog',
            assignee: ticketData.assignee || undefined,
            tags: [],
        };
        actions.addTicket(newTicket);
      }
      setIsModalOpen(false);
      setEditingTicket(null);
  };

  // Helper to find assignee name
  const getUserName = (id?: string) => {
      if (!id) return null;
      return data.users.find(u => u.id === id)?.name;
  }

  return (
    <div className="flex flex-col">
       <div className="pt-4 md:pt-8 pb-4">
           <PageToolbar
                title="Tickets"
                searchQuery={searchQuery}
                onSearchChange={setSearchQuery}
                searchPlaceholder="Search tickets..."
                count={filteredTickets.length}
                countLabel="Tickets"
                filters={
                    <>
                      <motion.div layout className="relative" transition={{ type: "spring", bounce: 0, duration: 0.3 }}>
                         <Select value={filterPriority} onValueChange={setFilterPriority}>
                            <SelectTrigger className="h-8 text-xs border-dashed border-zinc-300 dark:border-zinc-700 shadow-none hover:bg-zinc-50 dark:hover:bg-zinc-800 w-auto min-w-[120px] px-2.5 transition-none">
                              <span className="truncate capitalize">{filterPriority === 'all' ? 'Priority: All' : `Priority: ${filterPriority}`}</span>
                            </SelectTrigger>
                             <SelectContent>
                                <SelectItem value="all">All Priorities</SelectItem>
                                <SelectItem value="critical">Critical</SelectItem>
                                <SelectItem value="high">High</SelectItem>
                                <SelectItem value="medium">Medium</SelectItem>
                                <SelectItem value="low">Low</SelectItem>
                             </SelectContent>
                          </Select>
                          <AnimatePresence>
                          {filterPriority !== 'all' && (
                            <motion.button
                                initial={{ opacity: 0, scale: 0.5 }}
                                animate={{ opacity: 1, scale: 1 }}
                                exit={{ opacity: 0, scale: 0.5 }}
                                onClick={(e) => {
                                    e.stopPropagation();
                                    setFilterPriority('all');
                                }}
                                className="absolute -top-1.5 -right-1.5 h-4 w-4 bg-zinc-500 hover:bg-zinc-600 text-white rounded-full flex items-center justify-center shadow-sm z-10 transition-colors"
                            >
                                <X size={10} strokeWidth={3} />
                            </motion.button>
                          )}
                          </AnimatePresence>
                      </motion.div>

                      <motion.div layout className="relative" transition={{ type: "spring", bounce: 0, duration: 0.3 }}>
                         <Select value={filterUser} onValueChange={setFilterUser}>
                            <SelectTrigger className="h-8 text-xs border-dashed border-zinc-300 dark:border-zinc-700 shadow-none hover:bg-zinc-50 dark:hover:bg-zinc-800 w-auto min-w-[120px] px-2.5 transition-none">
                              <span className="truncate capitalize">
                                {filterUser === 'all' 
                                    ? 'User: All' 
                                    : `User: ${data.users.find(u => u.id === filterUser)?.name || filterUser}`
                                }
                              </span>
                            </SelectTrigger>
                             <SelectContent>
                                <SelectItem value="all">All Users</SelectItem>
                                {data.users.map(u => (
                                    <SelectItem key={u.id} value={u.id}>{u.name}</SelectItem>
                                ))}
                             </SelectContent>
                          </Select>
                          <AnimatePresence>
                          {filterUser !== 'all' && (
                            <motion.button
                                initial={{ opacity: 0, scale: 0.5 }}
                                animate={{ opacity: 1, scale: 1 }}
                                exit={{ opacity: 0, scale: 0.5 }}
                                onClick={(e) => {
                                    e.stopPropagation();
                                    setFilterUser('all');
                                }}
                                className="absolute -top-1.5 -right-1.5 h-4 w-4 bg-zinc-500 hover:bg-zinc-600 text-white rounded-full flex items-center justify-center shadow-sm z-10 transition-colors"
                            >
                                <X size={10} strokeWidth={3} />
                            </motion.button>
                          )}
                          </AnimatePresence>
                      </motion.div>
                    </>
                }
                actions={
                    <>
                        <div className="flex items-center bg-zinc-100 dark:bg-zinc-800 rounded-lg p-1 mr-2">
                             <button 
                                 onClick={() => setViewMode('board')}
                                 className={`p-1.5 rounded-md transition-all ${viewMode === 'board' ? 'bg-white dark:bg-zinc-700 shadow-sm text-zinc-900 dark:text-zinc-100' : 'text-zinc-400 hover:text-zinc-600 dark:hover:text-zinc-300'}`}
                             >
                                 <LayoutGrid size={16} />
                             </button>
                             <button 
                                 onClick={() => setViewMode('list')}
                                 className={`p-1.5 rounded-md transition-all ${viewMode === 'list' ? 'bg-white dark:bg-zinc-700 shadow-sm text-zinc-900 dark:text-zinc-100' : 'text-zinc-400 hover:text-zinc-600 dark:hover:text-zinc-300'}`}
                             >
                                 <List size={16} />
                             </button>
                        </div>
                        <Button size="sm" onClick={openNewTicketModal} className="h-8 text-xs rounded-lg">
                            <Plus className="w-3.5 h-3.5 mr-2" />
                            New Ticket
                        </Button>
                    </>
                }
           />
       </div>

       <div className="flex-1 overflow-x-auto overflow-y-hidden pb-4">
          <AnimatePresence mode="wait">
            {viewMode === 'board' ? (
                <motion.div
                    key="board"
                    initial={{ opacity: 0, x: -20 }}
                    animate={{ opacity: 1, x: 0 }}
                    exit={{ opacity: 0, x: 20 }}
                    transition={{ duration: 0.2 }}
                    className="h-full"
                >
                    <DragDropContext onDragEnd={onDragEnd}>
                    <div className="flex gap-4 h-full min-w-max px-2">
                        {COLUMN_CONFIG.filter(c => c.id !== 'shipped').map((col) => (
                            <div key={col.id} className="w-[280px] shrink-0 flex flex-col h-full bg-slate-50 dark:bg-zinc-900/50 rounded-xl border border-slate-200 dark:border-zinc-800 shadow-sm">
                                <div className="p-3 border-b border-slate-100 dark:border-zinc-800 flex items-center justify-between sticky top-0 bg-slate-50/95 dark:bg-zinc-900/95 backdrop-blur-sm rounded-t-xl z-10">
                                    <div className="flex items-center gap-2 font-medium text-sm text-slate-700 dark:text-zinc-200">
                                        <col.icon size={16} className={col.color} />
                                        {col.label}
                                        <span className="ml-1 text-xs text-muted-foreground bg-slate-200/50 dark:bg-zinc-800 px-1.5 py-0.5 rounded-full">
                                            {columns[col.id].length}
                                        </span>
                                    </div>
                                </div>
                                <Droppable droppableId={col.id}>
                                    {(provided) => (
                                        <div 
                                            ref={provided.innerRef}
                                            {...provided.droppableProps}
                                            className="p-3 space-y-3 overflow-y-auto flex-1 custom-scrollbar"
                                        >
                                            {columns[col.id].map((ticket, index) => (
                                                <Draggable key={ticket.id} draggableId={ticket.id} index={index}>
                                                    {(provided) => (
                                                        <div
                                                            ref={provided.innerRef}
                                                            {...provided.draggableProps}
                                                            {...provided.dragHandleProps}
                                                            style={{ ...provided.draggableProps.style }}
                                                        >
                                                            <TicketCard 
                                                                ticket={ticket} 
                                                                assigneeName={getUserName(ticket.assignee)} 
                                                                onEdit={() => openEditTicketModal(ticket)}
                                                            />
                                                        </div>
                                                    )}
                                                </Draggable>
                                            ))}
                                            {provided.placeholder}
                                        </div>
                                    )}
                                </Droppable>
                            </div>
                        ))}
                    </div>
                    </DragDropContext>
                </motion.div>
            ) : (
                <motion.div
                    key="list"
                    initial={{ opacity: 0, x: 20 }}
                    animate={{ opacity: 1, x: 0 }}
                    exit={{ opacity: 0, x: -20 }}
                    transition={{ duration: 0.2 }}
                >
                    <div className="space-y-4">
                        <div className="border border-zinc-200 dark:border-zinc-800 bg-white dark:bg-zinc-950 rounded-lg overflow-hidden text-[13px]">
                            <div className="overflow-x-auto">
                                <div className="min-w-[1000px] flex border-b border-zinc-200 dark:border-zinc-800 bg-zinc-50 dark:bg-zinc-900/50">
                                    <div className="w-16 shrink-0 border-r border-zinc-200 dark:border-zinc-800 p-2 text-center text-zinc-500 font-medium">ID</div>
                                    <div className="flex-1 min-w-[300px] border-r border-zinc-200 dark:border-zinc-800 p-2 font-medium pl-3 text-zinc-500">Title</div>
                                    <div className="w-32 shrink-0 border-r border-zinc-200 dark:border-zinc-800 p-2 font-medium pl-3 text-zinc-500">Status</div>
                                    <div className="w-24 shrink-0 border-r border-zinc-200 dark:border-zinc-800 p-2 font-medium pl-3 text-zinc-500">Priority</div>
                                    <div className="w-32 shrink-0 border-r border-zinc-200 dark:border-zinc-800 p-2 font-medium pl-3 text-zinc-500">Assignee</div>
                                    <div className="w-24 shrink-0 p-2 font-medium pl-3 text-zinc-500 text-center">Actions</div>
                                </div>
                                {filteredTickets.map(ticket => {
                                    const statusConfig = COLUMN_CONFIG.find(c => c.id === ticket.status);
                                    return (
                                        <div key={ticket.id} className="min-w-[1000px] border-b border-zinc-100 dark:border-zinc-800 last:border-0">
                                            <div className="flex bg-white dark:bg-zinc-950 hover:bg-zinc-50 dark:hover:bg-zinc-800/30 transition-colors group items-center">
                                                <div className="w-16 shrink-0 border-r border-zinc-100 dark:border-zinc-800 p-2 text-center text-zinc-400 font-mono text-xs flex items-center justify-between px-2">
                                                    <span>{ticket.category ? ticket.category.charAt(0).toUpperCase() : 'T'}-{ticket.categoryNumber || ticket.id.substring(0, 4)}</span>
                                                    {ticket.description && (
                                                        <button 
                                                            onClick={(e) => toggleExpand(ticket.id, e)}
                                                            className="p-0.5 hover:bg-zinc-200 dark:hover:bg-zinc-700 rounded-sm transition-colors text-zinc-400 hover:text-zinc-600 dark:text-zinc-500 dark:hover:text-zinc-300"
                                                        >
                                                            <ChevronDown size={12} className={`transition-transform duration-200 ${expandedTickets.has(ticket.id) ? 'rotate-180' : ''}`} />
                                                        </button>
                                                    )}
                                                </div>
                                                <div className="flex-1 min-w-[300px] border-r border-zinc-100 dark:border-zinc-800 p-2 pl-3 font-medium text-zinc-700 dark:text-zinc-200 cursor-pointer hover:underline truncate" onClick={() => openEditTicketModal(ticket)}>
                                                    {ticket.title}
                                                </div>
                                                <div className="w-32 shrink-0 border-r border-zinc-100 dark:border-zinc-800 p-2 pl-3">
                                                    <div className={`flex items-center gap-2 text-xs font-medium ${statusConfig?.color}`}>
                                                        {statusConfig && <statusConfig.icon size={14} />}
                                                        {statusConfig?.label}
                                                    </div>
                                                </div>
                                                <div className="w-24 shrink-0 border-r border-zinc-100 dark:border-zinc-800 p-2 pl-3">
                                                    <Badge variant={ticket.priority === 'critical' || ticket.priority === 'high' ? 'destructive' : ticket.priority === 'medium' ? 'secondary' : 'outline'} className={`rounded-sm px-1.5 py-0.5 text-[10px] font-bold uppercase transition-colors ${
                                                        ticket.priority === 'critical' ? 'bg-red-600 text-white hover:bg-red-700 dark:bg-red-700 dark:hover:bg-red-600 border-red-500' : ''
                                                    }`}>
                                                        {ticket.priority}
                                                    </Badge>
                                                </div>
                                                <div className="w-32 shrink-0 border-r border-zinc-100 dark:border-zinc-800 p-0">
                                                    <Select 
                                                        value={ticket.assignee || 'unassigned'} 
                                                        onValueChange={(val) => {
                                                            actions.updateTicket(ticket.id, { assignee: val === 'unassigned' ? undefined : val });
                                                        }}
                                                    >
                                                        <SelectTrigger className="w-full h-full !border-0 !shadow-none bg-transparent p-0 px-3 text-xs rounded-none hover:bg-transparent focus:ring-0 focus:ring-offset-0 focus:outline-none focus-visible:ring-0 focus-visible:ring-offset-0 focus-visible:outline-none outline-none !ring-0 !ring-offset-0">
                                                            <div className="flex-1 text-left truncate flex items-center h-full">
                                                                {ticket.assignee ? (
                                                                    <span className="truncate block w-full">{getUserName(ticket.assignee)}</span>
                                                                ) : (
                                                                    <span className="text-zinc-400 italic font-normal">Unassigned</span>
                                                                )}
                                                            </div>
                                                        </SelectTrigger>
                                                        <SelectContent>
                                                            <SelectItem value="unassigned" className="text-zinc-400 italic">Unassigned</SelectItem>
                                                            {data.users.map(u => (
                                                                <SelectItem key={u.id} value={u.id}>{u.name}</SelectItem>
                                                            ))}
                                                        </SelectContent>
                                                    </Select>
                                                </div>
                                                <div className="w-24 shrink-0 p-1.5 flex justify-center gap-1 opacity-0 group-hover:opacity-100 transition-opacity">
                                                    <Button variant="ghost" size="sm" className="h-6 w-6 p-0 text-muted-foreground hover:text-foreground" onClick={() => openEditTicketModal(ticket)}>
                                                        <Pencil size={12} />
                                                    </Button>
                                                </div>
                                            </div>

                                            <AnimatePresence>
                                                {expandedTickets.has(ticket.id) && ticket.description && (
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
                                                            {ticket.description}
                                                        </div>
                                                    </motion.div>
                                                )}
                                            </AnimatePresence>
                                        </div>
                                    )
                                })}
                            </div>
                        </div>
                    </div>
                </motion.div>
            )}
          </AnimatePresence>
       </div>

       <TicketDetailsDialog 
           isOpen={isModalOpen}
           onClose={() => setIsModalOpen(false)}
           ticket={editingTicket}
           onSave={handleSaveTicket}
       />
    </div>
  );
};

const TicketCard = ({ ticket, assigneeName, onEdit }: { ticket: Ticket; assigneeName?: string | null; onEdit?: () => void }) => {
   const priorityColors = {
       'critical': 'bg-red-600 text-white dark:bg-red-700 dark:text-red-50 border-red-600 dark:border-red-500',
       'high': 'bg-red-100 text-red-700 dark:bg-red-900/30 dark:text-red-400 border-red-200 dark:border-red-800',
       'medium': 'bg-blue-100 text-blue-700 dark:bg-blue-900/30 dark:text-blue-400 border-blue-200 dark:border-blue-800',
       'low': 'bg-slate-100 text-slate-700 dark:bg-slate-800 dark:text-slate-400 border-slate-200 dark:border-slate-700'
   };

   return (
       <Card 
            className="shadow-sm hover:shadow-md transition-all duration-200 bg-white dark:bg-zinc-900 border-slate-200 dark:border-zinc-800 ring-1 ring-slate-900/5 dark:ring-white/10 group cursor-default"
            onClick={(e) => {
                if (e.detail === 2 && onEdit) {
                    e.preventDefault();
                    onEdit();
                }
            }}
       >
          <CardContent className="p-2.5 space-y-2 relative">
             <div className="flex justify-between items-start">
                 <div className="flex items-center gap-2">
                     <span className="font-mono text-xs text-slate-400 dark:text-zinc-500 font-medium">
                         {ticket.category ? ticket.category.charAt(0).toUpperCase() : 'T'}-{ticket.categoryNumber || ticket.id.substring(0, 4)}
                     </span>
                     <Badge variant="outline" className={`text-[10px] uppercase px-2 py-0.5 h-5 rounded-md border font-medium ${priorityColors[ticket.priority] || priorityColors['low']}`}>
                        {ticket.priority}
                     </Badge>
                 </div>
                 {ticket.tags && ticket.tags.length > 0 && (
                     <div className="flex gap-1 flex-wrap justify-end">
                         {ticket.tags.map(tag => (
                             <span key={tag} className="text-[10px] text-slate-500 dark:text-slate-400 bg-slate-50 dark:bg-zinc-800 px-1.5 py-0.5 rounded border border-slate-100 dark:border-zinc-700">{tag}</span>
                         ))}
                     </div>
                 )}
                 <Button 
                      variant="ghost" 
                      size="sm" 
                      className="h-6 w-6 p-0 opacity-0 group-hover:opacity-100 transition-opacity absolute top-2 right-2 bg-white/80 dark:bg-zinc-900/80 backdrop-blur-sm"
                      onClick={(e) => {
                          e.stopPropagation();
                          if (onEdit) onEdit();
                      }}
                  >
                      <Pencil size={12} className="text-zinc-500" />
                  </Button>
             </div>
             
             <div>
                <h4 className="font-medium text-[13px] leading-snug text-slate-900 dark:text-zinc-100 line-clamp-2">{ticket.title}</h4>
             </div>

             <div className="pt-2 border-t border-slate-50 dark:border-zinc-800/50 flex justify-between items-center text-xs text-muted-foreground mt-2">
                 {assigneeName ? (
                     <div className="flex items-center gap-1.5">
                         <div className="w-4 h-4 rounded-full bg-indigo-50 dark:bg-indigo-900/20 flex items-center justify-center text-indigo-600 dark:text-indigo-400 ring-1 ring-indigo-100 dark:ring-indigo-800 font-medium text-[9px]">
                            {assigneeName.charAt(0).toUpperCase()}
                         </div>
                         <span className="text-slate-600 dark:text-state-400 truncate max-w-[80px] text-[10px]">{assigneeName}</span>
                     </div>
                 ) : (
                     <span className="italic opacity-50 px-1">Unassigned</span>
                 )}
             </div>
          </CardContent>
       </Card>
   )
}
