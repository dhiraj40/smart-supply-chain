export function createItem({
  id,
  name,
  description = '',
  unitPrice = 0,
  imageUrl = '',
  slug = '',
  brand = '',
  badges = [],
  currency = 'USD',
  mrp = null,
  ratingAverage = null,
  ratingCount = 0,
}) {
  if (id == null || id === '') {
    throw new Error('Item id is required.')
  }

  if (!name) {
    throw new Error('Item name is required.')
  }

  if (Number(unitPrice) < 0) {
    throw new Error('Item unit price must be zero or greater.')
  }

  return {
    id,
    name,
    description,
    unitPrice: Number(unitPrice),
    imageUrl,
    slug,
    brand,
    badges,
    currency,
    mrp,
    ratingAverage,
    ratingCount,
  }
}
