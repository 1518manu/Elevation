import { useState, useEffect } from 'react'
import { X, ChevronDown, ChevronUp, Plus, Trash2 } from 'lucide-react'
import { Dialog, DialogContent } from '@/components/ui/dialog'
import { useProducts, useCreateProduct, useUpdateProduct } from '@/hooks/useProducts'
import { slugify } from '@/lib/utils'
import { PRODUCT_CATEGORIES, STORAGE_BUCKETS } from '@/lib/constants'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Textarea } from '@/components/ui/textarea'
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select'
import MultiImageUpload from '@/components/admin/MultiImageUpload'
import RichEditor from '@/components/admin/RichEditor'
import { useToast } from '@/components/ui/toast'

const emptyProduct = {
  name: '',
  slug: '',
  category: 'passenger',
  short_description: '',
  description: '',
  specifications: {},
  features: [],
  images: [],
  brochure_url: '',
  is_featured: false,
  is_active: true,
  seo_title: '',
  seo_description: ''
}

export default function ProductFormDrawer({ open, onOpenChange, editId, onSave }) {
  const { data: products } = useProducts()
  const createProduct = useCreateProduct()
  const updateProduct = useUpdateProduct()
  const { toast } = useToast()
  const [form, setForm] = useState(emptyProduct)
  const [featureInput, setFeatureInput] = useState('')
  const [seoExpanded, setSeoExpanded] = useState(false)

  useEffect(() => {
    if (editId && products) {
      const product = products.find(p => p.id === editId)
      if (product) {
        setForm({
          ...product,
          specifications: product.specifications || {},
          features: product.features || [],
          images: product.images || []
        })
      }
    } else if (open) {
      setForm(emptyProduct)
    }
  }, [editId, products, open])

  const handleSave = async () => {
    try {
      if (editId) {
        await updateProduct.mutateAsync({ id: editId, ...form })
        toast({ title: 'Product updated successfully' })
      } else {
        await createProduct.mutateAsync(form)
        toast({ title: 'Product created successfully' })
      }
      onSave()
    } catch (error) {
      toast({ 
        title: 'Error', 
        description: error.message || 'Failed to save product',
        variant: 'destructive' 
      })
    }
  }

  const addFeature = () => {
    if (featureInput.trim()) {
      setForm({ ...form, features: [...form.features, featureInput.trim()] })
      setFeatureInput('')
    }
  }

  const removeFeature = (index) => {
    setForm({ ...form, features: form.features.filter((_, i) => i !== index) })
  }

  const addSpecification = () => {
    const keys = Object.keys(form.specifications)
    const newKey = `spec_${keys.length + 1}`
    setForm({ 
      ...form, 
      specifications: { ...form.specifications, [newKey]: '' }
    })
  }

  const updateSpecification = (key, value) => {
    setForm({ 
      ...form, 
      specifications: { ...form.specifications, [key]: value }
    })
  }

  const removeSpecification = (key) => {
    const newSpecs = { ...form.specifications }
    delete newSpecs[key]
    setForm({ ...form, specifications: newSpecs })
  }

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="p-0 max-w-2xl right-0 h-full sm:max-w-[680px] sm:h-auto sm:max-h-[90vh] sm:overflow-y-auto">
        <div className="flex h-full flex-col">
          {/* Drawer Header */}
          <div className="flex items-center justify-between border-b border-[#E5E5E5] px-6 py-4">
            <h2 className="font-['Syne', 'sans-serif'] text-[20px] font-bold text-[#0E0E0E]">
              {editId ? 'Edit Product' : 'Add Product'}
            </h2>
            <button
              onClick={() => onOpenChange(false)}
              className="rounded-lg p-2 hover:bg-gray-100 transition-colors"
            >
              <X className="h-5 w-5" />
            </button>
          </div>

          {/* Drawer Content */}
          <div className="flex-1 overflow-y-auto px-6 py-6 space-y-6">
            {/* SECTION 1: Basic Info */}
            <div className="space-y-4">
              <h3 className="font-['Syne', 'sans-serif'] text-[14px] font-semibold text-[#0E0E0E]">
                Basic Information
              </h3>
              
              <div className="space-y-2">
                <Label htmlFor="name">Product Name <span className="text-[#D42B2B]">*</span></Label>
                <Input
                  id="name"
                  value={form.name}
                  onChange={(e) => setForm({ ...form, name: e.target.value, slug: slugify(e.target.value) })}
                  placeholder="Enter product name"
                  className="focus:border-[#D42B2B]"
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="slug">Slug</Label>
                <Input
                  id="slug"
                  value={form.slug}
                  onChange={(e) => setForm({ ...form, slug: e.target.value })}
                  placeholder="product-slug"
                  className="font-mono text-sm bg-[#F7F7F7] border-none"
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="category">Category <span className="text-[#D42B2B]">*</span></Label>
                <Select value={form.category} onValueChange={(v) => setForm({ ...form, category: v })}>
                  <SelectTrigger id="category" className="focus:border-[#D42B2B]">
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    {PRODUCT_CATEGORIES.map((c) => (
                      <SelectItem key={c.value} value={c.value}>
                        {c.label}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>

              <div className="space-y-2">
                <Label htmlFor="short_description">Short Description</Label>
                <Textarea
                  id="short_description"
                  value={form.short_description || ''}
                  onChange={(e) => setForm({ ...form, short_description: e.target.value })}
                  placeholder="Brief product description (2-3 sentences)"
                  rows={3}
                  className="focus:border-[#D42B2B]"
                />
              </div>
            </div>

            {/* SECTION 2: Product Images */}
            <div className="space-y-4">
              <div>
                <h3 className="font-['Syne', 'sans-serif'] text-[14px] font-semibold text-[#0E0E0E] mb-1">
                  Product Images
                </h3>
                <p className="font-['DM Sans', 'sans-serif'] text-xs text-gray-500">
                  Drag to reorder. First image = cover image.
                </p>
              </div>
              <MultiImageUpload
                bucket={STORAGE_BUCKETS.products}
                value={form.images}
                onChange={(images) => setForm({ ...form, images })}
                maxImages={10}
              />
            </div>

            {/* SECTION 3: Details */}
            <div className="space-y-4">
              <h3 className="font-['Syne', 'sans-serif'] text-[14px] font-semibold text-[#0E0E0E]">
                Product Details
              </h3>
              
              <div className="space-y-2">
                <Label htmlFor="description">Description</Label>
                <RichEditor
                  content={form.description}
                  onChange={(content) => setForm({ ...form, description: content })}
                />
              </div>

              <div className="space-y-2">
                <Label>Features</Label>
                <div className="flex gap-2">
                  <Input
                    value={featureInput}
                    onChange={(e) => setFeatureInput(e.target.value)}
                    placeholder="Add feature and press Enter"
                    onKeyPress={(e) => e.key === 'Enter' && addFeature()}
                    className="flex-1 focus:border-[#D42B2B]"
                  />
                  <Button type="button" onClick={addFeature} variant="admin-primary">
                    Add
                  </Button>
                </div>
                <div className="flex flex-wrap gap-2 mt-2">
                  {form.features.map((feature, index) => (
                    <div
                      key={index}
                      className="flex items-center gap-1 bg-[#F7F7F7] border border-[#E5E5E5] rounded-lg px-3 py-1"
                    >
                      <span className="text-sm">{feature}</span>
                      <button
                        onClick={() => removeFeature(index)}
                        className="text-[#D42B2B] hover:text-[#B01F1F]"
                      >
                        <X className="h-3 w-3" />
                      </button>
                    </div>
                  ))}
                </div>
              </div>

              <div className="space-y-2">
                <div className="flex items-center justify-between">
                  <Label>Specifications</Label>
                  <Button
                    type="button"
                    variant="admin-ghost"
                    size="admin-sm"
                    onClick={addSpecification}
                  >
                    <Plus className="h-4 w-4 mr-1" /> Add Row
                  </Button>
                </div>
                <div className="space-y-2">
                  {Object.entries(form.specifications).map(([key, value]) => (
                    <div key={key} className="flex gap-2">
                      <Input
                        value={key}
                        onChange={(e) => {
                          const newSpecs = { ...form.specifications }
                          delete newSpecs[key]
                          newSpecs[e.target.value] = value
                          setForm({ ...form, specifications: newSpecs })
                        }}
                        placeholder="Key"
                        className="flex-1 focus:border-[#D42B2B]"
                      />
                      <Input
                        value={value}
                        onChange={(e) => updateSpecification(key, e.target.value)}
                        placeholder="Value"
                        className="flex-1 focus:border-[#D42B2B]"
                      />
                      <Button
                        type="button"
                        variant="admin-ghost"
                        size="admin-sm"
                        onClick={() => removeSpecification(key)}
                      >
                        <Trash2 className="h-4 w-4" />
                      </Button>
                    </div>
                  ))}
                </div>
              </div>
            </div>

            {/* SECTION 4: Files */}
            <div className="space-y-4">
              <h3 className="font-['Syne', 'sans-serif'] text-[14px] font-semibold text-[#0E0E0E]">
                Files
              </h3>
              <div className="space-y-2">
                <Label htmlFor="brochure">Brochure PDF</Label>
                <Input
                  id="brochure"
                  type="file"
                  accept=".pdf"
                  onChange={(e) => {
                    const file = e.target.files?.[0]
                    if (file) {
                      // In a real implementation, you would upload to Supabase Storage here
                      // For now, we'll just store the filename
                      setForm({ ...form, brochure_url: file.name })
                    }
                  }}
                  className="focus:border-[#D42B2B]"
                />
                {form.brochure_url && (
                  <p className="text-sm text-gray-600">
                    Current: {form.brochure_url}
                  </p>
                )}
              </div>
            </div>

            {/* SECTION 5: Visibility */}
            <div className="space-y-4">
              <h3 className="font-['Syne', 'sans-serif'] text-[14px] font-semibold text-[#0E0E0E]">
                Visibility
              </h3>
              <div className="flex gap-6">
                <label className="flex items-center gap-2 cursor-pointer">
                  <input
                    type="checkbox"
                    checked={form.is_featured}
                    onChange={(e) => setForm({ ...form, is_featured: e.target.checked })}
                    className="rounded"
                  />
                  <span className="text-sm">Featured Product</span>
                </label>
                <label className="flex items-center gap-2 cursor-pointer">
                  <input
                    type="checkbox"
                    checked={form.is_active}
                    onChange={(e) => setForm({ ...form, is_active: e.target.checked })}
                    className="rounded"
                  />
                  <span className="text-sm">Active</span>
                </label>
              </div>
            </div>

            {/* SECTION 6: SEO (Collapsible) */}
            <div className="space-y-4">
              <button
                type="button"
                onClick={() => setSeoExpanded(!seoExpanded)}
                className="flex items-center justify-between w-full text-left"
              >
                <h3 className="font-['Syne', 'sans-serif'] text-[14px] font-semibold text-[#0E0E0E]">
                  SEO Settings
                </h3>
                {seoExpanded ? <ChevronUp className="h-4 w-4" /> : <ChevronDown className="h-4 w-4" />}
              </button>
              
              {seoExpanded && (
                <div className="space-y-4 pl-4 border-l-2 border-[#E5E5E5]">
                  <div className="space-y-2">
                    <Label htmlFor="seo_title">SEO Title <span className="text-gray-400">({form.seo_title?.length || 0}/60)</span></Label>
                    <Input
                      id="seo_title"
                      value={form.seo_title}
                      onChange={(e) => setForm({ ...form, seo_title: e.target.value })}
                      placeholder="SEO-optimized title"
                      maxLength={60}
                      className="focus:border-[#D42B2B]"
                    />
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="seo_description">SEO Description <span className="text-gray-400">({form.seo_description?.length || 0}/160)</span></Label>
                    <Textarea
                      id="seo_description"
                      value={form.seo_description || ''}
                      onChange={(e) => setForm({ ...form, seo_description: e.target.value })}
                      placeholder="Meta description for search engines"
                      rows={3}
                      maxLength={160}
                      className="focus:border-[#D42B2B]"
                    />
                  </div>
                </div>
              )}
            </div>
          </div>

          {/* Drawer Footer */}
          <div className="flex items-center justify-end gap-3 border-t border-[#E5E5E5] px-6 py-4">
            <Button variant="admin-ghost" onClick={() => onOpenChange(false)}>
              Cancel
            </Button>
            <Button variant="admin-primary" onClick={handleSave} className="px-8">
              {editId ? 'Save Changes' : 'Add Product'}
            </Button>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  )
}