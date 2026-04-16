import {
    setProducts,
    setSelectedProductDetails,
    setSelectedProductImages,
    setSelectedProductRatings,
} from "../../storage/stateSlices/productSlice";

const mockProducts = [
    {
        product_id: "SKU-101",
        slug: "forklift-battery",
        name: "Forklift Battery",
        description: "Heavy-duty battery for industrial forklifts.",
        price: 89.95,
        inventory: 12,
    },
    {
        product_id: "SKU-202",
        slug: "shipping-crate",
        name: "Shipping Crate",
        description: "Durable wooden crate for secure transport.",
        price: 24.0,
        inventory: 40,
    },
    {
        product_id: "SKU-310",
        slug: "safety-helmet",
        name: "Safety Helmet",
        description: "Protective helmet for warehouse workers.",
        price: 15.0,
        inventory: 100,
    },
];

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

export const mockProductRepository = (dispatch) => {
    const listProducts = async (page, pageSize) => {
        const startIndex = Math.max(0, page - 1) * pageSize;
        const results = mockProducts.slice(startIndex, startIndex + pageSize);
        dispatch(setProducts(results));
        return results;
    };

    const getProductBySlug = async (slug) => {
        const product = mockProducts.find((item) => item.slug === slug) || null;
        dispatch(setSelectedProductDetails(product));
        return product;
    };

    const getProductImages = async () => {
        const images = [
            "https://via.placeholder.com/600x400?text=Product+Image+1",
            "https://via.placeholder.com/600x400?text=Product+Image+2",
        ];
        dispatch(setSelectedProductImages(images));
        return images;
    };

    const getProductRatings = async () => {
        const ratings = [
            { reviewer: "Alex", score: 5, comment: "High quality and reliable." },
            { reviewer: "Sara", score: 4, comment: "Good value for warehouse equipment." },
        ];
        dispatch(setSelectedProductRatings(ratings));
        return ratings;
    };

    return {
        listProducts,
        getProductBySlug,
        getProductImages,
        getProductRatings
    };
};
