import { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { register } from '../services/authService';
import { useAuth } from '../hooks/useAuth';
import AuthBanner from '../components/auth/AuthBanner';
import AuthCard from '../components/auth/AuthCard';
import AuthInput from '../components/auth/AuthInput';
import '../styles/auth.css';

const Register = () => {
  const [form, setForm] = useState({
    name: '',
    email: '',
    password: '',
    confirmPassword: '',
  });
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();
  const { setUser, setToken } = useAuth();

  const handleChange = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    const { name, email, password, confirmPassword } = form;

    if (!name || !email || !password || !confirmPassword) {
      setError('Todos os campos são obrigatórios.');
      return;
    }
    if (password !== confirmPassword) {
      setError('As senhas não coincidem.');
      return;
    }

    setLoading(true);
    try {
      const response = await register({ name, email, password });
      const {
        data: { user, token },
      } = response;

      setUser(user);
      setToken(token);
      localStorage.setItem('token', token);
      localStorage.setItem('user', JSON.stringify(user));
      navigate('/');
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="login-container">
      <AuthBanner />

      <AuthCard title="Criar conta">
        {error && <div className="alert alert-danger mb-4">{error}</div>}

        <form onSubmit={handleSubmit}>
          <AuthInput
            id="name"
            label="Nome"
            value={form.name}
            onChange={handleChange}
          />
          <AuthInput
            id="email"
            label="E-mail"
            type="email"
            value={form.email}
            onChange={handleChange}
          />
          <AuthInput
            id="password"
            label="Senha"
            type="password"
            value={form.password}
            onChange={handleChange}
          />
          <AuthInput
            id="confirmPassword"
            label="Confirmar Senha"
            type="password"
            value={form.confirmPassword}
            onChange={handleChange}
          />

          <button
            type="submit"
            className="btn btn-primary w-100 mb-3"
            disabled={loading}
          >
            {loading ? 'Criando conta...' : 'Registrar'}
          </button>
        </form>

        <div className="text-center">
          <small>
            Já tem uma conta? <Link to="/login">Faça login</Link>
          </small>
        </div>
      </AuthCard>
    </div>
  );
};

export default Register;
