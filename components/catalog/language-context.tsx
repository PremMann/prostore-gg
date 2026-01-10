'use client';

import React, { createContext, useContext, useState, ReactNode, useEffect } from 'react';
import { en } from '@/i18n/locales/en';
import { km } from '@/i18n/locales/km';

type Language = 'en' | 'km';

// Translations Dictionary Type
type Translations = typeof en;

interface LanguageContextType {
    language: Language;
    toggleLanguage: () => void;
    t: (key: keyof Translations) => string;
}

const LanguageContext = createContext<LanguageContextType | undefined>(undefined);

const dictionaries = {
    en,
    km,
};

export function LanguageProvider({ children }: { children: ReactNode }) {
    const [language, setLanguage] = useState<Language>('km'); // Default to Khmer

    const toggleLanguage = () => {
        setLanguage((prev) => (prev === 'en' ? 'km' : 'en'));
    };

    const t = (key: keyof Translations): string => {
        const dictionary = dictionaries[language];
        // Safe access code
        if (!dictionary) return key as string;

        return dictionary[key] || key as string;
    };

    // Font injection for Khmer
    useEffect(() => {
        if (language === 'km') {
            const link = document.createElement('link');
            link.href = 'https://fonts.googleapis.com/css2?family=Noto+Sans+Khmer:wght@100..900&display=swap';
            link.rel = 'stylesheet';
            document.head.appendChild(link);

            const style = document.createElement('style');
            style.innerHTML = `
                body {
                    font-family: 'Noto Sans Khmer', sans-serif !important;
                }
            `;
            document.head.appendChild(style);

            return () => {
                document.head.removeChild(link);
                document.head.removeChild(style);
            };
        }
    }, [language]);

    return (
        <LanguageContext.Provider value={{ language, toggleLanguage, t }}>
            {children}
        </LanguageContext.Provider>
    );
}

export function useLanguage() {
    const context = useContext(LanguageContext);
    if (context === undefined) {
        throw new Error('useLanguage must be used within a LanguageProvider');
    }
    return context;
}
