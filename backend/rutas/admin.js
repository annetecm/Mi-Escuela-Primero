const router = require("express").Router(); 
const pool = require("../db");
const bcrypt = require("bcrypt");
const verifyToken  = require("../middlewares/authMiddleware");
const nodemailer = require("nodemailer");

// Configure nodemailer 
const transporter = nodemailer.createTransport({
  service: "gmail",
  auth: {
    user: "equiporeto6@gmail.com",
    pass: "bjmnunsytysdwycq", 
  },
});

// Test route for debugging
router.post("/test-route", (req, res) => {
  console.log("Datos recibidos:", req.body);
  res.json({ received: true });
});

//obtener perfil de otros administradores
//no se que tan efectivo sea este formato
router.get("/administrador/perfil/:adminId", verifyToken, async(req,res)=>{
  //se pasa el administradorId
  const adminId= req.params.adminId;
  console.log("🔍 Buscando administrador con id :", adminId);

  try{
    const query=`
    WITH admin_data AS (
      SELECT 
        u."usuarioId",
        u."nombre",
        u."correoElectronico",
        u."estadoRegistro"
      FROM "Administrador" e
      JOIN "Usuario" u ON e."usuarioId" = u."usuarioId"
      WHERE e."administradorId" = $1
    )
    SELECT 
      ed.*
    FROM admin_data ed
    `;
    console.log("Ejecutando para ", adminId);
    const result= await pool.query(query,[adminId]);
    if (result.rows.length === 0) {
      console.log("❌ No se encontró escuela con CCT:", CCT);
      return res.status(404).json({ 
        error: "Escuela no encontrada",
        details: `No existe registro con CCT: ${CCT}`
      });
  }

  // Process the data for a cleaner structure
  const administrador = result.rows[0];
    
  // Format data to match frontend expectations
  const responseData = {
    // Basic school data
    ...administrador};

    console.log("✅ Datos encontrados:", responseData);
    return res.json(responseData);

  } catch (err) {
    console.error("💥 Error en la consulta:", {
      message: err.message,
      stack: err.stack,
      parameters: [adminId]
    });
    
    return res.status(500).json({ 
      error: "Error en la consulta",
      details: err.message,
      solution: "Verifique que el adminId exista y tenga formato correcto"
    });
  }

});

