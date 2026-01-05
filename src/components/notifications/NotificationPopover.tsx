import { Button, Popover } from '@heroui/react';
import { Bell, Check, Info, AlertTriangle, AlertCircle, CheckCircle } from 'lucide-react';
import { useData } from '@/context/DataContext';
import { formatDistanceToNow } from 'date-fns';
import { cn } from '@/lib/utils';

export const NotificationPopover = () => {
    const { data, actions } = useData();
    const notifications = data.notifications || [];
    const unreadCount = notifications.filter(n => !n.isRead).length;

    const getIcon = (type: string) => {
        switch (type) {
            case 'success': return <CheckCircle size={14} className="text-green-500" />;
            case 'warning': return <AlertTriangle size={14} className="text-amber-500" />;
            case 'error': return <AlertCircle size={14} className="text-red-500" />;
            default: return <Info size={14} className="text-blue-500" />;
        }
    };

    return (
        <Popover>
            <Popover.Trigger>
                <div className="relative">
                    <Button variant="ghost" isIconOnly size="sm" className="relative text-muted-foreground hover:text-foreground bg-transparent">
                        <Bell size={20} />
                        {unreadCount > 0 && (
                            <span className="absolute top-2 right-2 w-2.5 h-2.5 bg-red-500 border-2 border-background rounded-full" />
                        )}
                    </Button>
                </div>
            </Popover.Trigger>
            <Popover.Content className="p-0 border-none shadow-xl rounded-xl overflow-hidden bg-background border border-border w-80 z-50">
                <Popover.Dialog className="p-0 flex flex-col outline-none">
                    <div className="flex items-center justify-between p-3 border-b bg-card">
                        <div className="flex items-center gap-2">
                            <span className="font-semibold text-sm">Notifications</span>
                            {unreadCount > 0 && (
                                <span className="px-1.5 py-0.5 bg-primary/10 text-primary text-[10px] font-bold rounded-full">
                                    {unreadCount} new
                                </span>
                            )}
                        </div>
                        {unreadCount > 0 && (
                            <button 
                                onClick={() => actions.markAllNotificationsAsRead()}
                                className="text-[10px] text-muted-foreground hover:text-primary transition-colors font-medium flex items-center gap-1"
                            >
                                <Check size={12} /> Mark all read
                            </button>
                        )}
                    </div>
                    
                    <div className="max-h-[400px] overflow-y-auto min-h-[100px] bg-card/50">
                        {notifications.length === 0 ? (
                            <div className="flex flex-col items-center justify-center py-12 text-muted-foreground gap-3">
                                <div className="p-3 bg-muted/50 rounded-full">
                                    <Bell size={20} className="opacity-40" />
                                </div>
                                <p className="text-xs">No notifications yet</p>
                            </div>
                        ) : (
                            <div className="flex flex-col">
                                {notifications.map((n) => (
                                    <div 
                                        key={n.id}
                                        onClick={() => actions.markNotificationAsRead(n.id)}
                                        className={cn(
                                            "p-3 border-b last:border-0 cursor-pointer transition-colors relative flex gap-3 group",
                                            !n.isRead ? "bg-primary/5 hover:bg-primary/10" : "hover:bg-muted/40 bg-card"
                                        )}
                                    >
                                        <div className="mt-0.5 shrink-0">
                                            {getIcon(n.type)}
                                        </div>
                                        <div className="flex flex-col gap-0.5 min-w-0 flex-1">
                                            <div className="flex items-start justify-between gap-2">
                                                <span className={cn("text-xs font-medium leading-tight", !n.isRead ? "text-foreground" : "text-muted-foreground")}>
                                                    {n.title}
                                                </span>
                                                <span className="text-[10px] text-muted-foreground shrink-0 tabular-nums">
                                                    {formatDistanceToNow(n.timestamp, { addSuffix: true })}
                                                </span>
                                            </div>
                                            <p className="text-[11px] text-muted-foreground line-clamp-2 leading-relaxed">
                                                {n.message}
                                            </p>
                                        </div>
                                        {!n.isRead && (
                                            <div className="absolute right-3 top-1/2 -translate-y-1/2 w-1.5 h-1.5 bg-primary rounded-full opacity-0 group-hover:opacity-100 transition-opacity" />
                                        )}
                                    </div>
                                ))}
                            </div>
                        )}
                    </div>
                </Popover.Dialog>
            </Popover.Content>
        </Popover>
    );
};
