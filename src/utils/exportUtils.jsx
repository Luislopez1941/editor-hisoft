// Utility functions for exporting multi-section websites

export const generateSectionHTML = (section, allSections, sucursalId = null) => {
  const { elements } = section;
  
  console.log('🔄 generateSectionHTML: Procesando sección:', section.id, 'con', elements?.length || 0, 'elementos');

  // Helper function to convert camelCase to kebab-case
  const camelToKebab = (str) => {
    return str.replace(/([a-z0-9]|(?=[A-Z]))([A-Z])/g, '$1-$2').toLowerCase();
  };

  const elementToHTML = (element) => {
    const { type, props, styles, children } = element;
    const position = element.position || { x: 0, y: 0 };
    const size = element.size || { width: 'auto', height: 'auto' };

    // Convert styles object to CSS string
    const styleString = Object.entries(styles || {})
      .map(([key, value]) => `${camelToKebab(key)}: ${value}`)
      .join('; ');

    // Add positioning styles - ensure position values are properly applied
    const positionX = typeof position.x === 'number' ? position.x : 0;
    const positionY = typeof position.y === 'number' ? position.y : 0;
    const positionStyles = `position: absolute; left: ${positionX}px; top: ${positionY}px; width: ${size.width}; height: ${size.height};`;
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

      case 'carousel':
        const carouselId = `carousel-${Math.random().toString(36).substr(2, 9)}`;
        const images = props?.images || [];
        const autoPlay = props?.autoPlay !== false;
        const showDots = props?.showDots !== false;
        const showArrows = props?.showArrows !== false;
        const interval = props?.interval || 3000;
        
        const carouselHTML = `
          <div id="${carouselId}" class="carousel-container" style="${fullStyles} position: relative; overflow: hidden; border-radius: 8px;">
            <div class="carousel-slides" style="display: flex; transition: transform 0.5s ease-in-out; height: 100%;">
              ${images.map((image, index) => `
                <div class="carousel-slide" style="min-width: 100%; height: 100%; flex-shrink: 0;">
                  <img src="${image.src || image}" alt="${image.alt || `Slide ${index + 1}`}" style="width: 100%; height: 100%; object-fit: cover;" />
                  ${image.caption ? `<div class="carousel-caption" style="position: absolute; bottom: 0; left: 0; right: 0; background: rgba(0,0,0,0.7); color: white; padding: 20px; text-align: center;">${image.caption}</div>` : ''}
                </div>
              `).join('')}
            </div>
            
            ${showArrows ? `
              <button class="carousel-arrow carousel-prev" onclick="moveCarousel('${carouselId}', -1)" style="position: absolute; left: 10px; top: 50%; transform: translateY(-50%); background: rgba(0,0,0,0.5); color: white; border: none; border-radius: 50%; width: 40px; height: 40px; cursor: pointer; display: flex; align-items: center; justify-content: center; font-size: 18px; z-index: 10;">‹</button>
              <button class="carousel-arrow carousel-next" onclick="moveCarousel('${carouselId}', 1)" style="position: absolute; right: 10px; top: 50%; transform: translateY(-50%); background: rgba(0,0,0,0.5); color: white; border: none; border-radius: 50%; width: 40px; height: 40px; cursor: pointer; display: flex; align-items: center; justify-content: center; font-size: 18px; z-index: 10;">›</button>
            ` : ''}
            
            ${showDots ? `
              <div class="carousel-dots" style="position: absolute; bottom: 20px; left: 50%; transform: translateX(-50%); display: flex; gap: 8px; z-index: 10;">
                ${images.map((_, index) => `
                  <button class="carousel-dot" onclick="goToSlide('${carouselId}', ${index})" style="width: 12px; height: 12px; border-radius: 50%; border: none; background: ${index === 0 ? 'white' : 'rgba(255,255,255,0.5)'}; cursor: pointer; transition: background 0.3s ease;"></button>
                `).join('')}
              </div>
            ` : ''}
          </div>
          
          <script>
            (function() {
              const carousel = document.getElementById('${carouselId}');
              const slides = carousel.querySelector('.carousel-slides');
              let currentSlide = 0;
              const totalSlides = ${images.length};
              let autoplayInterval;
              
              function updateCarousel() {
                slides.style.transform = \`translateX(-\${currentSlide * 100}%)\`;
                
                // Update dots
                const dots = carousel.querySelectorAll('.carousel-dot');
                dots.forEach((dot, index) => {
                  dot.style.background = index === currentSlide ? 'white' : 'rgba(255,255,255,0.5)';
                });
              }
              
              function nextSlide() {
                currentSlide = (currentSlide + 1) % totalSlides;
                updateCarousel();
              }
              
              function prevSlide() {
                currentSlide = (currentSlide - 1 + totalSlides) % totalSlides;
                updateCarousel();
              }
              
              // Make functions global
              window.moveCarousel = function(carouselId, direction) {
                if (carouselId === '${carouselId}') {
                  if (direction === 1) {
                    nextSlide();
                  } else {
                    prevSlide();
                  }
                  resetAutoplay();
                }
              };
              
              window.goToSlide = function(carouselId, slideIndex) {
                if (carouselId === '${carouselId}') {
                  currentSlide = slideIndex;
                  updateCarousel();
                  resetAutoplay();
                }
              };
              
              function resetAutoplay() {
                if (autoplayInterval) {
                  clearInterval(autoplayInterval);
                }
                if (${autoPlay}) {
                  autoplayInterval = setInterval(nextSlide, ${interval});
                }
              }
              
              // Initialize autoplay
              if (${autoPlay}) {
                autoplayInterval = setInterval(nextSlide, ${interval});
              }
              
              // Pause autoplay on hover
              carousel.addEventListener('mouseenter', () => {
                if (autoplayInterval) {
                  clearInterval(autoplayInterval);
                }
              });
              
              carousel.addEventListener('mouseleave', () => {
                if (${autoPlay}) {
                  autoplayInterval = setInterval(nextSlide, ${interval});
                }
              });
            })();
          </script>
        `;
        
        return carouselHTML;

      case 'catalog-section':
        const catalogTitle = props?.title || 'Catálogo de Productos';
        const catalogSubtitle = props?.subtitle || 'Explora nuestra selección de productos';

        console.log('🔄 elementToHTML: Procesando catalog-section con props:', props);

        // For catalog sections, ensure proper positioning and override any conflicting styles
        // Use the actual position values from the element
        const catalogPositionX = typeof position.x === 'number' ? position.x : 0;
        const catalogPositionY = typeof position.y === 'number' ? position.y : 0;
        const catalogWidth = size.width || 'auto';
        const catalogHeight = size.height || 'auto';

        const catalogStyles = `position: absolute; left: ${catalogPositionX}px; top: ${catalogPositionY}px; width: ${catalogWidth}; height: ${catalogHeight}; z-index: 1;`;

        console.log('🔄 elementToHTML: Catalog-section generado exitosamente');

        return `
          <div id="catalog" style="${fullStyles}">
            <!-- Full Width Header -->
            <div style="background-color: white; border-bottom: 1px solid #e5e7eb; width: 100%;">
              <div style="padding: 16px 24px;">
                <h1 style="font-size: clamp(24px, 4vw, 30px); font-weight: bold; color: #111827; margin: 0;">
                  Catálogo de Productos
                </h1>
                <p style="color: #6b7280; margin-top: 8px; margin: 0; font-size: clamp(14px, 2.5vw, 16px);">
                  Explora nuestra selección de productos
                </p>

              </div>
            </div>
            
            <!-- Main Layout with Sidebar and Content -->
            <div class="productCatalog-main-content" style="height: 100%; overflow: hidden;">
              <!-- Content Below Header -->
              <div class="productCatalog-content-below-header" style="display: flex; flex-direction: column; width: 100%; overflow: hidden; height: 100%;">
                <!-- Mobile Menu Toggle -->
                <div class="productCatalog-mobile-toggle" style="display: none; padding: 12px 24px; background-color: #f9fafb; border-bottom: 1px solid #e5e7eb;">
                  <button id="mobile-menu-btn" style="display: flex; align-items: center; gap: 8px; padding: 8px 12px; background-color: #e0241b; color: white; border: none; border-radius: 6px; font-size: 14px; cursor: pointer;">
                    <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
                      <line x1="3" y1="6" x2="21" y2="6"></line>
                      <line x1="3" y1="12" x2="21" y2="12"></line>
                      <line x1="3" y1="18" x2="21" y2="18"></line>
                    </svg>
                    Familias
                  </button>
                </div>
                
                <!-- Desktop Layout -->
                <div class="productCatalog-desktop-layout" style="display: flex; width: 100%; overflow: hidden; height: 100%;">
                <!-- Sidebar - Familias -->
                  <div class="productCatalog-sidebar" style="width: 300px; background-color: #f9fafb; border-right: 1px solid #e5e7eb; flex-shrink: 0; height: 100%; overflow: hidden; display: grid; grid-template-rows: auto 1fr;">
                    <div class="productCatalog-sidebar-header" style="padding: 20px 24px;">
                      <h2 style="font-size: 18px; font-weight: 600; color: #111827; margin-bottom: 16px;">FAMILIAS</h2>
                  </div>
                    <div class="productCatalog-familia-list" style="display: grid; height: 100%; grid-template-rows: auto 1fr; padding: 0px 15px 15px;">
                      <input type="text" placeholder="Buscar familia..." id="familia-search" class="productCatalog-familia-search" style="width: 100%; padding: 8px 12px; border: 1px solid #d1d5db; border-radius: 8px; font-size: 14px; margin-bottom: 16px; outline: none;" />
                      <div class="sidebar-familia-list" id="families" style="overflow-y: auto;">
                        <div class="productCatalog-loading" id="families-loading" style="color: #6b7280; text-align: center; padding: 16px 0; font-size: 14px; display: none;">Cargando familias...</div>
                    </div>
                  </div>
                </div>

                <!-- Right Content -->
                  <div class="productCatalog-right-content" style="width: 100%; display: grid; grid-template-rows: auto 1fr;">
                  <!-- Collections y Search -->
                    <div class="productCatalog-collections-search-section" style="border-bottom: 1px solid #f3f4f6; background-color: white;">
                      <div style="padding: 16px 24px;">
                        <div style="display: flex; flex-direction: column; gap: 16px; margin-bottom: 16px;">
                          <!-- Search Controls -->
                          <div class="productCatalog-search-container" style="display: flex; flex-direction: direction: column; gap: 12px;">
                            <div class="search-row" style="display: flex; gap: 12px; flex-wrap: wrap;">
                              <div class="search-input-container" style="flex: 1; min-width: 200px;">
                                <input type="text" placeholder="Buscar productos..." id="product-search" class="productCatalog-search-input" style="width: 100%; padding: 8px 16px; border: 1px solid #e5e7eb; border-radius: 8px; font-size: 14px; background-color: white; outline: none;" />
                        </div>
                              <div class="search-select-container" style="min-width: 150px;">
                                <select id="search-type" class="inputs__general" style="width: 100%; padding: 8px 12px; border: 1px solid #e5e7eb; border-radius: 8px; font-size:14px; background-color: white; outline: none;">
                            <option value="0">Por Descripción</option>
                            <option value="1">Codigo</option>
                          </select>
                              </div>
                            </div>
                          </div>
                        </div>

                        <!-- Horizontal Collections -->
                        <div class="productCatalog-collections-nav">
                          <div id="collections" style="display: flex; gap: 8px; overflow-x: auto; padding-bottom: 8px; scrollbar-width: thin;">
                            <div class="productCatalog-loading" id="collections-loading" style="color: #6b7280; font-size: 14px; display: none;">Cargando colecciones...</div>
                        </div>
                      </div>
                    </div>
                  </div>

                  <!-- Products Section -->
                    <div class="productCatalog-products-section" style="padding: 16px 24px; height: 100%; display: grid; grid-template-rows: auto 1fr auto; overflow: auto;">
                      <div class="productCatalog-products-header" style="display: flex; flex-direction: column; gap: 8px; margin-bottom: 24px;">
                        <h2 class="productCatalog-products-title" style="font-size: clamp(18px, 3vw, 20px); font-weight: 600; color: #111827; margin: 0;">
                        SELECCIONA UNA COLECCIÓN
                      </h2>
                        <span class="productCatalog-products-count" id="products-count" style="font-size: 14px; color: #6b7280;">
                          0 productos encontrados
                      </span>
                    </div>
                      <div class="productCatalog-products-grid" id="products-grid" style="display: grid; grid-template-columns: repeat(auto-fill, minmax(250px, 1fr)); gap: 16px; overflow-y: auto;">
                        <div class="productCatalog-loading" id="products-loading" style="text-align: center; padding: 64px 0; display: none;">
                          <div style="display: inline-flex; align-items: center; padding: 8px 16px; font-size: 14px; color: #6b7280;">
                            <svg style="animation: spin 1s linear infinite; margin-right: 12px; width: 20px; height: 20px;" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                              <circle style="opacity: 0.25;" cx="12" cy="12" r="10" stroke="currentColor" stroke-width="4"></circle>
                              <path style="opacity: 0.75;" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                            </svg>
                            Cargando productos...
                      </div>
                    </div>
                        <div class="productCatalog-no-products" id="no-products" style="text-align: center; padding: 64px 0; display: none;">
                          <div style="display: inline-flex; align-items: center; padding: 8px 16px; font-size: 14px; color: #6b7280;">
                            <svg style="margin-right: 12px; width: 20px; height: 20px;" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                              <circle cx="12" cy="12" r="10" stroke="currentColor" stroke-width="4"></circle>
                              <path fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                            </svg>
                            No se encontraron productos
                          </div>
                        </div>
                      </div>
                      
                      <!-- Pagination -->
                      <div class="productCatalog-pagination" style="display: flex; justify-content: center; align-items: center; gap: 8px; margin-top: 24px;">
                        <button id="prev-page" class="pagination-btn" style="padding: 8px 16px; border: 1px solid #d1d5db; background: white; color: #374151; border-radius: 6px; cursor: pointer; font-size: 14px; display: none;">Anterior</button>
                        <span id="page-info" style="font-size: 14px; color: #6b7280;">Página 1</span>
                        <button id="next-page" class="pagination-btn" style="padding: 8px 16px; border: 1px solid #d1d5db; background: white; color: #374151; border-radius: 6px; cursor: pointer; font-size: 14px; display: none;">Siguiente</button>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
          
          <script>
            (function() {
              console.log('🚀 Catálogo exportado: JavaScript iniciando...');
              console.log('🚀 Catálogo exportado: Verificando elementos del DOM...');
              
              // Variables globales del catálogo
              let selectedFamilia = null;
              let selectedCollection = null;
              let currentPage = 1;
              let searchTerm = '';
              let searchType = 0;
              let families = [];
              let collections = [];
              let products = [];
              let filteredProducts = [];
              let loading = {
                families: false,
                collections: false,
                products: false
              };
              // Usar el sucursalId que se pasa desde generateFullWebsite, sino usar 106 como fallback
              const userId = 106; // Valor fijo para id_usuario
              const sucursalId = ${sucursalId || 106}; // id_sucursal para getFamilies - se pasa desde generateFullWebsite
              const url_img = 'http://hiplot.dyndns.org:84/';
              const apiBaseUrl = 'http://hiplot.dyndns.org:84/api_dev_mode';
              
              console.log('🔄 Catálogo exportado: Usando userId (id_usuario):', userId);
              console.log('🔄 Catálogo exportado: Usando sucursalId para familias:', sucursalId);
              console.log('🔄 Catálogo exportado: API Base URL:', apiBaseUrl);
              console.log('🔄 Catálogo exportado: NOTA: Todas las peticiones usarán id_usuario: 106');
              
              // Verificar que sucursalId esté definido
              if (typeof sucursalId === 'undefined') {
                console.error('❌ ERROR: sucursalId no está definido en el catálogo exportado');
                console.error('❌ Valor de sucursalId:', sucursalId);
              } else {
                console.log('✅ sucursalId está correctamente definido:', sucursalId);
              }
              
              // Loading state management
              function setLoading(isLoading, type) {
                loading[type] = isLoading;
                if (type === 'families') {
                  renderFamilies();
                } else if (type === 'collections') {
                  renderCollections();
                } else if (type === 'products') {
                  renderProducts();
                }
              }
              
              // API Functions
              async function fetchData(url, options = {}) {
                try {
                  const response = await fetch(url, {
                    headers: {
                      'Content-Type': 'application/json',
                      ...options.headers
                    },
                    ...options
                  });
                  const data = await response.json();
                  return data;
                } catch (error) {
                  console.error('Error fetching data:', error);
                  throw error;
                }
              }
              
              async function getFamilies(id_sucursal) {
                console.log('🔄 Catálogo exportado getFamilies: Usando id_sucursal:', id_sucursal);
                return await fetchData('http://hiplot.dyndns.org:84/api_dev_mode/familia_get_for_web/' + id_sucursal);
              }
              
              async function getCollectionByFamily(familyId) {
                
                return await fetchData('http://hiplot.dyndns.org:84/api_dev_mode/get_colecciones_x_familia/' + familyId);
              }
              
              async function getArticlesForVendedor(data) {
                
                return await fetchData('http://hiplot.dyndns.org:84/api_dev_mode/articulos_get_for_vendedor', {
                  method: 'POST',
                  body: JSON.stringify(data)
                });
              }
              
              // Load Families
              async function loadFamilies() {
                try {
                  console.log('🔄 Catálogo exportado loadFamilies: Iniciando con id_sucursal:', sucursalId);
                  setLoading(true, 'families');
                  const familiesData = await getFamilies(sucursalId);
                  
                  console.log('🔄 Catálogo exportado loadFamilies: Familias recibidas:', familiesData);
                  
                  if (familiesData && Array.isArray(familiesData)) {
                    families = familiesData;
                    families.unshift({ id: 0, nombre: 'Todas las Familias' });
                    renderFamilies();
                    
                    // Si hay familias, seleccionar la primera y cargar sus colecciones
                    if (familiesData.length > 0) {
                      selectedFamilia = familiesData[0].id;
                      
                      await loadCollections(familiesData[0].id);
                    }
                  } else {
                    console.error('Datos de familias inválidos:', familiesData);
                    families = [];
                    renderFamilies();
                  }
                } catch (error) {
                  console.error("Error cargando familias:", error);
                  families = [];
                  renderFamilies();
                } finally {
                  setLoading(false, 'families');
                }
              }
              
              // Load Collections
              async function loadCollections(familiaId) {
                try {
                  
                  
                  setLoading(true, 'collections');
                  let collectionsData = await getCollectionByFamily(familiaId);
                  
                  
                  if (collectionsData && Array.isArray(collectionsData)) {
                    collections = collectionsData;
                    collections.unshift({ id: 0, nombre: 'Todas las Colecciones' });
                    
                    
                    // Si hay colecciones, seleccionar la primera y cargar sus productos
                    if (collectionsData.length > 0) {
                      selectedCollection = collectionsData[0].id;
                      
                      // Renderizar colecciones CON la selección
                      renderCollections();
                      // Aquí es donde se llama a loadProducts exactamente como en React
                      await loadProducts(familiaId, collectionsData[0].id, 1);
                  } else {
                      // Si no hay colecciones, limpiar productos
                      
                      selectedCollection = null;
                      renderCollections();
                      products = [];
                      filteredProducts = [];
                      renderProducts();
                    }
                  } else {
                    console.error('Datos de colecciones inválidos:', collectionsData);
                    collections = [];
                    renderCollections();
                    products = [];
                    filteredProducts = [];
                    renderProducts();
                  }
                } catch (error) {
                  console.error("Error cargando colecciones:", error);
                  collections = [];
                  renderCollections();
                  products = [];
                  filteredProducts = [];
                  renderProducts();
                } finally {
                  setLoading(false, 'collections');
                }
              }
              
              // Load Products
              async function loadProducts(familiaId, collectionId, pageNumber) {
                try {
                  
                  
                  setLoading(true, 'products');
                  const data = {
                    id: 0,
                    activos: true,
                    nombre: "",
                    codigo: "",
                    familia: familiaId,
                    proveedor: 0,
                    materia_prima: 99,
                    get_sucursales: false,
                    get_proveedores: false,
                    get_max_mins: false,
                    get_plantilla_data: false,
                    get_areas_produccion: false,
                    coleccion: false,
                    id_coleccion: collectionId,
                    get_stock: false,
                    get_web: true,
                    get_unidades: false,
                    for_vendedor: true,
                    page: pageNumber,
                    id_usuario: 106, // Valor fijo para id_usuario
                    light: true,
                    no_resultados: 50
                  };
                  
                  console.log('🔄 Catálogo exportado loadProducts: Enviando id_usuario:', data.id_usuario);
                  
                  const result = await getArticlesForVendedor(data);
                  
                  products = result.data || result || [];
                  filteredProducts = products;
                  
                  
                  renderProducts();
                } catch (error) {
                  console.error("Error cargando productos:", error);
                  products = [];
                  filteredProducts = [];
                  renderProducts();
                } finally {
                  setLoading(false, 'products');
                }
              }
              
              // Load Products by Search
              async function loadProductsByCodeOrDesc(input, numberPage) {
                try {
                  setLoading(true, 'products');
                  const data = {
                    id: 0,
                    activos: true,
                    nombre: searchType == 0 ? input : '',
                    codigo: searchType == 1 ? input : '',
                    familia: 0,
                    proveedor: 0,
                    materia_prima: 99,
                    get_sucursales: false,
                    get_proveedores: false,
                    get_max_mins: false,
                    get_plantilla_data: false,
                    get_areas_produccion: false,
                    coleccion: false,
                    id_coleccion: 0,
                    get_stock: false,
                    get_web: true,
                    get_unidades: false,
                    for_vendedor: true,
                    page: numberPage,
                    id_usuario: 106, // Valor fijo para id_usuario
                    light: true,
                    no_resultados: 50
                  };
                  
                  console.log('🔄 Catálogo exportado loadProductsByCodeOrDesc: Enviando id_usuario:', data.id_usuario);
                  
                  const result = await getArticlesForVendedor(data);
                  products = result.data || result || [];
                  filteredProducts = products;
                  renderProducts();
                } catch (error) {
                  console.error("Error cargando productos:", error);
                  products = [];
                  filteredProducts = [];
                  renderProducts();
                } finally {
                  setLoading(false, 'products');
                }
              }
              
              // Render Functions
              function renderFamilies() {
                console.log('🔄 renderFamilies: Iniciando renderizado');
                console.log('🔄 renderFamilies: Familias disponibles:', families);
                console.log('🔄 renderFamilies: Estado de loading:', loading.families);
                
                const familiesContainer = document.getElementById('families');
                const loadingElement = document.getElementById('families-loading');
                
                console.log('🔄 renderFamilies: Contenedor encontrado:', familiesContainer);
                console.log('🔄 renderFamilies: Elemento de loading encontrado:', loadingElement);
                
                if (loading.families) {
                  console.log('🔄 renderFamilies: Mostrando loading');
                  if (loadingElement) loadingElement.style.display = 'block';
                  return;
                }
                
                if (loadingElement) loadingElement.style.display = 'none';
                
                if (!familiesContainer) {
                  console.error('No se encontró el contenedor de familias');
                  return;
                }
                
                let familiesHTML = '';
                
                // Filtrar familias basado en la búsqueda (como en el componente React)
                const searchFamiliaTerm = document.getElementById('familia-search')?.value || '';
                const filteredFamilies = families.filter(familia => 
                  familia.nombre.toLowerCase().includes(searchFamiliaTerm.toLowerCase())
                );
                
                console.log('🔄 renderFamilies: Familias filtradas:', filteredFamilies);
                
                filteredFamilies.forEach(familia => {
                  const isActive = selectedFamilia === familia.id;
                  
                  familiesHTML += '<div class="productCatalog-familia-item ' + (isActive ? 'active' : '') + '" data-familia-id="' + familia.id + '" style=" text-align: left; padding: 10px 12px; border-radius: 8px; transition: all 0.2s; fontSize: 14px; cursor: pointer; backgroundColor: ' + (isActive ? '#e0241b' : 'transparent') + '; color: ' + (isActive ? 'white' : '#374151') + '; boxShadow: ' + (isActive ? '0 1px 3px rgba(0,0,0,0.1)' : 'none') + '; margin-bottom: 4px;">' +
                    '<span>' + familia.nombre + '</span>' +
                  '</div>';
                });
                
                console.log('🔄 renderFamilies: HTML generado:', familiesHTML);
                familiesContainer.innerHTML = familiesHTML;
                addFamiliaEventListeners();
                
                console.log('🔄 renderFamilies: Renderizado completado');
              }
              
              function renderCollections() {
                console.log('🔄 renderCollections: Iniciando renderizado');
                console.log('🔄 renderCollections: Colecciones disponibles:', collections);
                console.log('🔄 renderCollections: Estado de loading:', loading.collections);
                
                const collectionsContainer = document.getElementById('collections');
                const loadingElement = document.getElementById('collections-loading');
                
                console.log('🔄 renderCollections: Contenedor encontrado:', collectionsContainer);
                console.log('🔄 renderCollections: Elemento de loading encontrado:', loadingElement);
                
                if (!collectionsContainer) {
                  console.error('Collections container no encontrado');
                  return;
                }
                
                if (!loadingElement) {
                  console.error('Loading element no encontrado, continuando sin loading');
                  // Continuar sin el loading element
                }
                
                if (loading.collections) {
                  if (loadingElement) {
                    loadingElement.style.display = 'block';
                  }
                  return;
                }
                
                if (loadingElement) loadingElement.style.display = 'none';
                
                let collectionsHTML = '';
                
                collections.forEach(collection => {
                  const isActive = selectedCollection === collection.id;
                  collectionsHTML += '<button class="productCatalog-collection-btn ' + (isActive ? 'active' : '') + '" data-collection-id="' + collection.id + '" style="padding: 8px 16px; border-radius: 8px; white-space: nowrap; transition: all 0.2s; font-size: 14px; font-weight: 500; border: none; cursor: pointer; backgroundColor: ' + (isActive ? '#e0241b' : '#f3f4f6') + '; color: ' + (isActive ? 'white' : '#374151') + '; boxShadow: ' + (isActive ? '0 1px 3px rgba(0,0,0,0.1)' : 'none') + ';">' +
                    collection.nombre +
                  '</button>';
                });
                
                console.log('🔄 renderCollections: HTML generado:', collectionsHTML);
                collectionsContainer.innerHTML = collectionsHTML;
                addCollectionEventListeners();
                
                console.log('🔄 renderCollections: Renderizado completado');
              }
              
              function renderProducts() {
                console.log('🔄 renderProducts: Iniciando renderizado');
                console.log('🔄 renderProducts: Productos disponibles:', filteredProducts);
                console.log('🔄 renderProducts: Estado de loading:', loading.products);
                
                const productsGrid = document.getElementById('products-grid');
                const productsCount = document.getElementById('products-count');
                const productsLoading = document.getElementById('products-loading');
                const noProducts = document.getElementById('no-products');
                const pagination = document.getElementById('pagination');
                const productsTitle = document.querySelector('#catalog .productCatalog-products-title');
                
                console.log('🔄 renderProducts: Contenedor de productos encontrado:', productsGrid);
                console.log('🔄 renderProducts: Contador de productos encontrado:', productsCount);
                console.log('🔄 renderProducts: Elemento de loading encontrado:', productsLoading);
                console.log('🔄 renderProducts: Elemento de no productos encontrado:', noProducts);
                console.log('🔄 renderProducts: Paginación encontrada:', pagination);
                console.log('🔄 renderProducts: Título encontrado:', productsTitle);
                
                if (!productsGrid) {
                  console.error('Products grid no encontrado');
                  return;
                }
                
                if (!productsLoading || !noProducts || !pagination) {
                  console.error('Algunos elementos de products no encontrados, continuando sin ellos');
                  // Continuar sin estos elementos
                }
                
                if (loading.products) {
                  if (productsLoading) productsLoading.style.display = 'block';
                  if (noProducts) noProducts.style.display = 'none';
                  if (pagination) pagination.style.display = 'none';
                  return;
                }
                
                if (productsLoading) productsLoading.style.display = 'none';
                
                if (filteredProducts.length === 0) {
                  if (noProducts) noProducts.style.display = 'block';
                  if (pagination) pagination.style.display = 'none';
                  if (productsCount) productsCount.textContent = '0 productos encontrados';
                  if (productsTitle) productsTitle.textContent = 'SELECCIONA UNA COLECCIÓN';
                  return;
                }
                
                if (noProducts) noProducts.style.display = 'none';
                if (pagination) pagination.style.display = 'flex';
                if (productsCount) productsCount.textContent = filteredProducts.length + ' productos encontrados';
                
                const selectedCollectionName = collections.find(c => c.id === selectedCollection)?.nombre || 'Todas las Colecciones';
                if (productsTitle) productsTitle.textContent = 'PRODUCTOS - ' + selectedCollectionName;
                
                let productsHTML = '';
                filteredProducts.forEach((product, index) => {
                  productsHTML += '<div class="item" data-product-id="' + (product.id || index) + '" style="cursor: pointer; background-color: white; border: 1px solid #f3f4f6; border-radius: 12px; transition: all 0.2s; box-shadow: 0 1px 3px rgba(0,0,0,0.1); height: auto;">' +
                    '<div class="img" style="aspect-ratio: 1/1; background-color: #f9fafb; overflow: hidden;">' +
                      '<img src="' + url_img + product.imagen + '" alt="' + product.descripcion + '" class="productCatalog-product-image" style="width: 100%; height: 100%; object-fit: cover; transition: transform 0.3s;" />' +
                    '</div>' +
                    '<div class="content" style="padding: 12px;">' +
                      '<p class="code" style="font-size: 12px; color: #6b7280; margin: 0 0 4px 0;">' + product.codigo + '</p>' +
                      '<p class="descripcion" style="font-weight: 500; color: #111827; font-size: 14px; margin: 0 0 8px 0; line-height: 1.3;">' + product.descripcion + '</p>' +
                      '<div class="product-actions" style="display: flex; gap: 8px; margin-top: 12px;">' +
                        '<button class="view-product-btn" data-product-id="' + (product.id || product.codigo || index) + '" onclick="handleViewProductClick(event, ' + JSON.stringify(product.id || product.codigo || index) + ')" style="flex: 1; padding: 8px 12px; background-color: #e0241b; color: white; border: none; border-radius: 6px; font-size: 12px; font-weight: 500; cursor: pointer; transition: all 0.2s;">Ver Detalles</button>' +
                      '</div>' +
                      (product.desabasto ? '<div class="desabasto" style="display: inline-block; padding: 2px 6px; font-size: 12px; font-weight: 500; background-color: #fee2e2; color: #dc2626; border-radius: 4px; margin-top: 4px;"><small>Agotado</small></small></div>' : '') +
                      (product.ultimas_piezas ? '<div class="ultima-piezas" style="display: inline-block; padding: 2px 6px; font-size: 12px; font-weight: 500; background-color: #fef3c7; color: #d97706; border-radius: 4px; margin-top: 4px;"><small>Últimas</small></div>' : '') +
                    '</div>' +
                  '</div>';
                });
                
                console.log('🔄 renderProducts: HTML generado para', filteredProducts.length, 'productos');
                productsGrid.innerHTML = productsHTML;
                updatePagination();
                addViewButtonsEventListeners();
                
                console.log('🔄 renderProducts: Renderizado completado');
              }
              
              function updatePagination() {
                const prevBtn = document.getElementById('prev-btn');
                const nextBtn = document.getElementById('next-btn');
                const pageInfo = document.getElementById('page-info');
                
                if (prevBtn) prevBtn.disabled = currentPage <= 1;
                if (nextBtn) nextBtn.disabled = filteredProducts.length < 50;
                if (pageInfo) pageInfo.textContent = 'Página ' + currentPage;
              }
              
              function addFamiliaEventListeners() {
                const familiaItems = document.querySelectorAll('#families .productCatalog-familia-item');
                
                
                familiaItems.forEach(item => {
                  // Usar onclick directamente como en React
                  item.onclick = async function() {
                    
                    const familiaId = parseInt(this.getAttribute('data-familia-id'));
                    
                    
                    if (selectedFamilia === familiaId) {
                      // Si ya está seleccionada, deseleccionar (exactamente como en React)
                      
                      selectedFamilia = null;
                      selectedCollection = null;
                      collections = [];
                      products = [];
                      currentPage = 1;
                      filteredProducts = [];
                      renderCollections();
                      renderProducts();
                    } else {
                      // Seleccionar nueva familia (exactamente como en React)
                      
                      currentPage = 1;
                      selectedFamilia = familiaId;
                      
                      // Aquí es donde se llama a loadCollections exactamente como en React
                      await loadCollections(familiaId);
                    }
                  };
                });
              }
              
              function addCollectionEventListeners() {
                const collectionButtons = document.querySelectorAll('#collections .productCatalog-collection-btn');
                
                
                collectionButtons.forEach(button => {
                  // Usar onclick directamente como en React
                  button.onclick = async function() {
                    
                    const collectionId = parseInt(this.getAttribute('data-collection-id'));
                    
                    
                    if (selectedCollection === collectionId) {
                      // Si ya está seleccionada, deseleccionar
                      
                      selectedCollection = null;
                      products = [];
                      filteredProducts = [];
                      currentPage = 1;
                      renderProducts();
                    } else {
                      // Seleccionar nueva colección
                      
                      selectedCollection = collectionId;
                      currentPage = 1;
                      // Aseguramos que page se actualice antes de que selectedCollection cambie
                      setTimeout(function() {
                        selectedCollection = collectionId;
                      }, 0);
                    }
                  };
                });
              }
              
              // Mobile Menu Toggle
              const mobileMenuBtn = document.getElementById('mobile-menu-btn');
              const sidebar = document.querySelector('#catalog .productCatalog-sidebar');
              
              if (mobileMenuBtn && sidebar) {
                mobileMenuBtn.addEventListener('click', function() {
                  sidebar.classList.toggle('mobile-open');
                  const isOpen = sidebar.classList.contains('mobile-open');
                  this.innerHTML = isOpen ? 
                    '<svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><line x1="18" y1="6" x2="6" y2="18"></line><line x1="6" y1="6" x2="18" y2="18"></line></svg>Cerrar' :
                    '<svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><line x1="3" y1="6" x2="21" y2="6"></line><line x1="3" y1="12" x2="21" y2="12"></line><line x1="3" y1="18" x2="21" y2="18"></line></svg>Familias';
                });
              }
              
              // Initialize
              document.addEventListener('DOMContentLoaded', function() {
                
                
                // Familia search
                const familiaSearch = document.getElementById('familia-search');
                if (familiaSearch) {
                  
                  familiaSearch.addEventListener('input', function(e) {
                    const searchTerm = e.target.value.toLowerCase();
                    const familiaItems = document.querySelectorAll('#families .productCatalog-familia-item');
                    familiaItems.forEach(item => {
                      const text = item.textContent.toLowerCase();
                      item.style.display = text.includes(searchTerm) ? 'block' : 'none';
                    });
                  });
                } else {
                  console.error('No se encontró familia search');
                }
                
                // Product search
                const productSearch = document.getElementById('product-search');
                if (productSearch) {
                  productSearch.addEventListener('input', function(e) {
                    searchTerm = e.target.value;
                  });
                  
                  productSearch.addEventListener('keyup', function(e) {
                    if (e.key === 'Enter') {
                      loadProductsByCodeOrDesc(e.currentTarget.value, 1);
                    }
                  });
                }
                
                // Search type
                const searchTypeSelect = document.getElementById('search-type');
                if (searchTypeSelect) {
                searchTypeSelect.addEventListener('change', function(e) {
                  searchType = parseInt(e.target.value);
                });
              }
              
                // Pagination
                const prevBtn = document.getElementById('prev-btn');
                const nextBtn = document.getElementById('next-btn');
                
                if (prevBtn) {
                  prevBtn.addEventListener('click', function() {
                    if (currentPage > 1) {
                      currentPage--;
                      if (searchTerm.length > 0) {
                        loadProductsByCodeOrDesc(searchTerm, currentPage);
                    } else {
                        loadProducts(selectedFamilia, selectedCollection, currentPage);
                      }
                    }
                  });
                }
                
                if (nextBtn) {
                  nextBtn.addEventListener('click', function() {
                    currentPage++;
                    if (searchTerm.length > 0) {
                      loadProductsByCodeOrDesc(searchTerm, currentPage);
                    } else {
                      loadProducts(selectedFamilia, selectedCollection, currentPage);
                    }
                  });
                }
                
                // Load initial data
                
              loadFamilies();
              });
              
              // useEffect equivalent - maneja las peticiones automáticamente
              function checkAndLoadProducts() {
                if (selectedFamilia !== null && selectedCollection !== null) {
                  if (searchTerm.length > 0) {
                    loadProductsByCodeOrDesc(searchTerm, currentPage);
                  } else {
                    loadProducts(selectedFamilia, selectedCollection, currentPage);
                  }
                }
              }
              
              // Simular useEffect para selectedFamilia, selectedCollection, page
              let lastSelectedFamilia = null;
              let lastSelectedCollection = null;
              let lastPage = 1;
              
              function updateProductsIfNeeded() {
                if (selectedFamilia !== lastSelectedFamilia || 
                    selectedCollection !== lastSelectedCollection || 
                    currentPage !== lastPage) {
                  
                  lastSelectedFamilia = selectedFamilia;
                  lastSelectedCollection = selectedCollection;
                  lastPage = currentPage;
                  
                  checkAndLoadProducts();
                }
              }
              
              // Modal functionality
              let modalArticle = null;
              let modalImgs = [];
              let modalLoading = false;
              let modalOpciones = [];
              let modalActiveIndex = null;
              let modalCurrentImageIndex = 0;
              let isModalOpen = false;

              // Modal functions
              async function fetchModalArticleData(articleId) {
                const data = {
                  id: articleId,
                  activos: true,
                  nombre: '',
                  codigo: '',
                  familia: 0,
                  proveedor: 0,
                  materia_prima: 0,
                  get_sucursales: false,
                  get_imagenes: true,
                  get_proveedores: false,
                  get_max_mins: false,
                  get_precios: true,
                  get_combinaciones: true,
                  get_plantilla_data: true,
                  get_areas_produccion: true,
                  get_tiempos_entrega: false,
                  get_componentes: false,
                  get_stock: false,
                  get_web: false,
                  for_ventas: true,
                  get_unidades: true,
                  id_usuario: 106, // Valor fijo para id_usuario
                  id_grupo_us: false
                };
                
                try {
                  const response = await fetch('http://hiplot.dyndns.org:84/cotizador_api/index.php/mantenimiento/get_articulos', {
                    method: 'POST',
                    headers: {
                      'Content-Type': 'application/json',
                    },
                    body: JSON.stringify(data)
                  });
                  
                  const result = await response.json();
                  
                  if (!result || result.length === 0) {
                    throw new Error('No se encontraron artículos');
                  }
                  
                  const art = result[0];
                  
                  let plantillaData = art.plantilla_data || [];
                  plantillaData = plantillaData.map((item) => ({
                    ...item,
                    id_plantillas_art_campos: item.id,
                  }));
                  
                  const articleData = { ...art, plantilla_data: plantillaData };
                  return articleData;
                } catch (error) {
                  return null;
                }
              }

              async function updateModalUI(article) {
                modalArticle = article;
                
                // Load images
                try {
                  const imgResponse = await fetch('http://hiplot.dyndns.org:84/api_dev_mode/articulo_imagenes_get/' + article.id);
                  const imgResult = await imgResponse.json();
                  modalImgs = imgResult || [];
                } catch (error) {
                  modalImgs = [];
                }

                // Load combinations
                if (article.opciones_de_variacion2 && article.opciones_de_variacion2.length > 0) {
                  modalOpciones = article.opciones_de_variacion2.map((combinacion) => ({
                    combinacion: combinacion.combinacion,
                    OpcionSelected: "",
                    opciones: combinacion.opciones || []
                  }));
                } else {
                  modalOpciones = [];
                }

                modalCurrentImageIndex = 0;
                modalActiveIndex = null;
                isModalOpen = true;
                renderModal();
              }

              function showModal() {
                const modal = document.getElementById('modal');
                if (modal) {
                  modal.style.display = 'flex';
                  modal.style.visibility = 'visible';
                  modal.style.opacity = '1';
                }
              }

              function showLoadingModal() {
                const modal = document.getElementById('modal');
                if (modal) {
                  modal.style.display = 'flex';
                  modal.style.visibility = 'visible';
                  modal.style.opacity = '1';
                  modal.innerHTML = '<div class="product-modal-overlay" style="position: fixed; top: 0; left: 0; right: 0; bottom: 0; background-color: rgba(0, 0, 0, 0.5); display: flex; justify-content: center; align-items: center; z-index: 1000; padding: 1rem;"><div class="product-modal-content" style="background: white; border-radius: 16px; max-width: 400px; width: 100%; padding: 2rem; text-align: center;"><div style="margin-bottom: 1rem;"><div class="loading-spinner" style="width: 40px; height: 40px; border: 4px solid #f3f4f6; border-top: 4px solid #e0241b; border-radius: 50%; animation: spin 1s linear infinite; margin: 0 auto;"></div></div><h3 style="color: #374151; margin-bottom: 0.5rem;">Cargando producto...</h3><p style="color: #6b7280; font-size: 0.875rem;">Por favor espera mientras se cargan los detalles</p></div></div>';
                }
              }

              function showErrorModal(message) {
                const modal = document.getElementById('modal');
                if (modal) {
                  modal.style.display = 'flex';
                  modal.style.visibility = 'visible';
                  modal.style.opacity = '1';
                  modal.innerHTML = '<div class="product-modal-overlay" style="position: fixed; top: 0; left: 0; right: 0; bottom: 0; background-color: rgba(0, 0, 0, 0.5); display: flex; justify-content: center; align-items: center; z-index: 1000; padding: 1rem;"><div class="product-modal-content" style="background: white; border-radius: 16px; max-width: 500px; width: 100%; padding: 2rem;"><h2 style="color: #dc2626; margin-bottom: 1rem;">Error</h2><p style="color: #374151; margin-bottom: 1.5rem;">' + message + '</p><button onclick="hideModal()" style="padding: 8px 16px; background: #e0241b; color: white; border: none; border-radius: 6px; cursor: pointer;">Cerrar</button></div></div>';
                }
              }

              function hideModal() {
                const modal = document.getElementById('modal');
                if (modal) {
                  modal.style.display = 'none';
                  modal.style.visibility = 'hidden';
                  modal.style.opacity = '0';
                }
                isModalOpen = false;
                modalArticle = null;
                modalImgs = [];
                modalOpciones = [];
                modalActiveIndex = null;
                modalCurrentImageIndex = 0;
              }

              // Fetch2 function for combinations - CORREGIDO según CatalogSection.jsx
              async function fetch2(selectedIds) {
                const data = {
                  id: 0,
                  activos: true,
                  nombre: '',
                  codigo: '',
                  familia: 0,
                  proveedor: 0,
                  materia_prima: 0,
                  get_sucursales: false,
                  get_imagenes: false,
                  get_proveedores: false,
                  get_max_mins: false,
                  get_precios: false,
                  get_combinaciones: true,
                  get_plantilla_data: true,
                  get_areas_produccion: true,
                  get_tiempos_entrega: false,
                  get_componentes: false,
                  get_stock: false,
                  get_web: false,
                  for_ventas: true,
                  get_unidades: true,
                  id_usuario: 106,
                  por_combinacion: true,
                  opciones: selectedIds,
                  id_articulo_variacion: modalArticle.id
                };

                try {
                  modalLoading = true;
                  renderModal();
                  
                  let resp = await fetch(
                    "http://hiplot.dyndns.org:84/cotizador_api/index.php/mantenimiento/get_articulos",
                    {
                      method: 'POST',
                      headers: { "Content-Type": "application/json" },
                      body: JSON.stringify(data)
                    }
                  );
                  
                  const response = await resp.json();
                  
                  if (response && response.length > 0) {
                    const newArticle = response[0];
                    
                    // Actualizar el artículo con la nueva información
                    modalArticle = newArticle;
                    
                    // Recargar imágenes del nuevo artículo
                    try {
                      const imgResponse = await fetch('http://hiplot.dyndns.org:84/api_dev_mode/articulo_imagenes_get/' + newArticle.id);
                      const imgResult = await imgResponse.json();
                      modalImgs = imgResult || [];
                    } catch (error) {
                      modalImgs = [];
                    }
                    
                    // Si el artículo tiene nuevas combinaciones, actualízalas
                    if (newArticle.opciones_de_variacion2 && newArticle.opciones_de_variacion2.length > 0) {
                      const combinacionesConfiguradas = newArticle.opciones_de_variacion2.map((combinacion) => ({
                        combinacion: combinacion.combinacion,
                        OpcionSelected: "",
                        opciones: combinacion.opciones || []
                      }));
                      modalOpciones = combinacionesConfiguradas;
                    }
                  }

                } catch (error) {
                  console.error('Error fetching data:', error);
                } finally {
                  modalLoading = false;
                  renderModal();
                }
              }

              function areAllCombinationsSelected() {
                return modalOpciones.some((combinacion) => 
                  combinacion.OpcionSelected && combinacion.OpcionSelected !== ""
                );
              }

              function getSelectedIds() {
                const selectedIds = [];
                modalOpciones.forEach((combinacion) => {
                  const selectedOption = combinacion.opciones.find((option) => option.selected);
                  if (selectedOption) {
                    selectedIds.push(selectedOption.id);
                  }
                });
                return selectedIds;
              }

              async function BuscarArticuloPorCombinacion() {
                // Cambiar la lógica: ejecutar con al menos una selección, no todas
                const hasAnySelection = modalOpciones.some((combinacion) => 
                  combinacion.OpcionSelected && combinacion.OpcionSelected !== ""
                );
                
                if (!hasAnySelection) {
                  return;
                }

                const selectedIds = getSelectedIds();
                
                if (!modalArticle?.id) {
                  return;
                }
                
                await fetch2(selectedIds);
              }

              function handleModalCombinacionClick(index) {
                modalActiveIndex = modalActiveIndex === index ? null : index;
                renderModal();
              }

              function handleModalOptionSelect(combinacionIndex, optionId) {
                // Actualizar las opciones según CatalogSection.jsx
                const newOpciones = modalOpciones.map((combinacion, index) => {
                  if (index === combinacionIndex) {
                    const updatedOpciones = combinacion.opciones.map((option) => ({
                      ...option,
                      selected: option.id === optionId
                    }));
                    
                    const selectedOption = updatedOpciones.find((opt) => opt.id === optionId);
                    
                    return {
                      ...combinacion,
                      opciones: updatedOpciones,
                      OpcionSelected: selectedOption ? selectedOption.nombre : ""
                    };
                  }
                  return combinacion;
                });
                
                // Actualizar el estado
                modalOpciones = newOpciones;
                
                // Verificar si hay al menos una opción seleccionada después de la actualización
                const hasSelection = newOpciones.some((combinacion) => 
                  combinacion.OpcionSelected && combinacion.OpcionSelected !== ""
                );
                
                // Si hay al menos una selección, ejecutar búsqueda automáticamente
                if (hasSelection) {
                  setTimeout(() => {
                    BuscarArticuloPorCombinacion();
                  }, 100); // Pequeño delay para asegurar que el estado se actualice
                }
                
                modalActiveIndex = null;
                renderModal();
              }

              function renderModal() {
                const modal = document.getElementById('modal');
                if (!modal) {
                  return;
                }

                if (isModalOpen && modalArticle) {
                  let modalHTML = '<div class="product-modal-overlay" style="position: fixed; top: 0; left: 0; right: 0; bottom: 0; background-color: rgba(0, 0, 0, 0.5); display: flex; justify-content: center; align-items: center; z-index: 1000; padding: 1rem;">';
                  modalHTML += '<div class="product-modal-content" style="background: white; border-radius: 16px; max-width: 900px; width: 100%; max-height: 90vh; overflow: hidden; box-shadow: 0 20px 25px -5px rgba(0, 0, 0, 0.1), 0 10px 10px -5px rgba(0, 0, 0, 0.04);">';
                  modalHTML += '<div class="product-modal-header" style="display: flex; justify-content: space-between; align-items: center; padding: 1.5rem 2rem; border-bottom: 1px solid #e2e8f0; background: linear-gradient(135deg, #f8fafc 0%, #f1f5f9 100%);">';
                  modalHTML += '<h2 class="product-modal-title" style="font-size: 1.25rem; font-weight: 700; color: #0f172a; margin: 0;">Detalles del Producto</h2>';
                  modalHTML += '<button class="product-modal-close" onclick="hideModal()" style="background: none; border: none; color: #64748b; cursor: pointer; padding: 0.5rem; border-radius: 8px; transition: all 0.2s ease; display: flex; align-items: center; justify-content: center;">✕</button>';
                  modalHTML += '</div>';
                  
                  modalHTML += '<div class="product-modal-body" style="display: flex; max-height: calc(90vh - 80px); overflow: hidden;">';
                  modalHTML += '<div class="product-modal-image-section" style="flex: 1; max-width: 400px; background: #f8fafc; position: relative;">';
                  modalHTML += '<div class="product-modal-image-container" style="position: relative; width: 100%; height: 100%; display: flex; align-items: center; justify-content: center; padding: 2rem;">';
                  modalHTML += '<img src="' + url_img + (modalImgs.length > 0 ? modalImgs[modalCurrentImageIndex]?.img_url : modalArticle.imagen) + '" alt="' + modalArticle.nombre + '" class="product-modal-image" style="max-width: 100%; max-height: 100%; object-fit: contain; border-radius: 12px; box-shadow: 0 4px 6px -1px rgba(0, 0, 0, 0.1);" />';
                  modalHTML += '</div>';
                  modalHTML += '</div>';
                  
                  modalHTML += '<div class="product-modal-info-section" style="flex: 1; padding: 2rem; overflow-y: auto;">';
                  modalHTML += '<div class="product-header" style="margin-bottom: 1.5rem;">';
                  modalHTML += '<h3 class="product-title" style="font-size: 1.5rem; font-weight: 700; color: #0f172a; margin-bottom: 0.5rem;">' + modalArticle.nombre + '</h3>';
                  modalHTML += '<p class="product-code" style="color: #64748b; font-size: 0.875rem; margin-bottom: 1rem;">Código: ' + modalArticle.codigo + '</p>';
                  modalHTML += '</div>';
                  
                  modalHTML += '<div class="product-description" style="margin-bottom: 2rem; color: #475569; line-height: 1.6;">' + (modalArticle.descripcion || 'Sin descripción disponible') + '</div>';
                  
                  modalHTML += '<div class="product-details" style="margin-bottom: 2rem;">';
                  modalHTML += '<h4 style="font-size: 1.125rem; font-weight: 600; color: #0f172a; margin-bottom: 1rem; padding-bottom: 0.5rem; border-bottom: 2px solid #e2e8f0;">Combinaciones Disponibles</h4>';
                  
                  modalOpciones.forEach((combinacion, index) => {
                    modalHTML += '<div class="combinaciones__container" style="margin-bottom: 1.25rem;">';
                    modalHTML += '<div class="container__combination" onclick="handleModalCombinacionClick(' + index + ')" style="cursor: pointer; transition: all 0.2s ease; border-radius: 8px; padding: 14px 16px; font-weight: 500; display: flex; align-items: center; justify-content: space-between; border: 1px solid #e2e8f0; background: white; position: relative;">';
                    modalHTML += '<span>' + (combinacion.OpcionSelected && combinacion.OpcionSelected !== "" ? combinacion.OpcionSelected : combinacion.combinacion) + '</span>';
                    modalHTML += '</div>';
                    
                    if (modalActiveIndex === index) {
                      modalHTML += '<div class="combination_options" style="margin-top: 0.75rem; padding: 1rem; background: white; border-radius: 8px; border: 1px solid #e2e8f0;">';
                      modalHTML += '<div class="options-grid" style="display: grid; grid-template-columns: repeat(auto-fit, minmax(120px, 1fr)); gap: 0.75rem;">';
                      
                      combinacion.opciones.forEach((option) => {
                        modalHTML += '<div class="option-item" onclick="handleModalOptionSelect(' + index + ', ' + option.id + ')" style="display: flex; align-items: center; justify-content: center; padding: 0.625rem 0.875rem; border: 1px solid #e2e8f0; border-radius: 6px; cursor: pointer; transition: all 0.2s ease; background: white; font-weight: 500; text-align: center; min-height: 40px;">';
                        
                        if (option.tipo === "2") {
                          modalHTML += '<div class="color-option" style="display: flex; align-items: center; justify-content: center; width: 100%;">';
                          modalHTML += '<div class="tooltip-container" style="position: relative; display: inline-block;">';
                          modalHTML += '<div class="color-swatch" style="width: 24px; height: 24px; border: 2px solid #e2e8f0; border-radius: 6px; box-shadow: 0 2px 4px rgba(0, 0, 0, 0.1); transition: all 0.3s ease; background-color: ' + option.color + ';"></div>';
                          modalHTML += '<span class="tooltip-text" style="visibility: hidden; width: 120px; background-color: #555; color: #fff; text-align: center; border-radius: 6px; padding: 5px; position: absolute; z-index: 1; bottom: 125%; left: 50%; margin-left: -60px; opacity: 0; transition: opacity 0.3s; font-size: 0.75rem;">' + option.nombre + '</span>';
                          modalHTML += '</div>';
                          modalHTML += '</div>';
                        } else {
                          modalHTML += '<span class="option-text" style="font-size: 0.875rem; font-weight: 500;">' + option.nombre + '</span>';
                        }
                        
                        modalHTML += '</div>';
                      });
                      
                      modalHTML += '</div>';
                      modalHTML += '</div>';
                    }
                    
                    modalHTML += '</div>';
                  });
                  
                  modalHTML += '</div>';
                  
                  if (modalLoading) {
                    modalHTML += '<div class="search__sale-card" style="display: flex; align-items: center; justify-content: center; gap: 0.5rem; background: #941e1e; color: white; padding: 0.875rem 1.25rem; border-radius: 8px; font-weight: 500; font-size: 0.875rem; margin-top: 1rem; border: none;">';
                    modalHTML += '<div class="loading-spinner"></div>';
                    modalHTML += 'Buscando artículo con combinaciones...';
                    modalHTML += '</div>';
                  }
                  
                  modalHTML += '</div>';
                  modalHTML += '</div>';
                  modalHTML += '</div>';
                  modalHTML += '</div>';
                  
                  modal.innerHTML = modalHTML;
                } else {
                  modal.innerHTML = '';
                }
              }

              // Add modal container to the page - Mejorado para asegurar que se cree correctamente
              function initializeModal() {
                let modalContainer = document.getElementById('modal');
                if (!modalContainer) {
                  modalContainer = document.createElement('div');
                  modalContainer.id = 'modal';
                  modalContainer.style.position = 'fixed';
                  modalContainer.style.top = '0';
                  modalContainer.style.left = '0';
                  modalContainer.style.width = '100%';
                  modalContainer.style.height = '100%';
                  modalContainer.style.zIndex = '9999';
                  modalContainer.style.display = 'none';
                  modalContainer.style.visibility = 'hidden';
                  modalContainer.style.opacity = '0';
                  modalContainer.style.transition = 'opacity 0.3s ease';
                  document.body.appendChild(modalContainer);
                }
                return modalContainer;
              }

              // Inicializar modal al cargar
              initializeModal();

              // Add view product button event listeners - Mejorado para ser más robusto
              function addViewButtonsEventListeners() {
                // Ya no necesitamos esta función porque usamos onclick directo en el HTML
              }

              // Función para inicializar todo el sistema de modales
              function initializeModalSystem() {
                // Asegurar que el modal container existe
                initializeModal();
                
                // Agregar event listeners para los botones
                addViewButtonsEventListeners();
                
                // Agregar event listener para cerrar modal al hacer clic fuera
                document.addEventListener('click', function(e) {
                  const modal = document.getElementById('modal');
                  if (modal && modal.style.display === 'flex' && e.target === modal) {
                    hideModal();
                  }
                });
                
                // Agregar event listener para cerrar modal con ESC
                document.addEventListener('keydown', function(e) {
                  if (e.key === 'Escape') {
                    hideModal();
                  }
                });
              }



              // Función separada para manejar el click del botón
              async function handleViewProductClick(e, productId) {
                console.log('handleViewProductClick called with:', productId);
                e.stopPropagation();
                e.preventDefault();
                
                if (!productId) {
                  console.log('No productId provided');
                  return;
                }
                
                // Convertir a string si es necesario
                const id = String(productId);
                console.log('Processing ID:', id);
                
                // Mostrar loading inmediatamente
                console.log('Showing loading modal...');
                showLoadingModal();
                
                try {
                  console.log('Fetching article data...');
                  const article = await fetchModalArticleData(id);
                  console.log('Article data received:', article);
                  if (article) {
                    console.log('Updating modal UI...');
                    await updateModalUI(article);
                    console.log('Showing modal...');
                    showModal();
                  } else {
                    console.log('No article data found');
                    showErrorModal('No se pudo cargar la información del producto');
                  }
                } catch (error) {
                  console.error('Error in handleViewProductClick:', error);
                  showErrorModal('Error al cargar el producto: ' + error.message);
                }
              }

              // Hacer las funciones globales para que funcionen en el HTML exportado
              window.hideModal = hideModal;
              window.showModal = showModal;
              window.showLoadingModal = showLoadingModal;
              window.showErrorModal = showErrorModal;
              window.handleModalCombinacionClick = handleModalCombinacionClick;
              window.handleModalOptionSelect = handleModalOptionSelect;
              window.handleViewProductClick = handleViewProductClick;
              


              // Verificar cambios cada 100ms
              setInterval(updateProductsIfNeeded, 100);
              
              // Inicializar el sistema de modales cuando el DOM esté listo
              if (document.readyState === 'loading') {
                document.addEventListener('DOMContentLoaded', function() {
                  setTimeout(initializeModalSystem, 100);
                });
              } else {
                setTimeout(initializeModalSystem, 100);
              }
            })();
          </script>
        `;

      default:
        return `<div style="${fullStyles}">${props?.content || props?.text || ''}</div>`;
    }
  };

  const sectionHTML = elements.map(element => elementToHTML(element)).join('');

  return `
    <section id="section-${section.id}" class="website-section" style="position: relative; min-height: 100vh; width: 100%; max-width: 1450px; margin: 0 auto; overflow: visible;">
      ${sectionHTML}
    </section>
  `;
};

