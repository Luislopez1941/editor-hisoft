import React, { useEffect, useState } from 'react';
import useUserStore from '../../store/General';
import APIs from '../../services/services/APIs';
import { useEditor } from '../../context/EditorContext';

const ProductCatalog = ({ isPreviewMode = false, title = 'Catálogo de Productos', subtitle = 'Explora nuestra selección de productos' }) => {
  const [selectedFamilia, setSelectedFamilia] = useState(null);
  const [selectedCollection, setSelectedCollection] = useState(null);
  const [searchTerm, setSearchTerm] = useState("");
  const [products, setProducts] = useState([]);
  const [filteredProducts, setFilteredProducts] = useState([]);
  const [loading, setLoading] = useState(false);
  const [selectedProduct, setSelectedProduct] = useState(null);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [modalArticle, setModalArticle] = useState(null);
  const [modalImgs, setModalImgs] = useState([]);
  const [modalLoading, setModalLoading] = useState(false);
  const [modalOpciones, setModalOpciones] = useState([]);
  const [modalActiveIndex, setModalActiveIndex] = useState(null);
  const [modalCurrentImageIndex, setModalCurrentImageIndex] = useState(0);
  const { url_img } = useUserStore();
  
  // Obtener el contexto del editor para acceder al id_sucursal
  const { projectMetadata } = useEditor();

  const userId = 3; // Mock user ID - you can replace this with real user ID
  const [families, setFamilies] = useState([]);
  const [collections, setCollections] = useState([]);
  const [searchFamilia, setSearchFamilia] = useState("");
  const filteredFamilies = families.filter(familia =>
    familia.nombre.toLowerCase().includes(searchFamilia.toLowerCase())
  );

  const [dentroColeccion, setDentroColeccion] = useState(false)
  const [id_col, setid_col] = useState({})
  const [dentroColeccionNombre, setDentroColeccionNombre] = useState('')
  const [BuscarPor, setBuscarPor] = useState(0)
  const [articles, setArticles] = useState([]);
  const [idA, setIdA] = useState(null);
  const [i, setI] = useState(0);
  const [page, setPage] = useState(1);
 // Mock image URL - you can replace this with real URL
  let SearcherController = 0 // 0 => por coleccion y familia, 1-> por codigo descripción
  
  // Cargar familias al montar el componente
  const loadFamilies = async () => {
    try {
      setLoading(true);
      
      // Usar id_sucursal del contexto del editor si está disponible, sino usar userId como fallback
      const sucursalId = projectMetadata?.id_sucursal || userId;
      
      console.log('🔄 CatalogSection: Cargando familias con:', {
        sucursalId,
        projectMetadata: projectMetadata,
        fallbackUserId: userId
      });
      
      const familiesData = await APIs.getFamilies(sucursalId);
      familiesData.unshift({ id: 0, nombre: 'Todas las Familias' });
      setFamilies(familiesData);

      // Si hay familias, seleccionar la primera y cargar sus colecciones
      if (familiesData && familiesData.length > 0) {
        setSelectedFamilia(familiesData[0].id);
        await loadCollections(familiesData[0].id);
      }
    } catch (error) {
      console.error("Error cargando familias:", error);
    } finally {
      setLoading(false);
    }
  };

  // Cargar colecciones de una familia específica
  const loadCollections = async (familiaId) => {
    try {
      setLoading(true);
             let collectionsData = await APIs.getCollectionByFamily(familiaId);

      collectionsData.unshift({ id: 0, nombre: 'Todas las Colecciones' });
      setCollections(collectionsData);

      // Limpiar selección de colección
      setSelectedCollection(null);

      // Si hay colecciones, seleccionar la primera y cargar sus productos
      if (collectionsData && collectionsData.length > 0) {
        setSelectedCollection(collectionsData[0].id);
        await loadProducts(familiaId, collectionsData[0].id, 1);
      } else {
        // Si no hay colecciones, limpiar productos
        setProducts([]);
        setFilteredProducts([]);
      }
    } catch (error) {
      console.error("Error cargando colecciones:", error);
    } finally {
      setLoading(false);
    }
  };

  // Cargar productos de una colección específica
  const loadProducts = async (familiaId, collectionId, pageNumber) => {
    try {
      setLoading(true);
      
      // Usar id_sucursal del contexto del editor si está disponible, sino usar userId como fallback
      const sucursalId = projectMetadata?.id_sucursal || userId;
      
      console.log('🔄 CatalogSection: Cargando productos con:', {
        sucursalId,
        familiaId,
        collectionId,
        pageNumber
      });
      
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

      const result = await APIs.getArticlesForVendedor(data);
      const productsData = result.data || result || [];

      setProducts(productsData);
      setFilteredProducts(productsData);
    } catch (error) {
      console.error("Error cargando productos:", error);
      setProducts([]);
      setFilteredProducts([]);
    } finally {
      setLoading(false);
    }
  };
  const loadProductsByCodeOrDesc = async (input, numberPage) => {
    try {
      setLoading(true);
      
      // Usar id_sucursal del contexto del editor si está disponible, sino usar userId como fallback
      const sucursalId = projectMetadata?.id_sucursal || userId;
      
      const data = {
        id: 0,
        activos: true,
        nombre: BuscarPor == 0 ? input : '',
        codigo: BuscarPor == 1 ? input : '',
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

      const result = await APIs.getArticlesForVendedor(data);
      const productsData = result.data || result || [];


      setProducts(productsData);
      setFilteredProducts(productsData);
    } catch (error) {
      console.error("Error cargando productos:", error);
      setProducts([]);
      setFilteredProducts([]);
    } finally {
      setLoading(false);
    }
  };
  useEffect(() => {
    loadFamilies();
  }, [projectMetadata?.id_sucursal]); // Cambiado de [userId] a [projectMetadata?.id_sucursal]
  
  // Monitorear cambios en projectMetadata para debugging
  useEffect(() => {
    if (projectMetadata?.id_sucursal) {
      console.log('🔄 CatalogSection: projectMetadata actualizado:', {
        id_sucursal: projectMetadata.id_sucursal,
        empresa: projectMetadata.empresa,
        sucursal: projectMetadata.sucursal
      });
    }
  }, [projectMetadata]);
  
  // Ensure inputs work in canvas
  useEffect(() => {
    const inputs = document.querySelectorAll('input[type="text"], select, textarea');
    inputs.forEach(input => {
      input.style.pointerEvents = 'auto';
      input.style.userSelect = 'text';
      input.style.cursor = 'text';
      input.style.zIndex = '1000';
      input.style.position = 'relative';
    });
  }, []);

  // Manejar clic en familia
  const handleFamiliaClick = async (familiaId) => {
    if (selectedFamilia === familiaId) {
      // Si ya está seleccionada, deseleccionar
      setSelectedFamilia(null);
      setSelectedCollection(null);
      setCollections([]);
      setProducts([]);
      setPage(1);

      setFilteredProducts([]);
    } else {
      // Seleccionar nueva familia
      setPage(1);

      setSelectedFamilia(familiaId);
      await loadCollections(familiaId);
    }
  };

  // Manejar clic en colección
  const handleCollectionClick = async (collectionId) => {
    if (selectedCollection === collectionId) {
      // Si ya está seleccionada, deseleccionar
      setSelectedCollection(null);
      setProducts([]);
      setFilteredProducts([]);
      setPage(1);

    } else {
      // Seleccionar nueva colección


      setSelectedCollection(collectionId);
      // if (selectedFamilia) {
      //   await loadProducts(selectedFamilia, collectionId);
      // }
      setPage(1);
      // Aseguramos que `page` se actualice antes de que `selectedCollection` cambie
      setTimeout(() => {
        setSelectedCollection(collectionId);
      }, 0);
    }
  };

  const handleViewProduct = async (product) => {
    console.log('=== HANDLE VIEW PRODUCT ===');
    console.log('Product:', product);
    
    setModalLoading(true);
    setModalArticle(null);
    setModalImgs([]);
    setModalOpciones([]);
    setModalCurrentImageIndex(0);
    setIsModalOpen(true);
    
    // Usar id_sucursal del contexto del editor si está disponible, sino usar userId como fallback
    const sucursalId = projectMetadata?.id_sucursal || userId;
    
    console.log('🔄 CatalogSection handleViewProduct: Usando sucursalId:', {
      sucursalId,
      projectMetadata: projectMetadata,
      fallbackUserId: userId
    });
    
    const data = {
      id: product.id,
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
      console.log('Modal data enviada:', data);
      const response = await fetch('http://hiplot.dyndns.org:84/cotizador_api/index.php/mantenimiento/get_articulos', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(data)
      });
      
      const result = await response.json();
      console.log('Modal response:', result);
      
      if (!result || result.length === 0) {
        throw new Error('No se encontraron artículos');
      }
      
      const art = result[0];
      console.log('Modal artículo cargado:', art);
      
      let plantillaData = art.plantilla_data || [];
      plantillaData = plantillaData.map((item) => ({
        ...item,
        id_plantillas_art_campos: item.id,
      }));
      
      const articleData = { ...art, plantilla_data: plantillaData };
      setModalArticle(articleData);
      
      // Configurar combinaciones
      if (art.opciones_de_variacion2 && art.opciones_de_variacion2.length > 0) {
        const combinacionesConfiguradas = art.opciones_de_variacion2.map((combinacion) => ({
          combinacion: combinacion.combinacion,
          OpcionSelected: "",
          opciones: combinacion.opciones || []
        }));
        setModalOpciones(combinacionesConfiguradas);
        console.log('Modal combinaciones configuradas:', combinacionesConfiguradas);
      }
      
      // Cargar imágenes
      try {
        const imgResponse = await fetch(`http://hiplot.dyndns.org:84/api_dev/articulo_imagenes_get/${art.id}`);
        const imgResult = await imgResponse.json();
        console.log('Modal imágenes cargadas:', imgResult);
        setModalImgs(imgResult || []);
      } catch (error) {
        console.error('Error cargando imágenes del modal:', error);
        setModalImgs([]);
      }
      
      setModalLoading(false);
      console.log('✅ Modal artículo cargado exitosamente:', articleData);
      
    } catch (error) {
      console.error('Error fetching modal data:', error);
      setModalLoading(false);
    }
  };
  
  const handleCloseModal = () => {
    setIsModalOpen(false);
    setModalArticle(null);
    setModalImgs([]);
    setModalOpciones([]);
    setModalCurrentImageIndex(0);
  };
  
  const handleModalCombinacionClick = (index) => {
    setModalActiveIndex(modalActiveIndex === index ? null : index);
  };
  
  const handleModalOptionSelect = (combinacionIndex, optionId) => {
    setModalOpciones(prev => {
      const newOpciones = prev.map((combinacion, index) => {
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
      
      return newOpciones;
    });
    
    setModalActiveIndex(null);
  };
  
  // Función para buscar artículo por combinaciones
  const fetch2 = async (selectedIds) => {
    // Usar id_sucursal del contexto del editor si está disponible, sino usar userId como fallback
    const sucursalId = projectMetadata?.id_sucursal || userId;
    
    console.log('🔄 CatalogSection fetch2: Usando sucursalId:', {
      sucursalId,
      projectMetadata: projectMetadata,
      fallbackUserId: userId
    });
    
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
      id_usuario: 106, // Valor fijo para id_usuario
      por_combinacion: true,
      opciones: selectedIds,
      id_articulo_variacion: modalArticle.id
    };

    try {
      setModalLoading(true);
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
        setModalArticle(newArticle);
        
        // Recargar imágenes del nuevo artículo
        try {
          const imgResponse = await fetch(`http://hiplot.dyndns.org:84/api_dev/articulo_imagenes_get/${newArticle.id}`);
          const imgResult = await imgResponse.json();
          setModalImgs(imgResult || []);
        } catch (error) {
          setModalImgs([]);
        }
        // Si el artículo tiene nuevas combinaciones, actualízalas
        if (newArticle.opciones_de_variacion2 && newArticle.opciones_de_variacion2.length > 0) {
          const combinacionesConfiguradas = newArticle.opciones_de_variacion2.map((combinacion) => ({
            combinacion: combinacion.combinacion,
            OpcionSelected: "",
            opciones: combinacion.opciones || []
          }));
          setModalOpciones(combinacionesConfiguradas);
        }
      }

    } catch (error) {
      console.error('Error fetching data:', error);
    } finally {
      setModalLoading(false);
    }
  };

  // Verificar si todas las combinaciones tienen una opción seleccionada
  const areAllCombinationsSelected = () => {
    return modalOpciones.some((combinacion) => 
      combinacion.OpcionSelected && combinacion.OpcionSelected !== ""
    );
  };

  // Obtener los IDs de las opciones seleccionadas
  const getSelectedIds = () => {
    const selectedIds = [];
    modalOpciones.forEach((combinacion) => {
      const selectedOption = combinacion.opciones.find((option) => option.selected);
      if (selectedOption) {
        selectedIds.push(selectedOption.id);
      }
    });
    return selectedIds;
  };

  const BuscarArticuloPorCombinacion = async () => {
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
  };

  // Force input focus function
  const forceInputFocus = (e) => {
    e.preventDefault();
    e.stopPropagation();
    e.target.focus();
    e.target.select();
  };
  const [pendingResetPage, setPendingResetPage] = useState(false);

  useEffect(() => {
    if (selectedFamilia !== null && selectedCollection !== null) {
      if (searchTerm.length > 0) {
      loadProductsByCodeOrDesc(searchTerm, page);

      }else {
      loadProducts(selectedFamilia, selectedCollection, page);

      }
    }
  }, [selectedFamilia, selectedCollection, page]);

  return (
    <>
      <style>
        {`
          /* Product Actions */
          .product-actions {
            display: flex;
            gap: 8px;
            margin-top: 12px;
          }
          
          .view-product-btn {
            flex: 1;
            padding: 8px 12px;
            background-color: #e0241b;
            color: white;
            border: none;
            border-radius: 6px;
            font-size: 12px;
            font-weight: 500;
            cursor: pointer;
            transition: all 0.2s;
          }
          
          .view-product-btn:hover {
            background-color: #c01e1e;
            transform: translateY(-1px);
          }
          
          /* Modal Styles */
          .product-modal-overlay {
            position: absolute;
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
          
          /* Canvas Input Fixes */
          input[type="text"], input[type="search"], select, textarea {
            pointer-events: auto !important;
            user-select: text !important;
            cursor: text !important;
            z-index: 1000 !important;
            position: relative !important;
          }
          
          input[type="text"]:focus, input[type="search"]:focus, select:focus, textarea:focus {
            outline: 2px solid #e0241b !important;
            outline-offset: 2px !important;
            z-index: 1001 !important;
          }
          
          .productCatalog-search-input, .productCatalog-familia-search {
            pointer-events: auto !important;
            user-select: text !important;
            cursor: text !important;
            z-index: 1000 !important;
            position: relative !important;
          }
          
          .productCatalog-search-input:focus, .productCatalog-familia-search:focus {
            outline: 2px solid #e0241b !important;
            outline-offset: 2px !important;
            z-index: 1001 !important;
          }
          
          /* Force input events */
          input, select, textarea {
            pointer-events: auto !important;
            user-select: text !important;
            cursor: text !important;
            z-index: 1000 !important;
            position: relative !important;
            background: white !important;
          }
          
          /* Ensure buttons work in canvas */
          button, .view-product-btn, .productCatalog-collection-btn {
            pointer-events: auto !important;
            cursor: pointer !important;
            z-index: 5 !important;
          }
          
          /* Ensure clickable items work */
          .productCatalog-familia-item {
            pointer-events: auto !important;
            cursor: pointer !important;
            z-index: 5 !important;
          }
          
          /* Combinaciones styles */
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
        `}
      </style>
     
        {/* Full Width Header */}
          <div style={{
          backgroundColor: 'white',
          borderBottom: '1px solid #e5e7eb',
          width: '100%'
        }}>
          <div style={{ padding: '24px' }}>
            <h1 style={{
              fontSize: '30px',
              fontWeight: 'bold',
              color: '#111827',
              margin: 0
            }}>
              {title}
            </h1>
            <p style={{
              color: '#6b7280',
              marginTop: '8px',
              margin: 0
            }}>
              {subtitle}
            </p>
          </div>
        </div>

        {/* Main Layout with Sidebar and Content */}
        <div className="productCatalog-main-content" style={{
          height: '100%',
          overflow: 'hidden'
        }}>
          {/* Content Below Header */}
          <div className="productCatalog-content-below-header" style={{
               display: 'flex',
               width: '100%',
               overflow: 'hidden',
               height: '100%'
          }}>
            {/* Sidebar - Familias */}
            <div className="productCatalog-sidebar" style={{
              width: '256px',
              backgroundColor: '#f9fafb',
              borderRight: '1px solid #e5e7eb',
              flexShrink: 0,
              height: '100%',
              overflow: 'hidden',
              display: 'grid',
              gridTemplateRows: 'auto 1fr'
            }}>
              <div className="productCatalog-sidebar-header" style={{ padding: '24px' }}>
                <h2 style={{
                  fontSize: '18px',
                  fontWeight: '600',
                  color: '#111827',
                  marginBottom: '16px'
                }}>FAMILIAS</h2>
              </div>
              <div className="productCatalog-familia-list" style={{ 
               display: 'grid',
               height: '100%',
               gridTemplateRows: 'auto 1fr',
               padding: '0px 24px 24px'
                }}>
                <input
                  type="text"
                  placeholder="Buscar familia..."
                  value={searchFamilia}
                  onChange={(e) => setSearchFamilia(e.target.value)}
                  onFocus={(e) => e.target.style.outline = '2px solid #e0241b'}
                  onBlur={(e) => e.target.style.outline = 'none'}
                  onClick={forceInputFocus}
                  onMouseDown={forceInputFocus}
                  className="productCatalog-familia-search"
                  style={{
                    width: '100%',
                    padding: '8px 12px',
                    border: '1px solid #d1d5db',
                    borderRadius: '8px',
                    fontSize: '14px',
                    marginBottom: '16px',
                    outline: 'none',
                    pointerEvents: 'auto',
                    userSelect: 'text',
                    cursor: 'text',
                    position: 'relative',
                    zIndex: 1000
                  }}
                />
                <div className='sidebar-familia-list' style={{

                  overflowY: 'auto',
                
                }}  >
                {loading ? (
                  <div className="productCatalog-loading" style={{ 
                    color: '#6b7280', 
                    textAlign: 'center', 
                    padding: '16px 0',
                    fontSize: '14px'
                  }}>Cargando familias...</div>
                ) : (
                  filteredFamilies.map((familia) => (
                    <div
                      key={familia.id}
                      className={`productCatalog-familia-item ${selectedFamilia === familia.id ? "active" : ""}`}
                      onClick={() => handleFamiliaClick(familia.id)}
                      style={{
                        width: '100%',
                        textAlign: 'left',
                        padding: '10px 12px',
                        borderRadius: '8px',
                        transition: 'all 0.2s',
                        fontSize: '14px',
                        cursor: 'pointer',
                        backgroundColor: selectedFamilia === familia.id ? '#e0241b' : 'transparent',
                        color: selectedFamilia === familia.id ? 'white' : '#374151',
                        boxShadow: selectedFamilia === familia.id ? '0 1px 3px rgba(0,0,0,0.1)' : 'none',
                        marginBottom: '4px'
                      }}
                    >
                      <span className="productCatalog-familia-name">{familia.nombre}</span>
                    </div>
                  ))
                )}
                </div>
              </div>
            </div>

            {/* Right Content */}
            <div className="productCatalog-right-content" style={{
              width: '100%',
              display: 'grid',
              gridTemplateRows: 'auto 1fr',
              // height: '100%'
            }}>
              {/* Collections y Search */}
              <div className="productCatalog-collections-search-section" style={{
                borderBottom: '1px solid #f3f4f6',
                backgroundColor: 'white'
              }}>
                <div style={{ padding: '16px 24px' }}>
                  <div style={{
                    display: 'flex',
                    justifyContent: 'space-between',
                    alignItems: 'center',
                    marginBottom: '16px'
                  }}>
                    {/* Search Controls */}
                <div className="productCatalog-search-container">
                      <div className='row' style={{ display: 'flex', gap: '12px' }}>
                    <div className='col-8 md-col-12'>
                      <input
                        type="text"
                        placeholder="Buscar productos..."
                        value={searchTerm}
                        onChange={(e) => setSearchTerm(e.target.value)}
                        onFocus={(e) => e.target.style.outline = '2px solid #e0241b'}
                        onBlur={(e) => e.target.style.outline = 'none'}
                        onClick={forceInputFocus}
                        onMouseDown={forceInputFocus}
                        className="productCatalog-search-input"
                        onKeyUp={(e) => e.key === 'Enter' && loadProductsByCodeOrDesc(e.currentTarget.value,1)}
                            style={{
                              padding: '8px 16px',
                              border: '1px solid #e5e7eb',
                              borderRadius: '8px',
                              fontSize: '14px',
                              backgroundColor: 'white',
                              minWidth: '250px',
                              outline: 'none',
                              pointerEvents: 'auto',
                              userSelect: 'text',
                              cursor: 'text',
                              position: 'relative',
                              zIndex: 1000
                            }}
                      />
                    </div>
                    <div className='col-4 md-col-12'>
                          <select 
                            className='inputs__general' 
                            onChange={(e) => setBuscarPor(Number(e.target.value))} 
                            value={BuscarPor}
                            onClick={forceInputFocus}
                            onMouseDown={forceInputFocus}
                            style={{
                              padding: '8px 12px',
                              border: '1px solid #e5e7eb',
                              borderRadius: '8px',
                              fontSize: '14px',
                              backgroundColor: 'white',
                              outline: 'none',
                              pointerEvents: 'auto',
                              userSelect: 'text',
                              cursor: 'pointer',
                              position: 'relative',
                              zIndex: 1000
                            }}
                          >
                        <option value="0">Por Descripción</option>
                        <option value="1">Codigo</option>
                      </select>
                    </div>
                  </div>
                    </div>
                  </div>

                  {/* Horizontal Collections */}
                  <div className="productCatalog-collections-nav">
                    {collections.length > 0 && (
                      <div style={{
                        display: 'flex',
                        gap: '8px',
                        overflowX: 'auto',
                        paddingBottom: '8px'
                      }}>
                        {loading ? (
                          <div className="productCatalog-loading" style={{ 
                            color: '#6b7280', 
                            fontSize: '14px'
                          }}>Cargando colecciones...</div>
                        ) : (
                          collections.map((collection) => (
                            <button
                              key={collection.id}
                              className={`productCatalog-collection-btn ${selectedCollection === collection.id ? "active" : ""}`}
                              onClick={() => handleCollectionClick(collection.id)}
                              style={{
                                padding: '8px 16px',
                                borderRadius: '8px',
                                whiteSpace: 'nowrap',
                                transition: 'all 0.2s',
                                fontSize: '14px',
                                fontWeight: '500',
                                border: 'none',
                                cursor: 'pointer',
                                backgroundColor: selectedCollection === collection.id ? '#e0241b' : '#f3f4f6',
                                color: selectedCollection === collection.id ? 'white' : '#374151',
                                boxShadow: selectedCollection === collection.id ? '0 1px 3px rgba(0,0,0,0.1)' : 'none'
                              }}
                            >
                              {collection.nombre}
                            </button>
                          ))
                        )}
                      </div>
                    )}
                  </div>
                </div>
              </div>

              {/* Products Section */}
              <div className="productCatalog-products-section" style={{
                    padding: '24px',
                    height: '100%',
                    display: 'grid',
                    gridTemplateRows: 'auto 1fr auto',
                    overflow: 'auto'
              }}>
                <div className="productCatalog-products-header" style={{
                  display: 'flex',
                  justifyContent: 'space-between',
                  alignItems: 'center',
                  marginBottom: '24px'
                }}>
                  <h2 className="productCatalog-products-title" style={{
                    fontSize: '20px',
                    fontWeight: '600',
                    color: '#111827',
                    margin: 0
                  }}>
                    {selectedCollection
                      ? `PRODUCTOS - ${collections.find((c) => c.id === selectedCollection)?.nombre}`
                      : "SELECCIONA UNA COLECCIÓN"}
                  </h2>
                  <span className="productCatalog-products-count" style={{
                    fontSize: '14px',
                    color: '#6b7280'
                  }}>
                    {filteredProducts.length} productos encontrados
                  </span>
                </div>

                {loading ? (
                  <div className="productCatalog-loading" style={{
                    textAlign: 'center',
                    padding: '64px 0'
                  }}>
                    <div style={{
                      display: 'inline-flex',
                      alignItems: 'center',
                      padding: '8px 16px',
                      fontSize: '14px',
                      color: '#6b7280'
                    }}>
                      <svg style={{
                        animation: 'spin 1s linear infinite',
                        marginRight: '12px',
                        width: '20px',
                        height: '20px'
                      }} xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                        <circle style={{ opacity: 0.25 }} cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                        <path style={{ opacity: 0.75 }} fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                      </svg>
                      Cargando productos...
                    </div>
                  </div>
                ) : (
                  <div className="productCatalog-products-grid" style={{
                    display: 'grid',
                    gridTemplateColumns: 'repeat(auto-fill, minmax(200px, 1fr))',
                    gap: '16px',
                 
                    overflowY: 'auto'
                  }}>
                    {filteredProducts.map((x, i) => (
                      <div 
                        className='item' 
                        key={i} 
                        onClick={() => handleViewProduct(x)} 
                        style={{
                          cursor: 'pointer',
                          backgroundColor: 'white',
                          border: '1px solid #f3f4f6',
                          borderRadius: '12px',
                         
                          transition: 'all 0.2s',
                          boxShadow: '0 1px 3px rgba(0,0,0,0.1)',
                          height: 'auto'
                        }}
                      >
                        <div className='img' style={{
                          aspectRatio: '1/1',
                          backgroundColor: '#f9fafb',
                          overflow: 'hidden'
                        }}>
                          <img
                            src={`${url_img}${x.imagen}` || 'https://placeholder.co/300x300'}
                            alt={x.descripcion}
                            className="productCatalog-product-image"
                            style={{
                              width: '100%',
                              height: '100%',
                              objectFit: 'cover',
                              transition: 'transform 0.3s'
                            }}
                          />
                              </div>
                        <div className='content' style={{ padding: '12px' }}>
                          <p className='code' style={{
                            fontSize: '12px',
                            color: '#6b7280',
                            margin: '0 0 4px 0'
                          }}>{x.codigo}</p>
                          <p className='descripcion' style={{
                            fontWeight: '500',
                            color: '#111827',
                            fontSize: '14px',
                            margin: '0 0 8px 0',
                            lineHeight: '1.3'
                          }}>{x.descripcion}</p>
                          
                          <div className="product-actions" style={{
                            display: 'flex',
                            gap: '8px',
                            marginTop: '12px'
                          }}>
                            <button 
                              className="view-product-btn" 
                              onClick={(e) => {
                                e.stopPropagation();
                                handleViewProduct(x);
                              }}
                              style={{
                                flex: 1,
                                padding: '8px 12px',
                                backgroundColor: '#e0241b',
                                color: 'white',
                                border: 'none',
                                borderRadius: '6px',
                                fontSize: '12px',
                                fontWeight: '500',
                                cursor: 'pointer',
                                transition: 'all 0.2s'
                              }}
                            >
                              Ver Detalles
                            </button>
                          </div>
                      
                          {x.desabasto == true ?
                            <div className='desabasto' style={{
                              display: 'inline-block',
                              padding: '2px 6px',
                              fontSize: '12px',
                              fontWeight: '500',
                              backgroundColor: '#fee2e2',
                              color: '#dc2626',
                              borderRadius: '4px',
                              marginTop: '4px'
                            }}>
                              <small>Agotado</small>
                            </div>
                            :
                            ''
                          }
                          {x.ultimas_piezas == true ?
                            <div className='ultima-piezas' style={{
                              display: 'inline-block',
                              padding: '2px 6px',
                              fontSize: '12px',
                              fontWeight: '500',
                              backgroundColor: '#fef3c7',
                              color: '#d97706',
                              borderRadius: '4px',
                              marginTop: '4px'
                            }}>
                              <small>Últimas</small>
                            </div>
                            :
                            ''
                          }

                        </div>
                      </div>
                    ))}
                  </div>
                )}

                {!loading && filteredProducts.length === 0 && (
                  <div className="productCatalog-no-products" style={{
                    textAlign: 'center',
                    padding: '64px 0'
                  }}>
                    <h3 style={{
                      color: '#6b7280',
                      fontSize: '18px',
                      marginBottom: '8px'
                    }}>No se encontraron productos</h3>
                    <p style={{
                      color: '#9ca3af',
                      fontSize: '14px'
                    }}>Intenta ajustar tus filtros o términos de búsqueda</p>
                  </div>
                )}

                {/* Pagination Controls - Below Products */}
                {!loading && filteredProducts.length > 0 && (
                  <div style={{
                    display: 'flex',
                    justifyContent: 'center',
                    gap: '8px',
                    marginTop: '32px',
                    paddingTop: '24px',
                    borderTop: '1px solid #f3f4f6'
                  }}>
                    <div className='row' style={{ 
                      display: 'flex', 
                      alignItems: 'center',
                      gap: '12px'
                    }}>
                <div className='col-1'>
                        <button 
                          className='btn__general-primary' 
                          onClick={() => { setPage(page - 1); SearcherController = 1; }} 
                          disabled={page == 1}
                          style={{
                            padding: '6px 16px',
                            backgroundColor: page == 1 ? '#f3f4f6' : '#f3f4f6',
                            color: page == 1 ? '#9ca3af' : '#374151',
                            borderRadius: '6px',
                            fontSize: '14px',
                            border: 'none',
                            cursor: page == 1 ? 'not-allowed' : 'pointer',
                            opacity: page == 1 ? 0.5 : 1,
                            transition: 'all 0.2s'
                          }}
                        >
                          ANTERIOR
                        </button>
                </div>
                <div className='col-10'>
                        <span style={{
                          padding: '6px 12px',
                          fontSize: '14px',
                          color: '#6b7280',
                          backgroundColor: '#f9fafb',
                          borderRadius: '6px'
                        }}>
                          Página {page}
                        </span>
                </div>
                <div className='col-1'>
                        <button 
                          className='btn__general-primary' 
                          onClick={() => { setPage(page + 1); SearcherController = 1; }}
                          style={{
                            padding: '6px 16px',
                            backgroundColor: '#e0241b',
                            color: 'white',
                            borderRadius: '6px',
                            fontSize: '14px',
                            border: 'none',
                            cursor: 'pointer',
                            transition: 'all 0.2s'
                          }}
                        >
                          SIGUIENTE
                        </button>
                </div>
                    </div>
                </div>
                )}
              </div>
            </div>
          </div>
        </div>

        {/* Product Modal */}
        {isModalOpen && (
          <div 
            className="product-modal-overlay" 
            onClick={handleCloseModal}
            style={{
              position: 'absolute',
              top: 0,
              left: 0,
              right: 0,
              bottom: 0,
              backgroundColor: 'rgba(0, 0, 0, 0.5)',
              display: 'flex',
              justifyContent: 'center',
              alignItems: 'center',
              zIndex: 1000,
              padding: '1rem'
            }}
          >
            <div 
              className="product-modal-content"
              onClick={(e) => e.stopPropagation()}
              style={{
                background: 'white',
                borderRadius: '16px',
                maxWidth: '900px',
                width: '100%',
                maxHeight: '90vh',
                overflow: 'hidden',
                boxShadow: '0 20px 25px -5px rgba(0, 0, 0, 0.1), 0 10px 10px -5px rgba(0, 0, 0, 0.04)'
              }}
            >
              <div className="product-modal-header" style={{
                display: 'flex',
                justifyContent: 'space-between',
                alignItems: 'center',
                padding: '1.5rem 2rem',
                borderBottom: '1px solid #e2e8f0',
                background: 'linear-gradient(135deg, #f8fafc 0%, #f1f5f9 100%)'
              }}>
                <h2 className="product-modal-title" style={{
                  fontSize: '1.25rem',
                  fontWeight: '700',
                  color: '#0f172a',
                  margin: 0
                }}>
                  Detalles del Producto
                </h2>
                <button 
                  className="product-modal-close" 
                  onClick={handleCloseModal}
                  style={{
                    background: 'none',
                    border: 'none',
                    color: '#64748b',
                    cursor: 'pointer',
                    padding: '0.5rem',
                    borderRadius: '8px',
                    transition: 'all 0.2s ease',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center'
                  }}
                >
                  ✕
                </button>
              </div>
              
              <div className="product-modal-body" style={{
                display: 'flex',
                maxHeight: 'calc(90vh - 80px)',
                overflow: 'hidden'
              }}>
                <div className="product-modal-image-section" style={{
                  flex: 1,
                  maxWidth: '400px',
                  background: '#f8fafc',
                  position: 'relative'
                }}>
                  <div className="product-modal-image-container" style={{
                    position: 'relative',
                    width: '100%',
                    height: '100%',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    padding: '2rem'
                  }}>
                    {modalArticle && (
                      <img
                        src={`${url_img}${modalImgs.length > 0 ? modalImgs[modalCurrentImageIndex]?.img_url : modalArticle.imagen}`}
                        alt={modalArticle.nombre}
                        className="product-modal-image"
                        style={{
                          maxWidth: '100%',
                          maxHeight: '100%',
                          objectFit: 'contain',
                          borderRadius: '12px',
                          boxShadow: '0 4px 6px -1px rgba(0, 0, 0, 0.1)'
                        }}
                        onError={(e) => {
                          console.log('Error cargando imagen del modal:', e.currentTarget.src);
                          e.currentTarget.src = `${url_img}${modalArticle.imagen}`;
                        }}
                      />
                    )}
                  </div>
      </div>
                
                <div className="product-modal-info-section" style={{
                  flex: 1,
                  padding: '2rem',
                  overflowY: 'auto',
                  display: 'flex',
                  flexDirection: 'column',
                  gap: '2rem'
                }}>
                  {modalLoading ? (
                    <div style={{
                      textAlign: 'center',
                      padding: '2rem',
                      color: '#64748b'
                    }}>
                      Cargando información del producto...
                    </div>
                  ) : modalArticle ? (
                    <>
                      <div className="product-header">
                        <div className="product-code" style={{
                          fontSize: '0.75rem',
                          color: '#64748b',
                          fontWeight: '600',
                          textTransform: 'uppercase',
                          letterSpacing: '0.05em'
                        }}>
                          CÓDIGO: {modalArticle.codigo}
                        </div>
                        <h3 className="product-name" style={{
                          fontSize: '1.75rem',
                          fontWeight: '700',
                          color: '#0f172a',
                          margin: 0,
                          lineHeight: '1.2'
                        }}>
                          {modalArticle.nombre}
                        </h3>
                      </div>
                      
                      <div className="product-description" style={{
                        background: '#f8fafc',
                        padding: '1.5rem',
                        borderRadius: '12px',
                        borderLeft: '4px solid #941e1e'
                      }}>
                        <p style={{
                          fontSize: '0.875rem',
                          color: '#475569',
                          lineHeight: '1.6',
                          margin: 0
                        }}>
                          {modalArticle.descripcion}
                        </p>
                      </div>
                      
                      <div className="product-details" style={{
                        display: 'flex',
                        flexDirection: 'column',
                        gap: '1rem'
                      }}>
                        {modalArticle.precio && (
                          <div className="detail-item price" style={{
                            display: 'flex',
                            justifyContent: 'space-between',
                            alignItems: 'center',
                            padding: '1rem 1.5rem',
                            background: 'linear-gradient(135deg, #f0fdf4 0%, #ecfdf5 100%)',
                            borderRadius: '8px',
                            border: '1px solid #10b981'
                          }}>
                            <span className="detail-label" style={{
                              fontSize: '0.875rem',
                              fontWeight: '600',
                              color: '#64748b',
                              textTransform: 'uppercase',
                              letterSpacing: '0.05em'
                            }}>
                              Precio
                            </span>
                            <span className="detail-value price-value" style={{
                              fontSize: '1.25rem',
                              fontWeight: '700',
                              color: '#10b981'
                            }}>
                              ${modalArticle.precio.toFixed(2)}
                            </span>
                          </div>
                        )}
                        
                        {modalArticle.familia && (
                          <div className="detail-item" style={{
                            display: 'flex',
                            justifyContent: 'space-between',
                            alignItems: 'center',
                            padding: '1rem 1.5rem',
                            background: '#f8fafc',
                            borderRadius: '8px',
                            border: '1px solid #e2e8f0'
                          }}>
                            <span className="detail-label" style={{
                              fontSize: '0.875rem',
                              fontWeight: '600',
                              color: '#64748b',
                              textTransform: 'uppercase',
                              letterSpacing: '0.05em'
                            }}>
                              Familia
                            </span>
                            <span className="detail-value" style={{
                              fontSize: '0.875rem',
                              fontWeight: '500',
                              color: '#0f172a'
                            }}>
                              {modalArticle.familia}
                            </span>
                          </div>
                        )}
                        
                        {modalArticle.coleccion && (
                          <div className="detail-item" style={{
                            display: 'flex',
                            justifyContent: 'space-between',
                            alignItems: 'center',
                            padding: '1rem 1.5rem',
                            background: '#f8fafc',
                            borderRadius: '8px',
                            border: '1px solid #e2e8f0'
                          }}>
                            <span className="detail-label" style={{
                              fontSize: '0.875rem',
                              fontWeight: '600',
                              color: '#64748b',
                              textTransform: 'uppercase',
                              letterSpacing: '0.05em'
                            }}>
                              Colección
                            </span>
                            <span className="detail-value" style={{
                              fontSize: '0.875rem',
                              fontWeight: '500',
                              color: '#0f172a'
                            }}>
                              {modalArticle.coleccion}
                            </span>
                          </div>
                        )}
                      </div>
                      
                      {/* Combinaciones */}
                      {modalOpciones && modalOpciones.length > 0 && (
                        <div className="combinaciones" style={{
                          background: '#f8fafc',
                          padding: '1.5rem',
                          borderRadius: '12px',
                          border: '1px solid #e2e8f0'
                        }}>
                          <h4 style={{
                            fontSize: '1.25rem',
                            fontWeight: '700',
                            color: '#0f172a',
                            margin: '0 0 1.5rem 0',
                            paddingBottom: '0.75rem',
                            borderBottom: '2px solid #e2e8f0'
                          }}>
                            Combinaciones Disponibles
                          </h4>
                          
                          {modalOpciones.map((combinacion, index) => (
                            <div key={index} className="combinaciones__container" style={{
                              marginBottom: '1.25rem'
                            }}>
                              <div 
                                className="container__combination"
                                onClick={(e) => {
                                  e.stopPropagation();
                                  handleModalCombinacionClick(index);
                                }}
                                style={{
                                  cursor: 'pointer',
                                  transition: 'all 0.2s ease',
                                  borderRadius: '8px',
                                  padding: '14px 16px',
                                  fontWeight: '500',
                                  display: 'flex',
                                  alignItems: 'center',
                                  justifyContent: 'space-between',
                                  border: '1px solid #e2e8f0',
                                  background: 'white',
                                  position: 'relative'
                                }}
                              >
                                <span>
                                  {combinacion.OpcionSelected && combinacion.OpcionSelected !== "" 
                                    ? combinacion.OpcionSelected 
                                    : combinacion.combinacion}
                                </span>
                              </div>
                              
                              {modalActiveIndex === index && (
                                <div className="combination_options" style={{
                                  marginTop: '0.75rem',
                                  padding: '1rem',
                                  background: 'white',
                                  borderRadius: '8px',
                                  border: '1px solid #e2e8f0'
                                }}>
                                  <div className="options-grid" style={{
                                    display: 'grid',
                                    gridTemplateColumns: 'repeat(auto-fit, minmax(120px, 1fr))',
                                    gap: '0.75rem'
                                  }}>
                                    {combinacion.opciones.map((option) => (
                                      <div 
                                        key={option.id}
                                        className="option-item"
                                        onClick={(e) => {
                                          e.stopPropagation();
                                          handleModalOptionSelect(index, option.id);
                                        }}
                                        style={{
                                          display: 'flex',
                                          alignItems: 'center',
                                          justifyContent: 'center',
                                          padding: '0.625rem 0.875rem',
                                          border: '1px solid #e2e8f0',
                                          borderRadius: '6px',
                                          cursor: 'pointer',
                                          transition: 'all 0.2s ease',
                                          background: 'white',
                                          fontWeight: '500',
                                          textAlign: 'center',
                                          minHeight: '40px'
                                        }}
                                      >
                                        {option.tipo === "2" ? (
                                          <div className="color-option" style={{
                                            display: 'flex',
                                            alignItems: 'center',
                                            justifyContent: 'center',
                                            width: '100%'
                                          }}>
                                            <div className="tooltip-container" style={{
                                              position: 'relative',
                                              display: 'inline-block'
                                            }}>
                                              <div
                                                className="color-swatch"
                                                style={{
                                                  width: '24px',
                                                  height: '24px',
                                                  border: '2px solid #e2e8f0',
                                                  borderRadius: '6px',
                                                  boxShadow: '0 2px 4px rgba(0, 0, 0, 0.1)',
                                                  transition: 'all 0.3s ease',
                                                  backgroundColor: option.color
                                                }}
                                              />
                                              <span className="tooltip-text" style={{
                                                visibility: 'hidden',
                                                width: '120px',
                                                backgroundColor: '#555',
                                                color: '#fff',
                                                textAlign: 'center',
                                                borderRadius: '6px',
                                                padding: '5px',
                                                position: 'absolute',
                                                zIndex: 1,
                                                bottom: '125%',
                                                left: '50%',
                                                marginLeft: '-60px',
                                                opacity: 0,
                                                transition: 'opacity 0.3s',
                                                fontSize: '0.75rem'
                                              }}>
                                                {option.nombre}
                                              </span>
                                            </div>
                                          </div>
                                        ) : (
                                          <span className="option-text" style={{
                                            fontSize: '0.875rem',
                                            fontWeight: '500'
                                          }}>
                                            {option.nombre}
                                          </span>
                                        )}
                                      </div>
                                    ))}
                                  </div>
                                </div>
                              )}
                            </div>
                          ))}
                        </div>
                      )}
                      
                      {/* Indicador de búsqueda automática */}
                      {modalLoading && (
                        <div 
                          className="search__sale-card"
                          style={{
                            display: 'flex',
                            alignItems: 'center',
                            justifyContent: 'center',
                            gap: '0.5rem',
                            background: '#941e1e',
                            color: 'white',
                            padding: '0.875rem 1.25rem',
                            borderRadius: '8px',
                            fontWeight: '500',
                            fontSize: '0.875rem',
                            marginTop: '1rem',
                            border: 'none'
                          }}
                        >
                          <div className="loading-spinner"></div>
                          Buscando artículo con combinaciones...
                        </div>
                      )}
                    </>
                  ) : (
                    <div style={{
                      textAlign: 'center',
                      padding: '2rem',
                      color: '#dc2626'
                    }}>
                      No se pudo cargar la información del producto
                    </div>
                  )}
                </div>
              </div>
            </div>
          </div>
        )}

     

    </>
  );

};

export default ProductCatalog
