import { useState, useEffect } from "react";
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
import { offersApi, extractCollectionItems, type ApiOffer } from "@/lib/api";

interface Offer {
  id: string;
  title: string;
  description: string;
  imageUrl: string;
  discountLabel: string;
  ctaHref: string;
}

/**
 * Transform API offer to component offer format
 */
function transformApiOffer(apiOffer: ApiOffer): Offer {
  return {
    id: apiOffer.id,
    title: apiOffer.title,
    description: apiOffer.description,
    imageUrl: apiOffer.imageUrl,
    discountLabel: apiOffer.discountLabel,
    ctaHref: `/special-offers#offer-${apiOffer.id}`,
  };
}

export function SpecialOffersCarousel() {
  const [offers, setOffers] = useState<Offer[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    async function fetchOffers() {
      try {
        const response = await offersApi.getAll({ active: true });
        const apiOffers = extractCollectionItems(response);
        setOffers(apiOffers.map(transformApiOffer));
      } catch (err) {
        console.error("Failed to fetch offers:", err);
      } finally {
        setIsLoading(false);
      }
    }

    fetchOffers();
  }, []);

  if (isLoading) {
    return (
      <div className="w-full">
        <div className="flex gap-4">
          {[...Array(2)].map((_, i) => (
            <div key={i} className="flex-1 bg-white rounded-xl shadow-lg overflow-hidden animate-pulse">
              <div className="aspect-[16/10] bg-gray-200" />
              <div className="p-6 space-y-3">
                <div className="h-6 bg-gray-200 rounded w-3/4" />
                <div className="h-10 bg-gray-200 rounded w-1/3" />
              </div>
            </div>
          ))}
        </div>
      </div>
    );
  }

  if (offers.length === 0) {
    return null;
  }
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
                <div className="relative aspect-[16/10] bg-gray-200">
                  <img
                    src={offer.imageUrl}
                    alt={offer.title}
                    className="w-full h-full object-cover"
                    loading="lazy"
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-black/60 to-transparent" />
                  {offer.discountLabel && (
                    <span className="absolute top-3 right-3 bg-red-500 text-white text-sm font-bold px-3 py-1 rounded-full">
                      {offer.discountLabel}
                    </span>
                  )}
                </div>
                <div className="p-6 flex flex-col flex-grow">
                  <h3 className="text-xl font-bold text-gray-900 mb-2">
                    {offer.title}
                  </h3>
                  <p className="text-gray-600 text-sm mb-4 line-clamp-2">
                    {offer.description}
                  </p>
                  <div className="mt-auto">
                    <Button asChild className="w-full sm:w-auto">
                      <a href={offer.ctaHref}>View offer</a>
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
