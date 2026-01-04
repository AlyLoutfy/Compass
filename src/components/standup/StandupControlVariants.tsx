
import { Button } from '../ui/Button';
import { Pause, RotateCcw, Check, Dice5 } from 'lucide-react';
import { cn } from '@/lib/utils';


const MockControlBar = ({ variant, style }: { variant: any, style?: any }) => {
    const { 
        containerClass, 
        timerClass, 
        buttonClass, 
        primaryButtonClass,
        iconClass,
        separatorClass
    } = variant;

    return (
        <div className={cn("p-4 flex items-center justify-between gap-4 max-w-2xl mx-auto", containerClass)} style={style}>
           <div className="flex items-center gap-4">
                <span className={cn("font-mono font-bold text-2xl", timerClass)}>14:45</span>
                <div className="flex gap-1">
                    <button className={cn("p-2 rounded-full transition-colors", buttonClass)}><Pause size={18} /></button>
                    <button className={cn("p-2 rounded-full transition-colors opacity-70", buttonClass)}><RotateCcw size={16} /></button>
                </div>
           </div>

           <div className={cn("h-8 w-px", separatorClass)} />

           <div className="flex items-center gap-2">
                <Button className={cn("gap-2", buttonClass)}>
                    <Dice5 size={18} className={iconClass} />
                    Who's Next?
                </Button>
                <Button className={cn("gap-2", primaryButtonClass)}>
                    <Check size={18} />
                    Finish
                </Button>
           </div>
        </div>
    );
};

