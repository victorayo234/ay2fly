const { Pool } = require("pg");

const connectionString = process.env.DATABASE_URL || process.env.POSTGRES_URL_NON_POOLING;
if (!connectionString) {
  console.error("Missing DATABASE_URL or POSTGRES_URL_NON_POOLING.");
  process.exit(1);
}

const pool = new Pool({
  connectionString,
  ssl: { rejectUnauthorized: false },
});

async function main() {
  console.log("Updating profiles_role_check constraint to permit 'customer' and 'admin'...");
  await pool.query(`
    ALTER TABLE public.profiles DROP CONSTRAINT IF EXISTS profiles_role_check;
    ALTER TABLE public.profiles ADD CONSTRAINT profiles_role_check 
      CHECK (role = ANY (ARRAY['customer'::text, 'admin'::text, 'owner'::text, 'manager'::text, 'staff'::text]));
    ALTER TABLE public.profiles ALTER COLUMN role SET DEFAULT 'customer';
  `);
  console.log("Constraint and default updated successfully!");
  await pool.end();
}

main().catch((err) => {
  console.error("Error updating constraint:", err);
  process.exit(1);
});
