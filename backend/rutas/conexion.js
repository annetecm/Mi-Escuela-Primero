const express = require('express');
const router = express.Router();
const db = require('../db');
const verifyToken  = require('../middlewares/authMiddleware');

// Crear conexiones entre aliado y escuela (match)
router.post('/conexion', verifyToken, async (req, res) => {
  const { CCT, necesidadesCompatibles, apoyosCompatibles } = req.body;
  const usuarioId = req.usuario.usuarioId;

  if (!CCT || !necesidadesCompatibles.length || !apoyosCompatibles.length) {
    return res.status(400).json({ error: 'Faltan datos para crear la conexión.' });
  }

  try {
    const aliadoResult = await db.query(`
      SELECT "aliadoId" FROM "Aliado" WHERE "usuarioId" = $1
    `, [usuarioId]);

    const aliadoId = aliadoResult.rows[0].aliadoId;

    const fechaInicio = new Date();
    const fechaFin = new Date();
    fechaFin.setFullYear(fechaInicio.getFullYear() + 1);

    for (const necesidadId of necesidadesCompatibles) {
      // Para cada necesidad compatible, buscar UN solo apoyo compatible
      const apoyoCompatible = apoyosCompatibles[0]; // solo tomamos el primero

      // Antes de insertar, verificar que NO exista
      const existing = await db.query(`
        SELECT 1 FROM "Conexion"
        WHERE "CCT" = $1 AND "aliadoId" = $2 AND "necesidadId" = $3
      `, [CCT, aliadoId, necesidadId]);

      if (existing.rowCount === 0) {
        await db.query(`
          INSERT INTO "Conexion" ("conexionId", "CCT", "aliadoId", "necesidadId", "apoyoId", "fechaInicio", "fechaFin", "estado")
          VALUES (gen_random_uuid(), $1, $2, $3, $4, $5, $6, 'pendiente')
        `, [CCT, aliadoId, necesidadId, apoyoCompatible, fechaInicio, fechaFin]);
      }
    }

    return res.status(201).json({ message: 'Conexiones creadas exitosamente.' });
  } catch (err) {
    console.error('Error al crear conexiones:', err);
    return res.status(500).json({ error: 'Error interno del servidor.' });
  }
});

router.get('/mis-conexiones', verifyToken, async (req, res) => {
  const usuarioId = req.usuario.usuarioId;

  try {
    const aliadoResult = await db.query(`
      SELECT "aliadoId" FROM "Aliado" WHERE "usuarioId" = $1
    `, [usuarioId]);

    if (aliadoResult.rows.length === 0) {
      return res.status(404).json({ error: 'Aliado no encontrado' });
    }

    const aliadoId = aliadoResult.rows[0].aliadoId;

    const conexiones = await db.query(`
      SELECT 
        c."conexionId",
        e."CCT",
        u."nombre" AS "nombreEscuela",
        n."nombre" AS "necesidad"
      FROM "Conexion" c
      JOIN "Escuela" e ON c."CCT" = e."CCT"
      JOIN "Usuario" u ON u."usuarioId" = e."usuarioId"
      JOIN "Necesidad" n ON n."necesidadId" = c."necesidadId"
      WHERE c."aliadoId" = $1
      ORDER BY u."nombre" ASC
    `, [aliadoId]);

    return res.json(conexiones.rows);
  } catch (err) {
    console.error('❌ Error al obtener conexiones:', err);
    return res.status(500).json({ error: 'Error interno del servidor' });
  }
});


module.exports = router;