// Utilidades para el almacenamiento y gestión de proyectos de sitios web

const STORAGE_KEY = 'web_editor_projects';

// Estructura de un proyecto guardado
export const createProjectData = (sections, metadata = {}) => {
  return {
    id: metadata.id || `project-${Date.now()}`,
    name: metadata.name || 'Mi Sitio Web',
    description: metadata.description || '',
    createdAt: metadata.createdAt || new Date().toISOString(),
    updatedAt: new Date().toISOString(),
    sections: sections,
    thumbnail: metadata.thumbnail || null,
    tags: metadata.tags || [],
    version: '1.0.0'
  };
};

// Guardar proyecto en localStorage
export const saveProject = (projectData) => {
  try {
    console.log('Guardando proyecto en localStorage:', projectData);
    
    const existingProjects = getProjects();
    const projectIndex = existingProjects.findIndex(p => p.id === projectData.id);
    
    if (projectIndex >= 0) {
      // Actualizar proyecto existente
      existingProjects[projectIndex] = {
        ...existingProjects[projectIndex],
        ...projectData,
        updatedAt: new Date().toISOString()
      };
      console.log('Proyecto actualizado:', existingProjects[projectIndex]);
    } else {
      // Agregar nuevo proyecto
      existingProjects.push(projectData);
      console.log('Nuevo proyecto agregado:', projectData);
    }
    
    localStorage.setItem(STORAGE_KEY, JSON.stringify(existingProjects));
    console.log('Proyectos guardados en localStorage:', existingProjects.length);
    
    return { success: true, project: projectData };
  } catch (error) {
    console.error('Error al guardar proyecto:', error);
    return { success: false, error: error.message };
  }
};

// Obtener todos los proyectos
export const getProjects = () => {
  try {
    const projects = localStorage.getItem(STORAGE_KEY);
    return projects ? JSON.parse(projects) : [];
  } catch (error) {
    console.error('Error al cargar proyectos:', error);
    return [];
  }
};

// Obtener un proyecto específico por ID
export const getProject = (projectId) => {
  try {
    const projects = getProjects();
    return projects.find(p => p.id === projectId) || null;
  } catch (error) {
    console.error('Error al cargar proyecto:', error);
    return null;
  }
};

// Eliminar un proyecto
export const deleteProject = (projectId) => {
  try {
    const projects = getProjects();
    const filteredProjects = projects.filter(p => p.id !== projectId);
    localStorage.setItem(STORAGE_KEY, JSON.stringify(filteredProjects));
    return { success: true };
  } catch (error) {
    console.error('Error al eliminar proyecto:', error);
    return { success: false, error: error.message };
  }
};



// Función simple y confiable para exportar JSON
export const exportProjectSimple = (projectData, filename = null) => {
  try {
    if (!projectData) {
      throw new Error('No hay datos del proyecto para exportar');
    }

    const exportData = {
      ...projectData,
      exportedAt: new Date().toISOString(),
      exportVersion: '1.0.0'
    };
    
    const jsonString = JSON.stringify(exportData, null, 2);
    const fileName = filename || `${projectData.name.replace(/\s+/g, '-')}.json`;
    
    const dataStr = "data:application/json;charset=utf-8," + encodeURIComponent(jsonString);
    const downloadAnchorNode = document.createElement('a');
    downloadAnchorNode.setAttribute("href", dataStr);
    downloadAnchorNode.setAttribute("download", fileName);
    downloadAnchorNode.style.display = 'none';
    
    document.body.appendChild(downloadAnchorNode);
    downloadAnchorNode.click();
    document.body.removeChild(downloadAnchorNode);
    
    return { success: true, filename: fileName };
  } catch (error) {
    throw error;
  }
};

// Función ultra-compatible para exportar JSON
export const exportProjectJSONUltra = (projectData, filename = null) => {
  try {
    console.log('exportProjectJSONUltra iniciado');
    
    if (!projectData) {
      throw new Error('No hay datos del proyecto para exportar');
    }

    const exportData = {
      ...projectData,
      exportedAt: new Date().toISOString(),
      exportVersion: '1.0.0'
    };
    
    const jsonString = JSON.stringify(exportData, null, 2);
    const fileName = filename || `${projectData.name.replace(/\s+/g, '-')}.json`;
    
    console.log('Preparando descarga JSON ultra-compatible de:', fileName);
    
    // Método ultra-básico que funciona en todos los navegadores
    const dataUri = 'data:application/json;charset=utf-8,' + encodeURIComponent(jsonString);
    
    // Crear enlace
    const link = document.createElement('a');
    link.setAttribute('href', dataUri);
    link.setAttribute('download', fileName);
    link.style.display = 'none';
    
    // Agregar al DOM y hacer clic
    document.body.appendChild(link);
    link.click();
    
    // Remover inmediatamente
    document.body.removeChild(link);
    
    console.log('Exportación JSON ultra-compatible completada:', fileName);
    return { success: true, filename: fileName };
  } catch (error) {
    console.error('Error en exportProjectJSONUltra:', error);
    throw error;
  }
};

