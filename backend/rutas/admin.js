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

//obtener informacion de la conexion
router.get("/info/conexion/:conexionId", verifyToken, async(req, res) => {
  // Get the conexionId from URL parameters
  const conexionId = req.params.conexionId;
  console.log("🔍 Buscando conexion con ID:", conexionId);

  try {
    const query = `
    WITH conexion_data AS(
      SELECT 
        json_agg(
          json_build_object(
            'conexionId', c."conexionId",
            'necesidadId', c."necesidadId",
            'apoyoId', c."apoyoId",
            'aliadoId', c."aliadoId",
            'CCT', c."CCT",
            'fechaInicio', c."fechaInicio",
            'fechaFin', c."fechaFin",
            'estado', c."estado",
            'tipoUsuario', CASE
              WHEN pf."CURP" IS NOT NULL THEN 'Aliado de Persona Fisica'
              WHEN pm."RFC" IS NOT NULL THEN 'Aliado de Persona Moral'
              ELSE 'Desconocido'
            END,
            'necesidadNombre', COALESCE(n."nombre", 'No disponible'),
            'apoyoNombre', COALESCE(a."tipo", 'No disponible'),
            'aliadoNombre', COALESCE(u."nombre", 'No disponible'),
            'escuelaNombre', COALESCE(usa."nombre", 'No disponible')
          )
        ) AS conexiones
      FROM "Conexion" c
      LEFT JOIN "Necesidad" n ON c."necesidadId" = n."necesidadId"
      LEFT JOIN "Apoyo" a ON c."apoyoId" = a."apoyoId"
      LEFT JOIN "Aliado" al ON c."aliadoId" = al."aliadoId"
      LEFT JOIN "PersonaFisica" pf ON al."aliadoId" = pf."CURP"
      LEFT JOIN "PersonaMoral" pm ON al."aliadoId" = pm."RFC"
      LEFT JOIN "Usuario" u ON al."usuarioId" = u."usuarioId"
      LEFT JOIN "Escuela" es ON c."CCT" = es."CCT"
      LEFT JOIN "Usuario" usa ON es."usuarioId" = usa."usuarioId"
      WHERE c."conexionId" = $1
    )
    SELECT 
      con.*
    FROM conexion_data con
    `;
    
    console.log("Ejecutando consulta para conexionId:", conexionId);
    const result = await pool.query(query, [conexionId]);
    
    if (result.rows.length === 0 || !result.rows[0].conexiones || result.rows[0].conexiones.length === 0) {
      console.log("No se encontró conexión con ID:", conexionId);
      return res.status(404).json({ 
        error: "Conexión no encontrada",
        details: `No existe registro con conexionId: ${conexionId}`
      });
    }

    // Format data to match frontend expectations
    const responseData = {
      // Return the data directly
      ...result.rows[0]
    };

    console.log("✅ Datos encontrados para conexionId:", conexionId);
    return res.json(responseData);

  } catch (err) {
    console.error("💥 Error en la consulta:", {
      message: err.message,
      stack: err.stack,
      parameters: [conexionId]
    });
    
    return res.status(500).json({ 
      error: "Error en la consulta",
      details: err.message,
      solution: "Verifique que el conexionId exista y tenga formato correcto"
    });
  }
});

//obtener todas las escuelas 
router.get("/todasEscuelas", verifyToken, async (req, res) => {
  try {
    const result = await pool.query(`
      WITH escuela_data AS (
        SELECT json_agg(
          json_build_object(
            'direccion', e."direccion",
            'zonaEscolar', e."zonaEscolar",
            'sectorEscolar', e."sectorEscolar",
            'modalidad', e."modalidad",
            'nivelEducativo', e."nivelEducativo",
            'CCT', e."CCT",
            'tieneUSAER', e."tieneUSAER",
            'numeroDocentes', e."numeroDocentes",
            'estudiantesPorGrupo', e."estudiantesPorGrupo",
            'controlAdministrativo', e."controlAdministrativo",
            'nombre', u."nombre",
            'correoElectronico', u."correoElectronico"
          )
        ) AS informacion
        FROM "Escuela" e
        JOIN "Usuario" u ON e."usuarioId" = u."usuarioId"
        WHERE u."estadoRegistro" = 'aprobado'
      )
      SELECT
        COALESCE(ed.informacion, '[]'::json) as informacion
      FROM escuela_data ed
    `);
    
    console.log("Todas las escuelas");
    
    const escuelas = result.rows[0];
    
    const responseData = {
      informacion: Array.isArray(escuelas.informacion) ? escuelas.informacion : []
    };
    
    return res.json(responseData);
  } catch (err) {
    console.error('Error al obtener perfil de admin:', err);
    return res.status(500).json({ error: 'Error interno del servidor' });
  }
});

//obtener todos los aliados
router.get("/todosAliados", verifyToken, async(req, res) => {
  try {
    const result = await pool.query(`
      WITH aliado_data AS (
        SELECT 
          u."nombre",
          u."correoElectronico",
          CASE
            WHEN a."aliadoId" IS NOT NULL AND pf."CURP" IS NOT NULL THEN 'Aliado de Persona Fisica'
            WHEN a."aliadoId" IS NOT NULL AND pm."RFC" IS NOT NULL THEN 'Aliado de Persona Moral'
            ELSE 'Desconocido'
          END AS "tipoUsuario",
          CASE
            WHEN a."aliadoId" IS NOT NULL AND pf."CURP" IS NOT NULL THEN pf."telefono"
            WHEN a."aliadoId" IS NOT NULL AND pm."RFC" IS NOT NULL THEN pm."telefono"
            ELSE null
          END AS "telefono",
          CASE
            WHEN a."aliadoId" IS NOT NULL AND pf."CURP" IS NOT NULL THEN pf."CURP"
            WHEN a."aliadoId" IS NOT NULL AND pm."RFC" IS NOT NULL THEN pm."RFC"
            ELSE null
          END AS "identificador",
          a."aliadoId"
        FROM "Aliado" a
        LEFT JOIN "Usuario" u ON a."usuarioId" = u."usuarioId"
        LEFT JOIN "PersonaFisica" pf ON a."aliadoId" = pf."CURP"
        LEFT JOIN "PersonaMoral" pm ON a."aliadoId" = pm."RFC"
        WHERE u."estadoRegistro" = 'aprobado'
      )
      SELECT json_agg(
        json_build_object(
          'nombre', ad."nombre",
          'correoElectronico', ad."correoElectronico",
          'tipoUsuario', ad."tipoUsuario",
          'telefono', ad."telefono",
          'identificador', ad."identificador",
          'aliadoId', ad."aliadoId",
          'apoyos', (
            SELECT COALESCE(json_agg(
              json_build_object(
                'tipo', ap."tipo",
                'caracteristicas', ap."caracteristicas"
              )
            ), '[]'::json)
            FROM "Apoyo" ap
            WHERE ap."aliadoId" = ad."aliadoId"
          )
        )
      ) AS informacion
      FROM aliado_data ad
    `);
    
    console.log("Todos los aliados obtenidos");
    
    const aliados = result.rows[0];
    
    const responseData = {
      informacion: aliados.informacion || []
    };
    
    return res.json(responseData);
  } catch (err) {
    console.error('Error al obtener aliados:', err);
    return res.status(500).json({ error: 'Error interno del servidor' });
  }
});

