import {
  Carousel,
  CarouselContent,
  CarouselItem,
  CarouselNext,
  CarouselPrevious,
  CarouselDots,
} from "@/components/ui/carousel";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";

interface Offer {
  id: string;
  title: string;
  imageAlt: string;
  ctaText: string;
  ctaHref: string;
}

const offers: Offer[] = [
  {
    id: "1",
    title: "Black friday -20% discount!",
    imageAlt: "Happy travelers enjoying their road trip",
    ctaText: "Learn more",
    ctaHref: "/offers/black-friday",
  },
  {
    id: "2",
    title: "Summer special - Free GPS!",
    imageAlt: "Family enjoying summer vacation by car",
    ctaText: "Book now",
    ctaHref: "/offers/summer-special",
  },
  {
    id: "3",
    title: "Weekend getaway 15% off",
    imageAlt: "Couple on a weekend road trip",
    ctaText: "View offer",
    ctaHref: "/offers/weekend-getaway",
  },
  {
    id: "4",
    title: "Loyalty bonus - Extra day free!",
    imageAlt: "Returning customer with rental car",
    ctaText: "Claim offer",
    ctaHref: "/offers/loyalty-bonus",
  },
];

export function SpecialOffersCarousel() {
  return (
    <Carousel
      opts={{
        align: "start",
        loop: true,
      }}
      className="w-full"
    >
      <CarouselContent className="-ml-2 md:-ml-4">
        {offers.map((offer) => (
          <CarouselItem
            key={offer.id}
            className="pl-2 md:pl-4 basis-full sm:basis-1/2 lg:basis-1/2"
          >
            <Card className="overflow-hidden border-0 shadow-lg h-full">
              <CardContent className="p-0 h-full flex flex-col">
                <div className="relative aspect-[16/10] bg-gray-200 flex items-center justify-center">
                  <div className="absolute inset-0 bg-gradient-to-br from-blue-400 to-blue-600 opacity-20" />
                  <div className="flex flex-col items-center justify-center text-gray-400 z-10">
                    <svg
                      className="w-16 h-16 mb-2"
                      fill="none"
                      stroke="currentColor"
                      viewBox="0 0 24 24"
                      xmlns="http://www.w3.org/2000/svg"
                    >
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        strokeWidth={1.5}
                        d="M14.828 14.828a4 4 0 01-5.656 0M9 10h.01M15 10h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z"
                      />
                    </svg>
                    <span className="text-sm">{offer.imageAlt}</span>
                  </div>
                </div>
                <div className="p-6 flex flex-col flex-grow">
                  <h3 className="text-xl font-bold text-gray-900 mb-4">
                    {offer.title}
                  </h3>
                  <div className="mt-auto">
                    <Button asChild className="w-full sm:w-auto">
                      <a href={offer.ctaHref}>{offer.ctaText}</a>
                    </Button>
                  </div>
                </div>
              </CardContent>
            </Card>
          </CarouselItem>
        ))}
      </CarouselContent>
      <div className="hidden md:block">
        <CarouselPrevious className="-left-4 lg:-left-12 bg-white shadow-md hover:bg-gray-50" />
        <CarouselNext className="-right-4 lg:-right-12 bg-white shadow-md hover:bg-gray-50" />
      </div>
      <CarouselDots />
    </Carousel>
  );
}
