import React, { useEffect, useState } from "react";
import AdminSidebar from "../components/AdminSidebar";

export default function AdminUsers() {
  const API_BASE = "http://localhost:8080";

  // listas separadas que vienen del back
  const [students, setStudents] = useState([]);
  const [mentors, setMentors] = useState([]);

  // lista que se muestra según pestaña + búsqueda
  const [filtered, setFiltered] = useState([]);

  // pestaña activa
  const [activeTab, setActiveTab] = useState("STUDENT");

  // formulario
  const [form, setForm] = useState({
    id: null,
    name: "",
    email: "",
    role: "STUDENT",
    city: "",
    password: "",
    blocked: false,
  });

  const [search, setSearch] = useState("");
  const [loading, setLoading] = useState(false);

  const isEditing = form.id !== null;

  // =========================
  // HELPERS
  // =========================
  const applySearch = (list, q) => {
    const query = (q || "").toLowerCase();
    if (!query) return list;
    return list.filter(
      (u) =>
        (u.name && u.name.toLowerCase().includes(query)) ||
        (u.email && u.email.toLowerCase().includes(query)) ||
        (u.city && u.city.toLowerCase().includes(query))
    );
  };

  // =========================
  // LOADERS  (usa /users/students y /users/mentors)
  // =========================
  const loadStudents = async () => {
    try {
      const resp = await fetch(`${API_BASE}/users/students`);
      if (!resp.ok) {
        console.error("Error al cargar estudiantes:", resp.status);
        return;
      }
      const data = await resp.json();
      setStudents(data);
      if (activeTab === "STUDENT") {
        setFiltered(applySearch(data, search));
      }
    } catch (err) {
      console.error("Error de red al cargar estudiantes:", err);
    }
  };

  const loadMentors = async () => {
    try {
      const resp = await fetch(`${API_BASE}/users/mentors`);
      if (!resp.ok) {
        console.error("Error al cargar mentores:", resp.status);
        return;
      }
      const data = await resp.json();
      setMentors(data);
      if (activeTab === "MENTOR") {
        setFiltered(applySearch(data, search));
      }
    } catch (err) {
      console.error("Error de red al cargar mentores:", err);
    }
  };

  // cargar ambos al inicio
  useEffect(() => {
    setLoading(true);
    Promise.all([loadStudents(), loadMentors()]).finally(() =>
      setLoading(false)
    );
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  // =========================
  // CAMBIO DE PESTAÑA
  // =========================
  const handleTabChange = (tab) => {
    setActiveTab(tab);
    setSearch("");
    if (tab === "STUDENT") {
      setFiltered(applySearch(students, ""));
      setForm((prev) => ({ ...prev, role: "STUDENT" }));
    } else {
      setFiltered(applySearch(mentors, ""));
      setForm((prev) => ({ ...prev, role: "MENTOR" }));
    }
  };

  // =========================
  // BÚSQUEDA
  // =========================
  const handleSearch = (e) => {
    const q = e.target.value;
    setSearch(q);
    if (activeTab === "STUDENT") {
      setFiltered(applySearch(students, q));
    } else {
      setFiltered(applySearch(mentors, q));
    }
  };

  // =========================
  // FORM
  // =========================
  const onChange = (e) => {
    const { name, value } = e.target;
    setForm((prev) => ({ ...prev, [name]: value }));
  };

  const resetForm = () => {
    setForm({
      id: null,
      name: "",
      email: "",
      role: activeTab === "STUDENT" ? "STUDENT" : "MENTOR",
      city: "",
      password: "",
      blocked: false,
    });
  };

  // =========================
  // GUARDAR (crear / editar)
  // =========================
  const saveUser = async () => {
    if (!form.name.trim() || !form.email.trim()) {
      alert("Nombre y email son obligatorios");
      return;
    }

    const payload = {
      name: form.name.trim(),
      email: form.email.trim(),
      role: form.role, // STUDENT | MENTOR
      city: form.city.trim(),
      blocked: form.blocked,
    };

    // password opcional
    if (!isEditing && form.password.trim()) {
      payload.password = form.password.trim();
    }
    if (isEditing && form.password.trim()) {
      payload.password = form.password.trim();
    }

    setLoading(true);
    try {
      let resp;
      if (isEditing) {
        // EDITAR
        resp = await fetch(`${API_BASE}/users/${form.id}`, {
          method: "PUT",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify(payload),
        });
      } else {
        // CREAR
        resp = await fetch(`${API_BASE}/users`, {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify(payload),
        });
      }

      if (!resp.ok) {
        const txt = await resp.text();
        console.error("Error al guardar usuario:", resp.status, txt);
        alert("No se pudo guardar el usuario");
        return;
      }

      // recargar SOLO la lista que toca
      if (payload.role === "STUDENT") {
        await loadStudents();
        setActiveTab("STUDENT");
      } else if (payload.role === "MENTOR") {
        await loadMentors();
        setActiveTab("MENTOR");
      } else {
        await Promise.all([loadStudents(), loadMentors()]);
      }

      resetForm();
    } catch (err) {
      console.error("Error de red al guardar usuario:", err);
      alert("Error de red al guardar usuario");
    } finally {
      setLoading(false);
    }
  };

  // =========================
  // EDITAR
  // =========================
  const editUser = (u) => {
    setForm({
      id: u.id,
      name: u.name || "",
      email: u.email || "",
      role: u.role || "STUDENT",
      city: u.city || "",
      password: "",
      blocked: !!u.blocked,
    });

    // cambiar de pestaña según su rol
    if (u.role === "STUDENT") {
      setActiveTab("STUDENT");
      setFiltered(applySearch(students, search));
    } else if (u.role === "MENTOR") {
      setActiveTab("MENTOR");
      setFiltered(applySearch(mentors, search));
    }
  };

  // =========================
  // ELIMINAR
  // =========================
  const deleteUser = async (id, role) => {
    if (!window.confirm("¿Seguro que quieres eliminar este usuario?")) return;
    try {
      const resp = await fetch(`${API_BASE}/users/${id}`, {
        method: "DELETE",
      });
      if (!resp.ok) {
        alert("No se pudo eliminar el usuario");
        return;
      }

      if (role === "STUDENT") {
        await loadStudents();
      } else if (role === "MENTOR") {
        await loadMentors();
      }
    } catch (err) {
      console.error("Error de red al eliminar usuario:", err);
    }
  };

  // =========================
  // BLOQUEAR / DESBLOQUEAR
  // =========================
  const toggleBlock = async (u) => {
    const newBlocked = !u.blocked;
    try {
      const resp = await fetch(
        `${API_BASE}/admin/users/${u.id}/block?blocked=${newBlocked}`,
        {
          method: "PATCH",
        }
      );
      if (!resp.ok) {
        alert("No se pudo cambiar el estado del usuario");
        return;
      }

      if (u.role === "STUDENT") {
        await loadStudents();
      } else if (u.role === "MENTOR") {
        await loadMentors();
      }
    } catch (err) {
      console.error("Error de red al bloquear usuario:", err);
    }
  };

  // =========================
  // RENDER
  // =========================
  return (
    <div className="d-flex flex-column min-vh-100 bg-light">
      <main className="flex-grow-1 py-4">
        <div className="container">
          <div className="row g-3">
            {/* Sidebar */}
            <div className="col-12 col-lg-3">
              <AdminSidebar />
            </div>

            {/* Contenido */}
            <div className="col-12 col-lg-9">
              <div className="vstack gap-3">
                {/* Header */}
                <div className="w3-container w3-padding w3-dark-grey rounded-3 text-white d-flex justify-content-between align-items-center">
                  <div>
                    <h5 className="mb-0 text-primary">Gestión de Usuarios</h5>
                    <div className="text-white-50 small">
                      Crea, edita, elimina o bloquea usuarios del sistema
                    </div>
                  </div>
                  <div style={{ minWidth: "220px" }}>
                    <input
                      className="form-control form-control-sm"
                      placeholder="Buscar..."
                      value={search}
                      onChange={handleSearch}
                    />
                  </div>
                </div>

                {/* Pestañas */}
                <div className="d-flex gap-2">
                  <button
                    type="button"
                    className={`btn btn-sm ${
                      activeTab === "STUDENT"
                        ? "btn-primary"
                        : "btn-outline-primary"
                    }`}
                    onClick={() => handleTabChange("STUDENT")}
                  >
                    Estudiantes
                  </button>
                  <button
                    type="button"
                    className={`btn btn-sm ${
                      activeTab === "MENTOR"
                        ? "btn-success"
                        : "btn-outline-success"
                    }`}
                    onClick={() => handleTabChange("MENTOR")}
                  >
                    Mentores
                  </button>
                </div>

                {/* Formulario */}
                <div className="w3-card w3-white rounded-3 p-3">
                  <h6 className="fw-bold mb-3">
                    {isEditing ? "Editar usuario" : "Crear usuario"}
                  </h6>

                  <div className="row g-3">
                    <div className="col-md-6">
                      <label className="form-label small text-secondary">
                        Nombre
                      </label>
                      <input
                        className="form-control"
                        name="name"
                        value={form.name}
                        onChange={onChange}
                        placeholder="Nombre completo"
                      />
                    </div>

                    <div className="col-md-6">
                      <label className="form-label small text-secondary">
                        Email
                      </label>
                      <input
                        className="form-control"
                        name="email"
                        type="email"
                        value={form.email}
                        onChange={onChange}
                        placeholder="correo@dominio"
                      />
                    </div>

                    <div className="col-md-4">
                      <label className="form-label small text-secondary">
                        Rol
                      </label>
                      <select
                        className="form-select"
                        name="role"
                        value={form.role}
                        onChange={onChange}
                      >
                        <option value="STUDENT">Estudiante</option>
                        <option value="MENTOR">Mentor</option>
                      </select>
                    </div>

                    <div className="col-md-4">
                      <label className="form-label small text-secondary">
                        Ciudad
                      </label>
                      <input
                        className="form-control"
                        name="city"
                        value={form.city}
                        onChange={onChange}
                        placeholder="Ciudad"
                      />
                    </div>

                    <div className="col-md-4">
                      <label className="form-label small text-secondary">
                        Contraseña
                      </label>
                      <input
                        className="form-control"
                        name="password"
                        type="password"
                        value={form.password}
                        onChange={onChange}
                        placeholder={
                          isEditing
                            ? "Dejar vacío para no cambiar"
                            : "Contraseña inicial"
                        }
                      />
                    </div>

                    <div className="col-12 d-flex justify-content-end gap-2">
                      <button
                        className="btn btn-primary"
                        onClick={saveUser}
                        disabled={loading}
                      >
                        {isEditing ? "Guardar cambios" : "Crear usuario"}
                      </button>
                      {isEditing && (
                        <button
                          className="btn btn-outline-secondary"
                          onClick={resetForm}
                        >
                          Cancelar
                        </button>
                      )}
                    </div>
                  </div>
                </div>

                {/* Tabla */}
                <div className="w3-card w3-white rounded-3 p-3">
                  <h6 className="fw-bold mb-3">
                    {activeTab === "STUDENT"
                      ? "Listado de estudiantes"
                      : "Listado de mentores"}
                  </h6>

                  {loading ? (
                    <div className="text-center text-muted py-3">
                      Cargando...
                    </div>
                  ) : (
                    <div className="table-responsive">
                      <table className="table align-middle table-sm">
                        <thead className="table-light">
                          <tr>
                            <th>Nombre</th>
                            <th>Email</th>
                            <th>Rol</th>
                            <th>Ciudad</th>
                            <th>Estado</th>
                            <th className="text-end">Acciones</th>
                          </tr>
                        </thead>
                        <tbody>
                          {filtered.map((u) => (
                            <tr key={u.id}>
                              <td>{u.name}</td>
                              <td className="small text-secondary">{u.email}</td>
                              <td>
                                {u.role === "STUDENT" && (
                                  <span className="badge text-bg-primary">
                                    Estudiante
                                  </span>
                                )}
                                {u.role === "MENTOR" && (
                                  <span className="badge text-bg-success">
                                    Mentor
                                  </span>
                                )}
                                {!u.role && (
                                  <span className="badge text-bg-secondary">
                                    —
                                  </span>
                                )}
                              </td>
                              <td>{u.city || "-"}</td>
                              <td>
                                {u.blocked ? (
                                  <span className="badge text-bg-danger">
                                    Bloqueado
                                  </span>
                                ) : (
                                  <span className="badge text-bg-success">
                                    Activo
                                  </span>
                                )}
                              </td>
                              <td className="text-end">
                                <div className="d-flex justify-content-end align-items-center gap-2">
                                  <button
                                    className="btn btn-sm btn-outline-secondary"
                                    onClick={() => editUser(u)}
                                    title="Editar"
                                    aria-label={`Editar ${u.name}`}
                                  >
                                    <i className="bi bi-pencil" aria-hidden="true"></i>
                                  </button>

                                  <button
                                    className="btn btn-sm btn-outline-danger"
                                    onClick={() => deleteUser(u.id, u.role)}
                                    title="Eliminar"
                                    aria-label={`Eliminar ${u.name}`}
                                  >
                                    <i className="bi bi-x-lg" aria-hidden="true"></i>
                                  </button>

                                  <button
                                    className={`btn btn-sm ${u.blocked ? 'btn-outline-success' : 'btn-outline-warning'}`}
                                    onClick={() => toggleBlock(u)}
                                    title={u.blocked ? 'Desbloquear' : 'Bloquear'}
                                    aria-label={`${u.blocked ? 'Desbloquear' : 'Bloquear'} ${u.name}`}
                                  >
                                    <i className={`bi ${u.blocked ? 'bi-unlock' : 'bi-lock'}`} aria-hidden="true"></i>
                                  </button>
                                </div>
                              </td>
                            </tr>
                          ))}
                          {filtered.length === 0 && (
                            <tr>
                              <td colSpan={6} className="text-center text-muted py-3">
                                No hay registros.
                              </td>
                            </tr>
                          )}
                        </tbody>
                      </table>
                    </div>
                  )}
                </div>
              </div>
            </div>
            {/* fin contenido */}
          </div>
        </div>
      </main>
    </div>
  );
}
