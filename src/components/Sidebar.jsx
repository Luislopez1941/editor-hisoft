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
  Database,
  Sparkles,
  Zap,
  Star,
  ChevronLeft, ChevronRight,
  Upload
} from 'lucide-react';
import { useEditor } from '../context/EditorContext';

const SidebarContainer = styled.div`
  display: flex;
  height: 100vh;
  background: linear-gradient(180deg, #ffffff 0%, #f8fafc 100%);
  border-right: 1px solid #e5e7eb;
  box-shadow: 2px 0 8px rgba(0, 0, 0, 0.04);
`;

// Nivel 1: Iconos principales (izquierda)
const MainIconBar = styled.div`
  width: 64px;
  background: linear-gradient(180deg, #1e293b 0%, #0f172a 100%);
  display: flex;
  flex-direction: column;
  align-items: center;
  padding: 24px 0;
  gap: 16px;
  position: relative;
  
  &::after {
    content: '';
    position: absolute;
    top: 0;
    right: 0;
    width: 1px;
    height: 100%;
    background: linear-gradient(180deg, rgba(255,255,255,0.1) 0%, rgba(255,255,255,0.05) 100%);
  }
`;

const MainIcon = styled.div`
  width: 44px;
  height: 44px;
  display: flex;
  align-items: center;
  justify-content: center;
  border-radius: 12px;
  cursor: pointer;
  transition: all 0.3s ease;
  color: ${props => props.active ? '#ffffff' : '#94a3b8'};
  background: ${props => props.active ? 'linear-gradient(135deg, #3b82f6, #1d4ed8)' : 'transparent'};
  border: 1px solid ${props => props.active ? '#3b82f6' : 'transparent'};
  position: relative;
  
  &:hover {
    color: #ffffff;
    background: ${props => props.active ? 'linear-gradient(135deg, #2563eb, #1e40af)' : 'rgba(59, 130, 246, 0.1)'};
    border-color: ${props => props.active ? '#2563eb' : 'rgba(59, 130, 246, 0.3)'};
    transform: translateY(-1px);
    box-shadow: ${props => props.active ? '0 8px 16px rgba(59, 130, 246, 0.3)' : '0 4px 8px rgba(59, 130, 246, 0.2)'};
  }
  
  ${props => props.active && `
    &::before {
      content: '';
      position: absolute;
      left: -12px;
      top: 50%;
      transform: translateY(-50%);
      width: 4px;
      height: 24px;
      background: linear-gradient(180deg, #3b82f6, #1d4ed8);
      border-radius: 0 2px 2px 0;
    }
  `}
`;

// Nivel 2: Panel de categorías (centro)
const CategoryPanel = styled.div`
  width: 240px;
  background: #ffffff;
  border-right: 1px solid #e5e7eb;
  display: flex;
  flex-direction: column;
  height: 100vh;
  overflow-y: auto;
`;

const CategoryHeader = styled.div`
  padding: 24px 20px 16px 20px;
  border-bottom: 1px solid #f1f5f9;
  background: linear-gradient(135deg, #f8fafc, #f1f5f9);
`;

const CategoryTitle = styled.h3`
  margin: 0 0 8px 0;
  font-size: 18px;
  font-weight: 700;
  color: #1e293b;
  font-family: 'Inter', system-ui, sans-serif;
  display: flex;
  align-items: center;
  gap: 10px;
`;

const CategorySubtitle = styled.p`
  margin: 0;
  font-size: 13px;
  color: #64748b;
  font-family: 'Inter', system-ui, sans-serif;
  line-height: 1.4;
`;

const CategoryList = styled.div`
  flex: 1;
  padding: 20px 0;
`;

const CategoryGroup = styled.div`
  margin-bottom: 32px;
  
  &:last-child {
    margin-bottom: 20px;
  }
`;

const CategoryGroupTitle = styled.h4`
  margin: 0 0 16px 20px;
  font-size: 12px;
  font-weight: 600;
  color: #64748b;
  text-transform: uppercase;
  letter-spacing: 0.5px;
  font-family: 'Inter', system-ui, sans-serif;
  display: flex;
  align-items: center;
  gap: 8px;
`;

const CategoryItem = styled.div`
  display: flex;
  align-items: center;
  gap: 12px;
  padding: 12px 20px;
  cursor: pointer;
  transition: all 0.2s ease;
  color: ${props => props.active ? '#1e293b' : '#475569'};
  background: ${props => props.active ? 'linear-gradient(135deg, #eff6ff, #dbeafe)' : 'transparent'};
  border-left: 3px solid ${props => props.active ? '#3b82f6' : 'transparent'};
  font-family: 'Inter', system-ui, sans-serif;
  font-size: 14px;
  font-weight: ${props => props.active ? '600' : '500'};
  position: relative;
  
  &:hover {
    background: ${props => props.active ? 'linear-gradient(135deg, #eff6ff, #dbeafe)' : '#f8fafc'};
    color: #1e293b;
  }
  
  &::before {
    content: '';
    position: absolute;
    right: 16px;
    top: 50%;
    transform: translateY(-50%);
    width: 6px;
    height: 6px;
    border-radius: 50%;
    background: ${props => props.active ? '#3b82f6' : 'transparent'};
  }
`;

const CategoryIcon = styled.div`
  width: 20px;
  height: 20px;
  display: flex;
  align-items: center;
  justify-content: center;
  color: ${props => props.active ? '#3b82f6' : '#64748b'};
`;

// Nivel 3: Panel de elementos específicos (derecha)
const ElementPanel = styled.div`
  width: 280px;
  background: #ffffff;
  display: flex;
  flex-direction: column;
  height: 100vh;
  overflow-y: auto;
`;

const ElementHeader = styled.div`
  padding: 24px 20px 16px 20px;
  border-bottom: 1px solid #f1f5f9;
  background: linear-gradient(135deg, #f8fafc, #f1f5f9);
`;

const ElementTitle = styled.h3`
  margin: 0 0 8px 0;
  font-size: 16px;
  font-weight: 700;
  color: #1e293b;
  font-family: 'Inter', system-ui, sans-serif;
  display: flex;
  align-items: center;
  gap: 8px;
`;

const ElementSubtitle = styled.p`
  margin: 0;
  font-size: 13px;
  color: #64748b;
  font-family: 'Inter', system-ui, sans-serif;
`;

const ElementGrid = styled.div`
  display: grid;
  grid-template-columns: repeat(2, 1fr);
  gap: 16px;
  padding: 20px;
`;

const PredefinedSectionGrid = styled.div`
  display: grid;
  grid-template-columns: 1fr;
  gap: 16px;
  padding: 20px;
`;

const ElementCard = styled.div`
  background: #ffffff;
  border: 2px solid ${props => props.$dragging ? '#3b82f6' : '#e5e7eb'};
  border-radius: 12px;
  padding: 16px;
  cursor: grab;
  transition: all 0.2s ease;
  text-align: center;
  font-family: 'Inter', system-ui, sans-serif;
  box-shadow: 0 2px 4px rgba(0, 0, 0, 0.05);
  
  &:hover {
    border-color: #3b82f6;
    box-shadow: 0 4px 12px rgba(59, 130, 246, 0.15);
    transform: translateY(-2px);
  }
  
  &:active {
    cursor: grabbing;
    transform: scale(0.98);
  }
`;

const ElementIcon = styled.div`
  width: 40px;
  height: 40px;
  margin: 0 auto 12px auto;
  background: linear-gradient(135deg, #eff6ff, #dbeafe);
  border-radius: 10px;
  display: flex;
  align-items: center;
  justify-content: center;
  color: #3b82f6;
  font-size: 20px;
`;

const ElementName = styled.div`
  font-size: 14px;
  font-weight: 600;
  color: #1e293b;
  margin-bottom: 4px;
`;

const ElementDescription = styled.div`
  font-size: 12px;
  color: #64748b;
  line-height: 1.3;
`;

const SectionCard = styled.div`
  background: linear-gradient(135deg, #ffffff, #f8fafc);
  border: 2px solid ${props => props.$dragging ? '#3b82f6' : '#e5e7eb'};
  border-radius: 16px;
  padding: 20px;
  cursor: grab;
  transition: all 0.3s ease;
  font-family: 'Inter', system-ui, sans-serif;
  position: relative;
  overflow: hidden;
  
  &:hover {
    border-color: #3b82f6;
    box-shadow: 0 8px 24px rgba(59, 130, 246, 0.15);
    transform: translateY(-4px);
  }
  
  &:active {
    cursor: grabbing;
    transform: scale(0.98);
  }
  
  &::before {
    content: '';
    position: absolute;
    top: 0;
    left: 0;
    right: 0;
    height: 4px;
    background: linear-gradient(90deg, #3b82f6, #8b5cf6, #ec4899);
  }
`;

const SectionPreview = styled.div`
  width: 100%;
  height: 100px;
  background: ${props => props.background || 'linear-gradient(135deg, #f1f5f9, #e2e8f0)'};
  border-radius: 10px;
  margin-bottom: 16px;
  display: flex;
  align-items: center;
  justify-content: center;
  position: relative;
  overflow: hidden;
  
  &::after {
    content: '';
    position: absolute;
    top: 0;
    left: 0;
    right: 0;
    bottom: 0;
    background: linear-gradient(45deg, transparent 30%, rgba(255,255,255,0.1) 50%, transparent 70%);
  }
`;

const SectionName = styled.h4`
  font-size: 16px;
  font-weight: 700;
  color: #1e293b;
  margin: 0 0 8px 0;
  display: flex;
  align-items: center;
  gap: 8px;
`;

const SectionDescription = styled.p`
  font-size: 13px;
  color: #64748b;
  margin: 0 0 12px 0;
  line-height: 1.4;
`;

const SectionTags = styled.div`
  display: flex;
  gap: 6px;
  flex-wrap: wrap;
`;

const SectionTag = styled.span`
  background: linear-gradient(135deg, #eff6ff, #dbeafe);
  color: #3b82f6;
  padding: 4px 8px;
  border-radius: 6px;
  font-size: 11px;
  font-weight: 500;
`;

const Sidebar = () => {
  const [activeTab, setActiveTab] = useState('elements');
  const [activeCategory, setActiveCategory] = useState('text');
  const [submenusCollapsed, setSubmenusCollapsed] = useState(false);
  const { addElement } = useEditor();

  // Handler para subir SVG desde el sidebar
  const handleUploadSVG = () => {
    const input = document.createElement('input');
    input.type = 'file';
    input.accept = '.svg';
    input.onchange = (e) => {
      const file = e.target.files[0];
      if (file && file.type === 'image/svg+xml') {
        const reader = new FileReader();
        reader.onload = (ev) => {
          let text = ev.target.result;
          // Procesar SVG: quitar width/height y reemplazar fill/stroke por currentColor
          if (typeof text === 'string') {
            // Extraer solo el contenido SVG si viene como dataURL
            if (text.startsWith('data:image/svg+xml')) {
              text = atob(text.split(',')[1]);
            }
            // Quitar width/height del tag <svg ...>
            text = text.replace(/(width|height)="[^"]*"/gi, '');
            // Reemplazar fill y stroke por currentColor
            text = text.replace(/fill="(?!none)[^"]*"/gi, 'fill="currentColor"');
            text = text.replace(/stroke="(?!none)[^"]*"/gi, 'stroke="currentColor"');
            // Volver a codificar como dataURL
            const base64 = btoa(text);
            const dataUrl = 'data:image/svg+xml;base64,' + base64;
            addElement(
              'image',
              { src: dataUrl, alt: file.name.replace(/\.[^/.]+$/, ''), name: file.name },
              [],
              { svgColor: '#000000' },
              { x: 200, y: 200 },
              { width: '40px', height: '40px' }
            );
          }
        };
        reader.readAsText(file);
      }
    };
    input.click();
  };

  // Configuración de tabs principales
  const mainTabs = [
    { 
      id: 'elements', 
      icon: Plus, 
      name: 'Elementos',
      description: 'Añadir elementos básicos'
    },
    { 
      id: 'sections', 
      icon: Layout, 
      name: 'Secciones',
      description: 'Secciones prediseñadas'
    },
    { 
      id: 'templates', 
      icon: Folder, 
      name: 'Plantillas',
      description: 'Plantillas completas'
    }
  ];

  // Categorías para elementos
  const elementCategories = [
    {
      group: 'Básicos',
      icon: <Sparkles size={14} />,
      items: [
        { id: 'text', icon: Type, name: 'Texto', description: 'Párrafos y contenido' },
        { id: 'heading', icon: Type, name: 'Títulos', description: 'Encabezados H1-H6' },
        { id: 'image', icon: Image, name: 'Imágenes', description: 'Fotos y gráficos' },
        { id: 'button', icon: Square, name: 'Botones', description: 'Acciones y enlaces' }
      ]
    },
    {
      group: 'Layouts',
      icon: <Grid3X3 size={14} />,
      items: [
        { id: 'container', icon: Layout, name: 'Contenedor', description: 'Agrupa elementos' },
        { id: 'grid', icon: Grid3X3, name: 'Grilla', description: 'Diseño en cuadrícula' },
        { id: 'columns', icon: Columns, name: 'Columnas', description: 'Diseño en columnas' }
      ]
    },
    {
      group: 'Formas',
      icon: <Shapes size={14} />,
      items: [
        { id: 'rectangle', icon: Square, name: 'Rectángulo', description: 'Forma rectangular' },
        { id: 'circle', icon: Circle, name: 'Círculo', description: 'Forma circular' },
        { id: 'triangle', icon: Triangle, name: 'Triángulo', description: 'Forma triangular' }
      ]
    },
    {
      group: 'Avanzado',
      icon: <Zap size={14} />,
      items: [
        { id: 'card', icon: CreditCard, name: 'Tarjetas', description: 'Contenido estructurado' }
      ]
    }
  ];

  const headerCategory = {
    group: 'Especial',
    icon: <Settings size={14} />, // Puedes cambiar el ícono si prefieres otro
    items: [
      { id: 'header', icon: Settings, name: 'Header', description: 'Cabecera fija y configurable' }
    ]
  };

  const allCategories = [headerCategory, ...elementCategories];

  // Secciones predefinidas
  const predefinedSections = [
    {
      id: 'hero',
      name: 'Hero Section',
      description: 'Sección principal con título, subtítulo y botón de acción',
      tags: ['Landing', 'Principal'],
      background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
      preview: '🚀',
      elements: [
        {
          type: 'section',
          styles: {
            background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
            padding: '100px 0',
            color: '#ffffff',
            textAlign: 'center'
          },
          children: [
            {
              type: 'heading',
              props: { content: 'Bienvenido a Nuestro Sitio', level: 1 },
              styles: { fontSize: '48px', fontWeight: '700', marginBottom: '20px' },
              position: { x: 50, y: 50 },
              size: { width: '600px', height: 'auto' }
            },
            {
              type: 'text',
              props: { content: 'Descubre las mejores soluciones para tu negocio' },
              styles: { fontSize: '20px', marginBottom: '30px', opacity: '0.9' },
              position: { x: 50, y: 150 },
              size: { width: '500px', height: 'auto' }
            },
            {
              type: 'button',
              props: { text: 'Comenzar Ahora', variant: 'primary' },
              styles: { padding: '15px 30px', fontSize: '18px' },
              position: { x: 50, y: 250 },
              size: { width: 'auto', height: 'auto' }
            }
          ]
        }
      ]
    },
    {
      id: 'features',
      name: 'Características',
      description: 'Sección con tres columnas de características',
      tags: ['Servicios', 'Grid'],
      background: 'linear-gradient(135deg, #f093fb 0%, #f5576c 100%)',
      preview: '⭐',
      elements: [
        {
          type: 'section',
          styles: {
            background: '#ffffff',
            padding: '80px 0',
            textAlign: 'center'
          },
          children: [
            {
              type: 'heading',
              props: { content: 'Nuestras Características', level: 2 },
              styles: { fontSize: '36px', marginBottom: '50px', color: '#1e293b' },
              position: { x: 50, y: 50 },
              size: { width: '500px', height: 'auto' }
            },
            {
              type: 'card',
              props: {
                title: 'Rápido',
                content: 'Optimizado para velocidad y rendimiento',
                image: 'https://images.unsplash.com/photo-1551288049-bebda4e38f71?w=300&h=200&fit=crop'
              },
              position: { x: 50, y: 150 },
              size: { width: '300px', height: '250px' }
            },
            {
              type: 'card',
              props: {
                title: 'Seguro',
                content: 'Máxima seguridad para tus datos',
                image: 'https://images.unsplash.com/photo-1563013544-824ae1b704d3?w=300&h=200&fit=crop'
              },
              position: { x: 400, y: 150 },
              size: { width: '300px', height: '250px' }
            },
            {
              type: 'card',
              props: {
                title: 'Fácil',
                content: 'Interfaz intuitiva y fácil de usar',
                image: 'https://images.unsplash.com/photo-1460925895917-afdab827c52f?w=300&h=200&fit=crop'
              },
              position: { x: 750, y: 150 },
              size: { width: '300px', height: '250px' }
            }
          ]
        }
      ]
    },
    {
      id: 'contact',
      name: 'Contacto',
      description: 'Sección de contacto con información y formulario',
      tags: ['Contacto', 'Footer'],
      background: 'linear-gradient(135deg, #4facfe 0%, #00f2fe 100%)',
      preview: '📞',
      elements: [
        {
          type: 'section',
          styles: {
            background: 'linear-gradient(135deg, #1e293b, #334155)',
            padding: '80px 0',
            color: '#ffffff',
            textAlign: 'center'
          },
          children: [
            {
              type: 'heading',
              props: { content: 'Contáctanos', level: 2 },
              styles: { fontSize: '36px', marginBottom: '20px' },
              position: { x: 50, y: 50 },
              size: { width: '400px', height: 'auto' }
            },
            {
              type: 'text',
              props: { content: 'Estamos aquí para ayudarte con cualquier pregunta' },
              styles: { fontSize: '18px', marginBottom: '40px' },
              position: { x: 50, y: 120 },
              size: { width: '500px', height: 'auto' }
            },
            {
              type: 'text',
              props: { content: '📧 info@empresa.com\n📞 +1 234 567 890\n📍 123 Calle Principal, Ciudad' },
              styles: { lineHeight: '2' },
              position: { x: 50, y: 200 },
              size: { width: '300px', height: 'auto' }
            },
            {
              type: 'text',
              props: { content: 'Horarios de atención:\nLunes a Viernes: 9:00 - 18:00\nSábados: 9:00 - 14:00' },
              styles: { lineHeight: '2' },
              position: { x: 400, y: 200 },
              size: { width: '300px', height: 'auto' }
            }
          ]
        }
      ]
    }
  ];

  // Elementos individuales por categoría
  const getElementsForCategory = (categoryId) => {
    const elements = {
      text: [
        { 
          type: 'text', 
          name: 'Párrafo', 
          description: 'Texto básico',
          props: { content: 'Este es un párrafo de ejemplo. Haz doble clic para editar.' },
          styles: { fontSize: '16px', lineHeight: '1.6' }
        },
        { 
          type: 'text', 
          name: 'Texto destacado', 
          description: 'Con énfasis',
          props: { content: 'Texto importante con énfasis visual' },
          styles: { fontSize: '18px', fontWeight: '600', color: '#3b82f6' }
        }
      ],
      heading: [
        { 
          type: 'heading', 
          name: 'Título H1', 
          description: 'Encabezado principal', 
          props: { content: 'Título Principal', level: 1 },
          styles: { fontSize: '48px', fontWeight: '700' }
        },
        { 
          type: 'heading', 
          name: 'Título H2', 
          description: 'Subtítulo', 
          props: { content: 'Subtítulo', level: 2 },
          styles: { fontSize: '36px', fontWeight: '600' }
        },
        { 
          type: 'heading', 
          name: 'Título H3', 
          description: 'Título de sección', 
          props: { content: 'Sección', level: 3 },
          styles: { fontSize: '24px', fontWeight: '600' }
        }
      ],
      image: [
        { 
          type: 'image', 
          name: 'Imagen', 
          description: 'Imagen básica',
          props: { 
            src: 'https://images.unsplash.com/photo-1557804506-669a67965ba0?w=400&h=300&fit=crop',
            alt: 'Imagen de ejemplo'
          }
        },
        { 
          type: 'image', 
          name: 'Imagen destacada', 
          description: 'Con marco',
          props: { 
            src: 'https://images.unsplash.com/photo-1460925895917-afdab827c52f?w=400&h=300&fit=crop',
            alt: 'Imagen destacada'
          },
          styles: { borderRadius: '12px', border: '3px solid #3b82f6' }
        }
      ],
      button: [
        { 
          type: 'button', 
          name: 'Botón primario', 
          description: 'Acción principal', 
          props: { text: 'Botón Principal', variant: 'primary' },
          styles: { padding: '12px 24px', fontSize: '16px' }
        },
        { 
          type: 'button', 
          name: 'Botón secundario', 
          description: 'Acción secundaria', 
          props: { text: 'Botón Secundario', variant: 'secondary' },
          styles: { padding: '10px 20px', fontSize: '14px' }
        },
        { 
          type: 'button', 
          name: 'Botón de ventas', 
          description: 'Redirige a la sección de ventas', 
          props: { text: 'Ir a Ventas', variant: 'primary', onClick: () => setActiveCategory('sales') },
          styles: { padding: '12px 24px', fontSize: '16px' }
        }
      ],
      container: [
        { 
          type: 'container', 
          name: 'Contenedor', 
          description: 'Agrupa elementos',
          styles: { 
            background: '#f8fafc', 
            border: '1px solid #e2e8f0',
            borderRadius: '12px',
            padding: '20px'
          }
        }
      ],
      grid: [
        { 
          type: 'grid', 
          name: 'Grilla 2x2', 
          description: '4 elementos', 
          props: { columns: 2 },
          styles: { gap: '20px', padding: '20px' }
        },
        { 
          type: 'grid', 
          name: 'Grilla 3x3', 
          description: '9 elementos', 
          props: { columns: 3 },
          styles: { gap: '16px', padding: '20px' }
        }
      ],
      columns: [
        { 
          type: 'columns', 
          name: '2 Columnas', 
          description: 'Dos columnas', 
          props: { columns: 2 },
          styles: { gap: '32px', padding: '20px' }
        },
        { 
          type: 'columns', 
          name: '3 Columnas', 
          description: 'Tres columnas', 
          props: { columns: 3 },
          styles: { gap: '24px', padding: '20px' }
        }
      ],
      rectangle: [
        { 
          type: 'rectangle', 
          name: 'Rectángulo', 
          description: 'Forma rectangular',
          styles: { 
            background: 'linear-gradient(135deg, #3b82f6, #1d4ed8)',
            borderRadius: '8px'
          }
        }
      ],
      circle: [
        { 
          type: 'circle', 
          name: 'Círculo', 
          description: 'Forma circular',
          styles: { 
            background: 'linear-gradient(135deg, #10b981, #047857)'
          }
        }
      ],
      triangle: [
        { 
          type: 'triangle', 
          name: 'Triángulo', 
          description: 'Forma triangular',
          styles: { 
            background: '#f59e0b'
          }
        }
      ],
      card: [
        { 
          type: 'card', 
          name: 'Tarjeta básica', 
          description: 'Con título y texto',
          props: { 
            title: 'Título de la Tarjeta',
            content: 'Descripción de la tarjeta con información relevante.'
          },
          styles: { 
            background: '#ffffff',
            border: '1px solid #e5e7eb',
            borderRadius: '12px',
            padding: '24px'
          }
        },
        { 
          type: 'card', 
          name: 'Tarjeta con imagen', 
          description: 'Incluye imagen',
          props: { 
            title: 'Tarjeta con Imagen',
            content: 'Tarjeta que incluye una imagen destacada.',
            image: 'https://images.unsplash.com/photo-1557804506-669a67965ba0?w=300&h=200&fit=crop'
          },
          styles: { 
            background: '#ffffff',
            border: '1px solid #e5e7eb',
            borderRadius: '12px',
            padding: '20px'
          }
        }
      ]
    };
    return elements[categoryId] || [];
  };

  const handleDragStart = (e, elementData) => {
    if (elementData.elements) {
      // Es una sección predefinida
      e.dataTransfer.setData('section', JSON.stringify(elementData));
    } else {
      // Es un elemento individual
      e.dataTransfer.setData('element', JSON.stringify(elementData));
    }
  };

  const handleElementClick = (elementData) => {
    // Añadir elemento directamente al canvas
    const baseX = Math.random() * 200 + 100; // Posición aleatoria
    const baseY = Math.random() * 200 + 100;
    
    // Determinar tamaño apropiado según el tipo
    const getDefaultSize = (type) => {
      switch (type) {
        case 'text':
          return { width: '300px', height: 'auto' };
        case 'heading':
          return { width: '400px', height: 'auto' };
        case 'button':
          return { width: 'auto', height: 'auto' };
        case 'image':
          return { width: '300px', height: '200px' };
        case 'container':
        case 'section':
          return { width: '400px', height: '300px' };
        case 'grid':
        case 'columns':
          return { width: '500px', height: '300px' };
        case 'card':
          return { width: '300px', height: '250px' };
        case 'rectangle':
          return { width: '200px', height: '120px' };
        case 'circle':
          return { width: '120px', height: '120px' };
        case 'triangle':
          return { width: '120px', height: '100px' };
        default:
          return { width: '200px', height: '100px' };
      }
    };
    
    const defaultSize = getDefaultSize(elementData.type);
    
    addElement(
      elementData.type,
      elementData.props || {},
      elementData.children || [],
      elementData.styles || {},
      { x: baseX, y: baseY },
      defaultSize
    );
  };

  const renderElementsTab = () => (
    <>
      <CategoryPanel>
        <CategoryHeader>
          <CategoryTitle>
            <Plus size={20} />
            Elementos
          </CategoryTitle>
          <CategorySubtitle>
            Arrastra elementos al canvas para añadirlos
          </CategorySubtitle>
        </CategoryHeader>
        <CategoryList>
          {allCategories.map((group) => (
            <CategoryGroup key={group.group}>
              <CategoryGroupTitle>
                {group.icon}
                {group.group}
              </CategoryGroupTitle>
              {group.items.map((item) => (
                <CategoryItem
                  key={item.id}
                  active={activeCategory === item.id}
                  onClick={() => setActiveCategory(item.id)}
                >
                  <CategoryIcon active={activeCategory === item.id}>
                    <item.icon size={20} />
                  </CategoryIcon>
                  <div>
                    <div>{item.name}</div>
                    <div style={{ fontSize: '12px', opacity: 0.7 }}>
                      {item.description}
                    </div>
                  </div>
                </CategoryItem>
              ))}
            </CategoryGroup>
          ))}
        </CategoryList>
      </CategoryPanel>
      <ElementPanel>
        <ElementHeader>
          <ElementTitle>
            {allCategories
              .flatMap(g => g.items)
              .find(item => item.id === activeCategory)?.name || 'Elementos'}
          </ElementTitle>
          <ElementSubtitle>
            Haz clic o arrastra para añadir
          </ElementSubtitle>
        </ElementHeader>
        {activeCategory === 'image' && (
          <div style={{ padding: '0 20px 16px 20px', display: 'flex', alignItems: 'center' }}>
            <button
              onClick={handleUploadSVG}
              style={{
                display: 'flex',
                alignItems: 'center',
                gap: 8,
                background: '#f3f4f6',
                border: '1px solid #d1d5db',
                borderRadius: 8,
                padding: '8px 16px',
                color: '#374151',
                fontWeight: 600,
                fontSize: 14,
                cursor: 'pointer',
                marginBottom: 8
              }}
            >
              <Upload size={18} /> Subir SVG
            </button>
          </div>
        )}
        <ElementGrid>
          {getElementsForCategory(activeCategory).map((element, index) => (
            <ElementCard
              key={index}
              draggable
              onDragStart={(e) => handleDragStart(e, element)}
              onClick={() => handleElementClick(element)}
            >
              <ElementIcon>
                {allCategories
                  .flatMap(g => g.items)
                  .find(item => item.id === activeCategory)?.icon && 
                  React.createElement(
                    allCategories
                      .flatMap(g => g.items)
                      .find(item => item.id === activeCategory).icon,
                    { size: 20 }
                  )}
              </ElementIcon>
              <ElementName>{element.name}</ElementName>
              <ElementDescription>{element.description}</ElementDescription>
            </ElementCard>
          ))}
        </ElementGrid>
      </ElementPanel>
    </>
  );

  const renderSectionsTab = () => (
    <>
      <CategoryPanel>
        <CategoryHeader>
          <CategoryTitle>
            <Layout size={20} />
            Secciones
          </CategoryTitle>
          <CategorySubtitle>
            Secciones completas listas para usar
          </CategorySubtitle>
        </CategoryHeader>
      </CategoryPanel>
      
      <ElementPanel>
        <ElementHeader>
          <ElementTitle>
            <Star size={16} />
            Secciones Prediseñadas
          </ElementTitle>
          <ElementSubtitle>
            Arrastra al canvas para añadir
          </ElementSubtitle>
        </ElementHeader>
        <PredefinedSectionGrid>
          {predefinedSections.map((section) => (
            <SectionCard
              key={section.id}
              draggable
              onDragStart={(e) => handleDragStart(e, section)}
            >
              <SectionPreview background={section.background}>
                <span style={{ fontSize: '32px' }}>{section.preview}</span>
              </SectionPreview>
              <SectionName>
                <Sparkles size={16} />
                {section.name}
              </SectionName>
              <SectionDescription>
                {section.description}
              </SectionDescription>
              <SectionTags>
                {section.tags.map((tag) => (
                  <SectionTag key={tag}>{tag}</SectionTag>
                ))}
              </SectionTags>
            </SectionCard>
          ))}
        </PredefinedSectionGrid>
      </ElementPanel>
    </>
  );

  const renderTemplatesTab = () => (
    <>
      <CategoryPanel>
        <CategoryHeader>
          <CategoryTitle>
            <Folder size={20} />
            Plantillas
          </CategoryTitle>
          <CategorySubtitle>
            Plantillas completas de sitios web
          </CategorySubtitle>
        </CategoryHeader>
      </CategoryPanel>
      
      <ElementPanel>
        <ElementHeader>
          <ElementTitle>Próximamente</ElementTitle>
          <ElementSubtitle>
            Plantillas completas estarán disponibles pronto
          </ElementSubtitle>
        </ElementHeader>
        <div style={{ padding: '40px 20px', textAlign: 'center', color: '#64748b' }}>
          <Database size={48} style={{ marginBottom: '16px', opacity: 0.5 }} />
          <p>Las plantillas completas estarán disponibles en una próxima actualización.</p>
        </div>
      </ElementPanel>
    </>
  );

  return (
    <SidebarContainer>
      <MainIconBar>
        {mainTabs.map((tab) => (
          <MainIcon
            key={tab.id}
            active={activeTab === tab.id}
            onClick={() => setActiveTab(tab.id)}
            title={tab.description}
          >
            <tab.icon size={22} />
          </MainIcon>
        ))}
        {/* Botón flotante para ocultar/mostrar submenús */}
        <button
          onClick={() => setSubmenusCollapsed(c => !c)}
          style={{
            position: 'absolute',
            top: 16,
            right: -18,
            zIndex: 100,
            background: '#fff',
            border: '1px solid #e5e7eb',
            borderRadius: '50%',
            width: 32,
            height: 32,
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            boxShadow: '0 2px 8px rgba(0,0,0,0.04)',
            cursor: 'pointer',
            padding: 0
          }}
          title={submenusCollapsed ? 'Mostrar paneles' : 'Ocultar paneles'}
        >
          {submenusCollapsed ? <ChevronRight size={18} /> : <ChevronLeft size={18} />}
        </button>
      </MainIconBar>
      {!submenusCollapsed && activeTab === 'elements' && (
        <>
          <CategoryPanel>
            <CategoryHeader>
              <CategoryTitle>
                <Plus size={20} />
                Elementos
              </CategoryTitle>
              <CategorySubtitle>
                Arrastra elementos al canvas para añadirlos
              </CategorySubtitle>
            </CategoryHeader>
            <CategoryList>
              {allCategories.map((group) => (
                <CategoryGroup key={group.group}>
                  <CategoryGroupTitle>
                    {group.icon}
                    {group.group}
                  </CategoryGroupTitle>
                  {group.items.map((item) => (
                    <CategoryItem
                      key={item.id}
                      active={activeCategory === item.id}
                      onClick={() => setActiveCategory(item.id)}
                    >
                      <CategoryIcon active={activeCategory === item.id}>
                        <item.icon size={20} />
                      </CategoryIcon>
                      <div>
                        <div>{item.name}</div>
                        <div style={{ fontSize: '12px', opacity: 0.7 }}>
                          {item.description}
                        </div>
                      </div>
                    </CategoryItem>
                  ))}
                </CategoryGroup>
              ))}
            </CategoryList>
          </CategoryPanel>
          <ElementPanel>
            <ElementHeader>
              <ElementTitle>
                {allCategories
                  .flatMap(g => g.items)
                  .find(item => item.id === activeCategory)?.name || 'Elementos'}
              </ElementTitle>
              <ElementSubtitle>
                Haz clic o arrastra para añadir
              </ElementSubtitle>
            </ElementHeader>
            {activeCategory === 'image' && (
              <div style={{ padding: '0 20px 16px 20px', display: 'flex', alignItems: 'center' }}>
                <button
                  onClick={handleUploadSVG}
                  style={{
                    display: 'flex',
                    alignItems: 'center',
                    gap: 8,
                    background: '#f3f4f6',
                    border: '1px solid #d1d5db',
                    borderRadius: 8,
                    padding: '8px 16px',
                    color: '#374151',
                    fontWeight: 600,
                    fontSize: 14,
                    cursor: 'pointer',
                    marginBottom: 8
                  }}
                >
                  <Upload size={18} /> Subir SVG
                </button>
              </div>
            )}
            <ElementGrid>
              {getElementsForCategory(activeCategory).map((element, index) => (
                <ElementCard
                  key={index}
                  draggable
                  onDragStart={(e) => handleDragStart(e, element)}
                  onClick={() => handleElementClick(element)}
                >
                  <ElementIcon>
                    {allCategories
                      .flatMap(g => g.items)
                      .find(item => item.id === activeCategory)?.icon && 
                      React.createElement(
                        allCategories
                          .flatMap(g => g.items)
                          .find(item => item.id === activeCategory).icon,
                        { size: 20 }
                      )}
                  </ElementIcon>
                  <ElementName>{element.name}</ElementName>
                  <ElementDescription>{element.description}</ElementDescription>
                </ElementCard>
              ))}
            </ElementGrid>
          </ElementPanel>
        </>
      )}
      {!submenusCollapsed && activeTab === 'sections' && renderSectionsTab()}
      {!submenusCollapsed && activeTab === 'templates' && renderTemplatesTab()}
    </SidebarContainer>
  );
};

export default Sidebar; 