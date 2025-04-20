import { useState } from "react"
import '../styles/AllyProfile.css';
import logo from '../assets/logo1.png'; 

export default function Profile() {
    const [menuVisible, setMenuVisible] = useState(false)
    const toggleMenu = () => setMenuVisible(!menuVisible)
  
    // Datos de ejemplo para la escuela y necesidades
    const escuela = {
      id: 1,
      nombre: "Aliado 1",
      imagen: "https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcSCplsH2TEMpONjrzhN4tJ4xQJRZYRxMX1ILQ&s",
      ubicacion: "Guadalajara",
      correo: "aliado1@ejemplo.com",
    }
  
    return (
      <div className="app-container">
        {/* Barra superior */}
        <header className="header">
          <button className="menu-button" onClick={toggleMenu}>
            &#9776;
          </button>
          <img src={logo} alt="Logo" className="logo" />
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
            <h1 className="profile-title">Mi Perfil</h1>
  
            <div className="profile-card">
              <div className="profile-header">
                <div className="profile-header-left">
                  <h2 className="ally-title">{escuela.nombre}</h2>
                  <button className="edit-button">
                    <span className="edit-text">EDITAR INFORMACIÓN</span>
                    <span className="edit-icon">✏️</span>
                  </button>
                </div>
                <div className="ally-image-container">
                  <img src={escuela.imagen || "/placeholder.svg"} alt="Imagen de la escuela" className="ally-image" />
                </div>
              </div>
              <div className="profile-details">
                <div className="contact-info">
                  <div className="info-item">
                    <div className="info-label">
                      <span className="info-icon">📍</span>
                      <span className="info-text">UBICACIÓN</span>
                    </div>
                    <div className="info-value">{escuela.ubicacion}</div>
                  </div>
  
                  <div className="info-item">
                    <div className="info-label">
                      <span className="info-icon">✉️</span>
                      <span className="info-text">CORREO</span>
                    </div>
                    <div className="info-value">{escuela.correo}</div>
                  </div>
                </div>
              </div>
            </div>
          </main>
        </div>
      </div>
    )
}
