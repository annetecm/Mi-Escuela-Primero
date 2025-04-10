import "../styles/RegisterSchool.css"
import TableSelect from "../components/TableSelect"
import niñosImg from "../assets/niños.png"

function RegisterSchool() {
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
              <input className="form-input" type="text" />
            </div>
            <div className="form-group">
              <label>Contraseña</label>
              <input className="form-input" type="password" />
            </div>
          </div>

          {/* Sección de datos de la escuela */}
          <div className="heading">DATOS DE LA ESCUELA</div>
          <div className="form-grid">
            <div className="form-group">
              <label>Nombre de la escuela</label>
              <input className="form-input" type="text" />
            </div>
            <div className="form-group">
              <label>Clave CCT</label>
              <input className="form-input" type="text" />
            </div>
            <div className="form-group">
              <label>Nivel Educativo</label>
              <input className="form-input" type="text" />
            </div>
            <div className="form-group">
              <label htmlFor="modalidad">Modalidad</label>
              <select id="modalidad" className="form-input">
                <option value="general">General</option>
                <option value="comunitaria">Comunitaria</option>
                <option value="indigena">Indígena</option>
                <option value="general_multigrado">General multigrado</option>
              </select>
            </div>
            <div className="form-group">
              <label>Control administrativo</label>
              <input className="form-input" type="text" />
            </div>
            <div className="form-group">
              <label htmlFor="sostenimiento">Sostenimiento</label>
              <select id="sostenimiento" className="form-input">
                <option value="estatal">Estatal</option>
                <option value="federal">Federal</option>
              </select>
            </div>
            <div className="form-group">
              <label>Zona escolar</label>
              <input className="form-input" type="text" />
            </div>
            <div className="form-group">
              <label>Sector escolar</label>
              <input className="form-input" type="text" />
            </div>
          </div>

          {/* Sección de dirección */}
          <p className="special-label">Dirección</p>
          <div className="form-grid">
            <div className="form-group">
              <label>Calle y número</label>
              <input className="form-input" type="text" />
            </div>
            <div className="form-group">
              <label>Colonia</label>
              <input className="form-input" type="text" />
            </div>
            <div className="form-group">
              <label>Municipio</label>
              <input className="form-input" type="text" />
            </div>
          </div>

          {/* Sección de datos del director */}
          <div className="heading">DATOS DE CONTACTO CON EL/LA DIRECTOR/A</div>
          <div className="form-single-column">
            <div className="form-group">
              <label>Nombre del director(a)</label>
              <input className="form-input" type="text" />
            </div>
            <div className="form-group">
              <label>Número celular</label>
              <input className="form-input" type="text" />
            </div>
            <div className="form-group">
              <label>Correo</label>
              <input className="form-input" type="text" />
            </div>
            <div className="form-group">
              <label>¿Cuántos años lleva en ese puesto en la escuela?</label>
              <input className="form-input" type="text" />
            </div>
            <div className="form-group">
              <label>¿Está próximo a jubilarse? Si sí, ¿cuándo?</label>
              <input className="form-input" type="text" />
            </div>
            <div className="form-group">
              <label>¿Ha solicitado cambio de escuela?</label>
              <input className="form-input" type="text" />
            </div>
          </div>

          {/* Sección de datos del supervisor */}
          <div className="heading">DATOS DE CONTACTO CON EL/LA SUPERVISOR/A</div>
          <div className="form-single-column">
            <div className="form-group">
              <label>Nombre del supervisor(a)</label>
              <input className="form-input" type="text" />
            </div>
            <div className="form-group">
              <label>Número celular</label>
              <input className="form-input" type="text" />
            </div>
            <div className="form-group">
              <label>Correo</label>
              <input className="form-input" type="text" />
            </div>
            <div className="form-group">
              <label htmlFor="medio-preferido">Medio preferido de contacto</label>
              <select id="medio-preferido" className="form-input">
                <option value="whatsapp">Whatsapp</option>
                <option value="correo">Correo</option>
              </select>
            </div>
            <div className="form-group">
              <label>¿Cuántos años lleva en ese puesto en esa zona?</label>
              <input className="form-input" type="text" />
            </div>
            <div className="form-group">
              <label>¿Está próximo a jubilarse? Si sí, ¿cuándo?</label>
              <input className="form-input" type="text" />
            </div>
            <div className="form-group">
              <label>¿Ha solicitado cambio de zona?</label>
              <input className="form-input" type="text" />
            </div>
          </div>

          {/* Sección de datos del ciclo escolar */}
          <div className="heading">DATOS DE LA ESCUELA CICLO 2024-2025</div>
          <div className="form-single-column">
            <div className="form-group">
              <label>Numero de estudiantes por grupo (en promedio)</label>
              <input className="form-input" type="text" />
            </div>
            <div className="form-group">
              <label>Número de docentes frente a grupo</label>
              <input className="form-input" type="text" />
            </div>
            <div className="form-group">
              <label>Número de docentes de asignaturas especiales (ej. educación física)</label>
              <input className="form-input" type="text" />
            </div>
            <div className="form-group">
              <label>¿Cuentan con USAER? (Si/No)</label>
              <input className="form-input" type="text" />
            </div>
            <div className="form-group">
              <label>¿Cuentan con mesa de padres de familia? Si sí, ¿por cuántas personas está conformada?</label>
              <input className="form-input" type="text" />
            </div>
            <div className="form-group">
              <label>
                En los últimos dos ciclos escolares, ¿han recibido apoyo del Gobierno Municipal? Si sí, ¿qué instancia y
                qué apoyo?
              </label>
              <input className="form-input" type="text" />
            </div>
          </div>

          {/* Sección de necesidades */}
          <div className="heading-need">REGISTRA TU NECESIDAD</div>
          <p className="label">Selecciona las necesidades de tu institución</p>

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

          <button className="continue-button">CONTINUAR</button>
        </div>
      </div>
    </div>
  )
}

export default RegisterSchool
