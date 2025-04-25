const router = require("express").Router(); 
const pool = require("../db");
const bcrypt = require("bcrypt");
const verifyToken = require("../middlewares/authMiddleware");

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
        console.log("📝 Documento a insertar:", doc);
        await client.query(`
          INSERT INTO "Documento" ("tipo", "ruta", "fechaCarga", "usuarioId", "nombre")
          VALUES ($1, $2, NOW(), $3, $4);
        `, [
          doc.tipo,
          doc.ruta,
          usuarioId,
          doc.nombre
        ]);
        console.log("✅ Documento insertado:", doc.nombre);
      } catch (insertErr) {
        console.error("❌ Error al insertar documento:", insertErr);
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
    console.error("❌ Error al obtener perfil de escuela:", err);
    return res.status(500).json({ error: "Error interno del servidor" });
  }
});


module.exports = router;
