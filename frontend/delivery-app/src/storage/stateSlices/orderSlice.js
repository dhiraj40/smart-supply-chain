import { createSlice } from "@reduxjs/toolkit";

const initialState = {
  orderHistory: [],
  selectedOrder: null,
  selectedOrderedItems: [],
};

const orderSlice = createSlice({
  name: "order",
  initialState,
  reducers: {
    setOrderHistory: (state, action) => {
      state.orderHistory = action.payload;
    },
    setSelectedOrderedItems: (state, action) => {
        state.selectedOrderedItems = action.payload;
    },
    setSelectedOrder: (state, action) => {
        state.selectedOrder = action.payload;
    },
    
},});

export const { 
    setOrderHistory, 
    setSelectedOrderedItems,
    setSelectedOrder
} = orderSlice.actions;
export default orderSlice.reducer;