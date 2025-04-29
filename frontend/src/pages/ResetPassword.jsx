import React, { useState } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import '../styles/RecoverPassword.css';
import logo from '../assets/logo1.png';

const ResetPassword = () => {
  const [nuevaContraseña, setNuevaContraseña] = useState('');
  const [confirmarContraseña, setConfirmarContraseña] = useState('');
  const [error, setError] = useState('');
  const [message, setMessage] = useState('');
  const navigate = useNavigate();
  const location = useLocation();

  const params = new URLSearchParams(location.search);
  const token = params.get('token');

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    setMessage('');

    if (!nuevaContraseña || !confirmarContraseña) {
      setError('Por favor llena todos los campos.');
      return;
    }

    if (nuevaContraseña !== confirmarContraseña) {
      setError('Las contraseñas no coinciden.');
      return;
    }

    try {
      const res = await fetch('http://localhost:5000/api/auth/resetear-password', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ token, nuevaContraseña }),
      });

      const data = await res.json();

      if (res.ok) {
        setMessage('Contraseña actualizada exitosamente.');
        setTimeout(() => {
          navigate('/');
        }, 2000);
      } else {
        setError(data.error || 'Error al actualizar contraseña.');
      }
    } catch (err) {
      console.error('Error actualizando contraseña:', err);
      setError('Error de conexión.');
    }
  };

  return (
    <div className="recover-container">
      <div className="recover-header">
        <img src={logo || "/placeholder.svg"} alt="Logo" className="recover-logo" />
      </div>

      <div className="recover-form">
        <h2>Crear nueva contraseña</h2>
        <form onSubmit={handleSubmit} className="recover-form-inner">
          <label>
            Nueva contraseña:
            <input
              type="password"
              value={nuevaContraseña}
              onChange={(e) => setNuevaContraseña(e.target.value)}
              required
              className="recover-input"
            />
          </label>

          <label>
            Confirmar nueva contraseña:
            <input
              type="password"
              value={confirmarContraseña}
              onChange={(e) => setConfirmarContraseña(e.target.value)}
              required
              className="recover-input"
            />
          </label>

          <button type="submit" className="recover-button">Guardar contraseña</button>
        </form>

        {message && <p className="recover-message success">{message}</p>}
        {error && <p className="recover-message error">{error}</p>}
      </div>
    </div>
  );
};

export default ResetPassword;
