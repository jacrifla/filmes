export function getUserId() {
  const user = localStorage.getItem('user');

  if (user) {
    try {
      const parsedUser = JSON.parse(user);
      
      return parsedUser.id; // Retorna o id do usuário
    } catch (error) {
      console.error('Erro ao analisar usuário do localStorage:', error);
      return null;
    }
  }
  return null; // Retorna null se não encontrar o usuário
}
