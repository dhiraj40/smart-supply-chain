import { render, screen } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import { Provider } from 'react-redux'
import { configureStore } from '@reduxjs/toolkit'
import HomePage from './HomePage'
import cartReducer from '../../storage/stateSlices/cartSlice'
import productReducer from '../../storage/stateSlices/productSlice'

const mockListProducts = jest.fn()

jest.mock('../../application/repositories', () => ({
  repositories: () => ({
    productRepository: {
      listProducts: mockListProducts,
    },
  }),
}))

jest.mock('../../application/api/client', () => ({
  apiClient: {},
}))

const testProduct = {
  product_id: 'sku-1',
  product_name: 'Forklift',
  selling_price: 499.99,
  mrp: 599.99,
  thumbnail_url: '',
}

function renderHomePage() {
  const store = configureStore({
    reducer: {
      cart: cartReducer,
      products: productReducer,
    },
    preloadedState: {
      cart: {
        cart: {},
      },
      products: {
        products: [testProduct],
        totalProductsCount: 1,
        selectedProduct: {
          details: null,
          images: [],
          ratings: [],
        },
      },
    },
  })

  return {
    store,
    ...render(
      <Provider store={store}>
        <HomePage user={{ first_name: 'Jane', last_name: 'Doe' }} />
      </Provider>,
    ),
  }
}

describe('HomePage cart interactions', () => {
  beforeEach(() => {
    mockListProducts.mockClear()
  })

  test('updates the grid item quantity on the first add click', async () => {
    const { store } = renderHomePage()

    expect(mockListProducts).toHaveBeenCalledWith(1, 25)
    expect(screen.getByRole('button', { name: /\+ add to order/i })).toBeInTheDocument()

    await userEvent.click(screen.getByRole('button', { name: /\+ add to order/i }))

    expect(store.getState().cart.cart[testProduct.product_id]).toBe(1)
    expect(screen.getByRole('button', { name: /add to order \(1\)/i })).toBeInTheDocument()
  })
})
