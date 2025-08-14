import React, { useState, useRef } from 'react';
import styled from 'styled-components';
import { Move, Maximize2, Edit3, Trash2, Settings } from 'lucide-react';
import { useEditor } from '../context/EditorContext';
import CatalogSection from './views/CatalogSection';
import CarouselComponent from './CarouselComponent';
import ModernCard from './ModernCard';
import CardsCarousel from './CardsCarousel';

const ElementWrapper = styled.div`
  ${props => {
    // Elementos que se pueden mover libremente tienen posición absoluta
    if (["section", "container", "header", "card", "modernCard", "cardsCarousel", "grid", "columns", "text", "heading", "button", "image", "catalog-section", "carousel"].includes(props.elementType)) {
      return `
        position: absolute;
        left: ${props.position?.x ?? 0}px;
        top: ${props.position?.y ?? 0}px;
        width: ${props.size?.width || 'auto'};
        height: ${props.size?.height || 'auto'};
        min-width: ${props.elementType === 'section' ? '400px' : props.elementType === 'catalog-section' ? '800px' : props.elementType === 'carousel' ? '600px' : props.elementType === 'modernCard' ? '300px' : props.elementType === 'cardsCarousel' ? '800px' : '100px'};
        min-height: ${props.elementType === 'section' ? '200px' : props.elementType === 'catalog-section' ? '600px' : props.elementType === 'carousel' ? '300px' : props.elementType === 'modernCard' ? '400px' : props.elementType === 'cardsCarousel' ? '500px' : '30px'};
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
  font-family: ${props => {
    const fontFamily = props.styles?.fontFamily || 'Inter';
    return `"${fontFamily}", system-ui, sans-serif`;
  }};
  font-size: ${props => props.styles?.fontSize || '16px'};
  font-weight: ${props => props.styles?.fontWeight || '400'};
  color: ${props => props.styles?.color || '#374151'};
  text-align: ${props => props.styles?.textAlign || 'left'};
  line-height: ${props => props.styles?.lineHeight || '1.6'};
  background: ${props => props.styles?.background || 'transparent'};
  border-radius: ${props => props.styles?.borderRadius || '0'};
  width: fit-content;
  display: block;
  min-height: 24px;
`;

const HeadingElement = styled.h1`
  margin: ${props => props.styles?.margin || '0 0 16px 0'};
  padding: ${props => props.styles?.padding || '8px'};
  font-family: ${props => {
    const fontFamily = props.styles?.fontFamily || 'Inter';
    return `"${fontFamily}", system-ui, sans-serif`;
  }};
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
  width: fit-content;
  display: block;
  min-height: 32px;
`;

// Button Element
const ButtonElement = styled.button`
  margin: ${props => props.styles?.margin || '8px 0'};
  padding: ${props => props.styles?.padding || '12px 24px'};
  font-family: ${props => {
    const fontFamily = props.styles?.fontFamily || 'Inter';
    return `"${fontFamily}", system-ui, sans-serif`;
  }};
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
`;

// Image Element
const ImageElement = styled.img`
  width: 100%;
  height: auto;
  max-height: 400px;
  object-fit: ${props => {
    const src = props.src || '';
    if (src.startsWith('data:image/svg+xml') || src.endsWith('.svg')) return 'contain';
    return props.styles?.objectFit || 'cover';
  }};
  border-radius: ${props => props.styles?.borderRadius || '8px'};
  border: ${props => props.styles?.border || 'none'};
  box-shadow: 0 4px 12px rgba(0, 0, 0, 0.1);
  background: transparent;
`;

// Container Elements
const SectionElement = styled.section`
  width: ${props => props.size?.width || '1450px'};
  max-width: 1450px;
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
  width: ${props => props.size?.width || '1450px'};
  max-width: 1450px;
  height: 100%;
  margin: ${props => props.styles?.margin || '0 auto'};
  padding: ${props => props.styles?.padding ?? '0'};
  background: ${props => props.styles?.background ?? 'transparent'};
  border-radius: ${props => props.styles?.borderRadius ?? '0'};
  border: ${props => props.styles?.border || 'none'};
  display: ${props => props.styles?.display || 'block'};
  flex-direction: ${props => props.styles?.flexDirection || 'column'};
  align-items: ${props => props.styles?.alignItems || 'stretch'};
  justify-content: ${props => props.styles?.justifyContent || 'flex-start'};
  gap: ${props => props.styles?.gap ?? '0'};
  box-shadow: ${props => props.styles?.boxShadow || 'none'};
