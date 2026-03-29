import { useAuth } from '../../orchestration/state/global/sessionProvider'

export function useAuthController() {
  return useAuth()
}
