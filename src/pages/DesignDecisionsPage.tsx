
import React from 'react';
import { cn } from '@/lib/utils';
import { Button } from '@/components/ui/Button';
import { X, ChevronDown, Lightbulb } from 'lucide-react';
import { DeveloperCardVariants } from '@/components/team/DeveloperCardVariants';
import { StandupControlVariants } from '@/components/standup/StandupControlVariants';
import { HeaderDesignsShowcase } from '@/components/design/HeaderShowcase';
import { AssignTaskShowcase } from '@/components/design/AssignTaskShowcase';
import { StandupCardShowcase } from '@/components/design/StandupCardShowcase';
import { FilterShowcase } from '@/components/design/FilterShowcase';
import { StandupHistoryShowcase } from '@/components/design/StandupHistoryShowcase';
import { TicketDetailsShowcase } from '@/components/design/TicketDetailsShowcase';
import { SprintDesignShowcase } from '@/components/design/SprintDesignShowcase';
import { SprintDesignShowcaseV2 } from '@/components/design/SprintDesignShowcaseV2';
import { SprintsPageDesignShowcase } from '@/components/design/SprintsPageDesignShowcase';

// ... (existing mock components) ...




// --- MOCK COMPONENTS (Non-functional, styling only) ---

const MockInput = ({ className, placeholder = "Input..." }: { className?: string, placeholder?: string }) => (
  <div className={cn("flex h-10 w-full rounded-md border px-3 py-2 text-sm transition-shadow", className)}>
    <span className={cn("text-muted-foreground/50", !placeholder && "opacity-0")}>{placeholder}</span>
  </div>
);

const MockSelect = ({ className, value = "Select..." }: { className?: string, value?: string }) => (
  <div className={cn("flex h-10 w-full items-center justify-between rounded-md border px-3 py-2 text-sm transition-shadow", className)}>
    <span>{value}</span>
    <ChevronDown size={14} className="opacity-50" />
  </div>
);

const MockTextarea = ({ className }: { className?: string }) => (
    <div className={cn("flex min-h-[80px] w-full rounded-md border px-3 py-2 text-sm", className)}>
        <span className="text-muted-foreground/50">Details...</span>
    </div>
);

// --- THE MOCK IDEA MODAL CONTENT ---

const IdeaModalContent = ({ styleVariant }: { styleVariant: any }) => {
    const { 
        containerClass, 
        headerClass, 
        titleClass,
        inputClass,
        labelClass,
        footerClass,
        buttonPrimaryClass,
        buttonGhostClass,
        closeButtonClass
    } = styleVariant;

    return (
        <div className={cn("w-full max-w-[480px] relative flex flex-col", containerClass)}>
            {/* Header */}
            <div className={cn("flex items-center justify-between px-6 py-4 shrink-0", headerClass)}>
                <h2 className={cn("text-lg font-semibold tracking-tight", titleClass)}>New Idea</h2>
                <button className={cn("p-2 -mr-2 rounded-full transition-colors", closeButtonClass)}>
                    <X size={20} />
                </button>
            </div>

            {/* Body */}
            <div className="flex-1 p-6 pt-2 space-y-4">
                 <div className="space-y-1.5">
                    <label className={cn("text-sm font-medium", labelClass)}>Title</label>
                    <MockInput className={inputClass} placeholder="e.g. Add Google Login" />
                </div>
                
                <div className="grid grid-cols-2 gap-4">
                    <div className="space-y-1.5">
                        <label className={cn("text-sm font-medium", labelClass)}>Type</label>
                        <MockSelect className={inputClass} value="Feature" />
                    </div>
                    <div className="space-y-1.5">
                        <label className={cn("text-sm font-medium", labelClass)}>Priority</label>
                        <MockSelect className={inputClass} value="P2 - Medium" />
                    </div>
                </div>

                <div className="space-y-1.5">
                   <label className={cn("text-sm font-medium", labelClass)}>Description</label>
                   <MockTextarea className={cn("min-h-[100px]", inputClass)} />
                </div>
            </div>

            {/* Footer */}
            <div className={cn("px-6 py-4 flex justify-end gap-2 shrink-0", footerClass)}>
                <Button variant="ghost" size="sm" className={buttonGhostClass}>Cancel</Button>
                <Button size="sm" className={buttonPrimaryClass}>Create Ticket</Button>
            </div>
        </div>
    );
};

// --- VARIANTS DEFINITIONS ---

