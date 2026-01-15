import { useState, useEffect } from "react";
import { getCurrentLanguage, type LanguageCode } from "@/lib/i18n";
import hrTranslations from "@/i18n/translations/hr.json";
import enTranslations from "@/i18n/translations/en.json";
import frTranslations from "@/i18n/translations/fr.json";
import deTranslations from "@/i18n/translations/de.json";

const translations: Record<LanguageCode, typeof hrTranslations> = {
  hr: hrTranslations,
  en: enTranslations,
  fr: frTranslations,
  de: deTranslations,
};

type OfferCategory = "all" | "seasonal" | "discount" | "loyalty";
type SortOption = "newest" | "discount" | "expiring";

interface Offer {
  id: string;
  title: string;
  description: string;
  terms: string;
  discount: string;
  category: OfferCategory;
  validUntil: string;
  image: string;
}

const offerImages: Record<string, string> = {
  blackFriday: "https://images.unsplash.com/photo-1607083206869-4c7672e72a8a?w=600&h=400&fit=crop",
  summerSpecial: "https://images.unsplash.com/photo-1507525428034-b723cf961d3e?w=600&h=400&fit=crop",
  weekendGetaway: "https://images.unsplash.com/photo-1469854523086-cc02fe5d8800?w=600&h=400&fit=crop",
  loyaltyBonus: "https://images.unsplash.com/photo-1560472355-536de3962603?w=600&h=400&fit=crop",
  earlyBird: "https://images.unsplash.com/photo-1436491865332-7a61a109cc05?w=600&h=400&fit=crop",
  longTermRental: "https://images.unsplash.com/photo-1449965408869-eaa3f722e40d?w=600&h=400&fit=crop",
};

const offerValidDates: Record<string, string> = {
  blackFriday: "2026-11-30",
  summerSpecial: "2026-08-31",
  weekendGetaway: "2026-12-31",
  loyaltyBonus: "2026-12-31",
  earlyBird: "2026-12-31",
  longTermRental: "2026-12-31",
};

