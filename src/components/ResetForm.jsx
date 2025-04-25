import React, { useState } from 'react';
import { requestPasswordReset, resetPassword } from '../services/authService';
import { useNavigate } from 'react-router-dom';
import "../styles/reset.css";

export default function ResetForm() {
  const [step, setStep] = useState('email');
  const [email, setEmail] = useState('');
  const [newPassword, setNewPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [message, setMessage] = useState(null);
  const [error, setError] = useState(null);
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();

  const handleEmailSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError(null);

    try {
      const res = await requestPasswordReset(email);

      localStorage.setItem('reset_token', res.token);
      setMessage(res.message);
      setStep('password');
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  const handlePasswordReset = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError(null);

    if (newPassword !== confirmPassword) {
      setError('As senhas não coincidem.');
      setLoading(false);
      return;
    }

    const token = localStorage.getItem('reset_token');
    if (!token) {
      setError('Token não encontrado. Solicite o reset novamente.');
      setLoading(false);
      return;
    }

    try {
      const res = await resetPassword(token, newPassword);
      setMessage(res.message);
      localStorage.removeItem('reset_token');

      setTimeout(() => {
        navigate('/login');
      }, 2000);

      setStep('email');
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="reset-page">
      <div className="reset-card">
        <h3 className="mb-4 text-center">Redefinir Senha</h3>

        {message && <div className="alert alert-success">{message}</div>}
        {error && <div className="alert alert-danger">{error}</div>}

        {step === 'email' && (
          <form onSubmit={handleEmailSubmit}>
            <div className="mb-3">
              <label className="form-label">E-mail</label>
              <input
                type="email"
                className="form-control"
                required
                value={email}
                onChange={(e) => setEmail(e.target.value)}
              />
            </div>
            <button
              type="submit"
              className="btn btn-primary"
              disabled={loading}
            >
              {loading ? 'Enviando...' : 'Solicitar redefinição'}
            </button>
          </form>
        )}

        {step === 'password' && (
          <form onSubmit={handlePasswordReset}>
            <div className="mb-3">
              <label className="form-label">Nova senha</label>
              <input
                type="password"
                className="form-control"
                required
                value={newPassword}
                onChange={(e) => setNewPassword(e.target.value)}
              />
            </div>

            <div className="mb-3">
              <label className="form-label">Confirmar nova senha</label>
              <input
                type="password"
                className="form-control"
                required
                value={confirmPassword}
                onChange={(e) => setConfirmPassword(e.target.value)}
              />
            </div>

            <button
              type="submit"
              className="btn btn-success"
              disabled={loading}
            >
              {loading ? 'Salvando...' : 'Redefinir Senha'}
            </button>
          </form>
        )}
      </div>
    </div>
  );
}
