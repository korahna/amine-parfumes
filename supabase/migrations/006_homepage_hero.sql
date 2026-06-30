-- Homepage hero slides
CREATE TABLE IF NOT EXISTS homepage_hero (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  name TEXT NOT NULL,
  sub TEXT,
  mood TEXT,
  accent TEXT DEFAULT '#c9a227',
  tag TEXT DEFAULT 'Homme',
  image_url TEXT NOT NULL,
  sort_order INT DEFAULT 0,
  is_active BOOLEAN DEFAULT true,
  created_at TIMESTAMPTZ DEFAULT NOW()
);

ALTER TABLE homepage_hero ENABLE ROW LEVEL SECURITY;
CREATE POLICY "hero_public_read" ON homepage_hero FOR SELECT USING (true);
CREATE POLICY "hero_admin_write" ON homepage_hero FOR ALL USING (auth.role() = 'authenticated');

-- Seed with current hero data
INSERT INTO homepage_hero (name, sub, mood, accent, tag, image_url, sort_order) VALUES
('Stronger With You', 'Intensely · Emporio Armani', 'Chaud & Ambré', '#d4722a', 'Homme', '/images/hero-armani.jpg', 1),
('Burberry Her', 'Elixir de Parfum', 'Floral & Fruité', '#c9a0a0', 'Femme', '/images/hero-burberry.jpg', 2),
('Le Beau', 'Jean Paul Gaultier', 'Boisé & Exotique', '#3aaa76', 'Homme', '/images/hero-jbg.jpg', 3);
