import React from 'react';
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
  Edit3
} from 'lucide-react';
import { useEditor } from '../context/EditorContext';

const ToolbarContainer = styled.div`
  height: 60px;
  background: #ffffff;
  border-bottom: 1px solid #e1e5e9;
  display: flex;
  align-items: center;
  padding: 0 20px;
  gap: 16px;
`;

const ToolbarSection = styled.div`
  display: flex;
  align-items: center;
  gap: 8px;
  padding: 0 12px;
  border-right: 1px solid #e1e5e9;
  height: 40px;

  &:last-child {
    border-right: none;
  }
`;

const ToolbarButton = styled.button`
  display: flex;
  align-items: center;
  justify-content: center;
  width: 36px;
  height: 36px;
  border: 1px solid #e1e5e9;
  border-radius: 6px;
  background: #ffffff;
  color: #6b7280;
  cursor: pointer;
  transition: all 0.2s ease;
  font-size: 14px;

  &:hover {
    border-color: #3b82f6;
    color: #3b82f6;
    background: #f0f9ff;
  }

  &:active {
    transform: translateY(1px);
  }

  &:disabled {
    opacity: 0.5;
    cursor: not-allowed;
  }

  &.active {
    background: #3b82f6;
    color: #ffffff;
    border-color: #3b82f6;
  }
`;

const ToolbarButtonText = styled.button`
  display: flex;
  align-items: center;
  gap: 6px;
  padding: 8px 12px;
  border: 1px solid #e1e5e9;
  border-radius: 6px;
  background: #ffffff;
  color: #6b7280;
  cursor: pointer;
  transition: all 0.2s ease;
  font-size: 14px;
  font-weight: 500;

  &:hover {
    border-color: #3b82f6;
    color: #3b82f6;
    background: #f0f9ff;
  }

  &:active {
    transform: translateY(1px);
  }
`;

const ZoomControl = styled.div`
  display: flex;
  align-items: center;
  gap: 8px;
`;

const ZoomInput = styled.input`
  width: 60px;
  padding: 6px 8px;
  border: 1px solid #e1e5e9;
  border-radius: 4px;
  text-align: center;
  font-size: 14px;

  &:focus {
    outline: none;
    border-color: #3b82f6;
  }
`;

const DeviceSelector = styled.div`
  display: flex;
  align-items: center;
  gap: 4px;
`;

const DeviceButton = styled.button`
  display: flex;
  align-items: center;
  justify-content: center;
  width: 32px;
  height: 32px;
  border: 1px solid #e1e5e9;
  border-radius: 4px;
  background: #ffffff;
  color: #6b7280;
  cursor: pointer;
  transition: all 0.2s ease;

  &:hover {
    border-color: #3b82f6;
    color: #3b82f6;
  }

  &.active {
    background: #3b82f6;
    color: #ffffff;
    border-color: #3b82f6;
  }
`;

