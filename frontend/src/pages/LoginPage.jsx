import React from 'react';
import { useNavigate } from 'react-router-dom';
import '../styles/LoginPage.css';
import fondo from '../assets/fondo.jpg';

function LoginPage() {
  const navigate = useNavigate();

  return (
    <div
      className="login-container"
      style={{ backgroundImage: `url(${fondo})` }}
    >
      <div className="login-box">
        <div className="login-header">
          <h1>¡Bienvenido!</h1>
          <p>Inicia sesión para continuar</p>
        </div>
        <form>
          <label htmlFor="email">CORREO ELECTRÓNICO</label>
          <input type="email" id="email" />

          <label htmlFor="password">CONTRASEÑA</label>
          <input type="password" id="password" />

          <button type="submit">INGRESAR</button>
        </form>

        <div className="extra-links">
          <p>¿Aún no tienes una cuenta?</p>
          <p>
            Si te gustaría apoyar una escuela,{' '}
            <span
              style={{ color: '#007bff', cursor: 'pointer', textDecoration: 'underline' }}
              onClick={() => navigate('/registro-aliado')}
            >
              crea una cuenta de aliado
            </span>
            <br />
            Si tu escuela necesita apoyo,{' '}
            <span
              style={{ color: '#007bff', cursor: 'pointer', textDecoration: 'underline' }}
              onClick={() => navigate('/registro-escuela')}
            >
              regístrala aquí
            </span>
          </p>
        </div>
      </div>
    </div>
  );
}

export default LoginPage;
