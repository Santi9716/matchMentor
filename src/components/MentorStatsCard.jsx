import React, { useEffect, useState } from 'react';

export default function MentorStatsCard({ title, apiUrl, height = 140 }) {
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [imgSrc, setImgSrc] = useState(null);
  const [reloadKey, setReloadKey] = useState(0);

  useEffect(() => {
    let cancelled = false;
    setLoading(true);
    setError(null);
    setImgSrc(null);

    if (!apiUrl) {
      setError('No API URL configurada');
      setLoading(false);
      return;
    }

    fetch(apiUrl)
      .then((res) => {
        if (!res.ok) throw new Error(`HTTP ${res.status}`);
        const ct = (res.headers.get('content-type') || '').toLowerCase();
        if (ct.includes('image') || ct.includes('svg+xml')) {
          return res.blob().then((blob) => ({ type: 'blob', blob }));
        }
        return res.json().then((json) => ({ type: 'json', json }));
      })
      .then((payload) => {
        if (cancelled) return;
        if (payload.type === 'blob') {
          const url = URL.createObjectURL(payload.blob);
          setImgSrc(url);
        } else if (payload.type === 'json') {
          const data = payload.json;
          if (!data) {
            setError('Respuesta vacía');
          } else if (typeof data === 'string') {
            setImgSrc(data);
          } else if (data.imageUrl) {
            setImgSrc(data.imageUrl);
          } else if (data.svg) {
            const blob = new Blob([data.svg], { type: 'image/svg+xml' });
            setImgSrc(URL.createObjectURL(blob));
          } else {
            setError('La API no devolvió una imagen válida');
          }
        }
      })
      .catch((err) => {
        if (cancelled) return;
        setError(err.message || 'Error al cargar');
      })
      .finally(() => {
        if (!cancelled) setLoading(false);
      });

    return () => {
      cancelled = true;
    };
  }, [apiUrl, reloadKey]);

  return (
    <div className="w3-card w3-white rounded-3 p-3">
      <h6 className="fw-semibold mb-2">{title}</h6>
      <div style={{ minHeight: height }} className="d-flex align-items-center justify-content-center">
        {loading && (
          <div className="text-center text-secondary small">
            <div className="spinner-border spinner-border-sm me-2" role="status" aria-hidden="true"></div>
            Cargando...
          </div>
        )}

        {!loading && error && (
          <div className="text-center text-danger small">
            <div>{error}</div>
            <button className="btn btn-link btn-sm" onClick={() => setReloadKey(k => k + 1)}>Reintentar</button>
          </div>
        )}

        {!loading && !error && imgSrc && (
          <img src={imgSrc} alt={title} style={{ maxHeight: height, width: '100%', objectFit: 'contain' }} />
        )}
      </div>
    </div>
  );
}
