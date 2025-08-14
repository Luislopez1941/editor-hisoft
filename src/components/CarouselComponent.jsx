import React, { useState, useEffect, useRef } from 'react';
import styled from 'styled-components';
import { ChevronLeft, ChevronRight } from 'lucide-react';

const CarouselContainer = styled.div`
  width: 100%;
  height: 100%;
  min-height: 300px;
  position: relative;
  overflow: hidden;
  border-radius: 8px;
  background-color: #f8fafc;
  display: flex;
  align-items: center;
  justify-content: center;
`;

const CarouselSlides = styled.div`
  display: flex;
  transition: transform 0.5s ease-in-out;
  height: 100%;
  width: ${props => props.slideCount * 100}%;
`;

const CarouselSlide = styled.div`
  min-width: 100%;
  width: 100%;
  height: 100%;
  flex-shrink: 0;
  position: relative;
  display: flex;
  align-items: center;
  justify-content: center;
`;

const CarouselImage = styled.img`
  width: 100%;
  height: 100%;
  object-fit: cover;
  object-position: center;
  display: block;
  border-radius: 8px;
`;

const CarouselCaption = styled.div`
  position: absolute;
  bottom: ${props => props.textPosition?.bottom || '0'};
  left: ${props => props.textPosition?.left || '0'};
  right: ${props => props.textPosition?.right || '0'};
  top: ${props => props.textPosition?.top || 'auto'};
  background: ${props => props.textPosition?.backgroundColor === 'transparent' ? 'transparent' : props.textPosition?.backgroundColor || 'rgba(0, 0, 0, 0.7)'};
  color: ${props => props.textPosition?.textColor || 'white'};
  padding: ${props => props.textPosition?.padding || '20px'};
  text-align: ${props => props.textPosition?.textAlign || 'center'};
  font-family: ${props => props.textPosition?.fontFamily || 'Inter, system-ui, sans-serif'};
  transform: ${props => props.textPosition?.transform || 'none'};
  z-index: 5;
  border-radius: ${props => props.textPosition?.borderRadius || '0'};
  box-shadow: ${props => props.textPosition?.boxShadow || 'none'};
  cursor: ${props => props.isDragging ? 'grabbing' : props.isPreviewMode ? 'default' : 'grab'};
  user-select: none;
  min-width: ${props => props.textPosition?.minWidth || '200px'};
  max-width: ${props => props.textPosition?.maxWidth || 'none'};
  width: ${props => props.textPosition?.width || 'auto'};
  resize: ${props => props.isPreviewMode ? 'none' : 'both'};
  overflow: hidden;
  transition: ${props => props.isPreviewMode ? 'none' : 'all 0.2s ease'};
  pointer-events: ${props => props.isPreviewMode ? 'none' : 'auto'};
  
  &:hover {
    ${props => !props.isPreviewMode && `
      outline: 2px dashed #3b82f6;
      outline-offset: 2px;
      background: ${props.textPosition?.backgroundColor === 'transparent' ? 'rgba(59, 130, 246, 0.1)' : props.textPosition?.backgroundColor};
      transform: scale(1.02);
    `}
  }
  
  /* Prevent text selection during drag */
  * {
    user-select: none;
    -webkit-user-select: none;
    -moz-user-select: none;
    -ms-user-select: none;
  }
`;

const CarouselArrow = styled.button`
  position: absolute;
  top: 50%;
  transform: translateY(-50%);
  background: rgba(0, 0, 0, 0.5);
  color: white;
  border: none;
  border-radius: 50%;
  width: 40px;
  height: 40px;
  display: flex;
  align-items: center;
  justify-content: center;
  cursor: pointer;
  transition: all 0.3s ease;
  z-index: 10;
  
  &:hover {
    background: rgba(0, 0, 0, 0.7);
    transform: translateY(-50%) scale(1.1);
  }
  
  &:disabled {
    opacity: 0.5;
    cursor: not-allowed;
  }
  
  ${props => props.position === 'left' ? 'left: 10px;' : 'right: 10px;'}
`;

const CarouselDots = styled.div`
  position: absolute;
  bottom: 20px;
  left: 50%;
  transform: translateX(-50%);
  display: flex;
  gap: 8px;
  z-index: 10;
`;

const CarouselDot = styled.button`
  width: 12px;
  height: 12px;
  border-radius: 50%;
  border: none;
  background: ${props => props.active ? 'white' : 'rgba(255, 255, 255, 0.5)'};
  cursor: pointer;
  transition: background 0.3s ease;
  
  &:hover {
    background: ${props => props.active ? 'white' : 'rgba(255, 255, 255, 0.8)'};
  }
`;

