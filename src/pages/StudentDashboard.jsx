import React, { useState } from 'react';
import Sidebar from '../components/Sidebar';
import ProfileSideBar from '../components/ProfileSideBar';
import StudentStatsCard from '../components/StudentsStatsCards';
import CreatePostBox from '../components/CreatePostBox';

export default function StudentDashboard() {
  // Simulación de datos que vendrán del backend/servicios:
  const user = {
    name: 'Santiago Herrera',
    email: 'santiago@demo.com',
    program: 'Ing. de Software',
    semester: '6°',
    city: 'Medellín',
  };

  const stats = {
    promedioGeneral: 3.8,
    materiasCriticas: ['Algoritmos', 'Bases de Datos'],
    progresoUltimoMes: [3.2, 3.4, 3.5, 3.8],
    labelsUltimoMes: ['Ago', 'Sep', 'Oct', 'Nov'],
    // graficaUrl: '/api/students/1/stats/grafica.png' // futuro, generado por Python
  };

  const [posts, setPosts] = useState([
    {
      id: 1,
      author: 'Ana Ruiz',
      role: 'Mentora en Matemáticas',
      avatar: 'https://api.dicebear.com/8.x/identicon/svg?seed=AnaRuiz',
      time: 'hace 2h',
      tag: 'Álgebra',
      title: 'Tip rápido: ecuaciones lineales',
      text: 'Si te estás enredando con sistemas 2x2, intenta representarlos como matrices y piensa en eliminación gaussiana en vez de "pasar términos". Es más mecánico y menos error humano.',
    },
    {
      id: 2,
      author: 'Carlos Pérez',
      role: 'Mentor en Programación',
      avatar: 'https://api.dicebear.com/8.x/identicon/svg?seed=CarlosPerez',
      time: 'hace 5h',
      tag: 'Algoritmos',
      title: 'Preparación para el parcial de estructuras de datos',
      text: 'Si el profe ama pilas y colas, repasa los casos típicos: paréntesis balanceados, backtracking simple con stack y simulación de colas de prioridad. Eso casi siempre cae.',
    },
    {
      id: 3,
      author: 'Sistema',
      role: 'MatchMentor Bot',
      avatar: 'https://api.dicebear.com/8.x/bottts/svg?seed=MatchMentorAI',
      time: 'hace 1 día',
      tag: 'Recomendación',
      title: 'Tu materia más crítica: Bases de Datos',
      text: 'Basado en tu histórico, Bases de Datos está por debajo de 3.0. Te sugerimos agendar 1 sesión con un mentor de SQL esta semana.',
    },
  ]);

  // Handler para publicar desde el CreatePostBox
  const handlePublish = ({ title, text, tag }) => {
    const nuevoPost = {
      id: Date.now(),
      author: user.name,
      role: 'Estudiante',
      avatar: `https://api.dicebear.com/8.x/identicon/svg?seed=${encodeURIComponent(user.name)}`,
      time: 'justo ahora',
      tag,
      title,
      text,
    };

    setPosts(prev => [nuevoPost, ...prev]);
  };

  return (
    <div className="d-flex flex-column min-vh-100 bg-light">
      {/* Contenido principal (NavBar ya se renderiza globalmente en App.jsx) */}
      <main className="flex-grow-1 py-4">
        <div className="container">
          <div className="row g-3">

            {/* Columna izquierda: Sidebar navegación (más ancha) */}
            <div className="col-12 col-md-3 col-lg-3">
              <Sidebar role="student" />
            </div>

            {/* Columna centro: Feed académico (ligeramente más estrecha para dar espacio a la derecha) */}
            <div className="col-12 col-md-6 col-lg-5">
              <div className="bg-primary bg-gradient text-white rounded-3 mb-3 p-3 shadow-sm">
                <div className="d-flex align-items-center">
                  <h5 className="mb-0">Inicio</h5>
                  <span className="ms-2 badge bg-white text-primary small">Estudiante</span>
                </div>
                <div className="text-white-50 small mt-1">
                  Recursos y recomendaciones para mejorar tu rendimiento
                </div>
              </div>

              {/* Feed */}
              <div className="mb-3">
                {/* Caja para crear publicación */}
                <CreatePostBox user={user} onPublish={handlePublish} />

                {/* Lista de posts */}
                {/* Reutilizamos el feed como componente para mantener limpio */}
                {/* Lo defino inline aquí para que puedas verlo, pero idealmente importas <StudyFeed /> */}
                <div className="vstack gap-3">
                  {posts.map(p => (
                    <div key={p.id} className="w3-card w3-white rounded-3 p-3">
                      <div className="d-flex align-items-start gap-3 mb-2">
                        <img
                          src={p.avatar}
                          alt={p.author}
                          width="48"
                          height="48"
                          className="rounded-circle border"
                        />
                        <div className="flex-grow-1">
                          <div className="fw-semibold">{p.author}</div>
                          <div className="small text-secondary">
                            {p.role} · {p.time}
                          </div>
                        </div>
                        <span className="badge text-bg-primary">{p.tag}</span>
                      </div>

                      <div className="mb-2">
                        <div className="fw-semibold">{p.title}</div>
                        <div className="text-secondary small">{p.text}</div>
                      </div>

                      <div className="d-flex gap-3 small text-secondary">
                        <button className="btn btn-sm btn-outline-primary">
                          <i className="bi bi-hand-thumbs-up"></i> Me sirve
                        </button>
                        <button className="btn btn-sm btn-outline-secondary">
                          <i className="bi bi-chat-dots"></i> Comentarios
                        </button>
                        <button className="btn btn-sm btn-outline-secondary">
                          <i className="bi bi-bookmark"></i> Guardar
                        </button>
                      </div>
                    </div>
                  ))}
                </div>

              </div>
            </div>

            {/* Right column: fixed on lg+ (so it doesn't move with the scroll); stacked on small screens */}
            {/* Columna derecha: Perfil corto + stats (sticky dentro del flujo para no tapar gráficos) */}
            <div className="col-12 col-md-3 col-lg-4">
              <div style={{ position: 'sticky', top: '88px' }}>
                <ProfileSideBar user={user} size={80} />
                <StudentStatsCard stats={stats} />
              </div>
            </div>

          </div>
        </div>
      </main>
    </div>
  );
}
