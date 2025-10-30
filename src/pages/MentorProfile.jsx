import React, { useEffect, useState } from "react";
import DashboardLayout from "../layouts/DashboardLayout";
import MentorStatsCard from "../components/MentorStatsCard";

export default function MentorProfile() {
  // 1. tomamos el id del mentor autenticado desde localStorage
  const storedId = typeof window !== "undefined" ? localStorage.getItem("userId") : null;
  const CURRENT_MENTOR_ID = storedId ? Number(storedId) : null;

  // Estado principal que se renderiza (con nombres "bonitos" para el front)
  const [profile, setProfile] = useState({
    id: CURRENT_MENTOR_ID,
    name: "",
    email: "",
    biography: "",
    skills: "",
    availability: "",
    rating: "",
    city: "",
  });

  // Estado temporal mientras editamos
  const [temp, setTemp] = useState(profile);
  const [editing, setEditing] = useState(false);

  // ============================
  // 1. Cargar datos iniciales desde el backend
  // ============================
  useEffect(() => {
    // si no hay id en localStorage, no hacemos fetch
    if (!CURRENT_MENTOR_ID) {
      console.warn("[MentorProfile] No hay userId en localStorage.");
      return;
    }

    const fetchMentorInfo = async () => {
      try {
        const resp = await fetch("http://localhost:8080/mentors/me/full-info", {
          headers: {
            "X-USER-ID": CURRENT_MENTOR_ID,
          },
        });

        if (!resp.ok) {
          console.error("Error GET mentor full-info:", resp.status);
          alert("No pude cargar la información del mentor.");
          return;
        }

        const data = await resp.json();
        console.log("GET /mentors/me/full-info ->", data);

        // El back responde con:
        // name, email, city, role,
        // disponibilidad, habilidades, biografia, rating
        const uiData = {
          id: data.id,
          name: data.name || "",
          email: data.email || "",
          city: data.city || "",
          availability: data.disponibilidad || "",
          skills: data.habilidades || "",
          biography: data.biografia || "",
          rating: data.rating != null ? String(data.rating) : "",
        };

        setProfile(uiData);
        setTemp(uiData);
      } catch (error) {
        console.error("Fallo de red al cargar mentor:", error);
        alert("Error de conexión con el servidor.");
      }
    };

    fetchMentorInfo();
  }, [CURRENT_MENTOR_ID]);

  // ============================
  // 2. Entrar en modo edición
  // ============================
  const startEdit = (e) => {
    e.preventDefault();
    setTemp(profile);
    setEditing(true);
  };

  // ============================
  // 3. Cancelar edición
  // ============================
  const cancelEdit = () => {
    setTemp(profile);
    setEditing(false);
  };

  // ============================
  // 4. Guardar cambios (PUT al backend)
  // ============================
  const saveProfile = async () => {
    if (!temp.name.trim() || !temp.email.trim()) {
      alert("Nombre y email son obligatorios");
      return;
    }

    if (!CURRENT_MENTOR_ID) {
      alert("No hay usuario autenticado (userId no encontrado).");
      return;
    }

    try {
      // OJO: aquí convertimos del nombre del front → al nombre que espera el back
      const payload = {
        name: temp.name,
        email: temp.email,
        city: temp.city,
        disponibilidad: temp.availability,
        habilidades: temp.skills,
        biografia: temp.biography,
        // si quieres que el back permita actualizar rating, lo puedes mandar:
        // rating: temp.rating ? Number(temp.rating) : null,
      };

      const resp = await fetch("http://localhost:8080/mentors/me/full-info", {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
          "X-USER-ID": CURRENT_MENTOR_ID,
        },
        body: JSON.stringify(payload),
      });

      if (!resp.ok) {
        const errorText = await resp.text();
        console.error("Error PUT mentor full-info:", resp.status, errorText);
        alert(
          "No se pudo actualizar la información del mentor. (" + resp.status + ")"
        );
        return;
      }

      // tu back actualmente devuelve un String: "Perfil de mentor actualizado correctamente"
      // así que no hay JSON de vuelta con los datos.
      // Podemos volver a hacer GET para refrescar:
      const refreshed = await fetch("http://localhost:8080/mentors/me/full-info", {
        headers: {
          "X-USER-ID": CURRENT_MENTOR_ID,
        },
      });

      if (refreshed.ok) {
        const dataUpdated = await refreshed.json();
        const uiData = {
          id: dataUpdated.id,
          name: dataUpdated.name || "",
          email: dataUpdated.email || "",
          city: dataUpdated.city || "",
          availability: dataUpdated.disponibilidad || "",
          skills: dataUpdated.habilidades || "",
          biography: dataUpdated.biografia || "",
          rating:
            dataUpdated.rating != null ? String(dataUpdated.rating) : "",
        };
        setProfile(uiData);
        setTemp(uiData);
      }

      setEditing(false);
      alert("Perfil actualizado ✅");
    } catch (error) {
      console.error("Fallo de red PUT mentor:", error);
      alert("Error de conexión con el servidor.");
    }
  };

  // ============================
  // 5. Manejar cambios en los inputs
  // ============================
  const onTempChange = (e) => {
    const { name, value } = e.target;
    setTemp((prev) => ({ ...prev, [name]: value }));
  };

  // Avatar generado por nombre
  const avatarUrl = `https://api.dicebear.com/8.x/identicon/svg?seed=${encodeURIComponent(
    profile.name || "mentor"
  )}`;

  return (
    <DashboardLayout role="mentor" title="Mi Perfil (Mentor)">
      <div className="row g-3">
        {/* COLUMNA IZQUIERDA: PERFIL */}
        <div className="col-12 col-lg-6">
          <div className="border rounded-3 p-3 h-100 d-flex flex-column justify-content-center align-items-center text-center" style={{ minHeight: 360 }}>
            <img
              src={avatarUrl}
              alt="Avatar"
              className="rounded-circle mb-3 shadow-sm"
              style={{ width: 120, height: 120, objectFit: "cover" }}
            />

            {!editing ? (
              <>
                <h5 className="mb-2 fw-bold fs-4">{profile.name}</h5>
                <div className="text-secondary mb-3 fs-6">{profile.email}</div>
                <div className="text-start mx-auto fs-6" style={{ maxWidth: 460 }}>
                  <p className="mb-3">
                    <strong>Disponibilidad:</strong> {profile.availability}
                  </p>
                  <p className="mb-3">
                    <strong>Habilidades:</strong> {profile.skills}
                  </p>
                  <p className="mb-3">
                    <strong>Ciudad:</strong> {profile.city}
                  </p>
                  <p className="mb-3">
                    <strong>Biografía:</strong> {profile.biography}
                  </p>
                  <div className="mb-3">
                    <span className="badge text-bg-success fs-6">
                      Rating: {profile.rating || "N/A"}
                    </span>
                  </div>
                </div>

                <button
                  className="btn btn-outline-primary mt-2"
                  onClick={startEdit}
                >
                  Actualizar información
                </button>
              </>
            ) : (
              <div className="text-start w-100" style={{ maxWidth: 520 }}>
                <h6 className="fw-bold mb-3">Editar información</h6>

                <div className="mb-3">
                  <label className="form-label small text-secondary">
                    Nombre
                  </label>
                  <input
                    className="form-control"
                    name="name"
                    value={temp.name || ""}
                    onChange={onTempChange}
                  />
                </div>

                <div className="mb-3">
                  <label className="form-label small text-secondary">
                    Email
                  </label>
                  <input
                    className="form-control"
                    type="email"
                    name="email"
                    value={temp.email || ""}
                    onChange={onTempChange}
                  />
                </div>

                <div className="mb-3">
                  <label className="form-label small text-secondary">
                    Disponibilidad
                  </label>
                  <input
                    className="form-control"
                    name="availability"
                    value={temp.availability || ""}
                    onChange={onTempChange}
                  />
                </div>

                <div className="mb-3">
                  <label className="form-label small text-secondary">
                    Habilidades
                  </label>
                  <input
                    className="form-control"
                    name="skills"
                    value={temp.skills || ""}
                    onChange={onTempChange}
                  />
                  <div className="form-text">Separa por coma (,)</div>
                </div>

                <div className="mb-3">
                  <label className="form-label small text-secondary">
                    Ciudad
                  </label>
                  <input
                    className="form-control"
                    name="city"
                    value={temp.city || ""}
                    onChange={onTempChange}
                  />
                </div>

                <div className="mb-3">
                  <label className="form-label small text-secondary">
                    Biografía
                  </label>
                  <textarea
                    className="form-control"
                    rows={3}
                    name="biography"
                    value={temp.biography || ""}
                    onChange={onTempChange}
                  />
                </div>

                {/* Rating: mostrar como solo lectura en el formulario de edición */}
                <div className="mb-3">
                  <label className="form-label small text-secondary">Rating</label>
                  <div className="form-control-plaintext">{profile.rating || "N/A"}</div>
                </div>

                <div className="d-flex gap-2">
                  <button className="btn btn-primary" onClick={saveProfile}>
                    Guardar cambios
                  </button>
                  <button
                    className="btn btn-outline-secondary"
                    onClick={cancelEdit}
                  >
                    Cancelar
                  </button>
                </div>
              </div>
            )}
          </div>
        </div>

        {/* COLUMNA DERECHA: ESTADÍSTICAS */}
        <div className="col-12 col-lg-6">
          <div className="border rounded-3 p-3 h-100">
            <h6 className="fw-bold mb-3">Estadísticas</h6>

            {(() => {
              const base =
                typeof import.meta !== "undefined" &&
                import.meta.env &&
                import.meta.env.VITE_API_BASE
                  ? import.meta.env.VITE_API_BASE
                  : "";
              const endpoints = {
                approval: base + "/api/mentor/approval-chart",
                sessionsPerMonth: base + "/api/mentor/sessions-per-month-chart",
                activeStudents: base + "/api/mentor/active-students-chart",
              };

              return (
                <div className="vstack gap-3 mb-3">
                  <MentorStatsCard
                    title="Promedio de aprobación"
                    apiUrl={endpoints.approval}
                  />
                  <MentorStatsCard
                    title="Asesorías por mes"
                    apiUrl={endpoints.sessionsPerMonth}
                  />
                  <MentorStatsCard
                    title="Estudiantes activos"
                    apiUrl={endpoints.activeStudents}
                  />
                </div>
              );
            })()}

            <h6 className="fw-bold mb-3">Estudiantes asignados</h6>
            <ul className="list-group">
              <li className="list-group-item d-flex justify-content-between align-items-center">
                <span>Santiago Herrera</span>
                <span className="badge text-bg-primary">76% progreso</span>
              </li>
              <li className="list-group-item d-flex justify-content-between align-items-center">
                <span>María López</span>
                <span className="badge text-bg-primary">64% progreso</span>
              </li>
            </ul>
          </div>
        </div>
      </div>
    </DashboardLayout>
  );
}

