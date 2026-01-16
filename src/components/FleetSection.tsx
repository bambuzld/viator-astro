import { useState, useEffect } from "react";
import { getCurrentLanguage, type LanguageCode } from "@/lib/i18n";
import { VehicleCard, type Vehicle } from "./VehicleCard";
import { vehiclesApi, extractCollectionItems, type ApiVehicle } from "@/lib/api";
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

/**
 * Transform API vehicle to component vehicle format
 */
function transformApiVehicle(apiVehicle: ApiVehicle): Vehicle {
  return {
    id: apiVehicle.id,
    name: apiVehicle.name,
    category: apiVehicle.category,
    image: apiVehicle.imageUrl,
    passengers: apiVehicle.passengers,
    doors: apiVehicle.doors,
    luggage: apiVehicle.luggage,
    transmission: apiVehicle.transmission,
    hasAC: apiVehicle.hasAirConditioning,
    pricePerDay: apiVehicle.pricePerDay,
  };
}

type Category = "all" | "economy" | "compact" | "suv" | "luxury";

export function FleetSection() {
  const [language, setLanguage] = useState<LanguageCode>("hr");
  const [selectedCategory, setSelectedCategory] = useState<Category>("all");
  const [vehicles, setVehicles] = useState<Vehicle[]>([]);
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

  // Fetch vehicles from API
  useEffect(() => {
    async function fetchVehicles() {
      setIsLoading(true);
      setError(null);
      try {
        const response = await vehiclesApi.getAll({ available: true });
        const apiVehicles = extractCollectionItems(response);
        setVehicles(apiVehicles.map(transformApiVehicle));
      } catch (err) {
        setError(err instanceof Error ? err.message : "Failed to load vehicles");
        console.error("Failed to fetch vehicles:", err);
      } finally {
        setIsLoading(false);
      }
    }

    fetchVehicles();
  }, []);

  const t = translations[language].fleet;

  const categories: { key: Category; label: string }[] = [
    { key: "all", label: t.allCategories },
    { key: "economy", label: t.categories.economy },
    { key: "compact", label: t.categories.compact },
    { key: "suv", label: t.categories.suv },
    { key: "luxury", label: t.categories.luxury },
  ];

  const filteredVehicles =
    selectedCategory === "all"
      ? vehicles
      : vehicles.filter((v) => v.category === selectedCategory);

  return (
    <section className="py-16 md:py-24 bg-gray-50">
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

        {/* Category Filter */}
        <div className="flex flex-wrap justify-center gap-2 mb-10" role="group" aria-label="Filter by category">
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

        {/* Vehicle Grid */}
        {isLoading ? (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
            {[...Array(8)].map((_, i) => (
              <div key={i} className="bg-white rounded-xl shadow-sm border border-gray-100 overflow-hidden animate-pulse">
                <div className="aspect-[4/3] bg-gray-200" />
                <div className="p-4 space-y-3">
                  <div className="h-5 bg-gray-200 rounded w-3/4" />
                  <div className="h-4 bg-gray-200 rounded w-1/2" />
                  <div className="h-8 bg-gray-200 rounded w-full" />
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
        ) : filteredVehicles.length === 0 ? (
          <div className="text-center py-12">
            <p className="text-gray-500">
              {language === "hr" ? "Nema dostupnih vozila u ovoj kategoriji" : "No vehicles available in this category"}
            </p>
          </div>
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
            {filteredVehicles.map((vehicle) => (
              <VehicleCard key={vehicle.id} vehicle={vehicle} />
            ))}
          </div>
        )}
      </div>
    </section>
  );
}
