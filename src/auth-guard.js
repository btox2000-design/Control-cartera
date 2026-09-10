// auth-guard.js
// Asumimos que supabase está disponible globalmente desde el script CDN
export const checkAuth = async () => {
    const { data: { session } } = await window.supabase.auth.getSession();
    if (!session) {
        window.location.href = 'login.html';
    }
    return session;
};
