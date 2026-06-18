import { useState, useRef } from 'react'
import { Upload, X, Loader2 } from 'lucide-react'
import { supabase } from '@/lib/supabase'
import { cn, getImageUrl } from '@/lib/utils'
import { useToast } from '@/components/ui/toast'
import { Progress } from '@/components/ui/progress'

export default function ImageUpload({
  bucket,
  path = '',
  value,
  onChange,
  accept = 'image/*',
  maxSizeMB = 5,
}) {
  const [uploading, setUploading] = useState(false)
  const [progress, setProgress] = useState(0)
  const inputRef = useRef(null)
  const { toast } = useToast()

  const handleFile = async (file) => {
    if (!file) return
    if (file.size > maxSizeMB * 1024 * 1024) {
      toast({ title: 'File too large', description: `Max size is ${maxSizeMB}MB`, variant: 'destructive' })
      return
    }

    setUploading(true)
    setProgress(10)

    const ext = file.name.split('.').pop()
    const fileName = `${path}${Date.now()}.${ext}`

    try {
      setProgress(40)
      const { error } = await supabase.storage.from(bucket).upload(fileName, file, { upsert: true })
      if (error) throw error

      setProgress(80)
      const { data: { publicUrl } } = supabase.storage.from(bucket).getPublicUrl(fileName)
      onChange(getImageUrl(publicUrl))
      setProgress(100)
      toast({ title: 'Upload complete' })
    } catch (err) {
      toast({ title: 'Upload failed', description: err.message, variant: 'destructive' })
    } finally {
      setUploading(false)
      setProgress(0)
    }
  }

  const handleRemove = async () => {
    onChange(null)
  }

  return (
    <div className="space-y-3">
      {value ? (
        <div className="relative inline-block w-full">
          <img 
            src={getImageUrl(value, 800, 90)} 
            alt="Preview" 
            className="h-32 w-32 rounded-lg object-cover"
            onError={(e) => {
              // Fallback to original URL if transformed version fails
              e.target.src = value
            }}
          />
          <button type="button" onClick={handleRemove} className="absolute -right-2 -top-2 rounded-full bg-red-500 p-1 text-white hover:bg-red-600">
            <X className="h-4 w-4" />
          </button>
        </div>
      ) : (
        <div
          onClick={() => inputRef.current?.click()}
          onDragOver={(e) => e.preventDefault()}
          onDrop={(e) => { e.preventDefault(); handleFile(e.dataTransfer.files[0]) }}
          className={cn(
            'flex h-32 cursor-pointer flex-col items-center justify-center rounded-lg border-2 border-dashed border-gray-300 hover:border-primary',
            uploading && 'pointer-events-none opacity-50'
          )}
        >
          {uploading ? <Loader2 className="h-8 w-8 animate-spin text-primary" /> : <Upload className="h-8 w-8 text-gray-400" />}
          <p className="mt-2 text-sm text-gray-500">Click or drag to upload</p>
        </div>
      )}
      {uploading && <Progress value={progress} className="h-2" />}
      <input ref={inputRef} type="file" accept={accept} className="hidden" onChange={(e) => handleFile(e.target.files[0])} />
    </div>
  )
}
