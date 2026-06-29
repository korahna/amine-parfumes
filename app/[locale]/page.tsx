import { createClient } from '@/lib/supabase/server'
import { Navbar } from '@/components/shared/Navbar'
import { Footer } from '@/components/shared/Footer'
import { Hero } from '@/components/perfume/Hero'
import { Marquee } from '@/components/perfume/Marquee'
import { Showcase } from '@/components/perfume/Showcase'
import { FeaturedProducts } from '@/components/perfume/FeaturedProducts'
import { WhyUs } from '@/components/perfume/WhyUs'

export default async function HomePage() {
  const supabase = createClient()

  const { data: featured } = await supabase
    .from('products')
    .select('id, slug, name_fr, brand, type, price, images, scent_notes')
    .eq('featured', true)
    .eq('in_stock', true)
    .order('created_at', { ascending: false })
    .limit(8)

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

  return (
    <>
      <Navbar />
      <main>
        <Hero />
        <Marquee />
        <Showcase />
        <FeaturedProducts products={products} />
        <WhyUs />
      </main>
      <Footer />
    </>
  )
}
