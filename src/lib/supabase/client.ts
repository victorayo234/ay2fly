import { createBrowserClient } from "@supabase/ssr";

const supabaseUrl =
  process.env.NEXT_PUBLIC_SUPABASE_URL ||
  "https://tqchfocigayxndjdqfqx.supabase.co";

const supabaseAnonKey =
  process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY ||
  "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InRxY2hmb2NpZ2F5eG5kamRxZnF4Iiwicm9sZSI6ImFub24iLCJpYXQiOjE3OTAzNjMyODksImV4cCI6MjEwNTkzOTI4OX0.Sm2ZipjJ5OL9Yyna0tC0WrV50VRDEcUFqixGjDh9khU";

export function createClient() {
  return createBrowserClient(supabaseUrl, supabaseAnonKey);
}

export const supabase = createClient();
