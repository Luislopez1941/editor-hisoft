import React, { useState, useEffect } from 'react';
import styled from 'styled-components';
import { 
  Type, 
  Palette, 
  Move, 
  Maximize2, 
  AlignLeft, 
  AlignCenter, 
  AlignRight,
  Bold,
  Italic,
  Underline,
  Layers,
  Trash2
} from 'lucide-react';
import { useEditor } from '../context/EditorContext';
import SectionLinkSelector from './SectionLinkSelector';

const PanelContainer = styled.div`
  width: 320px;
  background: #ffffff;
  border-left: 1px solid #e5e7eb;
  height: 100%;
  overflow: hidden;
  display: flex;
  flex-direction: column;
  position: relative;
  z-index: 50;
  flex-shrink: 0;
`;

const PanelHeader = styled.div`
  padding: 16px;
  border-bottom: 1px solid #e5e7eb;
  background: linear-gradient(135deg, #f8fafc, #e2e8f0);
  flex-shrink: 0;
`;

const PanelTitle = styled.h3`
  margin: 0 0 8px 0;
  font-size: 18px;
  font-weight: 700;
  color: #111827;
  font-family: 'Inter', system-ui, sans-serif;
`;

const PanelSubtitle = styled.p`
  margin: 0;
  font-size: 14px;
  color: #6b7280;
  font-family: 'Inter', system-ui, sans-serif;
`;

const PanelContent = styled.div`
  flex: 1;
  padding: 16px;
  overflow-y: auto;
  overflow-x: hidden;
  min-height: 0;
  
  &::-webkit-scrollbar {
    width: 6px;
  }
  
  &::-webkit-scrollbar-track {
    background: #f1f5f9;
    border-radius: 3px;
  }
  
  &::-webkit-scrollbar-thumb {
    background: #cbd5e1;
    border-radius: 3px;
  }
  
  &::-webkit-scrollbar-thumb:hover {
    background: #94a3b8;
  }
`;

const PropertyGroup = styled.div`
  margin-bottom: 20px;
  
  &:last-child {
    margin-bottom: 0;
  }
`;

const GroupTitle = styled.h4`
  margin: 0 0 12px 0;
  font-size: 14px;
  font-weight: 600;
  color: #374151;
  text-transform: uppercase;
  letter-spacing: 0.5px;
  font-family: 'Inter', system-ui, sans-serif;
  display: flex;
  align-items: center;
  gap: 8px;
`;

const PropertyRow = styled.div`
  display: flex;
  flex-wrap: wrap;
  align-items: center;
  gap: 8px;
  margin-bottom: 10px;
  
  &:last-child {
    margin-bottom: 0;
  }
`;

const PropertyLabel = styled.label`
  font-size: 13px;
  font-weight: 500;
  color: #4b5563;
  min-width: 80px;
  font-family: 'Inter', system-ui, sans-serif;
`;

const PropertyInput = styled.input`
  min-width: 0;
  width: 60px;
  padding: 6px 8px;
  border: 1px solid #d1d5db;
  border-radius: 6px;
  font-size: 14px;
  font-family: 'Inter', system-ui, sans-serif;
  color: #374151;
  background: #f9fafb;
  outline: none;
  transition: border 0.2s;
  &:focus {
    border-color: #3b82f6;
  }
  
  &:disabled {
    background: #f9fafb;
    color: #9ca3af;
    cursor: not-allowed;
    opacity: 0.6;
  }
`;

const PropertySelect = styled.select`
  flex: 1;
  padding: 8px 12px;
  border: 1px solid #d1d5db;
  border-radius: 6px;
  font-size: 14px;
  font-family: 'Inter', system-ui, sans-serif;
  background: #ffffff;
  
  &:focus {
    outline: none;
    border-color: #3b82f6;
    box-shadow: 0 0 0 3px rgba(59, 130, 246, 0.1);
  }
  
  &:disabled {
    background: #f9fafb;
    color: #9ca3af;
    cursor: not-allowed;
    opacity: 0.6;
  }
`;

const ColorInput = styled.input`
  width: 40px;
  height: 40px;
  border: 1px solid #d1d5db;
  border-radius: 8px;
  cursor: pointer;
  background: none;
  
  &::-webkit-color-swatch-wrapper {
    padding: 0;
  }
  
  &::-webkit-color-swatch {
    border: none;
    border-radius: 6px;
  }
`;

