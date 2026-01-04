
import { useState } from 'react';
import { useData } from '@/context/DataContext';
import { AnimatePresence, motion } from 'framer-motion';
import { Card } from '@/components/ui/Card';
import { Button } from '@/components/ui/Button';
import { Badge } from '@/components/ui/Badge';
import { CheckCircle2, XCircle, X } from 'lucide-react';
import { EmptyState } from '@/components/ui/EmptyState';
import { PageToolbar } from '@/components/layout/PageToolbar';
import { Select, SelectContent, SelectItem, SelectTrigger } from '@/components/ui/Select';

export const QAPage = () => {
  const { data, actions } = useData();
  const [searchQuery, setSearchQuery] = useState('');
  const [priorityFilter, setPriorityFilter] = useState<string>('all');

  const qaTickets = data.tickets
    .filter(t => t.status === 'ready_for_qa')
    .filter(t => {
      if (searchQuery) {
        const query = searchQuery.toLowerCase();
        const matchesTitle = t.title.toLowerCase().includes(query);
        const matchesDesc = t.description?.toLowerCase().includes(query);
        if (!matchesTitle && !matchesDesc) return false;
      }
      if (priorityFilter !== 'all' && t.priority !== priorityFilter) return false;
      return true;
    });

  const handlePass = (id: string) => {
    actions.moveTicket(id, 'done');
  };

  const handleFail = (id: string) => {
    // Ideally open modal for notes, but for now instant reject to In Progress
    if (confirm("Reject ticket back to development?")) {
        actions.moveTicket(id, 'in_progress'); 
    }
  };

  return (
    <div className="flex flex-col">
      <div className="pt-4 md:pt-8 pb-4">
        <PageToolbar
            title="QA Testing"
            searchQuery={searchQuery}
            onSearchChange={setSearchQuery}
            searchPlaceholder="Search QA tickets..."
            count={qaTickets.length}
            countLabel="Tickets"
            filters={
              <div className="flex items-center gap-2">
                  <motion.div layout className="relative" transition={{ type: "spring", bounce: 0, duration: 0.3 }}>
                    <Select value={priorityFilter} onValueChange={setPriorityFilter}>
                        <SelectTrigger className="h-8 text-xs border-dashed border-zinc-300 dark:border-zinc-700 shadow-none hover:bg-zinc-50 dark:hover:bg-zinc-800 w-auto min-w-[120px] px-2.5 transition-none">
                            <span className="truncate capitalize">{priorityFilter === 'all' ? 'Priority: All' : `Priority: ${priorityFilter}`}</span>
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
                    {priorityFilter !== 'all' && (
                        <motion.button
                            initial={{ opacity: 0, scale: 0.5 }}
                            animate={{ opacity: 1, scale: 1 }}
                            exit={{ opacity: 0, scale: 0.5 }}
                            onClick={(e) => {
                                e.stopPropagation();
                                setPriorityFilter('all');
                            }}
                            className="absolute -top-1.5 -right-1.5 h-4 w-4 bg-zinc-500 hover:bg-zinc-600 text-white rounded-full flex items-center justify-center shadow-sm z-10 transition-colors"
                        >
                            <X size={10} strokeWidth={3} />
                        </motion.button>
                    )}
                    </AnimatePresence>
                  </motion.div>
              </div>
            }
        />
      </div>

      <div className="mt-4 grid gap-4">
        {qaTickets.length === 0 ? (
           <EmptyState 
              icon={CheckCircle2}
              title="All Clear"
              description={searchQuery || priorityFilter !== 'all' ? "No QA tickets match your filters." : "No tickets waiting for QA."}
           />
        ) : (
          qaTickets.map((ticket) => (
            <Card key={ticket.id} className="overflow-hidden">
               <div className="flex flex-col sm:flex-row sm:items-center justify-between p-6 gap-4">
                  <div className="space-y-1">
                     <div className="flex items-center gap-2">
                        <Badge variant="outline" className={`uppercase font-bold text-[10px] ${
                          ticket.priority === 'critical' 
                            ? 'bg-red-600 text-white border-red-500' 
                            : ticket.priority === 'high' 
                            ? 'text-red-600 border-red-200' 
                            : ''
                        }`}>{ticket.priority}</Badge>
                        <Badge className="bg-purple-100 text-purple-700 hover:bg-purple-200 border-0">Ready for QA</Badge>
                     </div>
                     <h3 className="text-lg font-semibold">{ticket.title}</h3>
                     <p className="text-sm text-muted-foreground max-w-2xl">{ticket.description}</p>
                  </div>
                  
                  <div className="flex items-center gap-2 shrink-0">
                     <Button 
                        variant="outline" 
                        className="text-red-600 border-red-200 hover:bg-red-50 hover:text-red-700"
                        onClick={() => handleFail(ticket.id)}
                     >
                        <XCircle className="mr-2 h-4 w-4" />
                        Reject
                     </Button>
                     <Button 
                        className="bg-emerald-600 hover:bg-emerald-700 text-white"
                        onClick={() => handlePass(ticket.id)}
                     >
                        <CheckCircle2 className="mr-2 h-4 w-4" />
                        Approve
                     </Button>
                  </div>
               </div>
            </Card>
          ))
        )}
      </div>
    </div>
  );
};
