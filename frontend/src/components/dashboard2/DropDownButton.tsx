import { useState } from 'react';
import { ChevronDown } from 'lucide-react';

function DropDownButton({allTeams}:any) {
    console.log(allTeams,"all")
    const [showDropdown, setShowDropdown] = useState(false);
    const [selectedRange, setSelectedRange] = useState("Life Cover");

    const handleSelection = (range: any) => {
        setSelectedRange(range);
        setShowDropdown(false); 
    };

    return (
        <div className="relative">
            <button
                className="flex items-center bg-white text-black px-4 py-2 hover:bg-gray-200 rounded-[10px] border border-gray-300 w-[140px]"
                onClick={() => setShowDropdown(!showDropdown)}
            >
                {selectedRange}
                <ChevronDown className="ml-2 text-3xl" />
            </button>
            {showDropdown && (
                <div className="absolute right-0 mt-2 z-10 bg-white border border-gray-300 rounded shadow-md">
                    <ul className="space-y-2 p-2">
                        {allTeams?.map((range:any, index:number) => (
                            <li key={index}>
                                <button
                                    className="block px-4 py-2 text-gray-700 hover:bg-gray-200 rounded"
                                    onClick={() => handleSelection(range.id)}
                                >
                                    {range.teamName}
                                </button>
                            </li>
                        ))}
                    </ul>
                </div>
            )}
        </div>
    );
}

export default DropDownButton;
