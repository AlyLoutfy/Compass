import { useState } from 'react';
import { cn } from '@/lib/utils';
import { 
    X, ChevronDown, User, Calendar, Tag,  
    MoreHorizontal, ArrowUpRight, Clock, 
    Eye, Edit2, Bold, Italic, ListOrdered, List, CheckSquare, Code, Link
} from 'lucide-react';
import { Button } from '@/components/ui/Button';

// --- MOCK MARKDOWN CONTENT ---
const MOCK_CONTENT = `
# API Rate Limiting

We need to implement rate limiting to prevent abuse of our public API endpoints.

## Requirements
- Limit requests to **100 per minute** per IP address.
- Return \`429 Too Many Requests\` status code when limit is exceeded.
- Include \`Retry-After\` header in the response.

### Implementation Details
We should use a Redis-based sliding window algorithm. This will ensure accuracy and performance.

\`\`\`typescript
const rateLimit = (ip: string) => {
  // Check Redis for current count
  // ...
}
\`\`\`

> Note: Make sure to whitelist internal services.
`;

// --- SHARED COMPONENTS ---

const Avatar = ({ fallback, className }: { fallback: string, className?: string }) => (
    <div className={cn("w-6 h-6 rounded-full bg-gradient-to-br from-indigo-500 to-purple-600 flex items-center justify-center text-[10px] text-white font-bold shrink-0", className)}>
        {fallback}
    </div>
);

// --- VARIANT 1: LINEAR CLASSIC (Modal with Sidebar) ---

