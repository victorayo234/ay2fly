const { Pool } = require("pg");

const connectionString =
  process.env.DATABASE_URL ||
  process.env.POSTGRES_URL_NON_POOLING;

if (!connectionString) {
  console.error("Missing DATABASE_URL or POSTGRES_URL_NON_POOLING.");
  process.exit(1);
}

const pool = new Pool({
  connectionString,
  ssl: { rejectUnauthorized: false },
});

async function main() {
  console.log("Applying iron-clad profile role protection trigger...");
  await pool.query(`
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
  console.log("Trigger applied successfully!");
  await pool.end();
}

main().catch(err => {
  console.error("Error applying trigger:", err);
  process.exit(1);
});
