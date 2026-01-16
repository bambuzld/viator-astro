/**
 * API Utilities for Symfony/API Platform Backend Integration
 *
 * This module provides a comprehensive set of utilities for making API calls,
 * handling errors, and managing loading states.
 *
 * Mock API Support:
 * - Set PUBLIC_MOCK_API=true (default) to use mock data with simulated latency
 * - Set PUBLIC_MOCK_API=false to use real backend API
 */

import {
  MOCK_CONFIG,
  mockVehiclesApi,
  mockOfficesApi,
  mockOffersApi,
  mockBookingsApi,
  mockSupportApi,
} from "./mock-api";

// ============================================================================
// Configuration
// ============================================================================

/**
 * API configuration - update these values when connecting to the backend
 */
export const API_CONFIG = {
  baseUrl: import.meta.env.PUBLIC_API_URL || "http://localhost:8000/api",
  timeout: 30000,
  defaultHeaders: {
    "Content-Type": "application/ld+json",
    Accept: "application/ld+json",
  },
  /** Whether to use mock API (defaults to true for development/testing) */
  useMockApi: MOCK_CONFIG.enabled,
} as const;

// ============================================================================
// TypeScript Interfaces for API Responses
// ============================================================================

/**
 * API Platform Hydra Collection response format
 */
export interface HydraCollection<T> {
  "@context": string;
  "@id": string;
  "@type": "hydra:Collection";
  "hydra:totalItems": number;
  "hydra:member": T[];
  "hydra:view"?: HydraView;
  "hydra:search"?: HydraSearch;
}

export interface HydraView {
  "@id": string;
  "@type": "hydra:PartialCollectionView";
  "hydra:first"?: string;
  "hydra:last"?: string;
  "hydra:previous"?: string;
  "hydra:next"?: string;
}

export interface HydraSearch {
  "@type": "hydra:IriTemplate";
  "hydra:template": string;
  "hydra:variableRepresentation": string;
  "hydra:mapping": HydraMapping[];
}

export interface HydraMapping {
  "@type": "IriTemplateMapping";
  variable: string;
  property: string;
  required: boolean;
}

/**
 * API Platform Hydra single resource format
 */
export interface HydraResource {
  "@context"?: string;
  "@id": string;
  "@type": string;
}

/**
 * Vehicle entity from the API
 */
export interface ApiVehicle extends HydraResource {
  "@type": "Vehicle";
  id: string;
  name: string;
  category: "economy" | "compact" | "suv" | "luxury";
  imageUrl: string;
  passengers: number;
  doors: number;
  luggage: number;
  transmission: "automatic" | "manual";
  hasAirConditioning: boolean;
  pricePerDay: number;
  available: boolean;
  createdAt: string;
  updatedAt: string;
}

/**
 * Office/Location entity from the API
 */
export interface ApiOffice extends HydraResource {
  "@type": "Office";
  id: string;
  name: string;
  address: string;
  city: string;
  country: string;
  phone: string;
  email: string;
  type: "airport" | "city";
  latitude: number;
  longitude: number;
  services: string[];
  workingHours: {
    weekdays: string;
    saturday: string;
    sunday: string;
  };
  active: boolean;
}

/**
 * Special Offer entity from the API
 */
export interface ApiOffer extends HydraResource {
  "@type": "Offer";
  id: string;
  title: string;
  description: string;
  terms: string;
  discountPercentage: number;
  discountLabel: string;
  category: "seasonal" | "discount" | "loyalty";
  imageUrl: string;
  validFrom: string;
  validUntil: string;
  promoCode?: string;
  active: boolean;
}

/**
 * Booking entity from the API
 */
export interface ApiBooking extends HydraResource {
  "@type": "Booking";
  id: string;
  bookingReference: string;
  vehicle: string | ApiVehicle;
  pickupLocation: string | ApiOffice;
  dropoffLocation: string | ApiOffice;
  pickupDate: string;
  dropoffDate: string;
  customerName: string;
  customerEmail: string;
  customerPhone: string;
  totalPrice: number;
  status: "pending" | "confirmed" | "cancelled" | "completed";
  extras: BookingExtras;
  createdAt: string;
  updatedAt: string;
}

