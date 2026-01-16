import { useState, useEffect } from "react";
import { getCurrentLanguage, type LanguageCode } from "@/lib/i18n";
import { cn } from "@/lib/utils";
import { officesApi, extractCollectionItems, type ApiOffice } from "@/lib/api";
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

type OfficeType = "all" | "airport" | "city";

interface Office {
  id: string;
  name: string;
  address: string;
  phone: string;
  email: string;
  type: OfficeType;
  coordinates: { x: number; y: number };
  services: string[];
  hours: {
    weekdays: string;
    saturday: string;
    sunday: string;
  };
}

// Map coordinates for Croatian cities (for SVG map display)
const cityMapCoordinates: Record<string, { x: number; y: number }> = {
  zagreb: { x: 58, y: 28 },
  split: { x: 52, y: 72 },
  dubrovnik: { x: 78, y: 92 },
  zadar: { x: 40, y: 58 },
  pula: { x: 18, y: 52 },
  rijeka: { x: 30, y: 38 },
};

/**
 * Get map coordinates based on city name
 */
function getMapCoordinates(city: string, type: "airport" | "city"): { x: number; y: number } {
  const cityLower = city.toLowerCase();
  const base = cityMapCoordinates[cityLower] || { x: 50, y: 50 };
  // Slightly offset city offices from airport offices
  if (type === "city") {
    return { x: base.x + 2, y: base.y + 4 };
  }
  return base;
}

/**
 * Transform API office to component office format
 */
function transformApiOffice(apiOffice: ApiOffice): Office {
  return {
    id: apiOffice.id,
    name: apiOffice.name,
    address: apiOffice.address,
    phone: apiOffice.phone,
    email: apiOffice.email,
    type: apiOffice.type as OfficeType,
    coordinates: getMapCoordinates(apiOffice.city, apiOffice.type),
    services: apiOffice.services,
    hours: {
      weekdays: apiOffice.workingHours.weekdays,
      saturday: apiOffice.workingHours.saturday,
      sunday: apiOffice.workingHours.sunday,
    },
  };
}

