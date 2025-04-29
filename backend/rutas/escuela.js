const router = require("express").Router(); 
const pool = require("../db");
const bcrypt = require("bcrypt");
const verifyToken = require("../middlewares/authMiddleware");
const nodemailer = require("nodemailer");

// Configure nodemailer 
const transporter = nodemailer.createTransport({
  service: "gmail",
  auth: {
    user: "equiporeto6@gmail.com",
    pass: "bjmnunsytysdwycq", 
  },
});


// Test route for debugging
router.post("/test-route", (req, res) => {
  console.log("Datos recibidos:", req.body);
  res.json({ received: true });
});

const { obtainPriorities} = require("../utils/ponderaciones");


// Register user and school
router.post("/register", async (req, res) => {
  
  console.log("Received data:", JSON.stringify(req.body, null, 2)); // Log incoming data

  const client = await pool.connect();
  try {
    await client.query("BEGIN");

    const { usuario, escuela, documento, tramiteGobierno } = req.body;
    console.log("Necesidades recibidas desde frontend:", escuela.necesidades);


    // 1. User validation
    console.log("Usuario recibido:", usuario);

    if (!usuario) {
      return res.status(400).json({ error: "Faltan datos del usuario." });
    }
    
    const camposRequeridosUsuario = ["correoElectronico", "contraseña", "nombre"];
    for (const campo of camposRequeridosUsuario) {
      if (!usuario[campo]) {
        return res.status(400).json({ error: `Falta el campo de usuario: ${campo}` });
      }
    }

    // 2. Verify if the email is unique
    const existingUser = await client.query(
      `SELECT * FROM "Usuario" WHERE "correoElectronico" = $1`,
      [usuario.correoElectronico]
    );
    if (existingUser.rows.length > 0) {
      return res.status(400).json({ error: "El correo electrónico ya está registrado." });
    }

    // 3. Hash password
    const hashedPassword = await bcrypt.hash(usuario.contraseña, 10);

    // 4. Insert user into the database
    const insertUsuario = await client.query(
      `INSERT INTO "Usuario" ("correoElectronico", "contraseña", "nombre", "estadoRegistro")
       VALUES ($1, $2, $3, 'pendiente') RETURNING "usuarioId"`,
      [usuario.correoElectronico, hashedPassword, usuario.nombre]
    );

    const usuarioId = insertUsuario.rows[0].usuarioId;
    if (!usuarioId) throw new Error("Error al generar el usuarioId");

    // 5. School validation
    const camposEscuelaRequeridos = [
      'direccion', 'sostenimiento', 'zonaEscolar', 'sectorEscolar',
      'modalidad', 'nivelEducativo', 'CCT', 'numeroDocentes',
      'estudiantesPorGrupo', 'controlAdministrativo'
    ];
    for (const campo of camposEscuelaRequeridos) {
      if (!escuela[campo]) {
        throw new Error(`Falta el campo requerido de escuela: ${campo}`);
      }
    }

    const CCT = escuela.CCT;

    // 6. Insert school into the database
    const insertEscuela = await client.query(
      `INSERT INTO "Escuela" (
         "direccion", "sostenimiento", "zonaEscolar", "usuarioId",
         "sectorEscolar", "modalidad", "nivelEducativo", "CCT",
         "tieneUSAER", "numeroDocentes", "estudiantesPorGrupo", "controlAdministrativo"
       ) VALUES (
         $1, $2, $3, $4, $5, $6, $7, $8, $9, $10, $11, $12
       ) RETURNING *`,
      [
        escuela.direccion,
        escuela.sostenimiento,
        escuela.zonaEscolar,
        usuarioId,
        escuela.sectorEscolar,
        escuela.modalidad,
        escuela.nivelEducativo,
        CCT,
        escuela.tieneUSAER === "Si" ? true : false,
        escuela.numeroDocentes,
        escuela.estudiantesPorGrupo,
        escuela.controlAdministrativo,
      ]
    );

    // 7. Validate required fields for supervisor and director
    if (!escuela.supervisor) {
      throw new Error("Faltan los datos del supervisor.");
    }
    if (!escuela.director) {
      throw new Error("Faltan los datos del director.");
    }

   // 8. Insert ApoyoPrevio (optional)
   if (Array.isArray(escuela.apoyoPrevio)) {
    for (const apoyo of escuela.apoyoPrevio) {
      await client.query(
        `INSERT INTO "ApoyoPrevio" ("CCT", "tipo", "nombre", "descripcion")
         VALUES ($1, $2, $3, $4)`,
        [CCT, apoyo.tipo, apoyo.nombre || "", apoyo.descripcion]
      );
    }
  }
  
    // 9. Insert TramiteGobierno (optional)
    if (req.body.tramiteGobierno) {
      const { instancia, estado, folioOficial, nivelGobierno, descripcion } = req.body.tramiteGobierno;
      await client.query(
        `INSERT INTO "TramiteGobierno" ("CCT", "instancia", "estado", "folioOficial", "nivelGobierno", "descripcion")
         VALUES ($1, $2, $3, $4, $5, $6)`,
        [CCT, instancia, estado, folioOficial, nivelGobierno, descripcion]
      );
    }

    // 10. Insert Supervisor (not optional)
    const {
      fechaJubilacion:fechaJubilacionSup,
      posibleCambioZona,
      medioContacto,
      antiguedadZona,
      nombre: nombreSup,
      correoElectronico: correoSup,
      telefono: telSup,
    } = escuela.supervisor;
    

    await client.query(
      `INSERT INTO "Supervisor" ("CCT", "fechaJubilacion", "posibleCambioZona", "medioContacto", "antiguedadZona", "nombre", "correoElectronico", "telefono")
       VALUES ($1, $2, $3, $4, $5, $6, $7, $8)`,
      [
        CCT,
        fechaJubilacionSup || null,
        posibleCambioZona === "Si" ? true : false,
        medioContacto,
        antiguedadZona,
        nombreSup,
        correoSup,
        telSup
      ]
    );
    
    // 11. Insert MesaDirectiva (optional)
    if (escuela.mesaDirectiva) {
      await client.query(
        `INSERT INTO "MesaDirectiva" ("CCT", "personasCantidad")
         VALUES ($1, $2)`,
        [CCT, escuela.mesaDirectiva.personasCantidad]
      );
    }

    // 12. Insert Director (not optional)
    const {
      fechaJubilacion:fechaJubilacionDir,  
      posibleCambioPlantel,
      nombre: nombreDir,
      correoElectronico: correoDir,
      telefono: telDir,
    } = escuela.director;
  
    await client.query(
      `INSERT INTO "Director" ("CCT", "fechaJubilacion", "posibleCambioPlantel", "nombre", "correoElectronico", "telefono")
       VALUES ($1, $2, $3, $4, $5, $6)`,
      [
        CCT,
        fechaJubilacionDir || null,
        posibleCambioPlantel === "Si" ? true : false,
        nombreDir,
        correoDir,
        telDir
      ]
    );
    

    //13. Insert Necesidad 
    if (escuela.necesidades && escuela.necesidades.length > 0) {
      for (const necesidad of escuela.necesidades) {
        const prioridad = obtainPriorities(necesidad.categoria, necesidad.nombre);
    
        await client.query(
          `INSERT INTO "Necesidad" ("CCT", "categoria", "nombre", "prioridad")
           VALUES ($1, $2, $3, $4)`,
          [CCT, necesidad.categoria, necesidad.nombre, prioridad]
        );
      }
    }

    if (documento && documento.length > 0) {
      for (const doc of documento) {
        try{
        console.log("Documento a insertar:", doc);
        await client.query(`
          INSERT INTO "Documento" ("tipo", "ruta", "fechaCarga", "usuarioId", "nombre")
          VALUES ($1, $2, NOW(), $3, $4);
        `, [
          doc.tipo,
          doc.ruta,
          usuarioId,
          doc.nombre
        ]);
        console.log("Documento insertado:", doc.nombre);
      } catch (insertErr) {
        console.error("Error al insertar documento:", insertErr);
      }
      }
    } 

    // 14. Confirm transaction
    await client.query("COMMIT");

    res.status(201).json({
      mensaje: "Registro exitoso. En espera de aprobación.",
      usuarioId,
      escuela: insertEscuela.rows[0],
    });

  } catch (err) {
    await client.query("ROLLBACK");
    console.error("Error en registro escuela:", err);

    const mensajeError = err.message.includes("duplicate")
      ? "El correo o CCT ya están registrados"
      : err.message;

    res.status(500).json({
      error: mensajeError,
      detalle: process.env.NODE_ENV === 'development' ? err.message : null
    });
  } finally {
    client.release();
  }

});



