const router = require("express").Router(); 
const pool = require("../db");
const bcrypt = require("bcrypt");
const verifyToken = require("../middlewares/authMiddleware");

// Test route for debugging
router.post("/test-route", (req, res) => {
  console.log("Datos recibidos:", req.body);
  res.json({ received: true });
});

//ruta para fetch de datos escuela
router.get("/fetch/escuela",verifyToken, async (req, res)=>{
    console.log("fetch escuelas");

})

//obtener los perfiles no aprobados
router.get("/fetch/noAprobado", verifyToken, async (req, res) => {
  try {
    const result = await pool.query(`
      SELECT 
        u.nombre AS nombre_usuario,
        COALESCE(pf.correoElectronico, pm.correoElectronico) AS correo_usuario,
        u.estadoRegistro,
        COALESCE(pf.CURP, pm.RFC, e.CCT) AS identificador,
        CASE 
          WHEN a.aliadoId IS NOT NULL AND pf.CURP IS NOT NULL THEN 'Aliado de Persona Fisica'
          WHEN a.aliadoId IS NOT NULL AND pm.RFC IS NOT NULL THEN 'Aliado de Persona Moral'
          WHEN e.usuarioId IS NOT NULL THEN 'Escuela'
          WHEN ad.usuarioId IS NOT NULL THEN 'Administrador'
          ELSE 'Desconocido'
        END AS tipo_usuario
      FROM Usuario u
      LEFT JOIN Administrador ad ON u.usuarioId = ad.usuarioId
      LEFT JOIN Aliado a ON u.usuarioId = a.usuarioId
      LEFT JOIN PersonaFisica pf ON a.aliadoId = pf.CURP
      LEFT JOIN PersonaMoral pm ON a.aliadoId = pm.RFC
      LEFT JOIN Escuela e ON u.usuarioId = e.usuarioId
      WHERE u.estadoRegistro = 'pendiente';
    `);

    if (result.rows.length === 0) {
      return res.status(404).json({ error: "Datos no encontrados" });
    }

    return res.json(result.rows);
  } catch (err) {
    console.error("Error al obtener datos en /fetch/noAprobado:", err.message, err.stack);
    return res.status(500).json({ error: "Error interno del servidor", details: err.message });
  }
});

//obtener nombre del admin
router.get('/perfil/admin', verifyToken, async (req, res) => {
    console.log('Decoded token payload:', req.usuario);
    const usuarioId = req.usuario.usuarioId;
  
    try {
      const result = await pool.query(`
        SELECT nombre
        FROM "Usuario" 
        WHERE "usuarioId" = $1;
      `, [usuarioId]);
  
      if (result.rows.length === 0) {
        return res.status(404).json({ error: 'Nombre no encontrado' });
      }
  
      return res.json(result.rows[0]);
    } catch (err) {
      console.error('Error al obtener perfil de admin:', err);
      return res.status(500).json({ error: 'Error interno del servidor' });
    }
  });

module.exports = router;
