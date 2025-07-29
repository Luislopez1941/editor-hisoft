import React, { useEffect, useState } from 'react';
import useUserStore from '../../store/General';
import APIs from '../../services/services/APIs';

const ProductCatalog = ({ isPreviewMode = false, title = 'Catálogo de Productos', subtitle = 'Explora nuestra selección de productos' }) => {
  const [selectedFamilia, setSelectedFamilia] = useState(null);
  const [selectedCollection, setSelectedCollection] = useState(null);
  const [searchTerm, setSearchTerm] = useState("");
  const [products, setProducts] = useState([]);
  const [filteredProducts, setFilteredProducts] = useState([]);
  const [loading, setLoading] = useState(false);
  const [selectedProduct, setSelectedProduct] = useState(null);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const { url_img } = useUserStore();

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
             const familiesData = await APIs.getFamilies(userId);
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
        id_usuario: userId,
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
  }, [userId]);

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

  const modal = async (x) => {
    // Handle modal functionality here
    console.log('Product selected:', x);
    setIdA(i)
    let newi = i + 1;
    setI(newi);
    // Note: SalesCard functionality removed as requested
    // You can add your modal logic here
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
                  className="productCatalog-familia-search"
                  style={{
                    width: '100%',
                    padding: '8px 12px',
                    border: '1px solid #d1d5db',
                    borderRadius: '8px',
                    fontSize: '14px',
                    marginBottom: '16px',
                    outline: 'none'
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
                            className="productCatalog-search-input"
                            onKeyUp={(e) => e.key === 'Enter' && loadProductsByCodeOrDesc(e.currentTarget.value,1)}
                            style={{
                              padding: '8px 16px',
                              border: '1px solid #e5e7eb',
                              borderRadius: '8px',
                              fontSize: '14px',
                              backgroundColor: 'white',
                              minWidth: '250px',
                              outline: 'none'
                            }}
                          />
                        </div>
                        <div className='col-4 md-col-12'>
                          <select 
                            className='inputs__general' 
                            onChange={(e) => setBuscarPor(Number(e.target.value))} 
                            value={BuscarPor}
                            style={{
                              padding: '8px 12px',
                              border: '1px solid #e5e7eb',
                              borderRadius: '8px',
                              fontSize: '14px',
                              backgroundColor: 'white',
                              outline: 'none'
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
                        onClick={() => modal(x)} 
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
                          <div className='labels' style={{
                            display: 'flex',
                            flexWrap: 'wrap',
                            gap: '4px'
                          }}>
                            {x.bajo_pedido == true ?
                              <div className='bajo-pedido' style={{
                                display: 'inline-flex',
                                alignItems: 'center',
                                gap: '4px',
                                padding: '2px 6px',
                                fontSize: '12px',
                                fontWeight: '500',
                                backgroundColor: '#dbeafe',
                                color: '#1d4ed8',
                                borderRadius: '4px'
                              }}>
                                <svg xmlns="http://www.w3.org/2000/svg" width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.75" strokeLinecap="round" strokeLinejoin="round" className="lucide lucide-truck"><path d="M14 18V6a2 2 0 0 0-2-2H4a2 2 0 0 0-2 2v11a1 1 0 0 0 1 1h2" /><path d="M15 18H9" /><path d="M19 18h2a1 1 0 0 0 1-1v-3.65a1 1 0 0 0-.22-.624l-3.48-4.35A1 1 0 0 0 17.52 8H14" /><circle cx="17" cy="18" r="2" /><circle cx="7" cy="18" r="2" /></svg>
                                <small>Pedido</small>
                              </div>
                              :
                              ''
                            }
                            {x.vender_sin_stock == true ?
                              <div className='vender-sin-stock' style={{
                                display: 'inline-flex',
                                alignItems: 'center',
                                gap: '4px',
                                padding: '2px 6px',
                                fontSize: '12px',
                                fontWeight: '500',
                                backgroundColor: '#dcfce7',
                                color: '#166534',
                                borderRadius: '4px'
                              }}>
                                <svg xmlns="http://www.w3.org/2000/svg" width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.75" strokeLinecap="round" strokeLinejoin="round" className="lucide lucide-shopping-bag"><path d="M6 2 3 6v14a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2V6l-3-4Z" /><path d="M3 6h18" /><path d="M16 10a4 4 0 0 1-8 0" /></svg>
                                <small>S/Stock</small>
                              </div>
                              :
                              ''
                            }

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
        {/* <ProductModal
      isOpen={isModalOpen}
      onClose={handleCloseModal}
      product={selectedProduct}
      url_img={url_img}
    /> */}

     

    </>
  );

};

export default ProductCatalog
