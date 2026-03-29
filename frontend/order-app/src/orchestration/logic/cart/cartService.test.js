import {
  addItemToCart,
  decreaseCartItem,
  getCartSummary,
  removeCartItem,
} from './cartService'
import { createOrderDraft } from '../checkout/orderFactory'
import { createItem } from '../../contracts/itemModel'

const scanner = createItem({
  id: 1,
  name: 'Wireless Barcode Scanner',
  unitPrice: 89.99,
})

describe('cartService', () => {
  test('adds duplicate items by increasing quantity', () => {
    const initialCart = addItemToCart([], scanner)
    const nextCart = addItemToCart(initialCart, scanner)

    expect(nextCart).toHaveLength(1)
    expect(nextCart[0].quantity).toBe(2)
  })

  test('decreases quantity and removes the line at zero', () => {
    const initialCart = [{ item: scanner, quantity: 2 }]

    const oneLeft = decreaseCartItem(initialCart, scanner.id)
    const emptyCart = decreaseCartItem(oneLeft, scanner.id)

    expect(oneLeft[0].quantity).toBe(1)
    expect(emptyCart).toEqual([])
  })

  test('computes cart summary and order draft totals', () => {
    const chair = createItem({
      id: 2,
      name: 'Warehouse Chair',
      unitPrice: 10,
    })

    const cartItems = [
      { item: scanner, quantity: 2 },
      { item: chair, quantity: 3 },
    ]

    const summary = getCartSummary(cartItems)
    const orderDraft = createOrderDraft({
      cartItems,
      createdAt: '2026-03-29T00:00:00.000Z',
    })

    expect(summary.totalQuantity).toBe(5)
    expect(summary.subtotal).toBeCloseTo(209.98)
    expect(orderDraft.totalAmount).toBeCloseTo(209.98)
    expect(orderDraft.items).toHaveLength(2)
  })

  test('removes a cart line by item id', () => {
    const cartItems = [
      { item: scanner, quantity: 1 },
      { item: createItem({ id: 2, name: 'Printer', unitPrice: 15 }), quantity: 1 },
    ]

    expect(removeCartItem(cartItems, scanner.id)).toHaveLength(1)
  })
})
