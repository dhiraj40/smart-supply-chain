import ItemList from '../components/catalog/ItemList'
import HeroCarouselWidget from '../components/catalog/HeroCarouselWidget'
import ProductDetailModal from '../components/catalog/ProductDetailModal'
import StatusBanner from '../components/StatusBanner'
import { useDashboardController } from '../usecases/useDashboardController'

export default function DashboardPage() {
  const { dashboard, cart } = useDashboardController()
  const activeProduct = dashboard.productDetail.detail || dashboard.productDetail.item
  const activeProductQuantity = activeProduct
    ? cart.summary.quantityByItemId[activeProduct.id] || 0
    : 0

  if (dashboard.isLoading) {
    return <h2>Loading dashboard...</h2>
  }

  return (
    <div style={styles.container}>
      <h2 className="mb-3">Dashboard</h2>
      <StatusBanner variant="danger">{dashboard.error}</StatusBanner>

      {!dashboard.error && !dashboard.layout.length && (
        <StatusBanner variant="secondary">
          No dashboard widgets are available at the moment.
        </StatusBanner>
      )}

      {!dashboard.error &&
        dashboard.layout.map((widget) => {
          if (widget.type === 'HeroCarousel') {
            return (
              <section key={widget.widgetId} className="dashboard-widget dashboard-widget--hero">
                <HeroCarouselWidget images={widget.data?.images || []} />
              </section>
            )
          }

          if (widget.type === 'ProductScroller') {
            return (
              <section key={widget.widgetId} className="dashboard-widget">
                <h3 className="dashboard-widget__title">{widget.title}</h3>
                <ItemList
                  items={widget.data?.items || []}
                  quantities={cart.summary.quantityByItemId}
                  onAdd={cart.addItem}
                  onOpen={dashboard.openProductDetail}
                />
              </section>
            )
          }

          return null
        })}

      <ProductDetailModal
        state={dashboard.productDetail}
        quantity={activeProductQuantity}
        onClose={dashboard.closeProductDetail}
        onAdd={cart.addItem}
      />
    </div>
  )
}

const styles = {
  container: {
    maxWidth: '100%',
    margin: '10px auto',
  },
}
