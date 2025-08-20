import React, { useState } from 'react';
import styled from 'styled-components';
import {
  Undo,
  Redo,
  Eye,
  EyeOff,
  Save,
  Download,
  Settings,
  Smartphone,
  Tablet,
  Monitor,
  ZoomIn,
  ZoomOut,
  RotateCcw,
  Copy,
  Scissors,
  Trash2,
  Layers,
  AlignLeft,
  AlignCenter,
  AlignRight,
  Bold,
  Italic,
  Underline,
  Link,
  Palette,
  ArrowLeft,
  Move,
  Edit3,
  Maximize2,
  Minimize2,
  FileText,
  Grid3X3,
  ExternalLink,
  Upload
} from 'lucide-react';
import { useEditor } from '../context/EditorContext';
import { downloadWebsite, previewWebsite, generateFullWebsite } from '../utils/exportUtils.jsx';
import { 
  exportProjectSimple, 
  saveProject, 
  createProjectData,
  getStorageInfo,
  canSaveProject,
  autoCleanupOldProjects,
  clearAllProjectsExcept,
  backupProjectBeforeCleanup
} from '../utils/projectStorage';
import APIs from '../services/services/APIs.jsx';

const ToolbarContainer = styled.div`
  height: 64px;
  background: linear-gradient(135deg, #ffffff 0%, #f8fafc 100%);
  border-bottom: 1px solid #e5e7eb;
  display: flex;
  align-items: center;
  padding: 0 24px;
  gap: 20px;
  box-shadow: 0 1px 3px rgba(0, 0, 0, 0.1);
  position: relative;
  z-index: 100;
`;

const ToolbarSection = styled.div`
  display: flex;
  align-items: center;
  gap: 8px;
  padding: 8px 0;
  
  &:not(:last-child) {
    border-right: 1px solid #e5e7eb;
    padding-right: 20px;
    margin-right: 12px;
  }
`;

const LogoSection = styled.div`
  display: flex;
  align-items: center;
  gap: 12px;
  margin-right: 20px;
`;

const Logo = styled.div`
  font-size: 24px;
  font-weight: 800;
  background: linear-gradient(135deg, #3b82f6, #1d4ed8);
  -webkit-background-clip: text;
  -webkit-text-fill-color: transparent;
  background-clip: text;
  font-family: 'Inter', system-ui, sans-serif;
`;

const BackButton = styled.button`
  display: flex;
  align-items: center;
  gap: 8px;
  padding: 8px 16px;
  background: #f3f4f6;
  border: 1px solid #d1d5db;
  border-radius: 8px;
  color: #374151;
  font-size: 14px;
  font-weight: 500;
  cursor: pointer;
  transition: all 0.2s ease;
  font-family: 'Inter', system-ui, sans-serif;
  
  &:hover {
    background: #e5e7eb;
    color: #111827;
    transform: translateY(-1px);
  }
`;

const ToolbarButton = styled.button`
  display: flex;
  align-items: center;
  justify-content: center;
  width: 40px;
  height: 40px;
  background: ${props => props.$active ? 'linear-gradient(135deg, #3b82f6, #1d4ed8)' : '#ffffff'};
  color: ${props => props.$active ? '#ffffff' : '#6b7280'};
  border: 1px solid ${props => props.$active ? '#3b82f6' : '#e5e7eb'};
  border-radius: 10px;
  cursor: pointer;
  transition: all 0.2s ease;
  font-size: 16px;
  position: relative;
  box-shadow: ${props => props.$active ? '0 4px 12px rgba(59, 130, 246, 0.25)' : '0 1px 3px rgba(0, 0, 0, 0.1)'};
  
  &:hover {
    background: ${props => props.$active ? 'linear-gradient(135deg, #2563eb, #1e40af)' : '#f9fafb'};
    color: ${props => props.$active ? '#ffffff' : '#374151'};
    transform: translateY(-1px);
    box-shadow: 0 4px 12px rgba(0, 0, 0, 0.15);
  }
  
  &:disabled {
    opacity: 0.4;
    cursor: not-allowed;
    transform: none;
    
    &:hover {
      transform: none;
      box-shadow: 0 1px 3px rgba(0, 0, 0, 0.1);
    }
  }
`;

