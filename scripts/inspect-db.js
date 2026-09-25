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

async function check() {
  const cols = await pool.query(
    "SELECT column_name, data_type, is_nullable, column_default FROM information_schema.columns WHERE table_schema = 'public' AND table_name = 'profiles' ORDER BY ordinal_position"
  );
  console.log("Profiles columns:", cols.rows);

  const triggers = await pool.query(
    "SELECT trigger_name, event_manipulation, event_object_table, action_statement FROM information_schema.triggers WHERE event_object_table IN ('users', 'profiles')"
  );
  console.log("Triggers:", triggers.rows);

  // Check functions
  const funcs = await pool.query(
    "SELECT routine_name, routine_definition FROM information_schema.routines WHERE specific_schema = 'public' AND routine_name IN ('handle_new_user', 'protect_profile_role')"
  );
  console.log("Functions:", funcs.rows);

  const cons = await pool.query(
    "SELECT conname, pg_get_constraintdef(c.oid) FROM pg_constraint c WHERE conrelid = 'public.profiles'::regclass"
  );
  console.log("Constraints on profiles:", cons.rows);

  await pool.end();
}

check().catch(console.error);
