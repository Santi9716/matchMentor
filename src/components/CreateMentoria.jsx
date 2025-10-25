import React, { useState, useEffect } from 'react';

function nextHourIso() {
  const now = new Date();
  now.setMinutes(0, 0, 0);
  now.setHours(now.getHours() + 1);
  // produce a value compatible with <input type="datetime-local">
  const offset = now.getTimezoneOffset();
  const local = new Date(now.getTime() - offset * 60000);
  return local.toISOString().slice(0, 16);
}

function formatDatetimeLocalToDisplay(value) {
  // value like '2025-10-25T18:00' -> '2025-10-25 18:00'
  if (!value) return '';
  return value.replace('T', ' ');
}

export default function CreateMentoria({ onCreate, onClose, mentors = [] }) {
  const [mentorSelect, setMentorSelect] = useState('');
  const [mentorFree, setMentorFree] = useState('');
  const [fecha, setFecha] = useState(nextHourIso());
  const [nota, setNota] = useState('');
  const [errors, setErrors] = useState({});

  useEffect(() => {
    // default to first mentor if provided
    if (mentors.length > 0) setMentorSelect(mentors[0]);
  }, [mentors]);

  const validate = () => {
    const e = {};
    const chosenMentor = mentorSelect === '__other' ? mentorFree.trim() : mentorSelect;
    if (!chosenMentor) e.mentor = 'Selecciona o escribe el nombre del mentor';
    if (!fecha) e.fecha = 'Selecciona fecha y hora';
    else {
      const now = new Date();
      const sel = new Date(fecha);
      if (sel < now) e.fecha = 'La fecha debe ser en el futuro';
    }
    setErrors(e);
    return Object.keys(e).length === 0;
  };

  const submit = (ev) => {
    ev.preventDefault();
    if (!validate()) return;
    const mentor = mentorSelect === '__other' ? mentorFree.trim() : mentorSelect;
    const payload = {
      mentor,
      fecha: formatDatetimeLocalToDisplay(fecha),
      nota: nota.trim(),
      estado: 'Agendada',
    };

    onCreate(payload);
    // reset and close
    setMentorSelect(mentors[0] || '');
    setMentorFree('');
    setFecha(nextHourIso());
    setNota('');
    setErrors({});
    onClose();
  };

  return (
    <div className="position-fixed top-0 start-0 w-100 h-100 d-flex align-items-center justify-content-center" style={{ zIndex: 1050 }}>
      <div className="position-absolute top-0 start-0 w-100 h-100 bg-dark opacity-50" onClick={onClose} />
      <form className="card shadow" style={{ width: 560, zIndex: 1060 }} onSubmit={submit}>
        <div className="card-body">
          <h5 className="card-title">Crear nueva mentoría</h5>

          <div className="mb-3">
            <label className="form-label">Mentor</label>
            {mentors.length > 0 ? (
              <>
                <select className="form-select" value={mentorSelect} onChange={e => setMentorSelect(e.target.value)}>
                  {mentors.map((m, i) => <option key={i} value={m}>{m}</option>)}
                  <option value="__other">Otro...</option>
                </select>
                {mentorSelect === '__other' && (
                  <input className="form-control mt-2" placeholder="Nombre del mentor" value={mentorFree} onChange={e => setMentorFree(e.target.value)} />
                )}
              </>
            ) : (
              <input className="form-control" value={mentorFree} onChange={e => setMentorFree(e.target.value)} placeholder="Nombre del mentor" />
            )}
            {errors.mentor && <div className="form-text text-danger">{errors.mentor}</div>}
          </div>

          <div className="mb-3">
            <label className="form-label">Fecha y hora</label>
            <input type="datetime-local" className="form-control" value={fecha} onChange={e => setFecha(e.target.value)} />
            {errors.fecha && <div className="form-text text-danger">{errors.fecha}</div>}
          </div>

          <div className="mb-3">
            <label className="form-label">Notas (opcional)</label>
            <textarea className="form-control" rows={3} value={nota} onChange={e => setNota(e.target.value)} />
          </div>

          <div className="d-flex gap-2 justify-content-end">
            <button type="button" className="btn btn-outline-secondary" onClick={onClose}>Cancelar</button>
            <button type="submit" className="btn btn-primary">Crear mentoría</button>
          </div>
        </div>
      </form>
    </div>
  );
}
