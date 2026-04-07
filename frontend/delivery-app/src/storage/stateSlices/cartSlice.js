import { createSlice } from "@reduxjs/toolkit";

const initialState = {
  cart: {},
};

const cartSlice = createSlice({
  name: "cart",
  initialState,
    reducers: {
    addToCart: (state, action) => {
        const item = action.payload;
        if (state.currentOrderItems[item.productId]) {
            state.currentOrderItems[item.productId].quantity += item.quantity;
        } else {
            state.currentOrderItems[item.productId] = item;
        }
    },
    removeFromCart: (state, action) => {
        const productId = action.payload;
        delete state.currentOrderItems[productId];
    },
    updateQuantity: (state, action) => {
        const { productId, quantity } = action.payload;
        if (state.currentOrderItems[productId]) {
            state.currentOrderItems[productId].quantity = quantity;
        }
    },
    clearCart: (state) => {
        state.currentOrderItems = {};
    },
},});

export const { addToCart, removeFromCart, updateQuantity, clearCart } = cartSlice.actions;
export default cartSlice.reducer;