import React, { useRef, useEffect, useState } from 'react';
import styled from 'styled-components';
import { useEditor } from '../context/EditorContext';
import ElementRenderer from './ElementRenderer';

const CanvasContainer = styled.div`
  flex: 1;
  background: #f8f9fa;
  overflow: auto;
  position: relative;
  display: flex;
  align-items: center;
  justify-content: center;
  padding: 20px;
`;

const CanvasArea = styled.div`
  background: #ffffff;
  box-shadow: 0 4px 20px rgba(0, 0, 0, 0.1);
  border-radius: 8px;
  position: relative;
  transform-origin: center;
  transform: scale(${props => props.zoom / 100});
  transition: transform 0.2s ease;
  min-height: 600px;
  width: ${props => props.width}px;
  height: ${props => props.height}px;
  overflow: hidden;
`;

const CanvasGrid = styled.div`
  position: absolute;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  background-image: 
    linear-gradient(rgba(0, 0, 0, 0.05) 1px, transparent 1px),
    linear-gradient(90deg, rgba(0, 0, 0, 0.05) 1px, transparent 1px);
  background-size: 20px 20px;
  pointer-events: none;
  z-index: 0;
`;

const CanvasContent = styled.div`
  position: relative;
  z-index: 1;
  width: 100%;
  height: 100%;
  min-height: 600px;
`;

const ElementsContainer = styled.div`
  width: 100%;
  height: 100%;
  min-height: 600px;
  position: relative;
`;

const EmptyState = styled.div`
  position: absolute;
  top: 50%;
  left: 50%;
  transform: translate(-50%, -50%);
  text-align: center;
  color: #9ca3af;
  padding: 40px;
`;

const EmptyStateIcon = styled.div`
  font-size: 48px;
  margin-bottom: 16px;
  opacity: 0.5;
`;

const EmptyStateText = styled.p`
  font-size: 16px;
  margin: 0 0 8px 0;
`;

const EmptyStateSubtext = styled.p`
  font-size: 14px;
  margin: 0;
  opacity: 0.7;
`;

const Canvas = ({ isPreviewMode, selectedElement, setSelectedElement }) => {
  const { 
    elements, 
    zoom, 
    canvasWidth, 
    canvasHeight, 
    selectedElementId, 
    selectElement,
    moveElement
  } = useEditor();
  
  const canvasRef = useRef(null);

  useEffect(() => {
    const handleKeyDown = (e) => {
      if (e.key === 'Delete' && selectedElementId) {
        // Handle delete
      }
    };

    document.addEventListener('keydown', handleKeyDown);
    return () => document.removeEventListener('keydown', handleKeyDown);
  }, [selectedElementId]);

  const handleCanvasClick = (e) => {
    if (e.target === canvasRef.current) {
      selectElement(null);
    }
  };

  const handleElementClick = (e, elementId) => {
    e.stopPropagation();
    selectElement(elementId);
  };

  const handleElementMove = (elementId, newPosition) => {
    moveElement(elementId, newPosition);
  };

  return (
    <CanvasContainer>
      <CanvasArea
        ref={canvasRef}
        width={canvasWidth}
        height={canvasHeight}
        zoom={zoom}
        onClick={handleCanvasClick}
      >
        {!isPreviewMode && <CanvasGrid />}
        
        <CanvasContent>
          <ElementsContainer>
            <div style={{ 
              position: 'absolute', 
              top: '10px', 
              right: '10px', 
              background: '#3b82f6', 
              color: 'white', 
              padding: '4px 8px', 
              borderRadius: '4px', 
              fontSize: '12px',
              zIndex: 10
            }}>
              Elements: {elements.length}
            </div>
            
            {elements.length === 0 ? (
              <EmptyState>
                <EmptyStateIcon>🎨</EmptyStateIcon>
                <EmptyStateText>Start building your website</EmptyStateText>
                <EmptyStateSubtext>
                  Click elements from the sidebar to get started
                </EmptyStateSubtext>
              </EmptyState>
            ) : (
              elements.map((element) => (
                <ElementRenderer
                  key={element.id}
                  element={element}
                  isSelected={element.id === selectedElementId}
                  isPreviewMode={isPreviewMode}
                  onClick={(e) => handleElementClick(e, element.id)}
                  onMove={handleElementMove}
                />
              ))
            )}
          </ElementsContainer>
        </CanvasContent>
      </CanvasArea>
    </CanvasContainer>
  );
};

export default Canvas; 