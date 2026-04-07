import { useEffect } from 'react'
import { useCommerce } from '../../orchestration/state/usecase/commerceStore'

export function useDashboardController() {
  const { dashboard, cart, checkout } = useCommerce()

  useEffect(() => {
    if (!dashboard.hasLoaded && !dashboard.isLoading) {
      dashboard.loadDashboard()
    }
  }, [dashboard.hasLoaded, dashboard.isLoading, dashboard.loadDashboard])

  return {
    dashboard,
    cart,
    checkout,
  }
}
