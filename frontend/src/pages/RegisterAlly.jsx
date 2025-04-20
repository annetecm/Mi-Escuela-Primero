import React, { useState } from 'react';
import '../styles/RegisterAlly.css';
import TableSelect from '../components/TableSelect';
import aliadoImg from '../assets/aliado.jpg';

function RegisterAlly() {
  const [tipoPersona, setTipoPersona] = useState('');
  const [step, setStep] = useState(1);

  const [formData, setFormData] = useState({});
  const [apoyosSeleccionados, setApoyosSeleccionados] = useState([]);


  const handleChange = (e) => {
    setTipoPersona(e.target.value);
  };
  const handleInput = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };
  const agregarApoyo = (categoria, seleccionados) => {
    const nuevos = seleccionados.map(desc => ({
      tipo: categoria,
      caracteristicas: desc
    }));
    setApoyosSeleccionados(prev => [
      ...prev.filter(a => a.tipo !== categoria), // Elimina selecciones anteriores de la misma categoría
      ...nuevos
    ]);
  };
  

  const handleContinue = () => {
    if (tipoPersona) {
      setStep(2);
    }
  };
  const enviarFormulario = async () => {
    const datos = {
      usuario: {
        correoElectronico: formData.correo,
        contraseña: formData.contraseña,
        nombre: formData.nombre
      },
      aliado: {
        tipoDeApoyo: formData.tipoApoyo,
        tipoId: tipoPersona === "fisica" ? formData.curp : formData.rfc
      },
      personaFisica: tipoPersona === "fisica" ? {
        CURP: formData.curp,
        institucionLaboral: formData.institucionLaboral,
        razon: formData.razon,
        correoElectronico: formData.correo,
        telefono: formData.telefono
      } : undefined,
      personaMoral: tipoPersona === "moral" ? {
        RFC: formData.rfc,
        numeroEscritura: formData.numeroEscritura,
        area: formData.area,
        correoElectronico: formData.correo,
        telefono: formData.telefono
      } : undefined,
      institucion: tipoPersona === "moral" ? {
        giro: formData.giro,
        propositoOrganizacion: formData.proposito,
        domicilio: formData.domicilioInstitucion,
        telefono: formData.telefono,
        paginaWeb: formData.paginaWeb,
        RFC: formData.rfc
      } : undefined,
      escrituraPublica: tipoPersona === "moral" ? {
        numeroEscritura: formData.numeroEscritura,
        fechaEscritura: formData.fechaEscritura,
        otorgadaNotario: formData.otorgadaPor,
        ciudad: formData.ciudad,
        RFC: formData.rfc
      } : undefined,
      constanciaFiscal: tipoPersona === "moral" ? {
        RFC: formData.rfc,
        razonSocial: formData.razonSocial,
        regimen: formData.regimen,
        domicilio: formData.domicilioFiscal
      } : undefined,
      apoyos: apoyosSeleccionados
    };
    console.log('📦 Enviando datos:', JSON.stringify(datos, null, 2));

    try {
      const res = await fetch('http://localhost:5000/api/aliado', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(datos)
      });
    
      const text = await res.text(); // ← lee como texto sin asumir que es JSON
      console.log('🧾 Respuesta cruda:', text);
    
      try {
        const json = JSON.parse(text);
        console.log('✅ JSON parseado:', json);
        alert(json.message);
      } catch (err) {
        console.error('❌ No es JSON válido:', err);
        alert('Respuesta no válida:\n' + text);
      }
    
    } catch (error) {
      console.error('❌ Error de red:', error);
      alert('Error de red:\n' + error.message);
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
          <input className="form-input" type="text" name="correo" onChange={handleInput} />
        </div>
        <div className="form-group">
          <label>Contraseña</label>
          <input className="form-input" type="text" name="contraseña" onChange={handleInput} />
        </div>
        <div className="form-group">
          <label>Nombre completo</label>
          <input className="form-input" type="text" name="nombre" onChange={handleInput} />
        </div>
        <div className="form-group">
          <label>Número telefónico</label>
          <input className="form-input" type="text" name="telefono" onChange={handleInput} />
        </div>
        <div className="form-group">
          <label>Correo electrónico</label>
          <input className="form-input" type="email" name="correo" onChange={handleInput} />
        </div>
        <div className="form-group">
          <label>Tipo de apoyo a brindar</label>
          <input className="form-input" type="text" name="tipoApoyo" onChange={handleInput} />
        </div>
        <div className="form-group">
          <label>CURP</label>
          <input className="form-input" type="text" name="curp" onChange={handleInput} />
        </div>
        <div className="form-group">
          <label>Institución donde labora</label>
          <input className="form-input" type="text" name="institucionLaboral" onChange={handleInput} />
        </div>
        <div className="form-group">
          <label>Razón por la que se inscribe</label>
          <input className="form-input" type="text" name="razon" onChange={handleInput} />
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
            <button className="continue-button" onClick={enviarFormulario}>CONTINUAR</button>          </>
        )}
        {step === 2 && tipoPersona === 'moral' && (
          <>
            <p className="label">Persona moral</p>
            <div className="scroll">
            <form className="form-grid">
                <div className="form-group">
                    <label>Correo</label>
                    <input className="form-input" type="text" name="correo" onChange={handleInput} />                </div>
                <div className="form-group">
                    <label>Contraseña</label>
                    <input className="form-input" type="text" name="contraseña" onChange={handleInput} />                </div>
            </form>
            <div className="heading">DATOS DE LA INSTITUCIÓN</div>
              <form className="form-grid">
                <div className="form-group">
                  <label>Nombre de la organización (empresa, OSC, etc)</label>
                  <input className="form-input" type="text" name="nombreOrg" onChange={handleInput} />                </div>
                <div className="form-group">
                  <label>Giro</label>
                  <input className="form-input" type="text" name="giro" onChange={handleInput} />                </div>
                <div className="form-group">
                  <label>Propósito de la organización</label>
                  <input className="form-input" type="text" name="proposito" onChange={handleInput} />                </div>
                <div className="form-group">
                  <label>Domicilio</label>
                  <input className="form-input" type="text" name="domicilioInstitucion" onChange={handleInput} />                </div>
                <div className="form-group">
                  <label>Teléfono</label>
                  <input className="form-input" type="text" name="telefono" onChange={handleInput} />                </div>
                <div className="form-group">
                  <label>Página web oficial</label>
                  <input className="form-input" type="text" name="paginaWeb" onChange={handleInput} />                </div>
              </form>
                <div className="heading">ESCRITURA PÚBLICA</div>
              <form className="form-grid">
                <div className="form-group">
                  <label>Número de escritura pública</label>
                  <input className="form-input" type="text" name="numeroEscritura" onChange={handleInput} />                </div>
                <div className="form-group">
                  <label>Fecha de escritura pública</label>
                  <input className="form-input" type="text" name="fechaEscritura" onChange={handleInput} />                </div>
                <div className="form-group">
                  <label>Otorgada por: (Nombre del notario)</label>
                  <input className="form-input" type="text" name="otorgadaPor" onChange={handleInput} />                </div>
                <div className="form-group">
                  <label>En la ciudad de:</label>
                  <input className="form-input" type="text" name="ciudad" onChange={handleInput} />                </div>
              </form>
              <div className="heading">CONSTANCIA FISCAL</div>
              <form className="form-grid">
                <div className="form-group">
                  <label>RFC</label>
                  <input className="form-input" type="text" name="rfc" onChange={handleInput} />                </div>
                <div className="form-group">
                  <label>Razón Social</label>
                  <input className="form-input" type="text" name="razonSocial" onChange={handleInput} />                </div>
                <div className="form-group">
                  <label>Régimen</label>
                  <input className="form-input" type="text" name="regimen" onChange={handleInput} />                </div>
                <div className="form-group">
                  <label>Domicilio</label>
                  <input className="form-input" type="text" name="domicilioFiscal" onChange={handleInput} />                </div>
              </form>
              <div className="heading">DATOS DEL REPRESENTANTE</div>
              <form className="form-grid">
                <div className="form-group">
                  <label>Nombre completo</label>
                  <input className="form-input" type="text" name="nombre" onChange={handleInput} />                </div>
                <div className="form-group">
                  <label>Correo</label>
                  <input className="form-input" type="text" name="correo" onChange={handleInput} />                </div>
                <div className="form-group">
                  <label>Teléfono</label>
                  <input className="form-input" type="text" name="telefono" onChange={handleInput} />                </div>
                <div className="form-group">
                  <label>Área a la que pertenece en la organización</label>
                  <input className="form-input" type="text" name="area" onChange={handleInput} />                </div>
              </form>
                <div className="heading-need">REGISTRA TU APOYO</div>
                <p className='label'>Selecciona en que necesidades podrías apoyar</p> 
                <TableSelect
                  title="Formación Docente"
                  needs={formacionDocente}
                  onSelectionChange={(seleccionados) => agregarApoyo("Formación Docente", seleccionados)}
                />
                <TableSelect
                  title="Formación a familias"
                  needs={formacionFamilias}
                  onSelectionChange={(seleccionados) => agregarApoyo("Formación a familias", seleccionados)}
                />
                <TableSelect
                  title="Formación niñas y niños"
                  needs={formacionNiños}
                  onSelectionChange={(seleccionados) => agregarApoyo("Formación niñas y niños", seleccionados)}
                  
                />
                <TableSelect
                  title="Personal de apoyo"
                  needs={personalApoyo}
                  onSelectionChange={(seleccionados) => agregarApoyo("Personal de apoyo", seleccionados)}
                />
                <TableSelect
                  title="Infraestructura"
                  needs={infraestructura}
                  onSelectionChange={(seleccionados) => agregarApoyo("Infraestructura", seleccionados)}
                />
                <TableSelect
                  title="Materiales"
                  needs={materiales}
                  onSelectionChange={(seleccionados) => agregarApoyo("Materiales", seleccionados)}
                />
                <TableSelect
                    title="Mobiliario"
                    needs={mobiliario}
                    onSelectionChange={(seleccionados) => agregarApoyo("Mobiliario", seleccionados)}
                />
                <TableSelect
                    title="Alimentación"
                    needs={alimentacion}
                    onSelectionChange={(seleccionados) => agregarApoyo("Alimentación", seleccionados)}
                />
                <TableSelect
                    title="Transporte"
                    needs={transporte}
                    onSelectionChange={(seleccionados) => agregarApoyo("Transporte", seleccionados)}
                />
                <TableSelect
                    title="Jurídico"
                    needs={juridico}
                    onSelectionChange={(seleccionados) => agregarApoyo("Jurídico", seleccionados)}
                />
            </div>
            <button className="continue-button" onClick={enviarFormulario}>CONTINUAR</button>          </>
        )}
      </div>
    </div>
  );
}

export default RegisterAlly;