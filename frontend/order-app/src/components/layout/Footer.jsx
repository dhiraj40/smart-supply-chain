import React from 'react'
import '../../theme/theme.css'

export default function Footer({ children }) {
  return <footer className="app-footer">{children || '© Your Company'}</footer>
}
