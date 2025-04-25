import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../hooks/useAuth';

export default function Navbar() {
  const { user, logout } = useAuth();
  const navigate = useNavigate();

  const handleLogout = () => {
    logout();
    navigate('/login');
  };

  return (
    <nav className="navbar navbar-expand-lg navbar-dark bg-dark px-3 fixed-top">
      <Link className="navbar-brand" to="/">CineExplore</Link>

      {/* Botão do colapso no mobile */}
      <button
        className="navbar-toggler"
        type="button"
        data-bs-toggle="collapse"
        data-bs-target="#navbarContent"
        aria-controls="navbarContent"
        aria-expanded="false"
        aria-label="Toggle navigation"
      >
        <span className="navbar-toggler-icon"></span>
      </button>

      {/* Conteúdo colapsável */}
      <div className="collapse navbar-collapse" id="navbarContent">
        <ul className="navbar-nav me-auto">
          {user && (
            <>
              <li className="nav-item">
                <Link className="nav-link" to="/">Filmes</Link>
              </li>
              <li className="nav-item">
                <Link className="nav-link" to="/library">Biblioteca</Link>
              </li>
              <li className="nav-item">
                <Link className="nav-link" to="/profile">Perfil</Link>
              </li>
            </>
          )}
        </ul>

        <ul className="navbar-nav ms-auto">
          {user ? (
            <>
              <li className="nav-item d-flex align-items-center me-2">
                <span className="navbar-text text-light">Olá, {user.name} 👋</span>
              </li>
              <li className="nav-item">
                <button className="btn btn-outline-light" onClick={handleLogout}>
                  Sair
                </button>
              </li>
            </>
          ) : (
            <>
              <li className="nav-item">
                <Link className="nav-link" to="/login">Entrar</Link>
              </li>
              <li className="nav-item">
                <Link className="nav-link" to="/register">Cadastrar</Link>
              </li>
            </>
          )}
        </ul>
      </div>
    </nav>
  );
}
