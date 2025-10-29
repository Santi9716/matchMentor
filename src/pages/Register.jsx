import React, {useState} from "react";
import { useNavigate, Link} from 'react-router-dom';


export default function Register() {
    const [formData, setFormData] = useState({name:'', birthDate:'', telephone:'', city:'', email:'', password:'', role:'student', adminCode: ''});
    const navigate = useNavigate();

    const onChange = (e) => {
        setFormData(prev => ({...prev, [e.target.name]: e.target.value}));
    }

    const saveRegister = async (e) => {
        e.preventDefault();

        // 1. Armar el body EXACTO que tu backend espera
        const payload = {
            name: formData.name,
            email: formData.email,
            password: formData.password,
            role: formData.role, // por si en el form está "student" y el back quiere "STUDENT"
            city: formData.city,
        };

        try {
            // 2. Hacer el POST al backend
            const resp = await fetch("http://localhost:8080/users", {
                method: "POST",
                headers: {
                    "Content-Type": "application/json",
                },
                body: JSON.stringify(payload),
            });

            // 3. Manejar respuesta
            if (!resp.ok) {
                // si el back devuelve 4xx o 5xx
                const errorText = await resp.text();
                console.error("Error del backend:", errorText);
                alert("No se pudo registrar el usuario. (" + resp.status + ")");
                return;
            }

            // opcional: leer el usuario creado que responde el backend
            const data = await resp.json();
            console.log("Usuario creado:", data);

            // 4. Avisar y redirigir
            alert(`Usuario ${payload.name} registrado como ${payload.role}`);
            navigate("/login");

        } catch (err) {
            console.error("Fallo de red:", err);
            alert("Error de conexión con el servidor.");
        }
    };


    return (
      <div className="container py-5">
        <div className="row justify-content-center">
          <div className="col-12 col-md-7 col-lg-6">
            <div className="w3-card w3-white rounded-3 p-4">
              <h3 className="mb-3 text-center">Registrarse</h3>

              <form onSubmit={saveRegister} className="vstack gap-3">
                <div className="row g-3">
                  {/* Nombre */}
                  <div className="col-md-6">
                    <label htmlFor="name" className="form-label">Nombre Completo</label>
                    <input
                      type="text"
                      className="form-control"
                      id="name"
                      name="name"
                      value={formData.name}
                      onChange={onChange}
                      required
                    />
                  </div>

                  {/* Fecha de nacimiento (solo front, NO va al back todavía) */}
                  <div className="col-md-6">
                    <label htmlFor="birthDate" className="form-label">Fecha de Nacimiento</label>
                    <input
                      type="date"
                      className="form-control"
                      id="birthDate"
                      name="birthDate"
                      value={formData.birthDate}
                      onChange={onChange}
                    />
                  </div>

                  {/* Teléfono (solo front, NO va al back todavía) */}
                  <div className="col-md-6">
                    <label htmlFor="telephone" className="form-label">Teléfono</label>
                    <input
                      type="tel"
                      className="form-control"
                      id="telephone"
                      name="telephone"
                      value={formData.telephone}
                      onChange={onChange}
                    />
                  </div>

                  {/* Ciudad (sí va al back) */}
                  <div className="col-md-6">
                    <label htmlFor="city" className="form-label">Ciudad</label>
                    <input
                      type="text"
                      className="form-control"
                      id="city"
                      name="city"
                      value={formData.city}
                      onChange={onChange}
                      required
                    />
                  </div>

                  {/* Email (sí va al back) */}
                  <div className="col-md-6">
                    <label htmlFor="email" className="form-label">Correo Electrónico</label>
                    <input
                      type="email"
                      className="form-control"
                      id="email"
                      name="email"
                      value={formData.email}
                      onChange={onChange}
                      required
                    />
                  </div>

                  {/* Password (sí va al back) */}
                  <div className="col-md-6">
                    <label htmlFor="password" className="form-label">Contraseña</label>
                    <input
                      type="password"
                      className="form-control"
                      id="password"
                      name="password"
                      value={formData.password}
                      onChange={onChange}
                      required
                    />
                  </div>

                  {/* Rol (sí va al back) */}
                  <div className="col-md-6">
                    <label htmlFor="role" className="form-label">Rol</label>
                    <select
                      className="form-select"
                      id="role"
                      name="role"
                      value={formData.role}
                      onChange={onChange}
                      required
                    >
                      <option value="STUDENT">Estudiante</option>
                      <option value="MENTOR">Mentor</option>
                      <option value="ADMIN">Administrador</option>
                    </select>
                  </div>

                  {/* Código admin (solo visible si elige ADMIN) */}
                  {formData.role === 'ADMIN' && (
                    <div className="col-12">
                      <label htmlFor="adminCode" className="form-label">Código de administrador</label>
                      <input
                        className="form-control"
                        id="adminCode"
                        name="adminCode"
                        value={formData.adminCode}
                        onChange={onChange}
                        placeholder="Código secreto"
                      />
                      <div className="form-text">
                        Introduce el código para crear cuentas administrador.
                      </div>
                    </div>
                  )}
                </div>

                {/* Botón + link login */}
                <div>
                  <button type="submit" className="btn btn-primary w-100">
                    Registrarse
                  </button>
                  <div className="text-center small">
                    ¿Ya tienes una cuenta? <Link to="/login">Inicia Sesión</Link>
                  </div>
                </div>
              </form>
            </div>
          </div>
        </div>
      </div>
    ) 
}
