import * as React from "react";
import { useForm, Controller } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Label } from "@/components/ui/label";
import { Checkbox } from "@/components/ui/checkbox";
import { LocationInput, type Location } from "@/components/LocationInput";
import { DatePicker } from "@/components/DatePicker";
import { TimeSelect } from "@/components/TimeSelect";

const LANGUAGE_STORAGE_KEY = "preferred-language";

type LanguageCode = "en" | "hr" | "fr" | "de";

const errorMessages: Record<LanguageCode, {
  pickupLocationRequired: string;
  dropoffLocationRequired: string;
  pickupDateRequired: string;
  returnDateRequired: string;
  returnDateBeforePickup: string;
}> = {
  en: {
    pickupLocationRequired: "Please select a pick-up location",
    dropoffLocationRequired: "Please select a drop-off location",
    pickupDateRequired: "Please select a pick-up date",
    returnDateRequired: "Please select a return date",
    returnDateBeforePickup: "Return date cannot be before pick-up date",
  },
  hr: {
    pickupLocationRequired: "Molimo odaberite lokaciju preuzimanja",
    dropoffLocationRequired: "Molimo odaberite lokaciju povrata",
    pickupDateRequired: "Molimo odaberite datum preuzimanja",
    returnDateRequired: "Molimo odaberite datum povrata",
    returnDateBeforePickup: "Datum povrata ne može biti prije datuma preuzimanja",
  },
  fr: {
    pickupLocationRequired: "Veuillez sélectionner un lieu de prise en charge",
    dropoffLocationRequired: "Veuillez sélectionner un lieu de retour",
    pickupDateRequired: "Veuillez sélectionner une date de prise en charge",
    returnDateRequired: "Veuillez sélectionner une date de retour",
    returnDateBeforePickup: "La date de retour ne peut pas être antérieure à la date de prise en charge",
  },
  de: {
    pickupLocationRequired: "Bitte wählen Sie einen Abholort",
    dropoffLocationRequired: "Bitte wählen Sie einen Rückgabeort",
    pickupDateRequired: "Bitte wählen Sie ein Abholdatum",
    returnDateRequired: "Bitte wählen Sie ein Rückgabedatum",
    returnDateBeforePickup: "Das Rückgabedatum kann nicht vor dem Abholdatum liegen",
  },
};

function getLanguage(): LanguageCode {
  if (typeof window === "undefined") return "en";
  const stored = localStorage.getItem(LANGUAGE_STORAGE_KEY);
  if (stored && ["en", "hr", "fr", "de"].includes(stored)) {
    return stored as LanguageCode;
  }
  return "en";
}

const bookingSchema = z.object({
  pickupLocation: z.custom<Location | null>(),
  dropoffLocation: z.custom<Location | null>(),
  pickupDate: z.date().optional(),
  pickupTime: z.string(),
  returnDate: z.date().optional(),
  returnTime: z.string(),
  differentReturnLocation: z.boolean(),
});

type BookingFormData = z.infer<typeof bookingSchema>;

