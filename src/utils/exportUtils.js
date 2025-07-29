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
          <div id="${catalogId}" class="productCatalog-catalog" style="${catalogStyles}">
            <!-- Full Width Header -->
            <div style="background-color: white; border-bottom: 1px solid #e5e7eb; width: 100%;">
              <div style="padding: 24px;">
                <h1 style="font-size: 30px; font-weight: bold; color: #111827; margin: 0;">
                  ${catalogTitle}
                </h1>
                <p style="color: #6b7280; margin-top: 8px; margin: 0;">
                  ${catalogSubtitle}
                </p>
              </div>
            </div>

            <!-- Main Layout with Sidebar and Content -->
            <div class="productCatalog-main-content" style="height: 100%; overflow: hidden;">
              <!-- Content Below Header -->
              <div class="productCatalog-content-below-header" style="display: flex; width: 100%; overflow: hidden; height: 100%;">
                <!-- Sidebar - Familias -->
                <div class="productCatalog-sidebar" style="width: 256px; background-color: #f9fafb; border-right: 1px solid #e5e7eb; flex-shrink: 0; height: 100%; overflow: hidden; display: grid; grid-template-rows: auto 1fr;">
                  <div class="productCatalog-sidebar-header" style="padding: 24px;">
                    <h2 style="font-size: 18px; font-weight: 600; color: #111827; margin-bottom: 16px;">FAMILIAS</h2>
                  </div>
                  <div class="productCatalog-familia-list" style="display: grid; height: 100%; grid-template-rows: auto 1fr; padding: 0px 24px 24px;">
                    <input type="text" placeholder="Buscar familia..." class="productCatalog-familia-search" style="width: 100%; padding: 8px 12px; border: 1px solid #d1d5db; border-radius: 8px; font-size: 14px; margin-bottom: 16px; outline: none;" />
                    <div class="sidebar-familia-list" style="overflow-y: auto;">
                      <div style="width: 100%; text-align: left; padding: 10px 12px; border-radius: 8px; transition: all 0.2s; fontSize: 14px; cursor: pointer; backgroundColor: #e0241b; color: white; boxShadow: 0 1px 3px rgba(0,0,0,0.1); margin-bottom: 4px;">
                        <span>Todas las Familias</span>
                      </div>
                      <div style="width: 100%; text-align: left; padding: 10px 12px; border-radius: 8px; transition: all 0.2s; fontSize: 14px; cursor: pointer; backgroundColor: transparent; color: #374151; margin-bottom: 4px;">
                        <span>ACCESORIO PARA CREDENCIALES</span>
                      </div>
                      <div style="width: 100%; text-align: left; padding: 10px 12px; border-radius: 8px; transition: all 0.2s; fontSize: 14px; cursor: pointer; backgroundColor: transparent; color: #374151; margin-bottom: 4px;">
                        <span>ACTIVOS</span>
                      </div>
                      <div style="width: 100%; text-align: left; padding: 10px 12px; border-radius: 8px; transition: all 0.2s; fontSize: 14px; cursor: pointer; backgroundColor: transparent; color: #374151; margin-bottom: 4px;">
                        <span>ANUNCIOS 3D Y MATERIALES</span>
                      </div>
                    </div>
                  </div>
                </div>

                <!-- Right Content -->
                <div class="productCatalog-right-content" style="width: 100%; display: grid; grid-template-rows: auto 1fr;">
                  <!-- Collections y Search -->
                  <div class="productCatalog-collections-search-section" style="border-bottom: 1px solid #f3f4f6; background-color: white;">
                    <div style="padding: 16px 24px;">
                      <div style="display: flex; justify-content: space-between; align-items: center; margin-bottom: 16px;">
                        <!-- Search Controls -->
                        <div class="productCatalog-search-container">
                          <div class="row" style="display: flex; gap: 12px;">
                            <div class="col-8 md-col-12">
                              <input type="text" placeholder="Buscar productos..." class="productCatalog-search-input" style="padding: 8px 16px; border: 1px solid #e5e7eb; border-radius: 8px; font-size: 14px; background-color: white; min-width: 250px; outline: none;" />
                            </div>
                            <div class="col-4 md-col-12">
                              <select class="inputs__general" style="padding: 8px 12px; border: 1px solid #e5e7eb; border-radius: 8px; font-size: 14px; background-color: white; outline: none;">
                                <option value="0">Por Descripción</option>
                                <option value="1">Codigo</option>
                              </select>
                            </div>
                          </div>
                        </div>
                      </div>

                      <!-- Horizontal Collections -->
                      <div class="productCatalog-collections-nav">
                        <div style="display: flex; gap: 8px; overflow-x: auto; padding-bottom: 8px;">
                          <button class="productCatalog-collection-btn active" style="padding: 8px 16px; border-radius: 8px; white-space: nowrap; transition: all 0.2s; font-size: 14px; font-weight: 500; border: none; cursor: pointer; background-color: #e0241b; color: white; box-shadow: 0 1px 3px rgba(0,0,0,0.1);">
                            Todas las Colecciones
                          </button>
                          <button class="productCatalog-collection-btn" style="padding: 8px 16px; border-radius: 8px; white-space: nowrap; transition: all 0.2s; font-size: 14px; font-weight: 500; border: none; cursor: pointer; background-color: #f3f4f6; color: #374151;">
                            Credenciales TEST
                          </button>
                          <button class="productCatalog-collection-btn" style="padding: 8px 16px; border-radius: 8px; white-space: nowrap; transition: all 0.2s; font-size: 14px; font-weight: 500; border: none; cursor: pointer; background-color: #f3f4f6; color: #374151;">
                            USB'S
                          </button>
                          <button class="productCatalog-collection-btn" style="padding: 8px 16px; border-radius: 8px; white-space: nowrap; transition: all 0.2s; font-size: 14px; font-weight: 500; border: none; cursor: pointer; background-color: #f3f4f6; color: #374151;">
                            LLAVEROS
                          </button>
                          <button class="productCatalog-collection-btn" style="padding: 8px 16px; border-radius: 8px; white-space: nowrap; transition: all 0.2s; font-size: 14px; font-weight: 500; border: none; cursor: pointer; background-color: #f3f4f6; color: #374151;">
                            TAZAS & TERMOS
                          </button>
                          <button class="productCatalog-collection-btn" style="padding: 8px 16px; border-radius: 8px; white-space: nowrap; transition: all 0.2s; font-size: 14px; font-weight: 500; border: none; cursor: pointer; background-color: #f3f4f6; color: #374151;">
                            BOLSAS
                          </button>
                          <button class="productCatalog-collection-btn" style="padding: 8px 16px; border-radius: 8px; white-space: nowrap; transition: all 0.2s; font-size: 14px; font-weight: 500; border: none; cursor: pointer; background-color: #f3f4f6; color: #374151;">
                            BOLIGRAFOS
                          </button>
                          <button class="productCatalog-collection-btn" style="padding: 8px 16px; border-radius: 8px; white-space: nowrap; transition: all 0.2s; font-size: 14px; font-weight: 500; border: none; cursor: pointer; background-color: #f3f4f6; color: #374151;">
                            BRAZALETES TYVEK
                          </button>
                          <button class="productCatalog-collection-btn" style="padding: 8px 16px; border-radius: 8px; white-space: nowrap; transition: all 0.2s; font-size: 14px; font-weight: 500; border: none; cursor: pointer; background-color: #f3f4f6; color: #374151;">
                            ROMPECABEZAS
                          </button>
                          <button class="productCatalog-collection-btn" style="padding: 8px 16px; border-radius: 8px; white-space: nowrap; transition: all 0.2s; font-size: 14px; font-weight: 500; border: none; cursor: pointer; background-color: #f3f4f6; color: #374151;">
                            FOTOBOTONES
                          </button>
                          <button class="productCatalog-collection-btn" style="padding: 8px 16px; border-radius: 8px; white-space: nowrap; transition: all 0.2s; font-size: 14px; font-weight: 500; border: none; cursor: pointer; background-color: #f3f4f6; color: #374151;">
                            VARIOS
                          </button>
                        </div>
                      </div>
                    </div>
                  </div>

                  <!-- Products Section -->
                  <div class="productCatalog-products-section" style="padding: 24px; height: 100%; display: grid; grid-template-rows: auto 1fr auto; overflow: auto;">
                    <div class="productCatalog-products-header" style="display: flex; justify-content: space-between; align-items: center; margin-bottom: 24px;">
                      <h2 class="productCatalog-products-title" style="font-size: 20px; font-weight: 600; color: #111827; margin: 0;">
                        PRODUCTOS - Todas las Colecciones
                      </h2>
                      <span class="productCatalog-products-count" style="font-size: 14px; color: #6b7280;">
                        50 productos encontrados
                      </span>
                    </div>
                    <div class="productCatalog-products-grid" style="display: grid; grid-template-columns: repeat(auto-fill, minmax(200px, 1fr)); gap: 16px; overflow-y: auto;">
                      <!-- Product Cards with Real Data Structure -->
                      <div class="item" style="cursor: pointer; background-color: white; border: 1px solid #f3f4f6; border-radius: 12px; transition: all 0.2s; box-shadow: 0 1px 3px rgba(0,0,0,0.1); height: auto;">
                        <div class="img" style="aspect-ratio: 1/1; background-color: #f9fafb; overflow: hidden;">
                          <img src="https://via.placeholder.com/300x300/3b82f6/ffffff?text=AMADINA" alt="Credencial AMADINA" class="productCatalog-product-image" style="width: 100%; height: 100%; object-fit: cover; transition: transform 0.3s;" />
                        </div>
                        <div class="content" style="padding: 12px;">
                          <p class="code" style="font-size: 12px; color: #6b7280; margin: 0 0 4px 0;">AMADINA-001</p>
                          <p class="descripcion" style="font-weight: 500; color: #111827; font-size: 14px; margin: 0 0 8px 0; line-height: 1.3;">Credencial AMADINA</p>
                          <div class="labels" style="display: flex; flex-wrap: wrap; gap: 4px;">
                            <div class="bajo-pedido" style="display: inline-flex; align-items: center; gap: 4px; padding: 2px 6px; font-size: 12px; font-weight: 500; background-color: #dbeafe; color: #1d4ed8; border-radius: 4px;">
                              <svg xmlns="http://www.w3.org/2000/svg" width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.75" stroke-linecap="round" stroke-linejoin="round"><path d="M14 18V6a2 2 0 0 0-2-2H4a2 2 0 0 0-2 2v11a1 1 0 0 0 1 1h2" /><path d="M15 18H9" /><path d="M19 18h2a1 1 0 0 0 1-1v-3.65a1 1 0 0 0-.22-.624l-3.48-4.35A1 1 0 0 0 17.52 8H14" /><circle cx="17" cy="18" r="2" /><circle cx="7" cy="18" r="2" /></svg>
                              <small>Pedido</small>
                            </div>
                          </div>
                        </div>
                      </div>
                      <div class="item" style="cursor: pointer; background-color: white; border: 1px solid #f3f4f6; border-radius: 12px; transition: all 0.2s; box-shadow: 0 1px 3px rgba(0,0,0,0.1); height: auto;">
                        <div class="img" style="aspect-ratio: 1/1; background-color: #f9fafb; overflow: hidden;">
                          <img src="https://via.placeholder.com/300x300/10b981/ffffff?text=CitiMall" alt="Credencial CitiMall" class="productCatalog-product-image" style="width: 100%; height: 100%; object-fit: cover; transition: transform 0.3s;" />
                        </div>
                        <div class="content" style="padding: 12px;">
                          <p class="code" style="font-size: 12px; color: #6b7280; margin: 0 0 4px 0;">CITI-002</p>
                          <p class="descripcion" style="font-weight: 500; color: #111827; font-size: 14px; margin: 0 0 8px 0; line-height: 1.3;">Credencial CitiMall</p>
                          <div class="labels" style="display: flex; flex-wrap: wrap; gap: 4px;">
                            <div class="vender-sin-stock" style="display: inline-flex; align-items: center; gap: 4px; padding: 2px 6px; font-size: 12px; font-weight: 500; background-color: #dcfce7; color: #166534; border-radius: 4px;">
                              <svg xmlns="http://www.w3.org/2000/svg" width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.75" stroke-linecap="round" stroke-linejoin="round"><path d="M6 2 3 6v14a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2V6l-3-4Z" /><path d="M3 6h18" /><path d="M16 10a4 4 0 0 1-8 0" /></svg>
                              <small>S/Stock</small>
                            </div>
                          </div>
                        </div>
                      </div>
                      <div class="item" style="cursor: pointer; background-color: white; border: 1px solid #f3f4f6; border-radius: 12px; transition: all 0.2s; box-shadow: 0 1px 3px rgba(0,0,0,0.1); height: auto;">
                        <div class="img" style="aspect-ratio: 1/1; background-color: #f9fafb; overflow: hidden;">
                          <img src="https://via.placeholder.com/300x300/f59e0b/ffffff?text=GPAlliance" alt="Credencial GPAlliance" class="productCatalog-product-image" style="width: 100%; height: 100%; object-fit: cover; transition: transform 0.3s;" />
                        </div>
                        <div class="content" style="padding: 12px;">
                          <p class="code" style="font-size: 12px; color: #6b7280; margin: 0 0 4px 0;">GPA-003</p>
                          <p class="descripcion" style="font-weight: 500; color: #111827; font-size: 14px; margin: 0 0 8px 0; line-height: 1.3;">Credencial GPAlliance</p>
                          <div class="labels" style="display: flex; flex-wrap: wrap; gap: 4px;"></div>
                          <div class="desabasto" style="display: inline-block; padding: 2px 6px; font-size: 12px; font-weight: 500; background-color: #fee2e2; color: #dc2626; border-radius: 4px; margin-top: 4px;">
                            <small>Agotado</small>
                          </div>
                        </div>
                      </div>
                      <div class="item" style="cursor: pointer; background-color: white; border: 1px solid #f3f4f6; border-radius: 12px; transition: all 0.2s; box-shadow: 0 1px 3px rgba(0,0,0,0.1); height: auto;">
                        <div class="img" style="aspect-ratio: 1/1; background-color: #f9fafb; overflow: hidden;">
                          <img src="https://via.placeholder.com/300x300/ef4444/ffffff?text=Alhambra" alt="Credencial Alhambra" class="productCatalog-product-image" style="width: 100%; height: 100%; object-fit: cover; transition: transform 0.3s;" />
                        </div>
                        <div class="content" style="padding: 12px;">
                          <p class="code" style="font-size: 12px; color: #6b7280; margin: 0 0 4px 0;">ALH-004</p>
                          <p class="descripcion" style="font-weight: 500; color: #111827; font-size: 14px; margin: 0 0 8px 0; line-height: 1.3;">Credencial Alhambra</p>
                          <div class="labels" style="display: flex; flex-wrap: wrap; gap: 4px;"></div>
                          <div class="ultima-piezas" style="display: inline-block; padding: 2px 6px; font-size: 12px; font-weight: 500; background-color: #e2e3ff; color: #383d96; border-radius: 4px; margin-top: 4px;">
                            <small>Últimas Piezas</small>
                          </div>
                        </div>
                      </div>
                      <div class="item" style="cursor: pointer; background-color: white; border: 1px solid #f3f4f6; border-radius: 12px; transition: all 0.2s; box-shadow: 0 1px 3px rgba(0,0,0,0.1); height: auto;">
                        <div class="img" style="aspect-ratio: 1/1; background-color: #f9fafb; overflow: hidden;">
                          <img src="https://via.placeholder.com/300x300/8b5cf6/ffffff?text=alicorp" alt="Credencial alicorp" class="productCatalog-product-image" style="width: 100%; height: 100%; object-fit: cover; transition: transform 0.3s;" />
                        </div>
                        <div class="content" style="padding: 12px;">
                          <p class="code" style="font-size: 12px; color: #6b7280; margin: 0 0 4px 0;">ALI-005</p>
                          <p class="descripcion" style="font-weight: 500; color: #111827; font-size: 14px; margin: 0 0 8px 0; line-height: 1.3;">Credencial alicorp</p>
                          <div class="labels" style="display: flex; flex-wrap: wrap; gap: 4px;"></div>
                        </div>
                      </div>
                      <div class="item" style="cursor: pointer; background-color: white; border: 1px solid #f3f4f6; border-radius: 12px; transition: all 0.2s; box-shadow: 0 1px 3px rgba(0,0,0,0.1); height: auto;">
                        <div class="img" style="aspect-ratio: 1/1; background-color: #f9fafb; overflow: hidden;">
                          <img src="https://via.placeholder.com/300x300/06b6d4/ffffff?text=Diamond" alt="Credencial Diamond" class="productCatalog-product-image" style="width: 100%; height: 100%; object-fit: cover; transition: transform 0.3s;" />
                        </div>
                        <div class="content" style="padding: 12px;">
                          <p class="code" style="font-size: 12px; color: #6b7280; margin: 0 0 4px 0;">DIA-006</p>
                          <p class="descripcion" style="font-weight: 500; color: #111827; font-size: 14px; margin: 0 0 8px 0; line-height: 1.3;">Credencial Diamond</p>
                          <div class="labels" style="display: flex; flex-wrap: wrap; gap: 4px;"></div>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
          <script>
            (function() {
              const catalogId = '${catalogId}';
              
              // Prevent multiple initializations
              if (window[catalogId + '_initialized']) {
                return;
              }
              window[catalogId + '_initialized'] = true;
              
              const familiesContainer = document.getElementById(catalogId + '-families');
              const collectionsContainer = document.getElementById(catalogId + '-collections');
              const productsContainer = document.getElementById(catalogId + '-products');
              const productsTitle = document.querySelector('#' + catalogId + ' .productCatalog-products-title');
              const productsCount = document.querySelector('#' + catalogId + ' .productCatalog-products-count');
              const searchInput = document.querySelector('#' + catalogId + ' .productCatalog-search-input');
              const familiaSearchInput = document.querySelector('#' + catalogId + ' .productCatalog-familia-search');
              const searchTypeSelect = document.querySelector('#' + catalogId + ' select.inputs__general');
              
              let selectedFamily = null;
              let selectedCollection = null;
              let currentProducts = [];
              let searchType = 0; // 0 = Por Descripción, 1 = Codigo
              
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
              
              let isLoadingFamilies = false;
              let familiesLoaded = false;
              let isSelectingFamily = false;
              let isLoadingCollections = false;

              // Cargar familias
              async function loadFamilies() {
                if (isLoadingFamilies || familiesLoaded) return;

                try {
                  isLoadingFamilies = true;
                  familiesContainer.innerHTML = '<div class="productCatalog-familia-item" style="color: #64748b; font-style: italic;">Cargando familias...</div>';

                  const families = await fetchData('http://hiplot.dyndns.org:84/api_dev/familia_get/3');

                  if (families && families.length > 0) {
                    // Agregar "Todas las Familias" al inicio
                    families.unshift({ id: 0, nombre: 'Todas las Familias' });

                    let familiesHTML = '';
                    families.forEach((family, index) => {
                      const isActive = index === 0;
                      familiesHTML += \`
                        <div onclick="selectFamily('\${family.id}', '\${family.nombre}')"
                             class="productCatalog-familia-item \${isActive ? 'active' : ''}"
                             data-family-id="\${family.id}">
                          <span class="productCatalog-familia-name"> \${family.nombre}</span>
                        </div>
                      \`;
                    });
                    familiesContainer.innerHTML = familiesHTML;
                    familiesLoaded = true;

                    // Si hay familias, seleccionar la primera y cargar sus colecciones (como en React)
                    if (families.length > 0) {
                      await selectFamily(families[0].id, families[0].nombre);
                    }
                  } else {
                    familiesContainer.innerHTML = '<div class="productCatalog-familia-item" style="color: #ef4444;">📁 No hay familias disponibles</div>';
                  }
                } catch (error) {
                  familiesContainer.innerHTML = '<div class="productCatalog-familia-item" style="color: #ef4444;">📁 Error al cargar familias</div>';
                  console.error('Error loading families:', error);
                } finally {
                  isLoadingFamilies = false;
                }
              }
              
              // Seleccionar familia
              window.selectFamily = async function(familyId, familyName) {
                if (isSelectingFamily) return;
                if (selectedFamily && selectedFamily.id === familyId) return;

                try {
                  isSelectingFamily = true;
                  selectedFamily = { id: familyId, nombre: familyName };
                  selectedCollection = null;

                  // Actualizar UI de familias
                  const familyElements = familiesContainer.querySelectorAll('.productCatalog-familia-item');
                  familyElements.forEach(el => {
                    el.classList.remove('active');
                  });

                  const selectedElement = familiesContainer.querySelector(\`[data-family-id="\${familyId}"]\`);
                  if (selectedElement) {
                    selectedElement.classList.add('active');
                  }

                  // Cargar colecciones
                  await loadCollections(familyId);
                } finally {
                  isSelectingFamily = false;
                }
              };
              
              // Cargar colecciones
              async function loadCollections(familyId) {
                if (isLoadingCollections) return;

                try {
                  isLoadingCollections = true;
                  collectionsContainer.innerHTML = '<div class="productCatalog-collection-btn" style="background: #f1f5f9; color: #64748b; cursor: default;">⏳ Cargando...</div>';
                  productsContainer.innerHTML = '<div style="display: flex; align-items: center; justify-content: center; height: 200px; color: #64748b; font-size: 14px; font-style: italic;">🔄 Cargando colecciones...</div>';

                  let collections = [];
                  if (familyId == 0) {
                    // Si es "Todas las Familias", cargar todas las colecciones
                    const allFamilies = await fetchData('http://hiplot.dyndns.org:84/api_dev/familia_get/3');
                    if (allFamilies) {
                      for (let family of allFamilies.slice(0, 5)) { // Limitar a 5 familias para evitar sobrecarga
                        const familyCollections = await fetchData(\`http://hiplot.dyndns.org:84/api_dev/get_colecciones_x_familia/\${family.id}\`);
                        if (familyCollections && familyCollections.length > 0) {
                          collections = collections.concat(familyCollections);
                        }
                      }
                    }
                  } else {
                    collections = await fetchData(\`http://hiplot.dyndns.org:84/api_dev/get_colecciones_x_familia/\${familyId}\`);
                  }

                  if (collections && collections.length > 0) {
                    // Agregar "Todas las Colecciones" al inicio
                    collections.unshift({ id: 0, nombre: 'Todas las Colecciones' });

                    let collectionsHTML = '';
                    collections.forEach((collection, index) => {
                      const isActive = index === 0;
                      collectionsHTML += \`
                        <div onclick="selectCollection('\${collection.id}', '\${collection.nombre}')"
                             class="productCatalog-collection-btn \${isActive ? 'active' : ''}"
                             data-collection-id="\${collection.id}">
                          📋 \${collection.nombre}
                        </div>
                      \`;
                    });
                    collectionsContainer.innerHTML = collectionsHTML;

                    // Si hay colecciones, seleccionar la primera y cargar sus productos (como en React)
                    if (collections.length > 0) {
                      await selectCollection(collections[0].id, collections[0].nombre);
                    }
                  } else {
                    collectionsContainer.innerHTML = '<div class="productCatalog-collection-btn" style="background: #fef2f2; color: #dc2626; cursor: default;">📋 Sin colecciones</div>';
                    productsContainer.innerHTML = '<div style="display: flex; align-items: center; justify-content: center; height: 200px; color: #dc2626; font-size: 14px;">📋 No hay colecciones disponibles</div>';
                  }
                } catch (error) {
                  collectionsContainer.innerHTML = '<div class="productCatalog-collection-btn" style="background: #fef2f2; color: #dc2626; cursor: default;">❌ Error</div>';
                  productsContainer.innerHTML = '<div style="display: flex; align-items: center; justify-content: center; height: 200px; color: #dc2626; font-size: 14px;">❌ Error al cargar colecciones</div>';
                  console.error('Error loading collections:', error);
                } finally {
                  isLoadingCollections = false;
                }
              }
              
              // Seleccionar colección
              window.selectCollection = async function(collectionId, collectionName) {
                selectedCollection = { id: collectionId, nombre: collectionName };
                
                // Actualizar UI de colecciones
                const collectionElements = collectionsContainer.querySelectorAll('.productCatalog-collection-btn');
                collectionElements.forEach(el => {
                  el.classList.remove('active');
                });
                
                const selectedElement = collectionsContainer.querySelector(\`[data-collection-id="\${collectionId}"]\`);
                if (selectedElement) {
                  selectedElement.classList.add('active');
                }
                
                // Actualizar título
                if (productsTitle) {
                  productsTitle.textContent = \`PRODUCTOS - \${collectionName}\`;
                }
                
                // Cargar productos (exactamente como en React)
                await loadProducts(selectedFamily.id, collectionId, 1);
              };
              
              // Función para buscar productos por código o descripción
              window.loadProductsByCodeOrDesc = async function(input, numberPage) {
                try {
                  productsContainer.innerHTML = '<div style="display: flex; align-items: center; justify-content: center; height: 200px; color: #64748b; font-size: 12px;">Buscando productos...</div>';
                  
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
                    id_usuario: 3,
                    light: true,
                    no_resultados: 50
                  };
                  
                  const result = await fetchData('http://hiplot.dyndns.org:84/api_dev/articulos_get_for_vendedor', {
                    method: 'POST',
                    body: JSON.stringify(data)
                  });
                  
                  const productsData = result.data || result || [];
                  currentProducts = productsData;
                  
                  if (productsData && productsData.length > 0) {
                    let productsHTML = '';
                    productsData.forEach(product => {
                      productsHTML += \`
                        <div class="item">
                          <div class="img">
                            <img src="http://hiplot.dyndns.org:84/\${product.imagen}" alt="\${product.nombre}" class="productCatalog-product-image" />
                          </div>
                          <div class="content">
                            <p class="code">\${product.codigo}</p>
                            <p class="descripcion">\${product.descripcion}</p>
                            <div class="labels">
                              \${product.bajo_pedido ? '<div class="bajo-pedido"><svg xmlns="http://www.w3.org/2000/svg" width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.75" strokeLinecap="round" stroke-linejoin="round"><path d="M14 18V6a2 2 0 0 0-2-2H4a2 2 0 0 0-2 2v11a1 1 0 0 0 1 1h2" /><path d="M15 18H9" /><path d="M19 18h2a1 1 0 0 0 1-1v-3.65a1 1 0 0 0-.22-.624l-3.48-4.35A1 1 0 0 0 17.52 8H14" /><circle cx="17" cy="18" r="2" /><circle cx="7" cy="18" r="2" /></svg><small>Bajo Pedido</small></div>' : ''}
                              \${product.vender_sin_stock ? '<div class="vender-sin-stock"><svg xmlns="http://www.w3.org/2000/svg" width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.75" strokeLinecap="round" stroke-linejoin="round"><path d="M6 2 3 6v14a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2V6l-3-4Z" /><path d="M3 6h18" /><path d="M16 10a4 4 0 0 1-8 0" /></svg><small>Vender sin Stock</small></div>' : ''}
                            </div>
                            \${product.desabasto ? '<div class="desabasto"><small>Desabasto</small></div>' : ''}
                            \${product.ultimas_piezas ? '<div class="ultima-piezas"><small>Ultimas Piezas</small></div>' : ''}
                          </div>
                        </div>
                      \`;
                    });
                    
                    // Agregar botones de paginación
                    productsHTML += \`
                      <div class="row">
                        <div class="col-1">
                          <button class="btn__general-primary" onclick="loadProductsByCodeOrDesc('\${input}', \${numberPage - 1})" disabled="\${numberPage <= 1}">ANTERIOR</button>
                        </div>
                        <div class="col-10">
                        </div>
                        <div class="col-1">
                          <button class="btn__general-primary" onclick="loadProductsByCodeOrDesc('\${input}', \${numberPage + 1})">SIGUIENTE</button>
                        </div>
                      </div>
                    \`;
                    
                    productsContainer.innerHTML = productsHTML;
                    if (productsCount) {
                      productsCount.textContent = \`\${productsData.length} productos encontrados\`;
                    }
                  } else {
                    productsContainer.innerHTML = '<div style="display: flex; align-items: center; justify-content: center; height: 200px; color: #64748b; font-size: 12px;">No se encontraron productos</div>';
                    if (productsCount) {
                      productsCount.textContent = '0 productos encontrados';
                    }
                  }
                } catch (error) {
                  productsContainer.innerHTML = '<div style="display: flex; align-items: center; justify-content: center; height: 200px; color: #64748b; font-size: 12px;">Error al buscar productos</div>';
                  if (productsCount) {
                    productsCount.textContent = '0 productos encontrados';
                  }
                }
              };
              
              // Cargar productos (exactamente como en React)
              window.loadProducts = async function(familiaId, collectionId, pageNumber) {
                try {
                  productsContainer.innerHTML = '<div style="display: flex; align-items: center; justify-content: center; height: 200px; color: #64748b; font-size: 12px;">Cargando productos...</div>';
                  
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
                    id_usuario: 3,
                    light: true,
                    no_resultados: 50
                  };
                  
                  const result = await fetchData('http://hiplot.dyndns.org:84/api_dev/articulos_get_for_vendedor', {
                    method: 'POST',
                    body: JSON.stringify(data)
                  });
                  
                  const products = result.data || result || [];
                  currentProducts = products;
                  
                  if (products && products.length > 0) {
                    let productsHTML = '';
                    products.forEach(product => {
                      productsHTML += \`
                        <div class="item">
                          <div class="img">
                            <img src="http://hiplot.dyndns.org:84/\${product.imagen}" alt="\${product.nombre}" class="productCatalog-product-image" />
                          </div>
                          <div class="content">
                            <p class="code">\${product.codigo}</p>
                            <p class="descripcion">\${product.descripcion}</p>
                            <div class="labels">
                              \${product.bajo_pedido ? '<div class="bajo-pedido"><svg xmlns="http://www.w3.org/2000/svg" width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.75" strokeLinecap="round" stroke-linejoin="round"><path d="M14 18V6a2 2 0 0 0-2-2H4a2 2 0 0 0-2 2v11a1 1 0 0 0 1 1h2" /><path d="M15 18H9" /><path d="M19 18h2a1 1 0 0 0 1-1v-3.65a1 1 0 0 0-.22-.624l-3.48-4.35A1 1 0 0 0 17.52 8H14" /><circle cx="17" cy="18" r="2" /><circle cx="7" cy="18" r="2" /></svg><small>Bajo Pedido</small></div>' : ''}
                              \${product.vender_sin_stock ? '<div class="vender-sin-stock"><svg xmlns="http://www.w3.org/2000/svg" width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.75" strokeLinecap="round" stroke-linejoin="round"><path d="M6 2 3 6v14a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2V6l-3-4Z" /><path d="M3 6h18" /><path d="M16 10a4 4 0 0 1-8 0" /></svg><small>Vender sin Stock</small></div>' : ''}
                            </div>
                            \${product.desabasto ? '<div class="desabasto"><small>Desabasto</small></div>' : ''}
                            \${product.ultimas_piezas ? '<div class="ultima-piezas"><small>Ultimas Piezas</small></div>' : ''}
                          </div>
                        </div>
                      \`;
                    });
                    
                    // Agregar botones de paginación
                    productsHTML += \`
                      <div class="row">
                        <div class="col-1">
                          <button class="btn__general-primary" onclick="loadProducts(\${familiaId}, \${collectionId}, \${pageNumber - 1})" disabled="\${pageNumber <= 1}">ANTERIOR</button>
                        </div>
                        <div class="col-10">
                        </div>
                        <div class="col-1">
                          <button class="btn__general-primary" onclick="loadProducts(\${familiaId}, \${collectionId}, \${pageNumber + 1})">SIGUIENTE</button>
                        </div>
                      </div>
                    \`;
                    
                    productsContainer.innerHTML = productsHTML;
                    
                    // Actualizar contador
                    if (productsCount) {
                      productsCount.textContent = \`\${products.length} productos encontrados\`;
                    }
                  } else {
                    productsContainer.innerHTML = '<div style="display: flex; align-items: center; justify-content: center; height: 200px; color: #64748b; font-size: 12px;">No hay productos disponibles</div>';
                    if (productsCount) {
                      productsCount.textContent = '0 productos encontrados';
                    }
                  }
                } catch (error) {
                  productsContainer.innerHTML = '<div style="display: flex; align-items: center; justify-content: center; height: 200px; color: #64748b; font-size: 12px;">Error al cargar productos</div>';
                  if (productsCount) {
                    productsCount.textContent = '0 productos encontrados';
                  }
                }
              };
              
              // Búsqueda de productos en tiempo real
              if (searchInput && !searchInput.hasAttribute('data-listener-attached')) {
                searchInput.setAttribute('data-listener-attached', 'true');
                
                // Solo búsqueda por Enter (como en el React component)
                searchInput.addEventListener('keyup', function(e) {
                  if (e.key === 'Enter') {
                    const searchTerm = e.target.value;
                    if (searchTerm.trim() !== '') {
                      loadProductsByCodeOrDesc(searchTerm, 1);
                    } else {
                      // Si el campo está vacío, recargar productos de la colección actual
                      if (selectedCollection !== null) {
                        loadProducts(selectedFamily.id, selectedCollection.id, 1);
                      }
                    }
                  }
                });
              }
              
              // Cambiar tipo de búsqueda
              if (searchTypeSelect && !searchTypeSelect.hasAttribute('data-listener-attached')) {
                searchTypeSelect.setAttribute('data-listener-attached', 'true');
                searchTypeSelect.addEventListener('change', function(e) {
                  searchType = parseInt(e.target.value);
                });
              }
              
              // Búsqueda de familias en tiempo real
              if (familiaSearchInput && !familiaSearchInput.hasAttribute('data-listener-attached')) {
                familiaSearchInput.setAttribute('data-listener-attached', 'true');
                familiaSearchInput.addEventListener('input', function(e) {
                  const searchTerm = e.target.value.toLowerCase();
                  const familyElements = familiesContainer.querySelectorAll('.productCatalog-familia-item');
                  
                  familyElements.forEach(element => {
                    const familyName = element.querySelector('.productCatalog-familia-name').textContent.toLowerCase();
                    if (familyName.includes(searchTerm)) {
                      element.style.display = 'block';
                    } else {
                      element.style.display = 'none';
                    }
                  });
                });
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
        
        /* Ensure absolutely positioned elements are properly positioned within sections */
        .website-section > div[style*="position: absolute"] {
            position: absolute !important;
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
          flex: 1;
          height: calc(100vh - 100px);
          overflow: hidden;
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

        .productCatalog-sidebar-header {
          background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
          color: white;
          padding: 20px 24px;
          text-align: left;
          position: relative;
          overflow: hidden;
        }

        .productCatalog-sidebar-header::before {
          content: '';
          position: absolute;
          top: 0;
          left: 0;
          right: 0;
          bottom: 0;
          background: linear-gradient(45deg, rgba(255, 255, 255, 0.1) 0%, transparent 100%);
        }

        .productCatalog-sidebar-header h2 {
          margin: 0;
          font-size: 15px;
          font-weight: 600;
          letter-spacing: 1px;
          text-transform: uppercase;
          color: white;
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
          background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
          color: white;
          border-color: #667eea;
          font-weight: 600;
          transform: translateY(-2px);
          box-shadow: 0 6px 20px rgba(102, 126, 234, 0.4);
        }

        .productCatalog-collection-btn.active::after {
          content: '';
          position: absolute;
          bottom: -2px;
          left: 50%;
          transform: translateX(-50%);
          width: 0;
          height: 0;
          border-left: 6px solid transparent;
          border-right: 6px solid transparent;
          border-top: 6px solid #667eea;
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
          overflow: hidden;
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
