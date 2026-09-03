import type { ConsultStatus } from '../types'

const FLOW: Record<ConsultStatus, ConsultStatus[]> = {
  pending: ['confirmed', 'cancelled'],
  confirmed: ['completed', 'cancelled'],
  completed: [],
  cancelled: [],
}

export const CONSULT_STATUSES: ConsultStatus[] = ['pending', 'confirmed', 'completed', 'cancelled']

export function nextStatuses(current: string): ConsultStatus[] {
  const key = (current || 'pending') as ConsultStatus
  return FLOW[key] || []
}

export function canTransition(from: string, to: string): boolean {
  return nextStatuses(from).includes(to as ConsultStatus)
}

export function statusTone(status: string): 'ok' | 'warn' | 'bad' | 'neutral' {
  if (status === 'completed' || status === 'confirmed') return 'ok'
  if (status === 'pending') return 'warn'
  if (status === 'cancelled') return 'bad'
  return 'neutral'
}

export function statusLabel(status: string): string {
  return status.charAt(0).toUpperCase() + status.slice(1)
}