//obtener datos
//nadie le mueva que los mato
router.get("/escuela/perfil/:CCT", verifyToken, async (req, res) => {
  const CCT = req.params.CCT;
  console.log("🔍 Buscando escuela con CCT:", CCT);

  try {
    const query = `
    WITH escuela_data AS (
      SELECT 
        e."direccion",
        e."zonaEscolar",
        e."sectorEscolar",
        e."modalidad",
        e."nivelEducativo",
        e."CCT",
        e."tieneUSAER",
        e."numeroDocentes",
        e."estudiantesPorGrupo",
        e."controlAdministrativo",
        u."usuarioId",
        u."nombre",
        u."correoElectronico",
        u."estadoRegistro"
      FROM "Escuela" e
      JOIN "Usuario" u ON e."usuarioId" = u."usuarioId"
      WHERE e."CCT" = $1
    ),
    director_data AS (
      SELECT 
        "nombre" AS director_nombre,
        "correoElectronico" AS director_correo,
        "telefono" AS director_telefono,
        "posibleCambioPlantel" AS director_posibleCambio
      FROM "Director"
      WHERE "CCT" = $1
    ),
    supervisor_data AS (
      SELECT 
        "nombre" AS supervisor_nombre,
        "correoElectronico" AS supervisor_correo,
        "telefono" AS supervisor_telefono,
        "posibleCambioZona" AS supervisor_posibleCambio,
        "medioContacto" AS supervisor_medioContacto,
        "antiguedadZona" AS supervisor_antiguedad
      FROM "Supervisor"
      WHERE "CCT" = $1
    ),
    mesa_data AS (
      SELECT 
        "personasCantidad" AS mesa_personas
      FROM "MesaDirectiva"
      WHERE "CCT" = $1
    ),
    necesidades_data AS (
      SELECT json_agg(
        json_build_object(
          'nombre', n."nombre",
          'prioridad', n."prioridad",
          'categoria', n."categoria"
        )
      ) AS necesidades
      FROM "Necesidad" n
      WHERE n."CCT" = $1
    ),
    apoyos_data AS (
      SELECT json_agg(
        json_build_object(
          'nombre', a."nombre",
          'descripcion', a."descripcion"
        )
      ) AS apoyos_previos
      FROM "ApoyoPrevio" a
      WHERE a."CCT" = $1
    ),
    tramites_data AS (
      SELECT json_agg(
        json_build_object(
          'estado', t."estado",
          'folioOficial', t."folioOficial",
          'nivelGobierno', t."nivelGobierno",
          'descripcion', t."descripcion"
        )
      ) AS tramites_gobierno
      FROM "TramiteGobierno" t
      WHERE t."CCT" = $1
    ),
    documentos_data AS (
      SELECT json_agg(
        json_build_object(
          'nombre', d."nombre",
          'ruta', d."ruta",
          'fechaCarga', d."fechaCarga"
        )
      ) AS documentos
      FROM "Documento" d
      JOIN "Usuario" u ON d."usuarioId" = u."usuarioId"
      JOIN "Escuela" e ON u."usuarioId" = e."usuarioId"
      WHERE e."CCT" = $1
    ),
   conexiones_data AS (
        SELECT 
          json_agg(
            json_build_object(
              'necesidadId', c."necesidadId",
              'apoyoId', c."apoyoId",
              'fechaInicio', c."fechaInicio",
              'fechaFin', c."fechaFin",
              'estado', c."estado",
              'necesidadNombre', COALESCE(n."nombre", 'No disponible'),
              'apoyoNombre', COALESCE(a."tipo", 'No disponible'),
              'aliadoNombre', COALESCE(
                CASE 
                  WHEN pf."razon" IS NOT NULL THEN pf."razon"
                  WHEN pm."area" IS NOT NULL THEN pm."area"
                  ELSE 'Aliado desconocido'
                END, 
                'No disponible'
              )
            )
          ) AS conexiones
        FROM "Conexion" c
        LEFT JOIN "Necesidad" n ON c."necesidadId" = n."necesidadId"
        LEFT JOIN "Apoyo" a ON c."apoyoId" = a."apoyoId"
        LEFT JOIN "Aliado" al ON a."aliadoId" = al."aliadoId"
        LEFT JOIN "PersonaFisica" pf ON al."aliadoId" = pf."CURP"
        LEFT JOIN "PersonaMoral" pm ON al."aliadoId" = pm."RFC"
        WHERE c."CCT" = $1
      )
    
   SELECT 
      ed.*,
      COALESCE(dd.director_nombre, null) as director_nombre,
      COALESCE(dd.director_correo, null) as director_correo,
      COALESCE(dd.director_telefono, null) as director_telefono,
      COALESCE(dd.director_posibleCambio, null) as director_posibleCambio,
      COALESCE(sd.supervisor_nombre, null) as supervisor_nombre,
      COALESCE(sd.supervisor_correo, null) as supervisor_correo,
      COALESCE(sd.supervisor_telefono, null) as supervisor_telefono,
      COALESCE(sd.supervisor_posibleCambio, null) as supervisor_posibleCambio,
      COALESCE(sd.supervisor_medioContacto, null) as supervisor_medioContacto,
      COALESCE(sd.supervisor_antiguedad, null) as supervisor_antiguedad,
      COALESCE(md.mesa_personas, null) as mesa_personas,
      COALESCE(nd.necesidades, '{}')::json as necesidades,
      COALESCE(ap.apoyos_previos, '{}')::json as apoyos_previos,
      COALESCE(td.tramites_gobierno, '{}')::json as tramites_gobierno,
      COALESCE(doc.documentos, '{}')::json as documentos,
      COALESCE(con.conexiones, '{}')::json as conexiones
    FROM escuela_data ed
    LEFT JOIN director_data dd ON true
    LEFT JOIN supervisor_data sd ON true
    LEFT JOIN mesa_data md ON true
    LEFT JOIN necesidades_data nd ON true
    LEFT JOIN apoyos_data ap ON true
    LEFT JOIN tramites_data td ON true
    LEFT JOIN documentos_data doc ON true
    LEFT JOIN conexiones_data con ON true
    `;

    console.log("Ejecutando consulta:");
    const result = await pool.query(query, [CCT]);

    if (result.rows.length === 0) {
      console.log("❌ No se encontró escuela con CCT:", CCT);
      return res.status(404).json({ 
        error: "Escuela no encontrada",
        details: `No existe registro con CCT: ${CCT}`
      });
    }

    // Process the data for a cleaner structure
    const escuela = result.rows[0];
    
    // Format data to match frontend expectations
    const responseData = {
      // Basic school data
      ...escuela,
      
      // Director information
      director: escuela.director_nombre ? {
        nombre: escuela.director_nombre,
        correoElectronico: escuela.director_correo,
        telefono: escuela.director_telefono,
        posibleCambioPlantel: escuela.director_posibleCambio
      } : null,
      
      // Supervisor information
      supervisor: escuela.supervisor_nombre ? {
        nombre: escuela.supervisor_nombre,
        correoElectronico: escuela.supervisor_correo,
        telefono: escuela.supervisor_telefono,
        posibleCambioZona: escuela.supervisor_posibleCambio,
        medioContacto: escuela.supervisor_medioContacto,
        antiguedadZona: escuela.supervisor_antiguedad
      } : null,
      
      // Mesa directiva
      mesaDirectiva: escuela.mesa_personas ? {
        personasCantidad: escuela.mesa_personas
      } : null,
      
      // Make sure all these array properties exist
      necesidades: Array.isArray(escuela.necesidades) ? escuela.necesidades : [],
      apoyosPrevios: Array.isArray(escuela.apoyos_previos) ? escuela.apoyos_previos : [],
      tramitesGobierno: Array.isArray(escuela.tramites_gobierno) ? escuela.tramites_gobierno : [],
      documentos: Array.isArray(escuela.documentos) ? escuela.documentos : [],
      conexiones: Array.isArray(escuela.conexiones) ? escuela.conexiones : []
    };

    // Remove temporary fields
    delete responseData.director_nombre;
    delete responseData.director_correo;
    delete responseData.director_telefono;
    delete responseData.director_posibleCambio;
    delete responseData.supervisor_nombre;
    delete responseData.supervisor_correo;
    delete responseData.supervisor_telefono;
    delete responseData.supervisor_posibleCambio;
    delete responseData.supervisor_medioContacto;
    delete responseData.supervisor_antiguedad;
    delete responseData.mesa_personas;
    delete responseData.apoyos_previos;
    delete responseData.tramites_gobierno;
    delete responseData.documentos;
    delete responseData.conexiones;

    console.log("✅ Datos encontrados:", responseData);
    return res.json(responseData);

  } catch (err) {
    console.error("💥 Error en la consulta:", {
      message: err.message,
      stack: err.stack,
      parameters: [CCT]
    });
    
    return res.status(500).json({ 
      error: "Error en la consulta",
      details: err.message,
      solution: "Verifique que el CCT exista y tenga formato correcto"
    });
  }
});

