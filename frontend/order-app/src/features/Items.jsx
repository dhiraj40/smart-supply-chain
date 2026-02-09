import React from 'react'
import ItemCard from './ItemCard'
import HorizontalList from '../components/ui/HorizontalList'

export default function Items({ items = [], onSelectItem }) {
  if (!items || items.length === 0) return <p>No items available.</p>

  return (
    // <div className="d-flex flex-wrap">
    //   {items.map((item) => (
    //     <ItemCard key={item.item_id || item.name} item={item} onSelectItem={onSelectItem} />
    //   ))}
    // </div>
    <div>
        <HorizontalList 
            items={items} 
            renderItem={(item) => <ItemCard key={item.item_id || item.name} item={item} onSelectItem={onSelectItem} />} 
            className='w-auto'
        />
    </div>
  )
}
