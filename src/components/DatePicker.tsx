import * as React from "react";
import { format, type Locale } from "date-fns";
import { enUS, hr, fr, de } from "date-fns/locale";
import { CalendarIcon } from "lucide-react";

import { cn } from "@/lib/utils";
import { Button } from "@/components/ui/button";
import { Calendar } from "@/components/ui/calendar";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";

const locales: Record<string, Locale> = {
  en: enUS,
  hr: hr,
  fr: fr,
  de: de,
};

interface DatePickerProps {
  id?: string;
  value?: Date;
  onChange: (date: Date | undefined) => void;
  minDate?: Date;
  placeholder?: string;
  error?: string;
  disabled?: boolean;
}

export function DatePicker({
  id,
  value,
  onChange,
  minDate,
  placeholder = "Select date",
  error,
  disabled,
}: DatePickerProps) {
  const [open, setOpen] = React.useState(false);

  const getLocale = (): Locale => {
    if (typeof window !== "undefined") {
      const lang = localStorage.getItem("selectedLanguage") || "en";
      return locales[lang] || enUS;
    }
    return enUS;
  };

  const locale = getLocale();

  const formatDate = (date: Date): string => {
    return format(date, "PPP", { locale });
  };

  const handleSelect = (date: Date | undefined) => {
    onChange(date);
    setOpen(false);
  };

  const today = new Date();
  today.setHours(0, 0, 0, 0);

  const effectiveMinDate = minDate || today;

  return (
    <Popover open={open} onOpenChange={setOpen}>
      <PopoverTrigger asChild>
        <Button
          id={id}
          variant="outline"
          disabled={disabled}
          className={cn(
            "w-full justify-start text-left font-normal",
            !value && "text-muted-foreground",
            error && "border-red-500"
          )}
        >
          <CalendarIcon className="mr-2 h-4 w-4" />
          {value ? formatDate(value) : <span>{placeholder}</span>}
        </Button>
      </PopoverTrigger>
      <PopoverContent className="w-auto p-0" align="start">
        <Calendar
          mode="single"
          selected={value}
          onSelect={handleSelect}
          disabled={(date) => date < effectiveMinDate}
          initialFocus
          locale={locale}
        />
      </PopoverContent>
    </Popover>
  );
}
