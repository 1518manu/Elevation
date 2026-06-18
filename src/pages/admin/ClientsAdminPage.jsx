import { useState } from 'react'
import { Plus, Building2, Globe } from 'lucide-react'
import { useClients, useUpdateClient, useDeleteClient } from '@/hooks/useClients'
import { Button } from '@/components/ui/button'
import { useToast } from '@/components/ui/toast'
import ConfirmDialog from '@/components/admin/ConfirmDialog'
import ClientFormDrawer from '@/components/admin/ClientFormDrawer'
import SortableList from '@/components/admin/SortableList'

export default function ClientsAdminPage() {
  const { data: clients = [], isLoading } = useClients({ is_active: undefined })
  const updateClient = useUpdateClient()
  const deleteClient = useDeleteClient()
  const { toast } = useToast()
  const [drawerOpen, setDrawerOpen] = useState(false)
  const [editId, setEditId] = useState(null)
  const [deleteId, setDeleteId] = useState(null)

  const openCreate = () => { setEditId(null); setDrawerOpen(true) }
  const openEdit = (id) => { setEditId(id); setDrawerOpen(true) }

  const handleReorder = async (items) => {
    try {
      for (let i = 0; i < items.length; i++) {
        await updateClient.mutateAsync({ id: items[i].id, display_order: i })
      }
      toast({ title: 'Order updated successfully' })
    } catch (error) {
      toast({ 
        title: 'Error', 
        description: error.message || 'Failed to update order',
        variant: 'destructive' 
      })
    }
  }

  const renderItem = (client) => (
    <div className="flex items-center gap-4 w-full">
      <div className="flex-shrink-0">
        {client.logo_url ? (
          <img 
            src={client.logo_url} 
            alt={client.name}
            className="h-12 w-12 rounded-lg object-cover"
          />
        ) : (
          <div className="h-12 w-12 rounded-lg bg-[#D42B2B] flex items-center justify-center">
            <Building2 className="h-6 w-6 text-white" />
          </div>
        )}
      </div>
      <div className="flex-1">
        <div className="flex items-center gap-3 mb-1">
          <p className="font-['DM Sans', 'sans-serif'] text-[14px] font-semibold text-[#0E0E0E]">
            {client.name}
          </p>
          {!client.is_active && (
            <span className="text-xs font-semibold text-gray-400">Hidden</span>
          )}
        </div>
        {client.website_url && (
          <a 
            href={client.website_url}
            target="_blank"
            rel="noopener noreferrer"
            className="font-['DM Sans', 'sans-serif'] text-sm text-[#D42B2B] hover:underline flex items-center gap-1"
          >
            <Globe className="h-3 w-3" />
            {client.website_url}
          </a>
        )}
      </div>
    </div>
  )

  return (
    <div>
      {/* Page Header */}
      <div className="mb-6">
        <div className="flex items-start justify-between">
          <div>
            <p className="font-['Syne', 'sans-serif'] text-[11px] uppercase tracking-wider text-[#9CA3AF] mb-1">
              CONTENT
            </p>
            <h1 className="font-['Syne', 'sans-serif'] text-[24px] font-bold text-[#0E0E0E] mb-1">
              Clients
            </h1>
            <p className="font-['DM Sans', 'sans-serif'] text-[13px] text-gray-500">
              {clients.length} total · {clients.filter(c => c.is_active).length} visible
            </p>
          </div>
          <Button variant="admin-primary" onClick={openCreate}>
            <Plus className="mr-2 h-4 w-4" /> Add Client
          </Button>
        </div>
      </div>

      {/* Instructions */}
      <div className="bg-[#F9ECEC] border border-[#D42B2B20] rounded-lg p-4 mb-4">
        <div className="flex items-start gap-3">
          <Building2 className="h-5 w-5 text-[#D42B2B] flex-shrink-0 mt-0.5" />
          <div>
            <p className="font-['DM Sans', 'sans-serif'] text-sm font-medium text-[#0E0E0E] mb-1">
              Manage client logos for website display
            </p>
            <p className="font-['DM Sans', 'sans-serif'] text-xs text-gray-600">
              Add client logos with optional website links. The order set here determines how they appear on the website.
            </p>
          </div>
        </div>
      </div>

      {/* Sortable Clients List */}
      <div className="bg-white rounded-xl border border-[#E5E5E5] p-4">
        {isLoading ? (
          <div className="text-center py-12 text-gray-500">Loading clients...</div>
        ) : clients.length === 0 ? (
          <div className="text-center py-16">
            <Building2 className="h-10 w-10 text-[#D42B2B] mx-auto mb-3" />
            <p className="font-['Syne', 'sans-serif'] text-[18px] font-medium text-[#0E0E0E] mb-1">
              No clients yet
            </p>
            <p className="font-['DM Sans', 'sans-serif'] text-sm text-gray-500 mb-4">
              Add client logos to showcase partnerships on your website.
            </p>
            <Button variant="admin-primary" onClick={openCreate}>
              <Plus className="mr-2 h-4 w-4" /> Add First Client
            </Button>
          </div>
        ) : (
          <SortableList
            items={clients.map((c, i) => ({ ...c, id: c.id || String(i) }))}
            onReorder={handleReorder}
            renderItem={renderItem}
            onEdit={openEdit}
            onDelete={setDeleteId}
          />
        )}
      </div>

      <ClientFormDrawer 
        open={drawerOpen} 
        onOpenChange={setDrawerOpen}
        editId={editId}
        onSave={() => setDrawerOpen(false)}
      />

      <ConfirmDialog 
        open={!!deleteId} 
        onOpenChange={() => setDeleteId(null)} 
        title="Delete Client"
        description="This action cannot be undone. The client will be permanently removed from the website."
        onConfirm={async () => { 
          await deleteClient.mutateAsync(deleteId); 
          setDeleteId(null); 
          toast({ title: 'Client deleted' }) 
        }} 
      />
    </div>
  )
}