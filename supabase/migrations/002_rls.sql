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