export interface BookingExtras {
  childSeat: boolean;
  gpsNavigation: boolean;
  additionalDriver: boolean;
  fullInsurance: boolean;
}

/**
 * Customer/User entity from the API
 */
export interface ApiCustomer extends HydraResource {
  "@type": "Customer";
  id: string;
  email: string;
  firstName: string;
  lastName: string;
  phone?: string;
  dateOfBirth?: string;
  driverLicenseNumber?: string;
  loyaltyPoints: number;
  createdAt: string;
}

/**
 * Support request entity from the API
 */
export interface ApiSupportRequest extends HydraResource {
  "@type": "SupportRequest";
  id: string;
  name: string;
  email: string;
  bookingReference?: string;
  subject: string;
  message: string;
  status: "open" | "in_progress" | "resolved" | "closed";
  createdAt: string;
  updatedAt: string;
}

/**
 * Contact form submission
 */
export interface ContactFormData {
  name: string;
  email: string;
  bookingReference?: string;
  subject: string;
  message: string;
}

/**
 * Booking form submission
 */
export interface BookingFormData {
  vehicleId: string;
  pickupLocationId: string;
  dropoffLocationId: string;
  pickupDate: string;
  pickupTime: string;
  dropoffDate: string;
  dropoffTime: string;
  customerName: string;
  customerEmail: string;
  customerPhone: string;
  extras: BookingExtras;
  promoCode?: string;
}

// ============================================================================
// Error Handling
// ============================================================================

/**
 * API Platform constraint violation format
 */
export interface ConstraintViolation {
  propertyPath: string;
  message: string;
  code?: string;
}

/**
 * API Platform error response format
 */
export interface ApiErrorResponse {
  "@context": string;
  "@type": "ConstraintViolationList" | "hydra:Error";
  "hydra:title"?: string;
  "hydra:description"?: string;
  violations?: ConstraintViolation[];
  title?: string;
  detail?: string;
  status?: number;
}

/**
 * Custom API Error class with structured error information
 */
export class ApiError extends Error {
  public readonly status: number;
  public readonly statusText: string;
  public readonly violations: ConstraintViolation[];
  public readonly isNetworkError: boolean;
  public readonly isValidationError: boolean;
  public readonly isAuthenticationError: boolean;
  public readonly isNotFoundError: boolean;
  public readonly isServerError: boolean;
  public readonly rawResponse?: ApiErrorResponse;

  constructor(
    message: string,
    status: number,
    statusText: string = "",
    violations: ConstraintViolation[] = [],
    rawResponse?: ApiErrorResponse
  ) {
    super(message);
    this.name = "ApiError";
    this.status = status;
    this.statusText = statusText;
    this.violations = violations;
    this.rawResponse = rawResponse;
    this.isNetworkError = status === 0;
    this.isValidationError = status === 422 || status === 400;
    this.isAuthenticationError = status === 401 || status === 403;
    this.isNotFoundError = status === 404;
    this.isServerError = status >= 500;
  }

  /**
   * Get validation errors grouped by field
   */
  getFieldErrors(): Record<string, string[]> {
    const fieldErrors: Record<string, string[]> = {};
    for (const violation of this.violations) {
      const field = violation.propertyPath || "general";
      if (!fieldErrors[field]) {
        fieldErrors[field] = [];
      }
      fieldErrors[field].push(violation.message);
    }
    return fieldErrors;
  }

  /**
   * Get the first error message for a specific field
   */
  getFieldError(field: string): string | undefined {
    const fieldErrors = this.getFieldErrors();
    return fieldErrors[field]?.[0];
  }
}

/**
 * Parse error response from API Platform
 */
