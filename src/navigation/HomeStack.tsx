import { createNativeStackNavigator } from "@react-navigation/native-stack";
import HomeScreen from "../screens/HomeScreen";
import FoodDetailsScreen from "../screens/FoodDetailsScreen";
import { ImageSourcePropType } from "react-native";

export type HomeStackParamList = {
    HomeScreen: undefined;
    FoodDetails: {
        title: string;
        price: string;
        image: ImageSourcePropType;
    };
};

const Stack = createNativeStackNavigator<HomeStackParamList>();

const HomeStack = () => {
    return (
        <Stack.Navigator screenOptions={{ headerShown: false }}>
            <Stack.Screen name="HomeScreen" component={HomeScreen} />
            <Stack.Screen name="FoodDetails" component={FoodDetailsScreen} />
        </Stack.Navigator>
    );
};

export default HomeStack;