const DropdownButton = styled.button`
  display: flex;
  align-items: center;
  gap: 8px;
  padding: 8px 16px;
  background: #ffffff;
  border: 1px solid #e5e7eb;
  border-radius: 10px;
  color: #374151;
  font-size: 14px;
  font-weight: 500;
  cursor: pointer;
  transition: all 0.2s ease;
  min-width: 120px;
  height: 40px;
  font-family: 'Inter', system-ui, sans-serif;
  box-shadow: 0 1px 3px rgba(0, 0, 0, 0.1);
  
  &:hover {
    background: #f9fafb;
    border-color: #d1d5db;
    transform: translateY(-1px);
    box-shadow: 0 4px 12px rgba(0, 0, 0, 0.15);
  }
`;

const DropdownMenu = styled.div`
  position: absolute;
  top: 100%;
  left: 0;
  background: #ffffff;
  border: 1px solid #e5e7eb;
  border-radius: 12px;
  box-shadow: 0 8px 32px rgba(0, 0, 0, 0.12);
  padding: 8px;
  min-width: 160px;
  z-index: 1001;
  margin-top: 4px;
`;

const DropdownItem = styled.button`
  width: 100%;
  display: flex;
  align-items: center;
  gap: 12px;
  padding: 10px 12px;
  background: none;
  border: none;
  border-radius: 8px;
  color: #374151;
  font-size: 14px;
  cursor: pointer;
  transition: all 0.2s ease;
  text-align: left;
  font-family: 'Inter', system-ui, sans-serif;
  
  &:hover {
    background: #f3f4f6;
    color: #111827;
  }
  
  &.active {
    background: #eff6ff;
    color: #3b82f6;
  }
`;

const ZoomInput = styled.input`
  width: 60px;
  padding: 6px 8px;
  border: 1px solid #e5e7eb;
  border-radius: 6px;
  text-align: center;
  font-size: 14px;
  font-weight: 500;
  background: #ffffff;
  color: #374151;
  font-family: 'Inter', system-ui, sans-serif;
  
  &:focus {
    outline: none;
    border-color: #3b82f6;
    box-shadow: 0 0 0 3px rgba(59, 130, 246, 0.1);
  }
`;

const ModeToggle = styled.button`
  display: flex;
  align-items: center;
  gap: 8px;
  padding: 8px 16px;
  background: ${props => props.$active ? 'linear-gradient(135deg, #10b981, #047857)' : '#ffffff'};
  color: ${props => props.$active ? '#ffffff' : '#374151'};
  border: 1px solid ${props => props.$active ? '#10b981' : '#e5e7eb'};
  border-radius: 10px;
  cursor: pointer;
  transition: all 0.2s ease;
  font-size: 14px;
  font-weight: 500;
  height: 40px;
  font-family: 'Inter', system-ui, sans-serif;
  box-shadow: ${props => props.$active ? '0 4px 12px rgba(16, 185, 129, 0.25)' : '0 1px 3px rgba(0, 0, 0, 0.1)'};
  
  &:hover {
    background: ${props => props.$active ? 'linear-gradient(135deg, #059669, #065f46)' : '#f9fafb'};
    transform: translateY(-1px);
    box-shadow: 0 4px 12px rgba(0, 0, 0, 0.15);
  }
`;

const SaveButton = styled.button`
  display: flex;
  align-items: center;
  gap: 8px;
  padding: 8px 20px;
  background: linear-gradient(135deg, #3b82f6, #1d4ed8);
  color: #ffffff;
  border: none;
  border-radius: 10px;
  cursor: pointer;
  transition: all 0.2s ease;
  font-size: 14px;
  font-weight: 600;
  height: 40px;
  font-family: 'Inter', system-ui, sans-serif;
  box-shadow: 0 4px 12px rgba(59, 130, 246, 0.25);
  
  &:hover {
    background: linear-gradient(135deg, #2563eb, #1e40af);
    transform: translateY(-1px);
    box-shadow: 0 6px 16px rgba(59, 130, 246, 0.3);
  }
`;

