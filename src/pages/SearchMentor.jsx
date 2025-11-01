import React, { useState } from 'react';
import DashboardLayout from '../layouts/DashboardLayout';

export default function SearchMentor() {
  const [q, setQ] = useState('');
  const [resultados, setResultados] = useState([]);
  const [loading, setLoading] = useState(false);

  const handleBuscar = async () => {
    setLoading(true);
    try {
      const base = 'http://localhost:8080/mentors/search';
      const url =
        q && q.trim()
          ? `${base}?q=${encodeURIComponent(q.trim())}`
          : base;

      const resp = await fetch(url);
      if (!resp.ok) {
        console.error('Error al buscar mentores:', resp.status);
        alert('No se pudieron cargar los mentores');
        setLoading(false);
        return;
      }

      const data = await resp.json();
      setResultados(data);
    } catch (err) {
      console.error('Error de red al buscar mentores:', err);
      alert('No se pudo conectar con el servidor');
    } finally {
      setLoading(false);
    }
  };

  const handleKeyDown = (e) => {
    if (e.key === 'Enter') {
      handleBuscar();
    }
  };

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
            onKeyDown={handleKeyDown}
          />
          <button className="btn btn-primary" onClick={handleBuscar} disabled={loading}>
            {loading ? 'Buscando...' : 'Buscar'}
          </button>
        </div>
        <div className="form-text">
          Puedes buscar por <strong>nombre del mentor</strong> o por <strong>habilidad</strong> que tenga registrada.
        </div>
      </div>

      <div className="list-group">
        {resultados.length === 0 && !loading && (
          <div className="text-muted small">
            No hay resultados. Escribe algo y presiona buscar.
          </div>
        )}

        {resultados.map((m) => (
          <div
            key={m.id}
            className="list-group-item list-group-item-action d-flex justify-content-between align-items-center"
          >
            <div>
              <div className="fw-semibold">{m.name}</div>
              <div className="small text-secondary">
                {m.skills && m.skills.trim() !== '' ? m.skills : 'Sin habilidades registradas'}
              </div>
              {m.biografia && (
                <div className="small mt-1">
                  {m.biografia.length > 120 ? m.biografia.slice(0, 120) + '…' : m.biografia}
                </div>
              )}
              {m.city && (
                <div className="badge bg-light text-dark border mt-2">
                  {m.city}
                </div>
              )}
            </div>
            <div className="text-end">
              <span className="badge text-bg-primary d-block mb-2">
                {m.score ? `${m.score}% match` : 'Mentor'}
              </span>
              {/* Aquí luego puedes enlazar al perfil del mentor */}
              <button className="btn btn-sm btn-outline-secondary">
                Ver perfil
              </button>
            </div>
          </div>
        ))}
      </div>
    </DashboardLayout>
  );
}

