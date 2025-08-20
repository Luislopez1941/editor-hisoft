import React, { useState } from 'react';
import styled from 'styled-components';

const SearchContainer = styled.div`
  width: 100%;
  max-width: 400px;
  margin: 0 auto;
  padding: 12px 20px;
  background: ${props => props.background || '#ffffff'};
  border: ${props => props.border || '2px solid #e5e7eb'};
  border-radius: ${props => props.borderRadius || '28px'};
  display: flex;
  align-items: center;
  gap: 16px;
  transition: all 0.3s ease;
  box-shadow: ${props => props.boxShadow || '0 8px 25px rgba(0, 0, 0, 0.08), 0 2px 8px rgba(0, 0, 0, 0.04)'};
  position: relative;
  overflow: hidden;
  
  &::before {
    content: '';
    position: absolute;
    top: 0;
    left: 0;
    right: 0;
    bottom: 0;
    background: linear-gradient(135deg, rgba(59, 130, 246, 0.02), rgba(139, 92, 246, 0.02));
    opacity: 0;
    transition: opacity 0.3s ease;
  }
  
  &:focus-within {
    border-color: #3b82f6;
    box-shadow: 0 0 0 4px rgba(59, 130, 246, 0.1), 0 15px 35px rgba(59, 130, 246, 0.15);
    transform: translateY(-2px);
    
    &::before {
      opacity: 1;
    }
  }
  
  &:hover {
    border-color: #d1d5db;
    box-shadow: 0 12px 30px rgba(0, 0, 0, 0.12), 0 4px 12px rgba(0, 0, 0, 0.06);
    transform: translateY(-1px);
  }
`;

const SearchInput = styled.input`
  flex: 1;
  border: none;
  outline: none;
  font-size: 16px;
  background: transparent;
  color: #1f2937;
  font-weight: 500;
  padding: 4px 0;
  
  &::placeholder {
    color: #9ca3af;
    font-weight: 400;
    transition: color 0.2s ease;
  }
  
  &:focus::placeholder {
    color: #6b7280;
  }
`;

const SearchButton = styled.button`
  padding: 12px 20px;
  background: linear-gradient(135deg, #3b82f6, #1d4ed8);
  color: white;
  border: none;
  border-radius: 24px;
  font-size: 15px;
  font-weight: 700;
  cursor: pointer;
  transition: all 0.3s ease;
  display: flex;
  align-items: center;
  gap: 8px;
  position: relative;
  overflow: hidden;
  white-space: nowrap;
  
  &::before {
    content: '';
    position: absolute;
    top: 0;
    left: -100%;
    width: 100%;
    height: 100%;
    background: linear-gradient(90deg, transparent, rgba(255, 255, 255, 0.3), transparent);
    transition: left 0.5s;
  }
  
  &:hover {
    background: linear-gradient(135deg, #2563eb, #1e40af);
    transform: translateY(-2px);
    box-shadow: 0 12px 25px rgba(59, 130, 246, 0.4);
    
    &::before {
      left: 100%;
    }
  }
  
  &:active {
    transform: translateY(0);
  }
  
  &:disabled {
    background: #9ca3af;
    cursor: not-allowed;
    transform: none;
    box-shadow: none;
    
    &::before {
      display: none;
    }
  }
`;

const SearchIcon = styled.span`
  font-size: 18px;
  display: flex;
  align-items: center;
  justify-content: center;
  width: 20px;
  height: 20px;
`;

const SearchFormComponent = ({
  placeholder = 'Buscar...',
  submitText = 'Buscar',
  buttonIcon = '🔍',
  onSearch = null,
  styles = {}
}) => {
  const [query, setQuery] = useState('');
  const [isSearching, setIsSearching] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();
    
    if (!query.trim()) {
      return;
    }

    setIsSearching(true);

    try {
      // Simular búsqueda
      await new Promise(resolve => setTimeout(resolve, 500));
      
      // Aquí iría la lógica real de búsqueda
      console.log('Buscando:', query);
      
      if (onSearch) {
        onSearch(query);
      }
    } catch (error) {
      console.error('Error en la búsqueda:', error);
    } finally {
      setIsSearching(false);
    }
  };

  return (
    <SearchContainer {...styles}>
      <SearchInput
        type="text"
        placeholder={placeholder}
        value={query}
        onChange={(e) => setQuery(e.target.value)}
        onKeyPress={(e) => e.key === 'Enter' && handleSubmit(e)}
      />
      <SearchButton 
        type="submit" 
        onClick={handleSubmit}
        disabled={isSearching || !query.trim()}
      >
        <SearchIcon>{buttonIcon}</SearchIcon>
        {isSearching ? 'Buscando...' : submitText}
      </SearchButton>
    </SearchContainer>
  );
};

export default SearchFormComponent;
