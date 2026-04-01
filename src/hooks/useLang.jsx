import { createContext, useContext, useState, useCallback, useMemo } from 'react';
import translations from '../i18n';
import { STORAGE_KEYS } from '../constants';

const LangContext = createContext();

function loadLang() {
  try {
    return localStorage.getItem(STORAGE_KEYS.lang) || 'en';
  } catch {
    return 'en';
  }
}

export function LangProvider({ children }) {
  const [lang, setLang] = useState(loadLang);

  const toggleLang = useCallback(() => {
    setLang(prev => {
      const next = prev === 'en' ? 'ar' : 'en';
      try { localStorage.setItem(STORAGE_KEYS.lang, next); } catch {}
      return next;
    });
  }, []);

  const t = useCallback((key) => {
    return translations[lang]?.[key] || translations.en[key] || key;
  }, [lang]);

  const isRtl = lang === 'ar';

  const value = useMemo(() => ({ lang, t, toggleLang, isRtl }), [lang, t, toggleLang, isRtl]);

  return (
    <LangContext.Provider value={value}>
      {children}
    </LangContext.Provider>
  );
}

export function useLang() {
  return useContext(LangContext);
}
