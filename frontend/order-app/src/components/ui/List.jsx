import React from 'react'

export default function List({ items = [], renderItem, className = '' }) {
  return (
    <ul className={className}>
      {items.map((it, idx) => (
        <li key={it.id || idx}>{renderItem ? renderItem(it) : String(it)}</li>
      ))}
    </ul>
  )
}
