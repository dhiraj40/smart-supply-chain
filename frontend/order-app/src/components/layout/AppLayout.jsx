import React from 'react'
import '../../theme/theme.css'
import Topbar from './Topbar'
import Sidebar from './Sidebar'
import Footer from './Footer'

export default function AppLayout({ sidebar, topbarProps, children, footer }) {
  return (
    <div className="app-root d-flex flex-column vh-100">
      <Topbar {...topbarProps} />
      <div className="d-flex flex-grow-1" style={{ overflow: 'hidden' }}>
        {sidebar && <Sidebar>{sidebar}</Sidebar>}
        <main className="flex-grow-1 p-3" style={{ overflow: 'auto' }}>
          {children}
        </main>
      </div>
      <Footer>{footer}</Footer>
    </div>
  )
}
