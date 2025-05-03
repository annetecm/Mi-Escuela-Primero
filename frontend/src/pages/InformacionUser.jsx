import React, { useEffect, useState } from 'react';
import { useParams } from 'react-router-dom';
import "../styles/InformationUser.css";
import { useNavigate } from "react-router-dom";
import logo from '../assets/logo.png';
import profile from '../assets/profile.png';

function InformacionUser() {
  const navigate = useNavigate();
  const { identificador, tipoUsuario } = useParams();
  const token = localStorage.getItem('token');
  const [userData, setUserData] = useState(null);
  const [editingField, setEditingField] = useState(null);
  const [newValue, setNewValue] = useState('');
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [adminData, setAdminData] = useState({ nombre: '', avatarUrl: '' });
  const [editMode, setEditMode] = useState(false);
  const [editedData, setEditedData] = useState({});
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

  //get de los datos de usuario
  useEffect(() => {
    const fetchUserData = async () => {
      try {
        setLoading(true);
        setError(null);
        
        if (!identificador || !tipoUsuario) {
          throw new Error('Identificador o tipo de usuario no definido');
        }

        const tipoUsuarioL = tipoUsuario.toLowerCase();
        console.log(tipoUsuarioL);
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

        } else if (tipoUsuarioL === 'aliado de persona fisica'){ 
          const aliadoResponse = await fetch(`http://localhost:5000/api/admin/aliado/fisica/perfil/${identificador}`, {
            headers: {
              'Authorization': `Bearer ${token}`,
              'Content-Type': 'application/json'
            }
          });

          if (!aliadoResponse.ok) {
            throw new Error('Error al obtener datos del aliado Fisico');
          }

          const aliadoData = await aliadoResponse.json();
          setUserData(aliadoData);
        }else if (tipoUsuarioL === 'aliado de persona moral'){ 
          const aliadoResponse = await fetch(`http://localhost:5000/api/admin/aliado/moral/perfil/${identificador}`, {
            headers: {
              'Authorization': `Bearer ${token}`,
              'Content-Type': 'application/json'
            }
          });

          if (!aliadoResponse.ok) {
            throw new Error('Error al obtener datos del aliado Moral');
          }

          const aliadoData = await aliadoResponse.json();
          setUserData(aliadoData);
        }else if (tipoUsuarioL === "administrador"){
          const adminResponse = await fetch(`http://localhost:5000/api/admin/administrador/perfil/${identificador}`, {
            headers: {
              'Authorization': `Bearer ${token}`,
              'Content-Type': 'application/json'
        }
          });

          if (!adminResponse.ok) {
            throw new Error('Error al obtener datos del admin');
          }

          const adminData = await adminResponse.json();
          setUserData(adminData);
        }else{
          console.log("error aqui");
        }
      } catch (err) {
        console.error('Error fetching user data:', err);
        setError(err.message);
      } finally {
        setLoading(false);
      }
    };
    if(!editMode){fetchUserData();}
    
  }, [identificador, tipoUsuario, token,editMode]);

  const handleEditClick = (field) => {
    if (window.confirm(`¿Quieres editar el campo ${field}?`)) {
      setEditingField(field);
      setNewValue(userData?.[field] || '');
    }
  };

// Handle input change for edit mode
const handleInputChange = (field, value) => {
  setEditedData(prev => ({
    ...prev,
    [field]: value
  }));
};

const hacerCorreo= async(nombreAdmin, correo)=>{
  //mandar correo
  const htmlCambios = `
  <html>
    <head>
      <style>
        body {
          font-family: 'Montserrat', sans-serif;
          background-color: #f5f5f5;
          margin: 0;
          padding: 30px;
        }
        .container {
          background: #fff;
          padding: 25px 30px;
          border-radius: 8px;
          box-shadow: 0 2px 8px rgba(0,0,0,0.1);
          max-width: 600px;
          margin: auto;
        }
        h2 {
          color: #019847;
          margin-bottom: 20px;
          font-size: 24px;
        }
        p {
          font-size: 16px;
          color: #555;
          margin-bottom: 15px;
        }
        ul {
          padding-left: 20px;
          margin-top: 15px;
        }
        li {
          margin-bottom: 10px;
          font-size: 15px;
          color: #333;
        }
        .highlight {
          font-weight: bold;
          color: #019847;
        }
      </style>
    </head>
    <body>
      <div class="container">
        <h2>Su usuario ha sido modificado</h2>
        <p><span class="highlight">Usuario que realizó el cambio:</span> ${nombreAdmin}</p>
        <p>Su usuario en la pagina mi escuela primero ha sido modificado.</p>
      </div>
    </body>
  </html>
`;

  try {
    await transporter.sendMail({
      from: '"Sistema de Notificaciones Mi Escuela Primero" <equiporeto6@gmail.com>',
      to: correo,
      subject: "Actualización de sus datos.",
      html: htmlCambios
    });
  } catch (error) {
    console.error("❌ Error al enviar correo:", error);
  }
}