//obtener todos los administradores
router.get("/todosadmin", verifyToken, async(req,res)=>{
  
  try{
    const result = await pool.query(`
    WITH admin_data AS (
      SELECT json_agg(
        json_build_object(
          'id', e."administradorId", 
          'nombre', u."nombre",
          'correoElectronico', u."correoElectronico"
        )
      ) AS informacion
      FROM "Administrador" e
      JOIN "Usuario" u ON e."usuarioId" = u."usuarioId"
      WHERE u."estadoRegistro" = 'aprobado'
    )
    SELECT 
      COALESCE(ed.informacion, '[]'::json) as informacion
    FROM admin_data ed
    `);
    
    const administrador = result.rows[0];
    
    const responseData = {
      informacion: Array.isArray(administrador.informacion) ? administrador.informacion : []
    };
    
    return res.json(responseData);
  } catch (err) {
    console.error('Error al obtener perfil de admin:', err);
    return res.status(500).json({ error: 'Error interno del servidor' });
  }
});

//obtener perfil de otros administradores
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
      console.log("No se encontró escuela con CCT:", CCT);
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

//obtener datos aliado fisicos
router.get("/aliado/fisica/perfil/:aliadoId", verifyToken, async(req,res)=>{
  //se pasa el administradorId
  const aliadoId= req.params.aliadoId;
  console.log("🔍 Buscando aliado de persona fisica con id :", aliadoId);

  try{
    const query=`
    WITH aliado_data AS (
      SELECT 
        u."usuarioId",
        u."nombre",
        u."correoElectronico",
        u."estadoRegistro"
      FROM "Aliado" e
      JOIN "Usuario" u ON e."usuarioId" = u."usuarioId"
      WHERE e."aliadoId" = $1
    ),
    persona_fisica AS(
      SELECT
        "CURP" AS curp_persona,
        "razon" AS razon_persona,
        "correoElectronico" AS correo_persona,
        "telefono" AS telefono_persona
      FROM "PersonaFisica"
      WHERE "CURP" = $1
    ),
    apoyo_data AS(
      SELECT json_agg(
        json_build_object(
          'tipo', a."tipo",
          'caracteristicas', a."caracteristicas"
        )
      ) AS apoyos
      FROM "Apoyo" a
      WHERE a."aliadoId" = $1
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
      JOIN "Aliado" e ON u."usuarioId" = e."usuarioId"
      WHERE e."aliadoId" = $1
    ),
    conexiones_data AS (
      SELECT 
        json_agg(
          json_build_object(
            'id', c."conexionId",
            'necesidadId', c."necesidadId",
            'CCT', c."CCT",
            'apoyoId', c."apoyoId",
            'fechaInicio', c."fechaInicio",
            'fechaFin', c."fechaFin",
            'estado', c."estado",
            'necesidadNombre', COALESCE(n."nombre", 'No disponible'),
            'apoyoNombre', COALESCE(a."tipo", 'No disponible'),
            'escuelaNombre', COALESCE(u."nombre", 'No disponible')
          )
        ) AS conexiones
      FROM "Conexion" c
      LEFT JOIN "Necesidad" n ON c."necesidadId" = n."necesidadId"
      LEFT JOIN "Apoyo" a ON c."apoyoId" = a."apoyoId"
      LEFT JOIN "Escuela" al ON c."CCT" = al."CCT"
      LEFT JOIN "Usuario" u ON al."usuarioId" = u."usuarioId"
      WHERE a."aliadoId" = $1
    )
    SELECT 
      ed.*,
      COALESCE(pf.curp_persona, null) as curp_persona,
      COALESCE(pf.razon_persona, null) as razon_persona,
      COALESCE(pf.correo_persona, null) as correo_persona,
      COALESCE(pf.telefono_persona, null) as telefono_persona,
      COALESCE(ap.apoyos, '[]'::json) as apoyos,
      COALESCE(doc.documentos, '[]'::json) as documentos,
      COALESCE(con.conexiones, '[]'::json) as conexiones
    FROM aliado_data ed
    LEFT JOIN persona_fisica pf ON true
    LEFT JOIN apoyo_data ap ON true
    LEFT JOIN documentos_data doc ON true
    LEFT JOIN conexiones_data con ON true
    `;
    console.log("Ejecutando para ", aliadoId);
    const result= await pool.query(query,[aliadoId]);

    if (result.rows.length === 0) {
      console.log("No se encontró escuela con CCT:", aliadoId);
      return res.status(404).json({ 
        error: "Escuela no encontrada",
        details: `No existe registro con CCT: ${aliadoId}`
      });
  }

  // Process the data for a cleaner structure
  const aliadoF = result.rows[0];
    
  // Format data to match frontend expectations
  const responseData = {
    // Basic school data
    ...aliadoF,
      
    // Persona Fisica information
    persona_fisica: aliadoF.razon_persona ? {
      curp: aliadoF.curp_persona,
      razon: aliadoF.razon_persona,
      correoElectronico: aliadoF.correo_persona,
      telefono: aliadoF.telefono_persona
    } : null,

    apoyos: Array.isArray(aliadoF.apoyos) ? aliadoF.apoyos : [], 
    documentos: Array.isArray(aliadoF.documentos) ? aliadoF.documentos : [],
    conexiones: Array.isArray(aliadoF.conexiones) ? aliadoF.conexiones : []
    
  };

    //remove temporary fields
    delete responseData.curp_persona;
    delete responseData.razon_persona;
    delete responseData.correo_persona;
    delete responseData.telefono_persona;

    console.log("✅ Datos encontrados:", responseData);
    return res.json(responseData);

  } catch (err) {
    console.error("💥 Error en la consulta:", {
      message: err.message,
      stack: err.stack,
      parameters: [aliadoId]
    });
    
    return res.status(500).json({ 
      error: "Error en la consulta",
      details: err.message,
      solution: "Verifique que el aliadoId exista y tenga formato correcto"
    });
  }

});

