"use client"

import { useState } from "react"
import { useNavigate } from "react-router-dom"
import "../styles/AllyMap.css"
import logo from "../assets/logo1.png"
import escuela from "../assets/escuelaLogo.png"

const schools = [
  {
    name: "Nombre Escuela",
    description: "Ejemplo sobre sinopsis y pequeño contexto sobre la escuela y sus problemáticas.",
  },
  {
    name: "Nombre Escuela",
    description: "Ejemplo sobre sinopsis y pequeño contexto sobre la escuela y sus problemáticas.",
  },
  {
    name: "Nombre Escuela",
    description: "Ejemplo sobre sinopsis y pequeño contexto sobre la escuela y sus problemáticas.",
  },
  {
    name: "Nombre Escuela",
    description: "Ejemplo sobre sinopsis y pequeño contexto sobre la escuela y sus problemáticas.",
  },
  {
    name: "Nombre Escuela",
    description: "Ejemplo sobre sinopsis y pequeño contexto sobre la escuela y sus problemáticas.",
  },
]

export default function AllyMap() {
  const navigate = useNavigate()
  const [menuVisible, setMenuVisible] = useState(false)
  const toggleMenu = () => setMenuVisible(!menuVisible)

  return (
    <div className={`allymap-container ${menuVisible ? "menu-visible" : ""}`}>
      {/* Header */}
      <header className="allymap-header">
        <button className="allymap-menu-button" onClick={toggleMenu}>
          &#9776;
        </button>
        <img src={logo || "/placeholder.svg"} alt="Logo" className="allymap-logo" />
      </header>

      {/* Menú del header - siempre renderizado pero visible según estado */}
      <nav className="allymap-sidebar" style={{ display: menuVisible ? "block" : "none" }}>
        <ul>
          <li onClick={() => navigate("/aliado/perfil")}>Perfil</li>
          <li onClick={() => navigate("/aliado/mapa")}>Buscar escuelas</li>
          <li onClick={() => navigate("/listado/escuelas")}>Mis escuelas</li>
          <li onClick={() => navigate("/logout")}>Cerrar sesión</li>
        </ul>
      </nav>

      {/* Contenido principal */}
      <div className="allymap-main-content allymap-container-row">
        {/* Menú lateral de escuelas */}
        <div className="allymap-school-sidebar">
          <div className="allymap-search-bar">
            <input type="text" placeholder="Ingresa una ubicación" />
          </div>
          <h3>Escuelas cerca de la ubicación ingresada</h3>
          <div className="allymap-school-list">
            {schools.map((school, index) => (
              <button
                key={index}
                className="allymap-school-card"
                onClick={() => navigate("/tarjeta-escuela", { state: { school } })}
              >
                <img src={escuela || "/placeholder.svg"} alt="LogoEscuela" />
                <div className="allymap-school-info">
                  {/* Título dentro de la tarjeta de cada escuela */}
                  <h4 className="allymap-school-name">{school.name}</h4>
                  <p>{school.description}</p>
                </div>
              </button>
            ))}
          </div>
        </div>

        {/* Mapa */}
        <div className="allymap-map">
          <img
            src="https://img.freepik.com/foto-gratis/resumen-superficie-texturas-muro-piedra-hormigon-blanco_74190-8189.jpg"
            alt="Mapa"
            className="allymap-map-image"
          />
        </div>
      </div>
    </div>
  )
}
