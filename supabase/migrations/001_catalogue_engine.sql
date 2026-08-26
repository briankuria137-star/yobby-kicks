-- Yobby Kicks Catalogue Engine
-- Collections + product membership

CREATE TABLE IF NOT EXISTS collections (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),

  name TEXT NOT NULL,
  slug TEXT UNIQUE NOT NULL,

  description TEXT,

  image_url TEXT,

  is_active BOOLEAN NOT NULL DEFAULT true,
  is_featured BOOLEAN NOT NULL DEFAULT false,

  display_order INTEGER NOT NULL DEFAULT 0,

  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

CREATE TABLE IF NOT EXISTS collection_products (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),

  collection_id UUID NOT NULL
    REFERENCES collections(id)
    ON DELETE CASCADE,

  product_id UUID NOT NULL
    REFERENCES products(id)
    ON DELETE CASCADE,

  display_order INTEGER NOT NULL DEFAULT 0,

  created_at TIMESTAMPTZ DEFAULT NOW(),

  UNIQUE(collection_id, product_id)
);

-- Indexes

CREATE INDEX IF NOT EXISTS idx_collections_slug
  ON collections(slug);

CREATE INDEX IF NOT EXISTS idx_collections_active
  ON collections(is_active);

CREATE INDEX IF NOT EXISTS idx_collections_featured
  ON collections(is_featured);

CREATE INDEX IF NOT EXISTS idx_collections_order
  ON collections(display_order);

CREATE INDEX IF NOT EXISTS idx_collection_products_collection
  ON collection_products(collection_id);

CREATE INDEX IF NOT EXISTS idx_collection_products_product
  ON collection_products(product_id);

-- RLS

ALTER TABLE collections ENABLE ROW LEVEL SECURITY;
ALTER TABLE collection_products ENABLE ROW LEVEL SECURITY;

-- Public storefront can read active collections

CREATE POLICY "Active collections are viewable by everyone"
ON collections
FOR SELECT
USING (is_active = true);

-- Authenticated admin users can manage collections

CREATE POLICY "Authenticated users can insert collections"
ON collections
FOR INSERT
WITH CHECK (auth.role() = 'authenticated');

CREATE POLICY "Authenticated users can update collections"
ON collections
FOR UPDATE
USING (auth.role() = 'authenticated');

CREATE POLICY "Authenticated users can delete collections"
ON collections
FOR DELETE
USING (auth.role() = 'authenticated');

-- Collection products

CREATE POLICY "Collection products are viewable by everyone"
ON collection_products
FOR SELECT
USING (
  EXISTS (
    SELECT 1
    FROM collections c
    WHERE c.id = collection_products.collection_id
      AND c.is_active = true
  )
);

CREATE POLICY "Authenticated users can insert collection products"
ON collection_products
FOR INSERT
WITH CHECK (auth.role() = 'authenticated');

CREATE POLICY "Authenticated users can update collection products"
ON collection_products
FOR UPDATE
USING (auth.role() = 'authenticated');

CREATE POLICY "Authenticated users can delete collection products"
ON collection_products
FOR DELETE
USING (auth.role() = 'authenticated');

-- Updated-at trigger

CREATE TRIGGER update_collections_updated_at
BEFORE UPDATE ON collections
FOR EACH ROW
EXECUTE FUNCTION update_updated_at_column();

-- Initial collections

INSERT INTO collections
  (name, slug, description, is_active, is_featured, display_order)
VALUES
  (
    'New Arrivals',
    'new-arrivals',
    'The latest pairs added to Yobby Kicks.',
    true,
    true,
    1
  ),
  (
    'Featured',
    'featured',
    'Handpicked pairs worth a closer look.',
    true,
    true,
    2
  ),
  (
    'Men',
    'men',
    'Fresh footwear for men.',
    true,
    false,
    3
  ),
  (
    'Women',
    'women',
    'Fresh footwear for women.',
    true,
    false,
    4
  ),
  (
    'Kids',
    'kids',
    'Fresh footwear for kids.',
    true,
    false,
    5
  ),
  (
    'Unisex',
    'unisex',
    'Pairs anyone can wear.',
    true,
    false,
    6
  )
ON CONFLICT (slug) DO NOTHING;
