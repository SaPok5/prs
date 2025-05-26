import { useState } from 'react';
import { ChevronDown } from 'lucide-react';

function MonthButton() {
    const [showDropdown, setShowDropdown] = useState(false);
    const [selectedRange, setSelectedRange] = useState("Last Month");

    const handleSelection = (range: any) => {
        setSelectedRange(range);
        setShowDropdown(false); 
    };

    return (
        <div className="relative">
            <button
                className="flex items-center bg-white text-black border border-black px-4 py-2 rounded hover:bg-gray-200"
                onClick={() => setShowDropdown(!showDropdown)}
            >
                {/* Removed the SlCalender icon */}
                {selectedRange}
                <ChevronDown className="ml-2 text-3xl" />
            </button>
            {showDropdown && (
                <div className="absolute right-0 mt-2 z-10 bg-white border border-gray-300 rounded shadow-md">
                    <ul className="space-y-2 p-2">
                        {["Last Month", "This Months", "1 Month"].map((range, index) => (
                            <li key={index}>
                                <button
                                    className="block px-4 py-2 text-gray-700 hover:bg-gray-200 rounded"
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

export default MonthButton;
