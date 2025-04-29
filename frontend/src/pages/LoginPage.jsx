import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../contexts/AuthContext';
import '../styles/LoginPage.css';
import fondo from '../assets/fondo.jpg';

function LoginPage() {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const { login } = useAuth();
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');

    try {
      const response = await fetch('http://localhost:5000/api/auth/login', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          correoElectronico: email,
          contraseña: password
        })
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.error || 'Login failed');
      }

      login(data.token, data.tipo);
      
      if (data.tipo === 'aliado') {
        localStorage.setItem('aliadoId', data.aliadoId);
      } else if (data.tipo === 'escuela') {
        localStorage.setItem('cct', data.cct);
      }

      console.log(data.tipo);

      console.log(data.tipo);

      if (data.tipo === 'aliado') {
        navigate('/aliado/perfil');
      } else if (data.tipo === 'escuela') {
        navigate('escuela/perfil');
      }else if(data.tipo === 'administrador'){
        navigate('/administrador/perfil');
      } else {
        navigate('/');
      } 
      
    } catch (err) {
      setError(err.message);
    }
  };

  const handleRegistroAliado = (e) => {
    e.preventDefault();
    navigate('/register-ally');
  };

  const handleRegistroEscuela = (e) => {
    e.preventDefault();
    navigate('/register-school');
  };

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
            type="text" 
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
            Si tu escuela necesita apoyo, <a href="#" onClick={handleRegistroEscuela}>regístrala aquí</a><br />
            ¿Olvidaste tu contraseña? <a href="#" onClick={() => navigate('/recuperar-password')}>Recupérala aquí</a>
          </p>
        </div>
      </div>
    </div>
  );
}

export default LoginPage;