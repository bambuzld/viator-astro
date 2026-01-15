import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";

export function BookingForm() {
  return (
    <Card className="w-full max-w-4xl mx-auto shadow-xl">
      <CardHeader className="pb-4">
        <CardTitle className="text-xl font-semibold">Book Your Car</CardTitle>
      </CardHeader>
      <CardContent>
        <form className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
          <div className="space-y-2">
            <Label htmlFor="pickup-location">Pick-up Location</Label>
            <Input
              id="pickup-location"
              placeholder="Airport, city..."
              className="w-full"
            />
          </div>
          <div className="space-y-2">
            <Label htmlFor="pickup-date">Pick-up Date</Label>
            <Input id="pickup-date" type="date" className="w-full" />
          </div>
          <div className="space-y-2">
            <Label htmlFor="return-date">Return Date</Label>
            <Input id="return-date" type="date" className="w-full" />
          </div>
          <div className="flex items-end">
            <Button type="submit" className="w-full">
              Search Cars
            </Button>
          </div>
        </form>
      </CardContent>
    </Card>
  );
}
