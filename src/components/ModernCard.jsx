import React from 'react';
import styled from 'styled-components';

const CardContainer = styled.div`
  background: ${props => props.background || '#ffffff'};
  border-radius: ${props => props.borderRadius || '12px'};
  box-shadow: ${props => props.boxShadow || '0 2px 8px rgba(0, 0, 0, 0.06)'};
  overflow: hidden;
  transition: all 0.3s ease;
  border: ${props => props.border || '1px solid #e5e7eb'};
  cursor: ${props => props.isPreviewMode ? 'pointer' : 'default'};
  pointer-events: ${props => props.isPreviewMode ? 'auto' : 'none'};
  
  &:hover {
    transform: ${props => props.isPreviewMode ? 'translateY(-2px)' : 'none'};
    box-shadow: ${props => props.isPreviewMode ? '0 8px 25px rgba(0, 0, 0, 0.12)' : props.boxShadow || '0 2px 8px rgba(0, 0, 0, 0.06)'};
  }
`;

const CardImage = styled.div`
  position: relative;
  width: 100%;
  height: ${props => props.imageHeight || '200px'};
  background: linear-gradient(135deg, #f8fafc 0%, #e2e8f0 100%);
  overflow: hidden;
  
  img {
    width: 100%;
    height: 100%;
    object-fit: cover;
    transition: transform 0.3s ease;
  }
  
  &:hover img {
    transform: scale(1.05);
  }
`;

const CardContent = styled.div`
  padding: ${props => props.padding || '20px'};
`;

const CardTitle = styled.h3`
  font-size: ${props => props.titleSize || '18px'};
  font-weight: 700;
  color: #1e293b;
  margin: 0 0 8px 0;
  line-height: 1.3;
  display: -webkit-box;
  -webkit-line-clamp: ${props => props.titleLines || 2};
  -webkit-box-orient: vertical;
  overflow: hidden;
`;

const CardText = styled.p`
  font-size: 14px;
  color: #64748b;
  line-height: 1.5;
  margin: 0 0 16px 0;
  display: -webkit-box;
  -webkit-line-clamp: ${props => props.textLines || 3};
  -webkit-box-orient: vertical;
  overflow: hidden;
`;

const CardButton = styled.button`
  width: 100%;
  padding: 12px 20px;
  background: ${props => props.buttonColor || props.buttonStyle?.background || '#3b82f6'};
  color: ${props => props.buttonStyle?.color || '#ffffff'};
  border: 2px solid ${props => props.buttonColor || props.buttonStyle?.background || '#3b82f6'};
  border-radius: 8px;
  font-size: 15px;
  font-weight: 600;
  cursor: pointer;
  transition: all 0.2s ease;
  font-family: 'Inter', system-ui, sans-serif;
  margin-top: 12px;
  box-shadow: 0 2px 4px rgba(0, 0, 0, 0.1);
  text-transform: uppercase;
  letter-spacing: 0.5px;
  
  &:hover {
    background: ${props => props.buttonColor ? `${props.buttonColor}dd` : props.buttonStyle?.hoverBackground || '#2563eb'};
    border-color: ${props => props.buttonColor ? `${props.buttonColor}dd` : props.buttonStyle?.hoverBackground || '#2563eb'};
    transform: translateY(-2px);
    box-shadow: 0 4px 8px rgba(0, 0, 0, 0.15);
  }
`;

const CategoryBadge = styled.span`
  position: absolute;
  top: 12px;
  left: 12px;
  background: ${props => props.categoryColor || 'rgba(59, 130, 246, 0.9)'};
  color: white;
  padding: 4px 8px;
  border-radius: 4px;
  font-size: 11px;
  font-weight: 600;
  text-transform: uppercase;
  letter-spacing: 0.5px;
`;

const ModernCard = ({ props, styles, isPreviewMode = false }) => {
  const {
    title,
    content,
    image,
    category,
    categoryColor,
    buttonText,
    buttonUrl,
    buttonColor,
    showButton = true
  } = props || {};



  return (
    <CardContainer
      background={styles?.background}
      borderRadius={styles?.borderRadius}
      boxShadow={styles?.boxShadow}
      border={styles?.border}
      isPreviewMode={isPreviewMode}
    >
             <CardImage imageHeight="200px">
         <img src={image} alt={title} />
         {category && <CategoryBadge categoryColor={categoryColor}>{category}</CategoryBadge>}
       </CardImage>
      <CardContent>
        <CardTitle titleLines={3}>{title}</CardTitle>
        <CardText textLines={3}>{content}</CardText>
        
                                   {showButton && buttonText ? (
             <CardButton
               buttonColor={buttonColor}
               buttonStyle={styles?.buttonStyle}
               onClick={() => {
                if (buttonUrl && isPreviewMode) {
                  // Si es una URL externa, abrir en nueva pestaña
                  if (buttonUrl.startsWith('http')) {
                    window.open(buttonUrl, '_blank');
                  } else {
                    // Si es una sección del editor, cambiar a esa sección
                    // El buttonUrl ahora contiene el ID de la sección directamente
                    if (buttonUrl) {
                      // Aquí necesitaríamos acceder al contexto del editor para cambiar de sección
                      // Por ahora, haremos scroll a un elemento con ese ID si existe
                      const targetElement = document.querySelector(`[data-section-id="${buttonUrl}"]`);
                      if (targetElement) {
                        targetElement.scrollIntoView({ 
                          behavior: 'smooth',
                          block: 'start'
                        });
                      } else {
                        // Si no encuentra el elemento, intentar con el ID directo
                        const fallbackElement = document.querySelector(`#${buttonUrl}`);
                        if (fallbackElement) {
                          fallbackElement.scrollIntoView({ 
                            behavior: 'smooth',
                            block: 'start'
                          });
                        }
                      }
                    }
                  }
                }
              }}
            >
              {buttonText}
            </CardButton>
          ) : null}
      </CardContent>
    </CardContainer>
  );
};

export default ModernCard; 