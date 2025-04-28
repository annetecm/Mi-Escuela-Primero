import React, { useEffect, useState } from 'react';
import { useParams } from 'react-router-dom';
import "../styles/InformationUser.css";
import { useNavigate } from "react-router-dom";
import logo from '../assets/logo.png';
import profile from '../assets/profile.png';

function InformacionUser() {
  const { identificador, tipoUsuario } = useParams();
  const token = localStorage.getItem('token');
  const [userData, setUserData] = useState(null);
  const [editingField, setEditingField] = useState(null);
  const [newValue, setNewValue] = useState('');
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [adminData, setAdminData] = useState({ nombre: '', avatarUrl: '' });
  
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

  useEffect(() => {
    const fetchUserData = async () => {
      try {
        setLoading(true);
        setError(null);
        
        if (!identificador || !tipoUsuario) {
          throw new Error('Identificador o tipo de usuario no definido');
        }

        const tipoUsuarioL = tipoUsuario.toLowerCase();
        
        // Obtener datos principales de la escuela
        if (tipoUsuarioL === 'escuela') {
          const escuelaResponse = await fetch(`http://localhost:5000/api/admin/escuela/perfil/${identificador}`, {
            headers: {
              'Authorization': `Bearer ${token}`,
              'Content-Type': 'application/json'
            }
          });

          if (!escuelaResponse.ok) {
            throw new Error('Error al obtener datos de la escuela');
          }

          const escuelaData = await escuelaResponse.json();
          setUserData(escuelaData);

        } else {
          // Lógica para otros tipos de usuarios (aliado, administrador)
          const endpoint = tipoUsuarioL === 'aliado' 
            ? `http://localhost:5000/api/aliado/perfil/${identificador}`
            : `http://localhost:5000/api/admin/perfil/admin`;

          const response = await fetch(endpoint, {
            headers: {
              'Authorization': `Bearer ${token}`,
              'Content-Type': 'application/json'
            }
          });

          if (!response.ok) {
            throw new Error('Error al obtener datos del usuario');
          }

          const data = await response.json();
          setUserData(data);
        }
      } catch (err) {
        console.error('Error fetching user data:', err);
        setError(err.message);
      } finally {
        setLoading(false);
      }
    };

    fetchUserData();
  }, [identificador, tipoUsuario, token]);

  const handleEditClick = (field) => {
    if (window.confirm(`¿Quieres editar el campo ${field}?`)) {
      setEditingField(field);
      setNewValue(userData?.[field] || '');
    }
  };

  const handleSaveClick = async () => {
    if (!editingField) return;
    
    try {
      const tipoUsuarioL = tipoUsuario.toLowerCase();
      const endpoint = tipoUsuarioL === 'escuela' 
        ? 'http://localhost:5000/api/admin/update' 
        : 'http://localhost:5000/api/aliado/update';
      
      const response = await fetch(endpoint, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`,
        },
        body: JSON.stringify({ 
          id: identificador, 
          field: editingField, 
          value: newValue 
        }),
      });

      if (!response.ok) {
        throw new Error('Error al actualizar el dato');
      }

      setUserData(prev => ({
        ...prev,
        [editingField]: newValue
      }));
      
      setEditingField(null);
      setNewValue('');
      alert('Dato actualizado correctamente');

    } catch (error) {
      console.error('Error updating data:', error);
      alert(`Error al actualizar: ${error.message}`);
    }
  };

  if (loading) {
    return <div className="loading">Cargando datos...</div>;
  }

  if (error) {
    return <div className="error">Error: {error}</div>;
  }

  if (!userData) {
    return <div>No se encontraron datos del usuario</div>;
  }

  const renderEditableField = (field, label, value) => {
    return (
      <div className="info-field">
        <strong>{label}:</strong>
        {editingField === field ? (
          <>
            <input
              type="text"
              value={newValue}
              onChange={(e) => setNewValue(e.target.value)}
            />
            <button onClick={handleSaveClick}>Guardar</button>
            <button onClick={() => setEditingField(null)}>Cancelar</button>
          </>
        ) : (
          <span onClick={() => handleEditClick(field)}>
            {value !== undefined && value !== null ? value.toString() : 'No disponible'}
          </span>
        )}
      </div>
    );
  };

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
              <img src= {profile} alt="Admin" className="admin-avatar" />
              <span className="admin-name">{adminData.nombre}</span>
            </div>
          </header>
    <div className="user-profile-container">
      
      {tipoUsuario.toLowerCase() === 'escuela' ? (
        <>
        <h1>Información de la Escuela</h1>
          <div className="school-section">
            <h2>Información General</h2>
            <div className="school-info">
              <h3>{userData.nombre || 'Escuela'}</h3>
              
              {renderNonEditableField('CCT', userData.CCT)}
              {renderNonEditableField('Correo', userData.correoElectronico)}
              {renderEditableField('direccion', 'Dirección', userData.direccion)}
              {renderEditableField('zonaEscolar', 'Zona Escolar', userData.zonaEscolar)}
              {renderEditableField('sectorEscolar', 'Sector Escolar', userData.sectorEscolar)}
              {renderEditableField('modalidad', 'Modalidad', userData.modalidad)}
              {renderEditableField('nivelEducativo', 'Nivel Educativo', userData.nivelEducativo)}
              {renderEditableField('tieneUSAER', 'Tiene USAER', userData.tieneUSAER ? 'Sí' : 'No')}
              {renderEditableField('numeroDocentes', 'Número de Docentes', userData.numeroDocentes)}
              {renderEditableField('estudiantesPorGrupo', 'Estudiantes por Grupo', userData.estudiantesPorGrupo)}
              {renderEditableField('controlAdministrativo', 'Control Administrativo', userData.controlAdministrativo)}
              {renderNonEditableField('Estado de Registro', userData.estadoRegistro)}
            </div>
          </div>

          {/* Información del Director */}
          {userData.director && (
            <div className="director-section">
              <h2>Información del Director</h2>
              <div className="info-section">
                {renderNonEditableField('Nombre', userData.director.nombre)}
                {renderNonEditableField('Correo Electrónico', userData.director.correoElectronico)}
                {renderNonEditableField('Teléfono', userData.director.telefono)}
                {renderNonEditableField('Posible Cambio de Plantel', userData.director.posibleCambioPlantel ? 'Sí' : 'No')}
              </div>
            </div>
          )}

          {/* Información del Supervisor */}
          {userData.supervisor && (
            <div className="supervisor-section">
              <h2>Información del Supervisor</h2>
              <div className="info-section">
                {renderNonEditableField('Nombre', userData.supervisor.nombre)}
                {renderNonEditableField('Correo Electrónico', userData.supervisor.correoElectronico)}
                {renderNonEditableField('Teléfono', userData.supervisor.telefono)}
                {renderNonEditableField('Posible Cambio de Zona', userData.supervisor.posibleCambioZona ? 'Sí' : 'No')}
                {renderNonEditableField('Medio de Contacto', userData.supervisor.medioContacto)}
                {renderNonEditableField('Antigüedad en la Zona', userData.supervisor.antiguedadZona)}
              </div>
            </div>
          )}

          {/* Mesa Directiva */}
          {userData.mesaDirectiva && (
            <div className="mesa-directiva-section">
              <h2>Mesa Directiva</h2>
              <div className="info-section">
                {renderNonEditableField('Cantidad de Personas', userData.mesaDirectiva.personasCantidad)}
              </div>
            </div>
          )}

          {/* Necesidades */}
          <div className="necesidades-section">
            <h2>Necesidades</h2>
            <div className="info-section">
              {renderArrayItems(userData.necesidades, (necesidad, index) => (
                <div key={index} className="necesidad-item">
                  {renderNonEditableField('Nombre', necesidad.nombre)}
                  {renderNonEditableField('Prioridad', necesidad.prioridad)}
                  {renderNonEditableField('Categoría', necesidad.categoria)}
                </div>
              ))}
            </div>
          </div>

          {/* Apoyos Previos */}
          {userData.apoyosPrevios && userData.apoyosPrevios.length > 0 && (
            <div className="apoyos-section">
              <h2>Apoyos Previos</h2>
              <div className="info-section">
                {renderArrayItems(userData.apoyosPrevios, (apoyo, index) => (
                  <div key={index} className="apoyo-item">
                    {renderNonEditableField('Nombre', apoyo.nombre)}
                    {renderNonEditableField('Descripción', apoyo.descripcion)}
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* Trámites de Gobierno */}
          {userData.tramitesGobierno && userData.tramitesGobierno.length > 0 && (
            <div className="tramites-section">
              <h2>Trámites de Gobierno</h2>
              <div className="info-section">
                {renderArrayItems(userData.tramitesGobierno, (tramite, index) => (
                  <div key={index} className="tramite-item">
                    {renderNonEditableField('Estado', tramite.estado)}
                    {renderNonEditableField('Folio Oficial', tramite.folioOficial)}
                    {renderNonEditableField('Nivel de Gobierno', tramite.nivelGobierno)}
                    {renderNonEditableField('Descripción', tramite.descripcion)}
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* Documentos */}
          {userData.documentos && userData.documentos.length > 0 && (
            <div className="documentos-section">
              <h2>Documentos</h2>
              <div className="info-section">
                {renderArrayItems(userData.documentos, (documento, index) => (
                  <div key={index} className="documento-item">
                    {renderNonEditableField('Nombre', documento.nombre)}
                    {renderNonEditableField('Fecha de Carga', documento.fechaCarga)}
                    <a href={documento.ruta} target="_blank" rel="noopener noreferrer">Ver documento</a>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* Conexiones */}
          {userData.conexiones && userData.conexiones.length > 0 && (
            <div className="conexiones-section">
              <h2>Conexiones</h2>
              <div className="info-section">
                <table className="conexiones-table">
                  <thead>
                    <tr>
                      <th>Nombre de Necesidad</th>
                      <th>Nombre del Apoyo</th>
                      <th>Nombre del Aliado</th>
                      <th>Fecha Inicio</th>
                      <th>Fecha Fin</th>
                      <th>Estado</th>
                    </tr>
                  </thead>
                  <tbody>
                    {userData.conexiones.map((conexion, index) => (
                      <tr key={index}>
                        <td>{conexion.necesidadNombre || 'No disponible'}</td>
                        <td>{conexion.apoyoNombre || 'No disponible'}</td>
                        <td>{conexion.aliadoNombre || 'No disponible'}</td>
                        <td>{new Date(conexion.fechaInicio).toLocaleDateString()}</td>
                        <td>{conexion.fechaFin ? new Date(conexion.fechaFin).toLocaleDateString() : 'En curso'}</td>
                        <td>{conexion.estado}</td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>
          )}
        </>
      ) : 
        tipoUsuario.toLowerCase() ==='aliado'?(
        <div className="user-info">
          <h2>{userData.nombre || 'Usuario'}</h2>
          <div className="info-field">
            <strong>Correo Electrónico:</strong>
            {editingField === 'correoElectronico' ? (
              <>
                <input
                  type="text"
                  value={newValue}
                  onChange={(e) => setNewValue(e.target.value)}
                />
                <button onClick={handleSaveClick}>Guardar</button>
                <button onClick={() => setEditingField(null)}>Cancelar</button>
              </>
            ) : (
              <span onClick={() => handleEditClick('correoElectronico')}>
                {userData.correoElectronico || 'No disponible'}
              </span>
            )}
          </div>
        </div>
          ):(
            <div className="user-info">
            <h2>{userData.nombre || 'Usuario'}</h2>
            
            <div className="info-field">
              <strong>Correo Electrónico:</strong>
              {editingField === 'correoElectronico' ? (
                <>
                  <input
                    type="text"
                    value={newValue}
                    onChange={(e) => setNewValue(e.target.value)}
                  />
                  <button onClick={handleSaveClick}>Guardar</button>
                  <button onClick={() => setEditingField(null)}>Cancelar</button>
                </>
              ) : (
                <span onClick={() => handleEditClick('correoElectronico')}>
                  {userData.correoElectronico || 'No disponible'}
                </span>
              )}
            </div>
          </div> 
          )}
      </div>
    </div>
  );
}

export default InformacionUser;