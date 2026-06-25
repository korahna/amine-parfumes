export async function searchPerfumePhoto(query: string): Promise<string> {
  const res = await fetch(
    `https://api.unsplash.com/search/photos?query=${encodeURIComponent(query)}&orientation=squarish&per_page=10`,
    {
      headers: {
        Authorization: `Client-ID ${process.env.NEXT_PUBLIC_UNSPLASH_ACCESS_KEY}`,
      },
    }
  )
  const data = await res.json()
  return data.results[0]?.urls?.regular ?? '/images/placeholder.jpg'
}

export function getUnsplashUrl(url: string, size: 'card' | 'detail' | 'thumb'): string {
  const params = {
    card: '&w=600&h=600&fit=crop&q=85',
    detail: '&w=1200&h=1200&fit=crop&q=90',
    thumb: '&w=200&h=200&fit=crop&q=75',
  }
  return `${url}${params[size]}`
}

export const SEED_PERFUME_IMAGES = [
  'https://images.unsplash.com/photo-1541643600914-78b084683702?w=600',
  'https://images.unsplash.com/photo-1592945403244-b3fbafd7f539?w=600',
  'https://images.unsplash.com/photo-1619994403073-2cec844b8e63?w=600',
  'https://images.unsplash.com/photo-1544731612-de7f96afe55f?w=600',
  'https://images.unsplash.com/photo-1588514912908-e4621e8b8f74?w=600',
  'https://images.unsplash.com/photo-1523293182086-7651a899d37f?w=600',
]
