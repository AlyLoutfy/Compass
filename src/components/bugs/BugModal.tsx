import React, { useState, useRef, useEffect } from 'react';
import { cn } from '@/lib/utils';
import { useData } from '@/context/DataContext';
import { Bug, BugSeverity } from '@/types';
import { Button } from '@/components/ui/Button';
import { Modal } from '@/components/ui/Modal';
import { Input } from '@/components/ui/Input';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/Select';
import { ArrowRight, X, Paintbrush, Plus, XCircle, AlertCircle, AlertTriangle, MinusCircle } from 'lucide-react';

const getSeverityIcon = (severity: BugSeverity) => {
    switch (severity) {
        case 'blocker': return <XCircle size={14} />;
        case 'critical': return <AlertCircle size={14} />;
        case 'major': return <AlertTriangle size={14} />;
        case 'minor': return <MinusCircle size={14} />;
        case 'cosmetic': return <Paintbrush size={14} />;
        default: return <AlertCircle size={14} />;
    }
};

export const BugModal = ({ isOpen, onClose, initialData, initialTab = 'details' }: { isOpen: boolean, onClose: () => void, initialData: Bug | null, initialTab?: 'details' | 'repro' | 'comments' }) => {
    const { data, actions } = useData();
    const [formData, setFormData] = useState<Partial<Bug>>({});
    
    // Screenshot Preview State
    const [previewImage, setPreviewImage] = useState<string | null>(null);
    const hoverTimeoutRef = useRef<NodeJS.Timeout | null>(null);
    const fileInputRef = useRef<HTMLInputElement>(null);

    useEffect(() => {
        if (isOpen) {
            if (initialData) {
                setFormData({ ...initialData, screenshots: initialData.screenshots || [] });
            } else {
                setFormData({
                    title: '',
                    description: '',
                    severity: 'major',
                    priority: 'medium',
                    status: 'todo',
                    platform: 'all',
                    layer: 'frontend',
                    stepsToReproduce: '',
                    expectedResult: '',
                    actualResult: '',
                    reportedBy: 'User', // Current user fallback
                    assignee: '',
                    comments: [],
                    screenshots: []
                });
            }
        }
    }, [isOpen, initialData, initialTab]);

    const handleFiles = (files: FileList | null) => {
        if (!files) return;
        Array.from(files).forEach(file => {
            if (file.type.startsWith('image/')) {
                const reader = new FileReader();
                reader.onloadend = () => {
                    setFormData(prev => ({
                        ...prev,
                        screenshots: [...(prev.screenshots || []), reader.result as string]
                    }));
                };
                reader.readAsDataURL(file);
            }
        });
    };

    const handleDrop = (e: React.DragEvent) => {
        e.preventDefault();
        e.stopPropagation();
        handleFiles(e.dataTransfer.files);
    };

    const handleDragOver = (e: React.DragEvent) => {
        e.preventDefault();
        e.stopPropagation();
    };

    const removeScreenshot = (index: number) => {
        setFormData(prev => ({
            ...prev,
            screenshots: prev.screenshots?.filter((_, i) => i !== index)
        }));
    };

    const handleMouseEnter = (src: string) => {
        if (hoverTimeoutRef.current) clearTimeout(hoverTimeoutRef.current);
        hoverTimeoutRef.current = setTimeout(() => {
            setPreviewImage(src);
        }, 1500); // 1.5s delay
    };

    const handleMouseLeave = () => {
        if (hoverTimeoutRef.current) clearTimeout(hoverTimeoutRef.current);
    };

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        if (initialData) {
            actions.updateBug(initialData.id, formData);
        } else {
            actions.addBug(formData as Bug);
        }
        onClose();
    };

    return (
        <Modal 
            isOpen={isOpen} 
            onClose={onClose} 
            title={null} 
            noPadding 
            className="max-w-4xl w-full bg-transparent shadow-none border-none p-0 overflow-hidden rounded-xl"
            hideCloseButton
        >
            <form onSubmit={handleSubmit}>
                <div className="w-full bg-white dark:bg-zinc-950 rounded-xl shadow-2xl border border-zinc-200 dark:border-zinc-800 overflow-hidden flex h-[550px]">
                     {/* Left: The Issue (Content) */}
                     <div className="w-1/2 p-8 flex flex-col border-r border-zinc-100 dark:border-zinc-800 relative">
                         {/* Close button for mobile/safety if needed, but per design we have buttons elsewhere or click outside. 
                             Adding a small absolute close for UX */}
                         <button 
                             type="button"
                             onClick={onClose}
                             className="absolute left-4 top-4 p-2 rounded-full hover:bg-zinc-100 dark:hover:bg-zinc-800 text-zinc-400 transition-colors md:hidden"
                         >
                             <ArrowRight className="rotate-180" size={20} />
                         </button>

                         <h3 className="font-bold text-2xl mb-6">{initialData ? 'Edit Issue' : 'Log an issue'}</h3>
                         
                         <div className="flex-1 flex flex-col gap-6 overflow-y-auto pr-2 pb-4">
                             <div className="space-y-1.5 pl-1">
                                 <label className="text-xs font-medium opacity-70">Subject</label>
                                 <Input 
                                     className="h-10 text-sm px-4" 
                                     placeholder="Issue Subject" 
                                     value={formData.title} 
                                     onChange={e => setFormData({ ...formData, title: e.target.value })}
                                     required
                                 />
                             </div>
                             
                             <div className="flex flex-col w-full pl-1">
                                 <label className="text-xs font-medium opacity-70 mb-1.5">Description</label>
                                 <textarea 
                                    className="w-full rounded-md border border-zinc-200 dark:border-zinc-800 px-4 py-3 text-sm shadow-sm bg-transparent outline-none resize-y focus:ring-2 focus:ring-black/5 dark:focus:ring-white/10 min-h-[160px]"
                                    placeholder="Provide a detailed description of the issue.&#10;&#10;Steps to reproduce:&#10;1. Go to...&#10;2. Click on..." 
                                    value={formData.description}
                                    onChange={e => setFormData({ ...formData, description: e.target.value })}
                                    required
                                 />
                             </div>

                             <div>
                                 <input 
                                    type="file" 
                                    ref={fileInputRef} 
                                    className="hidden" 
                                    multiple 
                                    accept="image/*"
                                    onChange={(e) => handleFiles(e.target.files)}
                                 />
                                 
                                 {(!formData.screenshots || formData.screenshots.length === 0) ? (
                                    <div 
                                        className="w-full border-2 border-dashed border-zinc-200 dark:border-zinc-800 rounded-lg h-24 flex flex-col items-center justify-center gap-2 text-zinc-400 hover:bg-zinc-50 dark:hover:bg-zinc-900 transition-colors cursor-pointer group"
                                        onClick={() => fileInputRef.current?.click()}
                                        onDrop={handleDrop}
                                        onDragOver={handleDragOver}
                                    >
                                         <div className="p-1.5 bg-zinc-100 dark:bg-zinc-800 rounded-full group-hover:scale-110 transition-transform">
                                              <Paintbrush size={16} /> 
                                         </div>
                                         <span className="text-xs font-medium">Drop screenshots or click to browse</span>
                                     </div>
                                 ) : (
                                     <div className="grid grid-cols-5 gap-3">
                                         {formData.screenshots.map((src, idx) => (
                                             <div 
                                                key={idx} 
                                                className="relative aspect-square rounded-lg border border-zinc-200 dark:border-zinc-800 overflow-hidden group/item cursor-pointer"
                                                onMouseEnter={() => handleMouseEnter(src)}
                                                onMouseLeave={handleMouseLeave}
                                                onClick={() => setPreviewImage(src)}
                                             >
                                                 <img src={src} alt={`Screenshot ${idx + 1}`} className="w-full h-full object-cover" />
                                                 <button 
                                                    type="button"
                                                    onClick={(e) => {
                                                        e.stopPropagation();
                                                        removeScreenshot(idx);
                                                    }}
                                                    className="absolute top-1 right-1 p-0.5 bg-black/50 text-white rounded-full opacity-0 group-hover/item:opacity-100 transition-opacity hover:bg-black/70"
                                                 >
                                                     <X size={12} />
                                                 </button>
                                             </div>
                                         ))}
                                         
                                         <div 
                                            className="aspect-square rounded-lg border-2 border-dashed border-zinc-200 dark:border-zinc-800 flex items-center justify-center text-zinc-400 hover:bg-zinc-50 dark:hover:bg-zinc-900 hover:text-zinc-600 dark:hover:text-zinc-300 transition-colors cursor-pointer"
                                            onClick={() => fileInputRef.current?.click()}
                                            onDrop={handleDrop}
                                            onDragOver={handleDragOver}
                                         >
                                             <Plus size={24} strokeWidth={1.5} />
                                         </div>
                                     </div>
                                 )}
                             </div>
                         </div>
                     </div>

                     {/* Right: Ticket Properties (Metadata) */}
                     <div className="w-1/2 bg-zinc-50 dark:bg-zinc-900/50 p-8 flex flex-col relative">
                         <button 
                             type="button"
                             onClick={onClose}
                             className="absolute right-4 top-4 p-2 rounded-full hover:bg-zinc-200 dark:hover:bg-zinc-800 text-zinc-400 transition-colors"
                         >
                             <div className="sr-only">Close</div>
                             <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M18 6 6 18"/><path d="m6 6 12 12"/></svg>
                         </button>

                         <div className="flex items-center gap-2 mb-6">
                             <div className="w-2 h-2 rounded-full bg-blue-500 animate-pulse" />
                             <span className="text-xs font-bold uppercase text-zinc-500">Ticket Properties</span>
                         </div>

                         <div className="space-y-6 flex-1 overflow-y-auto pr-2">
                             <div className="grid grid-cols-2 gap-4">
                                 <div className="space-y-1.5 pl-1">
                                     <label className="text-xs font-medium opacity-70">Platform</label>
                                     <Select value={formData.platform || 'all'} onValueChange={v => setFormData({...formData, platform: v as any})}>
                                         <SelectTrigger className="bg-white dark:bg-zinc-900 px-4 capitalize h-9">
                                            <SelectValue>
                                                {formData.platform === 'all' ? 'All Platforms' : undefined}
                                            </SelectValue>
                                         </SelectTrigger>
                                         <SelectContent>
                                             <SelectItem value="all">All Platforms</SelectItem>
                                             <SelectItem value="desktop">Desktop</SelectItem>
                                             <SelectItem value="mobile">Mobile</SelectItem>
                                         </SelectContent>
                                     </Select>
                                 </div>
                                 <div className="space-y-1.5 pl-1">
                                     <label className="text-xs font-medium opacity-70">Assign To</label>
                                     <Select value={formData.assignee || "unassigned"} onValueChange={v => setFormData({...formData, assignee: v === "unassigned" ? undefined : v})}>
                                         <SelectTrigger className="bg-transparent bg-white dark:bg-zinc-900 px-4 capitalize h-9">
                                             <SelectValue placeholder="Unassigned" />
                                         </SelectTrigger>
                                         <SelectContent>
                                             <SelectItem value="unassigned">Unassigned</SelectItem>
                                             {data.users.map(u => (
                                                 <SelectItem key={u.id} value={u.id}>{u.name}</SelectItem>
                                             ))}
                                         </SelectContent>
                                     </Select>
                                 </div>
                             </div>

                             <div className="space-y-2 w-full pl-1">
                                <label className="text-xs font-medium opacity-70">Severity</label>
                                <div className="grid grid-cols-1 gap-1.5">
                                    {(['blocker', 'critical', 'major', 'minor', 'cosmetic'] as const).map((sev) => {
                                        const isSelected = formData.severity === sev;
                                        
                                        const styleConfig = {
                                            blocker: "bg-red-500/10 text-red-600 dark:text-red-400 border-red-500/20",
                                            critical: "bg-orange-500/10 text-orange-600 dark:text-orange-400 border-orange-500/20",
                                            major: "bg-yellow-500/10 text-yellow-600 dark:text-yellow-400 border-yellow-500/20",
                                            minor: "bg-blue-500/10 text-blue-600 dark:text-blue-400 border-blue-500/20",
                                            cosmetic: "bg-purple-500/10 text-purple-600 dark:text-purple-400 border-purple-500/20"
                                        };

                                        return (
                                            <div 
                                                key={sev}
                                                onClick={() => setFormData({ ...formData, severity: sev })}
                                                className={cn(
                                                    "flex items-center gap-3 px-3 py-2 rounded-md border cursor-pointer transition-all",
                                                    isSelected 
                                                        ? styleConfig[sev]
                                                        : "border-transparent hover:bg-white/50 dark:hover:bg-zinc-800/50 opacity-70 hover:opacity-100 text-zinc-500"
                                                )}
                                            >
                                                <div className={cn(
                                                    isSelected ? "text-current" : cn(
                                                        sev === 'blocker' && "text-red-600",
                                                        sev === 'critical' && "text-orange-600",
                                                        sev === 'major' && "text-yellow-600",
                                                        sev === 'minor' && "text-blue-600",
                                                        sev === 'cosmetic' && "text-purple-600"
                                                    )
                                                )}>
                                                    {getSeverityIcon(sev)}
                                                </div>
                                                <span className="text-sm font-medium capitalize">{sev}</span>
                                                {isSelected && <div className="ml-auto w-1.5 h-1.5 rounded-full bg-current" />}
                                            </div>
                                        );
                                    })}
                                </div>
                             </div>
                         </div>
                         
                         <div className="mt-6 pt-6 flex justify-end gap-3">
                              <Button type="button" variant="ghost" onClick={onClose} className="hover:bg-zinc-200 dark:hover:bg-zinc-800">
                                  Cancel
                              </Button>
                              <Button type="submit" className="rounded-full px-8 bg-zinc-900 dark:bg-white text-white dark:text-black hover:opacity-90">
                                  {initialData ? 'Save Changes' : 'Submit Issue'}
                              </Button>
                         </div>
                     </div>
                </div>
            </form>

            {/* Full Screen Image Preview Overlay */}
            {previewImage && (
                <div 
                    className="fixed inset-0 z-[60] bg-black/80 flex items-center justify-center p-8 backdrop-blur-sm"
                    onClick={() => setPreviewImage(null)}
                >
                    <div className="relative max-w-full max-h-full">
                        <img 
                            src={previewImage} 
                            alt="Preview" 
                            className="max-w-full max-h-[90vh] rounded-lg shadow-2xl object-contain"
                        />
                        <button 
                            className="absolute -top-12 right-0 text-white hover:text-zinc-300 transition-colors"
                            onClick={() => setPreviewImage(null)}
                        >
                            <X size={24} />
                            <span className="sr-only">Close Preview</span>
                        </button>
                    </div>
                </div>
            )}
        </Modal>
    );
};
