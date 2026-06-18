import { useClients } from '@/hooks/useClients'
import { getImageUrl } from '@/lib/utils'
import { Skeleton } from '@/components/ui/skeleton'

export default function ClientLogoMarquee() {
  const { data: clients = [], isLoading } = useClients()

  if (isLoading) return <Skeleton className="h-32 w-full rounded-xl" />

  const clientsWithLogos = clients.filter(client => client.logo_url)
  if (!clientsWithLogos.length) return null

  const doubled = [...clientsWithLogos, ...clientsWithLogos]

  return (
    <div className="marquee-pause overflow-hidden py-8">
      <div className="marquee-track flex w-max animate-marquee gap-16">
        {doubled.map((client, i) => (
          <div
            key={`${client.id}-${i}`}
            className="flex h-24 w-48 flex-shrink-0 items-center justify-center grayscale transition-all duration-300 hover:grayscale-0"
          >
            <img
              src={getImageUrl(client.logo_url, 400)}
              alt={client.name}
              loading="lazy"
              className="max-h-20 max-w-full object-contain"
              onError={(e) => {
                e.target.style.display = 'none'
              }}
            />
          </div>
        ))}
      </div>
    </div>
  )
}