export function BookingForm() {
  const [language, setLanguage] = React.useState<LanguageCode>("en");
  const [differentReturnLocation, setDifferentReturnLocation] = React.useState(false);

  React.useEffect(() => {
    setLanguage(getLanguage());

    const handleStorageChange = () => {
      setLanguage(getLanguage());
    };

    window.addEventListener("storage", handleStorageChange);
    return () => window.removeEventListener("storage", handleStorageChange);
  }, []);

  const messages = errorMessages[language];

  const {
    control,
    handleSubmit,
    watch,
    setValue,
    setError,
    clearErrors,
    formState: { errors },
  } = useForm<BookingFormData>({
    resolver: zodResolver(bookingSchema),
    mode: "onChange",
    defaultValues: {
      pickupLocation: null,
      dropoffLocation: null,
      pickupDate: undefined,
      pickupTime: "10:00",
      returnDate: undefined,
      returnTime: "10:00",
      differentReturnLocation: false,
    },
  });

  const pickupDate = watch("pickupDate");

  const validateForm = (data: BookingFormData): boolean => {
    let isValid = true;
    clearErrors();

    if (!data.pickupLocation) {
      setError("pickupLocation", { message: messages.pickupLocationRequired });
      isValid = false;
    }

    if (differentReturnLocation && !data.dropoffLocation) {
      setError("dropoffLocation", { message: messages.dropoffLocationRequired });
      isValid = false;
    }

    if (!data.pickupDate) {
      setError("pickupDate", { message: messages.pickupDateRequired });
      isValid = false;
    }

    if (!data.returnDate) {
      setError("returnDate", { message: messages.returnDateRequired });
      isValid = false;
    } else if (data.pickupDate && data.returnDate < data.pickupDate) {
      setError("returnDate", { message: messages.returnDateBeforePickup });
      isValid = false;
    }

    return isValid;
  };

  const onSubmit = (data: BookingFormData) => {
    if (!validateForm(data)) {
      return;
    }

    const effectiveDropoff = data.differentReturnLocation
      ? data.dropoffLocation
      : data.pickupLocation;
    console.log("Form submitted:", {
      pickupLocation: data.pickupLocation,
      dropoffLocation: effectiveDropoff,
      pickupDate: data.pickupDate,
      pickupTime: data.pickupTime,
      returnDate: data.returnDate,
      returnTime: data.returnTime,
    });
  };

  const handleDifferentReturnChange = (checked: boolean) => {
    setDifferentReturnLocation(checked);
    setValue("differentReturnLocation", checked);
    if (!checked) {
      setValue("dropoffLocation", null);
      clearErrors("dropoffLocation");
    }
  };

  return (
    <Card className="w-full max-w-4xl mx-auto shadow-xl">
      <CardHeader className="pb-4">
        <CardTitle className="text-xl font-semibold">Book Your Car</CardTitle>
      </CardHeader>
      <CardContent>
        <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
            <div className="space-y-2">
              <Label htmlFor="pickup-location">Pick-up Location</Label>
              <Controller
                name="pickupLocation"
                control={control}
                render={({ field }) => (
                  <LocationInput
                    id="pickup-location"
                    placeholder="Airport, city..."
                    value={field.value}
                    onChange={field.onChange}
                    error={errors.pickupLocation?.message}
                  />
                )}
              />
              {errors.pickupLocation && (
                <p className="text-xs text-red-500">{errors.pickupLocation.message}</p>
              )}
            </div>
            <div className="space-y-2">
              <Label htmlFor="pickup-date">Pick-up Date</Label>
              <Controller
                name="pickupDate"
                control={control}
                render={({ field }) => (
                  <DatePicker
                    id="pickup-date"
                    value={field.value}
                    onChange={(date) => {
                      field.onChange(date);
                      const returnDate = watch("returnDate");
                      if (date && returnDate && returnDate < date) {
                        setValue("returnDate", undefined);
                      }
                    }}
                    placeholder="Select date"
                    error={errors.pickupDate?.message}
                  />
                )}
              />
              {errors.pickupDate && (
                <p className="text-xs text-red-500">{errors.pickupDate.message}</p>
              )}
            </div>
            <div className="space-y-2">
              <Label htmlFor="pickup-time">Pick-up Time</Label>
              <Controller
                name="pickupTime"
                control={control}
                render={({ field }) => (
                  <TimeSelect
                    id="pickup-time"
                    value={field.value}
                    onChange={field.onChange}
                    placeholder="Select time"
                  />
                )}
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="return-date">Return Date</Label>
              <Controller
                name="returnDate"
                control={control}
                render={({ field }) => (
                  <DatePicker
                    id="return-date"
                    value={field.value}
                    onChange={field.onChange}
                    minDate={pickupDate}
                    placeholder="Select date"
                    error={errors.returnDate?.message}
                  />
                )}
              />
              {errors.returnDate && (
                <p className="text-xs text-red-500">{errors.returnDate.message}</p>
              )}
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
            <div></div>
            <div></div>
            <div className="space-y-2">
              <Label htmlFor="return-time">Return Time</Label>
              <Controller
                name="returnTime"
                control={control}
                render={({ field }) => (
                  <TimeSelect
                    id="return-time"
                    value={field.value}
                    onChange={field.onChange}
                    placeholder="Select time"
                  />
                )}
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
              <Controller
                name="dropoffLocation"
                control={control}
                render={({ field }) => (
                  <LocationInput
                    id="dropoff-location"
                    placeholder="Airport, city..."
                    value={field.value}
                    onChange={field.onChange}
                    error={errors.dropoffLocation?.message}
                  />
                )}
              />
              {errors.dropoffLocation && (
                <p className="text-xs text-red-500">{errors.dropoffLocation.message}</p>
              )}
            </div>
          )}
        </form>
      </CardContent>
    </Card>
  );
}