// Función específica para exportar JSON que funciona en todos los navegadores
export const exportProjectJSON = (projectData, filename = null) => {
  try {
    console.log('exportProjectJSON iniciado');
    
    if (!projectData) {
      throw new Error('No hay datos del proyecto para exportar');
    }

    const exportData = {
      ...projectData,
      exportedAt: new Date().toISOString(),
      exportVersion: '1.0.0'
    };
    
    const jsonString = JSON.stringify(exportData, null, 2);
    const fileName = filename || `${projectData.name.replace(/\s+/g, '-')}.json`;
    
    console.log('Preparando descarga JSON de:', fileName);
    
    // Método más compatible para JSON
    const blob = new Blob([jsonString], { 
      type: 'application/json;charset=utf-8' 
    });
    
    // Crear URL del blob
    const url = window.URL.createObjectURL(blob);
    
    // Crear enlace de descarga
    const downloadLink = document.createElement('a');
    downloadLink.href = url;
    downloadLink.download = fileName;
    downloadLink.style.display = 'none';
    
    // Agregar al DOM
    document.body.appendChild(downloadLink);
    
    // Ejecutar descarga
    downloadLink.click();
    
    // Limpiar después de un delay
    setTimeout(() => {
      document.body.removeChild(downloadLink);
      window.URL.revokeObjectURL(url);
      console.log('Limpieza JSON completada para:', fileName);
    }, 300);
    
    console.log('Exportación JSON completada:', fileName);
    return { success: true, filename: fileName };
  } catch (error) {
    console.error('Error en exportProjectJSON:', error);
    throw error;
  }
};

// Función de fallback para exportación
export const exportProjectFallback = (projectData, filename = null) => {
  try {
    console.log('exportProjectFallback iniciado');
    
    if (!projectData) {
      throw new Error('No hay datos del proyecto para exportar');
    }

    const exportData = {
      ...projectData,
      exportedAt: new Date().toISOString(),
      exportVersion: '1.0.0'
    };
    
    const jsonString = JSON.stringify(exportData, null, 2);
    const fileName = filename || `${projectData.name.replace(/\s+/g, '-')}.json`;
    
    // Método más básico posible
    const dataStr = "data:text/json;charset=utf-8," + encodeURIComponent(jsonString);
    const downloadAnchorNode = document.createElement('a');
    downloadAnchorNode.setAttribute("href", dataStr);
    downloadAnchorNode.setAttribute("download", fileName);
    document.body.appendChild(downloadAnchorNode);
    downloadAnchorNode.click();
    downloadAnchorNode.remove();
    
    console.log('Exportación fallback completada:', fileName);
    return { success: true, filename: fileName };
  } catch (error) {
    console.error('Error en exportProjectFallback:', error);
    throw error;
  }
};

// Función alternativa de exportación más directa
export const exportProjectDirect = (projectData, filename = null) => {
  try {
    console.log('exportProjectDirect iniciado');
    
    if (!projectData) {
      throw new Error('No hay datos del proyecto para exportar');
    }

    // Verificar compatibilidad del navegador
    if (!window.URL || !window.URL.createObjectURL) {
      throw new Error('Tu navegador no soporta la descarga de archivos');
    }

    const exportData = {
      ...projectData,
      exportedAt: new Date().toISOString(),
      exportVersion: '1.0.0'
    };
    
    const jsonString = JSON.stringify(exportData, null, 2);
    const fileName = filename || `${projectData.name.replace(/\s+/g, '-')}.json`;
    
    console.log('Preparando descarga de:', fileName);
    
    // Crear el blob
    const blob = new Blob([jsonString], { type: 'application/json' });
    
    // Crear URL del blob
    const url = window.URL.createObjectURL(blob);
    
    // Crear enlace temporal
    const link = document.createElement('a');
    link.href = url;
    link.download = fileName;
    link.style.display = 'none';
    
    // Agregar al DOM
    document.body.appendChild(link);
    
    // Simular clic
    const clickEvent = new MouseEvent('click', {
      view: window,
      bubbles: true,
      cancelable: true
    });
    
    link.dispatchEvent(clickEvent);
    
    // Limpiar después de un delay
    setTimeout(() => {
      document.body.removeChild(link);
      window.URL.revokeObjectURL(url);
      console.log('Limpieza completada para:', fileName);
    }, 200);
    
    console.log('Exportación directa completada:', fileName);
    return { success: true, filename: fileName };
  } catch (error) {
    console.error('Error en exportProjectDirect:', error);
    throw error;
  }
};

