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
  Minimize2
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
    elements
  } = useEditor();

  // Estados para dropdowns
  const [deviceDropdownOpen, setDeviceDropdownOpen] = useState(false);
  const [cursoMode, setCursoMode] = useState(false);

  // Canvas sizes presets
  const canvasSizes = {
    desktop: { width: 1200, height: 800, icon: Monitor, label: 'Desktop' },
    tablet: { width: 768, height: 1024, icon: Tablet, label: 'Tablet' },
    mobile: { width: 375, height: 667, icon: Smartphone, label: 'Mobile' }
  };

  const currentSize = Object.entries(canvasSizes).find(
    ([key, size]) => size.width === canvasWidth && size.height === canvasHeight
  );

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

  const selectedElement = elements.find(el => el.id === selectedElementId);

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
        <div style={{ position: 'relative' }}>
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
        
        <ToolbarButton 
          onClick={handleExport}
          title="Exportar proyecto"
        >
          <Download size={18} />
        </ToolbarButton>
        
        <SaveButton onClick={handleSave}>
          <Save size={16} />
          Guardar
        </SaveButton>
      </ToolbarSection>
    </ToolbarContainer>
  );
};

export default Toolbar; 