// Catalog Functionality Script
function initCatalog(catalogId) {
  let selectedFamilia = 0;
  let selectedCollection = 0;
  let currentPage = 1;
  let searchTerm = '';
  let searchType = 0;
  
  // Event listeners
  document.addEventListener('DOMContentLoaded', function() {
    // Familia search
    const familiaSearch = document.getElementById(catalogId + '-familia-search');
    if (familiaSearch) {
      familiaSearch.addEventListener('input', function(e) {
        const searchTerm = e.target.value.toLowerCase();
        const familiaItems = document.querySelectorAll('#' + catalogId + '-families .productCatalog-familia-item');
        familiaItems.forEach(item => {
          const text = item.textContent.toLowerCase();
          item.style.display = text.includes(searchTerm) ? 'block' : 'none';
        });
      });
    }
    
    // Product search
    const productSearch = document.getElementById(catalogId + '-product-search');
    if (productSearch) {
      productSearch.addEventListener('input', function(e) {
        searchTerm = e.target.value;
        filterProducts();
      });
    }
    
    // Search type
    const searchTypeSelect = document.getElementById(catalogId + '-search-type');
    if (searchTypeSelect) {
      searchTypeSelect.addEventListener('change', function(e) {
        searchType = parseInt(e.target.value);
        filterProducts();
      });
    }
    
    // Familia clicks
    const familiaItems = document.querySelectorAll('#' + catalogId + '-families .productCatalog-familia-item');
    familiaItems.forEach(item => {
      item.addEventListener('click', function() {
        const familiaId = parseInt(this.getAttribute('data-familia-id'));
        selectFamilia(familiaId);
      });
    });
    
    // Collection clicks
    const collectionButtons = document.querySelectorAll('#' + catalogId + '-collections .productCatalog-collection-btn');
    collectionButtons.forEach(button => {
      button.addEventListener('click', function() {
        const collectionId = parseInt(this.getAttribute('data-collection-id'));
        selectCollection(collectionId);
      });
    });
    
    // Product clicks
    const productItems = document.querySelectorAll('#' + catalogId + '-products-grid .item');
    productItems.forEach(item => {
      item.addEventListener('click', function() {
        const productId = this.getAttribute('data-product-id');
        console.log('Product selected:', productId);
      });
    });
    
    // Pagination
    const prevBtn = document.getElementById(catalogId + '-prev-btn');
    const nextBtn = document.getElementById(catalogId + '-next-btn');
    
    if (prevBtn) {
      prevBtn.addEventListener('click', function() {
        if (currentPage > 1) {
          currentPage--;
          updatePagination();
        }
      });
    }
    
    if (nextBtn) {
      nextBtn.addEventListener('click', function() {
        currentPage++;
        updatePagination();
      });
    }
  });
  
  function selectFamilia(familiaId) {
    selectedFamilia = familiaId;
    currentPage = 1;
    
    // Update UI
    const familiaItems = document.querySelectorAll('#' + catalogId + '-families .productCatalog-familia-item');
    familiaItems.forEach(item => {
      const itemId = parseInt(item.getAttribute('data-familia-id'));
      if (itemId === familiaId) {
        item.classList.add('active');
        item.style.backgroundColor = '#e0241b';
        item.style.color = 'white';
      } else {
        item.classList.remove('active');
        item.style.backgroundColor = 'transparent';
        item.style.color = '#374151';
      }
    });
    
    filterProducts();
  }
  
  function selectCollection(collectionId) {
    selectedCollection = collectionId;
    currentPage = 1;
    
    // Update UI
    const collectionButtons = document.querySelectorAll('#' + catalogId + '-collections .productCatalog-collection-btn');
    collectionButtons.forEach(button => {
      const buttonId = parseInt(button.getAttribute('data-collection-id'));
      if (buttonId === collectionId) {
        button.classList.add('active');
        button.style.backgroundColor = '#e0241b';
        button.style.color = 'white';
      } else {
        button.classList.remove('active');
        button.style.backgroundColor = '#f3f4f6';
        button.style.color = '#374151';
      }
    });
    
    filterProducts();
  }
  
  function filterProducts() {
    // Update products count
    const countElement = document.getElementById(catalogId + '-products-count');
    if (countElement) {
      countElement.textContent = '6 productos encontrados';
    }
  }
  
  function updatePagination() {
    const pageInfo = document.getElementById(catalogId + '-page-info');
    const prevBtn = document.getElementById(catalogId + '-prev-btn');
    const nextBtn = document.getElementById(catalogId + '-next-btn');
    
    if (pageInfo) pageInfo.textContent = 'Página ' + currentPage;
    if (prevBtn) prevBtn.disabled = currentPage <= 1;
    if (nextBtn) nextBtn.disabled = false;
  }
}

// Export for use in other files
if (typeof module !== 'undefined' && module.exports) {
  module.exports = { initCatalog };
}