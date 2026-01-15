import * as React from "react";
import { cn } from "@/lib/utils";

interface City {
  name: string;
  x: number;
  y: number;
}

const cities: City[] = [
  { name: "Zagreb", x: 58, y: 28 },
  { name: "Rijeka", x: 32, y: 35 },
  { name: "Pula", x: 18, y: 52 },
  { name: "Zadar", x: 40, y: 58 },
  { name: "Split", x: 52, y: 72 },
  { name: "Dubrovnik", x: 78, y: 92 },
];

export function RentalStationsMap() {
  const [selectedCity, setSelectedCity] = React.useState<string | null>(null);

  return (
    <div className="flex flex-col lg:flex-row gap-8 lg:gap-12 items-center">
      {/* Map Container */}
      <div className="relative w-full lg:w-2/3 aspect-[4/3] bg-blue-50 rounded-2xl overflow-hidden">
        {/* Croatia Map SVG */}
        <svg
          viewBox="0 0 100 100"
          className="w-full h-full"
          aria-label="Map of Croatia showing rental station locations"
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

          {/* City markers */}
          {cities.map((city) => {
            const isSelected = selectedCity === city.name;
            return (
              <g key={city.name}>
                {/* Pulse animation for selected city */}
                {isSelected && (
                  <circle
                    cx={city.x}
                    cy={city.y}
                    r="5"
                    fill="none"
                    stroke="#2563eb"
                    strokeWidth="0.5"
                    className="animate-ping"
                    style={{ transformOrigin: `${city.x}px ${city.y}px` }}
                  />
                )}
                {/* City dot */}
                <circle
                  cx={city.x}
                  cy={city.y}
                  r={isSelected ? "3" : "2"}
                  fill={isSelected ? "#2563eb" : "#3b82f6"}
                  className="transition-all duration-300 cursor-pointer hover:r-3"
                  onClick={() => setSelectedCity(city.name)}
                />
                {/* City label */}
                <text
                  x={city.x}
                  y={city.y - 4}
                  fontSize={isSelected ? "4" : "3"}
                  fill={isSelected ? "#1e40af" : "#64748b"}
                  textAnchor="middle"
                  fontWeight={isSelected ? "bold" : "normal"}
                  className="transition-all duration-300 pointer-events-none"
                >
                  {city.name}
                </text>
              </g>
            );
          })}
        </svg>

        {/* Map overlay with gradient */}
        <div className="absolute inset-0 bg-gradient-to-t from-white/20 to-transparent pointer-events-none" />
      </div>

      {/* City Pills */}
      <div className="w-full lg:w-1/3">
        <h3 className="text-lg font-semibold text-gray-900 mb-4">
          Select a location
        </h3>
        <div className="flex flex-wrap gap-2">
          {cities.map((city) => {
            const isSelected = selectedCity === city.name;
            return (
              <button
                key={city.name}
                onClick={() => setSelectedCity(city.name)}
                className={cn(
                  "px-4 py-2 rounded-full text-sm font-medium transition-all duration-200",
                  "focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2",
                  isSelected
                    ? "bg-blue-600 text-white shadow-md"
                    : "bg-gray-100 text-gray-700 hover:bg-gray-200"
                )}
                aria-pressed={isSelected}
              >
                {city.name}
              </button>
            );
          })}
        </div>

        {/* Selected city info */}
        {selectedCity && (
          <div className="mt-6 p-4 bg-blue-50 rounded-lg">
            <p className="text-sm text-gray-600">
              <span className="font-semibold text-gray-900">{selectedCity}</span>{" "}
              rental station is available for pickup and drop-off.
            </p>
            <a
              href={`/locations/${selectedCity.toLowerCase()}`}
              className="inline-flex items-center mt-2 text-sm text-blue-600 hover:text-blue-700 font-medium transition-colors"
            >
              View details
              <svg
                className="w-4 h-4 ml-1"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth="2"
                  d="M9 5l7 7-7 7"
                />
              </svg>
            </a>
          </div>
        )}
      </div>
    </div>
  );
}
