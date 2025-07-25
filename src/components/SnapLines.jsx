import React from 'react';
import styled from 'styled-components';

const SnapLineContainer = styled.div`
  position: absolute;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
  pointer-events: none;
  z-index: 9999;
`;

const SnapLine = styled.div`
  position: absolute;
  background: #ff00ff;
  pointer-events: none;
  z-index: 9999;
  
  ${props => props.$direction === 'vertical' ? `
    width: 1px;
    height: 100%;
    left: ${props.$position}px;
    top: 0;
    box-shadow: 0 0 0 0.5px rgba(255, 0, 255, 0.3);
  ` : `
    height: 1px;
    width: 100%;
    top: ${props.$position}px;
    left: 0;
    box-shadow: 0 0 0 0.5px rgba(255, 0, 255, 0.3);
  `}
  
  animation: snapPulse 0.3s ease-out;
  
  @keyframes snapPulse {
    0% {
      opacity: 0;
      transform: scale(0.8);
    }
    50% {
      opacity: 1;
      transform: scale(1.1);
    }
    100% {
      opacity: 0.8;
      transform: scale(1);
    }
  }
`;

const SnapLines = ({ snapLines }) => {
  if (!snapLines || (!snapLines.vertical?.length && !snapLines.horizontal?.length)) {
    return null;
  }

  return (
    <SnapLineContainer>
      {/* Líneas verticales */}
      {snapLines.vertical?.map((position, index) => (
        <SnapLine
          key={`v-${position}-${index}`}
          $direction="vertical"
          $position={position}
        />
      ))}
      
      {/* Líneas horizontales */}
      {snapLines.horizontal?.map((position, index) => (
        <SnapLine
          key={`h-${position}-${index}`}
          $direction="horizontal"
          $position={position}
        />
      ))}
    </SnapLineContainer>
  );
};

export default SnapLines; 