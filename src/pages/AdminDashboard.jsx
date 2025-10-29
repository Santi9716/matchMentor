import React from 'react';
import NavBar from '../components/NavBar';
import AdminSidebar from '../components/AdminSidebar';

export default function AdminDashboard() {
  // Datos simulados. Más adelante vendrán de tu backend admin.
  const metrics = {
    totalEstudiantes: 124,
    totalMentores: 18,
    sesionesActivas: 42,
    matchesPendientes: 9,
  };

  return (
    <div className="d-flex flex-column min-vh-100 bg-light">
      <NavBar />

      <main className="flex-grow-1 py-4">
        <div className="container">
          <div className="row g-3">

            {/* Sidebar izquierda admin */}
            <div className="col-12 col-lg-3">
              <AdminSidebar />
            </div>

            {/* Contenido principal */}
            <div className="col-12 col-lg-9">
              <div className="vstack gap-3">

                {/* Header sección */}
                <div className="w3-container w3-padding w3-dark-grey rounded-3 text-white">
                  <h5 className="mb-0">Panel Administrador</h5>
                  <div className="text-white-50 small">
                    Vista general del sistema
                  </div>
                </div>

                {/* Métricas en cards */}
                <div className="row g-3">
                  <div className="col-6 col-md-3">
                    <div className="w3-card w3-white rounded-3 p-3 text-center h-100">
                      <div className="small text-secondary">Estudiantes</div>
                      <div className="fs-4 fw-bold">{metrics.totalEstudiantes}</div>
                    </div>
                  </div>
                  <div className="col-6 col-md-3">
                    <div className="w3-card w3-white rounded-3 p-3 text-center h-100">
                      <div className="small text-secondary">Mentores</div>
                      <div className="fs-4 fw-bold">{metrics.totalMentores}</div>
                    </div>
                  </div>
                  <div className="col-6 col-md-3">
                    <div className="w3-card w3-white rounded-3 p-3 text-center h-100">
                      <div className="small text-secondary">Sesiones activas</div>
                      <div className="fs-4 fw-bold">{metrics.sesionesActivas}</div>
                    </div>
                  </div>
                  <div className="col-6 col-md-3">
                    <div className="w3-card w3-white rounded-3 p-3 text-center h-100">
                      <div className="small text-secondary">Matches pendientes</div>
                      <div className="fs-4 fw-bold">{metrics.matchesPendientes}</div>
                    </div>
                  </div>
                </div>

                {/* Últimas acciones relevantes */}
                <div className="w3-card w3-white rounded-3 p-3">
                  <h6 className="fw-bold mb-3">Actividad reciente</h6>
                  <ul className="list-group small">
                    <li className="list-group-item">
                      Se creó la cuenta de <strong>María López</strong> como <span className="badge text-bg-primary">Estudiante</span>
                    </li>
                    <li className="list-group-item">
                      <strong>Carlos Pérez</strong> aceptó un match con <strong>Santiago Herrera</strong>
                    </li>
                    <li className="list-group-item">
                      Nueva sesión agendada para hoy a las 19:00 con el mentor <strong>Ana Ruiz</strong>
                    </li>
                  </ul>
                </div>

              </div>
            </div>

          </div>
        </div>
      </main>
    </div>
  );
}
