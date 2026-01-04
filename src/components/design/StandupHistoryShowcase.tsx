import { Clock } from 'lucide-react';
import { cn } from '@/lib/utils';

// -- MOCK DATA --
const mockReports = [
    { id: '1', date: new Date().toISOString(), durationSeconds: 450, attendees: 8, status: 'completed' },
    { id: '2', date: new Date(Date.now() - 86400000).toISOString(), durationSeconds: 320, attendees: 7, status: 'completed' },
    { id: '3', date: new Date(Date.now() - 86400000 * 2).toISOString(), durationSeconds: 512, attendees: 8, status: 'completed' },
    { id: '4', date: new Date(Date.now() - 86400000 * 3).toISOString(), durationSeconds: 410, attendees: 6, status: 'completed' }
];

const Container = ({ title, children, className }: { title: string, children: React.ReactNode, className?: string }) => (
    <div className={cn("p-6 border border-zinc-200 dark:border-zinc-800 rounded-xl bg-zinc-50/50 dark:bg-zinc-900/20", className)}>
        <h3 className="text-sm font-semibold text-muted-foreground uppercase tracking-wider mb-4">{title}</h3>
        <div className="bg-background rounded-lg border border-zinc-200 dark:border-zinc-800 shadow-sm overflow-hidden p-0 max-w-sm mx-auto">
            {children}
        </div>
    </div>
);