async function parseErrorResponse(response: Response): Promise<ApiError> {
  let errorData: ApiErrorResponse | null = null;
  let message = `Request failed with status ${response.status}`;
  const violations: ConstraintViolation[] = [];

  try {
    errorData = await response.json();

    if (errorData?.["hydra:description"]) {
      message = errorData["hydra:description"];
    } else if (errorData?.detail) {
      message = errorData.detail;
    } else if (errorData?.["hydra:title"]) {
      message = errorData["hydra:title"];
    }

    if (errorData?.violations) {
      violations.push(...errorData.violations);
    }
  } catch {
    // Response body is not JSON
  }

  return new ApiError(
    message,
    response.status,
    response.statusText,
    violations,
    errorData ?? undefined
  );
}

// ============================================================================
// Loading State Management
// ============================================================================

/**
 * Generic async state for managing loading/error/data states
 */
export interface AsyncState<T> {
  data: T | null;
  isLoading: boolean;
  error: ApiError | null;
  isSuccess: boolean;
  isError: boolean;
}

/**
 * Create initial async state
 */
export function createInitialAsyncState<T>(): AsyncState<T> {
  return {
    data: null,
    isLoading: false,
    error: null,
    isSuccess: false,
    isError: false,
  };
}

/**
 * Create loading async state
 */
export function createLoadingState<T>(previousData?: T | null): AsyncState<T> {
  return {
    data: previousData ?? null,
    isLoading: true,
    error: null,
    isSuccess: false,
    isError: false,
  };
}

/**
 * Create success async state
 */
export function createSuccessState<T>(data: T): AsyncState<T> {
  return {
    data,
    isLoading: false,
    error: null,
    isSuccess: true,
    isError: false,
  };
}

/**
 * Create error async state
 */
export function createErrorState<T>(
  error: ApiError,
  previousData?: T | null
): AsyncState<T> {
  return {
    data: previousData ?? null,
    isLoading: false,
    error,
    isSuccess: false,
    isError: true,
  };
}

// ============================================================================
// Fetch Wrapper Functions
// ============================================================================

export interface RequestOptions extends Omit<RequestInit, "body"> {
  body?: unknown;
  timeout?: number;
  params?: Record<string, string | number | boolean | undefined>;
}

/**
 * Build URL with query parameters
 */
function buildUrl(
  endpoint: string,
  params?: Record<string, string | number | boolean | undefined>
): string {
  const url = endpoint.startsWith("http")
    ? endpoint
    : `${API_CONFIG.baseUrl}${endpoint.startsWith("/") ? "" : "/"}${endpoint}`;

  if (!params) return url;

  const searchParams = new URLSearchParams();
  for (const [key, value] of Object.entries(params)) {
    if (value !== undefined) {
      searchParams.append(key, String(value));
    }
  }

  const queryString = searchParams.toString();
  return queryString ? `${url}?${queryString}` : url;
}

/**
 * Core fetch wrapper with error handling and timeout support
 */
export async function apiFetch<T>(
  endpoint: string,
  options: RequestOptions = {}
): Promise<T> {
  const { body, timeout = API_CONFIG.timeout, params, ...fetchOptions } = options;

  const url = buildUrl(endpoint, params);

  const controller = new AbortController();
  const timeoutId = setTimeout(() => controller.abort(), timeout);

  try {
    const response = await fetch(url, {
      ...fetchOptions,
      headers: {
        ...API_CONFIG.defaultHeaders,
        ...fetchOptions.headers,
      },
      body: body ? JSON.stringify(body) : undefined,
      signal: controller.signal,
    });

    clearTimeout(timeoutId);

    if (!response.ok) {
      throw await parseErrorResponse(response);
    }

    // Handle 204 No Content
    if (response.status === 204) {
      return null as T;
    }

    return await response.json();
  } catch (error) {
    clearTimeout(timeoutId);

    if (error instanceof ApiError) {
      throw error;
    }

    if (error instanceof DOMException && error.name === "AbortError") {
      throw new ApiError("Request timeout", 0, "Timeout");
    }

    if (error instanceof TypeError) {
      throw new ApiError(
        "Network error - please check your connection",
        0,
        "Network Error"
      );
    }

    throw new ApiError(
      error instanceof Error ? error.message : "Unknown error occurred",
      0,
      "Error"
    );
  }
}

