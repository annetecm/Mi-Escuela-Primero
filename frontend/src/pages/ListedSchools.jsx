import { useState, useEffect } from "react"
import { useNavigate } from "react-router-dom"
import "../styles/ListedAllies.css"
import logo from "../assets/logo1.png"

export default function ListedSchools() {
  const [menuVisible, setMenuVisible] = useState(false)
  const toggleMenu = () => setMenuVisible(!menuVisible)

  useEffect(() => {
    const token = localStorage.getItem("token");
  
    fetch("http://localhost:5000/api/mis-conexiones", {
      headers: { Authorization: `Bearer ${token}` }
    })
      .then(res => res.json())
      .then(data => {
        setEscuelas(data);
      })
      .catch(err => console.error("Error cargando conexiones:", err));
  }, []);

  const navigate = useNavigate()

  return (
    <div className="listedallies-container">
      {/* Barra superior */}
      <header className="listedallies-header">
        <button className="listedallies-menu-button" onClick={toggleMenu}>
          &#9776;
        </button>
        <img src={logo || "/placeholder.svg"} alt="Logo" className="listedallies-logo" />
      </header>

      <div className={`listedallies-main-content ${menuVisible ? "menu-visible" : ""}`}>
        {/* Menú lateral */}
        {menuVisible && (
          <nav className="listedallies-sidebar">
            <ul>
              <li onClick={() => navigate("/aliado/perfil")}>Perfil</li>
              <li onClick={() => navigate("/aliado/mapa")}>Buscar escuelas</li>
              <li onClick={() => navigate("/listado/escuelas")}>Mis escuelas</li>
              <li onClick={() => navigate("/logout")}>Cerrar sesión</li>
            </ul>
          </nav>
        )}

        {/* Contenido principal */}
        <main className="listedallies-content">
          <h1 className="listedallies-title">Mis Escuelas</h1>

          <div className="listedallies-cards-container">
          {escuelas.map((conexion) => (
          <div
            key={conexion.conexionId}
            className="listedallies-card"
            onClick={() => navigate(`/evidencia/${conexion.conexionId}`)}
            style={{ cursor: "pointer" }}
          >
            <div className="listedallies-card-image">
              <img
                src="https://thumbs.dreamstime.com/b/dise%C3%B1o-de-icono-del-logotipo-libro-naranja-%C3%BAnico-con-color-moda-para-la-marca-empresa-175088599.jpg"
                alt={conexion.nombreEscuela}
              />
            </div>
            <div className="listedallies-card-info">
              <h2 className="listedallies-card-title">{conexion.nombreEscuela}</h2>
              <div className="listedallies-card-location">
                <span className="listedallies-location-icon">📍</span>
                <span>{conexion.necesidad}</span> {/* ← Aquí pones la necesidad */}
              </div>
            </div>
          </div>
          ))}
          </div>
        </main>
      </div>
    </div>
  )
}
