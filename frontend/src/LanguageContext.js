import React, { createContext, useContext, useState, useEffect, useCallback } from "react";
import { t as translate, setLanguage as setI18nLanguage, getCurrentLanguage } from "./i18n";

// 
const LanguageContext = createContext(undefined);

//
export const useLanguage = () => {
  const context = useContext(LanguageContext);
  if (!context) {
    throw new Error("useLanguage must be used within LanguageProvider");
  }
  return context;
};

// 
export const LanguageProvider = ({ children }) => {
  // 
  const [language, setLanguage] = useState(() => {
    // 
    const savedLanguage = localStorage.getItem("language");
    if (savedLanguage && (savedLanguage === "ro" || savedLanguage === "en")) {
      return savedLanguage;
    }
    
    // 
    const browserLanguage = navigator.language || navigator.userLanguage;
    if (browserLanguage.startsWith("ro")) {
      return "ro";
    }
    
    // 
    return "ro";
  });

  // 
  useEffect(() => {
    localStorage.setItem("language", language);
    setI18nLanguage(language);
    
    // 
    document.documentElement.lang = language;
  }, [language]);

  // 
  const t = useCallback((key, defaultValue) => {
    const translation = translate(key);
    
    // 
    if (translation === key && defaultValue) {
      return defaultValue;
    }
    
    return translation;
  }, []);

  // 
  const toggleLanguage = useCallback(() => {
    setLanguage((prev) => (prev === "ro" ? "en" : "ro"));
  }, []);

  // 
  const changeLanguage = useCallback((newLanguage) => {
    if (newLanguage === "ro" || newLanguage === "en") {
      setLanguage(newLanguage);
    } else {
      console.warn(`Language "${newLanguage}" is not supported. Supported: ro, en`);
    }
  }, []);

  //
  const getCurrentLang = useCallback(() => {
    return getCurrentLanguage();
  }, []);

  // 
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