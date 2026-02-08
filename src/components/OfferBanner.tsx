import { View, Text, StyleSheet, Image, TouchableOpacity } from "react-native";

type OfferBannerProps = {
    title: string;
    discount: string;
    image: string;
    onPress?: () => void;
};

const OfferBanner = ({ title, discount, image, onPress }: OfferBannerProps) => {
    return (
        <TouchableOpacity
            activeOpacity={0.9}
            style={styles.banner}
            onPress={onPress}
        >
            <View>
                <View style={styles.discountBadge}>
                    <Text style={styles.discountText}>{discount}</Text>
                </View>

                <Text style={styles.title}>{title}</Text>
            </View>


            <Image source={{ uri: image }} style={styles.image} />
        </TouchableOpacity>
    );
};

export default OfferBanner;

const styles = StyleSheet.create({
    banner: {
        marginHorizontal: 16,
        borderRadius: 22,
        backgroundColor: "#B8860B",
        padding: 16,
        flexDirection: "row",
        justifyContent: "space-between",
        alignItems: "center",
    },

    title: {
        color: "#fff",
        fontSize: 20,
        fontWeight: "700",
    },
    discountBadge: {
        backgroundColor: "#ed1010",
        paddingHorizontal: 10,
        paddingVertical: 4,
        borderRadius: 20,
        alignSelf: "flex-start",
        marginBottom: 6,
    },

    discountText: {
        color: "#fff",
        fontSize: 12,
        fontWeight: "700",
    },

    image: {
        width: 110,
        height: 85,
        borderRadius: 14,
    },
});
