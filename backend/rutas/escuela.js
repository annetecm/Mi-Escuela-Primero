const router = require("express").Router();
const pool = require("../db");
const bcrypt = require("bcrypt");

// Registro de usuario + escuela
router.post("/register", async (req, res) => {
  const client = await pool.connect();
  try {
    await client.query("BEGIN");

    const { usuario, escuela } = req.body;

    // Verificar que los datos de usuario no sean nulos o vacíos
    if (!usuario.correoElectronico || !usuario.contraseña || !usuario.nombre) {
      return res.status(400).json({ error: "Faltan datos del usuario." });
    }

    // Verificar que el correo no esté registrado previamente
    const existingUser = await client.query(
      `SELECT * FROM "Usuario" WHERE "correoElectronico" = $1`,
      [usuario.correoElectronico]
    );

    if (existingUser.rows.length > 0) {
      return res.status(400).json({ error: "El correo electrónico ya está registrado." });
    }

    // Hashear la contraseña
    const hashedPassword = await bcrypt.hash(usuario.contraseña, 10); // 10 es el número de rondas de salting



    // 1. Insertar Usuario (estadoRegistro queda como 'pendiente' por defecto)
    const insertUsuario = await client.query(
      `INSERT INTO "Usuario" ("correoElectronico", "contraseña", "nombre")
       VALUES ($1, $2, $3) RETURNING "usuarioId"`,
      [usuario.correoElectronico, usuario.contraseña, usuario.nombre]
    );

    const usuarioId = insertUsuario.rows[0].usuarioId;

    // Verificar que el usuarioId si se haya genrado bien
    if (!usuarioId) {
      return res.status(500).json({ error: "Error al generar el usuario." });
    }

    // Verificar que los datos de la escuela estén completos
    if (
      !escuela.direccion ||
      !escuela.sostenimiento ||
      !escuela.zonaEscolar ||
      !escuela.sectorEscolar ||
      !escuela.modalidad ||
      !escuela.nivelEducativo ||
      !escuela.CCT ||
      !escuela.numeroDocentes ||
      !escuela.estudiantesPorGrupo ||
      !escuela.controlAdministrativo
    ) {
      return res.status(400).json({ error: "Faltan datos de la escuela." });
    }

    // 2. Insertar Escuela vinculada a ese usuario
    const insertEscuela = await client.query(
      `INSERT INTO "Escuela" (
         direccion, sostenimiento, "zonaEscolar", "usuarioId",
         "sectorEscolar", modalidad, "nivelEducativo", "CCT",
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
        escuela.CCT,
        escuela.tieneUSAER,
        escuela.numeroDocentes,
        escuela.estudiantesPorGrupo,
        escuela.controlAdministrativo,
      ]
    );
    // Hasta aquí se guardan definitivamente los cambios en la base de datos
    await client.query("COMMIT");

    res.status(201).json({
      mensaje: "Registro exitoso. En espera de aprobación.",
      usuarioId,
      escuela: insertEscuela.rows[0],
    });

  } catch (err) {
    await client.query("ROLLBACK"); // Si algo falla, se revierte todo (ROLLBACK)
    console.error(err);
    res.status(500).send("Error en el registro.");
  } finally {
    client.release();
  }
});

module.exports = router;
