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
          <>
          <p className="label">Persona física</p>
          <form className="form-grid">
            <div className="form-group">
                <label>Correo</label>
                <input className="form-input" type="text"/>
            </div>
            <div className="form-group">
                <label>Contraseña</label>
                <input className="form-input" type="text"/>
            </div>
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
            <div className="form-group">
              <label>Razón por la que se inscribe</label>
              <input className="form-input" type="text"/>
            </div>
            <button className="continue-button">CONTINUAR</button>
          </form>      
          </> 
        )}
        {step === 2 && tipoPersona === 'moral' && (
          <>
            <p className="label">Persona moral</p>
            <div className="scroll">
            <form className="form-grid">
                <div className="form-group">
                    <label>Correo</label>
                    <input className="form-input" type="text"/>
                </div>
                <div className="form-group">
                    <label>Contraseña</label>
                    <input className="form-input" type="text"/>
                </div>
            </form>
            <div className="heading">DATOS DE LA INSTITUCIÓN</div>
              <form className="form-grid">
                <div className="form-group">
                  <label>Nombre de la organización (empresa, OSC, etc)</label>
                  <input className="form-input" type="text" />
                </div>
                <div className="form-group">
                  <label>Giro</label>
                  <input className="form-input" type="text" />
                </div>
                <div className="form-group">
                  <label>Propósito de la organización</label>
                  <input className="form-input" type="email" />
                </div>
                <div className="form-group">
                  <label>Domicilio</label>
                  <input className="form-input" type="text" />
                </div>
                <div className="form-group">
                  <label>Teléfono</label>
                  <input className="form-input" type="text" />
                </div>
                <div className="form-group">
                  <label>Página web oficial</label>
                  <input className="form-input" type="text" />
                </div>
              </form>
                <div className="heading">ESCRITURA PÚBLICA</div>
              <form className="form-grid">
                <div className="form-group">
                  <label>Número de escritura pública</label>
                  <input className="form-input" type="text" />
                </div>
                <div className="form-group">
                  <label>Fecha de escritura pública</label>
                  <input className="form-input" type="text" />
                </div>
                <div className="form-group">
                  <label>Otorgada por: (Nombre del notario)</label>
                  <input className="form-input" type="text" />
                </div>
                <div className="form-group">
                  <label>En la ciudad de:</label>
                  <input className="form-input" type="text" />
                </div>
              </form>
              <div className="heading">CONSTANCIA FISCAL</div>
              <form className="form-grid">
                <div className="form-group">
                  <label>RFC</label>
                  <input className="form-input" type="text" />
                </div>
                <div className="form-group">
                  <label>Razón Social</label>
                  <input className="form-input" type="text" />
                </div>
                <div className="form-group">
                  <label>Régimen</label>
                  <input className="form-input" type="text" />
                </div>
                <div className="form-group">
                  <label>Domicilio</label>
                  <input className="form-input" type="text" />
                </div>
              </form>
              <div className="heading">DATOS DEL REPRESENTANTE</div>
              <form className="form-grid">
                <div className="form-group">
                  <label>Nombre completo</label>
                  <input className="form-input" type="text" />
                </div>
                <div className="form-group">
                  <label>Correo</label>
                  <input className="form-input" type="text" />
                </div>
                <div className="form-group">
                  <label>Teléfono</label>
                  <input className="form-input" type="text" />
                </div>
                <div className="form-group">
                  <label>Área a la que pertenece en la organización</label>
                  <input className="form-input" type="text" />
                </div>
              </form>
            </div>
            <button className="continue-button">CONTINUAR</button>
          </>
        )}
      </div>
    </div>
  );
}

export default RegisterAlly;
