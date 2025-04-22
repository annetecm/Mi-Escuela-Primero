const express = require('express');
const multer = require('multer');
const cloudinary = require('../utils/cloudinary');

const router = express.Router();
const upload = multer({ storage: multer.memoryStorage() });

router.post('/documents/upload', upload.single('archivo'), async (req, res) => {
  const { tipo, id } = req.body;

  // Validaciones
  if (!req.file) {
    return res.status(400).json({ status: 400, reason: "Archivo no válido" });
  }

  if (!tipo || !['escuela', 'aliado'].includes(tipo)) {
    return res.status(400).json({ status: 400, reason: "Tipo inválido" });
  }

  if (!id) {
    return res.status(400).json({ status: 400, reason: "ID requerido" });
  }

  try {
    const stream = cloudinary.uploader.upload_stream(
      {
        resource_type: 'auto',
        context: { tipo, id },
      },
      (error, result) => {
        if (error) {
          return res.status(400).json({ status: 400, reason: "Archivo no válido" });
        }

        return res.json({
          message: "Documento subido correctamente",
          url: result.secure_url,
        });
      }
    );

    stream.end(req.file.buffer);
  } catch (err) {
    res.status(500).json({ status: 500, reason: err.message });
  }
});

module.exports = router;