//obtener informacion de persona moral 
router.get("/aliado/moral/perfil/:aliadoId", verifyToken, async(req,res)=>{
  //se pasa el administradorId
  const aliadoId= req.params.aliadoId;
  console.log("🔍 Buscando aliado de persona moral con id :", aliadoId);

  try{
    const query=`
    WITH aliado_data AS (
      SELECT 
        u."usuarioId",
        u."nombre",
        u."correoElectronico",
        u."estadoRegistro"
      FROM "Aliado" e
      JOIN "Usuario" u ON e."usuarioId" = u."usuarioId"
      WHERE e."aliadoId" = $1
    ),
    persona_moral AS(
      SELECT
        "RFC" AS rfc_persona,
        "area" AS area_persona,
        "correoElectronico" AS correo_persona,
        "telefono" AS telefono_persona
      FROM "PersonaMoral"
      WHERE "RFC" = $1
    ),
    institucion AS(
      SELECT
        "giro" AS giro_institucion,
        "domicilio" AS domicilio_institucion,
        "telefono" AS telefono_institucion,
        "paginaWeb" AS paginaWeb_institucion
      FROM "Institucion"
      WHERE "RFC" = $1
    ),
    escritura_publica AS(
      SELECT
        "numeroEscritura" AS numero_escritura,
        "otorgadaNotario" AS notario_escritura,
        "ciudad" AS ciudad_escritura
      FROM "EscrituraPublica"
      WHERE "RFC" = $1
    ),
    constancia_fisica AS(
      SELECT
        "razonSocial" AS razon_social_constancia,
        "regimen" AS regimen_constancia,
        "domicilio" AS domicilio_constancia
      FROM "ConstanciaFisica"
      WHERE "RFC" = $1
    ),
    representante AS(
      SELECT
        "nombreRep" AS nombre_representante,
        "correoRep" AS correo_representante,
        "telefonoRep" AS telefono_representante,
        "areaRep" AS area_representante
      FROM "Representante"
      WHERE "RFC" = $1
    ),
    apoyo_data AS(
      SELECT json_agg(
        json_build_object(
          'tipo', a."tipo",
          'caracteristicas', a."caracteristicas"
        )
      ) AS apoyos
      FROM "Apoyo" a
      WHERE a."aliadoId" = $1
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
      JOIN "Aliado" e ON u."usuarioId" = e."usuarioId"
      WHERE e."aliadoId" = $1
    ),
    conexiones_data AS (
      SELECT 
        json_agg(
          json_build_object(
            'id', c."conexionId",
            'CCT', c."CCT",
            'necesidadId', c."necesidadId",
            'apoyoId', c."apoyoId",
            'fechaInicio', c."fechaInicio",
            'fechaFin', c."fechaFin",
            'estado', c."estado",
            'necesidadNombre', COALESCE(n."nombre", 'No disponible'),
            'apoyoNombre', COALESCE(a."tipo", 'No disponible'),
            'escuelaNombre', COALESCE(u."nombre", 'No disponible')
          )
        ) AS conexiones
      FROM "Conexion" c
      LEFT JOIN "Necesidad" n ON c."necesidadId" = n."necesidadId"
      LEFT JOIN "Apoyo" a ON c."apoyoId" = a."apoyoId"
      LEFT JOIN "Escuela" al ON c."CCT" = al."CCT"
      LEFT JOIN "Usuario" u ON al."usuarioId" = u."usuarioId"
      WHERE a."aliadoId" = $1
    )
    SELECT 
      ed.*,
      COALESCE(pf.rfc_persona, null) as rfc_persona,
      COALESCE(pf.area_persona, null) as area_persona,
      COALESCE(pf.correo_persona, null) as correo_persona,
      COALESCE(pf.telefono_persona, null) as telefono_persona,
      COALESCE(ins.giro_institucion, null) as giro_institucion,
      COALESCE(ins.domicilio_institucion, null) as domicilio_institucion,
      COALESCE(ins.telefono_institucion, null) as telefono_institucion,
      COALESCE(ins.paginaWeb_institucion, null) as paginaWeb_institucion,
      COALESCE(ep.numero_escritura, null) as numero_escritura,
      COALESCE(ep.notario_escritura, null) as notario_escritura,
      COALESCE(ep.ciudad_escritura, null) as ciudad_escritura,
      COALESCE(cf.razon_social_constancia, null) as razon_social_constancia,
      COALESCE(cf.regimen_constancia, null) as regimen_constancia,
      COALESCE(cf.domicilio_constancia, null) as domicilio_constancia,
      COALESCE(r.nombre_representante, null) as nombre_representante,
      COALESCE(r.correo_representante, null) as correo_representante,
      COALESCE(r.telefono_representante, null) as telefono_representante,
      COALESCE(r.area_representante, null) as area_representante,
      COALESCE(ap.apoyos, '[]'::json) as apoyos,
      COALESCE(doc.documentos, '[]'::json) as documentos,
      COALESCE(con.conexiones, '[]'::json) as conexiones
    FROM aliado_data ed
    LEFT JOIN persona_moral pf ON true
    LEFT JOIN institucion ins ON true
    LEFT JOIN escritura_publica ep ON true
    LEFT JOIN constancia_fisica cf ON true
    LEFT JOIN representante r ON true
    LEFT JOIN apoyo_data ap ON true
    LEFT JOIN documentos_data doc ON true
    LEFT JOIN conexiones_data con ON true
    `;
    console.log("Ejecutando para ", aliadoId);
    const result= await pool.query(query,[aliadoId]);

    if (result.rows.length === 0) {
      console.log("No se encontró escuela con RFC:", aliadoId);
      return res.status(404).json({ 
        error: "Escuela no encontrada",
        details: `No existe registro con RFC: ${aliadoId}`
      });
  }

  // Process the data for a cleaner structure
  const aliadoF = result.rows[0];
    
  // Format data to match frontend expectations
  const responseData = {
    // Basic school data
    ...aliadoF,
      
    // Persona Moral information
    persona_moral: aliadoF.area_persona ? {
      rfc: aliadoF.rfc_persona,
      area: aliadoF.area_persona,
      correoElectronico: aliadoF.correo_persona,
      telefono: aliadoF.telefono_persona
    } : null,

    // Institucion
    institucion: aliadoF.giro_institucion ? {
      giro: aliadoF.giro_institucion,
      domicilio: aliadoF.domicilio_institucion,
      telefono: aliadoF.telefono_institucion,
      paginaWeb: aliadoF.paginaWeb_institucion
    } : null,

    // Escritura
    escritura_publica: aliadoF.numero_escritura ? {
      numero: aliadoF.numero_escritura,
      notario: aliadoF.notario_escritura,
      ciudad: aliadoF.ciudad_escritura
    } : null,

    // Constancia
    constancia_fisica: aliadoF.regimen_constancia ? {
      razonSocial: aliadoF.razon_social_constancia,
      regimen: aliadoF.regimen_constancia,
      domicilio: aliadoF.domicilio_constancia
    } : null,

    // Representante
    representante: aliadoF.correo_representante ? {
      nombre: aliadoF.nombre_representante,
      correo: aliadoF.correo_representante,
      telefono: aliadoF.telefono_representante,
      area: aliadoF.area_representante
    } : null,

    apoyos: Array.isArray(aliadoF.apoyos) ? aliadoF.apoyos : [], 
    documentos: Array.isArray(aliadoF.documentos) ? aliadoF.documentos : [],
    conexiones: Array.isArray(aliadoF.conexiones) ? aliadoF.conexiones : []
    
  };

    //remove temporary fields
    delete responseData.rfc_persona;
    delete responseData.area_persona;
    delete responseData.correo_persona;
    delete responseData.telefono_persona;
    delete responseData.giro_institucion;
    delete responseData.domicilio_institucion;
    delete responseData.telefono_institucion;
    delete responseData.paginaWeb_insitucion;
    delete responseData.numero_escritura;
    delete responseData.notario_escritura;
    delete responseData.ciudad_escritura;
    delete responseData.razon_social_constancia;
    delete responseData.regimen_constancia;
    delete responseData.domicilio_constancia;
    delete responseData.nombre_representante;
    delete responseData.correo_representante;
    delete responseData.telefono_representante;
    delete responseData.area_representante;

    console.log("✅ Datos encontrados:", responseData);
    return res.json(responseData);

  } catch (err) {
    console.error("💥 Error en la consulta:", {
      message: err.message,
      stack: err.stack,
      parameters: [aliadoId]
    });
    
    return res.status(500).json({ 
      error: "Error en la consulta",
      details: err.message,
      solution: "Verifique que el aliadoId exista y tenga formato correcto"
    });
  }

});

