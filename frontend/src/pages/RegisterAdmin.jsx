//cambiar
import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import '../styles/RegisterAlly.css';
import aliadoImg from '../assets/aliado.jpg';

function RegisterAdmin() {

  const [formData, setFormData] = useState({});

  const navigate = useNavigate();
  
  const handleInput = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };
  
  const enviarFormulario = async (e) => {
    e.preventDefault();
    const datos = {
      usuario: {
        correoElectronico: formData.correo,
        contraseña: formData.contraseña,
        nombre: "Administrador "+ formData.nombre,
      },
      administrador: {
      },
      
    };
  
    console.log('📦 Enviando datos:', JSON.stringify(datos, null, 2));
  
    try {
      const res = await fetch('http://localhost:5000/api/admin', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(datos)
      });
  
      const responseData = await res.json();

    if (!res.ok) {
      throw new Error(responseData.error || 'Error en el servidor');
    }

    if (responseData.error) {
      alert(responseData.error);
    } else if (responseData.mensaje) {
      alert(responseData.mensaje);
      setTimeout(() => {
        navigate('/registration-success');
      }, 100);
    } else {
      alert('Registro exitoso, pero no se recibió mensaje de confirmación.');
      navigate('/registration-success');
    }
  } catch (error) {
    console.error('Error:', error);
    alert(`Error: ${error.message}`);
  }
};
    
  return (
    <div className="register-container">
      <div className="image-section">
        <img src={aliadoImg} alt="Aliado foto" />
      </div>
      <div className="form-section">
        <h1 className="title">Registrarme como administrador</h1>
            <div className="content-wrapper">
            <form className="form-grid">
                <div className="form-group">
                <label>Correo</label>
                <input className="form-input" type="text" name="correo" onChange={handleInput} />
                </div>
                <div className="form-group">
                <label>Contraseña</label>
                <input className="form-input" type="password" name="contraseña" onChange={handleInput} />
                </div>
                <div className="form-group">
                <label>Nombre completo</label>
                <input className="form-input" type="text" name="nombre" onChange={handleInput} />
                </div>
            </form>
                <button className="continue-button" onClick={enviarFormulario} >
                    CONTINUAR
                </button>          
            </div>
        </div>
    </div>
  );
}

export default RegisterAdmin;