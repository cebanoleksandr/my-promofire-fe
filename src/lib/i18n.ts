import i18n from 'i18next';
import { initReactI18next } from 'react-i18next';
import LanguageDetector from 'i18next-browser-languagedetector';
import HttpBackend from 'i18next-http-backend';

export const SUPPORTED_LANGUAGES = ['en', 'uk', 'pl', 'es'] as const;
export type SupportedLanguage = (typeof SUPPORTED_LANGUAGES)[number];

export const LANGUAGE_LABELS: Record<SupportedLanguage, string> = {
  en: 'English',
  uk: 'Українська',
  pl: 'Polski',
  es: 'Español',
};

export const NAMESPACES = [
  'common',
  'auth',
  'layout',
  'dashboard',
  'campaigns',
  'codes',
  'distributors',
  'users',
  'settings',
  'profile',
  'search',
  'notFound',
  'popups',
  'discovery',
] as const;

i18n
  .use(HttpBackend)
  .use(LanguageDetector)
  .use(initReactI18next)
  .init({
    supportedLngs: SUPPORTED_LANGUAGES,
    fallbackLng: 'en',
    ns: NAMESPACES,
    defaultNS: 'common',
    backend: {
      loadPath: `${import.meta.env.BASE_URL}locales/{{lng}}/{{ns}}.json`,
    },
    detection: {
      order: ['localStorage', 'navigator'],
      caches: ['localStorage'],
      lookupLocalStorage: 'promofire_language',
    },
    interpolation: {
      escapeValue: false,
    },
    react: {
      useSuspense: true,
    },
  });

export default i18n;
