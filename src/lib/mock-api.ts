/**
 * Mock API for testing and development
 *
 * This module provides mock data and simulated API responses for testing
 * build times, fetch times, bundle size, and JS payload without a real backend.
 */

import type {
  ApiVehicle,
  ApiOffice,
  ApiOffer,
  ApiBooking,
  ApiSupportRequest,
  HydraCollection,
  BookingFormData,
  ContactFormData,
  BookingExtras,
  PriceBreakdown,
} from "./api";

// ============================================================================
// Configuration
// ============================================================================

export const MOCK_CONFIG = {
  /** Enable mock API (set to false to use real API) */
  enabled: import.meta.env.PUBLIC_MOCK_API !== "false",
  /** Minimum delay in ms to simulate network latency */
  minDelay: 200,
  /** Maximum delay in ms to simulate network latency */
  maxDelay: 300,
  /** Log mock API calls to console */
  debug: import.meta.env.DEV,
} as const;

// ============================================================================
// Utility Functions
// ============================================================================

/**
 * Simulate network delay (200-300ms by default)
 */
export async function simulateNetworkDelay(
  minMs: number = MOCK_CONFIG.minDelay,
  maxMs: number = MOCK_CONFIG.maxDelay
): Promise<void> {
  const delay = Math.floor(Math.random() * (maxMs - minMs + 1)) + minMs;
  await new Promise((resolve) => setTimeout(resolve, delay));
}

/**
 * Generate a unique ID
 */
function generateId(): string {
  return Math.random().toString(36).substring(2, 11);
}

/**
 * Get current ISO timestamp
 */
function now(): string {
  return new Date().toISOString();
}

/**
 * Create a Hydra collection response wrapper
 */
function createHydraCollection<T>(
  items: T[],
  endpoint: string,
  page: number = 1,
  itemsPerPage: number = 30
): HydraCollection<T> {
  const totalItems = items.length;
  const startIndex = (page - 1) * itemsPerPage;
  const paginatedItems = items.slice(startIndex, startIndex + itemsPerPage);
  const totalPages = Math.ceil(totalItems / itemsPerPage);

  return {
    "@context": "/api/contexts/Collection",
    "@id": `/api${endpoint}`,
    "@type": "hydra:Collection",
    "hydra:totalItems": totalItems,
    "hydra:member": paginatedItems,
    "hydra:view": {
      "@id": `/api${endpoint}?page=${page}`,
      "@type": "hydra:PartialCollectionView",
      "hydra:first": `/api${endpoint}?page=1`,
      "hydra:last": `/api${endpoint}?page=${totalPages}`,
      ...(page > 1 && { "hydra:previous": `/api${endpoint}?page=${page - 1}` }),
      ...(page < totalPages && { "hydra:next": `/api${endpoint}?page=${page + 1}` }),
    },
  };
}

// ============================================================================
// Mock Data: Vehicles
// ============================================================================