export const StandupHistoryShowcase = () => {
    return (
        <div className="space-y-12 pb-20 max-w-5xl mx-auto">
             <div className="space-y-2">
                <h2 className="text-3xl font-bold tracking-tight">Calendar Block Iterations</h2>
                <p className="text-muted-foreground">10 Variations of the Calendar Block aesthetic, focusing on clear date and month display.</p>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
                
                {/* 1. Tear-off Calendar */}
                <Container title="1. Tear-off Calendar">
                    <div className="grid grid-cols-2 p-3 gap-3">
                        {mockReports.map((report, i) => (
                            <div key={i} className="rounded-lg overflow-hidden border border-zinc-200 dark:border-zinc-800 shadow-sm hover:shadow-md transition-all cursor-pointer bg-white dark:bg-zinc-900 group">
                                <div className="bg-red-500 text-white text-[10px] font-bold uppercase text-center py-1">
                                    {new Date(report.date).toLocaleDateString(undefined, { month: 'short' })}
                                </div>
                                <div className="p-2 text-center flex flex-col items-center">
                                    <span className="text-xl font-bold leading-none">{new Date(report.date).getDate()}</span>
                                    <span className="text-[10px] text-zinc-500 uppercase mt-1">{new Date(report.date).toLocaleDateString(undefined, { weekday: 'short' })}</span>
                                </div>
                            </div>
                        ))}
                    </div>
                </Container>

                {/* 2. Modern Minimal */}
                <Container title="2. Modern Minimal Poster">
                    <div className="grid grid-cols-2 p-3 gap-3">
                         {mockReports.map((report, i) => (
                            <div key={i} className="aspect-square rounded-xl border border-zinc-200 dark:border-zinc-800 p-2 flex flex-col justify-between hover:border-black dark:hover:border-white transition-colors cursor-pointer bg-white dark:bg-zinc-900 relative overflow-hidden group">
                                <span className="absolute -right-2 -top-2 text-6xl font-bold text-zinc-50 dark:text-zinc-800/50 -z-10 group-hover:text-zinc-100 dark:group-hover:text-zinc-800 transition-colors">
                                    {new Date(report.date).getDate()}
                                </span>
                                <div className="flex justify-between w-full">
                                    <span className="text-xs font-semibold text-zinc-900 dark:text-zinc-100">{new Date(report.date).toLocaleDateString(undefined, { month: 'short' })}</span>
                                     {i === 0 && <div className="w-1.5 h-1.5 bg-blue-500 rounded-full" />}
                                </div>
                                <div>
                                    <span className="text-2xl font-bold tracking-tighter block">{new Date(report.date).getDate()}</span>
                                    <span className="text-[10px] text-zinc-400 uppercase">{new Date(report.date).toLocaleDateString(undefined, { weekday: 'long' })}</span>
                                </div>
                            </div>
                        ))}
                    </div>
                </Container>

                {/* 3. Split Layout */}
                <Container title="3. Split Color">
                    <div className="grid grid-cols-2 p-3 gap-3">
                         {mockReports.map((report, i) => (
                            <div key={i} className="rounded-lg border border-zinc-200 dark:border-zinc-800 flex overflow-hidden h-16 cursor-pointer hover:border-zinc-400 transition-all">
                                <div className={cn("w-1/3 flex items-center justify-center font-bold text-xs uppercase flex-col", i === 0 ? "bg-zinc-900 text-white dark:bg-zinc-100 dark:text-black" : "bg-zinc-100 dark:bg-zinc-800 text-zinc-500")}>
                                    <span>{new Date(report.date).toLocaleDateString(undefined, { month: 'short' })}</span>
                                </div>
                                <div className="w-2/3 bg-white dark:bg-zinc-900 flex flex-col items-center justify-center">
                                    <span className="text-xl font-black">{new Date(report.date).getDate()}</span>
                                </div>
                            </div>
                        ))}
                    </div>
                </Container>

                {/* 4. Glass Badge */}
                <Container title="4. Glass Badge Date">
                    <div className="grid grid-cols-2 p-3 gap-3">
                         {mockReports.map((report, i) => (
                            <div key={i} className="aspect-square rounded-2xl bg-gradient-to-br from-zinc-50 to-zinc-100 dark:from-zinc-900 dark:to-zinc-950 border border-white dark:border-zinc-800 shadow-sm p-2 relative flex flex-col items-center justify-center cursor-pointer group">
                                <div className="absolute top-2 left-2 right-2 flex justify-between">
                                    <span className="text-[10px] font-bold text-zinc-400">{new Date(report.date).toLocaleDateString(undefined, { month: 'long' })}</span>
                                </div>
                                <span className="text-3xl font-black text-zinc-800 dark:text-zinc-200 group-hover:scale-110 transition-transform">{new Date(report.date).getDate()}</span>
                                <div className="absolute bottom-2 text-[10px] bg-white/50 dark:bg-black/50 backdrop-blur-sm px-2 py-0.5 rounded-full border border-black/5 dark:border-white/5">
                                    {Math.floor(report.durationSeconds / 60)}m
                                </div>
                            </div>
                        ))}
                    </div>
                </Container>

                {/* 5. Sticky Note */}
                <Container title="5. Sticky Squares">
                    <div className="grid grid-cols-2 p-3 gap-3">
                         {mockReports.map((report, i) => (
                            <div key={i} className="aspect-square bg-yellow-50 dark:bg-yellow-900/10 border border-yellow-200 dark:border-yellow-900/30 rounded-none shadow-[2px_2px_0_0_rgba(0,0,0,0.05)] p-3 flex flex-col justify-between cursor-pointer hover:-translate-y-0.5 transition-transform origin-top-left">
                                <div className="border-b border-yellow-200 dark:border-yellow-900/30 pb-1 mb-1 flex justify-between items-center text-yellow-800 dark:text-yellow-500">
                                    <span className="text-xs font-bold uppercase">{new Date(report.date).toLocaleDateString(undefined, { month: 'short' })}</span>
                                    {i === 0 && <Clock size={10} />}
                                </div>
                                <div className="text-center">
                                    <span className="text-2xl font-handwriting font-bold text-yellow-950 dark:text-yellow-200">{new Date(report.date).getDate()}</span>
                                </div>
                            </div>
                        ))}
                    </div>
                </Container>

                {/* 6. Dark Mode Neon (Cyber) */}
                <Container title="6. Cyber Date">
                    <div className="grid grid-cols-2 p-3 gap-3 bg-black">
                         {mockReports.map((report, i) => (
                            <div key={i} className="aspect-square bg-zinc-900 border border-zinc-800 rounded-lg p-3 flex flex-col justify-center items-center cursor-pointer hover:border-purple-500 hover:shadow-[0_0_10px_rgba(168,85,247,0.2)] transition-all group">
                                <span className="text-[10px] text-zinc-500 font-mono mb-1">{new Date(report.date).toLocaleDateString(undefined, { month: 'short' }).toUpperCase()}</span>
                                <span className="text-3xl font-mono font-bold text-white group-hover:text-purple-400">{new Date(report.date).getDate()}</span>
                                <span className="text-[9px] text-zinc-600 mt-2 font-mono">{report.attendees} ATTENDEES</span>
                            </div>
                        ))}
                    </div>
                </Container>

                {/* 7. Rounded Bubble */}
                <Container title="7. Circle Date">
                    <div className="grid grid-cols-2 p-3 gap-3">
                         {mockReports.map((report, i) => (
                            <div key={i} className="aspect-square rounded-full border border-zinc-200 dark:border-zinc-800 bg-white dark:bg-zinc-900 flex flex-col items-center justify-center cursor-pointer hover:border-zinc-400 hover:scale-105 transition-all shadow-sm">
                                <span className="text-[10px] font-bold text-zinc-400 uppercase tracking-widest">{new Date(report.date).toLocaleDateString(undefined, { month: 'short' })}</span>
                                <span className="text-2xl font-bold text-zinc-800 dark:text-zinc-200">{new Date(report.date).getDate()}</span>
                                {i === 0 && <div className="w-1 h-1 bg-red-500 rounded-full mt-1" />}
                            </div>
                        ))}
                    </div>
                </Container>

                {/* 8. Detailed Stats Block */}
                <Container title="8. Data Block">
                    <div className="grid grid-cols-2 p-2 gap-2">
                         {mockReports.map((report, i) => (
                            <div key={i} className="rounded-lg border border-zinc-200 dark:border-zinc-800 bg-zinc-50 dark:bg-zinc-900 p-2 cursor-pointer hover:bg-white dark:hover:bg-zinc-950 transition-colors">
                                <div className="flex justify-between items-baseline border-b border-zinc-200 dark:border-zinc-800 pb-1 mb-1">
                                    <span className="text-lg font-bold">{new Date(report.date).getDate()}</span>
                                    <span className="text-xs font-medium text-zinc-500">{new Date(report.date).toLocaleDateString(undefined, { month: 'short' })}</span>
                                </div>
                                <div className="space-y-1">
                                    <div className="flex justify-between text-[10px] text-zinc-500">
                                        <span>Dur</span>
                                        <span className="font-mono text-zinc-900 dark:text-zinc-300">{Math.floor(report.durationSeconds / 60)}m</span>
                                    </div>
                                    <div className="flex justify-between text-[10px] text-zinc-500">
                                        <span>Team</span>
                                        <span className="font-mono text-zinc-900 dark:text-zinc-300">{report.attendees}</span>
                                    </div>
                                </div>
                            </div>
                        ))}
                    </div>
                </Container>

                {/* 9. Image / Gradient Top */}
                <Container title="9. Gradient Header">
                    <div className="grid grid-cols-2 p-3 gap-3">
                         {mockReports.map((report, i) => (
                            <div key={i} className="rounded-xl overflow-hidden border border-zinc-200 dark:border-zinc-800 shadow-sm cursor-pointer hover:-translate-y-1 transition-transform bg-white dark:bg-zinc-900">
                                <div className={cn("h-8 flex items-center justify-center text-xs font-bold text-white uppercase tracking-wider", 
                                    i % 2 === 0 ? "bg-gradient-to-r from-blue-500 to-indigo-500" : "bg-gradient-to-r from-orange-400 to-pink-500"
                                )}>
                                    {new Date(report.date).toLocaleDateString(undefined, { month: 'long' })}
                                </div>
                                <div className="p-3 text-center">
                                    <span className="text-2xl font-black text-zinc-800 dark:text-white">{new Date(report.date).getDate()}</span>
                                </div>
                            </div>
                        ))}
                    </div>
                </Container>

                {/* 10. Corner Badge */}
                <Container title="10. Corner Tag">
                    <div className="grid grid-cols-2 p-3 gap-3">
                         {mockReports.map((report, i) => (
                            <div key={i} className="aspect-square rounded-xl border border-zinc-200 dark:border-zinc-800 bg-white dark:bg-zinc-900 p-2 relative flex items-center justify-center cursor-pointer hover:shadow-md transition-shadow">
                                <div className="absolute top-0 left-0 bg-black dark:bg-white text-white dark:text-black text-[10px] font-bold px-1.5 py-0.5 rounded-tl-xl rounded-br-lg">
                                    {new Date(report.date).toLocaleDateString(undefined, { month: 'short' })}
                                </div>
                                <div className="text-center pt-2">
                                     <span className="text-3xl font-bold tracking-tight">{new Date(report.date).getDate()}</span>
                                </div>
                                <div className="absolute bottom-1 right-2 text-[9px] text-zinc-400">
                                    {new Date(report.date).toLocaleDateString(undefined, { weekday: 'short' })}
                                </div>
                            </div>
                        ))}
                    </div>
                </Container>

            </div>
        </div>
    );
};
