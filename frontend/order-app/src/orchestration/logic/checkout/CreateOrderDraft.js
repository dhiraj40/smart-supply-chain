import { createOrderDraft } from './orderFactory'

export function createCreateOrderDraft({ clock }) {
  return function execute(cartItems) {
    return createOrderDraft({
      cartItems,
      createdAt: clock.nowIso(),
    })
  }
}
