import { createClient } from '@/lib/supabase/server'
import { Navbar } from '@/components/shared/Navbar'
import { Footer } from '@/components/shared/Footer'
import { Hero, type HeroSlide } from '@/components/perfume/Hero'
import { Marquee } from '@/components/perfume/Marquee'
import { Showcase } from '@/components/perfume/Showcase'
import { FeaturedProducts } from '@/components/perfume/FeaturedProducts'
import { WhyUs } from '@/components/perfume/WhyUs'

export default async function HomePage() {
  const supabase = createClient()

  const [{ data: featured }, { data: heroData }] = await Promise.all([
    supabase
      .from('products')
      .select('id, slug, name_fr, brand, type, price, images, scent_notes')
      .eq('featured', true)
      .eq('in_stock', true)
      .order('created_at', { ascending: false })
      .limit(8),
    supabase
      .from('homepage_hero')
      .select('*')
      .eq('is_active', true)
      .order('sort_order')
      .limit(5),
  ])

  const products = (featured ?? []).map((p) => ({
    id: p.id,
    slug: p.slug,
    name: p.name_fr,
    brand: p.brand,
    type: p.type as 'full' | 'decant',
    price: Number(p.price),
    image: p.images?.[0] ?? '/images/placeholder.jpg',
    scentNotes: [
      ...((p.scent_notes?.top as string[]) ?? []),
      ...((p.scent_notes?.heart as string[]) ?? []),
      ...((p.scent_notes?.base as string[]) ?? []),
    ].slice(0, 3),
  }))

  const heroSlides: HeroSlide[] = (heroData ?? []).map((s) => ({
    id: s.id,
    src: s.image_url,
    name: s.name,
    sub: s.sub ?? '',
    mood: s.mood ?? '',
    accent: s.accent ?? '#c9a227',
    tag: s.tag ?? 'Homme',
  }))

  return (
    <>
      <Navbar />
      <main>
        <Hero slides={heroSlides} />
        <Marquee />
        <Showcase />
        <FeaturedProducts products={products} />
        <WhyUs />
      </main>
      <Footer />
    </>
  )
}
