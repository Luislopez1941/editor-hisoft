import React, { useState, useEffect } from 'react';
import { X, Palette, Layers, ArrowRight, Server, Folder, User, Lock, Globe } from 'lucide-react';
import './WebsiteSelectionModal.css';
import { templates as templatesData } from '../../../data/templates';
import APIs from '../../../services/services/APIs';
import useUserStore from '../../../store/General';

const WebsiteSelectionModal = ({ isOpen, onClose, onSelectOption, editPageId = null }) => {
  const { user } = useUserStore();
  const [selectedOption, setSelectedOption] = useState(null);
  const [showNameInput, setShowNameInput] = useState(false);
  
  // Estados para empresas y sucursales
  const [empresas, setEmpresas] = useState([]);
  const [sucursales, setSucursales] = useState([]);
  const [selectedEmpresa, setSelectedEmpresa] = useState('');
  const [selectedSucursal, setSelectedSucursal] = useState('');
  
  // Estados para campos FTP
  const [ftpData, setFtpData] = useState({
    direccionFtp: '',
    usuario: '',
    contrasena: '',
    puerto: '21',
    carpetaGuardar: ''
  });

  // Estado de carga
  const [isLoading, setIsLoading] = useState(false);
  const [loadingEmpresas, setLoadingEmpresas] = useState(false);
  const [loadingSucursales, setLoadingSucursales] = useState(false);
  
  // Estados para edición
  const [isEditing, setIsEditing] = useState(false);
  const [editingPageId, setEditingPageId] = useState(null);
  const [loadingPageData, setLoadingPageData] = useState(false);

  // Cargar empresas al montar el componente
  useEffect(() => {
    if (isOpen && 3) {
      loadEmpresas();
    }
  }, [isOpen, 3]);

  // Detectar si se debe editar una página existente
  useEffect(() => {
    if (isOpen && editPageId && !isEditing) {
      startEditing(editPageId);
    }
  }, [isOpen, editPageId]);

  // Cargar sucursales cuando se selecciona una empresa
  useEffect(() => {
    if (selectedEmpresa && 3) {
      loadSucursales(selectedEmpresa);
    } else {
      setSucursales([]);
      setSelectedSucursal('');
    }
  }, [selectedEmpresa, 3]);

  const loadEmpresas = async () => {
    try {
      setLoadingEmpresas(true);
      const response = await APIs.getCompaniesXUsers(3);
      setEmpresas(response || []);
    } catch (error) {
      console.error('Error cargando empresas:', error);
      setEmpresas([]);
    } finally {
      setLoadingEmpresas(false);
    }
  };

  const loadSucursales = async (empresaId) => {
    try {
      setLoadingSucursales(true);
      const response = await APIs.getBranchOfficesXCompanies(empresaId, user.id);
      setSucursales(response || []);
    } catch (error) {
      console.error('Error cargando sucursales:', error);
      setSucursales([]);
    } finally {
      setLoadingSucursales(false);
    }
  };

  // Función para cargar datos de una página existente
  const loadPageData = async (pageId) => {
    try {
      setLoadingPageData(true);
      const response = await APIs.getPage(pageId);
      console.log('Datos de la página cargados:', response);
      
      if (response) {
        // Llenar el formulario con los datos existentes
        setSelectedEmpresa(response.id_empresa || '');
        setSelectedSucursal(response.id_sucursal || '');
        setFtpData({
          direccionFtp: response.direccion_ftp || '',
          usuario: response.usuario || '',
          contrasena: response.contrasena || '',
          puerto: response.puerto || '21',
          carpetaGuardar: response.carpeta_guardar || ''
        });
        
        // Si hay empresa seleccionada, cargar las sucursales
        if (response.id_empresa) {
          await loadSucursales(response.id_empresa);
        }
      }
    } catch (error) {
      console.error('Error cargando datos de la página:', error);
      alert('Error al cargar los datos de la página. Por favor, intenta nuevamente.');
    } finally {
      setLoadingPageData(false);
    }
  };

  const createNewWebsite = () => {
    setSelectedOption('scratch');
    setShowNameInput(true);
    setIsEditing(false);
    setEditingPageId(null);
  }

  // Función para iniciar la edición de una página existente
  const startEditing = async (pageId) => {
    setSelectedOption('scratch');
    setShowNameInput(true);
    setIsEditing(true);
    setEditingPageId(pageId);
    
    // Cargar los datos de la página
    await loadPageData(pageId);
  }

  const templates = [
    {
      id: 'business',
      name: 'Negocio Profesional',
      description: 'Perfecto para empresas y servicios profesionales',
      image: 'https://via.placeholder.com/300x200/1e334d/ffffff?text=Negocio',
      category: 'business'
    },
    {
      id: 'blog',
      name: 'Blog Personal',
      description: 'Ideal para blogs, noticias y contenido editorial',
      image: 'https://via.placeholder.com/300x200/3D85C6/ffffff?text=Blog',
      category: 'blog'
    },
    {
      id: 'ecommerce',
      name: 'Tienda Online',
      description: 'Diseño optimizado para comercio electrónico',
      image: 'https://via.placeholder.com/300x200/2c5aa0/ffffff?text=Tienda',
      category: 'ecommerce'
    }
  ];

  const handleContinue = async () => {
    if (selectedOption === 'scratch') {
      if (selectedEmpresa && selectedSucursal) {
        try {
          setIsLoading(true);
          
          const data = {
            id_sucursal: parseInt(selectedSucursal),
            nombre: '', // Eliminado el campo nombre
            direccion_ftp: ftpData.direccionFtp,
            usuario: ftpData.usuario,
            contrasena: ftpData.contrasena,
            puerto: ftpData.puerto,
            carpeta_guardar: ftpData.carpetaGuardar,
            logo: '',
            color_primario: '',
            color_secundario: ''
          };
          
          console.log('Enviando datos al backend:', data);
          
          let response;
          if (isEditing && editingPageId) {
            // Actualizar página existente
            const updateData = { ...data, id: editingPageId };
            console.log('Actualizando página con ID:', editingPageId);
            response = await APIs.updatePage(updateData);
            console.log('Página actualizada:', response);
          } else {
            // Crear nueva página
            response = await APIs.createPage(data);
            console.log('Página creada:', response);
          }
          
          // Si la operación fue exitosa, continuar con el flujo
          onSelectOption('scratch', { name: '' }); // Eliminado el campo nombre
          onClose();
          
        } catch (error) {
          console.error('Error al procesar la página:', error);
          const action = isEditing ? 'actualizar' : 'crear';
          alert(`Error al ${action} la página. Por favor, intenta nuevamente.`);
        } finally {
          setIsLoading(false);
        }
      }
    } else if (selectedOption) {
      const template = templates.find(t => t.id === selectedOption);
      const fullTemplate = templatesData[selectedOption];
      onSelectOption('template', {
        ...template,
        structure: fullTemplate ? fullTemplate.elements : null
      });
      onClose();
    }
  };

  const handleBackToOptions = () => {
    setShowNameInput(false);
    setSelectedOption(null);
    setSelectedEmpresa('');
    setSelectedSucursal('');
    setFtpData({
      direccionFtp: '',
      usuario: '',
      contrasena: '',
      puerto: '21',
      carpetaGuardar: ''
    });
    setIsLoading(false);
    setLoadingEmpresas(false);
    setLoadingSucursales(false);
    setIsEditing(false);
    setEditingPageId(null);
    setLoadingPageData(false);
  };

  const isFormValid = () => {
    if (selectedOption === 'scratch') {
      return selectedEmpresa && selectedSucursal && 
             ftpData.direccionFtp && ftpData.usuario && ftpData.contrasena && 
             ftpData.puerto && ftpData.carpetaGuardar;
    }
    return selectedOption;
  };

  if (!isOpen) return null;

  // Si no hay usuario logueado, mostrar mensaje
  if (!user?.id) {
    return (
      <div className="modal-overlay">
        <div className="website-modal">
          <div className="modal-header">
            <h2>Error de Autenticación</h2>
            <button className="close-btn" onClick={onClose}>
              <X size={20} />
            </button>
          </div>
          <div className="modal-content">
            <p>Debes estar logueado para crear un sitio web.</p>
          </div>
          <div className="modal-footer">
            <button className="cancel-btn" onClick={onClose}>
              Cerrar
            </button>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="modal-overlay">
      <div className="website-modal">
        <div className="modal-header">
          <h2>¿Cómo te gustaría diseñar tu sitio web?</h2>
          <button className="close-btn" onClick={onClose}>
            <X size={20} />
          </button>
        </div>

        <div className="modal-content">
          {!showNameInput ? (
            <div className="design-options">
              <div 
                className={`design-option ${selectedOption === 'scratch' ? 'selected' : ''}`}
                onClick={createNewWebsite}
              >
                <div className="option-icon">
                  <Palette size={40} />
                </div>
                <h3>Empezar desde cero</h3>
                <p>Crea tu diseño único con total libertad creativa usando nuestro editor drag & drop</p>
                <div className="option-preview">
                  <div className="blank-canvas">
                    <span>Canvas en blanco</span>
                  </div>
                </div>
              </div>

              <div className="divider">
                <span>o</span>
              </div>

              <div 
                className={`design-option templates-option ${selectedOption && selectedOption !== 'scratch' ? 'selected' : ''}`}
              >
                <div className="option-icon">
                  <Layers size={40} />
                </div>
                <h3>Usar plantillas</h3>
                <p>Comienza con una plantilla profesional y personalízala a tu gusto</p>
                
                <div className="templates-grid">
                  {templates.map(template => (
                    <div 
                      key={template.id}
                      className={`template-card ${selectedOption === template.id ? 'selected' : ''}`}
                      onClick={() => setSelectedOption(template.id)}
                    >
                      <div className="template-image">
                        <img src={template.image} alt={template.name} />
                      </div>
                      <div className="template-info">
                        <h4>{template.name}</h4>
                        <p>{template.description}</p>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          ) : (
            <div className="name-input-section">
              <div className="name-input-header">
                <h3>📝 Configuración del sitio web</h3>
                <p>
                  {isEditing 
                    ? 'Editando página existente' 
                    : 'Completa la información necesaria para crear tu proyecto'
                  }
                </p>
              </div>
              
              <div className="form-fields">
                {/* Select de Empresas */}
                <div className="form-group">
                  <label htmlFor="empresa">Empresa</label>
                  <select
                    id="empresa"
                    value={selectedEmpresa}
                    onChange={(e) => setSelectedEmpresa(e.target.value)}
                    className="form-select"
                    disabled={loadingEmpresas}
                  >
                    <option value="">
                      {loadingEmpresas ? 'Cargando empresas...' : 'Selecciona una empresa'}
                    </option>
                    {empresas.map(empresa => (
                      <option key={empresa.id} value={empresa.id}>
                        {empresa.nombre_comercial}
                      </option>
                    ))}
                  </select>
                  {loadingEmpresas && <small className="loading-text">Cargando empresas...</small>}
                </div>

                {/* Select de Sucursales */}
                <div className="form-group">
                  <label htmlFor="sucursal">Sucursal</label>
                  <select
                    id="sucursal"
                    value={selectedSucursal}
                    onChange={(e) => setSelectedSucursal(e.target.value)}
                    className="form-select"
                    disabled={!selectedEmpresa || loadingSucursales}
                  >
                    <option value="">
                      {!selectedEmpresa 
                        ? 'Primero selecciona una empresa' 
                        : loadingSucursales 
                          ? 'Cargando sucursales...' 
                          : 'Selecciona una sucursal'
                      }
                    </option>
                    {sucursales.map(sucursal => (
                      <option key={sucursal.id} value={sucursal.id}>
                        {sucursal.nombre}
                      </option>
                    ))}
                  </select>
                  {loadingSucursales && <small className="loading-text">Cargando sucursales...</small>}
                </div>

                {/* Campos FTP */}
                <div className="ftp-section">
                  <h4><Server size={16} /> Configuración FTP</h4>
                  
                  <div className="form-row">
                    <div className="form-group">
                      <label htmlFor="direccionFtp">Dirección FTP</label>
                      <input
                        id="direccionFtp"
                        type="text"
                        placeholder="ftp.ejemplo.com"
                        value={ftpData.direccionFtp}
                        onChange={(e) => setFtpData({...ftpData, direccionFtp: e.target.value})}
                        className="form-input"
                      />
                    </div>
                    
                    <div className="form-group">
                      <label htmlFor="puerto">Puerto</label>
                      <input
                        id="puerto"
                        type="number"
                        placeholder="21"
                        value={ftpData.puerto}
                        onChange={(e) => setFtpData({...ftpData, puerto: e.target.value})}
                        className="form-input"
                      />
                    </div>
                  </div>

                  <div className="form-row">
                    <div className="form-group">
                      <label htmlFor="usuario">Usuario</label>
                      <input
                        id="usuario"
                        type="text"
                        placeholder="usuario_ftp"
                        value={ftpData.usuario}
                        onChange={(e) => setFtpData({...ftpData, usuario: e.target.value})}
                        className="form-input"
                      />
                    </div>
                    
                    <div className="form-group">
                      <label htmlFor="contrasena">Contraseña</label>
                      <input
                        id="contrasena"
                        type="password"
                        placeholder="••••••••"
                        value={ftpData.contrasena}
                        onChange={(e) => setFtpData({...ftpData, contrasena: e.target.value})}
                        className="form-input"
                      />
                    </div>
                  </div>

                  <div className="form-group">
                    <label htmlFor="carpetaGuardar">Carpeta a guardar</label>
                    <input
                      id="carpetaGuardar"
                      type="text"
                      placeholder="/public_html/ o /htdocs/"
                      value={ftpData.carpetaGuardar}
                      onChange={(e) => setFtpData({...ftpData, carpetaGuardar: e.target.value})}
                      className="form-input"
                    />
                  </div>
                </div>
              </div>
            </div>
          )}
        </div>

        <div className="modal-footer">
          {!showNameInput ? (
            <>
              <button className="cancel-btn" onClick={onClose}>
                Cancelar
              </button>
              <button 
                className="continue-btn" 
                onClick={handleContinue}
                disabled={!selectedOption}
              >
                Continuar <ArrowRight size={16} />
              </button>
            </>
          ) : (
            <>
              <button className="cancel-btn" onClick={handleBackToOptions}>
                ← Volver
              </button>
              <button 
                className="continue-btn" 
                onClick={handleContinue}
                disabled={!isFormValid() || isLoading}
              >
                {isLoading 
                  ? (isEditing ? 'Actualizando...' : 'Creando...') 
                  : (isEditing ? 'Actualizar Sitio Web' : 'Crear Sitio Web')
                } <ArrowRight size={16} />
              </button>
            </>
          )}
        </div>
      </div>
    </div>
  );
};

export default WebsiteSelectionModal; 