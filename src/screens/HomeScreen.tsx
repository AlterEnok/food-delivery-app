import {
    View,
    StyleSheet,
    FlatList,
    Text,
} from "react-native";

import OfferBanner from "../components/OfferBanner";
import { useState } from "react";
import { Feather } from "@expo/vector-icons";

import SearchInput from "../components/SearchInput";
import AppButton from "../components/AppButton";
import FoodCard from "../components/FoodCard";
import { food } from "../data/food";
import { Food } from "../types/Food";
import { useNavigation } from "@react-navigation/native";
import { SafeAreaView } from "react-native-safe-area-context";
import { NativeStackNavigationProp } from "@react-navigation/native-stack";
import { RootStackParamList } from "../../App";

const categories = ["All", "Main", "Veg", "Snack"];

const HomeScreen = () => {
    const [search, setSearch] = useState("");
    const [activeCategory, setActiveCategory] = useState("All");

    const navigation =
        useNavigation<NativeStackNavigationProp<RootStackParamList>>();

    const filteredFood = food.filter((item: Food) => {
        const matchesCategory =
            activeCategory === "All" || item.category === activeCategory;

        const matchesSearch =
            item.title.toLowerCase().includes(search.toLowerCase());

        return matchesCategory && matchesSearch;
    });

    return (
        <SafeAreaView edges={["top"]} style={{ flex: 1 }}>
            <FlatList
                data={filteredFood}
                numColumns={2}
                keyExtractor={(item) => item.id}
                ListHeaderComponent={
                    <>

                        {/* LOCATION */}
                        <View style={styles.locationWrapper}>
                            <View style={styles.locationLine} />

                            <View style={styles.locationContent}>
                                <Feather
                                    name="map-pin"
                                    size={14}
                                    color="#C62828"
                                    style={{ marginBottom: 2 }}
                                />

                                <View style={{ marginLeft: 6 }}>
                                    <Text style={styles.locationCountry}>France</Text>
                                    <Text style={styles.locationCity}>Paris</Text>
                                </View>
                            </View>
                        </View>


                        <View style={styles.searchWrapper}>
                            <SearchInput
                                value={search}
                                onChangeText={setSearch}
                            />
                        </View>

                        <OfferBanner
                            title="Boeuf Bourguignon"
                            discount="25% OFF"
                            image="https://langandtrip.com.ua/wp-content/uploads/2022/08/july-article-37-19blanquette.jpg"
                        />

                        <FlatList
                            data={categories}
                            horizontal
                            showsHorizontalScrollIndicator={false}
                            keyExtractor={(item) => item}
                            style={styles.categories}
                            renderItem={({ item }) => (
                                <AppButton
                                    title={item}
                                    active={activeCategory === item}
                                    onPress={() => setActiveCategory(item)}
                                />
                            )}
                        />
                    </>
                }
                renderItem={({ item }) => (
                    <FoodCard
                        title={item.title}
                        price={item.price}
                        image={item.cardImage}
                        onPress={() =>
                            navigation.navigate("FoodDetails", {
                                title: item.title,
                                price: item.price,
                                image: item.detailsImage,
                            })
                        }
                    />
                )}

                ListEmptyComponent={
                    <Text style={{ textAlign: "center", marginTop: 40 }}>
                        Nothing found
                    </Text>
                }
                contentContainerStyle={{ paddingBottom: 40 }}
            />
        </SafeAreaView>
    );
};

export default HomeScreen;

const styles = StyleSheet.create({
    searchWrapper: {
        padding: 10,
        marginBottom: 15,
    },
    categories: {
        marginTop: 20,
        paddingLeft: 16,
    },

    locationWrapper: {
        flexDirection: "row",
        alignItems: "center",
        paddingHorizontal: 16,
        paddingTop: 50,

    },



    locationLine: {
        width: 4,
        height: 40,
        backgroundColor: "#C62828",
        borderRadius: 2,
        marginRight: 10,
    },

    locationCountry: {
        fontSize: 12,
        color: "#777",
        letterSpacing: 1,
        textTransform: "uppercase",
    },

    locationCity: {
        fontSize: 18,
        fontWeight: "600",
        color: "#111",
    },

    locationContent: {
        flexDirection: "row",
        alignItems: "center",
    },


});
