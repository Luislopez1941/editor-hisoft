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
  Underline
} from 'lucide-react';
import { useEditor } from '../context/EditorContext';

const PanelContainer = styled.div`
  width: 300px;
  background: #ffffff;
  border-left: 1px solid #e5e7eb;
  height: 100vh;
  overflow-y: auto;
  display: flex;
  flex-direction: column;
`;

const PanelHeader = styled.div`
  padding: 20px;
  border-bottom: 1px solid #e5e7eb;
  background: linear-gradient(135deg, #f8fafc, #e2e8f0);
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
  padding: 20px;
`;

const PropertyGroup = styled.div`
  margin-bottom: 24px;
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
  align-items: center;
  gap: 12px;
  margin-bottom: 12px;
`;

const PropertyLabel = styled.label`
  font-size: 13px;
  font-weight: 500;
  color: #4b5563;
  min-width: 80px;
  font-family: 'Inter', system-ui, sans-serif;
`;

const PropertyInput = styled.input`
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
  padding: 40px 20px;
`;

const PropertyPanel = () => {
  const { selectedElementId, elements, updateElement, findElementById } = useEditor();
  const [properties, setProperties] = useState({});

  const selectedElement = findElementById(elements, selectedElementId);

  useEffect(() => {
    if (selectedElement) {
      setProperties({
        // Posición y tamaño
        x: selectedElement.position?.x || 50,
        y: selectedElement.position?.y || 50,
        width: parseInt(selectedElement.size?.width) || 200,
        height: parseInt(selectedElement.size?.height) || 100,
        
        // Texto y tipografía
        content: selectedElement.props?.content || '',
        fontSize: parseInt(selectedElement.styles?.fontSize) || 16,
        fontWeight: selectedElement.styles?.fontWeight || '400',
        fontFamily: selectedElement.styles?.fontFamily || 'Inter',
        textAlign: selectedElement.styles?.textAlign || 'left',
        lineHeight: parseFloat(selectedElement.styles?.lineHeight) || 1.5,
        
        // Colores
        color: selectedElement.styles?.color || '#000000',
        background: selectedElement.styles?.background || 'transparent',
        
        // Espaciado
        padding: selectedElement.styles?.padding || '16px',
        margin: selectedElement.styles?.margin || '0',
        
        // Bordes
        borderRadius: parseInt(selectedElement.styles?.borderRadius) || 0,
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
    if (['x', 'y'].includes(key)) {
      updates.position = {
        ...selectedElement.position,
        [key]: parseInt(value) || 0
      };
    }
    
    // Actualizar tamaño
    if (['width', 'height'].includes(key)) {
      updates.size = {
        ...selectedElement.size,
        [key]: `${parseInt(value) || 100}px`
      };
    }
    
    // Actualizar contenido
    if (key === 'content') {
      updates.props = {
        ...selectedElement.props,
        content: value
      };
    }
    
    // Actualizar estilos
    if (['fontSize', 'fontWeight', 'fontFamily', 'textAlign', 'lineHeight', 'color', 'background', 'padding', 'margin', 'borderRadius', 'border', 'boxShadow'].includes(key)) {
      let styleValue = value;
      
      // Agregar unidades automáticamente
      if (['fontSize', 'borderRadius'].includes(key)) {
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
    return (
      <PanelContainer>
        <PanelHeader>
          <PanelTitle>Propiedades</PanelTitle>
          <PanelSubtitle>Selecciona un elemento para editarlo</PanelSubtitle>
        </PanelHeader>
        <EmptyState>
          <div style={{ fontSize: '48px', marginBottom: '16px' }}>🎯</div>
          <p>Haz clic en cualquier elemento del canvas para ver sus propiedades aquí</p>
        </EmptyState>
      </PanelContainer>
    );
  }

  return (
    <PanelContainer>
      <PanelHeader>
        <PanelTitle>Propiedades</PanelTitle>
        <PanelSubtitle>Editando: {selectedElement.type}</PanelSubtitle>
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
            />
            <PropertyLabel>Y:</PropertyLabel>
            <PropertyInput
              type="number"
              value={properties.y || 0}
              onChange={(e) => updateProperty('y', e.target.value)}
            />
          </PropertyRow>
          
          <PropertyRow>
            <PropertyLabel>Ancho:</PropertyLabel>
            <PropertyInput
              type="number"
              value={properties.width || 200}
              onChange={(e) => updateProperty('width', e.target.value)}
            />
            <PropertyLabel>Alto:</PropertyLabel>
            <PropertyInput
              type="number"
              value={properties.height || 100}
              onChange={(e) => updateProperty('height', e.target.value)}
            />
          </PropertyRow>
        </PropertyGroup>

        {/* Contenido de Texto */}
        {(selectedElement.type === 'text' || selectedElement.type === 'heading') && (
          <PropertyGroup>
            <GroupTitle>
              <Type size={16} />
              Contenido
            </GroupTitle>
            
            <PropertyRow>
              <PropertyLabel>Texto:</PropertyLabel>
              <PropertyInput
                type="text"
                value={properties.content || ''}
                onChange={(e) => updateProperty('content', e.target.value)}
                placeholder="Escribe tu texto aquí..."
              />
            </PropertyRow>
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
              />
              <span style={{ fontSize: '12px', color: '#6b7280' }}>px</span>
            </PropertyRow>
            
            <PropertyRow>
              <PropertyLabel>Fuente:</PropertyLabel>
              <PropertySelect
                value={properties.fontFamily || 'Inter'}
                onChange={(e) => updateProperty('fontFamily', e.target.value)}
              >
                <option value="Inter">Inter</option>
                <option value="Arial">Arial</option>
                <option value="Helvetica">Helvetica</option>
                <option value="Times New Roman">Times New Roman</option>
                <option value="Georgia">Georgia</option>
                <option value="Courier New">Courier New</option>
              </PropertySelect>
            </PropertyRow>
            
            <PropertyRow>
              <PropertyLabel>Formato:</PropertyLabel>
              <ButtonGroup>
                <ToggleButton
                  $active={(properties.fontWeight || '400') === '700'}
                  onClick={toggleBold}
                  title="Negrita"
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
                >
                  <AlignLeft size={14} />
                </ToggleButton>
                <ToggleButton
                  $active={(properties.textAlign || 'left') === 'center'}
                  onClick={() => updateProperty('textAlign', 'center')}
                  title="Centro"
                >
                  <AlignCenter size={14} />
                </ToggleButton>
                <ToggleButton
                  $active={(properties.textAlign || 'left') === 'right'}
                  onClick={() => updateProperty('textAlign', 'right')}
                  title="Derecha"
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
            />
            <PropertyInput
              type="text"
              value={properties.color || ''}
              onChange={(e) => updateProperty('color', e.target.value)}
              placeholder="#000000"
            />
          </PropertyRow>
          
          <PropertyRow>
            <PropertyLabel>Fondo:</PropertyLabel>
            <ColorInput
              type="color"
              value={properties.background && properties.background.startsWith('#') ? properties.background : '#ffffff'}
              onChange={(e) => updateProperty('background', e.target.value)}
            />
            <PropertyInput
              type="text"
              value={properties.background || ''}
              onChange={(e) => updateProperty('background', e.target.value)}
              placeholder="transparent"
            />
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
            />
          </PropertyRow>
          
          <PropertyRow>
            <PropertyLabel>Margin:</PropertyLabel>
            <PropertyInput
              type="text"
              value={properties.margin || ''}
              onChange={(e) => updateProperty('margin', e.target.value)}
              placeholder="0"
            />
          </PropertyRow>
          
          <PropertyRow>
            <PropertyLabel>Borde:</PropertyLabel>
            <PropertyInput
              type="number"
              value={properties.borderRadius || 0}
              onChange={(e) => updateProperty('borderRadius', e.target.value)}
            />
            <span style={{ fontSize: '12px', color: '#6b7280' }}>px</span>
          </PropertyRow>
        </PropertyGroup>
      </PanelContent>
    </PanelContainer>
  );
};

export default PropertyPanel; 