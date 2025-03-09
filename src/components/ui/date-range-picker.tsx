"use client";

import { Button } from "@/components/ui/button";
import { Calendar } from "@/components/ui/calendar";
import {
  endOfMonth,
  endOfYear,
  format,
  startOfMonth,
  startOfYear,
  subDays,
  subMonths,
  subYears,
} from "date-fns";
import { useState } from "react";
import { DateRange } from "react-day-picker";
import { cn } from "@/lib/utils";
import { CalendarIcon } from "lucide-react";

// Helper function to format a date range into a display string
function formatDateRange(range: DateRange): string {
  if (!range.from) return "Select a date range";
  
  if (!range.to) {
    return `${format(range.from, "MMM d, yyyy")} - Select end date`;
  }
  
  if (range.from.getTime() === range.to.getTime()) {
    return format(range.from, "MMM d, yyyy");
  }
  
  return `${format(range.from, "MMM d")} - ${format(range.to, "MMM d, yyyy")}`;
}

export interface DateRangePickerProps {
  initialDateRange?: DateRange;
  onRangeChange?: (range: DateRange) => void;
  className?: string;
  showBorder?: boolean;
}

export function DateRangePicker({ 
  initialDateRange, 
  onRangeChange,
  className,
  showBorder = true 
}: DateRangePickerProps) {
  const today = new Date();
  
  // Define preset ranges - removed single-day options
  const presets = {
    last7Days: {
      label: "Last 7 days",
      range: {
        from: subDays(today, 6),
        to: today,
      }
    },
    last14Days: {
      label: "Last 14 days",
      range: {
        from: subDays(today, 13),
        to: today,
      }
    },
    last30Days: {
      label: "Last 30 days",
      range: {
        from: subDays(today, 29),
        to: today,
      }
    },
    monthToDate: {
      label: "Month to date",
      range: {
        from: startOfMonth(today),
        to: today,
      }
    },
    lastMonth: {
      label: "Last month",
      range: {
        from: startOfMonth(subMonths(today, 1)),
        to: endOfMonth(subMonths(today, 1)),
      }
    },
    yearToDate: {
      label: "Year to date",
      range: {
        from: startOfYear(today),
        to: today,
      }
    },
    lastYear: {
      label: "Last year",
      range: {
        from: startOfYear(subYears(today, 1)),
        to: endOfYear(subYears(today, 1)),
      }
    }
  };
  
  // Initialize with provided date range or default to last 7 days
  const [month, setMonth] = useState(initialDateRange?.from || today);
  const [date, setDate] = useState<DateRange | undefined>(
    initialDateRange || presets.last7Days.range
  );
  const [selectionInProgress, setSelectionInProgress] = useState(false);

  const handleRangeChange = (newRange: DateRange | undefined) => {
    if (!newRange) return;
    
    // Always update internal state
    setDate(newRange);
    
    // Check if we have both from and to dates
    if (newRange.from && newRange.to) {
      setSelectionInProgress(false);
      
      // Only notify parent when we have a complete range
      if (onRangeChange) {
        onRangeChange(newRange);
      }
    } else if (newRange.from) {
      // Selection in progress - only have start date
      setSelectionInProgress(true);
    }
  };

  const selectPreset = (presetRange: DateRange) => {
    setDate(presetRange);
    setSelectionInProgress(false);
    // Update visible month based on the selected range's to date
    if (presetRange.to) {
      setMonth(presetRange.to);
    }
    if (onRangeChange) {
      onRangeChange(presetRange);
    }
  };

  const containerClass = showBorder 
    ? "rounded-lg border border-border" 
    : "";

  return (
    <div className={className}>
      <div className={containerClass}>
        <div className="flex max-sm:flex-col">
          <div className="relative border-border py-2 max-sm:order-1 max-sm:border-t sm:w-36">
            <div className="h-full border-border sm:border-e">
              <div className="flex flex-col px-2">
                {Object.values(presets).map((preset) => (
                  <Button
                    key={preset.label}
                    variant="ghost"
                    size="sm"
                    className="w-full justify-start text-sm"
                    onClick={() => selectPreset(preset.range)}
                  >
                    {preset.label}
                  </Button>
                ))}
              </div>
            </div>
          </div>
          <div className="p-2">
            {selectionInProgress && (
              <div className="text-center mb-2 text-sm bg-muted text-muted-foreground p-1 rounded">
                Select end date to complete range
              </div>
            )}
            <Calendar
              initialFocus
              mode="range"
              defaultMonth={month}
              selected={date}
              onSelect={handleRangeChange}
              numberOfMonths={1}
              disabled={[{ after: today }]}
              className="border-none"
            />
          </div>
        </div>
      </div>
    </div>
  );
}

// Re-export the formatting function
export { formatDateRange }; 