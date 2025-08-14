import React, { useState, useEffect, useRef } from 'react';
import styled from 'styled-components';
import { ChevronLeft, ChevronRight } from 'lucide-react';
import ModernCard from './ModernCard';

const CarouselContainer = styled.div`
  width: 100%;
  height: 100%;
  position: relative;
  overflow: hidden;
  padding: 20px 0;
  display: flex;
  flex-direction: column;
  pointer-events: ${props => props.isPreviewMode ? 'auto' : 'none'};
`;

const CardsGrid = styled.div`
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(350px, 1fr));
  gap: 24px;
  padding: 0 20px;
  flex: 1;
  pointer-events: ${props => props.isPreviewMode ? 'auto' : 'none'};
  
  @media (max-width: 768px) {
    grid-template-columns: 1fr;
    gap: 16px;
    padding: 0 16px;
  }
`;

const CarouselWrapper = styled.div`
  position: relative;
  overflow: hidden;
  padding: 0 60px;
  flex: 1;
  pointer-events: ${props => props.isPreviewMode ? 'auto' : 'none'};
  
  @media (max-width: 768px) {
    padding: 0 40px;
  }
`;

const CarouselTrack = styled.div`
  display: flex;
  transition: transform 0.5s ease;
  gap: 24px;
  pointer-events: ${props => props.isPreviewMode ? 'auto' : 'none'};
  
  @media (max-width: 768px) {
    gap: 16px;
  }
`;

const CarouselCard = styled.div`
  flex: 0 0 350px;
  max-width: 350px;
  pointer-events: ${props => props.isPreviewMode ? 'auto' : 'none'};
  
  @media (max-width: 768px) {
    flex: 0 0 300px;
    max-width: 300px;
  }
`;

const NavigationButton = styled.button`
  position: absolute;
  top: 50%;
  transform: translateY(-50%);
  width: 40px;
  height: 40px;
  border-radius: 50%;
  background: rgba(255, 255, 255, 0.95);
  border: 1px solid #e5e7eb;
  display: flex;
  align-items: center;
  justify-content: center;
  cursor: pointer;
  transition: all 0.3s ease;
  z-index: 1000;
  box-shadow: 0 4px 12px rgba(0, 0, 0, 0.15);
  pointer-events: ${props => props.isPreviewMode ? 'auto' : 'none'};
  
  &:hover {
    background: white;
    box-shadow: 0 6px 16px rgba(0, 0, 0, 0.2);
    transform: translateY(-50%) scale(1.1);
  }
  
  &:disabled {
    opacity: 0.3;
    cursor: not-allowed;
    transform: translateY(-50%) scale(1);
  }
  
  &.prev {
    left: 10px;
  }
  
  &.next {
    right: 10px;
  }
  
  @media (max-width: 768px) {
    width: 36px;
    height: 36px;
    
    &.prev {
      left: 5px;
    }
    
    &.next {
      right: 5px;
    }
  }
`;

const DotsContainer = styled.div`
  display: flex;
  justify-content: center;
  gap: 8px;
  margin-top: 20px;
  padding: 0 20px;
  pointer-events: ${props => props.isPreviewMode ? 'auto' : 'none'};
`;

const Dot = styled.button`
  width: 8px;
  height: 8px;
  border-radius: 50%;
  background: ${props => props.$active ? '#3b82f6' : '#d1d5db'};
  border: none;
  cursor: pointer;
  transition: all 0.3s ease;
  pointer-events: ${props => props.isPreviewMode ? 'auto' : 'none'};
  
  &:hover {
    background: ${props => props.$active ? '#2563eb' : '#9ca3af'};
  }
`;