export const mockVehicles: ApiVehicle[] = [
  {
    "@id": "/api/vehicles/1",
    "@type": "Vehicle",
    id: "1",
    name: "Fiat 500",
    category: "economy",
    imageUrl: "https://images.unsplash.com/photo-1595787572043-69f9e2d2eb10?w=600&h=450&fit=crop",
    passengers: 4,
    doors: 3,
    luggage: 1,
    transmission: "manual",
    hasAirConditioning: true,
    pricePerDay: 29,
    available: true,
    createdAt: "2024-01-01T00:00:00Z",
    updatedAt: "2024-01-01T00:00:00Z",
  },
  {
    "@id": "/api/vehicles/2",
    "@type": "Vehicle",
    id: "2",
    name: "Toyota Yaris",
    category: "economy",
    imageUrl: "https://images.unsplash.com/photo-1619682817481-e994891cd1f5?w=600&h=450&fit=crop",
    passengers: 5,
    doors: 5,
    luggage: 2,
    transmission: "automatic",
    hasAirConditioning: true,
    pricePerDay: 35,
    available: true,
    createdAt: "2024-01-01T00:00:00Z",
    updatedAt: "2024-01-01T00:00:00Z",
  },
  {
    "@id": "/api/vehicles/3",
    "@type": "Vehicle",
    id: "3",
    name: "Volkswagen Golf",
    category: "compact",
    imageUrl: "https://images.unsplash.com/photo-1471444928139-48c5bf5173f8?w=600&h=450&fit=crop",
    passengers: 5,
    doors: 5,
    luggage: 3,
    transmission: "automatic",
    hasAirConditioning: true,
    pricePerDay: 45,
    available: true,
    createdAt: "2024-01-01T00:00:00Z",
    updatedAt: "2024-01-01T00:00:00Z",
  },
  {
    "@id": "/api/vehicles/4",
    "@type": "Vehicle",
    id: "4",
    name: "Skoda Octavia",
    category: "compact",
    imageUrl: "https://images.unsplash.com/photo-1541899481282-d53bffe3c35d?w=600&h=450&fit=crop",
    passengers: 5,
    doors: 5,
    luggage: 4,
    transmission: "automatic",
    hasAirConditioning: true,
    pricePerDay: 49,
    available: true,
    createdAt: "2024-01-01T00:00:00Z",
    updatedAt: "2024-01-01T00:00:00Z",
  },
  {
    "@id": "/api/vehicles/5",
    "@type": "Vehicle",
    id: "5",
    name: "Toyota RAV4",
    category: "suv",
    imageUrl: "https://images.unsplash.com/photo-1568844293986-8c1a5f8b4f29?w=600&h=450&fit=crop",
    passengers: 5,
    doors: 5,
    luggage: 5,
    transmission: "automatic",
    hasAirConditioning: true,
    pricePerDay: 65,
    available: true,
    createdAt: "2024-01-01T00:00:00Z",
    updatedAt: "2024-01-01T00:00:00Z",
  },
  {
    "@id": "/api/vehicles/6",
    "@type": "Vehicle",
    id: "6",
    name: "BMW X5",
    category: "suv",
    imageUrl: "https://images.unsplash.com/photo-1606611013016-969c19ba27bb?w=600&h=450&fit=crop",
    passengers: 5,
    doors: 5,
    luggage: 5,
    transmission: "automatic",
    hasAirConditioning: true,
    pricePerDay: 95,
    available: true,
    createdAt: "2024-01-01T00:00:00Z",
    updatedAt: "2024-01-01T00:00:00Z",
  },
  {
    "@id": "/api/vehicles/7",
    "@type": "Vehicle",
    id: "7",
    name: "Mercedes-Benz E-Class",
    category: "luxury",
    imageUrl: "https://images.unsplash.com/photo-1618843479313-40f8afb4b4d8?w=600&h=450&fit=crop",
    passengers: 5,
    doors: 4,
    luggage: 4,
    transmission: "automatic",
    hasAirConditioning: true,
    pricePerDay: 120,
    available: true,
    createdAt: "2024-01-01T00:00:00Z",
    updatedAt: "2024-01-01T00:00:00Z",
  },
  {
    "@id": "/api/vehicles/8",
    "@type": "Vehicle",
    id: "8",
    name: "BMW 7 Series",
    category: "luxury",
    imageUrl: "https://images.unsplash.com/photo-1555215695-3004980ad54e?w=600&h=450&fit=crop",
    passengers: 5,
    doors: 4,
    luggage: 4,
    transmission: "automatic",
    hasAirConditioning: true,
    pricePerDay: 150,
    available: true,
    createdAt: "2024-01-01T00:00:00Z",
    updatedAt: "2024-01-01T00:00:00Z",
  },
  {
    "@id": "/api/vehicles/9",
    "@type": "Vehicle",
    id: "9",
    name: "Renault Clio",
    category: "economy",
    imageUrl: "https://images.unsplash.com/photo-1609521263047-f8f205293f24?w=600&h=450&fit=crop",
    passengers: 5,
    doors: 5,
    luggage: 2,
    transmission: "manual",
    hasAirConditioning: true,
    pricePerDay: 32,
    available: true,
    createdAt: "2024-01-01T00:00:00Z",
    updatedAt: "2024-01-01T00:00:00Z",
  },
  {
    "@id": "/api/vehicles/10",
    "@type": "Vehicle",
    id: "10",
    name: "Audi A4",
    category: "compact",
    imageUrl: "https://images.unsplash.com/photo-1606664515524-ed2f786a0bd6?w=600&h=450&fit=crop",
    passengers: 5,
    doors: 4,
    luggage: 3,
    transmission: "automatic",
    hasAirConditioning: true,
    pricePerDay: 55,
    available: false,
    createdAt: "2024-01-01T00:00:00Z",
    updatedAt: "2024-01-01T00:00:00Z",
  },
  {
    "@id": "/api/vehicles/11",
    "@type": "Vehicle",
    id: "11",
    name: "Porsche Cayenne",
    category: "suv",
    imageUrl: "https://images.unsplash.com/photo-1503376780353-7e6692767b70?w=600&h=450&fit=crop",
    passengers: 5,
    doors: 5,
    luggage: 4,
    transmission: "automatic",
    hasAirConditioning: true,
    pricePerDay: 180,
    available: true,
    createdAt: "2024-01-01T00:00:00Z",
    updatedAt: "2024-01-01T00:00:00Z",
  },
  {
    "@id": "/api/vehicles/12",
    "@type": "Vehicle",
    id: "12",
    name: "Audi A8",
    category: "luxury",
    imageUrl: "https://images.unsplash.com/photo-1603584173870-7f23fdae1b7a?w=600&h=450&fit=crop",
    passengers: 5,
    doors: 4,
    luggage: 4,
    transmission: "automatic",
    hasAirConditioning: true,
    pricePerDay: 200,
    available: true,
    createdAt: "2024-01-01T00:00:00Z",
    updatedAt: "2024-01-01T00:00:00Z",
  },
];

