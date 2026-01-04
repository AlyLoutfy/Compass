import React from 'react';
import { User } from '../../types';
import { useData } from '../../context/DataContext';
import { Badge } from '../ui/Badge';
import { Button } from '../ui/Button';
import { Card, CardHeader, CardContent, CardFooter } from '../ui/Card';
import { Avatar, AvatarFallback, AvatarImage } from '../ui/Avatar';
import { Play, CheckCircle, AlertTriangle, Clock } from 'lucide-react';
import { format } from 'date-fns';
import { Tooltip } from '../ui/Tooltip';

interface DeveloperCardProps {
  user: User;
  onPickTicket: () => void;
}

export const DeveloperCard: React.FC<DeveloperCardProps> = ({ user, onPickTicket }) => {
  const { data, actions, activityLog } = useData();

  const currentTicket = user.currentTaskId 
    ? data.tickets.find(t => t.id === user.currentTaskId) 
    : null;

  const todaysActivity = activityLog
    .filter(e => e.userId === user.id)
    .slice(0, 3); // Show last 3 only for compactness

  const handleStatusChange = (status: User['status']) => {
    actions.updateUserStatus(user.id, status);
  };

  const toggleBlocker = () => {
    actions.toggleUserBlocker(user.id, !user.isBlocked);
  };

  const completeTicket = () => {
    if (currentTicket) {
      actions.moveTicket(currentTicket.id, 'done');
      actions.updateUserStatus(user.id, 'online');
      actions.updateUser(user.id, { currentTaskId: undefined }); 
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
    <Card className={`group relative flex flex-col transition-all duration-300 ${
        user.isBlocked 
            ? 'border-red-500/50 bg-red-50/10 dark:bg-red-900/10 shadow-[0_0_15px_-3px_rgba(239,68,68,0.2)]' 
            : 'hover:shadow-md hover:border-primary/20 bg-card'
    }`}>
      {/* Blocker Overlay/Button */}
      <button 
        onClick={toggleBlocker}
        className={`absolute top-3 right-3 z-10 p-1.5 rounded-full transition-all ${
            user.isBlocked 
                ? 'bg-red-500 text-white shadow-sm ring-2 ring-red-500/20' 
                : 'text-muted-foreground hover:bg-muted opacity-0 group-hover:opacity-100'
        }`}
        title={user.isBlocked ? "Clear Blocker" : "Raise Blocker"}
      >
        <AlertTriangle className={`w-4 h-4 ${user.isBlocked ? 'fill-current' : ''}`} />
      </button>

      <CardHeader className="pb-3 pt-4 px-4">
        <div className="flex items-center gap-3">
            <div className="relative">
                <Avatar className="w-12 h-12 border-2 border-background shadow-sm ring-1 ring-border/10">
                    <AvatarImage src={user.avatar} />
                    <AvatarFallback className="bg-muted text-muted-foreground font-semibold">{user.name.charAt(0)}</AvatarFallback>
                </Avatar>
                <div className={`absolute bottom-0 right-0 w-3.5 h-3.5 rounded-full border-[3px] border-card ${getStatusColor(user.status)}`} />
            </div>
            <div className="flex-1 min-w-0">
                <h3 className="font-semibold text-base leading-tight truncate text-foreground">{user.name}</h3>
                <p className="text-xs text-muted-foreground uppercase tracking-wider font-medium mt-0.5">{user.role === 'fullstack' ? 'Full Stack' : user.role}</p>
            </div>
        </div>
      </CardHeader>

      <CardContent className="flex-1 px-4 py-0 min-h-[120px] flex flex-col">
        {/* Status Segmented Control */}
        <div className="flex bg-muted/50 p-1 rounded-lg mb-4">
            {(['online', 'break', 'off'] as const).map((s) => (
                <button
                    key={s}
                    onClick={() => handleStatusChange(s)}
                    className={`flex-1 text-[10px] py-1 rounded-md font-medium transition-all capitalize ${
                        user.status === s 
                        ? 'bg-background text-foreground shadow-sm ring-1 ring-border/5' 
                        : 'text-muted-foreground hover:text-foreground hover:bg-background/50'
                    }`}
                >
                    {s}
                </button>
            ))}
        </div>

        {/* Current Task Area */}
        <div className="flex-1 flex flex-col">
            {user.status === 'off' ? (
                <div className="flex-1 flex flex-col items-center justify-center text-muted-foreground/50 border-2 border-dashed border-border/50 rounded-xl bg-muted/20">
                    <Clock className="w-6 h-6 mb-2 opacity-50" />
                    <span className="text-xs font-medium">Offline</span>
                </div>
            ) : currentTicket ? (
                <Tooltip 
                    content={
                        <div className="space-y-1">
                            <p className="font-semibold">{currentTicket.title}</p>
                            <p className="text-xs text-zinc-400">ID: {currentTicket.id}</p>
                            <p className="text-xs text-zinc-500">Click to view details</p>
                        </div>
                    }
                >
                    <div 
                        className="flex-1 bg-primary/5 border border-primary/10 rounded-xl p-3 flex flex-col justify-between group/ticket relative hover:border-primary/20 transition-colors cursor-pointer hover:bg-primary/10 w-full"
                        onClick={() => window.location.href = `/tickets/${currentTicket.id}`}
                    >
                        <div>
                            <div className="flex justify-between items-start mb-2">
                                <Badge variant="outline" className="text-[10px] h-5 px-1.5 bg-background border-primary/20 text-primary uppercase">
                                    Ticket {currentTicket.id.substring(0, 4)}
                                </Badge>
                                <Badge className={`text-[10px] h-5 px-1.5 uppercase transition-colors ${
                                    currentTicket.priority === 'critical'
                                        ? 'bg-red-600 text-white border-red-500' 
                                        : currentTicket.priority === 'high' 
                                        ? 'bg-red-500/10 text-red-600 border-red-500/20' 
                                        : 'bg-muted text-muted-foreground'
                                }`}>
                                    {currentTicket.priority}
                                </Badge>
                            </div>
                            <p className="text-sm font-medium text-foreground leading-snug line-clamp-2 text-left">
                                {currentTicket.title}
                            </p>
                        </div>
                        
                        <div className="mt-3">
                            <Button 
                                size="sm" 
                                className="w-full h-7 text-xs bg-primary hover:bg-primary/90 text-primary-foreground shadow-sm" 
                                onClick={(e) => {
                                    e.stopPropagation();
                                    completeTicket();
                                }}
                            >
                                <CheckCircle className="w-3 h-3 mr-1.5" /> Mark Done
                            </Button>
                        </div>
                    </div>
                </Tooltip>
            ) : (
                <button 
                    onClick={onPickTicket}
                    className="flex-1 w-full flex flex-col items-center justify-center text-muted-foreground p-4 border-2 border-dashed border-muted-foreground/20 rounded-xl hover:border-primary/50 hover:bg-primary/5 hover:text-primary transition-all group/pick"
                >
                    <div className="w-10 h-10 rounded-full bg-muted/50 group-hover/pick:bg-primary/10 flex items-center justify-center mb-2 transition-colors">
                        <Play className="w-5 h-5 ml-0.5 opacity-70 group-hover/pick:opacity-100" />
                    </div>
                    <span className="text-sm font-medium">Pick a Ticket</span>
                </button>
            )}
        </div>
      </CardContent>

      <CardFooter className="px-4 py-3 mt-2 border-t border-border/40">
        <div className="w-full space-y-2">
            {todaysActivity.length > 0 ? (
                <div className="space-y-1.5">
                    {todaysActivity.map(event => (
                        <div key={event.id} className="flex items-center gap-2 text-[10px] text-muted-foreground">
                            <div className="w-1 h-1 rounded-full bg-border" />
                            <span className="opacity-70 font-mono">{format(event.timestamp, 'HH:mm')}</span>
                            <span className="truncate max-w-[140px]">{event.details}</span>
                        </div>
                    ))}
                </div>
            ) : (
                <p className="text-[10px] text-muted-foreground/50 italic text-center py-1">No activity recorded today</p>
            )}
        </div>
      </CardFooter>
    </Card>
  );
};
