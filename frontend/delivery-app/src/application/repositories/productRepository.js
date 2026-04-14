import {
    setProducts,
    setSelectedProductDetails,
    setSelectedProductImages,
    setSelectedProductRatings,
} from "../../storage/stateSlices/productSlice";

export const productRepository = (httpClient, dispatch) => {
    const PRODUCT_ROUTE = '/api/v1/products';
    const listProducts = async (page, pageSize) => {
        const response = await httpClient(`${PRODUCT_ROUTE}/page=${page}&page_size=${pageSize}`, {
            method: 'GET'
        });
        dispatch(setProducts(response));
        return response;
    };

    const getProductBySlug = async (slug) => {
        const response = await httpClient(`${PRODUCT_ROUTE}/${slug}`, {
            method: 'GET'
        });
        dispatch(setSelectedProductDetails(Array.isArray(response) ? response[0] || null : response));
        return response;
    };

    const getProductImages = async (productId) => {
        const response = await httpClient(`${PRODUCT_ROUTE}/${productId}/images`, {
            method: 'GET'
        });
        dispatch(setSelectedProductImages(response));
        return response;
    };

    const getProductRatings = async (productId) => {
        const response = await httpClient(`${PRODUCT_ROUTE}/${productId}/reviews`, {
            method: 'GET'
        });
        dispatch(setSelectedProductRatings(response));
        return response;
    };

    return {
        listProducts,
        getProductBySlug,
        getProductImages,
        getProductRatings
    };
};
