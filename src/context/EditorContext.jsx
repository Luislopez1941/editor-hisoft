import React, { createContext, useContext, useReducer, useEffect } from 'react';

const EditorContext = createContext();

const initialState = {
  // Secciones del sitio web
  sections: {
    'home': {
      id: 'home',
      name: 'Inicio',
      slug: 'home',
      elements: [],
      isHome: true
    }
  },
  activeSectionId: 'home',
  selectedElementId: null,
  canvasWidth: 1450,
  canvasHeight: 3000,
  zoom: 100,
  history: [],
  historyIndex: -1,
  showGuides: true,
  snapLines: { vertical: [], horizontal: [] }, // Líneas de snap activas
  canvasBackground: '#f8fafc', // Color de fondo del canvas
};

const editorReducer = (state, action) => {
  switch (action.type) {
    case 'CREATE_SECTION':
      const newSection = {
        id: action.payload.id || `section-${Date.now()}`,
        name: action.payload.name,
        slug: action.payload.slug || action.payload.name.toLowerCase().replace(/\s+/g, '-'),
        elements: [],
        isHome: false
      };
      return {
        ...state,
        sections: {
          ...state.sections,
          [newSection.id]: newSection
        },
        activeSectionId: newSection.id,
        history: [...state.history.slice(0, state.historyIndex + 1), state],
        historyIndex: state.historyIndex + 1,
      };

    case 'DELETE_SECTION':
      if (action.payload.id === 'home') {
        console.warn('Cannot delete home section');
        return state;
      }
      const { [action.payload.id]: deleted, ...remainingSections } = state.sections;
      const newActiveSectionId = state.activeSectionId === action.payload.id ? 'home' : state.activeSectionId;
      return {
        ...state,
        sections: remainingSections,
        activeSectionId: newActiveSectionId,
        history: [...state.history.slice(0, state.historyIndex + 1), state],
        historyIndex: state.historyIndex + 1,
      };

    case 'UPDATE_SECTION':
      return {
        ...state,
        sections: {
          ...state.sections,
          [action.payload.id]: {
            ...state.sections[action.payload.id],
            ...action.payload.updates
          }
        },
        history: [...state.history.slice(0, state.historyIndex + 1), state],
        historyIndex: state.historyIndex + 1,
      };

    case 'SET_ACTIVE_SECTION':
      return {
        ...state,
        activeSectionId: action.payload.id,
        selectedElementId: null, // Clear selection when changing sections
      };

    case 'ADD_ELEMENT':
      const newElement = {
        id: `element-${Date.now()}-${Math.random().toString(36).substr(2, 9)}`,
        type: action.payload.type,
        props: action.payload.props || {},
        children: action.payload.children || [],
        position: action.payload.position || { x: 0, y: 0 },
        size: action.payload.size || { width: 'auto', height: 'auto' },
        styles: action.payload.styles || {},
      };
      
      console.log('Agregando nuevo elemento:', newElement);
      
      return {
        ...state,
        sections: {
          ...state.sections,
          [state.activeSectionId]: {
            ...state.sections[state.activeSectionId],
            elements: [...state.sections[state.activeSectionId].elements, newElement]
          }
        },
        selectedElementId: newElement.id,
        history: [...state.history.slice(0, state.historyIndex + 1), state],
        historyIndex: state.historyIndex + 1,
      };

    case 'UPDATE_ELEMENT':
      // Permitir reordenar todo el array de elementos
      if (action.payload.id === '__REORDER__' && action.payload.updates.elements) {
        return {
          ...state,
          sections: {
            ...state.sections,
            [state.activeSectionId]: {
              ...state.sections[state.activeSectionId],
              elements: action.payload.updates.elements
            }
          },
          history: [...state.history.slice(0, state.historyIndex + 1), state],
          historyIndex: state.historyIndex + 1,
        };
      }
      
      // Actualizar elemento específico (incluye elementos anidados)
      const updateElementRecursive = (elements, id, updates) => {
        return elements.map(element => {
          if (element.id === id) {
            return { ...element, ...updates };
          }
          if (element.children && element.children.length > 0) {
            return {
              ...element,
              children: updateElementRecursive(element.children, id, updates)
            };
          }
          return element;
        });
      };
      
      return {
        ...state,
        sections: {
          ...state.sections,
          [state.activeSectionId]: {
            ...state.sections[state.activeSectionId],
            elements: updateElementRecursive(state.sections[state.activeSectionId].elements, action.payload.id, action.payload.updates)
          }
        },
        history: [...state.history.slice(0, state.historyIndex + 1), state],
        historyIndex: state.historyIndex + 1,
      };

    case 'DELETE_ELEMENT':
      // Función recursiva para eliminar elementos (incluye elementos anidados)
      const deleteElementRecursive = (elements, id) => {
        return elements.filter(element => {
          if (element.id === id) {
            return false; // Eliminar este elemento
          }
          if (element.children && element.children.length > 0) {
            element.children = deleteElementRecursive(element.children, id);
          }
          return true;
        });
      };
      
      console.log('Eliminando elemento:', action.payload.id);
      
      return {
        ...state,
        sections: {
          ...state.sections,
          [state.activeSectionId]: {
            ...state.sections[state.activeSectionId],
            elements: deleteElementRecursive(state.sections[state.activeSectionId].elements, action.payload.id)
          }
        },
        selectedElementId: state.selectedElementId === action.payload.id ? null : state.selectedElementId,
        history: [...state.history.slice(0, state.historyIndex + 1), state],
        historyIndex: state.historyIndex + 1,
      };

    case 'SELECT_ELEMENT':
      return {
        ...state,
        selectedElementId: action.payload.id,
      };

    case 'MOVE_ELEMENT':
      // Función recursiva para mover elementos (incluye elementos anidados)
      const moveElementRecursive = (elements, id, positionData) => {
        return elements.map(element => {
          if (element.id === id) {
            return {
              ...element,
              position: {
                ...element.position,
                ...positionData.position
              },
              size: {
                ...element.size,
                ...(positionData.width && { width: positionData.width }),
                ...(positionData.height && { height: positionData.height })
              }
            };
          }
          if (element.children && element.children.length > 0) {
            return {
              ...element,
              children: moveElementRecursive(element.children, id, positionData)
            };
          }
          return element;
        });
      };
      
      return {
        ...state,
        sections: {
          ...state.sections,
          [state.activeSectionId]: {
            ...state.sections[state.activeSectionId],
            elements: moveElementRecursive(state.sections[state.activeSectionId].elements, action.payload.id, action.payload)
          }
        },
        history: [...state.history.slice(0, state.historyIndex + 1), state],
        historyIndex: state.historyIndex + 1,
      };

    case 'RESIZE_ELEMENT':
      // Función recursiva para redimensionar elementos
      const resizeElementRecursive = (elements, id, size) => {
        return elements.map(element => {
          if (element.id === id) {
            return { ...element, size: { ...element.size, ...size } };
          }
          if (element.children && element.children.length > 0) {
            return {
              ...element,
              children: resizeElementRecursive(element.children, id, size)
            };
          }
          return element;
        });
      };
      
      return {
        ...state,
        sections: {
          ...state.sections,
          [state.activeSectionId]: {
            ...state.sections[state.activeSectionId],
            elements: resizeElementRecursive(state.sections[state.activeSectionId].elements, action.payload.id, action.payload.size)
          }
        },
      };

    case 'SET_ZOOM':
      return {
        ...state,
        zoom: Math.max(25, Math.min(200, action.payload.zoom)),
      };

    case 'UNDO':
      if (state.historyIndex > 0) {
        return {
          ...state.history[state.historyIndex - 1],
          history: state.history,
          historyIndex: state.historyIndex - 1,
        };
      }
      return state;

    case 'REDO':
      if (state.historyIndex < state.history.length - 1) {
        return {
          ...state.history[state.historyIndex + 1],
          history: state.history,
          historyIndex: state.historyIndex + 1,
        };
      }
      return state;

    case 'LOAD_TEMPLATE':
      console.log('Cargando plantilla con elementos:', action.payload.elements);
      return {
        ...state,
        sections: {
          ...state.sections,
          [state.activeSectionId]: {
            ...state.sections[state.activeSectionId],
            elements: action.payload.elements
          }
        },
        selectedElementId: null,
        history: [...state.history.slice(0, state.historyIndex + 1), state],
        historyIndex: state.historyIndex + 1,
      };

    case 'LOAD_PROJECT':
      console.log('Cargando proyecto completo:', action.payload.sections);
      return {
        ...state,
        sections: action.payload.sections,
        activeSectionId: Object.keys(action.payload.sections)[0] || 'home',
        selectedElementId: null,
        history: [...state.history.slice(0, state.historyIndex + 1), state],
        historyIndex: state.historyIndex + 1,
      };

    case 'CLEAR_CANVAS':
      console.log('Limpiando canvas - eliminando todos los elementos');
      return {
        ...state,
        sections: {
          ...state.sections,
          [state.activeSectionId]: {
            ...state.sections[state.activeSectionId],
            elements: []
          }
        },
        selectedElementId: null,
        history: [...state.history.slice(0, state.historyIndex + 1), state],
        historyIndex: state.historyIndex + 1,
      };

    case 'SET_CANVAS_SIZE':
      return {
        ...state,
        canvasWidth: action.payload.width,
        canvasHeight: action.payload.height,
      };

    case 'TOGGLE_GUIDES':
      return {
        ...state,
        showGuides: !state.showGuides,
      };

    case 'SET_SNAP_LINES':
      return {
        ...state,
        snapLines: action.payload,
      };

    case 'SET_CANVAS_BACKGROUND':
      return {
        ...state,
        canvasBackground: action.payload,
      };

    default:
      return state;
  }
};

