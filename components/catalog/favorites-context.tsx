'use client';

import React, { createContext, useContext, useState, ReactNode } from 'react';

interface FavoritesContextType {
    favorites: string[]; // List of product slugs
    toggleFavorite: (slug: string) => void;
    clearFavorites: () => void;
}

const FavoritesContext = createContext<FavoritesContextType | undefined>(undefined);

export function FavoritesProvider({ children }: { children: ReactNode }) {
    const [favorites, setFavorites] = useState<string[]>([]);

    const toggleFavorite = (slug: string) => {
        setFavorites((prev) =>
            prev.includes(slug)
                ? prev.filter((id) => id !== slug)
                : [...prev, slug]
        );
    };

    const clearFavorites = () => {
        setFavorites([]);
    };

    return (
        <FavoritesContext.Provider value={{ favorites, toggleFavorite, clearFavorites }}>
            {children}
        </FavoritesContext.Provider>
    );
}

export function useFavorites() {
    const context = useContext(FavoritesContext);
    if (context === undefined) {
        throw new Error('useFavorites must be used within a FavoritesProvider');
    }
    return context;
}
