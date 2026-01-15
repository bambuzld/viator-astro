import * as React from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Label } from "@/components/ui/label";
import { Checkbox } from "@/components/ui/checkbox";
import { LocationInput, type Location } from "@/components/LocationInput";
import { DatePicker } from "@/components/DatePicker";
import { TimeSelect } from "@/components/TimeSelect";

export function BookingForm() {
  const [pickupLocation, setPickupLocation] = React.useState<Location | null>(null);
  const [dropoffLocation, setDropoffLocation] = React.useState<Location | null>(null);
  const [differentReturnLocation, setDifferentReturnLocation] = React.useState(false);
  const [pickupDate, setPickupDate] = React.useState<Date | undefined>();
  const [pickupTime, setPickupTime] = React.useState<string>("10:00");
  const [returnDate, setReturnDate] = React.useState<Date | undefined>();
  const [returnTime, setReturnTime] = React.useState<string>("10:00");
  const [errors, setErrors] = React.useState<{
    pickupLocation?: string;
    dropoffLocation?: string;
    pickupDate?: string;
    returnDate?: string;
  }>({});

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();

    const newErrors: typeof errors = {};

    if (!pickupLocation) {
      newErrors.pickupLocation = "Please select a pick-up location";
    }

    if (differentReturnLocation && !dropoffLocation) {
      newErrors.dropoffLocation = "Please select a drop-off location";
    }

    if (!pickupDate) {
      newErrors.pickupDate = "Please select a pick-up date";
    }

    if (!returnDate) {
      newErrors.returnDate = "Please select a return date";
    } else if (pickupDate && returnDate < pickupDate) {
      newErrors.returnDate = "Return date cannot be before pick-up date";
    }

    setErrors(newErrors);

    if (Object.keys(newErrors).length === 0) {
      const effectiveDropoff = differentReturnLocation ? dropoffLocation : pickupLocation;
      console.log("Form submitted:", {
        pickupLocation,
        dropoffLocation: effectiveDropoff,
        pickupDate,
        pickupTime,
        returnDate,
        returnTime,
      });
    }
  };

  const handlePickupDateChange = (date: Date | undefined) => {
    setPickupDate(date);
    if (date) {
      setErrors((prev) => ({ ...prev, pickupDate: undefined }));
      if (returnDate && returnDate < date) {
        setReturnDate(undefined);
      }
    }
  };

  const handleReturnDateChange = (date: Date | undefined) => {
    setReturnDate(date);
    if (date) {
      setErrors((prev) => ({ ...prev, returnDate: undefined }));
    }
  };

  const handleDifferentReturnChange = (checked: boolean) => {
    setDifferentReturnLocation(checked);
    if (!checked) {
      setDropoffLocation(null);
      setErrors((prev) => ({ ...prev, dropoffLocation: undefined }));
    }
  };

  return (
    <Card className="w-full max-w-4xl mx-auto shadow-xl">
      <CardHeader className="pb-4">
        <CardTitle className="text-xl font-semibold">Book Your Car</CardTitle>
      </CardHeader>
      <CardContent>
        <form onSubmit={handleSubmit} className="space-y-4">
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
            <div className="space-y-2">
              <Label htmlFor="pickup-location">Pick-up Location</Label>
              <LocationInput
                id="pickup-location"
                placeholder="Airport, city..."
                value={pickupLocation}
                onChange={(location) => {
                  setPickupLocation(location);
                  if (location) {
                    setErrors((prev) => ({ ...prev, pickupLocation: undefined }));
                  }
                }}
                error={errors.pickupLocation}
              />
              {errors.pickupLocation && (
                <p className="text-xs text-red-500">{errors.pickupLocation}</p>
              )}
            </div>
            <div className="space-y-2">
              <Label htmlFor="pickup-date">Pick-up Date</Label>
              <DatePicker
                id="pickup-date"
                value={pickupDate}
                onChange={handlePickupDateChange}
                placeholder="Select date"
                error={errors.pickupDate}
              />
              {errors.pickupDate && (
                <p className="text-xs text-red-500">{errors.pickupDate}</p>
              )}
            </div>
            <div className="space-y-2">
              <Label htmlFor="pickup-time">Pick-up Time</Label>
              <TimeSelect
                id="pickup-time"
                value={pickupTime}
                onChange={setPickupTime}
                placeholder="Select time"
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="return-date">Return Date</Label>
              <DatePicker
                id="return-date"
                value={returnDate}
                onChange={handleReturnDateChange}
                minDate={pickupDate}
                placeholder="Select date"
                error={errors.returnDate}
              />
              {errors.returnDate && (
                <p className="text-xs text-red-500">{errors.returnDate}</p>
              )}
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
            <div></div>
            <div></div>
            <div className="space-y-2">
              <Label htmlFor="return-time">Return Time</Label>
              <TimeSelect
                id="return-time"
                value={returnTime}
                onChange={setReturnTime}
                placeholder="Select time"
              />
            </div>
            <div className="flex items-end">
              <Button type="submit" className="w-full">
                Search Cars
              </Button>
            </div>
          </div>

          <div className="flex items-center space-x-2">
            <Checkbox
              id="different-return"
              checked={differentReturnLocation}
              onCheckedChange={handleDifferentReturnChange}
            />
            <Label
              htmlFor="different-return"
              className="text-sm font-normal cursor-pointer"
            >
              Different return location
            </Label>
          </div>

          {differentReturnLocation && (
            <div className="space-y-2 max-w-sm">
              <Label htmlFor="dropoff-location">Drop-off Location</Label>
              <LocationInput
                id="dropoff-location"
                placeholder="Airport, city..."
                value={dropoffLocation}
                onChange={(location) => {
                  setDropoffLocation(location);
                  if (location) {
                    setErrors((prev) => ({ ...prev, dropoffLocation: undefined }));
                  }
                }}
                error={errors.dropoffLocation}
              />
              {errors.dropoffLocation && (
                <p className="text-xs text-red-500">{errors.dropoffLocation}</p>
              )}
            </div>
          )}
        </form>
      </CardContent>
    </Card>
  );
}
