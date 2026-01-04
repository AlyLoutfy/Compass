import React from 'react';
import { Button } from '../ui/Button';
import { Play, Pause, Check, Dice5, X } from 'lucide-react';
import { cn } from '@/lib/utils';
import { motion, AnimatePresence } from 'framer-motion';
import { Tooltip } from '../ui/Tooltip';

interface StandupControlsProps {
  timerSeconds: number;
  isTimerRunning: boolean;
  onToggleTimer: () => void;
  onRandomNext: () => void;
  onFinishStandup: () => void;
  onCancelStandup: () => void;
  hasUnspoken: boolean;
  isStandupStarted: boolean;
  onStartStandup: () => void;
}

export const StandupControls: React.FC<StandupControlsProps> = ({
  timerSeconds,
  isTimerRunning,
  onToggleTimer,
  onRandomNext,
  onFinishStandup,
  onCancelStandup,
  hasUnspoken,
  isStandupStarted,
  onStartStandup
}) => {

  const formatTime = (seconds: number) => {
    const isOvertime = seconds < 0;
    const absSeconds = Math.abs(seconds);
    const mins = Math.floor(absSeconds / 60);
    const secs = absSeconds % 60;
    const timeStr = `${mins.toString().padStart(2, '0')}:${secs.toString().padStart(2, '0')}`;
    return isOvertime ? `+${timeStr}` : timeStr;
  };

  // Cap progress at 100% so it doesn't overflow when overtime
  const isOvertime = timerSeconds < 0;

  return (
    <div className="fixed bottom-6 left-1/2 -translate-x-1/2 z-50 flex flex-col items-center">
      <AnimatePresence mode="wait">
        {!isStandupStarted ? (
          <motion.button
            key="start-button"
            initial={{ scale: 0.9, opacity: 0, y: 20 }}
            animate={{ scale: 1, opacity: 1, y: 0 }}
            exit={{ scale: 0.9, opacity: 0 }}
            whileHover={{ scale: 1.05, boxShadow: "0 20px 25px -5px rgb(22 163 74 / 0.4)" }}
            whileTap={{ scale: 0.95 }}
            transition={{ type: "spring", bounce: 0.4, duration: 0.4 }}
            onClick={onStartStandup}
            className="bg-green-600 hover:bg-green-500 text-white text-base font-semibold rounded-full px-8 py-3 shadow-xl flex items-center gap-3 group"
          >
            <motion.div
                animate={{ x: [0, 4, 0] }}
                transition={{ repeat: Infinity, duration: 1.5, ease: "easeInOut" }}
            >
                <Play size={20} fill="currentColor" />
            </motion.div>
            Start Daily Standup
          </motion.button>
        ) : (
          <motion.div
            key="active-controls"
            initial={{ width: 300, height: 60, borderRadius: 30, opacity: 0 }}
            animate={{ width: "auto", height: "auto", borderRadius: 9999, opacity: 1 }}
            exit={{ scale: 0.9, opacity: 0, y: 20 }}
            transition={{ type: "spring", bounce: 0.3, duration: 0.6 }}
            className="bg-zinc-900 border border-zinc-800 text-white shadow-2xl overflow-hidden relative"
            style={{ borderRadius: "9999px" }} 
          >


            <div className="px-5 py-3 flex items-center justify-between gap-4 relative z-10 min-w-fit">
                
                {/* Cancel Button */}
                <Tooltip content="Cancel and Reset Standup">
                    <button
                        onClick={onCancelStandup}
                        className="p-2 hover:bg-white/10 rounded-full text-zinc-500 hover:text-red-400 transition-colors -ml-1"
                    >
                        <X size={18} />
                    </button>
                </Tooltip>

                {/* Timer Section */}
                <div className="flex items-center gap-3">
                  <span className={cn("font-mono text-xl font-bold tabular-nums min-w-[70px] text-center", 
                      (timerSeconds < 60 && !isOvertime) && "text-red-400 animate-pulse",
                      isOvertime && "text-red-500"
                  )}>
                    {formatTime(timerSeconds)}
                  </span>

                  <div className="flex items-center gap-0.5">
                    <Tooltip content={isTimerRunning ? "Pause" : "Resume"}>
                        <button
                        onClick={onToggleTimer}
                        className="p-2 hover:bg-white/10 rounded-full transition-colors"
                        >
                        {isTimerRunning ? <Pause size={16} /> : <Play size={16} />}
                        </button>
                    </Tooltip>
                  </div>
                </div>

                <div className="h-6 w-px bg-white/10 mx-1" />

                {/* Actions */}
                <div className="flex items-center gap-2">
                  <Button
                    variant="secondary"
                    onClick={onRandomNext}
                    disabled={!hasUnspoken}
                    className="bg-zinc-800 hover:bg-zinc-700 text-zinc-100 border-zinc-700 h-9 px-4 rounded-3xl flex items-center gap-2 text-sm"
                  >
                    <Dice5 size={16} className="text-purple-400" />
                    {hasUnspoken ? "Who's Next?" : "Done"}
                  </Button>

                  <Button
                    onClick={onFinishStandup}
                    className="bg-green-600 hover:bg-green-500 text-white h-9 px-4 rounded-3xl flex items-center gap-2 font-semibold text-sm"
                  >
                    <Check size={16} />
                    Finish
                  </Button>
                </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
};
