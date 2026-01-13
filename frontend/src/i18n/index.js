import ro from "./ro";
import en from "./en";

const languages = { ro, en };
let current = "ro";

export const setLanguage = (lang) => {
  if (languages[lang]) current = lang;
};

export const t = (key) => {
  return languages[current][key] || key;
};

export default languages;
