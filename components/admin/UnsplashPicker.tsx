'use client'

import { useState } from 'react'
import Image from 'next/image'

interface UnsplashPhoto {
  id: string
  url: string
  thumb: string
  alt: string
  author: string
}

interface UnsplashPickerProps {
  selected: string | null
  onSelect: (url: string) => void
  brand?: string
}

export function UnsplashPicker({ selected, onSelect, brand }: UnsplashPickerProps) {
  const [query, setQuery] = useState('')
  const [photos, setPhotos] = useState<UnsplashPhoto[]>([])
  const [loading, setLoading] = useState(false)
  const [searched, setSearched] = useState(false)

  const handleSearch = async (e?: React.FormEvent) => {
    e?.preventDefault()
    const searchTerm = query.trim() || (brand ? `${brand} perfume luxury` : 'luxury perfume bottle')
    setLoading(true)
    setSearched(true)

    try {
      const res = await fetch(`/api/unsplash?query=${encodeURIComponent(searchTerm)}`)
      const data = await res.json()
      setPhotos(data.photos ?? [])
    } catch {
      setPhotos([])
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="space-y-4">
      {/* Search bar */}
      <form onSubmit={handleSearch} className="flex gap-2">
        <input
          value={query}
          onChange={(e) => setQuery(e.target.value)}
          placeholder={brand ? `${brand} perfume` : 'Rechercher des photos de parfum...'}
          className="input-underline flex-1 font-body-md text-on-surface py-2"
        />
        <button
          type="submit"
          disabled={loading}
          className="font-label-caps text-label-caps bg-primary text-on-primary px-4 py-2 hover:bg-primary-fixed transition-colors duration-300 disabled:opacity-50"
        >
          {loading ? '...' : 'Chercher'}
        </button>
      </form>

      {/* Quick search suggestions */}
      {!searched && (
        <div className="flex flex-wrap gap-2">
          {['luxury perfume bottle', 'oud perfume arabic', 'floral perfume pink', 'cologne dark bottle', 'perfume sample vial'].map((suggestion) => (
            <button
              key={suggestion}
              type="button"
              onClick={() => { setQuery(suggestion); handleSearch() }}
              className="text-[10px] tracking-wider uppercase text-on-surface-variant border border-outline-variant/30 px-3 py-1.5 rounded-full hover:border-primary hover:text-primary transition-colors"
            >
              {suggestion}
            </button>
          ))}
        </div>
      )}

      {/* Loading skeleton */}
      {loading && (
        <div className="grid grid-cols-3 md:grid-cols-6 gap-3">
          {Array.from({ length: 6 }).map((_, i) => (
            <div key={i} className="aspect-square rounded skeleton" />
          ))}
        </div>
      )}

      {/* Results grid */}
      {!loading && photos.length > 0 && (
        <div className="grid grid-cols-3 md:grid-cols-6 gap-3">
          {photos.map((photo) => (
            <button
              key={photo.id}
              type="button"
              onClick={() => onSelect(photo.url)}
              className={`relative aspect-square rounded overflow-hidden border-2 transition-all duration-300 ${
                selected === photo.url
                  ? 'border-primary ring-2 ring-primary/30'
                  : 'border-transparent hover:border-outline-variant'
              }`}
            >
              <Image
                src={photo.thumb}
                alt={photo.alt}
                fill
                className="object-cover"
                sizes="100px"
              />
              {selected === photo.url && (
                <div className="absolute inset-0 bg-primary/20 flex items-center justify-center">
                  <span className="material-symbols-outlined text-primary text-2xl">check_circle</span>
                </div>
              )}
              <div className="absolute bottom-0 inset-x-0 bg-gradient-to-t from-black/60 to-transparent p-1">
                <p className="text-[8px] text-white/70 truncate">{photo.author}</p>
              </div>
            </button>
          ))}
        </div>
      )}

      {/* No results */}
      {!loading && searched && photos.length === 0 && (
        <p className="text-sm text-on-surface-variant text-center py-4">
          Aucune photo trouvée. Essayez un autre terme.
        </p>
      )}

      {/* Selected preview */}
      {selected && (
        <div className="flex items-center gap-3 p-3 bg-surface-container rounded-lg">
          <div className="w-12 h-12 relative rounded overflow-hidden flex-shrink-0">
            <Image src={selected} alt="Selected" fill className="object-cover" sizes="48px" />
          </div>
          <p className="text-sm text-on-surface-variant truncate flex-1">Image sélectionnée</p>
          <button
            type="button"
            onClick={() => onSelect('')}
            className="text-on-surface-variant hover:text-red-400 transition-colors"
          >
            <span className="material-symbols-outlined text-sm">close</span>
          </button>
        </div>
      )}
    </div>
  )
}
