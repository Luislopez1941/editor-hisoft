import React, { useState } from 'react';
import styled from 'styled-components';
import { 
  Type, 
  Image, 
  Square, 
  Circle, 
  Triangle, 
  Layout,
  Grid3X3,
  Columns,
  CreditCard,
  Plus,
  Layers,
  Shapes,
  Palette,
  Settings,
  Folder,
  Database
} from 'lucide-react';
import { useEditor } from '../context/EditorContext';

const SidebarContainer = styled.div`
  display: flex;
  height: 100vh;
  background: #ffffff;
  border-right: 1px solid #e1e8ed;
`;

// Nivel 1: Iconos principales (izquierda)
const MainIconBar = styled.div`
  width: 60px;
  background: #1e334d;
  display: flex;
  flex-direction: column;
  align-items: center;
  padding: 20px 0;
  gap: 15px;
`;

const MainIcon = styled.div`
  width: 40px;
  height: 40px;
  display: flex;
  align-items: center;
  justify-content: center;
  border-radius: 8px;
  cursor: pointer;
  transition: all 0.3s ease;
  color: ${props => props.active ? '#ffffff' : '#94a3b8'};
  background: ${props => props.active ? '#3D85C6' : 'transparent'};

  &:hover {
    background: ${props => props.active ? '#3D85C6' : 'rgba(61, 133, 198, 0.2)'};
    color: #ffffff;
  }
`;

// Nivel 2: Opciones de sección (centro)
const SectionPanel = styled.div`
  width: 200px;
  background: #f8f9fa;
  border-right: 1px solid #e1e8ed;
  display: flex;
  flex-direction: column;
`;

const SectionHeader = styled.div`
  padding: 20px 16px 16px;
  border-bottom: 1px solid #e1e8ed;
  background: #ffffff;
`;

const SectionTitle = styled.h3`
  font-size: 16px;
  font-weight: 600;
  color: #1e334d;
  margin: 0;
`;

const SectionContent = styled.div`
  flex: 1;
  padding: 16px 0;
`;

const SectionItem = styled.div`
  display: flex;
  align-items: center;
  gap: 12px;
  padding: 12px 16px;
  cursor: pointer;
  transition: all 0.3s ease;
  color: ${props => props.active ? '#3D85C6' : '#64748b'};
  background: ${props => props.active ? 'rgba(61, 133, 198, 0.1)' : 'transparent'};
  border-left: ${props => props.active ? '3px solid #3D85C6' : '3px solid transparent'};

  &:hover {
    background: rgba(61, 133, 198, 0.05);
    color: #3D85C6;
  }
`;

const SectionItemText = styled.span`
  font-size: 14px;
  font-weight: 500;
`;

// Nivel 3: Sub-opciones específicas (derecha)
const SubPanel = styled.div`
  width: 240px;
  background: #ffffff;
  display: flex;
  flex-direction: column;
`;

const SubHeader = styled.div`
  padding: 20px 16px 16px;
  border-bottom: 1px solid #e1e8ed;
`;

const SubTitle = styled.h4`
  font-size: 14px;
  font-weight: 600;
  color: #1e334d;
  margin: 0 0 8px 0;
`;

const SubDescription = styled.p`
  font-size: 12px;
  color: #64748b;
  margin: 0;
`;

const SubContent = styled.div`
  flex: 1;
  padding: 16px;
`;

const ElementButton = styled.button`
  width: 100%;
  display: flex;
  align-items: center;
  gap: 12px;
  padding: 12px;
  border: 1px solid #e1e8ed;
  border-radius: 8px;
  background: #ffffff;
  cursor: pointer;
  transition: all 0.3s ease;
  margin-bottom: 8px;
  text-align: left;

  &:hover {
    border-color: #3D85C6;
    background: #f0f9ff;
    transform: translateY(-1px);
    box-shadow: 0 4px 12px rgba(61, 133, 198, 0.15);
  }
`;

const ElementIcon = styled.div`
  width: 32px;
  height: 32px;
  display: flex;
  align-items: center;
  justify-content: center;
  background: #f1f5f9;
  border-radius: 6px;
  color: #64748b;
`;

const ElementInfo = styled.div`
  flex: 1;
`;

const ElementName = styled.div`
  font-size: 14px;
  font-weight: 500;
  color: #1e334d;
  margin-bottom: 2px;
`;

const ElementDesc = styled.div`
  font-size: 12px;
  color: #64748b;
`;

