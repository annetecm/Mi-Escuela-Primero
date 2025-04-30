import React, { useState, useEffect } from "react";
import { useNavigate, useParams, useLocation } from "react-router-dom";
import "../styles/InformationUser.css";
import logo from '../assets/logo.png';
import profile from '../assets/profile.png';

export default function ConexionesAdmin() {
    const { conexionId } = useParams();
    const location = useLocation();
    const [conexionData, setConexionData] = useState(null);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);
    const navigate = useNavigate();
    const [adminData, setAdminData] = useState({ nombre: '', avatarUrl: '' });
    const [editingField, setEditingField] = useState(null);
    const [newValue, setNewValue] = useState('');

  // Handle edit click
  const handleEditClick = (field) => {
    setEditingField(field);
    // Set the current value to the field being edited
    setNewValue(''); // You would set this to the current value
  };

  // Handle save click
  const handleSaveClick = () => {
    // Save logic here
    setEditingField(null);
  };

  // Get admin profile info
  useEffect(() => {
    const token = localStorage.getItem("token");
    if (!token) {
      setError("No se encontró token de autenticación");
      setLoading(false);
      return;
    }
  
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

  // Fetch connection data
  useEffect(() => {
    const token = localStorage.getItem("token");
    if (!token) {
      setError("No se encontró token de autenticación");
      setLoading(false);
      return;
    }
    
    const fetchConexionData = async () => {
      try {
        setLoading(true);
        setError(null);
        
        console.log(`Fetching connection data for ID: ${conexionId}`);
        const conexionResponse = await fetch(`http://localhost:5000/api/admin/info/conexion/${conexionId}`, {
          headers: {
            'Authorization': `Bearer ${token}`,
            'Content-Type': 'application/json'
          }
        });
        
        if (!conexionResponse.ok) {
          const errorData = await conexionResponse.json();
          throw new Error(errorData.details || 'Error al obtener datos de la conexión');
        }

        const data = await conexionResponse.json();
        console.log("Connection data received:", data);
        setConexionData(data);
      } catch (err) {
        console.error('Error fetching connection data:', err);
        setError(err.message);
      } finally {
        setLoading(false);
      }
    };

    if (conexionId) {
      fetchConexionData();
    } else {
      setError("ID de conexión no proporcionado");
      setLoading(false);
    }
  }, [conexionId]);

  if (loading) {
    return <div className="loading">Cargando datos...</div>;
  }

  if (error) {
    return <div className="error">Error: {error}</div>;
  }

  if (!conexionData || !conexionData.conexiones || conexionData.conexiones.length === 0) {
    return <div className="no-data">No se encontraron datos para esta conexión</div>;
  }

  const renderNonEditableField = (label, value) => {
    return (
      <div className="info-field">
        <strong>{label}:</strong>
        <span>{value !== undefined && value !== null ? value.toString() : 'No disponible'}</span>
      </div>
    );
  };

  const renderArrayItems = (items, renderItem) => {
    if (!items || items.length === 0) {
      return <p>No hay elementos registrados</p>;
    }
    
    return (
      <div className="array-items">
        {items.map((item, index) => renderItem(item, index))}
      </div>
    );
  };
      
  return (
    <div className="usuario-escuela-panel-container">
      {/* Header */}
      <header className="usuario-escuela-panel-header">
        <div className="usuario-escuela-logo-container">
          <img src={logo} alt="Logo" className="usuario-escuela-logo" />
          <h1 className="usuario-escuela-header-title">Panel de control</h1>
        </div>
        <div className="admin-info">
          <img src={profile} alt="Admin" className="admin-avatar" />
          <span className="admin-name">{adminData.nombre}</span>
        </div>
      </header>
      
      <div className="user-profile-container">
        <h1>Información de la Conexión</h1>
        {/* Detalles de la conexión */}
        <div className="documentos-section">
          <h2>Detalles de la Conexión</h2>
          <div className="info-section">
            {renderArrayItems(conexionData.conexiones, (conexion, index) => (
             
                <div key={index} className="documento-item">
                  {renderNonEditableField('ID de Conexión', conexion.conexionId)}
                  {renderNonEditableField('Nombre de la escuela', conexion.escuelaNombre)}
                  {renderNonEditableField('Necesidad', conexion.necesidadNombre)}
                  {renderNonEditableField('Nombre del aliado', conexion.aliadoNombre)}
                  {renderNonEditableField('Tipo de aliado', conexion.tipoUsuario)}
                  {renderNonEditableField('Apoyo', conexion.apoyoNombre)}
                  {renderNonEditableField('Fecha de Inicio', conexion.fechaInicio)}
                  {renderNonEditableField('Fecha de Fin', conexion.fechaFin)}
                  {renderNonEditableField('Estado', conexion.estado + " 🖊️")}

                  <button
                    className="chat-button"
                    style={{
                      marginTop: '1rem',
                      padding: '0.5rem 1rem',
                      backgroundColor: '#28a745',
                      color: 'white',
                      border: 'none',
                      borderRadius: '5px',
                      cursor: 'pointer'
                    }}
                    onClick={() => {
                      localStorage.removeItem("tipo");
                      localStorage.removeItem("aliadoId");
                      localStorage.removeItem("cct");
                      navigate(`/chat/conexion/${conexion.conexionId}`);
                    }}                    
                  >
                    Abrir chat
                  </button>
                  <button
                    className="chat-button"
                    style={{
                      marginTop: '1rem',
                      padding: '0.5rem 1rem',
                      backgroundColor: '#28a745',
                      color: 'white',
                      border: 'none',
                      borderRadius: '5px',
                      cursor: 'pointer'
                    }}
                  
                    onClick={() => navigate(`/administrador/evidencia/${conexion.conexionId}`, {
                      state: { CCT: conexion.CCT }
                    })}
                    >
                    Ver evidencias
                  </button>
                </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}