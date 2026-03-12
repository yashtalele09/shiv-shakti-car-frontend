"use client";

import React, { useState, useRef, useEffect } from "react";
import { ChevronLeft, ChevronRight, ChevronDown } from "lucide-react";

interface ButtonProps {
  children: React.ReactNode;
  onClick: () => void;
  className?: string;
  [key: string]: any;
}

// Button component for navigation
const Button = ({
  children,
  onClick,
  className = "",
  ...props
}: ButtonProps) => (
  <button
    onClick={onClick}
    className={`inline-flex items-center justify-center rounded-md text-sm font-medium transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:opacity-50 disabled:pointer-events-none ring-offset-background hover:bg-accent hover:text-accent-foreground h-7 w-7 bg-transparent p-0 opacity-50 hover:opacity-100 ${className}`}
    {...props}
  >
    {children}
  </button>
);

interface CalendarProps {
  selectedDate?: Date | null;
  onDateSelect?: (date: Date | null) => void;
  className?: string;
  minDate?: Date; // Minimum selectable date
  maxDate?: Date; // Maximum selectable date (defaults to today)
}

interface CustomDropdownProps {
  value: string;
  options: string[];
  onChange: (value: string) => void;
  placeholder?: string;
}

// Custom Dropdown Component
function CustomDropdown({
  value,
  options,
  onChange,
  placeholder,
}: CustomDropdownProps) {
  const [isOpen, setIsOpen] = useState(false);
  const dropdownRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (
        dropdownRef.current &&
        !dropdownRef.current.contains(event.target as Node)
      ) {
        setIsOpen(false);
      }
    };

    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  return (
    <div className="relative" ref={dropdownRef}>
      <button
        type="button"
        onClick={() => setIsOpen(!isOpen)}
        className="appearance-none bg-[hsl(var(--field))] text-foreground border border-input rounded-lg px-4 py-2.5 pr-10 text-sm font-semibold focus:outline-none focus:ring-2 focus:ring-cyan-500 dark:focus:ring-cyan-400 focus:border-cyan-500 dark:focus:border-cyan-400 cursor-pointer transition-all duration-200 shadow-sm hover:shadow-md w-full text-left"
      >
        {value || placeholder}
        <ChevronDown className="absolute right-3 top-1/2 transform -translate-y-1/2 w-4 h-4 text-gray-400 transition-transform duration-200" />
      </button>

      {isOpen && (
        <div className="absolute top-full left-0 right-0 mt-1 bg-card text-card-foreground border border-input rounded-lg shadow-lg z-50 max-h-48 overflow-y-auto">
          {options.map((option) => (
            <button
              key={option}
              type="button"
              onClick={() => {
                onChange(option);
                setIsOpen(false);
              }}
              className="w-full text-left px-4 py-3 text-sm font-medium text-gray-900 dark:text-white hover:bg-cyan-100 dark:hover:bg-cyan-900/30 hover:text-cyan-700 dark:hover:text-cyan-300 cursor-pointer transition-colors duration-150 first:rounded-t-lg last:rounded-b-lg"
            >
              {option}
            </button>
          ))}
        </div>
      )}
    </div>
  );
}