`;

// HeaderElement eliminado - se trata como container normal

// Grid Elements
const GridElement = styled.div`
  width: ${props => props.size?.width || '1450px'};
  max-width: 1450px;
  height: 100%;
  display: grid;
  grid-template-columns: repeat(${props => props.columns || 3}, 1fr);
  gap: ${props => props.gap || '20px'};
  background: ${props => props.styles?.background || 'transparent'};
  padding: ${props => props.styles?.padding || '20px'};
  border-radius: ${props => props.styles?.borderRadius || '0'};
  border: ${props => props.styles?.border || 'none'};
`;

const ColumnsElement = styled.div`
  width: ${props => props.size?.width || '1450px'};
  max-width: 1450px;
  height: 100%;
  display: grid;
  grid-template-columns: repeat(${props => props.columns || 2}, 1fr);
  gap: ${props => props.gap || '32px'};
  background: ${props => props.styles?.background || 'transparent'};
  padding: ${props => props.styles?.padding || '20px'};
  border-radius: ${props => props.styles?.borderRadius || '0'};
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
  z-index: 999;
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
  background: #3b82f6;
  border: 2px solid #fff;
  z-index: 1001;
  cursor: ${props => props.cursor || 'pointer'};
  
  ${props => {
    if (props.$type === 'corner') {
      return `
        width: 10px;
        height: 10px;
        border-radius: 50%;
      `;
    } else if (props.$type === 'width') {
      return `
        width: 8px;
        height: 20px;
        border-radius: 4px;
        border: 2px solid #fff;
        background: #10b981;
      `;
    } else if (props.$type === 'height') {
      return `
        width: 20px;
        height: 8px;
        border-radius: 4px;
        border: 2px solid #fff;
        background: #f59e0b;
      `;
    }
  }}
  
  &:hover {
    transform: scale(1.2);
    transition: transform 0.2s ease;
  }
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
  renderChildren = true,
  realBounds
}) => {
  const [isDragging, setIsDragging] = useState(false);
  const [isResizing, setIsResizing] = useState(false);
  const [resizeType, setResizeType] = useState(null); // 'corner', 'width', 'height'
  const [resizeHandle, setResizeHandle] = useState(null); // 'br', 'bl', 'tr', 'tl', 'left', 'right', 'top', 'bottom'
  const [dragStart, setDragStart] = useState({ x: 0, y: 0 });
  const [resizeStart, setResizeStart] = useState({ x: 0, y: 0, width: 0, height: 0 });
  const elementRef = useRef(null);
  const { 
    updateElement, 
    deleteElement, 
    selectElement, 
    selectedElementId,
    elements,
    canvasWidth,
    canvasHeight,
    setSnapLines,
    setActiveSection,
    sections
  } = useEditor();

  // Referencias al header eliminadas
  const safe = (v, fallback) => (typeof v === 'number' && !isNaN(v) && v >= 0 ? v : fallback);
  const safeWidth = safe(canvasWidth, 1200);
  const safeHeight = safe(canvasHeight, 800);
  
  // Función para obtener los límites reales del canvas
  const getCanvasBounds = () => {
    const canvasArea = document.querySelector('.canvas-area');
    if (canvasArea) {
      const rect = canvasArea.getBoundingClientRect();
      return {
        left: rect.left,
        top: rect.top,
        width: rect.width,
        height: rect.height
      };
    }
    return {
      left: 0,
      top: 0,
      width: safeWidth,
      height: safeHeight
    };
  };
  
  // Limites del canvas
  const leftLimit = 0;
  const rightLimit = safeWidth;
  const topLimit = 0; // Permitir pegar al top
  const bottomLimit = safeHeight;
  const limitsValid = rightLimit - leftLimit > 50 && bottomLimit - topLimit > 50;

  // Estado para edición inline
  const [editing, setEditing] = useState(false);
  const [editValue, setEditValue] = useState(element.type === 'button' ? (element.props?.text || '') : (element.props?.content || ''));
  const inputRef = useRef(null);

  // Determinar si es movible/editable
  const isMovable = ["section", "container", "header", "columns", "card", "grid", "text", "heading", "button", "image", "catalog-section", "carousel", "cardsCarousel"].includes(element.type);

  // Función para calcular snap automático y líneas activas
  const calculateSnapPosition = (newX, newY) => {
    const tolerance = 20; // Tolerancia ajustada para mejor precisión
    let snappedX = newX;
    let snappedY = newY;
    const activeVerticalLines = [];
    const activeHorizontalLines = [];
    
    const elementWidth = elementRef.current?.offsetWidth || 100;
    const elementHeight = elementRef.current?.offsetHeight || 100;
    
    // Snap al centro del canvas (horizontal y vertical)
    const canvasCenterX = safeWidth / 2;
    const canvasCenterY = safeHeight / 2;
    const elementCenterX = snappedX + elementWidth / 2;
    const elementCenterY = snappedY + elementHeight / 2;
    
    // Centrado horizontal del canvas
    if (Math.abs(elementCenterX - canvasCenterX) < tolerance) {
      snappedX = canvasCenterX - elementWidth / 2;
      activeVerticalLines.push(canvasCenterX);
    }
    
    // Centrado vertical del canvas
    if (Math.abs(elementCenterY - canvasCenterY) < tolerance) {
      snappedY = canvasCenterY - elementHeight / 2;
      activeHorizontalLines.push(canvasCenterY);
    }
    
    // Snap a otros elementos para centrado relativo
    elements.forEach(otherElement => {
      if (otherElement.id === element.id) return;
      
      const otherX = otherElement.position?.x || 0;
      const otherY = otherElement.position?.y || 0;
      const otherWidth = parseInt(otherElement.size?.width) || 100;
      const otherHeight = parseInt(otherElement.size?.height) || 100;
      
      // Centrado horizontal con otros elementos
      const otherCenterX = otherX + otherWidth / 2;
      if (Math.abs(elementCenterX - otherCenterX) < tolerance) {
        snappedX = otherCenterX - elementWidth / 2;
        activeVerticalLines.push(otherCenterX);
      }
      
      // Centrado vertical con otros elementos
      const otherCenterY = otherY + otherHeight / 2;
      if (Math.abs(elementCenterY - otherCenterY) < tolerance) {
        snappedY = otherCenterY - elementHeight / 2;
        activeHorizontalLines.push(otherCenterY);
      }
      
      // Alineación con bordes de otros elementos
      if (Math.abs(snappedX - otherX) < tolerance) {
        snappedX = otherX;
        activeVerticalLines.push(otherX);
      } else if (Math.abs((snappedX + elementWidth) - (otherX + otherWidth)) < tolerance) {
        snappedX = otherX + otherWidth - elementWidth;
        activeVerticalLines.push(otherX + otherWidth);
      }
      
      if (Math.abs(snappedY - otherY) < tolerance) {
        snappedY = otherY;
        activeHorizontalLines.push(otherY);
      } else if (Math.abs((snappedY + elementHeight) - (otherY + otherHeight)) < tolerance) {
        snappedY = otherY + otherHeight - elementHeight;
        activeHorizontalLines.push(otherY + otherHeight);
      }
    });
    
    // Snap a los límites del canvas (solo cuando está muy cerca)
    if (Math.abs(snappedX - leftLimit) < tolerance) {
      snappedX = leftLimit;
      activeVerticalLines.push(leftLimit);
    }
    if (Math.abs((snappedX + elementWidth) - rightLimit) < tolerance) {
      snappedX = rightLimit - elementWidth;
      activeVerticalLines.push(rightLimit);
    }
    // Snap al top del canvas
    if (Math.abs(snappedY - topLimit) < tolerance) {
      snappedY = topLimit;
      activeHorizontalLines.push(topLimit);
    }
    // Snap al bottom del canvas
    if (Math.abs((snappedY + elementHeight) - bottomLimit) < tolerance) {
      snappedY = bottomLimit - elementHeight;
      activeHorizontalLines.push(bottomLimit);
    }
    
    return { 
      x: snappedX, 
      y: snappedY, 
      snapLines: { vertical: activeVerticalLines, horizontal: activeHorizontalLines } 
    };
  };

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
    
    const canvasBounds = getCanvasBounds();
    const elementRect = elementRef.current.getBoundingClientRect();
    
    // Calcular el offset relativo al canvas, no al viewport
    setDragStart({
      x: e.clientX - canvasBounds.left - (element.position?.x || 0),
      y: e.clientY - canvasBounds.top - (element.position?.y || 0)
    });
    
    selectElement(element.id);
  };

  const handleMouseMove = (e) => {
    if (!isDragging && !isResizing) return;
    
    if (isDragging) {
      const canvasBounds = getCanvasBounds();
      let newX = e.clientX - canvasBounds.left - dragStart.x;
      let newY = e.clientY - canvasBounds.top - dragStart.y;
      
      // Aplicar límites básicos antes del snap
      newX = Math.max(leftLimit, Math.min(newX, rightLimit - (elementRef.current?.offsetWidth || 100)));
      newY = Math.max(0, Math.min(newY, bottomLimit - (elementRef.current?.offsetHeight || 100)));
      
      const { x: snappedX, y: snappedY, snapLines } = calculateSnapPosition(newX, newY);
      
      // Aplicar límites finales después del snap
      const finalX = Math.max(leftLimit, Math.min(snappedX, rightLimit - (elementRef.current?.offsetWidth || 100)));
      const finalY = Math.max(0, Math.min(snappedY, bottomLimit - (elementRef.current?.offsetHeight || 100)));
      
      updateElement(element.id, {
        position: { x: finalX, y: finalY }
      });
      setSnapLines(snapLines);
    }
    
    if (isResizing) {
      const deltaX = e.clientX - resizeStart.x;
      const deltaY = e.clientY - resizeStart.y;
      
      let newWidth = resizeStart.width;
      let newHeight = resizeStart.height;
      let newX = element.position?.x ?? 0;
      let newY = element.position?.y ?? 0;
      
      // Redimensionar según el tipo de handle
      if (resizeType === 'corner') {
        if (resizeHandle === 'br') {
          // Esquina inferior derecha - solo cambiar tamaño
          newWidth = Math.max(50, resizeStart.width + deltaX);
          newHeight = Math.max(30, resizeStart.height + deltaY);
        } else if (resizeHandle === 'bl') {
          // Esquina inferior izquierda - cambiar ancho y posición X
          newWidth = Math.max(50, resizeStart.width - deltaX);
          newHeight = Math.max(30, resizeStart.height + deltaY);
          newX = (element.position?.x ?? 0) + deltaX;
        } else if (resizeHandle === 'tr') {
          // Esquina superior derecha - cambiar alto y posición Y
          newWidth = Math.max(50, resizeStart.width + deltaX);
          newHeight = Math.max(30, resizeStart.height - deltaY);
          newY = (element.position?.y ?? 0) + deltaY;
        } else if (resizeHandle === 'tl') {
          // Esquina superior izquierda - cambiar ambos y ambas posiciones
          newWidth = Math.max(50, resizeStart.width - deltaX);
          newHeight = Math.max(30, resizeStart.height - deltaY);
          newX = (element.position?.x ?? 0) + deltaX;
          newY = (element.position?.y ?? 0) + deltaY;
        }
      } else if (resizeType === 'width') {
        // Handles de ancho
        if (resizeHandle === 'left') {
          // Handle izquierdo - cambiar ancho y posición X
          newWidth = Math.max(50, resizeStart.width - deltaX);
          newX = (element.position?.x ?? 0) + deltaX;
        } else {
          // Handle derecho - solo cambiar ancho
          newWidth = Math.max(50, resizeStart.width + deltaX);
        }
      } else if (resizeType === 'height') {
        // Handles de altura
        if (resizeHandle === 'top') {
          // Handle superior - cambiar alto y posición Y
          newHeight = Math.max(30, resizeStart.height - deltaY);
          newY = (element.position?.y ?? 0) + deltaY;
        } else {
          // Handle inferior - solo cambiar alto
          newHeight = Math.max(30, resizeStart.height + deltaY);
        }
      }
      
      // SNAP HEADER A LA DERECHA
      if (element.type === 'header') {
        const left = newX;
        const rightLimit = Math.min(safeWidth, 1450);
        if (Math.abs(left + newWidth - rightLimit) < 10) {
          newWidth = rightLimit - left;
        }
      }
      
      updateElement(element.id, {
        position: { x: newX, y: newY },
        size: { width: `${newWidth}px`, height: `${newHeight}px` }
      });
    }
  };

  const handleMouseUp = () => {
    setIsDragging(false);
    setIsResizing(false);
    setResizeType(null);
    setResizeHandle(null);
    // Limpiar líneas de snap cuando termina el arrastre
    setSnapLines({ vertical: [], horizontal: [] });
  };

  // Redimensionamiento
  const handleResizeStart = (e, type = 'corner') => {
    e.stopPropagation();
    setIsResizing(true);
    setResizeType(type);
    setResizeHandle(e.target.dataset.resize);
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
    if (element.type === 'text' || element.type === 'heading' || element.type === 'button') {
      setEditing(true);
      setEditValue(element.type === 'button' ? (element.props?.text || '') : (element.props?.content || ''));
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
    if (element.type === 'button') {
      updateElement(element.id, { 
        props: { ...element.props, text: editValue } 
      });
    } else {
      updateElement(element.id, { 
        props: { ...element.props, content: editValue } 
      });
    }
    setEditing(false);
  };

  const cancelEdit = () => {
    setEditValue(element.type === 'button' ? (element.props?.text || '') : (element.props?.content || ''));
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
      // Si el botón tiene una sección vinculada, navegar a ella
      if (element.props?.linkToSection) {
        if (sections[element.props.linkToSection]) {
          setActiveSection(element.props.linkToSection);
        } else {
          alert(`Sección no encontrada: ${element.props.linkToSection}`);
        }
      } else {
        alert(`Navegando: ${element.props?.text || 'Botón'}`);
      }
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
              placeholder="Texto del botón..."
            />
          );
        }
        return (
          <ButtonElement 
            variant={element.props?.variant}
            styles={element.styles}
            onClick={handleButtonClick}
            onDoubleClick={handleEdit}
          >
            {element.props?.text || 'Botón'}
          </ButtonElement>
        );
      
      case 'image':
        const src = element.props?.src || '';
        if (src.startsWith('data:image/svg+xml')) {
          // Extraer el contenido SVG puro
          let svgContent = '';
          try {
            const base64 = src.split(',')[1];
            svgContent = atob(base64);
          } catch (e) {
            svgContent = '';
          }
          return (
            <div
              style={{ width: '100%', height: 'auto', maxHeight: 400, display: 'flex', alignItems: 'center', justifyContent: 'center' }}
              dangerouslySetInnerHTML={{ __html: svgContent }}
            />
          );
        } else if (src.endsWith('.svg')) {
          // Si es un archivo .svg por URL
          return (
            <object
              data={src}
              type="image/svg+xml"
              style={{ width: '100%', height: 'auto', maxHeight: 400, display: 'block' }}
            />
          );
        } else {
          return (
            <ImageElement 
              src={src || 'https://images.unsplash.com/photo-1557804506-669a67965ba0?w=800&h=400&fit=crop'} 
              alt={element.props?.alt || 'Imagen'}
              styles={element.styles}
            />
          );
        }
      
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
            size={element.size}
          >
            {renderChildren && element.children?.map(child => (
              <div
                key={child.id}
                style={{
                  position: 'absolute',
                  left: child.position?.x ?? 0,
                  top: child.position?.y ?? 0,
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
                  realBounds={realBounds}
                />
              </div>
            ))}
          </ElementComponent>
        );
      
      case 'header':
        // Headers ahora se tratan como containers normales
        return (
          <ContainerElement styles={element.styles}>
            {renderChildren && element.children?.map(child => (
              <ElementRenderer
                key={child.id}
                element={child}
                isSelected={selectedElementId === child.id}
                isPreviewMode={isPreviewMode}
                onClick={onClick}
                onMove={onMove}
                onDelete={onDelete}
                onDropSection={onDropSection}
                renderChildren={true}
                realBounds={realBounds}
              />
            ))}
          </ContainerElement>
        );
      
      case 'rectangle':
        return <RectangleElement styles={element.styles} />;
      
      case 'circle':
        return <CircleElement styles={element.styles} />;
      
      case 'triangle':
        return <TriangleElement styles={element.styles} />;
      
      case 'catalog-section':
        return (
          <div style={{
            display: 'grid',
            gridTemplateRows: 'auto 1fr',
            width: '100%',
            height: '100%',
            overflow: 'hidden',
            position: 'relative',
            backgroundColor: 'white'
          }}>
            <CatalogSection 
              isPreviewMode={isPreviewMode}
              title={element.props?.title || 'Catálogo de Productos'}
              subtitle={element.props?.subtitle || 'Explora nuestra selección de productos'}
              {...element.props}
            />
          </div>
        );

      case 'carousel':
        console.log('ElementRenderer: Rendering carousel with onTextPositionChange callback:', !!onMove);
        return (
          <CarouselComponent 
            images={element.props?.images || []}
            slides={element.props?.slides || []}
            autoPlay={element.props?.autoPlay !== false}
            showDots={element.props?.showDots !== false}
            showArrows={element.props?.showArrows !== false}
            interval={element.props?.interval || 3000}
            isPreviewMode={isPreviewMode}
            onTextPositionChange={(slideIndex, newPosition) => {
              console.log('ElementRenderer: onTextPositionChange called', { slideIndex, newPosition });
              // Update the element's slides with the new text position
              const currentSlides = element.props?.slides || [];
              const updatedSlides = [...currentSlides];
              if (updatedSlides[slideIndex]) {
                updatedSlides[slideIndex] = {
                  ...updatedSlides[slideIndex],
                  textPosition: newPosition
                };
                console.log('ElementRenderer: Updated slides', updatedSlides);
                // Update the element in the editor
                if (onMove) {
                  console.log('ElementRenderer: Calling onMove with updated element');
                  onMove(element.id, {
                    ...element,
                    props: {
                      ...element.props,
                      slides: updatedSlides
                    }
                  });
                } else {
                  console.log('ElementRenderer: onMove is not available');
                }
              }
            }}
          />
        );

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

      case 'modernCard':
        return (
          <ModernCard 
            props={element.props}
            styles={element.styles}
            isPreviewMode={isPreviewMode}
          />
        );

      case 'cardsCarousel':
        return (
          <CardsCarousel 
            cards={element.props?.cards || []}
            isPreviewMode={isPreviewMode}
            autoPlay={element.props?.autoPlay !== false}
            interval={element.props?.interval || 5000}
            showDots={element.props?.showDots !== false}
            showArrows={element.props?.showArrows !== false}
          />
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
      
             {/* Handles de redimensionamiento estilo Illustrator */}
       {isSelected && !isPreviewMode && isMovable && (
         <>
           {/* Handles de esquina (resize completo) */}
           <ResizeHandle 
             $type="corner"
             style={{ bottom: -5, right: -5 }}
             cursor="se-resize"
             data-resize="br"
             onMouseDown={(e) => handleResizeStart(e, 'corner')}
             title="Redimensionar ancho y alto"
           />
           <ResizeHandle 
             $type="corner"
             style={{ bottom: -5, left: -5 }}
             cursor="sw-resize"
             data-resize="bl"
             onMouseDown={(e) => handleResizeStart(e, 'corner')}
             title="Redimensionar ancho y alto"
           />
           <ResizeHandle 
             $type="corner"
             style={{ top: -5, right: -5 }}
             cursor="ne-resize"
             data-resize="tr"
             onMouseDown={(e) => handleResizeStart(e, 'corner')}
             title="Redimensionar ancho y alto"
           />
           <ResizeHandle 
             $type="corner"
             style={{ top: -5, left: -5 }}
             cursor="nw-resize"
             data-resize="tl"
             onMouseDown={(e) => handleResizeStart(e, 'corner')}
             title="Redimensionar ancho y alto"
           />
           
           {/* Handles de ancho (solo horizontal) */}
           <ResizeHandle 
             $type="width"
             style={{ 
               right: -4, 
               top: '50%', 
               transform: 'translateY(-50%)' 
             }}
             cursor="e-resize"
             data-resize="right"
             onMouseDown={(e) => handleResizeStart(e, 'width')}
             title="Redimensionar solo ancho"
           />
           <ResizeHandle 
             $type="width"
             style={{ 
               left: -4, 
               top: '50%', 
               transform: 'translateY(-50%)' 
             }}
             cursor="w-resize"
             data-resize="left"
             onMouseDown={(e) => handleResizeStart(e, 'width')}
             title="Redimensionar solo ancho"
           />
           
           {/* Handles de altura (solo vertical) */}
           <ResizeHandle 
             $type="height"
             style={{ 
               bottom: -4, 
               left: '50%', 
               transform: 'translateX(-50%)' 
             }}
             cursor="s-resize"
             data-resize="bottom"
             onMouseDown={(e) => handleResizeStart(e, 'height')}
             title="Redimensionar solo altura"
           />
           <ResizeHandle 
             $type="height"
             style={{ 
               top: -4, 
               left: '50%', 
               transform: 'translateX(-50%)' 
             }}
             cursor="n-resize"
             data-resize="top"
             onMouseDown={(e) => handleResizeStart(e, 'height')}
             title="Redimensionar solo altura"
           />
         </>
       )}
      
      {renderElement()}
    </ElementWrapper>
  );
};

export default ElementRenderer; 