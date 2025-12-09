
"use client";

import React, { createContext, useState, useContext, ReactNode, useMemo, useEffect } from 'react';
import { useToast } from '@/hooks/use-toast';
import { useLanguage } from './language-context';

interface ApiKeyContextType {
  apiKey: string | null;
  setApiKey: (key: string | null) => void;
  isApiKeySet: boolean;
}

const ApiKeyContext = createContext<ApiKeyContextType | undefined>(undefined);

export function ApiKeyProvider({ children }: { children: ReactNode }) {
  const [apiKey, setApiKey] = useState<string | null>(null);
  const [isInitialized, setIsInitialized] = useState(false);
  const { toast } = useToast();
  const { translations } = useLanguage();

  useEffect(() => {
    try {
      const storedKey = localStorage.getItem('gemini-api-key');
      if (storedKey) {
        setApiKey(storedKey);
      }
    } catch (error) {
      console.error("Could not access localStorage:", error);
    }
    setIsInitialized(true);
  }, []);

  const handleSetApiKey = (key: string | null) => {
    try {
      if (key && key.trim()) {
        localStorage.setItem('gemini-api-key', key);
        setApiKey(key);
        toast({
            title: translations.settings.apiKeySaved,
        });
      } else {
        localStorage.removeItem('gemini-api-key');
        setApiKey(null);
      }
    } catch (error) {
       console.error("Could not access localStorage:", error);
       toast({
            variant: 'destructive',
            title: translations.toast.genericError.title,
            description: "Could not save API key.",
        });
    }
  };

  const value = useMemo(() => ({
    apiKey,
    setApiKey: handleSetApiKey,
    isApiKeySet: !!apiKey,
  }), [apiKey, translations]);

  // Prevent rendering children until the key has been loaded from localStorage
  if (!isInitialized) {
      return null;
  }

  return (
    <ApiKeyContext.Provider value={value}>
      {children}
    </ApiKeyContext.Provider>
  );
}

export function useApiKey(): ApiKeyContextType {
  const context = useContext(ApiKeyContext);
  if (context === undefined) {
    throw new Error('useApiKey must be used within an ApiKeyProvider');
  }
  return context;
}
