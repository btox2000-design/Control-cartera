import { signIn, signUp } from './authService.js';

/**
 * Lógica de UI para Autenticación (maneja formulario dinámico)
 */
export function setupAuthUI(formId, toggleBtnId, formTitleId, submitBtnId, messageBoxId) {
    const authForm = document.getElementById(formId);
    const toggleBtn = document.getElementById(toggleBtnId);
    const formTitle = document.getElementById(formTitleId);
    const submitBtn = document.getElementById(submitBtnId);
    const messageBox = document.getElementById(messageBoxId);

    let isLoginMode = true;

    toggleBtn.onclick = (e) => {
        e.preventDefault();
        isLoginMode = !isLoginMode;
        formTitle.textContent = isLoginMode ? 'Iniciar Sesión' : 'Crear Cuenta';
        submitBtn.textContent = isLoginMode ? 'Ingresar' : 'Registrarse';
        toggleBtn.textContent = isLoginMode ? '¿No tienes cuenta? Regístrate' : '¿Ya tienes cuenta? Inicia sesión';
        messageBox.style.display = 'none';
    };

    authForm.addEventListener('submit', async (e) => {
        e.preventDefault();
        const email = e.target.email.value;
        const password = e.target.password.value;
        
        messageBox.className = '';
        messageBox.style.display = 'none';

        try {
            if (isLoginMode) {
                const { error } = await signIn(email, password);
                if (error) throw error;
                window.location.href = '/index.html';
            } else {
                const { error } = await signUp(email, password);
                if (error) throw error;
                messageBox.className = 'success';
                messageBox.textContent = '¡Registro exitoso! Verifica tu correo electrónico para confirmar la cuenta.';
            }
        } catch (err) {
            messageBox.className = 'error';
            messageBox.textContent = err.message || 'Ocurrió un error inesperado';
        }
    });
}
