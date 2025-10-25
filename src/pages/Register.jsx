import React, {useState} from "react";
import { useNavigate, Link} from 'react-router-dom';


export default function Register() {
    const [formData, setFormData] = useState({name:'', birthDate:'', telephone:'', city:'', email:'', password:'', role:'student'});
    const navigate = useNavigate();

    const onChange = (e) => {
        setFormData(prev => ({...prev, [e.target.name]: e.target.value}));
    }

    const handleSubmit = (e) => {
        e.preventDefault();
        alert(`Usuario ${formData.name} registrado como ${formData.role}`);
        try {
            localStorage.setItem('role', formData.role);
        } catch (err) {
            // no-op si localStorage no está disponible
        }
        navigate('/login');
    };

  return (

    <div className="container py-5">
        <div className="row justify-content-center">
            <div className="col-12 col-md-7 col-lg-6">
                <div className="w3-card w3-white rounded-3 p-4">
                    <h3 className="mb-3 text-center">Registrarse</h3>
                    <form onSubmit={handleSubmit} className="vstack gap-3">
                        <div className="row g-3">
                            <div className="col-md-6">
                                <label htmlFor="name" className="form-label">Nombre Completo</label>
                                <input type="text" className="form-control" name="name" value={formData.name} onChange={onChange} required/>
                            </div>
                            <div className="col-md-6">
                                <label htmlFor="birthDate" className="form-label">Fecha de Nacimiento</label>
                                <input type="date" className="form-control" name="birthDate" value={formData.birthDate} onChange={onChange} required/>
                            </div>
                            <div className="col-md-6">
                                <label htmlFor="telephone" className="form-label">Teléfono</label>
                                <input type="tel" className="form-control" name="telephone" value={formData.telephone} onChange={onChange} required/>
                            </div>
                            
                            <div className="col-md-6">
                                <label htmlFor="city" className="form-label">Ciudad</label>
                                <input type="text" className="form-control" name="city" value={formData.city} onChange={onChange} required/>
                            </div>
                            <div className="col-md-6">
                                <label htmlFor="email" className="form-label">Correo Electrónico</label>
                                <input type="email" className="form-control" name="email" value={formData.email} onChange={onChange} required/>
                            </div>
                            <div className="col-md-6">
                                <label htmlFor="password" className="form-label">Contraseña</label>
                                <input type="password" className="form-control" name="password" value={formData.password} onChange={onChange} required/>
                            </div>
                            <div className="col-md-6">
                                <label htmlFor="role" className="form-label">Rol</label>
                                <select className="form-select" name="role" value={formData.role} onChange={onChange} required>
                                    <option value="student">Estudiante</option>
                                    <option value="mentor">Mentor</option>
                                </select>
                            </div>
                        </div>
                        <div>
                            <button type="submit" className="btn btn-primary w-100">Registrarse</button>
                            <div className="text-center small">¿Ya tienes una cuenta? <Link to="/login">Inicia Sesión</Link></div>
                        </div>
                    </form>
                </div>
            </div>
        </div>
        </div>
  )
}
