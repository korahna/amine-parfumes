import { NextRequest, NextResponse } from 'next/server'

export async function GET(request: NextRequest) {
  const query = request.nextUrl.searchParams.get('query')
  if (!query) {
    return NextResponse.json({ error: 'Missing query parameter' }, { status: 400 })
  }

  const accessKey = process.env.NEXT_PUBLIC_UNSPLASH_ACCESS_KEY
  if (!accessKey) {
    return NextResponse.json({ error: 'Unsplash API key not configured' }, { status: 500 })
  }

  const res = await fetch(
    `https://api.unsplash.com/search/photos?query=${encodeURIComponent(query)}&orientation=squarish&per_page=12`,
    { headers: { Authorization: `Client-ID ${accessKey}` } }
  )

  if (!res.ok) {
    return NextResponse.json({ error: 'Unsplash API error' }, { status: res.status })
  }

  const data = await res.json()
  const photos = data.results.map((photo: { id: string; urls: { regular: string; small: string }; alt_description: string | null; user: { name: string } }) => ({
    id: photo.id,
    url: photo.urls.regular,
    thumb: photo.urls.small,
    alt: photo.alt_description ?? 'Perfume photo',
    author: photo.user.name,
  }))

  return NextResponse.json({ photos })
}
