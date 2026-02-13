// src/screens/TrackingScreen.tsx

import React, { useState, useEffect, useRef } from "react";
import {
    View,
    Text,
    StyleSheet,
    Pressable,
    Animated,
    SafeAreaView,
} from "react-native";
import MapView, {
    Marker,
    Polyline,
    LatLng,
    Region,
} from "react-native-maps";
import { Ionicons } from "@expo/vector-icons";

export default function TrackingScreen() {
    // Регион карты (с delta)
    const clientRegion: Region = {
        latitude: 48.8534,
        longitude: 2.3499,
        latitudeDelta: 0.03,
        longitudeDelta: 0.03,
    };

    // Чистые координаты клиента (без delta)
    const clientLocation: LatLng = {
        latitude: 48.8534,
        longitude: 2.3499,
    };

    const [courierLocation, setCourierLocation] = useState<LatLng>({
        latitude: 48.8600,
        longitude: 2.3700,
    });

    const animatedValue = useRef(new Animated.Value(0)).current;
    const [status, setStatus] = useState("Preparing your order");
    const [eta, setEta] = useState("~15 min");

    useEffect(() => {
        Animated.timing(animatedValue, {
            toValue: 1,
            duration: 15000,
            useNativeDriver: false,
        }).start();

        const listener = animatedValue.addListener(({ value }) => {
            const newLat = 48.8600 + (48.8534 - 48.8600) * value;
            const newLng = 2.3700 + (2.3499 - 2.3700) * value;

            setCourierLocation({
                latitude: newLat,
                longitude: newLng,
            });
        });

        const statuses = [
            { time: 3000, status: "Preparing your order", eta: "~15 min" },
            { time: 7000, status: "Order picked up", eta: "~12 min" },
            { time: 12000, status: "On the way", eta: "~6 min" },
            { time: 15000, status: "Delivered", eta: "Arrived!" },
        ];

        const timers = statuses.map(({ time, status, eta }) =>
            setTimeout(() => {
                setStatus(status);
                setEta(eta);
            }, time)
        );

        return () => {
            animatedValue.removeListener(listener);
            timers.forEach(clearTimeout);
        };
    }, []);

    const routeCoords: LatLng[] = [courierLocation, clientLocation];

    return (
        <SafeAreaView style={styles.container}>
            <MapView
                style={styles.map}
                initialRegion={clientRegion}
                showsUserLocation
                showsMyLocationButton
            >
                <Marker
                    coordinate={clientLocation}
                    title="Your location"
                    pinColor="green"
                />

                <Marker
                    coordinate={courierLocation}
                    title="Courier"
                    anchor={{ x: 0.5, y: 0.5 }}
                >
                    <Ionicons name="bicycle" size={36} color="red" />
                </Marker>

                <Polyline
                    coordinates={routeCoords}
                    strokeColor="#FF6A00"
                    strokeWidth={4}
                />
            </MapView>

            <View style={styles.statusContainer}>
                <Text style={styles.statusTitle}>{status}</Text>
                <Text style={styles.etaText}>Estimated arrival: {eta}</Text>

                <View style={styles.progressBar}>
                    <Animated.View
                        style={[
                            styles.progressFill,
                            {
                                width: animatedValue.interpolate({
                                    inputRange: [0, 1],
                                    outputRange: ["0%", "100%"],
                                }),
                            },
                        ]}
                    />
                </View>
            </View>

            <View style={styles.buttonsRow}>
                <Pressable style={styles.actionButton}>
                    <Ionicons name="call-outline" size={24} color="#fff" />
                    <Text style={styles.buttonText}>Call Courier</Text>
                </Pressable>

                <Pressable
                    style={[styles.actionButton, { backgroundColor: "#FF3B30" }]}
                >
                    <Ionicons name="chatbubble-outline" size={24} color="#fff" />
                    <Text style={styles.buttonText}>Chat</Text>
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
    map: {
        flex: 1,
    },
    statusContainer: {
        position: "absolute",
        top: 80,
        left: 16,
        right: 16,
        backgroundColor: "#fff",
        borderRadius: 16,
        padding: 16,
        shadowColor: "#000",
        shadowOffset: { width: 0, height: 4 },
        shadowOpacity: 0.15,
        shadowRadius: 12,
        elevation: 6,
    },
    statusTitle: {
        fontSize: 18,
        fontWeight: "700",
        color: "#111",
        marginBottom: 4,
    },
    etaText: {
        fontSize: 14,
        color: "#666",
        marginBottom: 12,
    },
    progressBar: {
        height: 6,
        backgroundColor: "#eee",
        borderRadius: 3,
        overflow: "hidden",
    },
    progressFill: {
        height: "100%",
        backgroundColor: "#FF6A00",
    },
    buttonsRow: {
        position: "absolute",
        bottom: 40,
        left: 16,
        right: 16,
        flexDirection: "row",
        justifyContent: "space-between",
    },
    actionButton: {
        flex: 1,
        backgroundColor: "#FF6A00",
        paddingVertical: 14,
        borderRadius: 30,
        alignItems: "center",
        marginHorizontal: 8,
        flexDirection: "row",
        justifyContent: "center",
    },
    buttonText: {
        color: "#fff",
        fontSize: 16,
        fontWeight: "600",
    },
});
