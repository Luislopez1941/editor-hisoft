import React, { useState, useEffect } from 'react';
import styled from 'styled-components';
import { Package, Grid3X3, Loader2, ShoppingBag, Tags, Search } from 'lucide-react';
import APIs from '../../services/services/APIs';

const CatalogSectionContainer = styled.div`
  width: 100%;
  background: #ffffff;
  border: 1px solid #e5e7eb;
  border-radius: 12px;
  overflow: hidden;
  font-family: 'Inter', system-ui, sans-serif;
`;

const CatalogHeader = styled.div`
  padding: 24px;
  border-bottom: 1px solid #f1f5f9;
  background: linear-gradient(135deg, #f8fafc, #f1f5f9);
  text-align: center;
`;

const CatalogTitle = styled.h2`
  margin: 0 0 8px 0;
  font-size: 24px;
  font-weight: 700;
  color: #1e293b;
  display: flex;
  align-items: center;
  justify-content: center;
  gap: 10px;
`;

const CatalogSubtitle = styled.p`
  margin: 0;
  font-size: 14px;
  color: #64748b;
  line-height: 1.4;
`;

const CatalogContent = styled.div`
  display: flex;
  min-height: 400px;
`;

// Panel izquierdo - Familias
const FamiliesPanel = styled.div`
  width: 200px;
  background: #f8fafc;
  border-right: 1px solid #e5e7eb;
  overflow-y: auto;
  max-height: 400px;
`;

const FamiliesList = styled.div`
  padding: 12px 0;
`;

const FamilyItem = styled.div`
  display: flex;
  align-items: center;
  gap: 8px;
  padding: 8px 16px;
  cursor: pointer;
  transition: all 0.2s ease;
  color: ${props => props.active ? '#1e293b' : '#475569'};
  background: ${props => props.active ? 'linear-gradient(135deg, #eff6ff, #dbeafe)' : 'transparent'};
  border-left: 3px solid ${props => props.active ? '#3b82f6' : 'transparent'};
  font-size: 12px;
  font-weight: ${props => props.active ? '600' : '500'};
  
  &:hover {
    background: ${props => props.active ? 'linear-gradient(135deg, #eff6ff, #dbeafe)' : '#f1f5f9'};
    color: #1e293b;
  }
`;

const FamilyIcon = styled.div`
  width: 16px;
  height: 16px;
  display: flex;
  align-items: center;
  justify-content: center;
  color: ${props => props.active ? '#3b82f6' : '#64748b'};
`;

// Panel derecho - Contenido principal
const MainContent = styled.div`
  flex: 1;
  display: flex;
  flex-direction: column;
`;

// Sección superior - Colecciones
const CollectionsSection = styled.div`
  background: #ffffff;
  border-bottom: 1px solid #e5e7eb;
  padding: 12px 16px;
  max-height: 120px;
  overflow-y: auto;
`;

const CollectionsTitle = styled.h4`
  margin: 0 0 8px 0;
  font-size: 12px;
  font-weight: 600;
  color: #64748b;
  text-transform: uppercase;
  letter-spacing: 0.5px;
`;

const CollectionsGrid = styled.div`
  display: flex;
  gap: 8px;
  flex-wrap: wrap;
`;

const CollectionCard = styled.div`
  background: ${props => props.active ? 'linear-gradient(135deg, #3b82f6, #1d4ed8)' : '#f8fafc'};
  color: ${props => props.active ? '#ffffff' : '#1e293b'};
  border: 1px solid ${props => props.active ? '#3b82f6' : '#e5e7eb'};
  border-radius: 6px;
  padding: 6px 12px;
  cursor: pointer;
  transition: all 0.2s ease;
  font-size: 11px;
  font-weight: 600;
  text-align: center;
  
  &:hover {
    border-color: #3b82f6;
    background: ${props => props.active ? 'linear-gradient(135deg, #2563eb, #1e40af)' : '#eff6ff'};
    transform: translateY(-1px);
  }
`;

// Sección principal - Productos
const ProductsSection = styled.div`
  flex: 1;
  padding: 16px;
  overflow-y: auto;
  background: #ffffff;
  max-height: 280px;
`;

const ProductsGrid = styled.div`
  display: grid;
  grid-template-columns: repeat(auto-fill, minmax(150px, 1fr));
  gap: 12px;
`;

