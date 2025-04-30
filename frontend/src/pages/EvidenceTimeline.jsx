import { useState, useEffect } from "react";
import { useAuth } from "../contexts/AuthContext";
import { useNavigate, useParams, useLocation } from "react-router-dom";
import "../styles/EvidenceTimeline.css";
import logo from "../assets/logo1.png";

export default function EvidenceTimeline() {
  const { userType } = useAuth();
  const modoSoloLectura = userType === "administrador";
  const [menuVisible, setMenuVisible] = useState(false);
  const [evidences, setEvidences] = useState([
    { file: null, date: null, description: "" },
    { file: null, date: null, description: "" },
    { file: null, date: null, description: "" },
    { file: null, date: null, description: "" },
  ]);
  const [proyectos, setProyectos] = useState([]);
  const [proyectoActual, setProyectoActual] = useState(null);

  const toggleMenu = () => setMenuVisible(!menuVisible);
  const navigate = useNavigate();
  const { id } = useParams();
  const location = useLocation();
  const { CCT } = location.state || {};

  const handleFileUpload = async (index, event) => {
    const file = event.target.files[0];
    if (!file) return;

    const token = localStorage.getItem("token");
    const formData = new FormData();
    formData.append("archivo", file);
    formData.append("tipo", "escuela");
    formData.append("matchId", id);
    formData.append("descripcion", evidences[index].description || "");

    try {
      const res = await fetch("http://localhost:5000/api/evidence/upload", {
        method: "POST",
        headers: {
          Authorization: `Bearer ${token}`,
        },
        body: formData,
      });

      const data = await res.json();

      if (res.ok) {
        const updated = [...evidences];
        updated[index].file = data.url;
        updated[index].date = new Date().toLocaleDateString();
        updated[index].reporteAvanceId = data.reporteAvanceId;
        setEvidences(updated);
      } else {
        console.error("Error al subir archivo:", data.reason || data.error);
      }
    } catch (error) {
      console.error("Error al subir evidencia:", error);
    }
  };

  const handleDescriptionChange = (index, value) => {
    const updated = [...evidences];
    updated[index].description = value;
    setEvidences(updated);
  };

  const handleSaveDescription = async (index) => {
    const token = localStorage.getItem("token");
    const evidencia = evidences[index];

    if (!evidencia.reporteAvanceId) {
      console.error("No se puede guardar la descripción: falta reporteAvanceId");
      return;
    }

    try {
      const res = await fetch(`http://localhost:5000/api/evidence/reporte/${evidencia.reporteAvanceId}`, {
        method: "PATCH",
        headers: {
          Authorization: `Bearer ${token}`,
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ descripcion: evidencia.description }),
      });

      const data = await res.json();

      if (res.ok) {
        console.log("Descripción guardada correctamente:", data.message);
      } else {
        console.error("Error al guardar descripción:", data.reason || data.error);
      }
    } catch (error) {
      console.error("Error al guardar descripción:", error);
    }
  };

  useEffect(() => {
    const token = localStorage.getItem("token");

    const cargarProyectos = async () => {
      try {
        let url = "";

        if (userType === "aliado") {
          url = "http://localhost:5000/api/mis-conexiones";
        } else if (userType === "escuela") {
          url = "http://localhost:5000/api/escuela/mis-conexiones";
        } else {
          return;
        }

        const res = await fetch(url, {
          headers: { Authorization: `Bearer ${token}` },
        });

        const data = await res.json();
        const proyectosFiltrados = [];
        const conexionIdsVistos = new Set();

        data.forEach((conexion) => {
          if (!conexionIdsVistos.has(conexion.conexionId)) {
            proyectosFiltrados.push({
              conexionId: conexion.conexionId,
              necesidad:
                userType === "escuela"
                  ? conexion.nombreNecesidad || "Proyecto"
                  : conexion.apoyo || conexion.necesidad || "Proyecto",
            });
            conexionIdsVistos.add(conexion.conexionId);
          }
        });

        setProyectos(proyectosFiltrados);

        const actual = proyectosFiltrados.find((p) => p.conexionId === id) || null;
        setProyectoActual(actual);
      } catch (error) {
        console.error("Error cargando proyectos:", error);
      }
    };

    const cargarEvidencias = async () => {
      try {
        const res = await fetch(`http://localhost:5000/api/evidence/progreso/${id}`, {
          headers: { Authorization: `Bearer ${token}` },
        });

        const evidenciasCargadas = await res.json();
        let formatted = [];

        if (Array.isArray(evidenciasCargadas) && evidenciasCargadas.length > 0) {
          formatted = evidenciasCargadas.map((evi) => ({
            file: evi.ruta,
            date: new Date(evi.fecha).toLocaleDateString(),
            description: evi.descripcion,
            reporteAvanceId: evi.reporteAvanceId,
          }));
        }

        while (formatted.length < 4) {
          formatted.push({ file: null, date: null, description: "" });
        }

        setEvidences(formatted);
      } catch (error) {
        console.error("Error cargando evidencias:", error);
      }
    };

    cargarProyectos();
    cargarEvidencias();
  }, [id, userType]);

  return (
    <div className="evidence-container">
      <header className="evidence-header">
        <button className="evidence-menu-button" onClick={toggleMenu}>
          &#9776;
        </button>
        <img src={logo || "/placeholder.svg"} alt="Logo" className="evidence-logo" />
      </header>

      <div className={`evidence-main-layout ${menuVisible ? "menu-visible" : ""}`}>
        {/* Menú lateral solo si NO es administrador */}
        {!modoSoloLectura && (
          <nav className={`evidence-sidebar ${!menuVisible ? "hidden" : ""}`}>
            <ul className="evidence-menu-list">
              {userType === "aliado" ? (
                <>
                  <li className="evidence-menu-item" onClick={() => navigate("/aliado/perfil")}>Perfil</li>
                  <li className="evidence-menu-item" onClick={() => navigate("/aliado/mapa")}>Buscar escuelas</li>
                  <li className="evidence-menu-item" onClick={() => navigate("/listado/escuelas")}>Mis escuelas</li>
                </>
              ) : (
                <>
                  <li className="evidence-menu-item" onClick={() => navigate("/escuela/perfil")}>Perfil</li>
                  <li className="evidence-menu-item" onClick={() => navigate("/listado/aliados")}>Mis aliados</li>
                </>
              )}
              <li className="evidence-menu-item" onClick={() => navigate("/logout")}>Cerrar sesión</li>
            </ul>
            <h4 className="evidence-subtitle">Proyectos</h4>
            <ul className="evidence-menu-list">
              {proyectos.map((proyecto, idx) => (
                <li
                  key={idx}
                  className="evidence-menu-item"
                  onClick={() =>
                    navigate(`/evidencia/${proyecto.conexionId}`, {
                      state: { CCT: CCT },
                    })
                  }
                >
                  {proyecto.necesidad}
                </li>
              ))}
            </ul>
          </nav>
        )}

        <main className="evidence-main-content">
          <div className="evidence-content-wrapper">
            <div className="evidence-page-header">
              <h1 className="evidence-profile-title">
                {proyectoActual ? `Progreso de: ${proyectoActual.necesidad}` : "Progreso del apoyo"}
              </h1>
              <h3 className="evidence-timeline-subtitle">Sube tu evidencia con una descripción correspondiente</h3>
            </div>

            <div className="evidence-timeline-container">
              <div className="evidence-timeline-line"></div>

              {evidences.map((evidence, i) => (
                <div key={i} className="evidence-timeline-step">
                  {evidence.file ? (
                    <a
                      href={evidence.file}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="evidence-upload-circle"
                      style={{
                        borderColor: ["#c62828", "#fbc02d", "#0288d1", "#1a237e"][i],
                      }}
                    >
                      <span className="evidence-upload-icon">✅</span>
                    </a>
                  ) : !modoSoloLectura ? (
                    <>
                      <label
                        htmlFor={`upload-${i}`}
                        className="evidence-upload-circle"
                        style={{
                          borderColor: ["#c62828", "#fbc02d", "#0288d1", "#1a237e"][i],
                        }}
                      >
                        <span className="evidence-upload-icon">⬆️</span>
                      </label>
                      <input
                        id={`upload-${i}`}
                        type="file"
                        className="evidence-hidden-input"
                        onChange={(e) => handleFileUpload(i, e)}
                      />
                    </>
                  ) : (
                    <div
                      className="evidence-upload-circle"
                      style={{
                        borderColor: ["#c62828", "#fbc02d", "#0288d1", "#1a237e"][i],
                        opacity: 0.5,
                        cursor: "not-allowed",
                      }}
                    >
                      <span className="evidence-upload-icon">🔒</span>
                    </div>
                  )}

                  <div className="evidence-upload-date">
                    {evidence.date ? evidence.date : "FECHA"}
                  </div>

                  <textarea
                    className="evidence-description-box"
                    placeholder="Escribe tu descripción aquí..."
                    value={evidence.description}
                    onChange={(e) => handleDescriptionChange(i, e.target.value)}
                    rows={3}
                    disabled={modoSoloLectura}
                  />

                  {!modoSoloLectura && (
                    <button
                      onClick={() => handleSaveDescription(i)}
                      className="save-description-button"
                    >
                      Guardar
                    </button>
                  )}
                </div>
              ))}
            </div>
          </div>
        </main>
      </div>
    </div>
  );
}
