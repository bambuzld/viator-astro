import * as React from "react";
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover";
import { Input } from "@/components/ui/input";
import { cn } from "@/lib/utils";
import { MapPin, Plane } from "lucide-react";

export interface Location {
  id: string;
  name: string;
  city: string;
  country: string;
  isAirport: boolean;
  code?: string;
}

const LOCATIONS: Location[] = [
  { id: "1", name: "Zagreb Airport", city: "Zagreb", country: "Croatia", isAirport: true, code: "ZAG" },
  { id: "2", name: "Split Airport", city: "Split", country: "Croatia", isAirport: true, code: "SPU" },
  { id: "3", name: "Dubrovnik Airport", city: "Dubrovnik", country: "Croatia", isAirport: true, code: "DBV" },
  { id: "4", name: "Zagreb City Center", city: "Zagreb", country: "Croatia", isAirport: false },
  { id: "5", name: "Split City Center", city: "Split", country: "Croatia", isAirport: false },
  { id: "6", name: "Dubrovnik Old Town", city: "Dubrovnik", country: "Croatia", isAirport: false },
  { id: "7", name: "Pula Airport", city: "Pula", country: "Croatia", isAirport: true, code: "PUY" },
  { id: "8", name: "Zadar Airport", city: "Zadar", country: "Croatia", isAirport: true, code: "ZAD" },
  { id: "9", name: "Rijeka City Center", city: "Rijeka", country: "Croatia", isAirport: false },
  { id: "10", name: "Rovinj", city: "Rovinj", country: "Croatia", isAirport: false },
];

interface LocationInputProps {
  id: string;
  placeholder?: string;
  value: Location | null;
  onChange: (location: Location | null) => void;
  className?: string;
  error?: string;
  "aria-describedby"?: string;
}

export function LocationInput({
  id,
  placeholder = "Search location...",
  value,
  onChange,
  className,
  error,
  "aria-describedby": ariaDescribedBy,
}: LocationInputProps) {
  const [open, setOpen] = React.useState(false);
  const [searchQuery, setSearchQuery] = React.useState("");
  const inputRef = React.useRef<HTMLInputElement>(null);

  const filteredLocations = React.useMemo(() => {
    if (!searchQuery) return LOCATIONS;
    const query = searchQuery.toLowerCase();
    return LOCATIONS.filter(
      (location) =>
        location.name.toLowerCase().includes(query) ||
        location.city.toLowerCase().includes(query) ||
        location.country.toLowerCase().includes(query) ||
        (location.code && location.code.toLowerCase().includes(query))
    );
  }, [searchQuery]);

  const handleSelect = (location: Location) => {
    onChange(location);
    setSearchQuery("");
    setOpen(false);
  };

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setSearchQuery(e.target.value);
    if (!open) setOpen(true);
    if (value) onChange(null);
  };

  const displayValue = value ? value.name : searchQuery;

  return (
    <Popover open={open} onOpenChange={setOpen}>
      <PopoverTrigger asChild>
        <div className={cn("relative", className)}>
          <MapPin className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
          <Input
            ref={inputRef}
            id={id}
            type="text"
            placeholder={placeholder}
            value={displayValue}
            onChange={handleInputChange}
            onFocus={() => setOpen(true)}
            className={cn(
              "pl-9 w-full",
              error && "border-red-500 focus-visible:ring-red-500"
            )}
            aria-expanded={open}
            aria-haspopup="listbox"
            aria-autocomplete="list"
            aria-invalid={!!error}
            aria-describedby={ariaDescribedBy}
            role="combobox"
          />
          {value?.isAirport && (
            <Plane className="absolute right-3 top-1/2 -translate-y-1/2 h-4 w-4 text-primary" />
          )}
        </div>
      </PopoverTrigger>
      <PopoverContent
        className="w-[var(--radix-popover-trigger-width)] p-0"
        align="start"
        onOpenAutoFocus={(e) => e.preventDefault()}
      >
        <ul
          role="listbox"
          className="max-h-60 overflow-auto py-1"
          aria-label="Location suggestions"
        >
          {filteredLocations.length === 0 ? (
            <li className="px-3 py-2 text-sm text-muted-foreground">
              No locations found
            </li>
          ) : (
            filteredLocations.map((location) => (
              <li
                key={location.id}
                role="option"
                aria-selected={value?.id === location.id}
                className={cn(
                  "flex items-center gap-2 px-3 py-2 text-sm cursor-pointer hover:bg-accent",
                  value?.id === location.id && "bg-accent"
                )}
                onClick={() => handleSelect(location)}
                onKeyDown={(e) => {
                  if (e.key === "Enter" || e.key === " ") {
                    e.preventDefault();
                    handleSelect(location);
                  }
                }}
                tabIndex={0}
              >
                {location.isAirport ? (
                  <Plane className="h-4 w-4 text-primary flex-shrink-0" />
                ) : (
                  <MapPin className="h-4 w-4 text-muted-foreground flex-shrink-0" />
                )}
                <div className="flex-1 min-w-0">
                  <div className="font-medium truncate">
                    {location.name}
                    {location.code && (
                      <span className="ml-1 text-xs text-muted-foreground">
                        ({location.code})
                      </span>
                    )}
                  </div>
                  <div className="text-xs text-muted-foreground truncate">
                    {location.city}, {location.country}
                  </div>
                </div>
                {location.isAirport && (
                  <span className="text-xs bg-primary/10 text-primary px-1.5 py-0.5 rounded flex-shrink-0">
                    Airport
                  </span>
                )}
              </li>
            ))
          )}
        </ul>
      </PopoverContent>
    </Popover>
  );
}