// ============================================================================
// Mock Data: Offices
// ============================================================================

export const mockOffices: ApiOffice[] = [
  {
    "@id": "/api/offices/1",
    "@type": "Office",
    id: "1",
    name: "Zagreb Airport",
    address: "Ulica Rudolfa Fizira 21, 10150 Zagreb",
    city: "Zagreb",
    country: "Croatia",
    phone: "+385 1 456 7890",
    email: "zagreb.airport@lastminute-rentacar.hr",
    type: "airport",
    latitude: 45.7429,
    longitude: 16.0688,
    services: ["airportPickup", "afterHoursReturn", "childSeats", "gpsNavigation", "additionalDriver", "fullInsurance"],
    workingHours: {
      weekdays: "06:00 - 23:00",
      saturday: "06:00 - 23:00",
      sunday: "06:00 - 23:00",
    },
    active: true,
  },
  {
    "@id": "/api/offices/2",
    "@type": "Office",
    id: "2",
    name: "Zagreb City Center",
    address: "Ilica 123, 10000 Zagreb",
    city: "Zagreb",
    country: "Croatia",
    phone: "+385 1 234 5678",
    email: "zagreb.city@lastminute-rentacar.hr",
    type: "city",
    latitude: 45.8131,
    longitude: 15.9772,
    services: ["childSeats", "gpsNavigation", "additionalDriver", "fullInsurance"],
    workingHours: {
      weekdays: "08:00 - 20:00",
      saturday: "09:00 - 14:00",
      sunday: "closed",
    },
    active: true,
  },
  {
    "@id": "/api/offices/3",
    "@type": "Office",
    id: "3",
    name: "Split Airport",
    address: "Cesta Dr. Franje Tudjmana 1270, 21217 Kastel Stafilic",
    city: "Split",
    country: "Croatia",
    phone: "+385 21 456 7890",
    email: "split.airport@lastminute-rentacar.hr",
    type: "airport",
    latitude: 43.5389,
    longitude: 16.298,
    services: ["airportPickup", "afterHoursReturn", "childSeats", "gpsNavigation", "additionalDriver", "fullInsurance"],
    workingHours: {
      weekdays: "06:00 - 23:00",
      saturday: "06:00 - 23:00",
      sunday: "06:00 - 23:00",
    },
    active: true,
  },
  {
    "@id": "/api/offices/4",
    "@type": "Office",
    id: "4",
    name: "Split City Center",
    address: "Obala Hrvatskog narodnog preporoda 15, 21000 Split",
    city: "Split",
    country: "Croatia",
    phone: "+385 21 234 5678",
    email: "split.city@lastminute-rentacar.hr",
    type: "city",
    latitude: 43.5081,
    longitude: 16.4402,
    services: ["childSeats", "gpsNavigation", "additionalDriver", "fullInsurance"],
    workingHours: {
      weekdays: "08:00 - 20:00",
      saturday: "09:00 - 14:00",
      sunday: "closed",
    },
    active: true,
  },
  {
    "@id": "/api/offices/5",
    "@type": "Office",
    id: "5",
    name: "Dubrovnik Airport",
    address: "Dobrota bb, 20213 Cilipi",
    city: "Dubrovnik",
    country: "Croatia",
    phone: "+385 20 456 7890",
    email: "dubrovnik.airport@lastminute-rentacar.hr",
    type: "airport",
    latitude: 42.5614,
    longitude: 18.2682,
    services: ["airportPickup", "afterHoursReturn", "childSeats", "gpsNavigation", "additionalDriver", "fullInsurance"],
    workingHours: {
      weekdays: "06:00 - 23:00",
      saturday: "06:00 - 23:00",
      sunday: "06:00 - 23:00",
    },
    active: true,
  },
  {
    "@id": "/api/offices/6",
    "@type": "Office",
    id: "6",
    name: "Zadar Airport",
    address: "Ulica Ivana Mestrovic bb, 23222 Zemunik Donji",
    city: "Zadar",
    country: "Croatia",
    phone: "+385 23 456 7890",
    email: "zadar.airport@lastminute-rentacar.hr",
    type: "airport",
    latitude: 44.1083,
    longitude: 15.3467,
    services: ["airportPickup", "afterHoursReturn", "childSeats", "gpsNavigation", "additionalDriver", "fullInsurance"],
    workingHours: {
      weekdays: "06:00 - 23:00",
      saturday: "06:00 - 23:00",
      sunday: "06:00 - 23:00",
    },
    active: true,
  },
  {
    "@id": "/api/offices/7",
    "@type": "Office",
    id: "7",
    name: "Pula Airport",
    address: "Valtursko polje 210, 52100 Pula",
    city: "Pula",
    country: "Croatia",
    phone: "+385 52 456 7890",
    email: "pula.airport@lastminute-rentacar.hr",
    type: "airport",
    latitude: 44.8935,
    longitude: 13.9222,
    services: ["airportPickup", "afterHoursReturn", "childSeats", "gpsNavigation", "additionalDriver", "fullInsurance"],
    workingHours: {
      weekdays: "06:00 - 23:00",
      saturday: "06:00 - 23:00",
      sunday: "06:00 - 23:00",
    },
    active: true,
  },
  {
    "@id": "/api/offices/8",
    "@type": "Office",
    id: "8",
    name: "Rijeka Airport",
    address: "Hamec 1, 51513 Omisalj",
    city: "Rijeka",
    country: "Croatia",
    phone: "+385 51 456 7890",
    email: "rijeka.airport@lastminute-rentacar.hr",
    type: "airport",
    latitude: 45.2169,
    longitude: 14.5703,
    services: ["airportPickup", "afterHoursReturn", "childSeats", "gpsNavigation", "additionalDriver", "fullInsurance"],
    workingHours: {
      weekdays: "06:00 - 23:00",
      saturday: "06:00 - 23:00",
      sunday: "06:00 - 23:00",
    },
    active: true,
  },
];

