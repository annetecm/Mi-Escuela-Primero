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
    const usuarioId = usuario.usuarioId ?? usuario.usuarioid;

    //console.log("📥 Usuario completo desde DB:", usuario);


    // 2. Verificar estado de aprobación
    if (usuario.estadoRegistro !== "aprobado") {
      return res.status(403).json({ error: "Tu cuenta aún no ha sido aprobada." });
    }

    // 3. Comparar contraseña hasheada
    const passwordMatch = await bcrypt.compare(contraseña, usuario.contraseña);

    if (!passwordMatch) {
      return res.status(401).json({ error: "Correo o contraseña incorrectos." });
    }
    let tipoUsuario = null;

    // Primero revisa si es ESCUELA
    console.log("🔑 ID leído:", usuarioId);
    const escuela = await pool.query(
      `SELECT * FROM "Escuela" WHERE "usuarioId"::text = $1::text`,
            [usuarioId]
    );

    if (escuela.rows.length > 0) {
      console.log("🔍 Escuela encontrada:", escuela.rows);
      tipoUsuario = 'escuela';
    } else {
      // Si no es escuela, revisa si es aliado
      const aliado = await pool.query(
        `SELECT * FROM "Aliado" WHERE "usuarioId" = $1`,
            [usuarioId]
      );

      if (aliado.rows.length > 0) {
        console.log("🧾 Aliado encontrado:", aliado.rows);
        tipoUsuario = 'aliado';
      }
    }

    //revisar si es Administrador
    const administrador= await pool.query(
      `SELECT * FROM "Administrador" WHERE "usuarioId"::text = $1::text`,
            [usuarioId]
    );
    
    if(administrador.rows.length>0){
      console.log("🧾 Administrador encontrado:", administrador.rows);
      tipoUsuario= 'administrador'
    }

    
    // 4. Generar token JWT
    const token = jwt.sign(
      {
        usuarioId: usuarioId,
        correo: usuario.correoelectronico,
        tipo: tipoUsuario 
      },
      process.env.JWT_SECRET || "top",
      { expiresIn: "1d" }
    );
    res.json({ mensaje: "Login exitoso", token, tipo: tipoUsuario }); 
  } catch (err) {
    console.error("Error en login:", err);
    res.status(500).json({ error: "Error en el login." });
  }
});

module.exports = router;