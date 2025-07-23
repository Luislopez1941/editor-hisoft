import React from 'react';
import ElementRenderer from './ElementRenderer';
import { useEditor } from '../context/EditorContext';

const RecursiveElementRenderer = ({ 
  elements, 
  isPreviewMode, 
  onElementClick, 
  onDelete, 
  onDropSection 
}) => {
  const { selectedElementId } = useEditor();

  const renderElementsRecursive = (elements, depth = 0) => {
    return elements.map((element) => (
      <div key={element.id}>
        <ElementRenderer
          element={element}
          isSelected={element.id === selectedElementId}
          isPreviewMode={isPreviewMode}
          onClick={(e) => onElementClick(e, element.id)}
          onMove={() => {}}
          onDelete={onDelete}
          onDropSection={onDropSection}
          renderChildren={false}
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