const CardsCarousel = ({ 
  cards = [], 
  isPreviewMode = false,
  autoPlay = true,
  interval = 5000,
  showDots = true,
  showArrows = true
}) => {
  const [currentIndex, setCurrentIndex] = useState(0);
  const [isAutoPlaying, setIsAutoPlaying] = useState(autoPlay);
  const trackRef = useRef(null);
  const autoPlayRef = useRef(null);

  // Determinar si debe ser carrusel o grid
  const shouldBeCarousel = cards.length > 4;
  const cardsPerView = window.innerWidth < 768 ? 1 : 3;
  const maxIndex = Math.max(0, cards.length - cardsPerView);

  // Auto-play functionality
  useEffect(() => {
    if (shouldBeCarousel && isAutoPlaying && autoPlay && !isPreviewMode) {
      autoPlayRef.current = setInterval(() => {
        setCurrentIndex(prev => (prev >= maxIndex ? 0 : prev + 1));
      }, interval);
    }

    return () => {
      if (autoPlayRef.current) {
        clearInterval(autoPlayRef.current);
      }
    };
  }, [shouldBeCarousel, isAutoPlaying, autoPlay, interval, maxIndex, isPreviewMode]);

  // Pause auto-play on hover
  const handleMouseEnter = () => {
    if (autoPlayRef.current) {
      clearInterval(autoPlayRef.current);
      setIsAutoPlaying(false);
    }
  };

  const handleMouseLeave = () => {
    if (autoPlay && !isPreviewMode) {
      setIsAutoPlaying(true);
    }
  };

  const goToSlide = (index) => {
    setCurrentIndex(Math.max(0, Math.min(index, maxIndex)));
  };

  const nextSlide = () => {
    setCurrentIndex(prev => (prev >= maxIndex ? 0 : prev + 1));
  };

  const prevSlide = () => {
    setCurrentIndex(prev => (prev <= 0 ? maxIndex : prev - 1));
  };

  // Si no debe ser carrusel, mostrar como grid
  if (!shouldBeCarousel) {
    return (
      <CarouselContainer isPreviewMode={isPreviewMode}>
        <CardsGrid isPreviewMode={isPreviewMode}>
          {cards.map((card, index) => (
            <div key={index}>
              <ModernCard 
                props={card.props}
                styles={card.styles}
                isPreviewMode={isPreviewMode}
              />
            </div>
          ))}
        </CardsGrid>
      </CarouselContainer>
    );
  }

  // Renderizar como carrusel
  return (
    <CarouselContainer 
      isPreviewMode={isPreviewMode}
      onMouseEnter={handleMouseEnter}
      onMouseLeave={handleMouseLeave}
    >
      <CarouselWrapper isPreviewMode={isPreviewMode}>
        {showArrows && (
          <>
            <NavigationButton 
              className="prev"
              onClick={prevSlide}
              disabled={currentIndex === 0}
              isPreviewMode={isPreviewMode}
            >
              <ChevronLeft size={20} color="#374151" />
            </NavigationButton>
            <NavigationButton 
              className="next"
              onClick={nextSlide}
              disabled={currentIndex >= maxIndex}
              isPreviewMode={isPreviewMode}
            >
              <ChevronRight size={20} color="#374151" />
            </NavigationButton>
          </>
        )}
        
        <CarouselTrack 
          ref={trackRef}
          isPreviewMode={isPreviewMode}
          style={{
            transform: `translateX(-${currentIndex * (350 + 24)}px)`
          }}
        >
          {cards.map((card, index) => (
            <CarouselCard key={index} isPreviewMode={isPreviewMode}>
              <ModernCard 
                props={card.props}
                styles={card.styles}
                isPreviewMode={isPreviewMode}
              />
            </CarouselCard>
          ))}
        </CarouselTrack>
      </CarouselWrapper>
      
      {showDots && cards.length > cardsPerView && (
        <DotsContainer isPreviewMode={isPreviewMode}>
          {Array.from({ length: Math.ceil(cards.length / cardsPerView) }, (_, i) => (
            <Dot
              key={i}
              $active={i === Math.floor(currentIndex / cardsPerView)}
              onClick={() => goToSlide(i * cardsPerView)}
              isPreviewMode={isPreviewMode}
            />
          ))}
        </DotsContainer>
      )}
    </CarouselContainer>
  );
};

export default CardsCarousel; 