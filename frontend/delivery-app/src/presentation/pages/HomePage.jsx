import { useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import { repositories } from "../../application/repositories";
import { apiClient } from "../../application/api/client";
import GridList from "../components/common/GridList";
import { addToCart } from "../../storage/stateSlices/cartSlice";

const HomePage = ({ user }) => {
    const dispatch = useDispatch();
    const productStore = useSelector((store) => store.products || { products: [] });
    const cartItems = useSelector((store) => store.cart?.cart || {});
    const products = Array.isArray(productStore.products) ? productStore.products : [];

    useEffect(() => {
        repositories(apiClient, dispatch).productRepository.listProducts(1, 100);
    }, [dispatch]);

    const onAddItem = (item) => {
        console.log("onAddItem: ", item)
        dispatch(addToCart({
            product_name: item.product_name,
            product_id: item.product_id,
            unit_price: Number(item.selling_price)
        }));
    };

    return (
        <div className="mt-5">
            <div className="container">
                <h1>Home Page</h1>
                <p>Welcome, {user?.first_name} {user?.last_name}!</p>
            </div>
            <GridList 
                items={products} 
                cartItems={cartItems} 
                onAdd={onAddItem}
            />
        </div>
    );
};

export default HomePage;
