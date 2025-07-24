import React, { useRef, useEffect, useState } from 'react';
import styled from 'styled-components';
import { useEditor } from '../context/EditorContext';
import RecursiveElementRenderer from './RecursiveElementRenderer';

const CanvasContainer = styled.div`
  flex: 1;
  background: linear-gradient(135deg, #f8fafc 0%, #e2e8f0 100%);
  overflow-y: auto;
  overflow-x: auto;
  position: relative;
  display: flex;
  align-items: flex-start;
  justify-content: center;
  padding: 40px 20px;
  height: 100%;
  min-height: 0;
`;

const CanvasArea = styled.div`
  background: #ffffff;
  box-shadow: 0 8px 32px rgba(0, 0, 0, 0.12);
  border-radius: 16px;
  position: relative;
  transform-origin: center;
  transform: scale(${props => props.zoom / 100});
  transition: transform 0.3s ease;
  width: 1450px;
  min-width: 1450px;
  max-width: 1450px;
  height: ${props => props.height}px;
  border: 1px solid #e5e7eb;
  margin-bottom: 40px;
  margin-left: auto;
  margin-right: auto;
`;

const CanvasGrid = styled.div`
  position: absolute;
  top: as       
  left: 0;
  width: 100%;
  height: 100%;
  background-image: 
    linear-gradient(rgba(59, 130, 246, 0.08) 1px, transparent 1px),
    linear-gradient(90deg, rgba(59, 130, 246, 0.08) 1px, transparent 1px);
  background-size: 24px 24px;
  pointer-events: none;
  z-index: 0;
  opacity: 0.6;
`;

const CenterLines = styled.div`
  position: absolute;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  pointer-events: none;
  z-index: 1;
`;

const CenterLine = styled.div`
  position: absolute;
  background: ${props => props.$isActive ? 'rgba(239, 68, 68, 0.8)' : 'rgba(59, 130, 246, 0.3)'};
  transition: all 0.2s ease;
  
  ${props => props.$isVertical ? `
    width: 1px;
    height: 100%;
    left: ${props.$position}px;
  ` : `
    height: 1px;
    width: 100%;
    top: ${props.$position}px;
  `}
`;

const AlignmentGuides = styled.div`
  position: absolute;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  pointer-events: none;
  z-index: 2;
`;

const AlignmentLine = styled.div`
  position: absolute;
  background: rgba(16, 185, 129, 0.8);
  transition: all 0.2s ease;
  
  ${props => props.$isVertical ? `
    width: 1px;
    height: 100%;
    left: ${props.$position}px;
  ` : `
    height: 1px;
    width: 100%;
    top: ${props.$position}px;
  `}
`;

// Líneas de snap activas (más visibles y brillantes)
const SnapGuides = styled.div`
  position: absolute;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  pointer-events: none;
  z-index: 3; // Por encima de las líneas de alineación
`;

const SnapLine = styled.div`
  position: absolute;
  background: rgba(239, 68, 68, 0.9); // Rojo brillante para snap activo
  box-shadow: 0 0 4px rgba(239, 68, 68, 0.5);
  transition: all 0.1s ease;
  
  ${props => props.$isVertical ? `
    width: 1px;
    height: 100%;
    left: ${props.$position - 1}px; // Centrar la línea
  ` : `
    height: 1px;
    width: 100%;
    top: ${props.$position - 1}px; // Centrar la línea
  `}
`;

