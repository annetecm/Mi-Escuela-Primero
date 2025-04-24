const express = require('express');
const router = express.Router();
const db = require('../db'); // pg.Pool
const bcrypt = require("bcrypt");
const verifyToken = require('../middlewares/authMiddleware');

router.use((req, res, next) => {
  console.log(`📡 ${req.method} ${req.originalUrl}`);
  next();
});
// Registro
router.post('/', async (req, res) => {
    console.log('📩 POST recibido en /api/aliado');
    console.log('🧾 Cuerpo recibido:', req.body);
  
    const client = await db.connect();
    try {
      const {
        usuario,
        aliado,
        personaFisica,
        personaMoral,
        institucion,
        escrituraPublica,
        constanciaFisica,
        representante,
        apoyos,
        documento
      } = req.body;
  
      console.log(' Datos recibidos:', JSON.stringify(req.body, null, 2));
  
      await client.query('BEGIN');
  
      const insertUsuarioQuery = `
        INSERT INTO "Usuario" ("correoElectronico", "contraseña", "nombre", "estadoRegistro")
        VALUES ($1, $2, $3, 'pendiente')
        RETURNING "usuarioId";
      `;
      const hashedPassword = await bcrypt.hash(usuario.contraseña, 10);
      const usuarioResult = await client.query(insertUsuarioQuery, [
        usuario.correoElectronico,
        hashedPassword,
        usuario.nombre
      ]);
      
      const usuarioId = usuarioResult.rows[0].usuarioId;
  
      const aliadoResult = await client.query(`SELECT gen_random_uuid() as id`);
      const aliadoId = aliadoResult.rows[0].id;
  
      await client.query(`
        INSERT INTO "Aliado" ("aliadoId", "tipoDeApoyo", "usuarioId", "tipoId")
        VALUES ($1, $2, $3, $4);
      `, [
        aliadoId,
        aliado.tipoDeApoyo,
        usuarioId,
        aliado.tipoId
      ]);
  
      if (personaFisica) {
        await client.query(`
          INSERT INTO "PersonaFisica" ("CURP", "institucionLaboral", "razon", "correoElectronico", "telefono")
          VALUES ($1, $2, $3, $4, $5);
        `, [
          personaFisica.CURP,
          personaFisica.institucionLaboral,
          personaFisica.razon,
          personaFisica.correoElectronico,
          personaFisica.telefono
        ]);
      }
  
      if (personaMoral) {
        await client.query(`
          INSERT INTO "PersonaMoral" ("RFC", "numeroEscritura", "area", "correoElectronico", "telefono")
          VALUES ($1, $2, $3, $4, $5);
        `, [
          personaMoral.RFC,
          personaMoral.numeroEscritura,
          personaMoral.area,
          personaMoral.correoElectronico,
          personaMoral.telefono
        ]);
  
        await client.query(`
          INSERT INTO "Institucion" ("giro", "propositoOrganizacion", "domicilio", "telefono", "paginaWeb", "RFC")
          VALUES ($1, $2, $3, $4, $5, $6);
        `, [
          institucion.giro,
          institucion.propositoOrganizacion,
          institucion.domicilio,
          institucion.telefono,
          institucion.paginaWeb,
          institucion.RFC
        ]);
  
        await client.query(`
          INSERT INTO "EscrituraPublica" ("numeroEscritura", "fechaEscritura", "otorgadaNotario", "ciudad", "RFC")
          VALUES ($1, $2, $3, $4, $5);
        `, [
          escrituraPublica.numeroEscritura,
          escrituraPublica.fechaEscritura,
          escrituraPublica.otorgadaNotario,
          escrituraPublica.ciudad,
          escrituraPublica.RFC
        ]);
  
        await client.query(`
          INSERT INTO "ConstanciaFisica" ("RFC", "razonSocial", "regimen", "domicilio")
          VALUES ($1, $2, $3, $4);
        `, [
          constanciaFisica.RFC,
          constanciaFisica.razonSocial,
          constanciaFisica.regimen,
          constanciaFisica.domicilio
        ]);
        if (representante) {
          await client.query(`
            INSERT INTO "Representante" ("nombreRep", "correoRep", "telefonoRep", "areaRep", "RFC")
            VALUES ($1, $2, $3, $4, $5);
          `, [
            representante.nombre,
            representante.correo,
            representante.telefono,
            representante.area,
            representante.RFC
          ]);
        }
        
      }
  
      for (const apoyo of apoyos) {
        await client.query(`
          INSERT INTO "Apoyo" ("aliadoId", "tipo", "caracteristicas")
          VALUES ($1, $2, $3);
        `, [aliadoId, apoyo.tipo, apoyo.caracteristicas]);
      }

      if (documento && documento.length > 0) {
        for (const doc of documento) {
          await client.query(`
            INSERT INTO "Documento" ("tipo", "ruta", "fechaCarga", "usuarioId", "nombre")
            VALUES ($1, $2, NOW(), $3, $4);
          `, [
            doc.tipo,
            doc.ruta,
            usuarioId,
            doc.nombre
          ]);
        }
      }      
  
      await client.query('COMMIT');
  
      // Solo se manda una respuesta si todo sale bien
      return res.status(201).json({ message: 'Aliado registrado correctamente' });
  
    } catch (error) {
      await client.query('ROLLBACK');
      console.error('Error al registrar aliado:', error);
  
      // Solo se manda una respuesta si hay error
      if (!res.headersSent) {
        return res.status(500).json({ error: 'Error al registrar al aliado' });
      }
    } finally {
      client.release();
    }  
});

router.get('/perfil', verifyToken, async (req, res) => {
  const usuarioId = req.usuario.usuarioId;

  try {
    const result = await db.query(`
      SELECT 
        u.nombre, 
        u."correoElectronico", 
        a."tipoDeApoyo",
        ARRAY_AGG(ap."caracteristicas") AS apoyos
      FROM "Usuario" u
      JOIN "Aliado" a ON a."usuarioId" = u."usuarioId"
      LEFT JOIN "Apoyo" ap ON ap."aliadoId" = a."aliadoId"
      WHERE u."usuarioId" = $1
      GROUP BY u.nombre, u."correoElectronico", a."tipoDeApoyo";
    `, [usuarioId]);

    if (result.rows.length === 0) {
      return res.status(404).json({ error: 'Aliado no encontrado' });
    }

    return res.json(result.rows[0]);
  } catch (err) {
    console.error('Error al obtener perfil de aliado:', err);
    return res.status(500).json({ error: 'Error interno del servidor' });
  }
});

  module.exports = router;

  