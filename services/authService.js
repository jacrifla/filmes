import { BASE_API_URL } from "../other/config";

const API_URL = `${BASE_API_URL}/usuarios`;

async function fetchData(endpoint, method, body) {
    const response = await fetch(`${API_URL}${endpoint}`, {
        method,
        headers: {
            'Content-Type': 'application/json',
        },
        body: body ? JSON.stringify(body) : null,
    });
    
    const data = await response.json();
    if (!response.ok) {
        throw new Error(data.message || 'Erro na requisição');
    }
    return data;
}

export async function registerUser(name, email, password) {
    try {
        return await fetchData('/register', 'POST', { nome: name, email, senha: password });
    } catch (error) {
        console.error('Erro ao registrar:', error.message);
        return { success: false, message: error.message };
    }
}

export async function loginUser(email, password) {
    try {        
        return await fetchData('/login', 'POST', {email, senha: password});
    } catch (error) {
        console.error('Erro ao fazer login:', error.message);
        return { success: false, message: error.message };        
    }
}


export async function deleteUser(userId) {
    try {
        // Usando a função genérica fetchData para a requisição DELETE
        const result = await fetchData(`/${userId}`, 'DELETE');
        return result;
    } catch (error) {
        console.error('Erro ao deletar usuário:', error);
        return { success: false, message: error.message };
    }
}

export async function updateUser(userId, userData) {
    try {
        // Usando a função genérica fetchData para a requisição PUT
        const result = await fetchData(`/update/${userId}`, 'PUT', userData);
        return result;
    } catch (error) {
        console.error('Erro ao atualizar usuário:', error);
        return { success: false, message: error.message };
    }
}

// Função para redefinir a senha
export async function resetPassword(email, novaSenha) {
    try {
        const data = await fetchData('/redefinir-senha', 'PUT', { email, novaSenha });
        return data;
    } catch (error) {
        console.error(error);
        return { success: false, message: error.message };
    }
}
