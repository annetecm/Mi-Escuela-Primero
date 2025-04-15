const router = require("express").Router();
const pool = require("../db");
const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");

// Login para cualquier tipo de usuario (esc/ali)
router.post("/login", async (req, res) => {
  const { correoElectronico, contraseña } = req.body;

  try {
    // 1. Buscar usuario por correo
    const result = await pool.query(
      `SELECT * FROM "Usuario" WHERE "correoElectronico" = $1`,
      [correoElectronico]
    );

    if (result.rows.length === 0) {
      return res.status(401).json({ error: "Correo o contraseña incorrectos." });
    }

    const usuario = result.rows[0];

    // 2. Verificar estado de aprobación
    if (usuario.estadoRegistro !== "aprobado") {
      return res.status(403).json({ error: "Tu cuenta aún no ha sido aprobada." });
    }

    // 3. Comparar contraseña hasheada
    const passwordMatch = await bcrypt.compare(contraseña, usuario.contraseña);

    if (!passwordMatch) {
      return res.status(401).json({ error: "Correo o contraseña incorrectos." });
    }

    // 4. Generar token JWT
    const token = jwt.sign(
      {
        usuarioId: usuario.usuarioid,
        correo: usuario.correoelectronico,
      },
      process.env.JWT_SECRET || "top",
      { expiresIn: "1d" }
    );

    res.json({ mensaje: "Login exitoso", token });
  } catch (err) {
    console.error("Error en login:", err);
    res.status(500).json({ error: "Error en el login." });
  }
});

// Registrar usuario básico
router.post("/register", async (req, res) => {
  const { correoElectronico, contraseña, nombreCompleto } = req.body;

  try {
    // 1. Validar datos de entrada
    if (!correoElectronico || !contraseña || !nombreCompleto) {
      return res.status(400).json({ error: "Todos los campos son obligatorios." });
    }

    // 2. Verificar si el correo ya está registrado
    const existingUser = await pool.query(
      `SELECT * FROM "Usuario" WHERE "correoElectronico" = $1`,
      [correoElectronico]
    );

    if (existingUser.rows.length > 0) {
      return res.status(400).json({ error: "Este correo ya está registrado." });
    }

    // 3. Hashear la contraseña
    const contraseñaHasheada = await bcrypt.hash(contraseña, 10);

    // 4. Insertar usuario en la base de datos
    const result = await pool.query(
      `INSERT INTO "Usuario" ("correoElectronico", "contraseña", "nombre", "estadoRegistro") 
      VALUES ($1, $2, $3, 'pendiente') RETURNING *`,
      [correoElectronico, contraseñaHasheada, nombreCompleto]
    );

    res.status(201).json({ 
      mensaje: "Registro exitoso, pendiente de aprobación.",
      usuarioId: result.rows[0].usuarioid
    });
  } catch (err) {
    console.error("Error en registro:", err);
    res.status(500).json({ error: "Error al registrar el usuario." });
  }
});

module.exports = router;