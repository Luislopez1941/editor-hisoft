import React, { useState } from 'react';
import styled from 'styled-components';
import { 
  Link, 
  Home, 
  Globe, 
  ExternalLink, 
  X, 
  CheckCircle
} from 'lucide-react';
import { useEditor } from '../context/EditorContext';

const SelectorContainer = styled.div`
  position: relative;
  margin-bottom: 16px;
`;

const SelectorLabel = styled.label`
  display: block;
  margin-bottom: 8px;
  font-size: 14px;
  font-weight: 600;
  color: #374151;
  font-family: 'Inter', system-ui, sans-serif;
`;

const SelectorButton = styled.button`
  width: 100%;
  padding: 10px 12px;
  border: 1px solid #d1d5db;
  border-radius: 8px;
  background: #ffffff;
  text-align: left;
  cursor: pointer;
  font-size: 14px;
  font-family: 'Inter', system-ui, sans-serif;
  display: flex;
  align-items: center;
  justify-content: space-between;
  transition: all 0.2s ease;
  
  &:hover {
    border-color: #3b82f6;
    box-shadow: 0 0 0 3px rgba(59, 130, 246, 0.1);
  }
  
  &:focus {
    outline: none;
    border-color: #3b82f6;
    box-shadow: 0 0 0 3px rgba(59, 130, 246, 0.1);
  }
`;

const SelectorButtonContent = styled.div`
  display: flex;
  align-items: center;
  gap: 8px;
  color: ${props => props.hasSelection ? '#1e293b' : '#64748b'};
`;

const DropdownContainer = styled.div`
  position: absolute;
  top: 100%;
  left: 0;
  right: 0;
  background: #ffffff;
  border: 1px solid #d1d5db;
  border-radius: 8px;
  box-shadow: 0 10px 25px -5px rgba(0, 0, 0, 0.1);
  z-index: 1000;
  max-height: 200px;
  overflow-y: auto;
  margin-top: 4px;
`;

const DropdownItem = styled.div`
  padding: 12px;
  cursor: pointer;
  display: flex;
  align-items: center;
  gap: 10px;
  transition: background-color 0.2s ease;
  border-bottom: 1px solid #f1f5f9;
  
  &:hover {
    background: #f8fafc;
  }
  
  &:last-child {
    border-bottom: none;
  }
`;

const SectionIcon = styled.div`
  width: 24px;
  height: 24px;
  border-radius: 6px;
  display: flex;
  align-items: center;
  justify-content: center;
  background: ${props => props.isHome ? 'linear-gradient(135deg, #10b981, #047857)' : 'linear-gradient(135deg, #3b82f6, #1d4ed8)'};
  color: white;
  flex-shrink: 0;
`;

const SectionInfo = styled.div`
  flex: 1;
`;

const SectionName = styled.div`
  font-size: 14px;
  font-weight: 600;
  color: #1e293b;
  margin-bottom: 2px;
`;

const SectionSlug = styled.div`
  font-size: 12px;
  color: #64748b;
`;

const ClearButton = styled.button`
  padding: 4px 8px;
  background: #fee2e2;
  color: #dc2626;
  border: none;
  border-radius: 4px;
  font-size: 12px;
  cursor: pointer;
  display: flex;
  align-items: center;
  gap: 4px;
  
  &:hover {
    background: #fecaca;
  }
`;

const SectionLinkSelector = ({ value, onChange, placeholder = "Seleccionar sección..." }) => {
  const { sections } = useEditor();
  const [isOpen, setIsOpen] = useState(false);
  
  const selectedSection = value ? sections[value] : null;
  
  const handleSelect = (sectionId) => {
    onChange(sectionId);
    setIsOpen(false);
  };
  
  const handleClear = (e) => {
    e.stopPropagation();
    onChange(null);
    setIsOpen(false);
  };

  return (
    <SelectorContainer>
      <SelectorLabel>Enlazar a sección</SelectorLabel>
      <SelectorButton onClick={() => setIsOpen(!isOpen)}>
        <SelectorButtonContent hasSelection={!!selectedSection}>
          <Link size={16} />
          {selectedSection ? (
            <>
              <SectionIcon isHome={selectedSection.isHome}>
                {selectedSection.isHome ? <Home size={12} /> : <Globe size={12} />}
              </SectionIcon>
              <div>
                <div style={{ fontWeight: '600' }}>{selectedSection.name}</div>
                <div style={{ fontSize: '12px', color: '#64748b' }}>/{selectedSection.slug}</div>
              </div>
            </>
          ) : (
            placeholder
          )}
        </SelectorButtonContent>
        <div style={{ display: 'flex', alignItems: 'center', gap: '4px' }}>
          {selectedSection && (
            <ClearButton onClick={handleClear}>
              <X size={12} />
            </ClearButton>
          )}
          <ExternalLink size={16} color="#64748b" />
        </div>
      </SelectorButton>
      
      {isOpen && (
        <DropdownContainer>
          {Object.values(sections).map((section) => (
            <DropdownItem
              key={section.id}
              onClick={() => handleSelect(section.id)}
            >
              <SectionIcon isHome={section.isHome}>
                {section.isHome ? <Home size={12} /> : <Globe size={12} />}
              </SectionIcon>
              <SectionInfo>
                <SectionName>{section.name}</SectionName>
                <SectionSlug>/{section.slug}</SectionSlug>
              </SectionInfo>
              {selectedSection?.id === section.id && (
                <CheckCircle size={16} color="#10b981" />
              )}
            </DropdownItem>
          ))}
        </DropdownContainer>
      )}
    </SelectorContainer>
  );
};

export default SectionLinkSelector; 