// Utility functions for exporting multi-section websites

export const generateSectionHTML = (section, allSections) => {
  const { elements } = section;
  
  const elementToHTML = (element) => {
    const { type, props, styles, children } = element;
    const position = element.position || { x: 0, y: 0 };
    const size = element.size || { width: 'auto', height: 'auto' };
    
    // Convert styles object to CSS string
    const styleString = Object.entries(styles || {})
      .map(([key, value]) => `${camelToKebab(key)}: ${value}`)
      .join('; ');
    
    // Add positioning styles
    const positionStyles = `position: absolute; left: ${position.x}px; top: ${position.y}px; width: ${size.width}; height: ${size.height};`;
    const fullStyles = `${positionStyles} ${styleString}`;
    
    switch (type) {
      case 'text':
        return `<div style="${fullStyles}">${props?.content || ''}</div>`;
      
      case 'heading':
        const level = props?.level || 1;
        return `<h${level} style="${fullStyles}">${props?.content || ''}</h${level}>`;
      
      case 'button':
        const href = props?.linkToSection ? `#${allSections[props.linkToSection]?.slug || ''}` : '#';
        const clickHandler = props?.linkToSection 
          ? `onclick="navigateToSection('${props.linkToSection}')"`
          : '';
        return `<button style="${fullStyles}" ${clickHandler} data-href="${href}">${props?.text || 'Botón'}</button>`;
      
      case 'image':
        return `<img src="${props?.src || ''}" alt="${props?.alt || ''}" style="${fullStyles}" />`;
      
      case 'container':
      case 'section':
        const childrenHTML = children?.map(child => elementToHTML(child)).join('') || '';
        return `<div style="${fullStyles}">${childrenHTML}</div>`;
      
      case 'grid':
        const columns = props?.columns || 2;
        const gridStyles = `display: grid; grid-template-columns: repeat(${columns}, 1fr); gap: 20px;`;
        const gridChildrenHTML = children?.map(child => elementToHTML(child)).join('') || '';
        return `<div style="${fullStyles} ${gridStyles}">${gridChildrenHTML}</div>`;
      
      case 'columns':
        const colCount = props?.columns || 2;
        const columnsStyles = `display: flex; gap: 20px;`;
        const columnsChildrenHTML = children?.map(child => elementToHTML(child)).join('') || '';
        return `<div style="${fullStyles} ${columnsStyles}">${columnsChildrenHTML}</div>`;
      
      case 'card':
        const cardContent = `
          ${props?.image ? `<img src="${props.image}" alt="${props?.title || ''}" style="width: 100%; height: 200px; object-fit: cover; border-radius: 8px 8px 0 0;" />` : ''}
          <div style="padding: 20px;">
            ${props?.title ? `<h3 style="margin: 0 0 12px 0; font-size: 18px; font-weight: 600;">${props.title}</h3>` : ''}
            ${props?.content ? `<p style="margin: 0; color: #666; line-height: 1.5;">${props.content}</p>` : ''}
          </div>
        `;
        return `<div style="${fullStyles} border: 1px solid #e5e7eb; border-radius: 12px; overflow: hidden; background: #fff;">${cardContent}</div>`;
      
      case 'rectangle':
        return `<div style="${fullStyles}"></div>`;
      
      case 'circle':
        return `<div style="${fullStyles} border-radius: 50%;"></div>`;
      
      case 'triangle':
        return `<div style="${fullStyles} width: 0; height: 0; border-left: 60px solid transparent; border-right: 60px solid transparent; border-bottom: 100px solid ${styles?.background || '#f59e0b'};"></div>`;
      
      case 'catalog-section':
        const catalogTitle = props?.title || 'Catálogo de Productos';
        const catalogSubtitle = props?.subtitle || 'Explora nuestra selección de productos';
        const catalogId = `catalog-${Math.random().toString(36).substr(2, 9)}`;
        return `
          <div id="${catalogId}" style="${fullStyles} background: #ffffff; border: 1px solid #e5e7eb; border-radius: 12px; overflow: hidden; font-family: 'Inter', system-ui, sans-serif;">
            <div style="padding: 24px; border-bottom: 1px solid #f1f5f9; background: linear-gradient(135deg, #f8fafc, #f1f5f9); text-align: center;">
              <h2 style="margin: 0 0 8px 0; font-size: 24px; font-weight: 700; color: #1e293b; display: flex; align-items: center; justify-content: center; gap: 10px;">
                📦 ${catalogTitle}
              </h2>
              <p style="margin: 0; font-size: 14px; color: #64748b; line-height: 1.4;">
                ${catalogSubtitle}
              </p>
            </div>
            <div style="display: flex; min-height: 400px;">
              <div style="width: 200px; background: #f8fafc; border-right: 1px solid #e5e7eb; padding: 12px;">
                <h4 style="margin: 0 0 8px 0; font-size: 10px; font-weight: 600; color: #64748b; text-transform: uppercase; letter-spacing: 0.5px;">Familias</h4>
                <div id="${catalogId}-families" style="padding: 8px 16px; color: #475569; font-size: 12px; font-weight: 500; margin-bottom: 8px;">
                  🏷️ Cargando familias...
                </div>
              </div>
              <div style="flex: 1; padding: 16px;">
                <div style="background: #ffffff; border-bottom: 1px solid #e5e7eb; padding: 12px 16px; max-height: 120px;">
                  <h4 style="margin: 0 0 8px 0; font-size: 12px; font-weight: 600; color: #64748b; text-transform: uppercase; letter-spacing: 0.5px;">Colecciones</h4>
                  <div id="${catalogId}-collections" style="display: flex; gap: 8px; flex-wrap: wrap;">
                    <div style="background: #f8fafc; color: #64748b; border: 1px solid #e5e7eb; border-radius: 6px; padding: 6px 12px; font-size: 11px; font-weight: 600; text-align: center;">
                      Selecciona una familia
                    </div>
                  </div>
                </div>
                <div style="flex: 1; padding: 16px; background: #ffffff; max-height: 280px;">
                  <div id="${catalogId}-products" style="display: flex; align-items: center; justify-content: center; height: 100%; color: #64748b; font-size: 12px;">
                    Selecciona una familia y colección para ver productos
                  </div>
                </div>
              </div>
            </div>
          </div>
          <script>
            (function() {
              const catalogId = '${catalogId}';
              const familiesContainer = document.getElementById(catalogId + '-families');
              const collectionsContainer = document.getElementById(catalogId + '-collections');
              const productsContainer = document.getElementById(catalogId + '-products');
              
              let selectedFamily = null;
              let selectedCollection = null;
              
              // Función para hacer peticiones a las APIs
              async function fetchData(url, options = {}) {
                try {
                  const response = await fetch(url, {
                    method: options.method || 'GET',
                    headers: {
                      'Content-Type': 'application/json',
                      ...options.headers
                    },
                    body: options.body || undefined
                  });
                  return await response.json();
                } catch (error) {
                  console.error('Error fetching data:', error);
                  return null;
                }
              }
              
                             // Cargar familias
               async function loadFamilies() {
                 try {
                   familiesContainer.innerHTML = '🏷️ Cargando familias...';
                   const families = await fetchData('http://hiplot.dyndns.org:84/api_dev/familia_get/3');
                  
                  if (families && families.length > 0) {
                    let familiesHTML = '';
                    families.forEach((family, index) => {
                      const isActive = index === 0;
                      familiesHTML += \`
                        <div onclick="selectFamily('\${family.id}', '\${family.nombre}')" 
                             style="padding: 8px 16px; \${isActive ? 'background: linear-gradient(135deg, #eff6ff, #dbeafe); border-left: 3px solid #3b82f6; color: #1e293b; font-weight: 600;' : 'color: #475569;'} font-size: 12px; font-weight: \${isActive ? '600' : '500'}; margin-bottom: 8px; cursor: pointer; transition: all 0.2s ease;">
                          🏷️ \${family.nombre}
                        </div>
                      \`;
                    });
                    familiesContainer.innerHTML = familiesHTML;
                    
                    // Seleccionar la primera familia automáticamente
                    if (families.length > 0) {
                      selectFamily(families[0].id, families[0].nombre);
                    }
                  } else {
                    familiesContainer.innerHTML = '🏷️ No hay familias disponibles';
                  }
                } catch (error) {
                  familiesContainer.innerHTML = '🏷️ Error al cargar familias';
                }
              }
              
              // Seleccionar familia
              window.selectFamily = async function(familyId, familyName) {
                selectedFamily = { id: familyId, nombre: familyName };
                selectedCollection = null;
                
                // Actualizar UI de familias
                const familyElements = familiesContainer.querySelectorAll('div');
                familyElements.forEach(el => {
                  el.style.background = 'transparent';
                  el.style.borderLeft = '3px solid transparent';
                  el.style.color = '#475569';
                  el.style.fontWeight = '500';
                });
                
                const selectedElement = familiesContainer.querySelector(\`[onclick*="'\${familyId}'"]\`);
                if (selectedElement) {
                  selectedElement.style.background = 'linear-gradient(135deg, #eff6ff, #dbeafe)';
                  selectedElement.style.borderLeft = '3px solid #3b82f6';
                  selectedElement.style.color = '#1e293b';
                  selectedElement.style.fontWeight = '600';
                }
                
                // Cargar colecciones
                await loadCollections(familyId);
              };
              
              // Cargar colecciones
              async function loadCollections(familyId) {
                try {
                  collectionsContainer.innerHTML = '<div style="background: #f8fafc; color: #64748b; border: 1px solid #e5e7eb; border-radius: 6px; padding: 6px 12px; font-size: 11px; font-weight: 600; text-align: center;">Cargando colecciones...</div>';
                  productsContainer.innerHTML = '<div style="display: flex; align-items: center; justify-content: center; height: 100%; color: #64748b; font-size: 12px;">Cargando...</div>';
                  
                                     const collections = await fetchData(\`http://hiplot.dyndns.org:84/api_dev/get_colecciones_x_familia/\${familyId}\`);
                  
                  if (collections && collections.length > 0) {
                    let collectionsHTML = '';
                    collections.forEach((collection, index) => {
                      const isActive = index === 0;
                      collectionsHTML += \`
                        <div onclick="selectCollection('\${collection.id}', '\${collection.nombre}')" 
                             style="background: \${isActive ? 'linear-gradient(135deg, #3b82f6, #1d4ed8)' : '#f8fafc'}; color: \${isActive ? '#ffffff' : '#1e293b'}; border: 1px solid \${isActive ? '#3b82f6' : '#e5e7eb'}; border-radius: 6px; padding: 6px 12px; font-size: 11px; font-weight: 600; text-align: center; cursor: pointer; transition: all 0.2s ease;">
                          \${collection.nombre}
                        </div>
                      \`;
                    });
                    collectionsContainer.innerHTML = collectionsHTML;
                    
                    // Seleccionar la primera colección automáticamente
                    if (collections.length > 0) {
                      selectCollection(collections[0].id, collections[0].nombre);
                    }
                  } else {
                    collectionsContainer.innerHTML = '<div style="background: #f8fafc; color: #64748b; border: 1px solid #e5e7eb; border-radius: 6px; padding: 6px 12px; font-size: 11px; font-weight: 600; text-align: center;">No hay colecciones</div>';
                    productsContainer.innerHTML = '<div style="display: flex; align-items: center; justify-content: center; height: 100%; color: #64748b; font-size: 12px;">No hay colecciones disponibles</div>';
                  }
                } catch (error) {
                  collectionsContainer.innerHTML = '<div style="background: #f8fafc; color: #64748b; border: 1px solid #e5e7eb; border-radius: 6px; padding: 6px 12px; font-size: 11px; font-weight: 600; text-align: center;">Error al cargar colecciones</div>';
                  productsContainer.innerHTML = '<div style="display: flex; align-items: center; justify-content: center; height: 100%; color: #64748b; font-size: 12px;">Error al cargar colecciones</div>';
                }
              }
              
              // Seleccionar colección
              window.selectCollection = async function(collectionId, collectionName) {
                selectedCollection = { id: collectionId, nombre: collectionName };
                
                // Actualizar UI de colecciones
                const collectionElements = collectionsContainer.querySelectorAll('div');
                collectionElements.forEach(el => {
                  el.style.background = '#f8fafc';
                  el.style.color = '#1e293b';
                  el.style.border = '1px solid #e5e7eb';
                });
                
                const selectedElement = collectionsContainer.querySelector(\`[onclick*="'\${collectionId}'"]\`);
                if (selectedElement) {
                  selectedElement.style.background = 'linear-gradient(135deg, #3b82f6, #1d4ed8)';
                  selectedElement.style.color = '#ffffff';
                  selectedElement.style.border = '1px solid #3b82f6';
                }
                
                // Cargar productos
                await loadProducts(collectionId);
              };
              
              // Cargar productos
              async function loadProducts(collectionId) {
                try {
                  productsContainer.innerHTML = '<div style="display: flex; align-items: center; justify-content: center; height: 100%; color: #64748b; font-size: 12px;">Cargando productos...</div>';
                  
                                     const data = {
                     id: 0,
                     activos: true,
                     nombre: "",
                     codigo: "",
                     familia: 0,
                     proveedor: 0,
                     materia_prima: 99,
                     get_sucursales: false,
                     get_proveedores: false,
                     get_max_mins: false,
                     get_plantilla_data: false,
                     get_areas_produccion: false,
                     coleccion: false,
                     id_coleccion: parseInt(collectionId),
                     get_stock: false,
                     get_web: true,
                     get_unidades: false,
                     for_vendedor: true,
                     page: 1,
                     id_usuario: 3,
                     light: true,
                   };
                  
                                     const products = await fetchData('http://hiplot.dyndns.org:84/api_dev/articulos_get_for_vendedor', {
                     method: 'POST',
                     body: JSON.stringify(data)
                   });
                  
                  if (products && products.length > 0) {
                    let productsHTML = '<div style="display: grid; grid-template-columns: repeat(auto-fill, minmax(150px, 1fr)); gap: 12px;">';
                    products.slice(0, 6).forEach(product => {
                      productsHTML += \`
                        <div style="background: #ffffff; border: 1px solid #e5e7eb; border-radius: 8px; padding: 12px; box-shadow: 0 1px 3px rgba(0, 0, 0, 0.05);">
                          <div style="width: 100%; height: 80px; background: \${product.imagen_web ? \`url(\${product.imagen_web})\` : 'linear-gradient(135deg, #f1f5f9, #e2e8f0)'}; background-size: cover; background-position: center; border-radius: 6px; margin-bottom: 8px; display: flex; align-items: center; justify-content: center; color: #64748b;">
                            \${!product.imagen_web ? '📦' : ''}
                          </div>
                          <h6 style="margin: 0 0 4px 0; font-size: 12px; font-weight: 600; color: #1e293b; line-height: 1.3; overflow: hidden; text-overflow: ellipsis; white-space: nowrap;">\${product.nombre}</h6>
                          <p style="margin: 0; font-size: 10px; color: #64748b; font-weight: 500;">Código: \${product.codigo}</p>
                        </div>
                      \`;
                    });
                    productsHTML += '</div>';
                    productsContainer.innerHTML = productsHTML;
                  } else {
                    productsContainer.innerHTML = '<div style="display: flex; align-items: center; justify-content: center; height: 100%; color: #64748b; font-size: 12px;">No hay productos disponibles</div>';
                  }
                } catch (error) {
                  productsContainer.innerHTML = '<div style="display: flex; align-items: center; justify-content: center; height: 100%; color: #64748b; font-size: 12px;">Error al cargar productos</div>';
                }
              }
              
              // Inicializar catálogo
              loadFamilies();
            })();
          </script>
        `;
      
      default:
        return `<div style="${fullStyles}">${props?.content || props?.text || ''}</div>`;
    }
  };
  
  const sectionHTML = elements.map(element => elementToHTML(element)).join('');
  
  return `
    <section id="${section.slug}" class="website-section" style="position: relative; min-height: 100vh; width: 100%; max-width: 1450px; margin: 0 auto; padding: 40px;">
      ${sectionHTML}
    </section>
  `;
};