const LinearClassic = () => {
    // Mock editor state
    const [description, setDescription] = useState(MOCK_CONTENT);

    return (
        <div className="bg-zinc-900 border border-white/10 rounded-xl shadow-2xl overflow-hidden text-zinc-100 font-sans antialiased max-w-4xl w-full mx-auto flex flex-col h-[600px]">
            {/* Header */}
            <div className="h-14 border-b border-white/5 flex items-center justify-between px-6 shrink-0 bg-white/5">
                <div className="flex items-center gap-3 text-zinc-400 text-sm">
                    <span className="font-mono text-zinc-500">PRO-123</span>
                    <span className="w-1 h-1 rounded-full bg-zinc-600" />
                    <div className="flex items-center gap-1.5 hover:text-zinc-200 transition-colors cursor-pointer">
                        <div className="w-4 h-4 rounded bg-purple-500/20 text-purple-400 flex items-center justify-center text-[10px] font-bold">P</div>
                        <span className="truncate max-w-[200px]">API Rate Limiting</span>
                    </div>
                </div>
                <div className="flex items-center gap-2">
                    <Button variant="ghost" size="icon" className="h-8 w-8 text-zinc-400 hover:text-white">
                        <MoreHorizontal size={16} />
                    </Button>
                    <Button variant="ghost" size="icon" className="h-8 w-8 text-zinc-400 hover:text-white">
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
                            className="bg-transparent border-none text-2xl font-bold mb-6 text-white w-full focus:ring-0 p-0 placeholder:text-zinc-600"
                            defaultValue="Add rate limiting to API"
                            placeholder="Ticket Title"
                        />
                        
                        {/* Formatting Toolbar */}
                        <div className="flex items-center gap-1 mb-2 p-1 bg-white/5 rounded-md w-fit border border-white/5 text-zinc-400">
                             <Button variant="ghost" size="icon" className="h-6 w-6 text-zinc-400 hover:text-white hover:bg-white/10">
                                <Bold size={14} />
                             </Button>
                             <Button variant="ghost" size="icon" className="h-6 w-6 text-zinc-400 hover:text-white hover:bg-white/10">
                                <Italic size={14} />
                             </Button>
                             <div className="w-px h-3 bg-white/10 mx-1" />
                             <Button variant="ghost" size="icon" className="h-6 w-6 text-zinc-400 hover:text-white hover:bg-white/10">
                                <ListOrdered size={14} />
                             </Button>
                             <Button variant="ghost" size="icon" className="h-6 w-6 text-zinc-400 hover:text-white hover:bg-white/10">
                                <List size={14} />
                             </Button>
                             <Button variant="ghost" size="icon" className="h-6 w-6 text-zinc-400 hover:text-white hover:bg-white/10">
                                <CheckSquare size={14} />
                             </Button>
                             <div className="w-px h-3 bg-white/10 mx-1" />
                             <Button variant="ghost" size="icon" className="h-6 w-6 text-zinc-400 hover:text-white hover:bg-white/10">
                                <Code size={14} />
                             </Button>
                             <Button variant="ghost" size="icon" className="h-6 w-6 text-zinc-400 hover:text-white hover:bg-white/10">
                                <Link size={14} />
                             </Button>
                        </div>

                        {/* Description Textarea */}
                        <textarea 
                            className="w-full h-[400px] bg-transparent border-none resize-none focus:ring-0 p-0 text-sm leading-relaxed text-zinc-300 font-mono"
                            value={description}
                            onChange={(e) => setDescription(e.target.value)}
                            placeholder="Add a description..."
                        />

                        {/* Activity Stream Mock */}
                        <div className="mt-12 pt-8 border-t border-white/5">
                            <h4 className="text-xs font-bold text-zinc-500 uppercase mb-4">Activity</h4>
                            <div className="flex gap-3">
                                <Avatar fallback="AL" />
                                <div className="space-y-1">
                                    <div className="text-sm">
                                        <span className="font-semibold text-white">Alex Lotfy</span>
                                        <span className="text-zinc-500 ml-2">created this issue</span>
                                    </div>
                                    <span className="text-xs text-zinc-600">2 days ago</span>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>

                {/* Sidebar (Right) */}
                <div className="w-72 bg-[#09090b] p-4 space-y-6 overflow-y-auto shrink-0">
                    
                    {/* Status Section */}
                    <div className="space-y-3">
                        <div className="text-xs font-bold text-zinc-500 uppercase">State</div>
                        <div className="group flex items-center justify-between p-2 rounded-md hover:bg-white/5 cursor-pointer transition-colors border border-transparent hover:border-white/5">
                            <div className="flex items-center gap-2">
                                <div className="w-4 h-4 rounded-full border border-dotted border-zinc-500 flex items-center justify-center">
                                    <div className="w-2 h-2 rounded-full bg-zinc-500" />
                                </div>
                                <span className="text-sm font-medium">Backlog</span>
                            </div>
                            <ChevronDown size={14} className="text-zinc-600 opacity-0 group-hover:opacity-100" />
                        </div>
                    </div>

                    {/* Assignee Section */}
                    <div className="space-y-3">
                        <div className="text-xs font-bold text-zinc-500 uppercase">Assignee</div>
                        <div className="group flex items-center justify-between p-2 rounded-md hover:bg-white/5 cursor-pointer transition-colors border border-transparent hover:border-white/5">
                            <div className="flex items-center gap-2">
                                <Avatar fallback="ME" className="w-5 h-5 text-[9px]" />
                                <span className="text-sm text-zinc-300">Unassigned</span>
                            </div>
                            <User size={14} className="text-zinc-600 opacity-0 group-hover:opacity-100" />
                        </div>
                    </div>

                    {/* Meta Data Grid */}
                    <div className="space-y-4 pt-4 border-t border-white/5">
                        <div className="grid grid-cols-[80px_1fr] gap-2 items-center text-sm">
                            <span className="text-zinc-500 text-xs">Priority</span>
                            <div className="flex items-center gap-2">
                                <ArrowUpRight size={14} className="text-orange-500" />
                                <span className="text-zinc-300">High</span>
                            </div>
                        </div>
                        {/* Estimate Removed as requested */}
                        <div className="grid grid-cols-[80px_1fr] gap-2 items-center text-sm">
                            <span className="text-zinc-500 text-xs">Labels</span>
                            <div className="flex flex-wrap gap-1">
                                <span className="px-1.5 py-0.5 bg-blue-500/10 text-blue-400 rounded text-[10px] border border-blue-500/20">Backend</span>
                                <span className="px-1.5 py-0.5 bg-pink-500/10 text-pink-400 rounded text-[10px] border border-pink-500/20">API</span>
                            </div>
                        </div>
                    </div>

                    {/* Dates */}
                     <div className="space-y-4 pt-4 border-t border-white/5">
                        <div className="flex items-center gap-2 text-xs text-zinc-500">
                            <Calendar size={12} />
                            <span>Created Dec 12</span>
                        </div>
                        <div className="flex items-center gap-2 text-xs text-zinc-500">
                            <Clock size={12} />
                            <span>Updated 2h ago</span>
                        </div>
                     </div>
                </div>
            </div>
        </div>
    );
};


// --- VARIANT 2: SPLIT PANE (Write & Preview) ---

