import React, { useState, useEffect, useRef } from 'react';
import '../styles/PageAdmin.css';
import logo from '../assets/logo.png';
import profile from '../assets/profile.png';
import { useNavigate } from "react-router-dom"
import { useAuth } from "../contexts/AuthContext";


const AdminPage = () => {
  const navigate = useNavigate()
  const [showMonitoreoMenu, setShowMonitoreoMenu] = useState(false);
  const [showCreateMenu, setShowCreateMenu] = useState(false);
  const [aliados, setAliados] = useState([]);
  const [adminData, setAdminData] = useState({ nombre: '', avatarUrl: '' });
  const [isLoading, setIsLoading] = useState(true);
  const monitoreoMenuRef = useRef(null);
  const createMenuRef = useRef(null);
  
  // Cerrar menús al hacer clic fuera de ellos
  useEffect(() => {
    function handleClickOutside(event) {
      if (monitoreoMenuRef.current && !monitoreoMenuRef.current.contains(event.target)) {
        setShowMonitoreoMenu(false);
      }
      if (createMenuRef.current && !createMenuRef.current.contains(event.target)) {
        setShowCreateMenu(false);
      }
    }
    
    document.addEventListener('mousedown', handleClickOutside);
    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, [monitoreoMenuRef, createMenuRef]);

  //get del nombre del administrador
  useEffect(() => {
      const token = localStorage.getItem("token");
      if (!token) return;

      fetch("http://localhost:5000/api/admin/perfil/admin", {
        headers: {
          Authorization: `Bearer ${token}`
        }
      })
        .then(res => {
          if (!res.ok) {
            throw new Error(`HTTP error! status: ${res.status}`);
          }
          return res.json();
        })
        .then(data => {
          setAdminData(prevState => ({
            ...prevState,
            nombre: data.nombre || 'Administrador'
          }));
        })
        .catch(err => {
          console.error("Error al cargar perfil:", err);
          setAdminData(prevState => ({
            ...prevState,
            nombre: 'Administrador'
          }));
        });
  }, []);
    
  // Función para obtener aliados no aprobados
  const fetchAliados = async () => {
    const token = localStorage.getItem("token");
    if (!token) return;
    //ignorar error si no hay pendientes
    try {
      const res = await fetch("http://localhost:5000/api/admin/fetch/noAprobado", {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });

      if (!res.ok) {
        setAliados([]);
        setIsLoading(false);
        return;
      }

      const data = await res.json();

      const perfilesNoAprobados = data.map((perfil) => ({
        nombre: perfil.nombre_usuario || "Sin nombre",
        correo: perfil.correo_usuario || "Correo no especificado",
        identificador: perfil.identificador || "Identificador no disponible",
        tipoUsuario: perfil.tipo_usuario || "Tipo no definido",
        Estado: perfil.estado || "Estado desconocido",
      }));
      setAliados(perfilesNoAprobados);
      setIsLoading(false);
    } catch (error) {
      console.error("Error al obtener datos:", error);
      setIsLoading(false);
    }
  };

  useEffect(() => {
    fetchAliados();
  }, []);

  const handleMonitoreoMenuToggle = () => {
    setShowMonitoreoMenu(!showMonitoreoMenu);
  };

  const handleCreateMenuToggle = (e) => {
    e.stopPropagation();
    setShowCreateMenu(!showCreateMenu);
  };

  // Llamar a fetchAliados después de aprobar un usuario
  const handleAprobarClick = async (identificador, nombre, correo, nombreAdmin) => {
    const token = localStorage.getItem("token");
    if (!token) {
      console.error("Token no encontrado");
      return;
    }

    let confirmacion = confirm("Seguro que quieres aprobar esta cuenta " + nombre);
    if (confirmacion) {
      try {
        const response = await fetch("http://localhost:5000/api/admin/fetch/aprobar", {
          method: "PUT",
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${token}`,
          },
          body: JSON.stringify({ identificador, correo, nombreAdmin }),
        });

        if (!response.ok) {
          const errorData = await response.json();
          console.error("Error al aprobar usuario:", errorData);
          alert(`Error: ${errorData.error}`);
          return;
        }

        const data = await response.json();
        alert(data.message);

        // Actualizar la lista de aliados después de aprobar
        await fetchAliados();
      } catch (error) {
        console.error("Error al realizar la solicitud:", error);
        alert("Error al realizar la solicitud");
      }
    }
  };

  const { logout } = useAuth();

  const handleLogout = () => {
    navigate("/logout");
  };

  if (isLoading) {
    return <div className="admin-loading">Cargando...</div>;
  }

  return (
    <div className="admin-panel-container">
      {/* Header */}
      <header className="admin-panel-header">
        <div className="admin-logo-container">
          <img src={logo} alt="Logo" className="admin-logo" />
          <h1 className="admin-header-title">Panel de control</h1>
        </div>
        <div className="admin-info">
          <img src= {profile} alt="Admin" className="admin-avatar" />
          <span className="admin-name">{adminData.nombre}</span>
        </div>
      </header>

      {/* Main Content */}
      <div className="admin-main-content">
        {/* Sidebar */}
        <div className="admin-sidebar">
          <div className="admin-sidebar-header">
            <h2 className="admin-sidebar-title">Monitoreo</h2>
            <div className="admin-menu-dots-container" ref={monitoreoMenuRef}>
              <button 
                    className="admin-menu-dots-button" 
                    onClick={handleMonitoreoMenuToggle}
                    aria-label="Menú de opciones"
                  >
                    &#8230;
                    </button>

                    {showMonitoreoMenu && (
                    <div className="admin-dropdown-menu">
                      <button className="admin-dropdown-item" onClick={handleLogout}>Cerrar sesión</button> 
                    </div>
                  )}
              </div>
            </div>

          <button 
            className={`admin-menu-button`}
            onClick={() => navigate('/administrador/escuelas')}
          >
            <div className="admin-button-content">
              <span>Escuelas</span>
              <span className="admin-icon">🎓</span>
            </div>
          </button>
          
          <button 
            className={`admin-menu-button`}
            onClick={() => navigate('/administrador/aliados')}
          >
            <div className="admin-button-content">
              <span>Aliados</span>
              <span className="admin-icon">👐</span>
            </div>
          </button>

          <button 
            className={`admin-menu-button`}
            onClick={() => navigate('/administrador/administrador')}
          >
            <div className="admin-button-content">
              <span>Administrador</span>
              <span className="admin-icon">👤</span>
            </div>
          </button>

          <div className="admin-create-button-container" ref={createMenuRef}>
            <button 
                className="admin-create-button"
                onClick={handleCreateMenuToggle}
              >
                <div className="admin-plus-icon">+</div>
                <span>Crear cuenta</span>
              </button>

              {showCreateMenu && (
              <div className="admin-dropdown-menu">
                <button className="admin-dropdown-item" onClick={() =>navigate("/register-ally")}>
                  Crear cuenta de aliado
                </button>
                <button className="admin-dropdown-item" onClick={() =>navigate("/register-school")}>
                  Crear cuenta de escuela
                </button>
                <button className="admin-dropdown-item" onClick={() =>navigate("/register-admin")}>
                  Crear cuenta de administrador
                </button>
              </div>
            )}
          </div>
        </div>

        {/* Content Area */}
        <div className="admin-content-area">
          <div className="admin-table-container">
            <h2 className="admin-table-title">Cuentas sin aprobar</h2>
            {/*Cambiar todo a que den los no aprobados*/}
            
            <table className="admin-data-table">
              <thead>
                <tr>
                  <th>Nombre</th>
                  <th>Correo</th>
                  <th>Identificador</th>
                  <th>Tipo de Usuario</th>
                  <th>Estado de Usuario</th>
                </tr>
              </thead>
              <tbody>
                {aliados.map(aliado => (
                  <tr key={aliado.nombre}>
                    <td
                      className='admin-aliado-name'
                      onClick={() => navigate(`/administrador/informacion/${aliado.identificador}/${aliado.tipoUsuario}`)}
                    >
                      {aliado.nombre +" 🔍"}
                    </td>
                    <td>{aliado.correo}</td>
                    <td className='admin-RFC'>{aliado.identificador}</td>
                    <td>{aliado.tipoUsuario}</td>
                    <td onClick={() => handleAprobarClick(aliado.identificador, aliado.nombre, aliado.correo, adminData.nombre)}>
                        {aliado.Estado + " 🖊️"}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
              {aliados.length > 5 && (
                <div className="admin-pagination">
                  <button className="admin-pagination-arrow">&lt;</button>
                  <span className="admin-pagination-info">Página 1 de {Math.ceil(aliados.length / 5)}</span>
                  <button className="admin-pagination-arrow">&gt;</button>
                </div>
              )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default AdminPage;
