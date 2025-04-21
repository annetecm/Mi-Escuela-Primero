import { useState } from "react"
import "../styles/ListedAllies.css"
import logo from "../assets/logo1.png"

export default function ListedSchools() {
  const [menuVisible, setMenuVisible] = useState(false)
  const toggleMenu = () => setMenuVisible(!menuVisible)

  const escuelas = [
    {
      id: 1,
      nombre: "Escuela 1",
      ubicacion: "Ciudad de México",
      imagen: "https://thumbs.dreamstime.com/b/dise%C3%B1o-de-icono-del-logotipo-libro-naranja-%C3%BAnico-con-color-moda-para-la-marca-empresa-175088599.jpg",
    },
    {
      id: 2,
      nombre: "Escuela 2",
      ubicacion: "Guadalajara",
      imagen: "https://thumbs.dreamstime.com/b/dise%C3%B1o-de-icono-del-logotipo-libro-naranja-%C3%BAnico-con-color-moda-para-la-marca-empresa-175088599.jpg",
    },
    {
      id: 3,
      nombre: "Escuela 3",
      ubicacion: "Monterrey",
      imagen: "https://thumbs.dreamstime.com/b/dise%C3%B1o-de-icono-del-logotipo-libro-naranja-%C3%BAnico-con-color-moda-para-la-marca-empresa-175088599.jpg",
    },
  ]

  return (
    <div className="app-container">
      {/* Barra superior */}
      <header className="header">
        <button className="menu-button" onClick={toggleMenu}>
          &#9776;
        </button>
        <img src={logo || "/placeholder.svg"} alt="Logo" className="logo" />
      </header>

      <div className="main-content">
        {/* Menú lateral */}
        {menuVisible && (
          <nav className="sidebar">
            <ul>
              <li>Perfil</li>
              <li>Buscar escuelas</li>
              <li>Mis escuelas</li>
              <li>Cerrar sesión</li>
            </ul>
          </nav>
        )}

        {/* Contenido principal */}
        <main className="content">
          <h1 className="title">Mis Escuelas</h1>

          <div className="cards-container">
            {escuelas.map((escuela) => (
              <div key={escuela.id} className="card">
                <div className="card-image">
                <img src={escuela.imagen} alt={escuela.nombre} />
                </div>
                <div className="card-info">
                  <h2 className="card-title">{escuela.nombre}</h2>
                  <div className="card-location">
                    <span className="location-icon">📍</span>
                    <span>{escuela.ubicacion}</span>
                  </div>
                  <button className="message-button">
                    <span className="message-icon">💬</span>
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
