const priorities ={
    "Formacion Docente":{
        "Convivencia escolar / Cultura de paz / Valores" :9,
        "Educación inclusiva" : 8,
        "Enseñanza de lectura y matemáticas" : 8,
        "Inteligencia emocional" : 8,
        "Lectoescritura" : 8,
        "Atención de estudiantes con BAP (Barreras para el aprendizaje y la participación)" : 6,
        "Evaluación" : 6,
        "Herramientas digitales para la educación / Innovación tecnológica" : 6,
        "Proyecto de vida / Expectativas a futuro / Orientación vocacional" : 6,
        "Liderazgo y habilidades directivas" : 5,
        "Nueva Escuela Mexicana" : 5,
        "Disciplina positiva" : 4,
        "Metodologías activas (ejemplo: aprendizaje basado en proyectos, en problemas, en el juego, en servicio, gamificación, etc.)" : 4,
        "Alimentación saludable" : 4,
        "Participación infantil" : 4,
        "Comunicación efectiva con comunidad escolar" : 4,
        "Comunidades de aprendizaje" : 3,
        "Neuroeducación" : 3,
        "Sexualidad" : 3,
    },

    "Formacion a familias" : {
    "Crianza positiva" : 10,
    "Derechos y obligaciones de los padres" : 8,
    "Inteligencia emocional" : 8,
    "Atención para hijos con BAP (Barreras para el aprendizaje y la participación)" : 7,
    "Proyecto de vida /Expectativas a futuro/ Orientación vocacional" : 7,
    "Cultura de paz / Valores en el hogar" : 6,
    "Alimentación saludable" : 6,
    "Sexualidad" : 6,
    "Enseñanza de lectura y matemáticas" : 5,
    "Comunicación efectiva con escuela" : 4,
    "Nueva Escuela Mexicana" : 4,
    },

    "Formacion niñas y niños" : {
    "Lectoescritura" : 10,
    "Convivencia escolar/ Cultura de paz / Valores" : 9,
    "Enseñanza de matemáticas" : 9,
    "Educación física" : 7,
    "Inteligencia emocional" : 7,
    "Proyecto de vida /Expectativas a futuro/ Orientación vocacional" : 6,
    "Sexualidad" : 6,
    "Alimentación saludable" : 6,
    "Arte" : 6,
    "Música" : 5,
    "Computación" : 4,
    "Visitas fuera de la escuela (a empresas o lugares recreativos)" : 3,
    },

    "Personal de apoyo" :{
    "Psicólogo" : 9,
    "Psicopedagogo o especialista en BAP" : 8,
    "Suplentes de docentes frente a grupo" : 7,
    "Maestro para clases de educación física" : 7,
    "Terapeuta de lenguaje o comunicación" : 6,
    "Maestro para clases de arte" : 4,
    "Persona para apoyo en limpieza" : 4,
    "Maestro para clases de idiomas" : 4,
    "Persona para apoyo administrativo" : 3,
    },

    "Infraestructura" : {
     "Agua (falla de agua, filtros de agua, bomba de agua nueva,tinaco o cisterna nueva, bebederos, etc.)" : 10,
    "Luz (fallo eléctrico, conexión de luz, focos y cableado nuevo, paneles solares, etc.)" : 9,
    //"Suplentes de docentes frente a grupo" : 7,
    "Muros, techos o pisos (reconstrucción de muros cuarteados, tablaroca, plafón, cambio de pisos levantados,etc.)" : 7,
    "Adecuaciones para personas con discapacidad (rampas, etc.)" : 7,
    "Baños (arreglo de baños, cambio de sanitarios o lavamanos,construcción de baños, plomería, etc.)" : 6 ,
    "Cocina (construcción, remodelación de cocina)" : 5,
    "Conectividad (routers, instalación de internet, etc.)" : 5,
    "Domos y patios (estructura para domo, lonaria y/o malla sombra, nivelación de patio, plancha de concreto, etc.)" : 5,
    "Árboles (plantar nuevos, poda de árboles, arreglo de o nuevas jardineras)" : 5,
    "Pintura" : 4,
    "Seguridad (construcción o arreglo de barda perimetral, cámaras de seguridad, alambrado, cambio de barandales en mal estado, etc.)" : 4,
    "Ventanas y puertas (ventanas y puertas nuevas, protección para ventanas, candados para puertas)" : 4,

    },

    "Materiales" : {
    "Tecnológico (computadoras, impresoras, proyectores, pantallas, bocinas, extensiones, cables HDMI, etc.)" : 7,
    "Didácticos (plastilina, cartulinas, hojas, marcadores, crayolas, lápices, colores, juegos para aprender fracciones, multiplicaciones, regletas, rompecabezas, geoplanos, bloques geométricos, billetes de juego, alimentos de juego, microscopio, etc.)" : 6,
    "De educación física (sogas, pelotas, aros, tinas, balones, porterías, redes para canastas o para voleibol, etc.)" : 5,
    "Literarios (libros infantiles, manuales, libros de texto, libros en braille, libros macrotipo, libros para estudiantes de lengua indígena, programas de estudio, etc.)" : 4,
    },

    "Mobiliario" : {
    "Mesas para niños/ mesabancos" : 5,
    "Sillas (para niños o para maestros)" : 5,
    "Mesas para docentes" : 4,
    "Pizarrones" : 4,
    "Comedores" : 3,
    "Estantes, libreros o cajoneras" : 3,
    },

    "Alimentacion" : {
    "Desayunos" : 6, 
    "Fórmula" : 2,
    },

    "Transporte" : {
    "Transporte (nuevas rutas de camiones, transporte escolar,entrega de bicis, etc.)" : 7,
    "Arreglo de camino (puentes en arroyos, aplanadora de camino, luminaria, etc.)" : 5,
    },

    "Juridico":{
        "Apoyo en gestión de escrituras (cuando el inmueble no las tiene)": 3,
    }


};


function obtainPriorities(categoria, nombre){
    if(priorities[categoria] && priorities[categoria][nombre]){
        return priorities[categoria][nombre].toString();
}
return "1";
}
module.exports = {obtainPriorities};