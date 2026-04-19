
import { orderRepository, mockOrderRepository } from './orderRepository';
import { productRepository, mockProductRepository } from './productRepository';
import { authRepository, mockAuthRepository } from './authRepository';

export const repositories = (httpClient, dispatch) => {
    const env = (process.env.REACT_APP_ENVIRONMENT || process.env.ENVIRONMENT || "").trim();
    const useMock = ["MOCK", "mock", "Mock"].includes(env) || (process.env.NODE_ENV === 'development' && env === 'MOCK');
    // console.log("repositories env=", env, "useMock=", useMock);
    return {
        orderRepository: useMock ? mockOrderRepository(dispatch) : orderRepository(httpClient, dispatch),
        productRepository: useMock ? mockProductRepository(dispatch) : productRepository(httpClient, dispatch),
        authRepository: useMock ? mockAuthRepository(dispatch) : authRepository(httpClient, dispatch),
    };
};