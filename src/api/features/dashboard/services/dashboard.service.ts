import { mockDelay, mockStore } from '@api/mock'

export async function getDashboardStats() {
  await mockDelay(200)
  return mockStore.getDashboardStats()
}
