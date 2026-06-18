import { queryOptions } from '@tanstack/react-query'
import { getDashboardStats } from '../services/dashboard.service'

export const dashboardKeys = {
  stats: ['dashboard', 'stats'] as const,
}

export function dashboardStatsQueryOptions() {
  return queryOptions({
    queryKey: dashboardKeys.stats,
    queryFn: getDashboardStats,
    refetchInterval: 30_000,
  })
}