// Exportar proyecto como archivo JSON
export const exportProject = (projectData, filename = null) => {
  try {
    console.log('exportProject iniciado con datos:', projectData);
    
    if (!projectData) {
      throw new Error('No hay datos del proyecto para exportar');
    }

    const exportData = {
      ...projectData,
      exportedAt: new Date().toISOString(),
      exportVersion: '1.0.0'
    };
    
    console.log('Datos preparados para exportar:', exportData);
    
    const jsonString = JSON.stringify(exportData, null, 2);
    console.log('JSON generado, longitud:', jsonString.length);
    
    const blob = new Blob([jsonString], { 
      type: 'application/json' 
    });
    
    console.log('Blob creado, tamaño:', blob.size);
    
    const url = URL.createObjectURL(blob);
    console.log('URL creada:', url);
    
    const a = document.createElement('a');
    a.href = url;
    a.download = filename || `${projectData.name.replace(/\s+/g, '-')}.json`;
    a.style.display = 'none';
    
    console.log('Elemento <a> creado, nombre de archivo:', a.download);
    
    document.body.appendChild(a);
    console.log('Elemento <a> agregado al DOM');
    
    a.click();
    console.log('Click ejecutado en el elemento <a>');
    
    // Esperar un poco antes de limpiar
    setTimeout(() => {
      document.body.removeChild(a);
      URL.revokeObjectURL(url);
      console.log('Limpieza completada');
    }, 100);
    
    return { success: true, filename: a.download };
  } catch (error) {
    console.error('Error en exportProject:', error);
    throw new Error(`Error al exportar el proyecto: ${error.message}`);
  }
};

// Importar proyecto desde archivo JSON
export const importProject = (file) => {
  return new Promise((resolve, reject) => {
    const reader = new FileReader();
    
    reader.onload = (e) => {
      try {
        const projectData = JSON.parse(e.target.result);
        
        // Validar estructura básica del proyecto
        if (!projectData.sections || !projectData.name) {
          throw new Error('Archivo de proyecto inválido');
        }
        
        // Generar nuevo ID para evitar conflictos
        const importedProject = {
          ...projectData,
          id: `project-${Date.now()}`,
          importedAt: new Date().toISOString(),
          updatedAt: new Date().toISOString()
        };
        
        // Guardar el proyecto importado
        const result = saveProject(importedProject);
        
        if (result.success) {
          resolve(result.project);
        } else {
          reject(new Error(result.error));
        }
      } catch (error) {
        reject(new Error('Error al procesar el archivo: ' + error.message));
      }
    };
    
    reader.onerror = () => {
      reject(new Error('Error al leer el archivo'));
    };
    
    reader.readAsText(file);
  });
};

// Generar thumbnail del proyecto (captura básica)
export const generateThumbnail = (sections) => {
  // Por ahora retornamos null, pero aquí se podría implementar
  // una captura del canvas o una representación visual
  return null;
};

// Buscar proyectos por nombre o tags
export const searchProjects = (query) => {
  const projects = getProjects();
  const searchTerm = query.toLowerCase();
  
  return projects.filter(project => 
    project.name.toLowerCase().includes(searchTerm) ||
    project.description.toLowerCase().includes(searchTerm) ||
    project.tags.some(tag => tag.toLowerCase().includes(searchTerm))
  );
};

// Obtener estadísticas de proyectos
export const getProjectStats = () => {
  const projects = getProjects();
  
  return {
    total: projects.length,
    recentlyUpdated: projects.filter(p => {
      const updatedAt = new Date(p.updatedAt);
      const weekAgo = new Date(Date.now() - 7 * 24 * 60 * 60 * 1000);
      return updatedAt > weekAgo;
    }).length,
    totalSize: projects.reduce((acc, p) => acc + JSON.stringify(p).length, 0)
  };
}; 