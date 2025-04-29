const express = require('express');
const multer = require('multer');
const cloudinary = require('../utils/cloudinary');
const db = require('../db');
const verifyToken = require('../middlewares/authMiddleware');

const router = express.Router();
const upload = multer({ storage: multer.memoryStorage() });

// Subir evidencia
router.post('/upload', verifyToken, upload.single('archivo'), async (req, res) => {
  const { tipo, matchId, descripcion } = req.body;

  if (!req.file) {
    return res.status(400).json({ status: 400, reason: "Archivo inválido" });
  }

  if (!tipo || !['escuela', 'aliado'].includes(tipo)) {
    return res.status(400).json({ status: 400, reason: "Tipo inválido" });
  }

  if (!matchId) {
    return res.status(400).json({ status: 400, reason: "matchId es requerido" });
  }

  try {
    const uploadResult = await new Promise((resolve, reject) => {
      cloudinary.uploader.upload_stream(
        { resource_type: 'auto', timeout: 60000 }, 
        (error, result) => {
          if (error) reject(error);
          else resolve(result);
        }
      ).end(req.file.buffer);
    });

    const insertResult = await db.query(`
      INSERT INTO "ReporteAvance" 
        ("reporteAvanceId", "tipo", "fecha", "descripcion", "ruta", "conexionId")
      VALUES 
        (gen_random_uuid(), $1, NOW(), $2, $3, $4)
      RETURNING "reporteAvanceId"
    `, [
      uploadResult.format,
      descripcion || '',
      uploadResult.secure_url,
      matchId
    ]);

    const reporteAvanceId = insertResult.rows[0].reporteAvanceId;

    return res.status(201).json({ 
      message: "Evidencia subida correctamente", 
      url: uploadResult.secure_url,
      reporteAvanceId: reporteAvanceId
    });
  } catch (err) {
    console.error('Error subiendo evidencia:', err);
    return res.status(500).json({ status: 500, reason: err.message });
  }
});

// Obtener evidencias de un progreso (conexion)
router.get('/progreso/:conexionId', verifyToken, async (req, res) => {
  const { conexionId } = req.params;

  try {
    const result = await db.query(`
      SELECT "reporteAvanceId", "tipo", "fecha", "descripcion", "ruta"
      FROM "ReporteAvance"
      WHERE "conexionId" = $1
      ORDER BY "fecha" ASC
    `, [conexionId]);

    return res.json(result.rows);
  } catch (err) {
    console.error('Error al cargar evidencias:', err);
    return res.status(500).json({ error: 'Error interno al cargar evidencias.' });
  }
});

// Actualizar descripción de evidencia
router.patch('/reporte/:reporteAvanceId', verifyToken, async (req, res) => {
  const { reporteAvanceId } = req.params;
  const { descripcion } = req.body;

  try {
    await db.query(`
      UPDATE "ReporteAvance"
      SET "descripcion" = $1
      WHERE "reporteAvanceId" = $2
    `, [descripcion, reporteAvanceId]);

    return res.json({ message: "Descripción actualizada correctamente" });
  } catch (err) {
    console.error('Error actualizando descripción:', err);
    return res.status(500).json({ error: 'Error actualizando descripción.' });
  }
});

module.exports = router;
