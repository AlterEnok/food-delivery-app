// src/screens/FoodDetailsScreen.tsx
import {
    View,
    Text,
    SafeAreaView,
    StyleSheet,
    Image,
    Pressable,
    Animated,
} from "react-native";
import { RouteProp, useRoute, useNavigation } from "@react-navigation/native";
import { useEffect, useState, useRef } from "react";
import { RootStackParamList } from "../../App";
import { Ionicons } from "@expo/vector-icons";
import { BlurView } from "expo-blur";
import { ScrollView } from "react-native";
import { useFavorites } from "../context/FavoritesContext";
import { useCart } from "../context/CartContext";
import * as Haptics from "expo-haptics";

type FoodDetailsRouteProps = RouteProp<RootStackParamList, "FoodDetails">;

export default function FoodDetailsScreen() {
    const { params } = useRoute<FoodDetailsRouteProps>();
    const navigation = useNavigation();
    const [count, setCount] = useState(2);

    const { toggleFavorite, isFavorite } = useFavorites();
    const { addToCart, cart } = useCart();

    const isItemFavorite = isFavorite(params.title);

    // Проверяем, есть ли уже этот товар в корзине
    const isInCart = cart.some((item) => item.title === params.title);


    const scaleAnim = useRef(new Animated.Value(1)).current;
    const opacityAnim = useRef(new Animated.Value(1)).current;
    const iconRotate = useRef(new Animated.Value(0)).current;

    const animatePressIn = () => {
        Animated.parallel([
            Animated.spring(scaleAnim, { toValue: 0.92, friction: 8, useNativeDriver: true }),
            Animated.timing(opacityAnim, { toValue: 0.85, duration: 120, useNativeDriver: true }),
        ]).start();
    };

    const animatePressOut = () => {
        Animated.parallel([
            Animated.spring(scaleAnim, { toValue: 1, friction: 8, useNativeDriver: true }),
            Animated.timing(opacityAnim, { toValue: 1, duration: 140, useNativeDriver: true }),
        ]).start();
    };

    const handleCartAction = () => {
        if (isInCart) {

            const item = cart.find((i) => i.title === params.title);
            if (item) {

                cart.forEach((i) => {
                    if (i.title === params.title) {

                    }
                });

            }
            Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);
            Animated.timing(iconRotate, { toValue: 0, duration: 300, useNativeDriver: true }).start();
        } else {
            addToCart({
                title: params.title,
                price: params.price,
                image: params.image,
                quantity: count,
            });

            Haptics.notificationAsync(Haptics.NotificationFeedbackType.Success);

            // Анимация смены иконки + bounce
            Animated.sequence([
                Animated.timing(scaleAnim, { toValue: 1.15, duration: 100, useNativeDriver: true }),
                Animated.spring(scaleAnim, { toValue: 1, friction: 5, useNativeDriver: true }),
                Animated.timing(iconRotate, { toValue: 1, duration: 400, useNativeDriver: true }),
            ]).start();
        }
    };

    // Анимация поворота иконки (от корзины к галочке)
    const rotateInterpolate = iconRotate.interpolate({
        inputRange: [0, 1],
        outputRange: ["0deg", "360deg"],
    });

    const handleToggleFavorite = () => {
        const wasFavorite = isItemFavorite;
        toggleFavorite({
            title: params.title,
            price: params.price,
            image: params.image,
        });

        if (!wasFavorite) {
            Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Medium);
        } else {
            Haptics.selectionAsync();
        }
    };

    useEffect(() => {
        const parent = navigation.getParent();

        parent?.setOptions({
            tabBarStyle: { display: "none" },
        });

        return () => {
            parent?.setOptions({
                tabBarStyle: {
                    display: "flex",
                    // НЕ задаём height и paddingBottom здесь — оставляем дефолт из BottomTabs
                    paddingTop: 8,
                    paddingHorizontal: 14,
                    borderTopWidth: 0,
                    backgroundColor: "#fff",
                },
            });
        };
    }, [navigation]);

    return (
        <SafeAreaView style={styles.container}>
            {/* IMAGE + HEADER */}
            <View style={styles.imageBlock}>
                <View style={styles.header}>
                    <Pressable style={styles.iconBtn} onPress={() => navigation.goBack()}>
                        <Ionicons name="arrow-back" size={22} color="#333" />
                    </Pressable>

                    <Text style={styles.headerTitle}>Menu Detail</Text>

                    <Pressable style={styles.iconBtn} onPress={handleToggleFavorite}>
                        <Ionicons
                            name={isItemFavorite ? "heart" : "heart-outline"}
                            size={22}
                            color={isItemFavorite ? "#FF3B30" : "#666"}
                        />
                    </Pressable>
                </View>

                <View style={styles.imageWrapper}>
                    <Image source={params.image} style={styles.image} resizeMode="contain" />
                </View>
            </View>

            {/* CONTENT */}
            <ScrollView
                style={styles.content}
                contentContainerStyle={{ paddingBottom: 160 }}
                showsVerticalScrollIndicator={false}
            >
                <Text style={styles.category}>French cuisine</Text>

                <View style={styles.titleRow}>
                    <Text style={styles.title}>{params.title}</Text>

                    <View style={styles.counter}>
                        <Pressable onPress={() => setCount((prev) => Math.max(1, prev - 1))}>
                            <Text style={styles.counterBtn}>−</Text>
                        </Pressable>

                        <Text style={styles.counterValue}>{count}</Text>

                        <Pressable onPress={() => setCount((prev) => prev + 1)}>
                            <Text style={styles.counterBtn}>+</Text>
                        </Pressable>
                    </View>
                </View>

                <View style={styles.ingredients}>
                    <Ingredient label="Beef" icon="restaurant" />
                    <Ingredient label="Cheese" icon="pizza" />
                    <Ingredient label="Tomato" icon="nutrition" />
                    <Ingredient label="Lettuce" icon="leaf" />
                    <Ingredient label="Cucumber" icon="leaf-outline" />
                </View>

                <Text style={styles.sectionTitle}>Description</Text>

                <Text style={styles.description}>
                    An irresistible culinary delight that brings together the best ingredients to create a truly satisfying burger.
                </Text>
            </ScrollView>

            {/* BOTTOM BAR */}
            <BlurView intensity={80} tint="light" style={styles.bottomBar}>
                <Text style={styles.price}>{params.price}</Text>

                <Pressable
                    style={[
                        styles.addButton,
                        isInCart && { backgroundColor: "#4CAF50" },
                    ]}
                    onPress={handleCartAction}
                    onPressIn={animatePressIn}
                    onPressOut={animatePressOut}
                >
                    <Animated.View
                        style={{
                            transform: [{ scale: scaleAnim }, { rotate: rotateInterpolate }],
                            opacity: opacityAnim,
                            flexDirection: "row",
                            alignItems: "center",
                            gap: 10,
                        }}
                    >
                        <Ionicons
                            name={isInCart ? "checkmark-circle" : "bag-outline"}
                            size={22}
                            color="#fff"
                        />
                        <Text style={styles.addButtonText}>
                            {isInCart ? "Added" : "Add to Cart"}
                        </Text>
                    </Animated.View>
                </Pressable>
            </BlurView>
        </SafeAreaView>
    );
}

