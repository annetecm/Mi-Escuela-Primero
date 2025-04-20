const express = require('express');
const multer = require('multer');
const cloudinary = require('../utils/cloudinary');

const router = express.Router();
const upload = multer({ storage: multer.memoryStorage() });

router.post('/upload', upload.single('file'), async (req, res) => {
  try {
    const { description } = req.body;

    const stream = cloudinary.uploader.upload_stream(
      {
        resource_type: 'auto',
        context: { caption: description, alt: description }
      },
      (error, result) => {
        if (error) return res.status(500).json({ error: error.message });
        res.json({ url: result.secure_url });
      }
    );

    stream.end(req.file.buffer);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

module.exports = router;

