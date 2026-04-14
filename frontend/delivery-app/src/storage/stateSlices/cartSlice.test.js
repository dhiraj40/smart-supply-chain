import cartReducer, {
  addToCart,
  clearCart,
  removeFromCart,
  updateQuantity,
} from './cartSlice'

describe('cartSlice', () => {
  test('adds an item on the first click and increments numerically', () => {
    let state = cartReducer(undefined, addToCart('sku-1'))

    expect(state.cart['sku-1']).toBe(1)

    state = cartReducer(state, addToCart('sku-1'))

    expect(state.cart['sku-1']).toBe(2)
  })

  test('keeps cart quantities as numbers for update, remove, and clear actions', () => {
    let state = { cart: { 'sku-1': 2, 'sku-2': 1 } }

    state = cartReducer(state, updateQuantity({ product_id: 'sku-1', quantity: 5 }))
    expect(state.cart['sku-1']).toBe(5)

    state = cartReducer(state, removeFromCart('sku-2'))
    expect(state.cart['sku-2']).toBeUndefined()

    state = cartReducer(state, updateQuantity({ product_id: 'sku-1', quantity: 0 }))
    expect(state.cart['sku-1']).toBeUndefined()

    state = cartReducer(state, clearCart())
    expect(state.cart).toEqual({})
  })
})
