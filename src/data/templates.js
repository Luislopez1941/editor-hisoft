// Plantillas predefinidas para el editor
export const templates = {
  business: {
    id: 'business',
    name: 'Negocio Profesional',
    elements: [
      // Header Sticky
      {
        type: 'section',
        styles: {
          background: '#fff',
          padding: '0',
          borderBottom: '1px solid #e5e7eb',
          position: 'sticky',
          top: '0',
          zIndex: 100,
          boxShadow: '0 2px 8px rgba(0,0,0,0.04)',
        },
        children: [
          {
            type: 'container',
            styles: {
              maxWidth: '1200px',
              margin: '0 auto',
              padding: '20px 32px',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'space-between',
            },
            children: [
              {
                type: 'heading',
                props: { content: 'MiNegocio', level: 2 },
                styles: {
                  fontSize: '28px',
                  fontWeight: '700',
                  color: '#2563eb',
                  margin: '0',
                  fontFamily: 'Inter, sans-serif',
                  letterSpacing: '1px',
                }
              },
              {
                type: 'container',
                styles: {
                  display: 'flex',
                  gap: '32px',
                  alignItems: 'center',
                },
                children: [
                  {
                    type: 'text',
                    props: { content: 'Inicio' },
                    styles: { color: '#22223b', fontWeight: '500', fontSize: '16px', cursor: 'pointer' }
                  },
                  {
                    type: 'text',
                    props: { content: 'Servicios' },
                    styles: { color: '#22223b', fontWeight: '500', fontSize: '16px', cursor: 'pointer' }
                  },
                  {
                    type: 'text',
                    props: { content: 'Equipo' },
                    styles: { color: '#22223b', fontWeight: '500', fontSize: '16px', cursor: 'pointer' }
                  },
                  {
                    type: 'text',
                    props: { content: 'Contacto' },
                    styles: { color: '#22223b', fontWeight: '500', fontSize: '16px', cursor: 'pointer' }
                  },
                  {
                    type: 'button',
                    props: { text: 'Contáctanos', variant: 'primary' },
                    styles: {
                      background: '#2563eb',
                      color: '#fff',
                      borderRadius: '8px',
                      fontWeight: '600',
                      fontSize: '16px',
                      padding: '10px 28px',
                      border: 'none',
                      boxShadow: '0 2px 8px rgba(61,133,198,0.10)',
                      cursor: 'pointer',
                    }
                  }
                ]
              }
            ]
          }
        ]
      },
      // Hero
      {
        type: 'section',
        styles: {
          background: 'linear-gradient(120deg, #e0e7ef 60%, #fff 100%)',
          padding: '80px 0 64px 0',
        },
        children: [
          {
            type: 'container',
            styles: {
              maxWidth: '1200px',
              margin: '0 auto',
              padding: '0 32px',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'space-between',
              gap: '48px',
              flexWrap: 'wrap',
            },
            children: [
              {
                type: 'container',
                styles: { flex: '1 1 400px', minWidth: '320px' },
                children: [
                  {
                    type: 'heading',
                    props: { content: 'Impulsa tu negocio con tecnología', level: 1 },
                    styles: {
                      fontSize: '44px',
                      fontWeight: '800',
                      color: '#22223b',
                      marginBottom: '18px',
                      fontFamily: 'Inter, sans-serif',
                      lineHeight: '1.1',
                    }
                  },
                  {
                    type: 'text',
                    props: { content: 'Soluciones digitales, marketing y soporte para empresas modernas.' },
                    styles: {
                      fontSize: '20px',
                      color: '#6b7280',
                      marginBottom: '32px',
                      fontFamily: 'Inter, sans-serif',
                    }
                  },
                  {
                    type: 'button',
                    props: { text: 'Ver servicios', variant: 'primary' },
                    styles: {
                      background: '#2563eb',
                      color: '#fff',
                      borderRadius: '8px',
                      fontWeight: '600',
                      fontSize: '18px',
                      padding: '14px 40px',
                      border: 'none',
                      boxShadow: '0 2px 8px rgba(61,133,198,0.10)',
                      cursor: 'pointer',
                    }
                  }
                ]
              },
              {
                type: 'container',
                styles: { flex: '1 1 320px', minWidth: '280px', display: 'flex', alignItems: 'center', justifyContent: 'center' },
                children: [
                  {
                    type: 'image',
                    props: { src: 'https://images.unsplash.com/photo-1506744038136-46273834b3fb?auto=format&fit=crop&w=600&q=80', alt: 'Hero' },
                    styles: {
                      width: '340px',
                      height: '340px',
                      borderRadius: '24px',
                      boxShadow: '0 8px 32px rgba(61,133,198,0.10)',
                      objectFit: 'cover',
                    }
                  }
                ]
              }
            ]
          }
        ]
      },
      // Servicios
      {
        type: 'section',
        styles: {
          background: '#fff',
          padding: '72px 0',
        },
        children: [
          {
            type: 'container',
            styles: {
              maxWidth: '1100px',
              margin: '0 auto',
              padding: '0 32px',
            },
            children: [
              {
                type: 'heading',
                props: { content: 'Nuestros Servicios', level: 2 },
                styles: {
                  fontSize: '32px',
                  fontWeight: '700',
                  color: '#22223b',
                  marginBottom: '40px',
                  textAlign: 'center',
                  fontFamily: 'Inter, sans-serif',
                }
              },
              {
                type: 'columns',
                props: { columns: 3, gap: '32px' },
                styles: {},
                children: [
                  {
                    type: 'card',
                    props: { title: 'Desarrollo Web', content: 'Sitios modernos, responsivos y optimizados.' },
                    styles: {
                      background: '#f8fafc',
                      borderRadius: '16px',
                      boxShadow: '0 2px 8px rgba(61,133,198,0.06)',
                      padding: '40px',
                      textAlign: 'center',
                    }
                  },
                  {
                    type: 'card',
                    props: { title: 'Marketing Digital', content: 'Estrategias para crecer tu presencia online.' },
                    styles: {
                      background: '#f8fafc',
                      borderRadius: '16px',
                      boxShadow: '0 2px 8px rgba(61,133,198,0.06)',
                      padding: '40px',
                      textAlign: 'center',
                    }
                  },
                  {
                    type: 'card',
                    props: { title: 'Soporte y Consultoría', content: 'Acompañamiento experto para tu empresa.' },
                    styles: {
                      background: '#f8fafc',
                      borderRadius: '16px',
                      boxShadow: '0 2px 8px rgba(61,133,198,0.06)',
                      padding: '40px',
                      textAlign: 'center',
                    }
                  }
                ]
              }
            ]
          }
        ]
      },
      // Equipo
      {
        type: 'section',
        styles: {
          background: '#f8f9fa',
          padding: '72px 0',
        },
        children: [
          {
            type: 'container',
            styles: {
              maxWidth: '1100px',
              margin: '0 auto',
              padding: '0 32px',
            },
            children: [
              {
                type: 'heading',
                props: { content: 'Nuestro Equipo', level: 2 },
                styles: {
                  fontSize: '32px',
                  fontWeight: '700',
                  color: '#22223b',
                  marginBottom: '40px',
                  textAlign: 'center',
                  fontFamily: 'Inter, sans-serif',
                }
              },
              {
                type: 'columns',
                props: { columns: 3, gap: '32px' },
                styles: {},
                children: [
                  {
                    type: 'card',
                    props: { title: 'Ana López', content: 'CEO & Fundadora' },
                    styles: {
                      background: '#fff',
                      borderRadius: '16px',
                      boxShadow: '0 2px 8px rgba(61,133,198,0.06)',
                      padding: '40px',
                      textAlign: 'center',
                    }
                  },
                  {
                    type: 'card',
                    props: { title: 'Carlos Pérez', content: 'Desarrollador Web' },
                    styles: {
                      background: '#fff',
                      borderRadius: '16px',
                      boxShadow: '0 2px 8px rgba(61,133,198,0.06)',
                      padding: '40px',
                      textAlign: 'center',
                    }
                  },
                  {
                    type: 'card',
                    props: { title: 'Laura Gómez', content: 'Marketing Digital' },
                    styles: {
                      background: '#fff',
                      borderRadius: '16px',
                      boxShadow: '0 2px 8px rgba(61,133,198,0.06)',
                      padding: '40px',
                      textAlign: 'center',
                    }
                  }
                ]
              }
            ]
          }
        ]
      },
      // Contacto
      {
        type: 'section',
        styles: {
          background: '#fff',
          padding: '72px 0',
        },
        children: [
          {
            type: 'container',
            styles: {
              maxWidth: '700px',
              margin: '0 auto',
              padding: '0 32px',
              background: '#f8fafc',
              borderRadius: '16px',
              boxShadow: '0 2px 8px rgba(61,133,198,0.06)',
            },
            children: [
              {
                type: 'heading',
                props: { content: 'Contáctanos', level: 2 },
                styles: {
                  fontSize: '28px',
                  fontWeight: '700',
                  color: '#22223b',
                  marginBottom: '24px',
                  textAlign: 'center',
                  fontFamily: 'Inter, sans-serif',
                }
              },
              {
                type: 'text',
                props: { content: '¿Tienes dudas o quieres una propuesta? ¡Escríbenos!' },
                styles: {
                  fontSize: '16px',
                  color: '#6b7280',
                  marginBottom: '32px',
                  textAlign: 'center',
                  fontFamily: 'Inter, sans-serif',
                }
              },
              // Formulario simple (solo visual)
              {
                type: 'container',
                styles: { display: 'flex', flexDirection: 'column', gap: '16px', alignItems: 'center' },
                children: [
                  {
                    type: 'text',
                    props: { content: 'Nombre' },
                    styles: { color: '#22223b', fontWeight: '500', fontSize: '15px', alignSelf: 'flex-start' }
                  },
                  {
                    type: 'text',
                    props: { content: 'Email' },
                    styles: { color: '#22223b', fontWeight: '500', fontSize: '15px', alignSelf: 'flex-start' }
                  },
                  {
                    type: 'text',
                    props: { content: 'Mensaje' },
                    styles: { color: '#22223b', fontWeight: '500', fontSize: '15px', alignSelf: 'flex-start' }
                  },
                  {
                    type: 'button',
                    props: { text: 'Enviar', variant: 'primary' },
                    styles: {
                      background: '#2563eb',
                      color: '#fff',
                      borderRadius: '8px',
                      fontWeight: '600',
                      fontSize: '16px',
                      padding: '12px 32px',
                      border: 'none',
                      boxShadow: '0 2px 8px rgba(61,133,198,0.10)',
                      cursor: 'pointer',
                      marginTop: '12px',
                    }
                  }
                ]
              }
            ]
          }
        ]
      },
      // Footer
      {
        type: 'section',
        styles: {
          background: '#22223b',
          padding: '32px 0',
        },
        children: [
          {
            type: 'container',
            styles: {
              maxWidth: '1100px',
              margin: '0 auto',
              padding: '0 32px',
              textAlign: 'center',
            },
            children: [
              {
                type: 'text',
                props: { content: '© 2024 MiNegocio. Todos los derechos reservados.' },
                styles: {
                  color: '#fff',
                  fontSize: '16px',
                  fontFamily: 'Inter, sans-serif',
                }
              }
            ]
          }
        ]
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