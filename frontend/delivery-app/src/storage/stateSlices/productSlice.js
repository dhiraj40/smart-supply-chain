import { createSlice } from "@reduxjs/toolkit";

const initialState = {
    products: [],
    totalProductsCount: 0,
    selectedProduct: {
        details: null,
        images: [],
        ratings: []
    }
};

const productSlice = createSlice({
    name: "products",
    initialState,
    reducers: {
        setProducts: (state, action) => {
            if (Array.isArray(action.payload)) {
                state.products = action.payload;
                state.totalProductsCount = action.payload.length;
                return;
            }

            state.products = action.payload?.products || [];
            state.totalProductsCount = action.payload?.totalCount || 0;
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
