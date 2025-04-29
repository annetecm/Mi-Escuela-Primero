import { useNavigate, useParams } from "react-router-dom";
import logo from "../assets/logo1.png";
import "../styles/ChatPage.css";
import { useState, useEffect } from "react";

export default function ChatPage() {
  const [menuVisible, setMenuVisible] = useState(true);
  const [mensaje, setMensaje] = useState("");
  const [mensajes, setMensajes] = useState([]);
  const [remitente, setRemitente] = useState("");
  const [cargando, setCargando] = useState(true);
  const [error, setError] = useState(false);
  const navigate = useNavigate();
  const { conexionId } = useParams();
  const [tipoUsuario, setTipoUsuario] = useState('');


  const toggleMenu = () => setMenuVisible(!menuVisible);

  useEffect(() => {
    const tipo = localStorage.getItem("tipo");
    const idAliado = localStorage.getItem("aliadoId");
    const cctEscuela = localStorage.getItem("cct");

    console.log("📦 LocalStorage recuperado:", { tipo, idAliado, cctEscuela });
    
    if (tipo === "aliado" && idAliado) {
      setTipoUsuario("aliado");
      setRemitente(idAliado);
    } else if (tipo === "escuela" && cctEscuela) {
      setTipoUsuario("escuela");
      setRemitente(cctEscuela);
    }

  }, []);

  const cargarMensajes = () => {
    fetch(`http://localhost:5000/api/chat/mensajes/${conexionId}`)
      .then((res) => res.json())
      .then((data) => {
        setMensajes(data.mensajes);
        setCargando(false);
      })
      .catch((err) => {
        console.error("Error al obtener mensajes:", err);
        setError(true);
        setCargando(false);
      });
  };

  const enviarMensaje = () => {
    if (!mensaje.trim()) return;
    if (!remitente.trim()) {
      console.error("Remitente no está cargado aún");
      return;
    }

    const nuevoMensaje = {
      conexionId,
      emisor: remitente,
      mensaje,
    };

    fetch("http://localhost:5000/api/chat/enviar-mensaje", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(nuevoMensaje),
    })
      .then((res) => res.json())
      .then(() => {
        cargarMensajes();
        setMensaje("");
      })
      .catch((err) => console.error("Error al enviar mensaje:", err));
  };

  useEffect(() => {
    if (!conexionId) return;
    fetch("http://localhost:5000/api/chat/crear-chat", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ conexionId }),
    })
      .then((res) => res.json())
      .then(() => cargarMensajes())
      .catch((err) => console.error("Error al crear/verificar chat:", err));
  }, [conexionId]);


  return (
    <div className="chat-container">
      <header className="chat-header">
        <button className="chat-menu-button" onClick={toggleMenu}>
          &#9776;
        </button>
        <div className="chat-logo-container">
          <img src={logo || "/placeholder.svg"} alt="Logo" className="chat-logo" />
        </div>
      </header>

      <div className="chat-main-layout">
        <aside className={`chat-sidebar ${menuVisible ? 'visible' : 'hidden'}`}>
        <ul className="chat-menu-list">
            {tipoUsuario === "aliado" ? (
              <>
                <li className="chat-menu-item" onClick={() => navigate('/aliado/perfil')}>Perfil</li>
                <li className="chat-menu-item" onClick={() => navigate('/aliado/mapa')}>Buscar escuelas</li>
                <li className="chat-menu-item" onClick={() => navigate('/listado/escuelas')}>Mis escuelas</li>
                <li className="chat-menu-item" onClick={() => navigate('/logout')}>Cerrar sesión</li>
              </>
            ) : tipoUsuario === "escuela" ? (
              <>
                <li className="chat-menu-item" onClick={() => navigate('/escuela/perfil')}>Perfil</li>
                <li className="chat-menu-item" onClick={() => navigate('/listado/aliados')}>Mis aliados</li>
                <li className="chat-menu-item" onClick={() => navigate('/logout')}>Cerrar sesión</li>
              </>
            ) : null}
          </ul>
        </aside>

        <main className="chat-content">
          <div className="chat-header-actions">
            <h1 className="chat-title">Chat</h1>
            <button onClick={() => {
              setCargando(true); 
              cargarMensajes();
            }} className="chat-refresh-button">
              🔄 Refresh
            </button>
          </div>
          <div className="chat-box">
            {cargando ? (
              <p>Cargando mensajes...</p>
            ) : error ? (
              <p style={{ color: "red" }}>No se pudo cargar el chat.</p>
            ) : (
              <>
                {mensajes.length === 0 ? (
                  <p>No hay mensajes aún.</p>
                ) : (
                  mensajes.map((msg, index) => (
                    <div
                      key={index}
                      className={`chat-message ${msg.emisor === remitente ? "sent" : "received"}`}
                    >
                      {msg.mensaje}
                    </div>
                  ))
                )}
              </>
            )}
          </div>

          <div className="chat-input-area">
            <input
              type="text"
              className="chat-input"
              placeholder="Escribe un mensaje..."
              value={mensaje}
              onChange={(e) => setMensaje(e.target.value)}
              onKeyDown={(e) => {
                if (e.key === 'Enter') {
                  e.preventDefault();
                  enviarMensaje();
                }
              }}
            />
            <button
              className="chat-send-button"
              onClick={enviarMensaje}
              disabled={!mensaje.trim()}
            >
              Enviar
            </button>
          </div>

        </main>
      </div>
    </div>
  );
}
