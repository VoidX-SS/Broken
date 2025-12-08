"use client";

import React, { createContext, useState, useContext, ReactNode, useMemo } from 'react';
import { translations, Translation } from '@/lib/translations';

export type Language = 'vi' | 'en';

interface LanguageContextType {
  language: Language;
  setLanguage: (language: Language) => void;
  translations: Translation;
}

const LanguageContext = createContext<LanguageContextType | undefined>(undefined);

export function LanguageProvider({ children }: { children: ReactNode }) {
  const [language, setLanguage] = useState<Language>('vi');

  const value = useMemo(() => ({
    language,
    setLanguage,
    translations: translations[language],
  }), [language]);

  return (
    <LanguageContext.Provider value={value}>
      {children}
    </LanguageContext.Provider>
  );
}

export function useLanguage(): LanguageContextType {
  const context = useContext(LanguageContext);
  if (context === undefined) {
    throw new Error('useLanguage must be used within a LanguageProvider');
  }
  return context;
}
