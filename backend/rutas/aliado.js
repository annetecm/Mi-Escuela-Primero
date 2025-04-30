const express = require('express');
const router = express.Router();
const db = require('../db'); // pg.Pool
const bcrypt = require("bcrypt");
const verifyToken = require('../middlewares/authMiddleware');
const nodemailer = require('nodemailer');

// Configure nodemailer 
const transporter = nodemailer.createTransport({
  service: "gmail",
  auth: {
    user: "equiporeto6@gmail.com",
    pass: "bjmnunsytysdwycq", 
  },
});


router.use((req, res, next) => {
  console.log(` ${req.method} ${req.originalUrl}`);
  next();
});
// Registro
router.post('/', async (req, res) => {
  console.log('📩 POST recibido en /api/aliado');
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

    // 1. Insertar en Usuario
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

    // 2. Definir aliadoId según CURP o RFC
    let aliadoId = null;
    if (personaFisica && personaFisica.CURP) {
      aliadoId = personaFisica.CURP;
    } else if (personaMoral && personaMoral.RFC) {
      aliadoId = personaMoral.RFC;
    } else {
      throw new Error('No se proporcionó CURP o RFC para el aliadoId.');
    }

    // 3. Insertar en Aliado
    await client.query(`
      INSERT INTO "Aliado" ("aliadoId", "tipoDeApoyo", "usuarioId")
      VALUES ($1, $2, $3);
    `, [
      aliadoId,
      aliado.tipoDeApoyo,
      usuarioId
    ]);

    // 4. Insertar persona física o moral
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

    // 5. Insertar apoyos
    for (const apoyo of apoyos) {
      await client.query(`
        INSERT INTO "Apoyo" ("aliadoId", "tipo", "caracteristicas")
        VALUES ($1, $2, $3);
      `, [aliadoId, apoyo.tipo, apoyo.caracteristicas]);
    }

    // 6. Insertar documentos si los hay
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
    return res.status(201).json({ message: 'Aliado registrado correctamente' });

  } catch (error) {
    await client.query('ROLLBACK');
    console.error('Error al registrar aliado:', error);
    if (!res.headersSent) {
      return res.status(500).json({ error: 'Error interno al registrar al aliado.' });
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

router.get('/perfil-edit', verifyToken, async (req, res) => {
  const usuarioId = req.usuario.usuarioId;

  try {
    // 1. Buscar datos principales
    const { rows: usuarioRows } = await db.query(`
      SELECT 
      u.nombre,
       u."correoElectronico",
        u."estadoRegistro", 
        a."tipoDeApoyo", 
        a."aliadoId"
      FROM "Usuario" u
      JOIN "Aliado" a ON a."usuarioId" = u."usuarioId"
      WHERE u."usuarioId" = $1
    `, [usuarioId]);
  
    if (usuarioRows.length === 0) {
      return res.status(404).json({ error: 'Aliado no encontrado' });
    }
  
    const aliado = usuarioRows[0];
  
    // 2. Buscar en Persona Física usando aliadoId como CURP
    const { rows: fisicaRows } = await db.query(`
      SELECT "CURP", "institucionLaboral", "razon", "telefono", "correoElectronico"
      FROM "PersonaFisica"
      WHERE "CURP" = $1
    `, [aliado.aliadoId]);
  
    if (fisicaRows.length > 0) {
      const fisica = fisicaRows[0];
      return res.json({
        tipo: 'fisico',
        correo: fisica.correoElectronico,
        nombre: aliado.nombre,
        tipoDeApoyo: aliado.tipoDeApoyo,
        curp: fisica.CURP,
        institucionLaboral: fisica.institucionLaboral,
        razon: fisica.razon,
        telefono: fisica.telefono
      });
    }
  
    // 3. Buscar en Persona Moral usando aliadoId como RFC
    const { rows: moralRows } = await db.query(`
      SELECT pm."RFC", pm."area", pm."correoElectronico", pm."telefono",
             i."giro", i."domicilio", i."paginaWeb", i."propositoOrganizacion",
             ep."numeroEscritura", ep."fechaEscritura", ep."otorgadaNotario", ep."ciudad",
             cf."regimen", cf."domicilio" AS "domicilioFiscal", cf."razonSocial",
             r."nombreRep" AS "representanteNombre", r."correoRep" AS "representanteCorreo",
             r."telefonoRep" AS "representanteTelefono", r."areaRep" AS "representanteArea"
      FROM "PersonaMoral" pm
      LEFT JOIN "Institucion" i ON i."RFC" = pm."RFC"
      LEFT JOIN "EscrituraPublica" ep ON ep."RFC" = pm."RFC"
      LEFT JOIN "ConstanciaFisica" cf ON cf."RFC" = pm."RFC"
      LEFT JOIN "Representante" r ON r."RFC" = pm."RFC"

      WHERE pm."RFC" = $1::text

    `, [aliado.aliadoId]);
  
   // if it is persona moral
if (moralRows.length > 0) {
  const moral = moralRows[0];
  return res.json({
    tipo: 'moral',
    correo: moral.correoElectronico,
    nombre: aliado.nombre,
    tipoDeApoyo: aliado.tipoDeApoyo,
    telefono: moral.telefono,
    rfcInstitucion: moral.RFC, 
    area: moral.area,
    giro: moral.giro,
    proposito: moral.propositoOrganizacion,
    nombreOrg: aliado.nombre,
    domicilioInstitucion: moral.domicilio,
    paginaWeb: moral.paginaWeb,
    numeroEscritura: moral.numeroEscritura,
    fechaEscritura: moral.fecha, 
    otorgadaPor: moral.otorgadaNotario,
    ciudad: moral.ciudad,
    rfcFiscal: moral.RFC, 
    razonSocial: moral.razonSocial,
    regimen: moral.regimen,
    domicilioFiscal: moral.domicilioFiscal,
    representanteNombre: moral.representanteNombre,
    representanteCorreo: moral.representanteCorreo,
    representanteTelefono: moral.representanteTelefono,
    representanteArea: moral.representanteArea,
  });
}

  
    // Si no encontró ni física ni moral
    return res.status(404).json({ error: 'No se encontró el tipo de persona (física o moral)' });
  
  } catch (error) {
    console.error('Error al obtener perfil de aliado:', error);
    return res.status(500).json({ error: 'Error interno del servidor' });
  }
});  
    

router.get('/escuelas-recomendadas', verifyToken, async (req, res) => {
  const usuarioId = req.usuario.usuarioId;

  try {
    const apoyosResult = await db.query(`
      SELECT ARRAY_AGG(ap."caracteristicas") AS apoyos
      FROM "Aliado" a
      LEFT JOIN "Apoyo" ap ON ap."aliadoId" = a."aliadoId"
      WHERE a."usuarioId" = $1
      GROUP BY a."aliadoId"
    `, [usuarioId]);

    if (apoyosResult.rows.length === 0) {
      return res.status(404).json({ error: 'Aliado no encontrado o sin apoyos registrados.' });
    }

    const { apoyos } = apoyosResult.rows[0];
    const apoyoArray = Array.isArray(apoyos) ? apoyos : [];

    const result = await db.query(`
      SELECT 
        u."nombre" AS nombre_escuela,
        u."usuarioId",
        e."CCT",
        e."latitud",
        e."longitud",
        COALESCE(SUM(
          CASE 
            WHEN n."nombre" = ANY($1::text[])
            THEN n."prioridad"
            ELSE 0
          END
        ), 0) AS puntaje,
        COALESCE(STRING_AGG(
          CASE 
            WHEN n."nombre" = ANY($1::text[]) THEN n."nombre"
            ELSE NULL
          END, ', '
        ), '') AS coincidencias
      FROM "Usuario" u
      JOIN "Escuela" e ON e."usuarioId" = u."usuarioId"
      LEFT JOIN "Necesidad" n 
        ON n."CCT" = e."CCT"
        AND n."necesidadId" NOT IN (
          SELECT "necesidadId" FROM "Conexion"
          WHERE "estado" = 'pendiente' OR "estado" = 'finalizado'
        )
      WHERE u."estadoRegistro" = 'aprobado'
      GROUP BY u."nombre", u."usuarioId", e."CCT", e."latitud", e."longitud"
      ORDER BY puntaje DESC;
    `, [apoyoArray]);
    

    return res.json(result.rows);
  } catch (err) {
    console.error('Error al obtener escuelas recomendadas:', err);
    return res.status(500).json({ error: 'Error interno del servidor.' });
  }
});

//Endpoint sacar info de escuela para SchoolCard
router.get('/escuela/:cct', async (req, res) => {
  const { cct } = req.params;

  try {
    const result = await db.query(`
      SELECT 
        u."nombre" AS nombre_escuela,
        e."direccion",
        e."nivelEducativo",
        ARRAY_AGG(n."nombre") AS necesidades
      FROM "Escuela" e
      JOIN "Usuario" u ON u."usuarioId" = e."usuarioId"
      LEFT JOIN "Necesidad" n ON n."CCT" = e."CCT"
      WHERE e."CCT" = $1
      GROUP BY u."nombre", e."direccion", e."nivelEducativo";
    `, [cct]);

    if (result.rows.length === 0) {
      return res.status(404).json({ error: 'Escuela no encontrada' });
    }

    res.json(result.rows[0]);
  } catch (err) {
    console.error("Error al obtener datos de escuela:", err);
    res.status(500).json({ error: 'Error interno del servidor' });
  }
});

//Para sacar ids necesidades de la escuela se usa en el match
router.get('/ids-necesidades/:cct', verifyToken, async (req, res) => {
  const { cct } = req.params;
  try {
    const result = await db.query(`
      SELECT "necesidadId", "nombre" FROM "Necesidad"
      WHERE "CCT" = $1
    `, [cct]);
    res.json(result.rows);
  } catch (err) {
    console.error("Error al obtener necesidades:", err);
    res.status(500).json({ error: "Error al obtener necesidades" });
  }
});

//Para sacar id de apoyos del aliado se usa en el match
router.get('/ids-apoyos', verifyToken, async (req, res) => {
  const usuarioId = req.usuario.usuarioId;
  try {
    const result = await db.query(`
      SELECT ap."apoyoId", ap."caracteristicas"
      FROM "Apoyo" ap
      JOIN "Aliado" a ON ap."aliadoId" = a."aliadoId"
      WHERE a."usuarioId" = $1
    `, [usuarioId]);
    res.json(result.rows);
  } catch (err) {
    console.error("Error al obtener apoyos:", err);
    res.status(500).json({ error: "Error al obtener apoyos" });
  }
});


router.get("/editar-datos", verifyToken, async (req, res) => {
  const usuarioId = req.usuario.usuarioId;
  const client = await db.connect();
  
  try {
    const { rows: usuario } = await client.query(`SELECT "nombre", "correoElectronico" FROM "Usuario" WHERE "usuarioId" = $1`, [usuarioId]);
    //const { rows: aliado } = await client.query(`SELECT "aliadoId", "tipoDeApoyo" FROM "Aliado" WHERE "usuarioId" = $1`, [usuarioId]);

    if (!usuario.length || !aliado.length) return res.status(404).json({ error: "No encontrado" });

    const aliadoId = aliado[0].aliadoId;
    
    // Check if its moral or fis
    const { rows: fisica } = await client.query(`SELECT * FROM "PersonaFisica" WHERE "CURP" = $1`, [aliadoId]);
    const { rows: moral } = await client.query(`SELECT * FROM "PersonaMoral" WHERE "RFC" = $1`, [aliadoId]);

    let tipoPersona = fisica.length > 0 ? "fisica" : (moral.length > 0 ? "moral" : "desconocido");
    let personaData = fisica.length > 0 ? fisica[0] : (moral.length > 0 ? moral[0] : null);

    return res.json({
      nombre: usuario[0].nombre,
      correo: usuario[0].correoElectronico,
      //tipoDeApoyo: aliado[0].tipoDeApoyo,
      tipoPersona,
      personaData
    });
  } catch (err) {
    console.error('Error en GET editar-datos:', err);
    return res.status(500).json({ error: "Error interno" });
  } finally {
    client.release();
  }
});


router.post("/editar-datos", verifyToken, async (req, res) => {
  const usuarioId = req.usuario.usuarioId;
  const formData = req.body;
  const client = await db.connect();

  try {
    await client.query("BEGIN");

    const { rows: usuarioViejo } = await client.query(`
      SELECT * FROM "Usuario" WHERE "usuarioId" = $1
    `, [usuarioId]);

    const { rows: aliadoViejo } = await client.query(`
      SELECT * FROM "Aliado" WHERE "usuarioId" = $1
    `, [usuarioId]);

    if (usuarioViejo.length === 0 || aliadoViejo.length === 0) {
      throw new Error("Aliado o Usuario no encontrado");
    }

    const aliadoId = aliadoViejo[0].aliadoId;

    const { rows: fisicaViejo } = await client.query(`
      SELECT * FROM "PersonaFisica" WHERE "CURP" = $1
    `, [aliadoId]);

    const { rows: moralViejo } = await client.query(`
      SELECT * FROM "PersonaMoral" WHERE "RFC" = $1
    `, [aliadoId]);

    const tipoPersona = fisicaViejo.length > 0 ? "fisico" : (moralViejo.length > 0 ? "moral" : "desconocido");
    if (tipoPersona === "desconocido") {
      throw new Error("Tipo de persona no encontrado para el aliado");
    }

    const { rows: institucionViejo } = await client.query(`SELECT * FROM "Institucion" WHERE "RFC" = $1`, [aliadoId]);
const { rows: escrituraViejo } = await client.query(`SELECT * FROM "EscrituraPublica" WHERE "RFC" = $1`, [aliadoId]);
const { rows: constanciaViejo } = await client.query(`SELECT * FROM "ConstanciaFisica" WHERE "RFC" = $1`, [aliadoId]);
const { rows: representanteViejo } = await client.query(`SELECT * FROM "Representante" WHERE "RFC" = $1`, [aliadoId]);


    const cambios = [];

    function compararCampo(nombre, viejo, nuevo) {
      if ((viejo ?? "") !== (nuevo ?? "")) {
        cambios.push(`${nombre}: <b>${viejo || "(vacío)"}</b> ➔ <b>${nuevo || "(vacío)"}</b>`);
      }
    }

    // Comparar Usuario y Aliado
    compararCampo("Correo electrónico", usuarioViejo[0].correoElectronico, formData.correo);
    compararCampo("Nombre", usuarioViejo[0].nombre, formData.nombreOrg || formData.nombre); // Ajusta si es físico o moral
    //compararCampo("Tipo de Apoyo", aliadoViejo[0].tipoDeApoyo, formData.tipoDeApoyo);
    if (formData.contrasena && formData.contrasena.trim() !== "") {
      compararCampo("Contraseña", "(se actualizó)", "(nuevo valor ingresado)");
      const hashed = await bcrypt.hash(formData.contrasena, 10);
      await client.query(
        `UPDATE "Usuario" SET "contraseña" = $1 WHERE "usuarioId" = $2`,
        [hashed, usuarioId]
      );
    }
    


    // Comparar Persona Física o Moral
    if (tipoPersona === "fisico") {
      compararCampo("Institución Laboral", fisicaViejo[0].institucionLaboral, formData.institucionLaboral);
      compararCampo("Razón", fisicaViejo[0].razon, formData.razon);
      compararCampo("Teléfono", fisicaViejo[0].telefono, formData.telefono);
    } else if (tipoPersona === "moral") {
      const moral = moralViejo[0];
      compararCampo("Teléfono", moral.telefono, formData.telefono);
      compararCampo("RFC Institución", moral.RFC, formData.rfcInstitucion);
      compararCampo("Giro", institucionViejo[0]?.giro, formData.giro);
      compararCampo("Propósito", institucionViejo[0]?.propositoOrganizacion, formData.proposito);
      compararCampo("Domicilio Institución", institucionViejo[0]?.domicilio, formData.domicilioInstitucion);
      compararCampo("Página Web", institucionViejo[0]?.paginaWeb, formData.paginaWeb);
      
      compararCampo("Número Escritura", escrituraViejo[0]?.numeroEscritura, formData.numeroEscritura);
      compararCampo("Fecha Escritura", escrituraViejo[0]?.fechaEscritura, formData.fechaEscritura);
      compararCampo("Otorgada por", escrituraViejo[0]?.otorgadaNotario, formData.otorgadaPor);
      compararCampo("Ciudad", escrituraViejo[0]?.ciudad, formData.ciudad);
      
      compararCampo("RFC Fiscal", constanciaViejo[0]?.RFC, formData.rfcFiscal);
      compararCampo("Razón Social", constanciaViejo[0]?.razonSocial, formData.razonSocial);
      compararCampo("Régimen", constanciaViejo[0]?.regimen, formData.regimen);
      compararCampo("Domicilio Fiscal", constanciaViejo[0]?.domicilio, formData.domicilioFiscal);
      
      compararCampo("Nombre Representante", representanteViejo[0]?.nombreRep, formData.representanteNombre);
      compararCampo("Correo Representante", representanteViejo[0]?.correoRep, formData.representanteCorreo);
      compararCampo("Teléfono Representante", representanteViejo[0]?.telefonoRep, formData.representanteTelefono);
      compararCampo("Área Representante", representanteViejo[0]?.areaRep, formData.representanteArea);
      
      //compararCampo("Teléfono", moralViejo[0].telefono, formData.telefono);
    }

    // Actualizar Usuario
    await client.query(`
      UPDATE "Usuario"
      SET "correoElectronico" = $1, "nombre" = $2
      WHERE "usuarioId" = $3
    `, [
      formData.correo,
      formData.nombreOrg || formData.nombre,
      usuarioId
    ]);

   


    /*/ Actualizar Aliado
    await client.query(`
      UPDATE "Aliado"
      SET "tipoDeApoyo" = $1
      WHERE "usuarioId" = $2
    `, [
      formData.tipoDeApoyo,
      usuarioId
    ]);/*/

    if (tipoPersona === "fisico") {
      await client.query(`
        UPDATE "PersonaFisica"
        SET "institucionLaboral" = $1, "razon" = $2, "telefono" = $3
        WHERE "CURP" = $4
      `, [
        formData.institucionLaboral,
        formData.razon,
        formData.telefono,
        aliadoId
      ]);
    } else if (tipoPersona === "moral") {
      await client.query(`
        UPDATE "PersonaMoral"
        SET "telefono" = $1
        WHERE "RFC" = $2
      `, [formData.telefono, aliadoId]);
    

      await client.query(`
        UPDATE "Institucion"
        SET "giro" = $1, "propositoOrganizacion" = $2, "domicilio" = $3, "paginaWeb" = $4
        WHERE "RFC" = $5
      `, [
        formData.giro,
        formData.proposito,
        formData.domicilioInstitucion,
        formData.paginaWeb,
        aliadoId
      ]);
    
      await client.query(`
        UPDATE "EscrituraPublica"
        SET "fechaEscritura" = $1, "otorgadaNotario" = $2, "ciudad" = $3
        WHERE "numeroEscritura" = $4
      `, [
        formData.fechaEscritura,
        formData.otorgadaPor,
        formData.ciudad,
        formData.numeroEscritura
      ]);
    
      await client.query(`
        UPDATE "ConstanciaFisica"
        SET "razonSocial" = $1, "regimen" = $2, "domicilio" = $3
        WHERE "RFC" = $4
      `, [
        formData.razonSocial,
        formData.regimen,
        formData.domicilioFiscal,
        aliadoId
      ]);
    
      await client.query(`
        UPDATE "Representante"
        SET "nombreRep" = $1, "correoRep" = $2, "telefonoRep" = $3, "areaRep" = $4
        WHERE "RFC" = $5
      `, [
        formData.representanteNombre,
        formData.representanteCorreo,
        formData.representanteTelefono,
        formData.representanteArea,
        aliadoId
      ]);
    
      
    }

    

    // Buscar admins
    const { rows: adminRows } = await client.query(`
      SELECT "correoElectronico"
      FROM "Usuario"
      JOIN "Administrador" ON "Administrador"."usuarioId" = "Usuario"."usuarioId"
    `);
    const adminEmails = adminRows.map(a => a.correoElectronico);

    // Enviar correo solo si hubo cambios
    if (cambios.length > 0 && adminEmails.length > 0) {
      await transporter.sendMail({
        from: '"Sistema Mi Escuela Primero" <equiporeto6@gmail.com>',
        to: adminEmails,
        subject: "Actualización de perfil de aliado",
        html: `
          <h2>Actualización de perfil</h2>
          <p><b>ID usuario:</b> ${usuarioId}</p>
          <p><b>Tipo de persona:</b> ${tipoPersona}</p>
          <p><b>Cambios detectados:</b></p>
          <ul>${cambios.map(c => `<li>${c}</li>`).join("")}</ul>
        `
      });
      console.log("✅ Correo de cambios enviado a admins.");
    }

    

    await client.query("COMMIT");
    res.json({ mensaje: "Datos actualizados correctamente" });

  } catch (err) {
    await client.query("ROLLBACK");
    console.error("Error en POST editar-datos:", err);
    res.status(500).json({ error: "Error interno del servidor" });
  } finally {
    client.release();
  }
});






  module.exports = router;

  