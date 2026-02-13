import { View, Image, StyleSheet } from "react-native";
import { useEffect } from "react";
import { NativeStackScreenProps } from "@react-navigation/native-stack";
import { RootStackParamList } from "../../App";

type Props = NativeStackScreenProps<RootStackParamList, "Splash">;

const SplashScreen = ({ navigation }: Props) => {
    useEffect(() => {
        const timer = setTimeout(() => {
            navigation.replace("Main");
        }, 2000);

        return () => clearTimeout(timer);
    }, []);

    return (
        <View style={styles.container}>
            <Image source={require("../../assets/logo.png")} style={styles.logo} resizeMode="contain" />

        </View>
    );
};

export default SplashScreen;

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: "#111",
        alignItems: "center",
        justifyContent: "center",
    },
    logo: {
        width: 200,
        height: 200,
    },
});
