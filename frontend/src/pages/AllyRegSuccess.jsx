import React, { useState } from 'react';
import '../styles/AllyRegSuccess.css';
import checkImage from '../assets/palomita.png'; // Ajusta la ruta si es diferente
import logo from '../assets/logo1.png'; 

export default function RegistroExitoso() {
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
            Gracias por registrarte en <br />
            <span className="titulo-verde">Mi Escuela Primero.</span>
          </h1>
          <p className="subtitulo">
            Tu solicitud ha sido recibida y está en proceso de revisión.
          </p>
          <h2 className="que-sigue">¿Qué sigue?</h2>
          <p className="mensaje">
            Nuestro equipo de administración revisará la información proporcionada para asegurarse de que cumple con todos los requisitos. <br />
            Recibirás un correo electrónico dentro de poco informándote si tu cuenta ha sido aprobada.
          </p>
        </div>
      </div>
    );
  }
  