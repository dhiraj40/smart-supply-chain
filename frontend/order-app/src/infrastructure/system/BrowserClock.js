export function createBrowserClock() {
  return {
    nowIso() {
      return new Date().toISOString()
    },
  }
}
