const router = require("express").Router(); 
const pool = require("../db");
const bcrypt = require("bcrypt");


// Test route for debugging
router.post("/test-route", (req, res) => {
  console.log("Datos recibidos:", req.body);
  res.json({ received: true });
});


// Register user and school
router.post("/", async (req, res) => {
  
  console.log("Received data:", JSON.stringify(req.body, null, 2)); // Log incoming data

  const client = await pool.connect();
  try {
    await client.query("BEGIN");

    const { usuario, administrador } = req.body;
   
    // 1. User validation
    console.log("Usuario recibido:", usuario);
    console.log("Admin recibido:", administrador);

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


    // 6. Insert school into the database
    const insertEscuela = await client.query(
      `INSERT INTO "Administrador" (
          "usuarioId"
       ) VALUES (
         $1
       ) RETURNING *`,
      [
        usuarioId
      ]
    );
    await client.query("COMMIT")
    res.status(201).json({
      mensaje: "Registro exitoso. En espera de aprobación.",
      usuarioId,
      escuela: insertEscuela.rows[0],
    });

  } catch (err) {
    await client.query("ROLLBACK");
    console.error("Error en registro admin:", err);

    const mensajeError = err.message.includes("duplicate")
      ? "El correo ya está registrado"
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
