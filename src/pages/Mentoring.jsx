import React, { useState } from 'react';
import DashboardLayout from '../layouts/DashboardLayout';
import CreateMentoriaModal from '../components/CreateMentoriaModal';

export default function Mentoring() {
  // Lista de mentorías simulada (esto vendrá de tu backend)
  const [sesiones, setSesiones] = useState([
    {
      id: 11,
      estudianteNombre: 'Santiago Herrera',
      fecha: '2025-10-23',
      hora: '19:00',
      estado: 'AGENDADA', // AGENDADA | COMPLETADA | CANCELADA
      estudianteConfirmo: true, // true = confirmado, false = canceló/no confirmó
      temaPlaneado: 'Algoritmos recursivos en árboles binarios',
      resumen: '', // se llena al completar
      observacionesMentor: '',
      calificacionEstudianteAlMentor: null, // rating que el estudiante le puso al mentor
      calificacionMentorAlEstudiante: null, // rating que el mentor le pone al estudiante
    },
    {
      id: 12,
      estudianteNombre: 'María López',
      fecha: '2025-10-20',
      hora: '18:00',
      estado: 'COMPLETADA',
      estudianteConfirmo: true,
      temaPlaneado: 'Normalización en SQL y práctica de JOINs',
      resumen: 'Vimos normal forms (1NF, 2NF, 3NF), y diseñamos consultas JOIN para 3 tablas.',
      observacionesMentor: 'Tiene buena base pero le falta seguridad cuando explica sus consultas.',
      calificacionEstudianteAlMentor: 5,
      calificacionMentorAlEstudiante: 4,
    },
    {
      id: 13,
      estudianteNombre: 'Juan Torres',
      fecha: '2025-10-24',
      hora: '17:30',
      estado: 'AGENDADA',
      estudianteConfirmo: false,
      temaPlaneado: 'Repaso de álgebra lineal básica (independencia lineal)',
      resumen: '',
      observacionesMentor: '',
      calificacionEstudianteAlMentor: null,
      calificacionMentorAlEstudiante: null,
    },
  ]);

  // Control del modal
  const [showModal, setShowModal] = useState(false);
  const [selected, setSelected] = useState(null);
  const [createOpen, setCreateOpen] = useState(false);

  // Campos editables dentro del modal cuando la sesión está COMPLETADA
  const [tempObservaciones, setTempObservaciones] = useState('');
  const [tempCalificacion, setTempCalificacion] = useState(0);

  // Abrir modal de detalles
  const handleVerDetalles = (sesion) => {
    setSelected(sesion);
    setTempObservaciones(sesion.observacionesMentor || '');
    setTempCalificacion(sesion.calificacionMentorAlEstudiante || 0);
    setShowModal(true);
  };

  // Guardar cambios (solo aplica si está COMPLETADA)
  const handleGuardarCambios = () => {
    if (!selected) return;

    // actualizamos en memoria
    setSesiones((prev) =>
      prev.map((s) =>
        s.id === selected.id
          ? {
              ...s,
              observacionesMentor: tempObservaciones,
              calificacionMentorAlEstudiante: tempCalificacion,
            }
          : s
      )
    );

    // aquí luego harías:
    // await api.updateSessionFeedback(selected.id, {
    //   observacionesMentor: tempObservaciones,
    //   calificacionMentorAlEstudiante: tempCalificacion
    // });

    setShowModal(false);
  };

  const closeModal = () => {
    setShowModal(false);
  };

  const openCreate = () => setCreateOpen(true);
  const closeCreate = () => setCreateOpen(false);

  const createSession = (data) => {
    setSesiones(prev => [data, ...prev]);
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
        <button className="btn btn-primary btn-sm" onClick={openCreate}>Crear mentoría</button>
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
          </tbody>
        </table>
      </div>

      {/* Modal manual controlado por React */}
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
                {/* Info general común */}
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
                      <div className="border rounded-3 p-2 bg-light small">
                        {selected.resumen || 'Sin resumen registrado.'}
                      </div>
                    </div>

                    <div className="row g-3 mb-3">
                      <div className="col-md-6">
                        <label className="form-label small text-secondary">
                          Observaciones del mentor sobre el estudiante
                        </label>
                        <textarea
                          className="form-control"
                          rows={3}
                          value={tempObservaciones}
                          onChange={(e) =>
                            setTempObservaciones(e.target.value)
                          }
                          placeholder="Ej: Trabajó bien, pero necesita reforzar SQL JOINs en contexto real"
                        />
                        <div className="form-text small">
                          Esto no lo ve el estudiante (solo interno).
                        </div>
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

                        <div className="small text-secondary mt-2">
                          Calificación que TÚ le das al estudiante.
                        </div>
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

                {/* Si la sesión fue cancelada (opcional) */}
                {selected.estado === 'CANCELADA' && (
                  <div className="alert alert-danger">
                    Esta mentoría fue cancelada. Considera reprogramar con el
                    estudiante.
                  </div>
                )}
              </div>

              <div className="modal-footer">
                {/* Botón Guardar solo si está COMPLETADA */}
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

      {createOpen && (
        <CreateMentoriaModal onClose={closeCreate} onCreate={createSession} />
      )}
    </DashboardLayout>
  );
}

