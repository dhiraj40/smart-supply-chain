import { useMemo } from 'react'
import { createAppContainer } from '../bootstrap/container'
import { ServiceContainerProvider } from '../../orchestration/state/global/appProvider'
import { AuthProvider } from '../../orchestration/state/global/sessionProvider'
import { CommerceProvider } from '../../orchestration/state/usecase/commerceStore'

export default function AppProviders({ children }) {
  const container = useMemo(() => createAppContainer(), [])

  return (
    <ServiceContainerProvider container={container}>
      <AuthProvider>
        <CommerceProvider>{children}</CommerceProvider>
      </AuthProvider>
    </ServiceContainerProvider>
  )
}
