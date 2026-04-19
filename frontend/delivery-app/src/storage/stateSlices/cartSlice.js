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
        if(state.cart[item.product_id]===undefined){
            state.cart[item.product_id] = item
            state.cart[item.product_id]['quantity'] = 0
        }

        state.cart[item.product_id].quantity += 1;
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
