import { createSlice } from "@reduxjs/toolkit";

const initialState = {
    products: [],
    selectedProduct: {
        details: null,
        images: [],
        ratings: []
    }
};

const productSlice = createSlice({
    name: "product",
    initialState,
    reducers: {
        setProducts: (state, action) => {
            state.products = action.payload;
        },
        setSelectedProductDetails: (state, action) => {
            state.selectedProduct.details = action.payload;
        },
        setSelectedProductImages: (state, action) => {
            state.selectedProduct.images = action.payload;
        },
        setSelectedProductRatings: (state, action) => {
            state.selectedProduct.ratings = action.payload;
        },
        clearSelectedProduct: (state) => {
            state.selectedProduct = {
                details: null,
                images: [],
                ratings: []
            };
        }
    },
});

export const { 
    setProducts, 
    setSelectedProductDetails,
    setSelectedProductImages,
    setSelectedProductRatings,
    clearSelectedProduct
} = productSlice.actions;
export default productSlice.reducer;