import React, { useState } from 'react';
import '../styles/RegisterSchool.css';
import aliadoImg from '../assets/aliado.jpg';

function RegisterSchool(){
    return (
        <div className="register-container">
            <div className="image-section">
                    <img src={aliadoImg} alt="Aliado foto" />
            </div>
            <div className="form-section">
                <h1 className="title">Registrar mi escuela</h1>
                <p className="label">Ingresa la información para crear tu cuenta</p>
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
                    <div className="heading">DATOS DE LA ESCUELA</div>
                        <form className="form-grid">
                            <div className="form-group">
                                <label>Nombre de la escuela</label>
                                <input className="form-input" type="text"/>
                            </div>
                            <div className="form-group">
                                <label>Clave CCT</label>
                                <input className="form-input" type="text"/>
                            </div>
                            <div className="form-group">
                                <label>Nivel Educativo</label>
                                <input className="form-input" type="email"/>
                            </div>
                            <label for="modalidad">Modalidad:</label>
                            <div className="form-group">
                                <label for="modalidad">Modalidad</label>
                                <select className="selector">
                                    <option value="general">General</option>
                                    <option value="comunitaria">Comunitaria</option>
                                    <option value="indigena">Indígena</option>
                                    <option value="general_multigrado">General multigrado</option>
                                </select>
                            </div>
                            <div className="form-group">
                                <label>Control administrativo</label>
                                <input className="form-input" type="text"/>
                            </div>
                            <div className="form-group">
                                <label for="sostenimiento">Sostenimiento</label>
                                <select className="selector">
                                    <option value="estatal">Estatal</option>
                                    <option value="federal">Federal</option>
                                </select>
                            </div>
                            <div className="form-group">
                                <label>Zona escolar</label>
                                <input className="form-input" type="text"/>
                            </div>
                            <div className="form-group">
                                <label>Sector escolar</label>
                                <input className="form-input" type="text"/>
                            </div>
                        </form>
                        <p className='special-label'>Dirección</p>
                        <form className="form-grid">
                            <div className="form-group">
                                <label>Calle y número</label>
                                <input className="form-input" type="text"/>
                            </div>
                            <div className="form-group">
                                <label>Colonia</label>
                                <input className="form-input" type="text"/>
                            </div>
                            <div className="form-group">
                                <label>Municipio</label>
                                <input className="form-input" type="text"/>
                            </div>
                        </form>
                    <div className="heading">DATOS DE CONTACTO CON EL/LA DIRECTOR/A</div>
                        <form>
                            <div className="form-group">
                                <label>Nombre del director(a)</label>
                                <input className="form-input" type="text"/>
                            </div>
                            <div className="form-group">
                                <label>Número celular</label>
                                <input className="form-input" type="text"/>
                            </div>
                            <div className="form-group">
                                <label>Correo</label>
                                <input className="form-input" type="text"/>
                            </div>
                            <div className="form-group">
                                <label>¿Cuántos años lleva en ese puesto en la escuela?</label>
                                <input className="form-input" type="text"/>
                            </div>
                            <div className="form-group">
                                <label>¿Está próximo a jubilarse? Si sí, ¿cuándo?</label>
                                <input className="form-input" type="text"/>
                            </div>
                            <div className="form-group">
                                <label>¿Ha solicitado cambio de escuela?</label>
                                <input className="form-input" type="text"/>
                            </div>
                        </form>
                    <div className="heading">DATOS DE CONTACTO CON EL/LA SUPERVISOR/A</div>
                        <form>
                            <div className="form-group">
                                <label>Nombre del supervisor(a)</label>
                                <input className="form-input" type="text"/>
                            </div>
                            <div className="form-group">
                                <label>Número celular</label>
                                <input className="form-input" type="text"/>
                            </div>
                            <div className="form-group">
                                <label>Correo</label>
                                <input className="form-input" type="text"/>
                            </div>
                            <div className="form-group">
                                <label for="medio-preferido">Medio preferido de contacto</label>
                                <select className="selector">
                                    <option value="whatsapp">Whatsapp</option>
                                    <option value="correo">Correo</option>
                                </select>
                            </div>
                            <div className="form-group">
                                <label>¿Cuántos años lleva en ese puesto en esa zona?</label>
                                <input className="form-input" type="text"/>
                            </div>
                            <div className="form-group">
                                <label>¿Está próximo a jubilarse? Si sí, ¿cuándo?</label>
                                <input className="form-input" type="text"/>
                            </div>
                            <div className="form-group">
                                <label>¿Ha solicitado cambio de zona?</label>
                                <input className="form-input" type="text"/>
                            </div>
                            <div className="form-group">
                                <label>Numero de estudiantes por grupo (en promedio)</label>
                                <input className="form-input" type="text"/>
                            </div>
                        </form>
                        <button className="continue-button">CONTINUAR</button>
                </div>
            </div>
        </div>
    );
}

export default RegisterSchool;