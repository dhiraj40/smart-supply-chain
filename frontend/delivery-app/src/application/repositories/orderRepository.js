import { setOrderHistory, setSelectedOrder, setSelectedOrderedItems } from "../../storage/stateSlices/orderSlice";

const mockOrderHistory = [
    {
        order_id: "ORD-1001",
        date: "2026-04-12",
        status: "Delivered",
        total: 184.95,
        items: [
            { sku: "SKU-101", name: "Forklift Battery", quantity: 1, price: 89.95 },
            { sku: "SKU-202", name: "Shipping Crate", quantity: 2, price: 24.0 },
            { sku: "SKU-310", name: "Safety Helmet", quantity: 3, price: 15.0 },
        ],
    },
    {
        order_id: "ORD-1002",
        date: "2026-04-14",
        status: "In Transit",
        total: 99.5,
        items: [
            { sku: "SKU-155", name: "Pallet Jack", quantity: 1, price: 59.5 },
            { sku: "SKU-220", name: "Protective Gloves", quantity: 4, price: 10.0 },
        ],
    },
];

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

export const mockOrderRepository = (dispatch) => {
    const placeOrder = async (order) => {
        const createdOrder = {
            ...order,
            order_id: `ORD-${Math.floor(1000 + Math.random() * 9000)}`,
            date: new Date().toISOString().slice(0, 10),
            status: "Processing",
        };
        return createdOrder;
    };

    const getOrderHistory = async () => {
        dispatch(setOrderHistory(mockOrderHistory));
        return mockOrderHistory;
    };

    const getSelectedOrderItems = async (selectedOrder) => {
        const order = mockOrderHistory.find(
            (item) => item.order_id === selectedOrder?.order_id || item.order_id === selectedOrder?.orderId
        );
        dispatch(setSelectedOrder(order || selectedOrder));
        dispatch(setSelectedOrderedItems(order?.items || []));
        return order?.items || [];
    };

    return {
        placeOrder,
        getOrderHistory,
        getSelectedOrderItems
    };
};