const ButtonGroup = styled.div`
  display: flex;
  gap: 4px;
`;

const ToggleButton = styled.button`
  padding: 8px;
  border: 1px solid #d1d5db;
  border-radius: 6px;
  background: ${props => props.$active ? '#3b82f6' : '#ffffff'};
  color: ${props => props.$active ? '#ffffff' : '#6b7280'};
  cursor: pointer;
  transition: all 0.2s;
  display: flex;
  align-items: center;
  justify-content: center;
  
  &:hover {
    background: ${props => props.$active ? '#2563eb' : '#f3f4f6'};
  }
  
  &:disabled {
    background: #f9fafb;
    color: #9ca3af;
    cursor: not-allowed;
    opacity: 0.6;
    
    &:hover {
      background: #f9fafb;
    }
  }
`;

const RangeInput = styled.input`
  width: 100%;
  height: 4px;
  border-radius: 2px;
  background: #e5e7eb;
  outline: none;
  
  &::-webkit-slider-thumb {
    appearance: none;
    width: 16px;
    height: 16px;
    border-radius: 50%;
    background: #3b82f6;
    cursor: pointer;
    box-shadow: 0 2px 4px rgba(0, 0, 0, 0.2);
  }
`;

const EmptyState = styled.div`
  text-align: center;
  color: #9ca3af;
  padding: 20px 16px;
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  height: 100%;
`;

