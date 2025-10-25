import React, { useState } from 'react';
import DashboardLayout from '../layouts/DashboardLayout';

export default function SearchMentor() {
  const [q, setQ] = useState('');

  // TODO: reemplazar con datos reales del backend
  const resultados = [
    { id: 2, name: 'Ana Ruiz', skills: 'Matemáticas · Lógica', score: 92 },
    { id: 3, name: 'Carlos Pérez', skills: 'Programación · Algoritmos', score: 88 },
  ];

  return (
    <DashboardLayout role="student" title="Buscar Mentor">
      <div className="mb-3">
        <label className="form-label fw-semibold">¿En qué necesitas ayuda?</label>
        <div className="input-group">
          <input
            className="form-control"
            placeholder="Ej: algoritmos, matemáticas discretas, SQL..."
            value={q}
            onChange={(e) => setQ(e.target.value)}
          />
          <button className="btn btn-primary">Buscar</button>
        </div>
      </div>

      <div className="list-group">
        {resultados.map(m => (
          <div
            key={m.id}
            className="list-group-item list-group-item-action d-flex justify-content-between align-items-center"
          >
            <div>
              <div className="fw-semibold">{m.name}</div>
              <div className="small text-secondary">{m.skills}</div>
            </div>
            <span className="badge text-bg-primary">{m.score}% match</span>
          </div>
        ))}
      </div>
    </DashboardLayout>
  );
}
