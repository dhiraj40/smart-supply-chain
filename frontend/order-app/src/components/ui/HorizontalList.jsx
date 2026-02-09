import React from 'react'
import '../../theme/theme.css'

export default function HorizontalList({ children, items, renderItem, className = '' }) {
  return (
    <div className={`horizontal-list ${className}`}>
      {children || (items || []).map((it, idx) => (
        <div key={it.id || idx}>{renderItem ? renderItem(it) : String(it)}</div>
      ))}
    </div>
  )
}
