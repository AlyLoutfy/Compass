import React from 'react';
import { useData } from '../../context/DataContext';
import { ScrollArea } from '../ui/ScrollArea';
import { format } from 'date-fns';
import { Avatar, AvatarFallback, AvatarImage } from '../ui/Avatar';

export const ActivityFeed: React.FC = () => {
  const { activityLog, data } = useData();

  const getUser = (id: string) => data.users.find(u => u.id === id);

  return (
    <div className="h-full flex flex-col">
      <h3 className="text-sm font-bold text-muted-foreground uppercase tracking-widest mb-4">Team Activity</h3>
      <ScrollArea className="flex-1 pr-4">
        <div className="space-y-4">
          {activityLog.map((event) => {
            const user = getUser(event.userId);
            return (
              <div key={event.id} className="flex gap-3 relative pb-4 last:pb-0">
                <div className="absolute left-[14px] top-8 bottom-0 w-px bg-border last:hidden" />
                <Avatar className="w-7 h-7 border border-border">
                    <AvatarImage src={user?.avatar} />
                    <AvatarFallback>{user?.name?.[0]}</AvatarFallback>
                </Avatar>
                <div>
                   <div className="flex items-center gap-2">
                        <span className="text-sm font-semibold text-foreground">{user?.name}</span>
                        <span className="text-xs text-muted-foreground">{format(event.timestamp, 'HH:mm')}</span>
                   </div>
                   <p className="text-sm text-muted-foreground mt-0.5 leading-snug">{event.details}</p>
                </div>
              </div>
            );
          })}
          {activityLog.length === 0 && (
            <div className="text-center text-muted-foreground text-sm py-8">
                No activity recorded yet today.
            </div>
          )}
        </div>
      </ScrollArea>
    </div>
  );
};
