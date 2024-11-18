import { registerUser } from '../services/authService.js';
import { createToast } from '../components/Toast.js';

document.addEventListener('DOMContentLoaded', () => {
    const form = document.getElementById('registerForm');
    
    // Toggle para mostrar/ocultar senha
    const togglePassword = document.getElementById('togglePassword');
    const passwordInput = document.getElementById('passwordInput');

    togglePassword.addEventListener('click', () => {
        // Verifica se a senha está visível ou oculta
        const type = passwordInput.type === 'password' ? 'text' : 'password';
        passwordInput.type = type;
        // Alterna o ícone (olho fechado ou aberto)
        togglePassword.querySelector('i').classList.toggle('bi-eye');
        togglePassword.querySelector('i').classList.toggle('bi-eye-slash');
    });

    // Toggle para mostrar/ocultar confirmar senha
    const toggleConfirmPassword = document.getElementById('toggleConfirmPassword');
    const confirmPasswordInput = document.getElementById('confirmPasswordInput');

    toggleConfirmPassword.addEventListener('click', () => {
        // Verifica se a senha está visível ou oculta
        const type = confirmPasswordInput.type === 'password' ? 'text' : 'password';
        confirmPasswordInput.type = type;
        // Alterna o ícone (olho fechado ou aberto)
        toggleConfirmPassword.querySelector('i').classList.toggle('bi-eye');
        toggleConfirmPassword.querySelector('i').classList.toggle('bi-eye-slash');
    });

    // Função para verificar a senha
    function isValidPassword(password) {
        const passwordRegex = /^(?=.*[A-Za-z])(?=.*\d)(?=.*[!@#$%^&*])[A-Za-z\d!@#$%^&*]{8,}$/;
        return passwordRegex.test(password);
    }

    // Função para verificar se as senhas coincidem
    function doPasswordsMatch(password, confirmPassword) {
        return password === confirmPassword;
    }

    form.addEventListener('submit', async (event) => {
        event.preventDefault();
        const submitButton = form.querySelector('button[type="submit"]');
        submitButton.disabled = true;
        submitButton.textContent = 'Cadastrando...';

        // Pegando os valores do formulário
        let nome = document.getElementById('nameInput').value;
        let email = document.getElementById('emailInput').value;
        const password = document.getElementById('passwordInput').value;
        const confirmPassword = document.getElementById('confirmPasswordInput').value;

        // Verifica se a senha é válida
        if (!isValidPassword(password)) {
            createToast('A senha deve ter pelo menos 8 caracteres, contendo letras, números e caracteres especiais.', 'danger');
            submitButton.disabled = false;
            submitButton.textContent = 'Cadastrar';
            return;
        }

        // Verifica se as senhas coincidem
        if (!doPasswordsMatch(password, confirmPassword)) {
            createToast('As senhas não coincidem.', 'danger');
            submitButton.disabled = false;
            submitButton.textContent = 'Cadastrar';
            return;
        }

        // Converte o email para minúsculas
        email = email.toLowerCase();

        // Função para formatar o nome
        nome = formatName(nome);

        try {
            const result = await registerUser(nome, email, password);
            createToast(result.success ? 'Cadastro realizado com sucesso!' : result.message, result.success ? 'success' : 'danger');
            if (result.success) setTimeout(() => window.location.href = '../pages/login.html', 2000);
        } catch (error) {
            // Exibe o erro no Toast
            createToast(error.message, 'danger');
        } finally {
            submitButton.disabled = false;
            submitButton.textContent = 'Cadastrar';
        }
    });
});

// Função para formatar o nome (primeira letra de cada palavra em maiúscula)
function formatName(name) {
    return name
        .toLowerCase() // Converte todo o nome para minúsculo
        .split(' ') // Separa o nome em palavras
        .map(word => word.charAt(0).toUpperCase() + word.slice(1)) // Coloca a primeira letra de cada palavra em maiúscula
        .join(' '); // Junta novamente as palavras em uma string
}
