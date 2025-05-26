import * as React from "react";
import { format } from "date-fns"
import { CalendarIcon } from "lucide-react"
import { cn } from "@/lib/utils";
import { Button } from "@/components/ui/button"
import { Calendar } from "@/components/ui/calendar"
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover"


export function ChooseDate() {
    const [date, setDate] = React.useState<Date>()
    return (
        <Popover>
            <PopoverTrigger asChild>
                <Button
                variant={"outline"}
                className={cn(
                    "w-[240px] justify-start text-left font-normal",
                    !date && "text-muted-foreground"
                )}
                >
                <CalendarIcon />
                {date ? format(date, "PPP") : <span>Pick a date</span>}
                </Button>
            </PopoverTrigger>
            <PopoverContent className="w-auto p-0" align="start">
                <Calendar
                mode="single"
                selected={date}
                onSelect={setDate}
                initialFocus
                />
            </PopoverContent>
        </Popover>
    )
}




// import * as React from "react";
// import { format } from "date-fns";
// import { CalendarIcon } from "lucide-react";
// import { cn } from "@/lib/utils";
// import { Button } from "@/components/ui/button";
// import { Calendar } from "@/components/ui/calendar";
// import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover";

// interface ChooseDateProps {
//     onChange: (date: Date | undefined) => void; // Accept onChange prop
// }

// export function ChooseDate({ onChange }: ChooseDateProps) {
//     const [date, setDate] = React.useState<Date | undefined>();

//     const handleDateSelect = (selectedDate: Date | undefined) => {
//         setDate(selectedDate);
//         onChange(selectedDate); // Call the onChange prop with the selected date
//     };

//     return (
//         <Popover>
//             <PopoverTrigger asChild>
//                 <Button
//                     variant={"outline"}
//                     className={cn(
//                         "w-[240px] justify-start text-left font-normal",
//                         !date && "text-muted-foreground"
//                     )}
//                 >
//                     <CalendarIcon />
//                     {date ? format(date, "PPP") : <span>Pick a date</span>}
//                 </Button>
//             </PopoverTrigger>
//             <PopoverContent className="w-auto p-0" align="start">
//                 <Calendar
//                     mode="single"
//                     selected={date}
//                     onSelect={handleDateSelect} // Use the new handler
//                     initialFocus
//                 />
//             </PopoverContent>
//         </Popover>
//     );
// }