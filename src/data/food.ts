import { Food } from "../types/Food";

export const food: Food[] = [
    {
        id: "1",
        title: "Boeuf Bourguignon",
        price: "18,50€",
        category: "Main",
        cardImage: require("../../assets/boeuf-bourguignon.jpeg"),
        detailsImage: require("../../assets/details-1.png"),
    },
    {
        id: "2",
        title: "Coq au Vin",
        price: "17,00€",
        category: "Main",
        cardImage: require("../../assets/coq-au-vin.jpg"),
        detailsImage: require("../../assets/details-3.png"),
    },
    {
        id: "3",
        title: "Ratatouille",
        price: "14,50€",
        category: "Veg",
        cardImage: require("../../assets/ratatouille.jpg"),
        detailsImage: require("../../assets/details-2.png"),
    },
    {
        id: "4",
        title: "Croque Monsieur",
        price: "11,00€",
        category: "Snack",
        cardImage: require("../../assets/croque-monsieur.png"),
        detailsImage: require("../../assets/details-4.png"),
    },
];
