import { configureStore } from "@reduxjs/toolkit";
import authReducer from "./stateSlices/authSlice";
import cartReducer from "./stateSlices/cartSlice";
import orderReducer from "./stateSlices/orderSlice";

const store = configureStore({
    reducer: {
        auth: authReducer,
        cart: cartReducer,
        order: orderReducer,
    },
});

export default store;