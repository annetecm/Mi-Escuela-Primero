import React, { useState } from 'react';
import '../styles/RecoverPassword.css';
import logo from '../assets/logo1.png';

const ChangePassword = () => {
  const [correo, setCorreo] = useState('');
  const [message, setMessage] = useState('');
  const [error, setError] = useState('');

  const handleSubmit = async (e) => {
    e.preventDefault();
    setMessage('');
    setError('');

    if (!correo) {
      setError('Por favor ingresa tu correo.');
      return;
    }

    try {
      const res = await fetch('http://localhost:5000/api/auth/recuperar-password', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ correoElectronico: correo }),
      });

      const data = await res.json();

      if (res.ok) {
        setMessage('Te hemos enviado un correo para recuperar tu contraseña.');
        setCorreo('');
      } else {
        setError(data.error || 'Error al solicitar recuperación.');
      }
    } catch (err) {
      console.error('Error enviando solicitud:', err);
      setError('Error de conexión.');
    }
  };

  return (
    <div className="recover-container">
      <div className="recover-header">
        <img src={logo || "/placeholder.svg"} alt="Logo" className="recover-logo" />
      </div>

      <div className="recover-form">
        <h2>Recuperar contraseña</h2>
        <form onSubmit={handleSubmit} className="recover-form-inner">
          <label>
            Correo electrónico:
            <input
              type="email"
              value={correo}
              onChange={(e) => setCorreo(e.target.value)}
              required
              className="recover-input"
            />
          </label>

          <button type="submit" className="recover-button">Enviar enlace de recuperación</button>
        </form>

        {message && <p className="recover-message success">{message}</p>}
        {error && <p className="recover-message error">{error}</p>}
      </div>
    </div>
  );
};

export default ChangePassword;
