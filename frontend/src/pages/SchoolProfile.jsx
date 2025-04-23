import { useState } from "react"
import { useNavigate } from "react-router-dom"
import logo from "../assets/logo1.png"
import "../styles/SchoolProfile.css"

export default function SchoolProfile() {    
    const navigate = useNavigate();
    const [menuVisible, setMenuVisible] = useState(true)

    const toggleMenu = () => setMenuVisible(!menuVisible)
  
    // Datos de ejemplo para la escuela y necesidades
    const escuela = {
      id: 1,
      nombre: "Escuela 1",
      necesidades: ["Necesidad 1", "Necesidad 2", "Necesidad 3", "Necesidad 4", "Necesidad 5"],
      imagen: "https://observatorio.tec.mx/wp-content/uploads/2020/11/C2BFElfindelaescuela.jpg",
      ubicacion: "Ciudad de México",
      correo: "escuela1@ejemplo.com",
    }
  
    return (
      <div className="app-container">
        {/* Barra superior */}
        <header className="header">
          <button className="menu-button" onClick={toggleMenu}>
            &#9776;
          </button>
          <img src={logo || "/placeholder.svg"} alt="Logo" className="logo" />
        </header>
  
        <div className="main-layout">
          {/* Menú lateral */}
          <aside className={`sidebar ${menuVisible ? 'visible' : 'hidden'}`}>
          <ul className="menu-list">
            <li className="menu-item active" onClick={() => navigate('/escuela>/perfil')}>Perfil</li>
            <li className="menu-item" onClick={() => navigate('/listado/aliados')}>Mis aliados</li>
            <li className="menu-item" onClick={() => navigate('/logout')}>Cerrar sesión</li>
          </ul>
        </aside>
            
             
          {/* Contenido principal */}
          <main className="content">
            <h1 className="profile-title">Mi Perfil</h1>
  
            <div className="profile-card">
            <div className="profile-header">
              <div className="profile-header-left">
                <h2 className="school-title">{escuela.nombre}</h2>
                <button className="edit-button" onClick={() => navigate('/editar/escuela')}>
                  <span className="edit-text">EDITAR INFORMACIÓN</span>
                  <span className="edit-icon">✏️</span>
                </button>
              </div>
              <div className="profile-image-container">
                <img src={escuela.imagen || "/placeholder.svg"} alt="Imagen de la escuela" className="school-image" 
                onError={(e) => {
                  e.target.src = '/placeholder.svg';
                  e.target.onerror = null;
                }}
              />
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
  
                <div className="needs-section">
                  <h3 className="needs-title">Necesidades:</h3>
                  <ol className="needs-list">
                    {escuela.necesidades.map((necesidad, index) => (
                      <li key={index}>{necesidad}</li>
                    ))}
                  </ol>
                </div>
              </div>
            </div>
          </main>
        </div>
      </div>
    )
  }
  