// import { FiSearch } from 'react-icons/fi';  
import { Search } from 'lucide-react';


function SearchPage() {
    return (
        <div className="flex flex-col p-4 space-y-4 w-[85vw]">
            {/* Header Section */}
            <div className="flex items-center space-x-4">
                <div className="relative flex-1 left-[100px]">
                    <Search className="absolute top-3.5 left-3.5 text-gray-500 z-10 text-2xl" />
                    <input
                        type="text"
                        name="q"
                        className="w-[600px] h-12 pl-10 rounded-[15px] border border-gray-300"
                        placeholder="Search"
                    />
                </div>

            </div>

        </div>
    );
}

export default SearchPage;
