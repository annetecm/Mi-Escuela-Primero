import "../styles/RegisterSchool.css"
import TableSelect from "../components/TableSelect"
import niñosImg from "../assets/niños.png"
import { useState } from "react";

function RegisterSchool() {
  // Add states for user data
  const [formData, setFormData] = useState({
    usuario: {
      correoElectronico: "",
      contraseña: "",
      nombre: ""
    },
    escuela: {
      nombre: "",
      direccion: {
        calleNumero: "",
        colonia: "",
        municipio: ""
      },
      sostenimiento: "estatal",
      zonaEscolar: "",
      sectorEscolar: "",
      modalidad: "general",
      nivelEducativo: "",
      CCT: "",
      tieneUSAER: false,
      numeroDocentes: "",
      estudiantesPorGrupo: "",
      controlAdministrativo: "",
      director: {
        nombre: "",
        correoElectronico: "",
        telefono: "",
        fechaJubilacion: "",
        posibleCambioPlantel: false,
        antiguedadPuesto: ""
      },
      supervisor: {
        nombre: "",
        correoElectronico: "",
        telefono: "",
        fechaJubilacion: "",
        posibleCambioZona: false,
        medioContacto: "whatsapp",
        antiguedadZona: ""
      },
      mesaDirectiva: {
        personasCantidad: ""
      },
      apoyoPrevio: {

        descripcion: "",

      }
    },
  
  });

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

    const [isSubmitting, setIsSubmitting] = useState(false);
    const [error, setError] = useState(null);

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    const keys = name.split(".");
  
    setFormData((prevData) => {
      let updatedData = { ...prevData };
      let temp = updatedData;
  
      // Recorremos hasta la clave final
      for (let i = 0; i < keys.length - 1; i++) {
        temp[keys[i]] = { ...temp[keys[i]] }; // copiamos el nivel actual
        temp = temp[keys[i]]; // bajamos un nivel
      }
  
      temp[keys[keys.length - 1]] = value; // actualizamos el valor
  
      return updatedData;
    });
  };
  const handleSubmit = async (e) => {
    e.preventDefault();
    setIsSubmitting(true);
    
    try {
      // console.log to verify the data being sent
      console.log("Submitting:", JSON.stringify({
        usuario: formData.usuario,
        escuela: {
          ...formData.escuela,
          direccion: `${formData.escuela.direccion.calleNumero}, ${formData.escuela.direccion.colonia}, ${formData.escuela.direccion.municipio}`,
          numeroDocentes: Number(formData.escuela.numeroDocentes),
          estudiantesPorGrupo: Number(formData.escuela.estudiantesPorGrupo),
          tieneUSAER: Boolean(formData.escuela.tieneUSAER)
        }
      }, null, 2));
  
      const response = await fetch("http://localhost:5000/api/escuela/register", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          usuario: formData.usuario,
          escuela: {
            ...formData.escuela,
            direccion: `${formData.escuela.direccion.calleNumero}, ${formData.escuela.direccion.colonia}, ${formData.escuela.direccion.municipio}`,
            numeroDocentes: Number(formData.escuela.numeroDocentes),
            estudiantesPorGrupo: Number(formData.escuela.estudiantesPorGrupo),
            tieneUSAER: Boolean(formData.escuela.tieneUSAER)
          }
        }),
      });
  
      const data = await response.json();
      console.log("Server response:", data); // Add this to see backend response
  
      if (!response.ok) throw new Error(data.error || "Registration failed");
      
      alert("Registro exitoso. En espera de aprobación.");
    } catch (err) {
      console.error("Registration error:", err);
      alert(`Error: ${err.message}`);
    } finally {
      setIsSubmitting(false);
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
    "Sexualidad",
  ]

  const formacionFamilias = [
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
    "Nueva Escuela Mexicana",
  ]

  const formacionNiños = [
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
    "Visitas fuera de la escuela (a empresas o lugares recreativos)",
  ]

  const personalApoyo = [
    "Psicólogo",
    "Psicopedagogo o especialista en BAP",
    "Suplentes de docentes frente a grupo",
    "Maestro para clases de educación física",
    "Terapeuta de lenguaje o comunicación",
    "Maestro para clases de arte",
    "Persona para apoyo en limpieza",
    "Maestro para clases de idiomas",
    "Persona para apoyo administrativo",
  ]

  const infraestructura = [
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
    "Ventanas y puertas (ventanas y puertas nuevas, protección para ventanas, candados para puertas)",
  ]

  const materiales = [
    "Tecnológico (computadoras, impresoras, proyectores, pantallas, bocinas, extensiones, cables HDMI, etc.)",
    "Didácticos (plastilina, cartulinas, hojas, marcadores, crayolas, lápices, colores, juegos para aprender fracciones, multiplicaciones, regletas, rompecabezas, geoplanos, bloques geométricos, billetes de juego, alimentos de juego, microscopio, etc.)",
    "De educación física (sogas, pelotas, aros, tinas, balones, porterías, redes para canastas o para voleibol, etc.)",
    "Literarios (libros infantiles, manuales, libros de texto, libros en braille, libros macrotipo, libros para estudiantes de lengua indígena, programas de estudio, etc.)",
  ]

  const mobiliario = [
    "Mesas para niños/ mesabancos",
    "Sillas (para niños o para maestros)",
    "Mesas para docentes",
    "Pizarrones",
    "Comedores",
    "Estantes, libreros o cajoneras",
  ]

  const alimentacion = ["Desayunos", "Fórmula"]

  const transporte = [
    "Transporte (nuevas rutas de camiones, transporte escolar,entrega de bicis, etc.)",
    "Arreglo de camino (puentes en arroyos, aplanadora de camino, luminaria, etc.)",
  ]

  const juridico = ["Apoyo en gestión de escrituras (cuando el inmueble no las tiene)"]

  return (
    <div className="register-container">
      <div className="image-section">
        <img src={niñosImg || "/placeholder.svg"} alt="Niños foto" />
      </div>
      <div className="form-section">
        <h1 className="title">Registrar mi escuela</h1>
        <p className="label">Ingresa la información para crear tu cuenta</p>
        <div className="scroll">
        {/* Sección de credenciales */}
<div className="form-grid">
  <div className="form-group">
    <label>Correo</label>
    <input 
      className="form-input" 
      type="text"
      name="usuario.correoElectronico"
      value={formData.usuario.correoElectronico}
      onChange={handleInputChange}
    />
  </div>
  <div className="form-group">
    <label>Contraseña</label>
    <input 
      className="form-input" 
      type="password" 
      name="usuario.contraseña"
      value={formData.usuario.contraseña}
      onChange={handleInputChange}
    />
  </div>
</div>

{/* Sección de datos de la escuela */}
<div className="heading">DATOS DE LA ESCUELA</div>
<div className="form-grid">
  <div className="form-group">
    <label>Nombre de la escuela</label>
    <input 
      className="form-input" 
      type="text"
      name="usuario.nombre"
      value={formData.usuario.nombre}
      onChange={handleInputChange} 
    />
  </div>
  <div className="form-group">
    <label>Clave CCT</label>
    <input 
      className="form-input"
      type="text" 
      name="escuela.CCT"
      value={formData.escuela.CCT}
      onChange={handleInputChange}
    />
  </div>
  <div className="form-group">
    <label>Nivel Educativo</label>
    <input 
      className="form-input"
      type="text"
      name="escuela.nivelEducativo" 
      value={formData.escuela.nivelEducativo}
      onChange={handleInputChange}
    />
  </div>
  <div className="form-group">
    <label htmlFor="modalidad">Modalidad</label>
    <select 
      id="modalidad" 
      className="form-input"
      name="escuela.modalidad"
      value={formData.escuela.modalidad}
      onChange={handleInputChange}
    >
      <option value="general">General</option>
      <option value="comunitaria">Comunitaria</option>
      <option value="indigena">Indígena</option>
      <option value="general_multigrado">General multigrado</option>
    </select>
  </div>
  <div className="form-group">
    <label>Control administrativo</label>
    <input 
      className="form-input" 
      type="text" 
      name="escuela.controlAdministrativo"
      value={formData.escuela.controlAdministrativo}
      onChange={handleInputChange}
    />
  </div>
  <div className="form-group">
    <label htmlFor="sostenimiento">Sostenimiento</label>
    <select 
      id="sostenimiento" 
      className="form-input"
      name="escuela.sostenimiento"
      value={formData.escuela.sostenimiento}
      onChange={handleInputChange}
    >
      <option value="estatal">Estatal</option>
      <option value="federal">Federal</option>
    </select>
  </div>
  <div className="form-group">
    <label>Zona escolar</label>
    <input 
      className="form-input" 
      type="text"
      name="escuela.zonaEscolar"
      value={formData.escuela.zonaEscolar}
      onChange={handleInputChange}
    />
  </div>
  <div className="form-group">
    <label>Sector escolar</label>
    <input 
      className="form-input" 
      type="text"
      name="escuela.sectorEscolar"
      value={formData.escuela.sectorEscolar}
      onChange={handleInputChange}
    />
  </div>
</div>

{/* Sección de dirección */}
<p className="special-label">Dirección</p>
<div className="form-grid">
  <div className="form-group">
    <label>Calle y número</label>
    <input 
      className="form-input" 
      type="text" 
      name="escuela.direccion.calleNumero"
      value={formData.escuela.direccion.calleNumero}
      onChange={handleInputChange}
    />
  </div>
  <div className="form-group">
    <label>Colonia</label>
    <input 
      className="form-input"
      type="text" 
      name="escuela.direccion.colonia"
      value={formData.escuela.direccion.colonia}
      onChange={handleInputChange}
    />
  </div>
  <div className="form-group">
    <label>Municipio</label>
    <input 
      className="form-input" 
      type="text" 
      name="escuela.direccion.municipio"
      value={formData.escuela.direccion.municipio}
      onChange={handleInputChange}
    />
  </div>
</div>
{/* Sección de datos del director */}
<div className="heading">DATOS DE CONTACTO CON EL/LA DIRECTOR/A</div>
<div className="form-single-column">
  <div className="form-group">
    <label>Nombre del director(a)</label>
    <input 
      className="form-input" 
      type="text" 
      name="escuela.director.nombre"
      value={formData.escuela.director.nombre}
      onChange={handleInputChange}
    />
  </div>
  <div className="form-group">
    <label>Número celular</label>
    <input
      className="form-input" 
      type="text"
      name="escuela.director.telefono"
      value={formData.escuela.director.telefono}
      onChange={handleInputChange}
    />
  </div>
  <div className="form-group">
    <label>Correo</label>
    <input 
      className="form-input" 
      type="text" 
      name="escuela.director.correoElectronico"
      value={formData.escuela.director.correoElectronico}
      onChange={handleInputChange}
    />
  </div>
  <div className="form-group">
    <label>¿Cuántos años lleva en ese puesto en la escuela?</label>
    <input 
      className="form-input" 
      type="text" 
      name="escuela.director.antiguedadPuesto"
      value={formData.escuela.director.antiguedadPuesto}
      onChange={handleInputChange}
    />
  </div>
  <div className="form-group">
    <label>¿Está próximo a jubilarse? Si sí, ¿cuándo?</label>
    <input 
      className="form-input" 
      type="text" 
      name="escuela.director.fechaJubilacion"
      value={formData.escuela.director.fechaJubilacion}
      onChange={handleInputChange}
    />
  </div>
  <div className="form-group">
    <label>¿Ha solicitado cambio de escuela?</label>
    <input 
      className="form-input" 
      type="text" 
      name="escuela.director.posibleCambioPlantel"
      value={formData.escuela.director.posibleCambioPlantel}
      onChange={handleInputChange}
    />
  </div>
</div>

{/* Sección de datos del supervisor */}
<div className="heading">DATOS DE CONTACTO CON EL/LA SUPERVISOR/A</div>
<div className="form-single-column">
  <div className="form-group">
    <label>Nombre del supervisor(a)</label>
    <input
      className="form-input"
      type="text"
      name="escuela.supervisor.nombre"
      value={formData.escuela.supervisor.nombre}
      onChange={handleInputChange}
    />
  </div>
  <div className="form-group">
    <label>Número celular</label>
    <input
      className="form-input"
      type="text"
      name="escuela.supervisor.telefono"
      value={formData.escuela.supervisor.telefono}
      onChange={handleInputChange}
    />
  </div>
  <div className="form-group">
    <label>Correo</label>
    <input
      className="form-input"
      type="text"
      name="escuela.supervisor.correoElectronico"
      value={formData.escuela.supervisor.correoElectronico}
      onChange={handleInputChange}
    />
  </div>
  <div className="form-group">
    <label htmlFor="medio-preferido">Medio preferido de contacto</label>
    <select
      id="medio-preferido"
      className="form-input"
      name="escuela.supervisor.medioContacto"
      value={formData.escuela.supervisor.medioContacto}
      onChange={handleInputChange}
    >
      <option value="whatsapp">Whatsapp</option>
      <option value="correo">Correo</option>
    </select>
  </div>
  <div className="form-group">
    <label>¿Cuántos años lleva en ese puesto en esa zona?</label>
    <input
      className="form-input"
      type="text"
      name="escuela.supervisor.antiguedadZona"
      value={formData.escuela.supervisor.antiguedadZona}
      onChange={handleInputChange}
    />
  </div>
  <div className="form-group">
    <label>¿Está próximo a jubilarse? Si sí, ¿cuándo?</label>
    <input
      className="form-input"
      type="text"
      name="escuela.supervisor.fechaJubilacion"
      value={formData.escuela.supervisor.fechaJubilacion}
      onChange={handleInputChange}
    />
  </div>
  <div className="form-group">
    <label>¿Ha solicitado cambio de zona?</label>
    <input
      className="form-input"
      type="text"
      name="escuela.supervisor.posibleCambioZona"
      value={formData.escuela.supervisor.posibleCambioZona}
      onChange={handleInputChange}
    />
  </div>
</div>

{/* Sección de datos del ciclo escolar */}
<div className="heading">DATOS DE LA ESCUELA CICLO 2024-2025</div>
<div className="form-single-column">
  <div className="form-group">
    <label>Numero de estudiantes por grupo (en promedio)</label>
    <input
      className="form-input"
      type="text"
      name="escuela.estudiantesPorGrupo"
      value={formData.escuela.estudiantesPorGrupo}
      onChange={handleInputChange}
    />
  </div>
  <div className="form-group">
    <label>Número de docentes frente a grupo</label>
    <input
      className="form-input"
      type="text"
      name="escuela.numeroDocentes"
      value={formData.escuela.numeroDocentes}
      onChange={handleInputChange}
    />
  </div>
  <div className="form-group">
    <label>Número de docentes de asignaturas especiales (ej. educación física)</label>
    <input
      className="form-input"
      type="text"
      name="escuela.numeroDocentesEspeciales"
      value={formData.escuela.numeroDocentesEspeciales}
      onChange={handleInputChange}
    />
  </div>
  <div className="form-group">
    <label>¿Cuentan con USAER? (Si/No)</label>
    <input
      className="form-input"
      type="text"
      name="escuela.tieneUSAER"
      value={formData.escuela.tieneUSAER}
      onChange={handleInputChange}
    />
  </div>
  <div className="form-group">
    <label>
      ¿Cuentan con mesa de padres de familia? Si sí, ¿por cuántas personas está conformada?
    </label>
    <input
      className="form-input"
      type="text"
      name="escuela.mesaDirectiva.personasCantidad"
      value={formData.escuela.mesaDirectiva.personasCantidad}
      onChange={handleInputChange}
    />
  </div>
  <div className="form-group">
    <label>
      En los últimos dos ciclos escolares, ¿han recibido apoyo del Gobierno Municipal? Si sí, ¿qué instancia y qué apoyo?
    </label>
    <input
      className="form-input"
      type="text"
      name="escuela.apoyoPrevio.descripcion"
      value={formData.escuela.apoyoPrevio.descripcion}
      onChange={handleInputChange}
    />
  </div>
</div>




          {/* Sección de registro de necesidades prioritarias */}
<div className="heading-need">REGISTRA LAS NECESIDADES DE TU ESCUELA</div>
<p className="label">
  Selecciona una o más necesidades que identifiques en tu institución. Puedes marcar varias opciones por categoría.
</p>

{/* Categorías de necesidades con sus títulos descriptivos */}
<TableSelect title="Capacitación para docentes" needs={formacionDocente} />
<TableSelect title="Talleres o formación para madres, padres o cuidadores" needs={formacionFamilias} />
<TableSelect title="Actividades formativas para niñas y niños" needs={formacionNiños} />
<TableSelect title="Apoyo para personal administrativo o de servicio" needs={personalApoyo} />
<TableSelect title="Mejoras en infraestructura escolar" needs={infraestructura} />
<TableSelect title="Materiales didácticos o escolares" needs={materiales} />
<TableSelect title="Mobiliario escolar (sillas, mesas, pizarrones, etc.)" needs={mobiliario} />
<TableSelect title="Apoyo en alimentación escolar" needs={alimentacion} />
<TableSelect title="Necesidades de transporte escolar" needs={transporte} />
<TableSelect title="Asesoría o acompañamiento jurídico" needs={juridico} />

<button 
        className="continue-button" 
        onClick={handleSubmit}
        disabled={isSubmitting}
      >
        {isSubmitting ? "ENVIANDO..." : "CONTINUAR"}
      </button>

      {error && <div className="error-message">{error}</div>}
    </div>

        </div>
      </div>
  )
}






export default RegisterSchool
