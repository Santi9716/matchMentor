import { useEffect, useState } from "react";
import DashboardLayout from "../layouts/DashboardLayout";
import ProfileSideBar from "../components/ProfileSideBar";

export default function StudentProfilePage() {
  // TODO: reemplaza esto con el id real del usuario logueado
  const userId = 1;

  const [studentInfo, setStudentInfo] = useState({
    id: userId,
    name: "",
    email: "",
    program: "",
    semester: "",
    city: "",
  });

  const [editing, setEditing] = useState(false);
  const [temp, setTemp] = useState(studentInfo);

  // Esto lo puedes reemplazar más adelante con datos reales calculados
  const [stats] = useState({
    promedio: 3.8,
    aprobadas: 22,
    reprobadas: 4,
    sesionesMentoria: 5,
  });

  // 1. Cargar información inicial desde el backend
  useEffect(() => {
    const fetchInfo = async () => {
      try {
        const resp = await fetch(`http://localhost:8080/students/${userId}/full-info`);
        if (!resp.ok) {
          console.error("Error GET full-info:", resp.status);
          alert("No pude cargar la información del estudiante.");
          return;
        }

        const data = await resp.json();
        console.log("GET /full-info ->", data);

        // Adaptamos del backend al estado del front
        const uiData = {
          id: data.id,
          name: data.name,
          email: data.email,
          city: data.city,
          program: data.programa,    // viene como 'programa'
          semester: data.semestre,  // viene como 'semestre'
        };

        setStudentInfo(uiData);
        setTemp(uiData); // para que el modo edición arranque con lo mismo
      } catch (err) {
        console.error("Fallo de red al cargar info:", err);
        alert("Error de conexión con el servidor.");
      }
    };

    fetchInfo();
  }, [userId]);

  // 2. Entrar en modo edición
  const startEdit = () => {
    setTemp(studentInfo);
    setEditing(true);
  };

  // 3. Cancelar edición
  const cancelEdit = () => {
    setTemp(studentInfo);
    setEditing(false);
  };

  // 4. Guardar cambios (PUT al back)
  const saveEdit = async () => {
    if (!temp.name.trim() || !temp.email.trim()) {
        alert("Nombre y email son obligatorios");
        return;
    }

    try {
      // IMPORTANTE:
      // El backend espera "programa" y "semestre", NO "program" y "semester".
      const payload = {
        name: temp.name,
        email: temp.email,
        city: temp.city,
        programa: temp.program,
        semestre: temp.semester,
      };

      const resp = await fetch(`http://localhost:8080/students/${studentInfo.id}/full-info`, {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(payload),
      });

      if (!resp.ok) {
        const errorText = await resp.text();
        console.error("Error del backend:", resp.status, errorText);
        alert("No se pudo actualizar la información del estudiante. (" + resp.status + ")");
        return;
      }

      // Si tu backend devuelve solo un mensaje OK (string), puedes ignorar:
      // const updated = await resp.json();

      // Refrescamos el estado local con lo que el usuario editó
      setStudentInfo({ ...temp });
      setEditing(false);
      alert("Información actualizada ✅");
    } catch (err) {
      console.error("Fallo de red:", err);
      alert("Error de conexión con el servidor.");
    }
  };

  // 5. Manejador inputs edición
  const onChange = (e) => {
    const { name, value } = e.target;
    setTemp(prev => ({ ...prev, [name]: value }));
  };

  return (
    <DashboardLayout role="student" title="Mi Perfil (Estudiante)">
      <div className="row g-3">

        <div className="col-12 col-md-3">
          {/* Avatar-only sidebar with overlay */}
          <ProfileSideBar
            user={studentInfo}
            showDetails={false}
            size={96}
            overlay={true}
          />
        </div>

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
                <div className="mb-2">{studentInfo.program}</div>

                <div className="small text-secondary">Semestre</div>
                <div className="mb-2">{studentInfo.semester}</div>

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
                    name="program"
                    value={temp.program || ""}
                    onChange={onChange}
                  />
                </div>

                <div className="mb-2">
                  <label className="form-label small">Semestre</label>
                  <input
                    className="form-control"
                    name="semester"
                    value={temp.semester || ""}
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

        <div className="col-12 col-md-3">
          <div className="border rounded-3 p-3 h-100">
            <h6 className="fw-bold mb-3">Resumen académico</h6>
            <ul className="list-unstyled mb-0">
              <li className="d-flex justify-content-between">
                <span>Promedio general:</span>
                <strong>{stats.promedio}</strong>
              </li>
              <li className="d-flex justify-content-between">
                <span>Materias aprobadas:</span>
                <strong>{stats.aprobadas}</strong>
              </li>
              <li className="d-flex justify-content-between">
                <span>Materias reprobadas:</span>
                <strong className="text-danger">{stats.reprobadas}</strong>
              </li>
              <li className="d-flex justify-content-between">
                <span>Sesiones de mentoría tomadas:</span>
                <strong>{stats.sesionesMentoria}</strong>
              </li>
            </ul>
          </div>
        </div>

        <div className="col-12">
          <div className="border rounded-3 p-3">
            <h6 className="fw-bold mb-3">Subir notas (CSV)</h6>
            <p className="text-secondary small mb-2">
              Sube tu archivo .csv con tus calificaciones para actualizar tu rendimiento.
            </p>
            <div className="input-group">
              <input type="file" className="form-control" accept=".csv" />
              <button className="btn btn-primary">Cargar</button>
            </div>
            <div className="form-text">
              Formato esperado: estudiante_id, materia, nota, fecha
            </div>
          </div>
        </div>
      </div>
    </DashboardLayout>
  );
}