// ============================================================================
// Mock Data: Offers
// ============================================================================

export const mockOffers: ApiOffer[] = [
  {
    "@id": "/api/offers/1",
    "@type": "Offer",
    id: "1",
    title: "Black Friday -20% Discount!",
    description: "Get 20% off on all vehicle rentals during our Black Friday sale. Valid for bookings made between November 24-30.",
    terms: "Discount applies to base rental price only. Cannot be combined with other offers. Minimum 3-day rental required.",
    discountPercentage: 20,
    discountLabel: "-20%",
    category: "seasonal",
    imageUrl: "https://images.unsplash.com/photo-1607083206869-4c7672e72a8a?w=800&h=600&fit=crop",
    validFrom: "2024-11-24T00:00:00Z",
    validUntil: "2024-11-30T23:59:59Z",
    promoCode: "BLACKFRIDAY20",
    active: true,
  },
  {
    "@id": "/api/offers/2",
    "@type": "Offer",
    id: "2",
    title: "Summer Special - Free GPS!",
    description: "Book any vehicle for 7+ days this summer and receive free GPS navigation. Perfect for exploring Croatia's coastline!",
    terms: "Valid for rentals starting between June 1 and August 31. GPS must be requested at time of booking.",
    discountPercentage: 0,
    discountLabel: "Free GPS",
    category: "seasonal",
    imageUrl: "https://images.unsplash.com/photo-1469854523086-cc02fe5d8800?w=800&h=600&fit=crop",
    validFrom: "2024-06-01T00:00:00Z",
    validUntil: "2024-08-31T23:59:59Z",
    active: true,
  },
  {
    "@id": "/api/offers/3",
    "@type": "Offer",
    id: "3",
    title: "Weekend Getaway 15% Off",
    description: "Plan your weekend escape with 15% off all Friday to Sunday rentals. Explore nearby destinations hassle-free!",
    terms: "Valid for Friday pickup and Sunday return only. Discount applies to base rental price.",
    discountPercentage: 15,
    discountLabel: "-15%",
    category: "discount",
    imageUrl: "https://images.unsplash.com/photo-1449824913935-59a10b8d2000?w=800&h=600&fit=crop",
    validFrom: "2024-01-01T00:00:00Z",
    validUntil: "2024-12-31T23:59:59Z",
    promoCode: "WEEKEND15",
    active: true,
  },
  {
    "@id": "/api/offers/4",
    "@type": "Offer",
    id: "4",
    title: "Loyalty Bonus - Extra Day Free!",
    description: "Returning customers get one extra day free on rentals of 5+ days. Thank you for choosing us again!",
    terms: "Must have completed at least one previous rental with us. Free day applies to lowest-priced day of rental period.",
    discountPercentage: 0,
    discountLabel: "+1 Free Day",
    category: "loyalty",
    imageUrl: "https://images.unsplash.com/photo-1560472354-b33ff0c44a43?w=800&h=600&fit=crop",
    validFrom: "2024-01-01T00:00:00Z",
    validUntil: "2024-12-31T23:59:59Z",
    active: true,
  },
  {
    "@id": "/api/offers/5",
    "@type": "Offer",
    id: "5",
    title: "Early Bird - 10% Off",
    description: "Book at least 30 days in advance and save 10% on your rental. Plan ahead, save more!",
    terms: "Booking must be made minimum 30 days before pickup date. Non-refundable after booking.",
    discountPercentage: 10,
    discountLabel: "-10%",
    category: "discount",
    imageUrl: "https://images.unsplash.com/photo-1494515843206-f3117d3f51b7?w=800&h=600&fit=crop",
    validFrom: "2024-01-01T00:00:00Z",
    validUntil: "2024-12-31T23:59:59Z",
    promoCode: "EARLYBIRD10",
    active: true,
  },
  {
    "@id": "/api/offers/6",
    "@type": "Offer",
    id: "6",
    title: "Business Package - 25% Off",
    description: "Special rates for business travelers. Get 25% off plus complimentary full insurance coverage.",
    terms: "Requires valid business registration. Minimum 10 rental days per year. Insurance upgrade included.",
    discountPercentage: 25,
    discountLabel: "-25%",
    category: "loyalty",
    imageUrl: "https://images.unsplash.com/photo-1551836022-deb4988cc6c0?w=800&h=600&fit=crop",
    validFrom: "2024-01-01T00:00:00Z",
    validUntil: "2024-12-31T23:59:59Z",
    promoCode: "BUSINESS25",
    active: true,
  },
];

