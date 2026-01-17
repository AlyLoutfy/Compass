import React, { useState, useEffect } from 'react';
import { createPortal } from 'react-dom';
import { Bug } from '@/types';
import { Button } from '@/components/ui/Button';
import { 
    AlertTriangle, Monitor, Layout, Pencil, Rocket, Paperclip, MessageSquare, ChevronRight, Tag
} from 'lucide-react';
import { useData } from '@/context/DataContext';
import { cn } from '@/lib/utils';
import { motion, AnimatePresence } from 'framer-motion';
// Note: We are using a fixed overlay style instead of the generic Modal component to strictly enforce the design dimensions and aesthetic

interface BugViewModalProps {
    isOpen: boolean;
    onClose: () => void;
    bug: Bug | null;
    onEdit: (bug: Bug) => void;
}

export const BugViewModal: React.FC<BugViewModalProps> = ({ isOpen, onClose, bug, onEdit }) => {
    const { data } = useData();
    const [isChatOpen, setIsChatOpen] = useState(true);
    // Mock comments exist for design purposes, in real app derives from bug.comments
    const hasComments = true; 

    // Close on Escape
    useEffect(() => {
        const handleEscape = (e: KeyboardEvent) => {
            if (e.key === 'Escape') onClose();
        };
        if (isOpen) window.addEventListener('keydown', handleEscape);
        return () => window.removeEventListener('keydown', handleEscape);
    }, [isOpen, onClose]);

    if (!bug) return null;

    // Helpers
    const reporter = data.users.find(u => u.id === bug.reportedBy || u.name === bug.reportedBy);
    const assignee = data.users.find(u => u.id === bug.assignee);
    const steps = bug.stepsToReproduce ? bug.stepsToReproduce.split('\n') : [];

    // Severity Dots
    const getSeverityDot = (sev: string) => {
        switch(sev) {
             case 'critical': case 'blocker': return 'bg-red-500';
             case 'major': return 'bg-orange-500';
             case 'minor': return 'bg-blue-500';
             default: return 'bg-zinc-500';
        }
    };

    const modalContent = (
        <>

            {/* Modal Container - Design 3A */}
                <motion.div 
                    initial={{ opacity: 0, scale: 0.95, y: 10 }}
                    animate={{ opacity: 1, scale: 1, y: 0 }}
                    exit={{ opacity: 0, scale: 0.95, y: 10 }}
                    transition={{ duration: 0.2, ease: "easeOut" }}
                    className={cn(
                        "relative bg-zinc-950 border border-zinc-800 rounded-lg shadow-2xl text-zinc-200 flex overflow-hidden transition-all duration-500 ease-in-out h-[85vh] max-h-[800px]",
                        isChatOpen ? "w-[1200px]" : "w-[900px]"
                    )}
                    onClick={(e) => e.stopPropagation()}
                >
                {/* Col 1: Meta (220px) - Fixed Left */}
                <div className="w-[220px] bg-zinc-900/40 p-6 border-r border-zinc-800 flex-shrink-0 flex flex-col gap-8">
                     {/* ID Badge */}
                     <div className="flex items-center justify-between">
                         <span className="px-2 py-1 rounded text-xs font-bold bg-zinc-800 text-zinc-400 border border-zinc-700 font-mono tracking-wider">Bug {bug.id.replace('bug', '')}</span>
                     </div>
                     
                     <div className="space-y-6">
                         <div>
                             <span className="text-[10px] uppercase tracking-wider text-zinc-500 font-bold block mb-2">Status</span>
                             <div className="flex items-center gap-2">
                                <span className={cn("w-2 h-2 rounded-full", 
                                    bug.status === 'todo' ? "bg-zinc-500" :
                                    bug.status === 'in_progress' ? "bg-blue-500" :
                                    bug.status === 'in_review' ? "bg-purple-500" :
                                    bug.status === 'ready_for_qa' ? "bg-yellow-500" :
                                    bug.status === 'resolved' ? "bg-green-500" :
                                    bug.status === 'blocked' ? "bg-red-500" : "bg-zinc-500"
                                )}></span>
                                <span className="text-sm text-zinc-300 capitalize font-medium">{bug.status.replace('_', ' ')}</span>
                             </div>
                         </div>

                         <div>
                             <span className="text-[10px] uppercase tracking-wider text-zinc-500 font-bold block mb-2">Priority</span>
                             <div className="flex items-center gap-2">
                                 <span className={cn("w-2 h-2 rounded shadow-[0_0_8px] shadow-current opacity-80", getSeverityDot(bug.severity))}></span>
                                 <span className="text-sm text-zinc-300 capitalize font-medium">{bug.severity}</span>
                             </div>
                         </div>
                         
                         <div>
                             <span className="text-[10px] uppercase tracking-wider text-zinc-500 font-bold block mb-2">Assignee</span>
                             <div className="flex items-center gap-3 bg-zinc-900/50 p-2 rounded -ml-2 border border-transparent hover:border-zinc-800 transition-colors">
                                  {assignee ? (
                                     <>
                                        <img src={assignee.avatar} className="w-6 h-6 rounded-full bg-zinc-800 object-cover" alt={assignee.name} />
                                        <span className="text-sm text-zinc-300 truncate">{assignee.name}</span>
                                     </>
                                  ) : (
                                     <>
                                        <div className="w-6 h-6 rounded-full bg-zinc-800 flex items-center justify-center text-[10px] text-zinc-500">?</div>
                                        <span className="text-sm text-zinc-500 italic">Unassigned</span>
                                     </>
                                  )}
                             </div>
                         </div>

                         <div>
                             <span className="text-[10px] uppercase tracking-wider text-zinc-500 font-bold block mb-2">Reporter</span>
                             <div className="flex items-center gap-3 p-2 -ml-2">
                                  {reporter ? (
                                     <>
                                        <img src={reporter.avatar} className="w-6 h-6 rounded-full bg-zinc-800 object-cover grayscale opacity-70" alt={reporter ? reporter.name : ''} />
                                        <span className="text-sm text-zinc-400 truncate">{reporter ? reporter.name : bug.reportedBy}</span>
                                     </>
                                  ) : (
                                      <span className="text-sm text-zinc-400">{bug.reportedBy}</span>
                                  )}
                             </div>
                         </div>
                     </div>

                     <div className="mt-auto pt-6 border-t border-zinc-800 space-y-2">
                        <Button variant="outline" className="w-full justify-start text-zinc-400 hover:text-zinc-200 hover:bg-zinc-800 border-zinc-800 h-9 text-xs" onClick={() => { onClose(); onEdit(bug); }}>
                            <Pencil size={12} className="mr-2" /> Edit Bug
                        </Button>
                        <Button variant="ghost" className="w-full justify-start text-zinc-500 hover:text-zinc-300 hover:bg-zinc-800 h-9 text-xs" onClick={onClose}>
                            Close
                        </Button>
                     </div>
                </div>

                {/* Col 2: Content (Fluid) */}
                <div className="flex-1 flex flex-col min-w-0 bg-zinc-950/50 relative">
                     {/* Header with optional Chat Toggle */}
                     <div className="flex items-center justify-between p-6 pb-4 border-b border-zinc-800/50 min-h-[100px]">
                        <div className="pr-4">
                             <div className="flex gap-2 items-center text-xs text-zinc-500 mb-1">
                                <span className="flex items-center gap-1 uppercase tracking-wider font-bold">
                                    <Monitor size={12} /> {bug.platform}
                                </span>
                                <span>•</span>
                                <span className="flex items-center gap-1 uppercase tracking-wider font-bold">
                                    <Layout size={12} /> {bug.layer || 'General'}
                                </span>
                             </div>
                             <h1 className="text-xl md:text-2xl font-medium leading-tight text-zinc-100">{bug.title}</h1>
                        </div>
                        
                        {!isChatOpen && (
                            <button 
                                onClick={() => setIsChatOpen(true)}
                                className="flex items-center gap-2 px-4 py-2 rounded-full bg-zinc-900 border border-zinc-800 text-xs font-medium text-zinc-400 hover:text-zinc-200 hover:border-zinc-700 transition-all whitespace-nowrap group shrink-0"
                            >
                                <MessageSquare size={14} className="group-hover:text-blue-400 transition-colors" />
                                {hasComments ? "View Discussion" : "Add Comment"}
                            </button>
                        )}
                     </div>

                     <div className="flex-1 p-8 space-y-10 overflow-y-auto">
                         <div className="space-y-3">
                             <h3 className="text-xs font-bold text-zinc-500 uppercase flex items-center gap-2">
                                <Tag size={14} /> Description
                             </h3>
                             <p className="text-sm text-zinc-300 leading-7 whitespace-pre-wrap max-w-3xl">
                                {bug.description}
                             </p>
                         </div>

                         {steps.length > 0 && (
                            <div className="space-y-3">
                                <h3 className="text-xs font-bold text-zinc-500 uppercase">Steps to Reproduce</h3>
                                <ul className="list-decimal pl-5 space-y-2 text-sm text-zinc-400 marker:text-zinc-600">
                                    {steps.map((step, i) => <li key={i} className="pl-1">{step}</li>)}
                                </ul>
                            </div>
                         )}

                         {bug.screenshots && bug.screenshots.length > 0 && (
                             <div className="space-y-3">
                                 <h3 className="text-xs font-bold text-zinc-500 uppercase">Attachments</h3>
                                 <div className="flex flex-wrap gap-4">
                                     {bug.screenshots.map((s, i) => (
                                         <div key={i} className="w-48 h-32 bg-zinc-900 rounded-md border border-zinc-800 overflow-hidden group cursor-zoom-in relative">
                                             <img src={s} className="w-full h-full object-cover opacity-80 group-hover:opacity-100 transition-opacity" />
                                             <div className="absolute inset-0 ring-1 ring-inset ring-white/10 rounded-md"></div>
                                         </div>
                                     ))}
                                 </div>
                             </div>
                         )}
                     </div>
                </div>

                {/* Col 3: Chat (Collapsible) */}
                {isChatOpen && (
                    <div className="w-[360px] bg-zinc-900/20 flex flex-col border-l border-zinc-800 animate-in slide-in-from-right-10 duration-300 relative z-10 backdrop-blur-sm">
                         <div className="h-16 border-b border-zinc-800 flex items-center px-5 justify-between bg-zinc-900/40">
                             <span className="text-xs font-bold text-zinc-400 uppercase tracking-wider flex items-center gap-2">
                                <MessageSquare size={14}/> Discussion
                             </span>
                             <div className="flex items-center gap-3">
                                 <span className="text-[10px] bg-zinc-800 text-zinc-500 px-2 py-0.5 rounded-full border border-zinc-700/50">3</span>
                                 <button onClick={() => setIsChatOpen(false)} className="text-zinc-500 hover:text-zinc-300 p-1 hover:bg-zinc-800 rounded">
                                     <div className="rotate-180"><ChevronRight size={18} /></div>
                                 </button>
                             </div>
                         </div>
                         
                         <div className="flex-1 p-5 overflow-y-auto space-y-6">
                              {/* Messages (Mock for now, as Bug type doesn't support comments yet) */}
                              <div className="flex gap-3 group">
                                    <div className="w-8 h-8 rounded-full bg-blue-900/30 text-blue-400 border border-blue-500/20 flex items-center justify-center text-xs font-medium shrink-0 mt-0.5 shadow-sm">
                                        SD
                                    </div>
                                    <div className="space-y-1.5 max-w-[85%]">
                                        <div className="flex items-baseline gap-2">
                                            <span className="text-xs font-bold text-zinc-300">Sarah Dev</span>
                                            <span className="text-[10px] text-zinc-600">Yesterday 10:42 AM</span>
                                        </div>
                                        <div className="text-sm text-zinc-400 bg-zinc-900/50 p-3 rounded-lg rounded-tl-none border border-zinc-800/50">
                                            I reproduced this on iOS 17.2 using the steps provided. It seems to be a z-index issue.
                                        </div>
                                    </div>
                              </div>
                              
                              <div className="relative pl-4 border-l-2 border-zinc-800 ml-4 py-1">
                                  <div className="text-[11px] text-zinc-500 flex items-center gap-2">
                                     <AlertTriangle size={10} className="text-orange-500"/>
                                     <span>Priority changed to <span className="text-orange-500 font-medium">Critical</span> by Sarah Dev</span>
                                  </div>
                              </div>

                              <div className="flex gap-3 flex-row-reverse group">
                                    <div className="w-8 h-8 rounded-full bg-emerald-900/30 text-emerald-400 border border-emerald-500/20 flex items-center justify-center text-xs font-medium shrink-0 mt-0.5 shadow-sm">
                                        Me
                                    </div>
                                    <div className="space-y-1.5 max-w-[85%] flex flex-col items-end">
                                        <div className="flex items-baseline gap-2 flex-row-reverse">
                                            <span className="text-xs font-bold text-zinc-300">You</span>
                                            <span className="text-[10px] text-zinc-600">Today 9:15 AM</span>
                                        </div>
                                        <div className="text-sm text-zinc-200 bg-zinc-800 p-3 rounded-lg rounded-tr-none border border-zinc-700/50 shadow-sm text-left">
                                            Thanks for checking. I'll take a look at the z-index configurations in the header.
                                        </div>
                                        <span className="text-[10px] text-zinc-600">Seen</span>
                                    </div>
                              </div>
                         </div>
            
                         <div className="p-4 border-t border-zinc-800 bg-zinc-900/40 backdrop-blur-md">
                             <div className="relative group">
                                 <input 
                                     className="w-full bg-zinc-950/50 border border-zinc-800 rounded-xl pl-4 pr-10 py-3 text-sm focus:outline-none focus:ring-1 focus:ring-zinc-700 focus:border-zinc-700 text-zinc-300 placeholder:text-zinc-600 transition-all shadow-inner" 
                                     placeholder="Type a message or /command..." 
                                 />
                                 <div className="absolute right-2 top-2 flex items-center gap-1">
                                     <button className="p-1.5 text-zinc-600 hover:text-zinc-400 transition-colors">
                                        <Paperclip size={16} />
                                     </button>
                                     <button className="p-1.5 bg-blue-600/10 text-blue-500 hover:bg-blue-600 hover:text-white rounded-lg transition-colors">
                                        <Rocket size={16} className="" />
                                     </button>
                                 </div>
                             </div>
                         </div>
                    </div>
                )}
                </motion.div>
        </>
    );



    return createPortal(
        <AnimatePresence>
            {isOpen && (
                <motion.div 
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    exit={{ opacity: 0 }}
                    transition={{ duration: 0.2 }}
                    className="fixed inset-0 z-[100] flex items-center justify-center p-4 bg-black/60 backdrop-blur-[2px]"
                >
                     {/* Click outside listener */}
                     <div className="absolute inset-0" onClick={onClose} />
                     
                     {modalContent}
                </motion.div>
            )}
        </AnimatePresence>
    , document.body);
};


