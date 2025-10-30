import { useEffect, useState } from "react";
import DashboardLayout from "../layouts/DashboardLayout";
import ProfileSideBar from "../components/ProfileSideBar";

export default function StudentProfilePage() {
  // 🔐 ID del usuario autenticado
  const storedId =
    typeof window !== "undefined" ? localStorage.getItem("userId") : null;
  const CURRENT_USER_ID = storedId ? Number(storedId) : 1; // fallback 1

  const [studentInfo, setStudentInfo] = useState({
    id: "",
    name: "",
    email: "",
    city: "",
    role: "",
    programa: "",
    semestre: "",
  });

  const [temp, setTemp] = useState({
    name: "",
    email: "",
    city: "",
    programa: "",
    semestre: "",
  });

  const [editing, setEditing] = useState(false);

  // ======== NUEVO: notas ========
  // formulario de agregar nota
  const [showGradeForm, setShowGradeForm] = useState(false);
  const [gradeForm, setGradeForm] = useState({
    codigo: "",
    materia: "",
    nota: "",
    year: "",
  });

  // notas que ya existen en el backend (las traemos con GET)
  const [savedGrades, setSavedGrades] = useState([]);

  // para edición inline de una nota guardada
  const [editingGradeId, setEditingGradeId] = useState(null);
  const [editingGradeValue, setEditingGradeValue] = useState("");

  // ============================
  // 1. Traer perfil del estudiante
  // ============================
  useEffect(() => {
    fetch("http://localhost:8080/students/me/full-info", {
      headers: {
        "X-USER-ID": CURRENT_USER_ID,
      },
    })
      .then((res) => {
        if (!res.ok)
          throw new Error("Error al consultar perfil del estudiante");
        return res.json();
      })
      .then((data) => {
        setStudentInfo({
          id: data.id ?? "",
          name: data.name ?? "",
          email: data.email ?? "",
          city: data.city ?? "",
          role: data.role ?? "",
          programa: data.programa ?? "",
          semestre: data.semestre ?? "",
        });
      })
      .catch((err) => {
        console.error("Fallo GET perfil:", err);
      });
  }, [CURRENT_USER_ID]);

  // ============================
  // 2. Traer notas del estudiante (las del back)
  // ============================
  const loadGrades = () => {
    fetch("http://localhost:8080/students/me/grades", {
      headers: {
        "X-USER-ID": CURRENT_USER_ID,
      },
    })
      .then((res) => {
        if (!res.ok) throw new Error("Error al consultar notas");
        return res.json();
      })
      .then((data) => {
        // el back devuelve StudentGrades con relaciones: student, subject, grade, takenAt...
        // pero en el composite lo devolvimos plano: {id, codigo, materia, nota, year, studentId}
        // así que soportamos ambas formas
        const normalized = data.map((g) => {
          return {
            id: g.id,
            // si viene del composite:
            codigo: g.codigo || (g.subject && g.subject.code) || "",
            materia: g.materia || (g.subject && g.subject.name) || "",
            nota: g.nota != null ? g.nota : g.grade, // g.grade es el nombre del campo en la entidad
            year: g.year || (g.takenAt ? g.takenAt.substring(0, 4) : ""),
          };
        });
        setSavedGrades(normalized);
      })
      .catch((err) => {
        console.error("Fallo GET notas:", err);
      });
  };

  useEffect(() => {
    loadGrades();
  }, [CURRENT_USER_ID]);

  // ============================
  // 3. Edición de perfil
  // ============================
  function startEdit() {
    setTemp({
      name: studentInfo.name,
      email: studentInfo.email,
      city: studentInfo.city,
      programa: studentInfo.programa,
      semestre: studentInfo.semestre,
    });
    setEditing(true);
  }

  function cancelEdit() {
    setEditing(false);
  }

  function onChange(e) {
    const { name, value } = e.target;
    setTemp((prev) => ({ ...prev, [name]: value }));
  }

  function saveEdit() {
    const bodyToSend = {
      name: temp.name,
      email: temp.email,
      city: temp.city,
      programa: temp.programa,
      semestre: temp.semestre,
    };

    fetch("http://localhost:8080/students/me/full-info", {
      method: "PUT",
      headers: {
        "Content-Type": "application/json",
        "X-USER-ID": CURRENT_USER_ID,
      },
      body: JSON.stringify(bodyToSend),
    })
      .then((res) => {
        if (!res.ok) throw new Error("Error al guardar cambios");
        return res.text();
      })
      .then(() => {
        setStudentInfo((prev) => ({
          ...prev,
          name: temp.name,
          email: temp.email,
          city: temp.city,
          programa: temp.programa,
          semestre: temp.semestre,
        }));
        setEditing(false);
      })
      .catch((err) => {
        console.error("Fallo PUT perfil:", err);
        alert("No se pudieron guardar los cambios.");
      });
  }

  // ============================
  // 4. Manejo del formulario de notas (nuevo)
  // ============================

  const onGradeChange = (e) => {
    const { name, value } = e.target;
    setGradeForm((g) => ({ ...g, [name]: value }));
  };

  // crear nota en el backend usando el endpoint compuesto
  const addGradeToBackend = (e) => {
    e.preventDefault();

    if (
      !gradeForm.codigo.trim() ||
      !gradeForm.materia.trim() ||
      gradeForm.nota === ""
    ) {
      alert("Código, materia y nota son obligatorios");
      return;
    }

    const payload = {
      codigo: gradeForm.codigo,
      materia: gradeForm.materia,
      nota: Number(gradeForm.nota),
      year: gradeForm.year || null,
    };

    fetch("http://localhost:8080/students/me/grades", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        "X-USER-ID": CURRENT_USER_ID,
      },
      body: JSON.stringify(payload),
    })
      .then(async (res) => {
        if (!res.ok) {
          const txt = await res.text().catch(() => "");
          throw new Error(txt || "Error al guardar la nota");
        }
        return res.json();
      })
      .then((saved) => {
        // agregamos la nota recién creada al listado
        setSavedGrades((prev) => [
          {
            id: saved.id,
            codigo: saved.codigo,
            materia: saved.materia,
            nota: saved.nota,
            year: saved.year,
          },
          ...prev,
        ]);
        // limpiar formulario
        setGradeForm({ codigo: "", materia: "", nota: "", year: "" });
        setShowGradeForm(false);
      })
      .catch((err) => {
        console.error("Error al guardar nota:", err);
        alert("No se pudo guardar la nota.");
      });
  };

  // eliminar una nota guardada
  const deleteGrade = (gradeId) => {
    if (!window.confirm("¿Eliminar esta nota?")) return;

    fetch(`http://localhost:8080/students/me/grades/${gradeId}`, {
      method: "DELETE",
      headers: {
        "X-USER-ID": CURRENT_USER_ID,
      },
    })
      .then((res) => {
        if (!res.ok) throw new Error("Error al eliminar nota");
        // quitar del estado
        setSavedGrades((prev) => prev.filter((g) => g.id !== gradeId));
      })
      .catch((err) => {
        console.error("Error al eliminar nota:", err);
        alert("No se pudo eliminar la nota.");
      });
  };

  // empezar a editar una nota ya guardada
  const startEditGrade = (grade) => {
    setEditingGradeId(grade.id);
    setEditingGradeValue(grade.nota);
  };

  // guardar edición de nota (usa PUT /grades/{id})
  const saveEditedGrade = (grade) => {
    // el back de /grades/{id} espera un StudentGrades,
    // pero nosotros solo vamos a mandarle grade y takenAt
    const body = {
      grade: Number(editingGradeValue),
      takenAt: grade.year ? `${grade.year}-01-01T00:00:00` : new Date().toISOString(),
    };

    fetch(`http://localhost:8080/grades/${grade.id}`, {
      method: "PUT",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(body),
    })
      .then((res) => {
        if (!res.ok) throw new Error("Error al actualizar nota");
        return res.json();
      })
      .then(() => {
        // actualizar en el front
        setSavedGrades((prev) =>
          prev.map((g) =>
            g.id === grade.id ? { ...g, nota: Number(editingGradeValue) } : g
          )
        );
        setEditingGradeId(null);
        setEditingGradeValue("");
      })
      .catch((err) => {
        console.error("Error al actualizar nota:", err);
        alert("No se pudo actualizar la nota.");
      });
  };

  // cancelar edición de nota
  const cancelEditGrade = () => {
    setEditingGradeId(null);
    setEditingGradeValue("");
  };

  return (
    <DashboardLayout role="student" title="Mi Perfil (Estudiante)">
      <div className="row g-3">
        {/* Sidebar con avatar */}
        <div className="col-12 col-md-3">
          <ProfileSideBar
            user={{
              name: studentInfo.name,
              email: studentInfo.email,
              city: studentInfo.city,
              program: studentInfo.programa,
              semester: studentInfo.semestre,
            }}
            showDetails={false}
            size={96}
            overlay={true}
          />
        </div>

        {/* Información personal */}
        <div className="col-12 col-md-6">
          <div className="border rounded-3 p-3 h-100">
            <div className="d-flex justify-content-between align-items-start mb-2">
              <h6 className="fw-bold mb-0">Información personal</h6>

              {!editing ? (
                <button
                  className="btn btn-sm btn-outline-primary"
                  onClick={startEdit}
                >
                  Cambiar información
                </button>
              ) : (
                <div className="d-flex gap-2">
                  <button
                    className="btn btn-sm btn-outline-secondary"
                    onClick={cancelEdit}
                  >
                    Cancelar
                  </button>
                  <button
                    className="btn btn-sm btn-primary"
                    onClick={saveEdit}
                  >
                    Guardar
                  </button>
                </div>
              )}
            </div>

            {!editing ? (
              <>
                <div className="small text-secondary">Nombre</div>
                <div className="mb-2">{studentInfo.name}</div>

                <div className="small text-secondary">Email</div>
                <div className="mb-2">{studentInfo.email}</div>

                <div className="small text-secondary">Programa</div>
                <div className="mb-2">{studentInfo.programa}</div>

                <div className="small text-secondary">Semestre</div>
                <div className="mb-2">{studentInfo.semestre}</div>

                <div className="small text-secondary">Ciudad</div>
                <div className="mb-0">{studentInfo.city}</div>
              </>
            ) : (
              <>
                <div className="mb-2">
                  <label className="form-label small">Nombre</label>
                  <input
                    className="form-control"
                    name="name"
                    value={temp.name || ""}
                    onChange={onChange}
                  />
                </div>

                <div className="mb-2">
                  <label className="form-label small">Email</label>
                  <input
                    className="form-control"
                    name="email"
                    value={temp.email || ""}
                    onChange={onChange}
                  />
                </div>

                <div className="mb-2">
                  <label className="form-label small">Programa</label>
                  <input
                    className="form-control"
                    name="programa"
                    value={temp.programa || ""}
                    onChange={onChange}
                  />
                </div>

                <div className="mb-2">
                  <label className="form-label small">Semestre</label>
                  <input
                    className="form-control"
                    name="semestre"
                    value={temp.semestre || ""}
                    onChange={onChange}
                  />
                </div>

                <div className="mb-0">
                  <label className="form-label small">Ciudad</label>
                  <input
                    className="form-control"
                    name="city"
                    value={temp.city || ""}
                    onChange={onChange}
                  />
                </div>
              </>
            )}
          </div>
        </div>

        {/* Resumen académico (lo puedes conectar luego con /students/me/grades/stats) */}
        <div className="col-12 col-md-3">
          <div className="border rounded-3 p-3 h-100">
            <h6 className="fw-bold mb-3">Resumen académico</h6>
            <ul className="list-unstyled mb-0">
              <li className="d-flex justify-content-between">
                <span>Promedio general:</span>
                <strong>—</strong>
              </li>
              <li className="d-flex justify-content-between">
                <span>Materias aprobadas:</span>
                <strong>—</strong>
              </li>
              <li className="d-flex justify-content-between">
                <span>Materias reprobadas:</span>
                <strong className="text-danger">—</strong>
              </li>
            </ul>
          </div>
        </div>

        {/* Agregar nota manualmente + listado de notas guardadas */}
        <div className="col-12">
          <div className="border rounded-3 p-3">
            <h6 className="fw-bold mb-3">Agregar nota manualmente</h6>
            <p className="text-secondary small mb-2">
              Ingresa una nota manualmente para este estudiante. Se guardará
              directamente en el sistema.
            </p>

            {!showGradeForm ? (
              <button
                className="btn btn-primary"
                onClick={() => setShowGradeForm(true)}
              >
                Agregar nota manualmente
              </button>
            ) : (
              <form onSubmit={addGradeToBackend} className="row g-2">
                <div className="col-12 col-md-3">
                  <label className="form-label small">Código materia</label>
                  <input
                    name="codigo"
                    value={gradeForm.codigo}
                    onChange={onGradeChange}
                    className="form-control"
                  />
                </div>
                <div className="col-12 col-md-4">
                  <label className="form-label small">Materia</label>
                  <input
                    name="materia"
                    value={gradeForm.materia}
                    onChange={onGradeChange}
                    className="form-control"
                  />
                </div>
                <div className="col-6 col-md-2">
                  <label className="form-label small">Nota</label>
                  <input
                    name="nota"
                    value={gradeForm.nota}
                    onChange={onGradeChange}
                    type="number"
                    step="0.01"
                    className="form-control"
                  />
                </div>
                <div className="col-6 col-md-2">
                  <label className="form-label small">Año</label>
                  <input
                    name="year"
                    value={gradeForm.year}
                    onChange={onGradeChange}
                    className="form-control"
                  />
                </div>

                <div className="col-12 d-flex gap-2 mt-2">
                  <button type="submit" className="btn btn-success">
                    Guardar nota
                  </button>
                  <button
                    type="button"
                    className="btn btn-outline-secondary"
                    onClick={() => {
                      setShowGradeForm(false);
                      setGradeForm({
                        codigo: "",
                        materia: "",
                        nota: "",
                        year: "",
                      });
                    }}
                  >
                    Cerrar
                  </button>
                </div>
              </form>
            )}

            {/* ===== CONTENEDOR DE NOTAS GUARDADAS ===== */}
            <div className="mt-4">
              <h6 className="fw-bold mb-2">Notas guardadas</h6>
              {savedGrades.length === 0 ? (
                <p className="text-muted small mb-0">
                  Aún no hay notas guardadas para este estudiante.
                </p>
              ) : (
                <ul className="list-group">
                  {savedGrades.map((g) => (
                    <li
                      key={g.id}
                      className="list-group-item d-flex justify-content-between align-items-center"
                    >
                      <div>
                        <div>
                          <strong>{g.codigo}</strong> — {g.materia}
                        </div>
                        <div className="small text-secondary">
                          {g.year || "Año N/A"}
                        </div>
                      </div>

                      <div className="d-flex gap-2 align-items-center">
                        {editingGradeId === g.id ? (
                          <>
                            <input
                              type="number"
                              step="0.01"
                              className="form-control form-control-sm"
                              style={{ width: "90px" }}
                              value={editingGradeValue}
                              onChange={(e) =>
                                setEditingGradeValue(e.target.value)
                              }
                            />
                            <button
                              className="btn btn-sm btn-success"
                              onClick={() => saveEditedGrade(g)}
                            >
                              ✔
                            </button>
                            <button
                              className="btn btn-sm btn-outline-secondary"
                              onClick={cancelEditGrade}
                            >
                              ✖
                            </button>
                          </>
                        ) : (
                          <>
                            <span className="badge bg-secondary">
                              {g.nota}
                            </span>
                            <button
                              className="btn btn-sm btn-outline-primary"
                              onClick={() => startEditGrade(g)}
                            >
                              Editar
                            </button>
                          </>
                        )}

                        <button
                          className="btn btn-sm btn-outline-danger"
                          onClick={() => deleteGrade(g.id)}
                        >
                          Eliminar
                        </button>
                      </div>
                    </li>
                  ))}
                </ul>
              )}
            </div>
          </div>
        </div>
      </div>
    </DashboardLayout>
  );
}
