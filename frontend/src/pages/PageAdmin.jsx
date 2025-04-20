import React, { useState, useEffect, useRef } from 'react';
import '../styles/PageAdmin.css';
import logo from '../assets/logo.png';
import profile from '../assets/profile.png';

const PageAdmin = () => {
  const [activeTab, setActiveTab] = useState('aliados');
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


   // Simulación de obtención de datos desde la base de datos
   useEffect(() => {
    const fetchData = async () => {
      try {
        // En un caso real, estas serían llamadas a una API o base de datos
        // Simular una petición a la API
        await new Promise(resolve => setTimeout(resolve, 800));
        
        // default
        const datosAliados = [
          { id: 1, nombre: 'Aliado1', telefono: '1234567', correo: 'aliado@example', rfc: 'ASDFG' },
          { id: 2, nombre: 'Aliado2', telefono: '1234567', correo: 'aliado@example', rfc: 'ASDFG' },
          { id: 3, nombre: 'Aliado3', telefono: '1234567', correo: 'aliado@example', rfc: 'ASDFG' },
          { id: 4, nombre: 'Aliado4', telefono: '1234567', correo: 'aliado@example', rfc: 'ASDFG' },
          { id: 5, nombre: 'Aliado5', telefono: '1234567', correo: 'aliado@example', rfc: 'ASDFG' },
        ];
        
        const datosAdmin = {
          nombre: 'Nombre administrador',
          avatarUrl: profile // En un caso real sería la URL de la imagen del administrador
        };
        
        setAliados(datosAliados);
        setAdminData(datosAdmin);
        setIsLoading(false);
      } catch (error) {
        console.error('Error al obtener datos:', error);
        setIsLoading(false);
      }
    };
    
    fetchData();
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
    return <div className="loading">Cargando...</div>;
  }

  return (
    <div className="panel-container">
      {/* Header */}
      <header className="panel-header">
        <div className="logo-container">
          <img src={logo} alt="Logo" className="logo" />
          <h1 className="header-title">Panel de control</h1>
        </div>
        <div className="admin-info">
          <img src={adminData.avatarUrl} alt="Admin" className="admin-avatar" />
          <span className="admin-name">{adminData.nombre}</span>
        </div>
      </header>

      {/* Main Content */}
      <div className="main-content">
        {/* Sidebar */}
        <div className="sidebar">
          <div className="sidebar-header">
            <h2 className="sidebar-title">Monitoreo</h2>
            <div className="menu-dots-container" ref={monitoreoMenuRef}>
              <button 
                    className="menu-dots-button" 
                    onClick={handleMonitoreoMenuToggle}
                    aria-label="Menú de opciones"
                  >
                    &#8230;
                    </button>
                    {showMonitoreoMenu && (
                      <div className="dropdown-menu">
                        <button className="dropdown-item">Ver todos</button>
                        <button className="dropdown-item">Ordenar por</button>
                        <button className="dropdown-item">Filtrar</button>
                        <button className="dropdown-item">Configuración</button>
                      </div>
                  )}
              </div>
            </div>

          <button 
            className={`menu-button ${activeTab === 'escuelas' ? 'active' : ''}`}
            onClick={() => setActiveTab('escuelas')}
          >
            <div className="button-content">
              <span>Escuelas</span>
              <span className="icon">🎓</span>
            </div>
          </button>
          
          <button 
            className={`menu-button ${activeTab === 'aliados' ? 'active' : ''}`}
            onClick={() => setActiveTab('aliados')}
          >
            <div className="button-content">
              <span>Aliados</span>
              <span className="icon">👐</span>
            </div>
          </button>

          <div className="create-button-container" ref={createMenuRef}>
            <button 
                className="create-button"
                onClick={handleCreateMenuToggle}
              >
                <div className="plus-icon">+</div>
                <span>Crear cuenta</span>
              </button>

              {showCreateMenu && (
              <div className="dropdown-menu">
                <button className="dropdown-item" onClick={handleCreateAliadoClick}>
                  Crear cuenta de aliado
                </button>
                <button className="dropdown-item" onClick={handleCreateEscuelaClick}>
                  Crear cuenta de escuela
                </button>
              </div>
            )}
          </div>
        </div>


        {/* Content Area */}
        <div className="content-area">
          <div className="table-container">
            <h2 className="table-title">Cuentas de aliado activas</h2>
            
            <table className="data-table">
              <thead>
                <tr>
                  <th>Nombre</th>
                  <th>Teléfono</th>
                  <th>Correo</th>
                  <th>RFC</th>
                </tr>
              </thead>
              <tbody>
                {aliados.map(aliado => (
                  <tr key={aliado.id}>
                    <td className='aliado-name'>{aliado.nombre}</td>
                    <td>{aliado.telefono}</td>
                    <td >{aliado.correo}</td>
                    <td className='RFC'>{aliado.rfc}</td>
                  </tr>
                ))}
              </tbody>
            </table>
              {aliados.length > 5 && (
                <div className="pagination">
                  <button className="pagination-arrow">&lt;</button>
                  <span className="pagination-info">Página 1 de {Math.ceil(aliados.length / 5)}</span>
                  <button className="pagination-arrow">&gt;</button>
                </div>
              )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default PageAdmin;