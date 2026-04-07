
import { orderRepository } from './orderRepository';
import { productRepository } from './productRepository';
import { authRepository } from './authRepository';

export const repositories = (httpClient, dispatch) => {
    return {
        orderRepository: orderRepository(httpClient, dispatch),
        productRepository: productRepository(httpClient, dispatch),
        authRepository: authRepository(httpClient, dispatch)
    };
};