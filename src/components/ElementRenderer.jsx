import React, { useState, useRef } from 'react';
import styled from 'styled-components';

const ElementWrapper = styled.div`
  position: absolute;
  left: ${props => props.position?.x || 0}px;
  top: ${props => props.position?.y || 0}px;
  width: ${props => props.size?.width || 'auto'};
  height: ${props => props.size?.height || 'auto'};
  min-width: 50px;
  min-height: 20px;
  cursor: ${props => props.isDragging ? 'grabbing' : props.isPreviewMode ? 'default' : 'grab'};
  user-select: ${props => props.isPreviewMode ? 'text' : 'none'};
  border: ${props => props.isSelected && !props.isPreviewMode ? '2px solid #3b82f6' : '2px solid transparent'};
  border-radius: 4px;
  transition: all 0.2s ease;
  z-index: ${props => props.isDragging ? 1000 : 1};
  
  &:hover {
    border-color: ${props => !props.isPreviewMode ? '#3b82f6' : 'transparent'};
    transform: ${props => !props.isPreviewMode ? 'scale(1.02)' : 'none'};
    box-shadow: ${props => !props.isPreviewMode ? '0 4px 12px rgba(0, 0, 0, 0.15)' : 'none'};
  }

  &:active {
    cursor: ${props => props.isPreviewMode ? 'default' : 'grabbing'};
  }
`;

// Text Elements
const TextElement = styled.div`
  padding: 8px;
  font-family: ${props => props.styles?.fontFamily || 'Arial, sans-serif'};
  font-size: ${props => props.styles?.fontSize || '16px'};
  font-weight: ${props => props.styles?.fontWeight || 'normal'};
  color: ${props => props.styles?.color || '#000000'};
  text-align: ${props => props.styles?.textAlign || 'left'};
  line-height: ${props => props.styles?.lineHeight || '1.5'};
  background: ${props => props.styles?.background || 'transparent'};
  border-radius: ${props => props.styles?.borderRadius || '0'};
  width: 100%;
  height: 100%;
  display: flex;
  align-items: center;
  justify-content: ${props => props.styles?.textAlign === 'center' ? 'center' : 
                    props.styles?.textAlign === 'right' ? 'flex-end' : 'flex-start'};
`;

const HeadingElement = styled.h1`
  margin: 0;
  padding: 8px;
  font-family: ${props => props.styles?.fontFamily || 'Arial, sans-serif'};
  font-size: ${props => {
    const level = props.level || 1;
    const sizes = { 1: '32px', 2: '28px', 3: '24px', 4: '20px', 5: '18px', 6: '16px' };
    return props.styles?.fontSize || sizes[level];
  }};
  font-weight: ${props => props.styles?.fontWeight || 'bold'};
  color: ${props => props.styles?.color || '#000000'};
  text-align: ${props => props.styles?.textAlign || 'left'};
  line-height: ${props => props.styles?.lineHeight || '1.2'};
  background: ${props => props.styles?.background || 'transparent'};
  border-radius: ${props => props.styles?.borderRadius || '0'};
  width: 100%;
  height: 100%;
  display: flex;
  align-items: center;
  justify-content: ${props => props.styles?.textAlign === 'center' ? 'center' : 
                    props.styles?.textAlign === 'right' ? 'flex-end' : 'flex-start'};
`;

// Button Element
const ButtonElement = styled.button`
  padding: 12px 24px;
  font-family: ${props => props.styles?.fontFamily || 'Arial, sans-serif'};
  font-size: ${props => props.styles?.fontSize || '16px'};
  font-weight: ${props => props.styles?.fontWeight || '500'};
  color: ${props => props.styles?.color || '#ffffff'};
  background: ${props => {
    const variant = props.variant || 'primary';
    const variants = {
      primary: '#3b82f6',
      secondary: '#6b7280',
      success: '#10b981',
      danger: '#ef4444',
      warning: '#f59e0b'
    };
    return props.styles?.background || variants[variant];
  }};
  border: ${props => props.styles?.border || 'none'};
  border-radius: ${props => props.styles?.borderRadius || '6px'};
  cursor: ${props => props.isPreviewMode ? 'pointer' : 'default'};
  transition: all 0.2s ease;
  width: 100%;
  height: 100%;
  display: flex;
  align-items: center;
  justify-content: center;
  
  &:hover {
    transform: ${props => props.isPreviewMode ? 'translateY(-1px)' : 'none'};
    box-shadow: ${props => props.isPreviewMode ? '0 4px 12px rgba(0, 0, 0, 0.15)' : 'none'};
  }
`;

