import React, { useState, useEffect, useRef } from 'react';
import '../styles/PageAdmin.css';
import logo from '../assets/logo.png';
import profile from '../assets/profile.png';
import { useNavigate } from "react-router-dom"

const AdminPage = () => {
  const navigate = useNavigate()
  const [showMonitoreoMenu, setShowMonitoreoMenu] = useState(false);
  const [showCreateMenu, setShowCreateMenu] = useState(false);
  const [aliados, setAliados] = useState([]);
  const [adminData, setAdminData] = useState({ nombre: '', avatarUrl: '' });
  const [isLoading, setIsLoading] = useState(true);
  const monitoreoMenuRef = useRef(null);
  const createMenuRef = useRef(null);
  
  // Efecto para cerrar menús al hacer clic fuera de ellos
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
    
  // Perfiles no aprobados
  useEffect(() => {
    const token = localStorage.getItem("token");
      if (!token) return;

      fetch("http://localhost:5000/api/admin/fetch/noAprobado", {
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
        // Mapeamos los datos para que coincidan con la estructura esperada
        const perfilesNoAprobados = data.map(perfil => ({
          nombre: perfil.nombre_usuario,
          correo: perfil.correo_usuario || 'No especificado',
          identificador: perfil.identificador || 'No aplica',
          tipoUsuario: perfil.tipo_usuario,
          Estado:'Pendiente'
        }));
        setAliados(perfilesNoAprobados);
        setIsLoading(false);
      })
      .catch(error => {
        console.error('Error al obtener datos:', error);
        setIsLoading(false);
      });
}, []);

  const handleMonitoreoMenuToggle = () => {
    setShowMonitoreoMenu(!showMonitoreoMenu);
  };

  const handleCreateMenuToggle = () => {
    setShowCreateMenu(!showCreateMenu);
  };

  const handleCreateAliadoClick = () => {
    // Lógica para crear aliado
    console.log('Crear aliado');
    setShowCreateMenu(false);
  };

  const handleCreateEscuelaClick = () => {
    // Lógica para crear escuela
    console.log('Crear escuela');
    setShowCreateMenu(false);
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
                        <button className="admin-dropdown-item">Ver todos</button>
                        <button className="admin-dropdown-item">Ordenar por</button>
                        <button className="admin-dropdown-item">Filtrar</button>
                        <button className="admin-dropdown-item">Configuración</button>
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
                <button className="admin-dropdown-item" onClick={handleCreateAliadoClick}>
                  Crear cuenta de aliado
                </button>
                <button className="admin-dropdown-item" onClick={handleCreateEscuelaClick}>
                  Crear cuenta de escuela
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
                  <th>Teléfono</th>
                  <th>Correo</th>
                  <th>Identificador</th>
                  <th>Tipo de Usuario</th>
                  <th>Estado de Usuario</th>
                </tr>
              </thead>
              <tbody>
                {aliados.map(aliado => (
                  <tr key={aliado.nombre}>
                    <td className='admin-aliado-name'>{aliado.correo}</td>
                    <td className='admin-RFC'>{aliado.identificador}</td>
                    <td>{aliado.tipoUsuario}</td>
                    <td>{aliado.Estado}</td>
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
