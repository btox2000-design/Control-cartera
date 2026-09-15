import { supabase } from '/src/supabaseClient.js';

/**
 * Gestión de la autenticación global
 */
export const AuthManager = {
    init: async () => {
        const { data: { session }, error } = await supabase.auth.getSession();
        
        if (error) {
            console.error("Error al obtener sesión:", error.message);
            return null;
        }

        // Proteger rutas (excepto login)
        if (!session && !window.location.pathname.endsWith('login.html')) {
            window.location.href = '/login.html';
            return null;
        }

        if (session) {
            AuthManager.updateUserUI(session.user);
        }
        return session;
    },

    updateUserUI: (user) => {
        const desktopStatus = document.getElementById('desktop-user-status');
        const headerStatus = document.getElementById('header-user-status');

        const authHtml = `
            <div class="user-menu">
                <span style="font-size: 0.8rem; color: #b0bec5;" title="${user.email}">👤 ${user.email.split('@')[0]}</span>
                <button id="logout-btn" class="btn-logout">Salir</button>
            </div>
        `;

        if (desktopStatus) desktopStatus.innerHTML = authHtml;
        if (headerStatus) headerStatus.innerHTML = `<button id="mobile-logout-btn" class="btn-logout">Salir</button>`;

        const handleLogout = async () => {
            await supabase.auth.signOut();
            window.location.href = '/login.html';
        };

        document.getElementById('logout-btn')?.addEventListener('click', handleLogout);
        document.getElementById('mobile-logout-btn')?.addEventListener('click', handleLogout);
    }
};