const PropertyPanel = ({ isPreviewMode = false }) => {
  const { selectedElementId, elements, updateElement, findElementById, selectElement, deleteElement } = useEditor();
  const [properties, setProperties] = useState({});

  const selectedElement = findElementById(elements, selectedElementId);

  useEffect(() => {
    if (selectedElement) {
      setProperties({
        // Posición y tamaño
        x: selectedElement.position?.x ?? 0,
        y: selectedElement.position?.y ?? 0,
        width: parseInt(selectedElement.size?.width) || 200,
        height: parseInt(selectedElement.size?.height) || 100,
        
        // Texto y tipografía
        content: selectedElement.props?.content || '',
        text: selectedElement.props?.text || '',
        fontSize: parseInt(selectedElement.styles?.fontSize) || 16,
        fontWeight: selectedElement.styles?.fontWeight || '400',
        fontFamily: selectedElement.styles?.fontFamily || 'Inter',
        textAlign: selectedElement.styles?.textAlign || 'left',
        lineHeight: parseFloat(selectedElement.styles?.lineHeight) || 1.5,
        
        // Vinculación a sección (para botones)
        linkToSection: selectedElement.props?.linkToSection || null,
        
        // Colores
        color: selectedElement.styles?.color || '#000000',
        background: selectedElement.styles?.background || 'transparent',
        
        // Espaciado
        padding: selectedElement.styles?.padding || '16px',
        margin: selectedElement.styles?.margin || '0',
        
        // Bordes
        borderRadius: selectedElement.styles?.borderRadius !== undefined ? parseInt(selectedElement.styles?.borderRadius) || 0 : 0,
        border: selectedElement.styles?.border || 'none',
        
        // Sombras
        boxShadow: selectedElement.styles?.boxShadow || 'none',
      });
    }
  }, [selectedElement]);

  const updateProperty = (key, value) => {
    setProperties(prev => ({ ...prev, [key]: value }));
    
    if (!selectedElement) return;
    
    const updates = {};
    
    // Actualizar posición
    if (["x", "y"].includes(key)) {
      let v = parseInt(value) || 0;
      if (key === "x") {
        const canvasW = selectedElement.canvasWidth || 1500;
        const elW = parseInt(selectedElement.size?.width) || 100;
        const maxX = canvasW - elW;
        if (v > maxX) v = maxX;
        if (v < 0) v = 0;
      }
      if (key === "y") {
        if (v < 0) v = 0;
      }
      updates.position = {
        ...selectedElement.position,
        [key]: v
      };
    }
    
    // Actualizar tamaño
    if (["width", "height"].includes(key)) {
      let v = parseInt(value) || 100;
      if (key === "width" && v > 1450) v = 1450;
      if (key === "height" && v < 30) v = 30;
      updates.size = {
        ...selectedElement.size,
        [key]: `${v}px`
      };
    }
    
    // Actualizar contenido
    if (key === "content") {
      updates.props = {
        ...selectedElement.props,
        content: value
      };
    }
    // Actualizar texto de botón
    if (key === "text") {
      updates.props = {
        ...selectedElement.props,
        text: value
      };
      // Actualizar también el estado local para evitar el bug de una sola letra
      setProperties(prev => ({ ...prev, text: value }));
    }
    
    // Actualizar vinculación a sección para botones
    if (key === "linkToSection") {
      updates.props = {
        ...selectedElement.props,
        linkToSection: value
      };
    }
    
    // Actualizar estilos
    if (["fontSize", "fontWeight", "fontFamily", "textAlign", "lineHeight", "color", "background", "padding", "margin", "borderRadius", "border", "boxShadow"].includes(key)) {
      let styleValue = value;
      
      // Agregar unidades automáticamente
      if (["fontSize", "borderRadius"].includes(key)) {
        styleValue = `${parseInt(value) || 0}px`;
      }
      
      updates.styles = {
        ...selectedElement.styles,
        [key]: styleValue
      };
    }
    
    updateElement(selectedElement.id, updates);
  };

  const toggleBold = () => {
    const newWeight = (properties.fontWeight || '400') === '700' ? '400' : '700';
    updateProperty('fontWeight', newWeight);
  };

  if (!selectedElement) {
    // Permitir cambiar el color de fondo del canvas y del body
    const { canvasBackground, setCanvasBackground, bodyBackground, setBodyBackground } = useEditor();
    return (
      <PanelContainer>
        <PanelHeader>
          <PanelTitle>Propiedades</PanelTitle>
          <PanelSubtitle>
            Colores generales
          </PanelSubtitle>
        </PanelHeader>
        <PanelContent>
          <PropertyGroup>
            <GroupTitle>
              <Palette size={16} />
              Fondo del Canvas
            </GroupTitle>
            <PropertyRow>
              <PropertyLabel>Fondo:</PropertyLabel>
              <ColorInput
                type="color"
                value={canvasBackground}
                onChange={e => setCanvasBackground(e.target.value)}
              />
              <PropertyInput
                type="text"
                value={canvasBackground}
                onChange={e => setCanvasBackground(e.target.value)}
                placeholder="#f8fafc"
              />
            </PropertyRow>
          </PropertyGroup>
        </PanelContent>
      </PanelContainer>
    );
  }

  // Manejo especial del header eliminado - ahora se trata como elemento normal

  return (
    <PanelContainer>
      <PanelHeader>
        <PanelTitle>Propiedades</PanelTitle>
        <PanelSubtitle>
          {isPreviewMode ? 'Vista Previa' : 'Editando'}: {selectedElement.type}
        </PanelSubtitle>
      </PanelHeader>

      <PanelContent>
        {/* Posición y Tamaño */}
        <PropertyGroup>
          <GroupTitle>
            <Move size={16} />
            Posición y Tamaño
          </GroupTitle>
          
          <PropertyRow>
            <PropertyLabel>X:</PropertyLabel>
            <PropertyInput
              type="number"
              value={properties.x || 0}
              onChange={(e) => updateProperty('x', e.target.value)}
              disabled={isPreviewMode}
            />
            <PropertyLabel>Y:</PropertyLabel>
            <PropertyInput
              type="number"
              value={properties.y || 0}
              onChange={(e) => updateProperty('y', e.target.value)}
              disabled={isPreviewMode}
            />
          </PropertyRow>
          
          <PropertyRow>
            <PropertyLabel>Ancho:</PropertyLabel>
            <PropertyInput
              type="number"
              value={properties.width || 200}
              onChange={(e) => updateProperty('width', e.target.value)}
              disabled={isPreviewMode}
            />
            <PropertyLabel>Alto:</PropertyLabel>
            <PropertyInput
              type="number"
              value={properties.height || 100}
              onChange={(e) => updateProperty('height', e.target.value)}
              disabled={isPreviewMode}
            />
          </PropertyRow>
        </PropertyGroup>

        {/* Contenido de Texto */}
        {(selectedElement.type === 'text' || selectedElement.type === 'heading' || selectedElement.type === 'button') && (
          <PropertyGroup>
            <GroupTitle>
              <Type size={16} />
              Contenido
            </GroupTitle>
            <PropertyRow>
              <PropertyLabel>Texto:</PropertyLabel>
              <PropertyInput
                type="text"
                value={selectedElement.type === 'button' ? (properties.text || '') : (properties.content || '')}
                onChange={(e) => updateProperty(selectedElement.type === 'button' ? 'text' : 'content', e.target.value)}
                placeholder={selectedElement.type === 'button' ? 'Texto del botón...' : 'Escribe tu texto aquí...'}
                disabled={isPreviewMode}
              />
            </PropertyRow>
            
            {/* Selector de sección para botones */}
            {selectedElement.type === 'button' && (
              <SectionLinkSelector
                value={properties.linkToSection || null}
                onChange={(sectionId) => updateProperty('linkToSection', sectionId)}
                placeholder="Enlazar a sección..."
              />
            )}
          </PropertyGroup>
        )}

        {/* Tipografía */}
        {(selectedElement.type === 'text' || selectedElement.type === 'heading') && (
          <PropertyGroup>
            <GroupTitle>
              <Type size={16} />
              Tipografía
            </GroupTitle>
            
            <PropertyRow>
              <PropertyLabel>Tamaño:</PropertyLabel>
              <PropertyInput
                type="number"
                value={properties.fontSize || 16}
                onChange={(e) => updateProperty('fontSize', e.target.value)}
                disabled={isPreviewMode}
              />
              <span style={{ fontSize: '12px', color: '#6b7280' }}>px</span>
            </PropertyRow>
            
            <PropertyRow>
              <PropertyLabel>Fuente:</PropertyLabel>
              <PropertySelect
                value={properties.fontFamily || 'Inter'}
                onChange={(e) => updateProperty('fontFamily', e.target.value)}
                disabled={isPreviewMode}
              >
                <option value="Inter">Inter</option>
                <option value="Roboto">Roboto</option>
                <option value="Montserrat">Montserrat</option>
                <option value="Lato">Lato</option>
                <option value="Oswald">Oswald</option>
                <option value="Poppins">Poppins</option>
                <option value="Merriweather">Merriweather</option>
                <option value="Nunito">Nunito</option>
                <option value="Raleway">Raleway</option>
                <option value="Playfair Display">Playfair Display</option>
                <option value="Fira Sans">Fira Sans</option>
                <option value="Ubuntu">Ubuntu</option>
                <option value="Quicksand">Quicksand</option>
                <option value="Rubik">Rubik</option>
                <option value="Bebas Neue">Bebas Neue</option>
                <option value="Arial">Arial (Sistema)</option>
                <option value="Helvetica">Helvetica (Sistema)</option>
                <option value="Times New Roman">Times New Roman (Sistema)</option>
                <option value="Georgia">Georgia (Sistema)</option>
                <option value="Courier New">Courier New (Sistema)</option>
              </PropertySelect>
            </PropertyRow>
            
            <PropertyRow>
              <PropertyLabel>Formato:</PropertyLabel>
              <ButtonGroup>
                <ToggleButton
                  $active={(properties.fontWeight || '400') === '700'}
                  onClick={toggleBold}
                  title="Negrita"
                  disabled={isPreviewMode}
                >
                  <Bold size={14} />
                </ToggleButton>
              </ButtonGroup>
            </PropertyRow>
            
            <PropertyRow>
              <PropertyLabel>Alineación:</PropertyLabel>
              <ButtonGroup>
                <ToggleButton
                  $active={(properties.textAlign || 'left') === 'left'}
                  onClick={() => updateProperty('textAlign', 'left')}
                  title="Izquierda"
                  disabled={isPreviewMode}
                >
                  <AlignLeft size={14} />
                </ToggleButton>
                <ToggleButton
                  $active={(properties.textAlign || 'left') === 'center'}
                  onClick={() => updateProperty('textAlign', 'center')}
                  title="Centro"
                  disabled={isPreviewMode}
                >
                  <AlignCenter size={14} />
                </ToggleButton>
                <ToggleButton
                  $active={(properties.textAlign || 'left') === 'right'}
                  onClick={() => updateProperty('textAlign', 'right')}
                  title="Derecha"
                  disabled={isPreviewMode}
                >
                  <AlignRight size={14} />
                </ToggleButton>
              </ButtonGroup>
            </PropertyRow>
            
            <PropertyRow>
              <PropertyLabel>Espaciado:</PropertyLabel>
              <PropertyInput
                type="range"
                min="1"
                max="3"
                step="0.1"
                value={properties.lineHeight || 1.5}
                onChange={(e) => updateProperty('lineHeight', e.target.value)}
                disabled={isPreviewMode}
              />
              <span style={{ fontSize: '12px', color: '#6b7280', minWidth: '30px' }}>
                {properties.lineHeight || 1.5}
              </span>
            </PropertyRow>
          </PropertyGroup>
        )}

        {/* Colores */}
        <PropertyGroup>
          <GroupTitle>
            <Palette size={16} />
            Colores
          </GroupTitle>
          
          <PropertyRow>
            <PropertyLabel>Texto:</PropertyLabel>
            <ColorInput
              type="color"
              value={properties.color || '#000000'}
              onChange={(e) => updateProperty('color', e.target.value)}
              disabled={isPreviewMode}
            />
            <PropertyInput
              type="text"
              value={properties.color || ''}
              onChange={(e) => updateProperty('color', e.target.value)}
              placeholder="#000000"
              disabled={isPreviewMode}
            />
          </PropertyRow>
          
          <PropertyRow>
            <PropertyLabel>Fondo:</PropertyLabel>
            <ColorInput
              type="color"
              value={properties.background && properties.background.startsWith('#') ? properties.background : '#ffffff'}
              onChange={(e) => updateProperty('background', e.target.value || 'transparent')}
              disabled={isPreviewMode}
            />
            <PropertyInput
              type="text"
              value={properties.background || ''}
              onChange={(e) => updateProperty('background', e.target.value || 'transparent')}
              placeholder="transparent"
              disabled={isPreviewMode}
            />
            <button
              type="button"
              style={{ marginLeft: 8, padding: '6px 10px', borderRadius: 6, border: '1px solid #d1d5db', background: '#f3f4f6', color: '#374151', fontSize: 12, cursor: 'pointer', transition: 'none' }}
              onClick={() => updateProperty('background', 'transparent')}
              disabled={isPreviewMode}
              onMouseOver={e => e.currentTarget.style.background = '#f3f4f6'}
              onMouseOut={e => e.currentTarget.style.background = '#f3f4f6'}
            >
              Fondo transparente
            </button>
          </PropertyRow>
        </PropertyGroup>

        {/* Espaciado y Bordes */}
        <PropertyGroup>
          <GroupTitle>
            <Maximize2 size={16} />
            Espaciado y Bordes
          </GroupTitle>
          
          <PropertyRow>
            <PropertyLabel>Padding:</PropertyLabel>
            <PropertyInput
              type="text"
              value={properties.padding || ''}
              onChange={(e) => updateProperty('padding', e.target.value)}
              placeholder="16px"
              disabled={isPreviewMode}
            />
          </PropertyRow>
          
          <PropertyRow>
            <PropertyLabel>Margin:</PropertyLabel>
            <PropertyInput
              type="text"
              value={properties.margin || ''}
              onChange={(e) => updateProperty('margin', e.target.value)}
              placeholder="0"
              disabled={isPreviewMode}
            />
          </PropertyRow>
          
          <PropertyRow>
            <PropertyLabel>Borde:</PropertyLabel>
            <PropertyInput
              type="number"
              value={properties.borderRadius || 0}
              onChange={(e) => updateProperty('borderRadius', e.target.value)}
              disabled={isPreviewMode}
            />
            <span style={{ fontSize: '12px', color: '#6b7280' }}>px</span>
          </PropertyRow>

          <PropertyRow>
            <PropertyLabel>Box Shadow:</PropertyLabel>
            <PropertyInput
              type="text"
              value={properties.boxShadow || ''}
              onChange={(e) => updateProperty('boxShadow', e.target.value)}
              placeholder="none | 0px 4px 12px #0003"
              disabled={isPreviewMode}
            />
            <button
              type="button"
              style={{ marginLeft: 8, padding: '6px 10px', borderRadius: 6, border: '1px solid #d1d5db', background: '#f3f4f6', color: '#374151', fontSize: 12, cursor: 'pointer', transition: 'none' }}
              onClick={() => updateProperty('boxShadow', 'none')}
              disabled={isPreviewMode}
              onMouseOver={e => e.currentTarget.style.background = '#f3f4f6'}
              onMouseOut={e => e.currentTarget.style.background = '#f3f4f6'}
            >
              Quitar sombra
            </button>
            <button
              type="button"
              style={{ marginLeft: 4, padding: '6px 10px', borderRadius: 6, border: '1px solid #d1d5db', background: '#f3f4f6', color: '#374151', fontSize: 12, cursor: 'pointer', transition: 'none' }}
              onClick={() => updateProperty('boxShadow', '0 4px 12px rgba(0,0,0,0.15)')}
              disabled={isPreviewMode}
              onMouseOver={e => e.currentTarget.style.background = '#f3f4f6'}
              onMouseOut={e => e.currentTarget.style.background = '#f3f4f6'}
            >
              Sombra básica
            </button>
          </PropertyRow>
        </PropertyGroup>

        {/* Subir imagen para elementos de tipo imagen */}
        {selectedElement.type === 'image' && (
          <PropertyGroup>
            <GroupTitle>
              <Palette size={16} />
              Imagen
            </GroupTitle>
            {/* Inputs para modificar tamaño del SVG */}
            {selectedElement.props?.src && selectedElement.props.src.startsWith('data:image/svg+xml') && (
              <PropertyRow>
                <PropertyLabel>Ancho:</PropertyLabel>
                <PropertyInput
                  type="text"
                  value={selectedElement.size?.width || ''}
                  onChange={e => updateElement(selectedElement.id, { size: { ...selectedElement.size, width: e.target.value } })}
                  placeholder="auto"
                  disabled={isPreviewMode}
                />
                <PropertyLabel>Alto:</PropertyLabel>
                <PropertyInput
                  type="text"
                  value={selectedElement.size?.height || ''}
                  onChange={e => updateElement(selectedElement.id, { size: { ...selectedElement.size, height: e.target.value } })}
                  placeholder="40px"
                  disabled={isPreviewMode}
                />
              </PropertyRow>
            )}
            {/* Input de color para SVGs con currentColor */}
            {selectedElement.props?.src && selectedElement.props.src.startsWith('data:image/svg+xml') && (
              <PropertyRow>
                <PropertyLabel>Color SVG:</PropertyLabel>
                <ColorInput
                  type="color"
                  value={selectedElement.styles?.svgColor || '#000000'}
                  onChange={e => updateElement(selectedElement.id, { styles: { ...selectedElement.styles, svgColor: e.target.value } })}
                  disabled={isPreviewMode}
                />
                <PropertyInput
                  type="text"
                  value={selectedElement.styles?.svgColor || ''}
                  onChange={e => updateElement(selectedElement.id, { styles: { ...selectedElement.styles, svgColor: e.target.value } })}
                  placeholder="#000000"
                  disabled={isPreviewMode}
                />
              </PropertyRow>
            )}
            {/* El input de archivo y el botón de subir SVG han sido eliminados. */}
            {selectedElement.props?.src && (
              <PropertyRow>
                {selectedElement.props.src.endsWith('.svg') || selectedElement.props.src.startsWith('data:image/svg+xml') ? (
                  <div
                    style={{
                      maxWidth: '100%',
                      maxHeight: 120,
                      borderRadius: 8,
                      border: '1px solid #e5e7eb',
                      color: selectedElement.styles?.svgColor || '#000',
                      width: selectedElement.size?.width || 'auto',
                      height: selectedElement.size?.height || '40px',
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'center',
                    }}
                    dangerouslySetInnerHTML={{ __html: (() => {
                      try {
                        const base64 = selectedElement.props.src.split(',')[1];
                        let svg = atob(base64);
                        // Forzar el SVG interno a ocupar 100% del contenedor
                        svg = svg.replace('<svg', '<svg style="width:100%;height:100%;display:block"');
                        return svg;
                      } catch {
                        return '';
                      }
                    })() }}
                  />
                ) : (
                  <img
                    src={selectedElement.props.src}
                    alt="Vista previa"
                    style={{ maxWidth: '100%', maxHeight: 120, borderRadius: 8, border: '1px solid #e5e7eb' }}
                  />
                )}
              </PropertyRow>
            )}
            {selectedElement.props?.name && (
              <PropertyRow>
                <PropertyLabel>Nombre:</PropertyLabel>
                <PropertyInput
                  type="text"
                  value={selectedElement.props.name}
                  onChange={e => updateElement(selectedElement.id, { props: { ...selectedElement.props, name: e.target.value } })}
                  disabled={isPreviewMode}
                />
              </PropertyRow>
            )}
            {selectedElement.props?.alt && (
              <PropertyRow>
                <PropertyLabel>Alt:</PropertyLabel>
                <PropertyInput
                  type="text"
                  value={selectedElement.props.alt}
                  onChange={e => updateElement(selectedElement.id, { props: { ...selectedElement.props, alt: e.target.value } })}
                  disabled={isPreviewMode}
                />
              </PropertyRow>
            )}
          </PropertyGroup>
        )}

        {/* Capas (hijos) para contenedores */}
        {selectedElement.children && selectedElement.children.length > 0 && (
          <PropertyGroup>
            <GroupTitle>
              <Layers size={16} />
              Capas
            </GroupTitle>
            <div style={{ display: 'flex', flexDirection: 'column', gap: 4 }}>
              {selectedElement.children.map((child, idx) => (
                <div key={child.id} style={{ display: 'flex', alignItems: 'center', gap: 4 }}>
                  <button
                    style={{
                      flex: 1,
                      textAlign: 'left',
                      padding: '8px 12px',
                      border: '1px solid #e5e7eb',
                      borderRadius: 6,
                      background: selectedElementId === child.id ? '#3b82f6' : '#f9fafb',
                      color: selectedElementId === child.id ? '#fff' : '#374151',
                      fontWeight: 500,
                      fontFamily: 'Inter, system-ui, sans-serif',
                      cursor: 'pointer',
                      fontSize: 14,
                      transition: 'all 0.2s',
                    }}
                    onClick={() => selectElement(child.id)}
                  >
                    {child.type.charAt(0).toUpperCase() + child.type.slice(1)}
                    {child.props?.text ? `: ${child.props.text}` : ''}
                    {child.props?.content ? `: ${child.props.content}` : ''}
                  </button>
                  {/* Botón mover arriba */}
                  <button
                    style={{ background: 'none', border: 'none', color: '#3b82f6', cursor: idx === 0 ? 'not-allowed' : 'pointer', padding: 4, borderRadius: 4, fontSize: 16 }}
                    title="Mover arriba"
                    disabled={idx === 0}
                    onClick={() => {
                      if (idx === 0) return;
                      const newChildren = [...selectedElement.children];
                      [newChildren[idx - 1], newChildren[idx]] = [newChildren[idx], newChildren[idx - 1]];
                      updateElement(selectedElement.id, { children: newChildren });
                    }}
                  >▲</button>
                  {/* Botón mover abajo */}
                  <button
                    style={{ background: 'none', border: 'none', color: '#3b82f6', cursor: idx === selectedElement.children.length - 1 ? 'not-allowed' : 'pointer', padding: 4, borderRadius: 4, fontSize: 16 }}
                    title="Mover abajo"
                    disabled={idx === selectedElement.children.length - 1}
                    onClick={() => {
                      if (idx === selectedElement.children.length - 1) return;
                      const newChildren = [...selectedElement.children];
                      [newChildren[idx + 1], newChildren[idx]] = [newChildren[idx], newChildren[idx + 1]];
                      updateElement(selectedElement.id, { children: newChildren });
                    }}
                  >▼</button>
                  {/* Botón eliminar */}
                  <button
                    style={{
                      background: 'none',
                      border: 'none',
                      color: '#ef4444',
                      cursor: 'pointer',
                      padding: 4,
                      borderRadius: 4,
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'center',
                      transition: 'background 0.2s',
                    }}
                    title="Eliminar capa"
                    onClick={() => deleteElement(child.id)}
                  >
                    <Trash2 size={16} />
                  </button>
                </div>
              ))}
            </div>
          </PropertyGroup>
        )}
      </PanelContent>
    </PanelContainer>
  );
};

export default PropertyPanel; 