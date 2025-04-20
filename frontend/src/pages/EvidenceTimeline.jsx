import { useState } from "react";
import "../styles/EvidenceTimeline.css";
import logo from "../assets/logo1.png";

export default function EvidenceTimeline() {
  const [menuVisible, setMenuVisible] = useState(false)
  const [evidences, setEvidences] = useState([
    { file: null, date: null, description: "" },
    { file: null, date: null, description: "" },
    { file: null, date: null, description: "" },
    { file: null, date: null, description: "" },
  ])

  const toggleMenu = () => setMenuVisible(!menuVisible)

  const handleFileUpload = async (index, event) => {
    const file = event.target.files[0];
    if (!file) return;
  
    const formData = new FormData();
    formData.append("file", file);
    formData.append("description", evidences[index].description);
  
    const res = await fetch("http://localhost:5000/api/upload", {
      method: "POST",
      body: formData,
    });
  
    const data = await res.json();
  
    if (data.url) {
      const updated = [...evidences];
      updated[index].file = data.url;
      updated[index].date = new Date().toLocaleDateString();
      setEvidences(updated);
    } else {
      console.error("Error al subir archivo:", data.error);
    }
  };  

  const handleDescriptionChange = (index, value) => {
    const updated = [...evidences]
    updated[index].description = value
    setEvidences(updated)
  }

  return (
    <div className="app-container">
      <header className="header">
        <button className="menu-button" onClick={toggleMenu}>
          &#9776;
        </button>
        <img src={logo || "/placeholder.svg"} alt="Logo" className="logo" />
      </header>

      <div className="main-content">
        {menuVisible && (
          <nav className="sidebar-mini">
            <ul className="sidebar-menu">
              <li className="sidebar-item">Perfil</li>
              <li className="sidebar-item">Mis Aliados</li>
            </ul>
          </nav>
        )}

        <main className="content">
          <div className="page-header">
            <h1 className="profile-title">Progreso del apoyo</h1>
            <h3 className="timeline-subtitle">Sube tu evidencia con una descripción correspondiente</h3>
          </div>

          <div className="timeline-container">
            <div className="timeline-line"></div>

            {evidences.map((evidence, i) => (
            <div key={i} className="timeline-step">
              {evidence.file ? (
                <a
                  href={evidence.file}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="upload-circle"
                  style={{
                    borderColor: ["#c62828", "#fbc02d", "#0288d1", "#1a237e"][i],
                  }}
                >
                  <span className="upload-icon">✅</span>
                </a>
              ) : (
                <>
                  <label
                    htmlFor={`upload-${i}`}
                    className="upload-circle"
                    style={{
                      borderColor: ["#c62828", "#fbc02d", "#0288d1", "#1a237e"][i],
                    }}
                  >
                    <span className="upload-icon">⬆️</span>
                  </label>
                  <input
                    id={`upload-${i}`}
                    type="file"
                    className="hidden-input"
                    onChange={(e) => handleFileUpload(i, e)}
                  />
                </>
              )}
                <div className="upload-date">{evidence.date ? evidence.date : "FECHA"}</div>

                {evidence.file && (
                  <textarea
                    className="description-box"
                    placeholder="Descripción..."
                    value={evidence.description}
                    onChange={(e) => handleDescriptionChange(i, e.target.value)}
                    rows={3}
                  />
                )}
              </div>
            ))}
          </div>
        </main>
      </div>
    </div>
  )
}
