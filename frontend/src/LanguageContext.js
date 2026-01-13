import React, { createContext, useContext, useState, useEffect, useCallback } from "react";
import { t as translate, setLanguage as setI18nLanguage, getCurrentLanguage } from "./i18n";

// Creează contextul
const LanguageContext = createContext(undefined);

// Hook personalizat pentru a folosi contextul
export const useLanguage = () => {
  const context = useContext(LanguageContext);
  if (!context) {
    throw new Error("useLanguage must be used within LanguageProvider");
  }
  return context;
};

// Provider pentru context
export const LanguageProvider = ({ children }) => {
  // Inițializare limbă din localStorage sau browser
  const [language, setLanguage] = useState(() => {
    // 1. Verifică localStorage
    const savedLanguage = localStorage.getItem("language");
    if (savedLanguage && (savedLanguage === "ro" || savedLanguage === "en")) {
      return savedLanguage;
    }
    
    // 2. Detectează limba browserului
    const browserLanguage = navigator.language || navigator.userLanguage;
    if (browserLanguage.startsWith("ro")) {
      return "ro";
    }
    
    // 3. Default la română
    return "ro";
  });

  // Salvează limba în localStorage și actualizează i18n
  useEffect(() => {
    localStorage.setItem("language", language);
    setI18nLanguage(language);
    
    // Actualizează atributul lang pe <html> pentru accessibility
    document.documentElement.lang = language;
  }, [language]);

  // Funcție pentru traducere cu fallback
  const t = useCallback((key, defaultValue) => {
    const translation = translate(key);
    
    // Dacă traducerea este cheia (nu a fost găsită), returnează defaultValue sau cheia
    if (translation === key && defaultValue) {
      return defaultValue;
    }
    
    return translation;
  }, []);

  // Toggle între limbi
  const toggleLanguage = useCallback(() => {
    setLanguage((prev) => (prev === "ro" ? "en" : "ro"));
  }, []);

  // Setează limba direct (util pentru viitor dacă adaugi mai multe limbi)
  const changeLanguage = useCallback((newLanguage) => {
    if (newLanguage === "ro" || newLanguage === "en") {
      setLanguage(newLanguage);
    } else {
      console.warn(`Language "${newLanguage}" is not supported. Supported: ro, en`);
    }
  }, []);

  // Obține limba curentă
  const getCurrentLang = useCallback(() => {
    return getCurrentLanguage();
  }, []);

  // Obține informații despre limbă
  const getLanguageInfo = useCallback(() => {
    return {
      code: language,
      name: language === "ro" ? "Română" : "English",
      nativeName: language === "ro" ? "Română" : "English",
      flag: language === "ro" ? "🇷🇴" : "🇬🇧"
    };
  }, [language]);

  const value = {
    language,
    toggleLanguage,
    changeLanguage,
    t,
    getCurrentLang,
    getLanguageInfo
  };

  return (
    <LanguageContext.Provider value={value}>
      {children}
    </LanguageContext.Provider>
  );
};