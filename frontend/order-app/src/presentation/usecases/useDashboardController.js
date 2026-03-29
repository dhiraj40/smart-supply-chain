import { useEffect } from 'react'
import { useCommerce } from '../../orchestration/state/usecase/commerceStore'

export function useDashboardController() {
  const { dashboard, cart } = useCommerce()

  useEffect(() => {
    if (!dashboard.hasLoaded && !dashboard.isLoading) {
      dashboard.loadDashboard()
    }
  }, [dashboard])

  return {
    dashboard,
    cart,
  }
}
