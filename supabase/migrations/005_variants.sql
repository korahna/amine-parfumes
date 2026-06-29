-- Add variants column to support multiple volume/price options per product
-- Format: [{"volume": 50, "price": 250}, {"volume": 100, "price": 450}]
ALTER TABLE products ADD COLUMN IF NOT EXISTS variants JSONB DEFAULT '[]';
