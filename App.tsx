// App.tsx
import { GestureHandlerRootView } from "react-native-gesture-handler";
import 'react-native-gesture-handler';
import { NavigationContainer } from "@react-navigation/native";
import { createNativeStackNavigator } from "@react-navigation/native-stack";

import SplashScreen from "./src/screens/SplashScreen";
import BottomTabs from "./src/navigation/BottomTabs";
import FoodDetailsScreen from "./src/screens/FoodDetailsScreen";
import TrackingScreen from "./src/screens/TrackingScreen";

import { ImageSourcePropType } from "react-native";
import { FavoritesProvider } from "./src/context/FavoritesContext";
import { CartProvider } from "./src/context/CartContext";

export type RootStackParamList = {
  Splash: undefined;
  Main: undefined;
  FoodDetails: {
    title: string;
    price: string;
    image: ImageSourcePropType;
  };
  Tracking: undefined;
};

const Stack = createNativeStackNavigator<RootStackParamList>();

export default function App() {
  return (
    <GestureHandlerRootView style={{ flex: 1 }}>
      <FavoritesProvider>
        <CartProvider>
          <NavigationContainer>
            <Stack.Navigator screenOptions={{ headerShown: false }}>
              <Stack.Screen name="Splash" component={SplashScreen} />
              <Stack.Screen name="Main" component={BottomTabs} />
              <Stack.Screen name="FoodDetails" component={FoodDetailsScreen} />
              <Stack.Screen name="Tracking" component={TrackingScreen} />
            </Stack.Navigator>
          </NavigationContainer>
        </CartProvider>
      </FavoritesProvider>
    </GestureHandlerRootView>
  );
}