export const generateFullWebsite = (sections, activeSection = 'home', id_sucursal = null) => {
  const sectionsArray = Object.values(sections);
  const homeSection = sectionsArray.find(s => s.isHome) || sectionsArray[0];

  // Usar id_sucursal si está disponible, sino usar el userId hardcodeado como fallback
  const sucursalId = id_sucursal || 106;
  
  console.log('🔄 generateFullWebsite: Usando sucursalId para catálogo:', {
    sucursalId,
    id_sucursal,
    fallbackUserId: 106,
    note: 'El catálogo usará siempre id_usuario: 106'
  });
  
  console.log('🔄 generateFullWebsite: id_sucursal que se pasará al catálogo:', id_sucursal);
  console.log('🔄 generateFullWebsite: Generando HTML con secciones:', sectionsArray.length);

  const sectionsHTML = sectionsArray.map(section =>
    generateSectionHTML(section, sections, sucursalId)
  ).join('');

  return `<!DOCTYPE html>
<html lang="es">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>Mi Sitio Web</title>
    <link rel="preconnect" href="https://fonts.googleapis.com">
    <link rel="preconnect" href="https://fonts.gstatic.com" crossorigin>
    <link href="https://fonts.googleapis.com/css2?family=Poppins:wght@300;400;500;600;700;800&family=Inter:wght@300;400;500;600;700&family=Roboto:wght@300;400;500;700&family=Montserrat:wght@300;400;500;600;700&family=Lato:wght@300;400;700&family=Oswald:wght@300;400;500;600;700&family=Merriweather:wght@300;400;700&family=Nunito:wght@300;400;500;600;700&family=Raleway:wght@300;400;500;600;700&family=Playfair+Display:wght@400;500;600;700&family=Fira+Sans:wght@300;400;500;600;700&family=Ubuntu:wght@300;400;500;700&family=Quicksand:wght@300;400;500;600;700&family=Rubik:wght@300;400;500;600;700&family=Bebas+Neue&display=swap" rel="stylesheet">
                <style>
              @keyframes spin {
                0% { transform: rotate(0deg); }
                100% { transform: rotate(360deg); }
              }
              
              .loading-spinner {
                width: 20px;
                height: 20px;
                border: 2px solid #f3f4f6;
                border-top: 2px solid #e0241b;
                border-radius: 50%;
                animation: spin 1s linear infinite;
              }
              
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
            position: relative;
            min-height: 100vh;
            width: 100%;
            max-width: 1450px;
            margin: 0 auto;
            overflow: visible;
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
        
        /* Modal Styles for Export */
        #modal {
            position: fixed;
            top: 0;
            left: 0;
            width: 100%;
            height: 100%;
            z-index: 9999;
            display: none;
            visibility: hidden;
            opacity: 0;
            transition: opacity 0.3s ease;
        }
        
        .product-modal-overlay {
            position: fixed;
            top: 0;
            left: 0;
            right: 0;
            bottom: 0;
            background-color: rgba(0, 0, 0, 0.5);
            display: flex;
            justify-content: center;
            align-items: center;
            z-index: 1000;
            padding: 1rem;
        }
        
        .product-modal-content {
            background: white;
            border-radius: 16px;
            max-width: 900px;
            width: 100%;
            max-height: 90vh;
            overflow: hidden;
            box-shadow: 0 20px 25px -5px rgba(0, 0, 0, 0.1), 0 10px 10px -5px rgba(0, 0, 0, 0.04);
            animation: modalSlideIn 0.3s ease-out;
        }
        
        @keyframes modalSlideIn {
            from {
                opacity: 0;
                transform: scale(0.9) translateY(-20px);
            }
            to {
                opacity: 1;
                transform: scale(1) translateY(0);
            }
        }
        
        .product-modal-header {
            display: flex;
            justify-content: space-between;
            align-items: center;
            padding: 1.5rem 2rem;
            border-bottom: 1px solid #e2e8f0;
            background: linear-gradient(135deg, #f8fafc 0%, #f1f5f9 100%);
        }
        
        .product-modal-title {
            font-size: 1.25rem;
            font-weight: 700;
            color: #0f172a;
            margin: 0;
        }
        
        .product-modal-close {
            background: none;
            border: none;
            color: #64748b;
            cursor: pointer;
            padding: 0.5rem;
            border-radius: 8px;
            transition: all 0.2s ease;
            display: flex;
            align-items: center;
            justify-content: center;
        }
        
        .product-modal-close:hover {
            background-color: #f1f5f9;
            color: #0f172a;
        }
        
        .product-modal-body {
            display: flex;
            max-height: calc(90vh - 80px);
            overflow: hidden;
        }
        
        .product-modal-image-section {
            flex: 1;
            max-width: 400px;
            background: #f8fafc;
            position: relative;
        }
        
        .product-modal-image-container {
            position: relative;
            width: 100%;
            height: 100%;
            display: flex;
            align-items: center;
            justify-content: center;
            padding: 2rem;
        }
        
        .product-modal-image {
            max-width: 100%;
            max-height: 100%;
            object-fit: contain;
            border-radius: 12px;
            box-shadow: 0 4px 6px -1px rgba(0, 0, 0, 0.1);
            transition: opacity 0.3s ease;
        }
        
        .product-modal-info-section {
            flex: 1;
            padding: 2rem;
            overflow-y: auto;
            display: flex;
            flex-direction: column;
            gap: 2rem;
        }
        
        .product-header {
            display: flex;
            flex-direction: column;
            gap: 0.5rem;
        }
        
        .product-code {
            font-size: 0.75rem;
            color: #64748b;
            font-weight: 600;
            text-transform: uppercase;
            letter-spacing: 0.05em;
        }
        
        .product-name {
            font-size: 1.75rem;
            font-weight: 700;
            color: #0f172a;
            margin: 0;
            line-height: 1.2;
        }
        
        .product-description {
            background: #f8fafc;
            padding: 1.5rem;
            border-radius: 12px;
            border-left: 4px solid #941e1e;
        }
        
        .product-description p {
            font-size: 0.875rem;
            color: #475569;
            line-height: 1.6;
            margin: 0;
        }
        
        .product-details {
            display: flex;
            flex-direction: column;
            gap: 1rem;
        }
        
        .detail-item {
            display: flex;
            justify-content: space-between;
            align-items: center;
            padding: 1rem 1.5rem;
            background: #f8fafc;
            border-radius: 8px;
            border: 1px solid #e2e8f0;
            transition: all 0.2s ease;
        }
        
        .detail-item:hover {
            background: #f1f5f9;
            border-color: #cbd5e1;
        }
        
        .detail-item.price {
            background: linear-gradient(135deg, #f0fdf4 0%, #ecfdf5 100%);
            border-color: #10b981;
        }
        
        .detail-item.price:hover {
            background: linear-gradient(135deg, #ecfdf5 0%, #d1fae5 100%);
        }
        
        .detail-label {
            font-size: 0.875rem;
            font-weight: 600;
            color: #64748b;
            text-transform: uppercase;
            letter-spacing: 0.05em;
        }
        
        .detail-value {
            font-size: 0.875rem;
            font-weight: 500;
            color: #0f172a;
        }
        
        .detail-value.price-value {
            font-size: 1.25rem;
            font-weight: 700;
            color: #10b981;
        }
        
        /* Combinaciones */
        .combinaciones {
            background: #f8fafc;
            padding: 1.5rem;
            border-radius: 12px;
            border: 1px solid #e2e8f0;
            margin-bottom: 1.5rem;
        }
        
        .combinaciones h4 {
            font-size: 1.25rem;
            font-weight: 700;
            color: #0f172a;
            margin: 0 0 1.5rem 0;
            padding-bottom: 0.75rem;
            border-bottom: 2px solid #e2e8f0;
        }
        
        .combinaciones__container {
            margin-bottom: 1.25rem;
        }
        
        .container__combination {
            cursor: pointer;
            transition: all 0.2s ease;
            border-radius: 8px;
            padding: 14px 16px;
            font-weight: 500;
            display: flex;
            align-items: center;
            justify-content: space-between;
            border: 1px solid #e2e8f0;
            background: white;
            position: relative;
        }
        
        .container__combination:hover {
            border-color: #941e1e;
            background-color: #fef2f2;
        }
        
        .container__combination.selected {
            background: #941e1e;
            color: white;
            border-color: #941e1e;
        }
        
        .container__combination.selected::after {
            content: "✓";
            position: absolute;
            right: 16px;
            font-size: 1rem;
            font-weight: bold;
        }
        
        .combination_options {
            margin-top: 0.75rem;
            padding: 1rem;
            background: white;
            border-radius: 8px;
            border: 1px solid #e2e8f0;
            animation: slideDown 0.2s ease;
        }
        
        @keyframes slideDown {
            from {
                opacity: 0;
                transform: translateY(-8px);
            }
            to {
                opacity: 1;
                transform: translateY(0);
            }
        }
        
        .options-grid {
            display: grid;
            grid-template-columns: repeat(auto-fit, minmax(120px, 1fr));
            gap: 0.75rem;
        }
        
        .option-item {
            display: flex;
            align-items: center;
            justify-content: center;
            padding: 0.625rem 0.875rem;
            border: 1px solid #e2e8f0;
            border-radius: 6px;
            cursor: pointer;
            transition: all 0.2s ease;
            background: white;
            font-weight: 500;
            text-align: center;
            min-height: 40px;
        }
        
        .option-item:hover {
            border-color: #941e1e;
            background: #fef2f2;
        }
        
        .option-item.selected {
            background: #941e1e;
            color: white;
            border-color: #941e1e;
        }
        
        .option-item.selected::after {
            content: "✓";
            margin-left: 0.5rem;
            font-weight: bold;
        }
        
        .color-option {
            display: flex;
            align-items: center;
            justify-content: center;
            width: 100%;
        }
        
        .color-swatch {
            width: 24px;
            height: 24px;
            border: 2px solid #e2e8f0;
            border-radius: 6px;
            box-shadow: 0 2px 4px rgba(0, 0, 0, 0.1);
            transition: all 0.3s ease;
        }
        
        .option-item:hover .color-swatch {
            border-color: #941e1e;
            transform: scale(1.1);
        }
        
        .option-item.selected .color-swatch {
            border-color: white;
            box-shadow: 0 0 0 2px rgba(255, 255, 255, 0.3);
        }
        
        .option-text {
            font-size: 0.875rem;
            font-weight: 500;
        }
        
        .tooltip-container {
            position: relative;
            display: inline-block;
        }
        
        .tooltip-text {
            visibility: hidden;
            width: 120px;
            background-color: #555;
            color: #fff;
            text-align: center;
            border-radius: 6px;
            padding: 5px;
            position: absolute;
            z-index: 1;
            bottom: 125%;
            left: 50%;
            margin-left: -60px;
            opacity: 0;
            transition: opacity 0.3s;
            font-size: 0.75rem;
        }
        
        .tooltip-container:hover .tooltip-text {
            visibility: visible;
            opacity: 1;
        }
        
        .search__sale-card {
            display: flex;
            align-items: center;
            justify-content: center;
            gap: 0.5rem;
            background: #941e1e;
            color: white;
            padding: 0.875rem 1.25rem;
            border-radius: 8px;
            cursor: pointer;
            font-weight: 500;
            font-size: 0.875rem;
            transition: all 0.2s ease;
            margin-top: 1rem;
            border: none;
        }
        
        .search__sale-card:hover {
            background: #7a1818;
        }
        
        .search__sale-card.disabled {
            background: #94a3b8;
            cursor: not-allowed;
        }
        
        .search__sale-card.disabled:hover {
            background: #94a3b8;
        }
        
        .loading-spinner {
            width: 16px;
            height: 16px;
            border: 2px solid rgba(255, 255, 255, 0.3);
            border-top: 2px solid white;
            border-radius: 50%;
            animation: spin 1s linear infinite;
            margin-right: 8px;
        }
        
        @keyframes spin {
            0% { transform: rotate(0deg); }
            100% { transform: rotate(360deg); }
        }
        
        /* Responsive Modal */
        @media (max-width: 768px) {
            .product-modal-content {
                max-width: 95vw;
                max-height: 95vh;
            }
            
            .product-modal-body {
                flex-direction: column;
                max-height: calc(95vh - 80px);
            }
            
            .product-modal-image-section {
                max-width: 100%;
                max-height: 300px;
            }
            
            .product-modal-image-container {
                padding: 1rem;
            }
            
            .product-modal-info-section {
                padding: 1.5rem;
                gap: 1rem;
            }
        }
        
        @media (max-width: 480px) {
            .product-modal-header {
                padding: 1rem 1.5rem;
            }
            
            .product-modal-title {
                font-size: 1.125rem;
            }
            
            .product-modal-info-section {
                padding: 1rem;
            }
            
            .product-name {
                font-size: 1.25rem;
            }
        }
        
        /* ProductCatalog CSS Styles - Diseño Minimalista */
        .productCatalog-catalog {
          display: flex;
          flex-direction: column;
          min-height: 100vh;
          background: linear-gradient(135deg, #fafbfc 0%, #ffffff 100%);
          font-family: 'Poppins', -apple-system, BlinkMacSystemFont, "Segoe UI", "Roboto", "Oxygen", "Ubuntu", "Cantarell", sans-serif;
          box-shadow: 0 0 40px rgba(0, 0, 0, 0.02);
          border-radius: 12px;
          overflow: hidden;
        }
        
        /* Main Content */
        .productCatalog-main-content {
          display: flex;
          flex-direction: column;
          flex: 1;
          overflow: hidden;
        }
        
        /* Content Below Header */
        .productCatalog-content-below-header {
          display: flex;
          flex-direction: column;
          flex: 1;
          height: calc(100vh - 100px);
          overflow: hidden;
        }
        
        /* Desktop Layout */
        .productCatalog-desktop-layout {
          display: flex;
          width: 100%;
          overflow: hidden;
          height: 100%;
        }
        
        /* Mobile Toggle */
        .productCatalog-mobile-toggle {
          display: none;
          padding: 12px 24px;
          background-color: #f9fafb;
          border-bottom: 1px solid #e5e7eb;
        }
        
        /* Sidebar - Categorías */
        .productCatalog-sidebar {
          background: linear-gradient(180deg, #ffffff 0%, #f8fafc 100%);
          border-right: 1px solid #e2e8f0;
          width: 220px;
          flex-shrink: 0;
          display: flex;
          flex-direction: column;
          height: 100%;
          box-shadow: 2px 0 8px rgba(0, 0, 0, 0.02);
        }

        @media (max-width: 768px) {
  .productCatalog-sidebar {
 width: 100% !important;
        }
        }

        .productCatalog-sidebar-header {

          padding: 20px 24px;
          text-align: left;
          position: relative;
          overflow: hidden;
        }


        .productCatalog-sidebar-header h2 {
          margin: 0;
          font-size: 15px;
          font-weight: 600;
          letter-spacing: 1px;
          text-transform: uppercase;
         color: rgb(17, 24, 39);
          position: relative;
          z-index: 1;
        }
        
        .productCatalog-familia-list {
          flex: 1;
          overflow-y: auto;
          padding: 8px;
        }
        
        .productCatalog-familia-item {
          display: block;
          padding: 14px 20px;
          margin: 4px 8px;
          cursor: pointer;
          transition: all 0.3s cubic-bezier(0.4, 0, 0.2, 1);
          border-radius: 10px;
          font-size: 14px;
          color: #64748b;
          position: relative;
          border: 1px solid transparent;
        }

        .productCatalog-familia-item:hover {
          background: #e0251b4d;
          color: #e0241b;
          transform: translateX(4px);
          border-color: #e2e8f0;
          box-shadow: 0 2px 8px rgba(0, 0, 0, 0.04);
        }

        .productCatalog-familia-item.active {
          background:  #e0241b;
          color: #ffffff;
          font-weight: 500;
          transform: translateX(8px);
          box-shadow: 0 4px 16px #e0251b4d;;
      
        }

       
        
        .productCatalog-familia-name {
          font-size: inherit;
          font-weight: inherit;
          color: inherit;
        }
        
        .productCatalog-familia-search {
          width: 100%;
          margin-bottom: 8px;
          padding: 8px 12px;
          border-radius: 4px;
          border: 1px solid #ced4da;
          font-size: 13px;
          outline: none;
        }
        
        .productCatalog-familia-search:focus {
          border-color: #007bff;
          box-shadow: 0 0 0 0.2rem rgba(0, 123, 255, 0.25);
        }
        
        /* Right Content */
        .productCatalog-right-content {
          display: flex;
          flex-direction: column;
          flex: 1;
          overflow: hidden;
        }
        
        /* Collections y Search Section */
        .productCatalog-collections-search-section {
          background: linear-gradient(135deg, #ffffff 0%, #f8fafc 100%);
          border-bottom: 1px solid #e2e8f0;
          padding: 24px 32px;
          display: flex;
          justify-content: space-between;
          align-items: center;
          gap: 24px;
          flex-wrap: wrap;
          min-height: 90px;
          box-shadow: 0 1px 3px rgba(0, 0, 0, 0.02);
        }

        .productCatalog-collections-nav {
          
        }

          .productCatalog-collections-nav > div {
          display: flex;
          gap: 12px;
          flex-wrap: wrap;
          align-items: center;
        }

        .productCatalog-collection-btn {
          background: linear-gradient(135deg, #ffffff 0%, #f8fafc 100%);
          color: #64748b;
          border: 1px solid #e2e8f0;
          padding: 12px 20px;
          border-radius: 24px;
          font-weight: 500;
          font-size: 14px;
          cursor: pointer;
          transition: all 0.3s cubic-bezier(0.4, 0, 0.2, 1);
          white-space: nowrap;
          position: relative;
          overflow: hidden;
          box-shadow: 0 2px 4px rgba(0, 0, 0, 0.02);
        }

        .productCatalog-collection-btn::before {
          content: '';
          position: absolute;
          top: 0;
          left: -100%;
          width: 100%;
          height: 100%;
          background: linear-gradient(90deg, transparent, rgba(255, 255, 255, 0.4), transparent);
          transition: left 0.5s;
        }

        .productCatalog-collection-btn:hover::before {
          left: 100%;
        }

        .productCatalog-collection-btn:hover {
          background: linear-gradient(135deg, #f1f5f9 0%, #e2e8f0 100%);
          border-color: #cbd5e1;
          color: #374151;
          transform: translateY(-2px);
          box-shadow: 0 4px 12px rgba(0, 0, 0, 0.08);
        }

        .productCatalog-collection-btn.active {
         background: #e0241b;
    color: #ffffff;
    font-weight: 500;
    transform: translateX(8px);
    
        }

        
        .productCatalog-search-container {
          min-width: 300px;
        }
        
        .productCatalog-search-input {
          width: 100%;
          padding: 8px 12px;
          border: 1px solid #ced4da;
          border-radius: 4px;
          background-color: #ffffff;
          font-size: 13px;
          transition: all 0.2s ease;
        }
        
        .productCatalog-search-input:focus {
          outline: none;
          border-color: #007bff;
          box-shadow: 0 0 0 0.2rem rgba(0, 123, 255, 0.25);
        }
        
        /* Products Section */
        .productCatalog-products-section {
          flex: 1;
          padding: 20px;
          display: flex;
          flex-direction: column;
          height: 100%;
          background: #ffffff;
        }
        
        .productCatalog-products-header {
          display: flex;
          justify-content: space-between;
          align-items: center;
          margin-bottom: 20px;
          padding-bottom: 12px;
          border-bottom: 1px solid #dee2e6;
        }
        
        .productCatalog-products-title {
          font-size: 18px;
          font-weight: 600;
          color: #212529;
          margin: 0;
          text-transform: uppercase;
          letter-spacing: 0.5px;
        }
        
        .productCatalog-products-count {
          color: #6c757d;
          font-size: 13px;
          font-weight: 500;
        }
        
        /* Products Grid */
        .productCatalog-products-grid {
          display: grid;
          grid-template-columns: repeat(auto-fill, minmax(200px, 1fr));
          gap: 20px;
          flex: 1;
          overflow-y: auto;
          padding: 24px;
          scroll-behavior: smooth;
        }

        .productCatalog-products-grid .item {
          background: linear-gradient(135deg, #ffffff 0%, #fafbfc 100%);
          border: 1px solid #e2e8f0;
          border-radius: 16px;
     
          transition: all 0.3s cubic-bezier(0.4, 0, 0.2, 1);
          cursor: pointer;
          position: relative;
          box-shadow: 0 2px 8px rgba(0, 0, 0, 0.04);
        }

    
        .productCatalog-products-grid .item:hover {
          transform: translateY(-4px) scale(1.02);
          box-shadow: 0 12px 32px rgba(0, 0, 0, 0.08);
          border-color: #cbd5e1;
        }
        
        .productCatalog-products-grid .item .img {
          width: 100%;
          height: 140px;
          background: #f8f9fa;
          display: flex;
          align-items: center;
          justify-content: center;
          overflow: hidden;
        }
        
        .productCatalog-products-grid .item .img img {
          width: 100%;
          height: 100%;
          object-fit: cover;
        }
        
        .productCatalog-products-grid .item .content {
          padding: 12px;
        }
        
        .productCatalog-products-grid .item .content .code {
          margin: 0 0 6px 0;
          font-size: 12px;
          font-weight: 600;
          color: #6c757d;
        }
        
        .productCatalog-products-grid .item .content .descripcion {
          margin: 0 0 8px 0;
          font-size: 13px;
          color: #212529;
          line-height: 1.3;
          font-weight: 500;
        }
        
        .productCatalog-products-grid .item .content .labels {
          display: flex;
          gap: 4px;
          flex-wrap: wrap;
          margin-bottom: 6px;
        }
        
        .productCatalog-products-grid .item .content .labels > div {
          display: flex;
          align-items: center;
          gap: 3px;
          padding: 2px 6px;
          border-radius: 3px;
          font-size: 10px;
          font-weight: 500;
        }
        
        .productCatalog-products-grid .item .content .labels .bajo-pedido {
          background: #fff3cd;
          color: #856404;
        }
        
        .productCatalog-products-grid .item .content .labels .vender-sin-stock {
          background: #d1ecf1;
          color: #0c5460;
        }
        
        .productCatalog-products-grid .item .content .desabasto {
          background: #f8d7da;
          color: #721c24;
          padding: 2px 6px;
          border-radius: 3px;
          font-size: 10px;
          font-weight: 500;
        }
        
        .productCatalog-products-grid .item .content .ultima-piezas {
          background: #e2e3ff;
          color: #383d96;
          padding: 2px 6px;
          border-radius: 3px;
          font-size: 10px;
          font-weight: 500;
        }
        
        /* Grid classes for layout */
        .row {
          display: flex;
          flex-wrap: wrap;
          margin: 0 -8px;
        }
        
        .col-8 {
          flex: 0 0 66.666667%;
          max-width: 66.666667%;
          padding: 0 8px;
        }
        
        .col-4 {
          flex: 0 0 33.333333%;
          max-width: 33.333333%;
          padding: 0 8px;
        }
        
        .col-1 {
          flex: 0 0 8.333333%;
          max-width: 8.333333%;
          padding: 0 8px;
        }
        
        .col-10 {
          flex: 0 0 83.333333%;
          max-width: 83.333333%;
          padding: 0 8px;
        }
        
        .md-col-12 {
          max-width: 100%;
        }
        
        .inputs__general {
          width: 100%;
          padding: 8px 12px;
          border: 1px solid #ced4da;
          border-radius: 4px;
          font-size: 13px;
          background: #ffffff;
        }
        
        .inputs__general:focus {
          outline: none;
          border-color: #007bff;
          box-shadow: 0 0 0 0.2rem rgba(0, 123, 255, 0.25);
        }
        
        .btn__general-primary {
          background: #007bff;
          color: #ffffff;
          border: 1px solid #007bff;
          padding: 8px 16px;
          border-radius: 4px;
          font-size: 13px;
          font-weight: 500;
          cursor: pointer;
          transition: all 0.2s ease;
        }
        
        .btn__general-primary:hover {
          background: #0056b3;
          border-color: #0056b3;
        }
        
        .btn__general-primary:disabled {
          background: #6c757d;
          border-color: #6c757d;
          cursor: not-allowed;
          opacity: 0.65;
        }
        
        /* Responsive Design */
        @media (max-width: 1024px) {
          .productCatalog-sidebar {
            width: 250px;
          }
          
          .productCatalog-products-grid {
            grid-template-columns: repeat(auto-fill, minmax(200px, 1fr));
            gap: 12px;
          }
        }
        
        @media (max-width: 768px) {
          .productCatalog-mobile-toggle {
            display: block;
          }
          
          .productCatalog-desktop-layout {
            flex-direction: column;
          }
          
          .productCatalog-sidebar {
            width: 100%;
            height: auto;
            max-height: 300px;
            display: none;
          }
          
          .productCatalog-sidebar.mobile-open {
            display: grid;
          }
          
          .productCatalog-right-content {
            width: 100%;
          }
          
          .productCatalog-products-grid {
            grid-template-columns: repeat(auto-fill, minmax(180px, 1fr));
            gap: 12px;
            padding: 16px;
          }
          
          .productCatalog-products-header {
            flex-direction: column;
            align-items: flex-start;
            gap: 8px;
          }
          
          .productCatalog-search-container {
            min-width: auto;
          }
          
          .search-row {
            flex-direction: column;
            gap: 8px;
          }
          
          .search-input-container,
          .search-select-container {
            min-width: auto;
          }
        }
        
        @media (max-width: 480px) {
          .productCatalog-products-grid {
            grid-template-columns: 1fr;
            gap: 16px;
          }
          
          .productCatalog-sidebar {
            max-height: 250px;
          }
          
          .productCatalog-familia-item {
            padding: 12px 16px;
            font-size: 13px;
          }
          
          .productCatalog-collections-nav {
            overflow-x: auto;
            -webkit-overflow-scrolling: touch;
          }
          
          .productCatalog-collection-btn {
            white-space: nowrap;
            font-size: 13px;
            padding: 6px 12px;
          }
        }
        
        /* Carousel Styles */
        .carousel-container {
          position: relative;
          overflow: hidden;
          border-radius: 8px;
          box-shadow: 0 4px 6px rgba(0, 0, 0, 0.1);
        }
        
        .carousel-slides {
          display: flex;
          transition: transform 0.5s ease-in-out;
          height: 100%;
        }
        
        .carousel-slide {
          min-width: 100%;
          height: 100%;
          flex-shrink: 0;
          position: relative;
        }
        
        .carousel-slide img {
          width: 100%;
          height: 100%;
          object-fit: cover;
        }
        
        .carousel-caption {
          position: absolute;
          bottom: 0;
          left: 0;
          right: 0;
          background: rgba(0, 0, 0, 0.7);
          color: white;
          padding: 20px;
          text-align: center;
          font-size: 16px;
          font-weight: 500;
        }
        
        .carousel-arrow {
          position: absolute;
          top: 50%;
          transform: translateY(-50%);
          background: rgba(0, 0, 0, 0.5);
          color: white;
          border: none;
          border-radius: 50%;
          width: 40px;
          height: 40px;
          cursor: pointer;
          display: flex;
          align-items: center;
          justify-content: center;
          font-size: 18px;
          z-index: 10;
          transition: all 0.3s ease;
        }
        
        .carousel-arrow:hover {
          background: rgba(0, 0, 0, 0.8);
          transform: translateY(-50%) scale(1.1);
        }
        
        .carousel-prev {
          left: 10px;
        }
        
        .carousel-next {
          right: 10px;
        }
        
        .carousel-dots {
          position: absolute;
          bottom: 20px;
          left: 50%;
          transform: translateX(-50%);
          display: flex;
          gap: 8px;
          z-index: 10;
        }
        
        .carousel-dot {
          width: 12px;
          height: 12px;
          border-radius: 50%;
          border: none;
          background: rgba(255, 255, 255, 0.5);
          cursor: pointer;
          transition: background 0.3s ease;
        }
        
        .carousel-dot:hover {
          background: rgba(255, 255, 255, 0.8);
        }
        
        .carousel-dot.active {
          background: white;
        }
        
        /* Responsive Carousel */
        @media (max-width: 768px) {
          .carousel-arrow {
            width: 35px;
            height: 35px;
            font-size: 16px;
          }
          
          .carousel-dots {
            bottom: 15px;
          }
          
          .carousel-dot {
            width: 10px;
            height: 10px;
          }
          
          .carousel-caption {
            padding: 15px;
            font-size: 14px;
          }
        }
    </style>
</head>
<body>
    <div class="section-container">
        ${sectionsHTML}
    </div>
    
    <script>
        let currentSection = 'home';
        
        function navigateToSection(sectionId) {
            // Hide all sections
            const sections = document.querySelectorAll('.website-section');
            sections.forEach(section => section.classList.remove('active'));
            
            // Show target section
            const targetSection = document.getElementById('section-' + sectionId);
            if (targetSection) {
                targetSection.classList.add('active');
                currentSection = sectionId;
                
                // Update URL without refresh
                history.pushState({sectionId}, '', '#' + sectionId);
                
                // Smooth scroll to top
                window.scrollTo({ top: 0, behavior: 'smooth' });
            } else {
                // Try to find section by slug or fallback to first section
                const allSections = document.querySelectorAll('.website-section');
                if (allSections.length > 0) {
                    const firstSection = allSections[0];
                    const firstSectionId = firstSection.id.replace('section-', '');
                    navigateToSection(firstSectionId);
                } else {
                    console.warn('No sections found');
                }
            }
        }
        
        // Handle browser back/forward
        window.addEventListener('popstate', function(event) {
            if (event.state && event.state.sectionId) {
                navigateToSection(event.state.sectionId);
            } else {
                // Handle direct URL access
                const hash = window.location.hash.substring(1);
                if (hash) {
                    navigateToSection(hash);
                } else {
                    navigateToSection('home');
                }
            }
        });
        
        // Initialize
        document.addEventListener('DOMContentLoaded', function() {
            // Check if there's a hash in the URL
            const hash = window.location.hash.substring(1);
            if (hash) {
                navigateToSection(hash);
            } else {
                // Find the home section or use the first section
                const homeSection = document.querySelector('.website-section');
                if (homeSection) {
                    const homeSectionId = homeSection.id.replace('section-', '');
                    navigateToSection(homeSectionId);
                }
            }
        });
    </script>
</body>
</html>`;
  
  console.log('🔄 generateFullWebsite: HTML generado exitosamente');
  return `<!DOCTYPE html>`;
};

export const downloadWebsite = (sections, filename = 'mi-sitio-web.html', id_sucursal = null) => {
  const html = generateFullWebsite(sections, 'home', id_sucursal);
  const blob = new Blob([html], { type: 'text/html' });
  const url = URL.createObjectURL(blob);

  const a = document.createElement('a');
  a.href = url;
  a.download = filename;
  a.click();

  URL.revokeObjectURL(url);
};

export const previewWebsite = (sections, id_sucursal = null) => {
  const html = generateFullWebsite(sections, 'home', id_sucursal);
  const newWindow = window.open('', '_blank');
  newWindow.document.write(html);
  newWindow.document.close();
};

// Helper function to convert camelCase to kebab-case
function camelToKebab(str) {
  return str.replace(/([a-z0-9]|(?=[A-Z]))([A-Z])/g, '$1-$2').toLowerCase();
}

