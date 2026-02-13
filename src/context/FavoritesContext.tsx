// src/context/FavoritesContext.tsx
import { createContext, useContext, useState, ReactNode } from "react";
import { ImageSourcePropType } from "react-native";

type FavoriteItem = {
    title: string;
    price: string;
    image: ImageSourcePropType;
};

interface FavoritesContextType {
    favorites: FavoriteItem[];
    toggleFavorite: (item: FavoriteItem) => void;
    isFavorite: (title: string) => boolean;
}

const FavoritesContext = createContext<FavoritesContextType | undefined>(undefined);

export function FavoritesProvider({ children }: { children: ReactNode }) {
    const [favorites, setFavorites] = useState<FavoriteItem[]>([]);

    const toggleFavorite = (item: FavoriteItem) => {
        setFavorites((prev) => {
            const exists = prev.some((fav) => fav.title === item.title);
            if (exists) {
                return prev.filter((fav) => fav.title !== item.title);
            }
            return [...prev, item];
        });
    };

    const isFavorite = (title: string) => {
        return favorites.some((fav) => fav.title === title);
    };

    return (
        <FavoritesContext.Provider value={{ favorites, toggleFavorite, isFavorite }}>
            {children}
        </FavoritesContext.Provider>
    );
}

export const useFavorites = () => {
    const context = useContext(FavoritesContext);
    if (!context) {
        throw new Error("useFavorites must be used within FavoritesProvider");
    }
    return context;
};