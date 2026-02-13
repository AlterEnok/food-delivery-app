// src/screens/ProfileScreen.tsx
import React, { useState, useEffect } from "react";
import {
    View,
    Text,
    StyleSheet,
    Image,
    Pressable,
    ScrollView,
    TextInput,
    SafeAreaView,
    KeyboardAvoidingView,
    Platform,
    Alert,
} from "react-native";
import { Ionicons } from "@expo/vector-icons";
import AsyncStorage from "@react-native-async-storage/async-storage";

export default function ProfileScreen() {
    // Auth state
    const [isLoggedIn, setIsLoggedIn] = useState(false);
    const [isRegisterMode, setIsRegisterMode] = useState(false);

    // Form fields
    const [name, setName] = useState("");
    const [email, setEmail] = useState("");
    const [password, setPassword] = useState("");
    const [confirmPassword, setConfirmPassword] = useState("");

    // Saved user data
    const [userName, setUserName] = useState("");
    const [userEmail, setUserEmail] = useState("");

    // Load saved user on mount
    useEffect(() => {
        const loadUser = async () => {
            try {
                const savedName = await AsyncStorage.getItem("userName");
                const savedEmail = await AsyncStorage.getItem("userEmail");
                if (savedName && savedEmail) {
                    setUserName(savedName);
                    setUserEmail(savedEmail);
                    setIsLoggedIn(true);
                }
            } catch (e) {
                console.log("Load user error:", e);
            }
        };
        loadUser();
    }, []);

    const handleAction = async () => {
        if (!email.trim() || !password.trim()) {
            Alert.alert("Error", "Please fill in email and password");
            return;
        }

        if (isRegisterMode) {
            if (!name.trim()) {
                Alert.alert("Error", "Please enter your name");
                return;
            }
            if (password !== confirmPassword) {
                Alert.alert("Error", "Passwords do not match");
                return;
            }

            try {
                await AsyncStorage.setItem("userName", name);
                await AsyncStorage.setItem("userEmail", email);
                setUserName(name);
                setUserEmail(email);
                setIsLoggedIn(true);
            } catch (e) {
                console.log("Save error:", e);
            }
        } else {
            try {
                const savedEmail = await AsyncStorage.getItem("userEmail");
                if (savedEmail === email) {
                    const savedName = await AsyncStorage.getItem("userName");
                    setUserName(savedName || "User");
                    setUserEmail(savedEmail);
                    setIsLoggedIn(true);
                } else {
                    Alert.alert("Error", "Invalid email or password");
                }
            } catch (e) {
                console.log("Login error:", e);
            }
        }
    };

    const handleLogout = async () => {
        try {
            await AsyncStorage.removeItem("userName");
            await AsyncStorage.removeItem("userEmail");
            setIsLoggedIn(false);
            setName("");
            setEmail("");
            setPassword("");
            setConfirmPassword("");
        } catch (e) {
            console.log("Logout error:", e);
        }
    };

    const switchMode = () => {
        setIsRegisterMode(!isRegisterMode);
        setName("");
        setPassword("");
        setConfirmPassword("");
    };

    if (!isLoggedIn) {
        return (
            <SafeAreaView style={styles.container}>
                <KeyboardAvoidingView
                    behavior={Platform.OS === "ios" ? "padding" : "height"}
                    style={styles.keyboardAvoid}
                >
                    <ScrollView contentContainerStyle={styles.authScroll}>
                        <View style={styles.authContainer}>
                            <Ionicons name="person-circle-outline" size={100} color="#ccc" />
                            <Text style={styles.title}>
                                {isRegisterMode ? "Create Account" : "Sign In"}
                            </Text>
                            <Text style={styles.subtitle}>
                                {isRegisterMode
                                    ? "Sign up to start using the app"
                                    : "Sign in to your account"}
                            </Text>

                            {isRegisterMode && (
                                <View style={styles.inputContainer}>
                                    <Ionicons name="person-outline" size={20} color="#999" style={styles.inputIcon} />
                                    <TextInput
                                        style={styles.input}
                                        placeholder="Your Name"
                                        placeholderTextColor="#999"
                                        value={name}
                                        onChangeText={setName}
                                        autoCapitalize="words"
                                    />
                                </View>
                            )}

                            <View style={styles.inputContainer}>
                                <Ionicons name="mail-outline" size={20} color="#999" style={styles.inputIcon} />
                                <TextInput
                                    style={styles.input}
                                    placeholder="Email"
                                    placeholderTextColor="#999"
                                    value={email}
                                    onChangeText={setEmail}
                                    keyboardType="email-address"
                                    autoCapitalize="none"
                                />
                            </View>

                            <View style={styles.inputContainer}>
                                <Ionicons name="lock-closed-outline" size={20} color="#999" style={styles.inputIcon} />
                                <TextInput
                                    style={styles.input}
                                    placeholder="Password"
                                    placeholderTextColor="#999"
                                    value={password}
                                    onChangeText={setPassword}
                                    secureTextEntry
                                />
                            </View>

                            {isRegisterMode && (
                                <View style={styles.inputContainer}>
                                    <Ionicons name="lock-closed-outline" size={20} color="#999" style={styles.inputIcon} />
                                    <TextInput
                                        style={styles.input}
                                        placeholder="Confirm Password"
                                        placeholderTextColor="#999"
                                        value={confirmPassword}
                                        onChangeText={setConfirmPassword}
                                        secureTextEntry
                                    />
                                </View>
                            )}

                            <Pressable style={styles.loginButton} onPress={handleAction}>
                                <Text style={styles.loginButtonText}>
                                    {isRegisterMode ? "Register" : "Sign In"}
                                </Text>
                            </Pressable>

                            <Pressable style={styles.googleButton}>
                                <Ionicons name="logo-google" size={20} color="#fff" />
                                <Text style={styles.googleButtonText}>Sign in with Google</Text>
                            </Pressable>

                            <Pressable style={[styles.googleButton, { backgroundColor: "#000" }]}>
                                <Ionicons name="logo-apple" size={20} color="#fff" />
                                <Text style={styles.googleButtonText}>Sign in with Apple</Text>
                            </Pressable>

                            <View style={styles.footerLinks}>
                                <Pressable onPress={switchMode}>
                                    <Text style={styles.linkText}>
                                        {isRegisterMode
                                            ? "Already have an account? Sign In"
                                            : "Don't have an account? Register"}
                                    </Text>
                                </Pressable>

                                {!isRegisterMode && (
                                    <Pressable style={styles.forgotPassword}>
                                        <Text style={styles.linkText}>Forgot password?</Text>
                                    </Pressable>
                                )}
                            </View>
                        </View>
                    </ScrollView>
                </KeyboardAvoidingView>
            </SafeAreaView>
        );
    }

    return (
        <SafeAreaView style={styles.container}>
            <ScrollView contentContainerStyle={styles.scrollContent}>
                <View style={styles.header}>
                    <Image
                        source={{ uri: "https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcTWA-T2SQhF4szhIg8XddmTO_apwU47qUilog&s" + userEmail }}
                        style={styles.avatar}
                    />
                    <Text style={styles.userName}>{userName || "User"}</Text>
                    <Text style={styles.userEmail}>{userEmail}</Text>
                </View>

                <View style={styles.statsRow}>
                    <View style={styles.statItem}>
                        <Text style={styles.statValue}>12</Text>
                        <Text style={styles.statLabel}>Orders</Text>
                    </View>

                    <View style={styles.statDivider} />

                    <View style={styles.statItem}>
                        <Text style={styles.statValue}>450</Text>
                        <Text style={styles.statLabel}>Bonuses</Text>
                    </View>
                </View>

                <View style={styles.menu}>
                    <Pressable style={styles.menuItem}>
                        <Ionicons name="receipt-outline" size={28} color="#FF6A00" />
                        <Text style={styles.menuText}>My Orders</Text>
                        <Ionicons name="chevron-forward" size={20} color="#999" />
                    </Pressable>

                    <Pressable style={styles.menuItem}>
                        <Ionicons name="location-outline" size={28} color="#FF6A00" />
                        <Text style={styles.menuText}>Delivery Addresses</Text>
                        <Ionicons name="chevron-forward" size={20} color="#999" />
                    </Pressable>

                    <Pressable style={styles.menuItem}>
                        <Ionicons name="card-outline" size={28} color="#FF6A00" />
                        <Text style={styles.menuText}>Payment Methods</Text>
                        <Ionicons name="chevron-forward" size={20} color="#999" />
                    </Pressable>

                    <Pressable style={styles.menuItem}>
                        <Ionicons name="gift-outline" size={28} color="#FF6A00" />
                        <Text style={styles.menuText}>Bonuses & Promocodes</Text>
                        <Ionicons name="chevron-forward" size={20} color="#999" />
                    </Pressable>

                    <Pressable style={styles.menuItem}>
                        <Ionicons name="settings-outline" size={28} color="#FF6A00" />
                        <Text style={styles.menuText}>Settings</Text>
                        <Ionicons name="chevron-forward" size={20} color="#999" />
                    </Pressable>

                    <View style={styles.separator} />

                    <Pressable style={styles.logoutButton} onPress={handleLogout}>
                        <Ionicons name="log-out-outline" size={24} color="#FF3B30" />
                        <Text style={styles.logoutText}>Log Out</Text>
                    </Pressable>
                </View>

                <Text style={styles.versionText}>App Version 1.0.0</Text>
            </ScrollView>
        </SafeAreaView>
    );
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: "#f8f8f8",
    },
    scrollContent: {
        padding: 20,
        paddingBottom: 40,
    },
    authScroll: {
        flexGrow: 1,
        justifyContent: "center",
    },
    keyboardAvoid: {
        flex: 1,
    },
    authContainer: {
        alignItems: "center",
        paddingHorizontal: 40,
    },
    title: {
        fontSize: 28,
        fontWeight: "700",
        marginTop: 20,
        marginBottom: 12,
    },
    subtitle: {
        fontSize: 16,
        color: "#666",
        textAlign: "center",
        marginBottom: 32,
    },
    inputContainer: {
        flexDirection: "row",
        alignItems: "center",
        backgroundColor: "#fff",
        borderRadius: 12,
        paddingHorizontal: 16,
        marginBottom: 16,
        width: "100%",
        height: 54,
        shadowColor: "#000",
        shadowOffset: { width: 0, height: 1 },
        shadowOpacity: 0.08,
        shadowRadius: 4,
        elevation: 2,
    },
    inputIcon: {
        marginRight: 12,
    },
    input: {
        flex: 1,
        fontSize: 16,
        color: "#222",
    },
    loginButton: {
        backgroundColor: "#FF6A00",
        paddingVertical: 16,
        borderRadius: 30,
        width: "100%",
        alignItems: "center",
        marginBottom: 16,
    },
    loginButtonText: {
        color: "#fff",
        fontSize: 16,
        fontWeight: "700",
    },
    googleButton: {
        flexDirection: "row",
        alignItems: "center",
        backgroundColor: "#4285F4",
        paddingVertical: 14,
        borderRadius: 30,
        marginBottom: 12,
        width: "100%",
        justifyContent: "center",
        gap: 12,
    },
    googleButtonText: {
        color: "#fff",
        fontSize: 16,
        fontWeight: "600",
    },
    footerLinks: {
        marginTop: 24,
        alignItems: "center",
    },
    linkText: {
        color: "#FF6A00",
        fontWeight: "600",
        marginVertical: 8,
    },
    forgotPassword: { // ← добавлен недостающий стиль
        marginTop: 12,
        alignSelf: "flex-start",
    },
    header: {
        alignItems: "center",
        marginTop: 20,
        marginBottom: 32,
    },
    avatar: {
        width: 110,
        height: 110,
        borderRadius: 55,
        marginBottom: 12,
        borderWidth: 3,
        borderColor: "#FF6A00",
    },
    userName: {
        fontSize: 26,
        fontWeight: "700",
        color: "#111",
        marginBottom: 4,
    },
    userEmail: {
        fontSize: 16,
        color: "#666",
    },
    statsRow: {
        flexDirection: "row",
        backgroundColor: "#fff",
        borderRadius: 16,
        padding: 20,
        marginBottom: 24,
        shadowColor: "#000",
        shadowOffset: { width: 0, height: 2 },
        shadowOpacity: 0.1,
        shadowRadius: 8,
        elevation: 3,
    },
    statItem: {
        flex: 1,
        alignItems: "center",
    },
    statValue: {
        fontSize: 24,
        fontWeight: "700",
        color: "#FF6A00",
    },
    statLabel: {
        fontSize: 14,
        color: "#666",
        marginTop: 4,
    },
    statDivider: {
        width: 1,
        backgroundColor: "#eee",
    },
    menu: {
        backgroundColor: "#fff",
        borderRadius: 16,
        padding: 8,
        shadowColor: "#000",
        shadowOffset: { width: 0, height: 2 },
        shadowOpacity: 0.1,
        shadowRadius: 8,
        elevation: 3,
    },
    menuItem: {
        flexDirection: "row",
        alignItems: "center",
        paddingVertical: 16,
        paddingHorizontal: 12,
        borderBottomWidth: 1,
        borderBottomColor: "#f0f0f0",
    },
    menuText: {
        fontSize: 16,
        marginLeft: 16,
        flex: 1,
        color: "#222",
    },
    separator: {
        height: 1,
        backgroundColor: "#f0f0f0",
        marginVertical: 8,
    },
    logoutButton: {
        flexDirection: "row",
        alignItems: "center",
        paddingVertical: 16,
        paddingHorizontal: 12,
        marginTop: 8,
    },
    logoutText: {
        fontSize: 16,
        color: "#FF3B30",
        marginLeft: 16,
        fontWeight: "600",
    },
    versionText: {
        textAlign: "center",
        color: "#999",
        fontSize: 13,
        marginTop: 32,
    },
});