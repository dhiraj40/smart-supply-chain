import HorizontalList from '../common/HorizontalList'
import ItemCard from './ItemCard'

export default function ItemList({
  items,
  quantities,
  onAdd,
  onOpen,
  disabled = false,
}) {
  if (!items.length) {
    return <p>No items available.</p>
  }

  return (
    <HorizontalList
      items={items}
      renderItem={(item) => (
        <ItemCard
          key={item.id}
          item={item}
          quantity={quantities[item.id] || 0}
          onAdd={onAdd}
          onOpen={onOpen}
          disabled={disabled}
        />
      )}
    />
  )
}
