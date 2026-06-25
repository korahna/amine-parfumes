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
  volume      INT,
  price       NUMERIC(10,2) NOT NULL,
  images      TEXT[] DEFAULT '{}',
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
  items          JSONB NOT NULL,
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
