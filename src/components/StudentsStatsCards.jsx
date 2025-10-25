import React from 'react';

export default function StudentStatsCards({ stats }) {
  // stats debería venir del backend (Spring) que consume análisis Python.
  // Por ahora lo simulamos:
  // {
  //   promedioGeneral: 3.8,
  //   materiasCriticas: ['Algoritmos', 'Bases de Datos'],
  //   progresoUltimoMes: [3.2, 3.4, 3.5, 3.8],
  //   labelsUltimoMes: ['Ago', 'Sep', 'Oct', 'Nov']
  // }

  return (
    <div className="w3-card w3-white rounded-3 p-3 mb-3">
      <h6 className="fw-bold mb-3">Tu rendimiento académico</h6>

      <div className="mb-3">
        <div className="small text-secondary">Promedio general</div>
        <div className="fs-4 fw-semibold text-primary">
          {stats.promedioGeneral}
        </div>
      </div>

      <div className="mb-3">
        <div className="small text-secondary">Materias que necesitan refuerzo</div>
        {stats.materiasCriticas.length === 0 ? (
          <div className="badge text-bg-success">¡Todo en verde!</div>
        ) : (
          <div className="d-flex flex-wrap gap-2">
            {stats.materiasCriticas.map((m, idx) => (
              <span key={idx} className="badge text-bg-danger">{m}</span>
            ))}
          </div>
        )}
      </div>

      <div>
        <div className="small text-secondary mb-2">
          Evolución mensual del promedio
        </div>

        {/* Placeholder de la gráfica */}
        <div
          className="border rounded-3 p-3 bg-light"
          style={{
            minHeight: '140px',
            fontSize: '0.8rem',
            fontStyle: 'italic',
            textAlign: 'center',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center'
          }}
        >
          Aquí va la gráfica (promedio vs tiempo)
          {/* 
            Más adelante esto se reemplaza por un <img src={urlGeneradaPorPython}/> 
            ó un componente <Chart /> si quieres graficar directamente en React.
          */}
        </div>

        <div className="d-flex justify-content-between small text-secondary mt-2">
          {stats.labelsUltimoMes.map((label, i) => (
            <span key={i}>{label}</span>
          ))}
        </div>
      </div>
    </div>
  );
}
