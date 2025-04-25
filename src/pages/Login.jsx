import { useState } from "react";
import { useNavigate, Link } from "react-router-dom";
import { login } from "../services/authService";
import { useAuth } from "../hooks/useAuth";
import "../styles/auth.css";
import AuthCard from "../components/auth/AuthCard";
import AuthBanner from "../components/auth/AuthBanner";
import AuthInput from "../components/auth/AuthInput";

const Login = () => {
  const [form, setForm] = useState({ email: "", password: "" });
  const [error, setError] = useState("");
  const { setUser, setToken } = useAuth();
  const navigate = useNavigate();

  const handleChange = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError("");

    try {
      const response = await login(form.email, form.password);
      setUser(response.data.user);
      setToken(response.data.token);
      localStorage.setItem("token", response.data.token);
      localStorage.setItem("user", JSON.stringify(response.data.user));
      navigate("/");
    } catch (err) {
      setError(`Credenciais inválidas. Tente novamente. ${err}`);
    }
  };

  return (
    <div className="login-container">
      <AuthBanner
        title="Sua jornada cinéfila começa aqui 🎬"
        subtitle="Descubra, marque e avalie seus filmes e séries favoritos."
      />

      <div className="login-form-wrapper d-flex align-items-center justify-content-center">
        <AuthCard title="Entre e organize os filmes e séries que você quer assistir 🎥✨">
          {error && <div className="alert alert-danger mb-4">{error}</div>}

          <form onSubmit={handleSubmit}>
            <AuthInput
              label="Email"
              type="email"
              name="email"
              value={form.email}
              onChange={handleChange}
            />
            <AuthInput
              label="Senha"
              type="password"
              name="password"
              value={form.password}
              onChange={handleChange}
            />

            <button type="submit" className="btn btn-primary w-100 mb-3">
              Entrar
            </button>
          </form>

          <div className="text-center">
            <small>
              Não tem uma conta? <Link to="/register">Cadastre-se</Link>
            </small>
          </div>
          <div className="text-center mt-2">
            <small>
              <Link to="/reset-password">Esqueceu sua senha?</Link>
            </small>
          </div>
        </AuthCard>
      </div>
    </div>
  );
};

export default Login;