router.get("/perfil", verifyToken, async (req, res) => {
  const usuarioId = req.usuario.usuarioId;

  try {
    const result = await pool.query(`
      SELECT 
        u.nombre, 
        u."correoElectronico", 
        e."direccion", 
        e."nivelEducativo",
        e."CCT",
        ARRAY_AGG(n."nombre") AS necesidades
      FROM "Usuario" u
      JOIN "Escuela" e ON e."usuarioId" = u."usuarioId"
      LEFT JOIN "Necesidad" n ON n."CCT" = e."CCT"
      WHERE u."usuarioId" = $1
      GROUP BY u.nombre, u."correoElectronico", e."direccion", e."nivelEducativo", e."CCT"
    `, [usuarioId]);

    if (result.rows.length === 0) {
      return res.status(404).json({ error: "Escuela no encontrada" });
    }

    return res.json(result.rows[0]);
  } catch (err) {
    console.error("Error al obtener perfil de escuela:", err);
    return res.status(500).json({ error: "Error interno del servidor" });
  }
});


// Nueva ruta para traer datos completos al formulario de edición
router.get("/editar-perfil", verifyToken, async (req, res) => {
  const usuarioId = req.usuario.usuarioId;

  try {
    const client = await pool.connect();

    const userResult = await client.query(`
      SELECT "correoElectronico", "nombre"
      FROM "Usuario"
      WHERE "usuarioId" = $1
    `, [usuarioId]);

    const escuelaResult = await client.query(`
      SELECT *
      FROM "Escuela"
      WHERE "usuarioId" = $1
    `, [usuarioId]);

    const directorResult = await client.query(`
      SELECT *
      FROM "Director"
      WHERE "CCT" = $1
    `, [escuelaResult.rows[0].CCT]);

    const supervisorResult = await client.query(`
      SELECT *
      FROM "Supervisor"
      WHERE "CCT" = $1
    `, [escuelaResult.rows[0].CCT]);

    const mesaResult = await client.query(`
      SELECT *
      FROM "MesaDirectiva"
      WHERE "CCT" = $1
    `, [escuelaResult.rows[0].CCT]);

    const apoyosResult = await client.query(`
      SELECT * FROM "ApoyoPrevio"
      WHERE "CCT" = $1
    `, [escuelaResult.rows[0].CCT]);

    const usuario = userResult.rows[0];
    const escuela = escuelaResult.rows[0];
    const director = directorResult.rows[0];
    const supervisor = supervisorResult.rows[0];
    const mesaDirectiva = mesaResult.rows[0];

    const apoyoPrevio = {
      gobiernoMunicipal: { nombre: "", descripcion: "" },
      gobiernoEstatal: { nombre: "", descripcion: "" },
      gobiernoFederal: { nombre: "", descripcion: "" },
      institucionesEducativas: { nombre: "", descripcion: "" },
      osc: { nombre: "", descripcion: "" },
      empresas: { nombre: "", descripcion: "" },
      programas: { nombre: "", descripcion: "" },
    };


    const tipoToNombre = {
      gobiernoMunicipal: "Gobierno Municipal",
      gobiernoEstatal: "Gobierno Estatal",
      gobiernoFederal: "Gobierno Federal",
      institucionesEducativas: "Instituciones Educativas",
      osc: "Organizaciones de la sociedad civil",
      empresas: "Empresas",
      programas: "Programas"
    };
    
    apoyosResult.rows.forEach((apoyo) => {
      let tipo = apoyo.tipo;
  
      if (tipoToNombre[tipo]) {
        tipo = tipoToNombre[tipo];
      }
    
      switch (tipo) {
        case "Gobierno Municipal":
          apoyoPrevio.gobiernoMunicipal = { nombre: apoyo.nombre, descripcion: apoyo.descripcion };
          break;
        case "Gobierno Estatal":
          apoyoPrevio.gobiernoEstatal = { nombre: apoyo.nombre, descripcion: apoyo.descripcion };
          break;
        case "Gobierno Federal":
          apoyoPrevio.gobiernoFederal = { nombre: apoyo.nombre, descripcion: apoyo.descripcion };
          break;
        case "Instituciones Educativas":
          apoyoPrevio.institucionesEducativas = { nombre: apoyo.nombre, descripcion: apoyo.descripcion };
          break;
        case "Organizaciones de la sociedad civil":
          apoyoPrevio.osc = { nombre: apoyo.nombre, descripcion: apoyo.descripcion };
          break;
        case "Empresas":
          apoyoPrevio.empresas = { nombre: apoyo.nombre, descripcion: apoyo.descripcion };
          break;
        case "Programas":
          apoyoPrevio.programas = { nombre: apoyo.nombre, descripcion: apoyo.descripcion };
          break;
        default:
          console.log("Tipo de apoyo no válido:", apoyo.tipo);
          break;
      }
    });
    

    res.json({
      usuario: {
        correoElectronico: usuario.correoElectronico,
        contraseña: "", // No mandamos la contraseña real
        nombre: usuario.nombre,
      },
      escuela: {
        direccion: {
          calleNumero: escuela.direccion?.split(",")[0] || "",
          colonia: escuela.direccion?.split(",")[1] || "",
          municipio: escuela.direccion?.split(",")[2] || "",
        },
        sostenimiento: escuela.sostenimiento,
        zonaEscolar: escuela.zonaEscolar,
        sectorEscolar: escuela.sectorEscolar,
        modalidad: escuela.modalidad,
        nivelEducativo: escuela.nivelEducativo,
        CCT: escuela.CCT,
        tieneUSAER: escuela.tieneUSAER ? "Si" : "No",
        numeroDocentes: escuela.numeroDocentes,
        estudiantesPorGrupo: escuela.estudiantesPorGrupo,
        controlAdministrativo: escuela.controlAdministrativo,
        director: {
          nombre: director.nombre,
          correoElectronico: director.correoElectronico,
          telefono: director.telefono,
          fechaJubilacion: director.fechaJubilacion,
          posibleCambioPlantel: director.posibleCambioPlantel ? "Si" : "No",

        },
        supervisor: {
          nombre: supervisor.nombre,
          correoElectronico: supervisor.correoElectronico,
          telefono: supervisor.telefono,
          fechaJubilacion: supervisor.fechaJubilacion,
          posibleCambioZona: supervisor.posibleCambioZona ? "Si" : "No",
          medioContacto: supervisor.medioContacto,
          antiguedadZona: supervisor.antiguedadZona,
        },
        mesaDirectiva: {
          personasCantidad: mesaDirectiva?.personasCantidad || "",
        },
        apoyoPrevio: apoyoPrevio,
      }
    });
  
    client.release();
  } catch (err) {
    console.error("Error en editar-perfil:", err);
    res.status(500).json({ error: "Error interno del servidor" });
  }
});

