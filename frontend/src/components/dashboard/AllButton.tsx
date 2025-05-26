import { useState } from 'react';
import { ChevronDown } from 'lucide-react';

function AllButton({setFilter}:any) {
    const [showDropdown, setShowDropdown] = useState(false);
    const [selectedRange, setSelectedRange] = useState("All");

    const handleSelection = (range: any) => {
        setSelectedRange(range);
        setShowDropdown(false); 
        setFilter(range)
    };

    return (
        <div className="relative">
            <button
                className="flex items-center bg-white text-black w-32  px-4 py-2 hover:bg-gray-200 rounded-[15px] border border-gray-300"
                onClick={() => setShowDropdown(!showDropdown)}
            >
                {/* Removed the SlCalender icon */}
                {selectedRange}
                <ChevronDown className="ml-2 text-3xl" />
            </button>
            {showDropdown && (
                <div className="absolute right-0 mt-2 z-50 bg-white border border-gray-300 rounded shadow-md">
                    <ul className="space-y-2 p-2">
                        {["All", "Last Week", "1 Month"].map((range, index) => (
                            <li key={index}>
                                <button
                                    className="block px-4 py-2 w-full text-gray-700 hover:bg-gray-200 rounded"
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

export default AllButton;
