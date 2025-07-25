import React from 'react';
import styled from 'styled-components';
import ElementRenderer from './ElementRenderer';

const HeaderElement = styled.header`
  width: 100%;
  height: 80px;
  background: #fff;
  border-bottom: 1px solid #e5e7eb;
  position: relative;
  box-shadow: 0 1px 3px rgba(0,0,0,0.04);
  z-index: 1000;
  overflow: visible;
  display: block;
`;

const HeaderSection = ({
  element,
  renderChildren = true,
  selectedElementId,
  isPreviewMode,
  onClick,
  onMove,
  onDelete,
  onDropSection,
  realBounds
}) => {
  return (
    <HeaderElement style={element.styles}>
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
            pointerEvents: 'auto',
            maxHeight: '100%',
            maxWidth: '100%',
            overflow: 'hidden',
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
    </HeaderElement>
  );
};

export default HeaderSection; 