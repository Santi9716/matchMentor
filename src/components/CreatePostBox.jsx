import React, { useState } from 'react';

export default function CreatePostBox({ user, onPublish }) {
  const [text, setText] = useState('');
  const [topic, setTopic] = useState('');

  const handlePublish = () => {
    const trimmed = text.trim();
    if (!trimmed) return;

    // avisamos hacia arriba que hay publicación nueva
    onPublish({
      title: topic || 'Pregunta del estudiante',
      text: trimmed,
      tag: topic || 'General',
    });

    // limpiamos campos
    setText('');
    setTopic('');
  };

  return (
    <div className="w3-card w3-white rounded-3 p-3 mb-3">
      <div className="d-flex align-items-start gap-2 mb-2">
        <img
          src={`https://api.dicebear.com/8.x/identicon/svg?seed=${encodeURIComponent(user.name)}`}
          alt={user.name}
          width="40"
          height="40"
          className="rounded-circle border"
        />

        <div className="flex-grow-1">
          <textarea
            className="form-control"
            rows={2}
            placeholder="Comparte una duda, ej: 'Me cuesta recursividad en árboles binarios…'"
            value={text}
            onChange={(e) => setText(e.target.value)}
          />

          <div className="row g-2 mt-2">
            <div className="col-12 col-md-6">
              <input
                className="form-control"
                placeholder="Tema / materia (opcional, ej: Algoritmos)"
                value={topic}
                onChange={(e) => setTopic(e.target.value)}
              />
            </div>
            <div className="col-12 col-md-6 text-md-end">
              <button
                className="btn btn-primary w-100 w-md-auto mt-2 mt-md-0"
                onClick={handlePublish}
              >
                Publicar
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
