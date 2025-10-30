import React, { useState, useEffect } from 'react';
import DashboardLayout from '../layouts/DashboardLayout';
import CreatePostBox from '../components/CreatePostBox';

export default function MentorDashboard() {
  // Estado user: demo por defecto, luego cargaremos los datos reales desde el backend
  const [user, setUser] = useState({
    name: 'Ana Ruiz',
    email: 'ana.mentor@demo.com',
  });

  // Intentamos leer userId desde localStorage (si tu backend guarda el id ahí tras el login)
  const storedId = typeof window !== 'undefined' ? localStorage.getItem('userId') : null;
  const CURRENT_MENTOR_ID = storedId ? Number(storedId) : null;

  useEffect(() => {
    if (!CURRENT_MENTOR_ID) return;

    const fetchMentor = async () => {
      try {
        const resp = await fetch('http://localhost:8080/mentors/me/full-info', {
          headers: { 'X-USER-ID': CURRENT_MENTOR_ID },
        });

        if (!resp.ok) {
          console.warn('MentorDashboard: no se pudo cargar mentor desde backend, usando demo. status=', resp.status);
          return;
        }

        const data = await resp.json();
        setUser({
          name: data.name ?? data.fullName ?? user.name,
          email: data.email ?? user.email,
        });
      } catch (err) {
        console.error('Error fetching mentor info in dashboard:', err);
      }
    };

    fetchMentor();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [CURRENT_MENTOR_ID]);

  const [posts, setPosts] = useState([
    {
      id: 1,
      author: 'Sistema',
      role: 'MatchMentor Bot',
      avatar: 'https://api.dicebear.com/8.x/bottts/svg?seed=MatchMentorAI',
      time: 'hace 1 día',
      tag: 'Aviso',
      title: 'Bienvenido al dashboard de mentores',
      text: 'Aquí podrás publicar anuncios, recursos y recomendaciones para tus estudiantes.'
    }
  ]);

  const handlePublish = ({ title, text, tag }) => {
    const nuevo = {
      id: Date.now(),
      author: user.name,
      role: 'Mentor',
      avatar: `https://api.dicebear.com/8.x/identicon/svg?seed=${encodeURIComponent(user.name)}`,
      time: 'justo ahora',
      tag,
      title,
      text,
    };
    setPosts(prev => [nuevo, ...prev]);
  };

  return (
    <DashboardLayout role="mentor" title="Dashboard Mentor">
      <div className="row g-3">
        <div className="col-12 col-lg-8">
          <CreatePostBox user={user} onPublish={handlePublish} />

          <div className="vstack gap-3 mt-3">
            {posts.map(p => (
              <div key={p.id} className="w3-card w3-white rounded-3 p-3">
                <div className="d-flex align-items-start gap-3 mb-2">
                  <img src={p.avatar} alt={p.author} width="48" height="48" className="rounded-circle border" />
                  <div className="flex-grow-1">
                    <div className="fw-semibold">{p.author}</div>
                    <div className="small text-secondary">{p.role} · {p.time}</div>
                  </div>
                  <span className="badge text-bg-primary">{p.tag}</span>
                </div>
                <div className="mb-2">
                  <div className="fw-semibold">{p.title}</div>
                  <div className="text-secondary small">{p.text}</div>
                </div>
              </div>
            ))}
          </div>
        </div>

        <div className="col-12 col-lg-4">
          <div className="w3-card w3-white rounded-3 p-3">
            <h6 className="fw-bold">Acciones rápidas</h6>
            <ul className="list-unstyled small">
              <li><a href="#">Ver mis estudiantes</a></li>
              <li><a href="#">Crear disponibilidad</a></li>
              <li><a href="#">Historial de sesiones</a></li>
            </ul>
          </div>
        </div>
      </div>
    </DashboardLayout>
  );
}