// Image Element
const ImageElement = styled.img`
  width: 100%;
  height: 100%;
  object-fit: ${props => props.styles?.objectFit || 'cover'};
  border-radius: ${props => props.styles?.borderRadius || '0'};
  border: ${props => props.styles?.border || 'none'};
`;

// Container Elements
const SectionElement = styled.section`
  width: 100%;
  height: 100%;
  background: ${props => props.styles?.background || '#ffffff'};
  padding: ${props => props.styles?.padding || '40px 0'};
  border-radius: ${props => props.styles?.borderRadius || '0'};
  border: ${props => props.styles?.border || 'none'};
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
`;

const ContainerElement = styled.div`
  width: 100%;
  height: 100%;
  max-width: ${props => props.styles?.maxWidth || '1200px'};
  padding: ${props => props.styles?.padding || '0 20px'};
  background: ${props => props.styles?.background || 'transparent'};
  border-radius: ${props => props.styles?.borderRadius || '0'};
  border: ${props => props.styles?.border || 'none'};
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
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
  border-radius: ${props => props.styles?.borderRadius || '0'};
  border: ${props => props.styles?.border || 'none'};
`;

const ColumnsElement = styled.div`
  width: 100%;
  height: 100%;
  display: grid;
  grid-template-columns: repeat(${props => props.columns || 2}, 1fr);
  gap: ${props => props.gap || '20px'};
  background: ${props => props.styles?.background || 'transparent'};
  padding: ${props => props.styles?.padding || '20px'};
  border-radius: ${props => props.styles?.borderRadius || '0'};
  border: ${props => props.styles?.border || 'none'};
`;

// Shape Elements
const RectangleElement = styled.div`
  width: 100%;
  height: 100%;
  background: ${props => props.styles?.background || '#3b82f6'};
  border-radius: ${props => props.styles?.borderRadius || '0'};
  border: ${props => props.styles?.border || 'none'};
`;

const CircleElement = styled.div`
  width: 100%;
  height: 100%;
  background: ${props => props.styles?.background || '#3b82f6'};
  border-radius: 50%;
  border: ${props => props.styles?.border || 'none'};
`;

const TriangleElement = styled.div`
  width: 0;
  height: 0;
  border-left: ${props => props.size?.width / 2 || 25}px solid transparent;
  border-right: ${props => props.size?.width / 2 || 25}px solid transparent;
  border-bottom: ${props => props.size?.height || 50}px solid ${props => props.styles?.background || '#3b82f6'};
  background: transparent;
`;

// Card Elements
const CardElement = styled.div`
  width: 100%;
  height: 100%;
  background: ${props => props.styles?.background || '#ffffff'};
  border: ${props => props.styles?.border || '1px solid #e1e5e9'};
  border-radius: ${props => props.styles?.borderRadius || '8px'};
  box-shadow: ${props => props.styles?.boxShadow || '0 2px 8px rgba(0, 0, 0, 0.1)'};
  overflow: hidden;
  display: flex;
  flex-direction: column;
`;

const CardImage = styled.img`
  width: 100%;
  height: 200px;
  object-fit: cover;
`;

const CardContent = styled.div`
  padding: 16px;
  flex: 1;
  display: flex;
  flex-direction: column;
`;

const CardTitle = styled.h3`
  margin: 0 0 8px 0;
  font-size: 18px;
  font-weight: 600;
  color: ${props => props.styles?.color || '#1a1a1a'};
`;

const CardText = styled.p`
  margin: 0;
  font-size: 14px;
  line-height: 1.5;
  color: ${props => props.styles?.color || '#6b7280'};
  flex: 1;
`;

