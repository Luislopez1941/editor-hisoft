import React, { useState, useRef } from 'react';
import styled from 'styled-components';
import { Move, Maximize2, Edit3, Trash2, Settings } from 'lucide-react';
import { useEditor } from '../context/EditorContext';

const ElementWrapper = styled.div`
  ${props => {
    // Elementos que se pueden mover libremente tienen posición absoluta
    if (["section", "container", "card", "grid", "columns", "text", "heading", "button", "image"].includes(props.elementType)) {
      return `
        position: absolute;
        left: ${props.position?.x || 50}px;
        top: ${props.position?.y || 50}px;
        width: ${props.size?.width || 'auto'};
        height: ${props.size?.height || 'auto'};
        min-width: ${props.elementType === 'section' ? '400px' : '100px'};
        min-height: ${props.elementType === 'section' ? '200px' : '30px'};
        z-index: ${props.isDragging ? 1000 : props.isSelected ? 100 : 1};
      `;
    } else {
      return `
        position: static;
        width: 100%;
        height: auto;
        z-index: auto;
      `;
    }
  }}
  cursor: ${props => props.isDragging ? 'grabbing' : props.isPreviewMode ? 'default' : 'pointer'};
  user-select: ${props => props.isPreviewMode ? 'text' : 'none'};
  border: ${props => props.isSelected && !props.isPreviewMode ? '2px solid #3b82f6' : '2px solid transparent'};
  border-radius: 8px;
  transition: all 0.2s ease;
  background: ${props => props.isSelected && !props.isPreviewMode ? 'rgba(59, 130, 246, 0.05)' : 'transparent'};
  
  &:hover {
    border-color: ${props => !props.isPreviewMode && !props.isSelected ? '#60a5fa' : props.isSelected ? '#3b82f6' : 'transparent'};
    background: ${props => !props.isPreviewMode && !props.isSelected ? 'rgba(96, 165, 250, 0.05)' : props.isSelected ? 'rgba(59, 130, 246, 0.05)' : 'transparent'};
  }
`;

// Text Elements
const TextElement = styled.div`
  margin: ${props => props.styles?.margin || '0'};
  padding: ${props => props.styles?.padding || '16px'};
  font-family: ${props => props.styles?.fontFamily || 'Inter, system-ui, sans-serif'};
  font-size: ${props => props.styles?.fontSize || '16px'};
  font-weight: ${props => props.styles?.fontWeight || '400'};
  color: ${props => props.styles?.color || '#374151'};
  text-align: ${props => props.styles?.textAlign || 'left'};
  line-height: ${props => props.styles?.lineHeight || '1.6'};
  background: ${props => props.styles?.background || 'transparent'};
  border-radius: ${props => props.styles?.borderRadius || '0'};
  width: 100%;
  display: block;
  min-height: 24px;
`;

const HeadingElement = styled.h1`
  margin: ${props => props.styles?.margin || '0 0 16px 0'};
  padding: ${props => props.styles?.padding || '8px'};
  font-family: ${props => props.styles?.fontFamily || 'Inter, system-ui, sans-serif'};
  font-size: ${props => {
    const level = props.level || 1;
    const sizes = { 1: '36px', 2: '30px', 3: '24px', 4: '20px', 5: '18px', 6: '16px' };
    return props.styles?.fontSize || sizes[level];
  }};
  font-weight: ${props => props.styles?.fontWeight || '700'};
  color: ${props => props.styles?.color || '#111827'};
  text-align: ${props => props.styles?.textAlign || 'left'};
  line-height: ${props => props.styles?.lineHeight || '1.2'};
  background: ${props => props.styles?.background || 'transparent'};
  border-radius: ${props => props.styles?.borderRadius || '0'};
  width: 100%;
  display: block;
  min-height: 32px;
`;

