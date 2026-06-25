# amine.parfume — Project Intelligence File

> Claude reads this file at the start of every session. Keep it concise and accurate.

---

## Project Identity

- **Name:** amine.parfume
- **Type:** E-commerce website + Admin Dashboard
- **Niche:** Full perfumes & scent decants (échantillons)
- **Default Language:** French (`fr`) — Arabic (`ar`) as second language
- **Payment:** Cash on Delivery only (no payment gateway needed)
- **Goal:** Luxury, motion-rich, bilingual perfume store with real high-quality perfume photography

---

## Tech Stack

```
Framework:     Next.js 14+ (App Router)
Language:      TypeScript (strict mode)
Styling:       Tailwind CSS v3
UI Components: shadcn/ui (base primitives) + 21st.dev (premium interactive components)
Animations:    Framer Motion (motion library)
AI Images:     Unsplash API (real perfume photography, free & high-res)
Backend:       Supabase (PostgreSQL + Auth + Storage + Realtime)
State:         Zustand (client cart/UI) + Supabase (server data)
i18n:          next-intl (fr default, ar supported)
Icons:         Lucide React
```

---

## Design System

### Aesthetic Direction
**Luxury Dark Parfumerie** — Think Maison Margiela, Byredo, Serge Lutens.
Deep blacks, warm golds, rich burgundy accents. Serif display font + clean sans body.

### Color Palette (CSS Variables)
```css
--color-bg:           #0a0805   /* Near-black warm */
--color-surface:      #13100c   /* Card backgrounds */
--color-border:       #2a2218   /* Subtle borders */
--color-gold:         #c9a84c   /* Primary accent */
--color-gold-light:   #e8c97a   /* Hover states */
--color-text:         #f0ead8   /* Primary text */
--color-muted:        #8a7d65   /* Secondary text */
--color-burgundy:     #6b1f2a   /* Highlight accent */
```

### Typography
```
Display font:  'Cormorant Garamond' (Google Fonts) — headings, product names
Body font:     'DM Sans' — UI text, descriptions
Arabic font:   'Noto Serif Arabic' — RTL content
```

### Motion Rules (Framer Motion)
- **Page transitions:** fade + slight Y slide (0 → -8px), 400ms ease
- **Product cards:** scale(1.02) + gold border glow on hover, 250ms
- **Hero section:** staggered reveal — title (0ms), subtitle (150ms), CTA (300ms)
- **Image generation loader:** pulsing shimmer skeleton while NanoBanana generates
- **Cart drawer:** slide in from right, spring physics
- **Admin table rows:** stagger-in on mount, 50ms delay per row
- **Never:** jarring flashes, bounce effects, excessive parallax

---

## Site Structure

### Customer-Facing (`/`)
```
/                    → Homepage (hero, featured, categories)
/boutique            → All products grid with filters
/produit/[slug]      → Product detail + scent notes + add to cart
/panier              → Cart (COD only, no payment)
/commande            → Order form (name, phone, address, wilaya)
/confirmation        → Order success page
```

### Admin Dashboard (`/admin`)
```
/admin               → Dashboard overview (stats, recent orders)
/admin/produits      → Products list (CRUD)
/admin/produits/new  → Add product + AI image generator
/admin/commandes     → Orders management (status updates)
/admin/categories    → Category management
```

---

## Product Data Model

```typescript
type Product = {
  id: string
  slug: string
  name: { fr: string; ar: string }
  description: { fr: string; ar: string }
  type: 'full' | 'decant'           // Full bottle or scent sample
  brand: string
  scentNotes: {
    top: string[]
    heart: string[]
    base: string[]
  }
  volume: number                     // ml
  price: number                      // MAD (Moroccan Dirham)
  images: string[]                   // URLs (Unsplash / Pexels real photos)
  inStock: boolean
  featured: boolean
  category: string
  createdAt: Date
}

type Order = {
  id: string
  items: { productId: string; quantity: number; price: number }[]
  customer: {
    name: string
    phone: string
    address: string
    city: string
    wilaya: string
  }
  total: number
  status: 'pending' | 'confirmed' | 'shipped' | 'delivered' | 'cancelled'
  paymentMethod: 'cod'               // Always COD
  createdAt: Date
}
```

---

## Product Photography — Real Perfume Images

Use **real, high-quality perfume photography** instead of AI-generated images.
Sources are free, commercially usable, and look genuinely luxurious.

### Primary Source: Unsplash API (Free, no watermark)