export function SpecialOffersPage() {
  const [language, setLanguage] = useState<LanguageCode>("hr");
  const [selectedCategory, setSelectedCategory] = useState<OfferCategory>("all");
  const [sortBy, setSortBy] = useState<SortOption>("newest");

  useEffect(() => {
    setLanguage(getCurrentLanguage());

    const handleLanguageChange = () => {
      setLanguage(getCurrentLanguage());
    };

    window.addEventListener("languagechange", handleLanguageChange);
    return () => {
      window.removeEventListener("languagechange", handleLanguageChange);
    };
  }, []);

  const t = translations[language].specialOffersPage;

  const categories: { key: OfferCategory; label: string }[] = [
    { key: "all", label: t.filterAll },
    { key: "seasonal", label: t.filterSeasonal },
    { key: "discount", label: t.filterDiscount },
    { key: "loyalty", label: t.filterLoyalty },
  ];

  const sortOptions: { key: SortOption; label: string }[] = [
    { key: "newest", label: t.sortNewest },
    { key: "discount", label: t.sortDiscount },
    { key: "expiring", label: t.sortExpiring },
  ];

  // Build offers array from translations
  const offers: Offer[] = Object.entries(t.offers).map(([key, offer]) => ({
    id: key,
    title: offer.title,
    description: offer.description,
    terms: offer.terms,
    discount: offer.discount,
    category: offer.category as OfferCategory,
    validUntil: offerValidDates[key] || "2026-12-31",
    image: offerImages[key] || "https://images.unsplash.com/photo-1449965408869-eaa3f722e40d?w=600&h=400&fit=crop",
  }));

  // Filter offers
  const filteredOffers =
    selectedCategory === "all"
      ? offers
      : offers.filter((o) => o.category === selectedCategory);

  // Sort offers
  const sortedOffers = [...filteredOffers].sort((a, b) => {
    switch (sortBy) {
      case "expiring":
        return new Date(a.validUntil).getTime() - new Date(b.validUntil).getTime();
      case "discount":
        // Extract numeric discount value for sorting
        const getDiscountValue = (discount: string) => {
          const match = discount.match(/-?(\d+)/);
          return match ? parseInt(match[1]) : 0;
        };
        return getDiscountValue(b.discount) - getDiscountValue(a.discount);
      case "newest":
      default:
        return 0; // Keep original order for newest
    }
  });

  const formatDate = (dateStr: string) => {
    const date = new Date(dateStr);
    return date.toLocaleDateString(language === "hr" ? "hr-HR" : language === "de" ? "de-DE" : language === "fr" ? "fr-FR" : "en-US", {
      day: "numeric",
      month: "long",
      year: "numeric",
    });
  };

  return (
    <section className="py-16 md:py-24 bg-gray-50 min-h-screen">
      <div className="container mx-auto px-4">
        {/* Section Header */}
        <div className="text-center mb-12">
          <h1 className="text-3xl md:text-4xl font-bold text-gray-900 mb-4">
            {t.pageTitle}
          </h1>
          <p className="text-lg text-gray-600 max-w-2xl mx-auto">
            {t.pageDescription}
          </p>
        </div>

        {/* Filters and Sorting */}
        <div className="flex flex-col md:flex-row justify-between items-center gap-4 mb-10">
          {/* Category Filter */}
          <div className="flex flex-wrap justify-center gap-2" role="group" aria-label="Filter offers">
            {categories.map((category) => (
              <button
                key={category.key}
                onClick={() => setSelectedCategory(category.key)}
                aria-pressed={selectedCategory === category.key}
                className={`px-4 py-2 rounded-full text-sm font-medium transition-colors ${
                  selectedCategory === category.key
                    ? "bg-primary text-white"
                    : "bg-white text-gray-600 hover:bg-gray-100 border border-gray-200"
                }`}
              >
                {category.label}
              </button>
            ))}
          </div>

          {/* Sort Dropdown */}
          <div className="flex items-center gap-2">
            <label htmlFor="sort-offers" className="text-sm text-gray-600">{t.sortBy}:</label>
            <select
              id="sort-offers"
              value={sortBy}
              onChange={(e) => setSortBy(e.target.value as SortOption)}
              className="px-3 py-2 rounded-lg border border-gray-200 bg-white text-sm text-gray-700 focus:outline-none focus:ring-2 focus:ring-primary focus:border-transparent"
            >
              {sortOptions.map((option) => (
                <option key={option.key} value={option.key}>
                  {option.label}
                </option>
              ))}
            </select>
          </div>
        </div>

        {/* Offers Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {sortedOffers.map((offer) => (
            <OfferCard
              key={offer.id}
              offer={offer}
              validUntilLabel={t.validUntil}
              termsLabel={t.termsApply}
              claimLabel={t.claimOffer}
              formatDate={formatDate}
            />
          ))}
        </div>
      </div>
    </section>
  );
}

interface OfferCardProps {
  offer: Offer;
  validUntilLabel: string;
  termsLabel: string;
  claimLabel: string;
  formatDate: (date: string) => string;
}

function OfferCard({ offer, validUntilLabel, termsLabel, claimLabel, formatDate }: OfferCardProps) {
  const getCategoryColor = (category: OfferCategory) => {
    switch (category) {
      case "seasonal":
        return "bg-orange-500";
      case "discount":
        return "bg-red-500";
      case "loyalty":
        return "bg-purple-500";
      default:
        return "bg-blue-500";
    }
  };

  return (
    <div className="bg-white rounded-xl shadow-sm border border-gray-100 overflow-hidden hover:shadow-md transition-shadow">
      {/* Image */}
      <div className="aspect-[3/2] bg-gray-100 relative overflow-hidden">
        <img
          src={offer.image}
          alt={offer.title}
          loading="lazy"
          decoding="async"
          className="w-full h-full object-cover"
        />
        {/* Discount Badge */}
        <span className="absolute top-3 left-3 bg-primary text-white text-sm font-bold px-3 py-1.5 rounded-full">
          {offer.discount}
        </span>
        {/* Category Badge */}
        <span className={`absolute top-3 right-3 ${getCategoryColor(offer.category)} text-white text-xs font-medium px-2.5 py-1 rounded-full capitalize`}>
          {offer.category}
        </span>
      </div>

      {/* Content */}
      <div className="p-5">
        <h3 className="text-lg font-semibold text-gray-900 mb-2">
          {offer.title}
        </h3>
        <p className="text-gray-600 text-sm mb-4">
          {offer.description}
        </p>

        {/* Terms */}
        <div className="bg-gray-50 rounded-lg p-3 mb-4">
          <p className="text-xs text-gray-500 mb-1 font-medium">{termsLabel}</p>
          <p className="text-xs text-gray-600">{offer.terms}</p>
        </div>

        {/* Valid Until */}
        <p className="text-xs text-gray-500 mb-4">
          {validUntilLabel}: <span className="font-medium text-gray-700">{formatDate(offer.validUntil)}</span>
        </p>

        {/* CTA Button */}
        <a
          href="/#booking"
          className="block w-full bg-primary hover:bg-primary/90 text-white font-medium py-2.5 px-4 rounded-lg transition-colors text-center"
        >
          {claimLabel}
        </a>
      </div>
    </div>
  );
}
