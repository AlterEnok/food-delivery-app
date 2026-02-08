import { createContext, useContext, useState, ReactNode } from "react";
import { ImageSourcePropType } from "react-native";

export type CartItem = {
    title: string;
    price: string;           // например "$ 45,00"
    image: ImageSourcePropType;
    quantity: number;
};

interface CartContextType {
    cart: CartItem[];
    addToCart: (item: Omit<CartItem, "quantity"> & { quantity?: number }) => void;
    removeFromCart: (title: string) => void;
    updateQuantity: (title: string, delta: number) => void;
    getTotal: () => number;
    cartCount: number;
}

const CartContext = createContext<CartContextType | undefined>(undefined);

export function CartProvider({ children }: { children: ReactNode }) {
    const [cart, setCart] = useState<CartItem[]>([]);

    const addToCart = (newItem: Omit<CartItem, "quantity"> & { quantity?: number }) => {
        setCart((prev) => {
            const qty = newItem.quantity ?? 1; // если не передали → 1
            const existing = prev.find((i) => i.title === newItem.title);

            if (existing) {
                return prev.map((i) =>
                    i.title === newItem.title ? { ...i, quantity: i.quantity + qty } : i
                );
            }

            return [...prev, { ...newItem, quantity: qty }];
        });
    };

    const removeFromCart = (title: string) => {
        setCart((prev) => prev.filter((item) => item.title !== title));
    };

    const updateQuantity = (title: string, delta: number) => {
        setCart((prev) =>
            prev
                .map((item) =>
                    item.title === title
                        ? { ...item, quantity: Math.max(1, item.quantity + delta) }
                        : item
                )
                .filter((item) => item.quantity > 0) // можно убрать, если не хотим авто-удаление при 0
        );
    };

    const getTotal = () => {
        return cart.reduce((sum, item) => {
            const cleaned = item.price.replace(/[^0-9.,]/g, "").replace(",", ".");
            const priceNum = parseFloat(cleaned) || 0;
            return sum + priceNum * item.quantity;
        }, 0);
    };

    const cartCount = cart.reduce((sum, item) => sum + item.quantity, 0);

    return (
        <CartContext.Provider
            value={{ cart, addToCart, removeFromCart, updateQuantity, getTotal, cartCount }}
        >
            {children}
        </CartContext.Provider>
    );
}

export const useCart = () => {
    const context = useContext(CartContext);
    if (!context) {
        throw new Error("useCart must be used within CartProvider");
    }
    return context;
};