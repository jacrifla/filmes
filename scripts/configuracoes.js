import { updateUser, deleteUser } from '../services/authService.js';
import { getRatings } from '../services/avaliacaoService.js';
import { getWatchList, getWatchedList } from '../services/listaAssistirService.js';

let userId; // Declare userId no escopo global

document.addEventListener('DOMContentLoaded', () => {
    const form = document.getElementById('configForm');
    const deleteButton = document.getElementById('deleteAccount');
    const messageElement = document.getElementById('message');

    // Carregar dados do usuário quando a página for carregada
    loadUserData();

    // Carregar estatísticas do usuário
    loadUserStatistics();

    // Manipular envio do formulário de configurações
    form.addEventListener('submit', async (event) => {
        event.preventDefault();

        // Verifique se userId está definido
        if (!userId) {
            messageElement.textContent = 'Erro: ID do usuário não encontrado.';
            messageElement.className = 'alert alert-danger';
            return; // Impede que o código continue se userId estiver undefined
        }

        const nome = document.getElementById('nameInput').value;
        const email = document.getElementById('emailInput').value;
        const senha = document.getElementById('passwordInput').value;

        // Chamando updateUser
        const result = await updateUser(userId, { nome, email, senha });

        if (result.success) {
            messageElement.textContent = 'Dados atualizados com sucesso!';
            messageElement.className = 'alert alert-success';
        } else {
            messageElement.textContent = result.message;
            messageElement.className = 'alert alert-danger';
        }
    });

    // Manipular exclusão da conta
    deleteButton.addEventListener('click', async () => {
        const confirmation = confirm('Você tem certeza que deseja excluir sua conta? Esta ação não pode ser desfeita.');
        if (confirmation) {
            const result = await deleteUser(userId); // Passando o userId aqui

            if (result.success) {
                // Remove as informações do localStorage
                localStorage.removeItem('user');

                messageElement.textContent = 'Conta excluída com sucesso!';
                messageElement.className = 'alert alert-success';
                
                setTimeout(() => {
                    window.location.href = '../index.html';
                }, 2000);
            } else {
                messageElement.textContent = result.message;
                messageElement.className = 'alert alert-danger';
            }
        }
    });
    
});

// Função para carregar os dados do usuário
async function loadUserData() {
    const storedUserData = JSON.parse(localStorage.getItem('user'));

    if (storedUserData) {
        userId = storedUserData.id;

        document.getElementById('nameInput').value = storedUserData.nome || '';
        document.getElementById('emailInput').value = storedUserData.email || '';
    } else {
        console.log('Dados do usuário não encontrados no localStorage.');
    }
}

// Função para carregar as estatísticas do usuário
async function loadUserStatistics() {
    try {
        const watchList = await getWatchList();        
        const watchedMovies = await getWatchedList();
        const ratingCount = await getRatings(userId);       

        // Atualizando os contadores no HTML
        document.getElementById('watchedCount').textContent = watchedMovies.length;        
        document.getElementById('watchlistCount').textContent = watchList.length;
        document.getElementById('ratingCount').textContent = ratingCount.length;
    } catch (error) {
        console.error('Erro ao carregar as estatísticas do usuário:', error);
    }
}
