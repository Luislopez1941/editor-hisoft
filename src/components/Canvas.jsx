import React, { useRef, useEffect, useState } from 'react';
import styled from 'styled-components';
import { useEditor } from '../context/EditorContext';
import RecursiveElementRenderer from './RecursiveElementRenderer';
import SnapLines from './SnapLines';
import { Home, Globe, Layers } from 'lucide-react';

const CanvasContainer = styled.div`
  flex: 1;
  background: linear-gradient(135deg, #f8fafc 0%, #e2e8f0 100%);
  overflow-y: auto;
  overflow-x: auto;
  position: relative;
  display: flex;
  flex-direction: column;
  align-items: flex-start;
  justify-content: flex-start;
  padding: 20px;
  height: 100%;
  min-height: 0;
`;

const SectionIndicator = styled.div`
  background: linear-gradient(135deg, #ffffff, #f8fafc);
  border: 1px solid #e5e7eb;
  border-radius: 12px;
  padding: 12px 20px;
  margin-bottom: 20px;
  box-shadow: 0 4px 6px -1px rgba(0, 0, 0, 0.1);
  display: flex;
  align-items: center;
  gap: 12px;
  font-family: 'Inter', system-ui, sans-serif;
  width: fit-content;
  align-self: center;
`;

const SectionIcon = styled.div`
  width: 28px;
  height: 28px;
  border-radius: 8px;
  display: flex;
  align-items: center;
  justify-content: center;
  background: ${props => props.isHome ? 'linear-gradient(135deg, #10b981, #047857)' : 'linear-gradient(135deg, #3b82f6, #1d4ed8)'};
  color: white;
`;

const SectionInfo = styled.div`
  display: flex;
  flex-direction: column;
`;

const SectionName = styled.div`
  font-size: 16px;
  font-weight: 700;
  color: #1e293b;
  margin-bottom: 2px;
`;

const SectionSlug = styled.div`
  font-size: 13px;
  color: #64748b;
  display: flex;
  align-items: center;
  gap: 4px;
`;

const CanvasWrapper = styled.div`
  display: flex;
  align-items: flex-start;
  justify-content: center;
  width: 100%;
  flex: 1;
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
  top: 0;
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

const DropZone = styled.div`
  position: absolute;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
  z-index: 1;
  pointer-events: none;
  display: flex;
  align-items: center;
  justify-content: center;
  opacity: 0;
  transition: opacity 0.3s ease;
`;

const DropMessage = styled.div`
  background: rgba(59, 130, 246, 0.9);
  color: white;
  padding: 20px 40px;
  border-radius: 16px;
  font-size: 18px;
  font-weight: 600;
  box-shadow: 0 8px 32px rgba(0, 0, 0, 0.3);
  font-family: 'Inter', system-ui, sans-serif;
`;

const CanvasContent = styled.div`
  position: relative;
  width: 100%;
  height: 100%;
  z-index: 2;
`;

const ElementsContainer = styled.div`
  position: relative;
  width: 100%;
  height: 100%;
  min-height: 400px;
`;

const EmptyState = styled.div`
  position: absolute;
  top: 50%;
  left: 50%;
  transform: translate(-50%, -50%);
  text-align: center;
  color: #6b7280;
  font-family: 'Inter', system-ui, sans-serif;
`;

const EmptyStateIcon = styled.div`
  font-size: 48px;
  margin-bottom: 16px;
`;

const EmptyStateText = styled.h3`
  margin: 0 0 8px 0;
  font-size: 20px;
  font-weight: 600;
  color: #374151;
`;

const EmptyStateSubtext = styled.p`
  margin: 0 0 16px 0;
  font-size: 14px;
  color: #6b7280;
  max-width: 300px;
  line-height: 1.5;
`;

const EmptyStateHint = styled.div`
  font-size: 13px;
  color: #9ca3af;
  font-style: italic;
`;

const Canvas = ({ isPreviewMode, selectedElement, setSelectedElement }) => {
  const {
    elements,
    selectedElementId,
    selectElement,
    deleteElement,
    addElement,
    canvasWidth,
    canvasHeight,
    zoom,
    showGuides,
    snapLines,
    setSnapLines,
    currentSection,
    sections,
    canvasBackground
  } = useEditor();

  const canvasRef = useRef(null);
  const [realBounds, setRealBounds] = useState(null);

  // Handle drag and drop
  const handleDrop = (e) => {
    e.preventDefault();
    
    const sectionData = e.dataTransfer.getData('section');
    const elementData = e.dataTransfer.getData('element');
    
    if (sectionData) {
      try {
        const section = JSON.parse(sectionData);
        if (section.elements && Array.isArray(section.elements)) {
          section.elements.forEach(element => {
            addElement(
              element.type,
              element.props || {},
              element.children || [],
              element.styles || {},
              element.position || { x: 100, y: 100 },
              element.size || { width: 'auto', height: 'auto' }
            );
          });
        }
      } catch (err) {
        console.error('Error parsing section data:', err);
      }
    } else if (elementData) {
      try {
        const element = JSON.parse(elementData);
        const canvasRect = canvasRef.current?.getBoundingClientRect();
        
        if (canvasRect) {
          const x = e.clientX - canvasRect.left;
          const y = e.clientY - canvasRect.top;
          
          addElement(
            element.type,
            element.props || {},
            element.children || [],
            element.styles || {},
            { x: Math.max(0, x - 50), y: Math.max(0, y - 25) },
            element.size || { width: 'auto', height: 'auto' }
          );
        }
      } catch (err) {
        console.error('Error parsing element data:', err);
      }
    }
  };

  const handleDragOver = (e) => {
    e.preventDefault();
  };

  const handleDragLeave = (e) => {
    e.preventDefault();
  };

  const handleCanvasClick = (e) => {
    if (e.target === e.currentTarget) {
      selectElement(null);
    }
  };

  const handleElementClick = (elementId) => {
    selectElement(elementId);
  };

  return (
    <CanvasContainer
      onDrop={handleDrop}
      onDragOver={handleDragOver}
      onDragLeave={handleDragLeave}
      onClick={handleCanvasClick}
    >
      {/* Indicador de sección actual */}
      {currentSection && (
        <SectionIndicator>
          <SectionIcon isHome={currentSection.isHome}>
            {currentSection.isHome ? <Home size={16} /> : <Globe size={16} />}
          </SectionIcon>
          <SectionInfo>
            <SectionName>{currentSection.name}</SectionName>
            <SectionSlug>
              <Layers size={12} />
              /{currentSection.slug}
            </SectionSlug>
          </SectionInfo>
        </SectionIndicator>
      )}
      
      <CanvasWrapper>
        <CanvasArea 
          ref={canvasRef}
          zoom={zoom}
          height={canvasHeight}
          style={{ backgroundColor: canvasBackground }}
          onDrop={handleDrop}
          onDragOver={handleDragOver}
          onDragLeave={handleDragLeave}
          onClick={handleCanvasClick}
        >
          {!isPreviewMode && (
            <CanvasGrid />
          )}
          
          <DropZone>
            <DropMessage>
              🎨 Suelta aquí para agregar elementos
            </DropMessage>
          </DropZone>
          
          <CanvasContent>
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
            
            {/* Líneas de snap visuales */}
            {!isPreviewMode && <SnapLines snapLines={snapLines} />}
          </CanvasContent>
        </CanvasArea>
      </CanvasWrapper>
    </CanvasContainer>
  );
};

export default Canvas; 