//obtener datos de la escuela
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
          'fechaCarga', d."fechaCarga",
          'tipo', d."tipo"
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
            'id', c."conexionId",
            'necesidadId', c."necesidadId",
            'apoyoId', c."apoyoId",
            'aliadoId', c."aliadoId",
            'fechaInicio', c."fechaInicio",
            'fechaFin', c."fechaFin",
            'estado', c."estado",
            'tipoUsuario', CASE
              WHEN pf."CURP" IS NOT NULL THEN 'Aliado de Persona Fisica'
              WHEN pm."RFC" IS NOT NULL THEN 'Aliado de Persona Moral'
              ELSE 'Desconocido'
            END,
            'necesidadNombre', COALESCE(n."nombre", 'No disponible'),
            'apoyoNombre', COALESCE(a."tipo", 'No disponible'),
            'aliadoNombre', COALESCE(u."nombre", 'No disponible')
          )
        ) AS conexiones
      FROM "Conexion" c
      LEFT JOIN "Necesidad" n ON c."necesidadId" = n."necesidadId"
      LEFT JOIN "Apoyo" a ON c."apoyoId" = a."apoyoId"
      LEFT JOIN "Aliado" al ON c."aliadoId" = al."aliadoId"
      LEFT JOIN "PersonaFisica" pf ON al."aliadoId" = pf."CURP"
      LEFT JOIN "PersonaMoral" pm ON al."aliadoId" = pm."RFC"
      LEFT JOIN "Usuario" u ON al."usuarioId" = u."usuarioId"
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
      COALESCE(nd.necesidades, '[]'::json) as necesidades,
      COALESCE(ap.apoyos_previos, '[]'::json) as apoyos_previos,
      COALESCE(td.tramites_gobierno, '[]'::json) as tramites_gobierno,
      COALESCE(doc.documentos, '[]'::json) as documentos,
      COALESCE(con.conexiones, '[]'::json) as conexiones
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
      console.log("No se encontró escuela con CCT:", CCT);
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

