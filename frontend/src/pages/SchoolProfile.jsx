import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import logo from "../assets/logo1.png";
import "../styles/SchoolProfile.css";

export default function SchoolProfile() {
  const navigate = useNavigate();
  const [menuVisible, setMenuVisible] = useState(true);
  const [perfil, setPerfil] = useState(null);

  const toggleMenu = () => setMenuVisible(!menuVisible);

  useEffect(() => {
    const token = localStorage.getItem("token");
    if (!token) return;

    fetch("http://localhost:5000/api/escuela/perfil", {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    })
      .then(res => res.json())
      .then(data => setPerfil(data))
      .catch(err => console.error("Error al cargar perfil:", err));
  }, []);

  if (!perfil) return <div className="school-content">Cargando perfil...</div>;

  return (
    <div className="school-app-container">
      {/* Barra superior */}
      <header className="school-header">
        <button className="school-menu-button" onClick={toggleMenu}>
          &#9776;
        </button>
        <img src={logo || "/placeholder.svg"} alt="Logo" className="school-logo" />
      </header>

      <div className="school-main-layout">
        {/* Menú lateral */}
        <aside className={`school-sidebar ${menuVisible ? 'visible' : 'hidden'}`}>
          <ul className="school-menu-list">
            <li className="school-menu-item active" onClick={() => navigate('/escuela/perfil')}>Perfil</li>
            <li className="school-menu-item" onClick={() => navigate('/listado/aliados')}>Mis aliados</li>
            <li className="school-menu-item" onClick={() => navigate('/logout')}>Cerrar sesión</li>
          </ul>
        </aside>

        {/* Contenido principal */}
        <main className="school-content">
          <h1 className="school-profile-title">Mi Perfil</h1>

          <div className="school-profile-card">
            <div className="school-profile-header">
              <div className="school-profile-header-left">
                <h2 className="school-title">{perfil.nombre}</h2>
                <button className="school-edit-button" onClick={() => navigate('/editar/escuela')}>
                  <span className="school-edit-text">EDITAR INFORMACIÓN</span>
                  <span className="school-edit-icon">✏️</span>
                </button>
              </div>
              <div className="school-image-container">
                <img
                  src="https://observatorio.tec.mx/wp-content/uploads/2020/11/C2BFElfindelaescuela.jpg"
                  alt="Imagen de la escuela"
                  className="school-image"
                  onError={(e) => {
                    e.target.src = '/placeholder.svg';
                    e.target.onerror = null;
                  }}
                />
              </div>
            </div>

            <div className="school-profile-details">
              <div className="school-contact-info">
                <div className="school-info-item">
                  <div className="school-info-label">
                    <span className="school-info-icon">📍</span>
                    <span className="school-info-text">DIRECCIÓN</span>
                  </div>
                  <div className="school-info-value">{perfil.direccion}</div>
                </div>

                <div className="school-info-item">
                  <div className="school-info-label">
                    <span className="school-info-icon">✉️</span>
                    <span className="school-info-text">CORREO</span>
                  </div>
                  <div className="school-info-value">{perfil.correoElectronico}</div>
                </div>

                <div className="school-info-item">
                  <div className="school-info-label">
                    <span className="school-info-icon">🎓</span>
                    <span className="school-info-text">NIVEL EDUCATIVO</span>
                  </div>
                  <div className="school-info-value">{perfil.nivelEducativo}</div>
                </div>
              </div>

              <div className="school-needs-section">
                <h3 className="school-needs-title">Necesidades:</h3>
                <ol className="school-needs-list">
                  {perfil.necesidades.map((necesidad, index) => (
                    <li key={index}>{necesidad}</li>
                  ))}
                </ol>
              </div>
            </div>
          </div>
        </main>
      </div>
    </div>
  );
}
