import { useCommerce } from '../../orchestration/state/usecase/commerceStore'

export function useCartController() {
  const { cart, checkout } = useCommerce()

  return {
    cart,
    checkout,
  }
}
