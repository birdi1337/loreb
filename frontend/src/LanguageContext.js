import React, { createContext, useContext, useState, useEffect } from "react";
import { t as translate, setLanguage as setI18nLanguage } from "./i18n";

const LanguageContext = createContext();

export const useLanguage = () => {
  const context = useContext(LanguageContext);
  if (!context) {
    throw new Error("useLanguage must be used within LanguageProvider");
  }
  return context;
};

export const LanguageProvider = ({ children }) => {
  const [language, setLanguage] = useState(() => {
    return localStorage.getItem("language") || "ro";
  });

  useEffect(() => {
    localStorage.setItem("language", language);
    setI18nLanguage(language);
  }, [language]);

  const t = (key) => translate(key);

  const toggleLanguage = () => {
    setLanguage((prev) => (prev === "ro" ? "en" : "ro"));
  };

  return (
    <LanguageContext.Provider value={{ language, toggleLanguage, t }}>
      {children}
    </LanguageContext.Provider>
  );
};