const Ingredient = ({ label, icon }: { label: string; icon: any }) => (
    <View style={styles.ingredientItem}>
        <View style={styles.ingredientCircle}>
            <Ionicons name={icon} size={20} color="#FF6A00" />
        </View>
        <Text style={styles.ingredientText}>{label}</Text>
    </View>
);

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: "#fff",
    },
    imageBlock: {
        backgroundColor: "#F4EDE5",
        borderBottomLeftRadius: 40,
        borderBottomRightRadius: 40,
        paddingBottom: 24,
    },
    header: {
        flexDirection: "row",
        justifyContent: "space-between",
        alignItems: "center",
        paddingHorizontal: 20,
        paddingTop: 12,
    },
    headerTitle: {
        fontSize: 18,
        fontWeight: "600",
        color: "#222",
    },
    iconBtn: {
        width: 40,
        height: 40,
        borderRadius: 20,
        backgroundColor: "#fff",
        justifyContent: "center",
        alignItems: "center",
        elevation: 2,
        shadowColor: "#000",
        shadowOffset: { width: 0, height: 1 },
        shadowOpacity: 0.12,
        shadowRadius: 3,
    },
    imageWrapper: {
        alignItems: "center",
        justifyContent: "center",
        marginTop: 16,
    },
    image: {
        width: "90%",
        height: 360,
    },
    content: {
        padding: 20,
    },
    category: {
        color: "#999",
        fontSize: 14,
        marginBottom: 6,
    },
    titleRow: {
        flexDirection: "row",
        alignItems: "center",
        marginBottom: 20,
    },
    title: {
        flex: 1,
        fontSize: 24,
        fontWeight: "700",
        color: "#111",
    },
    counter: {
        flexDirection: "row",
        backgroundColor: "#F5F5F5",
        borderRadius: 20,
        paddingHorizontal: 14,
        paddingVertical: 8,
        alignItems: "center",
    },
    counterBtn: {
        fontSize: 22,
        paddingHorizontal: 10,
        color: "#555",
        fontWeight: "500",
    },
    counterValue: {
        fontSize: 18,
        fontWeight: "700",
        marginHorizontal: 12,
    },
    ingredients: {
        flexDirection: "row",
        justifyContent: "space-between",
        marginVertical: 24,
    },
    ingredientItem: {
        alignItems: "center",
        gap: 6,
    },
    ingredientCircle: {
        width: 50,
        height: 50,
        borderRadius: 25,
        backgroundColor: "#FFF3EA",
        justifyContent: "center",
        alignItems: "center",
    },
    ingredientText: {
        fontSize: 12,
        color: "#666",
    },
    sectionTitle: {
        fontSize: 16,
        fontWeight: "600",
        marginBottom: 8,
        color: "#222",
    },
    description: {
        color: "#555",
        lineHeight: 22,
        fontSize: 15,
    },
    bottomBar: {
        position: "absolute",
        bottom: 14,
        left: 0,
        right: 0,
        flexDirection: "row",
        justifyContent: "space-between",
        alignItems: "center",
        paddingHorizontal: 24,
        paddingVertical: 16,
        borderTopWidth: 1,
        borderTopColor: "rgba(0,0,0,0.08)",
    },
    price: {
        fontSize: 26,
        fontWeight: "700",
        color: "#FF6A00",
    },
    addButton: {
        flexDirection: "row",
        alignItems: "center",
        gap: 10,
        backgroundColor: "#FF6A00",
        paddingHorizontal: 28,
        paddingVertical: 14,
        borderRadius: 30,
        shadowColor: "#FF6A00",
        shadowOffset: { width: 0, height: 4 },
        shadowOpacity: 0.4,
        shadowRadius: 8,
        elevation: 6,
    },
    addButtonText: {
        color: "#fff",
        fontWeight: "600",
        fontSize: 16,
    },
});