import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import '../styles/AllyMap.css';
import logo from '../assets/logo1.png'; 
import escuela from '../assets/escuelaLogo.png'

const schools = [
  {
    name: 'Nombre Escuela',
    description: 'Ejemplo sobre sinopsis y pequeño contexto sobre la escuela y sus problemáticas.',
  },
  {
    name: 'Nombre Escuela',
    description: 'Ejemplo sobre sinopsis y pequeño contexto sobre la escuela y sus problemáticas.',
  },
  {
    name: 'Nombre Escuela',
    description: 'Ejemplo sobre sinopsis y pequeño contexto sobre la escuela y sus problemáticas.',
  },
  {
    name: 'Nombre Escuela',
    description: 'Ejemplo sobre sinopsis y pequeño contexto sobre la escuela y sus problemáticas.',
  },
  {
    name: 'Nombre Escuela',
    description: 'Ejemplo sobre sinopsis y pequeño contexto sobre la escuela y sus problemáticas.',
  }
];

export default function AllyMap() {
    const navigate = useNavigate();
    const [menuVisible, setMenuVisible] = useState(false);
    const toggleMenu = () => setMenuVisible(!menuVisible);
  
    return (
      <div className="app-container">
        {/* Header */}
        <header className="header">
          <button className="menu-button" onClick={toggleMenu}>
            &#9776;
          </button>
          <img src={logo} alt="Logo" className="logo" />
        </header>
  
        {/* Menú del header */}
        {menuVisible && (
          <nav className="sidebar">
            <ul>
            <li onClick={() => navigate('/aliado/perfil')}>Perfil</li>
            <li onClick={() => navigate('/aliado/mapa')}>Buscar escuelas</li>
            <li onClick={() => navigate('/listado/escuelas')}>Mis escuelas</li>
            <li onClick={() => navigate('/logout')}>Cerrar sesión</li>
            </ul>
        </nav>
        )}
  
        {/* Contenido principal */}
        <div className="main-content container">
          {/* Menú lateral de escuelas */}
          <div className="school-sidebar">
            <div className="search-bar">
              <input type="text" placeholder="Ingresa una ubicación" />
            </div>
            <h3>Escuelas cerca de la ubicación ingresada</h3>
            <div className="school-list">
              {schools.map((school, index) => (
                <button
                  key={index}
                  className="school-card"
                  onClick={() => console.log(`Seleccionaste: ${school.name}`)}
                >
                  <img src={escuela} alt="LogoEscuela"  />
                  <div className="school-info">
                    {/* Título dentro de la tarjeta de cada escuela */}
                    <h4 className="school-name">{school.name}</h4> 
                    <p>{school.description}</p>
                  </div>
                </button>
              ))}
            </div>
          </div>
  
          {/* Mapa */}
          <div className="map">
            <img
              src="https://img.freepik.com/foto-gratis/resumen-superficie-texturas-muro-piedra-hormigon-blanco_74190-8189.jpg"
              alt="Mapa"
              className="map-image"
            />
          </div>
        </div>
      </div>
    );
  }