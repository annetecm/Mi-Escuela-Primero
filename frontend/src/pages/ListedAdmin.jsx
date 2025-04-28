import React,{ useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import "../styles/InformationUser.css";
import logo from '../assets/logo.png';
import profile from '../assets/profile.png';

export default function ListedSchools() {
  const [userData, setUserData] = useState(null);
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
    const token = localStorage.getItem("token");
    if (!token) return;
    const fetchUserData= async ()=>{
    try {
        setLoading(true);
        setError(null);
        const escuelaResponse= await fetch("http://localhost:5000/api/admin/todosAdmin", {
            headers: {
                'Authorization': `Bearer ${token}`,
                'Content-Type': 'application/json'
            }
        });
        if (!escuelaResponse.ok) {
            throw new Error('Error al obtener datos de los administradores');
        }

        const escuelaData = await escuelaResponse.json();
        setUserData(escuelaData);
        } catch (err) {
            console.error('Error fetching user data:', err);
            setError(err.message);
        } finally {
            setLoading(false);
        }
        };

    fetchUserData();
  }, []);

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
          <img src={profile} alt="Admin" className="admin-avatar" />
          <span className="admin-name">{adminData.nombre}</span>
        </div>
      </header>
      <div className="user-profile-container">
        <h1>Información de los Administradores</h1>
        
        {/* Loading state */}
        {loading && <p>Cargando datos...</p>}
        
        {/* Error state */}
        {error && <p className="error-message">Error: {error}</p>}
        
        {/* Información general - Check if userData and userData.informacion exist */}
        {userData && userData.informacion && userData.informacion.length > 0 ? (
            <div className="documentos-section">
            <h2>Informacion General de los Administradores</h2>
            <div className="info-section">
                {renderArrayItems(userData.informacion, (documento, index) => (
                <div key={index} className="documento-item" onClick={() => navigate(`/administrador/informacion/${documento.id}/Administrador`)}>
                    {renderNonEditableField('Nombre ', documento.nombre +" 🔍")}
                    {renderNonEditableField('Correo Electronico ', documento.correoElectronico)}
                </div>
                ))}
            </div>
            </div>
        ) : !loading && (
            <p>No hay información de escuelas disponible</p>
        )}
            
        <div className="user-profile-container"></div>
        </div>
        </div>
  );
}