const express = require('express');
const multer = require('multer');
const cloudinary = require('../utils/cloudinary');

const router = express.Router();
const upload = multer({ storage: multer.memoryStorage() });

router.post('/evidence/upload', upload.single('archivo'), async (req, res) => {
  const { tipo, matchId } = req.body;

  // Validaciones
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
    const stream = cloudinary.uploader.upload_stream(
      {
        resource_type: 'image',
        context: { tipo, matchId }, // Metadatos opcionales
      },
      (error, result) => {
        if (error) {
          return res.status(400).json({ status: 400, reason: "Archivo inválido" });
        }
        return res.json({ 
          message: "Evidencia subida correctamente", 
          url: result.secure_url 
        });
      }
    );

    stream.end(req.file.buffer);
  } catch (err) {
    res.status(500).json({ status: 500, reason: err.message });
  }
});

module.exports = router;