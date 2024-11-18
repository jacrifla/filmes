import { resetPassword } from "../services/authService.js";

// Adiciona um listener para o evento de submissão do formulário
document.getElementById('resetPasswordForm').addEventListener('submit', async (event) => {
    event.preventDefault();
    const submitButton = event.target.querySelector('button[type="submit"]');
    submitButton.disabled = true;
    submitButton.textContent = 'Redefinindo...';

    const email = document.getElementById('email').value;
    const novaSenha = document.getElementById('novaSenha').value;

    try {
        const result = await resetPassword(email, novaSenha);
        responseMessage.textContent = result.success 
            ? 'Senha redefinida com sucesso! Redirecionando para o login.' 
            : result.message;
        responseMessage.style.color = result.success ? 'green' : 'red';

        if (result.success) setTimeout(() => window.location.href = '../pages/login.html', 2000);
    } catch (error) {
        responseMessage.textContent = error.message;
        responseMessage.style.color = 'red';
    } finally {
        submitButton.disabled = false;
        submitButton.textContent = 'Redefinir Senha';
    }
});
