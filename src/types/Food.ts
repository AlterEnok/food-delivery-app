import { ImageSourcePropType } from "react-native";

export type Food = {
    id: string;
    title: string;
    price: string;
    category: string;

    cardImage: ImageSourcePropType;
    detailsImage: ImageSourcePropType;
};
