import { useState, useMemo } from 'react';
import { useData } from '@/context/DataContext';
import { format, subDays, isAfter } from 'date-fns';
import { Rocket, X } from 'lucide-react';
import { AnimatePresence, motion } from 'framer-motion';
import { Badge } from '@/components/ui/Badge';
import { Select, SelectContent, SelectItem, SelectTrigger } from '@/components/ui/Select';
import { PageToolbar } from '@/components/layout/PageToolbar';

export const ReleaseLog = () => {
    const { data } = useData();
    const [searchQuery, setSearchQuery] = useState('');
    const [filterAssignee, setFilterAssignee] = useState<string>('all');
    const [filterDate, setFilterDate] = useState<string>('all');

  const filteredTickets = useMemo(() => {
    let tickets = data.tickets.filter(t => t.status === 'shipped');

    // Search
    if (searchQuery) {
        const query = searchQuery.toLowerCase();
        tickets = tickets.filter(t => 
            t.title.toLowerCase().includes(query) || 
            t.description?.toLowerCase().includes(query)
        );
    }

    // Filter by Assignee
    if (filterAssignee !== 'all') {
        tickets = tickets.filter(t => t.assignee === filterAssignee);
    }

    // Filter by Date
    if (filterDate !== 'all') {
        const now = new Date();
        let cutoffDate = now;
        
        if (filterDate === '30') cutoffDate = subDays(now, 30);
        else if (filterDate === '90') cutoffDate = subDays(now, 90);
        else if (filterDate === '365') cutoffDate = subDays(now, 365);

        tickets = tickets.filter(t => isAfter(new Date(t.updatedAt), cutoffDate));
    }

    return tickets.sort((a, b) => b.updatedAt - a.updatedAt);
  }, [data.tickets, filterAssignee, filterDate, searchQuery]);

  return (
    <div className="flex flex-col">
        <div className="pt-4 md:pt-8 pb-4">
            <PageToolbar
                title="Release Log"
                count={filteredTickets.length}
                countLabel="Releases"
                searchQuery={searchQuery}
                onSearchChange={setSearchQuery}
                filters={
                    <>
                        <motion.div layout className="relative" transition={{ type: "spring", bounce: 0, duration: 0.3 }}>
                            <Select value={filterDate} onValueChange={setFilterDate}>
                                <SelectTrigger className="h-8 text-xs border-dashed border-zinc-300 dark:border-zinc-700 shadow-none hover:bg-zinc-50 dark:hover:bg-zinc-800 w-auto min-w-[140px] px-2.5 transition-none">
                                    <span className="truncate capitalize">
                                        {filterDate === 'all' ? 'Date: All Time' : 
                                         filterDate === '30' ? 'Date: Last 30 Days' :
                                         filterDate === '90' ? 'Date: Last 3 Months' :
                                         'Date: Last Year'}
                                    </span>
                                </SelectTrigger>
                                <SelectContent>
                                    <SelectItem value="all">All Time</SelectItem>
                                    <SelectItem value="30">Last 30 Days</SelectItem>
                                    <SelectItem value="90">Last 3 Months</SelectItem>
                                    <SelectItem value="365">Last Year</SelectItem>
                                </SelectContent>
                            </Select>
                            <AnimatePresence>
                            {filterDate !== 'all' && (
                                <motion.button
                                    initial={{ opacity: 0, scale: 0.5 }}
                                    animate={{ opacity: 1, scale: 1 }}
                                    exit={{ opacity: 0, scale: 0.5 }}
                                    onClick={(e) => {
                                        e.stopPropagation();
                                        setFilterDate('all');
                                    }}
                                    className="absolute -top-1.5 -right-1.5 h-4 w-4 bg-zinc-500 hover:bg-zinc-600 text-white rounded-full flex items-center justify-center shadow-sm z-10 transition-colors"
                                >
                                    <X size={10} strokeWidth={3} />
                                </motion.button>
                            )}
                            </AnimatePresence>
                        </motion.div>

                        <motion.div layout className="relative" transition={{ type: "spring", bounce: 0, duration: 0.3 }}>
                            <Select value={filterAssignee} onValueChange={setFilterAssignee}>
                                <SelectTrigger className="h-8 text-xs border-dashed border-zinc-300 dark:border-zinc-700 shadow-none hover:bg-zinc-50 dark:hover:bg-zinc-800 w-auto min-w-[140px] px-2.5 transition-none">
                                    <span className="truncate capitalize">
                                        {filterAssignee === 'all' 
                                            ? 'User: All' 
                                            : `User: ${data.users.find(u => u.id === filterAssignee)?.name || filterAssignee}`
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
                            {filterAssignee !== 'all' && (
                                <motion.button
                                    initial={{ opacity: 0, scale: 0.5 }}
                                    animate={{ opacity: 1, scale: 1 }}
                                    exit={{ opacity: 0, scale: 0.5 }}
                                    onClick={(e) => {
                                        e.stopPropagation();
                                        setFilterAssignee('all');
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
            />
        </div>

      <div className="mt-4 relative border-l border-muted ml-3 space-y-8 pb-8">
        {filteredTickets.length === 0 ? (
            <div className="pl-8 pt-2">
                <p className="text-muted-foreground">No releases found matching your filters.</p>
            </div>
        ) : (
            filteredTickets.map((ticket) => (
                <div key={ticket.id} className="relative pl-8">
                    <span className="absolute -left-[9px] top-1 h-4 w-4 rounded-full bg-indigo-600 ring-4 ring-white dark:ring-slate-950 flex items-center justify-center">
                        <Rocket size={10} className="text-white" />
                    </span>
                    <div className="flex flex-col space-y-1">
                        <div className="flex items-center gap-2">
                            <span className="text-sm text-muted-foreground font-mono">
                                {format(ticket.updatedAt, 'MMM d, yyyy')}
                            </span>
                             <Badge variant="secondary" className="text-[10px]">{ticket.tags?.[0] || 'Feature'}</Badge>
                             {ticket.assignee && (
                                <span className="text-xs text-muted-foreground flex items-center gap-1">
                                    • by {data.users.find(u => u.id === ticket.assignee)?.name || 'Unknown'}
                                </span>
                             )}
                        </div>
                        <h3 className="text-base font-semibold">{ticket.title}</h3>
                        <p className="text-sm text-muted-foreground">{ticket.description}</p>
                    </div>
                </div>
            ))
        )}
      </div>
    </div>
  );
};
