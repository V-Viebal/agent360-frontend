import React, { createContext, useContext, useEffect, useState, useMemo } from "react";
import { en } from "./locales/en";
import { vi } from "./locales/vi";

export type LanguageCode = "vi" | "en";
export type LanguageSelection = "auto" | "vi" | "en";

interface LanguageContextType {
  language: LanguageCode;
  selection: LanguageSelection;
  setLanguageSelection: (selection: LanguageSelection) => void;
  detectedCountry: string | null;
  detectedTimezone: string;
  t: (key: string, params?: Record<string, string | number>) => string;
}

const translations: Record<LanguageCode, Record<string, string>> = {
  en,
  vi,
};

const LanguageContext = createContext<LanguageContextType | undefined>(undefined);

/**
 * Detects whether the user is located in Vietnam or using a Vietnamese environment
 * by checking machine locale, timezone, navigator languages, and Geo timezone hints.
 */
function detectMachineLocationLanguage(): { language: LanguageCode; timezone: string } {
  let detectedLang: LanguageCode = "en";
  let tz = "UTC";

  try {
    if (typeof Intl !== "undefined" && Intl.DateTimeFormat) {
      tz = Intl.DateTimeFormat().resolvedOptions().timeZone || "UTC";
    }

    // Check pre-initialized html[lang] from index.html synchronous bootstrap first (Zero hydration language flip)
    if (typeof document !== "undefined" && document.documentElement.lang) {
      const rootLang = document.documentElement.lang.toLowerCase();
      if (rootLang === "vi" || rootLang === "en") {
        return { language: rootLang as LanguageCode, timezone: tz };
      }
    }

    // Timezones strongly indicative of Vietnam: Asia/Ho_Chi_Minh, Asia/Saigon, Asia/Bangkok
    const isVietnamTimezone =
      tz === "Asia/Ho_Chi_Minh" ||
      tz === "Asia/Saigon" ||
      tz === "Asia/Bangkok";

    // Navigator languages: e.g. ["vi-VN", "vi", "en-US"]
    const navLangs = navigator.languages || [navigator.language];
    const hasVietnamese = navLangs.some(
      (l) => l && (l.toLowerCase().startsWith("vi") || l.toLowerCase().includes("vn"))
    );

    if (isVietnamTimezone || hasVietnamese) {
      detectedLang = "vi";
    } else {
      detectedLang = "en";
    }
  } catch (err) {
    console.warn("[i18n] Location detection fallback:", err);
  }

  return { language: detectedLang, timezone: tz };
}

export function LanguageProvider({ children }: { children: React.ReactNode }) {
  const [selection, setSelectionState] = useState<LanguageSelection>(() => {
    try {
      const saved = localStorage.getItem("skyer_lang_selection") as LanguageSelection;
      if (saved && ["auto", "vi", "en"].includes(saved)) {
        return saved;
      }
    } catch {}
    return "auto";
  });

  const [machineLocale, setMachineLocale] = useState<{ language: LanguageCode; timezone: string }>(() =>
    detectMachineLocationLanguage()
  );

  const [detectedCountry, setDetectedCountry] = useState<string | null>(() => {
    return machineLocale.language === "vi" ? "VN" : "US";
  });

  // Re-check machine environment on focus/load + cached regional geo-hint from Cloudflare CDN trace
  useEffect(() => {
    const detected = detectMachineLocationLanguage();
    setMachineLocale(detected);
    if (detected.language === "vi") {
      setDetectedCountry("VN");
    }

    // Check cached country in sessionStorage to eliminate redundant network roundtrips (<50ms initial paint)
    try {
      const cachedCountry = sessionStorage.getItem("skyer_geo_country");
      if (cachedCountry) {
        setDetectedCountry(cachedCountry);
        if (cachedCountry === "VN") {
          setMachineLocale((prev) => ({ ...prev, language: "vi" }));
        }
        return;
      }
    } catch {}

    // Asynchronously resolve machine location from CDN trace edge and cache result
    fetch("/cdn-cgi/trace")
      .then((res) => {
        if (!res.ok) return null;
        return res.text();
      })
      .then((text) => {
        if (!text) return;
        const lines = text.split("\n");
        const locLine = lines.find((l) => l.startsWith("loc="));
        if (locLine) {
          const country = locLine.replace("loc=", "").trim().toUpperCase();
          setDetectedCountry(country);
          try {
            sessionStorage.setItem("skyer_geo_country", country);
          } catch {}
          if (country === "VN") {
            setMachineLocale((prev) => ({ ...prev, language: "vi" }));
          }
        }
      })
      .catch(() => {
        // Fallback safely to browser Intl detection
      });
  }, []);

  // Compute active language: If user explicitly selected "vi" or "en", respect it;
  // otherwise default to machine location detection ("auto").
  const activeLanguage: LanguageCode = useMemo(() => {
    if (selection === "vi" || selection === "en") {
      return selection;
    }
    return machineLocale.language;
  }, [selection, machineLocale.language]);

  // Update HTML lang attribute for accessibility and SEO
  useEffect(() => {
    document.documentElement.lang = activeLanguage;
  }, [activeLanguage]);

  const setLanguageSelection = (newSelection: LanguageSelection) => {
    setSelectionState(newSelection);
    try {
      localStorage.setItem("skyer_lang_selection", newSelection);
    } catch {}
  };

  const t = (key: string, params?: Record<string, string | number>): string => {
    const dict = translations[activeLanguage] || translations.en;
    let text = dict[key] || translations.en[key] || key;

    if (params) {
      Object.entries(params).forEach(([paramKey, paramVal]) => {
        text = text.replace(new RegExp(`{${paramKey}}`, "g"), String(paramVal));
      });
    }

    return text;
  };

  return (
    <LanguageContext.Provider
      value={{
        language: activeLanguage,
        selection,
        setLanguageSelection,
        detectedCountry,
        detectedTimezone: machineLocale.timezone,
        t,
      }}
    >
      {children}
    </LanguageContext.Provider>
  );
}

export function useTranslation() {
  const context = useContext(LanguageContext);
  if (!context) {
    throw new Error("useTranslation must be used within a LanguageProvider");
  }
  return context;
}
