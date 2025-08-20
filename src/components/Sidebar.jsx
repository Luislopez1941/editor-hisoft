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
  Upload,
  FileText,
  Mail,
  Bell,
  Search
} from 'lucide-react';
import { useEditor } from '../context/EditorContext';
import SectionManager from './SectionManager';
import CatalogSection from './views/CatalogSection';

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
  color: ${props => props.$active ? '#ffffff' : '#94a3b8'};
  background: ${props => props.$active ? 'linear-gradient(135deg, #3b82f6, #1d4ed8)' : 'transparent'};
  border: 1px solid ${props => props.$active ? '#3b82f6' : 'transparent'};
  position: relative;
  
  &:hover {
    color: #ffffff;
    background: ${props => props.$active ? 'linear-gradient(135deg, #2563eb, #1e40af)' : 'rgba(59, 130, 246, 0.1)'};
    border-color: ${props => props.$active ? '#2563eb' : 'rgba(59, 130, 246, 0.3)'};
    transform: translateY(-1px);
    box-shadow: ${props => props.$active ? '0 8px 16px rgba(59, 130, 246, 0.3)' : '0 4px 8px rgba(59, 130, 246, 0.2)'};
  }
  
  ${props => props.$active && `
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
  color: ${props => props.$active ? '#1e293b' : '#475569'};
  background: ${props => props.$active ? 'linear-gradient(135deg, #eff6ff, #dbeafe)' : 'transparent'};
  border-left: 3px solid ${props => props.$active ? '#3b82f6' : 'transparent'};
  font-family: 'Inter', system-ui, sans-serif;
  font-size: 14px;
  font-weight: ${props => props.$active ? '600' : '500'};
  position: relative;
  
  &:hover {
    background: ${props => props.$active ? 'linear-gradient(135deg, #eff6ff, #dbeafe)' : '#f8fafc'};
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
    background: ${props => props.$active ? '#3b82f6' : 'transparent'};
  }
`;

const CategoryIcon = styled.div`
  width: 20px;
  height: 20px;
  display: flex;
  align-items: center;
  justify-content: center;
  color: ${props => props.$active ? '#3b82f6' : '#64748b'};
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
      id: 'pages', 
      icon: Layers, 
      name: 'Páginas',
      description: 'Gestionar secciones del sitio'
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
        { id: 'header', icon: Settings, name: 'Header', description: 'Cabecera de navegación' },
        { id: 'container', icon: Layout, name: 'Contenedor', description: 'Agrupa elementos' },
        { id: 'grid', icon: Grid3X3, name: 'Grilla', description: 'Diseño en cuadrícula' },
        { id: 'columns', icon: Columns, name: 'Columnas', description: 'Diseño en columnas' }
      ]
    },
    {
      group: 'Formularios',
      icon: <FileText size={14} />,
      items: [
        { id: 'contact-form', icon: Mail, name: 'Formulario de Contacto', description: 'Formulario completo con validación' },
        { id: 'newsletter-form', icon: Bell, name: 'Newsletter', description: 'Suscripción a boletín' },
        { id: 'search-form', icon: Search, name: 'Búsqueda', description: 'Campo de búsqueda' }
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

  // Header category eliminado - ahora se trata como un container normal
  const allCategories = [...elementCategories];

  // Secciones predefinidas - Solo las 3 secciones solicitadas
  const predefinedSections = [
    {
      id: 'catalog',
      name: 'Catálogo de Productos',
      description: 'Sección interactiva con catálogo de productos por familias y colecciones',
      tags: ['E-commerce', 'Productos'],
      background: 'linear-gradient(135deg, #f8fafc 0%, #e2e8f0 100%)',
      preview: '🛍️',
      isReactComponent: true,
      elements: [
        {
          type: 'catalog-section',
          props: {
            title: 'Catálogo de Productos',
            subtitle: 'Explora nuestra selección de productos'
          },
          styles: {
            width: '100%',
            minHeight: '500px'
          }
        }
      ]
    },
    {
      id: 'carousel',
      name: 'Carrusel de Imágenes',
      description: 'Carrusel interactivo con autoplay, navegación y indicadores',
      tags: ['Galería', 'Imágenes'],
      background: 'linear-gradient(135deg, #a8edea 0%, #fed6e3 100%)',
      preview: '🎠',
      isReactComponent: true,
      elements: [
        {
          type: 'carousel',
          props: {
            images: [
              'https://images.unsplash.com/photo-1441986300917-64674bd600d8?w=800&h=400&fit=crop',
              'https://images.unsplash.com/photo-1551288049-bebda4e38f71?w=800&h=400&fit=crop',
              'https://images.unsplash.com/photo-1551434678-e076c223a692?w=800&h=400&fit=crop'
            ],
            autoPlay: true,
            showDots: true,
            showArrows: true,
            interval: 3000
          },
          styles: {
            width: '100%',
            height: '400px'
          }
        }
      ]
    },
    {
      id: 'cards-carousel',
      name: 'Carrusel de Cards',
      description: 'Carrusel inteligente que se adapta según la cantidad de cards (4 o menos = grid, 6+ = carrusel)',
      tags: ['Cards', 'Carrusel', 'Responsive'],
      background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
      preview: '🎠',
      isReactComponent: true,
      elements: [
        {
          type: 'cardsCarousel',
          props: {
            cards: [
              {
                props: {
                  title: 'Green plants are going to Extinct about 500 times faster than they should, Study finds',
                  content: 'If you are the sort of person who just can not keep a plant alive, you are not alone according to a new study published June 10 in the journal Nature...',
                  image: 'https://images.unsplash.com/photo-1557804506-669a67965ba0?w=400&h=300&fit=crop',
                  category: 'Science',
                  buttonText: 'Leer más',
                  buttonUrl: 'servicios',
                  buttonColor: '#3b82f6',
                  categoryColor: '#10b981',
                  showButton: true
                },
                styles: {
                  background: '#ffffff',
                  borderRadius: '16px',
                  boxShadow: '0 4px 12px rgba(0, 0, 0, 0.08)',
                  overflow: 'hidden',
                  transition: 'all 0.3s ease',
                  border: '1px solid #f1f5f9'
                }
              },
              {
                props: {
                  title: 'How to make the perfect morning coffee, according to the Science',
                  content: 'Discover the scientific approach to brewing the perfect cup of coffee every morning.',
                  image: 'https://images.unsplash.com/photo-1509042239860-f550ce710b93?w=400&h=300&fit=crop',
                  category: 'Lifestyle',
                  buttonText: 'Ver receta',
                  buttonUrl: 'productos',
                  buttonColor: '#f59e0b',
                  categoryColor: '#8b5cf6',
                  showButton: true
                },
                styles: {
                  background: '#ffffff',
                  borderRadius: '16px',
                  boxShadow: '0 4px 12px rgba(0, 0, 0, 0.08)',
                  overflow: 'hidden',
                  transition: 'all 0.3s ease',
                  border: '1px solid #f1f5f9'
                }
              },
              {
                props: {
                  title: 'The Future of Artificial Intelligence in Healthcare',
                  content: 'Exploring how AI is revolutionizing medical diagnosis and patient care in modern healthcare systems.',
                  image: 'https://images.unsplash.com/photo-1574717024653-61fd2cf4d44d?w=400&h=300&fit=crop',
                  category: 'Technology',
                  buttonText: 'Saber más',
                  buttonUrl: 'nosotros',
                  buttonColor: '#06b6d4',
                  categoryColor: '#ef4444',
                  showButton: true
                },
                styles: {
                  background: '#ffffff',
                  borderRadius: '16px',
                  boxShadow: '0 4px 12px rgba(0, 0, 0, 0.08)',
                  overflow: 'hidden',
                  transition: 'all 0.3s ease',
                  border: '1px solid #f1f5f9'
                }
              },
              {
                props: {
                  title: 'Sustainable Living: 10 Easy Ways to Reduce Your Carbon Footprint',
                  content: 'Simple and practical tips to live more sustainably and help protect our environment for future generations.',
                  image: 'https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?w=400&h=300&fit=crop',
                  category: 'Environment',
                  buttonText: 'Ver consejos',
                  buttonUrl: 'blog',
                  buttonColor: '#10b981',
                  categoryColor: '#f97316',
                  showButton: true
                },
                styles: {
                  background: '#ffffff',
                  borderRadius: '16px',
                  boxShadow: '0 4px 12px rgba(0, 0, 0, 0.08)',
                  overflow: 'hidden',
                  transition: 'all 0.3s ease',
                  border: '1px solid #f1f5f9'
                }
              },
              {
                props: {
                  title: 'Breaking: Major Tech Company Announces Revolutionary AI Breakthrough',
                  content: 'The company revealed its latest artificial intelligence system that promises to transform how we interact with technology.',
                  image: 'https://images.unsplash.com/photo-1518709268805-4e9042af2176?w=400&h=300&fit=crop',
                  category: 'Technology',
                  buttonText: 'Leer noticia',
                  buttonUrl: 'galeria',
                  buttonColor: '#8b5cf6',
                  categoryColor: '#06b6d4',
                  showButton: true
                },
                styles: {
                  background: '#ffffff',
                  borderRadius: '16px',
                  boxShadow: '0 4px 12px rgba(0, 0, 0, 0.08)',
                  overflow: 'hidden',
                  transition: 'all 0.3s ease',
                  border: '1px solid #f1f5f9'
                }
              },
              {
                props: {
                  title: 'The Psychology of Color in Web Design',
                  content: 'Understanding how different colors affect user behavior and perception in digital interfaces.',
                  image: 'https://images.unsplash.com/photo-1540575467063-178a50c2df87?w=400&h=300&fit=crop',
                  category: 'Design',
                  buttonText: 'Ver guía',
                  buttonUrl: 'contacto',
                  buttonColor: '#f43f5e',
                  categoryColor: '#84cc16',
                  showButton: true
                },
                styles: {
                  background: '#ffffff',
                  borderRadius: '16px',
                  boxShadow: '0 4px 12px rgba(0, 0, 0, 0.08)',
                  overflow: 'hidden',
                  transition: 'all 0.3s ease',
                  border: '1px solid #f1f5f9'
                }
              }
            ],
            autoPlay: true,
            interval: 5000,
            showDots: true,
            showArrows: true
          },
          styles: {
            width: '100%',
            height: '500px'
          }
        }
      ]
    },
    {
      id: 'contact-form',
      name: 'Formulario de Contacto',
      description: 'Formulario completo con campos para nombre, email, teléfono y mensaje',
      tags: ['Contacto', 'Formulario', 'Lead Generation'],
      background: 'linear-gradient(135deg, #fef3c7 0%, #fde68a 100%)',
      preview: '📧',
      isReactComponent: true,
      elements: [
        {
          type: 'contact-form',
          props: {
            title: 'Contáctanos',
            subtitle: '¿Tienes alguna pregunta? ¡Escríbenos!',
            fields: [
              { type: 'text', name: 'nombre', label: 'Nombre completo', required: true, placeholder: 'Tu nombre completo' },
              { type: 'email', name: 'email', label: 'Correo electrónico', required: true, placeholder: 'tu@email.com' },
              { type: 'tel', name: 'telefono', label: 'Teléfono', required: false, placeholder: '+52 (55) 1234-5678' },
              { type: 'textarea', name: 'mensaje', label: 'Mensaje', required: true, placeholder: 'Cuéntanos en qué podemos ayudarte...', rows: 4 }
            ],
            submitText: 'Enviar mensaje',
            successMessage: '¡Gracias! Tu mensaje ha sido enviado correctamente.',
            errorMessage: 'Hubo un error al enviar el mensaje. Por favor, intenta de nuevo.'
          },
          styles: {
            width: '100%',
            maxWidth: '600px',
            margin: '0 auto',
            padding: '40px 20px'
          }
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
          name: 'Botón Secciones', 
          description: 'Navega entre secciones del sitio', 
          props: { text: 'Ir a Sección', variant: 'primary', linkToSection: null },
          styles: { padding: '12px 24px', fontSize: '16px', background: 'linear-gradient(135deg, #8b5cf6, #7c3aed)' }
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
      ],
      'contact-form': [
        { 
          type: 'contact-form', 
          name: 'Formulario de Contacto', 
          description: 'Formulario completo con validación',
          props: { 
            title: 'Contáctanos',
            subtitle: '¿Tienes alguna pregunta? ¡Escríbenos!',
            fields: [
              { type: 'text', name: 'nombre', label: 'Nombre completo', required: true, placeholder: 'Tu nombre completo' },
              { type: 'email', name: 'email', label: 'Correo electrónico', required: true, placeholder: 'tu@email.com' },
              { type: 'tel', name: 'telefono', label: 'Teléfono', required: false, placeholder: '+52 (55) 1234-5678' },
              { type: 'textarea', name: 'mensaje', label: 'Mensaje', required: true, placeholder: 'Cuéntanos en qué podemos ayudarte...', rows: 4 }
            ],
            submitText: 'Enviar mensaje',
            successMessage: '¡Gracias! Tu mensaje ha sido enviado correctamente.',
            errorMessage: 'Hubo un error al enviar el mensaje. Por favor, intenta de nuevo.'
          },
          styles: { 
            background: 'linear-gradient(135deg, #ffffff 0%, #f8fafc 100%)',
            border: '1px solid #e5e7eb',
            borderRadius: '20px',
            padding: '48px 32px',
            boxShadow: '0 10px 25px rgba(0, 0, 0, 0.1), 0 4px 6px rgba(0, 0, 0, 0.05)'
          }
        }
      ],
      'newsletter-form': [
        { 
          type: 'newsletter-form', 
          name: 'Newsletter', 
          description: 'Suscripción a boletín',
          props: { 
            title: 'Suscríbete a nuestro boletín',
            subtitle: 'Recibe las últimas noticias y ofertas',
            placeholder: 'tu@email.com',
            submitText: 'Suscribirse',
            successMessage: '¡Gracias por suscribirte!',
            errorMessage: 'Error al suscribirse. Intenta de nuevo.'
          },
          styles: { 
            background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
            color: '#ffffff',
            borderRadius: '24px',
            padding: '40px 28px',
            textAlign: 'center',
            boxShadow: '0 20px 40px rgba(102, 126, 234, 0.3)'
          }
        }
      ],
      'search-form': [
        { 
          type: 'search-form', 
          name: 'Búsqueda', 
          description: 'Campo de búsqueda',
          props: { 
            placeholder: 'Buscar...',
            submitText: 'Buscar',
            buttonIcon: '🔍'
          },
          styles: { 
            background: 'linear-gradient(135deg, #ffffff 0%, #f8fafc 100%)',
            border: '2px solid #e5e7eb',
            borderRadius: '28px',
            padding: '12px 20px',
            boxShadow: '0 8px 25px rgba(0, 0, 0, 0.08), 0 2px 8px rgba(0, 0, 0, 0.04)'
          }
        }
      ]
    };
    return elements[categoryId] || [];
  };

  // Función para obtener el tamaño por defecto según el tipo de elemento
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
      case 'header':
        return { width: '100%', height: '80px' };
      case 'container':
      case 'section':
        return { width: '400px', height: '300px' };
      case 'catalog-section':
        return { width: '800px', height: '500px' };
      case 'carousel':
        return { width: '800px', height: '400px' };
      case 'grid':
      case 'columns':
        return { width: '500px', height: '300px' };
      case 'card':
        return { width: '300px', height: '250px' };
      case 'modernCard':
        return { width: '350px', height: '450px' };
      case 'cardsCarousel':
        return { width: '100%', height: '500px' };
      case 'rectangle':
        return { width: '200px', height: '120px' };
      case 'circle':
        return { width: '120px', height: '120px' };
      case 'triangle':
        return { width: '120px', height: '100px' };
      case 'contact-form':
        return { width: '600px', height: '500px' };
      case 'newsletter-form':
        return { width: '500px', height: '200px' };
      case 'search-form':
        return { width: '400px', height: '60px' };
      default:
        return { width: '200px', height: '100px' };
    }
  };

  const handleDragStart = (e, elementData) => {
    if (elementData.elements || elementData.isReactComponent) {
      // Es una sección predefinida (incluyendo componentes React)
      e.dataTransfer.setData('section', JSON.stringify(elementData));
    } else {
      // Es un elemento individual
      e.dataTransfer.setData('element', JSON.stringify(elementData));
    }
  };

  const handleElementClick = (elementData) => {
    // Prevenir múltiples ejecuciones usando un flag global
    if (window._elementProcessing) {
      return;
    }
    
    try {
      window._elementProcessing = true;
      
      // Manejar secciones predefinidas con componentes React
      if (elementData.isReactComponent && elementData.elements) {
        const sectionElement = elementData.elements[0];
        const baseX = Math.random() * 200 + 100;
        const baseY = Math.random() * 200 + 100;
        const defaultSize = getDefaultSize(sectionElement.type);
        
        addElement(
          sectionElement.type,
          sectionElement.props || {},
          sectionElement.children || [],
          sectionElement.styles || {},
          { x: baseX, y: baseY },
          defaultSize
        );
        return;
      }

      // Añadir elemento directamente al canvas
      const baseX = Math.random() * 200 + 100;
      const baseY = Math.random() * 200 + 100;
      
      const defaultSize = getDefaultSize(elementData.type);
      
      // Configuración especial para headers
      if (elementData.type === 'header') {
        const headerProps = {
          ...elementData.props
        };
        
        const headerStyles = {
          width: '100%',
          height: '80px',
          background: '#ffffff',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'space-between',
          padding: '0 40px',
          boxSizing: 'border-box',
          border: '1px solid #e5e7eb',
          ...elementData.styles
        };
        
        const headerChildren = [
          {
            id: `logo-${Date.now()}`,
            type: 'text',
            props: { content: 'Logo' },
            styles: { fontSize: '24px', fontWeight: '700', color: '#22223b' },
            position: { x: 0, y: 0 },
            size: { width: 'auto', height: 'auto' }
          },
          {
            id: `nav-${Date.now()}`,
            type: 'button',
            props: { text: 'Inicio', linkToSection: null },
            styles: { background: '#3b82f6', color: '#fff', fontWeight: '600', borderRadius: '8px', padding: '10px 24px' },
            position: { x: 0, y: 0 },
            size: { width: 'auto', height: '40px' }
          }
        ];
        
        addElement(
          elementData.type,
          headerProps,
          headerChildren,
          headerStyles,
          { x: 0, y: 0 },
          defaultSize
        );
      } else {
        addElement(
          elementData.type,
          elementData.props || {},
          elementData.children || [],
          elementData.styles || {},
          { x: baseX, y: baseY },
          defaultSize
        );
      }
    } catch (error) {
      console.error('Error en handleElementClick:', error);
    } finally {
      // Resetear el flag después de un tiempo para permitir futuros clicks
      setTimeout(() => {
        window._elementProcessing = false;
      }, 500);
    }
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
                  $active={activeCategory === item.id}
                  onClick={() => setActiveCategory(item.id)}
                >
                  <CategoryIcon $active={activeCategory === item.id}>
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
              onClick={(e) => {
                e.preventDefault();
                e.stopPropagation();
                e.stopImmediatePropagation();
                if (!window._elementProcessing) {
                  handleElementClick(element);
                }
              }}
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

  const renderPagesTab = () => (
    <SectionManager />
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
            $active={activeTab === tab.id}
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
      {!submenusCollapsed && activeTab === 'elements' && renderElementsTab()}
      {!submenusCollapsed && activeTab === 'sections' && renderSectionsTab()}
      {!submenusCollapsed && activeTab === 'pages' && renderPagesTab()}
      {!submenusCollapsed && activeTab === 'templates' && renderTemplatesTab()}
    </SidebarContainer>
  );
};

export default Sidebar; 