const EliminarUsuario = async () => {
  let confirmacion = confirm("Seguro que quieres eliminar este usuario");
  if(confirmacion){
    try {
      const response = await fetch('http://localhost:5000/api/admin/eliminar', {
        method: 'DELETE',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`,
        },
        body: JSON.stringify({ 
          identificador: identificador,  
          tipoUsuario: tipoUsuario
        }),
      });

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.error || 'Error al eliminar el usuario');
      }

      const result = await response.json();
      alert('Usuario eliminado correctamente');
      navigate('/administrador/perfil');

    } catch (error) {
      console.error('Error eliminando usuario:', error);
      alert(`Error al eliminar: ${error.message}`);
    }
  }
};

// Save all edited fields
const handleSaveAllChanges = async () => {
  try {
    const response = await fetch('http://localhost:5000/api/admin/update-multiple', {
      method: 'PUT',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${token}`,
      },
      body: JSON.stringify({ 
        cct: identificador,
        data: editedData,
        tipoUsuario: tipoUsuario 
      }),
    });

    if (!response.ok) {
      const errorData = await response.json();
      throw new Error(errorData.error || 'Error al actualizar los datos');
    }

    const result = await response.json();
    
    setEditMode(false);
    alert('Datos actualizados correctamente');
    hacerCorreo(adminData.nombre, userData.correoElectronico);

  } catch (error) {
    console.error('Error updating data:', error);
    alert(`Error al actualizar: ${error.message}`);
  }
};

