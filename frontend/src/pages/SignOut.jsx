import React, { useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import '../styles/SignOut.css';
import checkImage from '../assets/palomita.png';
import logo from '../assets/logo1.png'; 

export default function SignOut() {
  const navigate = useNavigate();

  useEffect(() => {
    localStorage.removeItem('token');

    //To login after 5 secs
    const timer = setTimeout(() => {
      navigate('/');
    }, 3000);

    return () => clearTimeout(timer);
  }, [navigate]);

  return (
    <div className="registro-container">
      <div className="header">
        <img src={logo || "/placeholder.svg"} alt="Logo" className="logo" />
      </div>

      <div className="contenido">
        <img src={checkImage} alt="Registro exitoso" className="check-icon" />
        <h1 className="titulo">
          Has cerrado sesión exitosamente <br />
          <span className="titulo-verde">¡Te esperamos de regreso!</span>
        </h1>
      </div>
    </div>
  );
}
