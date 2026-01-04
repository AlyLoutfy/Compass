
import React, { useMemo } from 'react';
import { User, ActivityEvent, Ticket } from '../../types';
import { Tooltip } from '../ui/Tooltip';
import { cn } from '@/lib/utils';
import { DateRange } from 'react-day-picker';
import { CheckCircle2 } from 'lucide-react';

interface DeveloperTimelineProps {
    user: User;
    activityLog: ActivityEvent[];
    tickets: Ticket[];
    dateRange?: DateRange; 
}

interface TimelineSegment {
    type: 'work' | 'break' | 'idle';
    status?: 'done' | 'active'; // For work segments
    start: number;
    end: number;
    ticketId?: string;
    ticketTitle?: string;
}

export const DeveloperTimeline: React.FC<DeveloperTimelineProps> = ({ user, activityLog, tickets, dateRange }) => {
    
    // 1. Calculate Timeline Data
    const segments = useMemo(() => {
        // If range spans multiple days, maybe we show nothing or just the 'from' day? 
        // For simplicity, let's visualize the 'from' day, or today if undefined.
        // User asked for "range" support in stats, but timeline is inherently 24h.
        // Let's default to 'from' date.
        
        const targetDate = dateRange?.from ? new Date(dateRange.from) : new Date();
        targetDate.setHours(0, 0, 0, 0);
        const now = Date.now();

        // Standard Day: 8 AM - 6 PM
        const DAY_START_HOUR = 8;
        
        const dayStartTimestamp = new Date(targetDate).setHours(DAY_START_HOUR, 0, 0, 0);

        // Filter events for this user today
        const events = activityLog
            .filter(e => e.userId === user.id && e.timestamp >= dayStartTimestamp)
            .sort((a, b) => a.timestamp - b.timestamp);

        const calculatedSegments: TimelineSegment[] = [];
        
        // Helper to find ticket info
        const getTicket = (id?: string) => tickets.find(t => t.id === id);

        // --- RECONSTRUCT TIMELINE ---
        
        // Pass 1: Extract "Done" tasks (definite work blocks)
        const doneEvents = events.filter(e => e.type === 'task_done');
        
        doneEvents.forEach(doneEvt => {
            // Find most recent start for this ticket
            const startEvt = events
                .filter(e => e.type === 'task_start' && e.ticketId === doneEvt.ticketId && e.timestamp < doneEvt.timestamp)
                .pop(); 

            // Fallback: If no start found, assume 30 mins duration for visualization
            const startTimestamp = startEvt ? startEvt.timestamp : (doneEvt.timestamp - 30 * 60 * 1000);

            calculatedSegments.push({
                type: 'work',
                status: 'done',
                start: startTimestamp,
                end: doneEvt.timestamp,
                ticketId: doneEvt.ticketId,
                ticketTitle: getTicket(doneEvt.ticketId)?.title,
            });
        });

        // Current Active Task
        if (user.currentTaskId && user.currentTaskStartedAt) {
             const start = user.currentTaskStartedAt;
             // Ensure it falls within today (or clamp it)
             const clampedStart = Math.max(start, dayStartTimestamp);
             
             calculatedSegments.push({
                 type: 'work',
                 status: 'active',
                 start: clampedStart,
                 end: now, // Until now
                 ticketId: user.currentTaskId,
                 ticketTitle: getTicket(user.currentTaskId)?.title
             });
        }
        
        return calculatedSegments;

    }, [user, activityLog, tickets, dateRange]);

    // Position helper
    const getStyle = (start: number, end: number) => {
        const targetDate = dateRange?.from ? new Date(dateRange.from) : new Date();
        const startOfDay = new Date(targetDate).setHours(8, 0, 0, 0);
        const endOfDay = new Date(targetDate).setHours(18, 0, 0, 0);
        const totalDuration = endOfDay - startOfDay;

        // Clamp
        const clampedStart = Math.max(start, startOfDay);
        const clampedEnd = Math.min(end, endOfDay);
        
        if (clampedEnd < clampedStart) return { display: 'none' };

        const left = ((clampedStart - startOfDay) / totalDuration) * 100;
        const width = ((clampedEnd - clampedStart) / totalDuration) * 100;

        return {
            left: `${left}%`,
            width: `${width}%`
        };
    };

    // Current Time Indicator
    const nowPosition = () => {
        const targetDate = dateRange?.from ? new Date(dateRange.from) : new Date();
        const now = Date.now();
        // If selected date is NOT today, don't show current time indicator
        if (new Date().toDateString() !== targetDate.toDateString()) return -1;
        
        const startOfDay = new Date(targetDate).setHours(8, 0, 0, 0);
        const endOfDay = new Date(targetDate).setHours(18, 0, 0, 0);
        const totalDuration = endOfDay - startOfDay;
        
        if (now < startOfDay) return 0;
        if (now > endOfDay) return 100;
        return ((now - startOfDay) / totalDuration) * 100;
    };


    return (
        <div className="w-full space-y-2">
            
            {/* The Bar Container */}
            <div className="h-8 bg-zinc-100 dark:bg-zinc-800/50 rounded-sm w-full relative overflow-hidden border border-border/50">
                
                {/* Background Grid/Markers for Hours */}
                <div className="absolute inset-0 flex justify-between px-[2px] pointer-events-none">
                     {/* 8am to 6pm = 10 hours. 11 markers (including ends) */}
                     {Array.from({ length: 11 }).map((_, i) => (
                         <div key={i} className="h-full w-[1px] bg-zinc-200 dark:bg-zinc-700/50" />
                     ))}
                </div>

                {/* VISUAL BREAKS (Hatched pattern for empty spaces? Or just gaps?) 
                    User said "make sure we can see breaks". Gaps are breaks. 
                    Let's maybe add a subtle pattern to the background to imply "available time" vs "break".
                */}
                <div className="absolute inset-0 opacity-[0.03] pattern-diagonal-lines pointer-events-none" />

                {/* Render Segments */}
                {segments.map((seg, i) => {
                    const style = getStyle(seg.start, seg.end);
                    if (style.display === 'none') return null;

                    return (
                        <Tooltip key={i} content={`${seg.ticketTitle || 'Unknown Task'} (${new Date(seg.start).toLocaleTimeString([], {hour:'2-digit', minute:'2-digit'})} - ${new Date(seg.end).toLocaleTimeString([], {hour:'2-digit', minute:'2-digit'})})`}>
                            <div 
                                className={cn(
                                    "absolute top-0 bottom-0 h-full border-r border-white/20 flex items-center px-2 transition-all hover:brightness-110 cursor-help overflow-hidden whitespace-nowrap",
                                    seg.status === 'done' 
                                        ? "bg-emerald-500/20 border-emerald-500/30 text-emerald-700 dark:text-emerald-400" 
                                        : "bg-blue-500 text-white border-blue-600 shadow-sm"
                                )}
                                style={style}
                            >
                                <span className={cn(
                                    "text-[10px] font-bold truncate",
                                    seg.status === 'active' ? "animate-pulse" : ""
                                )}>
                                    {seg.ticketTitle}
                                </span>
                                {seg.status === 'done' && <CheckCircle2 size={10} className="ml-1 shrink-0 opacity-50" />}
                            </div>
                        </Tooltip>
                    );
                })}

                {/* Current Time Indicator */}
                {nowPosition() !== -1 && (
                    <div 
                        className="absolute top-0 bottom-0 w-[1px] bg-red-500 z-10 pointer-events-none"
                        style={{ left: `${nowPosition()}%` }}
                    >
                        <div className="absolute -top-1 -translate-x-1/2 w-2 h-2 bg-red-500 rounded-full" />
                    </div>
                )}
            </div>

            {/* Labels */}
            <div className="flex justify-between items-center text-[10px] font-medium text-muted-foreground uppercase tracking-wider px-0.5">
                <span>8:00 AM</span>
                <span className="text-red-500 font-bold flex items-center gap-1">
                    <div className="w-1.5 h-1.5 bg-red-500 rounded-full animate-pulse" />
                    Current Time ({new Date().toLocaleTimeString([], {hour:'numeric', minute:'2-digit'})})
                </span>
                <span>6:00 PM</span>
            </div>

        </div>
    );
};
