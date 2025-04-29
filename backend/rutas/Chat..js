const express = require("express");
const router = express.Router();
const pool = require("../db");
const { v4: uuidv4 } = require("uuid");

// Crear chat si no existe (se ejecuta al hacer match o primer mensaje)
router.post("/crear-chat", async (req, res) => {
  const { conexionId } = req.body;

  try {
    // Verificar si ya existe el chat
    const existe = await pool.query(`SELECT * FROM "Chat" WHERE "conexionId" = $1`, [conexionId]);

    if (existe.rows.length === 0) {
      await pool.query(
        `INSERT INTO "Chat" ("conexionId") VALUES ($1)`,
        [conexionId]
      );
      return res.status(201).json({ mensaje: "Chat creado exitosamente." });
    }

    res.status(200).json({ mensaje: "El chat ya existía." });
  } catch (err) {
    console.error("Error al crear chat:", err);
    res.status(500).json({ error: "Error al crear el chat." });
  }
});

// Enviar mensaje (y guardar en Notificacion)
router.post("/enviar-mensaje", async (req, res) => {
  const { conexionId, emisor, mensaje } = req.body;
  
  console.log("🔎 Datos recibidos en POST /enviar-mensaje:", req.body);

  if (!conexionId || !emisor || !mensaje) {
    console.log("❌ Faltan datos: ", { conexionId, emisor, mensaje });
    return res.status(400).json({ error: "Faltan datos para guardar el mensaje." });
  }

  try {
    const chat = await pool.query(`SELECT * FROM "Chat" WHERE "conexionId" = $1`, [conexionId]);
    if (chat.rows.length === 0) {
      console.log("❌ Chat no encontrado para conexionId:", conexionId);
      return res.status(404).json({ error: "Chat no encontrado para esta conexión." });
    }

    const notificacionId = uuidv4();
    const fecha = new Date().toISOString().split("T")[0];

    await pool.query(
      `INSERT INTO "Notificacion" ("notificacionId", "emisor", "mensaje", "fecha", "conexionId")
       VALUES ($1, $2, $3, $4, $5)`,
      [notificacionId, emisor, mensaje, fecha, conexionId]
    );

    console.log("✅ Mensaje guardado con éxito:", mensaje);
    res.status(201).json({ mensaje: "Mensaje enviado y guardado con éxito." });
  } catch (err) {
    console.error("🔥 Error inesperado al enviar mensaje:", err);
    res.status(500).json({ error: "Error al guardar el mensaje." });
  }
});



// Obtener historial de mensajes
router.get("/mensajes/:conexionId", async (req, res) => {
  const { conexionId } = req.params;
  if (!conexionId || conexionId.length !== 36) {
    return res.status(400).json({ error: "ID de conexión inválido." });
  }

  try {
    const mensajes = await pool.query(`
      SELECT * FROM "Notificacion"
      WHERE "conexionId" = $1
      ORDER BY "fecha" ASC
    `, [conexionId]);

    res.status(200).json({ mensajes: mensajes.rows });
  } catch (err) {
    console.error("Error al obtener mensajes:", err);
    res.status(500).json({ error: "No se pudo recuperar los mensajes." });
  }
});


module.exports = router;
