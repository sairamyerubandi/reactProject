// Options used by the form dropdowns and the status filter.
// `value` is what the backend stores, `label` is what the user sees.
export const LEAD_SOURCES = [
  { value: 'website', label: 'Website' },
  { value: 'referral', label: 'Referral' },
  { value: 'social', label: 'Social Media' },
  { value: 'email', label: 'Email' },
  { value: 'event', label: 'Event' },
  { value: 'other', label: 'Other' },
]

export const LEAD_STATUSES = [
  { value: 'new', label: 'New' },
  { value: 'contacted', label: 'Contacted' },
  { value: 'qualified', label: 'Qualified' },
  { value: 'proposal', label: 'Proposal' },
  { value: 'won', label: 'Won' },
  { value: 'lost', label: 'Lost' },
]

// Turns a stored value into its label, e.g. getLabel(LEAD_SOURCES, 'social') gives "Social Media"
export function getLabel(options, value) {
  return options.find((option) => option.value === value)?.label ?? value
}
