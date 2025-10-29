import React, { useState } from 'react';
import DashboardLayout from '../layouts/DashboardLayout';
import MentorStatsCard from '../components/MentorStatsCard';

export default function MentorProfile() {
  // TODO: GET /api/mentors/{id}/profile
  const [profile, setProfile] = useState({
    name: '',
    email: '',
    biography: '',
    skills: '',
    availability: '',
    rating: '' ,
    city: '',
  });

  // temp copy while editing
  const [temp, setTemp] = useState(profile);
  const [editing, setEditing] = useState(false);

  const startEdit = async (e) => {
    e.preventDefault();

    setTemp(profile);
    setEditing(true);
  };

  const cancelEdit = () => {
    setTemp(profile);
    setEditing(false);
  };

  const onTempChange = (e) => setTemp(t => ({ ...t, [e.target.name]: e.target.value }));

  const saveProfile = async (e) => {
    try {
      const resp = await fetch(`http://localhost:8080/mentors/${profile.id}/profile`, {
        method: "PUT",
        headers: {
          "content-type": "application/json",
        },
        body: JSON.stringify(temp),
      });

      if(!resp.ok) {
        const errorText = await resp.text();
        console.error("Error del backend:" , errorText);
        alert("No se pudo actualizar la informacion del mentor. (" + resp.status + ")");
        return;
      }

    } catch (error) {
      console.error("Fallo de red:", error);
      alert("Error de conexión con el servidor.");
    }
    setProfile({ ...temp });
    setEditing(false);
    };

  const avatarUrl = `https://api.dicebear.com/8.x/identicon/svg?seed=${encodeURIComponent(profile.name)}`;

  return (
    <DashboardLayout role="mentor" title="Mi Perfil (Mentor)">
      <div className="row g-3">
        <div className="col-12 col-lg-6">
          <div className="border rounded-3 p-3 h-100 text-center">
            <img src={avatarUrl} alt="Avatar" className="rounded-circle mb-3 shadow-sm" style={{ width: 120, height: 120, objectFit: 'cover' }} />

            {!editing ? (
              <>
                <h5 className="mb-1">{profile.name}</h5>
                <div className="small text-secondary mb-2">{profile.email}</div>
                <div className="text-start mx-auto" style={{ maxWidth: 420 }}>
                  <p className="mb-1"><strong>Disponibilidad:</strong> {profile.availability}</p>
                  <p className="mb-1"><strong>Habilidades:</strong> {profile.skills}</p>
                  <p className="mb-1"><strong>Ciudad:</strong> {profile.city}</p>
                  <p className="mb-2"><strong>Biografía:</strong> {profile.biography}</p>
                  <div className="mb-3"><span className="badge text-bg-success">Rating: {profile.rating}</span></div>
                </div>

                <button className="btn btn-outline-primary mt-2" onClick={startEdit}>Actualizar información</button>
              </>
            ) : (
              <div className="text-start">
                <h6 className="fw-bold mb-3">Editar información</h6>

                <div className="mb-2">
                  <label className="form-label small text-secondary">Nombre</label>
                  <input className="form-control" name="name" value={temp.name} onChange={onTempChange} />
                </div>

                <div className="mb-2">
                  <label className="form-label small text-secondary">Email</label>
                  <input className="form-control" type="email" name="email" value={temp.email} onChange={onTempChange} />
                </div>

                <div className="mb-2">
                  <label className="form-label small text-secondary">Disponibilidad</label>
                  <input className="form-control" name="availability" value={temp.availability} onChange={onTempChange} />
                </div>

                <div className="mb-2">
                  <label className="form-label small text-secondary">Habilidades</label>
                  <input className="form-control" name="skills" value={temp.skills} onChange={onTempChange} />
                  <div className="form-text">Separa por coma (,)</div>
                </div>

                <div className="mb-2">
                  <label className="form-label small text-secondary">Ciudad</label>
                  <input className="form-control" name="city" value={temp.city} onChange={onTempChange} />
                </div>

                <div className="mb-2">
                  <label className="form-label small text-secondary">Biografía</label>
                  <textarea className="form-control" rows={3} name="biography" value={temp.biography} onChange={onTempChange} />
                </div>

                <div className="d-flex gap-2">
                  <button className="btn btn-primary" onClick={saveProfile}>Guardar cambios</button>
                  <button className="btn btn-outline-secondary" onClick={cancelEdit}>Cancelar</button>
                </div>
              </div>
            )}
          </div>
        </div>

        <div className="col-12 col-lg-6">
          <div className="border rounded-3 p-3 h-100">
            <h6 className="fw-bold mb-3">Estadísticas</h6>

            {/* Use Vite env VITE_API_BASE if available, otherwise relative endpoints */}
            {(() => {
              const base = (typeof import.meta !== 'undefined' && import.meta.env && import.meta.env.VITE_API_BASE) ? import.meta.env.VITE_API_BASE : '';
              const endpoints = {
                approval: base + '/api/mentor/approval-chart',
                sessionsPerMonth: base + '/api/mentor/sessions-per-month-chart',
                activeStudents: base + '/api/mentor/active-students-chart'
              };

              return (
                <div className="vstack gap-3 mb-3">
                  <MentorStatsCard title="Promedio de aprobación" apiUrl={endpoints.approval} />
                  <MentorStatsCard title="Asesorías por mes" apiUrl={endpoints.sessionsPerMonth} />
                  <MentorStatsCard title="Estudiantes activos" apiUrl={endpoints.activeStudents} />
                </div>
              );
            })()}

            <h6 className="fw-bold mb-3">Estudiantes asignados</h6>
            {/* TODO: GET /api/mentors/{id}/students */}
            <ul className="list-group">
              <li className="list-group-item d-flex justify-content-between align-items-center">
                <span>Santiago Herrera</span>
                <span className="badge text-bg-primary">76% progreso</span>
              </li>
              <li className="list-group-item d-flex justify-content-between align-items-center">
                <span>María López</span>
                <span className="badge text-bg-primary">64% progreso</span>
              </li>
            </ul>
          </div>
        </div>
      </div>
    </DashboardLayout>
  );
}
