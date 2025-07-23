import React, { useState } from 'react';
import styled from 'styled-components';
import { 
  Settings, 
  Type, 
  Palette, 
  Layout, 
  Image, 
  Square, 
  Trash2,
  Copy,
  Eye,
  EyeOff
} from 'lucide-react';
import { useEditor } from '../context/EditorContext';

const PropertyPanelContainer = styled.div`
  width: 320px;
  background: #ffffff;
  border-left: 1px solid #e1e5e9;
  display: flex;
  flex-direction: column;
  overflow: hidden;
`;

const PropertyPanelHeader = styled.div`
  padding: 20px;
  border-bottom: 1px solid #e1e5e9;
  background: #f8f9fa;
`;

const PropertyPanelTitle = styled.h2`
  margin: 0;
  font-size: 18px;
  font-weight: 600;
  color: #1a1a1a;
  display: flex;
  align-items: center;
  gap: 8px;
`;

const PropertyPanelContent = styled.div`
  flex: 1;
  overflow-y: auto;
  padding: 16px;
`;

const PropertySection = styled.div`
  margin-bottom: 24px;
`;

const PropertySectionTitle = styled.h3`
  margin: 0 0 12px 0;
  font-size: 14px;
  font-weight: 600;
  color: #6b7280;
  text-transform: uppercase;
  letter-spacing: 0.5px;
  display: flex;
  align-items: center;
  gap: 6px;
`;

const PropertyGroup = styled.div`
  margin-bottom: 16px;
`;

const PropertyLabel = styled.label`
  display: block;
  font-size: 12px;
  font-weight: 500;
  color: #374151;
  margin-bottom: 4px;
`;

const PropertyInput = styled.input`
  width: 100%;
  padding: 8px 12px;
  border: 1px solid #e1e5e9;
  border-radius: 6px;
  font-size: 14px;
  background: #ffffff;

  &:focus {
    outline: none;
    border-color: #3b82f6;
    box-shadow: 0 0 0 3px rgba(59, 130, 246, 0.1);
  }
`;

const PropertySelect = styled.select`
  width: 100%;
  padding: 8px 12px;
  border: 1px solid #e1e5e9;
  border-radius: 6px;
  font-size: 14px;
  background: #ffffff;

  &:focus {
    outline: none;
    border-color: #3b82f6;
    box-shadow: 0 0 0 3px rgba(59, 130, 246, 0.1);
  }
`;

const PropertyTextarea = styled.textarea`
  width: 100%;
  padding: 8px 12px;
  border: 1px solid #e1e5e9;
  border-radius: 6px;
  font-size: 14px;
  background: #ffffff;
  resize: vertical;
  min-height: 80px;

  &:focus {
    outline: none;
    border-color: #3b82f6;
    box-shadow: 0 0 0 3px rgba(59, 130, 246, 0.1);
  }
`;

const ColorInput = styled.input`
  width: 100%;
  height: 40px;
  border: 1px solid #e1e5e9;
  border-radius: 6px;
  cursor: pointer;

  &:focus {
    outline: none;
    border-color: #3b82f6;
  }
`;

const ButtonGroup = styled.div`
  display: flex;
  gap: 8px;
  margin-top: 12px;
`;

const ActionButton = styled.button`
  display: flex;
  align-items: center;
  gap: 6px;
  padding: 8px 12px;
  border: 1px solid #e1e5e9;
  border-radius: 6px;
  background: #ffffff;
  color: #6b7280;
  cursor: pointer;
  transition: all 0.2s ease;
  font-size: 14px;
  font-weight: 500;

  &:hover {
    border-color: #3b82f6;
    color: #3b82f6;
    background: #f0f9ff;
  }

  &.danger {
    &:hover {
      border-color: #ef4444;
      color: #ef4444;
      background: #fef2f2;
    }
  }
`;

const EmptyState = styled.div`
  text-align: center;
  color: #9ca3af;
  padding: 40px 20px;
`;

