import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import aliadoImg from '../assets/aliado.jpg';
import '../styles/EditPhysical.css';


export default function EditPhysical() {
  const navigate = useNavigate();

  const [formData, setFormData] = useState({
    contraseña:'',
    correo: '',
    nombre: '',
    institucionLaboral: '',
    razon: '',
    telefono: '',
  });

  useEffect(() => {
    const token = localStorage.getItem("token");
    if (!token) return;

    fetch("http://localhost:5000/api/aliado/perfil", {
      headers: { Authorization: `Bearer ${token}` },
    })
      .then(res => res.json())
      .then(data => {
        setFormData({
          correo: data.correo,
          nombre: data.nombre,
          institucionLaboral: data.institucionLaboral,
          razon: data.razon,
          telefono: data.telefono,
          tipoDeApoyo: data.tipoDeApoyo
        });
      })
      .catch(err => console.error("Error al cargar datos del aliado:", err));
  }, []);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    const token = localStorage.getItem("token");

    try {
      const response = await fetch("http://localhost:5000/api/aliado/editar-datos", {
        method: "POST",
        headers: { "Content-Type": "application/json", Authorization: `Bearer ${token}` },
        body: JSON.stringify(formData)
      });

      if (!response.ok) throw new Error("Error actualizando datos");
      alert("Datos actualizados correctamente");
      navigate("/aliado/perfil");
    } catch (error) {
      console.error("Error:", error);
      alert("Error al actualizar información");
    }
  };

  return (
    <div className="editphysical-container">
      <div className="editphysical-image-section">
        <img src={aliadoImg} alt="Aliado" />
      </div>
      <div className="editphysical-form-section">
        <h1 className="editphysical-title">Editar Perfil - Persona Física</h1>
        <p className="editphysical-question">Actualiza tu información</p>

        <form onSubmit={handleSubmit} className="editphysical-form-grid">
          <div className="editphysical-form-group">
            <label>Correo electrónico</label>
            <input
              className="editphysical-form-input"
              type="email"
              name="correo"
              value={formData.correo}
              onChange={handleChange}
            />
          </div>
          <div className="editphysical-form-group">
  <label>Nueva contraseña</label>
  <input
    className="editphysical-form-input"
    type="password"
    name="contrasena"
    value={formData.contrasena}
    onChange={handleChange}
  />
</div>
          <div className="editphysical-form-group">
            <label>Nombre completo</label>
            <input
              className="editphysical-form-input"
              type="text"
              name="nombre"
              value={formData.nombre}
              onChange={handleChange}
            />
          </div>
          <div className="editphysical-form-group">
            <label>Institución laboral</label>
            <input
              className="editphysical-form-input"
              type="text"
              name="institucionLaboral"
              value={formData.institucionLaboral}
              onChange={handleChange}
            />
          </div>
          <div className="editphysical-form-group">
            <label>Razón de apoyo</label>
            <input
              className="editphysical-form-input"
              type="text"
              name="razon"
              value={formData.razon}
              onChange={handleChange}
            />
          </div>
          <div className="editphysical-form-group">
            <label>Teléfono</label>
            <input
              className="editphysical-form-input"
              type="text"
              name="telefono"
              value={formData.telefono}
              onChange={handleChange}
            />
          </div>
        

          <button type="submit" className="editphysical-continue-button">
            Guardar Cambios
          </button>
        </form>
      </div>
    </div>
  );
}
