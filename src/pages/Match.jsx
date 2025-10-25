import React from 'react';
import DashboardLayout from '../layouts/DashboardLayout';

export default function Match() {
  // TODO: GET /api/students/{id}/matches
  const matches = [
    { id: 101, mentor: 'Ana Ruiz', skills: 'Matemáticas · Lógica', score: 92, estado: 'PENDING' },
    { id: 102, mentor: 'Carlos Pérez', skills: 'Programación · Algoritmos', score: 88, estado: 'PENDING' },
  ];

  return (
    <DashboardLayout role="student" title="Match (Mentores sugeridos)">
      <div className="list-group">
        {matches.map(m => (
          <div
            key={m.id}
            className="list-group-item list-group-item-action d-flex flex-column flex-md-row justify-content-between align-items-start align-items-md-center gap-2"
          >
            <div>
              <div className="fw-semibold">{m.mentor}</div>
              <div className="small text-secondary">{m.skills}</div>
              <div className="small">
                Estado:{' '}
                {m.estado === 'PENDING' ? (
                  <span className="badge text-bg-warning">Pendiente</span>
                ) : m.estado === 'ACCEPTED' ? (
                  <span className="badge text-bg-success">Aceptado</span>
                ) : (
                  <span className="badge text-bg-danger">Rechazado</span>
                )}
              </div>
            </div>

            <div className="d-flex flex-column flex-md-row gap-2 align-items-stretch align-items-md-center">
              <span className="badge text-bg-primary align-self-start">{m.score}% match</span>
              <button className="btn btn-sm btn-success">Aceptar</button>
              <button className="btn btn-sm btn-outline-danger">Rechazar</button>
            </div>
          </div>
        ))}
      </div>
    </DashboardLayout>
  );
}
