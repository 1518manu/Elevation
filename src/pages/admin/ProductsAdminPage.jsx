import { useState } from 'react'
import { Plus } from 'lucide-react'
import AdminTopbar from '@/components/admin/AdminTopbar'
import DataTable from '@/components/admin/DataTable'
import ConfirmDialog from '@/components/admin/ConfirmDialog'
import ImageUpload from '@/components/admin/ImageUpload'
import MultiImageUpload from '@/components/admin/MultiImageUpload'
import { useProducts, useCreateProduct, useUpdateProduct, useDeleteProduct } from '@/hooks/useProducts'
import { ProductFormSchema } from '@/lib/validators'
import { slugify, formatDate, getImageUrl } from '@/lib/utils'
import { PRODUCT_CATEGORIES, STORAGE_BUCKETS } from '@/lib/constants'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Textarea } from '@/components/ui/textarea'
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog'
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select'
import { useToast } from '@/components/ui/toast'
import { Badge } from '@/components/ui/badge'

const emptyProduct = { name: '', slug: '', category: 'passenger', short_description: '', description: '', specifications: {}, features: [], images: [], is_featured: false, is_active: true, seo_title: '', seo_description: '' }

export default function ProductsAdminPage() {
  const { data: products = [], isLoading } = useProducts({ is_active: undefined })
  const createProduct = useCreateProduct()
  const updateProduct = useUpdateProduct()
  const deleteProduct = useDeleteProduct()
  const { toast } = useToast()
  const [modalOpen, setModalOpen] = useState(false)
  const [deleteId, setDeleteId] = useState(null)
  const [form, setForm] = useState(emptyProduct)
  const [editId, setEditId] = useState(null)
  const [featureInput, setFeatureInput] = useState('')
  const [specKey, setSpecKey] = useState('')
  const [specVal, setSpecVal] = useState('')

  const openCreate = () => { setForm(emptyProduct); setEditId(null); setModalOpen(true) }
  const openEdit = (p) => { setForm({ ...p, specifications: p.specifications || {} }); setEditId(p.id); setModalOpen(true) }

  const handleSave = async () => {
    try {
      ProductFormSchema.parse(form)
      if (editId) await updateProduct.mutateAsync({ id: editId, ...form })
      else await createProduct.mutateAsync(form)
      toast({ title: 'Product saved' })
      setModalOpen(false)
    } catch (err) {
      toast({ title: 'Error', description: err.message, variant: 'destructive' })
    }
  }

  const columns = [
    { accessorKey: 'images', header: 'Image', cell: ({ row }) => row.original.images?.[0] ? <img src={getImageUrl(row.original.images[0], 60)} alt="" className="h-10 w-10 rounded object-cover" /> : '-' },
    { accessorKey: 'name', header: 'Name' },
    { accessorKey: 'category', header: 'Category', cell: ({ row }) => <Badge className="capitalize">{row.original.category}</Badge> },
    { accessorKey: 'is_featured', header: 'Featured', cell: ({ row }) => row.original.is_featured ? 'Yes' : 'No' },
    { accessorKey: 'updated_at', header: 'Updated', cell: ({ row }) => formatDate(row.original.updated_at) },
    { id: 'actions', header: 'Actions', cell: ({ row }) => (
      <div className="flex gap-2">
        <Button size="sm" variant="outline" onClick={(e) => { e.stopPropagation(); openEdit(row.original) }}>Edit</Button>
        <Button size="sm" variant="destructive" onClick={(e) => { e.stopPropagation(); setDeleteId(row.original.id) }}>Delete</Button>
      </div>
    )},
  ]

  return (
    <div>
      <AdminTopbar title="Products" />
      <div className="p-6">
        <div className="mb-4 flex justify-end"><Button onClick={openCreate} className="bg-red-600"><Plus className="mr-2 h-4 w-4" />Add Product</Button></div>
        <DataTable columns={columns} data={products} isLoading={isLoading} />
      </div>

      <Dialog open={modalOpen} onOpenChange={setModalOpen}>
        <DialogContent className="max-h-[90vh] max-w-2xl overflow-y-auto">
          <DialogHeader><DialogTitle>{editId ? 'Edit Product' : 'Add Product'}</DialogTitle></DialogHeader>
          <div className="space-y-4">
            <div><Label>Name</Label><Input value={form.name} onChange={(e) => setForm({ ...form, name: e.target.value, slug: slugify(e.target.value) })} /></div>
            <div><Label>Slug</Label><Input value={form.slug} onChange={(e) => setForm({ ...form, slug: e.target.value })} /></div>
            <div><Label>Category</Label>
              <Select value={form.category} onValueChange={(v) => setForm({ ...form, category: v })}>
                <SelectTrigger><SelectValue /></SelectTrigger>
                <SelectContent>{PRODUCT_CATEGORIES.map((c) => <SelectItem key={c.value} value={c.value}>{c.label}</SelectItem>)}</SelectContent>
              </Select>
            </div>
            <div><Label>Short Description</Label><Input value={form.short_description} onChange={(e) => setForm({ ...form, short_description: e.target.value })} /></div>
            <div><Label>Description</Label><Textarea value={form.description} onChange={(e) => setForm({ ...form, description: e.target.value })} /></div>
            <div><Label>Images</Label><MultiImageUpload bucket={STORAGE_BUCKETS.products} value={form.images} onChange={(images) => setForm({ ...form, images })} maxImages={10} /></div>
            <div><Label>Features</Label>
              <div className="flex gap-2"><Input value={featureInput} onChange={(e) => setFeatureInput(e.target.value)} placeholder="Add feature" /><Button type="button" onClick={() => { if (featureInput) { setForm({ ...form, features: [...form.features, featureInput] }); setFeatureInput('') } }}>Add</Button></div>
              <div className="mt-2 flex flex-wrap gap-2">{form.features.map((f, i) => <Badge key={i}>{f} <button onClick={() => setForm({ ...form, features: form.features.filter((_, j) => j !== i) })} className="ml-1">×</button></Badge>)}</div>
            </div>
            <div className="flex gap-4">
              <label className="flex items-center gap-2"><input type="checkbox" checked={form.is_featured} onChange={(e) => setForm({ ...form, is_featured: e.target.checked })} />Featured</label>
              <label className="flex items-center gap-2"><input type="checkbox" checked={form.is_active} onChange={(e) => setForm({ ...form, is_active: e.target.checked })} />Active</label>
            </div>
            <Button onClick={handleSave} className="w-full bg-red-600">Save Product</Button>
          </div>
        </DialogContent>
      </Dialog>

      <ConfirmDialog open={!!deleteId} onOpenChange={() => setDeleteId(null)} title="Delete Product" description="This will deactivate the product." onConfirm={async () => { await deleteProduct.mutateAsync(deleteId); setDeleteId(null); toast({ title: 'Product deleted' }) }} />
    </div>
  )
}
