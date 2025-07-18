import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import '../styles/RegisterAlly.css';
import TableSelect from '../components/TableSelect';
import aliadoImg from '../assets/aliado.jpg';

  function RegisterAlly() {
  const [tipoPersona, setTipoPersona] = useState('');
  const [step, setStep] = useState(1);

  const [formData, setFormData] = useState({});
  const [apoyosSeleccionados, setApoyosSeleccionados] = useState([]);

  const [documentoPersonaMoral, setDocumentoPersonaMoral] = useState(null);
  const [documentosSubidos, setDocumentosSubidos] = useState([]);
  const [nombreArchivo, setNombreArchivo] = useState(""); {/*Añadi estos 3*/}
  const [aceptaTerminos, setAceptaTerminos] = useState(false);

  const navigate = useNavigate();

  const [needsData, setNeedsData] = useState({
    formacionDocente: [],
    formacionFamilias: [],
    formacionNiños: [],
    personalApoyo: [],
    infraestructura: [],
    materiales: [],
    mobiliario: [],
    alimentacion: [],
    transporte: [],
    juridico: []
  });
  

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

  const enviarFormulario = async (e) => {
    e.preventDefault();
    if (!aceptaTerminos) {
      alert("Debes aceptar los términos para continuar.");
      return;
    }
    const datos = {
      usuario: {
        correoElectronico: formData.correo,
        contraseña: formData.contraseña,
        nombre: tipoPersona === "moral" ? formData.nombreOrg : formData.nombre,
      },
      aliado: {
        tipoDeApoyo: formData.tipoApoyo
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
        area: formData.representanteArea,
        correoElectronico: formData.representanteCorreo,
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
      constanciaFisica: tipoPersona === "moral" ? {
        RFC: formData.rfc,
        razonSocial: formData.razonSocial,
        regimen: formData.regimen,
        domicilio: formData.domicilioFiscal
      } : undefined,
      representante: tipoPersona === "moral" ? {
        nombre: formData.representanteNombre,
        correo: formData.representanteCorreo,
        telefono: formData.representanteTelefono,
        area: formData.representanteArea,
        RFC: formData.rfc
      } : undefined,
      apoyos: apoyosSeleccionados,
      documento: documentosSubidos
    };
  
    console.log('📦 Enviando datos:', JSON.stringify(datos, null, 2));
  
    try {
      const res = await fetch('http://localhost:5000/api/aliado', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(datos)
      });
  
      const text = await res.text();
      console.log('🧾 Respuesta cruda:', text);
  
      try {
        const json = JSON.parse(text);
        console.log('✅ JSON parseado:', json);
  
        if (!json.message || json.message === 'undefined' || json.message === null || json.message.trim() === '') {
          alert('Hubo un problema con el registro. Intenta de nuevo.');
          return;
        }
  
        alert(json.message);
        setTimeout(() => {
          navigate('/registration-success');
        }, 100);
      } catch (err) {
        console.error('No es JSON válido:', err);
        alert('Respuesta no válida del servidor:\n' + text);
      }
  
    } catch (error) {
      console.error('Error de red:', error);
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
    <div className="content-wrapper">
      <form className="form-grid">
        <div className="form-group">
          <label>Correo (para la creación de la cuenta)</label>
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
          <label>Correo (personal)</label>
          <input className="form-input" type="email" name="correo" onChange={handleInput} />
        </div>
        <div className="form-group">
          <label>Tipo de apoyo a brindar (descripción)</label>
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
              <TableSelect
                title="Formación Docente"
                needs={formacionDocente}
                selectedNeeds={needsData.formacionDocente}
                onChange={(selected) => {
                  setNeedsData(prev => ({ ...prev, formacionDocente: selected }));
                  agregarApoyo("Formación Docente", selected);
                }}
              />
              <TableSelect
                title="Formación a familias"
                needs={formacionFamilias}
                selectedNeeds={needsData.formacionFamilias}
                onChange={(selected) => {
                  setNeedsData(prev => ({ ...prev, formacionFamilias: selected }));
                  agregarApoyo("Formación a familias", selected);
                }}
              />
              <TableSelect
                title="Formación niñas y niños"
                needs={formacionNiños}
                selectedNeeds={needsData.formacionNiños}
                onChange={(selected) => {
                  setNeedsData(prev => ({ ...prev, formacionNiños: selected }));
                  agregarApoyo("Formación niñas y niños", selected);
                }}
              />
              <TableSelect
                title="Personal de apoyo"
                needs={personalApoyo}
                selectedNeeds={needsData.personalApoyo}
                onChange={(selected) => {
                  setNeedsData(prev => ({ ...prev, personalApoyo: selected }));
                  agregarApoyo("Personal de apoyo", selected);
                }}
              />
              <TableSelect
                title="Infraestructura"
                needs={infraestructura}
                selectedNeeds={needsData.infraestructura}
                onChange={(selected) => {
                  setNeedsData(prev => ({ ...prev, infraestructura: selected }));
                  agregarApoyo("Infraestructura", selected);
                }}
              />
              <TableSelect
                title="Materiales"
                needs={materiales}
                selectedNeeds={needsData.materiales}
                onChange={(selected) => {
                  setNeedsData(prev => ({ ...prev, materiales: selected }));
                  agregarApoyo("Materiales", selected);
                }}
              />
              <TableSelect
                title="Mobiliario"
                needs={mobiliario}
                selectedNeeds={needsData.mobiliario}
                onChange={(selected) => {
                  setNeedsData(prev => ({ ...prev, mobiliario: selected }));
                  agregarApoyo("Mobiliario", selected);
                }}
              />
              <TableSelect
                title="Alimentación"
                needs={alimentacion}
                selectedNeeds={needsData.alimentacion}
                onChange={(selected) => {
                  setNeedsData(prev => ({ ...prev, alimentacion: selected }));
                  agregarApoyo("Alimentación", selected);
                }}
              />
              <TableSelect
                title="Transporte"
                needs={transporte}
                selectedNeeds={needsData.transporte}
                onChange={(selected) => {
                  setNeedsData(prev => ({ ...prev, transporte: selected }));
                  agregarApoyo("Transporte", selected);
                }}
              />
              <TableSelect
                title="Jurídico"
                needs={juridico}
                selectedNeeds={needsData.juridico}
                onChange={(selected) => {
                  setNeedsData(prev => ({ ...prev, juridico: selected }));
                  agregarApoyo("Jurídico", selected);
                }}
              />
              <div className="documento-upload">
              <div className="heading-need">COMPROBANTE OFICIAL</div>
              <div className="upload-container">
                <label htmlFor="documento-persona-fisica" className="upload-button">
                  Sube tu CURP y copia de tu INE
                </label>
                <input
                  type="file"
                  id="documento-persona-fisica"
                  accept=".pdf,.jpg,.jpeg,.png"
                  multiple
                  onChange={async (e) => {
                    const files = Array.from(e.target.files);
                    for (const file of files) {
                      const formData = new FormData();
                      formData.append("archivo", file);
                      formData.append("tipo", "aliado");
                      formData.append("id", "temporal");

                      try {
                        const res = await fetch("/api/documents/upload", {
                          method: "POST",
                          body: formData,
                        });

                        const data = await res.json();
                        if (res.ok) {
                          const nuevoDoc = {
                            tipo: file.type.split("/")[1],
                            ruta: data.url,
                            nombre: file.name,
                          };
                          setDocumentosSubidos((prev) => [...prev, nuevoDoc]);
                          console.log("Documento guardado:", nuevoDoc);
                        } else {
                          console.error("Error al subir documento:", data.reason);
                          alert("Hubo un error al subir el archivo.");
                        }
                      } catch (err) {
                        console.error("Error de red:", err);
                        alert("Error al subir el archivo. Intenta nuevamente.");
                      }
                    }
                  }}
                  style={{ display: "none" }}
                />
                {documentosSubidos.length > 0 && (
                  <div className="archivo-seleccionado">
                    <strong>Archivos seleccionados:</strong>
                    <ul>
                      {documentosSubidos.map((doc, idx) => (
                        <li key={idx}>{doc.nombre}</li>
                      ))}
                    </ul>
                  </div>
                )}
              </div>
            </div>

              <a
                href="aviso-privacidad-2023.pdf"
                target="_blank"
                rel="noopener noreferrer"
                className="link-descarga"
              >
                Ver aviso de privacidad (PDF)
              </a>

              <div className="consent-container">
                <label className="consent-label">
                  <input 
                    type="checkbox" 
                    className="consent-checkbox" 
                    checked={aceptaTerminos} 
                    onChange={(e) => setAceptaTerminos(e.target.checked)} 
                  />
                  <span className="consent-text">
                    Leí y estoy de acuerdo con el aviso de privacidad, me comprometo a ayudar a la o las escuelas durante un ciclo escolar completo.
                  </span>
                </label>
              </div>  
            </div>
            <button className="continue-button" onClick={enviarFormulario} disabled={!aceptaTerminos}>
              CONTINUAR
            </button>          
            </>
        )}
        {step === 2 && tipoPersona === 'moral' && (
          <>
            <p className="label">Persona moral</p>
            <div className="content-wrapper">
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
              <label>RFC (se usará para todos los registros)</label>
              <input className="form-input" type="text" name="rfc" onChange={handleInput} />
            </div> 
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
                  <input className="form-input" type="date" name="fechaEscritura" onChange={handleInput} />                </div>
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
                  <input className="form-input" type="text" name="representanteNombre" onChange={handleInput} />               </div>
                <div className="form-group">
                  <label>Correo</label>
                  <input className="form-input" type="text" name="representanteCorreo" onChange={handleInput} />                  </div>
                <div className="form-group">
                  <label>Teléfono</label>
                  <input className="form-input" type="text" name="representanteTelefono" onChange={handleInput} />                </div>
                <div className="form-group">
                  <label>Área a la que pertenece en la organización</label>
                  <input className="form-input" type="text" name="representanteArea" onChange={handleInput} />                </div>
              </form>
              <div className="form-group">
                  <label>Tipo de apoyo a brindar (descripción)</label>
                  <input className="form-input" type="text" name="tipoApoyo" onChange={handleInput} />
                </div>
                <div className="heading-need">REGISTRA TU APOYO</div>
                <p className='label'>Selecciona en que necesidades podrías apoyar</p> 
                <TableSelect
                  title="Formación Docente"
                  needs={formacionDocente}
                  selectedNeeds={needsData.formacionDocente}
                  onChange={(selected) => {
                    setNeedsData(prev => ({ ...prev, formacionDocente: selected }));
                    agregarApoyo("Formación Docente", selected);
                  }}
                />
                <TableSelect
                  title="Formación a familias"
                  needs={formacionFamilias}
                  selectedNeeds={needsData.formacionFamilias}
                  onChange={(selected) => {
                    setNeedsData(prev => ({ ...prev, formacionFamilias: selected }));
                    agregarApoyo("Formación a familias", selected);
                  }}
                />
                <TableSelect
                  title="Formación niñas y niños"
                  needs={formacionNiños}
                  selectedNeeds={needsData.formacionNiños}
                  onChange={(selected) => {
                    setNeedsData(prev => ({ ...prev, formacionNiños: selected }));
                    agregarApoyo("Formación niñas y niños", selected);
                  }}
                />
                <TableSelect
                  title="Personal de apoyo"
                  needs={personalApoyo}
                  selectedNeeds={needsData.personalApoyo}
                  onChange={(selected) => {
                    setNeedsData(prev => ({ ...prev, personalApoyo: selected }));
                    agregarApoyo("Personal de apoyo", selected);
                  }}
                />
                <TableSelect
                  title="Infraestructura"
                  needs={infraestructura}
                  selectedNeeds={needsData.infraestructura}
                  onChange={(selected) => {
                    setNeedsData(prev => ({ ...prev, infraestructura: selected }));
                    agregarApoyo("Infraestructura", selected);
                  }}
                />
                <TableSelect
                  title="Materiales"
                  needs={materiales}
                  selectedNeeds={needsData.materiales}
                  onChange={(selected) => {
                    setNeedsData(prev => ({ ...prev, materiales: selected }));
                    agregarApoyo("Materiales", selected);
                  }}
                />
                <TableSelect
                  title="Mobiliario"
                  needs={mobiliario}
                  selectedNeeds={needsData.mobiliario}
                  onChange={(selected) => {
                    setNeedsData(prev => ({ ...prev, mobiliario: selected }));
                    agregarApoyo("Mobiliario", selected);
                  }}
                />
                <TableSelect
                  title="Alimentación"
                  needs={alimentacion}
                  selectedNeeds={needsData.alimentacion}
                  onChange={(selected) => {
                    setNeedsData(prev => ({ ...prev, alimentacion: selected }));
                    agregarApoyo("Alimentación", selected);
                  }}
                />
                <TableSelect
                  title="Transporte"
                  needs={transporte}
                  selectedNeeds={needsData.transporte}
                  onChange={(selected) => {
                    setNeedsData(prev => ({ ...prev, transporte: selected }));
                    agregarApoyo("Transporte", selected);
                  }}
                />
                <TableSelect
                  title="Jurídico"
                  needs={juridico}
                  selectedNeeds={needsData.juridico}
                  onChange={(selected) => {
                    setNeedsData(prev => ({ ...prev, juridico: selected }));
                    agregarApoyo("Jurídico", selected);
                  }}
                />
                <div className="documento-upload">
                  <div className="heading-need">COMPROBANTE OFICIAL</div>
                  <div className="upload-container">
                    <label htmlFor="documento-persona-moral" className="upload-button">
                      Sube un comprobante oficial de persona moral
                    </label>

                    <input
                      type="file"
                      id="documento-persona-moral"
                      accept=".pdf,.jpg,.jpeg,.png"
                      onChange={async (e) => {
                        const file = e.target.files[0];
                        if (file) {
                          setDocumentoPersonaMoral(file);
                          setNombreArchivo(file.name);

                          const formData = new FormData();
                          formData.append("archivo", file);
                          formData.append("tipo", "aliado");
                          formData.append("id", "temporal");

                          try {
                            const res = await fetch("/api/documents/upload", {
                              method: "POST",
                              body: formData,
                            });

                            const data = await res.json();
                            if (res.ok) {
                              const nuevoDoc = {
                                tipo: file.type.split("/")[1],
                                ruta: data.url,
                                nombre: file.name,
                              };
                              setDocumentosSubidos((prev) => [...prev, nuevoDoc]);
                              console.log(" Documento guardado:", nuevoDoc);
                            } else {
                              console.error(" Error al subir documento:", data.reason);
                              alert("Hubo un error al subir el archivo.");
                            }
                          } catch (err) {
                            console.error("Error de red:", err);
                            alert("Error al subir el archivo. Intenta nuevamente.");
                          }
                        }
                      }}
                      style={{ display: "none" }}
                    />

                    {nombreArchivo && (
                      <div className="archivo-seleccionado">
                        <span>Archivo seleccionado: {nombreArchivo}</span>
                      </div>
                    )}
                  </div>
                </div>

                <a
                  href="aviso-privacidad-2023.pdf"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="link-descarga"
                >
                  Ver aviso de privacidad (PDF)
                </a>
                <div className="consent-container">
                <label className="consent-label">
                  <input 
                    type="checkbox" 
                    className="consent-checkbox" 
                    checked={aceptaTerminos} 
                    onChange={(e) => setAceptaTerminos(e.target.checked)} 
                  />
                  <span className="consent-text">
                  Leí y estoy de acuerdo con el aviso de privacidad, me comprometo a ayudar a la o las escuelas durante un ciclo escolar completo.
                  </span>
                </label>
              </div>
            </div>
            <button className="continue-button" onClick={enviarFormulario} disabled={!aceptaTerminos}>
              CONTINUAR
            </button>          
            </>
        )}
      </div>
    </div>
  );
}

export default RegisterAlly;