const Separator = styled.div`
  width: 1px;
  height: 24px;
  background: #e5e7eb;
  margin: 0 4px;
`;

const Toolbar = ({ isPreviewMode, setIsPreviewMode, onBackToDashboard }) => {
  const [notification, setNotification] = useState(null);
  
  const {
    zoom,
    setZoom,
    undo,
    redo,
    history,
    historyIndex,
    canvasWidth,
    canvasHeight,
    setCanvasSize,
    selectedElementId,
    elements,
    showGuides,
    setShowGuides,
    canvasBackground,
    setCanvasBackground,
    sections,
    currentSection,
    projectMetadata
  } = useEditor();

  // Estados para dropdowns
  const [deviceDropdownOpen, setDeviceDropdownOpen] = useState(false);
  const [exportDropdownOpen, setExportDropdownOpen] = useState(false);

  const [showColorPicker, setShowColorPicker] = useState(false);

  // Canvas sizes presets
  const canvasSizes = {
    desktop: { width: 1200, height: 800, icon: Monitor, label: 'Desktop' },
    tablet: { width: 768, height: 1024, icon: Tablet, label: 'Tablet' },
    mobile: { width: 375, height: 667, icon: Smartphone, label: 'Mobile' }
  };

  const currentSize = Object.entries(canvasSizes).find(
    ([key, size]) => size.width === canvasWidth && size.height === canvasHeight
  );

  const handleCanvasSizeInput = (dimension, value) => {
    const numValue = parseInt(value) || 800;
    if (dimension === 'width') {
      setCanvasSize(numValue, canvasHeight);
    } else {
      setCanvasSize(canvasWidth, numValue);
    }
  };

  const handleZoomChange = (newZoom) => {
    const clampedZoom = Math.max(25, Math.min(200, newZoom));
    setZoom(clampedZoom);
  };

  const handleCanvasSizeChange = (sizeKey) => {
    const size = canvasSizes[sizeKey];
    setCanvasSize(size.width, size.height);
    setDeviceDropdownOpen(false);
  };

  const showNotification = (message, type = 'success') => {
    setNotification({ message, type, visible: true });
    setTimeout(() => setNotification({ message: '', type: 'success', visible: false }), 5000);
  };

  const handleEmergencyCleanup = () => {
    try {
      const projectId = 'proyecto-actual-editor';
      const result = clearAllProjectsExcept(projectId);
      
      if (result.success) {
        showNotification('Limpieza de emergencia completada. Solo se mantiene el proyecto actual.', 'warning');
      } else {
        showNotification('Error en limpieza de emergencia: ' + result.error, 'error');
      }
    } catch (error) {
      showNotification('Error en limpieza de emergencia: ' + error.message, 'error');
    }
  };

  const handleSave = async () => {
    try {
      console.log('=== INICIO GUARDADO DESDE TOOLBAR ===');
      
      if (!sections || Object.keys(sections).length === 0) {
        showNotification('No hay contenido en el editor para guardar. Primero crea un sitio web.', 'error');
        return;
      }

      // Verificar que tenemos la información necesaria para guardar
      if (!projectMetadata?.id_sucursal) {
        showNotification('No se puede guardar: falta información de la sucursal. Asegúrate de cargar un proyecto del servidor.', 'error');
        return;
      }

      // Generar el HTML completo
      const fullWebsiteHtml = generateFullWebsite(sections, 'home', projectMetadata.id_sucursal);
      const fullWebsiteJson = JSON.stringify(sections);

      // Preparar datos para la API savePage
      const apiData = {
        contenido_html: fullWebsiteHtml, // HTML completo generado
        contenido: fullWebsiteJson, // JSON de las secciones como string
        nombre: projectMetadata.sucursal || 'Pagina MG', // Nombre de la sucursal
        id_sucursal: projectMetadata.id_sucursal, // ID de la sucursal del contexto
        fecha_actualizacion: new Date().toISOString() // Fecha de actualización
      };

      console.log('2. Datos preparados para API savePage:', apiData);
      console.log('3. Metadatos del proyecto:', projectMetadata);
      
      // Llamar a la API savePage
      try {
        const apiResponse = await APIs.savePage(apiData);
        showNotification('Página guardada exitosamente en el servidor', 'success');
        console.log('Respuesta de savePage:', apiResponse);
   
        
      } catch (apiError) {
        console.error('5. Error al guardar en API savePage:', apiError);
        showNotification('Error al guardar en el servidor: ' + apiError.message, 'error');
        return; // No continuar si falla el guardado en API
      }

      // Guardar localmente como respaldo
      // try {
      //   console.log('6. Guardando respaldo local...');
        
      //   // ID fijo para sobrescribir el mismo proyecto
      //   const projectId = 'proyecto-actual-editor';
        
      //   // Crear datos del proyecto para guardar (sobrescribiendo)
      //   const projectData = createProjectData(sections, {
      //     name: 'Mi Proyecto Web',
      //     description: 'Proyecto guardado desde el editor',
      //     tags: ['editor', 'guardado'],
      //     id: projectId,
      //     createdAt: new Date().toISOString(),
      //     updatedAt: new Date().toISOString()
      //   });

      //   console.log('7. Datos del proyecto preparados:', projectData);
        
      //   // Verificar si se puede guardar el proyecto
      //   const saveCheck = canSaveProject(projectData);
      //   console.log('8. Verificación de almacenamiento:', saveCheck);
        
      //   if (!saveCheck.canSave) {
      //     console.log('9. Espacio insuficiente, intentando limpiar automáticamente...');
          
      //     // Intentar limpieza automática
      //     const cleanupResult = autoCleanupOldProjects();
      //     console.log('10. Resultado de limpieza automática:', cleanupResult);
          
      //     // Verificar nuevamente después de la limpieza
      //     const newSaveCheck = canSaveProject(projectData);
      //     console.log('11. Nueva verificación después de limpieza:', newSaveCheck);
          
      //     if (!newSaveCheck.canSave) {
      //       // Crear respaldo antes de limpiar todo
      //       console.log('12. Creando respaldo antes de limpieza completa...');
      //       const backupResult = backupProjectBeforeCleanup(projectData);
      //       console.log('13. Resultado del respaldo:', backupResult);
            
      //       if (backupResult.success) {
      //         showNotification(`Respaldo creado: ${backupResult.backupFile}. Limpiando almacenamiento...`, 'warning');
      //       }
            
      //       // Limpiar todos los proyectos excepto el actual
      //       const clearResult = clearAllProjectsExcept(projectId);
      //       console.log('14. Resultado de limpieza completa:', clearResult);
            
      //       if (!clearResult.success) {
      //         throw new Error('No se pudo limpiar el almacenamiento. Intenta exportar tu trabajo y limpiar manualmente.');
      //       }
      //     }
      //   }
        
      //   // Guardar el proyecto localmente
      //   const result = await saveProject(projectData);
      //   console.log('15. Resultado del guardado local:', result);
        
      //   if (result.success) {
      //     // Mostrar información del almacenamiento
      //     const storageInfo = getStorageInfo();
      //     const message = `Respaldo local guardado. Almacenamiento: ${Math.round(storageInfo.usagePercentage)}% usado`;
      //     showNotification(message);
      //     console.log('16. Respaldo local guardado correctamente');
      //   } else {
      //     showNotification('Error al guardar el respaldo local: ' + result.error, 'warning');
      //     console.error('16. Error al guardar localmente:', result.error);
      //   }
        
      // } catch (localError) {
      //   console.error('17. Error al guardar localmente:', localError);
      //   showNotification('Página guardada en servidor, pero error al guardar respaldo local: ' + localError.message, 'warning');
      // }
      

      
    } catch (error) {
      console.error('=== ERROR EN GUARDADO DESDE TOOLBAR ===');
      console.error('Error completo:', error);
      
      // Proporcionar sugerencias específicas según el tipo de error
      let errorMessage = error.message;
      if (error.name === 'QuotaExceededError' || error.code === 22) {
        errorMessage = 'El almacenamiento está lleno. Intenta: 1) Exportar tu trabajo actual, 2) Limpiar el caché del navegador, 3) Usar un navegador diferente.';
      }
      
      showNotification('Error al guardar el proyecto: ' + errorMessage, 'error');
      console.log('=== FIN ERROR ===');
    }
  };

  const handleExport = () => {
    try {
      console.log('=== INICIO EXPORTACIÓN DESDE TOOLBAR ===');
      console.log('1. Secciones disponibles:', Object.keys(sections));
      
      // Crear datos del proyecto para exportar
      const projectData = {
        name: 'Mi Proyecto Web',
        description: 'Proyecto exportado desde el editor',
        sections: sections,
        createdAt: new Date().toISOString(),
        updatedAt: new Date().toISOString(),
        tags: ['exportado', 'editor'],
        version: '1.0.0'
      };
      
      console.log('2. Datos del proyecto preparados:', projectData);
      
      // Exportar usando la función simple
      const result = exportProjectSimple(projectData, 'mi-proyecto-web.json');
      
      console.log('3. Exportación completada:', result);
      console.log('=== FIN EXPORTACIÓN DESDE TOOLBAR ===');
      
    } catch (error) {
      console.error('=== ERROR EN EXPORTACIÓN DESDE TOOLBAR ===');
      console.error('Error completo:', error);
      console.error('=== FIN ERROR ===');
    }
  };

  const handleExportHTML = () => {
    // Usar id_sucursal del contexto del editor si está disponible, sino usar null (que usará el fallback)
    const sucursalId = projectMetadata?.id_sucursal || null;
    downloadWebsite(sections, 'mi-sitio-web.html', sucursalId);
    console.log('Sitio web multi-sección exportado exitosamente con id_sucursal:', sucursalId);
  };

  const handlePreviewWebsite = () => {
    // Usar id_sucursal del contexto del editor si está disponible, sino usar null (que usará el fallback)
    const sucursalId = projectMetadata?.id_sucursal || null;
    previewWebsite(sections, sucursalId);
  };

  const handleImportJSON = () => {
    console.log('🔄 Iniciando importación JSON...');
    
    // Crear un input de archivo oculto
    const fileInput = document.createElement('input');
    fileInput.type = 'file';
    fileInput.accept = '.json';
    fileInput.style.display = 'none';
    
    fileInput.onchange = async (event) => {
      const file = event.target.files[0];
      if (!file) return;
      
      console.log('🔄 Archivo seleccionado:', file.name);
      
      try {
        const text = await file.text();
        const projectData = JSON.parse(text);
        
        console.log('🔄 JSON parseado:', projectData);
        console.log('🔄 Secciones encontradas:', Object.keys(projectData.sections || {}));
        
        // Validar que el archivo tenga la estructura correcta
        if (!projectData.sections || typeof projectData.sections !== 'object') {
          showNotification('El archivo JSON no tiene la estructura correcta. Debe contener un objeto "sections".', 'error');
          return;
        }
        
        // Validar que las secciones tengan la estructura correcta
        const validSections = {};
        let hasValidContent = false;
        
        for (const [sectionKey, section] of Object.entries(projectData.sections)) {
          if (section && typeof section === 'object' && section.elements && Array.isArray(section.elements)) {
            validSections[sectionKey] = {
              ...section,
              id: section.id || sectionKey,
              name: section.name || sectionKey,
              slug: section.slug || sectionKey,
              isHome: section.isHome || sectionKey === 'home'
            };
            hasValidContent = true;
            console.log(`🔄 Sección "${sectionKey}" válida con ${section.elements.length} elementos`);
          }
        }
        
        if (!hasValidContent) {
          showNotification('El archivo no contiene secciones válidas con elementos.', 'error');
          return;
        }
        
        // Crear un proyecto con los datos importados
        const importedProject = {
          name: projectData.name || 'Proyecto Importado',
          description: projectData.description || 'Proyecto importado desde archivo JSON',
          sections: validSections,
          createdAt: projectData.createdAt || new Date().toISOString(),
          updatedAt: new Date().toISOString(),
          tags: projectData.tags || ['importado'],
          version: projectData.version || '1.0.0',
          // Mantener metadatos del proyecto actual si existen
          ...(projectMetadata && {
            id_sucursal: projectMetadata.id_sucursal,
            empresa: projectMetadata.empresa,
            sucursal: projectMetadata.sucursal
          })
        };
        
        console.log('🔄 Proyecto preparado para importar:', importedProject);
        
        // Disparar evento para cargar el proyecto
        const loadEvent = new CustomEvent('loadProject', {
          detail: {
            project: importedProject
          }
        });
        
        console.log('🔄 Disparando evento loadProject:', loadEvent);
        window.dispatchEvent(loadEvent);
        
        showNotification(`Proyecto "${importedProject.name}" importado exitosamente con ${Object.keys(validSections).length} secciones`, 'success');
        
      } catch (error) {
        console.error('Error al importar JSON:', error);
        if (error.name === 'SyntaxError') {
          showNotification('El archivo no es un JSON válido. Verifica el formato del archivo.', 'error');
        } else {
          showNotification('Error al leer el archivo: ' + error.message, 'error');
        }
      }
      
      // Limpiar el input
      document.body.removeChild(fileInput);
    };
    
    // Agregar el input al DOM y hacer clic en él
    document.body.appendChild(fileInput);
    fileInput.click();
  };

  const selectedElement = elements && elements.find ? elements.find(el => el.id === selectedElementId) : null;

  // Cerrar dropdowns cuando se hace clic fuera
  React.useEffect(() => {
    const handleClickOutside = (event) => {
      if (!event.target.closest('.dropdown-container')) {
        setDeviceDropdownOpen(false);
        setExportDropdownOpen(false);
      }
    };

    document.addEventListener('mousedown', handleClickOutside);
    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, []);

  return (
    <ToolbarContainer>
      {/* Logo y navegación */}
      <LogoSection>
        <Logo>HiPlot</Logo>
        <BackButton onClick={onBackToDashboard}>
          <ArrowLeft size={16} />
          Volver al Dashboard
        </BackButton>
      </LogoSection>

      {/* Herramientas de edición */}
      <ToolbarSection>
        <ToolbarButton
          onClick={undo}
          disabled={historyIndex <= 0}
          title="Deshacer (Ctrl+Z)"
        >
          <Undo size={18} />
        </ToolbarButton>
        <ToolbarButton
          onClick={redo}
          disabled={historyIndex >= history.length - 1}
          title="Rehacer (Ctrl+Y)"
        >
          <Redo size={18} />
        </ToolbarButton>
      </ToolbarSection>

      {/* Zoom y vista */}
      <ToolbarSection>
        <ToolbarButton
          onClick={() => handleZoomChange(zoom - 10)}
          disabled={zoom <= 25}
          title="Reducir zoom"
        >
          <ZoomOut size={18} />
        </ToolbarButton>
        <ZoomInput
          type="number"
          value={zoom}
          onChange={(e) => handleZoomChange(parseInt(e.target.value) || 100)}
          min="25"
          max="200"
        />
        <span style={{ fontSize: '14px', color: '#6b7280', fontWeight: '500' }}>%</span>
        <ToolbarButton
          onClick={() => handleZoomChange(zoom + 10)}
          disabled={zoom >= 200}
          title="Aumentar zoom"
        >
          <ZoomIn size={18} />
        </ToolbarButton>
      </ToolbarSection>

      {/* Tamaño del canvas */}
      <ToolbarSection>
        <div style={{ position: 'relative' }} className="dropdown-container">
          <DropdownButton
            onClick={() => setDeviceDropdownOpen(!deviceDropdownOpen)}
          >
            {currentSize ? (
              <>
                {React.createElement(currentSize[1].icon, { size: 16 })}
                {currentSize[1].label}
              </>
            ) : (
              <>
                <Monitor size={16} />
                Personalizado
              </>
            )}
          </DropdownButton>

          {deviceDropdownOpen && (
            <DropdownMenu>
              {Object.entries(canvasSizes).map(([key, size]) => (
                <DropdownItem
                  key={key}
                  onClick={() => handleCanvasSizeChange(key)}
                  className={currentSize && currentSize[0] === key ? 'active' : ''}
                >
                  {React.createElement(size.icon, { size: 16 })}
                  {size.label}
                  <span style={{ fontSize: '12px', opacity: 0.7 }}>
                    {size.width}×{size.height}
                  </span>
                </DropdownItem>
              ))}
            </DropdownMenu>
          )}
        </div>
        
        {/* Controles manuales de tamaño */}
        <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
          <span style={{ fontSize: '12px', color: '#6b7280', fontWeight: '500' }}>W:</span>
          <ZoomInput
            type="number"
            value={canvasWidth}
            disabled
            style={{ width: '60px', background: '#f3f4f6', color: '#9ca3af', cursor: 'not-allowed' }}
          />
          <span style={{ fontSize: '12px', color: '#6b7280', fontWeight: '500' }}>H:</span>
          <ZoomInput
            type="number"
            value={canvasHeight}
            onChange={(e) => handleCanvasSizeInput('height', e.target.value)}
            min="400"
            max="5000"
            style={{ width: '60px' }}
          />
        </div>
      </ToolbarSection>





      {/* Elemento seleccionado */}
      {selectedElement && (
        <ToolbarSection>
          <span style={{
            fontSize: '14px',
            color: '#6b7280',
            fontWeight: '500',
            fontFamily: 'Inter, system-ui, sans-serif'
          }}>
            Seleccionado:
          </span>
          <span style={{
            fontSize: '14px',
            color: '#374151',
            fontWeight: '600',
            fontFamily: 'Inter, system-ui, sans-serif'
          }}>
            {selectedElement.type}
          </span>
        </ToolbarSection>
      )}



      {/* Spacer */}
      <div style={{ flex: 1 }} />

      {/* Acciones principales */}
      <ToolbarSection>
        <ModeToggle
          $active={isPreviewMode}
          onClick={() => setIsPreviewMode(!isPreviewMode)}
        >
          {isPreviewMode ? <Edit3 size={16} /> : <Eye size={16} />}
          {isPreviewMode ? 'Editar' : 'Vista previa'}
        </ModeToggle>

        <div style={{ position: 'relative' }} className="dropdown-container">
          <DropdownButton
            onClick={() => setExportDropdownOpen(!exportDropdownOpen)}
          >
            <FileText size={16} />
            Exportar
          </DropdownButton>

          {exportDropdownOpen && (
            <DropdownMenu>
              <DropdownItem onClick={() => {
                handlePreviewWebsite();
                setExportDropdownOpen(false);
              }}>
                <ExternalLink size={16} />
                Vista Previa Web
                <span style={{ fontSize: '12px', opacity: 0.7 }}>
                  Abrir en nueva ventana
                </span>
              </DropdownItem>
              <DropdownItem onClick={() => {
                handleExportHTML();
                setExportDropdownOpen(false);
              }}>
                <FileText size={16} />
                Exportar Sitio Web
                <span style={{ fontSize: '12px', opacity: 0.7 }}>
                  Archivo .html completo
                </span>
              </DropdownItem>
              <DropdownItem onClick={() => {
                handleExport();
                setExportDropdownOpen(false);
              }}>
                <Download size={16} />
                Exportar Proyecto
                <span style={{ fontSize: '12px', opacity: 0.7 }}>
                  Archivo .json
                </span>
              </DropdownItem>
              <DropdownItem onClick={() => {
                handleImportJSON();
                setExportDropdownOpen(false);
              }}>
                <Upload size={16} />
                Importar JSON
                <span style={{ fontSize: '12px', opacity: 0.7 }}>
                  Cargar proyecto existente
                </span>
              </DropdownItem>
              <DropdownItem onClick={() => {
                const result = autoCleanupOldProjects();
                showNotification(result.message, result.success ? 'success' : 'error');
                setExportDropdownOpen(false);
              }}>
                <Trash2 size={16} />
                Limpiar Proyectos Antiguos
                <span style={{ fontSize: '12px', opacity: 0.7 }}>
                  Liberar espacio automáticamente
                </span>
              </DropdownItem>
              <DropdownItem onClick={() => {
                handleEmergencyCleanup();
                setExportDropdownOpen(false);
              }}>
                <Trash2 size={16} />
                Limpieza de Emergencia
                <span style={{ fontSize: '12px', opacity: 0.7 }}>
                  Eliminar todos excepto el actual
                </span>
              </DropdownItem>
            </DropdownMenu>
          )}
        </div>

        {/* Botón de Importar JSON más visible */}
        <ToolbarButton
          onClick={handleImportJSON}
          title="Importar proyecto desde archivo JSON"
          style={{
            background: 'linear-gradient(135deg, #10b981, #047857)',
            color: '#ffffff',
            borderColor: '#10b981',
            boxShadow: '0 4px 12px rgba(16, 185, 129, 0.25)',
            minWidth: '44px'
          }}
        >
          <Upload size={18} />
        </ToolbarButton>

        <Separator />

        <SaveButton onClick={handleSave}>
          <Save size={16} />
          Guardar
        </SaveButton>
        
        {/* Botón de gestión de almacenamiento */}
        <ToolbarButton
          onClick={() => {
            const storageInfo = getStorageInfo();
            const message = `Almacenamiento: ${Math.round(storageInfo.usagePercentage)}% usado (${(storageInfo.currentSize / 1024 / 1024).toFixed(1)}MB / ${(storageInfo.maxSize / 1024 / 1024).toFixed(1)}MB)`;
            showNotification(message, storageInfo.isNearLimit ? 'warning' : 'info');
          }}
          title="Ver información de almacenamiento"
          style={{ 
            backgroundColor: getStorageInfo().isNearLimit ? '#fef3c7' : 'transparent',
            borderColor: getStorageInfo().isNearLimit ? '#f59e0b' : '#d1d5db'
          }}
        >
          <Settings size={16} />
        </ToolbarButton>
        <ToolbarButton
          title="Color de fondo del canvas"
          onClick={() => setShowColorPicker(v => !v)}
          style={{ position: 'relative' }}
        >
          <Palette size={20} />
        </ToolbarButton>
        {showColorPicker && (
          <div style={{ position: 'absolute', top: 50, left: 0, background: '#fff', border: '1px solid #e5e7eb', borderRadius: 8, padding: 8, zIndex: 999, boxShadow: '0 4px 16px rgba(0,0,0,0.10)' }}>
            <input
              type="color"
              value={canvasBackground}
              onChange={e => setCanvasBackground(e.target.value)}
              style={{ width: 40, height: 40, border: 'none', background: 'none', cursor: 'pointer' }}
            />
          </div>
        )}
      </ToolbarSection>
      
      {/* Notificación */}
      {notification && (
        <div style={{
          position: 'fixed',
          top: '80px',
          right: '20px',
          padding: '12px 20px',
          borderRadius: '8px',
          color: 'white',
          fontWeight: '500',
          zIndex: 1000,
          background: notification.type === 'error' ? '#ef4444' : '#10b981',
          boxShadow: '0 4px 12px rgba(0, 0, 0, 0.15)',
          transform: 'translateX(0)',
          transition: 'transform 0.3s ease',
          animation: 'slideInRight 0.3s ease'
        }}>
          {notification.message}
        </div>
      )}
      
      <style>
        {`
          @keyframes slideInRight {
            from {
              transform: translateX(100%);
              opacity: 0;
            }
            to {
              transform: translateX(0);
              opacity: 1;
            }
          }
        `}
      </style>
    </ToolbarContainer>
  );
};

export default Toolbar; 