// Turns "2026-10-25T09:30:00.000Z" into "25 Oct 2026"
export function formatDate(dateText) {
  if (!dateText) return '-'
  return new Date(dateText).toLocaleDateString('en-GB', {
    day: '2-digit',
    month: 'short',
    year: 'numeric',
  })
}

// Turns "2026-10-25T09:30:00.000Z" into "25 Oct 2026, 15:00" (in the user's time zone)
export function formatDateTime(dateText) {
  if (!dateText) return '-'
  return new Date(dateText).toLocaleString('en-GB', {
    day: '2-digit',
    month: 'short',
    year: 'numeric',
    hour: '2-digit',
    minute: '2-digit',
  })
}
