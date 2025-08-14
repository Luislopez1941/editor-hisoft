import React from 'react';
import ElementRenderer from './ElementRenderer';
import { useEditor } from '../context/EditorContext';

const RecursiveElementRenderer = ({ 
  elements, 
  isPreviewMode, 
  onElementClick, 
  onDelete, 
  onDropSection, 
  realBounds 
}) => {
  const { selectedElementId, updateElement } = useEditor();

  const renderElementsRecursive = (elements, depth = 0) => {
    return elements.map((element) => (
      <div key={element.id}>
        <ElementRenderer
          element={element}
          isSelected={element.id === selectedElementId}
          isPreviewMode={isPreviewMode}
          onClick={(e) => onElementClick(e, element.id)}
          onMove={updateElement}
          onDelete={onDelete}
          onDropSection={onDropSection}
          renderChildren={false}
          realBounds={realBounds}
        />
        
        {/* Renderizar elementos hijos recursivamente */}
        {element.children && element.children.length > 0 && (
          <div style={{ position: 'relative' }}>
            {renderElementsRecursive(element.children, depth + 1)}
          </div>
        )}
      </div>
    ));
  };

  return renderElementsRecursive(elements);
};

export default RecursiveElementRenderer; 