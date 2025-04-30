import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import "../styles/ListedAllies.css";
import logo from "../assets/logo1.png";

export default function ListedSchools() {
  const [menuVisible, setMenuVisible] = useState(false);
  const [escuelasAgrupadas, setEscuelasAgrupadas] = useState({});
  const navigate = useNavigate();

  const toggleMenu = () => setMenuVisible(!menuVisible);

  useEffect(() => {
    const token = localStorage.getItem("token");

    fetch("http://localhost:5000/api/mis-conexiones", {
      headers: { Authorization: `Bearer ${token}` }
    })
      .then(res => res.json())
      .then(data => {
        const agrupadas = {};
      
        data.forEach(conexion => {
          const key = conexion.CCT;
          if (!agrupadas[key]) {
            agrupadas[key] = {
              nombreEscuela: conexion.nombreEscuela,
              proyectos: new Set()
            };
          }
          agrupadas[key].proyectos.add({
            necesidad: conexion.necesidad,
            conexionId: conexion.conexionId
          });
        });
      
        const finalAgrupadas = {};
        for (const [key, value] of Object.entries(agrupadas)) {
          finalAgrupadas[key] = {
            nombreEscuela: value.nombreEscuela,
            proyectos: Array.from(value.proyectos)
          };
        }
      
        setEscuelasAgrupadas(finalAgrupadas);
      })      
      .catch(err => console.error("Error cargando conexiones:", err));
  }, []);

  return (
    <div className="listedallies-container">
      <header className="listedallies-header">
        <button className="listedallies-menu-button" onClick={toggleMenu}>
          &#9776;
        </button>
        <img src={logo || "/placeholder.svg"} alt="Logo" className="listedallies-logo" />
      </header>

      <div className={`listedallies-main-content ${menuVisible ? "menu-visible" : ""}`}>
        {menuVisible && (
          <nav className="listedallies-sidebar">
            <ul>
              <li onClick={() => navigate("/aliado/perfil")}>Perfil</li>
              <li onClick={() => navigate("/aliado/mapa")}>Buscar escuelas</li>
              <li onClick={() => navigate("/listado/escuelas")}>Mis escuelas</li>
              <li onClick={() => navigate("/logout")}>Cerrar sesión</li>
            </ul>
          </nav>
        )}

        <main className="listedallies-content">
          <h1 className="listedallies-title">Mis Escuelas</h1>

          <div className="listedallies-cards-container">
            {Object.keys(escuelasAgrupadas).length === 0 ? (
              <p className="listedallies-empty-text">No tienes escuelas asociadas aún.</p>
            ) : (
              Object.entries(escuelasAgrupadas).map(([CCT, datos], index) => (
                <div
                  key={index}
                  className="listedallies-card"
                  onClick={() => navigate(`/evidencia/${datos.proyectos[0].conexionId}`, {
                    state: { CCT: CCT } // 🔥 Aquí pasamos también el CCT
                  })}
                >
                  <div className="listedallies-card-info">
                    <h2 className="listedallies-card-title">{datos.nombreEscuela}</h2>
                    <h4 className="listedallies-projects-title">Proyectos asignados:</h4>
                    <ul className="listedallies-projects-list">
                      {datos.proyectos.map((proyecto, idx) => (
                        <li key={idx} className="listedallies-project-item">
                          {proyecto.necesidad}
                        </li>
                      ))}
                    </ul>
                  </div>
                  <div className="listedallies-card-footer">
                  <button
                    className="listedallies-message-button"
                    onClick={async (e) => {
                      e.stopPropagation();
                      const token = localStorage.getItem("token");

                      try {
                        const res = await fetch(`http://localhost:5000/api/conexion/conexion-id/${CCT}`, {
                          headers: {
                            Authorization: `Bearer ${token}`
                          }
                        });
                        
                        if (!res.ok) {
                          const text = await res.text();
                          console.error("❌ Respuesta no válida del backend:", text);
                          alert("No se pudo obtener la conexión para el chat.");
                          return;
                        }
                        
                        const data = await res.json();
                        if (data.conexionId) {
                          navigate(`/chat/${data.conexionId}`);
                        } else {
                          alert("No se encontró una conexión válida.");
                        }
                        
                      } catch (err) {
                        console.error("❌ Error al obtener conexión para chat:", err);
                        alert("Error al intentar abrir el chat.");
                      }
                    }}
                  >
                    💬 Enviar mensaje
                  </button>

                </div>
                </div>
              ))
            )}
          </div>
        </main>
      </div>
    </div>
  );
}