const variants = [
    {
        name: "1. Current (Zinc & Amber)",
        description: "The current implementation with your latest tweaks.",
        styles: {
            containerClass: "bg-popover border border-border/40 shadow-2xl rounded-xl",
            headerClass: "border-b border-border/10",
            titleClass: "text-foreground",
            inputClass: "bg-transparent border-input focus:ring-2 focus:ring-ring placeholder:text-muted-foreground",
            labelClass: "text-foreground",
            footerClass: "",
            buttonPrimaryClass: "bg-primary text-primary-foreground hover:bg-primary/90",
            buttonGhostClass: "text-muted-foreground hover:bg-muted hover:text-foreground",
            closeButtonClass: "text-muted-foreground hover:bg-muted hover:text-foreground"
        }
    },
    {
        name: "2. Linear-esque (High Contrast)",
        description: "Darker backgrounds, extremely subtle borders, high contrast text.",
        styles: {
            containerClass: "bg-[#18181b] border border-white/10 shadow-[0_8px_40px_-12px_rgba(0,0,0,0.5)] rounded-lg", // Zinc-900 specific
            headerClass: "border-b border-white/5",
            titleClass: "text-white font-medium",
            inputClass: "bg-[#09090b] border-white/10 focus:border-white/20 focus:ring-0 rounded text-white placeholder:text-zinc-600",
            labelClass: "text-zinc-400 text-xs uppercase tracking-wider",
            footerClass: "border-t border-white/5 pt-3 mt-2",
            buttonPrimaryClass: "bg-white text-black hover:bg-zinc-200 h-8 text-xs font-medium rounded",
            buttonGhostClass: "text-zinc-500 hover:text-zinc-300 h-8 text-xs hover:bg-transparent",
            closeButtonClass: "text-zinc-600 hover:text-zinc-400"
        }
    },
    {
        name: "3. Soft & Airy (Apple-like)",
        description: "Large border radius, translucent backgrounds, soft shadows.",
        styles: {
            containerClass: "bg-background/80 backdrop-blur-xl border border-border/20 shadow-xl rounded-[24px]",
            headerClass: "pb-2",
            titleClass: "text-xl font-bold",
            inputClass: "bg-secondary/50 border-transparent hover:bg-secondary/80 focus:bg-background focus:ring-2 focus:ring-blue-500/20 rounded-xl transition-all",
            labelClass: "text-muted-foreground ml-1",
            footerClass: "pt-2",
            buttonPrimaryClass: "bg-blue-600 rounded-full px-6 hover:bg-blue-700 shadow-lg shadow-blue-500/20",
            buttonGhostClass: "rounded-full hover:bg-secondary",
            closeButtonClass: "bg-secondary/50 rounded-full p-2 hover:bg-secondary"
        }
    },
    {
        name: "4. Brutalist / Mono",
        description: "Sharp corners, thick borders, monospace typography.",
        styles: {
            containerClass: "bg-background border-2 border-foreground shadow-[4px_4px_0px_0px_rgba(var(--foreground))] rounded-none",
            headerClass: "border-b-2 border-foreground bg-muted/20",
            titleClass: "font-mono uppercase tracking-tight",
            inputClass: "bg-background border-2 border-muted-foreground focus:border-primary rounded-none font-mono text-xs",
            labelClass: "font-mono text-xs font-bold uppercase",
            footerClass: "border-t-2 border-foreground bg-muted/20",
            buttonPrimaryClass: "rounded-none border-2 border-transparent bg-foreground text-background hover:bg-primary hover:text-primary-foreground font-mono uppercase",
            buttonGhostClass: "rounded-none font-mono uppercase hover:bg-muted",
            closeButtonClass: "rounded-none hover:bg-destructive hover:text-destructive-foreground"
        }
    },
    {
        name: "5. Glass & Gradient (Modern SaaS)",
        description: "Subtle gradient borders and glows.",
        styles: {
            containerClass: "bg-zinc-900/90 backdrop-blur-md border border-white/10 shadow-2xl rounded-2xl ring-1 ring-white/5",
            headerClass: "bg-gradient-to-r from-white/5 via-transparent to-transparent",
            titleClass: "bg-clip-text text-transparent bg-gradient-to-r from-white to-zinc-400",
            inputClass: "bg-white/5 border-white/5 focus:bg-white/10 focus:border-indigo-500/50 transition-all rounded-lg",
            labelClass: "text-zinc-500",
            footerClass: "",
            buttonPrimaryClass: "bg-gradient-to-r from-indigo-500 to-purple-500 border-0 hover:opacity-90 shadow-lg shadow-indigo-500/20",
            buttonGhostClass: "text-zinc-400 hover:text-white hover:bg-white/5",
            closeButtonClass: "text-zinc-500 hover:text-white"
        }
    },
    {
        name: "6. Notion Style (Minimal)",
        description: "Very clean, minimal borders, paper-like.",
        styles: {
            containerClass: "bg-background shadow-lg rounded-md border border-border/60",
            headerClass: "py-3 min-h-[40px]",
            titleClass: "font-normal text-sm text-muted-foreground",
            inputClass: "bg-transparent border-0 border-b border-border rounded-none px-0 py-1 focus:ring-0 focus:border-primary h-8",
            labelClass: "text-xs font-medium text-muted-foreground",
            footerClass: "bg-secondary/30",
            buttonPrimaryClass: "bg-primary h-8 text-xs px-3 shadow-sm",
            buttonGhostClass: "h-8 text-xs",
            closeButtonClass: "h-6 w-6 p-0.5"
        }
    },
    {
        name: "7. Card-Heavy (Gray Surfaces)",
        description: "Everything is a card within a card.",
        styles: {
            containerClass: "bg-background border-none shadow-xl rounded-2xl overflow-hidden",
            headerClass: "bg-secondary/50 py-6",
            titleClass: "text-2xl font-bold text-center w-full",
            inputClass: "bg-secondary border-none shadow-inner focus:ring-2 focus:ring-primary focus:bg-background rounded-xl",
            labelClass: "text-muted-foreground font-semibold ml-2",
            footerClass: "bg-secondary/50 justify-center pb-6",
            buttonPrimaryClass: "w-full rounded-xl py-6 h-auto text-base font-bold shadow-xl",
            buttonGhostClass: "hidden",
            closeButtonClass: "absolute top-4 right-4 bg-background rounded-full shadow-sm"
        }
    },
    {
        name: "8. Floating Labels (Material)",
        description: "Inputs with floating labels or filled style.",
        styles: {
            containerClass: "bg-popover shadow-md rounded-lg",
            headerClass: "bg-primary text-primary-foreground",
            titleClass: "text-primary-foreground",
            inputClass: "bg-secondary/30 border-b-2 border-secondary focus:border-primary rounded-t-md rounded-b-none px-4",
            labelClass: "text-primary text-xs uppercase font-bold",
            footerClass: "p-2",
            buttonPrimaryClass: "uppercase font-bold tracking-wider",
            buttonGhostClass: "uppercase font-bold tracking-wider",
            closeButtonClass: "text-primary-foreground hover:bg-primary-foreground/20"
        }
    },
    {
        name: "9. Sidebar / Drawer Look",
        description: "Tall and narrow, typical for side panels.",
        styles: {
            containerClass: "bg-background border-r h-[600px] shadow-2xl rounded-l-2xl rounded-r-none ml-auto",
            headerClass: "border-b pb-6",
            titleClass: "text-3xl font-light",
            inputClass: "h-14 bg-secondary/20 border-0 rounded-2xl px-6 text-lg",
            labelClass: "text-lg text-muted-foreground pl-2",
            footerClass: "border-t pt-6 bg-secondary/10 mt-auto",
            buttonPrimaryClass: "h-12 w-full text-lg rounded-xl",
            buttonGhostClass: "hidden",
            closeButtonClass: "hover:bg-secondary rounded-full"
        }
    },
    {
        name: "10. Neon / Cyber",
        description: "Dark mode focus with glowing accents.",
        styles: {
            containerClass: "bg-black border border-green-500/50 shadow-[0_0_20px_rgba(34,197,94,0.2)] rounded-lg",
            headerClass: "border-b border-green-500/30",
            titleClass: "text-green-500 font-mono",
            inputClass: "bg-black border border-green-900 text-green-400 placeholder:text-green-900 focus:border-green-500 focus:shadow-[0_0_10px_rgba(34,197,94,0.4)]",
            labelClass: "text-green-600 font-mono text-xs",
            footerClass: "border-t border-green-900",
            buttonPrimaryClass: "bg-green-600 text-black font-bold hover:bg-green-500 hover:shadow-[0_0_15px_rgba(34,197,94,0.6)] border border-green-400",
            buttonGhostClass: "text-green-600 hover:bg-green-900/30",
            closeButtonClass: "text-green-700 hover:text-green-500"
        }
    },
    // --- GAMIFIED "FUN" PACK ---
    {
        name: "11. Retro 8-Bit (Pixel)",
        description: "Old school console vibes. Thick borders, block shadows.",
        styles: {
            containerClass: "bg-white dark:bg-zinc-900 border-4 border-black dark:border-white rounded-none shadow-[8px_8px_0_0_#000] dark:shadow-[8px_8px_0_0_#fff] font-mono",
            headerClass: "border-b-4 border-black dark:border-white bg-zinc-100 dark:bg-zinc-800",
            titleClass: "uppercase font-black tracking-widest text-black dark:text-white",
            inputClass: "bg-white dark:bg-black border-4 border-black dark:border-white rounded-none focus:ring-0 focus:translate-x-1 focus:translate-y-1 transition-transform",
            labelClass: "uppercase font-bold text-xs mb-2 block",
            footerClass: "border-t-4 border-black dark:border-white bg-zinc-50 dark:bg-zinc-900",
            buttonPrimaryClass: "bg-black dark:bg-white text-white dark:text-black rounded-none border-2 border-transparent hover:opacity-80 font-bold uppercase",
            buttonGhostClass: "rounded-none uppercase font-bold hover:bg-zinc-200 dark:hover:bg-zinc-800",
            closeButtonClass: "rounded-none hover:bg-red-500 hover:text-white"
        }
    },
    {
        name: "12. RPG Quest Log (Fantasy)",
        description: "Parchment and leather aesthetics.",
        styles: {
            containerClass: "bg-[#fdf6e3] dark:bg-[#2c241b] border-[3px] border-[#8b5a2b] dark:border-[#a0744b] rounded-sm shadow-xl",
            headerClass: "border-b-[2px] border-[#8b5a2b]/30 pb-4 bg-[url('https://www.transparenttextures.com/patterns/paper.png')]",
            titleClass: "font-serif text-[#5c3a1e] dark:text-[#e6cca0] text-2xl tracking-wide",
            inputClass: "bg-[#fffef8] dark:bg-[#1a1612] border-2 border-[#d4b483] dark:border-[#5c4028] font-serif text-[#5c3a1e] dark:text-[#d4b483] rounded-sm focus:border-[#8b5a2b]",
            labelClass: "font-serif text-[#8b5a2b] dark:text-[#a0744b] font-bold tracking-wider",
            footerClass: "pt-4 border-t-[2px] border-[#8b5a2b]/30",
            buttonPrimaryClass: "bg-[#8b5a2b] text-[#fdf6e3] font-serif border-2 border-[#5c3a1e] shadow-[2px_2px_0_0_#3e2714] hover:translate-y-0.5 active:shadow-none active:translate-y-[2px]",
            buttonGhostClass: "text-[#8b5a2b] dark:text-[#a0744b] font-serif hover:bg-[#8b5a2b]/10",
            closeButtonClass: "text-[#8b5a2b] dark:text-[#a0744b]"
        }
    },
    {
        name: "13. Cyber Interface (Sci-Fi)",
        description: "Holo glowing borders, tech feel.",
        styles: {
            containerClass: "bg-zinc-50 dark:bg-zinc-950 border border-cyan-500/50 dark:border-cyan-400/50 shadow-[0_0_15px_rgba(6,182,212,0.15)] rounded-tl-xl rounded-br-xl",
            headerClass: "border-b border-cyan-500/20 bg-cyan-500/5",
            titleClass: "font-mono text-cyan-700 dark:text-cyan-400 uppercase tracking-[0.2em]",
            inputClass: "bg-cyan-50/50 dark:bg-cyan-950/20 border border-cyan-500/30 text-cyan-800 dark:text-cyan-200 font-mono rounded-none focus:border-cyan-400 focus:shadow-[0_0_10px_rgba(6,182,212,0.2)]",
            labelClass: "font-mono text-cyan-600 dark:text-cyan-500 text-[10px]",
            footerClass: "border-t border-cyan-500/20 bg-cyan-500/5",
            buttonPrimaryClass: "bg-cyan-500 hover:bg-cyan-400 text-white font-mono uppercase tracking-widest rounded-none border-l-4 border-r-4 border-double border-white/20",
            buttonGhostClass: "font-mono uppercase text-cyan-600 dark:text-cyan-400 hover:bg-cyan-500/10",
            closeButtonClass: "text-cyan-600 dark:text-cyan-400 hover:text-cyan-500"
        }
    },
    {
        name: "14. Candy Pop (Casual)",
        description: "Super rounded, gradients, bubbly.",
        styles: {
            containerClass: "bg-white dark:bg-zinc-900 border-4 border-pink-400 dark:border-pink-600 rounded-[32px] shadow-2xl",
            headerClass: "pb-4",
            titleClass: "font-black text-transparent bg-clip-text bg-gradient-to-r from-pink-500 to-purple-500 text-3xl tracking-tight",
            inputClass: "bg-slate-50 dark:bg-slate-800 border-2 border-slate-200 dark:border-slate-700 rounded-2xl px-4 py-3 focus:ring-4 focus:ring-pink-200 dark:focus:ring-pink-900 focus:border-pink-400 transition-all",
            labelClass: "text-slate-500 dark:text-slate-400 font-extrabold ml-3 text-xs uppercase",
            footerClass: "pt-2",
            buttonPrimaryClass: "bg-gradient-to-b from-pink-400 to-pink-500 hover:from-pink-300 hover:to-pink-400 text-white font-black rounded-full shadow-[0_6px_0_0_#db2777] active:shadow-none active:translate-y-[6px] transition-all",
            buttonGhostClass: "rounded-full font-bold text-slate-500 hover:bg-slate-100",
            closeButtonClass: "bg-slate-100 dark:bg-slate-800 rounded-full p-2 text-slate-500 font-bold"
        }
    },
    {
        name: "15. Neon Drive (Racing)",
        description: "Skewed, italic, speed-focused.",
        styles: {
            containerClass: "bg-zinc-100 dark:bg-zinc-950 border-y-4 border-red-600 -skew-x-6 shadow-xl max-w-[460px] ml-4",
            headerClass: "skew-x-6 border-b-2 border-zinc-200 dark:border-zinc-800 border-dashed",
            titleClass: "font-black italic uppercase text-4xl text-zinc-900 dark:text-white tracking-tighter",
            inputClass: "skew-x-6 bg-white dark:bg-zinc-900 border-2 border-zinc-300 dark:border-zinc-700 rounded-none italic focus:border-red-600 focus:text-red-600 transition-colors",
            labelClass: "skew-x-6 font-bold uppercase italic text-red-600 dark:text-red-500",
            footerClass: "skew-x-6",
            buttonPrimaryClass: "bg-red-600 hover:bg-red-700 text-white font-black italic uppercase rounded-none px-8 clip-path-polygon-[10%_0,100%_0,90%_100%,0%_100%]",
            buttonGhostClass: "italic font-bold uppercase",
            closeButtonClass: "hover:rotate-90 transition-transform"
        }
    },
    {
        name: "16. Card Battler (Hearth)",
        description: "Inset content, distinct header/footer zones.",
        styles: {
            containerClass: "bg-[#e8dec0] dark:bg-[#3d342b] rounded-xl border-4 border-[#bda27e] dark:border-[#5c4a35] shadow-2xl overflow-hidden",
            headerClass: "bg-[#382e24] py-3 text-center border-b-4 border-[#bda27e]",
            titleClass: "text-[#e8dec0] font-bold text-center w-full uppercase tracking-widest text-sm",
            inputClass: "bg-[#d6ccb0] dark:bg-[#2a241e] border-[#bda27e] dark:border-[#4a3b2a] shadow-[inset_0_2px_4px_rgba(0,0,0,0.2)] rounded-md focus:bg-white dark:focus:bg-black transition-colors",
            labelClass: "text-[#5c4a35] dark:text-[#bda27e] font-bold text-xs uppercase",
            footerClass: "bg-[#d6ccb0] dark:bg-[#2a241e] border-t-2 border-[#bda27e] dark:border-[#5c4a35]",
            buttonPrimaryClass: "bg-[#4a8a2a] hover:bg-[#5aa833] text-white font-bold border-2 border-[#2f5e18] shadow-md rounded-md uppercase text-xs tracking-wider",
            buttonGhostClass: "text-[#5c4a35] dark:text-[#bda27e] hover:bg-black/10 font-bold uppercase text-xs",
            closeButtonClass: "absolute top-2 right-2 text-[#e8dec0] hover:text-white"
        }
    },
    {
        name: "17. Vaporwave (Aesthetics)",
        description: "Pastel gradients, glitchy text.",
        styles: {
            containerClass: "bg-purple-50 dark:bg-[#1a0b2e] border-2 border-pink-300 dark:border-pink-600 shadow-[8px_8px_0_0_#818cf8] dark:shadow-[8px_8px_0_0_#4f46e5] rounded-none",
            headerClass: "bg-gradient-to-r from-pink-200 to-purple-200 dark:from-pink-900/40 dark:to-purple-900/40 border-b border-pink-300",
            titleClass: "uppercase tracking-widest text-indigo-600 dark:text-pink-300 font-bold",
            inputClass: "bg-white/50 dark:bg-black/30 border border-indigo-300 dark:border-indigo-700 rounded-none focus:ring-2 focus:ring-pink-400 placeholder:text-indigo-300",
            labelClass: "text-pink-500 dark:text-pink-400 font-mono text-xs",
            footerClass: "",
            buttonPrimaryClass: "bg-gradient-to-r from-pink-400 to-purple-500 text-white rounded-none shadow-lg hover:hue-rotate-15 transition-all text-xs font-bold uppercase tracking-widest",
            buttonGhostClass: "text-indigo-500 dark:text-indigo-300 font-mono text-xs uppercase",
            closeButtonClass: "text-pink-400 hover:text-pink-600"
        }
    },
    {
        name: "18. Tactical Ops (Military)",
        description: "Utilitarian, stencil-like, serious.",
        styles: {
            containerClass: "bg-zinc-200 dark:bg-zinc-800 border-l-8 border-l-orange-500 border-y border-r border-zinc-400 dark:border-zinc-600 rounded-r-md shadow-xl",
            headerClass: "bg-zinc-300 dark:bg-zinc-700/50 border-b border-zinc-400 dark:border-zinc-600 py-2",
            titleClass: "font-mono font-bold uppercase text-zinc-700 dark:text-zinc-300 text-base",
            inputClass: "bg-zinc-100 dark:bg-zinc-900 border border-zinc-400 dark:border-zinc-500 rounded-sm font-mono text-sm focus:border-orange-500",
            labelClass: "font-bold uppercase text-xs text-zinc-500 dark:text-zinc-400 tracking-tight",
            footerClass: "bg-zinc-300 dark:bg-zinc-700/30 border-t border-zinc-400 dark:border-zinc-600 py-3",
            buttonPrimaryClass: "bg-orange-500 hover:bg-orange-600 text-black font-bold uppercase rounded-sm px-6 font-mono text-xs",
            buttonGhostClass: "font-mono text-xs uppercase text-zinc-600 dark:text-zinc-400",
            closeButtonClass: "rounded-sm hover:bg-red-500 hover:text-white"
        }
    },
    {
        name: "19. Minimal Game UI (Clean)",
        description: "Semi-transparent overlays, very light/thin.",
        styles: {
            containerClass: "bg-white/90 dark:bg-black/80 backdrop-blur-md border border-white/20 dark:border-white/10 shadow-2xl rounded-[40px]",
            headerClass: "border-b border-black/5 dark:border-white/5",
            titleClass: "font-light text-3xl text-center w-full",
            inputClass: "bg-black/5 dark:bg-white/10 border-none rounded-full px-6 focus:bg-white dark:focus:bg-black focus:ring-2 focus:ring-black/10 dark:focus:ring-white/20 transition-all",
            labelClass: "ml-4 text-xs font-bold uppercase tracking-widest opacity-40",
            footerClass: "justify-center pt-6",
            buttonPrimaryClass: "bg-black dark:bg-white text-white dark:text-black rounded-full px-10 h-12 text-sm font-bold uppercase tracking-widest hover:scale-105 transition-transform",
            buttonGhostClass: "rounded-full uppercase tracking-widest text-xs",
            closeButtonClass: "absolute top-6 right-6 bg-black/5 dark:bg-white/5 rounded-full p-3 hover:rotate-90 transition-transform"
        }
    },
    {
        name: "20. Blueprint (Draft)",
        description: "Technical drawing style.",
        styles: {
            containerClass: "bg-[#0f52ba] dark:bg-[#002f6c] border-2 border-white/80 shadow-none rounded-sm", // Blueprint Blue
            headerClass: "border-b-2 border-dashed border-white/50 bg-white/10",
            titleClass: "font-mono text-white text-lg",
            inputClass: "bg-transparent border-2 border-white/50 text-white placeholder:text-white/50 font-mono rounded-none focus:border-white focus:bg-white/10",
            labelClass: "font-mono text-white/70 text-xs",
            footerClass: "border-t-2 border-white/50 bg-white/5",
            buttonPrimaryClass: "bg-white text-[#0f52ba] font-mono font-bold border-2 border-white hover:bg-transparent hover:text-white",
            buttonGhostClass: "text-white font-mono hover:bg-white/10",
            closeButtonClass: "text-white hover:bg-white/20 rounded-none border border-transparent hover:border-white"
        }
    },
    // --- PLAYFUL PROFESSIONAL PACK (Internal Tool Focus) ---
    {
        name: "21. Stripe-ish (Blur)",
        description: "Soft mesh gradient header, clean white body.",
        styles: {
            containerClass: "bg-white dark:bg-zinc-900 shadow-2xl rounded-2xl overflow-hidden border border-zinc-200 dark:border-zinc-800",
            headerClass: "bg-gradient-to-br from-indigo-500/10 via-purple-500/10 to-pink-500/10 border-b border-zinc-100 dark:border-zinc-800 py-6",
            titleClass: "text-zinc-800 dark:text-zinc-100 font-bold tracking-tight text-xl bg-clip-text text-transparent bg-gradient-to-r from-indigo-600 to-purple-600 dark:from-indigo-400 dark:to-purple-400",
            inputClass: "bg-zinc-50 dark:bg-zinc-800/50 border-transparent shadow-[inset_0_1px_2px_rgba(0,0,0,0.05)] focus:bg-white dark:focus:bg-zinc-800 focus:ring-2 focus:ring-indigo-500/20 rounded-lg",
            labelClass: "text-zinc-500 font-medium text-xs uppercase tracking-wide",
            footerClass: "bg-zinc-50 dark:bg-zinc-900 border-t border-zinc-100 dark:border-zinc-800",
            buttonPrimaryClass: "bg-[#635bff] hover:bg-[#5851e2] text-white font-medium shadow-[0_1px_2px_0_rgba(0,0,0,0.2)] rounded-lg",
            buttonGhostClass: "text-zinc-500 hover:text-zinc-900 dark:hover:text-white",
            closeButtonClass: "bg-white/50 dark:bg-black/20 hover:bg-white dark:hover:bg-zinc-800 text-zinc-500"
        }
    },
    {
        name: "22. Neo-Pop (Friendly)",
        description: "Thick soft borders, pastel accents, approachable.",
        styles: {
            containerClass: "bg-white dark:bg-zinc-900 border-2 border-zinc-200 dark:border-zinc-700 shadow-[4px_4px_0_0_#e4e4e7] dark:shadow-[4px_4px_0_0_#3f3f46] rounded-xl",
            headerClass: "border-b-2 border-zinc-100 dark:border-zinc-800",
            titleClass: "font-extrabold text-zinc-900 dark:text-zinc-100 text-lg",
            inputClass: "bg-white dark:bg-zinc-900 border-2 border-zinc-200 dark:border-zinc-700 rounded-lg focus:border-indigo-400 focus:shadow-[2px_2px_0_0_#818cf8]",
            labelClass: "font-bold text-zinc-700 dark:text-zinc-300",
            footerClass: "pt-4",
            buttonPrimaryClass: "bg-indigo-500 text-white font-bold border-2 border-indigo-600 shadow-[2px_2px_0_0_#312e81] active:translate-y-[2px] active:shadow-none rounded-lg",
            buttonGhostClass: "font-bold text-zinc-500 hover:bg-zinc-100 dark:hover:bg-zinc-800 rounded-lg",
            closeButtonClass: "border-2 border-transparent hover:border-zinc-200 rounded-lg text-zinc-400 hover:text-red-500"
        }
    },
    {
        name: "23. Modern Tab (Folder)",
        description: "Looks like a file folder. Organized and clear.",
        styles: {
            containerClass: "bg-amber-50 dark:bg-zinc-900 border border-amber-200 dark:border-zinc-700 shadow-xl rounded-t-lg rounded-b-md mt-4",
            headerClass: "absolute -top-10 left-0 bg-white dark:bg-zinc-800 border-t border-x border-amber-200 dark:border-zinc-700 h-10 px-6 rounded-t-lg flex items-center w-auto min-w-[150px]",
            titleClass: "text-sm font-bold text-amber-900 dark:text-amber-100",
            inputClass: "bg-white dark:bg-zinc-950 border border-amber-200 dark:border-zinc-700 focus:border-amber-400 rounded-md shadow-sm",
            labelClass: "text-amber-800/60 dark:text-zinc-400 font-semibold text-xs",
            footerClass: "bg-white/50 dark:bg-zinc-900/50 border-t border-amber-100 dark:border-zinc-800",
            buttonPrimaryClass: "bg-amber-400 dark:bg-amber-600 text-amber-950 dark:text-white font-bold hover:bg-amber-500 shadow-sm rounded-md",
            buttonGhostClass: "text-amber-700 dark:text-zinc-400 hover:bg-amber-100 dark:hover:bg-zinc-800",
            closeButtonClass: "absolute top-2 right-2 text-amber-400/50 dark:text-zinc-600 hover:text-amber-600"
        }
    },
    {
        name: "24. Gradient Border (Subtle)",
        description: "Clean dark/light modal with a fun gradient ring.",
        styles: {
            containerClass: "bg-white dark:bg-zinc-950 p-[2px] rounded-2xl shadow-2xl bg-gradient-to-br from-pink-500 via-purple-500 to-indigo-500", // The gradient is the container padding
            headerClass: "bg-white dark:bg-zinc-925 rounded-t-[14px] pt-6 pb-2", // Inner bg
            titleClass: "font-bold text-transparent bg-clip-text bg-gradient-to-r from-pink-500 to-purple-600 tracking-tight",
            inputClass: "bg-zinc-50 dark:bg-zinc-900 border-zinc-200 dark:border-zinc-800 focus:ring-2 focus:ring-purple-500/20 rounded-xl",
            labelClass: "text-zinc-500 font-medium ml-1",
            footerClass: "bg-white dark:bg-zinc-950 rounded-b-[14px] pb-6",
            buttonPrimaryClass: "bg-gradient-to-r from-pink-500 to-purple-600 text-white rounded-full shadow-lg shadow-purple-500/25 border-0 font-medium",
            buttonGhostClass: "rounded-full hover:bg-zinc-100 dark:hover:bg-zinc-800",
            closeButtonClass: "text-zinc-400 hover:text-purple-500"
        }
    },
    {
        name: "25. Claymorphism (Soft)",
        description: "Inflated, soft, friendly, distinctive shadow.",
        styles: {
            containerClass: "bg-indigo-50 dark:bg-zinc-800 shadow-[12px_12px_24px_rgba(165,180,252,0.4),-12px_-12px_24px_rgba(255,255,255,1)] dark:shadow-[8px_8px_16px_rgba(0,0,0,0.3),-4px_-4px_12px_rgba(255,255,255,0.05)] rounded-[30px] border border-white/40 dark:border-white/5",
            headerClass: "pb-2",
            titleClass: "text-indigo-900 dark:text-indigo-100 font-black text-xl tracking-tight",
            inputClass: "bg-white dark:bg-zinc-900 shadow-[inset_4px_4px_8px_rgba(165,180,252,0.2),inset_-4px_-4px_8px_rgba(255,255,255,0.8)] dark:shadow-[inset_2px_2px_5px_rgba(0,0,0,0.5)] border-none rounded-2xl px-4 py-3",
            labelClass: "ml-4 text-indigo-400 dark:text-indigo-300 font-bold text-xs uppercase",
            footerClass: "pt-4",
            buttonPrimaryClass: "bg-indigo-500 text-white rounded-2xl shadow-[6px_6px_12px_rgba(99,102,241,0.4),-6px_-6px_12px_rgba(255,255,255,0.2)] hover:scale-95 transition-transform",
            buttonGhostClass: "rounded-2xl text-indigo-600 dark:text-indigo-300 font-bold",
            closeButtonClass: "bg-white/50 dark:bg-black/20 rounded-full p-2 text-indigo-400"
        }
    },
    {
        name: "26. Spotlight (Dark Header)",
        description: "Header is dark/colored, body is light/clean.",
        styles: {
            containerClass: "bg-white dark:bg-black shadow-2xl rounded-lg overflow-hidden border border-zinc-200 dark:border-zinc-800",
            headerClass: "bg-zinc-900 text-white py-4 px-6",
            titleClass: "text-white font-medium",
            inputClass: "bg-white dark:bg-zinc-900 border-zinc-300 dark:border-zinc-700 rounded focus:ring-1 focus:ring-zinc-900 dark:focus:ring-white",
            labelClass: "text-zinc-900 dark:text-zinc-100 font-bold text-xs",
            footerClass: "bg-zinc-50 dark:bg-zinc-900 border-t border-zinc-200 dark:border-zinc-800",
            buttonPrimaryClass: "bg-zinc-900 dark:bg-white text-white dark:text-black rounded px-6 font-medium",
            buttonGhostClass: "rounded text-zinc-600 dark:text-zinc-400",
            closeButtonClass: "text-zinc-400 hover:text-white"
        }
    },
    {
        name: "27. Paper Stack (Layered)",
        description: "Looks like a stack of papers. Academic/Researched.",
        styles: {
            containerClass: "bg-white dark:bg-zinc-900 border border-zinc-200 dark:border-zinc-700 shadow-[4px_4px_0_-1px_#fff,4px_4px_0_0_#e4e4e7,8px_8px_0_-1px_#fff,8px_8px_0_0_#e4e4e7] dark:shadow-[4px_4px_0_0_#3f3f46,8px_8px_0_0_#27272a] rounded-sm",
            headerClass: "border-b border-zinc-100 dark:border-zinc-800",
            titleClass: "font-serif italic text-zinc-800 dark:text-zinc-200 text-2xl",
            inputClass: "bg-transparent border-0 border-b border-zinc-300 dark:border-zinc-600 rounded-none px-0 focus:border-blue-500 focus:ring-0",
            labelClass: "text-zinc-400 font-serif italic",
            footerClass: "pt-6",
            buttonPrimaryClass: "bg-blue-600 text-white rounded-sm font-serif italic px-6",
            buttonGhostClass: "font-serif italic text-zinc-500",
            closeButtonClass: "rounded-full hover:bg-zinc-100 dark:hover:bg-zinc-800"
        }
    },
    {
        name: "28. Tech Mono (Developer)",
        description: "Clean, monospaced, grid lines.",
        styles: {
            containerClass: "bg-white dark:bg-[#0d1117] border border-zinc-300 dark:border-zinc-700 shadow-sm rounded-md bg-[linear-gradient(to_right,#80808012_1px,transparent_1px),linear-gradient(to_bottom,#80808012_1px,transparent_1px)] bg-[size:24px_24px]",
            headerClass: "border-b border-zinc-300 dark:border-zinc-700 bg-white/50 dark:bg-black/50 backdrop-blur",
            titleClass: "font-mono text-sm font-bold text-zinc-700 dark:text-zinc-300",
            inputClass: "bg-white dark:bg-[#161b22] border border-zinc-300 dark:border-zinc-700 rounded-md font-mono text-xs focus:border-blue-500",
            labelClass: "font-mono text-[10px] text-zinc-500 uppercase",
            footerClass: "border-t border-zinc-300 dark:border-zinc-700 bg-white/50 dark:bg-black/50",
            buttonPrimaryClass: "bg-[#2da44e] text-white border border-[#2da44e] dark:border-[rgba(240,246,252,0.1)] rounded-md font-mono text-xs font-bold",
            buttonGhostClass: "font-mono text-xs hover:bg-zinc-100 dark:hover:bg-zinc-800 text-zinc-600 dark:text-zinc-400",
            closeButtonClass: "rounded-md hover:bg-red-500 hover:text-white"
        }
    },
    {
        name: "29. Pill & Pastel (Soft UI)",
        description: "Extremely rounded, friendly colors.",
        styles: {
            containerClass: "bg-white dark:bg-zinc-900 border-2 border-indigo-100 dark:border-zinc-800 rounded-[3rem] shadow-xl",
            headerClass: "px-8 pt-8 pb-0",
            titleClass: "text-indigo-950 dark:text-indigo-100 font-bold text-2xl",
            inputClass: "bg-indigo-50/50 dark:bg-zinc-800 border-0 rounded-full px-6 focus:ring-2 focus:ring-indigo-200 dark:focus:ring-indigo-900/50 transition-shadow",
            labelClass: "ml-6 mb-1 text-indigo-400 dark:text-indigo-400 font-bold text-xs uppercase tracking-wider",
            footerClass: "px-8 pb-8 pt-4",
            buttonPrimaryClass: "bg-indigo-500 hover:bg-indigo-600 text-white rounded-full px-8 h-12 font-bold shadow-lg shadow-indigo-200 dark:shadow-none",
            buttonGhostClass: "rounded-full h-12 px-6 text-indigo-400 hover:text-indigo-600 hover:bg-indigo-50 dark:hover:bg-zinc-800",
            closeButtonClass: "bg-indigo-50 dark:bg-zinc-800 rounded-full p-3 text-indigo-400 hover:bg-indigo-100 dark:hover:bg-zinc-700 right-6 top-6 absolute"
        }
    },
    {
        name: "30. Conversation (Chat)",
        description: "Asymmetrical rounded corners, chat bubble vibe.",
        styles: {
            containerClass: "bg-white dark:bg-zinc-900 rounded-tl-3xl rounded-tr-3xl rounded-bl-3xl rounded-br-none shadow-2xl border border-zinc-100 dark:border-zinc-800",
            headerClass: "bg-blue-500 text-white rounded-tl-3xl rounded-tr-3xl py-4",
            titleClass: "text-white font-medium",
            inputClass: "bg-zinc-100 dark:bg-zinc-800 border-transparent focus:bg-white dark:focus:bg-black focus:border-blue-500 rounded-xl rounded-br-none",
            labelClass: "text-blue-500 dark:text-blue-400 font-bold text-xs",
            footerClass: "pt-4",
            buttonPrimaryClass: "bg-blue-500 hover:bg-blue-600 text-white rounded-xl rounded-br-none px-6",
            buttonGhostClass: "rounded-xl rounded-br-none text-zinc-500 hover:text-blue-500 hover:bg-blue-50 dark:hover:bg-zinc-800",
            closeButtonClass: "text-white/70 hover:text-white hover:bg-white/10"
        }
    }
];