router.post("/editar", verifyToken, async (req, res) => {
  const usuarioId = req.usuario.usuarioId;
  const formData = req.body;
  const client = await pool.connect();


  try {
    await client.query("BEGIN");
    // 1. Obtener datos anteriores
    const { rows: userRows } = await client.query(`SELECT * FROM "Usuario" WHERE "usuarioId" = $1`, [usuarioId]);
    const { rows: schoolRows } = await client.query(`SELECT * FROM "Escuela" WHERE "usuarioId" = $1`, [usuarioId]);
    const { rows: directorRows } = await client.query(`SELECT * FROM "Director" WHERE "CCT" = $1`, [schoolRows[0].CCT]);
    const { rows: supervisorRows } = await client.query(`SELECT * FROM "Supervisor" WHERE "CCT" = $1`, [schoolRows[0].CCT]);
    const { rows: mesaRows } = await client.query(`SELECT * FROM "MesaDirectiva" WHERE "CCT" = $1`, [schoolRows[0].CCT]);
    const { rows: apoyosPreviosRows } = await client.query(`SELECT * FROM "ApoyoPrevio" WHERE "CCT" = $1`, [schoolRows[0].CCT]);
  
    const oldData = {
      usuario: userRows[0],
      escuela: schoolRows[0],
      director: directorRows[0],
      supervisor: supervisorRows[0],
      mesaDirectiva: mesaRows[0],
      apoyos: apoyosPreviosRows,
    };

    // 2. Actualizar Usuario
    await client.query(
      `UPDATE "Usuario" SET "correoElectronico" = $1, "nombre" = $2 WHERE "usuarioId" = $3`,
      [formData.usuario.correoElectronico, formData.usuario.nombre, usuarioId]
    );

    const bcrypt = require('bcrypt'); 

    if (formData.usuario.contraseña && formData.usuario.contraseña.trim() !== "") {
      const hashedPassword = await bcrypt.hash(formData.usuario.contraseña, 10);
    
      await client.query(
        `UPDATE "Usuario" SET "contraseña" = $1 WHERE "usuarioId" = $2`,
        [hashedPassword, usuarioId]
      );
    }
    

    // 3. Actualizar Escuela
    const direccion = `${formData.escuela.direccion.calleNumero},${formData.escuela.direccion.colonia},${formData.escuela.direccion.municipio}`;

    await client.query(
      `UPDATE "Escuela" SET
      "direccion" = $1,
      "sostenimiento" = $2,
      "zonaEscolar" = $3,
      "sectorEscolar" = $4,
      "modalidad" = $5,
      "nivelEducativo" = $6,
      "controlAdministrativo" = $7,
      "numeroDocentes" = $8,
      "estudiantesPorGrupo" = $9,
      "tieneUSAER" = $10
      WHERE "usuarioId" = $11`,
      [
      direccion,
      formData.escuela.sostenimiento,
      formData.escuela.zonaEscolar,
      formData.escuela.sectorEscolar,
      formData.escuela.modalidad,
      formData.escuela.nivelEducativo,
      formData.escuela.controlAdministrativo,
      formData.escuela.numeroDocentes,
      formData.escuela.estudiantesPorGrupo,
      formData.escuela.tieneUSAER === "Si" ? true : false,
      usuarioId
      ]
    );

    // 4. Actualizar Director
    await client.query(
      `UPDATE "Director" SET
        "nombre" = $1,
        "correoElectronico" = $2,
        "telefono" = $3,
        "fechaJubilacion" = $4,
        "posibleCambioPlantel" = $5
        WHERE "CCT" = $6`,
      [
        formData.escuela.director.nombre,
        formData.escuela.director.correoElectronico,
        formData.escuela.director.telefono,
        formData.escuela.director.fechaJubilacion,
        formData.escuela.director.posibleCambioPlantel === "Si" ? true : false,
        schoolRows[0].CCT
      ]
    );

    // 5. Actualizar Supervisor
    await client.query(
      `UPDATE "Supervisor" SET
        "nombre" = $1,
        "correoElectronico" = $2,
        "telefono" = $3,
        "fechaJubilacion" = $4,
        "posibleCambioZona" = $5,
        "medioContacto" = $6,
        "antiguedadZona" = $7
        WHERE "CCT" = $8`,
      [
        formData.escuela.supervisor.nombre,
        formData.escuela.supervisor.correoElectronico,
        formData.escuela.supervisor.telefono,
        formData.escuela.supervisor.fechaJubilacion,
        formData.escuela.supervisor.posibleCambioZona === "Si" ? true : false,
        formData.escuela.supervisor.medioContacto,
        formData.escuela.supervisor.antiguedadZona,
        schoolRows[0].CCT
      ]
    );

    // 6. Actualizar Mesa Directiva
    await client.query(
      `UPDATE "MesaDirectiva" SET
        "personasCantidad" = $1
        WHERE "CCT" = $2`,
      [
        formData.escuela.mesaDirectiva.personasCantidad,
        schoolRows[0].CCT
      ]
    );

    // 7. Borrar apoyos previos
    await client.query(`DELETE FROM "ApoyoPrevio" WHERE "CCT" = $1`, [schoolRows[0].CCT]);
    
    // 8. Insertar nuevos apoyos
    const nuevosApoyos = [];
    for (const [tipo, datos] of Object.entries(formData.escuela.apoyoPrevio)) {
      if (datos.nombre.trim() !== "" || datos.descripcion.trim() !== "") {
        nuevosApoyos.push([schoolRows[0].CCT, tipo, datos.nombre, datos.descripcion]);
      }
    }
    for (const apoyo of nuevosApoyos) {
      await client.query(
        `INSERT INTO "ApoyoPrevio" ("CCT", "tipo", "nombre", "descripcion") VALUES ($1, $2, $3, $4)`,
        apoyo
      );
    }

    // 9. Buscar administradores
    const { rows: adminRows } = await client.query(`
      SELECT "correoElectronico"
      FROM "Usuario"
      INNER JOIN "Administrador" ON "Usuario"."usuarioId" = "Administrador"."usuarioId"
    `);

    const adminEmails = adminRows.map(row => row.correoElectronico);

    // 10. Comparar cambios
    // Comparar cambios
let cambios = [];

function compararCampo(nombreCampo, viejo, nuevo) {
  if ((viejo ?? "") !== (nuevo ?? "")) {
    cambios.push(`${nombreCampo}: <b>${viejo || "(vacío)"}</b> ➔ <b>${nuevo || "(vacío)"}</b>`);
  }
}

// Comparar Usuario
compararCampo("Correo del usuario", oldData.usuario.correoElectronico, formData.usuario.correoElectronico);
compararCampo("Nombre del usuario", oldData.usuario.nombre, formData.usuario.nombre);

// Comparar Escuela
compararCampo("Dirección", oldData.escuela.direccion, `${formData.escuela.direccion.calleNumero},${formData.escuela.direccion.colonia},${formData.escuela.direccion.municipio}`);
compararCampo("Sostenimiento", oldData.escuela.sostenimiento, formData.escuela.sostenimiento);
compararCampo("Zona escolar", oldData.escuela.zonaEscolar, formData.escuela.zonaEscolar);
compararCampo("Sector escolar", oldData.escuela.sectorEscolar, formData.escuela.sectorEscolar);
compararCampo("Modalidad", oldData.escuela.modalidad, formData.escuela.modalidad);
compararCampo("Nivel educativo", oldData.escuela.nivelEducativo, formData.escuela.nivelEducativo);
compararCampo("Control administrativo", oldData.escuela.controlAdministrativo, formData.escuela.controlAdministrativo);
compararCampo("Número de docentes", oldData.escuela.numeroDocentes, formData.escuela.numeroDocentes);
compararCampo("Estudiantes por grupo", oldData.escuela.estudiantesPorGrupo, formData.escuela.estudiantesPorGrupo);
compararCampo("Tiene USAER", oldData.escuela.tieneUSAER ? "Si" : "No", formData.escuela.tieneUSAER);

// Comparar Director
compararCampo("Nombre del director", oldData.director.nombre, formData.escuela.director.nombre);
compararCampo("Correo del director", oldData.director.correoElectronico, formData.escuela.director.correoElectronico);
compararCampo("Teléfono del director", oldData.director.telefono, formData.escuela.director.telefono);
compararCampo("Fecha jubilación director", oldData.director.fechaJubilacion, formData.escuela.director.fechaJubilacion);
compararCampo("¿Cambio plantel?", oldData.director.posibleCambioPlantel ? "Si" : "No", formData.escuela.director.posibleCambioPlantel);


// Comparar Supervisor
compararCampo("Nombre del supervisor", oldData.supervisor.nombre, formData.escuela.supervisor.nombre);
compararCampo("Correo del supervisor", oldData.supervisor.correoElectronico, formData.escuela.supervisor.correoElectronico);
compararCampo("Teléfono del supervisor", oldData.supervisor.telefono, formData.escuela.supervisor.telefono);
compararCampo("Fecha jubilación supervisor", oldData.supervisor.fechaJubilacion, formData.escuela.supervisor.fechaJubilacion);
compararCampo("¿Cambio de zona?", oldData.supervisor.posibleCambioZona ? "Si" : "No", formData.escuela.supervisor.posibleCambioZona);
compararCampo("Antigüedad en la zona", oldData.supervisor.antiguedadZona, formData.escuela.supervisor.antiguedadZona);
compararCampo("Medio preferido contacto supervisor", oldData.supervisor.medioContacto, formData.escuela.supervisor.medioContacto);

// Comparar Mesa Directiva
compararCampo("Cantidad de personas en mesa directiva", oldData.mesaDirectiva?.personasCantidad, formData.escuela.mesaDirectiva.personasCantidad);

// Comparar Apoyos
const tiposMap = {
  gobiernoMunicipal: "Gobierno Municipal",
  gobiernoEstatal: "Gobierno Estatal",
  gobiernoFederal: "Gobierno Federal",
  institucionesEducativas: "Instituciones Educativas",
  osc: "Organizaciones de la sociedad civil",
  empresas: "Empresas",
  programas: "Programas"
};

oldData.apoyos.forEach((apoyoAntiguo) => {
  let tipo = apoyoAntiguo.tipo;

  // Si el tipo es una clave (como "osc"), tradúcelo a nombre bonito
  if (tiposMap[tipo]) {
    tipo = tiposMap[tipo];
  }

  // Ahora tipo siempre es bonito: "Gobierno Federal", "Organizaciones de la sociedad civil", etc.
  let nuevoApoyo;
  switch (tipo) {
    case "Gobierno Municipal":
      nuevoApoyo = formData.escuela.apoyoPrevio.gobiernoMunicipal;
      break;
    case "Gobierno Estatal":
      nuevoApoyo = formData.escuela.apoyoPrevio.gobiernoEstatal;
      break;
    case "Gobierno Federal":
      nuevoApoyo = formData.escuela.apoyoPrevio.gobiernoFederal;
      break;
    case "Instituciones Educativas":
      nuevoApoyo = formData.escuela.apoyoPrevio.institucionesEducativas;
      break;
    case "Organizaciones de la sociedad civil":
      nuevoApoyo = formData.escuela.apoyoPrevio.osc;
      break;
    case "Empresas":
      nuevoApoyo = formData.escuela.apoyoPrevio.empresas;
      break;
    case "Programas":
      nuevoApoyo = formData.escuela.apoyoPrevio.programas;
      break;
    default:
      console.warn("Tipo de apoyo no reconocido:", tipo);
      return; // salir del foreach
  }

  if (nuevoApoyo) {
    compararCampo(`Nombre apoyo ${tipo}`, apoyoAntiguo.nombre, nuevoApoyo.nombre);
    compararCampo(`Descripción apoyo ${tipo}`, apoyoAntiguo.descripcion, nuevoApoyo.descripcion);
  }
});


// 11. Enviar correo a administradores
if (cambios.length > 0) {
  const htmlCambios = `
  <html>
    <head>
      <style>
        body {
          font-family: 'Montserrat', sans-serif;
          background-color: #f5f5f5;
          margin: 0;
          padding: 30px;
        }
        .container {
          background: #fff;
          padding: 25px 30px;
          border-radius: 8px;
          box-shadow: 0 2px 8px rgba(0,0,0,0.1);
          max-width: 600px;
          margin: auto;
        }
        h2 {
          color: #019847;
          margin-bottom: 20px;
          font-size: 24px;
        }
        p {
          font-size: 16px;
          color: #555;
          margin-bottom: 15px;
        }
        ul {
          padding-left: 20px;
          margin-top: 15px;
        }
        li {
          margin-bottom: 10px;
          font-size: 15px;
          color: #333;
        }
        .highlight {
          font-weight: bold;
          color: #019847;
        }
      </style>
    </head>
    <body>
      <div class="container">
        <h2>Actualización de datos de escuela</h2>
        <p><span class="highlight">Usuario que realizó el cambio:</span> ${usuarioId}</p>
        <p>Se realizaron los siguientes cambios:</p>
        <ul>
          ${cambios.map(c => `<li>${c}</li>`).join('')}
        </ul>
      </div>
    </body>
  </html>
`;




  try {
    await transporter.sendMail({
      from: '"Sistema de Notificaciones Mi Escuela Primero" <equiporeto6@gmail.com>',
      to: adminEmails,
      subject: "Actualización de datos en escuela.",
      html: htmlCambios
    });
    console.log("Correo de cambios enviado a admins.");
  } catch (error) {
    console.error("Error al enviar correo:", error);
  }
  
}

    await client.query("COMMIT");
    res.json({ mensaje: "Datos actualizados correctamente y notificados a admins." });

  } catch (error) {
    console.error(error);
    await client.query("ROLLBACK");
    res.status(500).json({ error: "Error al actualizar información." });
  } finally {
    client.release();
  }
});

