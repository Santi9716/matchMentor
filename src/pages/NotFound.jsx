import React from 'react'
import { Link } from 'react-router-dom'

export default function NotFound() {
  return (
    <div className="container py-5 text-center">
      <h1 className="display-5">404</h1>
      <p className="lead">Página no encontrada.</p>
      <Link to="/" className="btn btn-primary">Ir al inicio</Link>
    </div>
  )
}
