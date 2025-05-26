import * as React from "react";
import { format } from "date-fns";
import { Calendar as CalendarIcon } from "lucide-react";
import { DateRange } from "react-day-picker";
import { Button } from "@/components/ui/button";
import { Calendar } from "@/components/ui/calendar";

interface PickDateWithRangeProps {
    onDateRangeChange: (from: Date, to: Date) => void;
}

export const PickDateWithRange: React.FC<PickDateWithRangeProps> = ({ onDateRangeChange }) => {
    const [dateRange, setDateRange] = React.useState<DateRange | undefined>({
        from: undefined,
        to: undefined,
    });

    const handleDateChange = (range: DateRange | undefined) => {
        setDateRange(range);
        if (range?.from && range?.to) {
            onDateRangeChange(range.from, range.to); // Call the callback with selected dates
        }
    };

    return (
        <div className="grid gap-2">
            <Button
                variant={"outline"}
                className="w-full justify-start text-left font-normal"
            >
                <CalendarIcon />
                {dateRange?.from ? (
                    dateRange.to ? (
                        <>
                            {format(dateRange.from, "LLL dd, y")} -{" "}
                            {format(dateRange.to, "LLL dd, y")}
                        </>
                    ) : (
                        format(dateRange.from, "LLL dd, y")
                    )
                ) : (
                    <span>Pick a date range</span>
                )}
            </Button>
            <Calendar
                initialFocus
                mode="range"
                defaultMonth={dateRange?.from}
                selected={dateRange}
                onSelect={handleDateChange}
                numberOfMonths={2}
            />
        </div>
    );
}