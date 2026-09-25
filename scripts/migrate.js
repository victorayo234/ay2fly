const { Client } = require("pg");
const fs = require("fs");
const path = require("path");

const connectionString =
  process.env.POSTGRES_URL_NON_POOLING ||
  process.env.DATABASE_URL;

if (!connectionString) {
  console.error("Missing POSTGRES_URL_NON_POOLING or DATABASE_URL.");
  process.exit(1);
}

async function runMigration() {
  const client = new Client({
    connectionString,
    ssl: { rejectUnauthorized: false },
  });

  console.log("Connecting to PostgreSQL...");
  await client.connect();
  console.log("Connected successfully to:", client.host);

  const schemaPath = path.join(__dirname, "../supabase/schema.sql");
  let schemaSql = fs.readFileSync(schemaPath, "utf8");

  // Add the auth trigger to automatically create profiles when a user signs up
  const authTriggerSql = `
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
    full_name = EXCLUDED.full_name;
  RETURN NEW;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

DROP TRIGGER IF EXISTS on_auth_user_created ON auth.users;
CREATE TRIGGER on_auth_user_created
  AFTER INSERT ON auth.users
  FOR EACH ROW EXECUTE FUNCTION public.handle_new_user();
`;

  console.log("Executing schema SQL...");
  await client.query(schemaSql);
  console.log("Executing auth trigger SQL...");
  await client.query(authTriggerSql);

  console.log("Schema migration completed successfully!");

  // Verify created tables
  const res = await client.query(
    "SELECT table_name FROM information_schema.tables WHERE table_schema = 'public' ORDER BY table_name;"
  );
  console.log("Current Public Tables in Database:", res.rows.map((r) => r.table_name));

  await client.end();
}

runMigration().catch((err) => {
  console.error("Migration Failed:", err);
  process.exit(1);
});