const CanvasContent = styled.div`
  position: relative;
  z-index: 1;
  width: 100%;
  height: 100%;
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

const GuideInfo = styled.div`
  position: fixed;
  top: 120px;
  right: 20px;
  background: linear-gradient(135deg, #3b82f6, #1d4ed8);
  color: white;
  padding: 12px 16px;
  border-radius: 12px;
  font-size: 12px;
  font-weight: 500;
  z-index: 1000;
  box-shadow: 0 4px 12px rgba(59, 130, 246, 0.3);
  font-family: 'Inter', system-ui, sans-serif;
  max-width: 200px;
  line-height: 1.4;
`;

const GOOGLE_FONTS = [
  'Roboto','Montserrat','Lato','Oswald','Poppins','Merriweather','Nunito','Raleway','Playfair Display','Fira Sans','Ubuntu','Quicksand','Rubik','Bebas Neue'
];

const injectGoogleFonts = (elements) => {
  const fonts = new Set();
  const findFonts = (els) => {
    els.forEach(el => {
      if (el.styles?.fontFamily) fonts.add(el.styles.fontFamily.replace(/['"]/g, ''));
      if (el.children) findFonts(el.children);
    });
  };
  findFonts(elements);
  // Elimina links previos
  document.querySelectorAll('link[data-hiplot-font]').forEach(link => link.remove());
  Array.from(fonts).forEach(font => {
    if (GOOGLE_FONTS.includes(font)) {
      const link = document.createElement('link');
      link.rel = 'stylesheet';
      link.href = `https://fonts.googleapis.com/css?family=${encodeURIComponent(font)}:400,700&display=swap`;
      link.setAttribute('data-hiplot-font', 'true');
      document.head.appendChild(link);
    }
  });
};

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
    updateElement,
    showGuides,
    snapLines,
    canvasBackground
  } = useEditor();
  
  const canvasRef = useRef(null);
  const containerRef = useRef(null);
  const sidebarRef = useRef(null);

  // Estado para límites reales
  const [realBounds, setRealBounds] = useState({
    canvas: { left: 0, right: 0, top: 0, bottom: 0, width: 0, height: 0 },
    container: { left: 0, right: 0, top: 0, bottom: 0, width: 0, height: 0 },
    sidebar: { right: 0 }
  });

  useEffect(() => {
    const updateBounds = () => {
      const canvasRect = canvasRef.current?.getBoundingClientRect() || { left: 0, right: 0, top: 0, bottom: 0, width: 0, height: 0 };
      const containerRect = containerRef.current?.getBoundingClientRect() || { left: 0, right: 0, top: 0, bottom: 0, width: 0, height: 0 };
      const sidebarRect = sidebarRef.current?.getBoundingClientRect() || { right: 0 };
      setRealBounds({
        canvas: canvasRect,
        container: containerRect,
        sidebar: { right: sidebarRect.right }
      });
    };
    updateBounds();
    window.addEventListener('resize', updateBounds);
    return () => window.removeEventListener('resize', updateBounds);
  }, [elements]);

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
        // setShowScrollIndicator(isScrolling); // This state was removed, so this effect is no longer needed
      }
    };

    const container = containerRef.current;
    if (container) {
      container.addEventListener('scroll', handleScroll);
      handleScroll();
      return () => container.removeEventListener('scroll', handleScroll);
    }
  }, [elements]);

  useEffect(() => {
    injectGoogleFonts(elements);
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
    // setIsDragOver(false); // This state was removed, so this effect is no longer needed
    
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
              return { width: '450px', height: '450px' };
            case 'section':
              return { width: '1450px', height: '300px' };
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
    // setIsDragOver(true); // This state was removed, so this effect is no longer needed
  };

  const handleDragLeave = (e) => {
    if (!e.currentTarget.contains(e.relatedTarget)) {
      // setIsDragOver(false); // This state was removed, so this effect is no longer needed
    }
  };

  // Obtener elemento seleccionado (incluye elementos anidados)
  const { findElementById } = useEditor();
  const selectedElement = findElementById(elements, selectedElementId);

  // Función para calcular líneas de alineación
  const calculateAlignmentLines = (draggedElement, mouseX, mouseY) => {
    const tolerance = 10; // Píxeles de tolerancia para la alineación
    const canvasRect = canvasRef.current?.getBoundingClientRect();
    if (!canvasRect) return { vertical: null, horizontal: null };

    const canvasLeft = canvasRect.left;
    const canvasTop = canvasRect.top;
    const relativeX = mouseX - canvasLeft;
    const relativeY = mouseY - canvasTop;

    let verticalLine = null;
    let horizontalLine = null;

    // Verificar alineación con el centro del canvas
    const centerX = canvasWidth / 2;
    const centerY = canvasHeight / 2;

    if (Math.abs(relativeX - centerX) < tolerance) {
      verticalLine = centerX;
    }

    if (Math.abs(relativeY - centerY) < tolerance) {
      horizontalLine = centerY;
    }

    // Verificar alineación con otros elementos
    elements.forEach(element => {
      if (element.id === draggedElement?.id) return;

      const elementX = element.position?.x || 0;
      const elementY = element.position?.y || 0;
      const elementWidth = parseInt(element.size?.width) || 100;
      const elementHeight = parseInt(element.size?.height) || 100;

      // Alineación vertical (bordes izquierdos, centros, bordes derechos)
      const elementCenterX = elementX + elementWidth / 2;
      const elementRightX = elementX + elementWidth;

      if (Math.abs(relativeX - elementX) < tolerance) {
        verticalLine = elementX;
      } else if (Math.abs(relativeX - elementCenterX) < tolerance) {
        verticalLine = elementCenterX;
      } else if (Math.abs(relativeX - elementRightX) < tolerance) {
        verticalLine = elementRightX;
      }

      // Alineación horizontal (bordes superiores, centros, bordes inferiores)
      const elementCenterY = elementY + elementHeight / 2;
      const elementBottomY = elementY + elementHeight;

      if (Math.abs(relativeY - elementY) < tolerance) {
        horizontalLine = elementY;
      } else if (Math.abs(relativeY - elementCenterY) < tolerance) {
        horizontalLine = elementCenterY;
      } else if (Math.abs(relativeY - elementBottomY) < tolerance) {
        horizontalLine = elementBottomY;
      }
    });

    return { vertical: verticalLine, horizontal: horizontalLine };
  };

  // Forzar canvasWidth a 1500px
  const forcedCanvasWidth = 1500;

  return (
    <CanvasContainer 
      ref={containerRef}
      className="canvas-container"
      onDrop={handleDrop}
      onDragOver={handleDragOver}
      onDragLeave={handleDragLeave}
      style={{ background: canvasBackground }}
    >
      {/* Sidebar (si existe) */}
      <div ref={sidebarRef} className="sidebar-area" style={{ display: 'none' }} />
      <CanvasArea
        ref={canvasRef}
      
        width={forcedCanvasWidth}
        height={canvasHeight}
        zoom={zoom}
        onClick={handleCanvasClick}
      >
        {!isPreviewMode && (
          <CanvasGrid />
        )}
        
        <DropZone isDragOver={false}> {/* isDragOver state was removed, so this is no longer needed */}
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
                realBounds={realBounds}
              />
            )}
          </ElementsContainer>
        </CanvasContent>
      </CanvasArea>
      
      {/* Panel de información flotante */}
      
      
    
     
      
      {/* {showGuides && !isPreviewMode && (
        <GuideInfo>
          <div style={{ fontWeight: '600', marginBottom: '4px' }}>📏 Líneas de Guía</div>
          <div>• Líneas azules: Centros del canvas</div>
          <div>• Líneas verdes: Alineación con elementos</div>
          <div>• Tolerancia: 10px</div>
        </GuideInfo>
      )} */}
    </CanvasContainer>
  );
};

export default Canvas; 