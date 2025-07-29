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

      case 'catalog-section':
        const catalogTitle = props?.title || 'Catálogo de Productos';
        const catalogSubtitle = props?.subtitle || 'Explora nuestra selección de productos';
        const catalogId = `catalog-${Math.random().toString(36).substr(2, 9)}`;

        // For catalog sections, ensure proper positioning and override any conflicting styles
        // Use the actual position values from the element
        const catalogPositionX = typeof position.x === 'number' ? position.x : 0;
        const catalogPositionY = typeof position.y === 'number' ? position.y : 0;
        const catalogWidth = size.width || 'auto';
        const catalogHeight = size.height || 'auto';

        const catalogStyles = `position: absolute; left: ${catalogPositionX}px; top: ${catalogPositionY}px; width: ${catalogWidth}; height: ${catalogHeight}; z-index: 1;`;

        return `
          <div id="${catalogId}" style="${fullStyles}">
            <!-- Full Width Header -->
            <div style="background-color: white; border-bottom: 1px solid #e5e7eb; width: 100%;">
              <div style="padding: 16px 24px;">
                <h1 style="font-size: clamp(24px, 4vw, 30px); font-weight: bold; color: #111827; margin: 0;">
                  ${props?.title || 'Catálogo de Productos'}
                </h1>
                <p style="color: #6b7280; margin-top: 8px; margin: 0; font-size: clamp(14px, 2.5vw, 16px);">
                  ${props?.subtitle || 'Explora nuestra selección de productos'}
                </p>
              </div>
            </div>
            
            <!-- Main Layout with Sidebar and Content -->
            <div class="productCatalog-main-content" style="height: 100%; overflow: hidden;">
              <!-- Content Below Header -->
              <div class="productCatalog-content-below-header" style="display: flex; flex-direction: column; width: 100%; overflow: hidden; height: 100%;">
                <!-- Mobile Menu Toggle -->
                <div class="productCatalog-mobile-toggle" style="display: none; padding: 12px 24px; background-color: #f9fafb; border-bottom: 1px solid #e5e7eb;">
                  <button id="${catalogId}-mobile-menu-btn" style="display: flex; align-items: center; gap: 8px; padding: 8px 12px; background-color: #e0241b; color: white; border: none; border-radius: 6px; font-size: 14px; cursor: pointer;">
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
                      <input type="text" placeholder="Buscar familia..." id="${catalogId}-familia-search" class="productCatalog-familia-search" style="width: 100%; padding: 8px 12px; border: 1px solid #d1d5db; border-radius: 8px; font-size: 14px; margin-bottom: 16px; outline: none;" />
                      <div class="sidebar-familia-list" id="${catalogId}-families" style="overflow-y: auto;">
                        <div class="productCatalog-loading" id="${catalogId}-families-loading" style="color: #6b7280; text-align: center; padding: 16px 0; font-size: 14px; display: none;">Cargando familias...</div>
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
                          <div class="productCatalog-search-container" style="display: flex; flex-direction: column; gap: 12px;">
                            <div class="search-row" style="display: flex; gap: 12px; flex-wrap: wrap;">
                              <div class="search-input-container" style="flex: 1; min-width: 200px;">
                                <input type="text" placeholder="Buscar productos..." id="${catalogId}-product-search" class="productCatalog-search-input" style="width: 100%; padding: 8px 16px; border: 1px solid #e5e7eb; border-radius: 8px; font-size: 14px; background-color: white; outline: none;" />
                              </div>
                              <div class="search-select-container" style="min-width: 150px;">
                                <select id="${catalogId}-search-type" class="inputs__general" style="width: 100%; padding: 8px 12px; border: 1px solid #e5e7eb; border-radius: 8px; font-size: 14px; background-color: white; outline: none;">
                                  <option value="0">Por Descripción</option>
                                  <option value="1">Codigo</option>
                                </select>
                              </div>
                            </div>
                          </div>
                        </div>

                        <!-- Horizontal Collections -->
                        <div class="productCatalog-collections-nav">
                          <div id="${catalogId}-collections" style="display: flex; gap: 8px; overflow-x: auto; padding-bottom: 8px; scrollbar-width: thin;">
                            <div class="productCatalog-loading" id="${catalogId}-collections-loading" style="color: #6b7280; font-size: 14px; display: none;">Cargando colecciones...</div>
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
                        <span class="productCatalog-products-count" id="${catalogId}-products-count" style="font-size: 14px; color: #6b7280;">
                          0 productos encontrados
                        </span>
                      </div>
                      <div class="productCatalog-products-grid" id="${catalogId}-products-grid" style="display: grid; grid-template-columns: repeat(auto-fill, minmax(250px, 1fr)); gap: 16px; overflow-y: auto;">
                        <div class="productCatalog-loading" id="${catalogId}-products-loading" style="text-align: center; padding: 64px 0; display: none;">
                          <div style="display: inline-flex; align-items: center; padding: 8px 16px; font-size: 14px; color: #6b7280;">
                            <svg style="animation: spin 1s linear infinite; margin-right: 12px; width: 20px; height: 20px;" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                              <circle style="opacity: 0.25;" cx="12" cy="12" r="10" stroke="currentColor" stroke-width="4"></circle>
                              <path style="opacity: 0.75;" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                            </svg>
                            Cargando productos...
                          </div>
                        </div>
                        <div class="productCatalog-no-products" id="${catalogId}-no-products" style="text-align: center; padding: 64px 0; display: none;">
                          <h3 style="color: #6b7280; font-size: 18px; margin-bottom: 8px;">No se encontraron productos</h3>
                          <p style="color: #9ca3af; font-size: 14px;">Intenta ajustar tus filtros o términos de búsqueda</p>
                        </div>
                      </div>
                      <!-- Pagination Controls -->
                      <div id="${catalogId}-pagination" style="display: flex; justify-content: center; gap: 8px; margin-top: 32px; padding-top: 24px; border-top: 1px solid #f3f4f6; display: none;">
                        <div class="pagination-row" style="display: flex; align-items: center; gap: 12px; flex-wrap: wrap;">
                          <div class="pagination-btn-container">
                            <button id="${catalogId}-prev-btn" class="btn__general-primary" disabled style="padding: 6px 16px; background-color: #f3f4f6; color: #9ca3af; border-radius: 6px; font-size: 14px; border: none; cursor: not-allowed; opacity: 0.5; transition: all 0.2s;">
                              ANTERIOR
                            </button>
                          </div>
                          <div class="pagination-info-container">
                            <span id="${catalogId}-page-info" style="padding: 6px 12px; font-size: 14px; color: #6b7280; background-color: #f9fafb; border-radius: 6px;">
                              Página 1
                            </span>
                          </div>
                      <div class="col-1">
                          <button id="${catalogId}-next-btn" class="btn__general-primary" style="padding: 6px 16px; background-color: #e0241b; color: white; border-radius: 6px; font-size: 14px; border: none; cursor: pointer; transition: all 0.2s;">
                            SIGUIENTE
                          </button>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
          <script>
            // Catalog Functionality for ${catalogId}
            (function() {
              const catalogId = '${catalogId}';
              console.log('Catalog ID from template:', catalogId);
              console.log('Catalog ID should be:', '${catalogId}');
              console.log('Checking if elements exist:');
              console.log('- Collections loading:', document.getElementById(catalogId + '-collections-loading'));
              console.log('- Products loading:', document.getElementById(catalogId + '-products-loading'));
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
              const userId = 3;
              const url_img = 'http://hiplot.dyndns.org:84/';
              
              // Loading state management
              function setLoading(isLoading, type) {
                console.log('setLoading - type:', type, 'isLoading:', isLoading);
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
                  console.log('Fetching:', url, options);
                  const response = await fetch(url, {
                    headers: {
                      'Content-Type': 'application/json',
                      ...options.headers
                    },
                    ...options
                  });
                  const data = await response.json();
                  console.log('Response:', data);
                  return data;
                } catch (error) {
                  console.error('Error fetching data:', error);
                  throw error;
                }
              }
              
              async function getFamilies(userId) {
                console.log('Getting families for userId:', userId);
                return await fetchData('http://hiplot.dyndns.org:84/api_dev/familia_get/' + userId);
              }
              
              async function getCollectionByFamily(familyId) {
                console.log('Getting collections for familyId:', familyId);
                return await fetchData('http://hiplot.dyndns.org:84/api_dev/get_colecciones_x_familia/' + familyId);
              }
              
              async function getArticlesForVendedor(data) {
                console.log('Getting articles for vendedor:', data);
                return await fetchData('http://hiplot.dyndns.org:84/api_dev/articulos_get_for_vendedor', {
                  method: 'POST',
                  body: JSON.stringify(data)
                });
              }
              
              // Load Families
              async function loadFamilies() {
                try {
                  console.log('Cargando familias...');
                  setLoading(true, 'families');
                  const familiesData = await getFamilies(userId);
                  console.log('Familias recibidas:', familiesData);
                  
                  if (familiesData && Array.isArray(familiesData)) {
                    families = familiesData;
                    families.unshift({ id: 0, nombre: 'Todas las Familias' });
                    renderFamilies();
                    
                    // Si hay familias, seleccionar la primera y cargar sus colecciones
                    if (familiesData.length > 0) {
                      selectedFamilia = familiesData[0].id;
                      console.log('Seleccionando primera familia:', selectedFamilia);
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
                  console.log('=== LOAD COLLECTIONS ===');
                  console.log('Cargando colecciones para familia:', familiaId);
                  setLoading(true, 'collections');
                  let collectionsData = await getCollectionByFamily(familiaId);
                  console.log('Colecciones recibidas:', collectionsData);
                  
                  if (collectionsData && Array.isArray(collectionsData)) {
                    collections = collectionsData;
                    collections.unshift({ id: 0, nombre: 'Todas las Colecciones' });
                    console.log('Colecciones procesadas:', collections);
                    
                    // Si hay colecciones, seleccionar la primera y cargar sus productos
                    if (collectionsData.length > 0) {
                      selectedCollection = collectionsData[0].id;
                      console.log('Seleccionando primera colección:', selectedCollection);
                      // Renderizar colecciones CON la selección
                      renderCollections();
                      // Aquí es donde se llama a loadProducts exactamente como en React
                      await loadProducts(familiaId, collectionsData[0].id, 1);
                    } else {
                      // Si no hay colecciones, limpiar productos
                      console.log('No hay colecciones, limpiando productos');
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
                  console.log('=== LOAD PRODUCTS ===');
                  console.log('loadProducts - familiaId:', familiaId, 'collectionId:', collectionId, 'pageNumber:', pageNumber);
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
                    id_usuario: userId,
                    light: true,
                    no_resultados: 50
                  };
                  
                  console.log('loadProducts - data enviada:', data);
                  const result = await getArticlesForVendedor(data);
                  console.log('loadProducts - result:', result);
                  products = result.data || result || [];
                  filteredProducts = products;
                  console.log('loadProducts - products asignados:', products);
                  console.log('loadProducts - filteredProducts asignados:', filteredProducts);
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
                    id_usuario: userId,
                    light: true,
                    no_resultados: 50
                  };
                  
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
                console.log('=== RENDER FAMILIES ===');
                console.log('Renderizando familias:', families);
                const familiesContainer = document.getElementById(catalogId + '-families');
                const loadingElement = document.getElementById(catalogId + '-families-loading');
                
                console.log('Families container:', familiesContainer);
                console.log('Loading element:', loadingElement);
                
                if (loading.families) {
                  console.log('Mostrando loading de familias');
                  if (loadingElement) loadingElement.style.display = 'block';
                  return;
                }
                
                console.log('Ocultando loading de familias');
                if (loadingElement) loadingElement.style.display = 'none';
                
                if (!familiesContainer) {
                  console.error('No se encontró el contenedor de familias');
                  return;
                }
                
                let familiesHTML = '';
                
                // Filtrar familias basado en la búsqueda (como en el componente React)
                const searchFamiliaTerm = document.getElementById(catalogId + '-familia-search')?.value || '';
                const filteredFamilies = families.filter(familia => 
                  familia.nombre.toLowerCase().includes(searchFamiliaTerm.toLowerCase())
                );
                
                console.log('Familias filtradas:', filteredFamilies);
                console.log('selectedFamilia actual:', selectedFamilia);
                
                filteredFamilies.forEach(familia => {
                  const isActive = selectedFamilia === familia.id;
                  console.log('Familia:', familia.nombre, 'ID:', familia.id, 'Activa:', isActive);
                  familiesHTML += '<div class="productCatalog-familia-item ' + (isActive ? 'active' : '') + '" data-familia-id="' + familia.id + '" style=" text-align: left; padding: 10px 12px; border-radius: 8px; transition: all 0.2s; fontSize: 14px; cursor: pointer; backgroundColor: ' + (isActive ? '#e0241b' : 'transparent') + '; color: ' + (isActive ? 'white' : '#374151') + '; boxShadow: ' + (isActive ? '0 1px 3px rgba(0,0,0,0.1)' : 'none') + '; margin-bottom: 4px;">' +
                    '<span>' + familia.nombre + '</span>' +
                  '</div>';
                });
                
                console.log('HTML de familias generado:', familiesHTML);
                familiesContainer.innerHTML = familiesHTML;
                addFamiliaEventListeners();
                console.log('=== FIN RENDER FAMILIES ===');
              }
              
              function renderCollections() {
                const collectionsContainer = document.getElementById(catalogId + '-collections');
                const loadingElement = document.getElementById(catalogId + '-collections-loading');
                
                console.log('renderCollections - catalogId:', catalogId);
                console.log('renderCollections - collectionsContainer:', collectionsContainer);
                console.log('renderCollections - loadingElement:', loadingElement);
                
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
                
                if (loadingElement) {
                  loadingElement.style.display = 'none';
                }
                console.log('renderCollections - collections array:', collections);
                console.log('renderCollections - selectedCollection:', selectedCollection);
                let collectionsHTML = '';
                
                collections.forEach(collection => {
                  const isActive = selectedCollection === collection.id;
                  collectionsHTML += '<button class="productCatalog-collection-btn ' + (isActive ? 'active' : '') + '" data-collection-id="' + collection.id + '" style="padding: 8px 16px; border-radius: 8px; white-space: nowrap; transition: all 0.2s; font-size: 14px; font-weight: 500; border: none; cursor: pointer; backgroundColor: ' + (isActive ? '#e0241b' : '#f3f4f6') + '; color: ' + (isActive ? 'white' : '#374151') + '; boxShadow: ' + (isActive ? '0 1px 3px rgba(0,0,0,0.1)' : 'none') + ';">' +
                    collection.nombre +
                  '</button>';
                });
                
                console.log('renderCollections - HTML generado:', collectionsHTML);
                collectionsContainer.innerHTML = collectionsHTML;
                addCollectionEventListeners();
              }
              
              function renderProducts() {
                const productsGrid = document.getElementById(catalogId + '-products-grid');
                const productsCount = document.getElementById(catalogId + '-products-count');
                const productsLoading = document.getElementById(catalogId + '-products-loading');
                const noProducts = document.getElementById(catalogId + '-no-products');
                const pagination = document.getElementById(catalogId + '-pagination');
                const productsTitle = document.querySelector('#' + catalogId + ' .productCatalog-products-title');
                
                console.log('renderProducts - catalogId:', catalogId);
                console.log('renderProducts - productsGrid:', productsGrid);
                console.log('renderProducts - productsLoading:', productsLoading);
                
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
                console.log('renderProducts - filteredProducts array:', filteredProducts);
                console.log('renderProducts - selectedCollection:', selectedCollection);
                console.log('renderProducts - collections array:', collections);
                
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
                     
                      (product.desabasto ? '<div class="desabasto" style="display: inline-block; padding: 2px 6px; font-size: 12px; font-weight: 500; background-color: #fee2e2; color: #dc2626; border-radius: 4px; margin-top: 4px;"><small>Agotado</small></div>' : '') +
                      (product.ultimas_piezas ? '<div class="ultima-piezas" style="display: inline-block; padding: 2px 6px; font-size: 12px; font-weight: 500; background-color: #fef3c7; color: #d97706; border-radius: 4px; margin-top: 4px;"><small>Últimas</small></div>' : '') +
                    '</div>' +
                  '</div>';
                });
                
                console.log('renderProducts - HTML generado:', productsHTML);
                productsGrid.innerHTML = productsHTML;
                updatePagination();
              }
              
              function updatePagination() {
                const prevBtn = document.getElementById(catalogId + '-prev-btn');
                const nextBtn = document.getElementById(catalogId + '-next-btn');
                const pageInfo = document.getElementById(catalogId + '-page-info');
                
                if (prevBtn) prevBtn.disabled = currentPage <= 1;
                if (nextBtn) nextBtn.disabled = filteredProducts.length < 50;
                if (pageInfo) pageInfo.textContent = 'Página ' + currentPage;
              }
              
              function addFamiliaEventListeners() {
                const familiaItems = document.querySelectorAll('#' + catalogId + '-families .productCatalog-familia-item');
                console.log('Agregando event listeners a familias:', familiaItems.length);
                
                familiaItems.forEach(item => {
                  // Usar onclick directamente como en React
                  item.onclick = async function() {
                    console.log('=== CLICK EN FAMILIA ===');
                    const familiaId = parseInt(this.getAttribute('data-familia-id'));
                    console.log('Click en familia:', familiaId, 'selectedFamilia actual:', selectedFamilia);
                    
                    if (selectedFamilia === familiaId) {
                      // Si ya está seleccionada, deseleccionar (exactamente como en React)
                      console.log('Deseleccionando familia');
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
                      console.log('Seleccionando nueva familia:', familiaId);
                      currentPage = 1;
                      selectedFamilia = familiaId;
                      console.log('Llamando a loadCollections con familiaId:', familiaId);
                      // Aquí es donde se llama a loadCollections exactamente como en React
                      await loadCollections(familiaId);
                    }
                  };
                });
              }
              
              function addCollectionEventListeners() {
                const collectionButtons = document.querySelectorAll('#' + catalogId + '-collections .productCatalog-collection-btn');
                console.log('Agregando event listeners a colecciones:', collectionButtons.length);
                
                collectionButtons.forEach(button => {
                  // Usar onclick directamente como en React
                  button.onclick = async function() {
                    console.log('=== CLICK EN COLECCIÓN ===');
                    const collectionId = parseInt(this.getAttribute('data-collection-id'));
                    console.log('Click en colección:', collectionId, 'selectedCollection actual:', selectedCollection);
                    
                    if (selectedCollection === collectionId) {
                      // Si ya está seleccionada, deseleccionar
                      console.log('Deseleccionando colección');
                      selectedCollection = null;
                      products = [];
                      filteredProducts = [];
                      currentPage = 1;
                      renderProducts();
                    } else {
                      // Seleccionar nueva colección
                      console.log('Seleccionando nueva colección:', collectionId);
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
              const mobileMenuBtn = document.getElementById(catalogId + '-mobile-menu-btn');
              const sidebar = document.querySelector('#' + catalogId + ' .productCatalog-sidebar');
              
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
                console.log('DOM Content Loaded - Inicializando catálogo:', catalogId);
                
                // Familia search
                const familiaSearch = document.getElementById(catalogId + '-familia-search');
                if (familiaSearch) {
                  console.log('Familia search encontrado');
                  familiaSearch.addEventListener('input', function(e) {
                    const searchTerm = e.target.value.toLowerCase();
                    const familiaItems = document.querySelectorAll('#' + catalogId + '-families .productCatalog-familia-item');
                    familiaItems.forEach(item => {
                      const text = item.textContent.toLowerCase();
                      item.style.display = text.includes(searchTerm) ? 'block' : 'none';
                    });
                  });
                } else {
                  console.error('No se encontró familia search');
                }
                
                // Product search
                const productSearch = document.getElementById(catalogId + '-product-search');
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
                const searchTypeSelect = document.getElementById(catalogId + '-search-type');
                if (searchTypeSelect) {
                searchTypeSelect.addEventListener('change', function(e) {
                  searchType = parseInt(e.target.value);
                });
              }
              
                // Pagination
                const prevBtn = document.getElementById(catalogId + '-prev-btn');
                const nextBtn = document.getElementById(catalogId + '-next-btn');
                
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
                console.log('Cargando datos iniciales...');
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
              
              // Verificar cambios cada 100ms
              setInterval(updateProductsIfNeeded, 100);
            })();
          </script>
        `;

      default:
        return `<div style="${fullStyles}">${props?.content || props?.text || ''}</div>`;
    }
  };

  const sectionHTML = elements.map(element => elementToHTML(element)).join('');

  return `
    <section id="${section.slug}" class="website-section" style="position: relative; min-height: 100vh; width: 100%; max-width: 1450px; margin: 0 auto; overflow: visible;">
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
    <link href="https://fonts.googleapis.com/css2?family=Poppins:wght@300;400;500;600;700;800&family=Inter:wght@300;400;500;600;700&family=Roboto:wght@300;400;500;700&family=Montserrat:wght@300;400;500;600;700&family=Lato:wght@300;400;700&family=Oswald:wght@300;400;500;600;700&family=Merriweather:wght@300;400;700&family=Nunito:wght@300;400;500;600;700&family=Raleway:wght@300;400;500;600;700&family=Playfair+Display:wght@400;500;600;700&family=Fira+Sans:wght@300;400;500;600;700&family=Ubuntu:wght@300;400;500;700&family=Quicksand:wght@300;400;500;600;700&family=Rubik:wght@300;400;500;600;700&family=Bebas+Neue&display=swap" rel="stylesheet">
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

        .productCatalog-products-grid .item::before {
          content: '';
          position: absolute;
          top: 0;
          left: 0;
          right: 0;
          bottom: 0;
          background: linear-gradient(135deg, rgba(102, 126, 234, 0.02) 0%, rgba(118, 75, 162, 0.02) 100%);
          opacity: 0;
          transition: opacity 0.3s ease;
          border-radius: inherit;
        }

        .productCatalog-products-grid .item:hover::before {
          opacity: 1;
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
