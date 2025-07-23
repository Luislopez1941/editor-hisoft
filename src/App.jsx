import React, { useState } from 'react';
import styled from 'styled-components';

import Dashboard from './components/views/Dashboard/Dashboard';
import WebsiteManager from './components/views/Dashboard/WebsiteManager';
import Sidebar from './components/Sidebar';
import Toolbar from './components/Toolbar';
import Canvas from './components/Canvas';
import PropertyPanel from './components/PropertyPanel';
import { EditorProvider, useEditor } from './context/EditorContext';
import { templates } from './data/templates';
import './App.css';
import './components/views/Dashboard/Dashboard.css';
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
`;

const MainContent = styled.div`
  display: flex;
  flex: 1;
  flex-direction: column;
`;

const CanvasContainer = styled.div`
  flex: 1;
  display: flex;
  background: #ffffff;
  position: relative;
`;

// Componente interno del editor que tiene acceso al contexto
const EditorView = ({ selectedElement, setSelectedElement, isPreviewMode, setIsPreviewMode, onBackToDashboard }) => {
  return (
    <AppContainer>
      <Sidebar />
      <MainContent>
        <Toolbar 
          isPreviewMode={isPreviewMode}
          setIsPreviewMode={setIsPreviewMode}
          onBackToDashboard={onBackToDashboard}
        />
        <CanvasContainer>
          <Canvas 
            isPreviewMode={isPreviewMode}
            selectedElement={selectedElement}
            setSelectedElement={setSelectedElement}
          />
          {!isPreviewMode && (
            <PropertyPanel 
              selectedElement={selectedElement}
              setSelectedElement={setSelectedElement}
            />
          )}
        </CanvasContainer>
      </MainContent>
    </AppContainer>
  );
};

function App() {
  const [selectedElement, setSelectedElement] = useState(null);
  const [isPreviewMode, setIsPreviewMode] = useState(false);
  const [currentView, setCurrentView] = useState('dashboard'); // 'dashboard', 'website-manager', 'editor'

  const handleSwitchToWebsiteManager = (type, template) => {
    if (type === 'edit') {
      // Ir directamente al editor para editar
      setCurrentView('editor');
    } else if (type === 'website') {
      // Mostrar WebsiteManager para elegir plantilla o empezar desde cero
      setCurrentView('website-manager');
    } else {
      // Ir al editor con plantilla o vacío
      setCurrentView('editor');
      
      // Si se seleccionó una plantilla, cargarla
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

  const handleBackToWebsiteManager = () => {
    setCurrentView('website-manager');
  };

  const loadTemplate = (template) => {
    // Esta función se ejecutará después de que el EditorProvider esté montado
    // Usaremos un evento personalizado para comunicarnos con el contexto
    const event = new CustomEvent('loadTemplate', { 
      detail: { template: templates[template.id] } 
    });
    window.dispatchEvent(event);
  };

  // Si estamos en vista dashboard, mostrar solo el dashboard
  if (currentView === 'dashboard') {
    return <Dashboard onSwitchToWebsiteManager={handleSwitchToWebsiteManager} />;
  }

  // Si estamos en vista website-manager, mostrar el gestor de sitios web
  if (currentView === 'website-manager') {
    return (
      <WebsiteManager 
        onBack={handleBackToDashboard}
        onSwitchToEditor={handleSwitchToEditor}
      />
    );
  }

  // Vista del editor (código original)
  return (
    <EditorProvider>
      <EditorView 
        selectedElement={selectedElement}
        setSelectedElement={setSelectedElement}
        isPreviewMode={isPreviewMode}
        setIsPreviewMode={setIsPreviewMode}
        onBackToDashboard={handleBackToDashboard}
      />
    </EditorProvider>
  );
}

export default App; 