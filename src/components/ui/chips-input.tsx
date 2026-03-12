import React, { useState, KeyboardEvent } from "react";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { X, ArrowRight } from "lucide-react";
import { cn } from "@/lib/utils";

interface ChipsInputProps {
  value: string[];
  onChange: (value: string[]) => void;
  placeholder?: string;
  className?: string;
  maxChips?: number;
}

const ChipsInput: React.FC<ChipsInputProps> = ({
  value = [],
  onChange,
  placeholder = "Type and press Enter...",
  className,
  maxChips = 20,
}) => {
  const [inputValue, setInputValue] = useState("");

  const addChip = (chipValue: string) => {
    const trimmedValue = chipValue.trim();
    if (
      trimmedValue &&
      !value.includes(trimmedValue) &&
      value.length < maxChips
    ) {
      onChange([...value, trimmedValue]);
      setInputValue("");
    }
  };

  const removeChip = (indexToRemove: number) => {
    onChange(value.filter((_, index) => index !== indexToRemove));
  };

  const handleKeyPress = (e: KeyboardEvent<HTMLInputElement>) => {
    if (e.key === "Enter") {
      e.preventDefault();
      addChip(inputValue);
    }
  };

  const handleAddClick = () => {
    addChip(inputValue);
  };

  return (
    <div className={cn("space-y-3", className)}>
      {/* Chips Display */}
      {value.length > 0 && (
        <div className="flex flex-wrap gap-2">
          {value.map((chip, index) => (
            <Badge
              key={index}
              variant="secondary"
              className="px-3 py-1 text-sm bg-cyan-100 dark:bg-cyan-900/20 text-cyan-700 dark:text-cyan-300 border border-cyan-200 dark:border-cyan-700 hover:bg-cyan-200 dark:hover:bg-cyan-900/40 transition-colors duration-200"
            >
              {chip}
              <button
                type="button"
                onClick={() => removeChip(index)}
                className="ml-2 hover:text-red-500 transition-colors duration-200"
              >
                <X className="w-3 h-3" />
              </button>
            </Badge>
          ))}
        </div>
      )}

      {/* Input Field */}
      <div className="flex gap-2">
        <Input
          value={inputValue}
          onChange={(e) => setInputValue(e.target.value)}
          onKeyPress={handleKeyPress}
          placeholder={
            value.length >= maxChips
              ? `Maximum ${maxChips} items reached`
              : placeholder
          }
          disabled={value.length >= maxChips}
          className="flex-1 bg-gray-50 dark:bg-slate-700 border-gray-200 dark:border-slate-600 text-gray-900 dark:text-slate-100 placeholder:text-gray-500 dark:placeholder:text-slate-400 transition-all duration-300 focus:border-cyan-500 dark:focus:border-cyan-400"
        />
        <Button
          type="button"
          onClick={handleAddClick}
          disabled={!inputValue.trim() || value.length >= maxChips}
          size="sm"
          className="px-3 bg-cyan-500 hover:bg-cyan-600 dark:bg-cyan-600 dark:hover:bg-cyan-500 text-white transition-colors duration-300 disabled:opacity-50 disabled:cursor-not-allowed"
        >
          <ArrowRight className="w-4 h-4" />
        </Button>
      </div>

      {/* Counter */}
      <div className="text-xs text-gray-500 dark:text-slate-400">
        {value.length} / {maxChips} items
      </div>
    </div>
  );
};

export default ChipsInput;