// Button Element
const ButtonElement = styled.button`
  margin: ${props => props.styles?.margin || '8px 0'};
  padding: ${props => props.styles?.padding || '12px 24px'};
  font-family: ${props => props.styles?.fontFamily || 'Inter, system-ui, sans-serif'};
  font-size: ${props => props.styles?.fontSize || '16px'};
  font-weight: ${props => props.styles?.fontWeight || '600'};
  color: ${props => props.styles?.color || '#ffffff'};
  background: ${props => {
    const variant = props.variant || 'primary';
    const variants = {
      primary: 'linear-gradient(135deg, #3b82f6, #1d4ed8)',
      secondary: 'linear-gradient(135deg, #6b7280, #374151)',
      success: 'linear-gradient(135deg, #10b981, #047857)',
      danger: 'linear-gradient(135deg, #ef4444, #dc2626)',
      warning: 'linear-gradient(135deg, #f59e0b, #d97706)'
    };
    return props.styles?.background || variants[variant];
  }};
  border: ${props => props.styles?.border || 'none'};
  border-radius: ${props => props.styles?.borderRadius || '8px'};
  cursor: pointer;
  transition: all 0.2s ease;
  width: auto;
  display: inline-block;
  box-shadow: ${props => props.styles?.boxShadow || '0 2px 4px rgba(0, 0, 0, 0.1)'};
  
  &:hover {
    transform: translateY(-1px);
    box-shadow: 0 4px 8px rgba(0, 0, 0, 0.15);
  }
`;

// Image Element
const ImageElement = styled.img`
  width: 100%;
  height: auto;
  max-height: 400px;
  object-fit: ${props => props.styles?.objectFit || 'cover'};
  border-radius: ${props => props.styles?.borderRadius || '8px'};
  border: ${props => props.styles?.border || 'none'};
  box-shadow: 0 4px 12px rgba(0, 0, 0, 0.1);
`;

// Container Elements
const SectionElement = styled.section`
  width: 100%;
  height: 100%;
  background: ${props => props.styles?.background || 'linear-gradient(135deg, #f8fafc, #e2e8f0)'};
  padding: ${props => props.styles?.padding || '80px 0'};
  border-radius: ${props => props.styles?.borderRadius || '0'};
  border: ${props => props.styles?.border || 'none'};
  box-shadow: ${props => props.styles?.boxShadow || 'none'};
  margin: ${props => props.styles?.margin || '0'};
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  position: relative;
`;

const ContainerElement = styled.div`
  width: 100%;
  height: 100%;
  max-width: ${props => props.styles?.maxWidth || '1200px'};
  margin: ${props => props.styles?.margin || '0 auto'};
  padding: ${props => props.styles?.padding || '40px 20px'};
  background: ${props => props.styles?.background || 'transparent'};
  border-radius: ${props => props.styles?.borderRadius || '12px'};
  border: ${props => props.styles?.border || 'none'};
  display: ${props => props.styles?.display || 'block'};
  flex-direction: ${props => props.styles?.flexDirection || 'column'};
  align-items: ${props => props.styles?.alignItems || 'center'};
  justify-content: ${props => props.styles?.justifyContent || 'center'};
  gap: ${props => props.styles?.gap || '20px'};
  box-shadow: ${props => props.styles?.boxShadow || 'none'};
`;

// Grid Elements
const GridElement = styled.div`
  width: 100%;
  height: 100%;
  display: grid;
  grid-template-columns: repeat(${props => props.columns || 3}, 1fr);
  gap: ${props => props.gap || '20px'};
  background: ${props => props.styles?.background || 'transparent'};
  padding: ${props => props.styles?.padding || '20px'};
  border-radius: ${props => props.styles?.borderRadius || '12px'};
  border: ${props => props.styles?.border || 'none'};
`;

