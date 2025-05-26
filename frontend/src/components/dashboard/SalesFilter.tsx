import React, { useState } from 'react';
import { ChevronDown } from 'lucide-react';
import { PickDateWithRange } from '../date/PickDateWithRange';

interface SalesFilterProps {
    onRangeSelect: (range: string) => void;
    onDateRangeChange: (from: Date, to: Date) => void;
    selectedRange:string ; setSelectedRange:any;
}

const SalesFilter: React.FC<SalesFilterProps> = ({ onRangeSelect, onDateRangeChange,selectedRange, setSelectedRange }) => {
    const [showDropdown, setShowDropdown] = useState<boolean>(false);
    const [showDatePicker, setShowDatePicker] = useState<boolean>(false);

    const handleSelection = (range: string) => {
        setSelectedRange(range);
        onRangeSelect(range); // Notify parent of the selected range
        if (range === "Custom") {
            setShowDropdown(false);
            setShowDatePicker(true);
        } else {
            setShowDropdown(false);
            setShowDatePicker(false);
        }
    };

    const handleDateRangeChange = (from: Date, to: Date) => {
        setSelectedRange(`${from.toLocaleDateString()} - ${to.toLocaleDateString()}`);
        onDateRangeChange(from, to); // Notify parent of the selected date range
        setShowDatePicker(false);
    };

    return (
        <div className="relative">
            <button
                className="flex items-center bg-white text-black px-4 py-2 hover:bg-gray-200 rounded-[15px] border border-gray-300"
                onClick={() => {
                    setShowDropdown(prev => !prev);
                    setShowDatePicker(false);
                }}
            >
                {selectedRange}
                <ChevronDown className="ml-2 text-3xl" />
            </button>
            {showDropdown && !showDatePicker && (
                <div className="absolute right-0 mt-2 z-10 bg-white border border-gray-300 rounded shadow-md">
                    <ul className="space-y-2 p-2">
                        {["This Month", "Last Month", "Last 30 Days", "Custom"].map((range, index) => (
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
            {showDatePicker && (
                <div className="absolute right-0 mt-2 z-10 bg-white border border-gray-300 rounded shadow-md">
                    <PickDateWithRange onDateRangeChange={handleDateRangeChange} />
                </div>
            )}
        </div>
    );
}

export default SalesFilter;