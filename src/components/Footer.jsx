import React from 'react';

export default function Footer() {
  return (
    <footer className="bg-white border-top py-3 mt-4">
      <div className="container text-center small text-secondary">
        Hecho con ❤️ usando Bootstrap & W3.CSS • {new Date().getFullYear()}
      </div>
    </footer>
  )
}
