import { useState } from "react";
import { useNavigate } from "react-router-dom";
import "../styles/ListedAllies.css";
import logo from "../assets/logo1.png";

export default function ListedAllies() {
  const [menuVisible, setMenuVisible] = useState(false)
  const toggleMenu = () => setMenuVisible(!menuVisible)
  const navigate = useNavigate()

  // Datos de ejemplo para los aliados
  const aliados = [
    {
      id: 1,
      nombre: "Aliado 1",
      ubicacion: "Ciudad de México",
      imagen: "https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcQqQ__tb8atsMkS3ofDqudycyF1UzS3hyDyFQ&s",
    },
    {
      id: 2,
      nombre: "Aliado 2",
      ubicacion: "Guadalajara",
      imagen: "https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcQqQ__tb8atsMkS3ofDqudycyF1UzS3hyDyFQ&s",
    },
    {
      id: 3,
      nombre: "Aliado 3",
      ubicacion: "Monterrey",
      imagen: "https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcQqQ__tb8atsMkS3ofDqudycyF1UzS3hyDyFQ&s",
    },
    {
      id: 4,
      nombre: "Aliado 4",
      ubicacion: "Puebla",
      imagen: "https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcQqQ__tb8atsMkS3ofDqudycyF1UzS3hyDyFQ&s",
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

      <div className={`main-content ${menuVisible ? "menu-visible" : ""}`}>
        {/* Menú lateral */}
        {menuVisible && (
          <nav className="sidebar">
            <ul>
              <li onClick={() => navigate("/escuela/perfil")}>Perfil</li>
              <li onClick={() => navigate("/listado/aliados")}>Mis Aliados</li>
              <li onClick={() => navigate("/logout")}>Cerrar sesión</li>
            </ul>
          </nav>
        )}

        {/* Contenido principal */}
        <main className="content">
          <h1 className="title">Mis Aliados</h1>

          <div className="cards-container">
            {aliados.map((aliado) => (
              <div
               key={aliado.id} 
               className="card">
                <div className="card-image">
                <img src={aliado.imagen || "/placeholder.svg"} alt={aliado.nombre} />
                </div>
                <div className="card-info">
                  <h2 className="card-title">{aliado.nombre}</h2>
                  <div className="card-location">
                    <span className="location-icon">📍</span>
                    <span>{aliado.ubicacion}</span>
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
