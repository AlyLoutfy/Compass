import React from 'react';
import { User, Ticket } from '../../types';
import { Avatar, AvatarFallback, AvatarImage } from '../ui/Avatar';
import { Badge } from '../ui/Badge';
import { Card } from '../ui/Card';
import { CheckCircle, GripVertical, Plus, User2, X } from 'lucide-react';
import { cn } from '@/lib/utils';
import { useData } from '../../context/DataContext';
import { Draggable, Droppable } from '@hello-pangea/dnd';

interface StandupCardProps {
  user: User;
  yesterdayTickets: Ticket[];
  todayTickets: Ticket[];
  isSpeaker: boolean;
  onFocus: () => void;
  onAssign: () => void;
  onSelectTicket?: (ticket: Ticket) => void;
}

export const StandupCard: React.FC<StandupCardProps> = ({
  user,
  yesterdayTickets,
  todayTickets,
  isSpeaker,
  onFocus,
  onAssign,
  onSelectTicket
}) => {
  const { actions } = useData();
  const currentTicket = user.currentTaskId ? todayTickets.find(t => t.id === user.currentTaskId) : null;
  const queuedTickets = todayTickets.filter(t => t.id !== user.currentTaskId).sort((a, b) => (a.order ?? 0) - (b.order ?? 0));

  return (
    <Card 
      className={cn(
        "p-4 bg-white dark:bg-[#191919] border-zinc-200 dark:border-zinc-800 shadow-sm relative group/card cursor-default",
        isSpeaker ? "ring-2 ring-primary/20 shadow-md z-10" : "hover:shadow-md",
        user.isBlocked ? "border-red-200 dark:border-red-900/50 bg-red-50/30 dark:bg-red-950/20" : ""
      )}
      onClick={onFocus}
    >
        {/* User Info Header */}
        <div className="flex items-start gap-3 mb-6">
             <div className="relative">
                <Avatar className="h-8 w-8 rounded-md bg-zinc-100 dark:bg-zinc-800">
                    <AvatarImage src={user.avatar} />
                    <AvatarFallback><User2 size={16} /></AvatarFallback>
                </Avatar>
                <div className={cn(
                    "absolute -bottom-1 -right-1 h-3 w-3 rounded-full border-2 border-white dark:border-[#191919]",
                    user.status === 'online' ? "bg-emerald-500" : "bg-zinc-400"
                )} />
             </div>
             <div className="flex-1 min-w-0">
                <div className="flex items-center gap-2">
                    <span className="font-semibold text-sm truncate">{user.name}</span>
                    {user.isBlocked && <Badge variant="destructive" className="h-4 px-1 text-[8px] uppercase">Blocked</Badge>}
                </div>
                <p className="text-[10px] text-muted-foreground uppercase font-bold tracking-tight">{user.role === 'fullstack' ? 'Full Stack' : user.role}</p>
             </div>

        </div>

        {/* Yesterday (Completed) */}
        {yesterdayTickets.length > 0 && (
            <div 
                className="mb-4 space-y-1 opacity-60"
                onClick={(e) => e.stopPropagation()}
            >
                <p className="text-[9px] font-bold text-zinc-400 uppercase tracking-widest px-6">Yesterday</p>
                {yesterdayTickets.map(t => (
                    <div key={t.id} className="flex gap-2 items-center px-6 group/done h-5">
                        <CheckCircle size={12} className="text-zinc-300 dark:text-zinc-700 shrink-0" />
                        <span className="text-[11px] text-zinc-500 line-through truncate font-medium">{t.title}</span>
                    </div>
                ))}
            </div>
        )}

        {/* Today's Focus - Droppable Zone */}
        <div className="space-y-2">
            <Droppable droppableId={user.id} type="TICKET">
                {(provided, snapshot) => (
                    <div 
                        ref={provided.innerRef}
                        {...provided.droppableProps}
                        onClick={(e) => e.stopPropagation()}
                        className={cn(
                            "min-h-[2px] rounded space-y-2",
                            snapshot.isDraggingOver ? "bg-zinc-50 dark:bg-zinc-900/50" : ""
                        )}
                    >
                        {/* Active Task (doing) */}
                        {currentTicket && (
                            <Draggable draggableId={currentTicket.id} index={0}>
                                {(provided, snapshot) => (
                                        <div
                                            ref={provided.innerRef}
                                            {...provided.draggableProps}
                                            {...provided.dragHandleProps}
                                            className={cn(
                                                "flex gap-1.5 items-center group/task w-full",
                                                snapshot.isDragging && "z-50 !opacity-100 scale-105 rotate-1"
                                            )}
                                            style={provided.draggableProps.style}
                                        >
                                            <div className="p-0.5 rounded hover:bg-zinc-100 dark:hover:bg-zinc-800 text-zinc-300 opacity-0 group-hover/card:opacity-100 transition-opacity shrink-0 -ml-1">
                                                <GripVertical size={12} />
                                            </div>
                                            <div className="flex-1 min-w-0 flex items-center gap-1.5">
                                                <div className="h-1.5 w-1.5 rounded-full bg-blue-500 animate-pulse shrink-0" />
                                                <div className="flex-1 min-w-0">
                                                    <p 
                                                        onClick={(e) => {
                                                            e.stopPropagation();
                                                            onSelectTicket?.(currentTicket);
                                                        }}
                                                        className="text-[11px] font-semibold leading-tight decoration-zinc-200 dark:decoration-zinc-800 underline underline-offset-4 decoration-2 decoration-blue-200 dark:decoration-blue-900/50 truncate cursor-pointer hover:text-blue-600 dark:hover:text-blue-400 transition-colors"
                                                    >
                                                        {currentTicket.title}
                                                    </p>
                                                </div>
                                            </div>
                                            <div className="shrink-0 ml-auto">
                                                <button
                                                    onClick={(e) => {
                                                        e.stopPropagation();
                                                        actions.completeTicket(currentTicket.id, user.id);
                                                    }}
                                                    className="opacity-0 group-hover/task:opacity-100 h-6 w-6 flex items-center justify-center hover:bg-green-50 dark:hover:bg-green-900/20 hover:text-green-600 rounded-full transition-all shrink-0"
                                                >
                                                    <CheckCircle size={14} />
                                                </button>
                                            </div>
                                        </div>
                                )}
                            </Draggable>
                        )}

                        {/* Queued (Backlog) */}
                        <div className="space-y-2">
                            {queuedTickets.map((t, index) => (
                                <Draggable key={t.id} draggableId={t.id} index={index + (currentTicket ? 1 : 0)}>
                                    {(provided, snapshot) => (
                                        <div
                                            ref={provided.innerRef}
                                            {...provided.draggableProps}
                                            {...provided.dragHandleProps}
                                            className={cn(
                                                "flex items-center gap-2 group/queue relative w-full",
                                                snapshot.isDragging && "z-50 !opacity-100 scale-105 bg-white dark:bg-[#191919] p-2 rounded shadow-xl border"
                                            )}
                                            style={provided.draggableProps.style}
                                        >
                                            <div className="p-0.5 rounded hover:bg-zinc-100 dark:hover:bg-zinc-800 text-zinc-300 opacity-0 group-hover/card:opacity-100 transition-opacity shrink-0 -ml-1">
                                                <GripVertical size={12} />
                                            </div>
                                            <div className="h-1 rounded-full bg-zinc-300 dark:bg-zinc-700 shrink-0 w-1" />
                                            <span 
                                                className="text-[11px] text-zinc-500 truncate flex-1 hover:text-zinc-900 dark:hover:text-zinc-200 cursor-pointer font-medium"
                                                onClick={(e) => {
                                                    e.stopPropagation();
                                                    onSelectTicket?.(t);
                                                }}
                                            >
                                                {t.title}
                                            </span>
                                            <button
                                                onClick={(e) => {
                                                    e.stopPropagation();
                                                    actions.unassignTicket(t.id, user.id);
                                                }}
                                                className="opacity-0 group-hover/queue:opacity-100 h-5 w-5 flex items-center justify-center hover:text-red-500 transition-opacity"
                                            >
                                                <X size={12} />
                                            </button>
                                        </div>
                                    )}
                                </Draggable>
                            ))}
                        </div>
                        {provided.placeholder}
                    </div>
                )}
            </Droppable>

            {/* Add Task Control */}
            <div onClick={(e) => e.stopPropagation()}>
                <button 
                    onClick={(e) => {
                        e.stopPropagation();
                        onAssign();
                    }}
                    className="flex items-center gap-1.5 text-zinc-400 hover:text-zinc-600 dark:hover:text-zinc-300 text-[11px] font-medium transition-colors pl-6 h-6 w-full text-left"
                >
                    <Plus size={14} />
                    <span>New Task</span>
                </button>
            </div>
        </div>
    </Card>
  );
};

