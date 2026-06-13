import { Link } from 'react-router-dom'
import { MapPin, Clock } from 'lucide-react'
import { Badge } from '@/components/ui/badge'
import { Button } from '@/components/ui/button'
import { formatDate } from '@/lib/utils'
import { JOB_DEPARTMENTS, JOB_TYPES } from '@/lib/constants'

export default function JobCard({ job }) {
  const dept = JOB_DEPARTMENTS.find((d) => d.value === job.department)
  const type = JOB_TYPES.find((t) => t.value === job.job_type)

  return (
    <div className="rounded-xl bg-white p-6 shadow-card transition-all hover:shadow-card-hover">
      <div className="mb-3 flex flex-wrap gap-2">
        <Badge className="bg-primary/10 capitalize text-primary">{dept?.label || job.department}</Badge>
        <Badge variant="outline">{type?.label || job.job_type}</Badge>
      </div>
      <h3 className="mb-2 font-heading text-xl font-semibold text-primary">{job.title}</h3>
      {job.location && (
        <p className="mb-1 flex items-center gap-1 text-sm text-gray-600">
          <MapPin className="h-4 w-4" />{job.location}
        </p>
      )}
      <p className="mb-4 flex items-center gap-1 text-xs text-gray-500">
        <Clock className="h-3 w-3" />Posted {formatDate(job.created_at)}
      </p>
      <Button asChild className="w-full bg-accent text-primary hover:bg-accent-dark">
        <Link to={`/careers/${job.id}`}>Apply Now</Link>
      </Button>
    </div>
  )
}
