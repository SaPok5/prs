import { useState } from 'react';
import { ChevronDown } from 'lucide-react';

function WeekButton() {
    const [showDropdown, setShowDropdown] = useState(false);
    const [selectedRange, setSelectedRange] = useState("This Week");

    const handleSelection = (range: any) => {
        setSelectedRange(range);
        setShowDropdown(false); 
    };

    return (
        <div className="relative">
            <button
                className="flex items-center bg-white text-black border border-black px-4 py-2 rounded hover:bg-gray-200 sm:px-6 sm:py-3 text-sm sm:text-base"
                onClick={() => setShowDropdown(!showDropdown)}
            >
                {selectedRange}
                <ChevronDown className="ml-2 text-2xl sm:text-3xl" />
            </button>
            {showDropdown && (
                <div className="absolute right-0 mt-2 z-10 bg-white border border-gray-300 rounded shadow-md max-w-xs sm:max-w-sm w-full">
                    <ul className="space-y-2 p-2">
                        {["This Month", "Last Month", "Last 30 Days"].map((range, index) => (
                            <li key={index}>
                                <button
                                    className="block w-full px-4 py-2 text-gray-700 hover:bg-gray-200 rounded"
                                    onClick={() => handleSelection(range)}
                                >
                                    {range}
                                </button>
                            </li>
                        ))}
                    </ul>
                </div>
            )}
        </div>
    );
}

export default WeekButton;
