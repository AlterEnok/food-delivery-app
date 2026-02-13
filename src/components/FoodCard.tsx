import { View, Text, StyleSheet, Image, Pressable } from "react-native";

import { ImageSourcePropType } from "react-native";

type FoodCardProps = {
    title: string;
    price: string;
    image: ImageSourcePropType;
    onPress?: () => void;
};

const FoodCard = ({ title, price, image, onPress }: FoodCardProps) => {
    return (
        <Pressable
            style={({ pressed }) => [
                styles.card,
                pressed && styles.pressed,
            ]}
            onPress={onPress}
        >
            <Image source={image} style={styles.image} />

            <View style={styles.info}>
                <Text style={styles.title} numberOfLines={1}>
                    {title}
                </Text>
                <Text style={styles.price}>{price}</Text>
            </View>
        </Pressable>
    );
};

export default FoodCard;

const styles = StyleSheet.create({
    card: {
        width: "45%",
        backgroundColor: "#fff",
        borderRadius: 18,
        margin: 10,
        overflow: "hidden",
        elevation: 4, // Android shadow
    },

    pressed: {
        transform: [{ scale: 0.97 }],
        opacity: 0.95,
    },

    image: {
        width: "100%",
        height: 130,
    },

    info: {
        padding: 10,
    },

    title: {
        fontSize: 15,
        fontWeight: "600",
        color: "#2F1E0F",
    },

    price: {
        marginTop: 4,
        fontSize: 14,
        fontWeight: "700",
        color: "#B8860B",
    },
})