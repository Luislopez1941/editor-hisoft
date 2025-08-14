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
  Trash2,
  Image,
  FileText,
  User,
  Calendar,
  Tag,
  Link,
  Eye,
  EyeOff,
  Settings,
  Edit3,
  Plus,
  Minus
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
  z-index: 99;
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
  padding-top: 24px;
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
  font-weight: 600;
  color: #374151;
  min-width: 80px;
  font-family: 'Inter', system-ui, sans-serif;
  display: flex;
  align-items: center;
`;

const PropertyInput = styled.input`
  min-width: 0;
  width: 60px;
  padding: 8px 12px;
  border: 1px solid #d1d5db;
  border-radius: 8px;
  font-size: 14px;
  font-family: 'Inter', system-ui, sans-serif;
  color: #374151;
  background: #ffffff;
  outline: none;
  transition: all 0.2s ease;
  
  &:focus {
    border-color: #3b82f6;
    box-shadow: 0 0 0 3px rgba(59, 130, 246, 0.1);
  }
  
  &:hover {
    border-color: #9ca3af;
  }
  
  &:disabled {
    background: #f9fafb;
    color: #9ca3af;
    cursor: not-allowed;
    opacity: 0.6;
  }
  
  &::placeholder {
    color: #9ca3af;
    font-style: italic;
  }
`;

const PropertyTextarea = styled.textarea`
  flex: 1;
  min-width: 0;
  padding: 12px;
  border: 1px solid #d1d5db;
  border-radius: 8px;
  font-size: 14px;
  font-family: 'Inter', system-ui, sans-serif;
  color: #374151;
  background: #ffffff;
  outline: none;
  transition: all 0.2s ease;
  resize: vertical;
  min-height: 80px;
  line-height: 1.5;
  
  &:focus {
    border-color: #3b82f6;
    box-shadow: 0 0 0 3px rgba(59, 130, 246, 0.1);
  }
  
  &:hover {
    border-color: #9ca3af;
  }
  
  &:disabled {
    background: #f9fafb;
    color: #9ca3af;
    cursor: not-allowed;
    opacity: 0.6;
  }
  
  &::placeholder {
    color: #9ca3af;
    font-style: italic;
  }
