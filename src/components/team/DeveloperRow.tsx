import React, { useState, useMemo, useEffect } from 'react';
import { User } from '../../types';
import { useData } from '../../context/DataContext';
import { Button } from '../ui/Button';
import { Avatar, AvatarFallback, AvatarImage } from '../ui/Avatar';
import { Play, CheckCircle, Clock, User2 } from 'lucide-react';
import { Tooltip } from '../ui/Tooltip';
import { DeveloperTimeline } from './DeveloperTimeline';
import { cn } from '@/lib/utils';
import { BlockerDialog } from './BlockerDialog';

import { DateRange } from 'react-day-picker';

interface DeveloperRowProps {
  user: User;
  dateRange: DateRange | undefined; 
  onPickTicket: () => void;
}

export const DeveloperRow: React.FC<DeveloperRowProps> = ({ user, dateRange, onPickTicket }) => {
  const { data, actions, activityLog } = useData();
  const [now, setNow] = useState(Date.now());
  const [isBlockerDialogOpen, setIsBlockerDialogOpen] = useState(false);

  const currentTicket = user.currentTaskId 
    ? data.tickets.find(t => t.id === user.currentTaskId) 
    : null;

  // Filter Stats by Selected Date Range
  const completedToday = useMemo(() => {
      if (!dateRange?.from) return 0;
      
      const start = new Date(dateRange.from).setHours(0,0,0,0);
      const end = dateRange.to ? new Date(dateRange.to).setHours(23,59,59,999) : new Date(dateRange.from).setHours(23,59,59,999);
      
      return activityLog.filter(e => 
          e.userId === user.id && 
          e.type === 'task_done' && 
          e.timestamp >= start && 
          e.timestamp <= end
      ).length;
  }, [activityLog, user.id, dateRange]);

  const queuedCount = data.tickets.filter(t => t.assignee === user.id && t.status === 'backlog').length;

  useEffect(() => {
    const interval = setInterval(() => setNow(Date.now()), 1000);
    return () => clearInterval(interval);
  }, []);

  const { timerDisplay, isOvertime } = useMemo(() => {
    if (!user.currentTaskStartedAt || !currentTicket || user.status !== 'online') {
       return { timerDisplay: '00:00:00', isOvertime: false };
    }

    const start = user.currentTaskStartedAt;
    const effortHours = currentTicket.effort || 4;
    const durationMs = effortHours * 3600000;
    const end = start + durationMs;
    
    let diff = end - now;
    const isOver = diff < 0;
    
    if (isOver) diff = Math.abs(diff);

    const hours = Math.floor(diff / 3600000);
    const minutes = Math.floor((diff % 3600000) / 60000);
    
    return {
        timerDisplay: `${hours.toString().padStart(2, '0')}h ${minutes.toString().padStart(2, '0')}m`,
        isOvertime: isOver
    };
  }, [now, user.currentTaskStartedAt, currentTicket, user.status]);


  const toggleBlocker = () => {
    if (user.isBlocked) {
        // Unblock immediately
        actions.toggleUserBlocker(user.id, false);
    } else {
        // Open dialog to get reason
        setIsBlockerDialogOpen(true);
    }
  };

  const completeTicket = () => {
    if (currentTicket) {
      actions.completeTicket(currentTicket.id, user.id);
    }
  };

  const getStatusColor = (status: User['status']) => {
    switch (status) {
      case 'online': return 'bg-emerald-500';
      case 'break': return 'bg-amber-500';
      case 'off': return 'bg-zinc-400 dark:bg-zinc-600';
    }
  };

  return (
    <div className={cn(
        "bg-card border rounded-xl p-3 flex flex-col gap-3 shadow-sm hover:border-sidebar-primary/50 transition-colors w-full",
        user.isBlocked && "border-red-300 dark:border-red-800 bg-red-50/10"
    )}>
        
        {/* ROW HEADER: Identity + Active Task Summary */}
        <div className="flex justify-between items-start md:items-center">
            {/* Identity */}
            <div className="flex items-center gap-3">
                <div className="relative">
                    <Avatar className="h-10 w-10 border border-background shadow-sm">
                        <AvatarImage src={user.avatar} />
                        <AvatarFallback><User2 size={18} /></AvatarFallback>
                    </Avatar>
                    <span 
                        className={cn(
                            "absolute -bottom-0.5 -right-0.5 w-3 h-3 border-2 border-background rounded-full",
                            getStatusColor(user.status)
                        )} 
                        title={`Status: ${user.status}`}
                    />
                </div>
                <div>
                    <h4 className="font-bold text-sm leading-none">{user.name}</h4>
                    {user.isBlocked && (
                        <span className="text-[10px] text-red-500 font-bold block mt-1 uppercase">
                            BLOCKED: {user.blockerReason || 'No reason provided'}
                        </span>
                    )}
                </div>
            </div>

            {/* Active Task Summary (Right Aligned - T1 Design) */}
            <div className="flex items-center gap-4">
                 {currentTicket ? (
                     <>
                        <div className="text-right flex flex-col justify-center h-full">
                             <p className="text-[10px] uppercase font-bold text-muted-foreground leading-none mb-1">Active Task</p>
                             <div className="flex items-center justify-end gap-2 leading-none">
                                <span className="w-1.5 h-1.5 rounded-full bg-blue-500 animate-pulse" />
                                <p className="text-sm font-bold text-foreground truncate max-w-[200px] leading-none" title={currentTicket.title}>
                                    {currentTicket.title}
                                </p>
                             </div>
                        </div>
                        <div className={cn(
                            "px-2.5 py-1 rounded-md font-mono text-base font-bold tracking-tight shadow-sm border",
                            isOvertime 
                                ? "bg-red-500/10 text-red-600 border-red-500/20" 
                                : "bg-primary/10 text-primary border-primary/20"
                        )}>
                             {timerDisplay}
                        </div>
                        <div className="flex flex-col gap-1 ml-1">
                             <Tooltip content="Mark as Done">
                                 <Button 
                                    variant="ghost" 
                                    size="sm" 
                                    className="h-6 w-6 p-0 text-muted-foreground hover:text-green-600 hover:bg-green-50"
                                    onClick={completeTicket}
                                 >
                                    <CheckCircle size={16} />
                                 </Button>
                             </Tooltip>
                        </div>
                     </>
                 ) : (
                    <div className="text-right flex items-center gap-3">
                         <span className="text-xs text-muted-foreground italic">No active task</span>
                         <Button size="sm" variant="outline" className="h-9 gap-2 shadow-sm border-dashed" onClick={onPickTicket}>
                             <Play size={14} /> Pick Ticket
                         </Button>
                    </div>
                 )}
            </div>
        </div>

        {/* ROW BODY: Timeline */}
        <div className="w-full">
             <DeveloperTimeline user={user} activityLog={activityLog} tickets={data.tickets} dateRange={dateRange} />
        </div>

        {/* ROW FOOTER: Stats (optional based on user request "show many tasks finished today") */}
        <div className="flex items-center gap-4 pt-3 border-t border-border/20">
             <Tooltip content="Tasks completed today">
                 <div className="flex items-center gap-1.5 text-xs text-muted-foreground font-medium">
                     <CheckCircle size={14} className="text-emerald-500" />
                     <span className="text-foreground">{completedToday}</span> Completed
                 </div>
             </Tooltip>

             <div className="w-[1px] h-3 bg-border" />

             <Tooltip content="Tasks assigned in backlog">
                <div className="flex items-center gap-1.5 text-xs text-muted-foreground font-medium">
                    <Clock size={14} className="text-zinc-400" />
                    <span className="text-foreground">{queuedCount}</span> Backlog
                </div>
            </Tooltip>

            {/* Blocker Toggle (Small) */}
             <div className="ml-auto">
                {user.isBlocked ? (
                    <Button
                        variant="destructive"
                        size="sm"
                        className="h-8 px-4 text-xs font-bold bg-[#8B2323] hover:bg-[#A52A2A] text-white rounded-full transition-colors"
                        onClick={toggleBlocker}
                    >
                        Clear Blocker
                    </Button>
                ) : (
                    <Button
                        variant="ghost"
                        size="sm"
                        className="h-6 px-2 text-[10px] font-bold"
                        onClick={toggleBlocker}
                    >
                        Flag Blocker
                    </Button>
                )}
            </div>
        </div>

        
        <BlockerDialog 
            isOpen={isBlockerDialogOpen} 
            onClose={() => setIsBlockerDialogOpen(false)} 
            onConfirm={(reason) => {
                actions.toggleUserBlocker(user.id, true, reason);
                setIsBlockerDialogOpen(false);
            }} 
        />
    </div>
  );
};

