import { useState, useMemo } from 'react';
import { useData } from '@/context/DataContext';
import { format, subDays, isAfter } from 'date-fns';
import { Rocket, Download } from 'lucide-react';
import { Badge } from '@/components/ui/Badge';
import { Button } from '@/components/ui/Button';
import { Select, SelectContent, SelectItem, SelectTrigger } from '@/components/ui/Select';
import { PageToolbar } from '@/components/layout/PageToolbar';
import { FilterPopover } from '@/components/ui/FilterPopover';
import { exportToExcel } from '@/lib/excel';

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

    const getUserName = (id?: string) => data.users.find(u => u.id === id)?.name || 'Unknown';

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
                        <FilterPopover
                            title="Filter Releases"
                            activeCount={
                                (filterDate !== 'all' ? 1 : 0) + 
                                (filterAssignee !== 'all' ? 1 : 0)
                            }
                            onReset={() => {
                                setFilterDate('all');
                                setFilterAssignee('all');
                            }}
                        >
                            <div className="space-y-4">
                                <div className="space-y-1.5">
                                    <label className="text-xs font-semibold text-muted-foreground uppercase">Date Range</label>
                                    <Select value={filterDate} onValueChange={setFilterDate}>
                                        <SelectTrigger className="h-9 w-full">
                                            <span className="truncate capitalize">
                                                {filterDate === 'all' ? 'All Time' : 
                                                 filterDate === '30' ? 'Last 30 Days' :
                                                 filterDate === '90' ? 'Last 3 Months' :
                                                 'Last Year'}
                                            </span>
                                        </SelectTrigger>
                                        <SelectContent>
                                            <SelectItem value="all">All Time</SelectItem>
                                            <SelectItem value="30">Last 30 Days</SelectItem>
                                            <SelectItem value="90">Last 3 Months</SelectItem>
                                            <SelectItem value="365">Last Year</SelectItem>
                                        </SelectContent>
                                    </Select>
                                </div>

                                <div className="space-y-1.5">
                                    <label className="text-xs font-semibold text-muted-foreground uppercase">Assignee</label>
                                    <Select value={filterAssignee} onValueChange={setFilterAssignee}>
                                        <SelectTrigger className="h-9 w-full">
                                            <span className="truncate capitalize">
                                                {filterAssignee === 'all' 
                                                    ? 'All Users' 
                                                    : (data.users.find(u => u.id === filterAssignee)?.name || filterAssignee)
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
                                </div>
                            </div>
                        </FilterPopover>
                    }
                    actions={
                        <Button 
                            variant="outline" 
                            size="sm" 
                            className="h-8 text-xs rounded-lg"
                            onClick={() => {
                                const exportData = filteredTickets.map(t => ({
                                    ReleaseDate: format(new Date(t.updatedAt), 'dd/MM/yyyy'),
                                    Title: t.title,
                                    Description: t.description || '',
                                    Author: getUserName(t.assignee),
                                    Type: t.tags?.[0] || 'Feature'
                                }));
                                exportToExcel(exportData, 'Compass_Release_Log');
                            }}
                        >
                            <Download className="w-3.5 h-3.5 mr-2" />
                            Export
                        </Button>
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
                                            • by {getUserName(ticket.assignee)}
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