router.get('/mis-conexiones', verifyToken, async (req, res) => {
  const usuarioId = req.usuario.usuarioId;

  try {
    const escuelaResult = await pool.query(`
      SELECT "CCT" 
      FROM "Escuela" 
      WHERE "usuarioId" = $1
    `, [usuarioId]);

    if (escuelaResult.rows.length === 0) {
      return res.status(404).json({ error: "Escuela no encontrada" });
    }

    const CCT = escuelaResult.rows[0].CCT;

    const conexionesResult = await pool.query(`
      SELECT 
        c."conexionId",
        a."aliadoId",
        u."nombre" AS "nombreAliado",
        ap."caracteristicas" AS "apoyo",
        n."nombre" AS "nombreNecesidad"
      FROM "Conexion" c
      JOIN "Aliado" a ON c."aliadoId" = a."aliadoId"
      JOIN "Usuario" u ON a."usuarioId" = u."usuarioId"
      JOIN "Apoyo" ap ON c."apoyoId" = ap."apoyoId"
      JOIN "Necesidad" n ON c."necesidadId" = n."necesidadId"
      WHERE c."CCT" = $1
      ORDER BY u."nombre" ASC;
    `, [CCT]);

    return res.json(conexionesResult.rows);
  } catch (err) {
    console.error('Error al obtener conexiones de aliados:', err);
    return res.status(500).json({ error: 'Error interno al cargar aliados.' });
  }
});

module.exports = router;
