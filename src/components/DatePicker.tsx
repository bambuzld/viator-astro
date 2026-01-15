import * as React from "react";
import { format } from "date-fns";
import { CalendarIcon } from "lucide-react";

import { cn } from "@/lib/utils";
import { Button } from "@/components/ui/button";
import { Calendar } from "@/components/ui/calendar";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
import {
  getCurrentLanguage,
  getDateLocale,
  type LanguageCode,
} from "@/lib/i18n";

interface DatePickerProps {
  id?: string;
  value?: Date;
  onChange: (date: Date | undefined) => void;
  minDate?: Date;
  placeholder?: string;
  error?: string;
  disabled?: boolean;
  "aria-describedby"?: string;
}

export function DatePicker({
  id,
  value,
  onChange,
  minDate,
  placeholder = "Select date",
  error,
  disabled,
  "aria-describedby": ariaDescribedBy,
}: DatePickerProps) {
  const [open, setOpen] = React.useState(false);
  const [language, setLanguage] = React.useState<LanguageCode>("hr");

  React.useEffect(() => {
    setLanguage(getCurrentLanguage());

    const handleLanguageChange = (e: CustomEvent<{ language: LanguageCode }>) => {
      setLanguage(e.detail.language);
    };

    window.addEventListener("languagechange", handleLanguageChange as EventListener);
    return () => {
      window.removeEventListener("languagechange", handleLanguageChange as EventListener);
    };
  }, []);

  const locale = getDateLocale(language);

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
          aria-invalid={!!error}
          aria-describedby={ariaDescribedBy}
          aria-haspopup="dialog"
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
