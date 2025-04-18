const router = require("express").Router();
const pool = require("../db");
const bcrypt = require("bcrypt");

// Test route for debugging
router.post("/test-route", (req, res) => {
  console.log("Datos recibidos:", req.body);
  res.json({ received: true });
});

// Register user and school
router.post("/register", async (req, res) => {
  console.log("Received data:", JSON.stringify(req.body, null, 2)); // Log incoming data

  const client = await pool.connect();
  try {
    await client.query("BEGIN");

    const { usuario, escuela } = req.body;

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
        escuela.tieneUSAER || false,
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
if (escuela.apoyoPrevio?.descripcion) {
  await client.query(
    `INSERT INTO "ApoyoPrevio" ("CCT", "descripcion")
     VALUES ($1, $2)`,
    [CCT, escuela.apoyoPrevio.descripcion]
  );
}

    // 9. Insert TramiteGobierno (optional)
    if (escuela.tramiteGobierno) {
      const { instancia, estado, folioOficial, nivelGobierno, descripcion } = escuela.tramiteGobierno;
      await client.query(
        `INSERT INTO "TramiteGobierno" ("CCT", "instancia", "estado", "folioOficial", "nivelGobierno", "descripcion")
         VALUES ($1, $2, $3, $4, $5, $6)`,
        [CCT, instancia, estado, folioOficial, nivelGobierno, descripcion]
      );
    }

    // 10. Insert Supervisor (not optional)
    const {
      fechaJubilacion: fjRaw,
      posibleCambioZona,
      medioContacto,
      antiguedadZona,
      nombre: nombreSup,
      correoElectronico: correoSup,
      telefono: telSup,
    } = escuela.supervisor;
    const fjSup = fjRaw ? fjRaw : null;

    await client.query(
      `INSERT INTO "Supervisor" ("CCT", "fechaJubilacion", "posibleCambioZona", "medioContacto", "antiguedadZona", "nombre", "correoElectronico", "telefono")
       VALUES ($1, $2, $3, $4, $5, $6, $7, $8)`,
      [CCT, fjSup, posibleCambioZona || false, medioContacto, antiguedadZona, nombreSup, correoSup, telSup]
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
      fechaJubilacion: fjDir,
      posibleCambioPlantel,
      nombre: nombreDir,
      correoElectronico: correoDir,
      telefono: telDir,
    } = escuela.director;

    await client.query(
      `INSERT INTO "Director" ("CCT", "fechaJubilacion", "posibleCambioPlantel", "nombre", "correoElectronico", "telefono")
       VALUES ($1, $2, $3, $4, $5, $6)`,
      [CCT, fjDir, posibleCambioPlantel || false, nombreDir, correoDir, telDir]
    );

    // 13. Confirm transaction
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

module.exports = router;
