import { useState, useEffect } from "react"
import { useNavigate } from "react-router-dom"
import "../styles/ListedAllies.css"
import logo from "../assets/logo1.png"

export default function ListedSchools() {
  const [menuVisible, setMenuVisible] = useState(false)
  const toggleMenu = () => setMenuVisible(!menuVisible)

  useEffect(() => {
    const user = JSON.parse(localStorage.getItem("usuario"));
    if (user?.id) {
      fetch(`http://localhost:5000/api/matches/escuelas/${user.id}`)
        .then(res => res.json())
        .then(data => {
          setEscuelas(data);
        })
        .catch(err => console.error("Error cargando escuelas:", err));
    }
  }, []);
  

  const escuelas = [
    {
      id: 1,
      nombre: "Escuela 1",
      ubicacion: "Ciudad de México",
      imagen:
        "https://thumbs.dreamstime.com/b/dise%C3%B1o-de-icono-del-logotipo-libro-naranja-%C3%BAnico-con-color-moda-para-la-marca-empresa-175088599.jpg",
    },
    {
      id: 2,
      nombre: "Escuela 2",
      ubicacion: "Guadalajara",
      imagen:
        "https://thumbs.dreamstime.com/b/dise%C3%B1o-de-icono-del-logotipo-libro-naranja-%C3%BAnico-con-color-moda-para-la-marca-empresa-175088599.jpg",
    },
    {
      id: 3,
      nombre: "Escuela 3",
      ubicacion: "Monterrey",
      imagen:
        "https://thumbs.dreamstime.com/b/dise%C3%B1o-de-icono-del-logotipo-libro-naranja-%C3%BAnico-con-color-moda-para-la-marca-empresa-175088599.jpg",
    },
  ]

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
            {escuelas.map((escuela) => (
              <div
                key={escuela.id}
                className="listedallies-card"
                onClick={() => navigate(`/aliado/evidencia/${escuela.id}`)}
                style={{ cursor: "pointer" }}
              >
                <div className="listedallies-card-image">
                  <img src={escuela.imagen || "/placeholder.svg"} alt={escuela.nombre} />
                </div>
                <div className="listedallies-card-info">
                  <h2 className="listedallies-card-title">{escuela.nombre}</h2>
                  <div className="listedallies-card-location">
                    <span className="listedallies-location-icon">📍</span>
                    <span>{escuela.ubicacion}</span>
                  </div>
                  <button className="listedallies-message-button" onClick={(e) => e.stopPropagation()}>
                    <span className="listedallies-message-icon">💬</span>
                    <span>Enviar mensaje</span>
                  </button>
                </div>
              </div>
            ))}
          </div>
        </main>
      </div>
    </div>
  )
}
