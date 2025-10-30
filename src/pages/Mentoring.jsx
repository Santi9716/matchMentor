import React, { useEffect, useState } from 'react';
import DashboardLayout from '../layouts/DashboardLayout';
import CreateMentoriaModal from '../components/CreateMentoriaModal';

export default function Mentoring() {
  // id del mentor autenticado
  const storedId = typeof window !== 'undefined' ? localStorage.getItem('userId') : null;
  const CURRENT_MENTOR_ID = storedId ? Number(storedId) : 12; // fallback

  const [sesiones, setSesiones] = useState([]);
  const [showModal, setShowModal] = useState(false);
  const [selected, setSelected] = useState(null);
  const [createOpen, setCreateOpen] = useState(false);

  // campos de edición
  const [tempObservaciones, setTempObservaciones] = useState('');
  const [tempCalificacion, setTempCalificacion] = useState(0);
  const [tempResumen, setTempResumen] = useState('');

  // cargar sesiones del backend
  const loadSessions = () => {
    fetch('http://localhost:8080/mentors/me/sessions', {
      headers: {
        'X-USER-ID': CURRENT_MENTOR_ID
      }
    })
      .then(res => {
        if (!res.ok) throw new Error('Error al cargar sesiones');
        return res.json();
      })
      .then(data => {
        // data ya viene en el formato que armamos en el back
        setSesiones(data);
      })
      .catch(err => {
        console.error('Fallo al cargar sesiones:', err);
      });
  };

  useEffect(() => {
    loadSessions();
  }, [CURRENT_MENTOR_ID]);

  // Abrir modal de detalles
  const handleVerDetalles = (sesion) => {
    setSelected(sesion);
    setTempObservaciones(sesion.observacionesMentor || '');
    setTempCalificacion(sesion.calificacionMentorAlEstudiante || 0);
    setTempResumen(sesion.resumen || '');
    setShowModal(true);
  };

  const closeModal = () => {
    setShowModal(false);
    setSelected(null);
  };

  // Guardar cambios (PUT al back)
  const handleGuardarCambios = () => {
    if (!selected) return;

    const payload = {
      observacionesMentor: tempObservaciones,
      calificacionMentorAlEstudiante: tempCalificacion,
      resumen: tempResumen,
      // si quieres, al guardar puedes marcarla como COMPLETADA:
      // estado: 'COMPLETADA'
    };

    fetch(`http://localhost:8080/mentors/me/sessions/${selected.id}`, {
      method: 'PUT',
      headers: {
        'Content-Type': 'application/json',
        'X-USER-ID': CURRENT_MENTOR_ID
      },
      body: JSON.stringify(payload)
    })
      .then(async res => {
        if (!res.ok) {
          const t = await res.text().catch(() => '');
          throw new Error(t || 'Error al actualizar sesión');
        }
        return res.json();
      })
      .then(updated => {
        // actualizar en la tabla
        setSesiones(prev =>
          prev.map(s =>
            s.id === selected.id
              ? {
                  ...s,
                  observacionesMentor: updated.observacionesMentor,
                  calificacionMentorAlEstudiante: updated.calificacionMentorAlEstudiante,
                  resumen: updated.resumen,
                  estado: updated.estado || s.estado
                }
              : s
          )
        );
        setShowModal(false);
      })
      .catch(err => {
        console.error('Error al guardar cambios:', err);
        alert('No se pudo guardar la sesión.');
      });
  };

  // abrir modal de crear
  const openCreate = () => setCreateOpen(true);
  const closeCreate = () => setCreateOpen(false);

  // cuando el modal de crear devuelve una sesión nueva
  const createSession = (dataFromModal) => {
    // dataFromModal debería tener: fecha, hora, temaPlaneado, studentId?, matchId?
    const payload = {
      fecha: dataFromModal.fecha,
      hora: dataFromModal.hora,
      temaPlaneado: dataFromModal.temaPlaneado,
      studentId: dataFromModal.studentId || null,
      matchId: dataFromModal.matchId || null
    };

    fetch('http://localhost:8080/mentors/me/sessions', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'X-USER-ID': CURRENT_MENTOR_ID
      },
      body: JSON.stringify(payload)
    })
      .then(async res => {
        if (!res.ok) {
          const t = await res.text().catch(() => '');
          throw new Error(t || 'Error al crear la sesión');
        }
        return res.json();
      })
      .then(created => {
        // la añadimos arriba
        setSesiones(prev => [created, ...prev]);
        setCreateOpen(false);
      })
      .catch(err => {
        console.error('Error al crear sesión:', err);
        alert('No se pudo crear la sesión.');
      });
  };

  // Render del badge de estado
  const EstadoBadge = ({ estado }) => {
    if (estado === 'COMPLETADA') {
      return <span className="badge text-bg-success">Completada</span>;
    }
    if (estado === 'AGENDADA') {
      return <span className="badge text-bg-warning">Agendada</span>;
    }
    if (estado === 'CANCELADA') {
      return <span className="badge text-bg-danger">Cancelada</span>;
    }
    return <span className="badge text-bg-secondary">{estado}</span>;
  };

  return (
    <DashboardLayout role="mentor" title="Mis Mentorías">
      <div className="d-flex justify-content-between align-items-center mb-3">
        <h6 className="mb-0">Tus sesiones</h6>
        <button className="btn btn-primary btn-sm" onClick={openCreate}>
          Crear mentoría
        </button>
      </div>

      {/* Tabla de sesiones */}
      <div className="table-responsive">
        <table className="table align-middle">
          <thead>
            <tr>
              <th>Estudiante</th>
              <th>Fecha</th>
              <th>Estado</th>
              <th></th>
            </tr>
          </thead>
          <tbody>
            {sesiones.map((s) => (
              <tr key={s.id}>
                <td>{s.estudianteNombre}</td>
                <td>
                  {s.fecha} {s.hora}
                </td>
                <td>
                  <EstadoBadge estado={s.estado} />
                </td>
                <td className="text-end">
                  <button
                    className="btn btn-sm btn-outline-primary"
                    onClick={() => handleVerDetalles(s)}
                  >
                    Ver detalles
                  </button>
                </td>
              </tr>
            ))}
            {sesiones.length === 0 && (
              <tr>
                <td colSpan={4} className="text-center text-muted py-4">
                  No tienes mentorías registradas.
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>

      {/* Modal de detalles */}
      {showModal && selected && (
        <div
          className="modal fade show"
          style={{
            display: 'block',
            backgroundColor: 'rgba(0,0,0,0.4)',
          }}
        >
          <div className="modal-dialog modal-lg modal-dialog-centered">
            <div className="modal-content rounded-3 shadow-lg">
              <div className="modal-header">
                <h5 className="modal-title">
                  Mentoría con {selected.estudianteNombre}
                </h5>
                <button
                  type="button"
                  className="btn-close"
                  onClick={closeModal}
                ></button>
              </div>

              <div className="modal-body">
                <div className="mb-3">
                  <div className="small text-secondary">Tema planeado</div>
                  <div className="fw-semibold">{selected.temaPlaneado}</div>
                </div>

                <div className="row mb-3">
                  <div className="col-md-4">
                    <div className="small text-secondary">Fecha</div>
                    <div>{selected.fecha}</div>
                  </div>
                  <div className="col-md-4">
                    <div className="small text-secondary">Hora</div>
                    <div>{selected.hora}</div>
                  </div>
                  <div className="col-md-4">
                    <div className="small text-secondary">Estado</div>
                    <EstadoBadge estado={selected.estado} />
                  </div>
                </div>

                {/* Sección AGENDADA */}
                {selected.estado === 'AGENDADA' && (
                  <div className="mb-3">
                    <h6 className="fw-bold">Confirmación del estudiante</h6>
                    {selected.estudianteConfirmo ? (
                      <div className="alert alert-success p-2 mb-2">
                        ✅ El estudiante confirmó asistencia.
                      </div>
                    ) : (
                      <div className="alert alert-danger p-2 mb-2">
                        ❌ El estudiante no confirmó o canceló.
                      </div>
                    )}
                    <div className="small text-secondary">
                      Puedes comunicarte con él/ella para reagendar si es
                      necesario.
                    </div>
                  </div>
                )}

                {/* Sección COMPLETADA */}
                {selected.estado === 'COMPLETADA' && (
                  <>
                    <div className="mb-3">
                      <h6 className="fw-bold">Resumen de la sesión</h6>
                      <textarea
                        className="form-control"
                        rows={3}
                        value={tempResumen}
                        onChange={(e) => setTempResumen(e.target.value)}
                        placeholder="Qué se vio en esta sesión..."
                      />
                    </div>

                    <div className="row g-3 mb-3">
                      <div className="col-md-6">
                        <label className="form-label small text-secondary">
                          Observaciones del mentor
                        </label>
                        <textarea
                          className="form-control"
                          rows={3}
                          value={tempObservaciones}
                          onChange={(e) => setTempObservaciones(e.target.value)}
                        />
                      </div>

                      <div className="col-md-6">
                        <label className="form-label small text-secondary">
                          Tu calificación al estudiante (1-5)
                        </label>
                        <select
                          className="form-select"
                          value={tempCalificacion}
                          onChange={(e) =>
                            setTempCalificacion(Number(e.target.value))
                          }
                        >
                          <option value={0}>Sin calificar</option>
                          <option value={1}>1 - Muy bajo compromiso</option>
                          <option value={2}>2 - Necesita más disciplina</option>
                          <option value={3}>3 - Aceptable</option>
                          <option value={4}>4 - Buen desempeño</option>
                          <option value={5}>5 - Excelente actitud</option>
                        </select>
                      </div>
                    </div>

                    <div className="row g-3 mb-3">
                      <div className="col-md-6">
                        <div className="small text-secondary">
                          Calificación del estudiante hacia ti:
                        </div>
                        <div className="fs-5 fw-semibold text-success">
                          {selected.calificacionEstudianteAlMentor
                            ? `${selected.calificacionEstudianteAlMentor} / 5`
                            : 'Sin calificar aún'}
                        </div>
                      </div>
                    </div>
                  </>
                )}

                {/* Si la sesión fue cancelada */}
                {selected.estado === 'CANCELADA' && (
                  <div className="alert alert-danger">
                    Esta mentoría fue cancelada. Considera reprogramar.
                  </div>
                )}
              </div>

              <div className="modal-footer">
                {selected.estado === 'COMPLETADA' && (
                  <button
                    className="btn btn-primary"
                    onClick={handleGuardarCambios}
                  >
                    Guardar cambios
                  </button>
                )}
                <button className="btn btn-secondary" onClick={closeModal}>
                  Cerrar
                </button>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Modal de crear sesión */}
      {createOpen && (
        <CreateMentoriaModal onClose={closeCreate} onCreate={createSession} />
      )}
    </DashboardLayout>
  );
}


