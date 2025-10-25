import React, { useState } from 'react';
import ProfileSideBar from '../components/ProfileSideBar';
import Sidebar from '../components/Sidebar';

export default function MentorProfile() {
    const [profileData, setProfileData] = useState({
        name: 'Juan Pérez',
        email: 'juan.perez@example.com',
        bio: 'Mentor con 10 años de experiencia en desarrollo web.',
        skills: ['JavaScript', 'React', 'Node.js'],
        availability: 'Lunes a Viernes, 9am - 5pm',
    });

    const onChange = (e) => setProfileData(prev => ({...prev, [e.target.name]: e.target.value}));
  return (
    <div className="container py-4">
        <div className="row g-3">
            <div className="col-12 col-lg-4">
                <ProfileSideBar user={{ name: profileData.name, email: profileData.email, program:"Mentor", semester:"-", city: profileData.city }} />
                <Sidebar role="mentor" />
            </div>
            <div className="col-12 col-lg-8">
               <div className="vstack gap-3">
                    <div className="w3-container w3-padding w3-teal rounded-3">
                        <h5 className="mb-0 text-white">Perfil del Mentor</h5>
                    </div>
                    <div className="w3-card w3-white rounded-3 p-3">
                        <h6 className="mb-3">Información del Mentor</h6>
                        <div className="row g-3">
                            <div className="col-md-6">
                                <label htmlFor="name" className="form-label">Nombre</label>
                                <input type="text" className="form-control" name="name" value={profileData.name} onChange={onChange} />
                            </div>
                            <div className="col-md-6">
                                <label htmlFor="email" className="form-label">Correo Electrónico</label>
                                <input type="email" className="form-control" name="email" value={profileData.email} onChange={onChange} />
                            </div>
                            <div className="col-12">
                                <label htmlFor="skills" className="form-label">Habilidades</label>
                                <textarea className="form-control" name="skills" rows="3" value={profileData.skills.join(', ')} onChange={(e) => onChange({ target: { name: 'skills', value: e.target.value.split(',').map(s => s.trim()) } })}></textarea>
                            </div>
                            <div className="col-12"></div>
                                <label htmlFor="bio" className="form-label">Biografía</label>
                                <textarea className="form-control" name="bio" rows="4" value={profileData.bio} onChange={onChange}></textarea>
                            </div>
                            <div className="col-12">
                                <label htmlFor="availability" className="form-label">Disponibilidad</label>
                                <input type="text" className="form-control" name="availability" value={profileData.availability} onChange={onChange} />
                            </div>
                        </div>
                    </div>

                    <div className="w3-card w3-white rounded-3 p-3">
                        <h6 className="mb-3">Estudiantes asignados</h6>
                        <div className="list-group">
                            {[
                                { id:1, name: 'Ana Gómez', Progress: 80 },
                                { id:2, name: 'Luis Martínez', Progress: 60 },
                                { id:3, name: 'María Rodríguez', Progress: 90 },
                            ].map((student) => ( <a key={student.id} href="#" className="list-group-item list-group-item-action d-flex justify-content-between align-items-center">
                                <span>{student.name}</span>
                                <span className="badge bg-primary rounded-pill">{student.Progress} % de progreso</span>
                            </a> ))}
                        </div>
                    </div>
               </div>
            </div>
        </div>
  )
}
