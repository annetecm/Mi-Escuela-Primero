import React, { useState } from 'react';
import '../styles/RegisterAlly.css';
import TableSelect from '../components/TableSelect';
import aliadoImg from '../assets/aliado.jpg';

export default function EditPhysical() {
  const [formData, setFormData] = useState({});
  const [apoyosSeleccionados, setApoyosSeleccionados] = useState([]);
  const [aceptaTerminos, setAceptaTerminos] = useState(false);
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

  const handleInput = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const agregarApoyo = (categoria, seleccionados) => {
    const nuevos = seleccionados.map(desc => ({ tipo: categoria, caracteristicas: desc }));
    setApoyosSeleccionados(prev => [
      ...prev.filter(a => a.tipo !== categoria),
      ...nuevos
    ]);
  };

  const enviarFormulario = (e) => {
    e.preventDefault();
    console.log("Formulario enviado", formData, apoyosSeleccionados);
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
        <img src={aliadoImg} alt="Aliado" />
      </div>
      <div className="form-section">
        <h1 className="title">Edita tu información</h1>

        <form onSubmit={enviarFormulario}>
          <div className="form-grid">
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
          </div>

          <div className="heading-need">REGISTRA TU APOYO</div>
          <p className="label">Selecciona en qué necesidades podrías apoyar</p>

          <TableSelect title="Formación Docente" needs={formacionDocente} selectedNeeds={needsData.formacionDocente} onChange={(s) => { setNeedsData(prev => ({ ...prev, formacionDocente: s })); agregarApoyo("Formación Docente", s); }} />
          <TableSelect title="Formación a familias" needs={formacionFamilias} selectedNeeds={needsData.formacionFamilias} onChange={(s) => { setNeedsData(prev => ({ ...prev, formacionFamilias: s })); agregarApoyo("Formación a familias", s); }} />
          <TableSelect title="Formación niñas y niños" needs={formacionNiños} selectedNeeds={needsData.formacionNiños} onChange={(s) => { setNeedsData(prev => ({ ...prev, formacionNiños: s })); agregarApoyo("Formación niñas y niños", s); }} />
          <TableSelect title="Personal de apoyo" needs={personalApoyo} selectedNeeds={needsData.personalApoyo} onChange={(s) => { setNeedsData(prev => ({ ...prev, personalApoyo: s })); agregarApoyo("Personal de apoyo", s); }} />
          <TableSelect title="Infraestructura" needs={infraestructura} selectedNeeds={needsData.infraestructura} onChange={(s) => { setNeedsData(prev => ({ ...prev, infraestructura: s })); agregarApoyo("Infraestructura", s); }} />
          <TableSelect title="Materiales" needs={materiales} selectedNeeds={needsData.materiales} onChange={(s) => { setNeedsData(prev => ({ ...prev, materiales: s })); agregarApoyo("Materiales", s); }} />
          <TableSelect title="Mobiliario" needs={mobiliario} selectedNeeds={needsData.mobiliario} onChange={(s) => { setNeedsData(prev => ({ ...prev, mobiliario: s })); agregarApoyo("Mobiliario", s); }} />
          <TableSelect title="Alimentación" needs={alimentacion} selectedNeeds={needsData.alimentacion} onChange={(s) => { setNeedsData(prev => ({ ...prev, alimentacion: s })); agregarApoyo("Alimentación", s); }} />
          <TableSelect title="Transporte" needs={transporte} selectedNeeds={needsData.transporte} onChange={(s) => { setNeedsData(prev => ({ ...prev, transporte: s })); agregarApoyo("Transporte", s); }} />
          <TableSelect title="Jurídico" needs={juridico} selectedNeeds={needsData.juridico} onChange={(s) => { setNeedsData(prev => ({ ...prev, juridico: s })); agregarApoyo("Jurídico", s); }} />

          <button className="continue-button" type="submit">
            CONTINUAR
          </button>
        </form>
      </div>
    </div>
  );
}

