import React from 'react';

export default function StudyFeed({ posts }) {
  return (
    <div className="vstack gap-3">
      {posts.map(p => (
        <div key={p.id} className="w3-card w3-white rounded-3 p-3">
          {/* header del post */}
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

          {/* cuerpo */}
          <div className="mb-2">
            <div className="fw-semibold">{p.title}</div>
            <div className="text-secondary small">{p.text}</div>
          </div>

          {/* pie */}
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
  );
}
