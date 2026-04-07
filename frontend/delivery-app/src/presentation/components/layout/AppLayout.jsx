import '../../../theme/theme.css'
import Topbar from './Topbar'
import Sidebar from './Sidebar'
import Footer from './Footer'

export default function AppLayout({ sidebar, topbarRight, children }) {
  return (
    <div className="app-root d-flex flex-column vh-100">
      <Topbar brand="Order App" right={topbarRight} />
      <div className="d-flex flex-grow-1" style={{ overflow: 'hidden' }}>
        <Sidebar>{sidebar}</Sidebar>
        <main className="flex-grow-1 p-3" style={{ overflow: 'auto' }}>
          {children}
        </main>
      </div>
      <Footer />
    </div>
  )
}