//creo que no sirve
//update user information
router.post("/update", verifyToken, async(req,res)=>{
  const {id, field, value}= req.body;
  if(!id||!field||value===undefined){
    return res.status(400).json({error: "Faltan datos requeridos"});
  }
  try{
    const query = `Update "Escuela" SET "${field}" =$1 WHERE "usuarioId" =$2 RETURNING *`;
    const result = await pool.query(query, [value,id]);
    if (result.rows.length ===0){
      return res.status(404).json({error: 'Usuario no encontrado'});
    }
  }catch(error){
    console.error("Error al actualizar datos: ", err);
    res.status(500).json({error: 'Error interno del servidor'});
  }
});

//no borrar
//obtener informmacion a partir del identificador
router.get("/administrador/informacion/:id", verifyToken, async (req, res) => {
  const { id } = req.params;
  const { tipoUsuario } = req.query;

  try {
    let query = "";
    let values = [id];

    if (tipoUsuario === "escuela") {
      query = `
        SELECT e."CCT" AS identificador, e."nombre", e."direccion", e."correoElectronico", e."nivelEducativo", 
               ARRAY_AGG(n."descripcion") AS necesidades
        FROM "Escuela" e
        LEFT JOIN "Necesidad" n ON e."CCT" = n."CCT"
        WHERE e."CCT" = $1
        GROUP BY e."CCT";
      `;
    } else if (tipoUsuario === "aliado") {
      query = `
        SELECT a."aliadoId" AS identificador, u."nombre", u."correoElectronico"
        FROM "Aliado" a
        JOIN "Usuario" u ON a."usuarioId" = u."usuarioId"
        WHERE a."aliadoId" = $1;
      `;
    } else if (tipoUsuario==="administrador"){
      query = `
        SELECT a."administradorId" AS identificador, u."nombre", u."correoElectronico"
        FROM "Administrador" a
        JOIN "Usuario" u ON a."usuarioId" = u."usuarioId"
        WHERE a."administradorId" = $1;
      `;
    }else {
      return res.status(400).json({ error: "Tipo de usuario no válido" });
    }

    const result = await pool.query(query, values);

    if (result.rows.length === 0) {
      return res.status(404).json({ error: "Usuario no encontrado" });
    }

    return res.json(result.rows[0]);
  } catch (err) {
    console.error("Error al obtener información del usuario:", err.message, err.stack);
    return res.status(500).json({ error: "Error interno del servidor", details: err.message });
  }
});

