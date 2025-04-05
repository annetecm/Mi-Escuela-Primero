import React from 'react';
import '../styles/LoginPage.css';
import fondo from '../assets/fondo.jpg';

function LoginPage() {
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
            Si te gustaría apoyar una escuela, <a href="#">crea una cuenta de aliado</a><br />
            Si tu escuela necesita apoyo, <a href="#">regístrala aquí</a>
          </p>
        </div>
      </div>
    </div>
  );
}

export default LoginPage;
