import React, { useState, useEffect } from 'react';
import { 
  Download, 
  Eye, 
  Edit3, 
  Plus, 
  FolderOpen,
  X,
  Check,
  AlertCircle
} from 'lucide-react';
import { exportProjectSimple } from '../../../utils/projectStorage';
import { useEditor } from '../../../context/EditorContext';
import { previewWebsite } from '../../../utils/exportUtils.jsx';
import WebsiteSelectionModal from './WebsiteSelectionModal';
import APIs from '../../../services/services/APIs';
import './WebsiteProjectManager.css';

const WebsiteProjectManager = ({ onSwitchToEditor }) => {
  // ===== ESTADOS =====
  const [serverPages, setServerPages] = useState([]);
  const [showWebsiteModal, setShowWebsiteModal] = useState(false);
  const [loadingServerPages, setLoadingServerPages] = useState(false);
  const [message, setMessage] = useState({ type: '', text: '' });

  // ===== EFECTOS =====
  useEffect(() => {
    loadServerPages();
  }, []);

  // Efecto para detectar cuando hay scroll disponible
  useEffect(() => {
    const checkScrollable = () => {
      const serverSection = document.querySelector('.server-pages-section');
      if (serverSection) {
        const hasScroll = serverSection.scrollHeight > serverSection.clientHeight;
        serverSection.setAttribute('data-scrollable', hasScroll);
      }
    };

    // Verificar después de cargar las páginas
    const timer = setTimeout(checkScrollable, 100);
    
    // Verificar en cambios de tamaño de ventana
    window.addEventListener('resize', checkScrollable);
    
    return () => {
      clearTimeout(timer);
      window.removeEventListener('resize', checkScrollable);
    };
  }, [serverPages]);

  // ===== FUNCIONES PRINCIPALES =====
  
  const loadServerPages = async () => {
    setLoadingServerPages(true);
    
    try {
      const response = await APIs.getPage(3);
      
      if (response && Array.isArray(response)) {
        // Procesar array de páginas
        const pagesData = response.map((page, index) => {
          const sections = parsePageSections(page, index);
          return createPageData(page, sections);
        });
        
        setServerPages(pagesData);
      } else if (response && response.data) {
        // Caso legacy con .data
        const sections = parsePageSections(response.data);
        const pagesData = [createPageData(response.data, sections)];
        setServerPages(pagesData);
      } else if (response && response.nombre) {
        // Caso legacy directo
        const sections = parsePageSections(response);
        const pagesData = [createPageData(response, sections)];
        setServerPages(pagesData);
      } else {
        setServerPages([]);
      }
    } catch (error) {
      console.error('Error al cargar páginas del servidor:', error);
      setMessage({ type: 'error', text: 'Error al cargar páginas del servidor: ' + error.message });
      setServerPages([]);
    } finally {
      setLoadingServerPages(false);
    }
  };

  // ===== FUNCIONES AUXILIARES =====
  
  const parsePageSections = (page, index = 0) => {
    try {
      if (page.json_original) {
        let jsonData = page.json_original;
        
        // Limpiar la serialización múltiple
        if (typeof jsonData === 'string') {
          
          // Paso 1: Eliminar las comillas del inicio y final
          if (jsonData.startsWith('"') && jsonData.endsWith('"')) {
            jsonData = jsonData.slice(1, -1);
          }
          
          // Paso 2: Reemplazar todas las \\\\\" por " (para triple serialización)
          jsonData = jsonData.replace(/\\\\\\"/g, '"');
          
          // Paso 3: Reemplazar todas las \\\" por " (para doble serialización)
          jsonData = jsonData.replace(/\\\\"/g, '"');
          
          // Paso 4: Reemplazar todas las \" por " (para serialización simple)
          jsonData = jsonData.replace(/\\"/g, '"');
          
          // Paso 5: Parsear el JSON limpio
          try {
            const parsed = JSON.parse(jsonData);
            
            // Verificar que la estructura es correcta
            if (parsed && typeof parsed === 'object' && parsed.home && parsed.home.elements) {
              return parsed;
            } else {
              // Si no tiene la estructura correcta, crear una por defecto
              return {
                home: {
                  id: 'home',
                  name: 'Inicio',
                  elements: [],
                  isHome: true,
                  slug: 'home'
                }
              };
            }
          } catch (parseError) {
            console.error('Error al parsear JSON limpio:', parseError);
            // En caso de error, crear estructura por defecto
            return {
              home: {
                id: 'home',
                name: 'Inicio',
                elements: [],
                isHome: true,
                slug: 'home'
              }
            };
          }
        }
        
        return {};
      } else if (page.contenido) {
        let jsonData = page.contenido;
        if (typeof jsonData === 'string') {
          try {
            jsonData = JSON.parse(jsonData);
            if (typeof jsonData === 'string') {
              jsonData = JSON.parse(jsonData);
            }
          } catch (e) {
            jsonData = {};
          }
        }
        return jsonData;
      } else {
        return {};
      }
    } catch (error) {
      console.error('Error parsing JSON for page', index, ':', error);
      
      // En caso de error, crear estructura por defecto
      return {
        home: {
          id: 'home',
          name: 'Inicio',
          elements: [],
          isHome: true,
          slug: 'home'
        }
      };
    }
  };

  const createPageData = (page, sections) => {
    // Verificar que sections tenga contenido válido
    if (!sections || Object.keys(sections).length === 0) {
      sections = {
        home: {
          id: 'home',
          name: 'Inicio',
          elements: [],
          isHome: true,
          slug: 'home'
        }
      };
    }
    
    // Verificar que el nombre no esté vacío - PRIORIDAD: nombre > nombre del archivo
    let pageName = '';
    
    // Primero intentar con el nombre directo
    if (page.nombre && page.nombre !== '') {
      pageName = page.nombre;
    }
    // Si no hay nombre, intentar con el nombre del archivo (sin extensión)
    else if (page.nombre && page.nombre.includes('.')) {
      pageName = page.nombre.split('.')[0]; // Quitar la extensión .html
    }
    // Si tampoco hay nombre del archivo, usar el nombre de la sucursal
    else if (page.sucursal && page.sucursal !== '') {
      pageName = page.sucursal;
    }
    // Último recurso
    else {
      pageName = 'Página sin nombre';
    }
    
    const pageData = {
      id: `server-${page.id}`,
      name: pageName,
      description: page.descripcion || page.description || '',
      sections: sections,
      html_compilado: page.html_compilado || '',
      createdAt: page.fecha_creacion || page.createdAt || new Date().toISOString(),
      updatedAt: page.fecha_actualizacion || page.updatedAt || new Date().toISOString(),
      tags: ['servidor'],
      isServerPage: true,
      empresa: page.empresa || '',
      sucursal: page.sucursal || '',
      id_sucursal: page.id_sucursal || null
    };
    
    return pageData;
  };

  // ===== MANEJADORES DE EVENTOS =====
  
  const handleWebsiteSelection = (type, template) => {
    setShowWebsiteModal(false);
    
    if (type === 'load-project' && onSwitchToEditor) {
      onSwitchToEditor(type, template);
    }
  };

  const handleLoadProject = async (project) => {
    try {
      setMessage({ type: 'info', text: 'Cargando página completa del servidor...' });
      
      if (project.isServerPage && project.id_sucursal) {
        const response = await APIs.getPageByBranch(project.id_sucursal);
        
        if (response && response.json_original) {
          let sections = {};
          try {
            if (response.json_original && response.json_original !== '') {
              let jsonData = response.json_original;
              
              // Limpiar la serialización múltiple
              if (typeof jsonData === 'string') {
                
                // Paso 1: Eliminar las comillas del inicio y final
                if (jsonData.startsWith('"') && jsonData.endsWith('"')) {
                  jsonData = jsonData.slice(1, -1);
                }
                
                // Paso 2: Reemplazar todas las \\\\\" por " (para triple serialización)
                jsonData = jsonData.replace(/\\\\\\"/g, '"');
                
                // Paso 3: Reemplazar todas las \\\" por " (para doble serialización)
                jsonData = jsonData.replace(/\\\\"/g, '"');
                
                // Paso 4: Reemplazar todas las \" por " (para serialización simple)
                jsonData = jsonData.replace(/\\"/g, '"');
                
                // Paso 5: Parsear el JSON limpio
                try {
                  jsonData = JSON.parse(jsonData);
                  sections = jsonData;
                } catch (parseError) {
                  console.error('❌ Error al parsear JSON limpio:', parseError);
                  throw parseError;
                }
              }
            } else {
              sections = {
                home: {
                  id: 'home',
                  name: 'Inicio',
                  elements: [],
                  isHome: true,
                  slug: 'home'
                }
              };
            }
          } catch (error) {
            sections = {
              home: {
                id: 'home',
                name: 'Inicio',
                elements: [],
                isHome: true,
                slug: 'home'
              }
            };
          }
          
          // Asegurar que todas las secciones tengan la estructura correcta
          Object.keys(sections).forEach(sectionKey => {
            if (!sections[sectionKey].elements) {
              sections[sectionKey].elements = [];
            }
            if (!sections[sectionKey].id) {
              sections[sectionKey].id = sectionKey;
            }
            if (!sections[sectionKey].name) {
              sections[sectionKey].name = sectionKey.charAt(0).toUpperCase() + sectionKey.slice(1);
            }
            if (!sections[sectionKey].slug) {
              sections[sectionKey].slug = sectionKey;
            }
          });
          
          const updatedProject = {
            ...project,
            name: response.nombre || project.name,
            description: response.descripcion || project.description,
            sections: sections,
            html_compilado: response.html_compilado || project.html_compilado,
            logo: response.logo || '',
            color_primario: response.color_primario || '',
            color_secundario: response.color_secundario || '',
            texto_footer: response.texto_footer || '',
            empresa: project.empresa,
            sucursal: project.sucursal,
            id_sucursal: response.id_sucursal || project.id_sucursal,
            isServerPage: true,
            page_id: response.id || null
          };
          
          setMessage({ type: 'success', text: 'Página cargada exitosamente, abriendo editor...' });
          
          if (onSwitchToEditor) {
            onSwitchToEditor('load-project', updatedProject);
          } else {
            console.error('❌ onSwitchToEditor no está disponible');
          }
        } else {
          setMessage({ type: 'warning', text: 'No se pudo cargar la página completa, usando datos locales...' });
          
          if (onSwitchToEditor) {
            onSwitchToEditor('load-project', project);
          } else {
            console.error('❌ onSwitchToEditor no está disponible');
          }
        }
      } else {
        setMessage({ type: 'info', text: 'Abriendo editor...' });
        
        if (onSwitchToEditor) {
          onSwitchToEditor('load-project', project);
        } else {
          console.error('❌ onSwitchToEditor no está disponible');
        }
      }
    } catch (error) {
      console.error('Error al cargar la página del servidor:', error);
      setMessage({ type: 'error', text: 'Error al cargar la página del servidor: ' + error.message });
      
      // En caso de error, usar el proyecto original
      if (onSwitchToEditor) {
        onSwitchToEditor('load-project', project);
      } else {
        console.error('❌ onSwitchToEditor no está disponible');
      }
    }
  };

  const handlePreviewProject = (project) => {
    try {
      // Usar id_sucursal del proyecto si está disponible
      const sucursalId = project.id_sucursal || null;
      previewWebsite(project.sections, sucursalId);
    } catch (error) {
      setMessage({ type: 'error', text: 'Error al generar la vista previa' });
    }
  };

  const handleExportProject = async (project) => {
    try {
      if (!project || !project.sections) {
        throw new Error('El proyecto no tiene datos válidos para exportar');
      }
      
      const result = exportProjectSimple(project);
      setMessage({ 
        type: 'success', 
        text: `Proyecto exportado exitosamente como ${result.filename}` 
      });
    } catch (error) {
      setMessage({ type: 'error', text: 'Error al exportar el proyecto: ' + error.message });
    }
  };

  const handleSaveProject = async (projectData) => {
    try {
      if (!projectData || !projectData.id_sucursal) {
        throw new Error('El proyecto no tiene id_sucursal válido para guardar');
      }

      // Preparar los datos para guardar según la estructura requerida
      const saveData = {
        contenido_html: JSON.stringify(projectData.sections || {}), // JSON de las secciones
        contenido: '', // Enviar vacío
        nombre: projectData.sucursal || '', // Nombre de la sucursal
        id_sucursal: projectData.id_sucursal // ID de la sucursal
      };

      const response = await APIs.savePage(saveData);
      
      if (response && response.success) {
        setMessage({ 
          type: 'success', 
          text: 'Página guardada exitosamente en el servidor' 
        });
        
        // Recargar las páginas del servidor para mostrar cambios
        await loadServerPages();
      } else {
        throw new Error('No se pudo guardar la página en el servidor');
      }
    } catch (error) {
      console.error('Error al guardar la página:', error);
      setMessage({ type: 'error', text: 'Error al guardar la página: ' + error.message });
    }
  };

  const handleCreateEmptyProject = () => {
    const emptyProject = {
      id: `project-${Date.now()}`,
      name: 'Nuevo Proyecto',
      description: 'Proyecto vacío',
      sections: {
        home: {
          id: 'home',
          name: 'Inicio',
          elements: []
        }
      },
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
      tags: ['nuevo']
    };
    
    if (onSwitchToEditor) {
      onSwitchToEditor('load-project', emptyProject);
    } else {
      console.error('❌ onSwitchToEditor no está disponible');
    }
  };

  // ===== FUNCIONES DE UTILIDAD =====
  
  const formatDate = (dateString) => {
    return new Date(dateString).toLocaleDateString('es-ES', {
      year: 'numeric',
      month: 'short',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    });
  };

  const clearMessage = () => setMessage({ type: '', text: '' });

  // ===== RENDERIZADO =====
  
  return (
    <div className="website-project-manager">
      
      {/* ===== HEADER PRINCIPAL ===== */}
      <div className="project-manager-header">
        <div className="header-left">
          <h2>Mis Proyectos Web</h2>
          <p>Gestiona y organiza tus sitios web</p>
        </div>
        
        <div className="header-right">
          <button 
            className="create-site-btn" 
            style={{
              display: 'inline-flex', 
              background: '#3D85C6', 
              color: 'white', 
              fontWeight: 700, 
              fontSize: 16, 
              padding: '12px 24px', 
              borderRadius: 8, 
              alignItems: 'center', 
              gap: 8, 
              border: 'none',
              cursor: 'pointer'
            }} 
            onClick={() => setShowWebsiteModal(true)}
          >
            <Plus size={20} />
            Crear nuevo sitio
          </button>
        </div>
      </div>

      {/* ===== BARRA DE ACCIONES ===== */}
      <div className="project-actions">
        <button 
          className="action-btn"
          onClick={handleCreateEmptyProject}
          title="Crear un proyecto vacío para empezar desde cero"
        >
          <Plus size={16} />
          Crear Proyecto Vacío
        </button>
        
        <button 
          className="action-btn"
          onClick={loadServerPages}
          disabled={loadingServerPages}
          title="Recargar páginas del servidor"
        >
          <FolderOpen size={16} />
          {loadingServerPages ? 'Cargando...' : 'Recargar Servidor'}
        </button>
        
      </div>

      {/* ===== CONTENIDO PRINCIPAL ===== */}
      <div className="projects-list">
        
        {/* ===== SECCIÓN DE PÁGINAS DEL SERVIDOR ===== */}
        <div className="server-pages-section">
          
          {/* Estado de carga */}
          {loadingServerPages && (
            <div className="loading-state">
              <div className="loading-spinner-large"></div>
              <p>Cargando páginas del servidor...</p>
            </div>
          )}

          {/* Lista de páginas */}
          {!loadingServerPages && serverPages.length > 0 && (
            <>
              {/* Mensaje informativo sobre scroll */}
              {serverPages.length > 6 && (
                <div className="scroll-info">
                  <p>📜 {serverPages.length} páginas encontradas - Usa el scroll para ver todas</p>
                </div>
              )}
              
              <div className="server-pages-grid">
                {serverPages.map(page => (
                  <div key={page.id} className="project-card server-page">
                    
                    {/* Información del proyecto */}
                    <div className="project-info">
                      <div className="project-details">
                        
                        {/* Título y descripción */}
                        <h4 className="project-title">{page.name}</h4>
                        {page.description && (
                          <p className="project-description">{page.description}</p>
                        )}
                        
                        {/* Información de Empresa y Sucursal */}
                        {(page.empresa || page.sucursal) && (
                          <div className="company-info">
                            {page.empresa && (
                              <span className="company-tag">
                                {page.empresa}
                              </span>
                            )}
                            {page.sucursal && (
                              <span className="branch-tag">
                                {page.sucursal}
                              </span>
                            )}
                          </div>
                        )}
                        
                        {/* Meta información */}
                        <div className="project-meta">
                          <span className="date">
                            {formatDate(page.updatedAt)}
                          </span>
                          <div className="tags">
                            <span className="tag server">Servidor</span>
                          </div>
                        </div>
                      </div>
                    </div>
                    
                    {/* Acciones del proyecto */}
                    <div className="project-actions">
                      <button 
                        className="action-icon"
                        onClick={() => handleLoadProject(page)}
                        title="Cargar página del servidor"
                      >
                        <Edit3 size={16} />
                      </button>
                      <button 
                        className="action-icon"
                        onClick={() => handlePreviewProject(page)}
                        title="Vista previa"
                      >
                        <Eye size={16} />
                      </button>
                      <button 
                        className="action-icon"
                        onClick={() => handleSaveProject(page)}
                        title="Guardar en servidor"
                      >
                        <Check size={16} />
                      </button>
                      <button 
                        className="action-icon"
                        onClick={() => handleExportProject(page)}
                        title="Exportar"
                      >
                        <Download size={16} />
                      </button>
                    </div>
                  </div>
                ))}
              </div>
              
              {/* Botón de volver arriba cuando hay scroll */}
              {serverPages.length > 6 && (
                <button 
                  className="back-to-top-btn"
                  onClick={() => {
                    const serverSection = document.querySelector('.server-pages-section');
                    if (serverSection) {
                      serverSection.scrollTo({ top: 0, behavior: 'smooth' });
                    }
                  }}
                  title="Volver arriba"
                >
                  ↑ Volver arriba
                </button>
              )}
            </>
          )}

          {/* Estado vacío */}
          {!loadingServerPages && serverPages.length === 0 && (
            <div className="empty-state">
              <FolderOpen size={48} />
              <h3>No hay páginas en el servidor</h3>
              <p>No se encontraron páginas para mostrar</p>
            </div>
          )}
        </div>
      </div>

      {/* ===== MODALES ===== */}
      <WebsiteSelectionModal
        isOpen={showWebsiteModal}
        onClose={() => setShowWebsiteModal(false)}
        onSelectOption={handleWebsiteSelection}
      />

      {/* ===== MENSAJES DEL SISTEMA ===== */}
      {message.text && (
        <div className={`message ${message.type}`}>
          {message.type === 'success' ? <Check size={16} /> : <AlertCircle size={16} />}
          <span>{message.text}</span>
          <button onClick={clearMessage}>
            <X size={16} />
          </button>
        </div>
      )}
    </div>
  );
};

export default WebsiteProjectManager;