//cambiar de pendiente a aprobado 
router.put("/fetch/aprobar", verifyToken, async (req,res)=>{
  const usuarioId = req.usuario.usuarioId;
  try{
    const { identificador, correo, nombreAdmin } = req.body;

    if (!identificador) {
      return res.status(400).json({ error: "El identificador es requerido" });
    }

    const result = await pool.query(
      `UPDATE "Usuario"
        SET "estadoRegistro" = 'aprobado'
        WHERE "usuarioId" = (
          SELECT u."usuarioId"
          FROM "Usuario" u
          LEFT JOIN "Administrador" ad ON ad."usuarioId" = u."usuarioId"
          LEFT JOIN "Aliado" a ON a."usuarioId" = u."usuarioId"
          LEFT JOIN "PersonaFisica" pf ON a."aliadoId" = pf."CURP"
          LEFT JOIN "PersonaMoral" pm ON a."aliadoId" = pm."RFC"
          LEFT JOIN "Escuela" e ON e."usuarioId" = u."usuarioId"
          WHERE COALESCE(pf."CURP"::TEXT, pm."RFC"::TEXT, e."CCT"::TEXT, ad."administradorId"::TEXT) = $1
        );
        `,
      [identificador]
    );

    if (result.rowCount === 0) {
      return res.status(404).json({ error: "Usuario no encontrado" });
    }
    //mandar correo
    const htmlCambios = `
      <html>
        <head>
          <style>
            body {
              font-family: 'Montserrat', sans-serif;
              background-color: #f5f5f5;
              margin: 0;
              padding: 30px;
            }
            .container {
              background: #fff;
              padding: 25px 30px;
              border-radius: 8px;
              box-shadow: 0 2px 8px rgba(0,0,0,0.1);
              max-width: 600px;
              margin: auto;
            }
            h2 {
              color: #019847;
              margin-bottom: 20px;
              font-size: 24px;
            }
            p {
              font-size: 16px;
              color: #555;
              margin-bottom: 15px;
            }
            ul {
              padding-left: 20px;
              margin-top: 15px;
            }
            li {
              margin-bottom: 10px;
              font-size: 15px;
              color: #333;
            }
            .highlight {
              font-weight: bold;
              color: #019847;
            }
          </style>
        </head>
        <body>
          <div class="container">
            <h2>Su usuario ha sido aceptado</h2>
            <p><span class="highlight">Usuario que realizó el cambio por:</span> ${nombreAdmin}</p>
            <p>Su usario en la pagina mi escuela primero ha sido aceptado. ¡Felicidades!</p>
          </div>
        </body>
      </html>
    `;

      try {
        await transporter.sendMail({
          from: '"Sistema de Notificaciones Mi Escuela Primero" <equiporeto6@gmail.com>',
          to: correo,
          subject: "Actualización a aprobado.",
          html: htmlCambios
        });
      } catch (error) {
        console.error("❌ Error al enviar correo:", error);
      }
    
    return res.json({ message: "Estado actualizado a aprobado" });
  } catch (err) {
    console.error("Error al actualizar estado en /fetch/aprobar:", err.message, err.stack);
    return res.status(500).json({ error: "Error interno del servidor", details: err.message });
  }
});

