import { QUOTE_STATUSES, CONTACT_STATUSES, APPLICATION_STATUSES } from '@/lib/constants'
import { Badge } from '@/components/ui/badge'

const statusStyles = {
  new: 'bg-black/10 text-black',
  read: 'bg-gray-100 text-gray-700',
  replied: 'bg-red-600/10 text-red-600',
  contacted: 'bg-gray-100 text-gray-700',
  quoted: 'bg-red-600/10 text-red-600',
  closed: 'bg-black/10 text-black',
  lost: 'bg-red-100 text-red-700',
  reviewed: 'bg-gray-100 text-gray-700',
  shortlisted: 'bg-red-600/10 text-red-600',
  interview: 'bg-gray-100 text-gray-700',
  rejected: 'bg-red-100 text-red-700',
  hired: 'bg-black/10 text-black',
}

const allStatuses = [...QUOTE_STATUSES, ...CONTACT_STATUSES, ...APPLICATION_STATUSES]

export default function StatusBadge({ status }) {
  const label = allStatuses.find((s) => s.value === status)?.label || status
  return (
    <Badge className={`capitalize ${statusStyles[status] || 'bg-gray-100 text-gray-700'}`}>
      {label}
    </Badge>
  )
}
