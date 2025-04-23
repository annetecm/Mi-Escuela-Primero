import { useState } from "react"
import { useNavigate } from "react-router-dom"
import { useParams } from "react-router-dom"
import "../styles/EvidenceTimeline.css"
import logo from "../assets/logo1.png"

export default function EvidenceTimeline() {
  const [menuVisible, setMenuVisible] = useState(false)
  const [evidences, setEvidences] = useState([
    { file: null, date: null, description: "" },
    { file: null, date: null, description: "" },
    { file: null, date: null, description: "" },
    { file: null, date: null, description: "" },
  ])

  const toggleMenu = () => setMenuVisible(!menuVisible)
  const navigate = useNavigate()
  const { id } = useParams()

  const handleFileUpload = async (index, event) => {
    const file = event.target.files[0]
    if (!file) return

    const formData = new FormData()
    formData.append("archivo", file)
    formData.append("tipo", "escuela")
    formData.append("matchId", "match789")

    const res = await fetch("http://localhost:5000/api/evidence/upload", {
      method: "POST",
      body: formData,
    })

    const data = await res.json()

    if (res.ok) {
      const updated = [...evidences]
      updated[index].file = URL.createObjectURL(file) // o usa una URL desde backend si la regresas
      updated[index].date = new Date().toLocaleDateString()
      setEvidences(updated)
    } else {
      console.error("Error al subir archivo:", data.reason || data.error)
    }
  }

  const handleDescriptionChange = (index, value) => {
    const updated = [...evidences]
    updated[index].description = value
    setEvidences(updated)
  }

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
        </nav>

        <main className="evidence-main-content">
          <div className="evidence-content-wrapper">
            <div className="evidence-page-header">
              <h1 className="evidence-profile-title">Progreso del apoyo</h1>
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
  )
}
