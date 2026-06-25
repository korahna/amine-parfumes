-- ============================================
-- amine.parfume — Row Level Security
-- Migration 002: RLS policies
-- Run AFTER 001_tables.sql
-- ============================================

-- ============================================
-- PRODUCTS: public read, authenticated write
-- ============================================
ALTER TABLE products ENABLE ROW LEVEL SECURITY;

-- Anyone can view in-stock products (public storefront)
CREATE POLICY "products_public_read"
  ON products FOR SELECT
  USING (true);

-- Authenticated users (admin) can insert products
CREATE POLICY "products_admin_insert"
  ON products FOR INSERT
  WITH CHECK (auth.role() = 'authenticated');

-- Authenticated users (admin) can update products
CREATE POLICY "products_admin_update"
  ON products FOR UPDATE
  USING (auth.role() = 'authenticated');

-- Authenticated users (admin) can delete products
CREATE POLICY "products_admin_delete"
  ON products FOR DELETE
  USING (auth.role() = 'authenticated');

-- ============================================
-- ORDERS: public insert, authenticated read/update
-- ============================================
ALTER TABLE orders ENABLE ROW LEVEL SECURITY;

-- Anyone can place an order (public checkout, COD)
CREATE POLICY "orders_public_insert"
  ON orders FOR INSERT
  WITH CHECK (true);

-- Authenticated users (admin) can read all orders
CREATE POLICY "orders_admin_read"
  ON orders FOR SELECT
  USING (auth.role() = 'authenticated');

-- Authenticated users (admin) can update orders (status changes)
CREATE POLICY "orders_admin_update"
  ON orders FOR UPDATE
  USING (auth.role() = 'authenticated');

-- Authenticated users (admin) can delete orders
CREATE POLICY "orders_admin_delete"
  ON orders FOR DELETE
  USING (auth.role() = 'authenticated');

-- ============================================
-- CATEGORIES: public read, authenticated write
-- ============================================
ALTER TABLE categories ENABLE ROW LEVEL SECURITY;

-- Anyone can view categories (public navigation)
CREATE POLICY "categories_public_read"
  ON categories FOR SELECT
  USING (true);

-- Authenticated users (admin) can manage categories
CREATE POLICY "categories_admin_insert"
  ON categories FOR INSERT
  WITH CHECK (auth.role() = 'authenticated');

CREATE POLICY "categories_admin_update"
  ON categories FOR UPDATE
  USING (auth.role() = 'authenticated');

CREATE POLICY "categories_admin_delete"
  ON categories FOR DELETE
  USING (auth.role() = 'authenticated');