```typescript
// Add to .env.local:
NEXT_PUBLIC_UNSPLASH_ACCESS_KEY=your_key_here  // get at unsplash.com/developers

// lib/unsplash.ts — search for real perfume photos
export async function searchPerfumePhoto(query: string): Promise<string> {
  const res = await fetch(
    `https://api.unsplash.com/search/photos?query=${encodeURIComponent(query)}&orientation=squarish&per_page=10`,
    { headers: { Authorization: `Client-ID ${process.env.NEXT_PUBLIC_UNSPLASH_ACCESS_KEY}` } }
  )
  const data = await res.json()
  // Return high-res URL — use ?w=800 for product cards, ?w=1200 for detail page
  return data.results[0]?.urls?.regular ?? '/images/placeholder.jpg'
}
```

### Curated Search Queries per Brand/Type
Use these in the admin dashboard when adding products:

```
Chanel No.5:        "chanel perfume bottle luxury"
Oud / Oriental:     "oud perfume arabic luxury bottle"
Floral feminine:    "floral perfume bottle pink"
Woody / Masculine:  "luxury cologne bottle dark"
Decant / Sample:    "perfume sample vial glass"
Generic luxury:     "luxury perfume bottle gold black"
Hero / banner:      "perfume flat lay flowers luxury"
```

### Unsplash URL Sizing
```typescript
// Always append sizing params to Unsplash URLs:
const productCard  = `${url}&w=600&h=600&fit=crop&q=85`   // 1:1 square
const detailHero   = `${url}&w=1200&h=1200&fit=crop&q=90` // large detail
const thumbnail    = `${url}&w=200&h=200&fit=crop&q=75`   // cart/admin list
```

### Fallback: Pexels API (if Unsplash quota exceeded)
```typescript
// PEXELS_API_KEY in .env.local (server-side only)
const res = await fetch(
  `https://api.pexels.com/v1/search?query=luxury+perfume+bottle&per_page=5`,
  { headers: { Authorization: process.env.PEXELS_API_KEY! } }
)
const data = await res.json()
return data.photos[0]?.src?.large2x
```

### Static Curated Images (For Seed Data)
Use these real Unsplash perfume photo URLs for seeding/demo products:
```typescript
export const SEED_PERFUME_IMAGES = [
  'https://images.unsplash.com/photo-1541643600914-78b084683702?w=600', // amber bottle
  'https://images.unsplash.com/photo-1592945403244-b3fbafd7f539?w=600', // dark luxury
  'https://images.unsplash.com/photo-1619994403073-2cec844b8e63?w=600', // gold cap
  'https://images.unsplash.com/photo-1544731612-de7f96afe55f?w=600', // flat lay flowers
  'https://images.unsplash.com/photo-1588514912908-e4621e8b8f74?w=600', // oriental oud
  'https://images.unsplash.com/photo-1523293182086-7651a899d37f?w=600', // minimal white
]
```

### In Admin: Image Selection Flow
When adding a product in `/admin/produits/new`:
1. Admin types brand + product name
2. Auto-search Unsplash with `"${brand} perfume"` query
3. Show 6 photo options in a grid — admin clicks to select
4. Selected URL saved to `products.images[]` in Supabase
5. Show `<Image>` preview before saving

---

## UI/UX — Pro Max Standards

This is a luxury brand. Every screen must feel like **Byredo.com** or **Diptyque.com** — not a generic Shopify theme.
These rules override all default shadcn/ui and 21st.dev styling. Always customize to match the design system.

---

### Layout Principles
- **Generous whitespace** — padding should feel excessive: `py-24`, `gap-16`, not `py-8`
- **Max content width:** `max-w-6xl` for grids, `max-w-4xl` for text-heavy pages
- **Product grid:** 2 columns mobile → 3 columns desktop — never 4 (too crowded for luxury)
- **Section rhythm:** alternate `bg-[#0a0805]` and `bg-[#13100c]` between sections
- **No card borders by default** — use shadow and background contrast instead

### Typography Rules
- **Hero titles:** `text-6xl md:text-8xl` Cormorant Garamond, `font-light`, `tracking-widest`
- **Product names:** `text-2xl` Cormorant, `font-normal`, gold color on hover
- **Body copy:** `text-base` DM Sans, `leading-relaxed`, `text-[#8a7d65]`
- **Price:** `text-xl` DM Sans, `text-[#c9a84c]`, `font-medium`
- **Labels/badges:** `text-xs` DM Sans, `tracking-[0.2em]` UPPERCASE
- **Never `font-bold`** on display text — use weight contrast (light vs normal)

### Button System
```tsx
// Primary — gold fill
className="bg-[#c9a84c] text-[#0a0805] hover:bg-[#e8c97a] transition-colors px-8 py-3 text-xs tracking-[0.15em] uppercase"

// Secondary — gold outline
className="border border-[#c9a84c] text-[#c9a84c] hover:bg-[#c9a84c]/10 transition-colors px-8 py-3 text-xs tracking-[0.15em] uppercase"

// Ghost — minimal
className="text-[#8a7d65] hover:text-[#f0ead8] transition-colors text-xs tracking-widest uppercase underline-offset-4 hover:underline"
```

### Hero Section Spec
```
Full-bleed perfume flat lay image (use SEED_PERFUME_IMAGES[3])
Overlay: bg-gradient-to-t from-[#0a0805] via-[#0a0805]/60 to-transparent
Centered text:
  "amine.parfume"         → Cormorant 80px italic, tracking-[0.3em]
  "L'art du parfum"       → DM Sans muted, animate 150ms after title
  [Découvrir la boutique →] → ghost button CTA, animate 300ms after title
Framer Motion stagger: title (0ms) → subtitle (150ms) → CTA (300ms)
```

### Product Card Spec
```
┌─────────────────────┐
│   [Photo 1:1]       │  aspect-square, object-cover, scale-105 on hover (700ms ease)
├─────────────────────┤
│  BRAND · TYPE       │  text-[10px] tracking-[0.25em] uppercase muted mt-3
│  Product Name       │  text-lg Cormorant text-[#f0ead8]
│  Rose · Oud · Musc  │  scent pills: border border-[#2a2218] text-[10px] rounded-full
│  250 MAD  [+Panier] │  gold price left, outline CTA right
└─────────────────────┘
Card hover: ring-1 ring-[#c9a84c]/30 transition-all
```

### Navigation Spec
```
Fixed top, h-16, bg-[#0a0805]/80 backdrop-blur-md border-b border-[#2a2218]/50
Grid 3 cols:
  Left:   "amine.parfume" italic Cormorant text-xl
  Center: Accueil | Boutique | Décants — text-[10px] tracking-[0.2em] uppercase
  Right:  LanguageToggle + cart icon with gold count badge (w-4 h-4 rounded-full)
Mobile:   hamburger → full-screen overlay, staggered link entrance
```

### Loading States
- **Skeleton loaders only** — no spinners ever (spinners feel cheap)
- Skeleton shimmer: `from-[#13100c] via-[#1f1a12] to-[#13100c]` animated gradient
- Skeletons must match exact dimensions of the real component
- Page transitions: `<AnimatePresence mode="wait">` on all route changes

### Empty & Error States
- Empty cart: large centered perfume icon, Cormorant italic message, CTA to shop
- No results: `"Aucun parfum ne correspond à votre recherche..."` — poetic, never generic
- Errors: minimal message + retry — no red boxes, no harsh colors

### Mobile UX Rules
- Touch targets minimum `44px` height
- Product grid: always 2 columns on mobile
- Cart drawer: full-height on mobile, `max-w-[420px]` on desktop
- No horizontal scroll anywhere
- Bottom nav bar on mobile: Home | Shop | Cart

### Accessibility
- All images: meaningful `alt` in both FR and AR
- Color contrast ≥ 4.5:1 for all body text
- Focus rings: `focus-visible:outline-2 focus-visible:outline-[#c9a84c]`
- `aria-label` on all icon-only buttons (cart, search, language toggle)

---

## Components — shadcn/ui Base + 21st.dev Premium

**Strategy:** shadcn/ui for primitives, 21st.dev for complex interactive components, custom code for domain-specific perfume components. Always override default styles to match the luxury design system above.

### Install shadcn Base
```bash
npx shadcn@latest add button card badge drawer dialog sheet select checkbox sonner separator skeleton
```

### Install 21st.dev Premium Components
```bash
# Install any component via shadcn CLI:
npx shadcn@latest add "https://21st.dev/r/[author]/[component-name]"

# Key components for this project:
npx shadcn@latest add "https://21st.dev/r/shadcn/animated-card"       # product cards
npx shadcn@latest add "https://21st.dev/r/shadcn/drawer"              # cart drawer
npx shadcn@latest add "https://21st.dev/r/shadcn/sidebar"             # admin sidebar
npx shadcn@latest add "https://21st.dev/r/shadcn/dropzone"            # image upload
npx shadcn@latest add "https://21st.dev/r/shadcn/data-table"          # admin orders table
```

### Component Map

| Component | Source | File | Notes |
|-----------|--------|------|-------|
| `ProductCard` | Custom | `components/perfume/ProductCard.tsx` | Image zoom, gold hover ring, scent pills |
| `CartDrawer` | 21st.dev Drawer | `components/perfume/CartDrawer.tsx` | Slide right (left AR), spring physics |
| `ScentPyramid` | Custom SVG | `components/perfume/ScentPyramid.tsx` | 3-tier triangle, gold fill opacity |
| `ImageGallery` | Custom | `components/perfume/ImageGallery.tsx` | 1 main + 3 thumbs, fade on swap |
| `LanguageToggle` | Custom | `components/shared/LanguageToggle.tsx` | FR \| AR text, RTL-aware |
| `Navbar` | Custom | `components/shared/Navbar.tsx` | Glass blur, cart badge |
| `ProductFilters` | shadcn Select | `components/perfume/ProductFilters.tsx` | Zustand-powered, no network |
| `OrderStatusBadge` | shadcn Badge | `components/admin/OrderStatusBadge.tsx` | Color per status |
| `AdminSidebar` | 21st.dev Sidebar | `components/admin/AdminSidebar.tsx` | Espresso dark, gold active border |
| `UnsplashPicker` | Custom | `components/admin/UnsplashPicker.tsx` | 3×2 grid, checkmark overlay |
| `SkeletonCard` | shadcn Skeleton | `components/perfume/SkeletonCard.tsx` | Exact card dims, shimmer |
| `AdminTable` | 21st.dev DataTable | `components/admin/OrdersTable.tsx` | Sortable, paginated |
| `ImageDropzone` | 21st.dev Dropzone | `components/admin/ImageDropzone.tsx` | Drag & drop upload |

---

### Key Custom Component Specs

#### ProductCard
```tsx
// Wrapper: relative overflow-hidden group cursor-pointer
// Image: aspect-square object-cover scale-100 group-hover:scale-105 duration-700 ease-out
// Hover: ring-1 ring-[#c9a84c]/30 on card wrapper
// Brand: text-[10px] tracking-[0.25em] uppercase text-[#8a7d65] mt-3
// Name: text-lg font-normal text-[#f0ead8] font-[Cormorant_Garamond]
// Pills: text-[10px] border border-[#2a2218] text-[#8a7d65] px-2 py-0.5 rounded-full
// Footer: flex justify-between — price text-[#c9a84c] | outline CTA button
```

#### CartDrawer (21st.dev base — override styles)
```tsx
// Width: w-full max-w-[420px]
// Background: bg-[#0d0a07] border-s border-[#2a2218]
// Header: "Votre Panier" Cormorant 24px + item count badge
// Item row: image 64×64 | name+brand stacked | qty − [n] + | price
// Qty controls: gold text, minimal border
// Footer sticky: subtotal row + full-width gold "Commander" button
// Empty: centered Lucide icon + "Votre panier est vide" italic Cormorant
// Animation: x "100%"→0, spring { stiffness: 300, damping: 30 }
```

#### ScentPyramid
```tsx
// SVG triangle divided into 3 horizontal tiers
// Top (smallest):  Notes de tête  — fill #c9a84c opacity 30%
// Heart (middle):  Notes de cœur  — fill #c9a84c opacity 50%
// Base (largest):  Notes de fond  — fill #c9a84c opacity 70%
// Note names listed beside each tier as text-[10px] tracking-widest muted
```

#### AdminSidebar (21st.dev base — override styles)
```tsx
// Width: w-60 | bg-[#0d0a07] | border-e border-[#1a1410]
// Active item: bg-[#1a1410] text-[#f0ead8] border-s-2 border-[#c9a84c]
// Hover: bg-[#1a1410]/50 text-[#f0ead8] transition-colors
// Sections: Dashboard | Produits | Commandes | Catégories | Paramètres
```

#### OrderStatusBadge
```tsx
const statusStyles = {
  pending:   'bg-[#c9a84c]/10 text-[#c9a84c] border-[#c9a84c]/30',
  confirmed: 'bg-blue-500/10  text-blue-400  border-blue-500/30',
  shipped:   'bg-purple-500/10 text-purple-400 border-purple-500/30',
  delivered: 'bg-green-500/10 text-green-400  border-green-500/30',
  cancelled: 'bg-red-500/10   text-red-400    border-red-500/30',
}
// Base: text-[10px] tracking-widest uppercase border rounded-full px-2.5 py-0.5
```

---

## Internationalization (FR / AR)

```typescript
// Default locale: fr
// Supported: ['fr', 'ar']
// RTL: Arabic requires dir="rtl" on <html>

// next-intl setup in next.config.ts:
// defaultLocale: 'fr'
// locales: ['fr', 'ar']

// Translation file structure:
// /messages/fr.json
// /messages/ar.json

// Key naming:
// nav.home, nav.shop, product.addToCart, checkout.cod, admin.addProduct
```

### RTL Rules
- When locale is `ar`, add `dir="rtl"` to `<html>` and `font-family: 'Noto Serif Arabic'`
- Flex row directions flip automatically with RTL
- Use `ms-` / `me-` Tailwind classes (margin-start/end) instead of `ml-` / `mr-`
- Drawer slides from LEFT in AR mode (opposite of FR/default)

---

## Supabase Backend

### Installation
```bash
npm install @supabase/supabase-js @supabase/ssr
```

### Client Setup (Two Clients — Always)
```typescript
// lib/supabase/client.ts — Browser (use in Client Components)
import { createBrowserClient } from '@supabase/ssr'
export const createClient = () =>
  createBrowserClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!
  )

// lib/supabase/server.ts — Server (use in Server Components, API Routes, Actions)
import { createServerClient } from '@supabase/ssr'
import { cookies } from 'next/headers'
export const createClient = () => {
  const cookieStore = cookies()
  return createServerClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!,
    { cookies: { getAll: () => cookieStore.getAll(),
                 setAll: (c) => c.forEach(({ name, value, options }) => cookieStore.set(name, value, options)) } }
  )
}
```

### Middleware (Required for Auth Session Refresh)
```typescript
// middleware.ts — root of project
import { createServerClient } from '@supabase/ssr'
import { NextResponse, type NextRequest } from 'next/server'

export async function middleware(request: NextRequest) {
  let supabaseResponse = NextResponse.next({ request })
  const supabase = createServerClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!,
    { cookies: {
        getAll: () => request.cookies.getAll(),
        setAll: (c) => c.forEach(({ name, value, options }) =>
          supabaseResponse.cookies.set(name, value, options))
    }}
  )
  await supabase.auth.getUser() // refreshes session

  // Protect /admin routes
  const { data: { user } } = await supabase.auth.getUser()
  if (request.nextUrl.pathname.startsWith('/admin') && !user) {
    return NextResponse.redirect(new URL('/admin/login', request.url))
  }
  return supabaseResponse
}
export const config = { matcher: ['/admin/:path*'] }
```

---

### Database Schema (Run in Supabase SQL Editor)

```sql
-- ============================================
-- PRODUCTS TABLE
-- ============================================
CREATE TABLE products (
  id          UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  slug        TEXT UNIQUE NOT NULL,
  name_fr     TEXT NOT NULL,
  name_ar     TEXT NOT NULL,
  description_fr TEXT,
  description_ar TEXT,
  type        TEXT NOT NULL CHECK (type IN ('full', 'decant')),
  brand       TEXT NOT NULL,
  scent_notes JSONB DEFAULT '{"top":[],"heart":[],"base":[]}',
  volume      INT,                    -- ml
  price       NUMERIC(10,2) NOT NULL, -- MAD
  images      TEXT[] DEFAULT '{}',   -- Unsplash/Pexels real photo URLs
  in_stock    BOOLEAN DEFAULT true,
  featured    BOOLEAN DEFAULT false,
  category    TEXT,
  created_at  TIMESTAMPTZ DEFAULT NOW()
);

-- ============================================
-- ORDERS TABLE
-- ============================================
CREATE TABLE orders (
  id             UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  items          JSONB NOT NULL,  -- [{productId, quantity, price, name}]
  customer_name  TEXT NOT NULL,
  customer_phone TEXT NOT NULL,
  address        TEXT NOT NULL,
  city           TEXT NOT NULL,
  wilaya         TEXT NOT NULL,
  total          NUMERIC(10,2) NOT NULL,
  status         TEXT DEFAULT 'pending'
                 CHECK (status IN ('pending','confirmed','shipped','delivered','cancelled')),
  payment_method TEXT DEFAULT 'cod',
  notes          TEXT,
  created_at     TIMESTAMPTZ DEFAULT NOW()
);

-- ============================================
-- CATEGORIES TABLE
-- ============================================
CREATE TABLE categories (
  id       UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  slug     TEXT UNIQUE NOT NULL,
  name_fr  TEXT NOT NULL,
  name_ar  TEXT NOT NULL,
  sort_order INT DEFAULT 0
);

-- ============================================
-- ROW LEVEL SECURITY
-- ============================================

-- Products: public read, admin write only
ALTER TABLE products ENABLE ROW LEVEL SECURITY;
CREATE POLICY "products_public_read"  ON products FOR SELECT USING (true);
CREATE POLICY "products_admin_insert" ON products FOR INSERT WITH CHECK (auth.role() = 'authenticated');
CREATE POLICY "products_admin_update" ON products FOR UPDATE USING (auth.role() = 'authenticated');
CREATE POLICY "products_admin_delete" ON products FOR DELETE USING (auth.role() = 'authenticated');

-- Orders: public insert (anyone can place an order), admin read/update
ALTER TABLE orders ENABLE ROW LEVEL SECURITY;
CREATE POLICY "orders_public_insert" ON orders FOR INSERT WITH CHECK (true);
CREATE POLICY "orders_admin_read"    ON orders FOR SELECT USING (auth.role() = 'authenticated');
CREATE POLICY "orders_admin_update"  ON orders FOR UPDATE USING (auth.role() = 'authenticated');

-- Categories: public read, admin write
ALTER TABLE categories ENABLE ROW LEVEL SECURITY;
CREATE POLICY "categories_public_read"  ON categories FOR SELECT USING (true);
CREATE POLICY "categories_admin_write"  ON categories FOR ALL USING (auth.role() = 'authenticated');
```

---

### Storage Bucket (Product Images)
```sql
-- Run in Supabase SQL Editor
INSERT INTO storage.buckets (id, name, public)
VALUES ('product-images', 'product-images', true);

-- Allow public read
CREATE POLICY "product_images_public_read" ON storage.objects
  FOR SELECT USING (bucket_id = 'product-images');

-- Allow admin upload
CREATE POLICY "product_images_admin_upload" ON storage.objects
  FOR INSERT WITH CHECK (
    bucket_id = 'product-images' AND auth.role() = 'authenticated'
  );
```

Upload images to this bucket so URLs are permanent and self-hosted:
```typescript
// lib/supabase/uploadImage.ts
// Use this to cache Unsplash images in your own Supabase Storage
// (avoids Unsplash rate limits in production)
export async function cacheRemoteImage(imageUrl: string, fileName: string) {
  const supabase = createClient()           // server client
  const blob = await fetch(imageUrl).then(r => r.blob())
  const { data, error } = await supabase.storage
    .from('product-images')
    .upload(`products/${fileName}.jpg`, blob, { contentType: 'image/jpeg', upsert: true })
  if (error) throw error
  const { data: { publicUrl } } = supabase.storage
    .from('product-images').getPublicUrl(data.path)
  return publicUrl   // store this in products.images[]
}
```

---

### Admin Auth (Supabase Email Auth)
```typescript
// Admin logs in with email/password — no public registration
// Create admin user once via Supabase Dashboard > Authentication > Users

// app/admin/login/page.tsx (client component)
const { error } = await supabase.auth.signInWithPassword({ email, password })

// app/admin/layout.tsx (server component) — verify session
const { data: { user } } = await supabase.auth.getUser()
if (!user) redirect('/admin/login')
```

---

### Common Supabase Queries

```typescript
// Fetch all products (Server Component)
const supabase = createClient()
const { data: products } = await supabase
  .from('products')
  .select('*')
  .eq('in_stock', true)
  .order('created_at', { ascending: false })

// Fetch featured products
const { data: featured } = await supabase
  .from('products')
  .select('*')
  .eq('featured', true)
  .limit(6)

// Get single product by slug
const { data: product } = await supabase
  .from('products')
  .select('*')
  .eq('slug', slug)
  .single()

// Place an order (Server Action)
const { data, error } = await supabase
  .from('orders')
  .insert({ items, customer_name, customer_phone, address, city, wilaya, total })
  .select('id')
  .single()

// Admin: update order status
await supabase
  .from('orders')
  .update({ status: 'confirmed' })
  .eq('id', orderId)

// Admin: get orders with pagination
const { data: orders, count } = await supabase
  .from('orders')
  .select('*', { count: 'exact' })
  .order('created_at', { ascending: false })
  .range(page * 20, (page + 1) * 20 - 1)
```

---

### Realtime (Live Order Notifications in Admin)
```typescript
// Admin dashboard — subscribe to new orders in real-time
useEffect(() => {
  const channel = supabase
    .channel('new_orders')
    .on('postgres_changes', {
      event: 'INSERT', schema: 'public', table: 'orders'
    }, (payload) => {
      toast(`🛒 Nouvelle commande de ${payload.new.customer_name}`)
      setOrders(prev => [payload.new, ...prev])
    })
    .subscribe()
  return () => supabase.removeChannel(channel)
}, [])
```

---

### ⚠️ Supabase Security Rules
- **NEVER** use `service_role` key in client-side code — server/API routes only
- **ALWAYS** enable RLS on every table before going to production
- The `anon` key is public and safe — RLS policies are what protect data
- Use `auth.role() = 'authenticated'` in policies for admin-only operations
- Supabase Table Editor bypasses RLS (uses service_role) — use it for debugging only

---

## Environment Variables

```env
# .env.local
NEXT_PUBLIC_SUPABASE_URL=        # From Supabase Dashboard > Settings > API
NEXT_PUBLIC_SUPABASE_ANON_KEY=   # Publishable key (sb_publishable_xxx) — safe for client
SUPABASE_SERVICE_ROLE_KEY=       # Secret key — server/API routes ONLY, never expose
NEXT_PUBLIC_UNSPLASH_ACCESS_KEY= # From unsplash.com/developers — safe for client
PEXELS_API_KEY=                  # From pexels.com/api — server-side only
NEXT_PUBLIC_SITE_URL=            # https://amine-parfume.com
```

---

## Development Commands

```bash
npm run dev          # Start dev server (localhost:3000)
npm run build        # Production build
npm run lint         # ESLint check
npm run type-check   # TypeScript strict check
```

---

## File Structure

```
amine-parfume/
├── app/
│   ├── [locale]/
│   │   ├── page.tsx              # Homepage
│   │   ├── boutique/page.tsx     # Shop
│   │   ├── produit/[slug]/       # Product detail
│   │   ├── panier/page.tsx       # Cart
│   │   └── commande/page.tsx     # Checkout
│   └── admin/
│       ├── page.tsx              # Dashboard
│       ├── produits/page.tsx     # Products CRUD
│       └── commandes/page.tsx    # Orders
├── components/
│   ├── ui/                       # shadcn/ui + 21st.dev components
│   ├── perfume/                  # Domain components (ProductCard, ScentNotes)
│   ├── admin/                    # Admin-specific components
│   └── shared/                   # LanguageToggle, Navbar, Footer
├── lib/
│   ├── supabase/
│   │   ├── client.ts             # Browser Supabase client
│   │   ├── server.ts             # Server Supabase client
│   │   └── uploadImage.ts        # Unsplash → Supabase Storage cache
│   ├── unsplash.ts               # Real perfume photo search helpers
│   ├── store.ts                  # Zustand (cart, language)
│   └── utils.ts                  # cn() and helpers
├── supabase/
│   └── migrations/
│       ├── 001_tables.sql        # products, orders, categories
│       ├── 002_rls.sql           # Row Level Security policies
│       └── 003_storage.sql       # product-images bucket
├── messages/
│   ├── fr.json
│   └── ar.json
├── public/
│   └── images/
└── CLAUDE.md                     # ← This file
```

---

## UI/UX — Pro Standards

This is a luxury brand. Every screen must feel like Byredo.com or Diptyque.com — not a generic Shopify theme.
Apply these rules on every component you build.

---

### Layout Principles
- **Generous whitespace** — padding should feel excessive. `py-24`, `gap-16`, not `py-8`
- **Max content width:** `max-w-6xl` for content, `max-w-4xl` for text-heavy pages
- **Grid:** 2 columns mobile → 3 desktop for product grid. Never 4 on desktop (too crowded)
- **Section rhythm:** every section alternates between dark bg (`#0a0805`) and slightly lighter (`#13100c`)
- **No card borders by default** — use shadow and background contrast instead

### Typography Rules
- **Hero titles:** `text-6xl md:text-8xl` Cormorant Garamond, `font-light`, `tracking-widest`
- **Product names:** `text-2xl` Cormorant, `font-normal`, gold color on hover
- **Body copy:** `text-base` DM Sans, `leading-relaxed`, muted color (`#8a7d65`)
- **Price:** `text-xl` DM Sans, gold (`#c9a84c`), `font-medium`
- **Labels/badges:** `text-xs` DM Sans, `tracking-[0.2em]` UPPERCASE
- **Never use `font-bold`** for display text — luxury brands use weight contrast, not boldness

### Product Card Design
```
┌─────────────────────┐
│                     │
│   [Real Photo 1:1]  │  ← aspect-ratio: 1/1, object-cover, subtle zoom on hover
│                     │
├─────────────────────┤
│  BRAND NAME         │  ← text-xs uppercase tracking-widest muted
│  Product Name       │  ← text-xl Cormorant gold
│  Rose · Oud · Musc  │  ← scent note pills, text-xs muted border
│                     │
│  250 MAD  [+Panier] │  ← price left, CTA button right
└─────────────────────┘
```
- Image hover: `scale(1.04)` with `transition-transform duration-700 ease-out`
- Card hover: `border border-[#c9a84c]/20` appears (invisible by default)
- CTA button: minimal — gold outline, fills on hover

### Hero Section
```
┌──────────────────────────────────────┐
│  [Full-bleed perfume flat lay image] │
│  dark overlay gradient bottom        │
│                                      │
│        amine.parfume                 │  ← Cormorant 80px, letter-spacing 0.3em
│   L'art du parfum au Maroc           │  ← DM Sans, muted, animate after title
│                                      │
│      [Découvrir la boutique →]       │  ← Gold underline CTA, no box
└──────────────────────────────────────┘
```
- Background: use `SEED_PERFUME_IMAGES[3]` (flat lay with flowers)
- Overlay: `bg-gradient-to-t from-[#0a0805] via-[#0a0805]/60 to-transparent`
- Text enters: stagger with Framer Motion (title → subtitle → CTA, 150ms apart)

### Navigation
- **Sticky top**, `backdrop-blur-md`, `bg-[#0a0805]/80` — glass effect
- Logo left (Cormorant italic), links center (`text-xs tracking-widest`), cart icon right
- Cart icon shows item count badge in gold
- Language toggle: FR | AR — minimal text, no flags
- Mobile: hamburger → full-screen overlay menu with staggered link entrance

### Product Detail Page
- **Left:** image gallery — 1 large main image + 3 thumbnails below, click to swap
- **Right:** brand, name, price, scent pyramid (top/heart/base notes), volume selector, add to cart
- **Scent Pyramid:** visual triangle diagram showing note layers (SVG or CSS)
- **Below fold:** full description, suggested pairings

### Buttons
```typescript
// Primary CTA — gold fill
"bg-[#c9a84c] text-[#0a0805] hover:bg-[#e8c97a] transition-colors px-8 py-3 text-xs tracking-[0.15em] uppercase"

// Secondary — gold outline
"border border-[#c9a84c] text-[#c9a84c] hover:bg-[#c9a84c]/10 transition-colors px-8 py-3 text-xs tracking-[0.15em] uppercase"

// Ghost — for less prominent actions
"text-[#8a7d65] hover:text-[#f0ead8] transition-colors text-xs tracking-widest uppercase underline-offset-4 hover:underline"
```

### Loading States
- **Product grid skeleton:** dark shimmer cards matching exact card dimensions
- **Image loading:** blur placeholder (`placeholder="blur"` with `blurDataURL`)
- **Page transitions:** `<AnimatePresence mode="wait">` wrapping page content
- **No spinners** — use skeleton loaders only (spinners feel cheap)

### Empty & Error States
- Empty cart: large centered perfume icon (Lucide), Cormorant italic message, CTA to shop
- No results: poetic message in French ("Aucun parfum ne correspond à votre recherche...")
- Error: minimal — just a message and retry, no red error boxes

### Mobile UX Rules
- Touch targets minimum `44px` height
- Bottom navigation bar on mobile: Home | Shop | Cart | (Search)
- Cart drawer is full-height on mobile, 480px wide on desktop
- Product grid: 2 columns on mobile, always
- No horizontal scroll anywhere

### Admin Dashboard UX
- Sidebar: dark `#13100c`, active item has gold left border
- Data tables: zebra striping with `#13100c` / `#0a0805` alternating rows
- Status badges color map:
  - `pending` → amber/gold
  - `confirmed` → blue
  - `shipped` → purple
  - `delivered` → green
  - `cancelled` → red/muted
- Add product form: two-column layout (FR fields left, AR fields right)
- Image selector: 3×2 grid of Unsplash results, click to select, checkmark overlay

### Accessibility
- All images have meaningful `alt` text in both FR and AR
- Color contrast ratio ≥ 4.5:1 for all body text
- Focus rings: `focus-visible:outline focus-visible:outline-2 focus-visible:outline-[#c9a84c]`
- Keyboard navigable cart drawer and mobile menu
- `aria-label` on icon-only buttons (cart, search, language toggle)

---



1. **TypeScript strict** — no `any`, no `@ts-ignore`
2. **Server Components by default** — add `'use client'` only when needed
3. **Tailwind only** — no inline styles, no CSS modules (except global variables)
4. **Use `cn()` helper** for conditional class merging
5. **All text** must go through `useTranslations()` — no hardcoded French/Arabic strings
6. **Images** — always use `next/image` with `width`, `height`, and `alt`
7. **NanoBanana calls** — always server-side (API route) to protect the key
8. **Supabase server client** — use in Server Components and Server Actions only
9. **Supabase browser client** — use in Client Components only
10. **Admin routes** — protected by middleware via `supabase.auth.getUser()`
11. **Framer Motion** — wrap animated sections in `<AnimatePresence>` for exit animations
12. **Error states** — always handle loading + error + empty states for product lists
13. **RLS first** — every new Supabase table must have RLS enabled before shipping

---

## Do Not

- ❌ Use a payment gateway (COD only)
- ❌ Hardcode prices in non-MAD currency
- ❌ Expose `SUPABASE_SERVICE_ROLE_KEY` in client-side code or `NEXT_PUBLIC_` vars
- ❌ Expose `PEXELS_API_KEY` in client-side code or `NEXT_PUBLIC_` vars
- ❌ Use `ml-` / `mr-` classes (use `ms-` / `me-` for RTL support)
- ❌ Add unnecessary dependencies — check if shadcn/ui already covers it
- ❌ Use `Inter`, `Roboto`, or `Arial` fonts (luxury brand, use Cormorant + DM Sans)
- ❌ Ship any table without RLS enabled (Supabase alerts you, but don't ignore it)
- ❌ Use the Supabase Table Editor as a data source — it bypasses RLS, debug only
- ❌ Use placeholder/lorem images — always use real Unsplash perfume photos
- ❌ Use `font-bold` on display headings — use weight contrast (light vs normal)
- ❌ Use colored backgrounds (red, green, blue) for UI states — stay in the gold/dark palette
- ❌ Add loading spinners — use skeleton loaders only
- ❌ Use more than 3 columns in the product grid on desktop