// ============================================================================
// In-memory storage for bookings and support requests
// ============================================================================

const bookingsStore: ApiBooking[] = [];
const supportRequestsStore: ApiSupportRequest[] = [];

// ============================================================================
// Mock API Functions
// ============================================================================

/**
 * Mock Vehicles API
 */
export const mockVehiclesApi = {
  async getAll(params?: {
    category?: string;
    available?: boolean;
    page?: number;
    itemsPerPage?: number;
  }): Promise<HydraCollection<ApiVehicle>> {
    await simulateNetworkDelay();

    if (MOCK_CONFIG.debug) {
      console.log("[Mock API] vehiclesApi.getAll", params);
    }

    let filtered = [...mockVehicles];

    if (params?.category) {
      filtered = filtered.filter((v) => v.category === params.category);
    }
    if (params?.available !== undefined) {
      filtered = filtered.filter((v) => v.available === params.available);
    }

    return createHydraCollection(
      filtered,
      "/vehicles",
      params?.page,
      params?.itemsPerPage
    );
  },

  async getById(id: string): Promise<ApiVehicle> {
    await simulateNetworkDelay();

    if (MOCK_CONFIG.debug) {
      console.log("[Mock API] vehiclesApi.getById", id);
    }

    const vehicle = mockVehicles.find((v) => v.id === id);
    if (!vehicle) {
      throw new Error(`Vehicle with id ${id} not found`);
    }
    return vehicle;
  },

  async checkAvailability(
    vehicleId: string,
    startDate: string,
    endDate: string
  ): Promise<{ available: boolean; price: number }> {
    await simulateNetworkDelay();

    if (MOCK_CONFIG.debug) {
      console.log("[Mock API] vehiclesApi.checkAvailability", { vehicleId, startDate, endDate });
    }

    const vehicle = mockVehicles.find((v) => v.id === vehicleId);
    if (!vehicle) {
      throw new Error(`Vehicle with id ${vehicleId} not found`);
    }

    const start = new Date(startDate);
    const end = new Date(endDate);
    const days = Math.ceil((end.getTime() - start.getTime()) / (1000 * 60 * 60 * 24));

    return {
      available: vehicle.available,
      price: vehicle.pricePerDay * Math.max(1, days),
    };
  },
};