const ProductCard = styled.div`
  background: #ffffff;
  border: 1px solid #e5e7eb;
  border-radius: 8px;
  padding: 12px;
  transition: all 0.2s ease;
  box-shadow: 0 1px 3px rgba(0, 0, 0, 0.05);
  
  &:hover {
    border-color: #3b82f6;
    box-shadow: 0 2px 6px rgba(59, 130, 246, 0.15);
    transform: translateY(-1px);
  }
`;

const ProductImage = styled.div`
  width: 100%;
  height: 80px;
  background: ${props => props.image ? `url(${props.image})` : 'linear-gradient(135deg, #f1f5f9, #e2e8f0)'};
  background-size: cover;
  background-position: center;
  border-radius: 6px;
  margin-bottom: 8px;
  display: flex;
  align-items: center;
  justify-content: center;
  color: #64748b;
`;

const ProductName = styled.h6`
  margin: 0 0 4px 0;
  font-size: 12px;
  font-weight: 600;
  color: #1e293b;
  line-height: 1.3;
  overflow: hidden;
  text-overflow: ellipsis;
  white-space: nowrap;
`;

const ProductCode = styled.p`
  margin: 0;
  font-size: 10px;
  color: #64748b;
  font-weight: 500;
`;

const LoadingContainer = styled.div`
  display: flex;
  align-items: center;
  justify-content: center;
  padding: 20px;
  color: #64748b;
  gap: 8px;
  font-size: 12px;
`;

const EmptyState = styled.div`
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  padding: 20px;
  color: #64748b;
  text-align: center;
`;

