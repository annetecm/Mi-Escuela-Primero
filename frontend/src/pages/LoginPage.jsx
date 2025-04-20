import React, { useState } from 'react';
import '../styles/LoginPage.css';
import fondo from '../assets/fondo.jpg';

function LoginPage({ onRegisterSchool, onRegisterAlly  }) {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [isLoggedIn, setIsLoggedIn] = useState(false);

  const handleRegistroEscuela = (e) => {
    e.preventDefault();
    onRegisterSchool();
  };
  const handleRegistroAliado = (e) => {
    e.preventDefault();
    onRegisterAlly();
  };


  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');

    try {
      const response = await fetch('http://localhost:5000/api/auth/login', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          correoElectronico: email,
          contraseña: password
        })
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.error || 'Login failed');
      }

      localStorage.setItem('token', data.token);
      setIsLoggedIn(true);
      alert('Login successful!');
      
    } catch (err) {
      setError(err.message);
    }
  };

  if (isLoggedIn) {
    return (
      <div className="login-container" style={{ backgroundImage: `url(${fondo})` }}>
        <div className="login-box">
          <h1>¡Bienvenido!</h1>
          <p>Has iniciado sesión correctamente.</p>
          <button onClick={() => {
            localStorage.removeItem('token');
            setIsLoggedIn(false);
          }}>
            Cerrar sesión
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="login-container" style={{ backgroundImage: `url(${fondo})` }}>
      <div className="login-box">
        <div className="login-header">
          <h1>¡Bienvenido!</h1>
          <p>Inicia sesión para continuar</p>
        </div>
        {error && <div className="error-message">{error}</div>}
        <form onSubmit={handleSubmit}>
          <label htmlFor="email">CORREO ELECTRÓNICO</label>
          <input 
            type="email" 
            id="email" 
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            required
          />

          <label htmlFor="password">CONTRASEÑA</label>
          <input 
            type="password" 
            id="password" 
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            required
          />

          <button type="submit">INGRESAR</button>
        </form>
        <div className="extra-links">
          <p>¿Aún no tienes una cuenta?</p>
          <p>
            Si te gustaría apoyar una escuela, <a href="#" onClick={handleRegistroAliado}>crea una cuenta de aliado</a><br />
            Si tu escuela necesita apoyo, <a href="#"onClick={handleRegistroEscuela}>regístrala aquí</a>
          </p>
        </div>
      </div>
    </div>
  );
}

export default LoginPage;