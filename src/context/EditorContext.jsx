import React, { createContext, useContext, useReducer, useEffect } from 'react';

const EditorContext = createContext();

const initialState = {
  elements: [],
  selectedElementId: null,
  canvasWidth: 1200,
  canvasHeight: 800,
  zoom: 100,
  history: [],
  historyIndex: -1,
};

const editorReducer = (state, action) => {
  switch (action.type) {
    case 'ADD_ELEMENT':
      // Calcular posición para que no se superpongan
      const lastElement = state.elements[state.elements.length - 1];
      const baseX = lastElement ? lastElement.position?.x || 0 : 50;
      const baseY = lastElement ? lastElement.position?.y || 0 : 50;
      const offset = 20;
      
      const newElement = {
        id: `element-${Date.now()}`,
        type: action.payload.type,
        props: action.payload.props || {},
        children: action.payload.children || [],
        position: action.payload.position || { 
          x: baseX + offset, 
          y: baseY + offset 
        },
        size: action.payload.size || { width: 'auto', height: 'auto' },
        styles: action.payload.styles || {},
      };
      
      console.log('New element created:', newElement);
      console.log('Current elements:', state.elements);
      
      return {
        ...state,
        elements: [...state.elements, newElement],
        selectedElementId: newElement.id,
        history: [...state.history.slice(0, state.historyIndex + 1), state],
        historyIndex: state.historyIndex + 1,
      };

    case 'UPDATE_ELEMENT':
      return {
        ...state,
        elements: state.elements.map(element =>
          element.id === action.payload.id
            ? { ...element, ...action.payload.updates }
            : element
        ),
        history: [...state.history.slice(0, state.historyIndex + 1), state],
        historyIndex: state.historyIndex + 1,
      };

    case 'DELETE_ELEMENT':
      return {
        ...state,
        elements: state.elements.filter(element => element.id !== action.payload.id),
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
      return {
        ...state,
        elements: state.elements.map(element =>
          element.id === action.payload.id
            ? { ...element, position: action.payload.position }
            : element
        ),
        history: [...state.history.slice(0, state.historyIndex + 1), state],
        historyIndex: state.historyIndex + 1,
      };

    case 'RESIZE_ELEMENT':
      return {
        ...state,
        elements: state.elements.map(element =>
          element.id === action.payload.id
            ? { ...element, size: action.payload.size }
            : element
        ),
      };

    case 'SET_ZOOM':
      return {
        ...state,
        zoom: action.payload.zoom,
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
        elements: action.payload.elements,
        selectedElementId: null,
        history: [...state.history.slice(0, state.historyIndex + 1), state],
        historyIndex: state.historyIndex + 1,
      };

    case 'CLEAR_CANVAS':
      return {
        ...state,
        elements: [],
        selectedElementId: null,
        history: [...state.history.slice(0, state.historyIndex + 1), state],
        historyIndex: state.historyIndex + 1,
      };

    default:
      return state;
  }
};

export const EditorProvider = ({ children }) => {
  const [state, dispatch] = useReducer(editorReducer, initialState);

  const addElement = (type, props = {}) => {
    console.log('Adding element:', type, props);
    dispatch({
      type: 'ADD_ELEMENT',
      payload: { type, props },
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

  const selectElement = (id) => {
    dispatch({
      type: 'SELECT_ELEMENT',
      payload: { id },
    });
  };

  const moveElement = (id, position) => {
    dispatch({
      type: 'MOVE_ELEMENT',
      payload: { id, position },
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
    dispatch({
      type: 'LOAD_TEMPLATE',
      payload: { elements: template.elements },
    });
  };

  const clearCanvas = () => {
    dispatch({ type: 'CLEAR_CANVAS' });
  };

  // Event listener para cargar plantillas desde App.jsx
  useEffect(() => {
    const handleLoadTemplate = (event) => {
      const { template } = event.detail;
      loadTemplate(template);
    };

    window.addEventListener('loadTemplate', handleLoadTemplate);
    
    return () => {
      window.removeEventListener('loadTemplate', handleLoadTemplate);
    };
  }, []);

  const value = {
    ...state,
    addElement,
    updateElement,
    deleteElement,
    selectElement,
    moveElement,
    resizeElement,
    setZoom,
    undo,
    redo,
    loadTemplate,
    clearCanvas,
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