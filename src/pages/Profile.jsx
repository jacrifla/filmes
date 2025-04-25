import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../hooks/useAuth';
import '../styles/profile.css';
import {
  deleteAccount,
  getStats,
  updateProfile,
} from '../services/userService';
import { changeUserPassword } from '../services/authService';
import AuthInput from '../components/auth/AuthInput';

export default function Profile() {
  const { user, token, logout, setUser } = useAuth();

  const navigate = useNavigate();
  const [stats, setStats] = useState({ watched: 0, watchlist: 0, ratings: 0 });
  const [editData, setEditData] = useState({ name: '', email: '' });
  const [passData, setPassData] = useState({
    currentPassword: '',
    newPassword: '',
    confirm: '',
  });
  const [msg, setMsg] = useState({ profile: '', password: '', delete: '' });
  const [err, setErr] = useState({ profile: '', password: '' });

  useEffect(() => {
    if (!user) return;

    setEditData({ name: user.name, email: user.email });

    const fetchStats = async () => {
      try {
        const result = await getStats(user.id, token);

        setStats({
          watched: result?.data?.watched ?? 0,
          watchlist: result?.data?.watchlist ?? 0,
          ratings: result?.data?.ratings ?? 0,
        });
        
      } catch (err) {
        console.error('Erro ao buscar estatísticas:', err);
      }
    };

    fetchStats();
  }, [user, token]);

  if (!user)
    return <div className="profile-container">Carregando perfil...</div>;

  const handleProfileChange = (e) => {
    setEditData({ ...editData, [e.target.name]: e.target.value });
  };

  const submitProfile = async () => {
    setErr({ ...err, profile: '' });
    try {
      const updated = await updateProfile({id: user.id, editData, token});
      console.log(updated);
      
      setUser(updated);
      setMsg({ ...msg, profile: 'Perfil atualizado com sucesso!' });
    } catch (e) {
      setErr({ ...err, profile: e.message });
    }
  };

  const handlePassChange = (e) => {
    setPassData({ ...passData, [e.target.name]: e.target.value });
  };

  const submitPassword = async () => {
    setErr({ ...err, password: '' });
    if (passData.newPassword !== passData.confirm) {
      setErr({ ...err, password: 'Senhas não coincidem.' });
      return;
    }
    try {
      await changeUserPassword({
        currentPassword: passData.currentPassword,
        newPassword: passData.newPassword,
        token,
      });

      setMsg({ ...msg, password: 'Senha alterada!' });
      setPassData({ currentPassword: '', newPassword: '', confirm: '' });
    } catch (e) {
      setErr({ ...err, password: e.message });
    }
  };

  const handleDelete = async () => {
    if (!window.confirm('Tem certeza que deseja excluir sua conta?')) return;
    try {
      await deleteAccount(user.id, token);
      logout();
      navigate('/register');
    } catch (e) {
      setMsg({ ...msg, delete: e.message });
    }
  };

  return (
    <div className="profile-container">
      <h2 className="text-dark">Olá, {user.name}</h2>
      <div className="stats">
        <div>Assistidos: {stats.watched}</div>
        <div>Na lista: {stats.watchlist}</div>
        <div>Avaliações: {stats.ratings}</div>
      </div>

      <div className="card profile-card">
        <h3>Editar Perfil</h3>
        {err.profile && <div className="alert alert-danger">{err.profile}</div>}
        {msg.profile && (
          <div className="alert alert-success">{msg.profile}</div>
        )}
        <AuthInput
          name="name"
          label="Nome"
          value={editData.name}
          onChange={handleProfileChange}
        />
        <AuthInput
          name="email"
          label="E-mail"
          type="email"
          value={editData.email}
          onChange={handleProfileChange}
        />
        <button className="btn btn-primary" onClick={submitProfile}>
          Salvar
        </button>
      </div>

      <div className="card profile-card">
        <h3>Alterar Senha</h3>
        {err.password && (
          <div className="alert alert-danger">{err.password}</div>
        )}
        {msg.password && (
          <div className="alert alert-success">{msg.password}</div>
        )}
        <AuthInput
          name="currentPassword"
          label="Senha Atual"
          type="password"
          value={passData.currentPassword}
          onChange={handlePassChange}
        />
        <AuthInput
          name="newPassword"
          label="Nova Senha"
          type="password"
          value={passData.newPassword}
          onChange={handlePassChange}
        />
        <AuthInput
          name="confirm"
          label="Confirmar Senha"
          type="password"
          value={passData.confirm}
          onChange={handlePassChange}
        />
        <button className="btn btn-warning" onClick={submitPassword}>
          Alterar Senha
        </button>
      </div>

      <div className="card profile-card delete-card">
        {msg.delete && <div className="alert alert-danger">{msg.delete}</div>}
        <button className="btn btn-danger" onClick={handleDelete}>
          Excluir Conta
        </button>
      </div>
    </div>
  );
}
