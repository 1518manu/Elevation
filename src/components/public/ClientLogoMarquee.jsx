import { useClients } from '@/hooks/useClients'
import { getImageUrl } from '@/lib/utils'
import { Skeleton } from '@/components/ui/skeleton'

export default function ClientLogoMarquee() {
  const { data: clients = [], isLoading } = useClients()

  if (isLoading) return <Skeleton className="h-20 w-full rounded-xl" />
  if (!clients.length) return null

  const doubled = [...clients, ...clients]

  return (
    <div className="marquee-pause overflow-hidden py-8">
      <div className="marquee-track flex w-max animate-marquee gap-12">
        {doubled.map((client, i) => (
          <div key={`${client.id}-${i}`} className="flex h-16 w-32 flex-shrink-0 items-center justify-center grayscale transition-all hover:grayscale-0">
            {client.logo_url ? (
              <img src={getImageUrl(client.logo_url, 200)} alt={client.name} loading="lazy" className="max-h-12 max-w-full object-contain" />
            ) : (
              <span className="text-sm font-semibold text-gray-400">{client.name}</span>
            )}
          </div>
        ))}
      </div>
    </div>
  )
}
