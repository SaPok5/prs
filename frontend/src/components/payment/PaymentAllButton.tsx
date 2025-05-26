import { ChangeEvent } from "react";
import { ChevronDown } from "lucide-react";

export type DateRangeFilter = "All" | "Today" | "Yesterday" | "Last7Days" | "Last30Days";

interface PaymentAllButtonProps {
    onDateRangeChange: (filter: DateRangeFilter) => void;
    dateRange:DateRangeFilter
}

function PaymentAllButton({ onDateRangeChange, dateRange }: PaymentAllButtonProps) {


    const handleChange = (e: ChangeEvent<HTMLSelectElement>) => {
        const value = e.target.value as DateRangeFilter;
        onDateRangeChange(value);
    };

    return (
        <div className="relative inline-block">
            <select
                value={dateRange}
                onChange={handleChange}
                className="border rounded-lg px-3 py-2 pr-10 shadow-sm appearance-none cursor-pointer w-full"
            >
                <option value="All">All</option>
                <option value="Today">Today</option>
                <option value="Yesterday">Yesterday</option>
                <option value="Last7Days">Last 7 days</option>
                <option value="Last30Days">Last 30 days</option>
            </select>
            <span className="absolute inset-y-0 right-2 flex items-center pointer-events-none">
                <ChevronDown className="text-gray-500" />
            </span>
        </div>
    );
}

export default PaymentAllButton;
