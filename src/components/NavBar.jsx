import { Link, useLocation,useNavigate } from "react-router-dom";

export default function NavBar() {
  const location = useLocation();
  const navigate = useNavigate();

  const handleLogout = () => {
    localStorage.removeItem("authToken");
    localStorage.removeItem("role");
    navigate("/login");
  }

  const authed = !!localStorage.getItem("authToken");

  return (
    <div>
      <nav className="navbar navbar-expand-lg navbar-light bg-white border-bottom sticky-top">
        <div className="container">
          <Link className="navbar-brand fw-bold" to="/">
            <i className="bi bi-mortarboard"></i>MentorMatch
          </Link>
          <button className="navbar-toggler" type="button" data-bs-toggle="collapse" data-bs-target="#navbarExamples">
            <span className="navbar-toggler-icon"></span>
          </button>
          <div className="collapse navbar-collapse" id="navbarExamples">
            <ul className="navbar-nav ms-auto mb-2 mb-lg-0">
              {/* Mostrar links de perfil solo cuando NO estemos en /login ni /register y no estemos autenticados */}
              {!authed && location.pathname !== '/login' && location.pathname !== '/register' && (
                <>
                  <li className="nav-item">
                    <Link className={`nav-link ${location.pathname === '/student' ? 'active' : ''}`} to="/student">
                      Perfil Estudiante
                    </Link>
                  </li>
                  <li className="nav-item">
                    <Link className={`nav-link ${location.pathname === '/mentor' ? 'active' : ''}`} to="/mentor">
                      Perfil Mentor
                    </Link>
                  </li>
                </>
              )}
            </ul>
            <div className="d-flex align-items-center gap-2">
              {!authed ? (
                <>
                  <Link className="btn btn-primary btn-sm px-3" aria-label="Iniciar sesión" to="/login">Iniciar sesión</Link>
                  <Link className="btn btn-outline-secondary btn-sm px-3" aria-label="Registrarse" to="/register">Registrarse</Link>
                </>
              ) : (
                <>
                  <button className="btn btn-danger btn-sm" onClick={handleLogout} aria-label="Cerrar sesión">Cerrar sesión</button>
                </>
              )}
            </div>
          </div>
        </div>
      </nav>
    </div>
  )
}

