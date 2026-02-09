import React from 'react'

export default function Heading({ level = 1, children, className = '' }) {
  const Tag = `h${Math.min(Math.max(level, 1), 6)}`
  return <Tag className={className}>{children}</Tag>
}
