import React, { useRef, useEffect, useState } from 'react';
import styled from 'styled-components';
import { useEditor } from '../context/EditorContext';
import RecursiveElementRenderer from './RecursiveElementRenderer';

const CanvasContainer = styled.div`
  flex: 1;
  background: linear-gradient(135deg, #f8fafc 0%, #e2e8f0 100%);
  overflow-y: auto;
  overflow-x: hidden;
  position: relative;
  display: flex;
  align-items: flex-start;
  justify-content: center;
  padding: 40px 20px;
  height: 100vh;
`;

const CanvasArea = styled.div`
  background: #ffffff;
  box-shadow: 0 8px 32px rgba(0, 0, 0, 0.12);
  border-radius: 16px;
  position: relative;
  transform-origin: center;
  transform: scale(${props => props.zoom / 100});
  transition: transform 0.3s ease;
  width: ${props => props.width}px;
  height: ${props => Math.max(props.height, 2000)}px;
  max-width: 100%;
  border: 1px solid #e5e7eb;
  margin-bottom: 40px;
`;

const CanvasGrid = styled.div`
  position: absolute;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  background-image: 
    linear-gradient(rgba(59, 130, 246, 0.08) 1px, transparent 1px),
    linear-gradient(90deg, rgba(59, 130, 246, 0.08) 1px, transparent 1px);
  background-size: 24px 24px;
  pointer-events: none;
  z-index: 0;
  opacity: 0.6;
`;

const CanvasContent = styled.div`
  position: relative;
  z-index: 1;
  width: 100%;
  height: 100%;
  padding: 20px;
`;

const ElementsContainer = styled.div`
  width: 100%;
  height: 100%;
  position: relative;
`;

const EmptyState = styled.div`
  position: absolute;
  top: 50%;
  left: 50%;
  transform: translate(-50%, -50%);
  text-align: center;
  color: #6b7280;
  padding: 60px 40px;
  background: linear-gradient(135deg, #f9fafb, #f3f4f6);
  border-radius: 20px;
  border: 2px dashed #d1d5db;
  max-width: 400px;
  box-shadow: 0 4px 16px rgba(0, 0, 0, 0.05);
  z-index: 10;
`;

const EmptyStateIcon = styled.div`
  font-size: 64px;
  margin-bottom: 24px;
  opacity: 0.7;
`;

const EmptyStateText = styled.h3`
  font-size: 20px;
  margin: 0 0 12px 0;
  font-weight: 600;
  color: #374151;
  font-family: 'Inter', system-ui, sans-serif;
`;

const EmptyStateSubtext = styled.p`
  font-size: 16px;
  margin: 0 0 24px 0;
  opacity: 0.8;
  line-height: 1.5;
  font-family: 'Inter', system-ui, sans-serif;
`;

const EmptyStateHint = styled.div`
  background: #3b82f6;
  color: white;
  padding: 8px 16px;
  border-radius: 8px;
  font-size: 14px;
  font-weight: 500;
  display: inline-block;
  font-family: 'Inter', system-ui, sans-serif;
`;

const InfoBadge = styled.div`
  position: fixed;
  top: 80px;
  right: 20px;
  background: linear-gradient(135deg, #3b82f6, #1d4ed8);
  color: white;
  padding: 12px 16px;
  border-radius: 12px;
  font-size: 14px;
  font-weight: 600;
  z-index: 1000;
  box-shadow: 0 4px 12px rgba(59, 130, 246, 0.3);
  font-family: 'Inter', system-ui, sans-serif;
  display: flex;
  flex-direction: column;
  gap: 4px;
  min-width: 200px;
`;

const InfoItem = styled.div`
  display: flex;
  justify-content: space-between;
  align-items: center;
  font-size: 12px;
`;

const DropZone = styled.div`
  position: absolute;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  background: rgba(59, 130, 246, 0.1);
  border: 3px dashed #3b82f6;
  border-radius: 16px;
  display: ${props => props.isDragOver ? 'flex' : 'none'};
  align-items: center;
  justify-content: center;
  z-index: 1000;
  backdrop-filter: blur(4px);
`;