const ElementRenderer = ({ 
  element, 
  isSelected, 
  isPreviewMode, 
  onClick,
  onMove
}) => {
  const [isDragging, setIsDragging] = useState(false);
  const [dragStart, setDragStart] = useState({ x: 0, y: 0 });
  const elementRef = useRef(null);

  const handleMouseDown = (e) => {
    if (isPreviewMode) return;
    
    e.preventDefault();
    e.stopPropagation();
    
    setIsDragging(true);
    setDragStart({
      x: e.clientX - (element.position?.x || 0),
      y: e.clientY - (element.position?.y || 0)
    });
    
    // Seleccionar el elemento al empezar a arrastrar
    onClick(e);
  };

  const handleMouseMove = (e) => {
    if (!isDragging || isPreviewMode) return;
    
    e.preventDefault();
    
    const newX = e.clientX - dragStart.x;
    const newY = e.clientY - dragStart.y;
    
    if (onMove) {
      onMove(element.id, { x: newX, y: newY });
    }
  };

  const handleMouseUp = () => {
    if (isDragging) {
      setIsDragging(false);
    }
  };

  // Agregar event listeners globales para el drag
  React.useEffect(() => {
    if (isDragging) {
      document.addEventListener('mousemove', handleMouseMove);
      document.addEventListener('mouseup', handleMouseUp);
      
      return () => {
        document.removeEventListener('mousemove', handleMouseMove);
        document.removeEventListener('mouseup', handleMouseUp);
      };
    }
  }, [isDragging, dragStart, isPreviewMode]);

  const renderElement = () => {
    switch (element.type) {
      case 'text':
        return (
          <TextElement styles={element.styles}>
            {element.props?.content || 'Add your text here'}
          </TextElement>
        );
      
      case 'heading':
        return (
          <HeadingElement 
            as={`h${element.props?.level || 1}`}
            level={element.props?.level}
            styles={element.styles}
          >
            {element.props?.content || 'Heading'}
          </HeadingElement>
        );
      
      case 'button':
        return (
          <ButtonElement 
            variant={element.props?.variant}
            styles={element.styles}
            isPreviewMode={isPreviewMode}
          >
            {element.props?.text || 'Click me'}
          </ButtonElement>
        );
      
      case 'image':
        return (
          <ImageElement 
            src={element.props?.src || 'https://via.placeholder.com/300x200'} 
            alt={element.props?.alt || 'Image'}
            styles={element.styles}
          />
        );
      
      case 'section':
        return (
          <SectionElement styles={element.styles}>
            {element.children?.map(child => (
              <ElementRenderer
                key={child.id}
                element={child}
                isSelected={isSelected}
                isPreviewMode={isPreviewMode}
                onClick={onClick}
                onMove={onMove}
              />
            ))}
          </SectionElement>
        );
      
      case 'container':
        return (
          <ContainerElement styles={element.styles}>
            {element.children?.map(child => (
              <ElementRenderer
                key={child.id}
                element={child}
                isSelected={isSelected}
                isPreviewMode={isPreviewMode}
                onClick={onClick}
                onMove={onMove}
              />
            ))}
          </ContainerElement>
        );
      
      case 'grid':
        return (
          <GridElement 
            columns={element.props?.columns}
            gap={element.props?.gap}
            styles={element.styles}
          >
            {element.children?.map(child => (
              <ElementRenderer
                key={child.id}
                element={child}
                isSelected={isSelected}
                isPreviewMode={isPreviewMode}
                onClick={onClick}
                onMove={onMove}
              />
            ))}
          </GridElement>
        );
      
      case 'columns':
        return (
          <ColumnsElement 
            columns={element.props?.columns}
            gap={element.props?.gap}
            styles={element.styles}
          >
            {element.children?.map(child => (
              <ElementRenderer
                key={child.id}
                element={child}
                isSelected={isSelected}
                isPreviewMode={isPreviewMode}
                onClick={onClick}
                onMove={onMove}
              />
            ))}
          </ColumnsElement>
        );
      
      case 'rectangle':
        return <RectangleElement styles={element.styles} />;
      
      case 'circle':
        return <CircleElement styles={element.styles} />;
      
      case 'triangle':
        return <TriangleElement size={element.size} styles={element.styles} />;
      
      case 'card':
        return (
          <CardElement styles={element.styles}>
            {element.props?.image && (
              <CardImage src={element.props?.image} alt="Card" />
            )}
            <CardContent>
              <CardTitle>{element.props?.title}</CardTitle>
              <CardText>{element.props?.content}</CardText>
            </CardContent>
          </CardElement>
        );
      
      default:
        return (
          <div style={{ 
            padding: '8px', 
            background: '#f3f4f6', 
            border: '1px dashed #d1d5db',
            borderRadius: '4px',
            color: '#6b7280',
            fontSize: '14px'
          }}>
            {element.type} element
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
      onMouseDown={handleMouseDown}
      onClick={onClick}
    >
      {renderElement()}
    </ElementWrapper>
  );
};

export default ElementRenderer; 