const SplitPaneEditor = () => {
    const [view, setView] = useState<'write' | 'preview'>('write');

    return (
        <div className="bg-white dark:bg-[#0f0f10] border dark:border-zinc-800 rounded-xl shadow-lg overflow-hidden flex flex-col h-[600px] w-full max-w-5xl mx-auto font-sans">
             {/* Toolbar */}
             <div className="h-12 border-b dark:border-zinc-800 flex items-center justify-between px-4 bg-zinc-50/50 dark:bg-zinc-900/50">
                <div className="flex items-center gap-2">
                    <div className="flex bg-zinc-200 dark:bg-zinc-800 p-0.5 rounded-lg">
                        <button 
                            onClick={() => setView('write')}
                            className={cn(
                                "px-3 py-1 rounded-md text-xs font-medium transition-all flex items-center gap-2",
                                view === 'write' ? "bg-white dark:bg-zinc-700 shadow-sm text-foreground" : "text-zinc-500 hover:text-foreground"
                            )}
                        >
                            <Edit2 size={12} /> Write
                        </button>
                        <button 
                             onClick={() => setView('preview')}
                             className={cn(
                                "px-3 py-1 rounded-md text-xs font-medium transition-all flex items-center gap-2",
                                view === 'preview' ? "bg-white dark:bg-zinc-700 shadow-sm text-foreground" : "text-zinc-500 hover:text-foreground"
                            )}
                        >
                            <Eye size={12} /> Preview
                        </button>
                    </div>
                </div>
                <div className="flex items-center gap-2">
                    <span className="text-xs text-zinc-400 px-2">Autosaved</span>
                    <Button size="sm" variant="primary" className="h-7 text-xs">Save Changes</Button>
                </div>
             </div>

             <div className="flex-1 flex overflow-hidden">
                {/* Editor Area (Left) */}
                <div className={cn("flex-1 bg-white dark:bg-[#0f0f10] p-6 overflow-y-auto border-r dark:border-zinc-800 transition-all", view === 'preview' && "hidden md:flex")}>
                    <div className="max-w-2xl mx-auto w-full space-y-4">
                        <input 
                            type="text" 
                            className="w-full text-3xl font-bold bg-transparent border-none focus:ring-0 p-0 placeholder:text-zinc-300 dark:placeholder:text-zinc-700"
                            defaultValue="Add rate limiting to API"
                        />
                         <div className="flex items-center gap-4 text-sm text-zinc-500 border-b dark:border-zinc-800 pb-4">
                             <div className="flex items-center gap-1.5 px-2 py-1 hover:bg-zinc-100 dark:hover:bg-zinc-800 rounded cursor-pointer">
                                 <User size={14} /> Unassigned
                             </div>
                             <div className="flex items-center gap-1.5 px-2 py-1 hover:bg-zinc-100 dark:hover:bg-zinc-800 rounded cursor-pointer">
                                 <Tag size={14} /> Feature
                             </div>
                             <div className="flex items-center gap-1.5 px-2 py-1 hover:bg-zinc-100 dark:hover:bg-zinc-800 rounded cursor-pointer text-orange-500 bg-orange-500/10">
                                 <ArrowUpRight size={14} /> High
                             </div>
                         </div>
                        <textarea 
                            className="w-full h-[400px] resize-none bg-transparent border-none focus:ring-0 p-0 font-mono text-sm text-zinc-600 dark:text-zinc-400 leading-relaxed outline-none"
                            defaultValue={MOCK_CONTENT}
                        />
                    </div>
                </div>

                {/* Preview Area (Right) */}
                <div className={cn("flex-1 bg-zinc-50 dark:bg-zinc-900/30 p-8 overflow-y-auto transition-all", view === 'write' ? "hidden md:block" : "flex-1")}>
                     <div className="max-w-2xl mx-auto prose dark:prose-invert prose-sm">
                        <h1>Add rate limiting to API</h1>
                        <p>We need to implement rate limiting to prevent abuse of our public API endpoints.</p>
                        <h2>Requirements</h2>
                        <ul>
                            <li>Limit requests to <strong>100 per minute</strong> per IP address.</li>
                            <li>Return <code>429 Too Many Requests</code> status code when limit is exceeded.</li>
                            <li>Include <code>Retry-After</code> header in the response.</li>
                        </ul>
                        <h3>Implementation Details</h3>
                        <p>We should use a Redis-based sliding window algorithm. This will ensure accuracy and performance.</p>
                        <pre className="bg-zinc-800 text-zinc-200 p-4 rounded-md overflow-x-auto text-xs">
                            <code>
{`const rateLimit = (ip: string) => {
  // Check Redis for current count
  // ...
}`}
                            </code>
                        </pre>
                        <blockquote>
                            <p>Note: Make sure to whitelist internal services.</p>
                        </blockquote>
                     </div>
                </div>
             </div>
        </div>
    );
};


