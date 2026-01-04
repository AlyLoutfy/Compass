import React from 'react';
import { StandupReport } from '../../types';
import { ScrollArea } from '../ui/ScrollArea';
import { Button } from '../ui/Button';
import { X, Clock } from 'lucide-react';
import { cn } from '@/lib/utils'; // Assuming cn assumes tailwind-merge

interface StandupHistorySidebarProps {
  history: StandupReport[];
  isOpen: boolean;
  onClose: () => void;
  onSelectReport: (report: StandupReport) => void;
  selectedReportId?: string;
}

export const StandupHistorySidebar: React.FC<StandupHistorySidebarProps> = ({
  history,
  isOpen,
  onClose,
  onSelectReport,
  selectedReportId
}) => {
  if (!isOpen) return null;

  return (
    <div className="fixed inset-y-0 right-0 w-[300px] bg-background border-l border-border shadow-2xl z-[60] animate-in slide-in-from-right duration-300 flex flex-col">
        <div className="p-4 border-b border-border flex items-center justify-between bg-muted/30">
            <h3 className="font-bold flex items-center gap-2">
                <HistoryIcon className="text-muted-foreground" size={18} />
                Standup History
            </h3>
            <Button variant="ghost" size="icon" className="h-8 w-8" onClick={onClose}>
                <X size={16} />
            </Button>
        </div>

        <ScrollArea className="flex-1 p-4">
            {history.length === 0 ? (
                <div className="text-center py-10 text-muted-foreground text-sm">
                    No history recorded yet.
                </div>
            ) : (
                <div className="space-y-3">
                    {history.map(report => (
                        <div 
                            key={report.id}
                            onClick={() => onSelectReport(report)}
                            className={cn(
                                "p-3 rounded-lg border cursor-pointer transition-all hover:border-primary/50",
                                selectedReportId === report.id 
                                    ? "bg-primary/5 border-primary shadow-sm" 
                                    : "bg-card border-border hover:bg-muted/50"
                            )}
                        >
                            <div className="flex items-center justify-between mb-1">
                                <span className="font-bold text-sm">
                                    {new Date(report.date).toLocaleDateString(undefined, { weekday: 'short', month: 'short', day: 'numeric' })}
                                </span>
                                <span className="text-xs text-muted-foreground bg-muted px-1.5 py-0.5 rounded-md font-mono">
                                    {Math.floor(report.durationSeconds / 60)}m {report.durationSeconds % 60}s
                                </span>
                            </div>
                            <div className="flex items-center gap-2 text-xs text-muted-foreground">
                                <span className="flex items-center gap-1">
                                    <Clock size={12} />
                                    {new Date(report.date).toLocaleTimeString(undefined, { hour: '2-digit', minute: '2-digit' })}
                                </span>
                                <span>•</span>
                                <span>{report.attendees.length} Attendees</span>
                            </div>
                        </div>
                    ))}
                </div>
            )}
        </ScrollArea>
    </div>
  );
};

const HistoryIcon = ({ className, size }: { className?: string, size?: number }) => (
    <svg 
      xmlns="http://www.w3.org/2000/svg" 
      width={size || 24} 
      height={size || 24} 
      viewBox="0 0 24 24" 
      fill="none" 
      stroke="currentColor" 
      strokeWidth="2" 
      strokeLinecap="round" 
      strokeLinejoin="round" 
      className={className}
    >
      <path d="M3 12a9 9 0 1 0 9-9 9.75 9.75 0 0 0-6.74 2.74L3 8" />
      <path d="M3 3v5h5" />
      <path d="M12 7v5l4 2" />
    </svg>
);
