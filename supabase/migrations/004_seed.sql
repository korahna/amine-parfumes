-- ============================================
-- amine.parfume — Seed Data
-- Migration 004: Test data for development
-- Run AFTER 003_storage.sql
-- ============================================

-- ============================================
-- CATEGORIES
-- ============================================
INSERT INTO categories (slug, name_fr, name_ar, sort_order) VALUES
  ('floral',     'Floral',        'زهري',           1),
  ('oriental',   'Oriental',      'شرقي',           2),
  ('boisé',      'Boisé',         'خشبي',           3),
  ('frais',      'Frais',         'منعش',           4),
  ('citrus',     'Agrume',        'حمضي',           5),
  ('oud',        'Oud',           'عود',            6),
  ('decants',    'Échantillons',  'عينات',          7);

-- ============================================
-- PRODUCTS — Full Bottles
-- ============================================

-- 1. Chanel No. 5 (Floral)
INSERT INTO products (slug, name_fr, name_ar, description_fr, description_ar, type, brand, scent_notes, volume, price, images, in_stock, featured, category) VALUES
(
  'chanel-no-5',
  'Chanel N°5',
  'شانيل رقم 5',
  'Le parfum le plus célèbre au monde. Un bouquet floral aldéhydé intemporel qui incarne l''élégance féminine depuis 1921.',
  'أشهر عطر في العالم. باقة زهرية كلاسيكية تجسد الأناقة الأنثوية منذ عام 1921.',
  'full',
  'Chanel',
  '{"top":["aldéhydes","ylang-ylang","neroli"],"heart":["rose","jasmin","iris"],"base":["santal","vanille","vétiver"]}',
  100,
  1250.00,
  ARRAY['https://images.unsplash.com/photo-1541643600914-78b084683702?w=600&h=600&fit=crop&q=85'],
  true,
  true,
  'floral'
);

-- 2. Tom Ford Oud Wood (Oud/Woody)
INSERT INTO products (slug, name_fr, name_ar, description_fr, description_ar, type, brand, scent_notes, volume, price, images, in_stock, featured, category) VALUES
(
  'tom-ford-oud-wood',
  'Tom Ford Oud Wood',
  'توم فورد عود وود',
  'Un mélange rare et exotique de bois d''oud, de cardamome et de santal. Sophistiqué et enveloppant.',
  'مزيج نادر وغريب من خشب العود والهيل والصندل. أنيق ومغلف.',
  'full',
  'Tom Ford',
  '{"top":["cardamome","poivre de Sichuan"],"heart":["oud","santal","vétiver"],"base":["ambre","vanille","fève tonka"]}',
  100,
  2100.00,
  ARRAY['https://images.unsplash.com/photo-1588514912908-e4621e8b8f74?w=600&h=600&fit=crop&q=85'],
  true,
  true,
  'oud'
);

-- 3. Dior Sauvage (Fresh/Citrus)
INSERT INTO products (slug, name_fr, name_ar, description_fr, description_ar, type, brand, scent_notes, volume, price, images, in_stock, featured, category) VALUES
(
  'dior-sauvage',
  'Dior Sauvage',
  'ديور سوفاج',
  'Un parfum frais et puissant, inspiré par les grands espaces. Bergamote et ambroxan pour une signature magnétique.',
  'عطر منعش وقوي، مستوحى من المساحات الواسعة. برغموت وأمبروكسان لتوقيع مغناطيسي.',
  'full',
  'Dior',
  '{"top":["bergamote","poivre"],"heart":["lavande","géranium","poivre de Sichuan"],"base":["ambroxan","cèdre","labdanum"]}',
  100,
  980.00,
  ARRAY['https://images.unsplash.com/photo-1592945403244-b3fbafd7f539?w=600&h=600&fit=crop&q=85'],
  true,
  true,
  'frais'
);

-- 4. Yves Saint Laurent Libre (Floral/Oriental)
INSERT INTO products (slug, name_fr, name_ar, description_fr, description_ar, type, brand, scent_notes, volume, price, images, in_stock, featured, category) VALUES
(
  'ysl-libre',
  'YSL Libre',
  'واي إس إل ليبر',
  'Un floral lavande audacieux et féminin. La liberté d''être soi-même, capturée dans un parfum.',
  'عطر زهري من اللافندر جريء وأنثوي. الحرية في أن تكون نفسك، محفوظة في عطر.',
  'full',
  'Yves Saint Laurent',
  '{"top":["lavande","mandarine","cassis"],"heart":["fleur d''oranger","jasmin","lavande"],"base":["vanille","ambre","cèdre"]}',
  90,
  1150.00,
  ARRAY['https://images.unsplash.com/photo-1619994403073-2cec844b8e63?w=600&h=600&fit=crop&q=85'],
  true,
  true,
  'floral'
);

