import React, { useMemo, useEffect } from 'react';
import { Link, useLocation, useNavigate } from 'react-router-dom';
import SearchMentor from '../pages/SearchMentor';

/**
 * Sidebar component adaptable a 'student' o 'mentor'.
 * Props:
 *  - role (optional): 'student' | 'mentor'. Si no se pasa, se lee de localStorage.role
 */
function Sidebar({ role: propRole } = {}) {
  const location = useLocation();
  const navigate = useNavigate();

  // Determina el rol: prop > localStorage > 'student' por defecto
  const role = useMemo(() => {
    if (propRole) return propRole;
    try {
      const r = localStorage.getItem('role');
      return r || 'student';
    } catch (e) {
      return 'student';
    }
  }, [propRole]);

  // Define enlaces por rol
  const links = useMemo(() => {
    const common = [
      // dirigir al dashboard según el rol (student tiene /student/dashboard en App.jsx)
      { to: role === 'mentor' ? '/mentor/dashboard' : '/student/dashboard', label: 'Inicio', icon: 'bi-house' },
      { to: role === 'mentor' ? '/mentor/profile' : '/student/profile', label: 'Mi Perfil', icon: 'bi-person-circle' },
    ];

    if (role === 'mentor') {
      return [
        ...common,
        // usar ruta en minúsculas para coincidir con App.jsx
        { to: '/mentoring', label: 'Mentorías', icon: 'bi-people' },
        { to: '/agenda', label: 'Agenda', icon: 'bi-calendar3' },
      ];
    }

    // student
    return [
      ...common,
      { to: '/buscar-mentor', label: 'Buscar Mentor', icon: 'bi-search' },
      { to: '/mis-sesionesE', label: 'Mis Sesiones', icon: 'bi-calendar-check' },
      { to: '/match', label: 'Match', icon: 'bi-heart' },
    ];
  }, [role]);

  useEffect(() => {
    // debug: mostrar role y links en consola
    // eslint-disable-next-line no-console
    console.log('[Sidebar] role=', role, 'links=', links.map(l => l.to));
  }, [role, links]);

  const isActive = (to) => {
    // marca activo si la ruta actual empieza con el 'to' (flexible)
    return location.pathname === to || location.pathname.startsWith(to + '/');
  };

  return (
    <aside className="w3-card w3-white rounded-3 p-2 shadow-sm">
      <div className="list-group small">
        {links.map((l) => (
          <Link
            key={l.to}
            to={l.to}
            onClick={(e) => {
              // debug click
              // eslint-disable-next-line no-console
              console.log('[Sidebar] click ->', l.to);
              // force navigation programmatically in case Link isn't working
              try {
                navigate(l.to);
              } catch (err) {
                // ignore
              }
            }}
            className={`list-group-item list-group-item-action d-flex justify-content-start align-items-center gap-2 ${isActive(l.to) ? 'active' : ''}`}
          >
            {l.icon && <i className={`bi ${l.icon} me-2`} aria-hidden="true"></i>}
            <span>{l.label}</span>
          </Link>
        ))}
      </div>
    </aside>
  );
}

export default Sidebar;
