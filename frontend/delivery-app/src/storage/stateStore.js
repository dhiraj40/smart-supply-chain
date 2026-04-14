import { configureStore } from "@reduxjs/toolkit";
import authReducer from "./stateSlices/authSlice";
import cartReducer from "./stateSlices/cartSlice";
import orderReducer from "./stateSlices/orderSlice";
import productReducer from "./stateSlices/productSlice";

const store = configureStore({
    reducer: {
        auth: authReducer,
        cart: cartReducer,
        order: orderReducer,
        products: productReducer,
    },
});

export default store;
