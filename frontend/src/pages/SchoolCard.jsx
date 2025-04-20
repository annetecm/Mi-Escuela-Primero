import React, { useState } from 'react';
import '../styles/SchoolCard.css';
import logo from '../assets/logo1.png'; 
import escuela from '../assets/escuelaLogo.png'

export default function SchoolCard() {
  const [menuVisible, setMenuVisible] = useState(false);
  const [buttonText, setButtonText] = useState("APOYAR 🤲");

  const toggleMenu = () => setMenuVisible(!menuVisible);
  const handleButtonClick = () => setButtonText("Se hizo match!");

  return (
    <div className="app-container">
      {/* Header con menú */}
      <header className="header">
        <button className="menu-button" onClick={toggleMenu}>
          &#9776;
        </button>
        <img src={logo} alt="Logo" className="logo" />
      </header>

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

      {/* Contenido de la tarjeta */}
      <div className="school-card-container">
        <div className="school-card">
          <div className="school-content">
            <h2 className="school-title">Escuela 1</h2>
            <h3 className="school-subtitle">Necesidades:</h3>
            <ol className="school-list">
              <li>Ejemplo de necesidad</li>
              <li>Ejemplo de necesidad</li>
              <li>Ejemplo de necesidad</li>
              <li>Ejemplo de necesidad</li>
              <li>Ejemplo de necesidad</li>
            </ol>
          </div>

          <div className="school-image-actions">
            <div className="school-image">
              <img src={escuela} alt="Escuela" />
            </div>
            <button className="support-button" onClick={handleButtonClick}>
              {buttonText}
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
