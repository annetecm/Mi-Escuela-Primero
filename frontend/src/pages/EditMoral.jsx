import "../styles/EditMoral.css";
import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import aliadoImg from '../assets/aliado.jpg';

function EditMoral() {
  const navigate = useNavigate();

  const [formData, setFormData] = useState({
    correo: "",
    contrasena: "",
    rfcInstitucion: "",
    nombreOrg: "",
    giro: "",
    proposito: "",
    domicilioInstitucion: "",
    telefono: "",
    paginaWeb: "",
    numeroEscritura: "",
    fechaEscritura: "",
    otorgadaPor: "",
    ciudad: "",
    rfcFiscal: "",
    razonSocial: "",
    regimen: "",
    domicilioFiscal: "",
    representanteNombre: "",
    representanteCorreo: "",
    representanteTelefono: "",
    representanteArea: "",
    
  });

  useEffect(() => {
    const token = localStorage.getItem("token");
    if (!token) return;

    fetch("http://localhost:5000/api/aliado/perfil-edit", {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    })
      .then((res) => res.json())
      .then((data) => {
        setFormData(data);
      })
      .catch((err) => console.error("Error al cargar perfil:", err));
  }, []);

  const handleInput = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    const token = localStorage.getItem("token");

    try {
      const response = await fetch("http://localhost:5000/api/aliado/editar-datos", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify(formData),
      });

      if (!response.ok) throw new Error("Error al actualizar información");
      alert("Información actualizada exitosamente.");
      navigate("/aliado/perfil");
    } catch (error) {
      console.error("Error:", error);
      alert("Hubo un problema al actualizar la información.");
    }
  };

  return (
    <div className="editmoral-container">
      <div className="editmoral-image-section">
        <img src={aliadoImg || "/placeholder.svg"} alt="Aliados" />
      </div>
      <div className="editmoral-form-section">
        <h1 className="editmoral-title">Edita tu información</h1>
        <p className="editmoral-label">Actualiza los datos de tu institución</p>

        <form onSubmit={handleSubmit} className="editmoral-scroll">
          {/* Sección Credenciales */}
          <div className="editmoral-form-grid">
            <div className="editmoral-form-group">
              <label>Correo</label>
              <input className="editmoral-form-input" type="text" name="correo" value={formData.correo} onChange={handleInput} />
            </div>
            <div className="editmoral-form-group">
              <label>Contraseña</label>
              <input className="editmoral-form-input" type="password" name="contrasena" value={formData.contrasena} onChange={handleInput} />
            </div>
          </div>

          {/* Sección Datos de la Institución */}
          <div className="editmoral-heading">DATOS DE LA INSTITUCIÓN</div>
          <div className="editmoral-form-grid">
            <div className="editmoral-form-group">
              <label>RFC</label>
              <input className="editmoral-form-input" type="text" name="rfcInstitucion" value={formData.rfcInstitucion} onChange={handleInput} />
            </div>
            <div className="editmoral-form-group">
              <label>Nombre de la organización</label>
              <input className="editmoral-form-input" type="text" name="nombreOrg" value={formData.nombreOrg} onChange={handleInput} />
            </div>
            <div className="editmoral-form-group">
              <label>Giro</label>
              <input className="editmoral-form-input" type="text" name="giro" value={formData.giro} onChange={handleInput} />
            </div>
            <div className="editmoral-form-group">
              <label>Propósito de la organización</label>
              <input className="editmoral-form-input" type="text" name="proposito" value={formData.proposito} onChange={handleInput} />
            </div>
            <div className="editmoral-form-group">
              <label>Domicilio</label>
              <input className="editmoral-form-input" type="text" name="domicilioInstitucion" value={formData.domicilioInstitucion} onChange={handleInput} />
            </div>
            <div className="editmoral-form-group">
              <label>Teléfono</label>
              <input className="editmoral-form-input" type="text" name="telefono" value={formData.telefono} onChange={handleInput} />
            </div>
            <div className="editmoral-form-group">
              <label>Página web oficial</label>
              <input className="editmoral-form-input" type="text" name="paginaWeb" value={formData.paginaWeb} onChange={handleInput} />
            </div>
          </div>

          {/* Sección Escritura Pública */}
          <div className="editmoral-heading">ESCRITURA PÚBLICA</div>
          <div className="editmoral-form-grid">
            <div className="editmoral-form-group">
              <label>Número de escritura pública</label>
              <input className="editmoral-form-input" type="text" name="numeroEscritura" value={formData.numeroEscritura} onChange={handleInput} />
            </div>
            <div className="editmoral-form-group">
              <label>Fecha de escritura pública</label>
              <input className="editmoral-form-input" type="date" name="fechaEscritura" value={formData.fechaEscritura} onChange={handleInput} />
            </div>
            <div className="editmoral-form-group">
              <label>Otorgada por</label>
              <input className="editmoral-form-input" type="text" name="otorgadaPor" value={formData.otorgadaPor} onChange={handleInput} />
            </div>
            <div className="editmoral-form-group">
              <label>En la ciudad de</label>
              <input className="editmoral-form-input" type="text" name="ciudad" value={formData.ciudad} onChange={handleInput} />
            </div>
          </div>

          {/* Sección Constancia Fiscal */}
          <div className="editmoral-heading">CONSTANCIA FISCAL</div>
          <div className="editmoral-form-grid">
            <div className="editmoral-form-group">
              <label>RFC</label>
              <input className="editmoral-form-input" type="text" name="rfcFiscal" value={formData.rfcFiscal} onChange={handleInput} />
            </div>
            <div className="editmoral-form-group">
              <label>Razón Social</label>
              <input className="editmoral-form-input" type="text" name="razonSocial" value={formData.razonSocial} onChange={handleInput} />
            </div>
            <div className="editmoral-form-group">
              <label>Régimen</label>
              <input className="editmoral-form-input" type="text" name="regimen" value={formData.regimen} onChange={handleInput} />
            </div>
            <div className="editmoral-form-group">
              <label>Domicilio Fiscal</label>
              <input className="editmoral-form-input" type="text" name="domicilioFiscal" value={formData.domicilioFiscal} onChange={handleInput} />
            </div>
          </div>

          {/* Sección Datos del Representante */}
          <div className="editmoral-heading">DATOS DEL REPRESENTANTE</div>
          <div className="editmoral-form-grid">
            <div className="editmoral-form-group">
              <label>Nombre completo</label>
              <input className="editmoral-form-input" type="text" name="representanteNombre" value={formData.representanteNombre} onChange={handleInput} />
            </div>
            <div className="editmoral-form-group">
              <label>Correo</label>
              <input className="editmoral-form-input" type="text" name="representanteCorreo" value={formData.representanteCorreo} onChange={handleInput} />
            </div>
            <div className="editmoral-form-group">
              <label>Teléfono</label>
              <input className="editmoral-form-input" type="text" name="representanteTelefono" value={formData.representanteTelefono} onChange={handleInput} />
            </div>
            <div className="editmoral-form-group">
              <label>Área a la que pertenece en la organización</label>
              <input className="editmoral-form-input" type="text" name="representanteArea" value={formData.representanteArea} onChange={handleInput} />
            </div>
          </div>

       

          <button type="submit" className="editmoral-continue-button">GUARDAR CAMBIOS</button>
        </form>
      </div>
    </div>
  );
}

export default EditMoral;


