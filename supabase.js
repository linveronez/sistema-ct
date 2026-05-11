// ============================================================
// supabase.js — Sistema CT
// ============================================================
// COMO ENCONTRAR SUAS CHAVES:
//   Supabase Dashboard → seu projeto → Settings → API
//   → "Project URL"  (cole em SUPABASE_URL)
//   → "anon public"  (cole em SUPABASE_ANON_KEY — começa com eyJ...)
//
// IMPORTANTE TÉCNICO:
//   O CDN do supabase-js (carregado antes deste arquivo no HTML)
//   expõe a BIBLIOTECA em window.supabase.
//   Aqui sobrescrevemos window.supabase com o CLIENT configurado,
//   para que todo o sistema use simplesmente: supabase.from(...), supabase.auth...
//   NÃO use const/let para evitar conflito de redeclaração.
// ============================================================

const SUPABASE_URL     = "https://ocrcqcqzvmdzvhlpykcd.supabase.co";
const SUPABASE_ANON_KEY = "sb_publishable_2wiSDlRGeZKif9LDzRKj7Q_SJPl17t9"; // ← substitua isto

// Sobrescreve a biblioteca pelo cliente pronto para uso
window.supabase = window.supabase.createClient(SUPABASE_URL, SUPABASE_ANON_KEY, {
  auth: {
    persistSession: true,       // mantém sessão no localStorage entre abas/recargas
    storageKey: "sistema-ct-auth", // chave usada no localStorage
    autoRefreshToken: true,     // renova o JWT automaticamente antes de expirar
    detectSessionInUrl: false,  // desativa leitura de token na URL (não usamos magic link)
  },
});
