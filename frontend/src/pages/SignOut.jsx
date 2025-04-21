import React, { useState } from 'react';
import '../styles/SignOut.css';
import checkImage from '../assets/palomita.png';
import logo from '../assets/logo1.png'; 

export default function SignOut() {
    return (
      <div className="registro-container">
        {/* Barra superior con logo */}
        <div className="header">
          <img src={logo || "/placeholder.svg"} alt="Logo" className="logo" />
        </div>
  
        {/* Contenido principal */}
        <div className="contenido">
          <img src={checkImage} alt="Registro exitoso" className="check-icon" />
  
          <h1 className="titulo">
            Haz cerrado sesión exitosamente <br />
            <span className="titulo-verde">¡Te esperamos de regreso!</span>
          </h1>
        </div>
      </div>
    );
  }