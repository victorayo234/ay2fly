const { Client } = require("pg");
const { createClient } = require("@supabase/supabase-js");

const connectionString =
  process.env.POSTGRES_URL_NON_POOLING ||
  process.env.DATABASE_URL;

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL;
const supabaseServiceKey = process.env.SUPABASE_SERVICE_ROLE_KEY;

if (!connectionString || !supabaseUrl || !supabaseServiceKey) {
  console.error("Missing required environment variables (POSTGRES_URL_NON_POOLING / DATABASE_URL, NEXT_PUBLIC_SUPABASE_URL, SUPABASE_SERVICE_ROLE_KEY).");
  process.exit(1);
}

const supabaseAdmin = createClient(supabaseUrl, supabaseServiceKey);

async function main() {
  const cleanConnectionString = connectionString.replace(/[\?&]sslmode=[^&]+/g, "");
  const client = new Client({
    connectionString: cleanConnectionString,
    ssl: { rejectUnauthorized: false },
  });

  console.log("Connecting to PostgreSQL at:", cleanConnectionString.split("@")[1]);
  await client.connect();
  console.log("Connected successfully!");

  console.log("1. Setting up extensions and tables...");
  await client.query(`
    CREATE EXTENSION IF NOT EXISTS "uuid-ossp";

    -- Ensure profiles table has required columns
    CREATE TABLE IF NOT EXISTS public.profiles (
      id UUID PRIMARY KEY REFERENCES auth.users(id) ON DELETE CASCADE,
      email TEXT NOT NULL UNIQUE,
      full_name TEXT NOT NULL,
      role TEXT NOT NULL DEFAULT 'customer',
      phone TEXT,
      created_at TIMESTAMPTZ NOT NULL DEFAULT timezone('utc'::text, now()),
      updated_at TIMESTAMPTZ NOT NULL DEFAULT timezone('utc'::text, now())
    );
    ALTER TABLE public.profiles ADD COLUMN IF NOT EXISTS phone TEXT;
    ALTER TABLE public.profiles ADD COLUMN IF NOT EXISTS full_name TEXT DEFAULT '';
    ALTER TABLE public.profiles ADD COLUMN IF NOT EXISTS role TEXT DEFAULT 'customer';

    -- 2. Categories Table
    CREATE TABLE IF NOT EXISTS public.categories (
      id TEXT PRIMARY KEY,
      name TEXT NOT NULL,
      slug TEXT NOT NULL UNIQUE,
      description TEXT,
      parent_id TEXT REFERENCES public.categories(id) ON DELETE SET NULL,
      image_url TEXT,
      created_at TIMESTAMPTZ NOT NULL DEFAULT timezone('utc'::text, now())
    );
    CREATE INDEX IF NOT EXISTS idx_categories_slug ON public.categories(slug);

    -- 3. Collections Table
    CREATE TABLE IF NOT EXISTS public.collections (
      id TEXT PRIMARY KEY,
      name TEXT NOT NULL,
      slug TEXT NOT NULL UNIQUE,
      description TEXT,
      banner_image TEXT,
      is_featured BOOLEAN DEFAULT false,
      created_at TIMESTAMPTZ NOT NULL DEFAULT timezone('utc'::text, now())
    );
    CREATE INDEX IF NOT EXISTS idx_collections_slug ON public.collections(slug);

    -- 4. Products Table
    CREATE TABLE IF NOT EXISTS public.products (
      id TEXT PRIMARY KEY,
      name TEXT NOT NULL,
      slug TEXT NOT NULL UNIQUE,
      description TEXT NOT NULL,
      category_id TEXT NOT NULL REFERENCES public.categories(id) ON DELETE RESTRICT,
      collection_id TEXT REFERENCES public.collections(id) ON DELETE SET NULL,
      price NUMERIC(10, 2) NOT NULL CHECK (price >= 0),
      sale_price NUMERIC(10, 2) CHECK (sale_price >= 0),
      material TEXT NOT NULL,
      fit TEXT NOT NULL CHECK (fit IN ('fitted', 'regular', 'relaxed', 'oversized', 'boxy')),
      status TEXT NOT NULL DEFAULT 'active' CHECK (status IN ('draft', 'active', 'archived')),
      created_at TIMESTAMPTZ NOT NULL DEFAULT timezone('utc'::text, now()),
      updated_at TIMESTAMPTZ NOT NULL DEFAULT timezone('utc'::text, now())
    );
    CREATE INDEX IF NOT EXISTS idx_products_slug ON public.products(slug);
    CREATE INDEX IF NOT EXISTS idx_products_category ON public.products(category_id);
    CREATE INDEX IF NOT EXISTS idx_products_collection ON public.products(collection_id);

    -- 5. Product Variants Table
    CREATE TABLE IF NOT EXISTS public.product_variants (
      id TEXT PRIMARY KEY,
      product_id TEXT NOT NULL REFERENCES public.products(id) ON DELETE CASCADE,
      color TEXT NOT NULL,
      color_hex TEXT,
      size TEXT NOT NULL,
      sku TEXT NOT NULL UNIQUE,
      price_override NUMERIC(10, 2) CHECK (price_override >= 0),
      stock INTEGER NOT NULL DEFAULT 0 CHECK (stock >= 0),
      created_at TIMESTAMPTZ NOT NULL DEFAULT timezone('utc'::text, now())
    );
    CREATE INDEX IF NOT EXISTS idx_variants_product ON public.product_variants(product_id);
    CREATE INDEX IF NOT EXISTS idx_variants_sku ON public.product_variants(sku);

    -- 6. Product Images Table
    CREATE TABLE IF NOT EXISTS public.product_images (
      id TEXT PRIMARY KEY,
      product_id TEXT NOT NULL REFERENCES public.products(id) ON DELETE CASCADE,
      variant_id TEXT REFERENCES public.product_variants(id) ON DELETE SET NULL,
      image_url TEXT NOT NULL,
      alt_text TEXT NOT NULL,
      position INTEGER NOT NULL DEFAULT 0,
      created_at TIMESTAMPTZ NOT NULL DEFAULT timezone('utc'::text, now())
    );
    CREATE INDEX IF NOT EXISTS idx_images_product ON public.product_images(product_id);

    -- 7. Size Guides Table
    CREATE TABLE IF NOT EXISTS public.size_guides (
      id TEXT PRIMARY KEY,
      product_id TEXT REFERENCES public.products(id) ON DELETE CASCADE,
      category_id TEXT REFERENCES public.categories(id) ON DELETE CASCADE,
      size TEXT NOT NULL,
      min_height INTEGER,
      max_height INTEGER,
      chest INTEGER,
      waist INTEGER,
      hip INTEGER,
      garment_length INTEGER,
      created_at TIMESTAMPTZ NOT NULL DEFAULT timezone('utc'::text, now())
    );

    -- 8. Addresses Table
    CREATE TABLE IF NOT EXISTS public.addresses (
      id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
      user_id UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
      label TEXT DEFAULT 'Home',
      name TEXT NOT NULL,
      address TEXT NOT NULL,
      city TEXT NOT NULL,
      state TEXT NOT NULL,
      country TEXT NOT NULL,
      postal_code TEXT NOT NULL,
      phone TEXT NOT NULL,
      is_default BOOLEAN DEFAULT false,
      created_at TIMESTAMPTZ NOT NULL DEFAULT timezone('utc'::text, now())
    );
    CREATE INDEX IF NOT EXISTS idx_addresses_user ON public.addresses(user_id);

    -- 9. Carts & Cart Items Tables
    CREATE TABLE IF NOT EXISTS public.carts (
      id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
      user_id UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE UNIQUE,
      created_at TIMESTAMPTZ NOT NULL DEFAULT timezone('utc'::text, now()),
      updated_at TIMESTAMPTZ NOT NULL DEFAULT timezone('utc'::text, now())
    );

    CREATE TABLE IF NOT EXISTS public.cart_items (
      id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
      cart_id UUID NOT NULL REFERENCES public.carts(id) ON DELETE CASCADE,
      product_variant_id TEXT NOT NULL REFERENCES public.product_variants(id) ON DELETE CASCADE,
      quantity INTEGER NOT NULL CHECK (quantity > 0),
      created_at TIMESTAMPTZ NOT NULL DEFAULT timezone('utc'::text, now()),
      UNIQUE(cart_id, product_variant_id)
    );
    CREATE INDEX IF NOT EXISTS idx_cart_items_cart ON public.cart_items(cart_id);

    -- 10. Wishlists Table
    CREATE TABLE IF NOT EXISTS public.wishlists (
      id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
      user_id UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
      product_id TEXT NOT NULL REFERENCES public.products(id) ON DELETE CASCADE,
      created_at TIMESTAMPTZ NOT NULL DEFAULT timezone('utc'::text, now()),
      UNIQUE(user_id, product_id)
    );
    CREATE INDEX IF NOT EXISTS idx_wishlists_user ON public.wishlists(user_id);

    -- 11. Orders & Order Items Tables
    CREATE TABLE IF NOT EXISTS public.orders (
      id TEXT PRIMARY KEY,
      order_number TEXT NOT NULL UNIQUE,
      user_id UUID REFERENCES auth.users(id) ON DELETE SET NULL,
      user_email TEXT NOT NULL,
      status TEXT NOT NULL DEFAULT 'pending' CHECK (status IN ('pending', 'confirmed', 'processing', 'shipped', 'delivered', 'cancelled')),
      subtotal NUMERIC(10, 2) NOT NULL,
      discount NUMERIC(10, 2) NOT NULL DEFAULT 0.00,
      shipping NUMERIC(10, 2) NOT NULL DEFAULT 0.00,
      tax NUMERIC(10, 2) NOT NULL DEFAULT 0.00,
      total NUMERIC(10, 2) NOT NULL,
      shipping_address JSONB NOT NULL,
      created_at TIMESTAMPTZ NOT NULL DEFAULT timezone('utc'::text, now()),
      updated_at TIMESTAMPTZ NOT NULL DEFAULT timezone('utc'::text, now())
    );
    CREATE INDEX IF NOT EXISTS idx_orders_user ON public.orders(user_id);
    CREATE INDEX IF NOT EXISTS idx_orders_order_number ON public.orders(order_number);

    CREATE TABLE IF NOT EXISTS public.order_items (
      id TEXT PRIMARY KEY,
      order_id TEXT NOT NULL REFERENCES public.orders(id) ON DELETE CASCADE,
      product_variant_id TEXT REFERENCES public.product_variants(id) ON DELETE SET NULL,
      quantity INTEGER NOT NULL CHECK (quantity > 0),
      unit_price NUMERIC(10, 2) NOT NULL CHECK (unit_price >= 0),
      product_name TEXT NOT NULL,
      color TEXT NOT NULL,
      size TEXT NOT NULL,
      image_url TEXT NOT NULL
    );
    CREATE INDEX IF NOT EXISTS idx_order_items_order ON public.order_items(order_id);

    -- 12. Newsletter Table
    CREATE TABLE IF NOT EXISTS public.newsletter_subscribers (
      id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
      email TEXT NOT NULL UNIQUE,
      created_at TIMESTAMPTZ NOT NULL DEFAULT timezone('utc'::text, now())
    );
  `);

  console.log("2. Configuring Security Definer functions and trigger...");
  await client.query(`
    -- Helper Function to check if caller is an admin
    CREATE OR REPLACE FUNCTION public.is_admin()
    RETURNS BOOLEAN AS $$
    BEGIN
      RETURN EXISTS (
        SELECT 1 FROM public.profiles
        WHERE id = auth.uid() AND role = 'admin'
      );
    END;
    $$ LANGUAGE plpgsql SECURITY DEFINER;

    -- Automatic profile creation trigger on auth.users insert
    CREATE OR REPLACE FUNCTION public.handle_new_user()
    RETURNS TRIGGER AS $$
    BEGIN
      INSERT INTO public.profiles (id, email, full_name, role)
      VALUES (
        new.id,
        new.email,
        COALESCE(new.raw_user_meta_data->>'full_name', split_part(new.email, '@', 1)),
        COALESCE(new.raw_user_meta_data->>'role', 'customer')
      )
      ON CONFLICT (id) DO UPDATE
      SET
        email = EXCLUDED.email,
        full_name = CASE WHEN EXCLUDED.full_name <> '' THEN EXCLUDED.full_name ELSE public.profiles.full_name END;
      RETURN NEW;
    END;
    $$ LANGUAGE plpgsql SECURITY DEFINER;

    DROP TRIGGER IF EXISTS on_auth_user_created ON auth.users;
    CREATE TRIGGER on_auth_user_created
      AFTER INSERT ON auth.users
      FOR EACH ROW EXECUTE FUNCTION public.handle_new_user();

    -- Role protection trigger preventing non-admins from changing role
    CREATE OR REPLACE FUNCTION public.protect_profile_role()
    RETURNS TRIGGER AS $$
    BEGIN
      IF NEW.role IS DISTINCT FROM OLD.role AND NOT public.is_admin() THEN
        RAISE EXCEPTION 'Non-administrative users cannot modify their account role.';
      END IF;
      RETURN NEW;
    END;
    $$ LANGUAGE plpgsql SECURITY DEFINER;

    DROP TRIGGER IF EXISTS protect_profile_role_trigger ON public.profiles;
    CREATE TRIGGER protect_profile_role_trigger
      BEFORE UPDATE ON public.profiles
      FOR EACH ROW EXECUTE FUNCTION public.protect_profile_role();
  `);

  console.log("3. Enabling Row Level Security (RLS) on all tables...");
  await client.query(`
    ALTER TABLE public.profiles ENABLE ROW LEVEL SECURITY;
    ALTER TABLE public.categories ENABLE ROW LEVEL SECURITY;
    ALTER TABLE public.collections ENABLE ROW LEVEL SECURITY;
    ALTER TABLE public.products ENABLE ROW LEVEL SECURITY;
    ALTER TABLE public.product_variants ENABLE ROW LEVEL SECURITY;
    ALTER TABLE public.product_images ENABLE ROW LEVEL SECURITY;
    ALTER TABLE public.size_guides ENABLE ROW LEVEL SECURITY;
    ALTER TABLE public.addresses ENABLE ROW LEVEL SECURITY;
    ALTER TABLE public.carts ENABLE ROW LEVEL SECURITY;
    ALTER TABLE public.cart_items ENABLE ROW LEVEL SECURITY;
    ALTER TABLE public.wishlists ENABLE ROW LEVEL SECURITY;
    ALTER TABLE public.orders ENABLE ROW LEVEL SECURITY;
    ALTER TABLE public.order_items ENABLE ROW LEVEL SECURITY;
    ALTER TABLE public.newsletter_subscribers ENABLE ROW LEVEL SECURITY;
  `);

  console.log("4. Applying clean RLS Policies...");
  const policies = [
    // Profiles
    `DROP POLICY IF EXISTS "Users can view their own profile" ON public.profiles;
     CREATE POLICY "Users can view their own profile" ON public.profiles FOR SELECT USING (auth.uid() = id OR public.is_admin());`,
    `DROP POLICY IF EXISTS "Users can update their own profile" ON public.profiles;
     CREATE POLICY "Users can update their own profile" ON public.profiles FOR UPDATE USING (auth.uid() = id);`,
    `DROP POLICY IF EXISTS "Users can insert their own profile" ON public.profiles;
     CREATE POLICY "Users can insert their own profile" ON public.profiles FOR INSERT WITH CHECK (auth.uid() = id OR public.is_admin());`,

    // Public readable tables (Categories, Collections, Products, Variants, Images, Size Guides)
    `DROP POLICY IF EXISTS "Public can view categories" ON public.categories;
     CREATE POLICY "Public can view categories" ON public.categories FOR SELECT USING (true);`,
    `DROP POLICY IF EXISTS "Admins can manage categories" ON public.categories;
     CREATE POLICY "Admins can manage categories" ON public.categories FOR ALL USING (public.is_admin());`,

    `DROP POLICY IF EXISTS "Public can view collections" ON public.collections;
     CREATE POLICY "Public can view collections" ON public.collections FOR SELECT USING (true);`,
    `DROP POLICY IF EXISTS "Admins can manage collections" ON public.collections;
     CREATE POLICY "Admins can manage collections" ON public.collections FOR ALL USING (public.is_admin());`,

    `DROP POLICY IF EXISTS "Public can view products" ON public.products;
     CREATE POLICY "Public can view products" ON public.products FOR SELECT USING (status = 'active' OR public.is_admin());`,
    `DROP POLICY IF EXISTS "Admins can manage products" ON public.products;
     CREATE POLICY "Admins can manage products" ON public.products FOR ALL USING (public.is_admin());`,

    `DROP POLICY IF EXISTS "Public can view variants" ON public.product_variants;
     CREATE POLICY "Public can view variants" ON public.product_variants FOR SELECT USING (true);`,
    `DROP POLICY IF EXISTS "Admins can manage variants" ON public.product_variants;
     CREATE POLICY "Admins can manage variants" ON public.product_variants FOR ALL USING (public.is_admin());`,

    `DROP POLICY IF EXISTS "Public can view images" ON public.product_images;
     CREATE POLICY "Public can view images" ON public.product_images FOR SELECT USING (true);`,
    `DROP POLICY IF EXISTS "Admins can manage images" ON public.product_images;
     CREATE POLICY "Admins can manage images" ON public.product_images FOR ALL USING (public.is_admin());`,

    `DROP POLICY IF EXISTS "Public can view size guides" ON public.size_guides;
     CREATE POLICY "Public can view size guides" ON public.size_guides FOR SELECT USING (true);`,

    // User-scoped isolated tables (Addresses, Carts, Cart Items, Wishlists, Orders)
    `DROP POLICY IF EXISTS "Users can view their own addresses" ON public.addresses;
     CREATE POLICY "Users can view their own addresses" ON public.addresses FOR SELECT USING (auth.uid() = user_id OR public.is_admin());`,
    `DROP POLICY IF EXISTS "Users can manage their own addresses" ON public.addresses;
     CREATE POLICY "Users can manage their own addresses" ON public.addresses FOR ALL USING (auth.uid() = user_id);`,

    `DROP POLICY IF EXISTS "Users can manage their own cart" ON public.carts;
     CREATE POLICY "Users can manage their own cart" ON public.carts FOR ALL USING (auth.uid() = user_id);`,
    `DROP POLICY IF EXISTS "Users can manage their own cart items" ON public.cart_items;
     CREATE POLICY "Users can manage their own cart items" ON public.cart_items FOR ALL USING (
       EXISTS (SELECT 1 FROM public.carts WHERE carts.id = cart_items.cart_id AND carts.user_id = auth.uid())
     );`,

    `DROP POLICY IF EXISTS "Users can manage their own wishlist" ON public.wishlists;
     CREATE POLICY "Users can manage their own wishlist" ON public.wishlists FOR ALL USING (auth.uid() = user_id);`,

    `DROP POLICY IF EXISTS "Users can view their own orders" ON public.orders;
     CREATE POLICY "Users can view their own orders" ON public.orders FOR SELECT USING (auth.uid() = user_id OR public.is_admin());`,
    `DROP POLICY IF EXISTS "Users can insert their own orders" ON public.orders;
     CREATE POLICY "Users can insert their own orders" ON public.orders FOR INSERT WITH CHECK (auth.uid() = user_id OR user_id IS NULL OR public.is_admin());`,
    `DROP POLICY IF EXISTS "Admins can update orders" ON public.orders;
     CREATE POLICY "Admins can update orders" ON public.orders FOR UPDATE USING (public.is_admin());`,

    `DROP POLICY IF EXISTS "Users can view their own order items" ON public.order_items;
     CREATE POLICY "Users can view their own order items" ON public.order_items FOR SELECT USING (
       EXISTS (SELECT 1 FROM public.orders WHERE orders.id = order_items.order_id AND (orders.user_id = auth.uid() OR public.is_admin()))
     );`,
    `DROP POLICY IF EXISTS "Users can insert order items" ON public.order_items;
     CREATE POLICY "Users can insert order items" ON public.order_items FOR INSERT WITH CHECK (
       EXISTS (SELECT 1 FROM public.orders WHERE orders.id = order_items.order_id AND (orders.user_id = auth.uid() OR orders.user_id IS NULL OR public.is_admin()))
     );`,
  ];

  for (const sql of policies) {
    await client.query(sql);
  }

  console.log("5. Seeding catalog data into PostgreSQL...");
  // Read and parse seed-data
  const seedModule = require("../src/lib/data/seed-data.ts");
  const { CATEGORIES, COLLECTIONS, SIZE_GUIDES, INITIAL_PRODUCTS } = seedModule;

  // Insert Categories
  for (const cat of CATEGORIES) {
    await client.query(
      `INSERT INTO public.categories (id, name, slug, description, image_url)
       VALUES ($1, $2, $3, $4, $5)
       ON CONFLICT (id) DO UPDATE SET
         name = EXCLUDED.name,
         slug = EXCLUDED.slug,
         description = EXCLUDED.description,
         image_url = EXCLUDED.image_url;`,
      [cat.id, cat.name, cat.slug, cat.description, cat.image_url]
    );
  }
  console.log(`- Seeded ${CATEGORIES.length} categories.`);

  // Insert Collections
  for (const col of COLLECTIONS) {
    await client.query(
      `INSERT INTO public.collections (id, name, slug, description, banner_image, is_featured)
       VALUES ($1, $2, $3, $4, $5, $6)
       ON CONFLICT (id) DO UPDATE SET
         name = EXCLUDED.name,
         slug = EXCLUDED.slug,
         description = EXCLUDED.description,
         banner_image = EXCLUDED.banner_image,
         is_featured = EXCLUDED.is_featured;`,
      [col.id, col.name, col.slug, col.description, col.banner_image, col.is_featured ?? false]
    );
  }
  console.log(`- Seeded ${COLLECTIONS.length} collections.`);

  // Insert Products, Variants, Images
  for (const prod of INITIAL_PRODUCTS) {
    await client.query(
      `INSERT INTO public.products (id, name, slug, description, category_id, collection_id, price, sale_price, material, fit, status)
       VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9, $10, $11)
       ON CONFLICT (id) DO UPDATE SET
         name = EXCLUDED.name,
         slug = EXCLUDED.slug,
         description = EXCLUDED.description,
         category_id = EXCLUDED.category_id,
         collection_id = EXCLUDED.collection_id,
         price = EXCLUDED.price,
         sale_price = EXCLUDED.sale_price,
         material = EXCLUDED.material,
         fit = EXCLUDED.fit,
         status = EXCLUDED.status;`,
      [
        prod.id,
        prod.name,
        prod.slug,
        prod.description,
        prod.category_id,
        prod.collection_id || null,
        prod.price,
        prod.sale_price || null,
        prod.material,
        prod.fit,
        prod.status || "active",
      ]
    );

    // Variants
    if (prod.variants && prod.variants.length > 0) {
      for (const v of prod.variants) {
        await client.query(
          `INSERT INTO public.product_variants (id, product_id, color, color_hex, size, sku, price_override, stock)
           VALUES ($1, $2, $3, $4, $5, $6, $7, $8)
           ON CONFLICT (id) DO UPDATE SET
             color = EXCLUDED.color,
             color_hex = EXCLUDED.color_hex,
             size = EXCLUDED.size,
             sku = EXCLUDED.sku,
             price_override = EXCLUDED.price_override,
             stock = EXCLUDED.stock;`,
          [v.id, prod.id, v.color, v.color_hex, v.size, v.sku, v.price_override || null, v.stock]
        );
      }
    }

    // Images
    if (prod.images && prod.images.length > 0) {
      for (const img of prod.images) {
        await client.query(
          `INSERT INTO public.product_images (id, product_id, variant_id, image_url, alt_text, position)
           VALUES ($1, $2, $3, $4, $5, $6)
           ON CONFLICT (id) DO UPDATE SET
             image_url = EXCLUDED.image_url,
             alt_text = EXCLUDED.alt_text,
             position = EXCLUDED.position;`,
          [img.id, prod.id, img.variant_id || null, img.image_url, img.alt_text, img.position]
        );
      }
    }
  }
  console.log(`- Seeded ${INITIAL_PRODUCTS.length} products with variants and images.`);

  // Insert Size Guides
  for (const sg of SIZE_GUIDES) {
    await client.query(
      `INSERT INTO public.size_guides (id, product_id, category_id, size, min_height, max_height, chest, waist, hip, garment_length)
       VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9, $10)
       ON CONFLICT (id) DO UPDATE SET
         size = EXCLUDED.size,
         min_height = EXCLUDED.min_height,
         max_height = EXCLUDED.max_height,
         chest = EXCLUDED.chest,
         waist = EXCLUDED.waist,
         hip = EXCLUDED.hip,
         garment_length = EXCLUDED.garment_length;`,
      [
        sg.id,
        sg.product_id || null,
        sg.category_id || null,
        sg.size,
        sg.min_height || null,
        sg.max_height || null,
        sg.chest || null,
        sg.waist || null,
        sg.hip || null,
        sg.garment_length || null,
      ]
    );
  }
  console.log(`- Seeded ${SIZE_GUIDES.length} size guides.`);

  console.log("6. Creating real Admin user in Supabase Auth...");
  const adminEmail = "admin@ay2fly.com";
  const adminPassword = "adminpassword123";

  // Check if admin already exists
  const { data: usersData, error: listError } = await supabaseAdmin.auth.admin.listUsers();
  if (listError) {
    console.error("Error listing users:", listError.message);
  } else {
    let adminUser = usersData.users.find((u) => u.email === adminEmail);
    if (!adminUser) {
      console.log("Creating admin account in auth.users...");
      const { data: created, error: createError } = await supabaseAdmin.auth.admin.createUser({
        email: adminEmail,
        password: adminPassword,
        email_confirm: true,
        user_metadata: {
          full_name: "Ayodele Director",
          role: "admin",
        },
      });
      if (createError) {
        console.error("Failed to create admin:", createError.message);
      } else {
        adminUser = created.user;
        console.log("Admin account created with id:", adminUser.id);
      }
    } else {
      console.log("Admin user already exists with id:", adminUser.id);
      // Update password and metadata to guarantee it matches
      await supabaseAdmin.auth.admin.updateUserById(adminUser.id, {
        password: adminPassword,
        user_metadata: {
          full_name: "Ayodele Director",
          role: "admin",
        },
      });
    }

    if (adminUser) {
      // Ensure admin profile has role: 'admin'
      await client.query(
        `INSERT INTO public.profiles (id, email, full_name, role)
         VALUES ($1, $2, $3, 'admin')
         ON CONFLICT (id) DO UPDATE SET role = 'admin', full_name = EXCLUDED.full_name;`,
        [adminUser.id, adminEmail, "Ayodele Director"]
      );
      console.log("Admin profile verified with role='admin' in public.profiles table!");
    }
  }

  console.log("DATABASE SETUP COMPLETE!");
  await client.end();
}

main().catch((err) => {
  console.error("Setup error:", err);
  process.exit(1);
});