//obtener informmacion a partir del identificador
router.get("/administrador/informacion/:id", verifyToken, async (req, res) => {
  const { id } = req.params;
  const { tipoUsuario } = req.query;
  console.log(tipoUsuario);

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
            <p><span class="highlight">Usuario que realizó el cambio:</span> ${nombreAdmin}</p>
            <p>Su usuario en la pagina mi escuela primero ha sido aceptado. ¡Felicidades!</p>
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
        console.error("Error al enviar correo:", error);
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

//eliminar usuario
router.delete('/eliminar', verifyToken, async (req, res) => {
  const { identificador, tipoUsuario } = req.body;
  const client = await pool.connect();
  console.log(identificador)
  const tipoUsuarioLower = tipoUsuario.toLowerCase().trim();

  try {
    await client.query('BEGIN');
    console.log(`Iniciando eliminación en cascada de ${tipoUsuarioLower} con ID: ${identificador}`);
    
    let result;

    switch (tipoUsuarioLower.toLowerCase()) {
      case 'escuela':
        const escuelaData = await client.query(`
          SELECT "usuarioId" FROM "Escuela" WHERE "CCT" = $1
        `, [identificador]);
        if (escuelaData.rows.length === 0) {
          throw new Error('Escuela no encontrada');
        }
        const usuarioIdEscuela = escuelaData.rows[0].usuarioId;

        // Eliminar todo lo relacionado con el CCT
        await client.query(`
          DELETE FROM "Notificacion" 
          WHERE "conexionId" IN (SELECT "conexionId" FROM "Conexion" WHERE "CCT" = $1)
        `, [identificador]);

        await client.query(`
          DELETE FROM "ReporteAvance" 
          WHERE "conexionId" IN (SELECT "conexionId" FROM "Conexion" WHERE "CCT" = $1)
        `, [identificador]);

        await client.query(`
          DELETE FROM "Chat" 
          WHERE "conexionId" IN (SELECT "conexionId" FROM "Conexion" WHERE "CCT" = $1)
        `, [identificador]);

        await client.query(`
          DELETE FROM "Conexion" WHERE "CCT" = $1
        `, [identificador]);

        await client.query(`
          DELETE FROM "Necesidad" WHERE "CCT" = $1
        `, [identificador]);

        await client.query(`
          DELETE FROM "Director" WHERE "CCT" = $1
        `, [identificador]);

        await client.query(`
          DELETE FROM "MesaDirectiva" WHERE "CCT" = $1
        `, [identificador]);

        await client.query(`
          DELETE FROM "Supervisor" WHERE "CCT" = $1
        `, [identificador]);

        await client.query(`
          DELETE FROM "TramiteGobierno" WHERE "CCT" = $1
        `, [identificador]);

        await client.query(`
          DELETE FROM "ApoyoPrevio" WHERE "CCT" = $1
        `, [identificador]);
        
        // Eliminar la escuela
        result = await client.query(`
          DELETE FROM "Escuela" WHERE "CCT" = $1 RETURNING *
        `, [identificador]);

        // Eliminar usuario asociado
        await eliminarUsuarioCascada(client, usuarioIdEscuela);
        break;

      case 'aliado de persona fisica':
        const aliadoFisicoData = await client.query(`
          SELECT "usuarioId" FROM "Aliado" WHERE "aliadoId" = $1
        `, [identificador]);
        if (aliadoFisicoData.rows.length === 0) {
          throw new Error('Aliado persona física no encontrado');
        }
        const usuarioIdAliadoFisico = aliadoFisicoData.rows[0].usuarioId;

        // Eliminar todo lo relacionado con el CURP (aliadoId)
        await client.query(`
          DELETE FROM "Notificacion" 
          WHERE "conexionId" IN (SELECT "conexionId" FROM "Conexion" WHERE "aliadoId" = $1)
        `, [identificador]);

        await client.query(`
          DELETE FROM "ReporteAvance" 
          WHERE "conexionId" IN (SELECT "conexionId" FROM "Conexion" WHERE "aliadoId" = $1)
        `, [identificador]);

    
        await client.query(`
          DELETE FROM "Chat" 
          WHERE "conexionId" IN (SELECT "conexionId" FROM "Conexion" WHERE "aliadoId" = $1)
        `, [identificador]);

        await client.query(`
          DELETE FROM "Conexion" WHERE "aliadoId" = $1
        `, [identificador]);

        await client.query(`
          DELETE FROM "Apoyo" WHERE "aliadoId" = $1
        `, [identificador]);
        
        // Eliminar persona física
        result = await client.query(`
          DELETE FROM "PersonaFisica" WHERE "CURP" = $1 RETURNING *
        `, [identificador]);

        // Eliminar aliado
        await client.query(`
          DELETE FROM "Aliado" WHERE "aliadoId" = $1
        `, [identificador]);

        // Eliminar usuario asociado
        await eliminarUsuarioCascada(client, usuarioIdAliadoFisico);
        break;

      case 'aliado de persona moral':
        const aliadoMoralData = await client.query(`
          SELECT "usuarioId" FROM "Aliado" WHERE "aliadoId" = $1
        `, [identificador]);
        if (aliadoMoralData.rows.length === 0) {
          throw new Error('Aliado persona moral no encontrado');
        }
        const usuarioIdAliadoMoral = aliadoMoralData.rows[0].usuarioId;

        // Eliminar todo lo relacionado con el RFC (aliadoId)
        await client.query(`
          DELETE FROM "Notificacion" 
          WHERE "conexionId" IN (SELECT "conexionId" FROM "Conexion" WHERE "aliadoId" = $1)
        `, [identificador]);

        await client.query(`
          DELETE FROM "ReporteAvance" 
          WHERE "conexionId" IN (SELECT "conexionId" FROM "Conexion" WHERE "aliadoId" = $1)
        `, [identificador]);

        await client.query(`
          DELETE FROM "Chat" 
          WHERE "conexionId" IN (SELECT "conexionId" FROM "Conexion" WHERE "aliadoId" = $1)
        `, [identificador]);

        await client.query(`
          DELETE FROM "Conexion" WHERE "aliadoId" = $1
        `, [identificador]);

        await client.query(`
          DELETE FROM "Apoyo" WHERE "aliadoId" = $1
        `, [identificador]);
        
        // Eliminar relaciones específicas de persona moral
        await client.query(`
          DELETE FROM "Representante" WHERE "RFC" = $1
        `, [identificador]);

        await client.query(`
          DELETE FROM "ConstanciaFisica" WHERE "RFC" = $1
        `, [identificador]);

        await client.query(`
          DELETE FROM "EscrituraPublica" WHERE "RFC" = $1
        `, [identificador]);

        await client.query(`
          DELETE FROM "Institucion" WHERE "RFC" = $1
        `, [identificador]);
        
        // Eliminar persona moral
        result = await client.query(`
          DELETE FROM "PersonaMoral" WHERE "RFC" = $1 RETURNING *
        `, [identificador]);

        // Eliminar aliado
        await client.query(`
          DELETE FROM "Aliado" WHERE "aliadoId" = $1
        `, [identificador]);

        // Eliminar usuario asociado
        await eliminarUsuarioCascada(client, usuarioIdAliadoMoral);
        break;

      case 'administrador':
        const adminData = await client.query(`
          SELECT "usuarioId" FROM "Administrador" WHERE "administradorId" = $1
        `, [identificador]);
        if (adminData.rows.length === 0) {
          throw new Error('Administrador no encontrado');
        }
        const usuarioIdAdmin = adminData.rows[0].usuarioId;

        // Eliminar administrador
        result = await client.query(`
          DELETE FROM "Administrador" WHERE "administradorId" = $1 RETURNING *
        `, [identificador]);

        // Eliminar usuario asociado
        await eliminarUsuarioCascada(client, usuarioIdAdmin);
        break;

      default:
        throw new Error(`Tipo de usuario no válido: ${tipoUsuario}`);
    }

    await client.query('COMMIT');

    res.status(200).json({
      success: true,
      message: `${tipoUsuarioLower} eliminado en cascada correctamente`,
      details: result ? result.rows : null
    });

  } catch (error) {
    await client.query('ROLLBACK');
    console.error('Error en la eliminación en cascada:', error);

    res.status(500).json({
      success: false,
      message: `Error al eliminar ${tipoUsuarioLower} en cascada`,
      error: error.message
    });
  } finally {
    client.release();
  }
});

// Función para el eleiminar usuario
async function eliminarUsuarioCascada(client, usuarioId) {
  await client.query(`
    DELETE FROM "Documento" WHERE "usuarioId" = $1
  `, [usuarioId]);
  
  await client.query(`
    DELETE FROM "Usuario" WHERE "usuarioId" = $1
  `, [usuarioId]);
}

//eliminar conexion 
router.delete('/eliminar-conexion', verifyToken, async (req, res) => {
  const { identificador: conexionId } = req.body;
  const client = await pool.connect();

  try {
    await client.query('BEGIN');
    console.log(`Iniciando eliminación de conexión con ID: ${conexionId}`);

    // Verificar primero si existe la conexión
    const conexionExistente = await client.query(
      'SELECT * FROM "Conexion" WHERE "conexionId" = $1',
      [conexionId]
    );

    if (conexionExistente.rows.length === 0) {
      throw new Error('Conexión no encontrada');
    }

    // Eliminar todos los registros relacionados con la conexión
    await client.query(`
      DELETE FROM "Notificacion" WHERE "conexionId" = $1
    `, [conexionId]);

    await client.query(`
      DELETE FROM "ReporteAvance" WHERE "conexionId" = $1
    `, [conexionId]);

    await client.query(`
      DELETE FROM "Chat" WHERE "conexionId" = $1
    `, [conexionId]);

    const result = await client.query(`
      DELETE FROM "Conexion" WHERE "conexionId" = $1 RETURNING *
    `, [conexionId]);

    await client.query('COMMIT');
    console.log('Eliminación  completada con éxito');

    res.status(200).json({
      success: true,
      message: 'Conexión eliminada correctamente',
      deletedConexion: result.rows[0]
    });

  } catch (error) {
    await client.query('ROLLBACK');
    console.error('Error en la eliminación de conexión:', error);

    res.status(500).json({
      success: false,
      message: 'Error al eliminar la conexión',
      error: error.message
    });
  } finally {
    client.release();
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

function convertType(value, frontType, bdType) {
  if (value === null || value === undefined) return null;

  // Misma idea de tipo, no convierte
  if (frontType === bdType) return value;

  // Convertir según tipos conocidos
  if (frontType === 'bool' && bdType === 'string') {
    return value ? 'true' : 'false';
  }

  if (frontType === 'int' && bdType === 'string') {
    return value.toString();
  }

  if (frontType === 'string' && bdType === 'int') {
    const parsed = parseInt(value);
    if (isNaN(parsed)) throw new Error(`No se puede convertir "${value}" a int`);
    return parsed;
  }

  if (frontType === 'string' && bdType === 'bool') {
    return value.toLowerCase() === 'true';
  }

  // Por defecto, deja el valor igual
  return value;
}

router.put('/update-multiple', verifyToken, async (req, res) => {
  const { cct, data, tipoUsuario } = req.body;
  const client = await pool.connect();
  try {
    await client.query('BEGIN');

    const tipoUsuarioLower = tipoUsuario.toLowerCase().trim();
    console.log(`Tipo de usuario: ${tipoUsuarioLower}, ID: ${cct}`);

    let result;
    let updatedEntities = [];

    switch (tipoUsuarioLower) {
      case 'escuela':
        console.log('Procesando actualización para escuela');
        console.log(data);
        result = await updateEscuela(client, cct, data);
        updatedEntities.push('Escuela');
        await updateUsuario(client, cct, data);
        updatedEntities.push('Usuario');
        await updateDirector(client, cct, data);
        updatedEntities.push('Director');
        await updateSupervisor(client, cct, data);
        updatedEntities.push('Supervisor');
        await updateMesaDirectiva(client, cct, data);
        updatedEntities.push('MesaDirectiva');
        
        break;

      case 'aliado de persona fisica':
        console.log('Procesando actualización para aliado persona física');
        console.log(data);
        result = await updateAliadoFisico(client, cct, data);
        updatedEntities.push('Persona_Fisica');
        await updatePersonaFisica(client, cct, data);
        updatedEntities.push('PersonaFisica');
        
        break;

      case 'aliado de persona moral':
        console.log('Procesando actualización para aliado persona moral');
        console.log(data);
        result = await updateAliadoMoral(client, cct, data);
        updatedEntities.push('Persona_Moral');
        await updatePersonaMoral(client, cct, data);
        updatedEntities.push('PersonaMoral');
        await updateInstitucion(client, cct, data);
        updatedEntities.push('Institucion');
        await updateConstanciaFisica(client, cct, data);
        updatedEntities.push('ConstanciaFisica');
        await updateRepresentante(client, cct, data);
        updatedEntities.push('Representante');
        
        break;

      case 'administrador':
        console.log('Procesando actualización para administrador');
        console.log(data);
        result = await updateAdministrador(client, cct, data);
        updatedEntities.push('Usuario');
        break;

      default:
        throw new Error(`Tipo de usuario no válido: ${tipoUsuario}`);
    }

    await client.query('COMMIT');
    return res.status(200).json({ 
      success: true,
      message: 'Datos actualizados correctamente',
      details: {
        rowsAffected: result?.rowCount || 0,
        updatedEntities
      }
    });

  } catch (error) {
    await client.query('ROLLBACK');
    console.error('Error en la transacción:', error);
    return res.status(500).json({ 
      success: false,
      error: 'Error al actualizar datos',
      details: process.env.NODE_ENV === 'development' ? error.message : null
    });
  } finally {
    client.release();
  }
    });

async function updateEscuela(client, cct, data) {
  const mainTableField = {
    direccion_escuela: {bdName:'direccion', bdType:'string', frontType: 'string'} , 
    zonaEscolar: {bdName:'zonaEscolar', bdType:'string',frontType:'string'},
    sectorEscolar: {bdName:'sectorEscolar', bdType:'string', frontType: 'string'},
    modalidad: {bdName:'modalidad', bdType:'string', frontType: 'string'},
    nivelEducativo: {bdName:'nivelEducativo', bdType:'string', frontType: 'string'},
    tieneUSAER: {bdName:'tieneUSAER', bdType:'string', frontType: 'string'},
    numeroDocentes: {bdName:'numeroDocentes', bdType:'integer', frontType: 'integer'},
    estudiantesPorGrupo: {bdName:'estudiantesPorGrupo', bdType:'integer', frontType: 'integer'},
    controlAdministrativo: {bdName:'controlAdministrativo', bdType:'string', frontType: 'string'}
  };

  const validFields = {};
  for (const [frontendField, fieldvalues] of Object.entries(mainTableField)) {
    if (data[frontendField] !== undefined) {
      validFields[fieldvalues.bdName] = convertType(data[frontendField],fieldvalues.frontType,fieldvalues.bdType); 
    }
  }
  console.log('checking info for query escuela')
  console.log(validFields)

  if (Object.keys(validFields).length > 0) {
    await client.query(
      `UPDATE "Escuela" 
      SET ${Object.keys(validFields).map((f, i) => `"${f}" = $${i + 1}`).join(', ')}
      WHERE "CCT" = $${Object.keys(validFields).length + 1}`,
      [...Object.values(validFields), cct]
    );
  }

return { rowCount: 1 };
}

async function updateUsuario(client, cct, data) {
  const mainTableField = {
    estadoRegistro_escuela: {bdName:'estadoRegistro', bdType:'string', frontType: 'string'} 
    };

  const validFields = {};
  for (const [frontendField, fieldvalues] of Object.entries(mainTableField)) {
    if (data[frontendField] !== undefined) {
      validFields[fieldvalues.bdName] = convertType(data[frontendField],fieldvalues.frontType,fieldvalues.bdType); 
    }
  }
  console.log('checking info for query usuario')
  console.log(validFields)

  if (Object.keys(validFields).length > 0) {
    await client.query(
      `UPDATE "Usuario"
      SET ${Object.keys(validFields).map((f, i) => `"${f}" = $${i + 1}`).join(', ')}
      where "usuarioId" = (
        select u."usuarioId"
        from "Usuario" u
        inner join "Escuela" e on u."usuarioId" = e."usuarioId"
        WHERE e."CCT" = $${Object.keys(validFields).length + 1}
        limit 1)`,
      [...Object.values(validFields), cct]
    );
  }

return { rowCount: 1 };
}

async function updateDirector(client, cct, data) {
  const fieldMap = {
    director_nombre: {bdName:'nombre', bdType:'string', frontType: 'string'} ,
    director_correoElectronico: {bdName:'correoElectronico', bdType:'string', frontType: 'string'} , 
    director_telefono: {bdName:'telefono', bdType:'string',frontType:'string'},
    directo_posibleCambioPlantel: {bdName:'sectorEscolar', bdType:'string', frontType: 'boolean'},
    };

    const validFields = {};
    for (const [frontendField, fieldvalues] of Object.entries(fieldMap)) {
      if (data[frontendField] !== undefined) {
        validFields[fieldvalues.bdName] = convertType(data[frontendField],fieldvalues.frontType,fieldvalues.bdType); 
      }
    }
    console.log("dentro director: ", data)
    console.log('checking info for query director')
    console.log(validFields)

  if (Object.keys(validFields).length > 0) {
      await client.query(
        `UPDATE "Director" 
        SET ${Object.keys(validFields).map((f, i) => `"${f}" = $${i + 1}`).join(', ')}
        WHERE "CCT" = $${Object.keys(validFields).length + 1}`,
        [...Object.values(validFields), cct]
      );
    }
  return { rowCount: 1 };
}

async function updateSupervisor(client, cct, data) {
  const fieldMap = {
    supervisor_nombre:  {bdName:'nombre', bdType:'string', frontType: 'string'} ,
    supervisor_medioContacto:  {bdName:'medioContacto', bdType:'string', frontType: 'string'} ,
    supervisor_antiguedadZona:  {bdName:'antiguedadZona', bdType:'integer', frontType: 'integer'} ,
    supervisor_correoElectronico:  {bdName:'correoElectronico', bdType:'string', frontType: 'string'} ,
    supervisor_telefono:  {bdName:'telefono', bdType:'string', frontType: 'string'},
    supervisor_posibleCambioZona :  {bdName:'posibleCambioZona', bdType:'string', frontType: 'boolean'}  
  };
  const validFields = {};
    for (const [frontendField, fieldvalues] of Object.entries(fieldMap)) {
      if (data[frontendField] !== undefined) {
        validFields[fieldvalues.bdName] = convertType(data[frontendField],fieldvalues.frontType,fieldvalues.bdType); 
      }
    }
    console.log("dentro supervisor: ", data)
    console.log('checking info for query supervisor')
    console.log(validFields)

  if (Object.keys(validFields).length > 0) {
      await client.query(
        `UPDATE "Supervisor" 
        SET ${Object.keys(validFields).map((f, i) => `"${f}" = $${i + 1}`).join(', ')}
        WHERE "CCT" = $${Object.keys(validFields).length + 1}`,
        [...Object.values(validFields), cct]
      );
    }
  return { rowCount: 1 };
}

async function updateMesaDirectiva(client, cct, data) {
  const mainTableField = {
    mesaDirectiva_personasCantidad: {bdName:'personasCantidad', bdType:'integer', frontType: 'integer'} 
    };

  const validFields = {};
  for (const [frontendField, fieldvalues] of Object.entries(mainTableField)) {
    if (data[frontendField] !== undefined) {
      validFields[fieldvalues.bdName] = convertType(data[frontendField],fieldvalues.frontType,fieldvalues.bdType); 
    }
  }
  console.log('checking info for mesa directiva')
  console.log(validFields)

  if (Object.keys(validFields).length > 0) {
    await client.query(
      `UPDATE "MesaDirectiva" 
      SET ${Object.keys(validFields).map((f, i) => `"${f}" = $${i + 1}`).join(', ')}
      where "CCT" = $${Object.keys(validFields).length + 1}`,
      [...Object.values(validFields), cct]
    );
  }
}
//para aliado fisico
async function updateAliadoFisico(client, curp, data) {
  const mainTableField = {
    estadoRegistro_aliado_fisico: {bdName:'estadoRegistro', bdType:'string', frontType: 'string'} 
    };

    const validFields = {};
    const usedFields = {};
  for (const [frontendField, fieldvalues] of Object.entries(mainTableField)) {
    if (data[frontendField] !== undefined) {
      usedFields[frontendField]= data[frontendField]
      validFields[fieldvalues.bdName] = convertType(data[frontendField],fieldvalues.frontType,fieldvalues.bdType); 
    }
  }
  console.log('checking info for query aliado fisico')
  console.log(validFields)

  if (Object.keys(validFields).length > 0) {
    await client.query(
      `UPDATE "Usuario"
      SET ${Object.keys(validFields).map((f, i) => `"${f}" = $${i + 1}`).join(', ')}
      where "usuarioId" = (
        select u."usuarioId"
        from "Usuario" u
        inner join "Aliado" e on u."usuarioId" = e."usuarioId"
        WHERE e."aliadoId" = $${Object.keys(validFields).length + 1}
        limit 1)`,
      [...Object.values(validFields), curp]
    );
  }
  return usedFields;
}
async function updatePersonaFisica(client, curp, data) {
  const fieldMap = {
    razon_persona_fisica:{bdName:'razon', bdType:'string', frontType: 'string'} ,
    correo_persona_fisica:  {bdName:'correoElectronico', bdType:'string', frontType: 'string'} ,
    telefono_persona_fisica:  {bdName:'telefono', bdType:'string', frontType: 'string'} 
    };
  const validFields = {};
    for (const [frontendField, fieldvalues] of Object.entries(fieldMap)) {
      if (data[frontendField] !== undefined) {
        validFields[fieldvalues.bdName] = convertType(data[frontendField],fieldvalues.frontType,fieldvalues.bdType); 
      }
    }
    console.log('checking info for query persona fisica')
    console.log(validFields)

  if (Object.keys(validFields).length > 0) {
      await client.query(
        `UPDATE "PersonaFisica" 
        SET ${Object.keys(validFields).map((f, i) => `"${f}" = $${i + 1}`).join(', ')}
        WHERE "CURP" = $${Object.keys(validFields).length + 1}`,
        [...Object.values(validFields), curp]
      );
    }
  return { rowCount: 1 };
}
//para aliado moral
async function updateAliadoMoral(client, rfc, data) {
  const mainTableField = {
    estadoRegistro_moral: {bdName:'estadoRegistro', bdType:'string', frontType: 'string'} 
    };

  const validFields = {};
  for (const [frontendField, fieldvalues] of Object.entries(mainTableField)) {
    if (data[frontendField] !== undefined) {
      validFields[fieldvalues.bdName] = convertType(data[frontendField],fieldvalues.frontType,fieldvalues.bdType); 
    }
  }
  console.log('checking info for query aliado moral')
  console.log(validFields)

  if (Object.keys(validFields).length > 0) {
    await client.query(
      `UPDATE "Usuario"
      SET ${Object.keys(validFields).map((f, i) => `"${f}" = $${i + 1}`).join(', ')}
      where "usuarioId" = (
        select u."usuarioId"
        from "Usuario" u
        inner join "Aliado" e on u."usuarioId" = e."usuarioId"
        WHERE e."aliadoId" = $${Object.keys(validFields).length + 1}
        limit 1)`,
      [...Object.values(validFields), rfc]
    );
  }
  return { rowCount: 1 };
}
async function updatePersonaMoral(client, rfc, data) {
  const fieldMap = {
    area_persona_moral:{bdName:'area', bdType:'string', frontType: 'string'} ,
    correo_persona_moral:  {bdName:'correoElectronico', bdType:'string', frontType: 'string'} ,
    telefono_persona_moral:  {bdName:'telefono', bdType:'string', frontType: 'string'} 
    };
  const validFields = {};
    for (const [frontendField, fieldvalues] of Object.entries(fieldMap)) {
      if (data[frontendField] !== undefined) {
        validFields[fieldvalues.bdName] = convertType(data[frontendField],fieldvalues.frontType,fieldvalues.bdType); 
      }
    }
    console.log('checking info for query persona moral')
    console.log(validFields)

  if (Object.keys(validFields).length > 0) {
      await client.query(
        `UPDATE "PersonaMoral" 
        SET ${Object.keys(validFields).map((f, i) => `"${f}" = $${i + 1}`).join(', ')}
        WHERE "RFC" = $${Object.keys(validFields).length + 1}`,
        [...Object.values(validFields), rfc]
      );
    }
  return { rowCount: 1 };
}
async function updateInstitucion(client, rfc, data) {
  const fieldMap = {
    giro_institucion:{bdName:'giro', bdType:'string', frontType: 'string'} ,
    domicilio_institucion:  {bdName:'domicilio', bdType:'string', frontType: 'string'} ,
    telefono_institucion:  {bdName:'telefono', bdType:'string', frontType: 'string'},
    paginaWeb_institucion:  {bdName:'paginaWeb', bdType:'string', frontType: 'string'} 
    };
  const validFields = {};
    for (const [frontendField, fieldvalues] of Object.entries(fieldMap)) {
      if (data[frontendField] !== undefined) {
        validFields[fieldvalues.bdName] = convertType(data[frontendField],fieldvalues.frontType,fieldvalues.bdType); 
      }
    }
    console.log('checking info for query insitucion')
    console.log(validFields)

  if (Object.keys(validFields).length > 0) {
      await client.query(
        `UPDATE "Institucion" 
        SET ${Object.keys(validFields).map((f, i) => `"${f}" = $${i + 1}`).join(', ')}
        WHERE "RFC" = $${Object.keys(validFields).length + 1}`,
        [...Object.values(validFields), rfc]
      );
    }
  return { rowCount: 1 };
}
async function updateConstanciaFisica(client, rfc, data) {
  const fieldMap = {
    razon_social_constancia:{bdName:'razonSocial', bdType:'string', frontType: 'string'},
    regimen_constancia:{bdName:'regimen', bdType:'string', frontType: 'string'} ,
    domicilio_constancia:  {bdName:'domicilio', bdType:'string', frontType: 'string'} 
    };
  const validFields = {};
    for (const [frontendField, fieldvalues] of Object.entries(fieldMap)) {
      if (data[frontendField] !== undefined) {
        validFields[fieldvalues.bdName] = convertType(data[frontendField],fieldvalues.frontType,fieldvalues.bdType); 
      }
    }
    console.log('checking info for query constancia fisica')
    console.log(validFields)

  if (Object.keys(validFields).length > 0) {
      await client.query(
        `UPDATE "ConstanciaFisica" 
        SET ${Object.keys(validFields).map((f, i) => `"${f}" = $${i + 1}`).join(', ')}
        WHERE "RFC" = $${Object.keys(validFields).length + 1}`,
        [...Object.values(validFields), rfc]
      );
    }
  return { rowCount: 1 };
}
async function updateRepresentante(client, rfc, data) {
  const fieldMap = {
    nombre_representante:{bdName:'nombreRep', bdType:'string', frontType: 'string'} ,
    area_representante:{bdName:'areaRep', bdType:'string', frontType: 'string'} ,
    correo_representante:  {bdName:'correoRep', bdType:'string', frontType: 'string'} ,
    telefono_representante:  {bdName:'telefonoRep', bdType:'string', frontType: 'string'} 
    };
  const validFields = {};
    for (const [frontendField, fieldvalues] of Object.entries(fieldMap)) {
      if (data[frontendField] !== undefined) {
        validFields[fieldvalues.bdName] = convertType(data[frontendField],fieldvalues.frontType,fieldvalues.bdType); 
      }
    }
    console.log('checking info for query representante')
    console.log(validFields)

  if (Object.keys(validFields).length > 0) {
      await client.query(
        `UPDATE "Representante" 
        SET ${Object.keys(validFields).map((f, i) => `"${f}" = $${i + 1}`).join(', ')}
        WHERE "RFC" = $${Object.keys(validFields).length + 1}`,
        [...Object.values(validFields), rfc]
      );
    }
  return { rowCount: 1 };
}

//para administrador
async function updateAdministrador(client, adminId, data) {
  console.log("dentro: ", data);
  const mainTableField = {
    estadoRegistro_admin: {bdName:'estadoRegistro', bdType:'string', frontType: 'string'} 
    };

  console.log("original: ", mainTableField);
  const validFields = {};
  for (const [frontendField, fieldvalues] of Object.entries(mainTableField)) {
    if (data[frontendField] !== undefined) {
      validFields[fieldvalues.bdName] = convertType(data[frontendField],fieldvalues.frontType,fieldvalues.bdType); 
    }
  }
  console.log('checking info for query admin')
  console.log(validFields)

  if (Object.keys(validFields).length > 0) {
    await client.query(
      `UPDATE "Usuario"
      SET ${Object.keys(validFields).map((f, i) => `"${f}" = $${i + 1}`).join(', ')}
      where "usuarioId" = (
        select u."usuarioId"
        from "Usuario" u
        inner join "Administrador" e on u."usuarioId" = e."usuarioId"
        WHERE e."administradorId" = $${Object.keys(validFields).length + 1}
        limit 1)`,
      [...Object.values(validFields), adminId]
    );
  }

return { rowCount: 1 };
}

module.exports = router;