const CatalogSection = ({ title = "Catálogo de Productos", subtitle = "Explora nuestra selección de productos" }) => {
  const [families, setFamilies] = useState([]);
  const [collections, setCollections] = useState([]);
  const [products, setProducts] = useState([]);
  const [selectedFamily, setSelectedFamily] = useState(null);
  const [selectedCollection, setSelectedCollection] = useState(null);
  const [loading, setLoading] = useState(false);
  const [loadingProducts, setLoadingProducts] = useState(false);

  // Cargar familias al inicializar
  useEffect(() => {
    loadFamilies();
  }, []);

  // Cargar colecciones cuando se selecciona una familia
  useEffect(() => {
    if (selectedFamily) {
      loadCollections(selectedFamily.id);
    }
  }, [selectedFamily]);

  const loadFamilies = async () => {
    try {
      setLoading(true);
      const familiesData = await APIs.getFamilies(3);
      setFamilies(familiesData || []);
      
      // Seleccionar la primera familia automáticamente
      if (familiesData && familiesData.length > 0) {
        setSelectedFamily(familiesData[0]);
      }
    } catch (error) {
      console.error('Error loading families:', error);
      setFamilies([]);
    } finally {
      setLoading(false);
    }
  };

  const loadCollections = async (familyId) => {
    try {
      setLoading(true);
      const collectionsData = await APIs.getCollectionByFamily(familyId);
      setCollections(collectionsData || []);
      setSelectedCollection(null);
      setProducts([]);
    } catch (error) {
      console.error('Error loading collections:', error);
      setCollections([]);
    } finally {
      setLoading(false);
    }
  };

  const loadProducts = async (collectionId) => {
    try {
      setLoadingProducts(true);
      const userId = 1; // Esto debería venir del contexto o auth
      
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
        id_coleccion: collectionId,
        get_stock: false,
        get_web: true,
        get_unidades: false,
        for_vendedor: true,
        page: 1,
        id_usuario: 3,
        light: true,
      };
      
      const result = await APIs.getArticlesForVendedor(data);
      setProducts(result);
    } catch (error) {
      console.error('Error loading products:', error);
      setProducts([]);
    } finally {
      setLoadingProducts(false);
    }
  };

  const handleFamilySelect = (family) => {
    setSelectedFamily(family);
    setSelectedCollection(null);
    setProducts([]);
  };

  const handleCollectionSelect = (collection) => {
    setSelectedCollection(collection);
    loadProducts(collection.id);
  };

  return (
    <CatalogSectionContainer>
      <CatalogHeader>
        <CatalogTitle>
          <Package size={20} />
          {title}
        </CatalogTitle>
        <CatalogSubtitle>
          {subtitle}
        </CatalogSubtitle>
      </CatalogHeader>
      
      <CatalogContent>
        {/* Panel de Familias */}
        <FamiliesPanel>
          <div style={{ padding: '12px 16px 8px 16px' }}>
            <h4 style={{ 
              margin: 0, 
              fontSize: '10px', 
              fontWeight: 600, 
              color: '#64748b', 
              textTransform: 'uppercase',
              letterSpacing: '0.5px'
            }}>
              Familias
            </h4>
          </div>
          
          {loading ? (
            <LoadingContainer>
              <Loader2 size={12} className="animate-spin" />
              Cargando...
            </LoadingContainer>
          ) : (
            <FamiliesList>
              {families.map((family) => (
                <FamilyItem
                  key={family.id}
                  active={selectedFamily?.id === family.id}
                  onClick={() => handleFamilySelect(family)}
                >
                  <FamilyIcon active={selectedFamily?.id === family.id}>
                    <Tags size={12} />
                  </FamilyIcon>
                  <div>
                    <div>{family.nombre}</div>
                  </div>
                </FamilyItem>
              ))}
            </FamiliesList>
          )}
        </FamiliesPanel>

        {/* Contenido principal */}
        <MainContent>
          {/* Sección de Colecciones */}
          {selectedFamily && (
            <CollectionsSection>
              <CollectionsTitle>
                Colecciones de {selectedFamily.nombre}
              </CollectionsTitle>
              
              {loading ? (
                <LoadingContainer>
                  <Loader2 size={12} className="animate-spin" />
                  Cargando...
                </LoadingContainer>
              ) : collections.length > 0 ? (
                <CollectionsGrid>
                  {collections.map((collection) => (
                    <CollectionCard
                      key={collection.id}
                      active={selectedCollection?.id === collection.id}
                      onClick={() => handleCollectionSelect(collection)}
                    >
                      {collection.nombre}
                    </CollectionCard>
                  ))}
                </CollectionsGrid>
              ) : (
                <EmptyState>
                  <Grid3X3 size={16} style={{ marginBottom: '4px' }} />
                  <p style={{ margin: 0, fontSize: '10px' }}>
                    No hay colecciones
                  </p>
                </EmptyState>
              )}
            </CollectionsSection>
          )}

          {/* Sección de Productos */}
          <ProductsSection>
            {!selectedFamily ? (
              <EmptyState>
                <ShoppingBag size={24} style={{ marginBottom: '8px', opacity: 0.5 }} />
                <h4 style={{ margin: '0 0 4px 0', color: '#1e293b', fontSize: '12px' }}>Selecciona una familia</h4>
                <p style={{ margin: 0, fontSize: '10px' }}>
                  Elige una familia para ver productos
                </p>
              </EmptyState>
            ) : !selectedCollection ? (
              <EmptyState>
                <Package size={24} style={{ marginBottom: '8px', opacity: 0.5 }} />
                <h4 style={{ margin: '0 0 4px 0', color: '#1e293b', fontSize: '12px' }}>Selecciona una colección</h4>
                <p style={{ margin: 0, fontSize: '10px' }}>
                  Elige una colección para ver productos
                </p>
              </EmptyState>
            ) : loadingProducts ? (
              <LoadingContainer>
                <Loader2 size={16} className="animate-spin" />
                Cargando productos...
              </LoadingContainer>
            ) : products.length > 0 ? (
              <ProductsGrid>
                {products.slice(0, 6).map((product) => (
                  <ProductCard key={product.id}>
                    <ProductImage image={product.imagen_web}>
                      {!product.imagen_web && <Package size={16} />}
                    </ProductImage>
                    <ProductName>{product.nombre}</ProductName>
                    <ProductCode>Código: {product.codigo}</ProductCode>
                  </ProductCard>
                ))}
              </ProductsGrid>
            ) : (
              <EmptyState>
                <Search size={24} style={{ marginBottom: '8px', opacity: 0.5 }} />
                <h4 style={{ margin: '0 0 4px 0', color: '#1e293b', fontSize: '12px' }}>No hay productos</h4>
                <p style={{ margin: 0, fontSize: '10px' }}>
                  No se encontraron productos
                </p>
              </EmptyState>
            )}
          </ProductsSection>
        </MainContent>
      </CatalogContent>
    </CatalogSectionContainer>
  );
};

export default CatalogSection; 