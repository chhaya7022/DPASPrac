
import React, { useState } from "react";
import { Calendar } from "@/components/ui/calendar";
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover";
import { Input } from "@/components/ui/input";
import { CalendarIcon } from "lucide-react";
import { format, parse } from "date-fns";

interface DateTimePickerProps {
  label: string;
  value: string;
  onChange: (value: string) => void;
}

const DateTimePicker: React.FC<DateTimePickerProps> = ({
  label,
  value,
  onChange,
}) => {
  const [open, setOpen] = useState(false);
  
  // Parse the string date to a Date object for the calendar
  const parseDate = (dateString: string): Date => {
    try {
      return parse(dateString, "dd-MMM-yyyy HH:mm:ss", new Date());
    } catch (error) {
      return new Date();
    }
  };
  
  // Format the Date object back to a string
  const formatDate = (date: Date): string => {
    return format(date, "dd-MMM-yyyy HH:mm:ss");
  };
  
  const handleDateChange = (date: Date | undefined) => {
    if (date) {
      onChange(formatDate(date));
      setOpen(false);
    }
  };
  
  return (
    <div className="space-y-2">
      <fieldset className="border border-gray-400 hover:border-gray-800 rounded-md p-1.5 group bg-white">
        <legend className="text-sm font-medium text-gray-700 px-1">{label}</legend>
        <div className="relative">
          <Input 
            type="text" 
            value={value} 
            onChange={(e) => onChange(e.target.value)}
            style={{
              all: 'unset',
              display: 'block',
              width: '100%',
              fontSize: '0.875rem',
              paddingRight: '2rem',
            }}
          />
          <Popover open={open} onOpenChange={setOpen}>
            <PopoverTrigger asChild>
              <div 
                className="absolute right-2 top-1/2 -translate-y-1/2 text-gray-500 cursor-pointer"
                onClick={() => setOpen(true)}
              >
                <CalendarIcon className="h-4 w-4" />
              </div>
            </PopoverTrigger>
            <PopoverContent className="w-auto p-0" align="end">
              <Calendar
                mode="single"
                selected={parseDate(value)}
                onSelect={handleDateChange}
                initialFocus
                className="pointer-events-auto"
              />
            </PopoverContent>
          </Popover>
        </div>
      </fieldset>
    </div>
  );
};

export default DateTimePicker;
