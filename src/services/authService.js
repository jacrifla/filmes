import { BASE_URL } from "../utils/constants";
const ENDPOINT = `${BASE_URL}/auth`;

export async function login(email, password) {
    const response = await fetch(`${ENDPOINT}/login`, {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json',
        },
        body: JSON.stringify({ email, password }),
    });

    if (!response.ok) {
        const error = await response.json();
        throw new Error(error.message || 'Erro ao fazer login');
    }

    const data = await response.json();

    return data;
}

export async function register({ name, email, password }) {
    const res = await fetch(`${ENDPOINT}/register`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ name, email, password }),
    })

    const data = await res.json();

    if (!res.ok) {
        throw new Error(data.message || 'Erro ao registrar usuário.');
    }

    return data;
}

export async function requestPasswordReset(email) {
    const res = await fetch(`${ENDPOINT}/request-reset`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email }),
    });

    const data = await res.json();

    if (!res.ok) {
        throw new Error(data.message || "Erro ao solicitar reset");
    }

    return data;
}

export async function resetPassword(token, newPassword) {
    const res = await fetch(`${ENDPOINT}/reset-password`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ token, newPassword }),
    });

    const data = await res.json();

    if (!res.ok) {
        throw new Error(data.message || "Erro ao redefinir a senha");
    };

    return data;
}

export async function changeUserPassword({ currentPassword, newPassword, token }) {
    const res = await fetch(`${ENDPOINT}/change-password`, {
        method: 'PUT',
        headers: {
            'Content-Type': 'application/json',
            Authorization: `Bearer ${token}`
        },
        body: JSON.stringify({ currentPassword, newPassword })
    });
    const data = await res.json();
    if (!res.ok) throw new Error(data.message || 'Erro ao alterar senha.');
    return data.message;
}