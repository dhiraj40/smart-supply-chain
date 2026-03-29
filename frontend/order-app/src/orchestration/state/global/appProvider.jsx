import { createContext, useContext } from 'react'

const ServiceContainerContext = createContext(null)

export function ServiceContainerProvider({ container, children }) {
  return (
    <ServiceContainerContext.Provider value={container}>
      {children}
    </ServiceContainerContext.Provider>
  )
}

export function useServiceContainer() {
  const container = useContext(ServiceContainerContext)

  if (!container) {
    throw new Error('Service container is not available.')
  }

  return container
}