export const DesignDecisionsPage = () => {
    const [activeTab, setActiveTab] = React.useState<'modals' | 'ideas-views' | 'dev-cards' | 'standup-controls' | 'headers' | 'assign-modal' | 'standup-cards' | 'filters' | 'standup-history' | 'ticket-details' | 'sprint-designs' | 'sprint-designs-v2' | 'sprint-layouts'>('sprint-layouts');

    return (
        <div className="flex flex-col pb-20">
            <div className="pt-4 md:pt-8 pb-4 space-y-4">
                <div className="flex flex-col gap-2">
                     <h1 className="text-3xl font-bold">Design Decisions</h1>
                     <p className="text-muted-foreground">
                        Exploration of UI patterns and component styles.
                    </p>
                </div>
                
                <div className="flex items-center gap-1 p-1 bg-zinc-100 dark:bg-zinc-800/50 rounded-lg w-fit overflow-x-auto max-w-full">
                    <button 
                        onClick={() => setActiveTab('modals')}
                        className={cn(
                            "px-4 py-1.5 rounded-md text-sm font-medium transition-all whitespace-nowrap",
                            activeTab === 'modals' 
                                ? "bg-white dark:bg-zinc-800 text-foreground shadow-sm" 
                                : "text-muted-foreground hover:text-foreground hover:bg-zinc-200/50 dark:hover:bg-zinc-700/50"
                        )}
                    >
                        Modal Styles
                    </button>
                    <button 
                        onClick={() => setActiveTab('ideas-views')}
                        className={cn(
                            "px-4 py-1.5 rounded-md text-sm font-medium transition-all",
                            activeTab === 'ideas-views' 
                                ? "bg-white dark:bg-zinc-800 text-foreground shadow-sm" 
                                : "text-muted-foreground hover:text-foreground hover:bg-zinc-200/50 dark:hover:bg-zinc-700/50"
                        )}
                    >
                        Ideas View Layouts
                    </button>
                    <button 
                         onClick={() => setActiveTab('dev-cards')}
                         className={cn(
                            "px-4 py-1.5 rounded-md text-sm font-medium transition-all",
                            activeTab === 'dev-cards' 
                                ? "bg-white dark:bg-zinc-800 text-foreground shadow-sm" 
                                : "text-muted-foreground hover:text-foreground hover:bg-zinc-200/50 dark:hover:bg-zinc-700/50"
                        )}
                    >
                        Developer Cards
                    </button>
                    <button 
                         onClick={() => setActiveTab('standup-controls')}
                         className={cn(
                            "px-4 py-1.5 rounded-md text-sm font-medium transition-all whitespace-nowrap",
                            activeTab === 'standup-controls' 
                                ? "bg-white dark:bg-zinc-800 text-foreground shadow-sm" 
                                : "text-muted-foreground hover:text-foreground hover:bg-zinc-200/50 dark:hover:bg-zinc-700/50"
                        )}
                    >
                        Standup Controls
                    </button>
                    <button 
                         onClick={() => setActiveTab('headers')}
                         className={cn(
                            "px-4 py-1.5 rounded-md text-sm font-medium transition-all whitespace-nowrap",
                            activeTab === 'headers' 
                                ? "bg-white dark:bg-zinc-800 text-foreground shadow-sm" 
                                : "text-muted-foreground hover:text-foreground hover:bg-zinc-200/50 dark:hover:bg-zinc-700/50"
                        )}
                    >
                        Headers
                    </button>
                    <button 
                         onClick={() => setActiveTab('sprint-designs')}
                         className={cn(
                            "px-4 py-1.5 rounded-md text-sm font-medium transition-all whitespace-nowrap",
                            activeTab === 'sprint-designs' 
                                ? "bg-white dark:bg-zinc-800 text-foreground shadow-sm" 
                                : "text-muted-foreground hover:text-foreground hover:bg-zinc-200/50 dark:hover:bg-zinc-700/50"
                        )}
                    >
                        Sprint Aesthetic
                    </button>
                    <button 
                         onClick={() => setActiveTab('sprint-designs-v2')}
                         className={cn(
                            "px-4 py-1.5 rounded-md text-sm font-medium transition-all whitespace-nowrap",
                            activeTab === 'sprint-designs-v2' 
                                ? "bg-white dark:bg-zinc-800 text-foreground shadow-sm" 
                                : "text-muted-foreground hover:text-foreground hover:bg-zinc-200/50 dark:hover:bg-zinc-700/50"
                        )}
                    >
                        Sprint Functional
                    </button>
                    <button 
                         onClick={() => setActiveTab('sprint-layouts')}
                         className={cn(
                            "px-4 py-1.5 rounded-md text-sm font-medium transition-all whitespace-nowrap",
                            activeTab === 'sprint-layouts' 
                                ? "bg-white dark:bg-zinc-800 text-foreground shadow-sm" 
                                : "text-muted-foreground hover:text-foreground hover:bg-zinc-200/50 dark:hover:bg-zinc-700/50"
                        )}
                    >
                        Sprint Layouts
                    </button>
                    <button 
                         onClick={() => setActiveTab('filters')}
                         className={cn(
                            "px-4 py-1.5 rounded-md text-sm font-medium transition-all whitespace-nowrap",
                            activeTab === 'filters' 
                                ? "bg-white dark:bg-zinc-800 text-foreground shadow-sm" 
                                : "text-muted-foreground hover:text-foreground hover:bg-zinc-200/50 dark:hover:bg-zinc-700/50"
                        )}
                    >
                        Filters
                    </button>
                    <button 
                         onClick={() => setActiveTab('standup-history')}
                         className={cn(
                            "px-4 py-1.5 rounded-md text-sm font-medium transition-all whitespace-nowrap",
                            activeTab === 'standup-history' 
                                ? "bg-white dark:bg-zinc-800 text-foreground shadow-sm" 
                                : "text-muted-foreground hover:text-foreground hover:bg-zinc-200/50 dark:hover:bg-zinc-700/50"
                        )}
                    >
                        History
                    </button>
                    <button 
                         onClick={() => setActiveTab('assign-modal')}
                         className={cn(
                            "px-4 py-1.5 rounded-md text-sm font-medium transition-all whitespace-nowrap",
                            activeTab === 'assign-modal' 
                                ? "bg-white dark:bg-zinc-800 text-foreground shadow-sm" 
                                : "text-muted-foreground hover:text-foreground hover:bg-zinc-200/50 dark:hover:bg-zinc-700/50"
                        )}
                    >
                        Assign Modal
                    </button>
                    <button 
                         onClick={() => setActiveTab('standup-cards')}
                         className={cn(
                            "px-4 py-1.5 rounded-md text-sm font-medium transition-all whitespace-nowrap",
                            activeTab === 'standup-cards' 
                                ? "bg-white dark:bg-zinc-800 text-foreground shadow-sm" 
                                : "text-muted-foreground hover:text-foreground hover:bg-zinc-200/50 dark:hover:bg-zinc-700/50"
                        )}
                    >
                        User Cards
                    </button>
                    <button 
                         onClick={() => setActiveTab('ticket-details')}
                         className={cn(
                            "px-4 py-1.5 rounded-md text-sm font-medium transition-all whitespace-nowrap",
                            activeTab === 'ticket-details' 
                                ? "bg-white dark:bg-zinc-800 text-foreground shadow-sm" 
                                : "text-muted-foreground hover:text-foreground hover:bg-zinc-200/50 dark:hover:bg-zinc-700/50"
                        )}
                    >
                        Ticket Details
                    </button>

                </div>
            </div>


            {/* Content Area */}
            <div className="flex-1 overflow-auto">
                <div className="max-w-7xl mx-auto p-8 relative">

                    {activeTab === 'ticket-details' && (
                         <div className="animate-in fade-in slide-in-from-bottom-4 duration-500">
                             <TicketDetailsShowcase />
                         </div>
                    )}

                    {activeTab === 'headers' && (
                         <div className="animate-in fade-in slide-in-from-bottom-4 duration-500">
                             <HeaderDesignsShowcase />
                         </div>
                    )}

                    {activeTab === 'sprint-designs' && (
                         <div className="animate-in fade-in slide-in-from-bottom-4 duration-500">
                             <SprintDesignShowcase />
                         </div>
                    )}

                    {activeTab === 'sprint-designs-v2' && (
                         <div className="animate-in fade-in slide-in-from-bottom-4 duration-500">
                             <SprintDesignShowcaseV2 />
                         </div>
                    )}

                    {activeTab === 'sprint-layouts' && (
                         <div className="animate-in fade-in slide-in-from-bottom-4 duration-500">
                             <SprintsPageDesignShowcase />
                         </div>
                    )}

                    {activeTab === 'filters' && (
                         <div className="animate-in fade-in slide-in-from-bottom-4 duration-500">
                             <FilterShowcase />
                         </div>
                    )}

                    {activeTab === 'standup-history' && (
                         <div className="animate-in fade-in slide-in-from-bottom-4 duration-500">
                             <StandupHistoryShowcase />
                         </div>
                    )}

                {activeTab === 'modals' && (
                <div className="space-y-20 animate-in fade-in slide-in-from-bottom-4 duration-500">
                     <div className="space-y-2">
                        <h2 className="text-2xl font-bold">Modal Style Comparison</h2>
                        <p className="text-muted-foreground">
                            Comparison of 30 different modal styles. Left is Light Mode, Right is Dark Mode.
                        </p>
                     </div>
                    {variants.map((variant, index) => (
                        <div key={index} className="space-y-4">
                            <div className="border-b pb-2">
                                <h3 className="text-xl font-bold">{variant.name}</h3>
                                <p className="text-muted-foreground text-sm">{variant.description}</p>
                            </div>
                            
                            <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                                {/* LIGHT MODE PREVIEW */}
                                <div className="p-8 bg-zinc-100 rounded-xl relative overflow-hidden min-h-[500px] flex items-center justify-center border border-zinc-200">
                                    <div className="absolute top-4 left-4 text-xs font-bold text-zinc-400 uppercase tracking-widest">
                                        Light Mode
                                    </div>
                                    <div className="absolute inset-0 pattern-grid-lg opacity-[0.03] pointer-events-none" />
                                    
                                    {/* Force Light Theme Scope if needed, usually default */}
                                    <div className="light w-full flex justify-center">
                                         <IdeaModalContent styleVariant={variant.styles} />
                                    </div>
                                </div>

                                {/* DARK MODE PREVIEW */}
                                <div className="p-8 bg-zinc-950 rounded-xl relative overflow-hidden min-h-[500px] flex items-center justify-center border border-zinc-900 dark">
                                    <div className="absolute top-4 left-4 text-xs font-bold text-zinc-600 uppercase tracking-widest">
                                        Dark Mode
                                    </div>
                                     <div className="absolute inset-0 pattern-grid-lg opacity-[0.05] bg-[radial-gradient(ellipse_at_top,_var(--tw-gradient-stops))] from-zinc-800/20 via-zinc-950/0 to-zinc-950/0 pointer-events-none" />
                                    
                                    <div className="w-full flex justify-center text-foreground">
                                        <IdeaModalContent styleVariant={variant.styles} />
                                    </div>
                                </div>
                            </div>
                        </div>
                    ))}
                </div>
            )}

            {activeTab === 'dev-cards' && (
                 <div className="animate-in fade-in slide-in-from-bottom-4 duration-500">
                    <DeveloperCardVariants />
                 </div>
            )}
            
            {activeTab === 'standup-controls' && (
                 <div className="animate-in fade-in slide-in-from-bottom-4 duration-500">
                    <StandupControlVariants />
                 </div>
            )}



            {activeTab === 'assign-modal' && (
                 <div className="animate-in fade-in slide-in-from-bottom-4 duration-500">
                    <AssignTaskShowcase />
                 </div>
            )}

            {activeTab === 'standup-cards' && (
                 <div className="animate-in fade-in slide-in-from-bottom-4 duration-500">
                    <StandupCardShowcase />
                 </div>
            )}

            {activeTab === 'ideas-views' && (
                <div className="space-y-20 animate-in fade-in slide-in-from-bottom-4 duration-500">
                    <div className="space-y-2">
                        <h2 className="text-2xl font-bold">Ideas Board Redesigns</h2>
                        <p className="text-muted-foreground">
                            5 concepts for displaying the Ideas Board.
                        </p>
                    </div>

                    {/* 1. Enhanced Kanban */}
                    <div className="space-y-4">
                        <h3 className="text-xl font-bold">1. Refined Kanban</h3>
                        <div className="p-6 bg-zinc-50 dark:bg-zinc-900 border rounded-xl space-y-4">
                            <div className="flex gap-4 overflow-x-auto pb-4">
                                {['Backlog', 'In Review', 'Approved'].map(col => (
                                    <div key={col} className="w-72 shrink-0 flex flex-col gap-3">
                                        <div className="flex items-center justify-between">
                                            <span className="font-bold text-sm text-zinc-500 uppercase">{col}</span>
                                            <span className="text-xs bg-zinc-200 dark:bg-zinc-800 px-2 py-0.5 rounded-full">3</span>
                                        </div>
                                        <div className="space-y-2">
                                            {[1, 2, 3].map(i => (
                                                <div key={i} className="bg-white dark:bg-zinc-950 p-4 rounded-lg border shadow-sm flex flex-col gap-2">
                                                    <div className="flex justify-between items-start">
                                                         <span className="text-xs font-bold text-blue-600 bg-blue-50 dark:bg-blue-900/20 px-1.5 py-0.5 rounded">FEATURE</span>
                                                         <span className="text-zinc-400 text-xs">Dec {i + 10}</span>
                                                    </div>
                                                    <p className="font-medium text-sm">Allow Google Login for SSO users</p>
                                                    <div className="flex items-center gap-2 mt-2">
                                                        <div className="w-5 h-5 rounded-full bg-indigo-500 flex items-center justify-center text-[10px] text-white">JD</div>
                                                        <span className="text-xs text-zinc-500">Reported via Client</span>
                                                    </div>
                                                </div>
                                            ))}
                                        </div>
                                        <Button variant="ghost" className="w-full text-zinc-400 hover:text-zinc-600 text-sm border border-dashed border-zinc-300 dark:border-zinc-700">+ Add Idea</Button>
                                    </div>
                                ))}
                            </div>
                        </div>
                    </div>

                    {/* 2. Data Table (Requested) */}
                    <div className="space-y-4">
                        <h3 className="text-xl font-bold">2. Dense Data Table</h3>
                        <div className="border rounded-xl rounded-b-xl overflow-hidden shadow-sm">
                            <div className="bg-zinc-50 dark:bg-zinc-900 border-b px-6 py-3 grid grid-cols-12 gap-4 text-xs font-bold uppercase text-zinc-500 tracking-wider">
                                <div className="col-span-5">Title & Description</div>
                                <div className="col-span-2">Status</div>
                                <div className="col-span-2">Priority</div>
                                <div className="col-span-2">Reporter</div>
                                <div className="col-span-1 text-right">Actions</div>
                            </div>
                            <div className="divide-y dark:divide-zinc-800">
                                {[1, 2, 3, 4, 5].map(i => (
                                    <div key={i} className="bg-white dark:bg-zinc-950 px-6 py-3 grid grid-cols-12 gap-4 items-center hover:bg-zinc-50/50 dark:hover:bg-zinc-900/50 transition-colors group">
                                        <div className="col-span-5 flex flex-col">
                                            <span className="font-medium text-sm">Implement Two-Factor Authentication</span>
                                            <span className="text-xs text-zinc-500 truncate">Customer request from Coca-Cola to improve security...</span>
                                        </div>
                                        <div className="col-span-2">
                                            <div className="flex items-center gap-1.5">
                                                <div className="w-2 h-2 rounded-full bg-orange-500"></div>
                                                <span className="text-sm">In Review</span>
                                            </div>
                                        </div>
                                        <div className="col-span-2">
                                            <span className="bg-red-100 dark:bg-red-900/30 text-red-700 dark:text-red-400 text-xs px-2 py-1 rounded font-medium">P1 - High</span>
                                        </div>
                                        <div className="col-span-2 flex items-center gap-2">
                                            <div className="w-6 h-6 rounded-full bg-purple-100 text-purple-600 flex items-center justify-center text-xs font-bold">MK</div>
                                            <span className="text-sm">Mike K.</span>
                                        </div>
                                        <div className="col-span-1 text-right opacity-0 group-hover:opacity-100 transition-opacity">
                                            <Button variant="ghost" size="sm" className="h-8 w-8 p-0"><ChevronDown size={14} /></Button>
                                        </div>
                                    </div>
                                ))}
                            </div>
                        </div>
                    </div>


                    {/* 3. Linear List */}
                    <div className="space-y-4">
                        <h3 className="text-xl font-bold">3. Linear Style List</h3>
                        <div className="max-w-3xl space-y-1">
                            {[1, 2, 3, 4].map(i => (
                                <div key={i} className="group flex items-center gap-4 py-2 px-3 rounded hover:bg-zinc-100 dark:hover:bg-zinc-800 cursor-pointer">
                                    <span className="text-zinc-400 font-mono text-xs">IDS-{100+i}</span>
                                    <div className="w-4 h-4 rounded-full border border-zinc-300 dark:border-zinc-600 flex items-center justify-center">
                                         {i % 2 === 0 && <div className="w-2 h-2 bg-zinc-400 rounded-full" />}
                                    </div>
                                    <span className="flex-1 text-sm font-medium text-zinc-800 dark:text-zinc-200">
                                        Export capabilities for daily reports
                                    </span>
                                    <span className="px-2 py-0.5 rounded text-[10px] bg-zinc-100 dark:bg-zinc-900 text-zinc-500 border border-zinc-200 dark:border-zinc-700">Tag</span>
                                    <div className="w-5 h-5 rounded-full bg-zinc-200 dark:bg-zinc-800 text-[10px] flex items-center justify-center">AB</div>
                                    <span className="text-xs text-zinc-400">Oct 24</span>
                                </div>
                            ))}
                        </div>
                    </div>

                    {/* 4. Visual Masonry Grid */}
                    <div className="space-y-4">
                        <h3 className="text-xl font-bold">4. Visual Masonry Grid</h3>
                        <div className="columns-1 md:columns-3 gap-4 space-y-4">
                            {[1, 2, 3, 4, 5, 6].map(i => (
                                <div key={i} className="break-inside-avoid bg-white dark:bg-zinc-900 border p-4 rounded-xl shadow-sm hover:shadow-md transition-shadow space-y-3">
                                    <div className="h-24 bg-gradient-to-br from-indigo-500/10 to-purple-500/10 rounded-lg flex items-center justify-center">
                                        <Lightbulb size={24} className="text-indigo-300" />
                                    </div>
                                    <div className="space-y-1">
                                        <h4 className="font-bold">Dark Mode UI Polish</h4>
                                        <p className="text-xs text-zinc-500 leading-relaxed">
                                            The contrast on the sidebar needs adjustment. Users are reporting eye strain during night shifts.
                                        </p>
                                    </div>
                                    <div className="flex items-center justify-between pt-2 border-t border-dashed">
                                        <div className="flex -space-x-2">
                                            <div className="w-6 h-6 rounded-full bg-blue-500 border-2 border-white dark:border-zinc-900"></div>
                                           <div className="w-6 h-6 rounded-full bg-green-500 border-2 border-white dark:border-zinc-900"></div>
                                        </div>
                                        <span className="text-xs font-bold text-zinc-400">24 votes</span>
                                    </div>
                                </div>
                            ))}
                        </div>
                    </div>

                    {/* 5. Timeline / Feed */}
                    <div className="space-y-4">
                        <h3 className="text-xl font-bold">5. Timeline Feed</h3>
                        <div className="border-l-2 border-zinc-200 dark:border-zinc-800 ml-4 space-y-8 pl-8 py-4">
                            {[1, 2, 3].map(i => (
                                <div key={i} className="relative">
                                    <div className="absolute -left-[41px] top-0 w-5 h-5 rounded-full bg-zinc-100 dark:bg-zinc-800 border-2 border-zinc-300 dark:border-zinc-600 z-10"></div>
                                    <div className="flex flex-col gap-2">
                                        <div className="flex items-center gap-2">
                                            <span className="font-bold text-sm">New Idea from Sarah</span>
                                            <span className="text-xs text-zinc-500">2 hours ago</span>
                                        </div>
                                        <div className="bg-white dark:bg-zinc-900 p-4 border rounded-lg rounded-tl-none shadow-sm">
                                            <h4 className="font-medium">Integrate with Slack</h4>
                                            <p className="text-sm text-zinc-500 mt-1">We should allow notifications to channel.</p>
                                            <div className="mt-3 flex gap-2">
                                                <Button size="sm" variant="outline" className="h-7 text-xs">Upvote</Button>
                                                <Button size="sm" variant="outline" className="h-7 text-xs">Comment</Button>
                                            </div>
                                        </div>
                                    </div>
                                </div>
                            ))}
                        </div>
                    </div>


                    {/* 6. Professional Spreadsheet */}
                    <div className="space-y-4">
                         <h3 className="text-xl font-bold">6. Professional Spreadsheet</h3>
                         <div className="border border-zinc-300 dark:border-zinc-700 bg-white dark:bg-zinc-950 overflow-hidden text-[11px] font-mono">
                            <div className="flex border-b border-zinc-300 dark:border-zinc-700 bg-zinc-100 dark:bg-zinc-900">
                                <div className="w-10 border-r border-zinc-300 dark:border-zinc-700 p-1 text-center text-zinc-500 font-bold"></div>
                                <div className="w-10 border-r border-zinc-300 dark:border-zinc-700 p-1 text-center font-bold">A</div>
                                <div className="flex-1 border-r border-zinc-300 dark:border-zinc-700 p-1 font-bold pl-2">B (Title)</div>
                                <div className="w-24 border-r border-zinc-300 dark:border-zinc-700 p-1 font-bold pl-2">C (Status)</div>
                                <div className="w-24 border-r border-zinc-300 dark:border-zinc-700 p-1 font-bold pl-2">D (Priority)</div>
                                <div className="w-32 border-r border-zinc-300 dark:border-zinc-700 p-1 font-bold pl-2">E (Reporter)</div>
                            </div>
                            {[1, 2, 3, 4, 5, 6].map(i => (
                                <div key={i} className="flex border-b border-zinc-200 dark:border-zinc-800 last:border-0 hover:bg-blue-50 dark:hover:bg-blue-900/10">
                                    <div className="w-10 border-r border-zinc-200 dark:border-zinc-800 bg-zinc-50 dark:bg-zinc-900 p-1 text-center text-zinc-500 font-bold">{i}</div>
                                    <div className="w-10 border-r border-zinc-200 dark:border-zinc-800 p-1 text-center text-zinc-400">ID{i}</div>
                                    <div className="flex-1 border-r border-zinc-200 dark:border-zinc-800 p-1 pl-2 truncate">Fix authentication flow on mobile devices</div>
                                    <div className="w-24 border-r border-zinc-200 dark:border-zinc-800 p-1 pl-2 text-orange-600 dark:text-orange-400">Pending</div>
                                    <div className="w-24 border-r border-zinc-200 dark:border-zinc-800 p-1 pl-2 font-bold">P1</div>
                                    <div className="w-32 border-r border-zinc-200 dark:border-zinc-800 p-1 pl-2 text-zinc-600 dark:text-zinc-400">john.doe@acme.com</div>
                                </div>
                            ))}
                         </div>
                    </div>

                    {/* 7. Minimal Text-Only */}
                    <div className="space-y-4">
                        <h3 className="text-xl font-bold">7. Minimal Text-Only</h3>
                        <div className="max-w-2xl space-y-4">
                            {[1, 2, 3, 4].map(i => (
                                <div key={i} className="group">
                                    <div className="flex items-baseline gap-2">
                                        <span className="text-sm font-bold text-zinc-900 dark:text-zinc-100 hover:underline cursor-pointer">
                                            Allow users to bulk export data to CSV
                                        </span>
                                        <span className="text-xs text-zinc-400">#feature</span>
                                        <span className="text-xs text-zinc-400">by @sarah</span>
                                    </div>
                                    <div className="pl-0 mt-1 flex gap-3 text-[10px] text-zinc-500 uppercase tracking-wider font-medium opacity-0 group-hover:opacity-100 transition-opacity">
                                        <button className="hover:text-zinc-900 dark:hover:text-zinc-100">Edit</button>
                                        <button className="hover:text-zinc-900 dark:hover:text-zinc-100">Approve</button>
                                        <button className="hover:text-zinc-900 dark:hover:text-zinc-100">Delete</button>
                                    </div>
                                </div>
                            ))}
                        </div>
                    </div>
                </div>
            )}
        </div>
    </div>
</div>
    );
};


