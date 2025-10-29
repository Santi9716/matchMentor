import React, { useState } from 'react';

export default function CreateMentoriaModal({ onClose, onCreate, defaultDate }) {
  const [tema, setTema] = useState('');
  const [fecha, setFecha] = useState(defaultDate || '');
  const [hora, setHora] = useState('19:00');
  const [estudiante, setEstudiante] = useState('');

  const submit = (e) => {
    e.preventDefault();
    if (!tema.trim() || !fecha || !hora || !estudiante.trim()) {
      alert('Completa todos los campos');
      return;
    }

    const nueva = {
      id: Date.now(),
      estudianteNombre: estudiante.trim(),
      fecha,
      hora,
      estado: 'AGENDADA',
      estudianteConfirmo: false,
      temaPlaneado: tema.trim(),
      resumen: '',
      observacionesMentor: '',
      calificacionEstudianteAlMentor: null,
      calificacionMentorAlEstudiante: null,
    };

    onCreate && onCreate(nueva);
    onClose && onClose();
  };

  return (
    <div className="position-fixed top-0 start-0 w-100 h-100 d-flex align-items-center justify-content-center" style={{ zIndex: 1060 }}>
      <div className="position-absolute top-0 start-0 w-100 h-100 bg-dark opacity-50" onClick={onClose} />

      <form className="card shadow" style={{ width: 640, zIndex: 1061 }} onSubmit={submit}>
        <div className="card-body">
          <div className="d-flex justify-content-between align-items-center mb-2">
            <h5 className="mb-0">Crear nueva mentoría</h5>
            <button type="button" className="btn-close" onClick={onClose} />
          </div>

          <div className="mb-3">
            <label className="form-label small">Tema de la mentoría</label>
            <input className="form-control" value={tema} onChange={(e) => setTema(e.target.value)} placeholder="Ej: Repaso de recursión" />
          </div>

          <div className="row g-3 mb-3">
            <div className="col-md-4">
              <label className="form-label small">Fecha</label>
              <input className="form-control" type="date" value={fecha} onChange={(e) => setFecha(e.target.value)} />
            </div>
            <div className="col-md-4">
              <label className="form-label small">Hora</label>
              <input className="form-control" type="time" value={hora} onChange={(e) => setHora(e.target.value)} />
            </div>
            <div className="col-md-4">
              <label className="form-label small">Nombre del estudiante</label>
              <input className="form-control" value={estudiante} onChange={(e) => setEstudiante(e.target.value)} placeholder="Nombre completo" />
            </div>
          </div>

          <div className="d-flex justify-content-end gap-2">
            <button type="button" className="btn btn-outline-secondary" onClick={onClose}>Cancelar</button>
            <button type="submit" className="btn btn-primary">Crear mentoría</button>
          </div>
        </div>
      </form>
    </div>
  );
}