export const generateFullWebsite = (sections, activeSection = 'home') => {
  const sectionsArray = Object.values(sections);
  const homeSection = sectionsArray.find(s => s.isHome) || sectionsArray[0];
  
  const sectionsHTML = sectionsArray.map(section => 
    generateSectionHTML(section, sections)
  ).join('');
  
  return `<!DOCTYPE html>
<html lang="es">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>${homeSection.name} - Mi Sitio Web</title>
    <link rel="preconnect" href="https://fonts.googleapis.com">
    <link rel="preconnect" href="https://fonts.gstatic.com" crossorigin>
    <link href="https://fonts.googleapis.com/css2?family=Inter:wght@300;400;500;600;700&family=Roboto:wght@300;400;500;700&family=Montserrat:wght@300;400;500;600;700&family=Lato:wght@300;400;700&family=Oswald:wght@300;400;500;600;700&family=Poppins:wght@300;400;500;600;700&family=Merriweather:wght@300;400;700&family=Nunito:wght@300;400;500;600;700&family=Raleway:wght@300;400;500;600;700&family=Playfair+Display:wght@400;500;600;700&family=Fira+Sans:wght@300;400;500;600;700&family=Ubuntu:wght@300;400;500;700&family=Quicksand:wght@300;400;500;600;700&family=Rubik:wght@300;400;500;600;700&family=Bebas+Neue&display=swap" rel="stylesheet">
    <style>
        * {
            margin: 0;
            padding: 0;
            box-sizing: border-box;
        }
        
        body {
            font-family: 'Inter', system-ui, sans-serif;
            line-height: 1.6;
            color: #333;
            overflow-x: hidden;
        }
        
        .website-section {
            display: none;
        }
        
        .website-section.active {
            display: block;
        }
        
        button[data-href] {
            cursor: pointer;
            border: none;
            transition: all 0.2s ease;
        }
        
        button[data-href]:hover {
            transform: translateY(-2px);
            box-shadow: 0 4px 12px rgba(0, 0, 0, 0.15);
        }
        
        .section-container {
            width: 100%;
        }
    </style>
</head>
<body>
    <div class="section-container">
        ${sectionsHTML}
    </div>
    
    <script>
        let currentSection = '${homeSection.id}';
        
        function navigateToSection(sectionId) {
            // Hide all sections
            const sections = document.querySelectorAll('.website-section');
            sections.forEach(section => section.classList.remove('active'));
            
            // Show target section
            const targetSection = document.getElementById(Object.values(${JSON.stringify(sections)}).find(s => s.id === sectionId)?.slug || 'home');
            if (targetSection) {
                targetSection.classList.add('active');
                currentSection = sectionId;
                
                // Update URL without refresh
                const sectionSlug = Object.values(${JSON.stringify(sections)}).find(s => s.id === sectionId)?.slug || 'home';
                history.pushState({sectionId}, '', '#' + sectionSlug);
            }
        }
        
        // Handle browser back/forward
        window.addEventListener('popstate', function(event) {
            if (event.state && event.state.sectionId) {
                navigateToSection(event.state.sectionId);
            }
        });
        
        // Initialize
        document.addEventListener('DOMContentLoaded', function() {
            navigateToSection('${homeSection.id}');
        });
    </script>
</body>
</html>`;
};

export const downloadWebsite = (sections, filename = 'mi-sitio-web.html') => {
  const html = generateFullWebsite(sections);
  const blob = new Blob([html], { type: 'text/html' });
  const url = URL.createObjectURL(blob);
  
  const a = document.createElement('a');
  a.href = url;
  a.download = filename;
  a.click();
  
  URL.revokeObjectURL(url);
};

export const previewWebsite = (sections) => {
  const html = generateFullWebsite(sections);
  const newWindow = window.open('', '_blank');
  newWindow.document.write(html);
  newWindow.document.close();
};

// Helper function to convert camelCase to kebab-case
function camelToKebab(str) {
  return str.replace(/([a-z0-9]|(?=[A-Z]))([A-Z])/g, '$1-$2').toLowerCase();
} 