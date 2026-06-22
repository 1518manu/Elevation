import { useClients } from '@/hooks/useClients'
import { Skeleton } from '@/components/ui/skeleton'

export default function ClientLogoMarquee() {
  const { data: clients = [], isLoading } = useClients()

  if (isLoading) return <Skeleton className="h-32 w-full rounded-xl" />

  const clientsWithLogos = clients.filter(client => client.logo_url)
  if (!clientsWithLogos.length) return null

  // Create enough copies to fill both rows for seamless scrolling
  const quadrupled = [...clientsWithLogos, ...clientsWithLogos, ...clientsWithLogos, ...clientsWithLogos]

  // Split into two rows
  const firstRow = quadrupled.slice(0, quadrupled.length / 2)

  // Rearrange second row with reverse sequence for variety
  const halfLength = quadrupled.length / 2
  const secondRow = [
    ...quadrupled.slice(halfLength).reverse(),
    ...quadrupled.slice(0, halfLength).reverse()
  ]

  return (
    <div className="overflow-hidden py-8">
      {/* First Row - Left to Right */}
      <div className="marquee-pause mb-6 overflow-hidden">
        <div className="marquee-track flex w-max animate-marquee gap-16">
          {firstRow.map((client, i) => (
            <div
              key={`${client.id}-row1-${i}`}
              className="flex h-24 w-48 flex-shrink-0 items-center justify-center grayscale transition-all duration-300 hover:grayscale-0"
            >
              <img
                src={client.logo_url}
                alt={client.name}
                loading="lazy"
                className="h-20 w-auto max-w-[180px] object-contain"
              />
            </div>
          ))}
        </div>
      </div>

      {/* Second Row - Right to Left */}
      <div className="marquee-pause overflow-hidden">
        <div className="marquee-track flex w-max animate-marquee-reverse gap-16">
          {secondRow.map((client, i) => (
            <div
              key={`${client.id}-row2-${i}`}
              className="flex h-24 w-48 flex-shrink-0 items-center justify-center grayscale transition-all duration-300 hover:grayscale-0"
            >
              <img
                src={client.logo_url}
                alt={client.name}
                loading="lazy"
                className="h-20 w-auto max-w-[180px] object-contain"
              />
            </div>
          ))}
        </div>
      </div>
    </div>
  )
}