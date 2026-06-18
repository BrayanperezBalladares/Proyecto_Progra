import { useQuery } from '@tanstack/react-query'
import { dashboardStatsQueryOptions } from '../queries/dashboard.queries'

export function useDashboardStats() {
  return useQuery(dashboardStatsQueryOptions())
}
