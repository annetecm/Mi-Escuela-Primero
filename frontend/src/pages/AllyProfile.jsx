import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import logo from '../assets/logo1.png';
import "../styles/AllyProfile.css";

export default function Profile() {
  const navigate = useNavigate();
  const [menuVisible, setMenuVisible] = useState(true);

  const toggleMenu = () => setMenuVisible(!menuVisible);

  // Datos de ejemplo para la escuela y necesidades
  const escuela = {
    id: 1,
    nombre: "Aliado 1",
    imagen: "https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcSCplsH2TEMpONjrzhN4tJ4xQJRZYRxMX1ILQ&s",
    ubicacion: "Guadalajara",
    correo: "aliado1@ejemplo.com",
  };

  return (
    <div className="app-container">
      {/* Barra superior */}
      <header className="header">
        <button className="menu-button" onClick={toggleMenu}>
          &#9776;
        </button>
        <div className="logo-container">
          <img src={logo || "/placeholder.svg"} alt="Logo" className="logo" />
        </div>
      </header>

      <div className="main-layout">
        {/* Menú lateral */}
        <aside className={`sidebar ${menuVisible ? 'visible' : 'hidden'}`}>
          <ul className="menu-list">
            <li className="menu-item active" onClick={() => navigate('/aliado/perfil')}>Perfil</li>
            <li className="menu-item" onClick={() => navigate('/aliado/mapa')}>Buscar escuelas</li>
            <li className="menu-item" onClick={() => navigate('/listado/escuelas')}>Mis escuelas</li>
            <li className="menu-item" onClick={() => navigate('/logout')}>Cerrar sesión</li>
          </ul>
        </aside>

        {/* Contenido principal */}
        <main className="main-content">
          <div className="content-wrapper">
            <h1 className="page-title">Mi Perfil</h1>
            
            <div className="profile-card">
              <div className="profile-header">
                <div className="profile-info">
                  <h2 className="profile-name">{escuela.nombre}</h2>
                  <button className="edit-button" onClick={() => navigate('/editar/aliado')}>
                    <span className="edit-text">EDITAR INFORMACIÓN</span>
                    <span className="edit-icon">✏️</span>
                  </button>
                </div>
                
                <div className="profile-image-container">
                  <img 
                    src={escuela.imagen || "/placeholder.svg"} 
                    alt="Imagen del aliado" 
                    className="profile-image" 
                  />
                </div>
              </div>
              
              <div className="profile-details">
                <div className="detail-item">
                  <div className="detail-label">
                    <span className="detail-icon">📍</span>
                    <span className="detail-text">UBICACIÓN</span>
                  </div>
                  <div className="detail-value">{escuela.ubicacion}</div>
                </div>
                
                <div className="detail-item">
                  <div className="detail-label">
                    <span className="detail-icon">✉️</span>
                    <span className="detail-text">CORREO</span>
                  </div>
                  <div className="detail-value">{escuela.correo}</div>
                </div>
              </div>
            </div>
          </div>
        </main>
      </div>
    </div>
  );
}