const Toolbar = ({ isPreviewMode, setIsPreviewMode, onBackToDashboard }) => {
  const { 
    undo, 
    redo, 
    zoom, 
    setZoom, 
    elements, 
    selectedElementId,
    deleteElement 
  } = useEditor();

  const handleZoomChange = (e) => {
    const value = parseInt(e.target.value);
    if (value >= 25 && value <= 200) {
      setZoom(value);
    }
  };

  const handleZoomIn = () => {
    setZoom(Math.min(zoom + 25, 200));
  };

  const handleZoomOut = () => {
    setZoom(Math.max(zoom - 25, 25));
  };

  const handleResetZoom = () => {
    setZoom(100);
  };

  const handleSave = () => {
    const projectData = {
      elements,
      canvasWidth: 1200,
      canvasHeight: 800,
      zoom,
      timestamp: new Date().toISOString()
    };
    
    const blob = new Blob([JSON.stringify(projectData, null, 2)], {
      type: 'application/json'
    });
    
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = 'web-editor-project.json';
    a.click();
    URL.revokeObjectURL(url);
  };

  const handleExport = () => {
    // Generate HTML code
    const htmlCode = generateHTML();
    const blob = new Blob([htmlCode], { type: 'text/html' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = 'index.html';
    a.click();
    URL.revokeObjectURL(url);
  };

  const generateHTML = () => {
    const generateElementHTML = (element) => {
      switch (element.type) {
        case 'text':
          return `<p style="${generateStyles(element.styles)}">${element.props.content}</p>`;
        case 'heading':
          return `<h${element.props.level} style="${generateStyles(element.styles)}">${element.props.content}</h${element.props.level}>`;
        case 'button':
          return `<button style="${generateStyles(element.styles)}">${element.props.text}</button>`;
        case 'image':
          return `<img src="${element.props.src}" alt="${element.props.alt}" style="${generateStyles(element.styles)}" />`;
        case 'section':
          return `<section style="${generateStyles(element.styles)}">${element.children?.map(child => generateElementHTML(child)).join('') || ''}</section>`;
        case 'container':
          return `<div style="${generateStyles(element.styles)}">${element.children?.map(child => generateElementHTML(child)).join('') || ''}</div>`;
        case 'card':
          return `<div style="${generateStyles(element.styles)}">
            ${element.props.image ? `<img src="${element.props.image}" alt="Card" style="width: 100%; height: 200px; object-fit: cover;" />` : ''}
            <div style="padding: 16px;">
              <h3 style="margin: 0 0 8px 0; font-size: 18px; font-weight: 600;">${element.props.title}</h3>
              <p style="margin: 0; font-size: 14px; line-height: 1.5; color: #6b7280;">${element.props.content}</p>
            </div>
          </div>`;
        default:
          return `<div style="${generateStyles(element.styles)}">${element.props.content || element.type}</div>`;
      }
    };

    const generateStyles = (styles) => {
      return Object.entries(styles || {})
        .map(([key, value]) => `${key}: ${value}`)
        .join('; ');
    };

    const html = `
<!DOCTYPE html>
<html lang="es">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>Web Editor Project</title>
    <style>
        body {
            margin: 0;
            padding: 0;
            font-family: Arial, sans-serif;
        }
        .container {
            max-width: 1200px;
            margin: 0 auto;
            padding: 0 20px;
        }
    </style>
</head>
<body>
    <div class="container">
        ${elements.map(element => generateElementHTML(element)).join('')}
    </div>
</body>
</html>`;

    return html;
  };

  return (
    <ToolbarContainer>
      {/* Back to Dashboard */}
      {onBackToDashboard && (
        <ToolbarSection>
          <ToolbarButtonText onClick={onBackToDashboard}>
            <ArrowLeft size={16} />
            Dashboard
          </ToolbarButtonText>
        </ToolbarSection>
      )}

      {/* File Operations */}
      <ToolbarSection>
        <ToolbarButtonText onClick={handleSave}>
          <Save size={16} />
          Save
        </ToolbarButtonText>
        <ToolbarButtonText onClick={handleExport}>
          <Download size={16} />
          Export
        </ToolbarButtonText>
      </ToolbarSection>

      {/* Edit Operations */}
      <ToolbarSection>
        <ToolbarButton onClick={undo} title="Undo (Ctrl+Z)">
          <Undo size={16} />
        </ToolbarButton>
        <ToolbarButton onClick={redo} title="Redo (Ctrl+Y)">
          <Redo size={16} />
        </ToolbarButton>
      </ToolbarSection>

      {/* Element Operations */}
      <ToolbarSection>
        <ToolbarButton title="Mover elemento">
          <Move size={16} />
        </ToolbarButton>
        <ToolbarButton title="Editar contenedor">
          <Edit3 size={16} />
        </ToolbarButton>
        {selectedElementId && (
          <ToolbarButton 
            onClick={() => deleteElement(selectedElementId)} 
            title="Eliminar elemento"
            style={{ color: '#ef4444' }}
          >
            <Trash2 size={16} />
          </ToolbarButton>
        )}
      </ToolbarSection>

      {/* Text Formatting */}
      <ToolbarSection>
        <ToolbarButton title="Bold (Ctrl+B)">
          <Bold size={16} />
        </ToolbarButton>
        <ToolbarButton title="Italic (Ctrl+I)">
          <Italic size={16} />
        </ToolbarButton>
        <ToolbarButton title="Underline (Ctrl+U)">
          <Underline size={16} />
        </ToolbarButton>
        <ToolbarButton title="Add Link">
          <Link size={16} />
        </ToolbarButton>
      </ToolbarSection>

      {/* Alignment */}
      <ToolbarSection>
        <ToolbarButton title="Align Left">
          <AlignLeft size={16} />
        </ToolbarButton>
        <ToolbarButton title="Align Center">
          <AlignCenter size={16} />
        </ToolbarButton>
        <ToolbarButton title="Align Right">
          <AlignRight size={16} />
        </ToolbarButton>
      </ToolbarSection>

      {/* Element Operations */}
      <ToolbarSection>
        <ToolbarButton title="Copy (Ctrl+C)">
          <Copy size={16} />
        </ToolbarButton>
        <ToolbarButton title="Cut (Ctrl+X)">
          <Scissors size={16} />
        </ToolbarButton>
        <ToolbarButton 
          onClick={() => selectedElementId && deleteElement(selectedElementId)}
          disabled={!selectedElementId}
          title="Delete (Del)"
        >
          <Trash2 size={16} />
        </ToolbarButton>
      </ToolbarSection>

      {/* Zoom Controls */}
      <ToolbarSection>
        <ZoomControl>
          <ToolbarButton onClick={handleZoomOut} title="Zoom Out">
            <ZoomOut size={16} />
          </ToolbarButton>
          <ZoomInput
            type="number"
            value={zoom}
            onChange={handleZoomChange}
            min="25"
            max="200"
            step="25"
          />
          <span style={{ fontSize: '12px', color: '#6b7280' }}>%</span>
          <ToolbarButton onClick={handleZoomIn} title="Zoom In">
            <ZoomIn size={16} />
          </ToolbarButton>
          <ToolbarButton onClick={handleResetZoom} title="Reset Zoom">
            <RotateCcw size={16} />
          </ToolbarButton>
        </ZoomControl>
      </ToolbarSection>

      {/* Device Preview */}
      <ToolbarSection>
        <DeviceSelector>
          <DeviceButton title="Desktop View">
            <Monitor size={16} />
          </DeviceButton>
          <DeviceButton title="Tablet View">
            <Tablet size={16} />
          </DeviceButton>
          <DeviceButton title="Mobile View">
            <Smartphone size={16} />
          </DeviceButton>
        </DeviceSelector>
      </ToolbarSection>

      {/* Preview Mode */}
      <ToolbarSection>
        <ToolbarButton
          onClick={() => setIsPreviewMode(!isPreviewMode)}
          className={isPreviewMode ? 'active' : ''}
          title={isPreviewMode ? 'Exit Preview' : 'Preview'}
        >
          {isPreviewMode ? <EyeOff size={16} /> : <Eye size={16} />}
        </ToolbarButton>
      </ToolbarSection>

      {/* Settings */}
      <ToolbarSection>
        <ToolbarButton title="Settings">
          <Settings size={16} />
        </ToolbarButton>
        <ToolbarButton title="Layers">
          <Layers size={16} />
        </ToolbarButton>
        <ToolbarButton title="Color Palette">
          <Palette size={16} />
        </ToolbarButton>
      </ToolbarSection>
    </ToolbarContainer>
  );
};

export default Toolbar; 