function generateId(prefix = 'element') {
  return `${prefix}-${Date.now()}-${Math.random().toString(36).substr(2, 9)}`;
}

function normalizeElements(elements) {
  return elements.map(el => {
    const id = el.id || generateId();
    let children = [];
    if (el.children && Array.isArray(el.children)) {
      children = normalizeElements(el.children);
    }
    
    // Asegurar estructura básica
    const normalizedElement = {
      ...el,
      id,
      children,
      position: el.position || { x: 0, y: 0 },
      size: el.size || { width: 'auto', height: 'auto' },
      styles: el.styles || {},
      props: el.props || {},
    };
    
    console.log('Elemento normalizado:', normalizedElement);
    return normalizedElement;
  });
}

export const EditorProvider = ({ children }) => {
  const [state, dispatch] = useReducer(editorReducer, initialState);

  // Sección functions
  const createSection = (name, slug) => {
    dispatch({
      type: 'CREATE_SECTION',
      payload: { name, slug },
    });
  };

  const deleteSection = (id) => {
    dispatch({
      type: 'DELETE_SECTION',
      payload: { id },
    });
  };

  const updateSection = (id, updates) => {
    dispatch({
      type: 'UPDATE_SECTION',
      payload: { id, updates },
    });
  };

  const setActiveSection = (id) => {
    dispatch({
      type: 'SET_ACTIVE_SECTION',
      payload: { id },
    });
  };

  // Computed values
  const currentSection = state.sections[state.activeSectionId];
  const elements = currentSection ? currentSection.elements : [];

  const addElement = (type, props = {}, children = [], styles = {}, position, size) => {
    console.log('Agregando elemento:', { type, props, children, styles, position, size });
    dispatch({
      type: 'ADD_ELEMENT',
      payload: { type, props, children, styles, position, size },
    });
  };

  const updateElement = (id, updates) => {
    console.log('Actualizando elemento:', id, updates);
    dispatch({
      type: 'UPDATE_ELEMENT',
      payload: { id, updates },
    });
  };

  const deleteElement = (id) => {
    console.log('Eliminando elemento:', id);
    dispatch({
      type: 'DELETE_ELEMENT',
      payload: { id },
    });
  };

  // Función recursiva para encontrar un elemento por ID en cualquier nivel de anidación
  const findElementById = (elements, id) => {
    for (const element of elements) {
      if (element.id === id) {
        return element;
      }
      if (element.children && element.children.length > 0) {
        const found = findElementById(element.children, id);
        if (found) return found;
      }
    }
    return null;
  };

  const selectElement = (id) => {
    console.log('Seleccionando elemento:', id);
    dispatch({
      type: 'SELECT_ELEMENT',
      payload: { id },
    });
  };

  const moveElement = (id, positionOrSize) => {
    dispatch({
      type: 'MOVE_ELEMENT',
      payload: { id, ...positionOrSize },
    });
  };

  const resizeElement = (id, size) => {
    dispatch({
      type: 'RESIZE_ELEMENT',
      payload: { id, size },
    });
  };

  const setZoom = (zoom) => {
    dispatch({
      type: 'SET_ZOOM',
      payload: { zoom },
    });
  };

  const undo = () => {
    console.log('Deshaciendo acción');
    dispatch({ type: 'UNDO' });
  };

  const redo = () => {
    console.log('Rehaciendo acción');
    dispatch({ type: 'REDO' });
  };

  const loadTemplate = (template) => {
    console.log('Cargando plantilla:', template);
    // Normalizar la estructura antes de cargarla
    const normalized = normalizeElements(template.elements || []);
    dispatch({
      type: 'LOAD_TEMPLATE',
      payload: { elements: normalized },
    });
  };

  const loadProject = (project) => {
    console.log('Cargando proyecto:', project);
    if (project.sections) {
      dispatch({
        type: 'LOAD_PROJECT',
        payload: { sections: project.sections },
      });
    }
  };

  const clearCanvas = () => {
    console.log('Limpiando canvas');
    dispatch({ type: 'CLEAR_CANVAS' });
  };

  const setCanvasSize = (width, height) => {
    dispatch({
      type: 'SET_CANVAS_SIZE',
      payload: { width, height },
    });
  };

  const toggleGuides = () => {
    dispatch({ type: 'TOGGLE_GUIDES' });
  };

  const setSnapLines = (snapLines) => {
    dispatch({ type: 'SET_SNAP_LINES', payload: snapLines });
  };

  const setCanvasBackground = (color) => {
    dispatch({ type: 'SET_CANVAS_BACKGROUND', payload: color });
  };

  // Event listener para cargar plantillas desde App.jsx
  useEffect(() => {
    const handleLoadTemplate = (event) => {
      const { template } = event.detail;
      console.log('Evento de carga de plantilla recibido:', template);
      loadTemplate(template);
    };

    const handleLoadProject = (event) => {
      const { project } = event.detail;
      console.log('Evento de carga de proyecto recibido:', project);
      loadProject(project);
    };

    const handleKeyboardShortcuts = (event) => {
      if (event.ctrlKey || event.metaKey) {
        switch (event.key) {
          case 'z':
            if (event.shiftKey) {
              event.preventDefault();
              redo();
            } else {
              event.preventDefault();
              undo();
            }
            break;
          case 'a':
            event.preventDefault();
            // Seleccionar todos los elementos (no implementado aún)
            break;
          case 'd':
            event.preventDefault();
            // Duplicar elemento seleccionado (no implementado aún)
            break;
        }
      }
    };

    window.addEventListener('loadTemplate', handleLoadTemplate);
    window.addEventListener('loadProject', handleLoadProject);
    document.addEventListener('keydown', handleKeyboardShortcuts);
    
    return () => {
      window.removeEventListener('loadTemplate', handleLoadTemplate);
      window.removeEventListener('loadProject', handleLoadProject);
      document.removeEventListener('keydown', handleKeyboardShortcuts);
    };
  }, []);

  // Código del header automático eliminado completamente

  const value = {
    ...state,
    elements, // Current section elements
    currentSection,
    createSection,
    deleteSection,
    updateSection,
    setActiveSection,
    addElement,
    updateElement,
    deleteElement,
    findElementById,
    selectElement,
    moveElement,
    resizeElement,
    setZoom,
    undo,
    redo,
    loadTemplate,
    loadProject,
    clearCanvas,
    setCanvasSize,
    toggleGuides,
    setSnapLines,
    setCanvasBackground,
  };

  return (
    <EditorContext.Provider value={value}>
      {children}
    </EditorContext.Provider>
  );
};

export const useEditor = () => {
  const context = useContext(EditorContext);
  if (!context) {
    throw new Error('useEditor must be used within an EditorProvider');
  }
  return context;
}; 