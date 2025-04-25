import { BASE_URL } from "../utils/constants";

const ENDPOINT = `${BASE_URL}/user`;

export async function getStats(userId, token) {
    const res = await fetch(`${ENDPOINT}/${userId}/stats`, {
        headers: {
            'Content-Type': 'application/json',
            Authorization: `Bearer ${token}`
        }
    });

    const data = await res.json();

    if (!res.ok) throw new Error(data.message || 'Erro ao buscar estatísticas.');
    return data;
};

export async function updateProfile({ id, editData, token }) {
    const res = await fetch(`${ENDPOINT}/update/${id}`, {
        method: 'PUT',
        headers: {
            'Content-Type': 'application/json',
            Authorization: `Bearer ${token}`
        },
        body: JSON.stringify({
            name: editData.name,
            email: editData.email
        })
    });

    const data = await res.json();

    if (!res.ok) throw new Error(data.message || 'Erro ao atualizar perfil.');
    return data.data;
};

export async function deleteAccount(userId, token) {
    const res = await fetch(`${ENDPOINT}/delete/${userId}`, {
        method: 'DELETE',
        headers: { Authorization: `Bearer ${token}` }
    });

    const data = await res.json();

    if (!res.ok) throw new Error(data.message || 'Erro ao excluir conta.');
    return data;
};