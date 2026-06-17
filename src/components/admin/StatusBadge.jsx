import { QUOTE_STATUSES, CONTACT_STATUSES, APPLICATION_STATUSES } from '@/lib/constants'
import { Badge } from '@/components/ui/badge'

const statusStyles = {
  new: 'admin-new',
  read: 'admin-draft',
  replied: 'admin-contacted',
  contacted: 'admin-contacted',
  quoted: 'admin-quoted',
  closed: 'admin-closed',
  lost: 'admin-lost',
  reviewed: 'admin-draft',
  shortlisted: 'admin-quoted',
  interview: 'admin-contacted',
  rejected: 'admin-lost',
  hired: 'admin-active',
}

const allStatuses = [...QUOTE_STATUSES, ...CONTACT_STATUSES, ...APPLICATION_STATUSES]

export default function StatusBadge({ status }) {
  const label = allStatuses.find((s) => s.value === status)?.label || status
  const variant = statusStyles[status] || 'admin-draft'
  return (
    <Badge variant={variant} className="capitalize">
      {label}
    </Badge>
  )
}