export function OfficesPage() {
  const [language, setLanguage] = useState<LanguageCode>("hr");
  const [selectedFilter, setSelectedFilter] = useState<OfficeType>("all");
  const [selectedOffice, setSelectedOffice] = useState<string | null>(null);
  const [offices, setOffices] = useState<Office[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

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

  // Fetch offices from API
  useEffect(() => {
    async function fetchOffices() {
      setIsLoading(true);
      setError(null);
      try {
        const response = await officesApi.getAll({ active: true });
        const apiOffices = extractCollectionItems(response);
        setOffices(apiOffices.map(transformApiOffice));
      } catch (err) {
        setError(err instanceof Error ? err.message : "Failed to load offices");
        console.error("Failed to fetch offices:", err);
      } finally {
        setIsLoading(false);
      }
    }

    fetchOffices();
  }, []);

  const t = translations[language].officesPage;

  const filters: { key: OfficeType; label: string }[] = [
    { key: "all", label: t.filterAll },
    { key: "airport", label: t.filterAirport },
    { key: "city", label: t.filterCity },
  ];

  // Filter offices
  const filteredOffices =
    selectedFilter === "all"
      ? offices
      : offices.filter((o) => o.type === selectedFilter);

  const getServiceLabel = (serviceKey: string) => {
    return t.servicesAvailable[serviceKey as keyof typeof t.servicesAvailable] || serviceKey;
  };

  const getGoogleMapsUrl = (address: string) => {
    return `https://www.google.com/maps/search/?api=1&query=${encodeURIComponent(address)}`;
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

        {/* Map Section */}
        <div className="mb-12 bg-white rounded-2xl shadow-sm border border-gray-100 p-6">
          <div className="flex flex-col lg:flex-row gap-8 lg:gap-12 items-start">
            {/* Map Container */}
            <div className="relative w-full lg:w-2/3 aspect-[4/3] bg-blue-50 rounded-xl overflow-hidden">
              <svg
                viewBox="0 0 100 100"
                className="w-full h-full"
                aria-label="Map of Croatia showing office locations"
              >
                {/* Simplified Croatia outline */}
                <path
                  d="M15 45 Q10 35 20 25 Q35 15 55 20 Q75 22 85 30 Q90 35 88 45 Q85 55 80 65 Q75 75 70 80 Q65 85 75 95 Q78 98 82 95 Q85 90 80 85 Q78 82 72 78 Q68 75 65 70 Q60 60 55 55 Q45 50 35 55 Q25 60 20 55 Q15 50 15 45"
                  fill="#e0f2fe"
                  stroke="#0ea5e9"
                  strokeWidth="0.5"
                  className="transition-colors duration-300"
                />

                {/* Adriatic Sea indication */}
                <text x="8" y="75" fontSize="3" fill="#0ea5e9" opacity="0.6">
                  Adriatic Sea
                </text>

                {/* Office markers */}
                {filteredOffices.map((office) => {
                  const isSelected = selectedOffice === office.id;
                  const isAirport = office.type === "airport";
                  return (
                    <g key={office.id}>
                      {/* Pulse animation for selected office */}
                      {isSelected && (
                        <circle
                          cx={office.coordinates.x}
                          cy={office.coordinates.y}
                          r="5"
                          fill="none"
                          stroke="#2563eb"
                          strokeWidth="0.5"
                          className="animate-ping"
                          style={{ transformOrigin: `${office.coordinates.x}px ${office.coordinates.y}px` }}
                        />
                      )}
                      {/* Office marker */}
                      {isAirport ? (
                        // Airplane icon for airports
                        <g
                          transform={`translate(${office.coordinates.x - 2}, ${office.coordinates.y - 2})`}
                          onClick={() => setSelectedOffice(office.id)}
                          onKeyDown={(e) => {
                            if (e.key === "Enter" || e.key === " ") {
                              e.preventDefault();
                              setSelectedOffice(office.id);
                            }
                          }}
                          className="cursor-pointer"
                          role="button"
                          tabIndex={0}
                          aria-label={office.name}
                          aria-pressed={isSelected}
                        >
                          <circle
                            cx="2"
                            cy="2"
                            r={isSelected ? "3.5" : "2.5"}
                            fill={isSelected ? "#2563eb" : "#3b82f6"}
                            className="transition-all duration-300"
                          />
                          <text
                            x="2"
                            y="2.5"
                            fontSize="2.5"
                            fill="white"
                            textAnchor="middle"
                            className="pointer-events-none"
                            aria-hidden="true"
                          >
                            ✈
                          </text>
                        </g>
                      ) : (
                        // Dot for city offices
                        <circle
                          cx={office.coordinates.x}
                          cy={office.coordinates.y}
                          r={isSelected ? "3" : "2"}
                          fill={isSelected ? "#16a34a" : "#22c55e"}
                          className="transition-all duration-300 cursor-pointer"
                          onClick={() => setSelectedOffice(office.id)}
                          onKeyDown={(e) => {
                            if (e.key === "Enter" || e.key === " ") {
                              e.preventDefault();
                              setSelectedOffice(office.id);
                            }
                          }}
                          role="button"
                          tabIndex={0}
                          aria-label={office.name}
                          aria-pressed={isSelected}
                        />
                      )}
                    </g>
                  );
                })}
              </svg>

              {/* Map Legend */}
              <div className="absolute bottom-3 left-3 bg-white/90 backdrop-blur-sm rounded-lg px-3 py-2 text-xs">
                <div className="flex items-center gap-4">
                  <div className="flex items-center gap-1.5">
                    <span className="w-3 h-3 rounded-full bg-blue-500 flex items-center justify-center text-white text-[8px]">✈</span>
                    <span className="text-gray-600">{t.filterAirport}</span>
                  </div>
                  <div className="flex items-center gap-1.5">
                    <span className="w-3 h-3 rounded-full bg-green-500"></span>
                    <span className="text-gray-600">{t.filterCity}</span>
                  </div>
                </div>
              </div>
            </div>

            {/* Selected Office Info Panel */}
            <div className="w-full lg:w-1/3">
              {selectedOffice ? (
                <OfficeInfoPanel
                  office={offices.find((o) => o.id === selectedOffice)!}
                  t={t}
                  getGoogleMapsUrl={getGoogleMapsUrl}
                  onClose={() => setSelectedOffice(null)}
                />
              ) : (
                <div className="bg-gray-100 rounded-xl p-6 text-center">
                  <svg
                    className="w-12 h-12 mx-auto mb-3 text-gray-400"
                    fill="none"
                    stroke="currentColor"
                    viewBox="0 0 24 24"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth="1.5"
                      d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z"
                    />
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth="1.5"
                      d="M15 11a3 3 0 11-6 0 3 3 0 016 0z"
                    />
                  </svg>
                  <p className="text-gray-500 text-sm">
                    {language === "hr"
                      ? "Kliknite na oznaku na karti za više informacija"
                      : language === "de"
                      ? "Klicken Sie auf eine Markierung auf der Karte für weitere Informationen"
                      : language === "fr"
                      ? "Cliquez sur un marqueur sur la carte pour plus d'informations"
                      : "Click on a marker on the map for more information"}
                  </p>
                </div>
              )}
            </div>
          </div>
        </div>

        {/* Filter Buttons */}
        <div className="flex flex-wrap justify-center gap-2 mb-10" role="group" aria-label="Filter offices">
          {filters.map((filter) => (
            <button
              key={filter.key}
              onClick={() => setSelectedFilter(filter.key)}
              aria-pressed={selectedFilter === filter.key}
              className={`px-4 py-2 rounded-full text-sm font-medium transition-colors ${
                selectedFilter === filter.key
                  ? "bg-primary text-white"
                  : "bg-white text-gray-600 hover:bg-gray-100 border border-gray-200"
              }`}
            >
              {filter.label}
            </button>
          ))}
        </div>

        {/* Offices Grid */}
        {isLoading ? (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
            {[...Array(8)].map((_, i) => (
              <div key={i} className="bg-white rounded-xl shadow-sm border border-gray-100 overflow-hidden animate-pulse">
                <div className="h-14 bg-gray-200" />
                <div className="p-4 space-y-3">
                  <div className="h-4 bg-gray-200 rounded w-3/4" />
                  <div className="h-4 bg-gray-200 rounded w-1/2" />
                  <div className="h-4 bg-gray-200 rounded w-2/3" />
                  <div className="flex gap-2">
                    <div className="h-6 bg-gray-200 rounded w-16" />
                    <div className="h-6 bg-gray-200 rounded w-16" />
                  </div>
                </div>
              </div>
            ))}
          </div>
        ) : error ? (
          <div className="text-center py-12">
            <p className="text-red-500 mb-4">{error}</p>
            <button
              onClick={() => window.location.reload()}
              className="px-4 py-2 bg-primary text-white rounded-lg hover:bg-primary/90"
            >
              {language === "hr" ? "Pokušaj ponovno" : "Try again"}
            </button>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
            {filteredOffices.map((office) => (
              <OfficeCard
                key={office.id}
                office={office}
                t={t}
                getServiceLabel={getServiceLabel}
                getGoogleMapsUrl={getGoogleMapsUrl}
                isSelected={selectedOffice === office.id}
                onSelect={() => setSelectedOffice(office.id)}
              />
            ))}
          </div>
        )}
      </div>
    </section>
  );
}

interface OfficeInfoPanelProps {
  office: Office;
  t: typeof hrTranslations.officesPage;
  getGoogleMapsUrl: (address: string) => string;
  onClose: () => void;
}

function OfficeInfoPanel({ office, t, getGoogleMapsUrl, onClose }: OfficeInfoPanelProps) {
  const isAirport = office.type === "airport";

  return (
    <div className="bg-white rounded-xl border border-gray-200 overflow-hidden">
      <div className={cn(
        "px-4 py-3 flex justify-between items-center",
        isAirport ? "bg-blue-50" : "bg-green-50"
      )}>
        <div className="flex items-center gap-2">
          {isAirport ? (
            <span className="w-6 h-6 rounded-full bg-blue-500 flex items-center justify-center text-white text-xs">✈</span>
          ) : (
            <span className="w-6 h-6 rounded-full bg-green-500 flex items-center justify-center text-white text-xs">
              <svg className="w-3 h-3" fill="currentColor" viewBox="0 0 20 20">
                <path fillRule="evenodd" d="M5.05 4.05a7 7 0 119.9 9.9L10 18.9l-4.95-4.95a7 7 0 010-9.9zM10 11a2 2 0 100-4 2 2 0 000 4z" clipRule="evenodd" />
              </svg>
            </span>
          )}
          <h3 className="font-semibold text-gray-900">{office.name}</h3>
        </div>
        <button
          onClick={onClose}
          aria-label="Close panel"
          className="text-gray-400 hover:text-gray-600 transition-colors"
        >
          <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24" aria-hidden="true">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M6 18L18 6M6 6l12 12" />
          </svg>
        </button>
      </div>

      <div className="p-4 space-y-4">
        {/* Address */}
        <div>
          <p className="text-xs text-gray-500 uppercase tracking-wide mb-1">{t.address}</p>
          <p className="text-sm text-gray-700">{office.address}</p>
        </div>

        {/* Contact */}
        <div className="grid grid-cols-2 gap-4">
          <div>
            <p className="text-xs text-gray-500 uppercase tracking-wide mb-1">{t.phone}</p>
            <a href={`tel:${office.phone}`} className="text-sm text-primary hover:underline">
              {office.phone}
            </a>
          </div>
          <div>
            <p className="text-xs text-gray-500 uppercase tracking-wide mb-1">{t.email}</p>
            <a href={`mailto:${office.email}`} className="text-sm text-primary hover:underline truncate block">
              {office.email.split("@")[0]}@...
            </a>
          </div>
        </div>

        {/* Hours */}
        <div>
          <p className="text-xs text-gray-500 uppercase tracking-wide mb-2">{t.workingHours}</p>
          <div className="text-sm space-y-1">
            <div className="flex justify-between">
              <span className="text-gray-600">{t.weekdays}</span>
              <span className="font-medium text-gray-900">{office.hours.weekdays}</span>
            </div>
            <div className="flex justify-between">
              <span className="text-gray-600">{t.saturday}</span>
              <span className="font-medium text-gray-900">{office.hours.saturday}</span>
            </div>
            <div className="flex justify-between">
              <span className="text-gray-600">{t.sunday}</span>
              <span className={cn(
                "font-medium",
                office.hours.sunday === "closed" ? "text-red-500" : "text-gray-900"
              )}>
                {office.hours.sunday === "closed" ? t.closed : office.hours.sunday}
              </span>
            </div>
          </div>
        </div>

        {/* Action Buttons */}
        <div className="flex gap-2 pt-2">
          <a
            href={getGoogleMapsUrl(office.address)}
            target="_blank"
            rel="noopener noreferrer"
            className="flex-1 flex items-center justify-center gap-1.5 bg-primary hover:bg-primary/90 text-white font-medium py-2 px-3 rounded-lg transition-colors text-sm"
          >
            <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z" />
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M15 11a3 3 0 11-6 0 3 3 0 016 0z" />
            </svg>
            {t.getDirections}
          </a>
        </div>
      </div>
    </div>
  );
}

interface OfficeCardProps {
  office: Office;
  t: typeof hrTranslations.officesPage;
  getServiceLabel: (key: string) => string;
  getGoogleMapsUrl: (address: string) => string;
  isSelected: boolean;
  onSelect: () => void;
}

function OfficeCard({ office, t, getServiceLabel, getGoogleMapsUrl, isSelected, onSelect }: OfficeCardProps) {
  const isAirport = office.type === "airport";

  return (
    <div
      className={cn(
        "bg-white rounded-xl shadow-sm border overflow-hidden hover:shadow-md transition-all cursor-pointer",
        isSelected ? "border-primary ring-2 ring-primary/20" : "border-gray-100"
      )}
      onClick={onSelect}
    >
      {/* Header */}
      <div className={cn(
        "px-4 py-3 flex items-center gap-2",
        isAirport ? "bg-blue-50" : "bg-green-50"
      )}>
        {isAirport ? (
          <span className="w-8 h-8 rounded-full bg-blue-500 flex items-center justify-center text-white text-sm">✈</span>
        ) : (
          <span className="w-8 h-8 rounded-full bg-green-500 flex items-center justify-center text-white">
            <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 20 20">
              <path fillRule="evenodd" d="M5.05 4.05a7 7 0 119.9 9.9L10 18.9l-4.95-4.95a7 7 0 010-9.9zM10 11a2 2 0 100-4 2 2 0 000 4z" clipRule="evenodd" />
            </svg>
          </span>
        )}
        <h3 className="font-semibold text-gray-900 flex-1">{office.name}</h3>
      </div>

      {/* Content */}
      <div className="p-4 space-y-3">
        {/* Address */}
        <div className="flex items-start gap-2">
          <svg className="w-4 h-4 text-gray-400 mt-0.5 flex-shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z" />
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M15 11a3 3 0 11-6 0 3 3 0 016 0z" />
          </svg>
          <p className="text-sm text-gray-600">{office.address}</p>
        </div>

        {/* Phone */}
        <div className="flex items-center gap-2">
          <svg className="w-4 h-4 text-gray-400 flex-shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M3 5a2 2 0 012-2h3.28a1 1 0 01.948.684l1.498 4.493a1 1 0 01-.502 1.21l-2.257 1.13a11.042 11.042 0 005.516 5.516l1.13-2.257a1 1 0 011.21-.502l4.493 1.498a1 1 0 01.684.949V19a2 2 0 01-2 2h-1C9.716 21 3 14.284 3 6V5z" />
          </svg>
          <a
            href={`tel:${office.phone}`}
            className="text-sm text-primary hover:underline"
            onClick={(e) => e.stopPropagation()}
          >
            {office.phone}
          </a>
        </div>

        {/* Hours Summary */}
        <div className="flex items-center gap-2">
          <svg className="w-4 h-4 text-gray-400 flex-shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
          </svg>
          <p className="text-sm text-gray-600">
            {t.weekdays}: <span className="font-medium text-gray-900">{office.hours.weekdays}</span>
          </p>
        </div>

        {/* Services Preview */}
        <div className="flex flex-wrap gap-1.5 pt-1">
          {office.services.slice(0, 3).map((service) => (
            <span
              key={service}
              className="text-xs bg-gray-100 text-gray-600 px-2 py-0.5 rounded-full"
            >
              {getServiceLabel(service)}
            </span>
          ))}
          {office.services.length > 3 && (
            <span className="text-xs bg-gray-100 text-gray-600 px-2 py-0.5 rounded-full">
              +{office.services.length - 3}
            </span>
          )}
        </div>
      </div>

      {/* Action Buttons */}
      <div className="px-4 pb-4 flex gap-2">
        <a
          href={getGoogleMapsUrl(office.address)}
          target="_blank"
          rel="noopener noreferrer"
          className="flex-1 flex items-center justify-center gap-1.5 bg-primary hover:bg-primary/90 text-white font-medium py-2 px-3 rounded-lg transition-colors text-sm"
          onClick={(e) => e.stopPropagation()}
        >
          <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z" />
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M15 11a3 3 0 11-6 0 3 3 0 016 0z" />
          </svg>
          {t.getDirections}
        </a>
        <a
          href={`tel:${office.phone}`}
          className="flex items-center justify-center gap-1.5 bg-gray-100 hover:bg-gray-200 text-gray-700 font-medium py-2 px-3 rounded-lg transition-colors text-sm"
          onClick={(e) => e.stopPropagation()}
          aria-label={t.contactOffice}
        >
          <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M3 5a2 2 0 012-2h3.28a1 1 0 01.948.684l1.498 4.493a1 1 0 01-.502 1.21l-2.257 1.13a11.042 11.042 0 005.516 5.516l1.13-2.257a1 1 0 011.21-.502l4.493 1.498a1 1 0 01.684.949V19a2 2 0 01-2 2h-1C9.716 21 3 14.284 3 6V5z" />
          </svg>
        </a>
      </div>
    </div>
  );
}