//aqui esta todo lo que se puede cambiar
  const toggleEditMode = () => {
    setEditMode(!editMode);
    const tipoUsuarioL = tipoUsuario.toLowerCase();

    if(tipoUsuarioL === 'escuela'){
      if (!editMode && userData) {
        // When entering edit mode, initialize editedData with current values
        const initialEditData = {
          direccion_escuela: userData.direccion || '',
          zonaEscolar: userData.zonaEscolar || '',
          sectorEscolar: userData.sectorEscolar || '',
          modalidad: userData.modalidad || '',
          nivelEducativo: userData.nivelEducativo || '',
          tieneUSAER: userData.tieneUSAER === undefined ? false : userData.tieneUSAER,
          numeroDocentes: userData.numeroDocentes || 0,
          estudiantesPorGrupo: userData.estudiantesPorGrupo || 0,
          controlAdministrativo: userData.controlAdministrativo || '',
          estadoRegistro_escuela: userData.estadoRegistro || ''
        };

        // Add director fields if they exist
        if (userData.director) {
          initialEditData.director_nombre = userData.director.nombre || '';
          initialEditData.director_correoElectronico = userData.director.correoElectronico || '';
          initialEditData.director_telefono = userData.director.telefono || '';
          initialEditData.director_posibleCambioPlantel = 
            userData.director.posibleCambioPlantel === undefined ? false : userData.director.posibleCambioPlantel;
        }

        // Add supervisor fields if they exist
        if (userData.supervisor) {
          initialEditData.supervisor_nombre = userData.supervisor.nombre || '';
          initialEditData.supervisor_correoElectronico = userData.supervisor.correoElectronico || '';
          initialEditData.supervisor_telefono = userData.supervisor.telefono || '';
          initialEditData.supervisor_posibleCambioZona = 
            userData.supervisor.posibleCambioZona === undefined ? false : userData.supervisor.posibleCambioZona;
          initialEditData.supervisor_medioContacto = userData.supervisor.medioContacto || 'whatsapp';
          initialEditData.supervisor_antiguedadZona = userData.supervisor.antiguedadZona || 0;
        }

        // Add mesa directiva fields if they exist
        if (userData.mesaDirectiva) {
          initialEditData.mesaDirectiva_personasCantidad = userData.mesaDirectiva.personasCantidad || 0;
        }
        setEditedData(initialEditData);
      }
    }else if (tipoUsuarioL === 'aliado de persona fisica'){
        if (!editMode && userData) {
          const initialEditData = {
            estadoRegistro_aliado_fisico: userData.estadoRegistro || ''
          };
          if (userData.persona_fisica) {
            initialEditData.razon_persona_fisica = userData.persona_fisica.razon || '';
            initialEditData.correo_persona_fisica = userData.persona_fisica.correoElectronico || '';
            initialEditData.telefono_persona_fisica = userData.persona_fisica.telefono || '';
          }
          setEditedData(initialEditData);
        }
    }else if(tipoUsuarioL === 'aliado de persona moral'){
        if(!editMode && userData){
          const initialEditData = {
            estadoRegistro_moral: userData.estadoRegistro || ''
          };
          if (userData.persona_moral) {
            initialEditData.area_persona_moral = userData.persona_moral.area || '';
            initialEditData.correo_persona_moral = userData.persona_moral.correoElectronico || '';
            initialEditData.telefono_persona_moral = userData.persona_moral.telefono || '';
          }
          if(userData.institucion){
            initialEditData.giro_institucion = userData.institucion.giro || '';
            initialEditData.domicilio_institucion = userData.institucion.domicilio || '';
            initialEditData.telefono_institucion = userData.institucion.telefono || '';
            initialEditData.paginaWeb_institucion = userData.institucion.paginaWeb || '';
          }
          if(userData.constancia_fisica){
            initialEditData.razon_social_constancia = userData.constancia_fisica.razonSocial || '';
            initialEditData.regimen_constancia = userData.constancia_fisica.regimen || '';
            initialEditData.domicilio_constancia = userData.constancia_fisica.domicilio || '';
          }
          if(userData.representante){
            initialEditData.nombre_representante = userData.representante.nombre|| '';
            initialEditData.correo_representante = userData.representante.correo || '';
            initialEditData.telefono_representante = userData.representante.telefono || '';
            initialEditData.area_representante = userData.representante.area || '';
          }
          setEditedData(initialEditData);
          
        }
    }else{
      if (!editMode && userData) {
        const initialEditData = {
          estadoRegistro_admin: userData.estadoRegistro || ''
        };
      }
      setEditedData(initialEditData);
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
    if (editMode) {
      return (
        <div className="info-field">
          <strong>{label}:</strong>
          <input
            type="text"
            value={editedData[field] !== undefined ? editedData[field] : (value || '')}
            onChange={(e) => handleInputChange(field, e.target.value)}
          />
        </div>
      );
    }
    
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
        {editMode ? (
              <div className="edit-buttons">
                <button className="save-button" onClick={handleSaveAllChanges}>Guardar Cambios</button>
                <button className="cancel-button" onClick={toggleEditMode}>Cancelar</button>
                <button className="cancel-button" onClick={EliminarUsuario}>Eliminar Usuario</button>
              </div>
            ) : (
              <button className="edit-button" onClick={toggleEditMode}>Editar Información</button>
            )}
          <div className="school-section">
            <h2>Información General</h2>
            <div className="school-info">
              <h3>{userData.nombre || 'Escuela'}</h3>
              
              {renderNonEditableField('CCT', userData.CCT)}
              {renderNonEditableField('Correo', userData.correoElectronico)}
              {editMode ?
                renderEditableField('direccion_escuela', 'Dirección', userData.direccion):
                renderNonEditableField('Dirección', userData.direccion)
              }
              {editMode?
                renderEditableField('zonaEscolar', 'Zona Escolar', userData.zonaEscolar):
                renderNonEditableField('Zona Escolar', userData.zonaEscolar)}
              {editMode?
                renderEditableField('sectorEscolar', 'Sector Escolar', userData.sectorEscolar):
                renderNonEditableField('Sector Escolar', userData.sectorEscolar)}
              {editMode?
                renderEditableField('modalidad', 'Modalidad', userData.modalidad):
                renderNonEditableField('Modalidad', userData.modalidad)}
              {editMode? 
                renderEditableField('nivelEducativo', 'Nivel Educativo', userData.nivelEducativo):
                renderNonEditableField('Nivel Educativo', userData.nivelEducativo)}
              {editMode?
                renderEditableField('tieneUSAER', 'Tiene USAER', userData.tieneUSAER ? 'Sí' : 'No'):
                renderNonEditableField('Tiene USAER', userData.tieneUSAER ? 'Sí' : 'No')}
              {editMode?
                renderEditableField('numeroDocentes', 'Número de Docentes', userData.numeroDocentes):
                renderNonEditableField('Número de Docentes', userData.numeroDocentes)}
              {editMode?
                renderEditableField('estudiantesPorGrupo', 'Estudiantes por Grupo', userData.estudiantesPorGrupo):
                renderNonEditableField('Estudiantes por Grupo', userData.estudiantesPorGrupo)}
              {editMode?
                renderEditableField('controlAdministrativo', 'Control Administrativo', userData.controlAdministrativo):
                renderNonEditableField('Control Administrativo', userData.controlAdministrativo)}
              {editMode?
                renderEditableField('estadoRegistro_escuela','Estado de Registro', userData.estadoRegistro):
                renderNonEditableField('Estado de Registro', userData.estadoRegistro)}
            </div>
          </div>

          {/* Información del Director */}
          {userData.director && (
            <div className="director-section">
              <h2>Información del Director</h2>
              <div className="info-section">
                {editMode?
                  renderEditableField('director_nombre','Nombre', userData.director.nombre):
                  renderNonEditableField('Nombre', userData.director.nombre)}
                {editMode?
                  renderEditableField('director_correoElectronico','Correo Electrónico', userData.director.correoElectronico):
                  renderNonEditableField('Correo Electrónico', userData.director.correoElectronico)}
                {editMode?
                  renderEditableField('director_telefono', 'Teléfono', userData.director.telefono):
                  renderNonEditableField('Teléfono', userData.director.telefono)}
                {editMode?
                  renderEditableField('director_posibleCambioPlantel','Posible Cambio de Plantel', userData.director.posibleCambioPlantel ? 'Sí' : 'No'):
                  renderNonEditableField('Posible Cambio de Plantel', userData.director.posibleCambioPlantel ? 'Sí' : 'No')}
              </div>
            </div>
          )}

          {/* Información del Supervisor */}
          {userData.supervisor && (
            <div className="supervisor-section">
              <h2>Información del Supervisor</h2>
              <div className="info-section">
                {editMode?
                  renderEditableField('supervisor_nombre','Nombre', userData.supervisor.nombre):
                  renderNonEditableField('Nombre', userData.supervisor.nombre)
                }
                {editMode?
                  renderEditableField('supervisor_correoElectronico','Correo Electrónico', userData.supervisor.correoElectronico):
                  renderNonEditableField('Correo Electrónico', userData.supervisor.correoElectronico)}
                {editMode?
                  renderEditableField('supervisor_telefono','Teléfono', userData.supervisor.telefono):
                  renderNonEditableField('Teléfono', userData.supervisor.telefono)}
                {editMode?
                  renderEditableField('supervisor_posibleCambioZona','Posible Cambio de Zona', userData.supervisor.posibleCambioZona ? 'Sí' : 'No'):
                  renderNonEditableField('Posible Cambio de Zona', userData.supervisor.posibleCambioZona ? 'Sí' : 'No')}
                {editMode?
                  renderEditableField('supervisor_medioContacto','Medio de Contacto', userData.supervisor.medioContacto || 'Whatsapp'):
                  renderNonEditableField('Medio de Contacto', userData.supervisor.medioContacto || 'Whatsapp')}
                {editMode?
                  renderEditableField('supervisor_antiguedadZona', 'Antigüedad en la Zona', userData.supervisor.antiguedadZona):
                  renderNonEditableField('Antigüedad en la Zona', userData.supervisor.antiguedadZona)}
              </div>
            </div>
          )}

          {/* Mesa Directiva */}
          {userData.mesaDirectiva && (
            <div className="mesa-directiva-section">
              <h2>Mesa Directiva</h2>
              <div className="info-section">
                {editMode?
                  renderEditableField('mesaDirectiva_personasCantidad','Cantidad de Personas', userData.mesaDirectiva.personasCantidad):
                  renderNonEditableField('Cantidad de Personas', userData.mesaDirectiva.personasCantidad)}
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
                    {renderNonEditableField('Ruta', documento.ruta)}
                    {renderNonEditableField('Fecha de Carga', documento.fechaCarga)}
                    {renderNonEditableField('Tipo', documento.tipo)}
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
                      <th></th>
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
                        <td onClick={() => navigate(`/administrador/conexiones/${conexion.id}`)}>🔍</td>
                        <td>{conexion.necesidadNombre || 'No disponible'}</td>
                        <td>{conexion.apoyoNombre || 'No disponible'}</td>
                        <td onClick={() => navigate(`/administrador/informacion/${conexion.aliadoId}/${conexion.tipoUsuario}`)}>{(conexion.aliadoNombre + " 🔍" )|| 'No disponible'}</td>
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
        tipoUsuario.toLowerCase() ==='aliado de persona fisica'?(
          <>
            <h1>Información del Aliado de Persona Fisica</h1>
            {editMode ? (
              <div className="edit-buttons">
                <button className="save-button" onClick={handleSaveAllChanges}>Guardar Cambios</button>
                <button className="cancel-button" onClick={toggleEditMode}>Cancelar</button>
                <button className="cancel-button" onClick={EliminarUsuario}>Eliminar Usuario</button>
              </div>
            ) : (
              <button className="edit-button" onClick={toggleEditMode}>Editar Información</button>
            )}
            <div className="school-section">
              <h2>Información General</h2>
              <div className="school-info">
                <h3>{userData.nombre || 'Aliado de persona fisica'}</h3>
                    {renderNonEditableField('Correo', userData.correoElectronico)}
                    {editMode?
                      renderEditableField('estadoRegistro_aliado_fisico', 'Estado de Registro', userData.estadoRegistro):
                      renderNonEditableField('Estado de Registro', userData.estadoRegistro)}
              </div>
            </div>
            {/* Información de Persona Fisica*/}
              {userData.persona_fisica && (
                <div className="director-section">
                  <h2>Información de Persona Fisica</h2>
                  <div className="info-section">
                    {renderNonEditableField('CURP', userData.persona_fisica.curp)}
                    {editMode?
                      renderEditableField('razon_persona_fisica','Razón', userData.persona_fisica.razon)
                      :renderNonEditableField('Razón', userData.persona_fisica.razon)}
                    {editMode?
                      renderEditableField('correo_persona_fisica','Correo Electrónico', userData.persona_fisica.correoElectronico):
                      renderNonEditableField('Correo Electrónico', userData.persona_fisica.correoElectronico)}
                    {editMode?
                      renderEditableField('telefono_persona_fisica', 'Teléfono', userData.persona_fisica.telefono):
                      renderNonEditableField('Teléfono', userData.persona_fisica.telefono)}
                  </div>
                </div>
              )}
            {/*Apoyos */}
            <div className="necesidades-section">
              <h2>Apoyos</h2>
              <div className="info-section">
                {renderArrayItems(userData.apoyos, (apoyo, index) => (
                  <div key={index} className="necesidad-item">
                    {renderNonEditableField('Tipo', apoyo.tipo)}
                    {renderNonEditableField('Caracteristicas', apoyo.caracteristicas)}
                    </div>
                ))}
              </div>
            </div>
            {/* Documentos */}
            {userData.documentos && userData.documentos.length > 0 && (
              <div className="documentos-section">
                <h2>Documentos</h2>
                <div className="info-section">
                  {renderArrayItems(userData.documentos, (documento, index) => (
                    <div key={index} className="documento-item">
                      {renderNonEditableField('Nombre', documento.nombre)}
                      {renderNonEditableField('Nombre', documento.ruta)}
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
                        <th> </th>
                        <th>Nombre de Necesidad</th>
                        <th>Nombre del Apoyo</th>
                        <th>Nombre de la Escuela</th>
                        <th>Fecha Inicio</th>
                        <th>Fecha Fin</th>
                        <th>Estado</th>
                      </tr>
                    </thead>
                    <tbody>
                      {userData.conexiones.map((conexion, index) => (
                        <tr key={index}>
                          <td onClick={() => navigate(`/administrador/conexiones/${conexion.id}`)}>🔍</td>
                          <td>{conexion.necesidadNombre || 'No disponible'}</td>
                          <td>{conexion.apoyoNombre || 'No disponible'}</td>
                          <td onClick={() => navigate(`/administrador/informacion/${conexion.CCT}/Escuela`)}>{(conexion.escuelaNombre + " 🔍" )|| 'No disponible'}</td>
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
          ):(
            tipoUsuario.toLowerCase() === 'aliado de persona moral'?(
              <>
              <h1>Información del Aliado de Persona Moral</h1>
              {editMode ? (
              <div className="edit-buttons">
                <button className="save-button" onClick={handleSaveAllChanges}>Guardar Cambios</button>
                <button className="cancel-button" onClick={toggleEditMode}>Cancelar</button>
                <button className="cancel-button" onClick={EliminarUsuario}>Eliminar Usuario</button>
              </div>
            ) : (
              <button className="edit-button" onClick={toggleEditMode}>Editar Información</button>
            )}
            <div className="school-section">
              <h2>Información General</h2>
              <div className="school-info">
                <h3>{userData.nombre || 'Aliado de persona fisica'}</h3>
                    {renderNonEditableField('Correo', userData.correoElectronico)}
                    {editMode?
                      renderEditableField('estadoRegistro_moral','Estado de Registro', userData.estadoRegistro):
                      renderNonEditableField('Estado de Registro', userData.estadoRegistro)}
              </div>
            </div>
            {/* Información de Persona Moral*/}
              {userData.persona_moral && (
                <div className="director-section">
                  <h2>Información de Persona Moral</h2>
                  <div className="info-section">
                    {renderNonEditableField('RFC', userData.persona_moral.rfc)}
                    {editMode?
                      renderEditableField('area_persona_moral','Area', userData.persona_moral.area):
                      renderNonEditableField('Area', userData.persona_moral.area)}
                    {editMode?
                      renderEditableField('correo_persona_moral','Correo Electrónico', userData.persona_moral.correoElectronico):
                      renderNonEditableField('Correo Electrónico', userData.persona_moral.correoElectronico)}
                    {editMode?
                      renderEditableField('telefono_persona_moral','Teléfono', userData.persona_moral.telefono):
                      renderNonEditableField('Teléfono', userData.persona_moral.telefono)}
                  </div>
                </div>
              )}
            {/* Información de Institucion*/}
            {userData.institucion && (
                <div className="director-section">
                  <h2>Información de Institución</h2>
                  <div className="info-section">
                    {editMode?
                      renderEditableField('giro_institucion','Giro', userData.institucion.giro):
                      renderNonEditableField('Giro', userData.institucion.giro)}
                    {editMode?
                      renderEditableField('domicilio_institucion','Domicilio', userData.institucion.domicilio):
                      renderNonEditableField('Domicilio', userData.institucion.domicilio)}
                    {editMode?
                      renderEditableField('telefono_institucion','Teléfono', userData.institucion.telefono):
                      renderNonEditableField('Teléfono', userData.institucion.telefono)}
                    {editMode?
                      renderEditableField('paginaWeb_institucion','Pagina Web', userData.institucion.paginaWeb):
                      renderNonEditableField('Pagina Web', userData.institucion.paginaWeb)}
                  </div>
                </div>
              )}
            {/* Información de Escritura*/}
            {userData.escritura_publica && (
                <div className="director-section">
                  <h2>Información de Escritura Publica</h2>
                  <div className="info-section">
                    {renderNonEditableField('Número de Escritura', userData.escritura_publica.numero)}
                    {renderNonEditableField('Notario', userData.escritura_publica.notario)}
                    {renderNonEditableField('Ciudad', userData.escritura_publica.ciudad)}
                  </div>
                </div>
              )}
            {/* Información de Constancia*/}
            {userData.constancia_fisica && (
              <div className="director-section">
                <h2>Información de Constancia Física</h2>
                <div className="info-section">
                {editMode?
                    renderEditableField('razon_social_constancia','Razon Social', userData.constancia_fisica.razonSocial):
                    renderNonEditableField('Razon Social', userData.constancia_fisica.razonSocial)}
                  
                  {editMode?
                    renderEditableField('regimen_constancia','Régimen', userData.constancia_fisica.regimen):
                    renderNonEditableField('Régimen', userData.constancia_fisica.regimen)}
                  {editMode?
                    renderEditableField('domicilio_constancia','Domicilio', userData.constancia_fisica.domicilio):
                    renderNonEditableField('Domicilio', userData.constancia_fisica.domicilio)}
                </div>
              </div>
              )}
            {/* Información de Representante*/}
            {userData.representante && (
              <div className="director-section">
                <h2>Información del Representante</h2>
                <div className="info-section">
                {editMode?
                    renderEditableField('nombre_representante','Nombre', userData.representante.nombre):
                    renderNonEditableField('Nombre', userData.representante.nombre)}
                  
                  {editMode?
                    renderEditableField('correo_representante','Correo Electrónico', userData.representante.correo):
                    renderNonEditableField('Correo Electrónico', userData.representante.correo)}
                  {editMode?
                    renderEditableField('telefono_representante','Teléfono', userData.representante.telefono):
                    renderNonEditableField('Teléfono', userData.representante.telefono)}
                  {editMode?
                    renderEditableField('area_representante', 'Area', userData.representante.area):
                    renderNonEditableField('Area', userData.representante.area)}
                </div>
              </div>
              )}
            
            {/*Apoyos */}
            <div className="necesidades-section">
              <h2>Apoyos</h2>
              <div className="info-section">
                {renderArrayItems(userData.apoyos, (apoyo, index) => (
                  <div key={index} className="necesidad-item">
                    {renderNonEditableField('Tipo', apoyo.tipo)}
                    {renderNonEditableField('Caracteristicas', apoyo.caracteristicas)}
                    </div>
                ))}
              </div>
            </div>
            {/* Documentos */}
            {userData.documentos && userData.documentos.length > 0 && (
              <div className="documentos-section">
                <h2>Documentos</h2>
                <div className="info-section">
                  {renderArrayItems(userData.documentos, (documento, index) => (
                    <div key={index} className="documento-item">
                      {renderNonEditableField('Nombre', documento.nombre)}
                      {renderNonEditableField('Nombre', documento.ruta)}
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
                        <th></th>
                        <th>Nombre de Necesidad</th>
                        <th>Nombre del Apoyo</th>
                        <th>Nombre de la Escuela</th>
                        <th>Fecha Inicio</th>
                        <th>Fecha Fin</th>
                        <th>Estado</th>
                      </tr>
                    </thead>
                    <tbody>
                      {userData.conexiones.map((conexion, index) => (
                        <tr key={index}>
                          <td onClick={() => navigate(`/administrador/conexiones/${conexion.id}`)}>🔍</td>
                          <td>{conexion.necesidadNombre || 'No disponible'}</td>
                          <td>{conexion.apoyoNombre || 'No disponible'}</td>
                          <td onClick={() => navigate(`/administrador/informacion/${conexion.CCT}/Escuela`)}>{(conexion.escuelaNombre + " 🔍") || 'No disponible'}</td>
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
            ):(
              <>
                <h1>Información del Administrador</h1>
                {editMode ? (
                    <div className="edit-buttons">
                      <button className="save-button" onClick={handleSaveAllChanges}>Guardar Cambios</button>
                      <button className="cancel-button" onClick={toggleEditMode}>Cancelar</button>
                      <button className="cancel-button" onClick={EliminarUsuario}>Eliminar Usuario</button>
                    </div>
                  ) : (
                    <button className="edit-button" onClick={toggleEditMode}>Editar Información</button>
                  )}
                  <div className="school-section">
                    <h2>Información General</h2>
                    <div className="school-info">
                      <h3>{userData.nombre || 'Administrador'}</h3>
                      {renderNonEditableField('Correo', userData.correoElectronico)}
                      {editMode?
                        renderEditableField('estadoRegistro_admin','Estado de Registro', userData.estadoRegistro):
                        renderNonEditableField('Estado de Registro', userData.estadoRegistro)}
                    </div>
                  </div>
              </> 
            )
          )}
      </div>
    </div>
  );
}

export default InformacionUser;