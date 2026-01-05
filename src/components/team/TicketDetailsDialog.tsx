import React, { useState, useEffect } from 'react';
import { Ticket, Priority, TicketStatus } from '../../types';
import { useData } from '@/context/DataContext';
import { 
    X, Calendar, ArrowUpRight, Clock, 
    Bold, Italic, ListOrdered, List, CheckSquare, Code, Link, Trash2
} from 'lucide-react';
import { Button } from '@/components/ui/Button';
import { ConfirmDialog } from '@/components/ui/ConfirmDialog';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/Select';
import { cn } from '@/lib/utils';
import { format } from 'date-fns';
import { motion, AnimatePresence } from 'framer-motion';

interface TicketDetailsDialogProps {
    ticket?: Ticket | null; // Optional/null for "Create New" mode
    isOpen: boolean;
    onClose: () => void;
    onSave?: (data: Partial<Ticket>) => void; // Callback when saving
}

const Avatar = ({ fallback, className }: { fallback: string, className?: string }) => (
    <div className={cn("w-6 h-6 rounded-full bg-gradient-to-br from-indigo-500 to-purple-600 flex items-center justify-center text-[10px] text-white font-bold shrink-0", className)}>
        {fallback}
    </div>
);

export const TicketDetailsDialog: React.FC<TicketDetailsDialogProps> = ({ ticket, isOpen, onClose, onSave }) => {
    const { data, actions } = useData();
    const [title, setTitle] = useState('');
    const [description, setDescription] = useState('');
    const [priority, setPriority] = useState<Priority>('medium');
    const [status, setStatus] = useState<TicketStatus>('backlog');
    const [assignee, setAssignee] = useState<string>('unassigned');
    const [isDeleteConfirmOpen, setIsDeleteConfirmOpen] = useState(false);

    // Reset form when ticket changes or dialog opens
    useEffect(() => {
        if (isOpen) {
            if (ticket) {
                setTitle(ticket.title);
                setDescription(ticket.description || '');
                setPriority(ticket.priority);
                setStatus(ticket.status || 'backlog');
                setAssignee(ticket.assignee || 'unassigned');
            } else {
                setTitle('');
                setDescription('');
                setPriority('medium');
                setStatus('backlog');
                setAssignee('unassigned');
            }
        }
    }, [ticket, isOpen]);

    // Handle ESC key
    useEffect(() => {
        const handleKeyDown = (e: KeyboardEvent) => {
            if (e.key === 'Escape' && isOpen) {
                onClose();
            }
        };
        window.addEventListener('keydown', handleKeyDown);
        return () => window.removeEventListener('keydown', handleKeyDown);
    }, [isOpen, onClose]);

    const textareaRef = React.useRef<HTMLTextAreaElement>(null);

    const insertMarkdown = (prefix: string, suffix: string) => {
        if (!textareaRef.current) return;
        
        const start = textareaRef.current.selectionStart;
        const end = textareaRef.current.selectionEnd;
        const text = description;
        const before = text.substring(0, start);
        const selection = text.substring(start, end);
        const after = text.substring(end);

        const newText = before + prefix + selection + suffix + after;
        setDescription(newText);

        // Restore focus and selection
        setTimeout(() => {
            if (textareaRef.current) {
                textareaRef.current.focus();
                const newCursorPos = start + prefix.length + selection.length + suffix.length;
                textareaRef.current.setSelectionRange(newCursorPos, newCursorPos);
            }
        }, 0);
    };

    const handleSave = () => {
        if (onSave) {
            onSave({
                title,
                description,
                priority,
                status,
                assignee: assignee === 'unassigned' ? undefined : assignee
            });
        }
        onClose();
    };

    const handleDelete = () => {
        if (ticket) {
            actions.deleteTicket(ticket.id);
            setIsDeleteConfirmOpen(false);
            onClose();
        }
    };

    const getUserName = (id: string) => {
        if (id === 'unassigned') return 'Unassigned';
        return data.users.find(u => u.id === id)?.name || 'Unknown';
    };

    // Prevent closing when clicking inside the modal content
    const handleContentClick = (e: React.MouseEvent) => {
        e.stopPropagation();
    };

    return (
        <AnimatePresence>
            {isOpen && (
                <motion.div 
                    key="ticket-modal-overlay"
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    exit={{ opacity: 0 }}
                    transition={{ duration: 0.35 }}
                    className="fixed inset-0 z-50 flex items-center justify-center p-4"
                >
                    <div
                        className="fixed inset-0 bg-black/50 backdrop-blur-sm"
                        onClick={onClose}
                    />
                    <motion.div 
                        initial={{ opacity: 0, scale: 0.95, y: 20 }}
                        animate={{ opacity: 1, scale: 1, y: 0 }}
                        exit={{ opacity: 0, scale: 0.95, y: 20 }}
                        transition={{ 
                            duration: 0.35,
                            ease: [0.4, 0, 0.2, 1]
                        }}
                        className="bg-zinc-900 border border-white/10 rounded-xl shadow-2xl overflow-hidden text-zinc-100 font-sans antialiased max-w-4xl w-full flex flex-col h-[80vh] md:h-[600px] z-10"
                        onClick={handleContentClick}
                    >
                        {/* Header */}
                        <div className="h-14 border-b border-white/5 flex items-center justify-between px-6 shrink-0 bg-white/5">
                            <div className="flex items-center gap-3 text-zinc-400 text-sm">
                                {ticket && (
                                    <>
                                        <span className="font-mono text-zinc-500">
                                            {ticket.category ? ticket.category.charAt(0).toUpperCase() : 'T'}-{ticket.categoryNumber || ticket.id.substring(0, 4)}
                                        </span>
                                        <span className="w-1 h-1 rounded-full bg-zinc-600" />
                                    </>
                                )}
                                <div className="flex items-center gap-1.5 hover:text-zinc-200 transition-colors cursor-pointer">
                                   {!ticket && <span className="text-zinc-400 font-medium">New Ticket</span>}
                                   {ticket && (
                                        <>
                                            <div className="w-4 h-4 rounded bg-purple-500/20 text-purple-400 flex items-center justify-center text-[10px] font-bold">
                                                {ticket.category ? ticket.category.charAt(0).toUpperCase() : 'T'}
                                            </div>
                                            <span className="truncate max-w-[200px]">{title || 'Untitled Ticket'}</span>
                                        </>
                                   )}
                                </div>
                            </div>
                            <div className="flex items-center gap-2">
                                 <div className="mr-2">
                                     <Button size="sm" onClick={handleSave} className="h-8 text-xs bg-white text-black hover:bg-zinc-200">
                                         {ticket ? 'Save Changes' : 'Create Ticket'}
                                     </Button>
                                 </div>
                                <Button variant="ghost" size="icon" className="h-8 w-8 text-zinc-400 hover:text-white" onClick={onClose}>
                                    <X size={16} />
                                </Button>
                            </div>
                        </div>

                        {/* Body Layout */}
                        <div className="flex flex-1 overflow-hidden">
                            {/* Main Content (Left) */}
                            <div className="flex-1 flex flex-col overflow-hidden border-r border-white/5">
                                <div className="flex-1 overflow-y-auto p-8">
                                     {/* Title Input */}
                                    <input 
                                        type="text" 
                                        className="bg-transparent border-none text-2xl font-bold mb-6 text-white w-full focus:ring-0 p-0 placeholder:text-zinc-600 focus:outline-none"
                                        value={title}
                                        onChange={(e) => setTitle(e.target.value)}
                                        placeholder="Ticket Title"
                                        autoFocus={!ticket}
                                    />
                                    
                                    {/* Formatting Toolbar */}
                                    <div className="flex items-center gap-1 mb-2 p-1 bg-white/5 rounded-md w-fit border border-white/5 text-zinc-400">
                                         <Button variant="ghost" size="icon" className="h-6 w-6 text-zinc-400 hover:text-white hover:bg-white/10" title="Bold" onClick={() => insertMarkdown('**', '**')}>
                                            <Bold size={14} />
                                         </Button>
                                         <Button variant="ghost" size="icon" className="h-6 w-6 text-zinc-400 hover:text-white hover:bg-white/10" title="Italic" onClick={() => insertMarkdown('*', '*')}>
                                            <Italic size={14} />
                                         </Button>
                                         <div className="w-px h-3 bg-white/10 mx-1" />
                                         <Button variant="ghost" size="icon" className="h-6 w-6 text-zinc-400 hover:text-white hover:bg-white/10" title="Ordered List" onClick={() => insertMarkdown('1. ', '')}>
                                            <ListOrdered size={14} />
                                         </Button>
                                         <Button variant="ghost" size="icon" className="h-6 w-6 text-zinc-400 hover:text-white hover:bg-white/10" title="Bulleted List" onClick={() => insertMarkdown('- ', '')}>
                                            <List size={14} />
                                         </Button>
                                         <Button variant="ghost" size="icon" className="h-6 w-6 text-zinc-400 hover:text-white hover:bg-white/10" title="Checklist" onClick={() => insertMarkdown('- [ ] ', '')}>
                                            <CheckSquare size={14} />
                                         </Button>
                                         <div className="w-px h-3 bg-white/10 mx-1" />
                                         <Button variant="ghost" size="icon" className="h-6 w-6 text-zinc-400 hover:text-white hover:bg-white/10" title="Code Block" onClick={() => insertMarkdown('```\n', '\n```')}>
                                            <Code size={14} />
                                         </Button>
                                         <Button variant="ghost" size="icon" className="h-6 w-6 text-zinc-400 hover:text-white hover:bg-white/10" title="Link" onClick={() => insertMarkdown('[', '](url)')}>
                                            <Link size={14} />
                                         </Button>
                                    </div>

                                    {/* Description Textarea */}
                                    <textarea 
                                        ref={textareaRef}
                                        className="w-full h-[400px] bg-transparent border-none resize-none focus:ring-0 p-0 text-sm leading-relaxed text-zinc-300 font-mono focus:outline-none placeholder:text-zinc-600"
                                        value={description}
                                        onChange={(e) => setDescription(e.target.value)}
                                        placeholder="Add a description..."
                                    />

                                    {/* Activity Stream Mock - Only show for existing tickets */}
                                    {ticket && (
                                        <div className="mt-12 pt-8 border-t border-white/5">
                                            <h4 className="text-xs font-bold text-zinc-500 uppercase mb-4">Activity</h4>
                                            <div className="flex gap-3">
                                                <Avatar fallback={getUserName(ticket.assignee || 'unassigned').charAt(0).toUpperCase()} />
                                                <div className="space-y-1">
                                                    <div className="text-sm">
                                                        <span className="font-semibold text-white">{getUserName(ticket.assignee || 'unassigned')}</span>
                                                        <span className="text-zinc-500 ml-2">modified this issue</span>
                                                    </div>
                                                    <span className="text-xs text-zinc-600">{format(new Date(), 'MMM d, h:mm a')}</span>
                                                </div>
                                            </div>
                                        </div>
                                    )}
                                </div>
                            </div>

                            {/* Sidebar (Right) */}
                            <div className="w-72 bg-[#09090b] p-4 space-y-6 overflow-y-auto shrink-0 border-l border-white/5 flex flex-col">
                                
                                {/* Sprint Section */}
                                {ticket?.sprintId && (
                                    <div className="space-y-3">
                                        <div className="text-xs font-bold text-zinc-500 uppercase">Sprint</div>
                                        <div className="flex items-center gap-2 text-zinc-300 h-9 px-3 border border-white/5 rounded-md bg-white/5">
                                            <span className="truncate text-sm font-medium">
                                                {data.sprints.find(s => s.id === ticket.sprintId)?.name || 'Unknown Sprint'}
                                            </span>
                                        </div>
                                    </div>
                                )}

                                {/* Status Section */}
                                <div className="space-y-3">
                                    <div className="text-xs font-bold text-zinc-500 uppercase">State</div>
                                    <Select value={status} onValueChange={(val) => setStatus(val as TicketStatus)}>
                                        <SelectTrigger className="w-full bg-transparent border border-transparent hover:border-white/10 hover:bg-white/5 text-zinc-300 h-9">
                                            <SelectValue placeholder="Status">
                                                {status.split('_').map(word => word.charAt(0).toUpperCase() + word.slice(1)).join(' ')}
                                            </SelectValue>
                                        </SelectTrigger>
                                        <SelectContent>
                                            <SelectItem value="backlog">Backlog</SelectItem>
                                            <SelectItem value="todo">Todo</SelectItem>
                                            <SelectItem value="in_progress">In Progress</SelectItem>
                                            <SelectItem value="in_review">In Review</SelectItem>
                                            <SelectItem value="ready_for_qa">Ready for QA</SelectItem>
                                            <SelectItem value="done">Done</SelectItem>
                                            <SelectItem value="blocked">Blocked</SelectItem>
                                            <SelectItem value="shipped">Shipped</SelectItem>
                                        </SelectContent>
                                    </Select>
                                </div>

                                {/* Assignee Section */}
                                <div className="space-y-3">
                                    <div className="text-xs font-bold text-zinc-500 uppercase">Assignee</div>
                                    <Select value={assignee} onValueChange={setAssignee}>
                                        <SelectTrigger className="w-full bg-transparent border border-transparent hover:border-white/10 hover:bg-white/5 text-zinc-300 h-9">
                                            <div className="flex items-center gap-2">
                                                <Avatar fallback={getUserName(assignee).charAt(0) || 'U'} className="w-5 h-5 text-[9px]" />
                                                <span className="truncate">{getUserName(assignee)}</span>
                                            </div>
                                        </SelectTrigger>
                                        <SelectContent>
                                            <SelectItem value="unassigned">Unassigned</SelectItem>
                                            {data.users.map(u => (
                                                <SelectItem key={u.id} value={u.id}>{u.name}</SelectItem>
                                            ))}
                                        </SelectContent>
                                    </Select>
                                </div>

                                {/* Meta Data Grid */}
                                <div className="space-y-4 pt-4 border-t border-white/5">
                                    <div className="grid grid-cols-[80px_1fr] gap-2 items-center text-sm">
                                        <span className="text-zinc-500 text-xs">Priority</span>
                                        <Select value={priority} onValueChange={(val) => setPriority(val as Priority)}>
                                            <SelectTrigger className="h-8 border-none p-0 bg-transparent text-zinc-300 hover:bg-transparent shadow-none w-fit focus:ring-0">
                                                <div className="flex items-center gap-2">
                                                    <ArrowUpRight size={14} className={priority === 'critical' || priority === 'high' ? 'text-red-500' : 'text-zinc-500'} />
                                                    <span className="capitalize">{priority}</span>
                                                </div>
                                            </SelectTrigger>
                                            <SelectContent>
                                                <SelectItem value="low">Low</SelectItem>
                                                <SelectItem value="medium">Medium</SelectItem>
                                                <SelectItem value="high">High</SelectItem>
                                                <SelectItem value="critical">Critical</SelectItem>
                                            </SelectContent>
                                        </Select>
                                    </div>

                                    <div className="grid grid-cols-[80px_1fr] gap-2 items-center text-sm">
                                        <span className="text-zinc-500 text-xs">Labels</span>
                                        <div className="flex flex-wrap gap-1">
                                            <span className="px-1.5 py-0.5 bg-blue-500/10 text-blue-400 rounded text-[10px] border border-blue-500/20">Backend</span>
                                            <span className="px-1.5 py-0.5 bg-pink-500/10 text-pink-400 rounded text-[10px] border border-pink-500/20">API</span>
                                        </div>
                                    </div>
                                </div>

                                {/* Dates - Only if existing ticket */}
                                {ticket && (
                                     <div className="space-y-4 pt-4 border-t border-white/5">
                                        <div className="flex items-center gap-2 text-xs text-zinc-500">
                                            <Calendar size={12} />
                                            <span>Created {format(ticket.createdAt || Date.now(), 'MMM d')}</span>
                                        </div>
                                        <div className="flex items-center gap-2 text-xs text-zinc-500">
                                            <Clock size={12} />
                                            <span>Updated recently</span>
                                        </div>
                                     </div>
                                )}

                                {/* Delete Button */}
                                {ticket && (
                                    <div className="pt-4 border-t border-white/5 mt-auto">
                                        <Button 
                                            variant="ghost" 
                                            className="w-full justify-start text-red-500 hover:text-red-400 hover:bg-red-500/10 gap-2 h-8 text-xs"
                                            onClick={() => setIsDeleteConfirmOpen(true)}
                                        >
                                            <Trash2 size={12} />
                                            Delete Ticket
                                        </Button>
                                    </div>
                                )}
                            </div>
                        </div>
                    </motion.div>
                </motion.div>
            )}
            
            <ConfirmDialog 
                isOpen={isDeleteConfirmOpen}
                onClose={() => setIsDeleteConfirmOpen(false)}
                onConfirm={handleDelete}
                title="Delete Ticket"
                description="Are you sure you want to delete this ticket? This action cannot be undone."
                variant="danger"
                confirmText="Delete Ticket"
            />
        </AnimatePresence>
    );
};


