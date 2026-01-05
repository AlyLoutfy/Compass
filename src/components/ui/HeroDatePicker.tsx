import React from 'react';
import { 
    Button,
    Popover
} from '@heroui/react';
import { RangeCalendar } from '@heroui/calendar';
import { 
    CalendarDate
} from '@internationalized/date';
import { DateRange } from "react-day-picker";
import { Calendar as CalendarIcon, X } from "lucide-react";
import { format } from "date-fns";
import { cn } from "@/lib/utils";

interface HeroDatePickerProps {
    date: DateRange | undefined;
    setDate: (date: DateRange | undefined) => void;
    className?: string;
    hideClear?: boolean;
}

export const HeroDatePicker: React.FC<HeroDatePickerProps> = ({ 
    date, 
    setDate,
    className,
    hideClear = false
}) => {
    // Convert DateRange to HeroUI CalendarDate Range using raw numbers to avoid TZ shifts
    const value = React.useMemo(() => {
        if (!date?.from || !date?.to) return null;
        try {
            return {
                start: new CalendarDate(date.from.getFullYear(), date.from.getMonth() + 1, date.from.getDate()),
                end: new CalendarDate(date.to.getFullYear(), date.to.getMonth() + 1, date.to.getDate())
            };
        } catch {
            return null;
        }
    }, [date]);

    const handleRangeChange = (newRange: any) => {
        if (!newRange) {
            setDate(undefined);
            return;
        }

        // Convert CalendarDate back to local JS Date using raw numbers
        const from = new Date(newRange.start.year, newRange.start.month - 1, newRange.start.day);
        const to = newRange.end.year ? new Date(newRange.end.year, newRange.end.month - 1, newRange.end.day) : from;
        
        setDate({ from, to });
    };

    return (
        <div className="w-fit">
            <Popover>
                <Popover.Trigger>
                    <div className="relative">
                        <Button 
                            className={cn(
                                "h-9 bg-transparent hover:bg-zinc-100 dark:hover:bg-zinc-800 text-muted-foreground hover:text-foreground border-transparent px-3 min-w-0 transition-all gap-2",
                                date?.from && "text-foreground font-medium",
                                className
                            )}
                        >
                            <CalendarIcon size={16} className="shrink-0" />
                            <span className="truncate">
                                {date?.from ? (
                                    date.to && date.to.toDateString() !== date.from.toDateString() ? (
                                        <>
                                            {format(date.from, "d MMM")} - {format(date.to, "d MMM, yyyy")}
                                        </>
                                    ) : (
                                        format(date.from, "d MMM, yyyy")
                                    )
                                ) : (
                                    "Pick a date"
                                )}
                            </span>
                            {date?.from && !hideClear && (
                                <div
                                    role="button"
                                    onClick={(e) => {
                                        e.stopPropagation();
                                        setDate(undefined);
                                    }}
                                    className="ml-1 p-0.5 rounded-full hover:bg-zinc-200 dark:hover:bg-zinc-700 text-muted-foreground hover:text-red-500 transition-colors"
                                >
                                    <X size={14} />
                                </div>
                            )}
                        </Button>
                    </div>
                </Popover.Trigger>
                <Popover.Content className="p-0 border-none shadow-2xl rounded-2xl overflow-hidden bg-white dark:bg-zinc-900 border border-zinc-200 dark:border-zinc-800">
                    <Popover.Dialog className="p-0">
                        <RangeCalendar 
                            value={value as any}
                            onChange={handleRangeChange}
                            aria-label="Date Range"
                            className="border-none shadow-none"
                                classNames={{
                                base: "bg-white dark:bg-zinc-900",
                                headerWrapper: "pt-4 bg-white dark:bg-zinc-900",
                                gridHeader: "bg-white dark:bg-zinc-900",
                                cellButton: [
                                    "data-[selection-start=true]:bg-primary data-[selection-start=true]:text-primary-foreground",
                                    "data-[selection-end=true]:bg-primary data-[selection-end=true]:text-primary-foreground",
                                    "data-[in-range=true]:bg-primary/20 data-[in-range=true]:text-foreground dark:data-[in-range=true]:text-foreground",
                                    "hover:bg-primary/15 hover:text-foreground"
                                ].join(" ")
                            }}
                        />
                    </Popover.Dialog>
                </Popover.Content>
            </Popover>
        </div>
    );
};
