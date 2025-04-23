import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import logo from '../assets/logo1.png';
import "../styles/AllyProfile.css";

export default function Profile() {
  const navigate = useNavigate();
  const [menuVisible, setMenuVisible] = useState(true);

  const toggleMenu = () => setMenuVisible(!menuVisible);

  const escuela = {
    id: 1,
    nombre: "Aliado 1",
    imagen: "https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcSCplsH2TEMpONjrzhN4tJ4xQJRZYRxMX1ILQ&s",
    ubicacion: "Guadalajara",
    correo: "aliado1@ejemplo.com",
  };

  return (
    <div className="allyprofile-container">
      <header className="allyprofile-header">
        <button className="allyprofile-menu-button" onClick={toggleMenu}>
          &#9776;
        </button>
        <div className="allyprofile-logo-container">
          <img src={logo || "/placeholder.svg"} alt="Logo" className="allyprofile-logo" />
        </div>
      </header>

      <div className="allyprofile-main-layout">
        <aside className={`allyprofile-sidebar ${menuVisible ? 'visible' : 'hidden'}`}>
          <ul className="allyprofile-menu-list">
            <li className="allyprofile-menu-item active" onClick={() => navigate('/aliado/perfil')}>Perfil</li>
            <li className="allyprofile-menu-item" onClick={() => navigate('/aliado/mapa')}>Buscar escuelas</li>
            <li className="allyprofile-menu-item" onClick={() => navigate('/listado/escuelas')}>Mis escuelas</li>
            <li className="allyprofile-menu-item" onClick={() => navigate('/logout')}>Cerrar sesión</li>
          </ul>
        </aside>

        <main className="allyprofile-main-content">
          <div className="allyprofile-content-wrapper">
            <h1 className="allyprofile-page-title">Mi Perfil</h1>

            <div className="allyprofile-profile-card">
              <div className="allyprofile-profile-header">
                <div className="allyprofile-profile-info">
                  <h2 className="allyprofile-profile-name">{escuela.nombre}</h2>
                  <button className="allyprofile-edit-button" onClick={() => navigate('/editar/aliado')}>
                    <span className="allyprofile-edit-text">EDITAR INFORMACIÓN</span>
                    <span className="allyprofile-edit-icon">✏️</span>
                  </button>
                </div>

                <div className="allyprofile-profile-image-container">
                  <img
                    src={escuela.imagen || "/placeholder.svg"}
                    alt="Imagen del aliado"
                    className="allyprofile-profile-image"
                  />
                </div>
              </div>

              <div className="allyprofile-profile-details">
                <div className="allyprofile-detail-item">
                  <div className="allyprofile-detail-label">
                    <span className="allyprofile-detail-icon">📍</span>
                    <span className="allyprofile-detail-text">UBICACIÓN</span>
                  </div>
                  <div className="allyprofile-detail-value">{escuela.ubicacion}</div>
                </div>

                <div className="allyprofile-detail-item">
                  <div className="allyprofile-detail-label">
                    <span className="allyprofile-detail-icon">✉️</span>
                    <span className="allyprofile-detail-text">CORREO</span>
                  </div>
                  <div className="allyprofile-detail-value">{escuela.correo}</div>
                </div>
              </div>
            </div>
          </div>
        </main>
      </div>
    </div>
  );
}