// --- VARIANT 3: NOTION STYLE (Document) ---

const NotionStyle = () => {
    return (
        <div className="bg-white dark:bg-white border rounded-xl shadow-sm text-zinc-900 h-[600px] w-full max-w-3xl mx-auto flex flex-col relative overflow-hidden font-sans">
             {/* Cover Image Placeholder */}
             <div className="h-32 bg-gradient-to-r from-red-100 to-orange-100 shrink-0 group relative">
                 <Button variant="ghost" size="sm" className="absolute bottom-2 right-2 opacity-0 group-hover:opacity-100 bg-white/50 hover:bg-white text-xs h-7 text-zinc-900">Change Cover</Button>
             </div>

             <div className="flex-1 overflow-y-auto px-12 py-8">
                 {/* Icon */}
                 <div className="-mt-14 mb-6 text-6xl shadow-sm rounded bg-white w-fit p-1">
                     🛡️
                 </div>

                 {/* Title */}
                 <h1 className="text-4xl font-bold mb-6 text-zinc-900">API Rate Limiting Study</h1>

                 {/* Properties Section (like Notion top properties) */}
                 <div className="space-y-1 mb-8 text-sm">
                     <div className="flex items-center gap-4 py-1">
                         <span className="w-24 text-zinc-500 flex items-center gap-2"><User size={14}/> Assignee</span>
                         <div className="flex items-center gap-2 hover:bg-zinc-100 px-2 py-0.5 rounded cursor-pointer">
                             <Avatar fallback="AL" className="w-5 h-5 text-[9px] text-white" />
                             <span>Alex Lotfy</span>
                         </div>
                     </div>
                     <div className="flex items-center gap-4 py-1">
                         <span className="w-24 text-zinc-500 flex items-center gap-2"><Tag size={14}/> Status</span>
                         <span className="bg-yellow-100 text-yellow-800 px-2 py-0.5 rounded text-xs px-2">In Progress</span>
                     </div>
                     <div className="flex items-center gap-4 py-1">
                         <span className="w-24 text-zinc-500 flex items-center gap-2"><Calendar size={14}/> Date Created</span>
                         <span className="text-zinc-700">Oct 24, 2025</span>
                     </div>
                 </div>

                 <hr className="mb-8 border-zinc-100" />

                 {/* Content */}
                  <div className="prose prose-zinc max-w-none">
                        <p>We need to implement rate limiting to prevent abuse of our public API endpoints.</p>
                        <h2>Requirements</h2>
                        <ul className="list-disc pl-4">
                            <li>Limit requests to <strong>100 per minute</strong> per IP address.</li>
                            <li>Return <code>429 Too Many Requests</code> status code when limit is exceeded.</li>
                            <li>Include <code>Retry-After</code> header in the response.</li>
                        </ul>
                        <div className="p-4 bg-zinc-50 rounded-lg border border-zinc-100 my-4 flex gap-4 items-start">
                             <div className="text-2xl">💡</div>
                             <div>
                                 <h4 className="font-bold text-sm m-0 mb-1">Idea</h4>
                                 <p className="text-sm m-0 text-zinc-600">Consider using a Token Bucket algorithm for better burst handling.</p>
                             </div>
                        </div>
                   </div>
             </div>
        </div>
    );
};


export const TicketDetailsShowcase = () => {
    return (
        <div className="space-y-24 pb-20">
            <div className="space-y-4">
                <h3 className="text-2xl font-bold">1. The "Linear" Standard</h3>
                <p className="text-muted-foreground">Dark mode classic. Sidebar for metadata, clean typography, modal-like feel.</p>
                <div className="p-8 bg-zinc-950 rounded-xl border border-zinc-900">
                    <LinearClassic />
                </div>
            </div>

            <div className="space-y-4">
                <h3 className="text-2xl font-bold">2. Split-Pane Developer Focus</h3>
                <p className="text-muted-foreground">Explicit Write vs Preview modes. Good for heavy Markdown users.</p>
                <div className="p-8 bg-zinc-100 dark:bg-zinc-950 rounded-xl border border-zinc-200 dark:border-zinc-800">
                    <SplitPaneEditor />
                </div>
            </div>

            <div className="space-y-4">
                <h3 className="text-2xl font-bold">3. The "Notion" Document</h3>
                <p className="text-muted-foreground">Light, airy, content-first. Properties are secondary. Feeling of a permanent doc.</p>
                <div className="p-8 bg-zinc-50 rounded-xl border border-zinc-200">
                    <NotionStyle />
                </div>
            </div>
        </div>
    );
};
