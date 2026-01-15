import hrTranslations from "../i18n/translations/hr.json";
import enTranslations from "../i18n/translations/en.json";
import frTranslations from "../i18n/translations/fr.json";
import deTranslations from "../i18n/translations/de.json";
import { format, type Locale } from "date-fns";
import { hr, enUS, fr, de } from "date-fns/locale";

// Supported language codes
export type LanguageCode = "hr" | "en" | "fr" | "de";

// Default language is Croatian
export const DEFAULT_LANGUAGE: LanguageCode = "hr";

// Storage key for persisting language preference
export const LANGUAGE_STORAGE_KEY = "preferred-language";

// Language metadata
export interface LanguageInfo {
  code: LanguageCode;
  name: string;
  nativeName: string;
  flag: string;
  locale: Locale;
}

export const SUPPORTED_LANGUAGES: LanguageInfo[] = [
  { code: "hr", name: "Croatian", nativeName: "Hrvatski", flag: "🇭🇷", locale: hr },
  { code: "en", name: "English", nativeName: "English", flag: "🇬🇧", locale: enUS },
  { code: "fr", name: "French", nativeName: "Français", flag: "🇫🇷", locale: fr },
  { code: "de", name: "German", nativeName: "Deutsch", flag: "🇩🇪", locale: de },
];

// All translations indexed by language code
const translations: Record<LanguageCode, typeof hrTranslations> = {
  hr: hrTranslations,
  en: enTranslations,
  fr: frTranslations,
  de: deTranslations,
};

// Get date-fns locale for a language code
export function getDateLocale(lang: LanguageCode): Locale {
  const langInfo = SUPPORTED_LANGUAGES.find((l) => l.code === lang);
  return langInfo?.locale ?? hr;
}

/**
 * Get the current language from localStorage or return default
 */
export function getCurrentLanguage(): LanguageCode {
  if (typeof window === "undefined") return DEFAULT_LANGUAGE;

  const stored = localStorage.getItem(LANGUAGE_STORAGE_KEY);
  if (stored && isValidLanguage(stored)) {
    return stored as LanguageCode;
  }
  return DEFAULT_LANGUAGE;
}

/**
 * Set the current language in localStorage
 */
export function setCurrentLanguage(lang: LanguageCode): void {
  if (typeof window === "undefined") return;
  localStorage.setItem(LANGUAGE_STORAGE_KEY, lang);
  // Dispatch a custom event so components can react to language changes
  window.dispatchEvent(new CustomEvent("languagechange", { detail: { language: lang } }));
}

/**
 * Check if a string is a valid language code
 */
export function isValidLanguage(lang: string): lang is LanguageCode {
  return ["hr", "en", "fr", "de"].includes(lang);
}

/**
 * Get all translations for a specific language
 */
export function getTranslations(lang: LanguageCode = DEFAULT_LANGUAGE): typeof hrTranslations {
  return translations[lang] ?? translations[DEFAULT_LANGUAGE];
}

/**
 * Get a specific translation by dot-notation path
 * Example: t("nav.fleet", "en") returns "Fleet"
 */
export function t(key: string, lang: LanguageCode = DEFAULT_LANGUAGE): string {
  const trans = translations[lang] ?? translations[DEFAULT_LANGUAGE];
  const keys = key.split(".");

  let result: unknown = trans;
  for (const k of keys) {
    if (result && typeof result === "object" && k in result) {
      result = (result as Record<string, unknown>)[k];
    } else {
      // Fallback to default language if key not found
      result = translations[DEFAULT_LANGUAGE];
      for (const fallbackKey of keys) {
        if (result && typeof result === "object" && fallbackKey in result) {
          result = (result as Record<string, unknown>)[fallbackKey];
        } else {
          return key; // Return the key itself if not found
        }
      }
      break;
    }
  }

  return typeof result === "string" ? result : key;
}

/**
 * Create a translation function bound to a specific language
 * Useful for components that need multiple translations
 */
export function createTranslator(lang: LanguageCode = DEFAULT_LANGUAGE) {
  return (key: string): string => t(key, lang);
}

/**
 * Format a date according to the language's locale
 */
export function formatDate(
  date: Date,
  formatStr: string,
  lang: LanguageCode = DEFAULT_LANGUAGE
): string {
  const locale = getDateLocale(lang);
  return format(date, formatStr, { locale });
}

/**
 * Format a date using predefined format from translations
 */
export function formatLocalizedDate(
  date: Date,
  formatType: "short" | "long" | "monthYear" = "short",
  lang: LanguageCode = DEFAULT_LANGUAGE
): string {
  const trans = getTranslations(lang);
  const formatStr = trans.dateFormats[formatType];
  return formatDate(date, formatStr, lang);
}

/**
 * Get language info by code
 */
export function getLanguageInfo(code: LanguageCode): LanguageInfo | undefined {
  return SUPPORTED_LANGUAGES.find((l) => l.code === code);
}

/**
 * React hook helper - returns a function to get translations
 * Use this in React components with useEffect to handle language changes
 */
export function useTranslationSetup() {
  return {
    getCurrentLanguage,
    setCurrentLanguage,
    getTranslations,
    t,
    createTranslator,
    formatDate,
    formatLocalizedDate,
    LANGUAGE_STORAGE_KEY,
    DEFAULT_LANGUAGE,
    SUPPORTED_LANGUAGES,
  };
}

// Export types for the translation structure
export type Translations = typeof hrTranslations;
export type TranslationKey = string;