/**
 * Mock Offices API
 */
export const mockOfficesApi = {
  async getAll(params?: {
    type?: string;
    city?: string;
    active?: boolean;
  }): Promise<HydraCollection<ApiOffice>> {
    await simulateNetworkDelay();

    if (MOCK_CONFIG.debug) {
      console.log("[Mock API] officesApi.getAll", params);
    }

    let filtered = [...mockOffices];

    if (params?.type) {
      filtered = filtered.filter((o) => o.type === params.type);
    }
    if (params?.city) {
      filtered = filtered.filter((o) =>
        o.city.toLowerCase().includes(params.city!.toLowerCase())
      );
    }
    if (params?.active !== undefined) {
      filtered = filtered.filter((o) => o.active === params.active);
    }

    return createHydraCollection(filtered, "/offices");
  },

  async getById(id: string): Promise<ApiOffice> {
    await simulateNetworkDelay();

    if (MOCK_CONFIG.debug) {
      console.log("[Mock API] officesApi.getById", id);
    }

    const office = mockOffices.find((o) => o.id === id);
    if (!office) {
      throw new Error(`Office with id ${id} not found`);
    }
    return office;
  },

  async getNearby(
    latitude: number,
    longitude: number,
    radius?: number
  ): Promise<HydraCollection<ApiOffice>> {
    await simulateNetworkDelay();

    if (MOCK_CONFIG.debug) {
      console.log("[Mock API] officesApi.getNearby", { latitude, longitude, radius });
    }

    const maxRadius = radius || 50; // Default 50km

    // Simple distance calculation (not accurate for real geo, but good enough for mock)
    const filtered = mockOffices.filter((office) => {
      const latDiff = Math.abs(office.latitude - latitude);
      const lonDiff = Math.abs(office.longitude - longitude);
      const approxDistance = Math.sqrt(latDiff * latDiff + lonDiff * lonDiff) * 111; // Rough km conversion
      return approxDistance <= maxRadius;
    });

    return createHydraCollection(filtered, "/offices/nearby");
  },
};

