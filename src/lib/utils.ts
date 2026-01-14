import { type ClassValue, clsx } from 'clsx'
import { twMerge } from 'tailwind-merge'

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs))
}

export function formatDate(date: Date | string): string {
  return new Intl.DateTimeFormat('en-US', {
    month: 'short',
    day: 'numeric',
    hour: '2-digit',
    minute: '2-digit',
  }).format(new Date(date))
}

export function getStatusColor(status: string): string {
  const statusMap: Record<string, string> = {
    idle: 'status-idle',
    starting: 'status-starting',
    monitoring: 'status-monitoring',
    carting: 'status-carting',
    checkout: 'status-checkout',
    success: 'status-success',
    error: 'status-error',
  }
  return statusMap[status] || 'status-idle'
}

export function maskCardNumber(cardNumber: string): string {
  if (cardNumber.length < 4) return cardNumber
  return `•••• •••• •••• ${cardNumber.slice(-4)}`
}

export function generateId(): string {
  return Math.random().toString(36).substring(2, 9).toUpperCase()
}
