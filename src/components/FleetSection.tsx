import { useState, useEffect } from "react";
import { getCurrentLanguage, type LanguageCode } from "@/lib/i18n";
import { VehicleCard, type Vehicle } from "./VehicleCard";
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

// Sample vehicle data
const vehicles: Vehicle[] = [
  {
    id: "1",
    name: "Fiat 500",
    category: "economy",
    image: "https://images.unsplash.com/photo-1595787572043-69f9e2d2eb10?w=600&h=450&fit=crop",
    passengers: 4,
    doors: 3,
    luggage: 1,
    transmission: "manual",
    hasAC: true,
    pricePerDay: 29,
  },
  {
    id: "2",
    name: "Toyota Yaris",
    category: "economy",
    image: "https://images.unsplash.com/photo-1619682817481-e994891cd1f5?w=600&h=450&fit=crop",
    passengers: 5,
    doors: 5,
    luggage: 2,
    transmission: "automatic",
    hasAC: true,
    pricePerDay: 35,
  },
  {
    id: "3",
    name: "Volkswagen Golf",
    category: "compact",
    image: "https://images.unsplash.com/photo-1471444928139-48c5bf5173f8?w=600&h=450&fit=crop",
    passengers: 5,
    doors: 5,
    luggage: 3,
    transmission: "automatic",
    hasAC: true,
    pricePerDay: 45,
  },
  {
    id: "4",
    name: "Škoda Octavia",
    category: "compact",
    image: "https://images.unsplash.com/photo-1541899481282-d53bffe3c35d?w=600&h=450&fit=crop",
    passengers: 5,
    doors: 5,
    luggage: 4,
    transmission: "automatic",
    hasAC: true,
    pricePerDay: 49,
  },
  {
    id: "5",
    name: "Toyota RAV4",
    category: "suv",
    image: "https://images.unsplash.com/photo-1568844293986-8c1a5f8b4f29?w=600&h=450&fit=crop",
    passengers: 5,
    doors: 5,
    luggage: 5,
    transmission: "automatic",
    hasAC: true,
    pricePerDay: 65,
  },
  {
    id: "6",
    name: "BMW X5",
    category: "suv",
    image: "https://images.unsplash.com/photo-1606611013016-969c19ba27bb?w=600&h=450&fit=crop",
    passengers: 5,
    doors: 5,
    luggage: 5,
    transmission: "automatic",
    hasAC: true,
    pricePerDay: 95,
  },
  {
    id: "7",
    name: "Mercedes-Benz E-Class",
    category: "luxury",
    image: "https://images.unsplash.com/photo-1618843479313-40f8afb4b4d8?w=600&h=450&fit=crop",
    passengers: 5,
    doors: 4,
    luggage: 4,
    transmission: "automatic",
    hasAC: true,
    pricePerDay: 120,
  },
  {
    id: "8",
    name: "BMW 7 Series",
    category: "luxury",
    image: "https://images.unsplash.com/photo-1555215695-3004980ad54e?w=600&h=450&fit=crop",
    passengers: 5,
    doors: 4,
    luggage: 4,
    transmission: "automatic",
    hasAC: true,
    pricePerDay: 150,
  },
];

type Category = "all" | "economy" | "compact" | "suv" | "luxury";

export function FleetSection() {
  const [language, setLanguage] = useState<LanguageCode>("hr");
  const [selectedCategory, setSelectedCategory] = useState<Category>("all");

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
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
          {filteredVehicles.map((vehicle) => (
            <VehicleCard key={vehicle.id} vehicle={vehicle} />
          ))}
        </div>
      </div>
    </section>
  );
}
