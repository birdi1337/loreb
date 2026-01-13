import ro from "./ro";
import en from "./en";

const languages = { ro, en };
let currentLanguage = "ro";

/**
 * Setează limba curentă
 * @param {string} lang - Codul limbii ('ro' sau 'en')
 */
export const setLanguage = (lang) => {
  if (languages[lang]) {
    currentLanguage = lang;
  } else {
    console.warn(`Language "${lang}" is not supported. Available: ro, en`);
  }
};

/**
 * Obține limba curentă
 * @returns {string} Codul limbii curente
 */
export const getCurrentLanguage = () => {
  return currentLanguage;
};

/**
 * Obține toate limbile disponibile
 * @returns {Array} Array cu codurile limbilor disponibile
 */
export const getAvailableLanguages = () => {
  return Object.keys(languages);
};

/**
 * Funcție pentru traducere cu suport pentru nested keys și fallback
 * @param {string} key - Cheia traducerii (poate fi 'key' sau 'nested.key')
 * @param {string} fallback - Valoare de fallback dacă traducerea nu există
 * @returns {string} Traducerea sau fallback-ul
 */
export const t = (key, fallback) => {
  // Suport pentru nested keys (ex: 'categories.painting')
  const keys = key.split('.');
  let value = languages[currentLanguage];
  
  for (const k of keys) {
    if (value && typeof value === 'object' && k in value) {
      value = value[k];
    } else {
      // Traducerea nu există, încearcă fallback
      if (fallback) {
        return fallback;
      }
      
      // Dacă nu există fallback, returnează cheia
      console.warn(`Translation missing for key: "${key}" in language: "${currentLanguage}"`);
      return key;
    }
  }
  
  return value;
};

/**
 * Verifică dacă o cheie de traducere există
 * @param {string} key - Cheia de verificat
 * @returns {boolean}
 */
export const hasTranslation = (key) => {
  const keys = key.split('.');
  let value = languages[currentLanguage];
  
  for (const k of keys) {
    if (value && typeof value === 'object' && k in value) {
      value = value[k];
    } else {
      return false;
    }
  }
  
  return true;
};

/**
 * Obține tot obiectul de traduceri pentru limba curentă
 * @returns {object} Obiectul cu toate traducerile
 */
export const getAllTranslations = () => {
  return languages[currentLanguage];
};

export default languages;