const ColumnsElement = styled.div`
  width: 100%;
  height: 100%;
  display: grid;
  grid-template-columns: repeat(${props => props.columns || 2}, 1fr);
  gap: ${props => props.gap || '32px'};
  background: ${props => props.styles?.background || 'transparent'};
  padding: ${props => props.styles?.padding || '20px'};
  border-radius: ${props => props.styles?.borderRadius || '12px'};
  border: ${props => props.styles?.border || 'none'};
`;

// Shape Elements
const RectangleElement = styled.div`
  width: 100%;
  height: 100%;
  background: ${props => props.styles?.background || 'linear-gradient(135deg, #3b82f6, #1d4ed8)'};
  border-radius: ${props => props.styles?.borderRadius || '8px'};
  border: ${props => props.styles?.border || 'none'};
  box-shadow: 0 4px 12px rgba(59, 130, 246, 0.2);
`;

const CircleElement = styled.div`
  width: 120px;
  height: 120px;
  background: ${props => props.styles?.background || 'linear-gradient(135deg, #3b82f6, #1d4ed8)'};
  border-radius: 50%;
  border: ${props => props.styles?.border || 'none'};
  box-shadow: 0 4px 12px rgba(59, 130, 246, 0.2);
`;

const TriangleElement = styled.div`
  width: 0;
  height: 0;
  border-left: 60px solid transparent;
  border-right: 60px solid transparent;
  border-bottom: 100px solid ${props => props.styles?.background || '#3b82f6'};
  background: transparent;
  filter: drop-shadow(0 4px 8px rgba(59, 130, 246, 0.2));
`;

// Card Elements
const CardElement = styled.div`
  width: 100%;
  height: 100%;
  background: ${props => props.styles?.background || '#ffffff'};
  border: ${props => props.styles?.border || '1px solid #e5e7eb'};
  border-radius: ${props => props.styles?.borderRadius || '16px'};
  box-shadow: ${props => props.styles?.boxShadow || '0 4px 16px rgba(0, 0, 0, 0.08)'};
  padding: ${props => props.styles?.padding || '32px'};
  text-align: ${props => props.styles?.textAlign || 'center'};
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  transition: all 0.2s ease;
  
  &:hover {
    transform: translateY(-2px);
    box-shadow: 0 8px 24px rgba(0, 0, 0, 0.12);
  }
`;

const ToolbarContextual = styled.div`
  position: absolute;
  top: -50px;
  left: 50%;
  transform: translateX(-50%);
  display: flex;
  gap: 4px;
  background: #ffffff;
  border-radius: 12px;
  box-shadow: 0 4px 16px rgba(0, 0, 0, 0.12);
  padding: 8px;
  z-index: 10000;
  border: 1px solid #e5e7eb;
  align-items: center;
`;

const ToolbarButton = styled.button`
  background: ${props => props.$active ? '#3b82f6' : '#f9fafb'};
  color: ${props => props.$active ? '#ffffff' : '#374151'};
  border: none;
  border-radius: 8px;
  width: 32px;
  height: 32px;
  display: flex;
  align-items: center;
  justify-content: center;
  font-size: 16px;
  cursor: pointer;
  transition: all 0.2s;
  
  &:hover {
    background: ${props => props.$danger ? '#ef4444' : '#3b82f6'};
    color: #ffffff;
    transform: scale(1.05);
  }
`;

const ResizeHandle = styled.div`
  position: absolute;
  width: 10px;
  height: 10px;
  background: #3b82f6;
  border: 2px solid #fff;
  border-radius: 50%;
  z-index: 1001;
  cursor: ${props => props.cursor || 'pointer'};
`;

const EditInput = styled.input`
  width: 100%;
  padding: 8px 12px;
  border: 2px solid #3b82f6;
  border-radius: 6px;
  font-size: inherit;
  font-weight: inherit;
  font-family: inherit;
  color: inherit;
  background: #ffffff;
  outline: none;
  box-shadow: 0 0 0 3px rgba(59, 130, 246, 0.1);
`;

