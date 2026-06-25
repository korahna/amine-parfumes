-- ============================================
-- amine.parfume — Database Tables
-- Migration 001: Core schema
-- ============================================

-- Enable UUID generation
CREATE EXTENSION IF NOT EXISTS "pgcrypto";

-- ============================================
-- CATEGORIES TABLE
-- ============================================
CREATE TABLE categories (
  id         UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  slug       TEXT UNIQUE NOT NULL,
  name_fr    TEXT NOT NULL,
  name_ar    TEXT NOT NULL,
  sort_order INT DEFAULT 0,
  created_at TIMESTAMPTZ DEFAULT NOW()
);

-- ============================================
-- PRODUCTS TABLE
-- ============================================
CREATE TABLE products (
  id             UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  slug           TEXT UNIQUE NOT NULL,
  name_fr        TEXT NOT NULL,
  name_ar        TEXT NOT NULL,
  description_fr TEXT,
  description_ar TEXT,
  type           TEXT NOT NULL CHECK (type IN ('full', 'decant')),
  brand          TEXT NOT NULL,
  scent_notes    JSONB DEFAULT '{"top":[],"heart":[],"base":[]}',
  volume         INT,                     -- ml
  price          NUMERIC(10,2) NOT NULL,  -- MAD
  images         TEXT[] DEFAULT '{}',     -- Unsplash/Pexels real photo URLs
  in_stock       BOOLEAN DEFAULT true,
  featured       BOOLEAN DEFAULT false,
  category       TEXT,
  created_at     TIMESTAMPTZ DEFAULT NOW()
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
                 CHECK (status IN ('pending', 'confirmed', 'shipped', 'delivered', 'cancelled')),
  payment_method TEXT DEFAULT 'cod' CHECK (payment_method = 'cod'),
  notes          TEXT,
  created_at     TIMESTAMPTZ DEFAULT NOW()
);

-- ============================================
-- INDEXES
-- ============================================

-- Products: fast lookups by slug, category, featured, brand
CREATE INDEX idx_products_slug ON products (slug);
CREATE INDEX idx_products_category ON products (category);
CREATE INDEX idx_products_brand ON products (brand);
CREATE INDEX idx_products_type ON products (type);
CREATE INDEX idx_products_created_at ON products (created_at DESC);
CREATE INDEX idx_products_featured ON products (featured) WHERE featured = true;
CREATE INDEX idx_products_in_stock ON products (in_stock) WHERE in_stock = true;

-- Partial composite index: stock + featured for homepage queries
CREATE INDEX idx_products_homepage ON products (featured, created_at DESC)
  WHERE in_stock = true;

-- Orders: fast lookups by status and date
CREATE INDEX idx_orders_status ON orders (status);
CREATE INDEX idx_orders_created_at ON orders (created_at DESC);

-- Categories: sort order for display
CREATE INDEX idx_categories_sort_order ON categories (sort_order);