-- 5. Maison Margiela Replica — Jazz Club (Woody/Oriental)
INSERT INTO products (slug, name_fr, name_ar, description_fr, description_ar, type, brand, scent_notes, volume, price, images, in_stock, featured, category) VALUES
(
  'margiela-jazz-club',
  'Replica Jazz Club',
  'ريبليكا جاز كلوب',
  'L''ambiance chaleureuse d''un jazz club : tabac, rhum et cuir. Un parfum qui raconte une histoire.',
  'أجواء نادي جاز دافئة: تباكو وروم وجلد. عطر يروي قصة.',
  'full',
  'Maison Margiela',
  '{"top":["poivre rose","citron","néroli"],"heart":["tabac","rum absolu","sauge"],"base":["vanille","fève tonka","cuir"]}',
  100,
  1350.00,
  ARRAY['https://images.unsplash.com/photo-1544731612-de7f96afe55f?w=600&h=600&fit=crop&q=85'],
  true,
  false,
  'boisé'
);

-- 6. Byredo Gypsy Water (Woody/Aromatic)
INSERT INTO products (slug, name_fr, name_ar, description_fr, description_ar, type, brand, scent_notes, volume, price, images, in_stock, featured, category) VALUES
(
  'byredo-gypsy-water',
  'Gypsy Water',
  'جيبسي ووتر',
  'Un hymne au style de vie bohème. Notes de pin, de baies de genièvre et de vanille pour une évasion sensorielle.',
  'تנון لنمط الحياة البوهيمي. نبات الصنوبر والعرعر والهروب الحسي.',
  'full',
  'Byredo',
  '{"top":["bergamote","poivre","genièvre"],"heart":["pin","encens","racine d''iris"],"base":["vanille","santal","ambre"]}',
  100,
  1800.00,
  ARRAY['https://images.unsplash.com/photo-1523293182086-7651a899d37f?w=600&h=600&fit=crop&q=85'],
  true,
  true,
  'boisé'
);

-- 7. Lancôme La Vie Est Belle (Oriental/Gourmand)
INSERT INTO products (slug, name_fr, name_ar, description_fr, description_ar, type, brand, scent_notes, volume, price, images, in_stock, featured, category) VALUES
(
  'lancome-la-vie-est-belle',
  'La Vie Est Belle',
  'لا في إيست بيل',
  'Le sourire capturé dans un parfum. Iris, patchouli et gourmand pour une joie de vivre contagieuse.',
  'الابتسامة المحفوظة في عطر. السوسن والباتشولي والحلوى لفرح عدوى.',
  'full',
  'Lancôme',
  '{"top":["cassis","poire"],"heart":["iris","jasmin","fleur d''oranger"],"base":["patchouli","praline","vanille"]}',
  75,
  890.00,
  ARRAY['https://images.unsplash.com/photo-1541643600914-78b084683702?w=600&h=600&fit=crop&q=85'],
  true,
  false,
  'oriental'
);

-- ============================================
-- PRODUCTS — Decants (Échantillons)
-- ============================================

-- 8. Chanel N°5 Decant
INSERT INTO products (slug, name_fr, name_ar, description_fr, description_ar, type, brand, scent_notes, volume, price, images, in_stock, featured, category) VALUES
(
  'chanel-no-5-decant',
  'Chanel N°5 — Échantillon',
  'شانيل رقم 5 — عينة',
  'Découvrez l''icône. Échantillon de 5ml du parfum le plus célèbre au monde.',
  'اكتشف الأيقونة. عينة 5 أشهر من أشهر عطر في العالم.',
  'decant',
  'Chanel',
  '{"top":["aldéhydes","ylang-ylang","neroli"],"heart":["rose","jasmin","iris"],"base":["santal","vanille","vétiver"]}',
  5,
  85.00,
  ARRAY['https://images.unsplash.com/photo-1541643600914-78b084683702?w=300&h=300&fit=crop&q=80'],
  true,
  false,
  'decants'
);

