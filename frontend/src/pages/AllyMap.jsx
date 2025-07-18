import { useState, useEffect } from "react"
import { useNavigate } from "react-router-dom"
import "../styles/AllyMap.css"
import logo from "../assets/logo1.png"
import escuelaImg from "../assets/escuelaLogo.png"
import GoogleMapComponent from '../components/GoogleMapComponent'; // Ajusta ruta si es diferente


// Dentro del return:



export default function AllyMap() {
  const navigate = useNavigate()
  const [menuVisible, setMenuVisible] = useState(false)
  const [schools, setSchools] = useState([]);
  const toggleMenu = () => setMenuVisible(!menuVisible)

  useEffect(() => {
    const token = localStorage.getItem("token");

    fetch("http://localhost:5000/api/aliado/escuelas-recomendadas", {
      headers: {
        Authorization: `Bearer ${token}`
      }
    })
      .then(res => res.json())
      .then(data => setSchools(data))
      .catch(err => console.error("Error al cargar escuelas:", err));
  }, []);
  return (
    <div className={`allymap-container ${menuVisible ? "menu-visible" : ""}`}>
      <header className="allymap-header">
        <button className="allymap-menu-button" onClick={toggleMenu}>
          &#9776;
        </button>
        <img src={logo || "/placeholder.svg"} alt="Logo" className="allymap-logo" />
      </header>

      <nav className="allymap-sidebar" style={{ display: menuVisible ? "block" : "none" }}>
        <ul>
          <li onClick={() => navigate("/aliado/perfil")}>Perfil</li>
          <li onClick={() => navigate("/aliado/mapa")}>Buscar escuelas</li>
          <li onClick={() => navigate("/listado/escuelas")}>Mis escuelas</li>
          <li onClick={() => navigate("/logout")}>Cerrar sesión</li>
        </ul>
      </nav>

      <div className="allymap-main-content allymap-container-row">

        <div className="allymap-school-sidebar">
          <h3>Escuelas compatibles con tus apoyos</h3>
          <div className="allymap-school-list">
            {schools.map((school, index) => (
              <button
                key={index}
                className="allymap-school-card"
                onClick={() => navigate("/tarjeta-escuela", { state: { school } })}
              >
                <img src={escuelaImg || "/placeholder.svg"} alt="LogoEscuela" />
                <div className="allymap-school-info">
                <h4 className="allymap-school-name">{school.nombre_escuela}</h4>
                {school.coincidencias && school.coincidencias.trim() !== '' && (
                  <p><strong>Coincidencias:</strong> {school.coincidencias}</p>
                )}
                </div>
              </button>
            ))}
          </div>
        </div>

        <div className="allymap-map">
        <GoogleMapComponent schools={schools.filter(s => s.latitud && s.longitud)} />
      </div>
      </div>
    </div>
  );
}