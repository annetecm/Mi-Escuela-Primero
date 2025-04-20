import React, { useState } from 'react';
import '../styles/ChangePassword.css';
import logo from '../assets/logo1.png'; 

const ChangePassword = () => {
  const [currentPassword, setCurrentPassword] = useState('');
  const [newPassword, setNewPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [message, setMessage] = useState('');

  const handleSubmit = (e) => {
    e.preventDefault();

    if (!newPassword || !confirmPassword) {
      setMessage('Por favor completa todos los campos.');
      return;
    }

    if (newPassword !== confirmPassword) {
      setMessage('Las nuevas contraseñas no coinciden.');
      return;
    }

    setMessage('¡Contraseña cambiada con éxito!');
    setCurrentPassword('');
    setNewPassword('');
    setConfirmPassword('');
  };

  return (
    <div className="registro-container">
      {/* Header con logo */}
      <div className="header">
        <img src={logo || "/placeholder.svg"} alt="Logo" className="logo" />
      </div>

      <div className="change-password-container">
        <h2>Cambiar contraseña</h2>
        <form onSubmit={handleSubmit}>
          <label>
            Contraseña actual:
            <input
              type="password"
              value={currentPassword}
              onChange={(e) => setCurrentPassword(e.target.value)}
              required
            />
          </label>

          <label>
            Nueva contraseña:
            <input
              type="password"
              value={newPassword}
              onChange={(e) => setNewPassword(e.target.value)}
              required
            />
          </label>

          <label>
            Confirmar nueva contraseña:
            <input
              type="password"
              value={confirmPassword}
              onChange={(e) => setConfirmPassword(e.target.value)}
              required
            />
          </label>

          <button type="submit">Guardar cambios</button>
        </form>

        {message && <p className="message">{message}</p>}
      </div>
    </div>
  );
};

export default ChangePassword;
