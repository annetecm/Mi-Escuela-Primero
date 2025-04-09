const router = require("express").Router();
const pool = require("../db");
const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");

// Login para cualquier tipo de usuario (esc/ali)
router.post("/login", async (req, res) => {
  const { correoElectronico, contraseña } = req.body;

  try {
    const result = await pool.query(
      `SELECT * FROM "Usuario" WHERE "correoElectronico" = $1`,
      [correoElectronico]
    );

    if (result.rows.length === 0) {
      return res.status(401).json({ error: "Correo o contraseña incorrectos." });
    }

    const usuario = result.rows[0];

    if (usuario.estadoRegistro !== "aprobado") {
      return res.status(403).json({ error: "Tu cuenta aún no ha sido aprobada." });
    }

    const passwordMatch = await bcrypt.compare(contraseña, usuario.contraseña);

    if (!passwordMatch) {
      return res.status(401).json({ error: "Correo o contraseña incorrectos." });
    }

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
    console.error(err);
    res.status(500).send("Error en el login.");
  }
});

module.exports = router;
