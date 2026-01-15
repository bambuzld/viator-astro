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
import {
  type LanguageCode,
  getCurrentLanguage,
  getTranslations,
} from "@/lib/i18n";

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
  const [language, setLanguage] = React.useState<LanguageCode>("hr");
  const [differentReturnLocation, setDifferentReturnLocation] = React.useState(false);

  React.useEffect(() => {
    setLanguage(getCurrentLanguage());

    const handleStorageChange = () => {
      setLanguage(getCurrentLanguage());
    };

    const handleLanguageChange = (e: CustomEvent<{ language: LanguageCode }>) => {
      setLanguage(e.detail.language);
    };

    window.addEventListener("storage", handleStorageChange);
    window.addEventListener("languagechange", handleLanguageChange as EventListener);
    return () => {
      window.removeEventListener("storage", handleStorageChange);
      window.removeEventListener("languagechange", handleLanguageChange as EventListener);
    };
  }, []);

  const t = getTranslations(language);

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
      setError("pickupLocation", { message: t.booking.errors.pickupLocationRequired });
      isValid = false;
    }

    if (differentReturnLocation && !data.dropoffLocation) {
      setError("dropoffLocation", { message: t.booking.errors.dropoffLocationRequired });
      isValid = false;
    }

    if (!data.pickupDate) {
      setError("pickupDate", { message: t.booking.errors.pickupDateRequired });
      isValid = false;
    }

    if (!data.returnDate) {
      setError("returnDate", { message: t.booking.errors.returnDateRequired });
      isValid = false;
    } else if (data.pickupDate && data.returnDate < data.pickupDate) {
      setError("returnDate", { message: t.booking.errors.returnDateBeforePickup });
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
        <CardTitle className="text-xl font-semibold">{t.booking.title}</CardTitle>
      </CardHeader>
      <CardContent>
        <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
            <div className="space-y-2">
              <Label htmlFor="pickup-location">{t.booking.pickupLocation}</Label>
              <Controller
                name="pickupLocation"
                control={control}
                render={({ field }) => (
                  <LocationInput
                    id="pickup-location"
                    placeholder={t.booking.placeholder.location}
                    value={field.value}
                    onChange={field.onChange}
                    error={errors.pickupLocation?.message}
                    aria-describedby={errors.pickupLocation ? "pickup-location-error" : undefined}
                  />
                )}
              />
              {errors.pickupLocation && (
                <p id="pickup-location-error" role="alert" className="text-xs text-red-500">{errors.pickupLocation.message}</p>
              )}
            </div>
            <div className="space-y-2">
              <Label htmlFor="pickup-date">{t.booking.pickupDate}</Label>
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
                    placeholder={t.booking.placeholder.selectDate}
                    error={errors.pickupDate?.message}
                    aria-describedby={errors.pickupDate ? "pickup-date-error" : undefined}
                  />
                )}
              />
              {errors.pickupDate && (
                <p id="pickup-date-error" role="alert" className="text-xs text-red-500">{errors.pickupDate.message}</p>
              )}
            </div>
            <div className="space-y-2">
              <Label htmlFor="pickup-time">{t.booking.pickupTime}</Label>
              <Controller
                name="pickupTime"
                control={control}
                render={({ field }) => (
                  <TimeSelect
                    id="pickup-time"
                    value={field.value}
                    onChange={field.onChange}
                    placeholder={t.booking.placeholder.selectTime}
                  />
                )}
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="return-date">{t.booking.returnDate}</Label>
              <Controller
                name="returnDate"
                control={control}
                render={({ field }) => (
                  <DatePicker
                    id="return-date"
                    value={field.value}
                    onChange={field.onChange}
                    minDate={pickupDate}
                    placeholder={t.booking.placeholder.selectDate}
                    error={errors.returnDate?.message}
                    aria-describedby={errors.returnDate ? "return-date-error" : undefined}
                  />
                )}
              />
              {errors.returnDate && (
                <p id="return-date-error" role="alert" className="text-xs text-red-500">{errors.returnDate.message}</p>
              )}
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
            <div></div>
            <div></div>
            <div className="space-y-2">
              <Label htmlFor="return-time">{t.booking.returnTime}</Label>
              <Controller
                name="returnTime"
                control={control}
                render={({ field }) => (
                  <TimeSelect
                    id="return-time"
                    value={field.value}
                    onChange={field.onChange}
                    placeholder={t.booking.placeholder.selectTime}
                  />
                )}
              />
            </div>
            <div className="flex items-end">
              <Button type="submit" className="w-full">
                {t.common.searchCars}
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
              {t.booking.differentReturnLocation}
            </Label>
          </div>

          {differentReturnLocation && (
            <div className="space-y-2 max-w-sm">
              <Label htmlFor="dropoff-location">{t.booking.dropoffLocation}</Label>
              <Controller
                name="dropoffLocation"
                control={control}
                render={({ field }) => (
                  <LocationInput
                    id="dropoff-location"
                    placeholder={t.booking.placeholder.location}
                    value={field.value}
                    onChange={field.onChange}
                    error={errors.dropoffLocation?.message}
                    aria-describedby={errors.dropoffLocation ? "dropoff-location-error" : undefined}
                  />
                )}
              />
              {errors.dropoffLocation && (
                <p id="dropoff-location-error" role="alert" className="text-xs text-red-500">{errors.dropoffLocation.message}</p>
              )}
            </div>
          )}
        </form>
      </CardContent>
    </Card>
  );
}