`;

const PropertySelect = styled.select`
  flex: 1;
  padding: 8px 12px;
  border: 1px solid #d1d5db;
  border-radius: 8px;
  font-size: 14px;
  font-family: 'Inter', system-ui, sans-serif;
  background: #ffffff;
  transition: all 0.2s ease;
  
  &:focus {
    outline: none;
    border-color: #3b82f6;
    box-shadow: 0 0 0 3px rgba(59, 130, 246, 0.1);
  }
  
  &:hover {
    border-color: #9ca3af;
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

const AutoFitButton = styled.button`
  width: 100%;
  padding: 10px 12px;
  border: 1px solid #d1d5db;
  border-radius: 6px;
  background: #f8fafc;
  color: #374151;
  cursor: pointer;
  transition: all 0.2s;
  display: flex;
  align-items: center;
  justify-content: center;
  gap: 8px;
  font-size: 13px;
  font-weight: 500;
  font-family: 'Inter', system-ui, sans-serif;
  
  &:hover {
    background: #e5e7eb;
    border-color: #9ca3af;
  }
  
  &:active {
    background: #d1d5db;
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
  const { selectedElementId, elements, updateElement, findElementById, selectElement, deleteElement, sections } = useEditor();
  const [properties, setProperties] = useState({});

  const selectedElement = findElementById(elements, selectedElementId);

  useEffect(() => {
    if (selectedElement) {
      setProperties({
        // Posición y tamaño
        x: selectedElement.position?.x !== undefined ? selectedElement.position.x : '',
        y: selectedElement.position?.y !== undefined ? selectedElement.position.y : '',
        width: selectedElement.size?.width === 'auto' ? 'auto' : (selectedElement.size?.width ? parseInt(selectedElement.size?.width) : ''),
        height: selectedElement.size?.height === 'auto' ? 'auto' : (selectedElement.size?.height ? parseInt(selectedElement.size?.height) : ''),
        
        // Texto y tipografía
        content: selectedElement.props?.content || '',
        text: selectedElement.props?.text || '',
        fontSize: selectedElement.styles?.fontSize ? parseInt(selectedElement.styles?.fontSize) : '',
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
        borderRadius: selectedElement.styles?.borderRadius || '',
        border: selectedElement.styles?.border || 'none',
        
        // Sombras
        boxShadow: selectedElement.styles?.boxShadow || 'none',
      });
    }
  }, [selectedElement]);

  const updateProperty = (key, value) => {
    console.log(`updateProperty: ${key} = "${value}"`);
    setProperties(prev => ({ ...prev, [key]: value }));
    
    if (!selectedElement) return;
    
    const updates = {};
    
    // Actualizar posición
    if (["x", "y"].includes(key)) {
      let v = value === '' ? 0 : parseInt(value);
      if (isNaN(v)) v = 0;
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
      console.log(`Actualizando ${key} con valor: "${value}"`);
      let v;
      if (value === 'auto' || value === '') {
        v = 'auto';
        console.log(`${key} se establece en "auto"`);
      } else {
        v = value === '' ? 0 : parseInt(value);
        if (isNaN(v)) v = 0;
        if (key === "width" && v > 1450) v = 1450;
        if (key === "height" && v < 0) v = 0; // Permitir 0 pero no valores negativos
        v = `${v}px`;
        console.log(`${key} se establece en "${v}"`);
      }
      updates.size = {
        ...selectedElement.size,
        [key]: v
      };
      console.log(`Size actualizado:`, updates.size);
      console.log(`Elemento antes de actualizar:`, selectedElement);
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
      if (["fontSize"].includes(key)) {
        let numValue = value === '' ? 0 : parseInt(value);
        if (isNaN(numValue)) numValue = 0;
        styleValue = `${numValue}px`;
      }
      
      // Manejo especial para border-radius
      if (key === "borderRadius") {
        if (value === '' || value === '0' || value === 'none') {
          styleValue = '0';
        } else {
          let numValue = parseInt(value);
          if (isNaN(numValue)) {
            styleValue = value; // Mantener el valor original si no es un número
          } else {
            styleValue = `${numValue}px`;
          }
        }
      }
      
      updates.styles = {
        ...selectedElement.styles,
        [key]: styleValue
      };
    }
    
    updateElement(selectedElement.id, updates);
    console.log(`Elemento actualizado con:`, updates);
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
              type="text"
              value={properties.x || ''}
              onChange={(e) => updateProperty('x', e.target.value)}
              disabled={isPreviewMode}
            />
            <PropertyLabel>Y:</PropertyLabel>
            <PropertyInput
              type="text"
              value={properties.y || ''}
              onChange={(e) => updateProperty('y', e.target.value)}
              disabled={isPreviewMode}
            />
          </PropertyRow>
          
          <PropertyRow>
            <div style={{ display: 'flex', flexDirection: 'column', gap: '8px', width: '100%' }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                <PropertyLabel style={{ minWidth: '60px' }}>Ancho:</PropertyLabel>
                <PropertyInput
                  type="text"
                  value={properties.width === 'auto' ? 'auto' : (properties.width || '')}
                  onChange={(e) => updateProperty('width', e.target.value)}
                  placeholder="auto"
                  disabled={isPreviewMode}
                  style={{ flex: 1, width: 'auto' }}
                />
                <span style={{ fontSize: '12px', color: '#6b7280', minWidth: '20px' }}>px</span>
              </div>
              <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                <PropertyLabel style={{ minWidth: '60px' }}>Alto:</PropertyLabel>
                <PropertyInput
                  type="text"
                  value={properties.height === 'auto' ? 'auto' : (properties.height || '')}
                  onChange={(e) => updateProperty('height', e.target.value)}
                  placeholder="auto"
                  disabled={isPreviewMode}
                  style={{ flex: 1, width: 'auto' }}
                />
                <span style={{ fontSize: '12px', color: '#6b7280', minWidth: '20px' }}>px</span>
              </div>
            </div>
          </PropertyRow>
          
          {/* Botón de ajuste automático para elementos de texto */}
          <PropertyRow>
            <button
              onClick={() => {
                console.log('Botón ajustar al texto clickeado');
                
                if (!selectedElement) {
                  console.log('No hay elemento seleccionado');
                  return;
                }
                
                // Usar updateProperty para asegurar que se aplique correctamente
                console.log('Estableciendo width y height en auto');
                updateProperty('width', 'auto');
                updateProperty('height', 'auto');
                
                // Verificar que se aplicó correctamente
                setTimeout(() => {
                  console.log('Estado actual de propiedades:', properties);
                  console.log('Elemento seleccionado:', selectedElement);
                  console.log('Tamaño del elemento después del ajuste:', selectedElement.size);
                }, 100);
              }}
              disabled={isPreviewMode}
              style={{
                width: '100%',
                padding: '10px 12px',
                border: '1px solid #d1d5db',
                borderRadius: '8px',
                background: '#f8fafc',
                color: '#374151',
                cursor: 'pointer',
                fontSize: '13px',
                fontWeight: '500',
                fontFamily: 'Inter, system-ui, sans-serif',
                transition: 'all 0.2s ease'
              }}
              onMouseOver={(e) => {
                e.target.style.background = '#f1f5f9';
                e.target.style.borderColor = '#9ca3af';
              }}
              onMouseOut={(e) => {
                e.target.style.background = '#f8fafc';
                e.target.style.borderColor = '#d1d5db';
              }}
            >
              📏 Ajustar al texto
            </button>
          </PropertyRow>
        </PropertyGroup>

        {/* Contenido de Texto */}
        {(selectedElement.type === 'text' || selectedElement.type === 'heading' || selectedElement.type === 'button') && (
          <PropertyGroup>
            <GroupTitle>
              <Type size={16} />
              Contenido
            </GroupTitle>
            <PropertyRow style={{ flexDirection: 'column', alignItems: 'flex-start' }}>
              <PropertyLabel>Texto:</PropertyLabel>
              <PropertyTextarea
                value={selectedElement.type === 'button' ? (properties.text || '') : (properties.content || '')}
                onChange={(e) => updateProperty(selectedElement.type === 'button' ? 'text' : 'content', e.target.value)}
                placeholder={selectedElement.type === 'button' ? 'Texto del botón...' : 'Escribe tu texto aquí...'}
                disabled={isPreviewMode}
                rows={4}
                style={{ width: '100%' }}
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
        {(selectedElement.type === 'text' || selectedElement.type === 'heading' || selectedElement.type === 'button') && (
          <PropertyGroup>
            <GroupTitle>
              <Type size={16} />
              Tipografía
            </GroupTitle>
            
            <PropertyRow>
              <PropertyLabel>Tamaño:</PropertyLabel>
              <PropertySelect
                value={(() => {
                  const fontSize = properties.fontSize || '16px';
                  // Si el fontSize no está en la lista de opciones, mostrar "custom"
                  const standardSizes = ['12px', '14px', '16px', '18px', '20px', '24px', '28px', '32px', '36px', '48px', '64px'];
                  return standardSizes.includes(fontSize) ? fontSize : 'custom';
                })()}
                onChange={(e) => {
                  if (e.target.value === 'custom') {
                    updateProperty('fontSize', 'custom');
                  } else {
                    updateProperty('fontSize', e.target.value);
                  }
                }}
                disabled={isPreviewMode}
              >
                <option value="12px">12px - Muy pequeño</option>
                <option value="14px">14px - Pequeño</option>
                <option value="16px">16px - Normal</option>
                <option value="18px">18px - Mediano</option>
                <option value="20px">20px - Grande</option>
                <option value="24px">24px - Muy grande</option>
                <option value="28px">28px - Extra grande</option>
                <option value="32px">32px - Título</option>
                <option value="36px">36px - Título grande</option>
                <option value="48px">48px - Título extra grande</option>
                <option value="64px">64px - Título hero</option>
                <option value="custom">Personalizado...</option>
              </PropertySelect>
            </PropertyRow>
            
            {(properties.fontSize === 'custom' || (properties.fontSize && typeof properties.fontSize === 'string' && !properties.fontSize.includes('px'))) && (
              <PropertyRow>
                <PropertyLabel>Tamaño personalizado:</PropertyLabel>
                <PropertyInput
                  type="text"
                  value={properties.fontSize === 'custom' ? '' : (properties.fontSize || '')}
                  onChange={(e) => {
                    const value = e.target.value;
                    // Si el valor está vacío y era 'custom', mantener 'custom'
                    if (value === '' && properties.fontSize === 'custom') {
                      return;
                    }
                    // Si el valor no está vacío, actualizar con el valor real
                    if (value !== '') {
                      updateProperty('fontSize', value);
                    }
                  }}
                  onBlur={(e) => {
                    // Si el campo está vacío al perder el foco, volver a 'custom'
                    if (e.target.value === '') {
                      updateProperty('fontSize', 'custom');
                    }
                  }}
                  placeholder="ej: 22px, 1.5rem, 2em"
                  disabled={isPreviewMode}
                  style={{ flex: 1, width: 'auto' }}
                />
              </PropertyRow>
            )}
            
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
            <button
              type="button"
              style={{ marginLeft: 8, padding: '6px 10px', borderRadius: 6, border: '1px solid #d1d5db', background: '#f3f4f6', color: '#374151', fontSize: 12, cursor: 'pointer', transition: 'none' }}
              onClick={() => updateProperty('padding', '0')}
              disabled={isPreviewMode}
              onMouseOver={e => e.currentTarget.style.background = '#f3f4f6'}
              onMouseOut={e => e.currentTarget.style.background = '#f3f4f6'}
            >
              Quitar padding
            </button>
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
              type="text"
              value={properties.border || ''}
              onChange={(e) => updateProperty('border', e.target.value)}
              placeholder="1px solid #e5e7eb"
              disabled={isPreviewMode}
            />
            <button
              type="button"
              style={{ marginLeft: 8, padding: '6px 10px', borderRadius: 6, border: '1px solid #d1d5db', background: '#f3f4f6', color: '#374151', fontSize: 12, cursor: 'pointer', transition: 'none' }}
              onClick={() => updateProperty('border', 'none')}
              disabled={isPreviewMode}
              onMouseOver={e => e.currentTarget.style.background = '#f3f4f6'}
              onMouseOut={e => e.currentTarget.style.background = '#f3f4f6'}
            >
              Quitar borde
            </button>
          </PropertyRow>
          
          <PropertyRow>
            <PropertyLabel>Border Radius:</PropertyLabel>
            <PropertyInput
              type="text"
              value={properties.borderRadius || ''}
              onChange={(e) => updateProperty('borderRadius', e.target.value)}
              placeholder="0, 8px, none..."
              disabled={isPreviewMode}
            />
            <button
              type="button"
              style={{ marginLeft: 8, padding: '6px 10px', borderRadius: 6, border: '1px solid #d1d5db', background: '#f3f4f6', color: '#374151', fontSize: 12, cursor: 'pointer', transition: 'none' }}
              onClick={() => updateProperty('borderRadius', '0')}
              disabled={isPreviewMode}
              onMouseOver={e => e.currentTarget.style.background = '#e5e7eb'}
              onMouseOut={e => e.currentTarget.style.background = '#f3f4f6'}
            >
              Sin radio
            </button>
            <button
              type="button"
              style={{ marginLeft: 4, padding: '6px 10px', borderRadius: 6, border: '1px solid #d1d5db', background: '#f3f4f6', color: '#374151', fontSize: 12, cursor: 'pointer', transition: 'none' }}
              onClick={() => updateProperty('borderRadius', 'none')}
              disabled={isPreviewMode}
              onMouseOver={e => e.currentTarget.style.background = '#e5e7eb'}
              onMouseOut={e => e.currentTarget.style.background = '#f3f4f6'}
            >
              None
            </button>
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

        {/* Subir imagen para elementos de tipo imagen y contenedores */}
        {(selectedElement.type === 'image' || selectedElement.type === 'container' || selectedElement.type === 'section') && (
          <PropertyGroup>
            <GroupTitle>
              <Palette size={16} />
              Imagen
            </GroupTitle>
            {/* Inputs para modificar tamaño del SVG */}
            {selectedElement.props?.src && selectedElement.props.src.startsWith('data:image/svg+xml') && (
              <PropertyRow>
                <div style={{ display: 'flex', flexDirection: 'column', gap: '8px', width: '100%' }}>
                  <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                    <PropertyLabel style={{ minWidth: '60px' }}>Ancho:</PropertyLabel>
                    <PropertyInput
                      type="text"
                      value={selectedElement.size?.width || ''}
                      onChange={e => updateElement(selectedElement.id, { size: { ...selectedElement.size, width: e.target.value } })}
                      placeholder="auto"
                      disabled={isPreviewMode}
                      style={{ flex: 1, width: 'auto' }}
                    />
                    <span style={{ fontSize: '12px', color: '#6b7280', minWidth: '20px' }}>px</span>
                  </div>
                  <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                    <PropertyLabel style={{ minWidth: '60px' }}>Alto:</PropertyLabel>
                    <PropertyInput
                      type="text"
                      value={selectedElement.size?.height || ''}
                      onChange={e => updateElement(selectedElement.id, { size: { ...selectedElement.size, height: e.target.value } })}
                      placeholder="40px"
                      disabled={isPreviewMode}
                      style={{ flex: 1, width: 'auto' }}
                    />
                    <span style={{ fontSize: '12px', color: '#6b7280', minWidth: '20px' }}>px</span>
                  </div>
                </div>
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
            {/* Botón para subir imagen */}
            <PropertyRow>
              <PropertyLabel>Subir imagen:</PropertyLabel>
              <div style={{ position: 'relative', width: '100%' }}>
                <input
                  type="file"
                  accept="image/*"
                  onChange={(e) => {
                    const file = e.target.files[0];
                    if (file) {
                      const reader = new FileReader();
                      reader.onload = (event) => {
                        if (selectedElement.type === 'image') {
                          // Para elementos de imagen, actualizar la src
                          updateElement(selectedElement.id, { 
                            props: { 
                              ...selectedElement.props, 
                              src: event.target.result 
                            } 
                          });
                        } else {
                          // Para contenedores, agregar como elemento hijo
                          const newImageElement = {
                            id: `element-${Date.now()}-${Math.random().toString(36).substr(2, 9)}`,
                            type: 'image',
                            props: {
                              src: event.target.result,
                              alt: file.name || 'Imagen subida'
                            },
                            styles: {
                              width: '100%',
                              height: 'auto',
                              maxHeight: '400px',
                              objectFit: 'cover',
                              borderRadius: '8px'
                            },
                            position: { x: 0, y: 0 },
                            size: { width: 'auto', height: 'auto' }
                          };
                          
                          // Agregar el elemento imagen al contenedor
                          const currentChildren = selectedElement.children || [];
                          const updatedChildren = [...currentChildren, newImageElement];
                          updateElement(selectedElement.id, { 
                            children: updatedChildren 
                          });
                        }
                      };
                      reader.readAsDataURL(file);
                    }
                  }}
                  style={{
                    position: 'absolute',
                    top: 0,
                    left: 0,
                    width: '100%',
                    height: '100%',
                    opacity: 0,
                    cursor: 'pointer',
                    zIndex: 2
                  }}
                  disabled={isPreviewMode}
                />
                <button
                  style={{
                    width: '100%',
                    padding: '12px 16px',
                    border: '2px dashed #3b82f6',
                    borderRadius: '8px',
                    fontSize: '14px',
                    fontFamily: 'Inter, system-ui, sans-serif',
                    cursor: 'pointer',
                    backgroundColor: '#f0f9ff',
                    color: '#3b82f6',
                    fontWeight: '500',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    gap: '8px',
                    transition: 'all 0.2s ease',
                    position: 'relative',
                    zIndex: 1
                  }}
                  onMouseOver={(e) => {
                    e.target.style.backgroundColor = '#e0f2fe';
                    e.target.style.borderColor = '#2563eb';
                    e.target.style.color = '#1d4ed8';
                  }}
                  onMouseOut={(e) => {
                    e.target.style.backgroundColor = '#f0f9ff';
                    e.target.style.borderColor = '#3b82f6';
                    e.target.style.color = '#3b82f6';
                  }}
                  disabled={isPreviewMode}
                >
                  📁 {selectedElement.type === 'image' ? 'Seleccionar imagen' : 'Agregar imagen al contenedor'}
                </button>
              </div>
            </PropertyRow>
            
            {/* Vista previa de la imagen */}
            {selectedElement.props?.src && selectedElement.type === 'image' && (
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
            
            {/* Mostrar imágenes en contenedores */}
            {selectedElement.type !== 'image' && selectedElement.children && selectedElement.children.filter(child => child.type === 'image').length > 0 && (
              <PropertyRow>
                <PropertyLabel>Imágenes en contenedor:</PropertyLabel>
                <div style={{ display: 'flex', flexDirection: 'column', gap: '8px', maxHeight: '200px', overflowY: 'auto' }}>
                  {selectedElement.children.filter(child => child.type === 'image').map((imageChild, index) => (
                    <div key={imageChild.id} style={{ 
                      display: 'flex', 
                      alignItems: 'center', 
                      gap: '8px',
                      padding: '8px',
                      border: '1px solid #e5e7eb',
                      borderRadius: '6px',
                      backgroundColor: '#f9fafb'
                    }}>
                      <img
                        src={imageChild.props?.src}
                        alt={imageChild.props?.alt || `Imagen ${index + 1}`}
                        style={{ 
                          width: '40px', 
                          height: '40px', 
                          objectFit: 'cover',
                          borderRadius: '4px',
                          border: '1px solid #d1d5db'
                        }}
                      />
                      <span style={{ 
                        flex: 1, 
                        fontSize: '12px', 
                        color: '#6b7280',
                        fontFamily: 'Inter, system-ui, sans-serif'
                      }}>
                        Imagen {index + 1}
                      </span>
                      <button
                        style={{
                          background: 'none',
                          border: 'none',
                          color: '#ef4444',
                          cursor: 'pointer',
                          padding: '4px',
                          borderRadius: '4px',
                          display: 'flex',
                          alignItems: 'center',
                          justifyContent: 'center',
                          transition: 'background 0.2s',
                        }}
                        onMouseOver={(e) => {
                          e.target.style.backgroundColor = '#fef2f2';
                        }}
                        onMouseOut={(e) => {
                          e.target.style.backgroundColor = 'transparent';
                        }}
                        onClick={() => {
                          const currentChildren = selectedElement.children || [];
                          const newChildren = currentChildren.filter(child => child.id !== imageChild.id);
                          updateElement(selectedElement.id, { 
                            children: newChildren 
                          });
                        }}
                        disabled={isPreviewMode}
                        title="Eliminar imagen"
                      >
                        🗑️
                      </button>
                    </div>
                  ))}
                </div>
              </PropertyRow>
            )}
          </PropertyGroup>
        )}

        {/* Gestión de imágenes para carrusel */}
        {selectedElement.type === 'carousel' && (
          <PropertyGroup>
            <GroupTitle>
              <Palette size={16} />
              Imágenes del Carrusel
            </GroupTitle>
            
            {/* Configuración del carrusel */}
            <PropertyRow>
              <PropertyLabel>Autoplay:</PropertyLabel>
              <input
                type="checkbox"
                checked={selectedElement.props?.autoPlay !== false}
                onChange={e => updateElement(selectedElement.id, { 
                  props: { 
                    ...selectedElement.props, 
                    autoPlay: e.target.checked 
                  } 
                })}
                disabled={isPreviewMode}
              />
            </PropertyRow>
            
            <PropertyRow>
              <PropertyLabel>Mostrar flechas:</PropertyLabel>
              <input
                type="checkbox"
                checked={selectedElement.props?.showArrows !== false}
                onChange={e => updateElement(selectedElement.id, { 
                  props: { 
                    ...selectedElement.props, 
                    showArrows: e.target.checked 
                  } 
                })}
                disabled={isPreviewMode}
              />
            </PropertyRow>
            
            <PropertyRow>
              <PropertyLabel>Mostrar puntos:</PropertyLabel>
              <input
                type="checkbox"
                checked={selectedElement.props?.showDots !== false}
                onChange={e => updateElement(selectedElement.id, { 
                  props: { 
                    ...selectedElement.props, 
                    showDots: e.target.checked 
                  } 
                })}
                disabled={isPreviewMode}
              />
            </PropertyRow>
            
            <PropertyRow>
              <PropertyLabel>Intervalo (ms):</PropertyLabel>
              <PropertyInput
                type="number"
                value={selectedElement.props?.interval || 3000}
                onChange={e => updateElement(selectedElement.id, { 
                  props: { 
                    ...selectedElement.props, 
                    interval: parseInt(e.target.value) || 3000 
                  } 
                })}
                min="1000"
                max="10000"
                step="500"
                disabled={isPreviewMode}
              />
            </PropertyRow>

            {/* Gestión de imágenes */}
            <PropertyRow>
              <PropertyLabel>Agregar imagen:</PropertyLabel>
              <div style={{ position: 'relative', width: '100%' }}>
                <input
                  type="file"
                  accept="image/*"
                  onChange={(e) => {
                    const file = e.target.files[0];
                    if (file) {
                      const reader = new FileReader();
                      reader.onload = (event) => {
                        const currentImages = selectedElement.props?.images || [];
                        if (currentImages.length >= 6) {
                          alert('Máximo 6 imágenes permitidas');
                          return;
                        }
                        const newImages = [...currentImages, event.target.result];
                        updateElement(selectedElement.id, { 
                          props: { 
                            ...selectedElement.props, 
                            images: newImages 
                          } 
                        });
                      };
                      reader.readAsDataURL(file);
                    }
                  }}
                  style={{
                    position: 'absolute',
                    top: 0,
                    left: 0,
                    width: '100%',
                    height: '100%',
                    opacity: 0,
                    cursor: 'pointer',
                    zIndex: 2
                  }}
                  disabled={isPreviewMode || (selectedElement.props?.images?.length || 0) >= 6}
                />
                <button
                  style={{
                    width: '100%',
                    padding: '12px 16px',
                    border: '2px dashed #3b82f6',
                    borderRadius: '8px',
                    fontSize: '14px',
                    fontFamily: 'Inter, system-ui, sans-serif',
                    cursor: (selectedElement.props?.images?.length || 0) >= 6 ? 'not-allowed' : 'pointer',
                    backgroundColor: (selectedElement.props?.images?.length || 0) >= 6 ? '#f3f4f6' : '#f0f9ff',
                    color: (selectedElement.props?.images?.length || 0) >= 6 ? '#9ca3af' : '#3b82f6',
                    fontWeight: '500',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    gap: '8px',
                    transition: 'all 0.2s ease',
                    position: 'relative',
                    zIndex: 1
                  }}
                  onMouseOver={(e) => {
                    if ((selectedElement.props?.images?.length || 0) < 6) {
                      e.target.style.backgroundColor = '#e0f2fe';
                      e.target.style.borderColor = '#2563eb';
                      e.target.style.color = '#1d4ed8';
                    }
                  }}
                  onMouseOut={(e) => {
                    if ((selectedElement.props?.images?.length || 0) < 6) {
                      e.target.style.backgroundColor = '#f0f9ff';
                      e.target.style.borderColor = '#3b82f6';
                      e.target.style.color = '#3b82f6';
                    }
                  }}
                  disabled={isPreviewMode || (selectedElement.props?.images?.length || 0) >= 6}
                >
                  📁 Agregar imagen ({(selectedElement.props?.images?.length || 0)}/6)
                </button>
              </div>
            </PropertyRow>
            
            {/* Lista de imágenes */}
            {selectedElement.props?.images && selectedElement.props.images.length > 0 && (
              <PropertyRow>
                <PropertyLabel>Imágenes ({selectedElement.props.images.length}/6):</PropertyLabel>
                <div style={{ display: 'flex', flexDirection: 'column', gap: '8px', maxHeight: '200px', overflowY: 'auto' }}>
                  {selectedElement.props.images.map((image, index) => (
                    <div key={index} style={{ 
                      display: 'flex', 
                      alignItems: 'center', 
                      gap: '8px',
                      padding: '8px',
                      border: '1px solid #e5e7eb',
                      borderRadius: '6px',
                      backgroundColor: '#f9fafb'
                    }}>
                      <img
                        src={image}
                        alt={`Imagen ${index + 1}`}
                        style={{ 
                          width: '40px', 
                          height: '40px', 
                          objectFit: 'cover',
                          borderRadius: '4px',
                          border: '1px solid #d1d5db'
                        }}
                      />
                      <span style={{ 
                        flex: 1, 
                        fontSize: '12px', 
                        color: '#6b7280',
                        fontFamily: 'Inter, system-ui, sans-serif'
                      }}>
                        Imagen {index + 1}
                      </span>
                      <button
                        style={{
                          background: 'none',
                          border: 'none',
                          color: '#ef4444',
                          cursor: 'pointer',
                          padding: '4px',
                          borderRadius: '4px',
                          display: 'flex',
                          alignItems: 'center',
                          justifyContent: 'center',
                          transition: 'background 0.2s',
                        }}
                        onMouseOver={(e) => {
                          e.target.style.backgroundColor = '#fef2f2';
                        }}
                        onMouseOut={(e) => {
                          e.target.style.backgroundColor = 'transparent';
                        }}
                        onClick={() => {
                          const currentImages = selectedElement.props?.images || [];
                          const newImages = currentImages.filter((_, i) => i !== index);
                          updateElement(selectedElement.id, { 
                            props: { 
                              ...selectedElement.props, 
                              images: newImages 
                            } 
                          });
                        }}
                        disabled={isPreviewMode}
                        title="Eliminar imagen"
                      >
                        🗑️
                      </button>
                    </div>
                  ))}
                </div>
              </PropertyRow>
            )}

            {/* Gestión de slides con texto */}
            <PropertyRow>
              <PropertyLabel>Gestionar slides con texto:</PropertyLabel>
              <button
                style={{
                  width: '100%',
                  padding: '12px 16px',
                  border: '2px dashed #10b981',
                  borderRadius: '8px',
                  fontSize: '14px',
                  fontFamily: 'Inter, system-ui, sans-serif',
                  cursor: 'pointer',
                  backgroundColor: '#f0fdf4',
                  color: '#10b981',
                  fontWeight: '500',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  gap: '8px',
                  transition: 'all 0.2s ease',
                }}
                onMouseOver={(e) => {
                  e.target.style.backgroundColor = '#dcfce7';
                  e.target.style.borderColor = '#059669';
                  e.target.style.color = '#047857';
                }}
                onMouseOut={(e) => {
                  e.target.style.backgroundColor = '#f0fdf4';
                  e.target.style.borderColor = '#10b981';
                  e.target.style.color = '#10b981';
                }}
                onClick={() => {
                  const currentSlides = selectedElement.props?.slides || [];
                  const currentImages = selectedElement.props?.images || [];
                  
                  // Convertir imágenes existentes a slides con texto por defecto
                  const newSlides = currentImages.map((image, index) => ({
                    image: image,
                    title: `Título ${index + 1}`,
                    subtitle: `Subtítulo ${index + 1}`,
                    textPosition: {
                      bottom: '0',
                      left: '0',
                      right: '0',
                      top: 'auto',
                      textAlign: 'center',
                      textColor: '#ffffff',
                      backgroundColor: 'rgba(0, 0, 0, 0.7)',
                      fontFamily: 'Inter, system-ui, sans-serif',
                      padding: '20px',
                      transform: 'none',
                      borderRadius: '0',
                      boxShadow: 'none'
                    }
                  }));
                  
                  updateElement(selectedElement.id, { 
                    props: { 
                      ...selectedElement.props, 
                      slides: newSlides 
                    } 
                  });
                }}
                disabled={isPreviewMode}
              >
                ✏️ Convertir a slides con texto
              </button>
            </PropertyRow>

            {/* Lista de slides con texto */}
            {selectedElement.props?.slides && selectedElement.props.slides.length > 0 && (
              <PropertyRow>
                <PropertyLabel>Slides con texto ({selectedElement.props.slides.length}):</PropertyLabel>
                <div style={{ display: 'flex', flexDirection: 'column', gap: '12px', maxHeight: '300px', overflowY: 'auto' }}>
                  {selectedElement.props.slides.map((slide, index) => (
                    <div key={index} style={{ 
                      padding: '12px',
                      border: '1px solid #e5e7eb',
                      borderRadius: '8px',
                      backgroundColor: '#f9fafb'
                    }}>
                      <div style={{ 
                        display: 'flex', 
                        alignItems: 'center', 
                        gap: '8px',
                        marginBottom: '8px'
                      }}>
                        <img
                          src={slide.image}
                          alt={`Slide ${index + 1}`}
                          style={{ 
                            width: '40px', 
                            height: '40px', 
                            objectFit: 'cover',
                            borderRadius: '4px',
                            border: '1px solid #d1d5db'
                          }}
                        />
                        <span style={{ 
                          flex: 1, 
                          fontSize: '14px', 
                          fontWeight: '600',
                          color: '#374151',
                          fontFamily: 'Inter, system-ui, sans-serif'
                        }}>
                          Slide {index + 1}
                        </span>
                        <button
                          style={{
                            background: 'none',
                            border: 'none',
                            color: '#ef4444',
                            cursor: 'pointer',
                            padding: '4px',
                            borderRadius: '4px',
                            display: 'flex',
                            alignItems: 'center',
                            justifyContent: 'center',
                            transition: 'background 0.2s',
                          }}
                          onMouseOver={(e) => {
                            e.target.style.backgroundColor = '#fef2f2';
                          }}
                          onMouseOut={(e) => {
                            e.target.style.backgroundColor = 'transparent';
                          }}
                          onClick={() => {
                            const currentSlides = selectedElement.props?.slides || [];
                            const newSlides = currentSlides.filter((_, i) => i !== index);
                            updateElement(selectedElement.id, { 
                              props: { 
                                ...selectedElement.props, 
                                slides: newSlides 
                              } 
                            });
                          }}
                          disabled={isPreviewMode}
                          title="Eliminar slide"
                        >
                          🗑️
                        </button>
                      </div>
                      
                      <PropertyInput
                        type="text"
                        placeholder="Título del slide"
                        value={slide.title || ''}
                        onChange={e => {
                          const currentSlides = selectedElement.props?.slides || [];
                          const newSlides = currentSlides.map((s, i) => 
                            i === index ? { ...s, title: e.target.value } : s
                          );
                          updateElement(selectedElement.id, { 
                            props: { 
                              ...selectedElement.props, 
                              slides: newSlides 
                            } 
                          });
                        }}
                        disabled={isPreviewMode}
                        style={{ marginBottom: '8px' }}
                      />
                      
                      <PropertyInput
                        type="text"
                        placeholder="Subtítulo del slide"
                        value={slide.subtitle || ''}
                        onChange={e => {
                          const currentSlides = selectedElement.props?.slides || [];
                          const newSlides = currentSlides.map((s, i) => 
                            i === index ? { ...s, subtitle: e.target.value } : s
                          );
                          updateElement(selectedElement.id, { 
                            props: { 
                              ...selectedElement.props, 
                              slides: newSlides 
                            } 
                          });
                        }}
                        disabled={isPreviewMode}
                      />
                      
                      {/* Controles de posición del texto */}
                      <div style={{ 
                        marginTop: '12px', 
                        padding: '12px', 
                        backgroundColor: '#f3f4f6', 
                        borderRadius: '6px',
                        border: '1px solid #e5e7eb'
                      }}>
                        <div style={{ 
                          fontSize: '12px', 
                          fontWeight: '600', 
                          color: '#374151',
                          marginBottom: '8px',
                          fontFamily: 'Inter, system-ui, sans-serif'
                        }}>
                          🎨 Estilo del texto
                        </div>
                        
                        {/* Posición vertical */}
                        <div style={{ marginBottom: '12px' }}>
                          <label style={{ 
                            fontSize: '11px', 
                            color: '#6b7280',
                            fontFamily: 'Inter, system-ui, sans-serif',
                            display: 'block',
                            marginBottom: '4px'
                          }}>
                            Posición vertical:
                          </label>
                          <select
                            value={slide.textPosition?.bottom ? 'bottom' : slide.textPosition?.top ? 'top' : 'center'}
                            onChange={e => {
                              const currentSlides = selectedElement.props?.slides || [];
                              const newSlides = currentSlides.map((s, i) => {
                                if (i === index) {
                                  const newPosition = { ...s.textPosition };
                                  if (e.target.value === 'bottom') {
                                    newPosition.bottom = '0';
                                    newPosition.top = 'auto';
                                    newPosition.transform = 'none';
                                  } else if (e.target.value === 'top') {
                                    newPosition.top = '0';
                                    newPosition.bottom = 'auto';
                                    newPosition.transform = 'none';
                                  } else {
                                    newPosition.top = '50%';
                                    newPosition.bottom = 'auto';
                                    newPosition.transform = 'translateY(-50%)';
                                  }
                                  if (newPosition.left === '0' && newPosition.right === '0') {
                                    newPosition.left = '20px';
                                    newPosition.right = '20px';
                                    newPosition.width = '300px';
                                  }
                                  return { ...s, textPosition: newPosition };
                                }
                                return s;
                              });
                              updateElement(selectedElement.id, { 
                                props: { 
                                  ...selectedElement.props, 
                                  slides: newSlides 
                                } 
                              });
                            }}
                            disabled={isPreviewMode}
                            style={{
                              width: '100%',
                              padding: '8px 12px',
                              fontSize: '12px',
                              border: '1px solid #d1d5db',
                              borderRadius: '6px',
                              backgroundColor: '#ffffff',
                              fontFamily: 'Inter, system-ui, sans-serif',
                              outline: 'none',
                              cursor: isPreviewMode ? 'not-allowed' : 'pointer'
                            }}
                          >
                            <option value="bottom">Abajo</option>
                            <option value="center">Centro</option>
                            <option value="top">Arriba</option>
                          </select>
                        </div>

                        {/* Alineación horizontal */}
                        <div style={{ marginBottom: '12px' }}>
                          <label style={{ 
                            fontSize: '11px', 
                            color: '#6b7280',
                            fontFamily: 'Inter, system-ui, sans-serif',
                            display: 'block',
                            marginBottom: '4px'
                          }}>
                            Alineación horizontal:
                          </label>
                          <select
                            value={slide.textPosition?.textAlign || 'center'}
                            onChange={e => {
                              const currentSlides = selectedElement.props?.slides || [];
                              const newSlides = currentSlides.map((s, i) => {
                                if (i === index) {
                                  const newPosition = { ...s.textPosition };
                                  newPosition.textAlign = e.target.value;
                                  return { ...s, textPosition: newPosition };
                                }
                                return s;
                              });
                              updateElement(selectedElement.id, { 
                                props: { 
                                  ...selectedElement.props, 
                                  slides: newSlides 
                                } 
                              });
                            }}
                            disabled={isPreviewMode}
                            style={{
                              width: '100%',
                              padding: '8px 12px',
                              fontSize: '12px',
                              border: '1px solid #d1d5db',
                              borderRadius: '6px',
                              backgroundColor: '#ffffff',
                              fontFamily: 'Inter, system-ui, sans-serif',
                              outline: 'none',
                              cursor: isPreviewMode ? 'not-allowed' : 'pointer'
                            }}
                          >
                            <option value="left">Izquierda</option>
                            <option value="center">Centro</option>
                            <option value="right">Derecha</option>
                          </select>
                        </div>

                        {/* Ancho del texto */}
                        <div style={{ marginBottom: '12px' }}>
                          <label style={{ 
                            fontSize: '11px', 
                            color: '#6b7280',
                            fontFamily: 'Inter, system-ui, sans-serif',
                            display: 'block',
                            marginBottom: '4px'
                          }}>
                            Ancho del texto:
                          </label>
                          <select
                            value={slide.textPosition?.left === '0' && slide.textPosition?.right === '0' ? 'full' : 'custom'}
                            onChange={e => {
                              const currentSlides = selectedElement.props?.slides || [];
                              const newSlides = currentSlides.map((s, i) => {
                                if (i === index) {
                                  const newPosition = { ...s.textPosition };
                                  if (e.target.value === 'full') {
                                    newPosition.left = '0';
                                    newPosition.right = '0';
                                    newPosition.width = 'auto';
                                  } else {
                                    newPosition.left = '20px';
                                    newPosition.right = 'auto';
                                    newPosition.width = '300px';
                                  }
                                  return { ...s, textPosition: newPosition };
                                }
                                return s;
                              });
                              updateElement(selectedElement.id, { 
                                props: { 
                                  ...selectedElement.props, 
                                  slides: newSlides 
                                } 
                              });
                            }}
                            disabled={isPreviewMode}
                            style={{
                              width: '100%',
                              padding: '8px 12px',
                              fontSize: '12px',
                              border: '1px solid #d1d5db',
                              borderRadius: '6px',
                              backgroundColor: '#ffffff',
                              fontFamily: 'Inter, system-ui, sans-serif',
                              marginBottom: '8px',
                              outline: 'none',
                              cursor: isPreviewMode ? 'not-allowed' : 'pointer'
                            }}
                          >
                            <option value="full">Ancho completo</option>
                            <option value="custom">Ancho personalizado</option>
                          </select>
                          
                          {/* Ancho personalizado */}
                          {slide.textPosition?.left !== '0' && slide.textPosition?.right !== '0' && (
                            <div style={{ display: 'flex', gap: '8px', alignItems: 'center' }}>
                              <input
                                type="range"
                                min="100"
                                max="800"
                                step="10"
                                value={parseInt(slide.textPosition?.width) || 300}
                                onChange={e => {
                                  const currentSlides = selectedElement.props?.slides || [];
                                  const newSlides = currentSlides.map((s, i) => {
                                    if (i === index) {
                                      const newPosition = { ...s.textPosition };
                                      newPosition.width = `${e.target.value}px`;
                                      return { ...s, textPosition: newPosition };
                                    }
                                    return s;
                                  });
                                  updateElement(selectedElement.id, { 
                                    props: { 
                                      ...selectedElement.props, 
                                      slides: newSlides 
                                    } 
                                  });
                                }}
                                disabled={isPreviewMode}
                                style={{
                                  flex: 1,
                                  height: '6px',
                                  borderRadius: '3px',
                                  background: '#e5e7eb',
                                  outline: 'none',
                                  cursor: isPreviewMode ? 'not-allowed' : 'pointer'
                                }}
                              />
                              <input
                                type="number"
                                value={parseInt(slide.textPosition?.width) || 300}
                                onChange={e => {
                                  const currentSlides = selectedElement.props?.slides || [];
                                  const newSlides = currentSlides.map((s, i) => {
                                    if (i === index) {
                                      const newPosition = { ...s.textPosition };
                                      newPosition.width = `${e.target.value}px`;
                                      return { ...s, textPosition: newPosition };
                                    }
                                    return s;
                                  });
                                  updateElement(selectedElement.id, { 
                                    props: { 
                                      ...selectedElement.props, 
                                      slides: newSlides 
                                    } 
                                  });
                                }}
                                min="100"
                                max="800"
                                step="10"
                                disabled={isPreviewMode}
                                style={{
                                  width: '60px',
                                  padding: '6px 8px',
                                  fontSize: '11px',
                                  border: '1px solid #d1d5db',
                                  borderRadius: '4px',
                                  backgroundColor: '#ffffff',
                                  fontFamily: 'Inter, system-ui, sans-serif',
                                  outline: 'none'
                                }}
                              />
                              <span style={{ 
                                fontSize: '11px', 
                                color: '#6b7280',
                                fontFamily: 'Inter, system-ui, sans-serif'
                              }}>
                                px
                              </span>
                            </div>
                          )}
                        </div>

                        {/* Color del texto */}
                        <div style={{ marginBottom: '12px' }}>
                          <label style={{ 
                            fontSize: '11px', 
                            color: '#6b7280',
                            fontFamily: 'Inter, system-ui, sans-serif',
                            display: 'block',
                            marginBottom: '4px'
                          }}>
                            Color del texto:
                          </label>
                          <input
                            type="color"
                            value={slide.textPosition?.textColor || '#ffffff'}
                            onChange={e => {
                              const currentSlides = selectedElement.props?.slides || [];
                              const newSlides = currentSlides.map((s, i) => {
                                if (i === index) {
                                  const newPosition = { ...s.textPosition };
                                  newPosition.textColor = e.target.value;
                                  return { ...s, textPosition: newPosition };
                                }
                                return s;
                              });
                              updateElement(selectedElement.id, { 
                                props: { 
                                  ...selectedElement.props, 
                                  slides: newSlides 
                                } 
                              });
                            }}
                            disabled={isPreviewMode}
                            style={{
                              width: '100%',
                              height: '32px',
                              border: '1px solid #d1d5db',
                              borderRadius: '4px',
                              cursor: 'pointer'
                            }}
                          />
                        </div>

                        {/* Color de fondo */}
                        <div style={{ marginBottom: '12px' }}>
                          <label style={{ 
                            fontSize: '11px', 
                            color: '#6b7280',
                            fontFamily: 'Inter, system-ui, sans-serif',
                            display: 'block',
                            marginBottom: '4px'
                          }}>
                            Color de fondo:
                          </label>
                          <div style={{ display: 'flex', gap: '8px', alignItems: 'center' }}>
                            <input
                              type="color"
                              value={slide.textPosition?.backgroundColor === 'transparent' ? '#000000' : slide.textPosition?.backgroundColor || '#000000'}
                              onChange={e => {
                                const currentSlides = selectedElement.props?.slides || [];
                                const newSlides = currentSlides.map((s, i) => {
                                  if (i === index) {
                                    const newPosition = { ...s.textPosition };
                                    // Convertir color a rgba para transparencia
                                    const hex = e.target.value;
                                    const r = parseInt(hex.slice(1, 3), 16);
                                    const g = parseInt(hex.slice(3, 5), 16);
                                    const b = parseInt(hex.slice(5, 7), 16);
                                    newPosition.backgroundColor = `rgba(${r}, ${g}, ${b}, 0.7)`;
                                    return { ...s, textPosition: newPosition };
                                  }
                                  return s;
                                });
                                updateElement(selectedElement.id, { 
                                  props: { 
                                    ...selectedElement.props, 
                                    slides: newSlides 
                                  } 
                                });
                              }}
                              disabled={isPreviewMode}
                              style={{
                                width: '60px',
                                height: '32px',
                                border: '1px solid #d1d5db',
                                borderRadius: '4px',
                                cursor: 'pointer'
                              }}
                            />
                            <button
                              onClick={() => {
                                const currentSlides = selectedElement.props?.slides || [];
                                const newSlides = currentSlides.map((s, i) => {
                                  if (i === index) {
                                    const newPosition = { ...s.textPosition };
                                    newPosition.backgroundColor = 'transparent';
                                    return { ...s, textPosition: newPosition };
                                  }
                                  return s;
                                });
                                updateElement(selectedElement.id, { 
                                  props: { 
                                    ...selectedElement.props, 
                                    slides: newSlides 
                                  } 
                                });
                              }}
                              disabled={isPreviewMode}
                              style={{
                                padding: '6px 12px',
                                fontSize: '11px',
                                border: '1px solid #d1d5db',
                                borderRadius: '4px',
                                backgroundColor: '#ffffff',
                                color: '#374151',
                                cursor: 'pointer',
                                fontFamily: 'Inter, system-ui, sans-serif'
                              }}
                            >
                              Sin fondo
                            </button>
                          </div>
                        </div>

                        {/* Fuente */}
                        <div style={{ marginBottom: '12px' }}>
                          <label style={{ 
                            fontSize: '11px', 
                            color: '#6b7280',
                            fontFamily: 'Inter, system-ui, sans-serif',
                            display: 'block',
                            marginBottom: '4px'
                          }}>
                            Fuente:
                          </label>
                          <select
                            value={slide.textPosition?.fontFamily || 'Inter, system-ui, sans-serif'}
                            onChange={e => {
                              const currentSlides = selectedElement.props?.slides || [];
                              const newSlides = currentSlides.map((s, i) => {
                                if (i === index) {
                                  const newPosition = { ...s.textPosition };
                                  newPosition.fontFamily = e.target.value;
                                  return { ...s, textPosition: newPosition };
                                }
                                return s;
                              });
                              updateElement(selectedElement.id, { 
                                props: { 
                                  ...selectedElement.props, 
                                  slides: newSlides 
                                } 
                              });
                            }}
                            disabled={isPreviewMode}
                            style={{
                              width: '100%',
                              padding: '8px 12px',
                              fontSize: '12px',
                              border: '1px solid #d1d5db',
                              borderRadius: '6px',
                              backgroundColor: '#ffffff',
                              fontFamily: 'Inter, system-ui, sans-serif',
                              outline: 'none',
                              cursor: isPreviewMode ? 'not-allowed' : 'pointer'
                            }}
                          >
                            <option value="Inter, system-ui, sans-serif">Inter (Moderno)</option>
                            <option value="Georgia, serif">Georgia (Elegante)</option>
                            <option value="Arial, sans-serif">Arial (Clásico)</option>
                            <option value="'Times New Roman', serif">Times New Roman (Formal)</option>
                            <option value="'Courier New', monospace">Courier New (Técnico)</option>
                          </select>
                        </div>

                        {/* Padding */}
                        <div style={{ marginBottom: '12px' }}>
                          <label style={{ 
                            fontSize: '11px', 
                            color: '#6b7280',
                            fontFamily: 'Inter, system-ui, sans-serif',
                            display: 'block',
                            marginBottom: '4px'
                          }}>
                            Espaciado interno:
                          </label>
                          <select
                            value={slide.textPosition?.padding || '20px'}
                            onChange={e => {
                              const currentSlides = selectedElement.props?.slides || [];
                              const newSlides = currentSlides.map((s, i) => {
                                if (i === index) {
                                  const newPosition = { ...s.textPosition };
                                  newPosition.padding = e.target.value;
                                  return { ...s, textPosition: newPosition };
                                }
                                return s;
                              });
                              updateElement(selectedElement.id, { 
                                props: { 
                                  ...selectedElement.props, 
                                  slides: newSlides 
                                } 
                              });
                            }}
                            disabled={isPreviewMode}
                            style={{
                              width: '100%',
                              padding: '8px 12px',
                              fontSize: '12px',
                              border: '1px solid #d1d5db',
                              borderRadius: '6px',
                              backgroundColor: '#ffffff',
                              fontFamily: 'Inter, system-ui, sans-serif',
                              outline: 'none',
                              cursor: isPreviewMode ? 'not-allowed' : 'pointer'
                            }}
                          >
                            <option value="10px">Pequeño</option>
                            <option value="20px">Mediano</option>
                            <option value="30px">Grande</option>
                            <option value="40px">Muy grande</option>
                          </select>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              </PropertyRow>
            )}
          </PropertyGroup>
        )}

        {/* Gestión de cards para carrusel de cards */}
        {selectedElement.type === 'cardsCarousel' && (
          <PropertyGroup>
            <GroupTitle>
              <Settings size={16} />
              Configuración del Carrusel
            </GroupTitle>
            
            {/* Configuración del carrusel */}
            <PropertyRow>
              <PropertyLabel>Autoplay:</PropertyLabel>
              <input
                type="checkbox"
                checked={selectedElement.props?.autoPlay !== false}
                onChange={e => updateElement(selectedElement.id, { 
                  props: { 
                    ...selectedElement.props, 
                    autoPlay: e.target.checked 
                  } 
                })}
                disabled={isPreviewMode}
              />
            </PropertyRow>
            
            <PropertyRow>
              <PropertyLabel>Mostrar flechas:</PropertyLabel>
              <input
                type="checkbox"
                checked={selectedElement.props?.showArrows !== false}
                onChange={e => updateElement(selectedElement.id, { 
                  props: { 
                    ...selectedElement.props, 
                    showArrows: e.target.checked 
                  } 
                })}
                disabled={isPreviewMode}
              />
            </PropertyRow>
            
            <PropertyRow>
              <PropertyLabel>Mostrar puntos:</PropertyLabel>
              <input
                type="checkbox"
                checked={selectedElement.props?.showDots !== false}
                onChange={e => updateElement(selectedElement.id, { 
                  props: { 
                    ...selectedElement.props, 
                    showDots: e.target.checked 
                  } 
                })}
                disabled={isPreviewMode}
              />
            </PropertyRow>
            
            <PropertyRow>
              <PropertyLabel>Intervalo (ms):</PropertyLabel>
              <PropertyInput
                type="number"
                value={selectedElement.props?.interval || 5000}
                onChange={e => updateElement(selectedElement.id, { 
                  props: { 
                    ...selectedElement.props, 
                    interval: parseInt(e.target.value) || 5000 
                  } 
                })}
                min="1000"
                max="10000"
                step="500"
                disabled={isPreviewMode}
              />
            </PropertyRow>

            {/* Lista de cards */}
            {selectedElement.props?.cards && selectedElement.props.cards.length > 0 && (
              <PropertyRow>
                <PropertyLabel>
                  <Edit3 size={16} />
                  Editar Cards ({selectedElement.props.cards.length})
                </PropertyLabel>
                <div style={{ display: 'flex', flexDirection: 'column', gap: '20px', maxHeight: '600px', overflowY: 'auto' }}>
                  {selectedElement.props.cards.map((card, index) => (
                    <div key={index} style={{ 
                      padding: '16px',
                      border: '1px solid #e5e7eb',
                      borderRadius: '16px',
                      backgroundColor: '#ffffff',
                      boxShadow: '0 2px 8px rgba(0, 0, 0, 0.08)'
                    }}>
                      {/* Header de la card */}
                      <div style={{ 
                        display: 'flex', 
                        alignItems: 'center', 
                        gap: '16px',
                        marginBottom: '16px',
                        paddingBottom: '12px',
                        borderBottom: '2px solid #f1f5f9'
                      }}>
                        <img
                          src={card.props?.image}
                          alt={`Card ${index + 1}`}
                          style={{ 
                            width: '64px', 
                            height: '64px', 
                            objectFit: 'cover',
                            borderRadius: '12px',
                            border: '3px solid #e5e7eb'
                          }}
                        />
                        <div style={{ flex: 1 }}>
                          <div style={{ 
                            fontSize: '20px', 
                            fontWeight: '700',
                            color: '#1e293b',
                            fontFamily: 'Inter, system-ui, sans-serif',
                            marginBottom: '8px'
                          }}>
                            Card {index + 1}
                          </div>
                          <div style={{ 
                            fontSize: '14px', 
                            color: '#64748b',
                            fontFamily: 'Inter, system-ui, sans-serif'
                          }}>
                            {card.props?.title || 'Sin título'}
                          </div>
                        </div>
                        <button
                          style={{
                            background: 'none',
                            border: 'none',
                            color: '#ef4444',
                            cursor: 'pointer',
                            padding: '8px',
                            borderRadius: '6px',
                            display: 'flex',
                            alignItems: 'center',
                            justifyContent: 'center',
                            transition: 'all 0.2s',
                          }}
                          onMouseOver={(e) => {
                            e.target.style.backgroundColor = '#fef2f2';
                          }}
                          onMouseOut={(e) => {
                            e.target.style.backgroundColor = 'transparent';
                          }}
                          onClick={() => {
                            const currentCards = selectedElement.props?.cards || [];
                            const newCards = currentCards.filter((_, i) => i !== index);
                            updateElement(selectedElement.id, { 
                              props: { 
                                ...selectedElement.props, 
                                cards: newCards 
                              } 
                            });
                          }}
                          disabled={isPreviewMode}
                          title="Eliminar card"
                        >
                          <Trash2 size={16} />
                        </button>
                      </div>
                      
                      {/* Editar título */}
                      <div style={{ marginBottom: '16px' }}>
                        <label style={{
                          fontSize: '14px',
                          color: '#374151',
                          fontFamily: 'Inter, system-ui, sans-serif',
                          display: 'flex',
                          alignItems: 'center',
                          gap: '8px',
                          marginBottom: '8px',
                          fontWeight: '600'
                        }}>
                          <FileText size={16} />
                          Título
                        </label>
                        <textarea
                          value={card.props?.title || ''}
                          onChange={e => {
                            const currentCards = selectedElement.props?.cards || [];
                            const newCards = currentCards.map((c, i) => {
                              if (i === index) {
                                return {
                                  ...c,
                                  props: {
                                    ...c.props,
                                    title: e.target.value
                                  }
                                };
                              }
                              return c;
                            });
                            updateElement(selectedElement.id, { 
                              props: { 
                                ...selectedElement.props, 
                                cards: newCards 
                              } 
                            });
                          }}
                          placeholder="Título de la card..."
                          disabled={isPreviewMode}
                          style={{
                            width: '100%',
                            padding: '12px 16px',
                            fontSize: '14px',
                            border: '2px solid #d1d5db',
                            borderRadius: '8px',
                            backgroundColor: '#ffffff',
                            fontFamily: 'Inter, system-ui, sans-serif',
                            resize: 'vertical',
                            minHeight: '80px',
                            outline: 'none',
                            cursor: isPreviewMode ? 'not-allowed' : 'pointer',
                            lineHeight: '1.5'
                          }}
                        />
                      </div>

                      {/* Editar contenido */}
                      <div style={{ marginBottom: '16px' }}>
                        <label style={{
                          fontSize: '14px',
                          color: '#374151',
                          fontFamily: 'Inter, system-ui, sans-serif',
                          display: 'flex',
                          alignItems: 'center',
                          gap: '8px',
                          marginBottom: '8px',
                          fontWeight: '600'
                        }}>
                          <FileText size={16} />
                          Contenido
                        </label>
                        <textarea
                          value={card.props?.content || ''}
                          onChange={e => {
                            const currentCards = selectedElement.props?.cards || [];
                            const newCards = currentCards.map((c, i) => {
                              if (i === index) {
                                return {
                                  ...c,
                                  props: {
                                    ...c.props,
                                    content: e.target.value
                                  }
                                };
                              }
                              return c;
                            });
                            updateElement(selectedElement.id, { 
                              props: { 
                                ...selectedElement.props, 
                                cards: newCards 
                              } 
                            });
                          }}
                          placeholder="Contenido de la card..."
                          disabled={isPreviewMode}
                          style={{
                            width: '100%',
                            padding: '12px 16px',
                            fontSize: '14px',
                            border: '2px solid #d1d5db',
                            borderRadius: '8px',
                            backgroundColor: '#ffffff',
                            fontFamily: 'Inter, system-ui, sans-serif',
                            resize: 'vertical',
                            minHeight: '100px',
                            outline: 'none',
                            cursor: isPreviewMode ? 'not-allowed' : 'pointer',
                            lineHeight: '1.5'
                          }}
                        />
                      </div>

                      {/* Campos de edición organizados en grid */}
                      <div style={{ 
                        display: 'grid', 
                        gridTemplateColumns: '1fr 1fr', 
                        gap: '16px',
                        marginBottom: '16px'
                      }}>
                        {/* Editar categoría */}
                        <div>
                          <label style={{
                            fontSize: '14px',
                            color: '#374151',
                            fontFamily: 'Inter, system-ui, sans-serif',
                            display: 'flex',
                            alignItems: 'center',
                            gap: '8px',
                            marginBottom: '8px',
                            fontWeight: '600'
                          }}>
                            <Tag size={16} />
                            Categoría
                          </label>
                          <PropertyInput
                            type="text"
                            value={card.props?.category || ''}
                            onChange={e => {
                              const currentCards = selectedElement.props?.cards || [];
                              const newCards = currentCards.map((c, i) => {
                                if (i === index) {
                                  return {
                                    ...c,
                                    props: {
                                      ...c.props,
                                      category: e.target.value
                                    }
                                  };
                                }
                                return c;
                              });
                              updateElement(selectedElement.id, { 
                                props: { 
                                  ...selectedElement.props, 
                                  cards: newCards 
                                } 
                              });
                            }}
                            placeholder="Categoría..."
                            disabled={isPreviewMode}
                            style={{
                              padding: '12px 16px',
                              fontSize: '14px',
                              border: '2px solid #d1d5db',
                              borderRadius: '8px'
                            }}
                          />
                        </div>

                        {/* Color de la categoría */}
                        <div>
                          <label style={{
                            fontSize: '12px',
                            color: '#6b7280',
                            fontFamily: 'Inter, system-ui, sans-serif',
                            display: 'flex',
                            alignItems: 'center',
                            gap: '6px',
                            marginBottom: '6px',
                            fontWeight: '500'
                          }}>
                            <Palette size={14} />
                            Color de categoría
                          </label>
                          <input
                            type="color"
                            value={card.props?.categoryColor || '#3b82f6'}
                            onChange={e => {
                              const currentCards = selectedElement.props?.cards || [];
                              const newCards = currentCards.map((c, i) => {
                                if (i === index) {
                                  return {
                                    ...c,
                                    props: {
                                      ...c.props,
                                      categoryColor: e.target.value
                                    }
                                  };
                                }
                                return c;
                              });
                              updateElement(selectedElement.id, { 
                                props: { 
                                  ...selectedElement.props, 
                                  cards: newCards 
                                } 
                              });
                            }}
                            disabled={isPreviewMode}
                            style={{
                              width: '100%',
                              height: '40px',
                              border: '2px solid #d1d5db',
                              borderRadius: '8px',
                              cursor: isPreviewMode ? 'not-allowed' : 'pointer'
                            }}
                          />
                        </div>
                      </div>

                    {/* Configuración del botón */}
                    <div style={{ 
                      padding: '20px',
                      backgroundColor: '#f8fafc',
                      borderRadius: '12px',
                      border: '2px solid #e2e8f0'
                    }}>
                      <div style={{
                        display: 'flex',
                        alignItems: 'center',
                        gap: '10px',
                        marginBottom: '16px'
                      }}>
                        <Link size={18} />
                        <span style={{
                          fontSize: '16px',
                          fontWeight: '700',
                          color: '#1e293b',
                          fontFamily: 'Inter, system-ui, sans-serif'
                        }}>
                          Configuración del Botón
                        </span>
                      </div>

                      <div style={{ 
                        display: 'grid', 
                        gridTemplateColumns: '1fr 1fr', 
                        gap: '12px',
                        marginBottom: '12px'
                      }}>
                        {/* Mostrar/Ocultar botón */}
                        <div>
                          <label style={{
                            fontSize: '12px',
                            color: '#6b7280',
                            fontFamily: 'Inter, system-ui, sans-serif',
                            display: 'flex',
                            alignItems: 'center',
                            gap: '6px',
                            marginBottom: '6px',
                            fontWeight: '500'
                          }}>
                            {card.props?.showButton ? <Eye size={14} /> : <EyeOff size={14} />}
                            Mostrar botón
                          </label>
                          <div style={{
                            display: 'flex',
                            alignItems: 'center',
                            gap: '8px'
                          }}>
                            <input
                              type="checkbox"
                              checked={card.props?.showButton || false}
                              onChange={e => {
                                const currentCards = selectedElement.props?.cards || [];
                                const newCards = currentCards.map((c, i) => {
                                  if (i === index) {
                                    return {
                                      ...c,
                                      props: {
                                        ...c.props,
                                        showButton: e.target.checked
                                      }
                                    };
                                  }
                                  return c;
                                });
                                updateElement(selectedElement.id, { 
                                  props: { 
                                    ...selectedElement.props, 
                                    cards: newCards 
                                  } 
                                });
                              }}
                              disabled={isPreviewMode}
                              style={{
                                width: '16px',
                                height: '16px',
                                cursor: isPreviewMode ? 'not-allowed' : 'pointer'
                              }}
                            />
                            <span style={{
                              fontSize: '12px',
                              color: '#6b7280',
                              fontFamily: 'Inter, system-ui, sans-serif'
                            }}>
                              {card.props?.showButton ? 'Visible' : 'Oculto'}
                            </span>
                          </div>
                        </div>
                      </div>

                      {card.props?.showButton && (
                        <div style={{ 
                          display: 'grid', 
                          gridTemplateColumns: '1fr 1fr', 
                          gap: '16px'
                        }}>
                          {/* Texto del botón */}
                          <div>
                            <label style={{
                              fontSize: '12px',
                              color: '#6b7280',
                              fontFamily: 'Inter, system-ui, sans-serif',
                              display: 'flex',
                              alignItems: 'center',
                              gap: '6px',
                              marginBottom: '6px',
                              fontWeight: '500'
                            }}>
                              <FileText size={14} />
                              Texto del botón
                            </label>
                            <PropertyInput
                              type="text"
                              value={card.props?.buttonText || ''}
                              onChange={e => {
                                const currentCards = selectedElement.props?.cards || [];
                                const newCards = currentCards.map((c, i) => {
                                  if (i === index) {
                                    return {
                                      ...c,
                                      props: {
                                        ...c.props,
                                        buttonText: e.target.value
                                      }
                                    };
                                  }
                                  return c;
                                });
                                updateElement(selectedElement.id, { 
                                  props: { 
                                    ...selectedElement.props, 
                                    cards: newCards 
                                  } 
                                });
                              }}
                              placeholder="Leer más..."
                              disabled={isPreviewMode}
                              style={{
                                padding: '12px 16px',
                                fontSize: '14px',
                                border: '2px solid #d1d5db',
                                borderRadius: '8px'
                              }}
                            />
                            
                            {/* Color del botón */}
                            <div style={{ marginTop: '12px' }}>
                              <label style={{
                                fontSize: '12px',
                                color: '#6b7280',
                                fontFamily: 'Inter, system-ui, sans-serif',
                                display: 'flex',
                                alignItems: 'center',
                                gap: '6px',
                                marginBottom: '6px',
                                fontWeight: '500'
                              }}>
                                <Palette size={14} />
                                Color del botón
                              </label>
                              <input
                                type="color"
                                value={card.props?.buttonColor || '#3b82f6'}
                                onChange={e => {
                                  const currentCards = selectedElement.props?.cards || [];
                                  const newCards = currentCards.map((c, i) => {
                                    if (i === index) {
                                      return {
                                        ...c,
                                        props: {
                                          ...c.props,
                                          buttonColor: e.target.value
                                        }
                                      };
                                    }
                                    return c;
                                  });
                                  updateElement(selectedElement.id, { 
                                    props: { 
                                      ...selectedElement.props, 
                                      cards: newCards 
                                    } 
                                  });
                                }}
                                disabled={isPreviewMode}
                                style={{
                                  width: '100%',
                                  height: '40px',
                                  border: '2px solid #d1d5db',
                                  borderRadius: '8px',
                                  cursor: isPreviewMode ? 'not-allowed' : 'pointer'
                                }}
                              />
                            </div>
                          </div>

                          {/* Sección de destino */}
                          <div>
                            <label style={{
                              fontSize: '12px',
                              color: '#6b7280',
                              fontFamily: 'Inter, system-ui, sans-serif',
                              display: 'flex',
                              alignItems: 'center',
                              gap: '6px',
                              marginBottom: '6px',
                              fontWeight: '500'
                            }}>
                              <Link size={14} />
                              Sección de destino
                            </label>
                            <select
                              value={card.props?.buttonUrl || ''}
                              onChange={e => {
                                const currentCards = selectedElement.props?.cards || [];
                                const newCards = currentCards.map((c, i) => {
                                  if (i === index) {
                                    return {
                                      ...c,
                                      props: {
                                        ...c.props,
                                        buttonUrl: e.target.value
                                      }
                                    };
                                  }
                                  return c;
                                });
                                updateElement(selectedElement.id, { 
                                  props: { 
                                    ...selectedElement.props, 
                                    cards: newCards 
                                  } 
                                });
                              }}
                              disabled={isPreviewMode}
                              style={{
                                width: '100%',
                                padding: '12px 16px',
                                fontSize: '14px',
                                border: '2px solid #d1d5db',
                                borderRadius: '8px',
                                backgroundColor: '#ffffff',
                                fontFamily: 'Inter, system-ui, sans-serif',
                                outline: 'none',
                                cursor: isPreviewMode ? 'not-allowed' : 'pointer'
                              }}
                            >
                              <option value="">Seleccionar sección...</option>
                              {/* Secciones reales del editor */}
                              {Object.values(sections).map((section) => (
                                <option key={section.id} value={section.id}>
                                  {section.isHome ? '🏠' : '📋'} {section.name}
                                </option>
                              ))}
                            </select>
                          </div>
                        </div>
                      )}
                                         </div>
                     
                                           {/* Editar imagen */}
                      <div style={{ marginBottom: '16px' }}>
                        <label style={{
                          fontSize: '14px',
                          color: '#374151',
                          fontFamily: 'Inter, system-ui, sans-serif',
                          display: 'flex',
                          alignItems: 'center',
                          gap: '8px',
                          marginBottom: '8px',
                          fontWeight: '600'
                        }}>
                          <Image size={16} />
                          Imagen de la card
                        </label>
                        
                        {/* URL de imagen */}
                        <div style={{ marginBottom: '8px' }}>
                          <PropertyInput
                            type="text"
                            value={card.props?.image || ''}
                            onChange={e => {
                              const currentCards = selectedElement.props?.cards || [];
                              const newCards = currentCards.map((c, i) => {
                                if (i === index) {
                                  return {
                                    ...c,
                                    props: {
                                      ...c.props,
                                      image: e.target.value
                                    }
                                  };
                                }
                                return c;
                              });
                              updateElement(selectedElement.id, { 
                                props: { 
                                  ...selectedElement.props, 
                                  cards: newCards 
                                } 
                              });
                            }}
                            placeholder="https://ejemplo.com/imagen.jpg"
                            disabled={isPreviewMode}
                            style={{
                              padding: '12px 16px',
                              fontSize: '14px',
                              border: '2px solid #d1d5db',
                              borderRadius: '8px'
                            }}
                          />
                        </div>
                        
                        {/* Subir imagen */}
                        <div style={{
                          display: 'flex',
                          alignItems: 'center',
                          gap: '8px'
                        }}>
                          <input
                            type="file"
                            accept="image/*"
                            onChange={e => {
                              const file = e.target.files[0];
                              if (file) {
                                const reader = new FileReader();
                                reader.onload = (event) => {
                                  const currentCards = selectedElement.props?.cards || [];
                                  const newCards = currentCards.map((c, i) => {
                                    if (i === index) {
                                      return {
                                        ...c,
                                        props: {
                                          ...c.props,
                                          image: event.target.result
                                        }
                                      };
                                    }
                                    return c;
                                  });
                                  updateElement(selectedElement.id, { 
                                    props: { 
                                      ...selectedElement.props, 
                                      cards: newCards 
                                    } 
                                  });
                                };
                                reader.readAsDataURL(file);
                              }
                            }}
                            disabled={isPreviewMode}
                            style={{
                              display: 'none'
                            }}
                            id={`image-upload-${index}`}
                          />
                          <label
                            htmlFor={`image-upload-${index}`}
                            style={{
                              display: 'flex',
                              alignItems: 'center',
                              gap: '6px',
                              padding: '8px 12px',
                              backgroundColor: '#f3f4f6',
                              border: '1px solid #d1d5db',
                              borderRadius: '6px',
                              cursor: isPreviewMode ? 'not-allowed' : 'pointer',
                              fontSize: '12px',
                              color: '#374151',
                              fontFamily: 'Inter, system-ui, sans-serif',
                              transition: 'all 0.2s',
                              opacity: isPreviewMode ? 0.5 : 1
                            }}
                            onMouseOver={(e) => {
                              if (!isPreviewMode) {
                                e.target.style.backgroundColor = '#e5e7eb';
                              }
                            }}
                            onMouseOut={(e) => {
                              if (!isPreviewMode) {
                                e.target.style.backgroundColor = '#f3f4f6';
                              }
                            }}
                          >
                            <Image size={14} />
                            Subir imagen
                          </label>
                        </div>
                      </div>


                      

                    </div>
                  ))}
                </div>
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