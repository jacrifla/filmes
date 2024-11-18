// Recupera os dados do usuário do localStorage
const user = JSON.parse(localStorage.getItem('user'));

// Função para obter o id do usuário
export function getUserId() {
  return user?.id || null; // Retorna o id do usuário ou null se não encontrar
}