/**
 * Mock Offers API
 */
export const mockOffersApi = {
  async getAll(params?: {
    category?: string;
    active?: boolean;
    page?: number;
  }): Promise<HydraCollection<ApiOffer>> {
    await simulateNetworkDelay();

    if (MOCK_CONFIG.debug) {
      console.log("[Mock API] offersApi.getAll", params);
    }

    let filtered = [...mockOffers];

    if (params?.category) {
      filtered = filtered.filter((o) => o.category === params.category);
    }
    if (params?.active !== undefined) {
      filtered = filtered.filter((o) => o.active === params.active);
    }

    return createHydraCollection(filtered, "/offers", params?.page);
  },

  async getById(id: string): Promise<ApiOffer> {
    await simulateNetworkDelay();

    if (MOCK_CONFIG.debug) {
      console.log("[Mock API] offersApi.getById", id);
    }

    const offer = mockOffers.find((o) => o.id === id);
    if (!offer) {
      throw new Error(`Offer with id ${id} not found`);
    }
    return offer;
  },

  async validatePromoCode(
    code: string,
    vehicleId?: string
  ): Promise<{ valid: boolean; discount: number; offer?: ApiOffer }> {
    await simulateNetworkDelay();

    if (MOCK_CONFIG.debug) {
      console.log("[Mock API] offersApi.validatePromoCode", { code, vehicleId });
    }

    const offer = mockOffers.find(
      (o) => o.promoCode?.toLowerCase() === code.toLowerCase() && o.active
    );

    if (!offer) {
      return { valid: false, discount: 0 };
    }

    return {
      valid: true,
      discount: offer.discountPercentage,
      offer,
    };
  },
};

/**
 * Mock Bookings API
 */
