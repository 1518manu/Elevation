import { QUOTE_STATUSES, CONTACT_STATUSES, APPLICATION_STATUSES } from '@/lib/constants'
import { Badge } from '@/components/ui/badge'

const statusStyles = {
  new: 'bg-blue-100 text-blue-700',
  read: 'bg-amber-100 text-amber-700',
  replied: 'bg-green-100 text-green-700',
  contacted: 'bg-amber-100 text-amber-700',
  quoted: 'bg-purple-100 text-purple-700',
  closed: 'bg-green-100 text-green-700',
  lost: 'bg-red-100 text-red-700',
  reviewed: 'bg-blue-100 text-blue-700',
  shortlisted: 'bg-purple-100 text-purple-700',
  interview: 'bg-amber-100 text-amber-700',
  rejected: 'bg-red-100 text-red-700',
  hired: 'bg-green-100 text-green-700',
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
