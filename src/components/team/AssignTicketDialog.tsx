import React, { useState } from 'react';
import { useData } from '../../context/DataContext';
import { Ticket, User } from '../../types';
import { Modal } from '../ui/Modal';
import { Button } from '../ui/Button';
import { Search } from 'lucide-react';
import { Input } from '../ui/Input';
import { ScrollArea } from '../ui/ScrollArea';
import { Bug, CheckCircle2, Code2, Hash } from 'lucide-react';
import { TicketType } from '../../types';

const CategoryIcon = ({ category, className }: { category?: TicketType, className?: string }) => {
    switch (category) {
        case 'bug': return <Bug size={14} className={className} />;
        case 'feature': return <CheckCircle2 size={14} className={className} />;
        case 'improvement': return <Code2 size={14} className={className} />;
        default: return <Hash size={14} className={className} />;
    }
};

interface AssignTicketDialogProps {
  isOpen: boolean;
  onClose: () => void;
  developer: User;
}

export const AssignTicketDialog: React.FC<AssignTicketDialogProps> = ({ isOpen, onClose, developer }) => {
  const { data, actions } = useData();
  const [search, setSearch] = useState('');

  // Filter for open tickets (backlog or ready_for_qa or even in_progress if unassigned?? 
  // For now, let's just show backlog + In Sprint)
  const availableTickets = data.tickets.filter(t => 
    (t.status === 'backlog' || t.status === 'in_sprint') && // simplified eligibility
    (!t.assignee) && // not already assigned
    (t.title.toLowerCase().includes(search.toLowerCase()) || t.id.includes(search))
  );

  const handleAssign = (ticket: Ticket) => {
    actions.assignTicket(ticket.id, developer.id);
    onClose();
  };

    return (
    <Modal isOpen={isOpen} onClose={onClose} noPadding className="max-w-xl bg-white dark:bg-[#1C1C1C] border-zinc-200 dark:border-zinc-800 rounded-[2.5rem] overflow-hidden">
      <div className="flex flex-col h-[500px]">
        <div className="p-8 pb-4">
            <h2 className="text-2xl font-bold tracking-tight text-zinc-900 dark:text-zinc-100 mb-6">Assign Task to {developer.name}</h2>
            <div className="relative group">
                <Search className="absolute left-4 top-1/2 -translate-y-1/2 h-4 w-4 text-zinc-400 group-focus-within:text-zinc-900 dark:group-focus-within:text-zinc-100 transition-colors" />
                <Input 
                    placeholder="Search backlog..." 
                    className="pl-11 bg-zinc-50 dark:bg-zinc-900/50 border-zinc-100 dark:border-zinc-800 h-11 rounded-2xl focus:ring-0 focus:border-zinc-300 dark:focus:border-zinc-700 transition-all text-sm"
                    value={search}
                    onChange={(e) => setSearch(e.target.value)}
                />
            </div>
        </div>

        <div className="flex-1 min-h-0">
            <ScrollArea className="h-full">
                <div className="px-4 pb-8">
                    {availableTickets.length > 0 ? (
                        <div className="space-y-1">
                            {availableTickets.map(ticket => (
                                <div 
                                    key={ticket.id} 
                                    onClick={() => handleAssign(ticket)}
                                    className="flex items-center gap-4 p-3 hover:bg-zinc-50 dark:hover:bg-zinc-900/50 rounded-2xl group cursor-pointer border border-transparent hover:border-zinc-100 dark:hover:border-zinc-800 transition-all mx-4"
                                >
                                    <div className="flex items-center gap-2.5 min-w-[70px]">
                                        <div className="p-1.5 rounded-lg bg-zinc-100 dark:bg-zinc-800 text-zinc-500 group-hover:bg-white dark:group-hover:bg-zinc-700 group-hover:text-zinc-900 dark:group-hover:text-zinc-100 transition-colors">
                                            <CategoryIcon category={ticket.category} className="shrink-0" />
                                        </div>
                                        <span className="font-mono text-[10px] font-bold text-zinc-400 group-hover:text-zinc-600 dark:group-hover:text-zinc-300 transition-colors">
                                           {ticket.category ? ticket.category.substring(0, 1).toUpperCase() : 'F'}-{ticket.categoryNumber}
                                        </span>
                                    </div>
                                    <div className="flex-1 min-w-0">
                                         <div className="flex flex-col">
                                            <span className="text-sm font-semibold text-zinc-700 dark:text-zinc-300 truncate transition-colors group-hover:text-zinc-900 dark:group-hover:text-zinc-100">{ticket.title}</span>
                                            <span className="text-[10px] text-zinc-400 font-medium truncate opacity-60 group-hover:opacity-100 transition-opacity tracking-wider">
                                                {ticket.status.charAt(0).toUpperCase() + ticket.status.slice(1).replace('_', ' ')}
                                            </span>
                                         </div>
                                    </div>
                                    <div className="opacity-0 group-hover:opacity-100 transition-all transform translate-x-2 group-hover:translate-x-0">
                                        <Button 
                                            size="sm" 
                                            className="h-7 px-3 text-[10px] font-bold uppercase tracking-wider bg-zinc-900 dark:bg-white text-white dark:text-zinc-900 rounded-full"
                                        >
                                            Assign
                                        </Button>
                                    </div>
                                </div>
                            ))}
                        </div>
                    ) : (
                        <div className="flex flex-col items-center justify-center py-20 text-zinc-400 space-y-3">
                            <div className="p-4 rounded-full bg-zinc-50 dark:bg-zinc-900">
                                <Search size={32} />
                            </div>
                            <p className="text-sm font-medium">No available tickets found.</p>
                        </div>
                    )}
                </div>
            </ScrollArea>
        </div>
        
        <div className="p-6 border-t border-zinc-100 dark:border-zinc-800 bg-zinc-50/30 dark:bg-zinc-900/10 flex justify-end gap-3">
            <Button variant="ghost" onClick={onClose} className="rounded-full h-10 px-6 font-semibold text-zinc-500 hover:text-zinc-900 dark:hover:text-zinc-100">Cancel</Button>
            <Button variant="ghost" onClick={onClose} className="hidden md:flex rounded-full h-10 px-6 font-semibold bg-zinc-100 dark:bg-zinc-800 text-zinc-900 dark:text-zinc-100">Quick Filters</Button>
        </div>
      </div>
    </Modal>
  );
};
