// Plantillas predefinidas para el editor
export const templates = {
  business: {
    id: 'business',
    name: 'Negocio Profesional',
    elements: [
      // Header
      {
        id: 'header-business',
        type: 'header',
        x: 0,
        y: 0,
        width: 1200,
        height: 80,
        style: {
          backgroundColor: '#1e334d',
          color: '#ffffff',
          padding: '20px',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'space-between'
        },
        content: 'Mi Empresa'
      },
      // Hero Section
      {
        id: 'hero-business',
        type: 'section',
        x: 0,
        y: 80,
        width: 1200,
        height: 400,
        style: {
          backgroundColor: '#f8f9fa',
          backgroundImage: 'linear-gradient(135deg, #1e334d 0%, #3D85C6 100%)',
          color: '#ffffff',
          padding: '80px 50px',
          textAlign: 'center'
        },
        content: ''
      },
      // Hero Title
      {
        id: 'hero-title',
        type: 'heading',
        x: 300,
        y: 160,
        width: 600,
        height: 80,
        style: {
          fontSize: '48px',
          fontWeight: '600',
          color: '#ffffff',
          textAlign: 'center',
          margin: '0'
        },
        content: 'Soluciones Empresariales Innovadoras'
      },
      // Hero Subtitle
      {
        id: 'hero-subtitle',
        type: 'text',
        x: 300,
        y: 250,
        width: 600,
        height: 60,
        style: {
          fontSize: '18px',
          color: '#ffffff',
          textAlign: 'center',
          opacity: '0.9'
        },
        content: 'Transformamos tu negocio con tecnología de vanguardia y estrategias probadas'
      },
      // CTA Button
      {
        id: 'cta-button',
        type: 'button',
        x: 500,
        y: 320,
        width: 200,
        height: 50,
        style: {
          backgroundColor: '#ffffff',
          color: '#1e334d',
          border: 'none',
          borderRadius: '25px',
          fontSize: '16px',
          fontWeight: '600',
          cursor: 'pointer',
          boxShadow: '0 4px 12px rgba(0,0,0,0.15)'
        },
        content: 'Contáctanos'
      },
      // Services Section
      {
        id: 'services-section',
        type: 'section',
        x: 0,
        y: 480,
        width: 1200,
        height: 300,
        style: {
          backgroundColor: '#ffffff',
          padding: '60px 50px'
        },
        content: ''
      },
      // Services Title
      {
        id: 'services-title',
        type: 'heading',
        x: 400,
        y: 520,
        width: 400,
        height: 60,
        style: {
          fontSize: '36px',
          fontWeight: '600',
          color: '#1e334d',
          textAlign: 'center'
        },
        content: 'Nuestros Servicios'
      },
      // Service 1
      {
        id: 'service-1',
        type: 'card',
        x: 100,
        y: 600,
        width: 300,
        height: 120,
        style: {
          backgroundColor: '#f8f9fa',
          border: '1px solid #e1e8ed',
          borderRadius: '8px',
          padding: '20px',
          textAlign: 'center'
        },
        content: 'Consultoría Estratégica'
      },
      // Service 2
      {
        id: 'service-2',
        type: 'card',
        x: 450,
        y: 600,
        width: 300,
        height: 120,
        style: {
          backgroundColor: '#f8f9fa',
          border: '1px solid #e1e8ed',
          borderRadius: '8px',
          padding: '20px',
          textAlign: 'center'
        },
        content: 'Desarrollo Tecnológico'
      },
      // Service 3
      {
        id: 'service-3',
        type: 'card',
        x: 800,
        y: 600,
        width: 300,
        height: 120,
        style: {
          backgroundColor: '#f8f9fa',
          border: '1px solid #e1e8ed',
          borderRadius: '8px',
          padding: '20px',
          textAlign: 'center'
        },
        content: 'Soporte 24/7'
      }
    ]
  },

  blog: {
    id: 'blog',
    name: 'Blog Personal',
    elements: [
      // Header
      {
        id: 'header-blog',
        type: 'header',
        x: 0,
        y: 0,
        width: 1200,
        height: 100,
        style: {
          backgroundColor: '#ffffff',
          borderBottom: '1px solid #e1e8ed',
          padding: '20px 50px',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'space-between'
        },
        content: 'Mi Blog'
      },
      // Blog Title
      {
        id: 'blog-title',
        type: 'heading',
        x: 400,
        y: 150,
        width: 400,
        height: 80,
        style: {
          fontSize: '42px',
          fontWeight: '700',
          color: '#1e334d',
          textAlign: 'center'
        },
        content: 'Reflexiones y Experiencias'
      },
      // Blog Subtitle
      {
        id: 'blog-subtitle',
        type: 'text',
        x: 300,
        y: 240,
        width: 600,
        height: 40,
        style: {
          fontSize: '16px',
          color: '#6b7280',
          textAlign: 'center'
        },
        content: 'Un espacio para compartir ideas, aprendizajes y perspectivas únicas'
      },
      // Featured Post
      {
        id: 'featured-post',
        type: 'card',
        x: 200,
        y: 320,
        width: 800,
        height: 200,
        style: {
          backgroundColor: '#ffffff',
          border: '1px solid #e1e8ed',
          borderRadius: '12px',
          padding: '30px',
          boxShadow: '0 4px 12px rgba(0,0,0,0.1)'
        },
        content: 'Artículo Destacado'
      },
      // Post Title
      {
        id: 'post-title',
        type: 'heading',
        x: 230,
        y: 360,
        width: 600,
        height: 50,
        style: {
          fontSize: '24px',
          fontWeight: '600',
          color: '#1e334d'
        },
        content: 'Cómo la Tecnología Está Transformando Nuestras Vidas'
      },
      // Post Excerpt
      {
        id: 'post-excerpt',
        type: 'text',
        x: 230,
        y: 420,
        width: 600,
        height: 60,
        style: {
          fontSize: '14px',
          color: '#6b7280',
          lineHeight: '1.6'
        },
        content: 'Exploramos los cambios más significativos que la tecnología ha traído a nuestra sociedad y cómo podemos adaptarnos mejor a estos cambios...'
      },
      // Recent Posts Section
      {
        id: 'recent-posts',
        type: 'section',
        x: 0,
        y: 560,
        width: 1200,
        height: 250,
        style: {
          backgroundColor: '#f8f9fa',
          padding: '40px 50px'
        },
        content: ''
      },
      // Recent Posts Title
      {
        id: 'recent-title',
        type: 'heading',
        x: 500,
        y: 580,
        width: 200,
        height: 40,
        style: {
          fontSize: '28px',
          fontWeight: '600',
          color: '#1e334d',
          textAlign: 'center'
        },
        content: 'Últimos Posts'
      }
    ]
  },

  ecommerce: {
    id: 'ecommerce',
    name: 'Tienda Online',
    elements: [
      // Header
      {
        id: 'header-ecommerce',
        type: 'header',
        x: 0,
        y: 0,
        width: 1200,
        height: 80,
        style: {
          backgroundColor: '#ffffff',
          borderBottom: '1px solid #e1e8ed',
          padding: '15px 50px',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'space-between'
        },
        content: 'Mi Tienda'
      },
      // Navigation
      {
        id: 'nav-ecommerce',
        type: 'navigation',
        x: 400,
        y: 20,
        width: 400,
        height: 40,
        style: {
          display: 'flex',
          gap: '30px',
          alignItems: 'center',
          justifyContent: 'center'
        },
        content: 'Inicio | Productos | Ofertas | Contacto'
      },
      // Banner promocional
      {
        id: 'promo-banner',
        type: 'section',
        x: 0,
        y: 80,
        width: 1200,
        height: 300,
        style: {
          backgroundColor: '#3D85C6',
          backgroundImage: 'linear-gradient(135deg, #3D85C6 0%, #1e334d 100%)',
          color: '#ffffff',
          padding: '60px 50px',
          textAlign: 'center'
        },
        content: ''
      },
      // Promo Title
      {
        id: 'promo-title',
        type: 'heading',
        x: 300,
        y: 140,
        width: 600,
        height: 60,
        style: {
          fontSize: '40px',
          fontWeight: '700',
          color: '#ffffff',
          textAlign: 'center'
        },
        content: '¡Gran Oferta de Temporada!'
      },
      // Promo Subtitle
      {
        id: 'promo-subtitle',
        type: 'text',
        x: 400,
        y: 210,
        width: 400,
        height: 40,
        style: {
          fontSize: '18px',
          color: '#ffffff',
          textAlign: 'center',
          opacity: '0.9'
        },
        content: 'Hasta 50% de descuento en productos seleccionados'
      },
      // Shop Button
      {
        id: 'shop-button',
        type: 'button',
        x: 500,
        y: 260,
        width: 200,
        height: 50,
        style: {
          backgroundColor: '#ffffff',
          color: '#1e334d',
          border: 'none',
          borderRadius: '25px',
          fontSize: '16px',
          fontWeight: '600',
          cursor: 'pointer'
        },
        content: 'Comprar Ahora'
      },
      // Products Section
      {
        id: 'products-section',
        type: 'section',
        x: 0,
        y: 380,
        width: 1200,
        height: 400,
        style: {
          backgroundColor: '#ffffff',
          padding: '50px'
        },
        content: ''
      },
      // Products Title
      {
        id: 'products-title',
        type: 'heading',
        x: 450,
        y: 410,
        width: 300,
        height: 50,
        style: {
          fontSize: '32px',
          fontWeight: '600',
          color: '#1e334d',
          textAlign: 'center'
        },
        content: 'Productos Destacados'
      },
      // Product 1
      {
        id: 'product-1',
        type: 'card',
        x: 100,
        y: 480,
        width: 250,
        height: 250,
        style: {
          backgroundColor: '#ffffff',
          border: '1px solid #e1e8ed',
          borderRadius: '8px',
          padding: '20px',
          textAlign: 'center',
          boxShadow: '0 2px 8px rgba(0,0,0,0.1)'
        },
        content: 'Producto 1'
      },
      // Product 2
      {
        id: 'product-2',
        type: 'card',
        x: 475,
        y: 480,
        width: 250,
        height: 250,
        style: {
          backgroundColor: '#ffffff',
          border: '1px solid #e1e8ed',
          borderRadius: '8px',
          padding: '20px',
          textAlign: 'center',
          boxShadow: '0 2px 8px rgba(0,0,0,0.1)'
        },
        content: 'Producto 2'
      },
      // Product 3
      {
        id: 'product-3',
        type: 'card',
        x: 850,
        y: 480,
        width: 250,
        height: 250,
        style: {
          backgroundColor: '#ffffff',
          border: '1px solid #e1e8ed',
          borderRadius: '8px',
          padding: '20px',
          textAlign: 'center',
          boxShadow: '0 2px 8px rgba(0,0,0,0.1)'
        },
        content: 'Producto 3'
      }
    ]
  }
};

export default templates; 