//obtener los perfiles no aprobados
router.get("/fetch/noAprobado", verifyToken, async (req, res) => {
  try {
    const result = await pool.query(`
      SELECT 
          u."nombre" AS nombre_usuario,
          u."correoElectronico" AS correo_usuario,
          u."estadoRegistro" AS estado,
          COALESCE(pf."CURP"::TEXT, pm."RFC"::TEXT, e."CCT"::TEXT, ad."administradorId"::TEXT) AS identificador,
          CASE 
              WHEN a."aliadoId" IS NOT NULL AND pf."CURP" IS NOT NULL THEN 'Aliado de Persona Fisica'
              WHEN a."aliadoId" IS NOT NULL AND pm."RFC" IS NOT NULL THEN 'Aliado de Persona Moral'
              WHEN e."usuarioId" IS NOT NULL THEN 'Escuela'
              WHEN ad."usuarioId" IS NOT NULL THEN 'Administrador'
              ELSE 'Desconocido'
          END AS tipo_usuario
      FROM "Usuario" u
      LEFT JOIN "Administrador" ad ON ad."usuarioId" = u."usuarioId"
      LEFT JOIN "Aliado" a ON a."usuarioId" = u."usuarioId"
      LEFT JOIN "PersonaFisica" pf ON a."aliadoId" = pf."CURP"
      LEFT JOIN "PersonaMoral" pm ON a."aliadoId" = pm."RFC"
      LEFT JOIN "Escuela" e ON e."usuarioId" = u."usuarioId"
      WHERE u."estadoRegistro" = 'pendiente'
      ORDER BY u."nombre";
    `);

    if (result.rows.length === 0) {
      return res.status(200).json([]); // Devuelve un arreglo vacío con estado 200
    }

    return res.json(result.rows);
  } catch (err) {
    if (result.rows.length === 0) {
      return res.status(200).json([]); // Devuelve un arreglo vacío con estado 200
    }
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

// Register admin
router.post("/", async (req, res) => {
  
  console.log("Received data:", JSON.stringify(req.body, null, 2)); // Log incoming data

  const client = await pool.connect();
  try {
    await client.query("BEGIN");

    const { usuario, administrador } = req.body;
   
    // 1. User validation
    console.log("Usuario recibido:", usuario);
    console.log("Admin recibido:", administrador);

    if (!usuario) {
      return res.status(400).json({ error: "Faltan datos del usuario." });
    }
    
    const camposRequeridosUsuario = ["correoElectronico", "contraseña", "nombre"];
    for (const campo of camposRequeridosUsuario) {
      if (!usuario[campo]) {
        return res.status(400).json({ error: `Falta el campo de usuario: ${campo}` });
      }
    }

    // 2. Verify if the email is unique
    const existingUser = await client.query(
      `SELECT * FROM "Usuario" WHERE "correoElectronico" = $1`,
      [usuario.correoElectronico]
    );
    if (existingUser.rows.length > 0) {
      return res.status(400).json({ error: "El correo electrónico ya está registrado." });
    }

    // 3. Hash password
    const hashedPassword = await bcrypt.hash(usuario.contraseña, 10);

    // 4. Insert user into the database
    const insertUsuario = await client.query(
      `INSERT INTO "Usuario" ("correoElectronico", "contraseña", "nombre", "estadoRegistro")
       VALUES ($1, $2, $3, 'pendiente') RETURNING "usuarioId"`,
      [usuario.correoElectronico, hashedPassword, usuario.nombre]
    );

    const usuarioId = insertUsuario.rows[0].usuarioId;
    if (!usuarioId) throw new Error("Error al generar el usuarioId");


    // 6. Insert school into the database
    const insertEscuela = await client.query(
      `INSERT INTO "Administrador" (
          "usuarioId"
       ) VALUES (
         $1
       ) RETURNING *`,
      [
        usuarioId
      ]
    );
    await client.query("COMMIT")
    res.status(201).json({
      mensaje: "Registro exitoso. En espera de aprobación.",
      usuarioId,
      escuela: insertEscuela.rows[0],
    });

  } catch (err) {
    await client.query("ROLLBACK");
    console.error("Error en registro admin:", err);

    const mensajeError = err.message.includes("duplicate")
      ? "El correo ya está registrado"
      : err.message;

    res.status(500).json({
      error: mensajeError,
      detalle: process.env.NODE_ENV === 'development' ? err.message : null
    });
  } finally {
    client.release();
  }
});

module.exports = router;
