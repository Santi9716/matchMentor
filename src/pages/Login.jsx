import React, { useState } from 'react';
import { useNavigate, Link} from 'react-router-dom';

export default function Login() {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const navigate = useNavigate();

  const handleSubmit = (e) => {
    e.preventDefault();
    // Aquí iría la lógica de autenticación
        // guardar token con la misma clave que usa la app (authToken)
        localStorage.setItem('authToken', 'demo_token');

        // Preferir el role ya guardado (por ejemplo tras el registro). Si no existe, usar heurística por email.
        const storedRoleRaw = localStorage.getItem('role');
        const storedRole = storedRoleRaw ? String(storedRoleRaw).toLowerCase().trim() : null;
        const derivedRole = email.includes('mentor') ? 'mentor' : 'student';
        const role = storedRole || derivedRole;
        // normalizar antes de guardar
        const normalizedRole = role === 'mentor' ? 'mentor' : 'student';
        localStorage.setItem('role', normalizedRole);

        // debug: loguear role detectado (mira la consola del navegador)
        // Esto ayuda a verificar si storedRole tiene el valor esperado
        // Puedes eliminar estos logs una vez que confirmes el comportamiento
        // eslint-disable-next-line no-console
        console.log('[Login] storedRoleRaw=', storedRoleRaw, 'storedRole=', storedRole, 'derivedRole=', derivedRole, 'normalizedRole=', normalizedRole);

        // navegar a la ruta de perfil correcta
            navigate(normalizedRole === 'mentor' ? '/mentor/profile' : '/student/profile');
  }

  return (
    <div className='container py-5'>
        <div className='row justify-content-center'>
            <div className='col-12 col-md-6 col-lg-5'>
                <div className='w3-card w3-white rounded-3 p-4'>
                    <h3 className="mb-3 text-center">Iniciar Sesión</h3>
                    <form onSubmit={handleSubmit} className='vstack gap-3'>
                        <div>
                            <label htmlFor="email" className="form-label">Correo Electrónico</label>
                            <input
                                type="email"
                                className="form-control"
                                value={email}
                                onChange={(e) => setEmail(e.target.value)}
                                required
                            />
                        </div>
                        <div>
                            <label htmlFor="password" className="form-label">Contraseña</label>
                            <input
                                type="password"
                                className="form-control"
                                value={password}
                                onChange={(e) => setPassword(e.target.value)}
                                required
                            />
                        </div>
                        <button type="submit" className="btn btn-primary w-100">Iniciar Sesión</button>
                        <div className="text-center small">¿No tienes una cuenta? <Link to="/register">Regístrate</Link></div>
                    </form>
                </div>
            </div>
        </div>
    </div>
  )
}
