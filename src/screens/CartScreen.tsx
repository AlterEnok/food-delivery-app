// src/screens/CartScreen.tsx
import React from "react";
import {
    View,
    Text,
    StyleSheet,
    FlatList,
    Image,
    Pressable,
    SafeAreaView,
    Platform,
    Animated,
} from "react-native";
import { Ionicons } from "@expo/vector-icons";
import { useCart, CartItem } from "../context/CartContext";
import { useNavigation } from "@react-navigation/native";
import { NativeStackNavigationProp } from "@react-navigation/native-stack";
import { RootStackParamList } from "../../App";
import Swipeable from "react-native-gesture-handler/Swipeable"; // ← новый импорт
import { RectButton } from "react-native-gesture-handler"; // для кнопки удаления

export default function CartScreen() {
    const { cart, removeFromCart, updateQuantity, getTotal, cartCount } = useCart();
    const navigation = useNavigation<NativeStackNavigationProp<RootStackParamList>>();

    const total = getTotal();
    const formattedTotal = `$${total.toFixed(2)}`;



    // Функция рендера кнопки "Удалить" при свайпе (только для iOS)
    const renderRightActions = (progress: Animated.AnimatedInterpolation<number>, dragX: Animated.AnimatedInterpolation<number>, item: CartItem) => {
        const trans = dragX.interpolate({
            inputRange: [-100, 0],
            outputRange: [0, 100],
            extrapolate: "clamp",
        });

        return (
            <RectButton
                style={styles.rightAction}
                onPress={() => removeFromCart(item.title)}
            >
                <Animated.Text
                    style={[
                        styles.actionText,
                        {
                            transform: [{ translateX: trans }],
                        },
                    ]}
                >
                    Delete
                </Animated.Text>
            </RectButton>
        );
    };

    const renderItem = ({ item }: { item: CartItem }) => {
        // На iOS — оборачиваем в Swipeable
        if (Platform.OS === "ios") {
            return (
                <Swipeable
                    renderRightActions={(progress, dragX) => renderRightActions(progress, dragX, item)}
                    rightThreshold={40}
                    overshootRight={false}
                >
                    <View style={styles.cartItem}>
                        <Image source={item.image} style={styles.itemImage} resizeMode="cover" />

                        <View style={styles.itemInfo}>
                            <Text style={styles.itemTitle} numberOfLines={2}>
                                {item.title}
                            </Text>
                            <Text style={styles.itemPrice}>{item.price}</Text>

                            <View style={styles.quantityRow}>
                                <Pressable
                                    style={styles.qtyBtn}
                                    onPress={() => updateQuantity(item.title, -1)}
                                >
                                    <Text style={styles.qtyText}>−</Text>
                                </Pressable>

                                <Text style={styles.quantity}>{item.quantity}</Text>

                                <Pressable
                                    style={styles.qtyBtn}
                                    onPress={() => updateQuantity(item.title, +1)}
                                >
                                    <Text style={styles.qtyText}>+</Text>
                                </Pressable>
                            </View>
                        </View>

                        {/* Кнопка корзины остаётся как запасной вариант на iOS */}
                        <Pressable onPress={() => removeFromCart(item.title)}>
                            <Ionicons name="trash-outline" size={24} color="#FF3B30" />
                        </Pressable>
                    </View>
                </Swipeable>
            );
        }

        // На Android — оставляем только кнопку корзины
        return (
            <View style={styles.cartItem}>
                <Image source={item.image} style={styles.itemImage} resizeMode="cover" />

                <View style={styles.itemInfo}>
                    <Text style={styles.itemTitle} numberOfLines={2}>
                        {item.title}
                    </Text>
                    <Text style={styles.itemPrice}>{item.price}</Text>

                    <View style={styles.quantityRow}>
                        <Pressable
                            style={styles.qtyBtn}
                            onPress={() => updateQuantity(item.title, -1)}
                        >
                            <Text style={styles.qtyText}>−</Text>
                        </Pressable>

                        <Text style={styles.quantity}>{item.quantity}</Text>

                        <Pressable
                            style={styles.qtyBtn}
                            onPress={() => updateQuantity(item.title, +1)}
                        >
                            <Text style={styles.qtyText}>+</Text>
                        </Pressable>
                    </View>
                </View>

                <Pressable onPress={() => removeFromCart(item.title)}>
                    <Ionicons name="trash-outline" size={24} color="#FF3B30" />
                </Pressable>
            </View>
        );
    };

    if (cartCount === 0) {
        return (
            <SafeAreaView style={styles.container}>
                <View style={styles.emptyContainer}>
                    <Ionicons name="cart-outline" size={80} color="#ccc" />
                    <Text style={styles.emptyText}>Your cart is empty</Text>
                    <Pressable
                        style={styles.shopNowBtn}
                        onPress={() => navigation.goBack()}
                    >
                        <Text style={styles.shopNowText}>Shop Now</Text>
                    </Pressable>
                </View>
            </SafeAreaView>
        );
    }

    return (
        <SafeAreaView style={styles.container}>
            <Text style={styles.header}>Your Cart ({cartCount})</Text>

            <FlatList
                data={cart}
                renderItem={renderItem}
                keyExtractor={(item) => item.title}
                contentContainerStyle={{ padding: 16 }}
                showsVerticalScrollIndicator={false}
            />

            <View style={styles.footer}>
                <View style={styles.totalRow}>
                    <Text style={styles.totalLabel}>Total</Text>
                    <Text style={styles.totalAmount}>{formattedTotal}</Text>
                </View>

                <Pressable
                    style={styles.checkoutBtn}
                    onPress={() => navigation.navigate("Tracking")} // ← переход
                >
                    <Text style={styles.checkoutText}>Proceed to Checkout</Text>
                </Pressable>
            </View>
        </SafeAreaView>
    );
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: "#f8f8f8",
    },
    header: {
        fontSize: 24,
        fontWeight: "700",
        padding: 20,
        backgroundColor: "#fff",
        borderBottomWidth: 1,
        borderBottomColor: "#eee",
    },
    cartItem: {
        flexDirection: "row",
        backgroundColor: "#fff",
        borderRadius: 12,
        padding: 12,
        marginBottom: 12,
        elevation: 2,
        shadowColor: "#000",
        shadowOffset: { width: 0, height: 1 },
        shadowOpacity: 0.08,
        shadowRadius: 4,
    },
    itemImage: {
        width: 90,
        height: 90,
        borderRadius: 8,
    },
    itemInfo: {
        flex: 1,
        marginLeft: 12,
        justifyContent: "space-between",
    },
    itemTitle: {
        fontSize: 16,
        fontWeight: "600",
        color: "#222",
    },
    itemPrice: {
        fontSize: 16,
        fontWeight: "700",
        color: "#FF6A00",
        marginVertical: 4,
    },
    quantityRow: {
        flexDirection: "row",
        alignItems: "center",
        backgroundColor: "#f0f0f0",
        borderRadius: 20,
        alignSelf: "flex-start",
        paddingHorizontal: 8,
        paddingVertical: 4,
    },
    qtyBtn: {
        paddingHorizontal: 10,
    },
    qtyText: {
        fontSize: 20,
        fontWeight: "600",
        color: "#555",
    },
    quantity: {
        fontSize: 16,
        fontWeight: "700",
        marginHorizontal: 12,
    },
    footer: {
        backgroundColor: "#fff",
        padding: 20,
        borderTopWidth: 1,
        borderTopColor: "#eee",
    },
    totalRow: {
        flexDirection: "row",
        justifyContent: "space-between",
        marginBottom: 16,
    },
    totalLabel: {
        fontSize: 18,
        fontWeight: "600",
    },
    totalAmount: {
        fontSize: 22,
        fontWeight: "700",
        color: "#FF6A00",
    },
    checkoutBtn: {
        backgroundColor: "#FF6A00",
        paddingVertical: 16,
        borderRadius: 30,
        alignItems: "center",
    },
    checkoutText: {
        color: "#fff",
        fontSize: 18,
        fontWeight: "700",
    },
    emptyContainer: {
        flex: 1,
        alignItems: "center",
        justifyContent: "center",
        padding: 40,
    },
    emptyText: {
        fontSize: 20,
        color: "#777",
        marginTop: 20,
        marginBottom: 30,
    },
    shopNowBtn: {
        backgroundColor: "#FF6A00",
        paddingVertical: 14,
        paddingHorizontal: 40,
        borderRadius: 30,
    },
    shopNowText: {
        color: "#fff",
        fontSize: 18,
        fontWeight: "600",
    },


    rightAction: {
        backgroundColor: "#FF3B30",
        justifyContent: "center",
        flex: 1,
        alignItems: "flex-end",
        paddingRight: 20,
        borderRadius: 12,
    },
    actionText: {
        color: "#fff",
        fontSize: 16,
        fontWeight: "600",
        backgroundColor: "transparent",
    },
});