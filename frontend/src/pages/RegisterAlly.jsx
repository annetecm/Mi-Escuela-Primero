import React, { useState } from 'react';
import '../styles/RegisterAlly.css';
import TableSelect from '../components/TableSelect';
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

  const formacionDocente = [
    "Convivencia escolar / Cultura de paz / Valores",
    "Educación inclusiva",
    "Enseñanza de lectura y matemáticas",
    "Inteligencia emocional",
    "Lectoescritura",
    "Atención de estudiantes con BAP (Barreras para el aprendizaje y la participación)",
    "Evaluación",
    "Herramientas digitales para la educación / Innovación tecnológica",
    "Proyecto de vida / Expectativas a futuro / Orientación vocacional",
    "Liderazgo y habilidades directivas",
    "Nueva Escuela Mexicana",
    "Disciplina positiva",
    "Metodologías activas (ejemplo: aprendizaje basado en proyectos, en problemas, en el juego, en servicio, gamificación, etc.)",
    "Alimentación saludable",
    "Participación infantil",
    "Comunicación efectiva con comunidad escolar",
    "Comunidades de aprendizaje",
    "Neuroeducación",
    "Sexualidad"
];

const formacionFamilias= [
    "Crianza positiva",
    "Derechos y obligaciones de los padres",
    "Inteligencia emocional",
    "Atención para hijos con BAP (Barreras para el aprendizaje y la participación)",
    "Proyecto de vida /Expectativas a futuro/ Orientación vocacional",
    "Cultura de paz / Valores en el hogar",
    "Alimentación saludable",
    "Sexualidad",
    "Enseñanza de lectura y matemáticas",
    "Comunicación efectiva con escuela",
    "Nueva Escuela Mexicana"
];

const formacionNiños= [
    "Lectoescritura",
    "Convivencia escolar/ Cultura de paz / Valores",
    "Enseñanza de matemáticas",
    "Educación física",
    "Inteligencia emocional",
    "Proyecto de vida /Expectativas a futuro/ Orientación vocacional",
    "Sexualidad",
    "Alimentación saludable",
    "Arte",
    "Música",
    "Computación",
    "Visitas fuera de la escuela (a empresas o lugares recreativos)"
];

const personalApoyo= [
    "Psicólogo",
    "Psicopedagogo o especialista en BAP",
    "Suplentes de docentes frente a grupo",
    "Maestro para clases de educación física",
    "Terapeuta de lenguaje o comunicación",
    "Maestro para clases de arte",
    "Persona para apoyo en limpieza",
    "Maestro para clases de idiomas",
    "Persona para apoyo administrativo"
];

const infraestructura= [
    "Agua (falla de agua, filtros de agua, bomba de agua nueva,tinaco o cisterna nueva, bebederos, etc.)",
    "Luz (fallo eléctrico, conexión de luz, focos y cableado nuevo, paneles solares, etc.)",
    "Suplentes de docentes frente a grupo",
    "Muros, techos o pisos (reconstrucción de muros cuarteados, tablaroca, plafón, cambio de pisos levantados,etc.)",
    "Adecuaciones para personas con discapacidad (rampas, etc.)",
    "Baños (arreglo de baños, cambio de sanitarios o lavamanos,construcción de baños, plomería, etc.)",
    "Cocina (construcción, remodelación de cocina)",
    "Conectividad (routers, instalación de internet, etc.)",
    "Domos y patios (estructura para domo, lonaria y/o malla sombra, nivelación de patio, plancha de concreto, etc.)",
    "Árboles (plantar nuevos, poda de árboles, arreglo de o nuevas jardineras)",
    "Pintura",
    "Seguridad (construcción o arreglo de barda perimetral, cámaras de seguridad, alambrado, cambio de barandales en mal estado, etc.)",
    "Ventanas y puertas (ventanas y puertas nuevas, protección para ventanas, candados para puertas)"
];

const materiales=[
    "Tecnológico (computadoras, impresoras, proyectores, pantallas, bocinas, extensiones, cables HDMI, etc.)",
    "Didácticos (plastilina, cartulinas, hojas, marcadores, crayolas, lápices, colores, juegos para aprender fracciones, multiplicaciones, regletas, rompecabezas, geoplanos, bloques geométricos, billetes de juego, alimentos de juego, microscopio, etc.)",
    "De educación física (sogas, pelotas, aros, tinas, balones, porterías, redes para canastas o para voleibol, etc.)",
    "Literarios (libros infantiles, manuales, libros de texto, libros en braille, libros macrotipo, libros para estudiantes de lengua indígena, programas de estudio, etc.)"
];

const mobiliario=[
    "Mesas para niños/ mesabancos",
    "Sillas (para niños o para maestros)",
    "Mesas para docentes",
    "Pizarrones",
    "Comedores",
    "Estantes, libreros o cajoneras"
];

const alimentacion=[
    "Desayunos",
    "Fórmula"
];

const transporte=[
    "Transporte (nuevas rutas de camiones, transporte escolar,entrega de bicis, etc.)",
    "Arreglo de camino (puentes en arroyos, aplanadora de camino, luminaria, etc.)"
];

const juridico=[
    "Apoyo en gestión de escrituras (cuando el inmueble no las tiene)"
];

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
              </form>

              <div className="heading-need">REGISTRA TU APOYO</div>
              <p className='label'>Selecciona en qué necesidades podrías apoyar</p> 
              
              <TableSelect title="Formación Docente" needs={formacionDocente} />
              <TableSelect title="Formación a familias" needs={formacionFamilias} />
              <TableSelect title="Formación niñas y niños" needs={formacionNiños} />
              <TableSelect title="Personal de apoyo" needs={personalApoyo} />
              <TableSelect title="Infraestructura" needs={infraestructura} />
              <TableSelect title="Materiales" needs={materiales} />
              <TableSelect title="Mobiliario" needs={mobiliario} />
              <TableSelect title="Alimentación" needs={alimentacion} />
              <TableSelect title="Transporte" needs={transporte} />
              <TableSelect title="Jurídico" needs={juridico} />
            </div>
            <button className="continue-button">CONTINUAR</button>
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
                <div className="heading-need">REGISTRA TU APOYO</div>
                <p className='label'>Selecciona en que necesidades podrías apoyar</p> 
                <TableSelect
                  title="Formación Docente"
                  needs={formacionDocente}
                />
                <TableSelect
                  title="Formación a familias"
                  needs={formacionFamilias}
                />
                <TableSelect
                  title="Formación niñas y niños"
                  needs={formacionNiños}
                />
                <TableSelect
                  title="Personal de apoyo"
                  needs={personalApoyo}
                />
                <TableSelect
                  title="Infraestructura"
                  needs={infraestructura}
                />
                <TableSelect
                  title="Materiales"
                  needs={materiales}
                />
                <TableSelect
                    title="Mobiliario"
                    needs={mobiliario}
                />
                <TableSelect
                    title="Alimentación"
                    needs={alimentacion}
                />
                <TableSelect
                    title="Transporte"
                    needs={transporte}
                />
                <TableSelect
                    title="Jurídico"
                    needs={juridico}
                />
            </div>
            <button className="continue-button">CONTINUAR</button>
          </>
        )}
      </div>
    </div>
  );
}

export default RegisterAlly;
