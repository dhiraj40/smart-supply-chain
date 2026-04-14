import { createSlice } from "@reduxjs/toolkit";

const initialState = {
  cart: {},
};

const cartSlice = createSlice({
  name: "cart",
  initialState,
    reducers: {
    addToCart: (state, action) => {
        const product_id = action.payload;
        if(state.cart[product_id]===undefined){
            state.cart[product_id] = 0;
        }

        state.cart[product_id] += 1;
    },
    removeFromCart: (state, action) => {
        const product_id = action.payload;
        delete state.cart[product_id];
    },
    updateQuantity: (state, action) => {
        const { product_id, quantity } = action.payload;
        const nextQuantity = Number(quantity) || 0;

        if (nextQuantity <= 0) {
            delete state.cart[product_id];
            return;
        }

        state.cart[product_id] = nextQuantity;
    },
    clearCart: (state) => {
        state.cart = {};
    },
},});

export const { addToCart, removeFromCart, updateQuantity, clearCart } = cartSlice.actions;
export default cartSlice.reducer;
