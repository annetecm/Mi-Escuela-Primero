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
  const handleButtonClick = async () => {
    const token = localStorage.getItem("token");
  
    try {
      //Obtener apoyos del aliado
      const perfilRes = await fetch("http://localhost:5000/api/aliado/perfil", {
        headers: { Authorization: `Bearer ${token}` }
      });
      const perfil = await perfilRes.json();
      const apoyos = perfil.apoyos || [];
  
      //Obtener IDs de necesidad que coincidan
      const necesidadesRes = await fetch(`http://localhost:5000/api/aliado/ids-necesidades/${school.CCT}`, {
        headers: { Authorization: `Bearer ${token}` }
      });
      const necesidades = await necesidadesRes.json(); //Array de { necesidadId, nombre }
  
      const necesidadesCompatibles = necesidades
        .filter(n => apoyos.includes(n.nombre))
        .map(n => n.necesidadId);
  
      // Obtener IDs de apoyo que coincidan
      const apoyosRes = await fetch(`http://localhost:5000/api/aliado/ids-apoyos`, {
        headers: { Authorization: `Bearer ${token}` }
      });
      const apoyosDB = await apoyosRes.json(); //Array de { apoyoId, caracteristicas }
  
      const apoyosCompatibles = apoyosDB
      .filter(a => schoolInfo.needs.some(n => n.toLowerCase() === a.caracteristicas.toLowerCase()))
      .map(a => a.apoyoId);
      console.log("👀 Necesidades encontradas:", necesidades);
      console.log("💡 Apoyos del perfil:", apoyos);
      console.log("✅ Necesidades compatibles:", necesidadesCompatibles);

      console.log("📚 Apoyos DB:", apoyosDB);
      console.log("🏫 Needs escuela:", schoolInfo.needs);
      console.log("🔗 Apoyos compatibles:", apoyosCompatibles);

  
      if (necesidadesCompatibles.length === 0 || apoyosCompatibles.length === 0) {
        alert("No hay coincidencias suficientes para generar una conexión.");
        return;
      }
  
      // 4. Enviar solicitud de conexión
      await fetch("http://localhost:5000/api/conexion", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`
        },
        body: JSON.stringify({
          CCT: school.CCT,
          necesidadesCompatibles,
          apoyosCompatibles
        })
      });
  
      setButtonText("¡Se hizo match!");
      alert("Conexión registrada con éxito.");
    } catch (err) {
      console.error("Error al hacer match:", err);
      alert("Error al hacer match. Intenta nuevamente.");
    }
  };  

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
            nivel: data.nivelEducativo,
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
          <h2 className="schoolcard-school-title">{schoolInfo?.name || 'Cargando...'}</h2>

          {schoolInfo?.nivel && (
            <p className="schoolcard-school-meta"><strong>Nivel educativo:</strong> {schoolInfo.nivel}</p>
          )}
          {schoolInfo?.direccion && (
            <p className="schoolcard-school-meta"><strong>Dirección:</strong> {schoolInfo.direccion}</p>
          )}

          <h3 className="schoolcard-school-subtitle">Necesidades registradas:</h3>
          <ul className="schoolcard-school-list">
            {schoolInfo?.needs.length ? (
              schoolInfo.needs.map((need, idx) => (
                <li key={idx}>{need}</li>
              ))
            ) : (
              <li>Sin necesidades registradas.</li>
            )}
          </ul>
        </div>

        <div className="schoolcard-school-image-actions">
          <img src={escuela} alt="Escuela" className="schoolcard-img" />
          <button className="schoolcard-support-button" onClick={handleButtonClick}>
            {buttonText}
          </button>
        </div>
      </div>

      </div>
    </div>
  );
}