const EmptyStateIcon = styled.div`
  font-size: 48px;
  margin-bottom: 16px;
  opacity: 0.5;
`;

const EmptyStateText = styled.p`
  font-size: 16px;
  margin: 0 0 8px 0;
`;

const EmptyStateSubtext = styled.p`
  font-size: 14px;
  margin: 0;
  opacity: 0.7;
`;

const PropertyPanel = ({ selectedElement, setSelectedElement }) => {
  const { elements, updateElement, deleteElement, selectedElementId } = useEditor();
  const [activeTab, setActiveTab] = useState('content');

  const element = elements.find(el => el.id === selectedElementId);

  if (!element) {
    return (
      <PropertyPanelContainer>
        <PropertyPanelHeader>
          <PropertyPanelTitle>
            <Settings size={20} />
            Properties
          </PropertyPanelTitle>
        </PropertyPanelHeader>
        <PropertyPanelContent>
          <EmptyState>
            <EmptyStateIcon>⚙️</EmptyStateIcon>
            <EmptyStateText>No element selected</EmptyStateText>
            <EmptyStateSubtext>
              Select an element to edit its properties
            </EmptyStateSubtext>
          </EmptyState>
        </PropertyPanelContent>
      </PropertyPanelContainer>
    );
  }

  const handlePropertyChange = (property, value) => {
    updateElement(element.id, {
      props: {
        ...element.props,
        [property]: value
      }
    });
  };

  const handleStyleChange = (property, value) => {
    updateElement(element.id, {
      styles: {
        ...element.styles,
        [property]: value
      }
    });
  };

  const handleDelete = () => {
    deleteElement(element.id);
  };

  const renderContentProperties = () => {
    switch (element.type) {
      case 'text':
        return (
          <PropertyGroup>
            <PropertyLabel>Text Content</PropertyLabel>
            <PropertyTextarea
              value={element.props.content || ''}
              onChange={(e) => handlePropertyChange('content', e.target.value)}
              placeholder="Enter your text here..."
            />
          </PropertyGroup>
        );
      
      case 'heading':
        return (
          <>
            <PropertyGroup>
              <PropertyLabel>Heading Level</PropertyLabel>
              <PropertySelect
                value={element.props.level || 1}
                onChange={(e) => handlePropertyChange('level', parseInt(e.target.value))}
              >
                <option value={1}>H1 - Main Heading</option>
                <option value={2}>H2 - Section Heading</option>
                <option value={3}>H3 - Subsection Heading</option>
                <option value={4}>H4 - Minor Heading</option>
                <option value={5}>H5 - Small Heading</option>
                <option value={6}>H6 - Tiny Heading</option>
              </PropertySelect>
            </PropertyGroup>
            <PropertyGroup>
              <PropertyLabel>Heading Text</PropertyLabel>
              <PropertyInput
                value={element.props.content || ''}
                onChange={(e) => handlePropertyChange('content', e.target.value)}
                placeholder="Enter heading text..."
              />
            </PropertyGroup>
          </>
        );
      
      case 'button':
        return (
          <>
            <PropertyGroup>
              <PropertyLabel>Button Text</PropertyLabel>
              <PropertyInput
                value={element.props.text || ''}
                onChange={(e) => handlePropertyChange('text', e.target.value)}
                placeholder="Enter button text..."
              />
            </PropertyGroup>
            <PropertyGroup>
              <PropertyLabel>Button Variant</PropertyLabel>
              <PropertySelect
                value={element.props.variant || 'primary'}
                onChange={(e) => handlePropertyChange('variant', e.target.value)}
              >
                <option value="primary">Primary</option>
                <option value="secondary">Secondary</option>
                <option value="success">Success</option>
                <option value="danger">Danger</option>
                <option value="warning">Warning</option>
              </PropertySelect>
            </PropertyGroup>
          </>
        );
      
      case 'image':
        return (
          <>
            <PropertyGroup>
              <PropertyLabel>Image URL</PropertyLabel>
              <PropertyInput
                value={element.props.src || ''}
                onChange={(e) => handlePropertyChange('src', e.target.value)}
                placeholder="Enter image URL..."
              />
            </PropertyGroup>
            <PropertyGroup>
              <PropertyLabel>Alt Text</PropertyLabel>
              <PropertyInput
                value={element.props.alt || ''}
                onChange={(e) => handlePropertyChange('alt', e.target.value)}
                placeholder="Enter alt text..."
              />
            </PropertyGroup>
          </>
        );
      
      case 'card':
        return (
          <>
            <PropertyGroup>
              <PropertyLabel>Card Title</PropertyLabel>
              <PropertyInput
                value={element.props.title || ''}
                onChange={(e) => handlePropertyChange('title', e.target.value)}
                placeholder="Enter card title..."
              />
            </PropertyGroup>
            <PropertyGroup>
              <PropertyLabel>Card Content</PropertyLabel>
              <PropertyTextarea
                value={element.props.content || ''}
                onChange={(e) => handlePropertyChange('content', e.target.value)}
                placeholder="Enter card content..."
              />
            </PropertyGroup>
            <PropertyGroup>
              <PropertyLabel>Card Image URL</PropertyLabel>
              <PropertyInput
                value={element.props.image || ''}
                onChange={(e) => handlePropertyChange('image', e.target.value)}
                placeholder="Enter image URL..."
              />
            </PropertyGroup>
          </>
        );
       
      default:
        return (
          <PropertyGroup>
            <PropertyLabel>Content</PropertyLabel>
            <PropertyInput
              value={element.props.content || ''}
              onChange={(e) => handlePropertyChange('content', e.target.value)}
              placeholder="Enter content..."
            />
          </PropertyGroup>
        );
    }
  };

  const renderStyleProperties = () => {
    return (
      <>
        <PropertyGroup>
          <PropertyLabel>Background Color</PropertyLabel>
          <ColorInput
            type="color"
            value={element.styles?.background || '#ffffff'}
            onChange={(e) => handleStyleChange('background', e.target.value)}
          />
        </PropertyGroup>
        
        <PropertyGroup>
          <PropertyLabel>Text Color</PropertyLabel>
          <ColorInput
            type="color"
            value={element.styles?.color || '#000000'}
            onChange={(e) => handleStyleChange('color', e.target.value)}
          />
        </PropertyGroup>
        
        <PropertyGroup>
          <PropertyLabel>Font Size</PropertyLabel>
          <PropertyInput
            type="text"
            value={element.styles?.fontSize || '16px'}
            onChange={(e) => handleStyleChange('fontSize', e.target.value)}
            placeholder="e.g., 16px, 1.2em"
          />
        </PropertyGroup>
        
        <PropertyGroup>
          <PropertyLabel>Font Weight</PropertyLabel>
          <PropertySelect
            value={element.styles?.fontWeight || 'normal'}
            onChange={(e) => handleStyleChange('fontWeight', e.target.value)}
          >
            <option value="normal">Normal</option>
            <option value="bold">Bold</option>
            <option value="100">100 - Thin</option>
            <option value="200">200 - Extra Light</option>
            <option value="300">300 - Light</option>
            <option value="400">400 - Regular</option>
            <option value="500">500 - Medium</option>
            <option value="600">600 - Semi Bold</option>
            <option value="700">700 - Bold</option>
            <option value="800">800 - Extra Bold</option>
            <option value="900">900 - Black</option>
          </PropertySelect>
        </PropertyGroup>
        
        <PropertyGroup>
          <PropertyLabel>Text Align</PropertyLabel>
          <PropertySelect
            value={element.styles?.textAlign || 'left'}
            onChange={(e) => handleStyleChange('textAlign', e.target.value)}
          >
            <option value="left">Left</option>
            <option value="center">Center</option>
            <option value="right">Right</option>
            <option value="justify">Justify</option>
          </PropertySelect>
        </PropertyGroup>
        
        <PropertyGroup>
          <PropertyLabel>Border Radius</PropertyLabel>
          <PropertyInput
            type="text"
            value={element.styles?.borderRadius || '0'}
            onChange={(e) => handleStyleChange('borderRadius', e.target.value)}
            placeholder="e.g., 4px, 50%"
          />
        </PropertyGroup>
        
        <PropertyGroup>
          <PropertyLabel>Padding</PropertyLabel>
          <PropertyInput
            type="text"
            value={element.styles?.padding || '0'}
            onChange={(e) => handleStyleChange('padding', e.target.value)}
            placeholder="e.g., 10px, 10px 20px"
          />
        </PropertyGroup>
        
        <PropertyGroup>
          <PropertyLabel>Margin</PropertyLabel>
          <PropertyInput
            type="text"
            value={element.styles?.margin || '0'}
            onChange={(e) => handleStyleChange('margin', e.target.value)}
            placeholder="e.g., 10px, 10px 20px"
          />
        </PropertyGroup>
      </>
    );
  };

  const renderLayoutProperties = () => {
    return (
      <>
        <PropertyGroup>
          <PropertyLabel>Width</PropertyLabel>
          <PropertyInput
            type="text"
            value={element.size?.width || 'auto'}
            onChange={(e) => updateElement(element.id, {
              size: { ...element.size, width: e.target.value }
            })}
            placeholder="e.g., 200px, 50%, auto"
          />
        </PropertyGroup>
        
        <PropertyGroup>
          <PropertyLabel>Height</PropertyLabel>
          <PropertyInput
            type="text"
            value={element.size?.height || 'auto'}
            onChange={(e) => updateElement(element.id, {
              size: { ...element.size, height: e.target.value }
            })}
            placeholder="e.g., 100px, 50vh, auto"
          />
        </PropertyGroup>
        
        <PropertyGroup>
          <PropertyLabel>Position X</PropertyLabel>
          <PropertyInput
            type="number"
            value={element.position?.x || 0}
            onChange={(e) => updateElement(element.id, {
              position: { ...element.position, x: parseInt(e.target.value) || 0 }
            })}
          />
        </PropertyGroup>
        
        <PropertyGroup>
          <PropertyLabel>Position Y</PropertyLabel>
          <PropertyInput
            type="number"
            value={element.position?.y || 0}
            onChange={(e) => updateElement(element.id, {
              position: { ...element.position, y: parseInt(e.target.value) || 0 }
            })}
          />
        </PropertyGroup>
      </>
    );
  };

  return (
    <PropertyPanelContainer>
      <PropertyPanelHeader>
        <PropertyPanelTitle>
          <Settings size={20} />
          Properties
        </PropertyPanelTitle>
      </PropertyPanelHeader>
      
      <PropertyPanelContent>
        <PropertySection>
          <PropertySectionTitle>
            <Type size={16} />
            Content
          </PropertySectionTitle>
          {renderContentProperties()}
        </PropertySection>

        <PropertySection>
          <PropertySectionTitle>
            <Palette size={16} />
            Styles
          </PropertySectionTitle>
          {renderStyleProperties()}
        </PropertySection>

        <PropertySection>
          <PropertySectionTitle>
            <Layout size={16} />
            Layout
          </PropertySectionTitle>
          {renderLayoutProperties()}
        </PropertySection>

        <PropertySection>
          <PropertySectionTitle>Actions</PropertySectionTitle>
          <ButtonGroup>
            <ActionButton onClick={handleDelete} className="danger">
              <Trash2 size={16} />
              Delete
            </ActionButton>
            <ActionButton>
              <Copy size={16} />
              Duplicate
            </ActionButton>
          </ButtonGroup>
        </PropertySection>
      </PropertyPanelContent>
    </PropertyPanelContainer>
  );
};

export default PropertyPanel; 