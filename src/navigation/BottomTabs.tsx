// src/navigation/BottomTabs.tsx
import { createBottomTabNavigator } from "@react-navigation/bottom-tabs";
import { Ionicons } from "@expo/vector-icons";
import { View, Text, StyleSheet, Animated } from "react-native";
import { useSafeAreaInsets } from "react-native-safe-area-context";
import { useEffect, useRef } from "react";
import { useCart } from "../context/CartContext";

import HomeStack from "./HomeStack";
import CartScreen from "../screens/CartScreen";
import ProfileScreen from "../screens/ProfileScreen";

const Tab = createBottomTabNavigator();

const TabIcon = ({ name, label, focused, badgeCount = 0 }: {
    name: any;
    label: string;
    focused: boolean;
    badgeCount?: number;
}) => {
    const anim = useRef(new Animated.Value(focused ? 1 : 0)).current;
    const badgeAnim = useRef(new Animated.Value(1)).current;

    // Анимация смены фокуса
    useEffect(() => {
        Animated.spring(anim, {
            toValue: focused ? 1 : 0,
            useNativeDriver: false,
            stiffness: 200,
            damping: 22,
        }).start();
    }, [focused]);

    // Анимация бейджа при изменении количества
    useEffect(() => {
        if (badgeCount > 0) {
            Animated.sequence([
                Animated.timing(badgeAnim, { toValue: 1.4, duration: 120, useNativeDriver: true }),
                Animated.spring(badgeAnim, { toValue: 1, friction: 4, useNativeDriver: true }),
            ]).start();
        }
    }, [badgeCount]);

    const width = anim.interpolate({
        inputRange: [0, 1],
        outputRange: [66, 128],
    });

    const opacity = anim;

    return (
        <Animated.View style={[styles.tabItem, focused && styles.activeTab, { width }]}>
            <View style={styles.iconWrapper}>
                <Ionicons
                    name={name}
                    size={22}
                    color={focused ? "#fff" : "#999"}
                    style={{ marginLeft: 2 }}
                />

                {badgeCount > 0 && (
                    <Animated.View
                        style={[
                            styles.badge,
                            { transform: [{ scale: badgeAnim }] }
                        ]}
                    >
                        <Text style={styles.badgeText}>
                            {badgeCount > 99 ? "99+" : badgeCount}
                        </Text>
                    </Animated.View>
                )}
            </View>

            {focused && (
                <Animated.Text style={[styles.label, { opacity }]} numberOfLines={1}>
                    {label}
                </Animated.Text>
            )}
        </Animated.View>
    );
};

const BottomTabs = () => {
    const insets = useSafeAreaInsets();
    const { cartCount } = useCart();

    const tabBarStyle = {
        height: 64 + insets.bottom,
        paddingBottom: insets.bottom + 8,
        paddingTop: 8,
        paddingHorizontal: 14,
        borderTopWidth: 0,
        backgroundColor: "#fff",
        shadowColor: "transparent",
        elevation: 0,
    };

    return (
        <Tab.Navigator
            screenOptions={{
                headerShown: false,
                tabBarShowLabel: false,
                tabBarStyle,
            }}
        >
            <Tab.Screen
                name="Home"
                component={HomeStack}
                options={{
                    tabBarIcon: ({ focused }) => (
                        <TabIcon name="home" label="Home" focused={focused} />
                    ),
                }}
            />
            <Tab.Screen
                name="Cart"
                component={CartScreen}
                options={{
                    tabBarIcon: ({ focused }) => (
                        <TabIcon name="cart" label="Cart" focused={focused} badgeCount={cartCount} />
                    ),
                }}
            />
            <Tab.Screen
                name="Profile"
                component={ProfileScreen}
                options={{
                    tabBarIcon: ({ focused }) => (
                        <TabIcon name="person" label="Profile" focused={focused} />
                    ),
                }}
            />
        </Tab.Navigator>
    );
};

export default BottomTabs;

const styles = StyleSheet.create({
    tabItem: {
        height: 44,
        minWidth: 56,
        borderRadius: 22,
        paddingHorizontal: 16,
        flexDirection: "row",
        alignItems: "center",
        justifyContent: "center",
        gap: 8,
        backgroundColor: "transparent",
        overflow: "hidden",
    },
    activeTab: {
        backgroundColor: "#f29c08",
    },
    label: {
        color: "#fff",
        fontSize: 14,
        fontWeight: "600",
    },
    iconWrapper: {
        position: "relative",
    },
    badge: {
        position: "absolute",
        top: -6,
        right: -6,
        backgroundColor: "#FF3B30", // красный бейдж
        borderRadius: 10,
        minWidth: 20,
        height: 20,
        justifyContent: "center",
        alignItems: "center",
        paddingHorizontal: 5,
        borderWidth: 1.5,
        borderColor: "#fff",
    },
    badgeText: {
        color: "#fff",
        fontSize: 11,
        fontWeight: "bold",
    },
});