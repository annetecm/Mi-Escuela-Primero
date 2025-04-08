import React, { useState } from 'react';
import '../styles/RegisterAlly.css';
import aliadoImg from '../assets/aliado.jpg';

function RegisterAlly() {
  const [tipoPersona, setTipoPersona] = useState('');
  const [step, setStep] = useState(1);

  const handleChange = (e) => {
    setTipoPersona(e.target.value);
  };

  const handleContinue = () => {
    if (tipoPersona) {
      setStep(2);
    }
  };

  return (
    <div className="register-container">
      <div className="image-section">
        <img src={aliadoImg} alt="Aliado foto" />
      </div>
      <div className="form-section">
        <h1 className="title">Registrarme como aliado</h1>

        {step === 1 && (
          <>
            <p className="question">
              ANTES DE CONTINUAR,<br />¿ERES UNA PERSONA FÍSICA O MORAL?
            </p>
            <select className="selector" value={tipoPersona} onChange={handleChange}>
              <option value="">seleccionar</option>
              <option value="fisica">Persona física</option>
              <option value="moral">Persona moral</option>
            </select>
            <button className="continue-button" onClick={handleContinue}>
              CONTINUAR
            </button>
          </>
        )}

        {step === 2 && tipoPersona === 'fisica' && (
          <form className="form-grid">
            <div className="form-group">
              <label>Nombre completo</label>
              <input className="form-input" type="text"/>
            </div>
            <div className="form-group">
              <label>Número telefónico</label>
              <input className="form-input" type="text"/>
            </div>
            <div className="form-group">
              <label>Correo electrónico</label>
              <input className="form-input" type="email"/>
            </div>
            <div className="form-group">
              <label>Tipo de apoyo a brindar</label>
              <input className="form-input" type="text"/>
            </div>
            <div className="form-group">
              <label>CURP</label>
              <input className="form-input" type="text"/>
            </div>
            <div className="form-group">
              <label>Institución donde labora</label>
              <input className="form-input" type="text"/>
            </div>
            <button className="continue-button">CONTINUAR</button>
          </form>       
        )}

        {/* Aquí puedes agregar un bloque similar para "persona moral" más adelante */}
      </div>
    </div>
  );
}

export default RegisterAlly;
