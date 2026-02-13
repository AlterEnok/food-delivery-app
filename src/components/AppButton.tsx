import { Text, StyleSheet, Pressable } from "react-native";
import { useState } from "react";


type AppButtonProps = {
    title: string;
    active?: boolean;
    onPress?: () => void;
};

const AppButton = ({ title, active = false, onPress }: AppButtonProps) => {
    const [pressed, setPressed] = useState(false);

    return (
        <Pressable
            onPress={onPress}
            onPressIn={() => setPressed(true)}
            onPressOut={() => setPressed(false)}
            style={[
                styles.button,
                active && styles.active,
                pressed && styles.pressed,
            ]}
        >
            <Text style={[styles.text, active && styles.textActive]}>
                {title}
            </Text>
        </Pressable>
    );
};

export default AppButton;

const styles = StyleSheet.create({
    button: {
        paddingVertical: 8,
        paddingHorizontal: 18,
        borderRadius: 20,
        backgroundColor: "#EFEFEF",
        marginRight: 10,
        transform: [{ scale: 1 }],
    },
    active: {
        backgroundColor: "#2F1E0F",
    },
    pressed: {
        transform: [{ scale: 0.96 }],
        opacity: 0.9,
    },
    text: {
        fontSize: 14,
        color: "#333",
        fontWeight: "500",
    },
    textActive: {
        color: "#fff",
        fontWeight: "600",
    },
});