// Custom Calendar Component
function Calendar({
  selectedDate: externalSelectedDate,
  onDateSelect,
  className,
  minDate,
  maxDate,
}: CalendarProps) {
  // Default maxDate to today
  const today = new Date();
  today.setHours(23, 59, 59, 999); // End of today
  const maxSelectableDate = maxDate || today;

  // Set minDate to start of day if provided
  const minSelectableDate = minDate
    ? (() => {
        const min = new Date(minDate);
        min.setHours(0, 0, 0, 0);
        return min;
      })()
    : undefined;

  // Initialize currentDate based on selectedDate if available, otherwise use today
  const [currentDate, setCurrentDate] = useState(() => {
    if (externalSelectedDate) {
      return new Date(
        externalSelectedDate.getFullYear(),
        externalSelectedDate.getMonth(),
        1,
        0,
        0,
        0,
        0,
      );
    }
    const now = new Date();
    return new Date(now.getFullYear(), now.getMonth(), 1, 0, 0, 0, 0);
  });
  const [internalSelectedDate, setInternalSelectedDate] = useState<Date | null>(
    null,
  );

  // Use external selected date if provided, otherwise use internal state
  const selectedDate =
    externalSelectedDate !== undefined
      ? externalSelectedDate
      : internalSelectedDate;

  // Sync currentDate with selectedDate when it changes
  useEffect(() => {
    if (selectedDate) {
      const newCurrentDate = new Date(
        selectedDate.getFullYear(),
        selectedDate.getMonth(),
        1,
        0,
        0,
        0,
        0,
      );
      setCurrentDate(newCurrentDate);
    }
  }, [selectedDate]);

  const months = [
    "Jan",
    "Feb",
    "Mar",
    "Apr",
    "May",
    "Jun",
    "Jul",
    "Aug",
    "Sep",
    "Oct",
    "Nov",
    "Dec",
  ];

  const daysOfWeek = ["Su", "Mo", "Tu", "We", "Th", "Fr", "Sa"];

  const getDaysInMonth = (date: Date) => {
    const year = date.getFullYear();
    const month = date.getMonth();
    const firstDay = new Date(year, month, 1);
    const lastDay = new Date(year, month + 1, 0);
    const daysInMonth = lastDay.getDate();
    const startingDayOfWeek = firstDay.getDay();

    const days = [];

    // Previous month's trailing days
    const prevMonth = new Date(year, month - 1, 0);
    const prevMonthDays = prevMonth.getDate();
    for (let i = startingDayOfWeek - 1; i >= 0; i--) {
      days.push({
        day: prevMonthDays - i,
        isCurrentMonth: false,
        isPrevMonth: true,
        date: new Date(year, month - 1, prevMonthDays - i, 0, 0, 0, 0),
      });
    }

    // Current month days
    for (let day = 1; day <= daysInMonth; day++) {
      days.push({
        day,
        isCurrentMonth: true,
        date: new Date(year, month, day, 0, 0, 0, 0),
      });
    }

    // Next month's leading days
    const remainingDays = 42 - days.length; // 6 rows × 7 days
    for (let day = 1; day <= remainingDays; day++) {
      days.push({
        day,
        isCurrentMonth: false,
        isNextMonth: true,
        date: new Date(year, month + 1, day, 0, 0, 0, 0),
      });
    }

    return days;
  };

  const navigateMonth = (direction: number) => {
    setCurrentDate((prev) => {
      const newDate = new Date(prev);
      newDate.setMonth(prev.getMonth() + direction);

      // Ensure the new date is within valid range
      const firstDayOfNewMonth = new Date(
        newDate.getFullYear(),
        newDate.getMonth(),
        1,
      );

      // Check if month is within valid range
      const isWithinMax = firstDayOfNewMonth <= maxSelectableDate;
      const isWithinMin =
        !minSelectableDate || firstDayOfNewMonth >= minSelectableDate;

      if (isWithinMax && isWithinMin) {
        return newDate;
      }

      // If not valid, return previous date
      return prev;
    });
  };

  // Check if next month would be in the future
  const canNavigateNext = () => {
    const nextMonth = new Date(currentDate);
    nextMonth.setMonth(nextMonth.getMonth() + 1);
    return nextMonth <= maxSelectableDate;
  };

  // Check if previous month would be before minDate
  const canNavigatePrev = () => {
    if (!minSelectableDate) return true;
    const prevMonth = new Date(currentDate);
    prevMonth.setMonth(prevMonth.getMonth() - 1);
    const lastDayOfPrevMonth = new Date(
      prevMonth.getFullYear(),
      prevMonth.getMonth() + 1,
      0,
    );
    return lastDayOfPrevMonth >= minSelectableDate;
  };

  const days = getDaysInMonth(currentDate);

  const isToday = (date: Date) => {
    const todayDate = new Date();
    return (
      date.getFullYear() === todayDate.getFullYear() &&
      date.getMonth() === todayDate.getMonth() &&
      date.getDate() === todayDate.getDate()
    );
  };

  const isSelected = (date: Date) => {
    return (
      selectedDate &&
      date.getFullYear() === selectedDate.getFullYear() &&
      date.getMonth() === selectedDate.getMonth() &&
      date.getDate() === selectedDate.getDate()
    );
  };

  const isFutureDate = (date: Date) => {
    const dateToCheck = new Date(date);
    dateToCheck.setHours(0, 0, 0, 0);
    const maxDateToCheck = new Date(maxSelectableDate);
    maxDateToCheck.setHours(0, 0, 0, 0);
    return dateToCheck > maxDateToCheck;
  };

  const isPastDate = (date: Date) => {
    if (!minSelectableDate) return false;
    const dateToCheck = new Date(date);
    dateToCheck.setHours(0, 0, 0, 0);
    const minDateToCheck = new Date(minSelectableDate);
    minDateToCheck.setHours(0, 0, 0, 0);
    return dateToCheck < minDateToCheck;
  };

  return (
    <div
      className={`bg-white dark:bg-slate-800 text-gray-900 dark:text-white p-4 rounded-lg border border-gray-200 dark:border-slate-700 w-80 shadow-lg ${
        className || ""
      }`}
    >
      {/* Header */}
      <div className="flex justify-between items-center mb-4 pr-12">
        <Button
          onClick={() => navigateMonth(-1)}
          disabled={!canNavigatePrev()}
          className={`text-gray-500 dark:text-gray-400 hover:text-gray-700 dark:hover:text-white ${
            !canNavigatePrev() ? "opacity-40 cursor-not-allowed" : ""
          }`}
        >
          <ChevronLeft className="h-4 w-4" />
        </Button>

        <div className="flex items-center space-x-3">
          <div className="w-20">
            <CustomDropdown
              value={months[currentDate.getMonth()]}
              options={(() => {
                const currentYear = currentDate.getFullYear();
                let availableMonths = months;

                // Filter months based on minDate if current year is minDate year
                if (
                  minSelectableDate &&
                  currentYear === minSelectableDate.getFullYear()
                ) {
                  const minMonth = minSelectableDate.getMonth();
                  availableMonths = months.filter(
                    (_, index) => index >= minMonth,
                  );
                }

                // Filter months based on maxDate if current year is maxDate year
                if (currentYear === maxSelectableDate.getFullYear()) {
                  const maxMonth = maxSelectableDate.getMonth();
                  availableMonths = availableMonths.filter((_, index) => {
                    // Find the original index in the months array
                    const originalIndex = months.indexOf(
                      availableMonths[index],
                    );
                    return originalIndex <= maxMonth;
                  });
                }

                return availableMonths;
              })()}
              onChange={(month) => {
                const monthIndex = months.indexOf(month);
                const newDate = new Date(currentDate);
                newDate.setMonth(monthIndex);
                const firstDayOfNewMonth = new Date(
                  newDate.getFullYear(),
                  newDate.getMonth(),
                  1,
                );
                // Check if month is within valid range
                const isWithinMax = firstDayOfNewMonth <= maxSelectableDate;
                const isWithinMin =
                  !minSelectableDate || firstDayOfNewMonth >= minSelectableDate;
                if (isWithinMax && isWithinMin) {
                  setCurrentDate(newDate);
                }
              }}
            />
          </div>

          <div className="w-24">
            <CustomDropdown
              value={currentDate.getFullYear().toString()}
              options={(() => {
                const minYear = minSelectableDate
                  ? minSelectableDate.getFullYear()
                  : 1950;
                const maxYear = maxSelectableDate.getFullYear();
                return Array.from({ length: maxYear - minYear + 1 }, (_, i) =>
                  (minYear + i).toString(),
                );
              })()}
              onChange={(year) => {
                const newYear = parseInt(year);
                const newDate = new Date(currentDate);
                newDate.setFullYear(newYear);

                // Adjust month if it becomes invalid after year change
                if (
                  minSelectableDate &&
                  newYear === minSelectableDate.getFullYear()
                ) {
                  const minMonth = minSelectableDate.getMonth();
                  if (newDate.getMonth() < minMonth) {
                    newDate.setMonth(minMonth);
                  }
                }

                if (newYear === maxSelectableDate.getFullYear()) {
                  const maxMonth = maxSelectableDate.getMonth();
                  if (newDate.getMonth() > maxMonth) {
                    newDate.setMonth(maxMonth);
                  }
                }

                const firstDayOfNewMonth = new Date(
                  newDate.getFullYear(),
                  newDate.getMonth(),
                  1,
                );
                // Check if year/month is within valid range
                const isWithinMax = firstDayOfNewMonth <= maxSelectableDate;
                const isWithinMin =
                  !minSelectableDate || firstDayOfNewMonth >= minSelectableDate;
                if (isWithinMax && isWithinMin) {
                  setCurrentDate(newDate);
                }
              }}
            />
          </div>
        </div>

        <Button
          onClick={() => navigateMonth(1)}
          disabled={!canNavigateNext()}
          className={`text-gray-500 dark:text-gray-400 hover:text-gray-700 dark:hover:text-white ${
            !canNavigateNext() ? "opacity-40 cursor-not-allowed" : ""
          }`}
        >
          <ChevronRight className="h-4 w-4" />
        </Button>
      </div>

      {/* Days of week header */}
      <div className="grid grid-cols-7 gap-1 mb-2">
        {daysOfWeek.map((day) => (
          <div
            key={day}
            className="text-center text-gray-500 dark:text-gray-400 text-sm font-medium py-2"
          >
            {day}
          </div>
        ))}
      </div>

      {/* Calendar grid */}
      <div className="grid grid-cols-7 gap-1">
        {days.map((dayObj, index) => {
          const { day, isCurrentMonth, date } = dayObj;
          const isTodayDate = isToday(date);
          const isSelectedDate = isSelected(date);
          const isFuture = isFutureDate(date);
          const isPast = isPastDate(date);
          const isDisabled = isFuture || isPast;

          return (
            <button
              key={index}
              onClick={() => {
                if (isDisabled) return;
                const newSelectedDate = date;
                setInternalSelectedDate(newSelectedDate);
                onDateSelect?.(newSelectedDate);
              }}
              disabled={isDisabled}
              className={`
                h-9 w-9 rounded-md text-sm font-normal transition-colors
                ${
                  !isCurrentMonth
                    ? "text-gray-400 dark:text-gray-600 hover:text-gray-600 dark:hover:text-gray-400"
                    : "text-gray-900 dark:text-white hover:bg-gray-100 dark:hover:bg-slate-700"
                }
                ${
                  isTodayDate && isCurrentMonth && !selectedDate
                    ? "bg-cyan-600 text-white hover:bg-cyan-700"
                    : ""
                }
                ${isSelectedDate ? "bg-cyan-500 text-white" : ""}
                ${
                  isDisabled
                    ? "opacity-40 cursor-not-allowed hover:bg-transparent hover:text-gray-400 dark:hover:text-gray-600"
                    : ""
                }
                ${
                  !isTodayDate && !isSelectedDate && !isDisabled
                    ? "hover:bg-gray-100 dark:hover:bg-slate-800"
                    : ""
                }
              `}
            >
              {day}
            </button>
          );
        })}
      </div>
    </div>
  );
}

export { Calendar };
