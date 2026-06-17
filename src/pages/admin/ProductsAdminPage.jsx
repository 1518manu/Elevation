import { useState } from 'react'
import { Plus, Download, Search, Grid, List, Star, MoreVertical, Edit, Trash2 } from 'lucide-react'
import DataTable from '@/components/admin/DataTable'
import ConfirmDialog from '@/components/admin/ConfirmDialog'
import ProductFormDrawer from '@/components/admin/ProductFormDrawer'
import { useProducts, useCreateProduct, useUpdateProduct, useDeleteProduct } from '@/hooks/useProducts'
import { slugify, formatDate, getImageUrl } from '@/lib/utils'
import { PRODUCT_CATEGORIES } from '@/lib/constants'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Badge } from '@/components/ui/badge'
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from '@/components/ui/dropdown-menu'

export default function ProductsAdminPage() {
  const { data: products = [], isLoading } = useProducts({ is_active: undefined })
  const createProduct = useCreateProduct()
  const updateProduct = useUpdateProduct()
  const deleteProduct = useDeleteProduct()
  const [drawerOpen, setDrawerOpen] = useState(false)
  const [deleteId, setDeleteId] = useState(null)
  const [editId, setEditId] = useState(null)
  const [selectedCategory, setSelectedCategory] = useState('all')
  const [searchQuery, setSearchQuery] = useState('')
  const [viewMode, setViewMode] = useState('list')

  const openCreate = () => { setEditId(null); setDrawerOpen(true) }
  const openEdit = (id) => { setEditId(id); setDrawerOpen(true) }

  const handleDelete = async (id) => {
    await deleteProduct.mutateAsync(id)
    setDeleteId(null)
  }

  const filteredProducts = products.filter(p => {
    const matchesCategory = selectedCategory === 'all' || p.category === selectedCategory
    const matchesSearch = searchQuery === '' || 
      p.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      p.slug?.toLowerCase().includes(searchQuery.toLowerCase())
    return matchesCategory && matchesSearch
  })

  const activeCount = filteredProducts.filter(p => p.is_active).length

  const columns = [
    { 
      accessorKey: 'select', 
      header: () => <input type="checkbox" className="rounded" />,
      cell: ({ row }) => <input type="checkbox" className="rounded" />
    },
    { 
      accessorKey: 'images', 
      header: '', 
      cell: ({ row }) => row.original.images?.[0] ? (
        <img 
          src={getImageUrl(row.original.images[0])} 
          alt="" 
          className="h-12 w-12 rounded-md object-cover"
        />
      ) : (
        <div className="h-12 w-12 rounded-md bg-gray-200 flex items-center justify-center text-gray-400 text-xs">
          No img
        </div>
      )
    },
    { 
      accessorKey: 'name', 
      header: 'PRODUCT', 
      cell: ({ row }) => (
        <div className="font-['DM Sans', 'sans-serif'] text-[14px] font-semibold text-[#0E0E0E]">
          {row.original.name}
        </div>
      )
    },
    { 
      accessorKey: 'category', 
      header: 'CATEGORY', 
      cell: ({ row }) => (
        <Badge variant="admin-draft" className="capitalize">
          {row.original.category}
        </Badge>
      )
    },
    { 
      accessorKey: 'is_featured', 
      header: 'FEATURED', 
      cell: ({ row }) => (
        row.original.is_featured ? <Star className="h-5 w-5 text-amber-500 fill-amber-500" /> : null
      )
    },
    { 
      accessorKey: 'is_active', 
      header: 'STATUS', 
      cell: ({ row }) => (
        <div className="flex items-center gap-2">
          <div className={`w-2 h-2 rounded-full ${row.original.is_active ? 'bg-[#15803D]' : 'bg-gray-400'}`} />
          <span className="font-['DM Sans', 'sans-serif'] text-sm">
            {row.original.is_active ? 'Active' : 'Inactive'}
          </span>
        </div>
      )
    },
    { 
      accessorKey: 'updated_at', 
      header: 'UPDATED', 
      cell: ({ row }) => formatDate(row.original.updated_at)
    },
    { 
      id: 'actions', 
      header: 'ACTIONS', 
      cell: ({ row }) => (
        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <button className="p-2 hover:bg-gray-100 rounded-md">
              <MoreVertical className="h-4 w-4" />
            </button>
          </DropdownMenuTrigger>
          <DropdownMenuContent align="end">
            <DropdownMenuItem onClick={() => openEdit(row.original.id)}>
              <Edit className="mr-2 h-4 w-4" /> Edit
            </DropdownMenuItem>
            <DropdownMenuItem 
              className="text-[#D42B2B]"
              onClick={() => setDeleteId(row.original.id)}
            >
              <Trash2 className="mr-2 h-4 w-4" /> Delete
            </DropdownMenuItem>
          </DropdownMenuContent>
        </DropdownMenu>
      )
    },
  ]

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
              Products
            </h1>
            <p className="font-['DM Sans', 'sans-serif'] text-[13px] text-gray-500">
              {filteredProducts.length} total · {activeCount} active
            </p>
          </div>
          <div className="flex gap-3">
            <Button variant="admin-ghost">
              <Download className="mr-2 h-4 w-4" /> Export
            </Button>
            <Button variant="admin-primary" onClick={openCreate}>
              <Plus className="mr-2 h-4 w-4" /> Add Product
            </Button>
          </div>
        </div>
      </div>

      {/* Filter Bar */}
      <div className="bg-white rounded-xl border border-[#E5E5E5] p-4 mb-4 flex items-center gap-4">
        <div className="relative flex-1">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-gray-400" />
          <Input
            placeholder="Search products..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="pl-9 h-9 bg-[#F7F7F7] border-none focus:bg-white transition-colors"
          />
        </div>
        <div className="flex gap-2 flex-wrap">
          {['all', ...PRODUCT_CATEGORIES.map(c => c.value)].map((cat) => (
            <button
              key={cat}
              onClick={() => setSelectedCategory(cat)}
              className={`px-4 py-1.5 rounded-full text-xs font-medium border-2 transition-all ${
                selectedCategory === cat
                  ? 'bg-[#D42B2B] text-white border-[#D42B2B]'
                  : 'bg-white border-[#E5E5E5] text-gray-600 hover:border-[#D42B2B] hover:text-[#D42B2B]'
              }`}
            >
              {cat.charAt(0).toUpperCase() + cat.slice(1)}
            </button>
          ))}
        </div>
        <div className="flex border-l pl-4">
          <button
            onClick={() => setViewMode('grid')}
            className={`p-2 rounded-md ${viewMode === 'grid' ? 'bg-[#D42B2B] text-white' : 'hover:bg-gray-100'}`}
          >
            <Grid className="h-4 w-4" />
          </button>
          <button
            onClick={() => setViewMode('list')}
            className={`p-2 rounded-md ${viewMode === 'list' ? 'bg-[#D42B2B] text-white' : 'hover:bg-gray-100'}`}
          >
            <List className="h-4 w-4" />
          </button>
        </div>
      </div>

      {/* Products Table */}
      <div className="bg-white rounded-xl border border-[#E5E5E5] overflow-hidden">
        <DataTable 
          columns={columns} 
          data={filteredProducts} 
          isLoading={isLoading}
          emptyMessage="No products found matching your filters."
        />
      </div>

      <ProductFormDrawer 
        open={drawerOpen} 
        onOpenChange={setDrawerOpen}
        editId={editId}
        onSave={() => setDrawerOpen(false)}
      />

      <ConfirmDialog 
        open={!!deleteId} 
        onOpenChange={() => setDeleteId(null)} 
        title="Delete Product"
        description="This action cannot be undone. The product will be permanently removed from the database."
        onConfirm={() => handleDelete(deleteId)}
      />
    </div>
  )
}