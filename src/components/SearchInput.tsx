import { View, TextInput, StyleSheet, Keyboard } from "react-native";
import { Ionicons } from "@expo/vector-icons";
import { useState } from "react";

type SearchInputProps = {
    value: string;
    onChangeText: (text: string) => void;
    placeholder?: string;
};

const GOLD = "#B8860B"; // золотистый под стиль

const SearchInput = ({
    value,
    onChangeText,
    placeholder = "Search French dishes...",
}: SearchInputProps) => {
    const [isFocused, setIsFocused] = useState(false);

    return (
        <View
            style={[
                styles.wrapper,
                isFocused && styles.wrapperFocused,
            ]}
        >
            <Ionicons
                name="search"
                size={20}
                color={isFocused ? GOLD : "#999"}
            />

            <TextInput
                value={value}
                onChangeText={onChangeText}
                placeholder={placeholder}
                style={styles.input}
                returnKeyType="search"
                blurOnSubmit
                onFocus={() => setIsFocused(true)}
                onBlur={() => setIsFocused(false)}
                onSubmitEditing={() => Keyboard.dismiss()}
                placeholderTextColor="#999"
            />
        </View>
    );
};

export default SearchInput;


const styles = StyleSheet.create({
    wrapper: {
        flexDirection: "row",
        alignItems: "center",
        backgroundColor: "#F2F2F2",
        borderRadius: 20,
        paddingHorizontal: 16,
        marginTop: 54,
        paddingVertical: 14,
        borderWidth: 1,
        borderColor: "transparent"
    },

    wrapperFocused: {
        borderColor: "#B8860B",
        backgroundColor: "#FFF",
    },

    input: {
        flex: 1,
        marginLeft: 10,
        fontSize: 16,
        color: "#222",
    },
});

