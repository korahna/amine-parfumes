'use client'

import { useRef, useState } from 'react'
import Image from 'next/image'
import { createClient } from '@/lib/supabase/client'
import { Upload, X, Loader2 } from 'lucide-react'

interface ImageUploadProps {
  onUpload: (url: string) => void
  currentUrl?: string | null
}

export function ImageUpload({ onUpload, currentUrl }: ImageUploadProps) {
  const inputRef = useRef<HTMLInputElement>(null)
  const [uploading, setUploading] = useState(false)
  const [preview, setPreview] = useState<string | null>(currentUrl ?? null)
  const [error, setError] = useState<string | null>(null)

  const handleFile = async (file: File) => {
    if (!file.type.startsWith('image/')) {
      setError('Veuillez sélectionner une image')
      return
    }
    if (file.size > 5 * 1024 * 1024) {
      setError('L\'image ne doit pas dépasser 5 MB')
      return
    }

    setError(null)
    setUploading(true)

    const supabase = createClient()
    const ext = file.name.split('.').pop() ?? 'jpg'
    const path = `products/${Date.now()}-${Math.random().toString(36).slice(2, 8)}.${ext}`

    const { error: uploadError } = await supabase.storage
      .from('product-images')
      .upload(path, file, { contentType: file.type, upsert: false })

    if (uploadError) {
      setError('Erreur lors de l\'upload: ' + uploadError.message)
      setUploading(false)
      return
    }

    const { data } = supabase.storage.from('product-images').getPublicUrl(path)
    setPreview(data.publicUrl)
    onUpload(data.publicUrl)
    setUploading(false)
  }

  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault()
    const file = e.dataTransfer.files[0]
    if (file) handleFile(file)
  }

  const handleSelect = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0]
    if (file) handleFile(file)
  }

  const clear = () => {
    setPreview(null)
    onUpload('')
    if (inputRef.current) inputRef.current.value = ''
  }

  return (
    <div className="space-y-3">
      <input
        ref={inputRef}
        type="file"
        accept="image/*"
        onChange={handleSelect}
        className="hidden"
      />

      {preview ? (
        <div className="relative w-48 h-48 rounded-lg overflow-hidden border border-outline-variant/30">
          <Image src={preview} alt="Aperçu" fill className="object-cover" sizes="192px" />
          <button
            type="button"
            onClick={clear}
            className="absolute top-2 right-2 w-7 h-7 bg-black/60 rounded-full flex items-center justify-center text-white hover:bg-black/80 transition-colors"
          >
            <X size={14} />
          </button>
        </div>
      ) : (
        <button
          type="button"
          onClick={() => inputRef.current?.click()}
          onDragOver={(e) => e.preventDefault()}
          onDrop={handleDrop}
          disabled={uploading}
          className="w-48 h-48 border-2 border-dashed border-outline-variant/40 rounded-lg flex flex-col items-center justify-center gap-3 text-on-surface-variant hover:border-primary hover:text-primary transition-colors disabled:opacity-50"
        >
          {uploading ? (
            <Loader2 size={24} className="animate-spin" />
          ) : (
            <Upload size={24} />
          )}
          <span className="text-xs text-center px-4">
            {uploading ? 'Upload en cours...' : 'Cliquez ou glissez une image'}
          </span>
        </button>
      )}

      {error && <p className="text-red-400 text-sm">{error}</p>}
    </div>
  )
}
