import { useEffect, useMemo, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { Modal, Button, Badge, Table } from "react-bootstrap";
import { repositories } from "../../application/repositories";
import { apiClient } from "../../application/api/client";
import { clearCart } from "../../storage/stateSlices/cartSlice";


const ORDER_RESPONSE = {
  CREATED: 'created',
  NOT_PLACED: 'not_placed',
  PROCESSING: 'processing'
}

const Cart = ({ show, onHide }) => {

  const dispatch = useDispatch()

  const [orderResponse, setOrderResponse] = useState(ORDER_RESPONSE.NOT_PLACED);

  const cartStore = useSelector((store) => store.cart?.cart || {});
  const repository = repositories(apiClient,dispatch).orderRepository;

  const cartItems = useMemo(()=>{
    let items = Object.entries(cartStore).map(([_, item])=>item);
    console.log(items)
    return items
  }, [cartStore]);

  // const cartItems = useMemo(() => {
  //   const productMap = cartStore.reduce((acc, product) => {
  //     if (product?.product_id) {
  //       acc[product.product_id] = product;
  //     }
  //     return acc;
  //   }, {});

  //   console.log(cartQuantities)

  //   return Object.entries(cartQuantities)
  //     .filter(([, quantity]) => Number(quantity) > 0)
  //     .map(([product_id, quantity]) => {
  //       const product = productMap[product_id] || {};
  //       return {
  //         product_id,
  //         name: product.product_name || product.name || product_id,
  //         price: Number(product.selling_price ?? 0),
  //         quantity: Number(quantity),
  //         currency: product.currency || "USD",
  //       };
  //     });
  // }, [products, cartQuantities]);

  const subtotal = cartItems.reduce((sum, item) => sum + item.quantity * item.unit_price, 0);

  useEffect(()=>{
    if(orderResponse?.status === ORDER_RESPONSE.CREATED){
      dispatch(clearCart());
      setTimeout(()=>{
        alert(`ORDER Created with ORDER ID - ${orderResponse.order_id}`)
      }, 5000)
      setOrderResponse({status: ORDER_RESPONSE.NOT_PLACED});
    }
  },[orderResponse])

  const checkOutHandler = async (event) => {
    setOrderResponse({status: ORDER_RESPONSE.PROCESSING});
    let checkout_payload = {
      order_amount: subtotal,
      currency: 'USD',
      order_status: 'created',
      delivery_address: 'ABC',
      order_date: new Date().toISOString(),
      items: cartItems.map(item => ({
        product_id: item.product_id,
        quantity: item.quantity,
        unit_price: item.unit_price,
      })),
    }
    // console.log('checkout_payload: ', checkout_payload)
    const response = await repository.placeOrder(checkout_payload);
    setOrderResponse(response);
  }



  return (
    <Modal show={show} onHide={onHide} fullscreen scrollable centered>
      <Modal.Header closeButton>
        <Modal.Title>
          Cart <Badge bg="secondary">{cartItems.reduce((sum, item) => sum + item.unit_price, 0)}</Badge>
        </Modal.Title>
      </Modal.Header>
      <Modal.Body>
        {cartItems.length === 0 ? (
          <div className="text-center py-5">
            <h2>Your cart is empty</h2>
            <p>Add products from the home page to see them here.</p>
          </div>
        ) : (
          <Table responsive hover className="align-middle">
            <thead>
              <tr>
                <th>Product</th>
                <th className="text-end">Unit Price</th>
                <th className="text-end">Qty</th>
                <th className="text-end">Total</th>
              </tr>
            </thead>
            <tbody>
              {cartItems.map((item) => (
                <tr key={item.product_id}>
                  <td>{item.product_name}</td>
                  <td className="text-end">${item.unit_price.toFixed(2)}</td>
                  <td className="text-end">{item.quantity}</td>
                  <td className="text-end">${(item.quantity * item.unit_price).toFixed(2)}</td>
                </tr>
              ))}
            </tbody>
          </Table>
        )}
      </Modal.Body>
      <Modal.Footer className="d-flex justify-content-between">
        <div>
          <strong>Subtotal:</strong> ${subtotal.toFixed(2)}
        </div>
        <div>
          <Button variant="secondary" onClick={onHide} className="me-2">
            Close
          </Button>
          <Button variant="primary" disabled={cartItems.length === 0} onClick={checkOutHandler}>
            Checkout
          </Button>
        </div>
      </Modal.Footer>
    </Modal>
  );
};

export default Cart;
