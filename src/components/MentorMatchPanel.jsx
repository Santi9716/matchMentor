import React from 'react'

export default function MentorMatchPanel({mentors = []}) {

    if (!mentors.length) {
        mentors = [
            {id: 1, name: "Juan Pérez", skills: ["Matemáticas", "Lógica"], score: 95},
            {id: 2, name: "María Gómez", skills: ["Algoritmos", "Programación"], score: 90},
            {id: 3, name: "Carlos López", skills: ["Bases de datos", "SQL"], score: 85},
        ]
    }

  return (
    <div className='w3-card w3-white rounded-3 p-3'>
        <h5 className="mb-3">Mentores recomendados (match)</h5>
        <div className="list-group">
            {mentors.map(mentor => (
                <div key={mentor.id} className="list-group-item list-group-item-action d-flex justify-content-between align-items-center">
                    <div>
                        <div className='fw-semibold'>{mentor.name}</div>
                        <div className='small-text-secondary'>Habilidades: {mentor.skills.join(", ")}</div>
                    </div>
                    <span className="badge text-bg-primary">{mentor.score}%</span>
                </div>
            ))}
        </div>
      
    </div>
  )
}
