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

export interface Vehicle {
  id: string;
  name: string;
  category: "economy" | "compact" | "suv" | "luxury";
  image: string;
  passengers: number;
  doors: number;
  luggage: number;
  transmission: "automatic" | "manual";
  hasAC: boolean;
  pricePerDay: number;
}

interface VehicleCardProps {
  vehicle: Vehicle;
}

export function VehicleCard({ vehicle }: VehicleCardProps) {
  const [language, setLanguage] = useState<LanguageCode>("hr");

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

  const t = translations[language].fleet;

  return (
    <div className="bg-white rounded-xl shadow-sm border border-gray-100 overflow-hidden hover:shadow-md transition-shadow">
      {/* Vehicle Image */}
      <div className="aspect-[4/3] bg-gray-100 relative overflow-hidden">
        <img
          src={vehicle.image}
          alt={vehicle.name}
          className="w-full h-full object-cover"
        />
        <span className="absolute top-3 left-3 bg-primary text-white text-xs font-medium px-2.5 py-1 rounded-full">
          {t.categories[vehicle.category]}
        </span>
      </div>

      {/* Vehicle Info */}
      <div className="p-5">
        <h3 className="text-lg font-semibold text-gray-900 mb-3">
          {vehicle.name}
        </h3>

        {/* Specifications Grid */}
        <div className="grid grid-cols-3 gap-3 mb-4">
          <div className="flex items-center gap-1.5 text-sm text-gray-600">
            <svg
              className="w-4 h-4 text-gray-400"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z"
              />
            </svg>
            <span>{vehicle.passengers}</span>
          </div>
          <div className="flex items-center gap-1.5 text-sm text-gray-600">
            <svg
              className="w-4 h-4 text-gray-400"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M8 7h8M8 12h8m-8 5h8"
              />
            </svg>
            <span>{vehicle.doors}</span>
          </div>
          <div className="flex items-center gap-1.5 text-sm text-gray-600">
            <svg
              className="w-4 h-4 text-gray-400"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M20 7l-8-4-8 4m16 0l-8 4m8-4v10l-8 4m0-10L4 7m8 4v10M4 7v10l8 4"
              />
            </svg>
            <span>{vehicle.luggage}</span>
          </div>
        </div>

        {/* Features Row */}
        <div className="flex items-center gap-3 mb-4 text-sm text-gray-600">
          <span className="flex items-center gap-1">
            <svg
              className="w-4 h-4 text-gray-400"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M10.325 4.317c.426-1.756 2.924-1.756 3.35 0a1.724 1.724 0 002.573 1.066c1.543-.94 3.31.826 2.37 2.37a1.724 1.724 0 001.065 2.572c1.756.426 1.756 2.924 0 3.35a1.724 1.724 0 00-1.066 2.573c.94 1.543-.826 3.31-2.37 2.37a1.724 1.724 0 00-2.572 1.065c-.426 1.756-2.924 1.756-3.35 0a1.724 1.724 0 00-2.573-1.066c-1.543.94-3.31-.826-2.37-2.37a1.724 1.724 0 00-1.065-2.572c-1.756-.426-1.756-2.924 0-3.35a1.724 1.724 0 001.066-2.573c-.94-1.543.826-3.31 2.37-2.37.996.608 2.296.07 2.572-1.065z"
              />
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M15 12a3 3 0 11-6 0 3 3 0 016 0z"
              />
            </svg>
            {vehicle.transmission === "automatic"
              ? t.specifications.automatic
              : t.specifications.manual}
          </span>
          {vehicle.hasAC && (
            <span className="flex items-center gap-1">
              <svg
                className="w-4 h-4 text-gray-400"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M9.75 17L9 20l-1 1h8l-1-1-.75-3M3 13h18M5 17h14a2 2 0 002-2V5a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z"
                />
              </svg>
              {t.specifications.airConditioning}
            </span>
          )}
        </div>

        {/* Price and CTA */}
        <div className="flex items-center justify-between pt-4 border-t border-gray-100">
          <div>
            <span className="text-sm text-gray-500">{t.priceFrom}</span>
            <div className="flex items-baseline gap-0.5">
              <span className="text-2xl font-bold text-gray-900">
                €{vehicle.pricePerDay}
              </span>
              <span className="text-sm text-gray-500">{t.perDay}</span>
            </div>
          </div>
          <button className="bg-primary hover:bg-primary/90 text-white font-medium px-4 py-2 rounded-lg transition-colors">
            {t.bookNow}
          </button>
        </div>
      </div>
    </div>
  );
}
