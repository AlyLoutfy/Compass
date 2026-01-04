import React, { useState, useEffect, useMemo } from 'react';
import { useData } from '../../context/DataContext';
import { motion, AnimatePresence } from 'framer-motion';
import { StandupCard } from '../standup/StandupCard';
import { StandupControls } from '../standup/StandupControls';
import { StandupHistorySidebar } from '../standup/StandupHistorySidebar';
import { AssignTicketDialog } from './AssignTicketDialog';
import { BlockerDialog } from './BlockerDialog';
import { TicketDetailsDialog } from './TicketDetailsDialog';
import { User, Ticket, StandupReport, Priority } from '../../types';
import { Check, Calendar, X } from 'lucide-react';
import { format } from 'date-fns';
import { Button } from '../ui/Button';
import { DragDropContext, DropResult, Droppable, Draggable, DroppableProvided, DroppableStateSnapshot, DraggableProvided, DraggableStateSnapshot } from '@hello-pangea/dnd';
import { cn } from '@/lib/utils';

interface StandupViewProps {
    isHistoryOpen: boolean;
    onToggleHistory: (open: boolean) => void;
}

export const StandupView: React.FC<StandupViewProps> = ({ isHistoryOpen, onToggleHistory }) => {
    const { data, activityLog, actions } = useData();
    
    // State
    const [timerSeconds, setTimerSeconds] = useState(15 * 60);
    const [isTimerRunning, setIsTimerRunning] = useState(false);
    const [isStandupStarted, setIsStandupStarted] = useState(false);
    const [focusedUserId, setFocusedUserId] = useState<string | null>(null);
    const [assignDialogState, setAssignDialogState] = useState<{ isOpen: boolean; user: User | null }>({
        isOpen: false, user: null
    });
    const [showSuccess, setShowSuccess] = useState(false);
    const [blockerDialogState, setBlockerDialogState] = useState<{ isOpen: boolean; userId: string | null }>({
        isOpen: false, userId: null
    });
    const [selectedTicket, setSelectedTicket] = useState<Ticket | null>(null);
    // History state lifted to parent
    const [viewingReport, setViewingReport] = useState<StandupReport | null>(null);
    const [spokenUserIds, setSpokenUserIds] = useState<Set<string>>(new Set());

    // Timer Logic
    useEffect(() => {
        let interval: NodeJS.Timeout;
        if (isTimerRunning) {
            interval = setInterval(() => setTimerSeconds(s => s - 1), 1000);
        }
        return () => clearInterval(interval);
    }, [isTimerRunning]);
    
    // Data Helpers
    const getYesterdayTickets = (userId: string) => {
        // Simplified "Yesterday" logic (24h-48h window or calendar day)
        // ideally uses dayjs/date-fns but vanilla JS for now
        const today = new Date();
        const yesterday = new Date(today);
        yesterday.setDate(yesterday.getDate() - 1);
        yesterday.setHours(0,0,0,0);
        const endYesterday = new Date(yesterday);
        endYesterday.setHours(23,59,59,999);

        return activityLog.filter(e => 
            e.userId === userId && 
            e.type === 'task_done' && 
            e.timestamp >= yesterday.getTime() && 
            e.timestamp <= endYesterday.getTime()
        ).map(e => e.ticketId ? data.tickets.find(t => t.id === e.ticketId) : null).filter((t): t is Ticket => !!t);
    };

    const getTodayTickets = (user: User) => {
        const active = user.currentTaskId ? data.tickets.find(t => t.id === user.currentTaskId) : null;
        const queued = data.tickets.filter(t => t.assignee === user.id && t.status === 'backlog' && t.id !== user.currentTaskId);
        return active ? [active, ...queued] : queued;
    };

    // Actions
    const handleNextSpeaker = () => {
        const unspoken = data.users.filter(u => !spokenUserIds.has(u.id));
        if (unspoken.length === 0) {
            setFocusedUserId(null); // All done
            return;
        }
        const random = unspoken[Math.floor(Math.random() * unspoken.length)];
        setFocusedUserId(random.id);
        setSpokenUserIds(prev => new Set(prev).add(random.id));
    };

    const handleFinishStandup = () => {
        const report: Omit<StandupReport, 'id'> = {
            date: Date.now(),
            durationSeconds: (15 * 60) - timerSeconds,
            attendees: data.users.map(u => ({
                userId: u.id,
                name: u.name,
                avatar: u.avatar,
                role: u.role,
                status: u.status,
                isBlocked: !!u.isBlocked,
                blockerReason: u.blockerReason,
                yesterdayTickets: getYesterdayTickets(u.id).map(t => ({ id: t.id, title: t.title })),
                todayTickets: getTodayTickets(u).map(t => ({ id: t.id, title: t.title }))
            }))
        };
        actions.saveStandupReport(report);
        // Reset local state
        setTimerSeconds(15 * 60);
        setIsTimerRunning(false);
        setIsStandupStarted(false);
        setFocusedUserId(null);
        setSpokenUserIds(new Set());
        
        // Show success animation
        setShowSuccess(true);
        setTimeout(() => setShowSuccess(false), 3000);
    };
    
    const handleStartStandup = () => {
        setIsStandupStarted(true);
        setIsTimerRunning(true);
    };

    // Render Data Source (Live vs Historical)
    // If viewingReport is active, we mock the users list from the report snapshot
    const displayUsers = useMemo(() => {
        if (viewingReport) {
            return viewingReport.attendees.map(a => ({
                ...a,
                id: a.userId,
                currentTaskId: a.todayTickets[0]?.id,
            }));
        }
        return data.users;
    }, [data.users, viewingReport]);

    const unassignedTickets = useMemo(() => {
        if (viewingReport) return [];
        return data.tickets.filter(t => !t.assignee && (t.status === 'backlog' || t.status === 'in_sprint'))
            .sort((a, b) => (b.categoryNumber ?? 0) - (a.categoryNumber ?? 0));
    }, [data.tickets, viewingReport]);

    return (
        <div className="flex flex-col h-full relative pb-24">
            
            <AnimatePresence mode="wait">
                <motion.div
                    key={viewingReport ? "report" : "live"}
                    initial={{ opacity: 0, x: 10 }}
                    animate={{ opacity: 1, x: 0 }}
                    exit={{ opacity: 0, x: -10 }}
                    transition={{ duration: 0.2 }}
                    className="w-full"
                >
                    {viewingReport && (
                        <div className="sticky top-0 z-40 mb-6 w-full rounded-2xl border border-amber-200/50 dark:border-amber-500/20 bg-amber-50/95 dark:bg-amber-950/40 backdrop-blur-xl p-4 flex items-center justify-between shadow-sm">
                            <div className="flex items-center gap-3">
                                <div className="p-2 bg-amber-100 dark:bg-amber-900/50 rounded-full text-amber-600 dark:text-amber-400">
                                    <Calendar size={20} />
                                </div>
                                <div className="flex flex-col">
                                    <span className="text-xs font-semibold text-amber-600 dark:text-amber-400 uppercase tracking-wider">Past Report</span>
                                    <span className="text-sm font-bold text-zinc-900 dark:text-zinc-100">
                                        {format(viewingReport.date, "EEEE, MMM d, yyyy")}
                                    </span>
                                </div>
                            </div>
                            
                            <Button 
                                size="sm" 
                                variant="ghost" 
                                onClick={() => setViewingReport(null)}
                                className="hover:bg-amber-100 dark:hover:bg-amber-500/20 text-amber-700 dark:text-amber-200 gap-2"
                            >
                                <span>Return to Live</span>
                                <X size={16} />
                            </Button>
                        </div>
                    )}

                    {/* Grid Layout */}
                    <DragDropContext onDragEnd={(result: DropResult) => {
                        const { source, destination, draggableId } = result;
                        if (!destination) return;
                        
                        // Case 1: Drop into Backlog Pool (Unassigning)
                        if (destination.droppableId === 'backlog-pool') {
                            if (source.droppableId === 'backlog-pool') return;
                            actions.unassignTicket(draggableId, source.droppableId);
                            return;
                        }

                        // Case 2: Drag from Backlog Pool (Assigning)
                        if (source.droppableId === 'backlog-pool') {
                            actions.assignTicket(draggableId, destination.droppableId);
                            return;
                        }

                        // Case 3: Reordering within same user
                        if (source.droppableId === destination.droppableId) {
                            if (source.index === destination.index) return;
                            actions.moveTicketInUserList(source.droppableId, source.index, destination.index);
                            return;
                        }

                        // Case 4: Moving between users
                        actions.assignTicket(draggableId, destination.droppableId);
                    }}>
                        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4 p-2">
                            {displayUsers.map((user) => {
                                // If historical, we use snapshot data. If live, we compute.
                                let yesterdayTickets: Ticket[] = [];
                                let todayTickets: Ticket[] = [];

                                if (viewingReport) {
                                    const attendee = viewingReport.attendees.find(a => a.userId === user.id);
                                    if (attendee) {
                                        yesterdayTickets = attendee.yesterdayTickets.map(t => ({ 
                                            ...t, 
                                            status: 'done', 
                                            priority: 'medium' as Priority, 
                                            comments: [], 
                                            createdAt: 0, 
                                            updatedAt: 0,
                                            description: '',
                                            sourceType: 'internal',
                                            category: 'feature',
                                            order: 0
                                        } as Ticket));
                                         todayTickets = attendee.todayTickets.map((t, idx) => ({ 
                                            ...t, 
                                            status: 'in_progress', 
                                            priority: 'medium' as Priority, 
                                            comments: [], 
                                            createdAt: 0, 
                                            updatedAt: 0,
                                            description: '',
                                            businessValue: 'Medium',
                                            sourceType: 'internal',
                                            category: 'feature',
                                            order: idx
                                        } as Ticket));
                                    }
                                } else {
                                     yesterdayTickets = getYesterdayTickets(user.id);
                                     todayTickets = getTodayTickets(user as User);
                                }

                                return (
                                    <div key={user.id} className={focusedUserId && focusedUserId !== user.id ? "opacity-30 blur-[1px]" : ""}>
                                        <StandupCard 
                                            user={user as User}
                                            yesterdayTickets={yesterdayTickets}
                                            todayTickets={todayTickets}
                                            isSpeaker={focusedUserId === user.id}
                                            onFocus={() => setFocusedUserId(prev => prev === user.id ? null : user.id)}
                                            onAssign={() => setAssignDialogState({ isOpen: true, user: user as User })}
                                            onSelectTicket={(ticket) => setSelectedTicket(ticket)}
                                        />
                                    </div>
                                );
                            })}
                        </div>

                        {/* Backlog Shelf */}
                        {!viewingReport && unassignedTickets.length > 0 && (
                            <div className="mt-12 px-2 pb-12">
                                <div className="flex items-center gap-2 mb-4 px-2">
                                    <div className="h-6 w-1 bg-zinc-200 dark:bg-zinc-800 rounded-full" />
                                    <h3 className="text-sm font-bold text-zinc-900 dark:text-zinc-100 uppercase tracking-widest">Backlog Pool</h3>
                                    <span className="text-xs font-medium text-zinc-400 dark:text-zinc-500 bg-zinc-100 dark:bg-zinc-900 px-2 py-0.5 rounded-full">
                                        {unassignedTickets.length}
                                    </span>
                                </div>

                                <Droppable droppableId="backlog-pool" direction="horizontal" type="TICKET">
                                    {(provided: DroppableProvided, snapshot: DroppableStateSnapshot) => (
                                        <div 
                                            ref={provided.innerRef}
                                            {...provided.droppableProps}
                                            className={cn(
                                                "flex flex-wrap gap-3 p-4 rounded-2xl border-2 border-dashed border-zinc-100 dark:border-zinc-800/50 transition-colors bg-zinc-50/50 dark:bg-zinc-900/10 min-h-[100px]",
                                                snapshot.isDraggingOver && "bg-zinc-100/50 dark:bg-zinc-800/30 border-blue-200 dark:border-blue-900/30"
                                            )}
                                        >
                                            {unassignedTickets.map((t, index) => (
                                                <Draggable key={t.id} draggableId={t.id} index={index}>
                                                    {(provided: DraggableProvided, snapshot: DraggableStateSnapshot) => (
                                                        <div
                                                            ref={provided.innerRef}
                                                            {...provided.draggableProps}
                                                            {...provided.dragHandleProps}
                                                            onClick={() => setSelectedTicket(t)}
                                                            className={cn(
                                                                "group flex items-center gap-3 bg-white dark:bg-[#191919] border border-zinc-200 dark:border-zinc-800 p-2.5 pr-4 rounded-xl shadow-sm hover:shadow-md transition-all cursor-pointer select-none max-w-[280px]",
                                                                snapshot.isDragging && "z-50 shadow-2xl scale-105 rotate-1 border-blue-400 dark:border-blue-500 ring-4 ring-blue-500/10"
                                                            )}
                                                            style={provided.draggableProps.style}
                                                        >
                                                            <div className="flex flex-col gap-0.5">
                                                                <span className="text-[9px] font-bold text-zinc-400 uppercase tracking-tight">
                                                                    {t.category}-{t.categoryNumber}
                                                                </span>
                                                                <span className="text-[11px] font-semibold text-zinc-900 dark:text-zinc-100 truncate line-clamp-1 leading-tight">
                                                                    {t.title}
                                                                </span>
                                                            </div>
                                                            <div className={cn(
                                                                "ml-auto h-2 w-2 rounded-full",
                                                                t.priority === 'critical' ? "bg-red-600 shadow-[0_0_8px_rgba(220,38,38,0.5)]" :
                                                                t.priority === 'high' ? "bg-red-500" : 
                                                                t.priority === 'medium' ? "bg-amber-500" : "bg-blue-500"
                                                            )} />
                                                        </div>
                                                    )}
                                                </Draggable>
                                            ))}
                                            {provided.placeholder}
                                        </div>
                                    )}
                                </Droppable>
                            </div>
                        )}
                    </DragDropContext>
                </motion.div>
            </AnimatePresence>

            {/* Floating Controls */}
            {!viewingReport && (
                <StandupControls 
                    timerSeconds={timerSeconds} 
                    isTimerRunning={isTimerRunning}
                    onToggleTimer={() => setIsTimerRunning(!isTimerRunning)}
                    onRandomNext={handleNextSpeaker}
                    onFinishStandup={handleFinishStandup}
                    onCancelStandup={() => {
                        setTimerSeconds(15 * 60);
                        setIsTimerRunning(false);
                        setIsStandupStarted(false);
                        setFocusedUserId(null);
                        setSpokenUserIds(new Set());
                    }}
                    hasUnspoken={data.users.length > spokenUserIds.size}
                    isStandupStarted={isStandupStarted}
                    onStartStandup={handleStartStandup}
                />
            )}

            {/* History Sidebar */}
            <StandupHistorySidebar 
                history={data.standupHistory} 
                isOpen={isHistoryOpen} 
                onClose={() => onToggleHistory(false)}
                onSelectReport={(report) => {
                    setViewingReport(report);
                    onToggleHistory(false); // Auto close sidebar on select
                }}
                selectedReportId={viewingReport?.id}
            />

            {/* Success Overlay */}
            <AnimatePresence>
                {showSuccess && (
                    <motion.div
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        exit={{ opacity: 0 }}
                        className="fixed inset-0 bg-black/50 backdrop-blur-sm z-50 flex items-center justify-center p-4"
                        onClick={() => setShowSuccess(false)}
                    >
                        <motion.div
                            initial={{ scale: 0.5, opacity: 0, y: 20 }}
                            animate={{ scale: 1, opacity: 1, y: 0 }}
                            exit={{ scale: 0.9, opacity: 0, y: 20 }}
                            transition={{ type: "spring", duration: 0.5 }}
                            className="bg-white dark:bg-zinc-900 rounded-3xl p-12 flex flex-col items-center gap-6 shadow-2xl max-w-sm w-full text-center border border-white/10"
                            onClick={e => e.stopPropagation()}
                        >
                            <motion.div
                                initial={{ scale: 0, rotate: -180 }}
                                animate={{ scale: 1, rotate: 0 }}
                                transition={{ type: "spring", delay: 0.2, duration: 0.6 }}
                                className="w-24 h-24 bg-green-500 rounded-full flex items-center justify-center shadow-lg shadow-green-500/20"
                            >
                                <Check size={48} className="text-white" strokeWidth={3} />
                            </motion.div>
                            
                            <div className="space-y-2">
                                <h2 className="text-3xl font-bold tracking-tight text-zinc-900 dark:text-white">Standup Complete!</h2>
                                <p className="text-muted-foreground text-lg">Great job team. Report saved.</p>
                            </div>

                            <motion.button
                                whileHover={{ scale: 1.05 }}
                                whileTap={{ scale: 0.95 }}
                                onClick={() => setShowSuccess(false)}
                                className="mt-4 px-8 py-3 bg-zinc-900 dark:bg-white text-white dark:text-zinc-900 font-bold rounded-full shadow-lg"
                            >
                                Awesome
                            </motion.button>
                        </motion.div>
                    </motion.div>
                )}
            </AnimatePresence>

            <BlockerDialog 
                isOpen={blockerDialogState.isOpen}
                onClose={() => setBlockerDialogState({ isOpen: false, userId: null })}
                onConfirm={(reason) => {
                    if (blockerDialogState.userId) {
                        actions.toggleUserBlocker(blockerDialogState.userId, true, reason);
                        setBlockerDialogState({ isOpen: false, userId: null });
                    }
                }}
            />

            {assignDialogState.user && (
                <AssignTicketDialog 
                    isOpen={assignDialogState.isOpen} 
                    onClose={() => setAssignDialogState({ isOpen: false, user: null })} 
                    developer={assignDialogState.user} 
                />
            )}

            <TicketDetailsDialog 
                isOpen={!!selectedTicket}
                ticket={selectedTicket}
                onClose={() => setSelectedTicket(null)}
                onSave={(data) => {
                    if (selectedTicket) {
                        actions.updateTicket(selectedTicket.id, data);
                    }
                }}
            />
        </div>
    );
};
