import React, { useState } from 'react';
import styled from 'styled-components';

import Dashboard from '../../../components/views/Dashboard/Dashboard';
import Sidebar from '../../../components/Sidebar';
import Toolbar from '../../../components/Toolbar';
import Canvas from '../../../components/Canvas';
import PropertyPanel from '../../../components/PropertyPanel';
import { useEditor } from '../../../context/EditorContext';
import { templates } from '../../../data/templates';
import '../../../App.css';
import '../../../components/views/Dashboard/Dashboard.css';
import { 
  Settings, 
  Home, 
  CreditCard, 
  DollarSign, 
  Package, 
  Puzzle, 
  Smartphone, 
  Inbox, 
  Users, 
  Megaphone,
  ChevronDown,
  ChevronRight,
  Search,
  Bell,
  HelpCircle,
  User
} from 'lucide-react';

const AppContainer = styled.div`
  display: flex;
  height: 100vh;
  background: #f5f5f5;
  font-family: 'Inter', -apple-system, BlinkMacSystemFont, sans-serif;
  overflow: hidden;
`;

const MainContent = styled.div`
  display: flex;
  flex: 1;
  flex-direction: column;
  min-height: 0;
  overflow: hidden;
`;

const CanvasContainer = styled.div`
  flex: 1;
  display: flex;
  background: #ffffff;
  position: relative;
  min-height: 0;
  overflow: hidden;
`;

// Componente interno del editor que tiene acceso al contexto
const EditorView = ({ selectedElement, setSelectedElement, isPreviewMode, setIsPreviewMode, onBackToDashboard }) => {
  return (
    <AppContainer style={{ flexDirection: 'column' }}>
      <Toolbar 
        isPreviewMode={isPreviewMode}
        setIsPreviewMode={setIsPreviewMode}
        onBackToDashboard={onBackToDashboard}
      />
      <div style={{ display: 'flex', flex: 1, minHeight: 0, overflow: 'hidden' }}>
        <Sidebar />
        <MainContent>
          <CanvasContainer>
            <Canvas 
              isPreviewMode={isPreviewMode}
              selectedElement={selectedElement}
              setSelectedElement={setSelectedElement}
            />
            <PropertyPanel 
              isPreviewMode={isPreviewMode}
            />
          </CanvasContainer>
        </MainContent>
      </div>
    </AppContainer>
  );
};

const RootPage = () => {
  const [selectedElement, setSelectedElement] = useState(null);
  const [isPreviewMode, setIsPreviewMode] = useState(false);
  const [currentView, setCurrentView] = useState('dashboard'); // 'dashboard', 'editor'

  const handleSwitchToWebsiteManager = (type, template) => {
    
    if (type === 'edit') {
      setCurrentView('editor');
    } else if (type === 'load-project') {
      setCurrentView('editor');
      if (template) {
        setTimeout(() => {
          loadProject(template);
        }, 100);
      }
    } else if (type === 'scratch' && template?.name) {
      // Crear nuevo proyecto desde cero con el nombre especificado
      setCurrentView('editor');
      setTimeout(() => {
        createNewProject(template.name);
      }, 100);
    } else {
      setCurrentView('editor');
      if (type === 'template' && template) {
        setTimeout(() => {
          loadTemplate(template);
        }, 100);
      }
    }
  };

  const handleSwitchToEditor = (type, template) => {
    setCurrentView('editor');
    
    // Si se seleccionó una plantilla, necesitamos cargarla después de que el contexto esté disponible
    if (type === 'template' && template) {
      // Guardamos la plantilla para cargarla en el próximo render
      setTimeout(() => {
        loadTemplate(template);
      }, 100);
    }
  };

  const handleBackToDashboard = () => {
    setCurrentView('dashboard');
  };

  const loadTemplate = (template) => {
    // Esta función se ejecutará después de que el EditorProvider esté montado
    // Usaremos un evento personalizado para comunicarnos con el contexto
    const event = new CustomEvent('loadTemplate', { 
      detail: { template: templates[template.id] } 
    });
    window.dispatchEvent(event);
  };

  const loadProject = (project) => {
    // Esta función se ejecutará después de que el EditorProvider esté montado
    // Usaremos un evento personalizado para comunicarnos con el contexto
    const event = new CustomEvent('loadProject', { 
      detail: { project } 
    });
    window.dispatchEvent(event);
  };

  const createNewProject = (projectName) => {
    // Crear un nuevo proyecto vacío con el nombre especificado
    const event = new CustomEvent('createNewProject', { 
      detail: { 
        name: projectName,
        description: 'Nuevo proyecto creado desde cero',
        tags: ['nuevo', 'desde-cero']
      } 
    });
    window.dispatchEvent(event);
  };

  // Return the component without EditorProvider wrapper since it's already in App.jsx
  return (
    <>
      {/* Si estamos en vista dashboard, mostrar solo el dashboard */}
      {currentView === 'dashboard' && (
        <Dashboard onSwitchToWebsiteManager={handleSwitchToWebsiteManager} />
      )}

      {/* Vista del editor */}
      {currentView === 'editor' && (
        <EditorView 
          selectedElement={selectedElement}
          setSelectedElement={setSelectedElement}
          isPreviewMode={isPreviewMode}
          setIsPreviewMode={setIsPreviewMode}
          onBackToDashboard={handleBackToDashboard}
        />
      )}
    </>
  );
}

export default RootPage; 