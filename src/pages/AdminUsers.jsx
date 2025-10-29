import React, { useState } from 'react';
import NavBar from '../components/NavBar';
import AdminSidebar from '../components/AdminSidebar';

export default function AdminUsers() {

  // Estado simulando la BD de usuarios
  const [users, setUsers] = useState([
    { id: 1, name: 'Santiago Herrera', email: 'santiago@demo.com', role: 'STUDENT', city: 'Medellín' },
    { id: 2, name: 'Ana Ruiz', email: 'ana.mentor@demo.com', role: 'MENTOR', city: 'Medellín' },
    { id: 3, name: 'Carlos Pérez', email: 'carlos.mentor@demo.com', role: 'MENTOR', city: 'Bogotá' },
  ]);

  // Formulario para crear/editar
  const [form, setForm] = useState({
    id: null,
    name: '',
    email: '',
    role: 'STUDENT',
    city: '',
  });

  const isEditing = form.id !== null;

  // manejar cambios del form
  const onChange = (e) => {
    const { name, value } = e.target;
    setForm(prev => ({ ...prev, [name]: value }));
  };

  // limpiar el form
  const resetForm = () => {
    setForm({
      id: null,
      name: '',
      email: '',
      role: 'STUDENT',
      city: '',
    });
  };

  // Crear o actualizar usuario en memoria
  const saveUser = () => {
    if (!form.name.trim() || !form.email.trim()) {
      alert('Nombre y email son obligatorios');
      return;
    }

    if (isEditing) {
      // actualizar
      setUsers(prev =>
        prev.map(u => u.id === form.id ? { ...u, ...form } : u)
      );
    } else {
      // crear (simulamos autoincrement con Date.now)
      const nuevo = {
        ...form,
        id: Date.now(),
      };
      setUsers(prev => [nuevo, ...prev]);
    }

    resetForm();
  };

  // Editar: carga datos al form
  const editUser = (u) => {
    setForm({
      id: u.id,
      name: u.name,
      email: u.email,
      role: u.role,
      city: u.city,
    });
  };

  // Eliminar usuario
  const deleteUser = (id) => {
    if (!window.confirm('¿Seguro que quieres eliminar este usuario?')) return;
    setUsers(prev => prev.filter(u => u.id !== id));
    // en backend esto sería DELETE /api/admin/users/{id}
  };

  return (
    <div className="d-flex flex-column min-vh-100 bg-light">
      <NavBar />

      <main className="flex-grow-1 py-4">
        <div className="container">
          <div className="row g-3">

            {/* Sidebar izquierda */}
            <div className="col-12 col-lg-3">
              <AdminSidebar />
            </div>

            {/* Contenido principal */}
            <div className="col-12 col-lg-9">
              <div className="vstack gap-3">

                {/* Header sección */}
                <div className="w3-container w3-padding w3-dark-grey rounded-3 text-white">
                  <h5 className="mb-0">Gestión de Usuarios</h5>
                  <div className="text-white-50 small">
                    Crea, edita o elimina estudiantes y mentores
                  </div>
                </div>

                {/* Formulario Crear / Editar */}
                <div className="w3-card w3-white rounded-3 p-3">
                  <h6 className="fw-bold mb-3">
                    {isEditing ? 'Editar Usuario' : 'Crear Usuario'}
                  </h6>

                  <div className="row g-3">
                    <div className="col-md-6">
                      <label className="form-label small text-secondary">Nombre</label>
                      <input
                        className="form-control"
                        name="name"
                        value={form.name}
                        onChange={onChange}
                        placeholder="Nombre completo"
                      />
                    </div>

                    <div className="col-md-6">
                      <label className="form-label small text-secondary">Email</label>
                      <input
                        className="form-control"
                        name="email"
                        type="email"
                        value={form.email}
                        onChange={onChange}
                        placeholder="correo@institucion.edu"
                      />
                    </div>

                    <div className="col-md-4">
                      <label className="form-label small text-secondary">Rol</label>
                      <select
                        className="form-select"
                        name="role"
                        value={form.role}
                        onChange={onChange}
                      >
                        <option value="STUDENT">Estudiante</option>
                        <option value="MENTOR">Mentor</option>
                        <option value="ADMIN">Admin</option>
                      </select>
                    </div>

                    <div className="col-md-4">
                      <label className="form-label small text-secondary">Ciudad</label>
                      <input
                        className="form-control"
                        name="city"
                        value={form.city}
                        onChange={onChange}
                        placeholder="Ciudad"
                      />
                    </div>

                    <div className="col-md-4 d-flex align-items-end justify-content-end gap-2">
                      <button className="btn btn-primary" onClick={saveUser}>
                        {isEditing ? 'Guardar cambios' : 'Crear usuario'}
                      </button>
                      {isEditing && (
                        <button className="btn btn-outline-secondary" onClick={resetForm}>
                          Cancelar
                        </button>
                      )}
                    </div>
                  </div>
                </div>

                {/* Tabla de usuarios */}
                <div className="w3-card w3-white rounded-3 p-3">
                  <h6 className="fw-bold mb-3">Listado de Usuarios</h6>

                  <div className="table-responsive">
                    <table className="table align-middle table-sm">
                      <thead className="table-light">
                        <tr>
                          <th>Nombre</th>
                          <th>Email</th>
                          <th>Rol</th>
                          <th>Ciudad</th>
                          <th className="text-end">Acciones</th>
                        </tr>
                      </thead>
                      <tbody>
                        {users.map(u => (
                          <tr key={u.id}>
                            <td>{u.name}</td>
                            <td className="small text-secondary">{u.email}</td>
                            <td>
                              {u.role === 'STUDENT' && (
                                <span className="badge text-bg-primary">Estudiante</span>
                              )}
                              {u.role === 'MENTOR' && (
                                <span className="badge text-bg-success">Mentor</span>
                              )}
                              {u.role === 'ADMIN' && (
                                <span className="badge text-bg-dark">Admin</span>
                              )}
                            </td>
                            <td>{u.city}</td>
                            <td className="text-end">
                              <div className="btn-group">
                                <button
                                  className="btn btn-sm btn-outline-secondary"
                                  onClick={() => editUser(u)}
                                >
                                  Editar
                                </button>
                                <button
                                  className="btn btn-sm btn-outline-danger"
                                  onClick={() => deleteUser(u.id)}
                                >
                                  Eliminar
                                </button>
                              </div>
                            </td>
                          </tr>
                        ))}
                      </tbody>
                    </table>
                  </div>

                </div>

              </div>
            </div>

          </div>
        </div>
      </main>
    </div>
  );
}
