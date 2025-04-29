const router = require("express").Router();
const pool = require("../db");
const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");
const transporter = require('../utils/nodemailer');

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

router.post('/recuperar-password', async (req, res) => {
  const { correoElectronico } = req.body;

  if (!correoElectronico) {
    return res.status(400).json({ error: 'Correo requerido' });
  }

  try {
    const result = await pool.query(`
      SELECT "usuarioId" 
      FROM "Usuario" 
      WHERE "correoElectronico" = $1
    `, [correoElectronico]);

    if (result.rows.length === 0) {
      return res.status(404).json({ error: 'Correo no registrado' });
    }

    const usuarioId = result.rows[0].usuarioId;

    const token = jwt.sign(
      { usuarioId },
      process.env.JWT_SECRET, 
      { expiresIn: '1h' }
    );

    const resetLink = `http://localhost:5173/resetear-password?token=${token}`;

    await transporter.sendMail({
      from: process.env.EMAIL_USER,
      to: correoElectronico,
      subject: 'Recuperación de contraseña',
      html: `
        <h2>Solicitud de recuperación de contraseña</h2>
        <p>Haz click en el siguiente enlace para recuperar tu contraseña:</p>
        <a href="${resetLink}">${resetLink}</a>
        <p>Este enlace expira en 1 hora.</p>
      `
    });

    return res.json({ message: 'Correo enviado exitosamente' });
  } catch (error) {
    console.error('Error en recuperación de contraseña:', error);
    return res.status(500).json({ error: 'Error interno' });
  }
});

router.post('/resetear-password', async (req, res) => {
  const { token, nuevaContraseña } = req.body;

  if (!token || !nuevaContraseña) {
    return res.status(400).json({ error: 'Token y nueva contraseña requeridos.' });
  }

  try {
    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    const usuarioId = decoded.usuarioId;

    const hashedPassword = await bcrypt.hash(nuevaContraseña, 10);

    await pool.query(`
      UPDATE "Usuario"
      SET "contraseña" = $1
      WHERE "usuarioId" = $2
    `, [hashedPassword, usuarioId]);

    return res.json({ message: 'Contraseña actualizada exitosamente.' });

  } catch (error) {
    console.error('Error al resetear contraseña:', error);
    return res.status(400).json({ error: 'Token inválido o expirado.' });
  }
});

module.exports = router;