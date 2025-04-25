import React, { useState, useEffect } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import '../styles/SchoolCard.css';
import logo from '../assets/logo1.png';
import escuela from '../assets/escuelaLogo.png';

export default function SchoolCard() {
  const [menuVisible, setMenuVisible] = useState(false);
  const [buttonText, setButtonText] = useState("APOYAR 🤲");
  const [schoolInfo, setSchoolInfo] = useState(null); // estado para los datos simulados

  const location = useLocation();
  const navigate = useNavigate();
  const school = location.state?.school;

  const toggleMenu = () => setMenuVisible(!menuVisible);
  const handleButtonClick = () => setButtonText("¡Se hizo match!");

  useEffect(() => {
    if (school?.CCT) {
      const token = localStorage.getItem("token");
  
      fetch(`http://localhost:5000/api/aliado/escuela/${school.CCT}`, {
        headers: {
          Authorization: `Bearer ${token}`
        }
      })
        .then(res => res.json())
        .then(data => {
          setSchoolInfo({
            name: data.nombre_escuela,
            direccion: data.direccion,
            needs: data.necesidades || []
          });
        })
        .catch(err => console.error("❌ Error al obtener escuela:", err));
    }
  }, [school]);
  

  return (
    <div className="schoolcard-container">
      {/* Header con menú */}
      <header className="schoolcard-header">
        <button className="schoolcard-menu-button" onClick={toggleMenu}>
          &#9776;
        </button>
        <img src={logo} alt="Logo" className="schoolcard-logo" />
      </header>

      {menuVisible && (
        <nav className="schoolcard-sidebar">
          <ul>
            <li onClick={() => navigate('/aliado/perfil')}>Perfil</li>
            <li onClick={() => navigate('/aliado/mapa')}>Buscar escuelas</li>
            <li onClick={() => navigate('/listado/escuelas')}>Mis escuelas</li>
            <li onClick={() => navigate('/logout')}>Cerrar sesión</li>
          </ul>
        </nav>
      )}

      {/* Contenido de la tarjeta */}
      <div className="schoolcard-school-card-container">
        <div className="schoolcard-school-card">
          <div className="schoolcard-school-content">
            <h2 className="schoolcard-school-title">{schoolInfo ? schoolInfo.name : 'Cargando...'}</h2>
            {schoolInfo?.direccion && (
              <p className="schoolcard-school-address"><strong>Dirección:</strong> {schoolInfo.direccion}</p>
            )}
            <h3 className="schoolcard-school-subtitle">Necesidades:</h3>
            <ol className="schoolcard-school-list">
              {(schoolInfo?.needs || []).map((need, idx) => (
                <li key={idx}>{need}</li>
              ))}
            </ol>
          </div>

          <div className="schoolcard-school-image-actions">
            <div className="schoolcard-school-image">
              <img src={escuela} alt="Escuela" />
            </div>
            <button className="schoolcard-support-button" onClick={handleButtonClick}>
              {buttonText}
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
