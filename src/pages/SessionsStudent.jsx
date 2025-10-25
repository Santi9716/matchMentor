import React, { useState } from 'react';
import DashboardLayout from '../layouts/DashboardLayout';
import CreateMentoria from '../components/CreateMentoria';

export default function SessionsStudent() {
  // TODO: GET /api/students/{id}/sessions
  const [sesiones, setSesiones] = useState([
    { id: 1, mentor: 'Ana Ruiz', fecha: '2025-10-20 18:00', estado: 'Completada' },
    { id: 2, mentor: 'Carlos Pérez', fecha: '2025-10-23 19:00', estado: 'Agendada' },
  ]);

  const [selected, setSelected] = useState(null);
  const [modalOpen, setModalOpen] = useState(false);
  const [rating, setRating] = useState(5);
  const [createOpen, setCreateOpen] = useState(false);
  const [successMsg, setSuccessMsg] = useState('');

  const openModal = (session) => {
    setSelected(session);
    setRating(session.rating || 5);
    setModalOpen(true);
  };

  const closeModal = () => {
    setSelected(null);
    setModalOpen(false);
    setRating(5);
  };

  const confirmSession = (id) => {
    setSesiones(prev => prev.map(s => s.id === id ? { ...s, estado: 'Completada' } : s));
    closeModal();
  };

  const cancelSession = (id) => {
    setSesiones(prev => prev.map(s => s.id === id ? { ...s, estado: 'Cancelada' } : s));
    closeModal();
  };

  const submitRating = (id) => {
    setSesiones(prev => prev.map(s => s.id === id ? { ...s, rating, calificada: true } : s));
    closeModal();
  };

  const openCreate = () => setCreateOpen(true);
  const closeCreate = () => setCreateOpen(false);

  const createSession = (data) => {
    const nuevo = { id: Date.now(), ...data };
    setSesiones(prev => [nuevo, ...prev]);
    setSuccessMsg('Mentoría creada correctamente');
    setTimeout(() => setSuccessMsg(''), 4000);
  };

  return (
    <DashboardLayout role="student" title="Mis Sesiones">
      <div className="table-responsive">
        <div className="d-flex justify-content-between align-items-center mb-3">
          <h5 className="mb-0">Tus sesiones</h5>
          <button className="btn btn-primary btn-sm" onClick={openCreate}>Crear nueva mentoría</button>
        </div>

        {successMsg && (
          <div className="alert alert-success py-2" role="alert">
            {successMsg}
          </div>
        )}
        <table className="table align-middle">
          <thead>
            <tr>
              <th>Mentor</th>
              <th>Fecha</th>
              <th>Estado</th>
              <th></th>
            </tr>
          </thead>
          <tbody>
            {sesiones.map(s => (
              <tr key={s.id}>
                <td>{s.mentor}</td>
                <td>{s.fecha}</td>
                <td>
                  {s.estado === 'Agendada' ? (
                    <span className="badge text-bg-warning">{s.estado}</span>
                  ) : s.estado === 'Completada' ? (
                    <span className="badge text-bg-success">{s.estado}</span>
                  ) : (
                    <span className="badge text-bg-secondary">{s.estado}</span>
                  )}
                </td>
                <td className="text-end">
                  <button className="btn btn-sm btn-outline-secondary" onClick={() => openModal(s)}>Ver detalles</button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {createOpen && (
        <CreateMentoria onCreate={createSession} onClose={closeCreate} />
      )}

      {/* Modal (simple overlay) */}
      {modalOpen && selected && (
        <div className="position-fixed top-0 start-0 w-100 h-100 d-flex align-items-center justify-content-center" style={{ zIndex: 1050 }}>
          <div className="position-absolute top-0 start-0 w-100 h-100 bg-dark opacity-50" onClick={closeModal} />
          <div className="card shadow" style={{ width: 520, zIndex: 1060 }}>
            <div className="card-body">
              <h5 className="card-title">Detalle de la sesión</h5>
              <p className="mb-1"><strong>Mentor:</strong> {selected.mentor}</p>
              <p className="mb-1"><strong>Fecha:</strong> {selected.fecha}</p>
              <p className="mb-3"><strong>Estado:</strong> {selected.estado}</p>

              {selected.estado === 'Agendada' && (
                <div className="d-flex gap-2">
                  <button className="btn btn-primary" onClick={() => confirmSession(selected.id)}>Confirmar</button>
                  <button className="btn btn-outline-danger" onClick={() => cancelSession(selected.id)}>Cancelar</button>
                  <button className="btn btn-secondary ms-auto" onClick={closeModal}>Cerrar</button>
                </div>
              )}

              {selected.estado === 'Completada' && (
                <div>
                  {selected.calificada ? (
                    <div>
                      <div className="mb-2">Calificación: <strong>{selected.rating}</strong></div>
                      <button className="btn btn-secondary" onClick={closeModal}>Cerrar</button>
                    </div>
                  ) : (
                    <div>
                      <label className="form-label">Calificar mentor</label>
                      <div className="d-flex gap-2 align-items-center">
                        <select className="form-select w-auto" value={rating} onChange={(e) => setRating(Number(e.target.value))}>
                          <option value={5}>5</option>
                          <option value={4}>4</option>
                          <option value={3}>3</option>
                          <option value={2}>2</option>
                          <option value={1}>1</option>
                        </select>
                        <button className="btn btn-primary" onClick={() => submitRating(selected.id)}>Enviar calificación</button>
                        <button className="btn btn-outline-secondary ms-auto" onClick={closeModal}>Cerrar</button>
                      </div>
                    </div>
                  )}
                </div>
              )}

              {selected.estado !== 'Agendada' && selected.estado !== 'Completada' && (
                <div className="d-flex justify-content-end">
                  <button className="btn btn-secondary" onClick={closeModal}>Cerrar</button>
                </div>
              )}
            </div>
          </div>
        </div>
      )}
    </DashboardLayout>
  );
}
