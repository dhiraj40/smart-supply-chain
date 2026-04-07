const OrderCreateRequestSchema = {
  "order_amount": 0,
  "currency": "INR",
  "order_status": "created",
  "delivery_address": "string",
  "order_date": "2026-04-07T16:56:11.131Z",
  "items": [
    {
      "product_id": "string",
      "quantity": 1,
      "unit_price": 0
    }
  ]
}

const LoginRequestSchema = {
  "username": "string",
  "password": "string"
}
