import { setProducts, setSelectedProductImages, setSelectedProductRatings } from "../../storage/stateSlices/productSlice";

export const productRepository = async (httpClient, dispatch) => {
    const PRODUCT_ROUTE = '/api/v1/products';
    const listProducts = async () => {
        const response = await httpClient(`${PRODUCT_ROUTE}/`, {
            method: 'GET'
        });
        dispatch(setProducts(response.data));
        // return response.data;
    };

    const getProductBySlug = async (slug) => {
        const response = await httpClient(`${PRODUCT_ROUTE}/${slug}`, {
            method: 'GET'
        });
        dispatch(setProducts(response.data));
        // return response.data;
    };

    const getProductImages = async (productId) => {
        const response = await httpClient(`${PRODUCT_ROUTE}/${productId}/images`, {
            method: 'GET'
        });
        dispatch(setSelectedProductImages(response.data));
        // return response.data;
    };

    const getProductRatings = async (productId) => {
        const response = await httpClient(`${PRODUCT_ROUTE}/${productId}/ratings`, {
            method: 'GET'
        });
        dispatch(setSelectedProductRatings(response.data));
        // return response.data;
    };
    return {
        listProducts,
        getProductBySlug,
        getProductImages,
        getProductRatings
    }
};