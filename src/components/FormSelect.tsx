
import React from "react";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";

interface Option {
  value: string;
  label: string;
}

interface FormSelectProps {
  label: string;
  options: Option[];
  defaultValue?: string;
  onChange?: (value: string) => void;
  placeholder?: string;
}

const FormSelect: React.FC<FormSelectProps> = ({
  label,
  options,
  defaultValue,
  onChange,
  placeholder = "Select an option",
}) => {
  return (
    <div className="space-y-2">
      <fieldset className="border border-gray-400 hover:border-gray-800 rounded-md p-1 group bg-white">
        <legend className="text-sm font-medium text-gray-700 px-1">{label}</legend>
        <div className="relative">
          <Select defaultValue={defaultValue} onValueChange={onChange}>
            <SelectTrigger 
              className="w-full border-none shadow-none focus:ring-0 focus:ring-offset-0 p-0 h-6"
            >
              <SelectValue 
                placeholder={placeholder}
                className="text-sm"
              />
            </SelectTrigger>
            <SelectContent>
              {options.map((option) => (
                <SelectItem key={option.value} value={option.value}>
                  {option.label}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>
      </fieldset>
    </div>
  );
};

export default FormSelect;