/**
 * GET request wrapper
 */
export async function apiGet<T>(
  endpoint: string,
  params?: Record<string, string | number | boolean | undefined>,
  options?: Omit<RequestOptions, "method" | "body" | "params">
): Promise<T> {
  return apiFetch<T>(endpoint, {
    ...options,
    method: "GET",
    params,
  });
}

/**
 * POST request wrapper
 */
export async function apiPost<T>(
  endpoint: string,
  body?: unknown,
  options?: Omit<RequestOptions, "method" | "body">
): Promise<T> {
  return apiFetch<T>(endpoint, {
    ...options,
    method: "POST",
    body,
  });
}

/**
 * PUT request wrapper
 */
export async function apiPut<T>(
  endpoint: string,
  body?: unknown,
  options?: Omit<RequestOptions, "method" | "body">
): Promise<T> {
  return apiFetch<T>(endpoint, {
    ...options,
    method: "PUT",
    body,
  });
}

/**
 * PATCH request wrapper
 */
export async function apiPatch<T>(
  endpoint: string,
  body?: unknown,
  options?: Omit<RequestOptions, "method" | "body">
): Promise<T> {
  return apiFetch<T>(endpoint, {
    ...options,
    method: "PATCH",
    headers: {
      "Content-Type": "application/merge-patch+json",
    },
    body,
  });
}

/**
 * DELETE request wrapper
 */
export async function apiDelete<T = void>(
  endpoint: string,
  options?: Omit<RequestOptions, "method" | "body">
): Promise<T> {
  return apiFetch<T>(endpoint, {
    ...options,
    method: "DELETE",
  });
}

// ============================================================================
// Resource-Specific API Functions
// ============================================================================

// ============================================================================
// Real API Functions (used when mock is disabled)
// ============================================================================

const realVehiclesApi = {
  getAll: (params?: {
    category?: string;
    available?: boolean;
    page?: number;
    itemsPerPage?: number;
  }) => apiGet<HydraCollection<ApiVehicle>>("/vehicles", params),

  getById: (id: string) => apiGet<ApiVehicle>(`/vehicles/${id}`),

  checkAvailability: (
    vehicleId: string,
    startDate: string,
    endDate: string
  ) =>
    apiGet<{ available: boolean; price: number }>(
      `/vehicles/${vehicleId}/availability`,
      { startDate, endDate }
    ),
};

const realOfficesApi = {
  getAll: (params?: { type?: string; city?: string; active?: boolean }) =>
    apiGet<HydraCollection<ApiOffice>>("/offices", params),

  getById: (id: string) => apiGet<ApiOffice>(`/offices/${id}`),

  getNearby: (latitude: number, longitude: number, radius?: number) =>
    apiGet<HydraCollection<ApiOffice>>("/offices/nearby", {
      latitude,
      longitude,
      radius,
    }),
};

const realOffersApi = {
  getAll: (params?: {
    category?: string;
    active?: boolean;
    page?: number;
  }) => apiGet<HydraCollection<ApiOffer>>("/offers", params),

  getById: (id: string) => apiGet<ApiOffer>(`/offers/${id}`),

  validatePromoCode: (code: string, vehicleId?: string) =>
    apiPost<{ valid: boolean; discount: number; offer?: ApiOffer }>(
      "/offers/validate-promo",
      { code, vehicleId }
    ),
};

