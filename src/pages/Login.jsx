import React, { useState } from "react";
import { useNavigate, Link } from "react-router-dom";

export default function Login() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [backendError, setBackendError] = useState(null);
  const [attemptInfo, setAttemptInfo] = useState(null); // {attempts, maxAttempts}
  const [blocked, setBlocked] = useState(false);
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();

    // limpiar mensajes anteriores
    setBackendError(null);

    // payload que espera el back
    const payload = { email, password };

    try {
      const resp = await fetch("http://localhost:8080/login/login", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(payload),
      });

      // puede que el back devuelva texto o json, intentamos json primero
      let data = null;
      try {
        data = await resp.json();
      } catch (err) {
        data = null;
      }

      // ---- SI FALLA ----
      if (!resp.ok) {
        // si el back dijo que está bloqueado
        if (data && data.locked) {
          setBlocked(true);
          setBackendError(
            data.error ||
              "Has superado el número máximo de intentos. Intenta más tarde."
          );
          return;
        }

        // si el back mandó intento actual
        if (data && data.attempts) {
          setAttemptInfo({
            attempts: data.attempts,
            max: data.maxAttempts || 3,
          });
          setBackendError(
            data.error ||
              `Credenciales incorrectas. Intento ${data.attempts} de ${
                data.maxAttempts || 3
              }`
          );
        } else {
          setBackendError(
            (data && data.error) ||
              "Credenciales incorrectas o error en el servidor."
          );
        }
        return;
      }

      // ---- SI FUNCIONA ----
      // limpiar estados de error
      setBackendError(null);
      setAttemptInfo(null);
      setBlocked(false);

      // extraer datos del back
      const token =
        data.token || data.accessToken || data.authToken || "demo_token";
      const userId =
        data.userId || data.id || (data.user && data.user.id) || null;

      let roleRaw = null;
      if (data.role) roleRaw = data.role;
      else if (data.roles && Array.isArray(data.roles) && data.roles.length)
        roleRaw = data.roles[0];
      else if (data.user && data.user.role) roleRaw = data.user.role;

      const roleNormalized = roleRaw
        ? String(roleRaw).toLowerCase().replace(/[^a-z]/g, "")
        : null;

      // guardar en localStorage
      localStorage.setItem("authToken", token);
      if (userId) {
        localStorage.setItem("userId", userId);
      }

      const finalRole =
        roleNormalized === "mentor"
          ? "mentor"
          : roleNormalized === "admin"
          ? "admin"
          : "student";

      localStorage.setItem("role", finalRole);

      // redirigir
      const target =
        finalRole === "mentor"
          ? "/mentor/profile"
          : finalRole === "admin"
          ? "/admin/dashboard"
          : "/student/profile";

      navigate(target);
    } catch (err) {
      console.error("Error conexión login:", err);
      setBackendError("No se pudo conectar al servidor.");
      // aquí NO contamos intentos, porque el back es quien los cuenta ahora
    }
  };

  return (
    <div className="container py-5">
      <div className="row justify-content-center">
        <div className="col-12 col-md-6 col-lg-5">
          <div className="w3-card w3-white rounded-3 p-4">
            <h3 className="mb-3 text-center">Iniciar Sesión</h3>

            {/* Mensaje de error del backend */}
            {backendError && (
              <div className="alert alert-danger py-2 mb-3">
                {backendError}
              </div>
            )}

            {/* Info de intentos */}
            {attemptInfo && !blocked && (
              <p className="text-center text-muted small mb-3">
                Intento {attemptInfo.attempts} de {attemptInfo.max}
              </p>
            )}

            {blocked && (
              <div className="alert alert-warning py-2 mb-3">
                Tu cuenta está temporalmente bloqueada por intentos fallidos.
              </div>
            )}

            <form onSubmit={handleSubmit} className="vstack gap-3">
              <div>
                <label htmlFor="email" className="form-label">
                  Correo Electrónico
                </label>
                <input
                  id="email"
                  type="email"
                  className="form-control"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  placeholder="tu@correo.com"
                  required
                  disabled={blocked}
                />
              </div>

              <div>
                <label htmlFor="password" className="form-label">
                  Contraseña
                </label>
                <input
                  id="password"
                  type="password"
                  className="form-control"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  placeholder="••••••••"
                  required
                  disabled={blocked}
                />
              </div>

              <button
                type="submit"
                className="btn btn-primary w-100"
                disabled={blocked}
              >
                {blocked ? "Bloqueado" : "Iniciar Sesión"}
              </button>

              <div className="text-center small">
                ¿No tienes una cuenta? <Link to="/register">Regístrate</Link>
              </div>
            </form>
          </div>
        </div>
      </div>
    </div>
  );
}
