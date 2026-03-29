function normalizeQuantity(quantity) {
  return Math.max(0, Number(quantity) || 0)
}

function getItemId(item) {
  return item?.id
}

export function addItemToCart(cartItems, item) {
  const existingItem = cartItems.find((entry) => getItemId(entry.item) === getItemId(item))

  if (!existingItem) {
    return [...cartItems, { item, quantity: 1 }]
  }

  return cartItems.map((entry) =>
    getItemId(entry.item) === getItemId(item)
      ? { ...entry, quantity: normalizeQuantity(entry.quantity) + 1 }
      : entry
  )
}

export function decreaseCartItem(cartItems, itemId) {
  return cartItems.reduce((nextCart, entry) => {
    if (getItemId(entry.item) !== itemId) {
      nextCart.push(entry)
      return nextCart
    }

    const nextQuantity = normalizeQuantity(entry.quantity) - 1

    if (nextQuantity > 0) {
      nextCart.push({ ...entry, quantity: nextQuantity })
    }

    return nextCart
  }, [])
}

export function removeCartItem(cartItems, itemId) {
  return cartItems.filter((entry) => getItemId(entry.item) !== itemId)
}

export function clearCart() {
  return []
}

export function getLineTotal(cartItem) {
  return Number(cartItem.item.unitPrice) * normalizeQuantity(cartItem.quantity)
}

export function getCartSummary(cartItems) {
  return cartItems.reduce(
    (summary, cartItem) => {
      const quantity = normalizeQuantity(cartItem.quantity)
      const itemId = getItemId(cartItem.item)

      summary.totalQuantity += quantity
      summary.subtotal += getLineTotal(cartItem)
      summary.quantityByItemId[itemId] = quantity

      return summary
    },
    {
      totalQuantity: 0,
      subtotal: 0,
      quantityByItemId: {},
    }
  )
}
