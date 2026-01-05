
import { useState } from 'react';
import { useData } from '@/context/DataContext';
import { Card } from '@/components/ui/Card';
import { Button } from '@/components/ui/Button';
import { Badge } from '@/components/ui/Badge';
import { CheckCircle2, XCircle } from 'lucide-react';
import { EmptyState } from '@/components/ui/EmptyState';
import { PageToolbar } from '@/components/layout/PageToolbar';
import { Select, SelectContent, SelectItem, SelectTrigger } from '@/components/ui/Select';
import { FilterPopover } from '@/components/ui/FilterPopover';
import { TicketDetailsDialog } from '@/components/team/TicketDetailsDialog';
import { Ticket } from '@/types';

export const QAPage = () => {
  const { data, actions } = useData();
  const [searchQuery, setSearchQuery] = useState('');
  const [priorityFilter, setPriorityFilter] = useState<string>('all');
  const [selectedTicket, setSelectedTicket] = useState<Ticket | null>(null);

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

  const handlePass = (id: string, e?: React.MouseEvent) => {
    e?.stopPropagation();
    actions.moveTicket(id, 'done');
  };

  const handleFail = (id: string, e?: React.MouseEvent) => {
    e?.stopPropagation();
    // Ideally open modal for notes, but for now instant reject to In Progress
    if (confirm("Reject ticket back to development?")) {
        actions.moveTicket(id, 'in_progress'); 
    }
  };

  const handleSaveTicket = (updates: Partial<Ticket>) => {
      if (selectedTicket) {
          actions.updateTicket(selectedTicket.id, updates);
          setSelectedTicket(null);
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
              <FilterPopover
                title="Filter QA"
                activeCount={priorityFilter !== 'all' ? 1 : 0}
                onReset={() => setPriorityFilter('all')}
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
                  </div>
              </FilterPopover>
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
            <Card 
                key={ticket.id} 
                className="overflow-hidden cursor-pointer hover:bg-muted/50 transition-colors group"
                onClick={() => setSelectedTicket(ticket)}
            >
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
                     <h3 className="text-lg font-semibold group-hover:text-primary transition-colors">{ticket.title}</h3>
                     <p className="text-sm text-muted-foreground max-w-2xl">{ticket.description}</p>
                  </div>
                  
                  <div className="flex items-center gap-2 shrink-0">
                     <Button 
                        variant="outline" 
                        className="text-red-600 border-red-200 hover:bg-red-50 hover:text-red-700"
                        onClick={(e) => handleFail(ticket.id, e)}
                     >
                        <XCircle className="mr-2 h-4 w-4" />
                        Reject
                     </Button>
                     <Button 
                        className="bg-emerald-600 hover:bg-emerald-700 text-white"
                        onClick={(e) => handlePass(ticket.id, e)}
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

      <TicketDetailsDialog 
        isOpen={!!selectedTicket}
        onClose={() => setSelectedTicket(null)}
        ticket={selectedTicket}
        onSave={handleSaveTicket}
      />
    </div>
  );
};
