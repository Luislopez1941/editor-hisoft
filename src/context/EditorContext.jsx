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
  snapLines: { vertical: [], horizontal: [] }, // Líneas de snap activadas
  canvasBackground: '#f8fafc', // Color de fondo del canvas
  
  // Metadatos del proyecto actual
  projectMetadata: {
    id: null,
    name: '',
    description: '',
    empresa: '',
    sucursal: '',
    id_sucursal: null,
    isServerPage: false,
    page_id: null
  }
};

const editorReducer = (state, action) => {
  // Función de utilidad para asegurar que una sección tenga la estructura correcta
  const ensureSectionStructure = (section) => {
    if (!section) return null;
    return {
      id: section.id || `section-${Date.now()}`,
      name: section.name || 'Sin nombre',
      slug: section.slug || section.name?.toLowerCase().replace(/\s+/g, '-') || 'sin-nombre',
      elements: Array.isArray(section.elements) ? section.elements : [],
      isHome: section.isHome || false,
      ...section
    };
  };

  // Función para asegurar que la sección activa existe y tenga la estructura correcta
  const ensureActiveSection = (state) => {
    if (!state.sections[state.activeSectionId]) {
      // Si no hay sección activa, usar 'home' como fallback
      if (state.sections.home) {
        return {
          ...state,
          activeSectionId: 'home'
        };
      }
      
      // Si no hay 'home', crear una sección home por defecto
      const homeSection = {
        id: 'home',
        name: 'Inicio',
        slug: 'home',
        elements: [],
        isHome: true
      };
      
      return {
        ...state,
        sections: {
          ...state.sections,
          home: homeSection
        },
        activeSectionId: 'home'
      };
    }
    
    // Asegurar que la sección activa tenga la estructura correcta
    const activeSection = ensureSectionStructure(state.sections[state.activeSectionId]);
    if (activeSection && activeSection !== state.sections[state.activeSectionId]) {
      return {
        ...state,
        sections: {
          ...state.sections,
          [state.activeSectionId]: activeSection
        }
      };
    }
    
    return state;
  };

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
      // Verificar que la sección activa existe
      if (!state.sections[state.activeSectionId]) {
        return state;
      }
      
      // Asegurar que la sección tenga un array de elementos
      if (!Array.isArray(state.sections[state.activeSectionId].elements)) {
        return {
          ...state,
          sections: {
            ...state.sections,
            [state.activeSectionId]: {
              ...state.sections[state.activeSectionId],
              elements: []
            }
          }
        };
      }
      
      const newElement = {
        id: `element-${Date.now()}-${Math.random().toString(36).substr(2, 9)}`,
        type: action.payload.type,
        props: action.payload.props || {},
        children: action.payload.children || [],
        position: action.payload.position || { x: 0, y: 0 },
        size: action.payload.size || { width: 'auto', height: 'auto' },
        styles: action.payload.styles || {},
      };
      
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
      // Verificar que la sección activa existe
      if (!state.sections[state.activeSectionId]) {
        return state;
      }
      
      // Asegurar que la sección tenga un array de elementos
      if (!Array.isArray(state.sections[state.activeSectionId].elements)) {
        return {
          ...state,
          sections: {
            ...state.sections,
            [state.activeSectionId]: {
              ...state.sections[state.activeSectionId],
              elements: []
            }
          }
        };
      }
      
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
      // Verificar que la sección activa existe
      if (!state.sections[state.activeSectionId]) {
        return state;
      }
      
      // Asegurar que la sección tenga un array de elementos
      if (!Array.isArray(state.sections[state.activeSectionId].elements)) {
        return {
          ...state,
          sections: {
            ...state.sections,
            [state.activeSectionId]: {
              ...state.sections[state.activeSectionId],
              elements: []
            }
          }
        };
      }
      
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
      // Verificar que la sección activa existe
      if (!state.sections[state.activeSectionId]) {
        return state;
      }
      
      // Asegurar que la sección tenga un array de elementos
      if (!Array.isArray(state.sections[state.activeSectionId].elements)) {
        return {
          ...state,
          sections: {
            ...state.sections,
            [state.activeSectionId]: {
              ...state.sections[state.activeSectionId],
              elements: []
            }
          }
        };
      }
      
      // Función recursiva para mover elementos
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
      // Verificar que la sección activa existe
      if (!state.sections[state.activeSectionId]) {
        return state;
      }
      
      // Asegurar que la sección tenga un array de elementos
      if (!Array.isArray(state.sections[state.activeSectionId].elements)) {
        return {
          ...state,
          sections: {
            ...state.sections,
            [state.activeSectionId]: {
              ...state.sections[state.activeSectionId],
              elements: []
            }
          }
        };
      }
      
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
        history: [...state.history.slice(0, state.historyIndex + 1), state],
        historyIndex: state.historyIndex + 1,
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

    case 'LOAD_PROJECT': {
      console.log('🔄 EditorContext reducer LOAD_PROJECT: Procesando acción:', action);
      const { sections, name, description, html_compilado, empresa, sucursal, id_sucursal, isServerPage, page_id } = action.payload;
      
      console.log('🔄 EditorContext reducer LOAD_PROJECT: Datos extraídos:', { sections: Object.keys(sections), name, description, empresa, sucursal, id_sucursal });
      
      // Asegurar que sections sea válido
      let validSections = sections;
      if (!sections || Object.keys(sections).length === 0) {
        console.log('🔄 EditorContext reducer LOAD_PROJECT: No hay secciones, creando sección por defecto');
        validSections = {
          home: {
            id: 'home',
            name: 'Inicio',
            elements: [],
            isHome: true,
            slug: 'home'
          }
        };
      }
      
      // Asegurar que todas las secciones tengan la estructura correcta
      Object.keys(validSections).forEach(sectionKey => {
        if (!validSections[sectionKey].elements) {
          validSections[sectionKey].elements = [];
        }
        if (!validSections[sectionKey].id) {
          validSections[sectionKey].id = sectionKey;
        }
        if (!validSections[sectionKey].name) {
          validSections[sectionKey].name = sectionKey.charAt(0).toUpperCase() + sectionKey.slice(1);
        }
        if (!validSections[sectionKey].slug) {
          validSections[sectionKey].slug = sectionKey;
        }
      });
      
      console.log('🔄 EditorContext reducer LOAD_PROJECT: Secciones validadas:', validSections);
      
      const finalState = {
        ...state,
        sections: validSections,
        activeSectionId: 'home',
        projectMetadata: {
          id: action.payload.id,
          name: name || 'Página sin nombre',
          description: description || '',
          empresa: empresa || '',
          sucursal: sucursal || '',
          id_sucursal: id_sucursal || null,
          isServerPage: isServerPage || false,
          page_id: page_id || null
        }
      };
      
      console.log('✅ EditorContext reducer LOAD_PROJECT: Estado final preparado:', finalState);
      return finalState;
    }

    case 'CLEAR_CANVAS':
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

    case 'SET_SNAP_LINES':
      return {
        ...state,
        snapLines: action.payload,
      };

    case 'SET_CANVAS_BACKGROUND':
      return {
        ...state,
        canvasBackground: action.payload.color,
      };

    case 'INIT_HISTORY':
      return {
        ...state,
        history: [action.payload],
        historyIndex: 0,
      };

    case 'TOGGLE_GUIDES':
      return {
        ...state,
        showGuides: !state.showGuides,
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
    // Crear el elemento directamente sin validaciones complejas
    const newElement = {
      id: `element-${Date.now()}-${Math.random().toString(36).substr(2, 9)}`,
      type,
      props: props || {},
      children: children || [],
      position: position || { x: 0, y: 0 },
      size: size || { width: 'auto', height: 'auto' },
      styles: styles || {},
    };
    
    dispatch({
      type: 'ADD_ELEMENT',
      payload: { type, props, children, styles, position, size },
    });
  };

  const updateElement = (id, updates) => {
    dispatch({
      type: 'UPDATE_ELEMENT',
      payload: { id, updates },
    });
  };

  const deleteElement = (id) => {
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
    dispatch({ type: 'UNDO' });
  };

  const redo = () => {
    dispatch({ type: 'REDO' });
  };

  const loadTemplate = (template) => {
    // Normalizar la estructura antes de cargarla
    const normalized = normalizeElements(template.elements || []);
    dispatch({
      type: 'LOAD_TEMPLATE',
      payload: { elements: normalized },
    });
  };

  const loadProject = (project) => {
    console.log('🔄 EditorContext loadProject: Iniciando carga del proyecto:', project);
    
    if (project && project.sections) {
      console.log('🔄 EditorContext loadProject: Proyecto válido con secciones:', Object.keys(project.sections));
      
      // Asegurar que las secciones tengan la estructura correcta
      const validSections = {};
      Object.keys(project.sections).forEach(sectionKey => {
        const section = project.sections[sectionKey];
        validSections[sectionKey] = {
          id: section.id || sectionKey,
          name: section.name || sectionKey.charAt(0).toUpperCase() + sectionKey.slice(1),
          slug: section.slug || sectionKey,
          elements: Array.isArray(section.elements) ? section.elements : [],
          isHome: section.isHome || sectionKey === 'home'
        };
        console.log(`🔄 EditorContext loadProject: Sección "${sectionKey}" procesada:`, validSections[sectionKey]);
      });
      
      // Si no hay secciones, crear una por defecto
      if (Object.keys(validSections).length === 0) {
        console.log('🔄 EditorContext loadProject: No hay secciones, creando sección por defecto');
        validSections.home = {
          id: 'home',
          name: 'Inicio',
          slug: 'home',
          elements: [],
          isHome: true
        };
      }
      
      console.log('🔄 EditorContext loadProject: Secciones finales preparadas:', validSections);
      console.log('🔄 EditorContext loadProject: Despachando acción LOAD_PROJECT');
      
      dispatch({
        type: 'LOAD_PROJECT',
        payload: { 
          sections: validSections,
          ...project // Incluir todos los metadatos del proyecto
        },
      });
      
      console.log('✅ EditorContext loadProject: Proyecto cargado exitosamente');
    } else {
      console.error('❌ EditorContext loadProject: Proyecto inválido o sin secciones:', project);
    }
  };

  const clearCanvas = () => {
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

  // Función para copiar elemento
  const copyElement = (id) => {
    const element = findElementById(elements, id);
    if (element) {
      const elementCopy = JSON.stringify(element);
      localStorage.setItem('copiedElement', elementCopy);
    }
  };

  // Función para pegar elemento
  const pasteElement = () => {
    const copiedElementData = localStorage.getItem('copiedElement');
    if (copiedElementData) {
      try {
        const copiedElement = JSON.parse(copiedElementData);
        
        // Calcular nueva posición evitando superposición pero permitiendo y: 0
        let newY = (copiedElement.position?.y || 0);
        if (newY === 0) {
          // Si la posición original es 0, usar un pequeño offset
          newY = 10;
        } else {
          // Si no es 0, agregar offset para evitar superposición
          newY += 20;
        }
        
        const newElement = {
          ...copiedElement,
          id: `element-${Date.now()}-${Math.random().toString(36).substr(2, 9)}`,
          position: {
            x: (copiedElement.position?.x || 0) + 20,
            y: newY
          }
        };
        
        addElement(
          newElement.type,
          newElement.props || {},
          newElement.children || [],
          newElement.styles || {},
          newElement.position,
          newElement.size || { width: 'auto', height: 'auto' }
        );
      } catch (error) {
        console.error('Error al pegar elemento:', error);
      }
    }
  };

  // Función para duplicar elemento
  const duplicateElement = (id) => {
    const element = findElementById(elements, id);
    if (element) {
      
      // Calcular nueva posición evitando superposición pero permitiendo y: 0
      let newY = (element.position?.y || 0);
      if (newY === 0) {
        // Si la posición original es 0, usar un pequeño offset
        newY = 10;
      } else {
        // Si no es 0, agregar offset para evitar superposición
        newY += 20;
      }
      
      const newElement = {
        ...element,
        id: `element-${Date.now()}-${Math.random().toString(36).substr(2, 9)}`,
        position: {
          x: (element.position?.x || 0) + 20,
          y: newY
        }
      };
      
      addElement(
        newElement.type,
        newElement.props || {},
        newElement.children || [],
        newElement.styles || {},
        newElement.position,
        newElement.size || { width: 'auto', height: 'auto' }
      );
    }
  };



  // Event listener para cargar plantillas desde App.jsx
  useEffect(() => {
    
    const handleLoadTemplate = (event) => {
      const { template } = event.detail;
      loadTemplate(template);
    };

    const handleLoadProject = (event) => {
      console.log('🔄 EditorContext: Evento loadProject recibido:', event);
      const { project } = event.detail;
      console.log('🔄 EditorContext: Proyecto extraído:', project);
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
          case 'c':
            event.preventDefault();
            if (state.selectedElementId) {
              copyElement(state.selectedElementId);
            }
            break;
          case 'v':
            event.preventDefault();
            pasteElement();
            break;
          case 'a':
            event.preventDefault();
            // Seleccionar todos los elementos (no implementado aún)
            break;
          case 'd':
            event.preventDefault();
            if (state.selectedElementId) {
              duplicateElement(state.selectedElementId);
            }
            break;
        }
      } else {
        // Atajos sin Ctrl/Cmd
        switch (event.key) {
          case 'Delete':
          case 'Backspace':
            // Solo borrar elemento si no está en un campo de texto
            if (state.selectedElementId && !event.target.matches('input, textarea, [contenteditable="true"]')) {
              event.preventDefault();
              deleteElement(state.selectedElementId);
            }
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
    copyElement,
    pasteElement,
    duplicateElement,
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
    console.error('🧪 ❌ useEditor debe ser usado dentro de EditorProvider');
    throw new Error('useEditor debe ser usado dentro de EditorProvider');
  }
  
  return context;
}; 