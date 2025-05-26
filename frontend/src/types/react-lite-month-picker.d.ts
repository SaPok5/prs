declare module 'react-lite-month-picker' {
    const MonthPicker: React.FC<{
      setIsOpen: (isOpen: boolean) => void;
      selected: { month: number; year: number };
      onChange: (data: { month: number; year: number }) => void;
    }>;
  
    const MonthInput: React.FC<{
      selected: { month: number; year: number };
      setShowMonthPicker: (isOpen: boolean) => void;
      showMonthPicker: boolean;
    }>;
  
    export { MonthPicker, MonthInput };
  }
  