export const mockBookingsApi = {
  async create(data: BookingFormData): Promise<ApiBooking> {
    await simulateNetworkDelay();

    if (MOCK_CONFIG.debug) {
      console.log("[Mock API] bookingsApi.create", data);
    }

    const id = generateId();
    const booking: ApiBooking = {
      "@id": `/api/bookings/${id}`,
      "@type": "Booking",
      id,
      bookingReference: `LM${Date.now().toString(36).toUpperCase()}`,
      vehicle: `/api/vehicles/${data.vehicleId}`,
      pickupLocation: `/api/offices/${data.pickupLocationId}`,
      dropoffLocation: `/api/offices/${data.dropoffLocationId}`,
      pickupDate: `${data.pickupDate}T${data.pickupTime}:00`,
      dropoffDate: `${data.dropoffDate}T${data.dropoffTime}:00`,
      customerName: data.customerName,
      customerEmail: data.customerEmail,
      customerPhone: data.customerPhone,
      totalPrice: 0, // Would be calculated
      status: "pending",
      extras: data.extras,
      createdAt: now(),
      updatedAt: now(),
    };

    // Calculate price
    const vehicle = mockVehicles.find((v) => v.id === data.vehicleId);
    if (vehicle) {
      const start = new Date(`${data.pickupDate}T${data.pickupTime}`);
      const end = new Date(`${data.dropoffDate}T${data.dropoffTime}`);
      const days = Math.max(1, Math.ceil((end.getTime() - start.getTime()) / (1000 * 60 * 60 * 24)));
      let total = vehicle.pricePerDay * days;

      // Add extras
      if (data.extras.childSeat) total += days * 5;
      if (data.extras.gpsNavigation) total += days * 8;
      if (data.extras.additionalDriver) total += days * 10;
      if (data.extras.fullInsurance) total += days * 15;

      booking.totalPrice = total;
    }

    bookingsStore.push(booking);
    return booking;
  },

  async getByReference(reference: string): Promise<ApiBooking> {
    await simulateNetworkDelay();

    if (MOCK_CONFIG.debug) {
      console.log("[Mock API] bookingsApi.getByReference", reference);
    }

    const booking = bookingsStore.find((b) => b.bookingReference === reference);
    if (!booking) {
      throw new Error(`Booking with reference ${reference} not found`);
    }
    return booking;
  },

  async cancel(id: string, reason?: string): Promise<ApiBooking> {
    await simulateNetworkDelay();

    if (MOCK_CONFIG.debug) {
      console.log("[Mock API] bookingsApi.cancel", { id, reason });
    }

    const booking = bookingsStore.find((b) => b.id === id);
    if (!booking) {
      throw new Error(`Booking with id ${id} not found`);
    }

    booking.status = "cancelled";
    booking.updatedAt = now();
    return booking;
  },

  async calculatePrice(data: {
    vehicleId: string;
    startDate: string;
    endDate: string;
    extras: BookingExtras;
    promoCode?: string;
  }): Promise<{ totalPrice: number; breakdown: PriceBreakdown }> {
    await simulateNetworkDelay();

    if (MOCK_CONFIG.debug) {
      console.log("[Mock API] bookingsApi.calculatePrice", data);
    }

    const vehicle = mockVehicles.find((v) => v.id === data.vehicleId);
    if (!vehicle) {
      throw new Error(`Vehicle with id ${data.vehicleId} not found`);
    }

    const start = new Date(data.startDate);
    const end = new Date(data.endDate);
    const days = Math.max(1, Math.ceil((end.getTime() - start.getTime()) / (1000 * 60 * 60 * 24)));

    const basePrice = vehicle.pricePerDay * days;
    let extrasTotal = 0;

    if (data.extras.childSeat) extrasTotal += days * 5;
    if (data.extras.gpsNavigation) extrasTotal += days * 8;
    if (data.extras.additionalDriver) extrasTotal += days * 10;
    if (data.extras.fullInsurance) extrasTotal += days * 15;

    let discount = 0;
    if (data.promoCode) {
      const offer = mockOffers.find(
        (o) => o.promoCode?.toLowerCase() === data.promoCode!.toLowerCase() && o.active
      );
      if (offer) {
        discount = (basePrice * offer.discountPercentage) / 100;
      }
    }

    const subtotal = basePrice + extrasTotal - discount;
    const tax = subtotal * 0.25; // 25% VAT in Croatia
    const total = subtotal + tax;

    return {
      totalPrice: Math.round(total * 100) / 100,
      breakdown: {
        basePrice,
        days,
        extrasTotal,
        discount,
        tax: Math.round(tax * 100) / 100,
        total: Math.round(total * 100) / 100,
      },
    };
  },
};

/**
 * Mock Support API
 */
export const mockSupportApi = {
  async submitRequest(data: ContactFormData): Promise<ApiSupportRequest> {
    await simulateNetworkDelay();

    if (MOCK_CONFIG.debug) {
      console.log("[Mock API] supportApi.submitRequest", data);
    }

    const id = generateId();
    const request: ApiSupportRequest = {
      "@id": `/api/support-requests/${id}`,
      "@type": "SupportRequest",
      id,
      name: data.name,
      email: data.email,
      bookingReference: data.bookingReference,
      subject: data.subject,
      message: data.message,
      status: "open",
      createdAt: now(),
      updatedAt: now(),
    };

    supportRequestsStore.push(request);
    return request;
  },

  async getByEmail(email: string): Promise<HydraCollection<ApiSupportRequest>> {
    await simulateNetworkDelay();

    if (MOCK_CONFIG.debug) {
      console.log("[Mock API] supportApi.getByEmail", email);
    }

    const filtered = supportRequestsStore.filter(
      (r) => r.email.toLowerCase() === email.toLowerCase()
    );

    return createHydraCollection(filtered, "/support-requests");
  },
};

// ============================================================================
// Combined Mock API (matches real API structure)
// ============================================================================

export const mockApi = {
  vehicles: mockVehiclesApi,
  offices: mockOfficesApi,
  offers: mockOffersApi,
  bookings: mockBookingsApi,
  support: mockSupportApi,
};
