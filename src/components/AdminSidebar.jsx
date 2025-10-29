import React from 'react';
import { Link, useLocation } from 'react-router-dom';

export default function AdminSidebar() {
  const location = useLocation();

  const links = [
    { to: '/admin/dashboard', icon: 'bi-speedometer2', label: 'Dashboard' },
    { to: '/admin/users',     icon: 'bi-people',       label: 'Usuarios' },
    { to: '/admin/reports',   icon: 'bi-bar-chart',    label: 'Reportes' },
    { to: '/admin/settings',  icon: 'bi-gear',         label: 'Configuración' },
  ];

  const isActive = (to) =>
    location.pathname === to || location.pathname.startsWith(to + '/');

  return (
    <aside className="w3-card w3-white rounded-3 p-3 shadow-sm">
      <div className="list-group">
        {links.map((l) => (
          <Link
            key={l.to}
            to={l.to}
            className={`list-group-item list-group-item-action d-flex align-items-center gap-2 ${isActive(l.to) ? 'active' : ''}`}
          >
            <i className={`bi ${l.icon}`}></i>
            <span>{l.label}</span>
          </Link>
        ))}
      </div>
    </aside>
  );
}