const realBookingsApi = {
  create: (data: BookingFormData) =>
    apiPost<ApiBooking>("/bookings", data),

  getByReference: (reference: string) =>
    apiGet<ApiBooking>(`/bookings/by-reference/${reference}`),

  cancel: (id: string, reason?: string) =>
    apiPatch<ApiBooking>(`/bookings/${id}/cancel`, { reason }),

  calculatePrice: (data: {
    vehicleId: string;
    startDate: string;
    endDate: string;
    extras: BookingExtras;
    promoCode?: string;
  }) => apiPost<{ totalPrice: number; breakdown: PriceBreakdown }>("/bookings/calculate-price", data),
};

export interface PriceBreakdown {
  basePrice: number;
  days: number;
  extrasTotal: number;
  discount: number;
  tax: number;
  total: number;
}

const realSupportApi = {
  submitRequest: (data: ContactFormData) =>
    apiPost<ApiSupportRequest>("/support-requests", data),

  getByEmail: (email: string) =>
    apiGet<HydraCollection<ApiSupportRequest>>("/support-requests", { email }),
};

// ============================================================================
// Exported API (automatically switches between mock and real)
// ============================================================================

/**
 * Vehicles API
 * Uses mock data when PUBLIC_MOCK_API is true (default), real API otherwise
 */
export const vehiclesApi = API_CONFIG.useMockApi ? mockVehiclesApi : realVehiclesApi;

/**
 * Offices API
 * Uses mock data when PUBLIC_MOCK_API is true (default), real API otherwise
 */
export const officesApi = API_CONFIG.useMockApi ? mockOfficesApi : realOfficesApi;

/**
 * Offers API
 * Uses mock data when PUBLIC_MOCK_API is true (default), real API otherwise
 */
export const offersApi = API_CONFIG.useMockApi ? mockOffersApi : realOffersApi;

/**
 * Bookings API
 * Uses mock data when PUBLIC_MOCK_API is true (default), real API otherwise
 */
export const bookingsApi = API_CONFIG.useMockApi ? mockBookingsApi : realBookingsApi;

/**
 * Support API
 * Uses mock data when PUBLIC_MOCK_API is true (default), real API otherwise
 */
export const supportApi = API_CONFIG.useMockApi ? mockSupportApi : realSupportApi;

// ============================================================================
// React Hook Helpers
// ============================================================================

/**
 * Helper for executing API calls with state management
 * Use with useState in React components
 */
export async function executeApiCall<T>(
  apiCall: () => Promise<T>,
  setState: (state: AsyncState<T>) => void,
  previousData?: T | null
): Promise<T | null> {
  setState(createLoadingState(previousData));

  try {
    const data = await apiCall();
    setState(createSuccessState(data));
    return data;
  } catch (error) {
    const apiError =
      error instanceof ApiError
        ? error
        : new ApiError(
            error instanceof Error ? error.message : "Unknown error",
            0,
            "Error"
          );
    setState(createErrorState(apiError, previousData));
    return null;
  }
}

/**
 * Type guard to check if response is a Hydra collection
 */
export function isHydraCollection<T>(
  response: unknown
): response is HydraCollection<T> {
  return (
    typeof response === "object" &&
    response !== null &&
    "@type" in response &&
    (response as HydraCollection<T>)["@type"] === "hydra:Collection"
  );
}

/**
 * Extract items from a Hydra collection response
 */
export function extractCollectionItems<T>(
  response: HydraCollection<T>
): T[] {
  return response["hydra:member"];
}

/**
 * Get pagination info from a Hydra collection
 */
export function getPaginationInfo(response: HydraCollection<unknown>): {
  totalItems: number;
  hasNextPage: boolean;
  hasPreviousPage: boolean;
  nextPageUrl?: string;
  previousPageUrl?: string;
} {
  return {
    totalItems: response["hydra:totalItems"],
    hasNextPage: !!response["hydra:view"]?.["hydra:next"],
    hasPreviousPage: !!response["hydra:view"]?.["hydra:previous"],
    nextPageUrl: response["hydra:view"]?.["hydra:next"],
    previousPageUrl: response["hydra:view"]?.["hydra:previous"],
  };
}
