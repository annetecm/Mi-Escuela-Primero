import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import "../styles/ListedAllies.css";
import logo from "../assets/logo1.png";

export default function ListedAllies() {
  const [menuVisible, setMenuVisible] = useState(false);
  const [aliadosAgrupados, setAliadosAgrupados] = useState({});
  const navigate = useNavigate();
  

  const toggleMenu = () => setMenuVisible(!menuVisible);

  useEffect(() => {
    const token = localStorage.getItem("token");
  
    fetch("http://localhost:5000/api/escuela/mis-conexiones", {
      headers: { Authorization: `Bearer ${token}` }
    })
      .then(res => res.json())
      .then(data => {
        const agrupados = {};
  
        data.forEach(conexion => {
          const key = conexion.aliadoId;
          if (!agrupados[key]) {
            agrupados[key] = {
              nombreAliado: conexion.nombreAliado,
              proyectos: new Set()
            };
          }
          agrupados[key].proyectos.add(JSON.stringify({
            necesidad: conexion.nombreNecesidad,
            conexionId: conexion.conexionId
          }));
        });
  
        const finalAgrupados = {};
        for (const [key, value] of Object.entries(agrupados)) {
          finalAgrupados[key] = {
            nombreAliado: value.nombreAliado,
            proyectos: Array.from(value.proyectos).map(str => JSON.parse(str))
          };
        }
  
        setAliadosAgrupados(finalAgrupados);
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
              <li onClick={() => navigate("/escuela/perfil")}>Perfil</li>
              <li onClick={() => navigate("/listado/aliados")}>Mis Aliados</li>
              <li onClick={() => navigate("/logout")}>Cerrar sesión</li>
            </ul>
          </nav>
        )}

        <main className="listedallies-content">
          <h1 className="listedallies-title">Mis Aliados</h1>

          <div className="listedallies-cards-container">
            {Object.keys(aliadosAgrupados).length === 0 ? (
              <p className="listedallies-empty-text">No tienes aliados asociados aún.</p>
            ) : (
              Object.entries(aliadosAgrupados).map(([aliadoId, datos], index) => (
                <div
                  key={index}
                  className="listedallies-card"
                  onClick={() => navigate(`/evidencia/${datos.proyectos[0].conexionId}`, {
                    state: { aliadoId: aliadoId }
                  })}
                >
                  <div className="listedallies-card-info">
                    <h2 className="listedallies-card-title">{datos.nombreAliado}</h2>
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
                  onClick={(e) => {
                    e.stopPropagation();
                    navigate(`/chat/${datos.proyectos[0].conexionId}`);
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
