import React, { useState, useEffect } from 'react';
import { 
  Save, 
  Download, 
  Upload, 
  Eye, 
  Trash2, 
  Edit3, 
  Plus, 
  Search,
  FolderOpen,
  Clock,
  Tag,
  MoreVertical,
  X,
  Check,
  AlertCircle
} from 'lucide-react';
import { 
  saveProject, 
  getProjects, 
  deleteProject, 
  exportProject, 
  exportProjectDirect,
  exportProjectFallback,
  exportProjectJSON,
  exportProjectJSONUltra,
  exportProjectSimple,
  importProject,
  createProjectData,
  searchProjects,
  getProjectStats
} from '../../../utils/projectStorage';
import { useEditor } from '../../../context/EditorContext';
import { previewWebsite } from '../../../utils/exportUtils.jsx';
import WebsiteSelectionModal from './WebsiteSelectionModal';
import APIs from '../../../services/services/APIs';
import './WebsiteProjectManager.css';

const WebsiteProjectManager = ({ onSwitchToEditor }) => {
  const { sections } = useEditor();
  const [projects, setProjects] = useState([]);
  const [serverPages, setServerPages] = useState([]);
  const [searchQuery, setSearchQuery] = useState('');
  const [showSaveModal, setShowSaveModal] = useState(false);
  const [showImportModal, setShowImportModal] = useState(false);
  const [showWebsiteModal, setShowWebsiteModal] = useState(false);
  const [saveFormData, setSaveFormData] = useState({ name: '', description: '', tags: '' });
  const [currentProject, setCurrentProject] = useState(null);
  const [loading, setLoading] = useState(false);
  const [loadingServerPages, setLoadingServerPages] = useState(false);
  const [exportingProjects, setExportingProjects] = useState(new Set());
  const [message, setMessage] = useState({ type: '', text: '' });

  useEffect(() => {
    loadProjects();
    loadServerPages();
  }, []);

  const loadProjects = () => {
    const savedProjects = getProjects();
    setProjects(savedProjects);
  };

  const loadServerPages = async () => {
    setLoadingServerPages(true);
    try {
      // Obtener todas las páginas del servidor
      const response = await APIs.getPage('Pagina MG');
      
      if (response && response.data) {
        // Parsear el JSON que puede venir doble serializado
        let sections = {};
        try {
          if (response.data.json_original) {
            // Intentar parsear el JSON que puede estar doble serializado
            let jsonData = response.data.json_original;
            if (typeof jsonData === 'string') {
              jsonData = JSON.parse(jsonData);
              // Si aún es string, parsearlo una vez más
              if (typeof jsonData === 'string') {
                jsonData = JSON.parse(jsonData);
              }
            }
            sections = jsonData;
          } else if (response.data.contenido) {
            let jsonData = response.data.contenido;
            if (typeof jsonData === 'string') {
              jsonData = JSON.parse(jsonData);
              if (typeof jsonData === 'string') {
                jsonData = JSON.parse(jsonData);
              }
            }
            sections = jsonData;
          }
        } catch (error) {
          console.error('Error parsing JSON:', error);
          sections = {};
        }

        const pagesData = [{
          id: `server-${response.data.nombre}`,
          name: response.data.nombre,
          description: response.data.descripcion || 'Página del servidor',
          sections: sections,
          html_compilado: response.data.html_compilado || '',
          createdAt: response.data.fecha_creacion,
          updatedAt: response.data.fecha_actualizacion,
          tags: ['servidor'],
          isServerPage: true
        }];
        
        setServerPages(pagesData);
        console.log('Páginas del servidor cargadas:', pagesData);
      } else if (response && response.nombre) {
        // Si la respuesta viene directamente (sin .data)
        let sections = {};
        try {
          if (response.json_original) {
            let jsonData = response.json_original;
            if (typeof jsonData === 'string') {
              jsonData = JSON.parse(jsonData);
              if (typeof jsonData === 'string') {
                jsonData = JSON.parse(jsonData);
              }
            }
            sections = jsonData;
          } else if (response.contenido) {
            let jsonData = response.contenido;
            if (typeof jsonData === 'string') {
              jsonData = JSON.parse(jsonData);
              if (typeof jsonData === 'string') {
                jsonData = JSON.parse(jsonData);
              }
            }
            sections = jsonData;
          }
        } catch (error) {
          console.error('Error parsing JSON:', error);
          sections = {};
        }

        const pagesData = [{
          id: `server-${response.nombre}`,
          name: response.nombre,
          description: response.descripcion || 'Página del servidor',
          sections: sections,
          html_compilado: response.html_compilado || '',
          createdAt: response.fecha_creacion,
          updatedAt: response.fecha_actualizacion,
          tags: ['servidor'],
          isServerPage: true
        }];
        
        setServerPages(pagesData);
        console.log('Páginas del servidor cargadas:', pagesData);
      } else {
        setServerPages([]);
        console.log('No se encontraron páginas en el servidor');
      }
    } catch (error) {
      console.error('Error al cargar páginas del servidor:', error);
      setMessage({ type: 'error', text: 'Error al cargar páginas del servidor: ' + error.message });
      setServerPages([]);
    } finally {
      setLoadingServerPages(false);
    }
  };

  const handleWebsiteSelection = (type, template) => {
    setShowWebsiteModal(false);
    if (onSwitchToEditor) {
      onSwitchToEditor(type, template);
    }
  };

  const handleSaveProject = async () => {
    if (!saveFormData.name.trim()) {
      setMessage({ type: 'error', text: 'El nombre del proyecto es requerido' });
      return;
    }

    if (!sections || Object.keys(sections).length === 0) {
      setMessage({ type: 'error', text: 'No hay contenido en el editor para guardar' });
      return;
    }

    setLoading(true);
    try {
      // Crear datos del proyecto con toda la información actual
      const projectData = createProjectData(sections, {
        name: saveFormData.name.trim(),
        description: saveFormData.description.trim(),
        tags: saveFormData.tags.split(',').map(tag => tag.trim()).filter(tag => tag),
        id: currentProject?.id || `project-${Date.now()}`,
        createdAt: currentProject?.createdAt || new Date().toISOString(),
        updatedAt: new Date().toISOString()
      });

      console.log('Guardando proyecto:', projectData);

      const result = await saveProject(projectData);
      
      if (result.success) {
        setMessage({ type: 'success', text: 'Proyecto guardado exitosamente' });
        setShowSaveModal(false);
        setSaveFormData({ name: '', description: '', tags: '' });
        setCurrentProject(result.project); // Actualizar el proyecto actual
        loadProjects(); // Recargar la lista
      } else {
        setMessage({ type: 'error', text: result.error });
      }
    } catch (error) {
      console.error('Error al guardar:', error);
      setMessage({ type: 'error', text: 'Error al guardar el proyecto: ' + error.message });
    } finally {
      setLoading(false);
    }
  };

  const handleLoadProject = (project) => {
    // Actualizar el proyecto actual
    setCurrentProject(project);
    
    if (onSwitchToEditor) {
      onSwitchToEditor('load-project', project);
    }
  };

  const handlePreviewProject = (project) => {
    try {
      previewWebsite(project.sections);
    } catch (error) {
      setMessage({ type: 'error', text: 'Error al generar la vista previa' });
    }
  };

  const handleExportProject = async (project) => {
    setExportingProjects(prev => new Set(prev).add(project.id));
    
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
    } finally {
      setExportingProjects(prev => {
        const newSet = new Set(prev);
        newSet.delete(project.id);
        return newSet;
      });
    }
  };

  const handleDeleteProject = async (projectId) => {
    if (window.confirm('¿Estás seguro de que quieres eliminar este proyecto?')) {
      const result = await deleteProject(projectId);
      if (result.success) {
        setMessage({ type: 'success', text: 'Proyecto eliminado exitosamente' });
        loadProjects();
      } else {
        setMessage({ type: 'error', text: result.error });
      }
    }
  };

  const handleImportProject = async (event) => {
    const file = event.target.files[0];
    if (!file) return;

    setLoading(true);
    try {
      const importedProject = await importProject(file);
      setMessage({ type: 'success', text: 'Proyecto importado exitosamente' });
      setShowImportModal(false);
      loadProjects();
    } catch (error) {
      setMessage({ type: 'error', text: error.message });
    } finally {
      setLoading(false);
    }
  };

  const filteredProjects = searchQuery 
    ? searchProjects(searchQuery) 
    : projects;

  const stats = getProjectStats();

  const formatDate = (dateString) => {
    return new Date(dateString).toLocaleDateString('es-ES', {
      year: 'numeric',
      month: 'short',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    });
  };

  return (
    <div className="website-project-manager">
      {/* Header */}
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

      {/* Stats */}
      <div className="project-stats">
        <div className="stat-item">
          <FolderOpen size={16} />
          <span>{stats.total} proyectos</span>
        </div>
        <div className="stat-item">
          <Clock size={16} />
          <span>{stats.recentlyUpdated} recientes</span>
        </div>
        {currentProject && (
          <div className="stat-item" style={{ background: '#10b981', color: 'white', padding: '4px 12px', borderRadius: '6px' }}>
            <Edit3 size={16} />
            <span>Editando: {currentProject.name}</span>
          </div>
        )}
      </div>

      {/* Search */}
      <div className="search-section">
        <div className="search-input">
          <Search size={16} />
          <input
            type="text"
            placeholder="Buscar proyectos..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
          />
        </div>
      </div>

      {/* Actions */}
      <div className="project-actions">
        <button 
          className={`action-btn ${sections && Object.keys(sections).length > 0 ? 'primary' : 'disabled'}`}
          onClick={() => {
            if (sections && Object.keys(sections).length > 0) {
              setCurrentProject(null);
              setSaveFormData({ name: '', description: '', tags: '' });
              setShowSaveModal(true);
            } else {
              setMessage({ type: 'error', text: 'No hay contenido en el editor para guardar. Primero crea un sitio web.' });
            }
          }}
          disabled={!sections || Object.keys(sections).length === 0}
          title={!sections || Object.keys(sections).length === 0 ? 'No hay contenido en el editor para guardar' : 'Guardar proyecto actual'}
        >
          <Save size={16} />
          Guardar Proyecto
        </button>
        
        {/* Botón para actualizar proyecto actual */}
        {currentProject && (
          <button 
            className="action-btn"
            onClick={() => {
              if (sections && Object.keys(sections).length > 0) {
                // Actualizar el proyecto actual sin mostrar modal
                const updatedProject = {
                  ...currentProject,
                  sections: sections,
                  updatedAt: new Date().toISOString()
                };
                
                saveProject(updatedProject).then(result => {
                  if (result.success) {
                    setMessage({ type: 'success', text: 'Proyecto actualizado exitosamente' });
                    setCurrentProject(result.project);
                    loadProjects();
                  } else {
                    setMessage({ type: 'error', text: 'Error al actualizar: ' + result.error });
                  }
                });
              } else {
                setMessage({ type: 'error', text: 'No hay contenido para actualizar' });
              }
            }}
            disabled={!sections || Object.keys(sections).length === 0}
            title="Actualizar el proyecto actual con los cambios del editor"
            style={{ background: '#10b981', color: 'white', borderColor: '#10b981' }}
          >
            <Save size={16} />
            Actualizar Proyecto
          </button>
        )}
        
        <button 
          className="action-btn"
          onClick={() => {
            // Crear un proyecto vacío y abrirlo en el editor
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
            }
          }}
          title="Crear un proyecto vacío para empezar desde cero"
        >
          <Plus size={16} />
          Crear Proyecto Vacío
        </button>
        
        <button 
          className="action-btn"
          onClick={() => setShowImportModal(true)}
        >
          <Upload size={16} />
          Importar
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

      {/* Projects List */}
      <div className="projects-list">
        {/* Páginas del Servidor */}
        {serverPages.length > 0 && (
          <div className="server-pages-section">
            <h3>Páginas del Servidor</h3>
            <div className="server-pages-grid">
              {serverPages.map(page => (
                <div key={page.id} className="project-card server-page">
                  <div className="project-info">
                    <div className="project-thumbnail">
                      <div className="thumbnail-placeholder server">
                        <FolderOpen size={24} />
                      </div>
                    </div>
                    <div className="project-details">
                      <h4>{page.name}</h4>
                      <p>{page.description || 'Página del servidor'}</p>
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
                      onClick={() => handleExportProject(page)}
                      title="Exportar"
                    >
                      <Download size={16} />
                    </button>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* Proyectos Locales */}
        <div className="local-projects-section">
          <h3>Proyectos Locales</h3>
          {filteredProjects.length === 0 ? (
            <div className="empty-state">
              <FolderOpen size={48} />
              <h3>No hay proyectos locales</h3>
              <p>Guarda tu primer proyecto para comenzar</p>
            </div>
          ) : (
            filteredProjects.map(project => (
              <div key={project.id} className="project-card">
                <div className="project-info">
                  <div className="project-thumbnail">
                    {project.thumbnail ? (
                      <img src={project.thumbnail} alt={project.name} />
                    ) : (
                      <div className="thumbnail-placeholder">
                        <FolderOpen size={24} />
                      </div>
                    )}
                  </div>
                  <div className="project-details">
                    <h4>{project.name}</h4>
                    <p>{project.description || 'Sin descripción'}</p>
                    <div className="project-meta">
                      <span className="date">
                        {formatDate(project.updatedAt)}
                      </span>
                      {project.tags.length > 0 && (
                        <div className="tags">
                          {project.tags.slice(0, 2).map(tag => (
                            <span key={tag} className="tag">{tag}</span>
                          ))}
                          {project.tags.length > 2 && (
                            <span className="tag-more">+{project.tags.length - 2}</span>
                          )}
                        </div>
                      )}
                    </div>
                  </div>
                </div>
                
                <div className="project-actions">
                  <button 
                    className="action-icon"
                    onClick={() => handleLoadProject(project)}
                    title="Editar proyecto"
                  >
                    <Edit3 size={16} />
                  </button>
                  <button 
                    className="action-icon"
                    onClick={() => handlePreviewProject(project)}
                    title="Vista previa"
                  >
                    <Eye size={16} />
                  </button>
                  <button 
                    className={`action-icon ${exportingProjects.has(project.id) ? 'loading' : ''}`}
                    onClick={() => handleExportProject(project)}
                    title={exportingProjects.has(project.id) ? 'Exportando...' : 'Exportar'}
                    disabled={loading || exportingProjects.has(project.id)}
                  >
                    {exportingProjects.has(project.id) ? (
                      <div className="loading-spinner" />
                    ) : (
                      <Download size={16} />
                    )}
                  </button>
                  <button 
                    className="action-icon danger"
                    onClick={() => handleDeleteProject(project.id)}
                    title="Eliminar"
                  >
                    <Trash2 size={16} />
                  </button>
                </div>
              </div>
            ))
          )}
        </div>
      </div>

      {/* Save Modal */}
      {showSaveModal && (
        <div className="modal-overlay">
          <div className="modal">
            <div className="modal-header">
              <h3>Guardar Proyecto</h3>
              <button onClick={() => setShowSaveModal(false)}>
                <X size={20} />
              </button>
            </div>
            <div className="modal-content">
              <div className="form-group">
                <label>Nombre del proyecto *</label>
                <input
                  type="text"
                  value={saveFormData.name}
                  onChange={(e) => setSaveFormData({...saveFormData, name: e.target.value})}
                  placeholder="Mi sitio web"
                />
              </div>
              <div className="form-group">
                <label>Descripción</label>
                <textarea
                  value={saveFormData.description}
                  onChange={(e) => setSaveFormData({...saveFormData, description: e.target.value})}
                  placeholder="Describe tu proyecto..."
                  rows={3}
                />
              </div>
              <div className="form-group">
                <label>Etiquetas (separadas por comas)</label>
                <input
                  type="text"
                  value={saveFormData.tags}
                  onChange={(e) => setSaveFormData({...saveFormData, tags: e.target.value})}
                  placeholder="negocio, portfolio, tienda"
                />
              </div>
            </div>
            <div className="modal-footer">
              <button 
                className="btn-secondary"
                onClick={() => setShowSaveModal(false)}
              >
                Cancelar
              </button>
              <button 
                className="btn-primary"
                onClick={handleSaveProject}
                disabled={loading}
              >
                {loading ? 'Guardando...' : 'Guardar'}
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Import Modal */}
      {showImportModal && (
        <div className="modal-overlay">
          <div className="modal">
            <div className="modal-header">
              <h3>Importar Proyecto</h3>
              <button onClick={() => setShowImportModal(false)}>
                <X size={20} />
              </button>
            </div>
            <div className="modal-content">
              <div className="import-area">
                <Upload size={48} />
                <p>Arrastra un archivo .json aquí o haz clic para seleccionar</p>
                <input
                  type="file"
                  accept=".json"
                  onChange={handleImportProject}
                  style={{ display: 'none' }}
                  id="import-file"
                />
                <label htmlFor="import-file" className="btn-primary">
                  Seleccionar archivo
                </label>
              </div>
            </div>
            <div className="modal-footer">
              <button 
                className="btn-secondary"
                onClick={() => setShowImportModal(false)}
              >
                Cancelar
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Website Selection Modal */}
      <WebsiteSelectionModal
        isOpen={showWebsiteModal}
        onClose={() => setShowWebsiteModal(false)}
        onSelectOption={handleWebsiteSelection}
      />

      {/* Message */}
      {message.text && (
        <div className={`message ${message.type}`}>
          {message.type === 'success' ? <Check size={16} /> : <AlertCircle size={16} />}
          <span>{message.text}</span>
          <button onClick={() => setMessage({ type: '', text: '' })}>
            <X size={16} />
          </button>
        </div>
      )}
    </div>
  );
};

export default WebsiteProjectManager; 