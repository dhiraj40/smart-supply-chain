import React from 'react'
import '../../theme/theme.css'

export default function ScrollGrid({ children, items, renderItem, className = '' }) {
  return (
    <div className={`scroll-grid ${className}`}>
      {children || (items || []).map((it, idx) => (
        <div key={it.id || idx}>{renderItem ? renderItem(it) : String(it)}</div>
      ))}
    </div>
  )
}
