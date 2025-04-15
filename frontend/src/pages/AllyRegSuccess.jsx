import React, { useState } from 'react';
import './AllyRegSuccess.css';
import checkImage from './assets/palomita.png'; // Ajusta la ruta si es diferente


export default function RegistroExitoso() {
  // Estado para controlar la visibilidad del menú
  const [menuVisible, setMenuVisible] = useState(false);

  // Función para alternar la visibilidad del menú
  const toggleMenu = () => {
    setMenuVisible(!menuVisible);
  };

  return (
    <div className="registro-container">
      <div className="barra-superior">
        {/* Botón del menú */}
        <div className="menu-icon" onClick={toggleMenu}>
          &#9776;
        </div>
      </div>

      {/* Menú desplegable, solo se muestra si el estado `menuVisible` es true */}
      {menuVisible && (
        <div className="menu-desplegable">
          <ul>
            <li>Perfil</li>
            <li>Mis proyectos</li>
            <li>Buscar escuelas</li>
          </ul>
        </div>
      )}

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
          Recibirá un correo electrónico dentro de poco informándole si su cuenta ha sido aprobada.
        </p>
      </div>
    </div>
  );
}


