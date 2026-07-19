/* ============================================================
   Configuração do projecto Supabase
   ============================================================
   URL e chave "publishable"/anon do projecto GORS — tal como a
   apiKey do Firebase, esta chave NÃO é secreta: o controlo de
   acesso real é feito pelas políticas RLS na base de dados, não
   por esconder esta chave. Pode ficar exposta no código do site.
   ============================================================ */
const SUPABASE_URL = "https://djjzryfwrwhmoffmzrib.supabase.co";
const SUPABASE_ANON_KEY =
  "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImRqanpyeWZ3cndobW9mZm16cmliIiwicm9sZSI6ImFub24iLCJpYXQiOjE3ODM0ODU3MzksImV4cCI6MjA5OTA2MTczOX0.Po2Sh4xAUmI6PASqhI9uzxvFJOqUok4T1kvfc7AsEJo";

const sb = window.supabase.createClient(SUPABASE_URL, SUPABASE_ANON_KEY, {
  auth: { persistSession: true, autoRefreshToken: true },
});

window.GORS = window.GORS || {};
window.GORS.sb = sb;