const ElementRenderer = ({ 
  element, 
  isSelected, 
  isPreviewMode, 
  onClick,
  onMove,
  onDelete,
  onDropSection,
  renderChildren = true
}) => {
  const [isDragging, setIsDragging] = useState(false);
  const [isResizing, setIsResizing] = useState(false);
  const [dragStart, setDragStart] = useState({ x: 0, y: 0 });
  const [resizeStart, setResizeStart] = useState({ x: 0, y: 0, width: 0, height: 0 });
  const elementRef = useRef(null);
  const { 
    updateElement, 
    deleteElement, 
    selectElement, 
    selectedElementId 
  } = useEditor();

  // Estado para edición inline
  const [editing, setEditing] = useState(false);
  const [editValue, setEditValue] = useState(element.props?.content || '');
  const inputRef = useRef(null);

  // Determinar si es movible/editable
  const isMovable = ["section", "container", "columns", "card", "grid", "text", "heading", "button", "image"].includes(element.type);

  // Manejar click
  const handleElementClick = (e, id) => {
    e.stopPropagation();
    selectElement(id);
  };

  // Movimiento libre
  const handleMouseDown = (e) => {
    if (isPreviewMode || !isMovable) return;
    if (e.target.dataset.resize) return; // No mover si es handle de resize
    
    e.preventDefault();
    e.stopPropagation();
    setIsDragging(true);
    
    const rect = elementRef.current.getBoundingClientRect();
    setDragStart({
      x: e.clientX - rect.left,
      y: e.clientY - rect.top
    });
    
    selectElement(element.id);
  };

  const handleMouseMove = (e) => {
    if (!isDragging && !isResizing) return;
    
    if (isDragging) {
      const canvasRect = elementRef.current.parentElement.getBoundingClientRect();
      const newX = Math.max(0, e.clientX - canvasRect.left - dragStart.x);
      const newY = Math.max(0, e.clientY - canvasRect.top - dragStart.y);
      
      updateElement(element.id, {
        position: { x: newX, y: newY }
      });
    }
    
    if (isResizing) {
      const deltaX = e.clientX - resizeStart.x;
      const deltaY = e.clientY - resizeStart.y;
      const newWidth = Math.max(100, resizeStart.width + deltaX);
      const newHeight = Math.max(50, resizeStart.height + deltaY);
      
      updateElement(element.id, {
        size: { width: `${newWidth}px`, height: `${newHeight}px` }
      });
    }
  };

  const handleMouseUp = () => {
    setIsDragging(false);
    setIsResizing(false);
  };

  // Redimensionamiento
  const handleResizeStart = (e) => {
    e.stopPropagation();
    setIsResizing(true);
    const rect = elementRef.current.getBoundingClientRect();
    setResizeStart({
      x: e.clientX,
      y: e.clientY,
      width: rect.width,
      height: rect.height
    });
  };

  // Efectos de mouse
  React.useEffect(() => {
    if (isDragging || isResizing) {
      document.addEventListener('mousemove', handleMouseMove);
      document.addEventListener('mouseup', handleMouseUp);
      return () => {
        document.removeEventListener('mousemove', handleMouseMove);
        document.removeEventListener('mouseup', handleMouseUp);
      };
    }
  }, [isDragging, isResizing, dragStart, resizeStart]);

  // Funciones del toolbar contextual
  const handleEdit = () => {
    if (element.type === 'text' || element.type === 'heading') {
      setEditing(true);
      setEditValue(element.props?.content || '');
      setTimeout(() => inputRef.current && inputRef.current.focus(), 0);
    }
  };

  const handleDelete = () => {
    if (window.confirm('¿Estás seguro de que quieres eliminar este elemento?')) {
      deleteElement(element.id);
    }
  };

  const handleSettings = () => {
    // Abrir panel de propiedades (implementaremos después)
    console.log('Abrir panel de propiedades para:', element.id);
  };

  // Guardar edición
  const saveEdit = () => {
    updateElement(element.id, { 
      props: { ...element.props, content: editValue } 
    });
    setEditing(false);
  };

  const cancelEdit = () => {
    setEditValue(element.props?.content || '');
    setEditing(false);
  };

  // Doble clic para editar texto/heading
  const handleDoubleClick = (e) => {
    if (!isPreviewMode && (element.type === 'text' || element.type === 'heading')) {
      handleEdit();
      e.stopPropagation();
    }
  };

  // Acción para botones
  const handleButtonClick = (e) => {
    e.stopPropagation();
    if (isPreviewMode) {
      alert(`Navegando: ${element.props?.text || 'Botón'}`);
    }
  };

  const renderElement = () => {
    switch (element.type) {
      case 'text':
        if (editing) {
          return (
            <EditInput
              ref={inputRef}
              value={editValue}
              onChange={e => setEditValue(e.target.value)}
              onBlur={saveEdit}
              onKeyDown={e => {
                if (e.key === 'Enter') saveEdit();
                if (e.key === 'Escape') cancelEdit();
              }}
              placeholder="Escribe tu texto aquí..."
            />
          );
        }
        return (
          <TextElement styles={element.styles} onDoubleClick={handleDoubleClick}>
            {element.props?.content || 'Haz doble clic para editar este texto'}
          </TextElement>
        );
      
      case 'heading':
        if (editing) {
          return (
            <EditInput
              ref={inputRef}
              value={editValue}
              onChange={e => setEditValue(e.target.value)}
              onBlur={saveEdit}
              onKeyDown={e => {
                if (e.key === 'Enter') saveEdit();
                if (e.key === 'Escape') cancelEdit();
              }}
              placeholder="Escribe tu título aquí..."
              style={{ 
                fontSize: element.styles?.fontSize || '24px', 
                fontWeight: 'bold' 
              }}
            />
          );
        }
        return (
          <HeadingElement 
            as={`h${element.props?.level || 1}`}
            level={element.props?.level}
            styles={element.styles}
            onDoubleClick={handleDoubleClick}
          >
            {element.props?.content || 'Título Principal'}
          </HeadingElement>
        );
      
      case 'button':
        return (
          <ButtonElement 
            variant={element.props?.variant}
            styles={element.styles}
            onClick={handleButtonClick}
          >
            {element.props?.text || 'Botón'}
          </ButtonElement>
        );
      
      case 'image':
        return (
          <ImageElement 
            src={element.props?.src || 'https://images.unsplash.com/photo-1557804506-669a67965ba0?w=800&h=400&fit=crop'} 
            alt={element.props?.alt || 'Imagen'}
            styles={element.styles}
          />
        );
      
      case 'section':
      case 'container':
      case 'grid':
      case 'columns':
        const ElementComponent = {
          section: SectionElement,
          container: ContainerElement,
          grid: GridElement,
          columns: ColumnsElement,
        }[element.type];
        
        return (
          <ElementComponent 
            styles={element.styles}
            columns={element.props?.columns}
            gap={element.props?.gap}
          >
            {renderChildren && element.children?.map(child => (
              <div
                key={child.id}
                style={{
                  position: 'absolute',
                  left: child.position?.x || 0,
                  top: child.position?.y || 0,
                  width: child.size?.width || 'auto',
                  height: child.size?.height || 'auto',
                  zIndex: selectedElementId === child.id ? 100 : 1,
                  pointerEvents: 'auto'
                }}
              >
                <ElementRenderer
                  element={child}
                  isSelected={selectedElementId === child.id}
                  isPreviewMode={isPreviewMode}
                  onClick={onClick}
                  onMove={onMove}
                  onDelete={onDelete}
                  onDropSection={onDropSection}
                  renderChildren={false}
                />
              </div>
            ))}
          </ElementComponent>
        );
      
      case 'rectangle':
        return <RectangleElement styles={element.styles} />;
      
      case 'circle':
        return <CircleElement styles={element.styles} />;
      
      case 'triangle':
        return <TriangleElement styles={element.styles} />;
      
      case 'card':
        return (
          <CardElement styles={element.styles}>
            {element.props?.image && (
              <img 
                src={element.props?.image} 
                alt="Card" 
                style={{ 
                  width: '100%', 
                  height: '200px', 
                  objectFit: 'cover', 
                  borderRadius: '12px', 
                  marginBottom: '20px' 
                }} 
              />
            )}
            <h3 style={{ 
              margin: '0 0 12px 0', 
              fontSize: '24px', 
              fontWeight: '700', 
              color: '#111827',
              fontFamily: 'Inter, system-ui, sans-serif'
            }}>
              {element.props?.title || 'Título de la Tarjeta'}
            </h3>
            <p style={{ 
              margin: 0, 
              fontSize: '16px', 
              color: '#6b7280', 
              lineHeight: '1.6',
              fontFamily: 'Inter, system-ui, sans-serif'
            }}>
              {element.props?.content || 'Descripción de la tarjeta con información relevante.'}
            </p>
          </CardElement>
        );
      
      default:
        return (
          <div style={{ 
            padding: '20px', 
            background: 'linear-gradient(135deg, #f3f4f6, #e5e7eb)', 
            border: '2px dashed #d1d5db',
            borderRadius: '12px',
            color: '#6b7280',
            fontSize: '16px',
            textAlign: 'center',
            fontFamily: 'Inter, system-ui, sans-serif'
          }}>
            Elemento {element.type}
          </div>
        );
    }
  };

  return (
    <ElementWrapper
      ref={elementRef}
      position={element.position}
      size={element.size}
      isSelected={isSelected}
      isPreviewMode={isPreviewMode}
      isDragging={isDragging}
      onClick={(e) => handleElementClick(e, element.id)}
      onMouseDown={handleMouseDown}
      elementType={element.type}
      data-element-id={element.id}
    >
      {/* Toolbar contextual */}
      {isSelected && !isPreviewMode && isMovable && (
        <ToolbarContextual>
          <ToolbarButton 
            title="Mover elemento" 
            $active={isDragging}
          >
            <Move size={16} />
          </ToolbarButton>
          <ToolbarButton 
            title="Redimensionar"
            $active={isResizing}
          >
            <Maximize2 size={16} />
          </ToolbarButton>
          {(element.type === 'text' || element.type === 'heading') && (
            <ToolbarButton 
              title="Editar texto" 
              onClick={handleEdit}
              $active={editing}
            >
              <Edit3 size={16} />
            </ToolbarButton>
          )}
          <ToolbarButton 
            title="Propiedades" 
            onClick={handleSettings}
          >
            <Settings size={16} />
          </ToolbarButton>
          <ToolbarButton 
            title="Eliminar elemento" 
            onClick={handleDelete}
            $danger={true}
          >
            <Trash2 size={16} />
          </ToolbarButton>
        </ToolbarContextual>
      )}
      
      {/* Handles de redimensionamiento */}
      {isSelected && !isPreviewMode && isMovable && (
        <>
          <ResizeHandle 
            style={{ bottom: -5, right: -5 }}
            cursor="se-resize"
            data-resize="br"
            onMouseDown={handleResizeStart}
          />
          <ResizeHandle 
            style={{ bottom: -5, left: -5 }}
            cursor="sw-resize"
            data-resize="bl"
            onMouseDown={handleResizeStart}
          />
          <ResizeHandle 
            style={{ top: -5, right: -5 }}
            cursor="ne-resize"
            data-resize="tr"
            onMouseDown={handleResizeStart}
          />
          <ResizeHandle 
            style={{ top: -5, left: -5 }}
            cursor="nw-resize"
            data-resize="tl"
            onMouseDown={handleResizeStart}
          />
        </>
      )}
      
      {renderElement()}
    </ElementWrapper>
  );
};

export default ElementRenderer; 