import React from 'react'
import DashboardLayout from '../layouts/DashboardLayout';
import ProfileSideBar from '../components/ProfileSideBar';


export default function StudentProfile() {
  // TODO: sustituir estos datos con GET /api/users/me y /api/students/{id}/stats
  let studentInfo = {
    name: 'Santiago Herrera',
    email: 'santiago@demo.com',
    program: 'Ing. de Software',
    semester: '6°',
    city: 'Medellín',
  };

  const stats = {
    promedio: 3.8,
    aprobadas: 22,
    reprobadas: 4,
    sesionesMentoria: 5,
  };

  return (
    <DashboardLayout role="student" title="Mi Perfil (Estudiante)">
      <div className="row g-3">
        <div className="col-12 col-md-3">
          {/* Avatar-only sidebar with overlay */}
          <ProfileSideBar user={studentInfo} showDetails={false} size={96} overlay={true} />
        </div>
        <div className="col-12 col-md-6">
          <div className="border rounded-3 p-3 h-100">
            <h6 className="fw-bold mb-2">Información personal</h6>
            <div className="small text-secondary">Nombre</div>
            <div className="mb-2">{studentInfo.name}</div>

            <div className="small text-secondary">Email</div>
            <div className="mb-2">{studentInfo.email}</div>

            <div className="small text-secondary">Programa</div>
            <div className="mb-2">{studentInfo.program}</div>

            <div className="small text-secondary">Semestre</div>
            <div className="mb-2">{studentInfo.semester}</div>

            <div className="small text-secondary">Ciudad</div>
            <div className="mb-0">{studentInfo.city}</div>
          </div>
        </div>

        <div className="col-12 col-md-3">
          <div className="border rounded-3 p-3 h-100">
            <h6 className="fw-bold mb-3">Resumen académico</h6>
            <ul className="list-unstyled mb-0">
              <li className="d-flex justify-content-between">
                <span>Promedio general:</span>
                <strong>{stats.promedio}</strong>
              </li>
              <li className="d-flex justify-content-between">
                <span>Materias aprobadas:</span>
                <strong>{stats.aprobadas}</strong>
              </li>
              <li className="d-flex justify-content-between">
                <span>Materias reprobadas:</span>
                <strong className="text-danger">{stats.reprobadas}</strong>
              </li>
              <li className="d-flex justify-content-between">
                <span>Sesiones de mentoría tomadas:</span>
                <strong>{stats.sesionesMentoria}</strong>
              </li>
            </ul>
          </div>
        </div>

        <div className="col-12">
          <div className="border rounded-3 p-3">
            <h6 className="fw-bold mb-3">Subir notas (CSV)</h6>
            <p className="text-secondary small mb-2">
              Sube tu archivo .csv con tus calificaciones para actualizar tu rendimiento.
            </p>
            <div className="input-group">
              <input type="file" className="form-control" accept=".csv" />
              <button className="btn btn-primary">Cargar</button>
            </div>
            <div className="form-text">Formato esperado: estudiante_id, materia, nota, fecha</div>
          </div>
        </div>
      </div>
    </DashboardLayout>
  );
}