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
  Grid3X3
} from 'lucide-react';
import { useEditor } from '../context/EditorContext';

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
  z-index: 1000;
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
    setCanvasBackground
  } = useEditor();

  // Estados para dropdowns
  const [deviceDropdownOpen, setDeviceDropdownOpen] = useState(false);
  const [exportDropdownOpen, setExportDropdownOpen] = useState(false);
  const [cursoMode, setCursoMode] = useState(false);
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

  const handleSave = () => {
    // Implementar guardar
    console.log('Guardando proyecto...');
  };

  const handleExport = () => {
    // Implementar exportar
    console.log('Exportando proyecto...');
  };

  const handleExportHTML = () => {
    // Generar HTML del proyecto
    const generateStyleString = (styles = {}, extra = {}) => {
      // Convierte el objeto de estilos en un string CSS inline
      return Object.entries({ ...styles, ...extra })
        .filter(([_, v]) => v !== undefined && v !== null && v !== '')
        .map(([k, v]) => `${k.replace(/([A-Z])/g, '-$1').toLowerCase()}: ${v};`)
        .join(' ');
    };

    // Obtener padding y offset del canvas/área de trabajo
    const CANVAS_PADDING = 40; // igual que en CanvasContainer
    const CONTAINER_MAX_WIDTH = 1500;
    const CONTAINER_BG = canvasBackground || '#fff';
    const CONTAINER_RADIUS = 0;
    const CANVAS_AREA_BG = canvasBackground || '#fff';
    const CANVAS_AREA_RADIUS = 16;
    // Calcular altura del header (si existe)
    const headerElement = elements.find(e => e.type === 'header');
    let headerHeight = 0;
    if (headerElement) {
      const h = headerElement.size?.height || headerElement.styles?.height || 80;
      headerHeight = typeof h === 'string' ? parseInt(h) : h;
      if (isNaN(headerHeight)) headerHeight = 80;
    }

    // Calcular el offset mínimo de todos los elementos para hacer posiciones relativas
    const minX = Math.min(...elements.map(e => e.position?.x ?? 0), 0);
    const minY = Math.min(...elements.map(e => e.position?.y ?? 0), 0);

    const generateHTML = (elements, isRoot = true) => {
      let html = '';
      elements.forEach(element => {
        // Estilos base
        let baseStyles;
        if (isRoot) {
          if (element.type === 'header') {
            baseStyles = {
              position: 'absolute',
              left: (element.position?.x == null || element.position?.x === false) ? '0px' : (element.position?.x + 'px'),
              top: (element.position?.y == null || element.position?.y === false) ? '0px' : (element.position?.y + 'px'),
              width: element.size?.width || '1450px',
              height: element.size?.height || 'auto',
            };
          } else {
            baseStyles = {
              position: 'absolute',
              left: (element.position?.x == null || element.position?.x === false) ? '0px' : (element.position?.x + 'px'),
              top: (element.position?.y == null || element.position?.y === false) ? '0px' : (element.position?.y + 'px'),
              width: element.size?.width || '1450px',
              height: element.size?.height || 'auto',
            };
          }
        } else {
          baseStyles = {};
        }
        baseStyles = { ...baseStyles, ...element.styles };

        // Quitar border-radius y padding de 20px por defecto en contenedores
        if (["container", "section", "grid", "columns"].includes(element.type)) {
          if (baseStyles.borderRadius === undefined || baseStyles.borderRadius === '12px' || baseStyles.borderRadius === '0' || baseStyles.borderRadius === 0) {
            delete baseStyles.borderRadius;
          }
          if (baseStyles.padding === undefined || baseStyles.padding === '20px' || baseStyles.padding === '40px 20px' || baseStyles.padding === '80px 0') {
            delete baseStyles.padding;
          }
        }
        if (!('padding' in element.styles)) delete baseStyles.padding;
        if (!('margin' in element.styles)) delete baseStyles.margin;

        switch (element.type) {
          case 'text':
            html += `<div style="${generateStyleString(baseStyles)}">${element.props?.content || 'Texto'}</div>`;
            break;
          case 'heading':
            const headingLevel = element.props?.level || 1;
            html += `<h${headingLevel} style="${generateStyleString(baseStyles)}">${element.props?.content || 'Título'}</h${headingLevel}>`;
            break;
          case 'button':
            if (!('background' in element.styles)) baseStyles.background = 'linear-gradient(135deg, #3b82f6, #1d4ed8)';
            if (!('border' in element.styles)) baseStyles.border = 'none';
            html += `<button style="${generateStyleString(baseStyles)}">${element.props?.text || 'Botón'}</button>`;
            break;
          case 'image':
            html += `<img src="${element.props?.src || ''}" alt="${element.props?.alt || 'Imagen'}" style="${generateStyleString(baseStyles, { objectFit: element.styles?.objectFit || 'cover' })}">`;
            break;
          case 'container':
          case 'section':
          case 'grid':
          case 'columns': {
            if (!('display' in element.styles)) delete baseStyles.display;
            if (!('alignItems' in element.styles)) delete baseStyles.alignItems;
            if (!('justifyContent' in element.styles)) delete baseStyles.justifyContent;
            html += `<div style="${generateStyleString(baseStyles)}">`;
            if (element.children && element.children.length > 0) {
              html += generateHTML(element.children, false);
            }
            html += '</div>';
            break;
          }
          case 'card':
            html += `<div style="${generateStyleString(baseStyles)}">`;
            html += `<h3 style="margin:0 0 12px 0;font-size:24px;font-weight:700;color:#111827;font-family:'Inter',system-ui,sans-serif;">${element.props?.title || 'Título de la Tarjeta'}</h3>`;
            html += `<p style="margin:0;font-size:16px;color:#6b7280;line-height:1.6;font-family:'Inter',system-ui,sans-serif;">${element.props?.content || 'Descripción de la tarjeta con información relevante.'}</p>`;
            html += '</div>';
            break;
          default:
            html += `<div style="${generateStyleString(baseStyles)}">Elemento ${element.type}</div>`;
        }
      });
      return html;
    };

    // --- Generar HTML exportado ---
    const getUsedFonts = (elements, fonts = new Set()) => {
      elements.forEach(element => {
        if (element.styles?.fontFamily) {
          fonts.add(element.styles.fontFamily.replace(/['"]/g, ''));
        }
        if (element.children) getUsedFonts(element.children, fonts);
      });
      return fonts;
    };

    const usedFonts = Array.from(getUsedFonts(elements));
    const googleFontLinks = usedFonts
      .filter(font => [
        'Roboto','Montserrat','Lato','Oswald','Poppins','Merriweather','Nunito','Raleway','Playfair Display','Fira Sans','Ubuntu','Quicksand','Rubik','Bebas Neue'
      ].includes(font))
      .map(font => `<link href="https://fonts.googleapis.com/css?family=${encodeURIComponent(font)}:400,700&display=swap" rel="stylesheet">`).join('\n');

    const fullHTML = `<!DOCTYPE html>
<html lang="es">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>Página Web Generada - HiPlot</title>
    ${googleFontLinks}
    <style>
        body {
            margin: 0;
            padding: 0;
            font-family: 'Inter', system-ui, sans-serif;
            background: ${canvasBackground};
        }
        .container {
            position: relative;
            width: 100%;
            max-width: 1450px;
            min-height: 800px;
            margin: 0 auto;
            background: ${CONTAINER_BG};
            border-radius: ${CONTAINER_RADIUS}px;
            box-shadow: none;
            padding: 0;
        }
        .canvas-area {
           width: 1450px;
           position: relative;
           border: 1px solid #e5e7eb;
           padding: 0;
        }
    </style>
</head>
<body>
    <div class="container">
      <div class="canvas-area">
        ${generateHTML(elements)}
      </div>
    </div>
</body>
</html>`;

    // Crear y descargar el archivo
    const blob = new Blob([fullHTML], { type: 'text/html' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = 'pagina-web-hiplot.html';
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    URL.revokeObjectURL(url);

    console.log('HTML exportado exitosamente');
  };

  const selectedElement = elements.find(el => el.id === selectedElementId);

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
            value={1450}
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

      {/* Modo curso */}
      <ToolbarSection>
        <ModeToggle
          $active={cursoMode}
          onClick={() => setCursoMode(!cursoMode)}
          title="Modo Curso - Oculta herramientas avanzadas"
        >
          {cursoMode ? <Eye size={16} /> : <EyeOff size={16} />}
          Modo Curso
        </ModeToggle>
      </ToolbarSection>

      {/* Líneas de guía */}
      <ToolbarSection>
        <ToolbarButton
          onClick={() => setShowGuides(!showGuides)}
          $active={showGuides}
          title="Mostrar/Ocultar líneas de guía"
        >
          <Grid3X3 size={18} />
        </ToolbarButton>
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

      {/* Indicador de tamaño del canvas */}
      <ToolbarSection>
        <span style={{
          fontSize: '12px',
          color: '#6b7280',
          fontWeight: '500',
          fontFamily: 'Inter, system-ui, sans-serif'
        }}>
          Canvas: {canvasWidth}×{canvasHeight}
        </span>
      </ToolbarSection>

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
                handleExportHTML();
                setExportDropdownOpen(false);
              }}>
                <FileText size={16} />
                Exportar HTML
                <span style={{ fontSize: '12px', opacity: 0.7 }}>
                  Archivo .html
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
            </DropdownMenu>
          )}
        </div>

        <SaveButton onClick={handleSave}>
          <Save size={16} />
          Guardar
        </SaveButton>
        <ToolbarButton
          title="Color de fondo del canvas"
          onClick={() => setShowColorPicker(v => !v)}
          style={{ position: 'relative' }}
        >
          <Palette size={20} />
        </ToolbarButton>
        {showColorPicker && (
          <div style={{ position: 'absolute', top: 50, left: 0, background: '#fff', border: '1px solid #e5e7eb', borderRadius: 8, padding: 8, zIndex: 1000, boxShadow: '0 4px 16px rgba(0,0,0,0.10)' }}>
            <input
              type="color"
              value={canvasBackground}
              onChange={e => setCanvasBackground(e.target.value)}
              style={{ width: 40, height: 40, border: 'none', background: 'none', cursor: 'pointer' }}
            />
          </div>
        )}
      </ToolbarSection>
    </ToolbarContainer>
  );
};

export default Toolbar; 