import React, { useState } from "react";
import DashboardLayout from "../layouts/DashboardLayout";
import { Modal, Button, Form } from "react-bootstrap"; // Usa Bootstrap para los modales

export default function MentorAgenda() {
  // Datos simulados de backend
  const [agenda, setAgenda] = useState([
    {
      id: 1,
      fecha: "2025-10-23",
      hora: "19:00",
      con: "Santiago Herrera",
      tema: "Algoritmos recursivos",
      estado: "Agendada",
      observaciones: "Revisar tareas previas",
    },
    {
      id: 2,
      fecha: "2025-10-24",
      hora: "18:30",
      con: "María López",
      tema: "Normalización y SQL JOINs",
      estado: "Agendada",
      observaciones: "Enviar material de práctica",
    },
  ]);

  const [showDetails, setShowDetails] = useState(false);
  const [showReprogram, setShowReprogram] = useState(false);
  const [selected, setSelected] = useState(null);
  const [newDate, setNewDate] = useState("");
  const [newTime, setNewTime] = useState("");

  // Abrir modal de detalles
  const handleViewDetails = (item) => {
    setSelected(item);
    setShowDetails(true);
  };

  // Abrir modal de reprogramar
  const handleReprogram = (item) => {
    setSelected(item);
    setNewDate(item.fecha);
    setNewTime(item.hora);
    setShowReprogram(true);
  };

  // Guardar nueva fecha/hora
  const handleSaveReprogram = () => {
    if (!selected) return;
    setAgenda((prev) =>
      prev.map((a) =>
        a.id === selected.id
          ? { ...a, fecha: newDate, hora: newTime, estado: "Reprogramada" }
          : a
      )
    );
    setShowReprogram(false);
  };

  return (
    <DashboardLayout role="mentor" title="Agenda">
      <ul className="list-group">
        {agenda.map((a) => (
          <li
            key={a.id}
            className="list-group-item d-flex flex-column flex-md-row justify-content-between align-items-start align-items-md-center"
          >
            {/* Info principal */}
            <div className="me-md-3">
              <div className="fw-semibold">
                {a.fecha} · {a.hora}
              </div>
              <div className="small text-secondary">Con: {a.con}</div>
              <div className="small">{a.tema}</div>
            </div>

            {/* Acciones */}
            <div className="d-flex gap-2 mt-2 mt-md-0">
              <button
                className="btn btn-sm btn-outline-primary"
                onClick={() => handleViewDetails(a)}
              >
                Ver detalles
              </button>
              <button
                className="btn btn-sm btn-outline-secondary"
                onClick={() => handleReprogram(a)}
              >
                Reprogramar
              </button>
            </div>
          </li>
        ))}
      </ul>

      {/* MODAL DETALLES */}
      <Modal show={showDetails} onHide={() => setShowDetails(false)} centered>
        <Modal.Header closeButton>
          <Modal.Title>Detalles de la Mentoría</Modal.Title>
        </Modal.Header>
        <Modal.Body>
          {selected && (
            <>
              <p>
                <strong>Estudiante:</strong> {selected.con}
              </p>
              <p>
                <strong>Tema:</strong> {selected.tema}
              </p>
              <p>
                <strong>Fecha:</strong> {selected.fecha}
              </p>
              <p>
                <strong>Hora:</strong> {selected.hora}
              </p>
              <p>
                <strong>Estado:</strong>{" "}
                <span
                  className={`badge ${
                    selected.estado === "Reprogramada"
                      ? "text-bg-warning"
                      : "text-bg-success"
                  }`}
                >
                  {selected.estado}
                </span>
              </p>
              <p>
                <strong>Observaciones:</strong> {selected.observaciones}
              </p>
            </>
          )}
        </Modal.Body>
        <Modal.Footer>
          <Button variant="secondary" onClick={() => setShowDetails(false)}>
            Cerrar
          </Button>
        </Modal.Footer>
      </Modal>

      {/* MODAL REPROGRAMAR */}
      <Modal show={showReprogram} onHide={() => setShowReprogram(false)} centered>
        <Modal.Header closeButton>
          <Modal.Title>Reprogramar Mentoría</Modal.Title>
        </Modal.Header>
        <Modal.Body>
          {selected && (
            <>
              <Form.Group className="mb-3">
                <Form.Label>Fecha</Form.Label>
                <Form.Control
                  type="date"
                  value={newDate}
                  onChange={(e) => setNewDate(e.target.value)}
                />
              </Form.Group>

              <Form.Group className="mb-3">
                <Form.Label>Hora</Form.Label>
                <Form.Control
                  type="time"
                  value={newTime}
                  onChange={(e) => setNewTime(e.target.value)}
                />
              </Form.Group>
            </>
          )}
        </Modal.Body>
        <Modal.Footer>
          <Button variant="secondary" onClick={() => setShowReprogram(false)}>
            Cancelar
          </Button>
          <Button variant="primary" onClick={handleSaveReprogram}>
            Guardar cambios
          </Button>
        </Modal.Footer>
      </Modal>
    </DashboardLayout>
  );
}
