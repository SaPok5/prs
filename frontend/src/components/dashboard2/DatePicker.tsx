import { useState } from 'react';
import { DateRangePicker } from 'react-date-range';
import 'react-date-range/dist/styles.css'; // Main styles
import 'react-date-range/dist/theme/default.css'; // Theme styles

function SelectDate () {
  const [selectionRange, setSelectionRange] = useState({
    startDate: new Date(2024, 10, 1), // November 1, 2024
    endDate: new Date(2024, 10, 30), // November 30, 2024
    key: 'selection',
  });

  const handleSelect = (ranges: any) => {
    // Update the state when the user selects a new date range
    setSelectionRange(ranges.selection);
  };

  return (
    <div className="flex justify-center items-center h-screen bg-gray-100">
      <div className="border rounded-md p-4 shadow-md bg-white">
        <DateRangePicker
          ranges={[selectionRange]} // Pass the ranges as an array
          onChange={handleSelect} // Handle the date range selection
          className="text-gray-700"
        />
      </div>
    </div>
  );
};

export default SelectDate;