const variants = [
    {
        name: "1. Current Default",
        containerClass: "bg-zinc-900 border border-zinc-800 text-white rounded-full shadow-2xl",
        timerClass: "text-white",
        buttonClass: "bg-zinc-800 hover:bg-zinc-700 text-white border-zinc-700 rounded-xl",
        primaryButtonClass: "bg-green-600 hover:bg-green-500 text-white rounded-xl",
        iconClass: "text-purple-400",
        separatorClass: "bg-white/10"
    },
    {
        name: "2. Glassmorphism Light",
        containerClass: "bg-white/70 backdrop-blur-xl border border-white/40 shadow-xl rounded-2xl text-zinc-800",
        timerClass: "text-zinc-900",
        buttonClass: "bg-white/50 hover:bg-white text-zinc-700 hover:text-black border border-white/50 rounded-lg shadow-sm",
        primaryButtonClass: "bg-blue-600 text-white rounded-lg shadow-lg shadow-blue-500/20",
        iconClass: "text-blue-500",
        separatorClass: "bg-zinc-300"
    },
    {
        name: "3. Apple Dynamic Island",
        containerClass: "bg-black text-white rounded-[32px] px-6 py-3 shadow-2xl border border-zinc-800",
        timerClass: "text-white tracking-widest",
        buttonClass: "bg-zinc-800 hover:bg-zinc-700 rounded-full px-5 text-sm font-medium",
        primaryButtonClass: "bg-white text-black hover:bg-zinc-200 rounded-full px-5 font-bold",
        iconClass: "text-zinc-400",
        separatorClass: "bg-zinc-800"
    },
    {
        name: "4. Neon Cyberpunk",
        containerClass: "bg-black border border-cyan-500/50 shadow-[0_0_20px_rgba(6,182,212,0.3)] rounded-lg text-cyan-50",
        timerClass: "text-cyan-400 font-bold drop-shadow-[0_0_5px_rgba(6,182,212,0.8)]",
        buttonClass: "bg-cyan-950/30 border border-cyan-500/30 text-cyan-400 hover:bg-cyan-500/10 rounded-sm font-mono uppercase tracking-wider text-xs",
        primaryButtonClass: "bg-cyan-500 text-black font-bold uppercase tracking-widest rounded-sm shadow-[0_0_10px_rgba(6,182,212,0.5)] hover:bg-cyan-400",
        iconClass: "text-cyan-300",
        separatorClass: "bg-cyan-900"
    },
    {
        name: "5. Soft & Playful (Clay)",
        containerClass: "bg-indigo-50 border-2 border-indigo-100 shadow-[8px_8px_16px_rgba(165,180,252,0.4),-8px_-8px_16px_rgba(255,255,255,0.8)] rounded-[40px] text-indigo-900",
        timerClass: "text-indigo-600 font-extrabold",
        buttonClass: "bg-white border-2 border-indigo-50 shadow-sm text-indigo-500 font-bold rounded-2xl hover:scale-105 transition-transform",
        primaryButtonClass: "bg-indigo-500 text-white font-bold rounded-2xl shadow-lg shadow-indigo-300 hover:scale-105 transition-transform",
        iconClass: "text-indigo-400",
        separatorClass: "bg-indigo-200"
    },
    {
        name: "6. Minimal Outline",
        containerClass: "bg-white border-2 border-zinc-900 shadow-[4px_4px_0_0_#000] rounded-lg text-black",
        timerClass: "text-black font-black",
        buttonClass: "bg-white border-2 border-black rounded-md hover:bg-zinc-50 font-bold text-sm shadow-[2px_2px_0_0_#000] active:translate-y-[2px] active:shadow-none transition-all",
        primaryButtonClass: "bg-black text-white border-2 border-black rounded-md font-bold shadow-[2px_2px_0_0_#999] active:translate-y-[2px] active:shadow-none transition-all",
        iconClass: "text-black",
        separatorClass: "bg-black w-0.5"
    },
    {
        name: "7. Gradient Mesh",
        containerClass: "bg-gradient-to-r from-violet-600 to-indigo-600 text-white rounded-2xl shadow-2xl border border-white/10",
        timerClass: "text-white drop-shadow-md",
        buttonClass: "bg-white/10 hover:bg-white/20 border border-white/10 rounded-xl backdrop-blur-md",
        primaryButtonClass: "bg-white text-indigo-600 font-bold rounded-xl shadow-lg",
        iconClass: "text-violet-200",
        separatorClass: "bg-white/20"
    },
    {
        name: "8. Floating Islands (Split)",
        containerClass: "bg-transparent shadow-none border-none p-0 gap-8 justify-center",
        timerClass: "bg-zinc-900 text-white px-6 py-3 rounded-2xl shadow-xl",
        buttonClass: "bg-white shadow-lg border border-zinc-100 text-zinc-600 rounded-xl hover:bg-zinc-50",
        primaryButtonClass: "bg-zinc-900 text-white shadow-xl rounded-xl hover:scale-105 transition-transform",
        iconClass: "text-zinc-400",
        separatorClass: "hidden" // No separator for split
    },
    {
        name: "9. Brutalist Mono",
        containerClass: "bg-zinc-100 border-b-4 border-r-4 border-zinc-900 rounded-none text-black font-mono",
        timerClass: "font-black underline decoration-4 decoration-yellow-400",
        buttonClass: "rounded-none border-2 border-black uppercase text-xs font-bold bg-white hover:bg-yellow-200",
        primaryButtonClass: "rounded-none border-2 border-black bg-black text-white uppercase text-xs font-bold hover:bg-yellow-400 hover:text-black",
        iconClass: "text-black",
        separatorClass: "bg-black w-0.5 h-6"
    },
    {
        name: "10. Material Surface",
        containerClass: "bg-[#2d2d2d] text-white rounded-md shadow-[0_3px_15px_rgba(0,0,0,0.5)] border-t border-white/5",
        timerClass: "text-white/90 font-medium",
        buttonClass: "uppercase text-xs font-bold tracking-wider hover:bg-white/5 rounded text-white/80",
        primaryButtonClass: "bg-[#bb86fc] text-black font-bold uppercase text-xs tracking-wider rounded shadow-md hover:bg-[#bb86fc]/90",
        iconClass: "text-[#bb86fc]",
        separatorClass: "bg-white/10"
    },
    {
        name: "11. Retro Terminal",
        containerClass: "bg-[#1a1b26] border border-[#414868] rounded-md shadow-lg font-mono",
        timerClass: "text-[#7aa2f7]",
        buttonClass: "text-[#c0caf5] hover:bg-[#414868] rounded px-3 py-1",
        primaryButtonClass: "bg-[#7aa2f7] text-[#1a1b26] font-bold rounded px-4 py-1 hover:bg-[#7dcfff]",
        iconClass: "text-[#bb9af7]",
        separatorClass: "bg-[#414868]"
    },
    {
        name: "12. Frosted Glass (Strong)",
        containerClass: "bg-white/10 backdrop-blur-xl border border-white/20 rounded-full shadow-2xl text-white",
        timerClass: "font-bold",
        buttonClass: "bg-white/10 hover:bg-white/20 rounded-full border border-white/10",
        primaryButtonClass: "bg-white/90 hover:bg-white text-black font-bold rounded-full",
        iconClass: "text-white/70",
        separatorClass: "bg-white/10"
    },
    {
        name: "13. Pill Shaped (Compact)",
        containerClass: "bg-zinc-900 rounded-full py-2 px-3 border border-zinc-800",
        timerClass: "text-sm",
        buttonClass: "h-8 px-3 rounded-full bg-zinc-800 text-xs",
        primaryButtonClass: "h-8 px-4 rounded-full bg-blue-600 text-xs",
        iconClass: "w-3 h-3",
        separatorClass: "h-4"
    },
    {
        name: "14. Gaming HUD",
        containerClass: "bg-transparent border-t-2 border-red-600 bg-gradient-to-b from-black/80 to-black/40 backdrop-blur-sm rounded-none w-full max-w-none fixed bottom-0 left-0 right-0 justify-center", // Full width bar
        timerClass: "text-3xl font-black italic text-red-500",
        buttonClass: "skew-x-[-10deg] border border-red-900 bg-red-950/30 text-red-200 hover:bg-red-900/50 rounded-none",
        primaryButtonClass: "skew-x-[-10deg] bg-red-600 text-white font-bold uppercase rounded-none px-8",
        iconClass: "text-red-400",
        separatorClass: "bg-red-900 w-0.5 h-10 skew-x-[-10deg]"
    },
    {
         name: "15. Stripe Dashboard",
         containerClass: "bg-white text-slate-600 shadow-xl rounded-lg border border-slate-200",
         timerClass: "text-slate-800 font-semibold",
         buttonClass: "bg-slate-50 border border-slate-200 text-slate-600 hover:text-slate-900 hover:bg-white shadow-sm rounded-md font-medium text-sm",
         primaryButtonClass: "bg-[#635bff] text-white hover:bg-[#4d43f0] shadow-md shadow-indigo-500/20 rounded-md font-medium text-sm",
         iconClass: "text-indigo-500",
         separatorClass: "bg-slate-200"
    }
];

export const StandupControlVariants = () => {
    return (
        <div className="space-y-12 pb-24">
            <div className="space-y-2">
                <h2 className="text-2xl font-bold">Standup Control Bar Variations</h2>
                <p className="text-muted-foreground">
                    15 different styles for the standup timer and controls.
                </p>
            </div>

            <div className="grid gap-8">
                {variants.map((v, i) => (
                    <div key={i} className="space-y-2">
                        <h3 className="text-sm font-semibold text-muted-foreground ml-2">{v.name}</h3>
                        {/* Wrapper to simulate context */}
                        <div className="p-8 bg-zinc-100 dark:bg-zinc-950/50 rounded-xl border border-dashed border-zinc-300 dark:border-zinc-800 flex items-center justify-center relative min-h-[120px]">
                            {/* Background decoration for glass ones */}
                            <div className="absolute inset-0 bg-grid-zinc-200/50 dark:bg-grid-zinc-800/50 [mask-image:linear-gradient(to_bottom,white,transparent)]" />
                            
                            <MockControlBar variant={v} />
                        </div>
                    </div>
                ))}
            </div>
        </div>
    );
};
