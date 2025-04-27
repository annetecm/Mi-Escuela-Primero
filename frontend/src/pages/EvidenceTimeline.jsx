import { useState, useEffect } from "react";
import { useNavigate, useParams, useLocation } from "react-router-dom"; // agregamos useLocation
import "../styles/EvidenceTimeline.css";
import logo from "../assets/logo1.png";

export default function EvidenceTimeline() {
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
  const { id } = useParams(); // conexionId actual
  const location = useLocation();
  const { CCT } = location.state || {}; // obtenemos CCT

  const handleFileUpload = async (index, event) => {
    const file = event.target.files[0];
    if (!file) return;
  
    const token = localStorage.getItem("token");
  
    const formData = new FormData();
    formData.append("archivo", file);
    formData.append("tipo", "escuela");
    formData.append("matchId", id);
  
    try {
      const res = await fetch("http://localhost:5000/api/evidence/upload", {
        method: "POST",
        headers: {
          "Authorization": `Bearer ${token}`
        },
        body: formData,
      });
  
      const data = await res.json();
  
      if (res.ok) {
        const updated = [...evidences];
        updated[index].file = data.url; // 🔥 Usamos la URL que regresa el servidor
        updated[index].date = new Date().toLocaleDateString();
        updated[index].description = ""; // Podrías manejar descripción después si quieres
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

  useEffect(() => {
    const token = localStorage.getItem("token");
  
    // Cargar evidencias del progreso
    fetch(`http://localhost:5000/api/evidence/progreso/${id}`, {
      method: "GET",
      headers: {
        "Authorization": `Bearer ${token}`,
        "Content-Type": "application/json"
      }
    })
    .then(async res => {
      if (!res.ok) {
        const errorText = await res.text();
        throw new Error(`Error ${res.status}: ${errorText}`);
      }
      return res.json();
    })
    .then(evidenciasCargadas => {
      if (Array.isArray(evidenciasCargadas) && evidenciasCargadas.length > 0) {
        const formatted = evidenciasCargadas.map(evi => ({
          file: evi.ruta,
          date: new Date(evi.fecha).toLocaleDateString(),
          description: evi.descripcion
        }));
        setEvidences(formatted);
      }
    })
    .catch(err => console.error("❌ Error cargando evidencias:", err));  

    fetch("http://localhost:5000/api/mis-conexiones", {
      headers: { Authorization: `Bearer ${token}` }
    })
      .then(res => res.json())
      .then(data => {
        if (!CCT) {
          console.error("No se proporcionó el CCT al navegar.");
          return;
        }

        const filtrados = data.filter(conexion => conexion.CCT === CCT);
  
        const necesidadesVistas = new Set();
        const proyectosFinal = [];
  
        filtrados.forEach(conexion => {
          if (!necesidadesVistas.has(conexion.necesidad)) {
            proyectosFinal.push({
              necesidad: conexion.necesidad,
              conexionId: conexion.conexionId
            });
            necesidadesVistas.add(conexion.necesidad);
          }
        });
  
        setProyectos(proyectosFinal);
  
        const actual = proyectosFinal.find(p => p.conexionId === id) || null;
        setProyectoActual(actual);
      })
      .catch(err => console.error("Error cargando proyectos:", err));
  
  }, [id, CCT]);  

  return (
    <div className="evidence-container">
      <header className="evidence-header">
        <button className="evidence-menu-button" onClick={toggleMenu}>
          &#9776;
        </button>
        <img src={logo || "/placeholder.svg"} alt="Logo" className="evidence-logo" />
      </header>

      <div className={`evidence-main-layout ${menuVisible ? 'menu-visible' : ''}`}>
        <nav className={`evidence-sidebar ${!menuVisible ? 'hidden' : ''}`}>
          <ul className="evidence-menu-list">
            <li className="evidence-menu-item" onClick={() => navigate("/aliado/perfil")}>
              Perfil
            </li>
            <li className="evidence-menu-item" onClick={() => navigate("/aliado/mapa")}>
              Buscar escuelas
            </li>
            <li className="evidence-menu-item" onClick={() => navigate("/listado/escuelas")}>
              Mis escuelas
            </li>
            <li className="evidence-menu-item" onClick={() => navigate("/logout")}>
              Cerrar sesión
            </li>
          </ul>

          <h4 className="evidence-subtitle">Proyectos</h4>
          <ul className="evidence-menu-list">
            {proyectos.map((proyecto, idx) => (
              <li 
                key={idx}
                className="evidence-menu-item"
                onClick={() => navigate(`/evidencia/${proyecto.conexionId}`, {
                  state: { CCT: CCT } // 🔥 pasar CCT de nuevo
                })}
              >
                {proyecto.necesidad}
              </li>
            ))}
          </ul>
        </nav>

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
                  ) : (
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
                  )}
                  <div className="evidence-upload-date">{evidence.date ? evidence.date : "FECHA"}</div>

                  {evidence.file && (
                    <textarea
                      className="evidence-description-box"
                      placeholder="Descripción..."
                      value={evidence.description}
                      onChange={(e) => handleDescriptionChange(i, e.target.value)}
                      rows={3}
                    />
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
