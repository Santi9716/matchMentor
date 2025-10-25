import React from 'react'

export default function StatsCards({ stats = {}}) {
  const items = [
    { label: 'Promedio', value: stats.avg ?? '—', icon: 'bi-graph-up' },
    { label: 'Aprobadas', value: stats.passed ?? 0, icon: 'bi-check-circle' },
    { label: 'Reprobadas', value: stats.failed ?? 0, icon: 'bi-x-circle' },
    { label: 'Mentorías', value: stats.sessions ?? 0, icon: 'bi-people' },
  ]
  return (
    <div className="row g-3">
      {items.map((item, index) => (
        <div className="col-6 col-md-3" key={index}>
          <div className="w3-card w3-white rounded-3 p-3 h-100 d-flex flex-column justify-content-center">
            <div className="d-flex align-items-center gap-3">
                <i className={`bi ${item.icon} fs-3`}></i>
            <div>
              <div className="fw-bold fs-5">{item.value}</div>
              <div className="text-secondary small">{item.label}</div>
            </div>
          </div>
        </div>
    </div>
      ))}
    </div>
  )
}