const CarouselComponent = ({
  images = [], 
  slides = [], // New prop for slides with text
  autoPlay = true, 
  showDots = true, 
  showArrows = true, 
  interval = 3000,
  isPreviewMode = false,
  onTextPositionChange = null // Callback for text position changes
}) => {
  const [currentSlide, setCurrentSlide] = useState(0);
  const [isPaused, setIsPaused] = useState(false);
  const [isDragging, setIsDragging] = useState(false);
  const [dragStart, setDragStart] = useState({ x: 0, y: 0 });
  const carouselRef = useRef(null);
  const intervalRef = useRef(null);
  const draggedElementRef = useRef(null);

  // Use slides if provided, otherwise fallback to images array
  const displaySlides = slides.length > 0 ? slides : images.map(img => ({ image: img }));
  
  // Use displaySlides to handle empty state
  const finalSlides = displaySlides.length > 0 ? displaySlides : [
    { 
      image: 'https://images.unsplash.com/photo-1441986300917-64674bd600d8?w=800&h=400&fit=crop',
      title: 'Bienvenido',
      subtitle: 'Descubre nuestros productos',
      textPosition: {
        bottom: '0',
        left: '0',
        right: '0',
        top: 'auto',
        textAlign: 'center',
        textColor: '#ffffff',
        backgroundColor: 'rgba(0, 0, 0, 0.7)',
        fontFamily: 'Inter, system-ui, sans-serif',
        padding: '20px',
        transform: 'none',
        borderRadius: '0',
        boxShadow: 'none'
      }
    },
    { 
      image: 'https://images.unsplash.com/photo-1551288049-bebda4e38f71?w=800&h=400&fit=crop',
      title: 'Calidad Premium',
      subtitle: 'Los mejores materiales',
      textPosition: {
        bottom: '0',
        left: '0',
        right: '0',
        top: 'auto',
        textAlign: 'center',
        textColor: '#ffffff',
        backgroundColor: 'rgba(0, 0, 0, 0.7)',
        fontFamily: 'Inter, system-ui, sans-serif',
        padding: '20px',
        transform: 'none',
        borderRadius: '0',
        boxShadow: 'none'
      }
    },
    { 
      image: 'https://images.unsplash.com/photo-1551434678-e076c223a692?w=800&h=400&fit=crop',
      title: 'Servicio Excepcional',
      subtitle: 'Atención personalizada',
      textPosition: {
        bottom: '0',
        left: '0',
        right: '0',
        top: 'auto',
        textAlign: 'center',
        textColor: '#ffffff',
        backgroundColor: 'rgba(0, 0, 0, 0.7)',
        fontFamily: 'Inter, system-ui, sans-serif',
        padding: '20px',
        transform: 'none',
        borderRadius: '0',
        boxShadow: 'none'
      }
    }
  ];

  const nextSlide = () => {
    setCurrentSlide((prev) => (prev + 1) % finalSlides.length);
  };

  const prevSlide = () => {
    setCurrentSlide((prev) => (prev - 1 + finalSlides.length) % finalSlides.length);
  };

  const goToSlide = (index) => {
    setCurrentSlide(index);
  };

  const startAutoPlay = () => {
    if (intervalRef.current) {
      clearInterval(intervalRef.current);
    }
    intervalRef.current = setInterval(() => {
      if (!isPaused) {
        nextSlide();
      }
    }, interval);
  };

  const stopAutoPlay = () => {
    if (intervalRef.current) {
      clearInterval(intervalRef.current);
      intervalRef.current = null;
    }
  };

  // Reset currentSlide when slides change
  useEffect(() => {
    setCurrentSlide(0);
  }, [finalSlides.length]);

  // Autoplay effect - only in preview mode
  useEffect(() => {
    if (autoPlay && isPreviewMode && finalSlides.length > 1) {
      startAutoPlay();
    } else {
      stopAutoPlay();
    }
    return () => stopAutoPlay();
  }, [autoPlay, isPaused, interval, isPreviewMode, finalSlides.length]);

  const handleMouseEnter = () => {
    if (autoPlay && isPreviewMode && finalSlides.length > 1) {
      setIsPaused(true);
      stopAutoPlay();
    }
  };

  const handleMouseLeave = () => {
    if (autoPlay && isPreviewMode && finalSlides.length > 1) {
      setIsPaused(false);
      startAutoPlay();
    }
  };

  // Calculate transform percentage correctly
  const transformPercentage = currentSlide * 100;

  // Drag and drop handlers
  const handleMouseDown = (e, slideIndex) => {
    if (isPreviewMode) return;
    
    console.log('=== MOUSE DOWN EVENT ===');
    console.log('slideIndex:', slideIndex);
    
    e.preventDefault();
    e.stopPropagation();
    
    setIsDragging(true);
    setDragStart({
      x: e.clientX,
      y: e.clientY
    });
    draggedElementRef.current = slideIndex;
    
    document.addEventListener('mousemove', handleMouseMove);
    document.addEventListener('mouseup', handleMouseUp);
  };

  const handleMouseMove = (e) => {
    if (!isDragging || isPreviewMode || !draggedElementRef.current) return;

    e.preventDefault();
    e.stopPropagation();

    const deltaX = e.clientX - dragStart.x;
    const deltaY = e.clientY - dragStart.y;

    const totalMovement = Math.abs(deltaX) + Math.abs(deltaY);
    if (totalMovement < 3) return;

    console.log('Dragging text, deltaX:', deltaX, 'deltaY:', deltaY);

    const slideIndex = draggedElementRef.current;
    const slide = finalSlides[slideIndex];
    
    if (slide && slide.textPosition) {
      const newPosition = { ...slide.textPosition };
      
      const containerRect = carouselRef.current?.getBoundingClientRect();
      if (containerRect) {
        const containerWidth = containerRect.width;
        const containerHeight = containerRect.height;
        
        let currentLeft = 0;
        let currentTop = 0;
        
        if (newPosition.left && newPosition.left !== '0') {
          currentLeft = parseFloat(newPosition.left) || 0;
        }
        if (newPosition.top && newPosition.top !== 'auto') {
          currentTop = parseFloat(newPosition.top) || 0;
        } else if (newPosition.bottom && newPosition.bottom !== '0') {
          currentTop = containerHeight - parseFloat(newPosition.bottom) - 100;
        } else {
          currentTop = containerHeight - 100;
        }
        
        const newLeft = Math.max(0, Math.min(containerWidth - 200, currentLeft + deltaX));
        const newTop = Math.max(0, Math.min(containerHeight - 100, currentTop + deltaY));
        
        newPosition.left = `${newLeft}px`;
        newPosition.top = `${newTop}px`;
        newPosition.bottom = 'auto';
        newPosition.right = 'auto';
        newPosition.transform = 'none';
        
        console.log('New position:', newPosition);
        
        if (onTextPositionChange) {
          console.log('Calling onTextPositionChange with slideIndex:', slideIndex, 'newPosition:', newPosition);
          onTextPositionChange(slideIndex, newPosition);
        }
      }
    }
    
    setDragStart({
      x: e.clientX,
      y: e.clientY
    });
  };

  const handleMouseUp = (e) => {
    console.log('Mouse up, stopping drag');
    if (e) {
      e.preventDefault();
      e.stopPropagation();
    }
    setIsDragging(false);
    draggedElementRef.current = null;
    
    document.removeEventListener('mousemove', handleMouseMove);
    document.removeEventListener('mouseup', handleMouseUp);
  };

  return (
    <CarouselContainer
      ref={carouselRef}
      onMouseEnter={handleMouseEnter}
      onMouseLeave={handleMouseLeave}
      isPreviewMode={isPreviewMode}
    >
      <CarouselSlides
        slideCount={finalSlides.length}
        style={{
          transform: `translateX(-${transformPercentage}%)`
        }}
      >
        {finalSlides.map((slide, index) => (
          <CarouselSlide key={index}>
            <CarouselImage 
              src={slide.image} 
              alt={`Slide ${index + 1}`}
            />
            {(slide.title || slide.subtitle) && (
              <div
                style={{
                  position: 'absolute',
                  bottom: slide.textPosition?.bottom || '0',
                  left: slide.textPosition?.left || '0',
                  right: slide.textPosition?.right || '0',
                  top: slide.textPosition?.top || 'auto',
                  background: slide.textPosition?.backgroundColor === 'transparent' ? 'transparent' : slide.textPosition?.backgroundColor || 'rgba(0, 0, 0, 0.7)',
                  color: slide.textPosition?.textColor || 'white',
                  padding: slide.textPosition?.padding || '20px',
                  textAlign: slide.textPosition?.textAlign || 'center',
                  fontFamily: slide.textPosition?.fontFamily || 'Inter, system-ui, sans-serif',
                  transform: slide.textPosition?.transform || 'none',
                  zIndex: 5,
                  borderRadius: slide.textPosition?.borderRadius || '0',
                  boxShadow: slide.textPosition?.boxShadow || 'none',
                  cursor: isDragging ? 'grabbing' : isPreviewMode ? 'default' : 'grab',
                  userSelect: 'none',
                  minWidth: slide.textPosition?.minWidth || '200px',
                  maxWidth: slide.textPosition?.maxWidth || 'none',
                  width: slide.textPosition?.width || 'auto',
                  resize: isPreviewMode ? 'none' : 'both',
                  overflow: 'hidden',
                  transition: isPreviewMode ? 'none' : 'all 0.2s ease',
                  pointerEvents: isPreviewMode ? 'none' : 'auto',
                  outline: !isPreviewMode && isDragging ? '2px solid #3b82f6' : 'none'
                }}
                onMouseDown={(e) => handleMouseDown(e, index)}
                onMouseEnter={(e) => {
                  if (!isPreviewMode && !isDragging) {
                    e.target.style.outline = '2px dashed #3b82f6';
                    e.target.style.outlineOffset = '2px';
                  }
                }}
                onMouseLeave={(e) => {
                  if (!isPreviewMode && !isDragging) {
                    e.target.style.outline = 'none';
                  }
                }}
              >
                {/* Drag handle indicator */}
                {!isPreviewMode && (
                  <div
                    style={{
                      position: 'absolute',
                      top: '8px',
                      right: '8px',
                      width: '20px',
                      height: '20px',
                      background: 'rgba(59, 130, 246, 0.9)',
                      borderRadius: '4px',
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'center',
                      cursor: 'grab',
                      zIndex: 15,
                      fontSize: '12px',
                      color: 'white',
                      fontWeight: 'bold'
                    }}
                    onMouseDown={(e) => handleMouseDown(e, index)}
                  >
                    ⋮
                  </div>
                )}
                
                {/* Test button to verify callback works */}
                {!isPreviewMode && (
                  <button
                    style={{
                      position: 'absolute',
                      top: '8px',
                      left: '8px',
                      padding: '6px 12px',
                      background: 'rgba(239, 68, 68, 0.9)',
                      color: 'white',
                      border: 'none',
                      borderRadius: '4px',
                      fontSize: '11px',
                      cursor: 'pointer',
                      zIndex: 15,
                      fontWeight: 'bold'
                    }}
                    onClick={(e) => {
                      e.stopPropagation();
                      console.log('Test button clicked for slide:', index);
                      if (onTextPositionChange) {
                        const testPosition = {
                          left: '50px',
                          top: '50px',
                          bottom: 'auto',
                          right: 'auto',
                          transform: 'none',
                          width: '300px'
                        };
                        onTextPositionChange(index, testPosition);
                      }
                    }}
                  >
                    Mover
                  </button>
                )}
                
                {slide.title && (
                  <h2 style={{ 
                    margin: '0 0 8px 0', 
                    fontSize: '28px', 
                    fontWeight: '700',
                    textShadow: slide.textPosition?.backgroundColor === 'transparent' 
                      ? '2px 2px 8px rgba(0,0,0,0.8), -2px -2px 8px rgba(0,0,0,0.8)' 
                      : '2px 2px 4px rgba(0,0,0,0.8)',
                    userSelect: 'none',
                    pointerEvents: 'none'
                  }}>
                    {slide.title}
                  </h2>
                )}
                {slide.subtitle && (
                  <p style={{ 
                    margin: 0, 
                    fontSize: '16px',
                    opacity: 0.9,
                    textShadow: slide.textPosition?.backgroundColor === 'transparent' 
                      ? '1px 1px 6px rgba(0,0,0,0.8), -1px -1px 6px rgba(0,0,0,0.8)' 
                      : '1px 1px 2px rgba(0,0,0,0.8)',
                    userSelect: 'none',
                    pointerEvents: 'none'
                  }}>
                    {slide.subtitle}
                  </p>
                )}
              </div>
            )}
          </CarouselSlide>
        ))}
      </CarouselSlides>

      {showArrows && finalSlides.length > 1 && (
        <>
          <CarouselArrow 
            position="left"
            onClick={prevSlide}
            title="Anterior"
          >
            <ChevronLeft size={20} />
          </CarouselArrow>
          <CarouselArrow 
            position="right"
            onClick={nextSlide}
            title="Siguiente"
          >
            <ChevronRight size={20} />
          </CarouselArrow>
        </>
      )}

      {showDots && finalSlides.length > 1 && (
        <CarouselDots>
          {finalSlides.map((_, index) => (
            <CarouselDot
              key={index}
              active={index === currentSlide}
              onClick={() => goToSlide(index)}
              title={`Ir a slide ${index + 1}`}
            />
          ))}
        </CarouselDots>
      )}
    </CarouselContainer>
  );
};

export default CarouselComponent; 