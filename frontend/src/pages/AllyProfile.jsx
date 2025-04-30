import React, { useEffect,useState } from 'react';
import { useNavigate } from 'react-router-dom';
import logo from '../assets/logo1.png';
import aliado from '../assets/aliadoperfil.jpg';
import "../styles/AllyProfile.css";

export default function Profile() {
  const navigate = useNavigate();
  const [menuVisible, setMenuVisible] = useState(true);
  const [perfil, setPerfil] = useState(null);

  const toggleMenu = () => setMenuVisible(!menuVisible);

  useEffect(() => {
    const token = localStorage.getItem("token");
    if (!token) return;
  
    fetch("http://localhost:5000/api/aliado/perfil", {
      headers: {
        Authorization: `Bearer ${token}`
      }
    })
      .then(res => res.json())
      .then(data => setPerfil(data))
      .catch(err => console.error("Error al cargar perfil:", err));
  }, []);
  

  if (!perfil) return <div className="allyprofile-main-content">Cargando perfil...</div>;

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
                  <h2 className="allyprofile-profile-name">{perfil.nombre}</h2>
                  <button
  className="allyprofile-edit-button"
  onClick={() => {
    if (perfil.tipo === "fisico") {
      navigate('/editar/aliado/fisico');
    } else if (perfil.tipo === "moral") {
      navigate('/editar/aliado/moral');
    } else {
      console.error("Tipo de persona desconocido:", perfil.tipo);
      alert("No se puede editar porque el tipo de persona es desconocido.");
    }
  }}
>
  <span className="allyprofile-edit-text">EDITAR INFORMACIÓN</span>
  <span className="allyprofile-edit-icon">✏️</span>
</button>
          
                </div>

                <div className="allyprofile-profile-image-container">
                  <img
                    src={aliado}
                    alt="Imagen del aliado"
                    className="allyprofile-profile-image"
                  />
                </div>
              </div>

              <div className="allyprofile-profile-details">
                <div className="allyprofile-detail-item">
                  <div className="allyprofile-detail-label">
                    <span className="allyprofile-detail-icon">📝</span>
                    <span className="allyprofile-detail-text">DESCRIPCIÓN DEL APOYO A BRINDAR</span>
                  </div>
                  <div className="allyprofile-detail-value">{perfil.tipoDeApoyo}</div>
                </div>

                <div className="allyprofile-detail-item">
                  <div className="allyprofile-detail-label">
                    <span className="allyprofile-detail-icon">✉️</span>
                    <span className="allyprofile-detail-text">CORREO</span>
                  </div>
                  <div className="allyprofile-detail-value">{perfil.correoElectronico || perfil.correo}</div>
                </div>

                {perfil.apoyos && perfil.apoyos.length > 0 && (
                <div className="allyprofile-detail-item">
                  <div className="allyprofile-detail-label">
                    <span className="allyprofile-detail-icon">📌</span>
                    <span className="allyprofile-detail-text">NECESIDADES QUE PUEDO APOYAR:</span>
                  </div > 
                  <div className="allyprofile-needs-scroll">
                    <ul className="allyprofile-detail-value">
                      {perfil.apoyos.map((apoyo, idx) => (
                        <li key={idx}>{apoyo}</li>
                      ))}
                    </ul>
                  </div>
                </div>
                )}
              </div>
            </div>
          </div>
        </main>
      </div>
    </div>
  );
}