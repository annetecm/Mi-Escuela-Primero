import "../styles/EditSchool.css"; // Ahora usa su propio CSS
import { useNavigate } from "react-router-dom";
import niñosImg from "../assets/niños.png";
import { useState, useEffect } from "react";

function EditSchool() {
  const navigate = useNavigate();

  const [formData, setFormData] = useState({
    usuario: {
      correoElectronico: "",
      contraseña: "",
      nombre: ""
    },
    escuela: {
       direccion: {
        calleNumero: "",
        colonia: "",
        municipio: ""
      },
      sostenimiento: "estatal",
      zonaEscolar: "",
      sectorEscolar: "",
      modalidad: "general",
      nivelEducativo: "",
      CCT: "",
      tieneUSAER: "",
      numeroDocentes: "",
      estudiantesPorGrupo: "",
      controlAdministrativo: "",
      director: {
        nombre: "",
        correoElectronico: "",
        telefono: "",
        fechaJubilacion: "",
        posibleCambioPlantel: "",
    
      },
      supervisor: {
        nombre: "",
        correoElectronico: "",
        telefono: "",
        fechaJubilacion: "",
        posibleCambioZona: "",
        medioContacto: "whatsapp",
      },
      mesaDirectiva: {
        personasCantidad: ""
      },
      apoyoPrevio: {
        gobiernoMunicipal: { nombre: "", descripcion: "" },
        gobiernoEstatal: { nombre: "", descripcion: "" },
        gobiernoFederal: { nombre: "", descripcion: "" },
        institucionesEducativas: { nombre: "", descripcion: "" },
        osc: { nombre: "", descripcion: "" },
        empresas: { nombre: "", descripcion: "" },
        programas: { nombre: "", descripcion: "" }
      }
      
    },
    

    

    

    
  
  });
  const [tramitePendiente, setTramitePendiente] = useState("");
const [datosTramite, setDatosTramite] = useState({
  cual: "",
  nivelGobierno: "",
  instancia: "",
  folio: ""
});


  useEffect(() => {
    const token = localStorage.getItem("token");
    if (!token) return;

    fetch("http://localhost:5000/api/escuela/editar-perfil", {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    })
      .then((res) => res.json())
      .then((data) => {
        setFormData((prev) => ({
          ...prev,
          ...data, // Ajusta los nombres si los datos vienen distintos
        }));
      })
      .catch((err) => console.error("Error al cargar perfil:", err));
  }, []);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    const keys = name.split(".");

    setFormData((prevData) => {
      let updatedData = { ...prevData };
      let nested = updatedData;

      for (let i = 0; i < keys.length - 1; i++) {
        if (!nested[keys[i]]) nested[keys[i]] = {};
        nested = nested[keys[i]];
      }

      nested[keys[keys.length - 1]] = value;

      return updatedData;
    });
  };


  const handleSubmit = async (e) => {
    e.preventDefault();
    const token = localStorage.getItem("token");
  
    const finalFormData = {
      ...formData,
      tramitePendiente: tramitePendiente,
      datosTramite: tramitePendiente === "si" ? datosTramite : null,
    };
  
    try {
      const response = await fetch("http://localhost:5000/api/escuela/editar", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify(finalFormData),
      });
  
      if (!response.ok) throw new Error("Error al actualizar información");
      alert("Información actualizada exitosamente.");
      navigate("/escuela/perfil");
    } catch (error) {
      console.error("Error:", error);
      alert("Hubo un problema al actualizar la información.");
    }
  };
  

  return (
    <div className="school-container">
      <div className="school-image-section">
        <img src={niñosImg || "/placeholder.svg"} alt="Niños" />
      </div>
      <div className="school-form-section">
        <h1 className="school-title">Edita tu información</h1>
        <p className="school-label">Ingresa tu información actualizada</p>

        <form onSubmit={handleSubmit} className="school-scroll">
           {/* Sección de credenciales */}
<div className="form-grid">
  <div className="form-group">
    <label>Correo</label>
    <input 
      className="form-input" 
      type="text"
      name="usuario.correoElectronico"
      value={formData.usuario.correoElectronico}
      onChange={handleInputChange}
    />
  </div>
  <div className="form-group">
    <label>Contraseña</label>
    <input 
      className="form-input" 
      type="password" 
      name="usuario.contraseña"
      value={formData.usuario.contraseña}
      onChange={handleInputChange}
    />
  </div>
</div>

{/* Sección de datos de la escuela */}
<div className="heading">DATOS DE LA ESCUELA</div>
<div className="form-grid">
  <div className="form-group">
    <label>Nombre de la escuela</label>
    <input 
      className="form-input" 
      type="text"
      name="usuario.nombre"
      value={formData.usuario.nombre}
      onChange={handleInputChange} 
    />
  </div>
  <div className="form-group">
    <label>Clave CCT</label>
    <input 
      className="form-input"
      type="text" 
      name="escuela.CCT"
      value={formData.escuela.CCT}
      onChange={handleInputChange}
    />
  </div>
  <div className="form-group">
    <label>Nivel Educativo</label>
    <input 
      className="form-input"
      type="text"
      name="escuela.nivelEducativo" 
      value={formData.escuela.nivelEducativo}
      onChange={handleInputChange}
    />
  </div>
  <div className="form-group">
    <label htmlFor="modalidad">Modalidad</label>
    <select 
      id="modalidad" 
      className="form-input"
      name="escuela.modalidad"
      value={formData.escuela.modalidad}
      onChange={handleInputChange}
    >
      <option value="general">General</option>
      <option value="comunitaria">Comunitaria</option>
      <option value="indigena">Indígena</option>
      <option value="general_multigrado">General multigrado</option>
    </select>
  </div>
  <div className="form-group">
    <label>Control administrativo</label>
    <input 
      className="form-input" 
      type="text" 
      name="escuela.controlAdministrativo"
      value={formData.escuela.controlAdministrativo}
      onChange={handleInputChange}
    />
  </div>
  <div className="form-group">
    <label htmlFor="sostenimiento">Sostenimiento</label>
    <select 
      id="sostenimiento" 
      className="form-input"
      name="escuela.sostenimiento"
      value={formData.escuela.sostenimiento}
      onChange={handleInputChange}
    >
      <option value="estatal">Estatal</option>
      <option value="federal">Federal</option>
    </select>
  </div>
  <div className="form-group">
    <label>Zona escolar</label>
    <input 
      className="form-input" 
      type="text"
      name="escuela.zonaEscolar"
      value={formData.escuela.zonaEscolar}
      onChange={handleInputChange}
    />
  </div>
  <div className="form-group">
    <label>Sector escolar</label>
    <input 
      className="form-input" 
      type="text"
      name="escuela.sectorEscolar"
      value={formData.escuela.sectorEscolar}
      onChange={handleInputChange}
    />
  </div>
</div>

{/* Sección de dirección */}
<p className="special-label">Dirección</p>
<div className="form-grid">
  <div className="form-group">
    <label>Calle y número</label>
    <input 
      className="form-input" 
      type="text" 
      name="escuela.direccion.calleNumero"
      value={formData.escuela.direccion.calleNumero}
      onChange={handleInputChange}
    />
  </div>
  <div className="form-group">
    <label>Colonia</label>
    <input 
      className="form-input"
      type="text" 
      name="escuela.direccion.colonia"
      value={formData.escuela.direccion.colonia}
      onChange={handleInputChange}
    />
  </div>
  <div className="form-group">
    <label>Municipio</label>
    <input 
      className="form-input" 
      type="text" 
      name="escuela.direccion.municipio"
      value={formData.escuela.direccion.municipio}
      onChange={handleInputChange}
    />
  </div>
</div>
{/* Sección de datos del director */}
<div className="heading">DATOS DE CONTACTO CON EL/LA DIRECTOR/A</div>
<div className="form-single-column">
  <div className="form-group">
    <label>Nombre del director(a)</label>
    <input 
      className="form-input" 
      type="text" 
      name="escuela.director.nombre"
      value={formData.escuela.director.nombre}
      onChange={handleInputChange}
    />
  </div>
  <div className="form-group">
    <label>Número celular</label>
    <input
      className="form-input" 
      type="text"
      name="escuela.director.telefono"
      value={formData.escuela.director.telefono}
      onChange={handleInputChange}
    />
  </div>
  <div className="form-group">
    <label>Correo</label>
    <input 
      className="form-input" 
      type="text" 
      name="escuela.director.correoElectronico"
      value={formData.escuela.director.correoElectronico}
      onChange={handleInputChange}
    />
  </div>
  
  <div className="form-group">
    <label>¿Está próximo a jubilarse? Si sí, ¿cuándo?</label>
    <input 
      className="form-input" 
      type="date" 
      name="escuela.director.fechaJubilacion"
      value={(formData.escuela.director.fechaJubilacion || "").split("T")[0]}
      onChange={handleInputChange}
    />
  </div>
  <div className="form-group">
  <label>¿Ha solicitado cambio de escuela?</label>
  <select
    className="form-input"
    name="escuela.director.posibleCambioPlantel"
    value={formData.escuela.director.posibleCambioPlantel}
    onChange={handleInputChange}
  >
    <option value="">Seleccionar</option>
    <option value="Si">Si</option>
    <option value="No">No</option>
  </select>
</div>

</div>

{/* Sección de datos del supervisor */}
<div className="heading">DATOS DE CONTACTO CON EL/LA SUPERVISOR/A</div>
<div className="form-single-column">
  <div className="form-group">
    <label>Nombre del supervisor(a)</label>
    <input
      className="form-input"
      type="text"
      name="escuela.supervisor.nombre"
      value={formData.escuela.supervisor.nombre}
      onChange={handleInputChange}
    />
  </div>
  <div className="form-group">
    <label>Número celular</label>
    <input
      className="form-input"
      type="text"
      name="escuela.supervisor.telefono"
      value={formData.escuela.supervisor.telefono}
      onChange={handleInputChange}
    />
  </div>
  <div className="form-group">
    <label>Correo</label>
    <input
      className="form-input"
      type="text"
      name="escuela.supervisor.correoElectronico"
      value={formData.escuela.supervisor.correoElectronico}
      onChange={handleInputChange}
    />
  </div>
  <div className="form-group">
    <label htmlFor="medio-preferido">Medio preferido de contacto</label>
    <select
      id="medio-preferido"
      className="form-input"
      name="escuela.supervisor.medioContacto"
      value={formData.escuela.supervisor.medioContacto}
      onChange={handleInputChange}
    >
      <option value="whatsapp">Whatsapp</option>
      <option value="correo">Correo</option>
    </select>
  </div>
  <div className="form-group">
    <label>¿Cuántos años lleva en ese puesto en esa zona?</label>
    <input
      className="form-input"
      type="text"
      name="escuela.supervisor.antiguedadZona"
      value={formData.escuela.supervisor.antiguedadZona}
      onChange={handleInputChange}
    />
  </div>
  <div className="form-group">
    <label>¿Está próximo a jubilarse? Si sí, ¿cuándo?</label>
    <input
      className="form-input"
      type="date"
      name="escuela.supervisor.fechaJubilacion"
      value={(formData.escuela.supervisor.fechaJubilacion || "").split("T")[0]}
      onChange={handleInputChange}
    />
  </div>
  <div className="form-group">
  <label>¿Ha solicitado cambio de zona?</label>
  <select
    className="form-input"
    name="escuela.supervisor.posibleCambioZona"
    value={formData.escuela.supervisor.posibleCambioZona}
    onChange={handleInputChange}
  >
    <option value="">Seleccionar</option>
    <option value="Si">Si</option>
    <option value="No">No</option>
  </select>
</div>
</div>

{/* Sección de datos del ciclo escolar */}
<div className="heading">DATOS DE LA ESCUELA CICLO 2024-2025</div>
<div className="form-single-column">
  <div className="form-group">
    <label>Número de estudiantes por grupo (en promedio)</label>
    <input
      className="form-input"
      type="text"
      name="escuela.estudiantesPorGrupo"
      value={formData.escuela.estudiantesPorGrupo}
      onChange={handleInputChange}
    />
  </div>
  <div className="form-group">
    <label>Número de docentes frente a grupo</label>
    <input
      className="form-input"
      type="text"
      name="escuela.numeroDocentes"
      value={formData.escuela.numeroDocentes}
      onChange={handleInputChange}
    />
  </div>

  <div className="form-group">
  <label>¿Cuentan con USAER?</label>
  <select
    className="form-input"
    name="escuela.tieneUSAER"
    value={formData.escuela.tieneUSAER}
    onChange={handleInputChange}
  >
    <option value="">Seleccionar</option>
    <option value="Si">Si</option>
    <option value="No">No</option>
  </select>
  </div>
  <div className="form-group">
    <label>
      ¿Cuentan con mesa de padres de familia? Si sí, ¿por cuántas personas está conformada?
    </label>
    <input
      className="form-input"
      type="text"
      name="escuela.mesaDirectiva.personasCantidad"
      value={formData.escuela.mesaDirectiva.personasCantidad}
      onChange={handleInputChange}
    />
  </div>
 
  <div className="heading">APOYOS RECIBIDOS EN LOS ÚLTIMOS DOS CICLOS ESCOLARES</div>

{/* Gobierno Municipal */}
<div className="form-group">
  <label>En los últimos dos ciclos escolares, ¿han recibido apoyo del Gobierno Municipal?</label>
  <div className="form-subgroup">
    <label>¿Qué instancia o dependencia?</label>
    <input
      className="form-input"
      type="text"
      name="escuela.apoyoPrevio.gobiernoMunicipal.nombre"
      value={formData.escuela?.apoyoPrevio?.gobiernoMunicipal?.nombre || ""}
      onChange={handleInputChange}
    />
  </div>
  <div className="form-subgroup">
    <label>¿Qué apoyo se recibió?</label>
    <input
      className="form-input"
      type="text"
      name="escuela.apoyoPrevio.gobiernoMunicipal.descripcion"
      value={formData.escuela?.apoyoPrevio?.gobiernoMunicipal?.descripcion || ""}
      onChange={handleInputChange}
    />
  </div>
</div>

{/* Gobierno Estatal */}
<div className="form-group">
  <label>En los últimos dos ciclos escolares, ¿han recibido apoyo del Gobierno Estatal?</label>
  <div className="form-subgroup">
    <label>¿Qué instancia o dependencia?</label>
    <input
      className="form-input"
      type="text"
      name="escuela.apoyoPrevio.gobiernoEstatal.nombre"
      value={formData.escuela?.apoyoPrevio?.gobiernoEstatal?.nombre || ""}
      onChange={handleInputChange}
    />
  </div>
  <div className="form-subgroup">
    <label>¿Qué apoyo se recibió?</label>
    <input
      className="form-input"
      type="text"
      name="escuela.apoyoPrevio.gobiernoEstatal.descripcion"
      value={formData.escuela?.apoyoPrevio?.gobiernoEstatal?.descripcion || ""}
      onChange={handleInputChange}
    />
  </div>
</div>

{/* Gobierno Federal */}
<div className="form-group">
  <label>En los últimos dos ciclos escolares, ¿han recibido apoyo del Gobierno Federal?</label>
  <div className="form-subgroup">
    <label>¿Qué instancia o dependencia?</label>
    <input
      className="form-input"
      type="text"
      name="escuela.apoyoPrevio.gobiernoFederal.nombre"
      value={formData.escuela?.apoyoPrevio?.gobiernoFederal?.nombre || ""}
      onChange={handleInputChange}
    />
  </div>
  <div className="form-subgroup">
    <label>¿Qué apoyo se recibió?</label>
    <input
      className="form-input"
      type="text"
      name="escuela.apoyoPrevio.gobiernoFederal.descripcion"
      value={formData.escuela?.apoyoPrevio?.gobiernoFederal?.descripcion || ""}
      onChange={handleInputChange}
    />
  </div>
</div>

{/* Instituciones Educativas */}
<div className="form-group">
  <label>En los últimos dos ciclos escolares, ¿han recibido apoyo de Instituciones Educativas?</label>
  <div className="form-subgroup">
    <label>¿Qué institución?</label>
    <input
      className="form-input"
      type="text"
      name="escuela.apoyoPrevio.institucionesEducativas.nombre"
      value={formData.escuela?.apoyoPrevio?.institucionesEducativas?.nombre || ""}
      onChange={handleInputChange}
    />
  </div>
  <div className="form-subgroup">
    <label>¿Qué apoyo se recibió?</label>
    <input
      className="form-input"
      type="text"
      name="escuela.apoyoPrevio.institucionesEducativas.descripcion"
      value={formData.escuela?.apoyoPrevio?.institucionesEducativas?.descripcion || ""}
      onChange={handleInputChange}
    />
  </div>
</div>

{/* Organizaciones de la Sociedad Civil */}
<div className="form-group">
  <label>En los últimos dos ciclos escolares, ¿han recibido apoyo de Organizaciones de la sociedad civil?</label>
  <div className="form-subgroup">
    <label>¿Qué organización?</label>
    <input
      className="form-input"
      type="text"
      name="escuela.apoyoPrevio.osc.nombre"
      value={formData.escuela?.apoyoPrevio?.osc?.nombre || ""}
      onChange={handleInputChange}
    />
  </div>
  <div className="form-subgroup">
    <label>¿Qué apoyo se recibió?</label>
    <input
      className="form-input"
      type="text"
      name="escuela.apoyoPrevio.osc.descripcion"
      value={formData.escuela?.apoyoPrevio?.osc?.descripcion || ""}
      onChange={handleInputChange}
    />
  </div>
</div>

{/* Empresas */}
<div className="form-group">
  <label>En los últimos dos ciclos escolares, ¿han recibido apoyo de Empresas?</label>
  <div className="form-subgroup">
    <label>¿Qué empresa?</label>
    <input
      className="form-input"
      type="text"
      name="escuela.apoyoPrevio.empresas.nombre"
      value={formData.escuela?.apoyoPrevio?.empresas?.nombre || ""}
      onChange={handleInputChange}
    />
  </div>
  <div className="form-subgroup">
    <label>¿Qué apoyo se recibió?</label>
    <input
      className="form-input"
      type="text"
      name="escuela.apoyoPrevio.empresas.descripcion"
      value={formData.escuela?.apoyoPrevio?.empresas?.descripcion || ""}
      onChange={handleInputChange}
    />
  </div>
</div>

{/* Programas */}
<div className="form-group">
  <label>¿La escuela forma parte actualmente de algún programa?</label>
  <div className="form-subgroup">
    <label>¿Qué programa?</label>
    <input
      className="form-input"
      type="text"
      name="escuela.apoyoPrevio.programas.nombre"
      value={formData.escuela?.apoyoPrevio?.programas?.nombre || ""}
      onChange={handleInputChange}
    />
  </div>
  <div className="form-subgroup">
    <label>¿Qué apoyo se recibe?</label>
    <input
      className="form-input"
      type="text"
      name="escuela.apoyoPrevio.programas.descripcion"
      value={formData.escuela?.apoyoPrevio?.programas?.descripcion || ""}
      onChange={handleInputChange}
    />
  </div>


  </div>
  <div className="form-group">
  <label htmlFor="tramite-pendiente">
    En el último ciclo escolar, ¿han realizado algún trámite/oficio al gobierno que esté pendiente de resolver?
  </label>
  <select
    id="tramite-pendiente"
    className="form-input"
    value={tramitePendiente}
    onChange={(e) => setTramitePendiente(e.target.value)}
  >
    <option value="si">Sí</option>
    <option value="no">No</option>
  </select>
</div>

{tramitePendiente === "si" && (
  <div className="form-grid">
    <div className="form-group">
      <label>¿Cuál?</label>
      <input
        type="text"
        className="form-input"
        value={datosTramite.cual}
        onChange={(e) =>
          setDatosTramite((prev) => ({ ...prev, cual: e.target.value }))
        }
      />
    </div>
    <div className="form-group">
      <label>Nivel de gobierno</label>
      <input
        type="text"
        className="form-input"
        value={datosTramite.nivelGobierno}
        onChange={(e) =>
          setDatosTramite((prev) => ({ ...prev, nivelGobierno: e.target.value }))
        }
      />
    </div>
    <div className="form-group">
      <label>Instancia</label>
      <input
        type="text"
        className="form-input"
        value={datosTramite.instancia}
        onChange={(e) =>
          setDatosTramite((prev) => ({ ...prev, instancia: e.target.value }))
        }
      />
    </div>
    <div className="form-group">
      <label>Folio</label>
      <input
        type="text"
        className="form-input"
        value={datosTramite.folio}
        onChange={(e) =>
          setDatosTramite((prev) => ({ ...prev, folio: e.target.value }))
        }
      />
    </div>
  </div>
)}

</div>



   {/* Botón para guardar cambios */}
          <button type="submit" className="school-continue-button">GUARDAR CAMBIOS</button>
        </form>
      </div>
    </div>
  );
}

export default EditSchool;