const DropMessage = styled.div`
  background: #3b82f6;
  color: white;
  padding: 20px 40px;
  border-radius: 16px;
  font-size: 18px;
  font-weight: 600;
  text-align: center;
  box-shadow: 0 8px 24px rgba(59, 130, 246, 0.3);
  font-family: 'Inter', system-ui, sans-serif;
`;

const ScrollIndicator = styled.div`
  position: fixed;
  bottom: 20px;
  right: 20px;
  background: rgba(0, 0, 0, 0.7);
  color: white;
  padding: 8px 12px;
  border-radius: 8px;
  font-size: 12px;
  font-weight: 500;
  z-index: 1000;
  font-family: 'Inter', system-ui, sans-serif;
  display: flex;
  align-items: center;
  gap: 6px;
`;

const Canvas = ({ isPreviewMode }) => {
  const { 
    elements, 
    zoom, 
    canvasWidth, 
    canvasHeight, 
    selectedElementId, 
    selectElement,
    moveElement,
    addElement,
    deleteElement,
    updateElement
  } = useEditor();
  
  const canvasRef = useRef(null);
  const containerRef = useRef(null);
  const [isDragOver, setIsDragOver] = useState(false);
  const [showScrollIndicator, setShowScrollIndicator] = useState(false);

  useEffect(() => {
    const handleKeyDown = (e) => {
      if (e.key === 'Delete' && selectedElementId) {
        if (window.confirm('¿Estás seguro de que quieres eliminar este elemento?')) {
          deleteElement(selectedElementId);
        }
      }
      if (e.key === 'Escape') {
        selectElement(null);
      }
      // Atajos de teclado adicionales
      if (e.ctrlKey || e.metaKey) {
        switch (e.key) {
          case 'z':
            e.preventDefault();
            // Implementar undo/redo después
            break;
          case 'd':
            e.preventDefault();
            // Duplicar elemento seleccionado después
            break;
        }
      }
    };

    document.addEventListener('keydown', handleKeyDown);
    return () => document.removeEventListener('keydown', handleKeyDown);
  }, [selectedElementId, deleteElement, selectElement]);

  // Detectar scroll y mostrar indicador
  useEffect(() => {
    const handleScroll = () => {
      if (containerRef.current) {
        const { scrollTop, scrollHeight, clientHeight } = containerRef.current;
        const isScrolling = scrollTop > 0 || scrollTop + clientHeight < scrollHeight;
        setShowScrollIndicator(isScrolling);
      }
    };

    const container = containerRef.current;
    if (container) {
      container.addEventListener('scroll', handleScroll);
      handleScroll();
      return () => container.removeEventListener('scroll', handleScroll);
    }
  }, [elements]);

  const handleCanvasClick = (e) => {
    if (e.target === canvasRef.current || e.target.closest('.canvas-content')) {
      selectElement(null);
    }
  };

  const handleElementClick = (e, elementId) => {
    e.stopPropagation();
    selectElement(elementId);
  };

  // Manejar drop de secciones y elementos desde sidebar
  const handleDrop = (e) => {
    e.preventDefault();
    setIsDragOver(false);
    
    // Obtener la posición del drop relativa al canvas
    const canvasRect = canvasRef.current.getBoundingClientRect();
    const dropX = e.clientX - canvasRect.left;
    const dropY = e.clientY - canvasRect.top;
    
    const sectionData = e.dataTransfer.getData('section');
    const elementData = e.dataTransfer.getData('element');
    
    if (sectionData) {
      try {
        const section = JSON.parse(sectionData);
        if (section.elements && Array.isArray(section.elements)) {
          section.elements.forEach((el, index) => {
            // Usar la posición del drop como base y ajustar para cada elemento
            const baseX = dropX + (index * 50);
            const baseY = dropY + (index * 50);
            
            addElement(
              el.type, 
              { ...el.props }, 
              el.children || [], 
              el.styles || {},
              el.position || { x: baseX, y: baseY },
              el.size || { width: '300px', height: '200px' }
            );
          });
        }
      } catch (error) {
        console.error('Error parsing dropped section:', error);
      }
    } else if (elementData) {
      try {
        const element = JSON.parse(elementData);
        
        // Determinar tamaño apropiado según el tipo
        const getDefaultSize = (type) => {
          switch (type) {
            case 'text':
              return { width: '300px', height: 'auto' };
            case 'heading':
              return { width: '400px', height: 'auto' };
            case 'button':
              return { width: 'auto', height: 'auto' };
            case 'image':
              return { width: '300px', height: '200px' };
            case 'container':
            case 'section':
              return { width: '400px', height: '300px' };
            case 'grid':
            case 'columns':
              return { width: '500px', height: '300px' };
            case 'card':
              return { width: '300px', height: '250px' };
            case 'rectangle':
              return { width: '200px', height: '120px' };
            case 'circle':
              return { width: '120px', height: '120px' };
            case 'triangle':
              return { width: '120px', height: '100px' };
            default:
              return { width: '200px', height: '100px' };
          }
        };
        
        const defaultSize = getDefaultSize(element.type);
        
        addElement(
          element.type,
          element.props || {},
          element.children || [],
          element.styles || {},
          { x: dropX, y: dropY },
          defaultSize
        );
      } catch (error) {
        console.error('Error parsing dropped element:', error);
      }
    }
  };

  const handleDragOver = (e) => {
    e.preventDefault();
    setIsDragOver(true);
  };

  const handleDragLeave = (e) => {
    if (!e.currentTarget.contains(e.relatedTarget)) {
      setIsDragOver(false);
    }
  };

  // Obtener elemento seleccionado (incluye elementos anidados)
  const { findElementById } = useEditor();
  const selectedElement = findElementById(elements, selectedElementId);

  return (
    <CanvasContainer 
      ref={containerRef}
      className="canvas-container"
      onDrop={handleDrop}
      onDragOver={handleDragOver}
      onDragLeave={handleDragLeave}
    >
      <CanvasArea
        ref={canvasRef}
        width={canvasWidth}
        height={canvasHeight}
        zoom={zoom}
        onClick={handleCanvasClick}
      >
        {!isPreviewMode && <CanvasGrid />}
        
        <DropZone isDragOver={isDragOver}>
          <DropMessage>
            🎨 Suelta aquí para agregar elementos
          </DropMessage>
        </DropZone>
        
        <CanvasContent className="canvas-content">
          <ElementsContainer>
            {elements.length === 0 ? (
              <EmptyState>
                <EmptyStateIcon>🎨</EmptyStateIcon>
                <EmptyStateText>Comienza a crear tu sitio web</EmptyStateText>
                <EmptyStateSubtext>
                  Arrastra elementos desde la barra lateral para empezar a diseñar. 
                  Cada elemento se puede mover y redimensionar libremente.
                </EmptyStateSubtext>
                <EmptyStateHint>
                  💡 Tip: Haz clic para seleccionar, arrastra para mover
                </EmptyStateHint>
              </EmptyState>
            ) : (
              <RecursiveElementRenderer
                elements={elements}
                isPreviewMode={isPreviewMode}
                onElementClick={handleElementClick}
                onDelete={deleteElement}
                onDropSection={() => {}}
              />
            )}
          </ElementsContainer>
        </CanvasContent>
      </CanvasArea>
      
      {/* Panel de información flotante */}
      <InfoBadge>
        <InfoItem>
          <span>📊 Elementos:</span>
          <span>{elements.length}</span>
        </InfoItem>
        <InfoItem>
          <span>🎯 Seleccionado:</span>
          <span>{selectedElement ? selectedElement.type : 'Ninguno'}</span>
        </InfoItem>
        <InfoItem>
          <span>🔍 Zoom:</span>
          <span>{zoom}%</span>
        </InfoItem>
        <InfoItem>
          <span>📐 Canvas:</span>
          <span>{canvasWidth}x{canvasHeight}</span>
        </InfoItem>
      </InfoBadge>
      
      {showScrollIndicator && (
        <ScrollIndicator>
          <span>📜</span>
          <span>Scroll para ver más contenido</span>
        </ScrollIndicator>
      )}
    </CanvasContainer>
  );
};

export default Canvas; 