const Sidebar = () => {
  const { addElement } = useEditor();
  const [activeSection, setActiveSection] = useState('elements');
  const [activeSubSection, setActiveSubSection] = useState('basic');

  const mainSections = [
    { id: 'elements', icon: Layers, name: 'Elementos' },
    { id: 'sections', icon: Layout, name: 'Secciones' },
    { id: 'media', icon: Database, name: 'Media' },
    { id: 'design', icon: Palette, name: 'Diseño' },
    { id: 'settings', icon: Settings, name: 'Configuración' }
  ];

  const sectionContent = {
    elements: [
      { id: 'basic', name: 'Básico', icon: Plus },
      { id: 'text', name: 'Texto', icon: Type },
      { id: 'media', name: 'Media', icon: Image },
      { id: 'shapes', name: 'Formas', icon: Shapes },
      { id: 'layout', name: 'Layout', icon: Layout }
    ],
    sections: [
      { id: 'headers', name: 'Headers', icon: Layout },
      { id: 'content', name: 'Contenido', icon: Layers },
      { id: 'footers', name: 'Footers', icon: Layout }
    ],
    media: [
      { id: 'images', name: 'Imágenes', icon: Image },
      { id: 'videos', name: 'Videos', icon: Folder }
    ]
  };

  const elementTypes = {
    basic: [
      { type: 'text', name: 'Texto', desc: 'Texto simple', icon: Type },
      { type: 'heading', name: 'Título', desc: 'Encabezado H1-H6', icon: Type },
      { type: 'button', name: 'Botón', desc: 'Botón interactivo', icon: Square },
      { type: 'image', name: 'Imagen', desc: 'Imagen o foto', icon: Image }
    ],
    text: [
      { type: 'text', name: 'Párrafo', desc: 'Texto normal', icon: Type },
      { type: 'heading', name: 'Título', desc: 'H1 a H6', icon: Type }
    ],
    media: [
      { type: 'image', name: 'Imagen', desc: 'Subir imagen', icon: Image }
    ],
    shapes: [
      { type: 'rectangle', name: 'Rectángulo', desc: 'Forma rectangular', icon: Square },
      { type: 'circle', name: 'Círculo', desc: 'Forma circular', icon: Circle },
      { type: 'triangle', name: 'Triángulo', desc: 'Forma triangular', icon: Triangle }
    ],
    layout: [
      { type: 'section', name: 'Sección', desc: 'Contenedor sección', icon: Layout },
      { type: 'container', name: 'Contenedor', desc: 'Div contenedor', icon: Square },
      { type: 'grid', name: 'Grid', desc: 'Layout en cuadrícula', icon: Grid3X3 },
      { type: 'columns', name: 'Columnas', desc: 'Layout en columnas', icon: Columns },
      { type: 'card', name: 'Tarjeta', desc: 'Componente card', icon: CreditCard }
    ]
  };

  const handleAddElement = (elementType) => {
    const elementConfig = {
      type: elementType,
      position: { x: 100, y: 100 },
      size: { width: 200, height: 100 },
      props: getDefaultProps(elementType),
      styles: getDefaultStyles(elementType)
    };
    
    addElement(elementConfig);
  };

  const getDefaultProps = (type) => {
    switch (type) {
      case 'text':
        return { content: 'Nuevo texto' };
      case 'heading':
        return { content: 'Nuevo título', level: 1 };
      case 'button':
        return { text: 'Botón', variant: 'primary' };
      case 'image':
        return { src: 'https://via.placeholder.com/300x200', alt: 'Imagen' };
      case 'card':
        return { title: 'Título de tarjeta', content: 'Contenido de la tarjeta' };
      default:
        return {};
    }
  };

  const getDefaultStyles = (type) => {
    const baseStyles = {
      background: 'transparent',
      borderRadius: '0px',
      border: 'none'
    };

    switch (type) {
      case 'rectangle':
        return { ...baseStyles, background: '#3D85C6' };
      case 'circle':
        return { ...baseStyles, background: '#3D85C6' };
      case 'triangle':
        return { ...baseStyles, background: '#3D85C6' };
      case 'button':
        return { 
          ...baseStyles, 
          background: '#3D85C6', 
          color: '#ffffff',
          borderRadius: '6px'
        };
      default:
        return baseStyles;
    }
  };

  const currentElements = elementTypes[activeSubSection] || [];

  return (
    <SidebarContainer>
      {/* Nivel 1: Iconos principales */}
      <MainIconBar>
        {mainSections.map(section => {
          const IconComponent = section.icon;
          return (
            <MainIcon
              key={section.id}
              active={activeSection === section.id}
              onClick={() => {
                setActiveSection(section.id);
                if (sectionContent[section.id]) {
                  setActiveSubSection(sectionContent[section.id][0].id);
                }
              }}
              title={section.name}
            >
              <IconComponent size={20} />
            </MainIcon>
          );
        })}
      </MainIconBar>

      {/* Nivel 2: Opciones de sección */}
      <SectionPanel>
        <SectionHeader>
          <SectionTitle>
            {mainSections.find(s => s.id === activeSection)?.name || 'Elementos'}
          </SectionTitle>
        </SectionHeader>
        <SectionContent>
          {(sectionContent[activeSection] || []).map(item => {
            const IconComponent = item.icon;
            return (
              <SectionItem
                key={item.id}
                active={activeSubSection === item.id}
                onClick={() => setActiveSubSection(item.id)}
              >
                <IconComponent size={16} />
                <SectionItemText>{item.name}</SectionItemText>
              </SectionItem>
            );
          })}
        </SectionContent>
      </SectionPanel>

      {/* Nivel 3: Sub-opciones específicas */}
      <SubPanel>
        <SubHeader>
          <SubTitle>
            {sectionContent[activeSection]?.find(s => s.id === activeSubSection)?.name || 'Elementos'}
          </SubTitle>
          <SubDescription>
            Arrastra elementos al canvas para agregarlos
          </SubDescription>
        </SubHeader>
        <SubContent>
          {currentElements.map(element => {
            const IconComponent = element.icon;
            return (
              <ElementButton
                key={element.type}
                onClick={() => handleAddElement(element.type)}
              >
                <ElementIcon>
                  <IconComponent size={16} />
                </ElementIcon>
                <ElementInfo>
                  <ElementName>{element.name}</ElementName>
                  <ElementDesc>{element.desc}</ElementDesc>
                </ElementInfo>
              </ElementButton>
            );
          })}
        </SubContent>
      </SubPanel>
    </SidebarContainer>
  );
};

export default Sidebar; 