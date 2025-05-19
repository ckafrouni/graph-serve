'use client';

import * as React from 'react';
import dayjs from 'dayjs';
import { Calendar as CalendarIcon } from 'lucide-react';

import { cn } from '@workspace/ui/lib/utils';
import { Button } from '@workspace/ui/components/ui/button';
import { Calendar } from '@workspace/ui/components/ui/calendar';
import { Popover, PopoverContent, PopoverTrigger } from '@workspace/ui/components/ui/popover';

interface DatePickerProps {
  value?: Date | string | null;
  onChange: (date: Date | undefined) => void;
  placeholder?: string;
  className?: string;
  format?: string;
}

export function DatePicker({
  value,
  onChange,
  placeholder = 'Pick a date',
  className,
  format = 'DD.MM.YYYY',
}: DatePickerProps) {
  // Convert string date to Date object if needed
  const dateValue = React.useMemo(() => {
    if (!value) return undefined;
    if (value instanceof Date) {
      return value;
    }
    const date = dayjs(value).toDate();
    return isNaN(date.getTime()) ? undefined : date;
  }, [value]);

  return (
    <Popover>
      <PopoverTrigger asChild>
        <Button
          variant={'outline'}
          className={cn(
            'w-full justify-start text-left font-normal',
            !dateValue && 'text-muted-foreground',
            className
          )}
        >
          <CalendarIcon className="h-4 w-4" />
          {dateValue ? dayjs(dateValue).format(format) : <span>{placeholder}</span>}
        </Button>
      </PopoverTrigger>
      <PopoverContent className="w-auto p-0" align="start">
        <Calendar mode="single" selected={dateValue} onSelect={onChange} initialFocus />
      </PopoverContent>
    </Popover>
  );
}