-- 9. Tom Ford Oud Wood Decant
INSERT INTO products (slug, name_fr, name_ar, description_fr, description_ar, type, brand, scent_notes, volume, price, images, in_stock, featured, category) VALUES
(
  'tom-ford-oud-wood-decant',
  'Oud Wood — Échantillon',
  'عود وود — عينة',
  'Testez le luxe. Échantillon de 5ml du Tom Ford Oud Wood légendaire.',
  'اختبر الفخامة. عينة 5 أشهر من توم فورد عود وود الأسطوري.',
  'decant',
  'Tom Ford',
  '{"top":["cardamome","poivre de Sichuan"],"heart":["oud","santal","vétiver"],"base":["ambre","vanille","fève tonka"]}',
  5,
  145.00,
  ARRAY['https://images.unsplash.com/photo-1588514912908-e4621e8b8f74?w=300&h=300&fit=crop&q=80'],
  true,
  false,
  'decants'
);

-- 10. Dior Sauvage Decant
INSERT INTO products (slug, name_fr, name_ar, description_fr, description_ar, type, brand, scent_notes, volume, price, images, in_stock, featured, category) VALUES
(
  'dior-sauvage-decant',
  'Dior Sauvage — Échantillon',
  'ديور سوفاج — عينة',
  'Le best-seller en version découverte. Échantillon de 5ml pour tester cette fresque magnétique.',
  'البائع الأفضل في نسخة اكتشاف. عينة 5 أشهر لاختبار هذا العطر المنعش.',
  'decant',
  'Dior',
  '{"top":["bergamote","poivre"],"heart":["lavande","géranium","poivre de Sichuan"],"base":["ambroxan","cèdre","labdanum"]}',
  5,
  65.00,
  ARRAY['https://images.unsplash.com/photo-1592945403244-b3fbafd7f539?w=300&h=300&fit=crop&q=80'],
  true,
  false,
  'decants'
);

-- 11. Byredo Gypsy Water Decant
INSERT INTO products (slug, name_fr, name_ar, description_fr, description_ar, type, brand, scent_notes, volume, price, images, in_stock, featured, category) VALUES
(
  'byredo-gypsy-water-decant',
  'Gypsy Water — Échantillon',
  'جيبسي ووتر — عينة',
  'Voyagez avec Gypsy Water. Échantillon de 5ml pour explorer cette signature bohème.',
  'سافر مع جيبسي ووتر. عينة 5 أشهر لاستكشاف هذا التوقيع البوهيمي.',
  'decant',
  'Byredo',
  '{"top":["bergamote","poivre","genièvre"],"heart":["pin","encens","racine d''iris"],"base":["vanille","santal","ambre"]}',
  5,
  120.00,
  ARRAY['https://images.unsplash.com/photo-1523293182086-7651a899d37f?w=300&h=300&fit=crop&q=80'],
  true,
  false,
  'decants'
);

-- ============================================
-- SAMPLE ORDERS (for admin dashboard testing)
-- ============================================

INSERT INTO orders (items, customer_name, customer_phone, address, city, wilaya, total, status) VALUES
(
  '[{"productId":"chanel-no-5","quantity":1,"price":1250.00,"name":"Chanel N°5"}]'::jsonb,
  'Amina Benali',
  '+212612345678',
  '42 Rue Oued Fès',
  'Fès',
  'Fès-Meknès',
  1250.00,
  'pending'
),
(
  '[{"productId":"tom-ford-oud-wood","quantity":1,"price":2100.00,"name":"Tom Ford Oud Wood"},{"productId":"chanel-no-5-decant","quantity":2,"price":85.00,"name":"Chanel N°5 — Échantillon"}]'::jsonb,
  'Youssef El Amrani',
  '+212698765432',
  '15 Avenue Hassan II',
  'Casablanca',
  'Casablanca-Settat',
  2270.00,
  'confirmed'
),
(
  '[{"productId":"dior-sauvage","quantity":1,"price":980.00,"name":"Dior Sauvage"}]'::jsonb,
  'Fatima Zahra Tazi',
  '+212655123456',
  '8 Rue Ibn Batouta',
  'Rabat',
  'Rabat-Salé-Kénitra',
  980.00,
  'shipped'
),
(
  '[{"productId":"ysl-libre","quantity":1,"price":1150.00,"name":"YSL Libre"},{"productId":"byredo-gypsy-water-decant","quantity":3,"price":120.00,"name":"Gypsy Water — Échantillon"}]'::jsonb,
  'Karim Idrissi',
  '+212677889900',
  '23 Boulevard Zerktouni',
  'Marrakech',
  'Marrakech-Safi',
  1510.00,
  'delivered'
),
(
  '[{"productId":"lancome-la-vie-est-belle","quantity":1,"price":890.00,"name":"La Vie Est Belle"}]'::jsonb,
  'Nadia Chaoui',
  '+212633445566',
  '7 Rue Moulay Ismail',
  'Tanger',
  'Tanger-Tétouan-Al Hoceïma',
  890.00,
  'pending'
);
