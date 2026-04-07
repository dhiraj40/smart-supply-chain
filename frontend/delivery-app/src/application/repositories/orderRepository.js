import { setOrderHistory, setSelectedOrder, setSelectedOrderedItems } from "../../storage/stateSlices/orderSlice";

// get user orders
export const orderRepository = (httpClient, dispatch) => {

    const ORDERS_ROUTE = '/orders';

    const placeOrder = async (order) => {
        const response = await httpClient(`${ORDERS_ROUTE}/create_order`, {
            method: 'POST',
            data: order
        });
        return response.data;
    }

    const getOrderHistory = async () => {
        const response = await httpClient(`${ORDERS_ROUTE}/`, {
            method: 'GET',
        });
        dispatch(setOrderHistory(response.data));
    }

    const getSelectedOrderItems = async (selectedOrder) => {
        dispatch(setSelectedOrder(selectedOrder));
        const response = await httpClient(`${ORDERS_ROUTE}/${selectedOrder.order_id}`, {
            method: 'GET',
        });

        dispatch(setSelectedOrderedItems(response.data));
    }

    return {
        placeOrder,
        getOrderHistory,
        getSelectedOrderItems
    };
    
};